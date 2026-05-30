// ──────────────────────────────────────────────────────────────────────
// environment.js — Environment data processing. World adaptation.
// Detects ambient light, noise, motion, and time of day. Adapts the
// game world, narrator volume, and pace accordingly. Small acts of
// kindness from the game to the player.
// ──────────────────────────────────────────────────────────────────────

import { setWorld, getRandomFallbackWorld, getWorld } from './world.js';
import { setSubtitleMode, queueEvent } from './narrator.js';

// ── Environment State ─────────────────────────────────────────────────
let currentLux = -1;        // -1 = no data
let currentNoiseDB = -1;
let motionDetected = false;
let timeOfDay = 'afternoon';

let pauseRequested = false;
let lastLuxThreshold = '';  // Track light level zone to avoid re-triggering

// Callbacks
let onPause = null;

/**
 * Set the pause callback (game loop will check this).
 */
export function setEnvironmentPauseCallback(cb) {
  onPause = cb;
}

/**
 * Process incoming environment data from IoT.
 * @param {object} data - { lux, noise_db, motion, time_of_day }
 */
export function processEnvironment(data) {
  if (data.lux !== undefined) {
    currentLux = data.lux;
    handleLightChange(data.lux);
  }

  if (data.noise_db !== undefined) {
    currentNoiseDB = data.noise_db;
    handleNoiseLevel(data.noise_db);
  }

  if (data.motion !== undefined && data.motion === true) {
    handleMotionDetected();
  }

  if (data.time_of_day) {
    timeOfDay = data.time_of_day;
  }
}

/**
 * Handle ambient light level changes.
 * Switches world theme to match lighting conditions.
 */
function handleLightChange(lux) {
  let threshold;
  if (lux < 50) threshold = 'dark';
  else if (lux > 5000) threshold = 'bright';
  else threshold = 'normal';

  // Only react if the zone actually changed
  if (threshold === lastLuxThreshold) return;
  lastLuxThreshold = threshold;

  if (threshold === 'dark') {
    // Switch to a dark world theme
    const world = getWorld();
    setWorld({
      ...world,
      sky_color: '#0a0a1a',
      pipe_color: '#335566',
      pipe_shadow: '#223344',
      pipe_highlight: '#446677',
      ground_color: '#1a1a2e',
      ground_stripe: '#151528',
      ground_edge: '#335566',
      cloud_color: '#1e2a3f',
      city_color: '#0d1520',
    });
    queueEvent('iot_environment', { message: 'Playing in the dark. Classic move.' });
  } else if (threshold === 'bright') {
    // Bright: increase contrast
    const world = getWorld();
    setWorld({
      ...world,
      sky_color: '#82D5DE',
      pipe_highlight: '#9DE44F',
    });
    queueEvent('iot_environment', { message: 'Daylight player. Respect.' });
  }
}

/**
 * Handle noise level changes.
 * Activates subtitle mode when too loud for voice.
 */
function handleNoiseLevel(db) {
  if (db > 70) {
    setSubtitleMode(true);
  } else {
    setSubtitleMode(false);
    if (db < 30) {
      // Quiet room — narrator could acknowledge this
      // (Only once, tracked elsewhere if needed)
    }
  }
}

/**
 * Handle PIR motion detection (someone entered the room).
 * Pauses the game — no one wants to die because of a distraction.
 */
function handleMotionDetected() {
  if (!motionDetected) {
    motionDetected = true;
    pauseRequested = true;
    if (onPause) onPause();
  }
}

/**
 * Check and clear the pause request.
 */
export function checkPauseRequest() {
  if (pauseRequested) {
    pauseRequested = false;
    return true;
  }
  return false;
}

/**
 * Clear motion detected flag (on resume).
 */
export function clearMotion() {
  motionDetected = false;
}

/**
 * Get current environment data.
 */
export function getEnvironmentData() {
  return {
    lux: currentLux,
    noiseDB: currentNoiseDB,
    motionDetected,
    timeOfDay,
  };
}

/**
 * Get time-of-day palette hint for world generation.
 * Morning: warm. Afternoon: full. Evening: cool. Night: dark.
 */
export function getTimeOfDayPalette() {
  switch (timeOfDay) {
    case 'morning':  return { bias: 'warm', sky: '#FFE4B5' };
    case 'afternoon': return { bias: 'standard', sky: '#70C5CE' };
    case 'evening':  return { bias: 'cool', sky: '#4A5899' };
    case 'night':    return { bias: 'dark', sky: '#0a0a1a' };
    default:         return { bias: 'standard', sky: '#70C5CE' };
  }
}
