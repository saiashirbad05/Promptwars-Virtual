// ──────────────────────────────────────────────────────────────────────
// narrator.js — Event queue. Voice output. Tone management.
// The Narrator watches you play and has honest reactions.
// Primary: Web SpeechSynthesis. Fallback text displayed on screen.
// Never interrupts itself. Events queued, skip old if 3+ backlogged.
// ──────────────────────────────────────────────────────────────────────

import { generateNarratorLine, isGeminiAvailable } from './gemini.js';

// ── Fallback Lines ────────────────────────────────────────────────────
// Used when Gemini is unavailable or too slow.
const FALLBACK_LINES = {
  game_start:  "Let's see where Faby goes today.",
  first_pipe:  'Good. One down. The pipes get no easier.',
  near_miss:   'That was close. Dangerously close.',
  streak_10:   "Okay. You've found your rhythm.",
  streak_20:   'This is something else.',
  first_death: 'That happens. The ground is unforgiving.',
  third_death: 'Three times. The pipes are not changing. You are.',
  new_best:    "That's your best. Remember how that felt.",
  iot_alert:   'Your heart rate just jumped. Take a breath if you need one.',
};

// ── State ─────────────────────────────────────────────────────────────
let eventQueue = [];
let isSpeaking = false;
let currentUtterance = null;
let subtitleMode = false;   // Activated when ambient noise > 70dB
let muted = false;
let lastSubtitle = '';
let subtitleTimer = null;

// Callbacks for subtitle display
let onSubtitle = null;

/**
 * Set subtitle callback (renderer will use this to show text on screen).
 */
export function setSubtitleCallback(cb) {
  onSubtitle = cb;
}

/**
 * Get current subtitle text (for rendering).
 */
export function getSubtitle() {
  return lastSubtitle;
}

/**
 * Mute/unmute the narrator.
 */
export function setMuted(m) {
  muted = m;
  if (m && currentUtterance) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }
}

/**
 * Enable/disable subtitle-only mode (for noisy environments).
 */
export function setSubtitleMode(enabled) {
  subtitleMode = enabled;
}

/**
 * Queue a narrator event. Events are processed in order.
 * If 3+ events are waiting, only the newest survives.
 */
export function queueEvent(eventType, context = {}) {
  eventQueue.push({ eventType, context, timestamp: Date.now() });

  // If too many events queued, keep only the newest
  if (eventQueue.length > 3) {
    eventQueue = [eventQueue[eventQueue.length - 1]];
  }

  processQueue();
}

/**
 * Force-speak immediately (for IoT alerts that bypass the queue).
 */
export function speakImmediate(text) {
  if (muted) return;

  // Cancel current speech
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  speak(text);
}

/**
 * Process the event queue.
 */
async function processQueue() {
  if (isSpeaking || eventQueue.length === 0 || muted) return;

  const event = eventQueue.shift();
  let text = FALLBACK_LINES[event.eventType] || '';

  // Try Gemini for a unique line
  if (isGeminiAvailable()) {
    try {
      const geminiLine = await generateNarratorLine(event.eventType, event.context);
      if (geminiLine) text = geminiLine;
    } catch {
      // Use fallback — no crash, no drama
    }
  }

  if (text) {
    speak(text);
  }
}

/**
 * Speak text using Web SpeechSynthesis or show as subtitle.
 */
function speak(text) {
  // Show subtitle regardless of voice mode
  lastSubtitle = text;
  if (onSubtitle) onSubtitle(text);

  // Clear subtitle after 4 seconds
  if (subtitleTimer) clearTimeout(subtitleTimer);
  subtitleTimer = setTimeout(() => {
    lastSubtitle = '';
    if (onSubtitle) onSubtitle('');
  }, 4000);

  // If subtitle-only mode or speech not available, skip voice
  if (subtitleMode || !window.speechSynthesis) {
    isSpeaking = false;
    setTimeout(() => processQueue(), 500);
    return;
  }

  isSpeaking = true;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;    // Slightly faster — matches game energy
  utterance.pitch = 0.95;  // Slightly lower — more grounded
  utterance.volume = 0.7;  // Never louder than game sounds
  currentUtterance = utterance;

  utterance.onend = () => {
    isSpeaking = false;
    currentUtterance = null;
    processQueue(); // Process next queued event
  };

  utterance.onerror = () => {
    isSpeaking = false;
    currentUtterance = null;
    processQueue();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Clear all queued events and stop speaking (e.g., on game reset).
 */
export function clearNarrator() {
  eventQueue = [];
  lastSubtitle = '';
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
}
