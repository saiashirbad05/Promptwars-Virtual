// ──────────────────────────────────────────────────────────────────────
// input.js — Unified input handler.
// Keyboard, touch, IoT button, voice command, and face mode all
// funnel through a single triggerFlap() so the game loop stays clean.
// ──────────────────────────────────────────────────────────────────────

import { initAudio, resumeAudio } from './audio.js';

// ── Callback storage ──────────────────────────────────────────────────
let onFlap = null;           // Called on any flap input
let onTurboFlap = null;      // Called on turbo/double flap
let onShield = null;         // Called on shield activation
let onAnyInput = null;       // Called on ANY input (even during menus)

/**
 * Register input callbacks.
 */
export function setInputCallbacks({ flap, turboFlap, shield, anyInput }) {
  onFlap = flap || null;
  onTurboFlap = turboFlap || null;
  onShield = shield || null;
  onAnyInput = anyInput || null;
}

/**
 * Trigger a normal flap from any source.
 */
export function triggerFlap(forceMultiplier = 1.0) {
  // Make sure audio context is alive
  resumeAudio();
  if (onFlap) onFlap(forceMultiplier);
}

/**
 * Trigger a turbo flap (1.5x force).
 */
export function triggerTurboFlap() {
  resumeAudio();
  if (onTurboFlap) onTurboFlap();
}

/**
 * Trigger shield activation.
 */
export function triggerShield() {
  resumeAudio();
  if (onShield) onShield();
}

/**
 * Signal any input (for state transitions like title → ready).
 */
function signalAnyInput() {
  resumeAudio();
  initAudio();
  if (onAnyInput) onAnyInput();
}

// ── Keyboard ──────────────────────────────────────────────────────────
let keysDown = new Set();

function handleKeyDown(e) {
  if (keysDown.has(e.code)) return; // Prevent key repeat
  keysDown.add(e.code);

  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    signalAnyInput();
    triggerFlap();
  }
  if (e.code === 'Enter') {
    signalAnyInput();
  }
}

function handleKeyUp(e) {
  keysDown.delete(e.code);
}

// ── Touch / Click ─────────────────────────────────────────────────────
function handlePointer(e) {
  e.preventDefault();
  signalAnyInput();
  triggerFlap();
}

// ── Initialize all input listeners ────────────────────────────────────
let inputInitialized = false;

/**
 * Set up all input listeners. Call once, pass the canvas element.
 */
export function initInput(canvas) {
  if (inputInitialized) return;
  inputInitialized = true;

  // Keyboard
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Mouse click on canvas
  canvas.addEventListener('mousedown', handlePointer);

  // Touch on canvas
  canvas.addEventListener('touchstart', handlePointer, { passive: false });
}

/**
 * Clean up input listeners (rarely needed, but good practice).
 */
export function destroyInput(canvas) {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  canvas.removeEventListener('mousedown', handlePointer);
  canvas.removeEventListener('touchstart', handlePointer);
  inputInitialized = false;
}
