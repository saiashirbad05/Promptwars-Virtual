// ──────────────────────────────────────────────────────────────────────
// audio.js — Web Audio API sounds. No external audio files.
// All sounds are synthesized from oscillators and noise to keep the
// game fully self-contained. AudioContext is resumed on first gesture.
// ──────────────────────────────────────────────────────────────────────

let audioCtx = null;
let audioEnabled = false;

/**
 * Initialize the audio context. Must be called after a user gesture.
 */
export function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioEnabled = true;
  } catch (e) {
    console.warn('Web Audio API not available:', e);
    audioEnabled = false;
  }
}

/**
 * Resume audio context (required after first user gesture in modern browsers).
 */
export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Play the flap/wing sound.
 * Short (80ms) sine wave — 440Hz → 280Hz sweep. Volume 0.3.
 */
export function playFlapSound() {
  if (!audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.linearRampToValueAtTime(280, now + 0.08);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Play the death/collision sound.
 * Descending tone: 300Hz → 80Hz over 400ms. Volume 0.5.
 */
export function playDeathSound() {
  if (!audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.4);

  gain.gain.setValueAtTime(0.5, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.45);
}

/**
 * Play a score/point sound — a cheerful blip.
 */
export function playScoreSound() {
  if (!audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.linearRampToValueAtTime(900, now + 0.06);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Play a medal award jingle — ascending two-tone.
 */
export function playMedalSound() {
  if (!audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  // First note
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523, now); // C5
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.linearRampToValueAtTime(0, now + 0.15);
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(now);
  osc1.stop(now + 0.2);

  // Second note
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(659, now + 0.12); // E5
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.3, now + 0.12);
  gain2.gain.linearRampToValueAtTime(0, now + 0.3);
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.35);
}

/**
 * Play a countdown tick sound.
 */
export function playCountdownSound() {
  if (!audioEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}
