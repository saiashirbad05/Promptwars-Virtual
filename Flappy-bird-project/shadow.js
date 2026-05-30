// ──────────────────────────────────────────────────────────────────────
// shadow.js — Shadow Faby logic. Behavior generation.
// A ghost bird built from the player's own mistakes.
// She does not copy your strengths — she corrects your specific errors.
// ──────────────────────────────────────────────────────────────────────

import { CFG, createBird, updateBird, flapBird, clamp } from './physics.js';
import { analyzeShadow, isGeminiAvailable } from './gemini.js';

// ── Shadow State ──────────────────────────────────────────────────────
let shadowBird = null;
let shadowMode = 'mentor'; // 'mentor' | 'rival' | 'ghost'
let shadowEnabled = false;

// Player behavior data collection
let playerData = {
  flapTimestamps: [],
  yPositions: [],
  gapMargins: [],
  reflexDelays: [],
};

let lastAnalysisTime = 0;
const ANALYSIS_INTERVAL = 8000; // 8 seconds between Gemini analyses

// AI adjustments from Gemini
let adjustY = 0;
let adjustTiming = 0;

// Ghost mode replay
let ghostReplay = [];
let ghostReplayIndex = 0;
let bestRunData = [];

/**
 * Initialize Shadow Faby.
 */
export function initShadow(mode = 'mentor') {
  shadowMode = mode;
  shadowEnabled = true;
  shadowBird = createBird();
  shadowBird.x = CFG.BIRD_X + 40; // 40px ahead
  resetPlayerData();
}

/**
 * Disable Shadow Faby.
 */
export function disableShadow() {
  shadowEnabled = false;
  shadowBird = null;
}

/**
 * Get Shadow Faby state (for rendering).
 */
export function getShadowBird() {
  return shadowEnabled ? shadowBird : null;
}

/**
 * Get current shadow mode.
 */
export function getShadowMode() {
  return shadowMode;
}

/**
 * Set shadow mode.
 */
export function setShadowMode(mode) {
  shadowMode = mode;
}

/**
 * Record a player flap event (for behavior analysis).
 */
export function recordPlayerFlap(timestamp, birdY) {
  if (!shadowEnabled) return;
  playerData.flapTimestamps.push(timestamp);
  // Keep last 20 data points
  if (playerData.flapTimestamps.length > 20) {
    playerData.flapTimestamps.shift();
  }
}

/**
 * Record player Y-position at a pipe center (for gap analysis).
 */
export function recordPlayerPipePass(birdY, gapTop, gapBottom) {
  if (!shadowEnabled) return;
  const gapCenter = (gapTop + gapBottom) / 2;
  const margin = Math.min(birdY - gapTop, gapBottom - birdY);
  playerData.yPositions.push(birdY);
  playerData.gapMargins.push(Math.round(margin));
  // Keep last 20
  if (playerData.yPositions.length > 20) playerData.yPositions.shift();
  if (playerData.gapMargins.length > 20) playerData.gapMargins.shift();
}

/**
 * Update Shadow Faby each frame.
 */
export function updateShadow(pipes, playerBird, pipeClears, dt) {
  if (!shadowEnabled || !shadowBird) return;

  const now = Date.now();

  // Request Gemini analysis every 8 seconds
  if (now - lastAnalysisTime > ANALYSIS_INTERVAL && isGeminiAvailable()) {
    lastAnalysisTime = now;
    requestAnalysis();
  }

  if (shadowMode === 'ghost') {
    updateGhostMode(dt);
  } else {
    updateAIMode(pipes, playerBird, dt);
  }
}

/**
 * Update Shadow in mentor/rival mode using AI adjustments.
 */
function updateAIMode(pipes, playerBird, dt) {
  if (!shadowBird) return;

  // Find the next pipe ahead
  let targetPipe = null;
  for (const pipe of pipes) {
    if (pipe.x + pipe.width > shadowBird.x) {
      targetPipe = pipe;
      break;
    }
  }

  if (targetPipe) {
    const gapCenter = (targetPipe.gapTop + targetPipe.gapBottom) / 2 + adjustY;
    const targetY = gapCenter - CFG.BIRD_H / 2;

    // Simple: if above target, don't flap; if below, flap
    if (shadowBird.y > targetY + 4) {
      flapBird(shadowBird, 0.95); // Slightly gentler than player
    }
  } else {
    // No pipes, hover near center
    const centerY = CFG.CANVAS_H / 2.4;
    if (shadowBird.y > centerY + 5) {
      flapBird(shadowBird, 0.9);
    }
  }

  // Apply physics
  updateBird(shadowBird);

  // Clamp to play area
  const groundY = CFG.CANVAS_H - CFG.GROUND_H;
  shadowBird.y = clamp(shadowBird.y, 2, groundY - CFG.BIRD_H);

  // Rival mode: try to match player pace ±1 pipe
  if (shadowMode === 'rival' && playerBird) {
    // Slight rubber-banding toward player Y
    const diff = playerBird.y - shadowBird.y;
    shadowBird.y += diff * 0.02;
  }
}

/**
 * Ghost mode: replay best run.
 */
function updateGhostMode(dt) {
  if (!bestRunData.length || ghostReplayIndex >= bestRunData.length) return;
  const frame = bestRunData[ghostReplayIndex];
  if (frame && shadowBird) {
    shadowBird.y = frame.y;
    shadowBird.angle = frame.angle || 0;
  }
  ghostReplayIndex++;
}

/**
 * Record current frame for ghost replay (during player's run).
 */
export function recordFrameForGhost(bird) {
  if (!shadowEnabled) return;
  ghostReplay.push({ y: bird.y, angle: bird.angle });
}

/**
 * Save current run as best (for ghost replay next time).
 */
export function saveBestRun() {
  if (ghostReplay.length > 0) {
    bestRunData = [...ghostReplay];
  }
}

/**
 * Reset for a new run.
 */
export function resetShadow() {
  if (!shadowEnabled) return;
  shadowBird = createBird();
  shadowBird.x = CFG.BIRD_X + 40;
  ghostReplay = [];
  ghostReplayIndex = 0;
  resetPlayerData();
}

function resetPlayerData() {
  playerData = {
    flapTimestamps: [],
    yPositions: [],
    gapMargins: [],
    reflexDelays: [],
  };
  adjustY = 0;
  adjustTiming = 0;
}

/**
 * Calculate how many pipes ahead/behind the shadow is.
 */
export function getShadowDelta(playerPipeClears, shadowPipeClears) {
  return shadowPipeClears - playerPipeClears;
}

/**
 * Request Gemini analysis of player behavior.
 */
async function requestAnalysis() {
  try {
    const result = await analyzeShadow(playerData);
    if (result) {
      adjustY = clamp(result.adjustY || 0, -20, 20);
      adjustTiming = clamp(result.adjustTiming || 0, -200, 200);
    }
  } catch {
    // Silently fail — shadow continues with last known adjustments
  }
}
