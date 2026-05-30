// ──────────────────────────────────────────────────────────────────────
// biometric.js — Biometric data processing. Game response logic.
// The game reads biometric data and RESPONDS to it. The player's body
// becomes a game input. Most games treat you like a machine. FLAP.AI
// treats you like a person who has a heart rate, who gets nervous.
// ──────────────────────────────────────────────────────────────────────

import { CFG } from './physics.js';
import { speakImmediate, queueEvent } from './narrator.js';

// ── Biometric State ───────────────────────────────────────────────────
let currentBPM = 0;
let currentGSR = 0;
let currentHRV = 0;

// Rolling averages to smooth noisy sensor data
let bpmHistory = [];
let gsrHistory = [];
const HISTORY_SIZE = 8; // Rolling window of 8 readings

// Session tracking
let sessionPeakBPM = 0;
let flowStateDuration = 0;    // Frames spent in 60-100 BPM zone
let lastGSR = 0;
let gsrSpikeActive = false;
let gsrSpikeFrames = 0;

// Game modification outputs
let pipeSpeedMod = 1.0;
let gravityMod = 1.0;
let gapMod = 0;

/**
 * Process incoming biometric data from IoT.
 * @param {object} data - { bpm: int, gsr: float, hrv: int }
 */
export function processBiometric(data) {
  // Reject impossible values (noise from pulse sensor)
  if (data.bpm !== undefined && data.bpm >= 40 && data.bpm <= 200) {
    bpmHistory.push(data.bpm);
    if (bpmHistory.length > HISTORY_SIZE) bpmHistory.shift();
    currentBPM = Math.round(bpmHistory.reduce((a, b) => a + b, 0) / bpmHistory.length);

    // Track session peak
    if (currentBPM > sessionPeakBPM) sessionPeakBPM = currentBPM;
  }

  if (data.gsr !== undefined) {
    gsrHistory.push(data.gsr);
    if (gsrHistory.length > HISTORY_SIZE) gsrHistory.shift();
    currentGSR = gsrHistory.reduce((a, b) => a + b, 0) / gsrHistory.length;

    // GSR spike detection: sudden stress event (delta > 0.3 in ~500ms)
    const gsrDelta = Math.abs(currentGSR - lastGSR);
    if (gsrDelta > 0.3 && !gsrSpikeActive) {
      gsrSpikeActive = true;
      gsrSpikeFrames = CFG.IOT_GSR_DURATION; // 3 seconds of mercy
      speakImmediate('Something just spiked. The pipes noticed too.');
    }
    lastGSR = currentGSR;
  }

  if (data.hrv !== undefined) {
    currentHRV = data.hrv;
  }

  // Update game modifications based on heart rate zones
  updateGameMods();
}

/**
 * Update per frame (called from game loop).
 * Handles time-limited effects like GSR spike gravity reduction.
 */
export function updateBiometricFrame() {
  // Track flow state (60-100 BPM zone)
  if (currentBPM >= 60 && currentBPM <= 100) {
    flowStateDuration++;
  }

  // GSR spike gravity effect countdown
  if (gsrSpikeActive) {
    gsrSpikeFrames--;
    if (gsrSpikeFrames <= 0) {
      gsrSpikeActive = false;
      gravityMod = 1.0;
    }
  }
}

/**
 * Apply game modifications based on current biometric state.
 */
function updateGameMods() {
  // BPM < 60: too calm / resting → speed up pipes
  if (currentBPM > 0 && currentBPM < 60) {
    pipeSpeedMod = CFG.IOT_LOW_BPM_SPEED; // 1.15x
    gapMod = 0;
  }
  // BPM 60-100: ideal focus zone → no adjustment
  else if (currentBPM >= 60 && currentBPM <= 100) {
    pipeSpeedMod = 1.0;
    gapMod = 0;
  }
  // BPM 100-120: elevated → widen gaps slightly
  else if (currentBPM > 100 && currentBPM <= 120) {
    pipeSpeedMod = 1.0;
    gapMod = CFG.IOT_GAP_WIDEN; // +6px
  }
  // BPM > 120: high stress → slow pipes, give room to breathe
  else if (currentBPM > 120) {
    pipeSpeedMod = CFG.IOT_HIGH_BPM_SPEED; // 0.85x
    gapMod = CFG.IOT_GAP_WIDEN;
  }

  // GSR spike → reduce gravity temporarily
  if (gsrSpikeActive) {
    gravityMod = CFG.IOT_GSR_GRAVITY; // 0.9x
  }
}

/**
 * Get current biometric data for display.
 */
export function getBiometricData() {
  return {
    bpm: currentBPM,
    gsr: currentGSR,
    hrv: currentHRV,
  };
}

/**
 * Get session biometric summary (for game over screen).
 */
export function getSessionSummary() {
  return {
    peakBPM: sessionPeakBPM,
    avgGSR: currentGSR,
    flowStateSeconds: Math.round(flowStateDuration / 60),
    stressLevel: currentGSR > 0.7 ? 'intense' : currentGSR > 0.4 ? 'moderate' : 'calm',
  };
}

/**
 * Get current game modifiers.
 */
export function getGameMods() {
  return {
    pipeSpeedMod,
    gravityMod,
    gapMod,
  };
}

/**
 * Reset biometric state for a new game session.
 */
export function resetBiometricSession() {
  sessionPeakBPM = 0;
  flowStateDuration = 0;
  gsrSpikeActive = false;
  gsrSpikeFrames = 0;
  pipeSpeedMod = 1.0;
  gravityMod = 1.0;
  gapMod = 0;
}

/**
 * Check if biometric data is available (any readings received).
 */
export function hasBiometricData() {
  return bpmHistory.length > 0;
}
