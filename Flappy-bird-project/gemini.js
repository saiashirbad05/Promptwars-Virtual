// ──────────────────────────────────────────────────────────────────────
// gemini.js — All Gemini API calls. Request queue. Rate limiter.
// Every call is wrapped in try/catch with fallback. No Gemini failure
// should ever crash the game or leave a blank screen.
// ──────────────────────────────────────────────────────────────────────

// ── Configuration ─────────────────────────────────────────────────────
let API_KEY = '';
const MODEL = 'gemini-2.0-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_RPM = 14; // Stay under 15 RPM free tier limit
const MIN_INTERVAL_MS = (60 / MAX_RPM) * 1000; // ~4.3 seconds between calls

let lastCallTime = 0;
let requestQueue = [];
let isProcessing = false;

/**
 * Set the Gemini API key. Call once on startup.
 */
export function setGeminiApiKey(key) {
  API_KEY = key;
}

/**
 * Check if Gemini is available (API key set).
 */
export function isGeminiAvailable() {
  return !!API_KEY;
}

/**
 * Internal: make a rate-limited API call to Gemini.
 */
async function callGemini(prompt, maxTokens = 300) {
  if (!API_KEY) return null;

  // Rate limiting
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }

  lastCallTime = Date.now();

  try {
    const response = await fetch(
      `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.warn('Gemini call failed:', err);
    return null;
  }
}

/**
 * Generate a world theme object from Gemini.
 * Returns a world object or null on failure.
 */
export async function generateWorld() {
  const prompt = `You are a creative game designer. Generate a unique world theme for a Flappy Bird game. Respond ONLY with a JSON object (no markdown, no code fences) in this exact format:
{
  "name": "string - poetic world name, 3-5 words",
  "sky_color": "#hex - sky background color",
  "pipe_color": "#hex - main pipe color",
  "pipe_shadow": "#hex - darker pipe outline color",
  "pipe_highlight": "#hex - lighter pipe highlight color",
  "ground_color": "#hex - ground fill color",
  "ground_stripe": "#hex - ground stripe color (slightly darker than ground_color)",
  "ground_edge": "#hex - ground top edge color",
  "cloud_color": "#hex - cloud color",
  "city_color": "#hex - city silhouette color",
  "bird_name": "string - a character name for the bird",
  "bird_lore": "string - one sentence backstory",
  "ability": "string - one special ability description",
  "chapters": ["string", "string", "string", "string", "string"],
  "mood": "string - 3 adjectives describing the world"
}

Be creative. Think of settings like: underwater ruins, space station, ancient forest, cyberpunk city, volcano, arctic ice shelf, magical library. Make colors harmonious and pleasing.`;

  const text = await callGemini(prompt, 500);
  if (!text) return null;

  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.warn('Failed to parse Gemini world:', err);
  }
  return null;
}

/**
 * Generate a post-run review from Gemini.
 * @param {object} runData - { score, deaths, nearMisses, worldName, pipeClears, biometricSummary }
 * @returns {string|null} - 2-line review text
 */
export async function generateReview(runData) {
  const prompt = `You are a poetic game narrator for FLAP.AI, a Flappy Bird game. Write a 2-line post-run review.

Run data:
- Bird name: ${runData.birdName || 'Faby'}
- World: ${runData.worldName || 'Classic Skies'}  
- Pipes cleared: ${runData.pipeClears || 0}
- Score: ${runData.score || 0}
- Near misses: ${runData.nearMisses || 0}
- Deaths this session: ${runData.deaths || 0}
${runData.peakBPM ? `- Peak heart rate: ${runData.peakBPM}bpm` : ''}

Write exactly 2 short sentences. Be specific about the numbers. Be poetic but honest. Sound like a wise friend, not a robot. No quotes around the text.`;

  return await callGemini(prompt, 100);
}

/**
 * Analyze player behavior and generate Shadow Faby guidance.
 * @param {object} playerData - { flapTimestamps, yPositions, gapMargins, reflexDelays }
 * @returns {object|null} - { adjustments: [{pipeIndex, suggestedY, flapTiming}] }
 */
export async function analyzeShadow(playerData) {
  const prompt = `You are an AI game coach analyzing a Flappy Bird player's behavior. Respond ONLY with JSON (no markdown).

Player data (last 8 seconds):
- Flap timestamps (ms): [${(playerData.flapTimestamps || []).join(',')}]
- Y-position at each pipe: [${(playerData.yPositions || []).join(',')}]
- Gap clearance margins (px from edge): [${(playerData.gapMargins || []).join(',')}]
- Reflex delays (ms from pipe appearing to flapping): [${(playerData.reflexDelays || []).join(',')}]

Analyze patterns and respond with JSON:
{
  "suggestion": "one sentence advice",
  "adjustY": number (-20 to 20, positive = fly lower, negative = fly higher),
  "adjustTiming": number (-200 to 200, ms earlier/later to flap),
  "weakness": "brief weakness description"
}`;

  const text = await callGemini(prompt, 200);
  if (!text) return null;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.warn('Failed to parse Shadow analysis:', err);
  }
  return null;
}

/**
 * Generate a narrator line for a specific game event.
 * @param {string} event - Event type
 * @param {object} context - Event-specific context data
 * @returns {string|null}
 */
export async function generateNarratorLine(event, context = {}) {
  const toneMap = {
    'game_start':  'calm, curious',
    'first_pipe':  'encouraging',
    'near_miss':   'sharp, immediate',
    'streak_10':   'genuinely impressed',
    'streak_20':   'quiet awe',
    'first_death': 'measured',
    'third_death': 'dry',
    'new_best':    'warm, human',
    'iot_alert':   'concerned but steady',
  };

  const tone = toneMap[event] || 'neutral';

  const prompt = `You are a game narrator for FLAP.AI. Tone: ${tone}.
Event: ${event}
Context: ${JSON.stringify(context)}
Write ONE short sentence (under 15 words). Be specific. Sound human, not robotic. No quotes.`;

  return await callGemini(prompt, 50);
}
