// ──────────────────────────────────────────────────────────────────────
// world.js — World theme state and chapter progression.
// Stores the current generated world (colors, bird lore, chapters).
// 5 hardcoded fallback worlds ensure the game works without Gemini.
// ──────────────────────────────────────────────────────────────────────

import { PIPE_COLORS, GROUND_COLORS } from './sprites.js';

// ── Fallback Worlds ───────────────────────────────────────────────────
// These are used when Gemini is unavailable or takes too long.
const FALLBACK_WORLDS = [
  {
    name: 'Classic Skies',
    sky_color: '#70C5CE',
    pipe_color: '#73BF2E',
    pipe_shadow: '#548B20',
    pipe_highlight: '#8CD43F',
    ground_color: '#DED895',
    ground_stripe: '#C8C070',
    ground_edge: '#73BF2E',
    cloud_color: '#FFFFFF',
    city_color: '#3C6E47',
    bird_name: 'Faby',
    bird_lore: 'The original sky wanderer. She flies because she must.',
    ability: 'None — pure skill only',
    chapters: ['Dawn', 'The Fields', 'Pipeline', 'The Summit', 'Beyond'],
    mood: 'nostalgic, warm, familiar',
  },
  {
    name: 'Neon Tokyo at 3AM',
    sky_color: '#0a0a1a',
    pipe_color: '#00f5d4',
    pipe_shadow: '#007a6b',
    pipe_highlight: '#66ffea',
    ground_color: '#1a1a2e',
    ground_stripe: '#151528',
    ground_edge: '#00f5d4',
    cloud_color: '#1e3a5f',
    city_color: '#0d2137',
    bird_name: 'Circuit',
    bird_lore: 'A fragment of rogue AI escaping corporate servers.',
    ability: 'Data Surge — doubles flap force for 3 seconds',
    chapters: ['Boot Sequence', 'Firewall', 'Core Access', 'Singularity', 'Escape'],
    mood: 'tense, electric, neon-soaked',
  },
  {
    name: 'Sunset Canyon',
    sky_color: '#FF6B35',
    pipe_color: '#8B4513',
    pipe_shadow: '#5C2E0A',
    pipe_highlight: '#A0522D',
    ground_color: '#D2691E',
    ground_stripe: '#B8560F',
    ground_edge: '#8B4513',
    cloud_color: '#FFB366',
    city_color: '#6B3410',
    bird_name: 'Ember',
    bird_lore: 'Born from the last spark before the campfire dies.',
    ability: 'Heat Shield — absorbs one collision',
    chapters: ['Red Trail', 'Mesa Pass', 'The Chasm', 'Ember Peak', 'Horizon'],
    mood: 'warm, adventurous, golden-hour',
  },
  {
    name: 'Deep Ocean Trench',
    sky_color: '#001830',
    pipe_color: '#006994',
    pipe_shadow: '#00445F',
    pipe_highlight: '#0088B4',
    ground_color: '#002840',
    ground_stripe: '#001F33',
    ground_edge: '#006994',
    cloud_color: '#003355',
    city_color: '#001520',
    bird_name: 'Abyss',
    bird_lore: 'A bioluminescent creature that lights its own way.',
    ability: 'Sonar Pulse — reveals pipe gaps for 2 seconds',
    chapters: ['Shallow Waters', 'The Descent', 'Midnight Zone', 'The Vent', 'Abyssal Floor'],
    mood: 'mysterious, deep, bioluminescent',
  },
  {
    name: 'Cherry Blossom Garden',
    sky_color: '#FFE4E1',
    pipe_color: '#8B5E83',
    pipe_shadow: '#6B4063',
    pipe_highlight: '#A87CA0',
    ground_color: '#D4A0A0',
    ground_stripe: '#C08888',
    ground_edge: '#8B5E83',
    cloud_color: '#FFB8C6',
    city_color: '#7A5070',
    bird_name: 'Sakura',
    bird_lore: 'She appears only in spring. Every flap scatters petals.',
    ability: 'Petal Drift — slows gravity for 4 seconds',
    chapters: ['First Bloom', 'The Path', 'Temple Gate', 'Canopy', 'Eternal Garden'],
    mood: 'gentle, floral, serene',
  },
];

// ── Current World State ───────────────────────────────────────────────
let currentWorld = { ...FALLBACK_WORLDS[0] };
let currentChapter = 0;

/**
 * Get the current world theme.
 */
export function getWorld() {
  return currentWorld;
}

/**
 * Set a new world theme (from Gemini generation or fallback).
 */
export function setWorld(worldObj) {
  currentWorld = { ...worldObj };
  currentChapter = 0;
}

/**
 * Pick a random fallback world.
 */
export function getRandomFallbackWorld() {
  return FALLBACK_WORLDS[Math.floor(Math.random() * FALLBACK_WORLDS.length)];
}

/**
 * Get all fallback worlds (for testing / selection).
 */
export function getFallbackWorlds() {
  return FALLBACK_WORLDS;
}

/**
 * Advance to the next chapter (triggered by pipe milestone).
 */
export function advanceChapter() {
  if (currentWorld.chapters && currentChapter < currentWorld.chapters.length - 1) {
    currentChapter++;
  }
}

/**
 * Get current chapter name.
 */
export function getChapterName() {
  if (!currentWorld.chapters || currentWorld.chapters.length === 0) return '';
  return currentWorld.chapters[currentChapter] || '';
}

/**
 * Get current chapter index.
 */
export function getChapterIndex() {
  return currentChapter;
}

/**
 * Reset chapter to beginning (on new game).
 */
export function resetChapter() {
  currentChapter = 0;
}

/**
 * Build pipe colors object from current world theme.
 */
export function getThemedPipeColors() {
  return {
    body: currentWorld.pipe_color || PIPE_COLORS.body,
    outline: currentWorld.pipe_shadow || PIPE_COLORS.outline,
    highlight: currentWorld.pipe_highlight || PIPE_COLORS.highlight,
    cap: currentWorld.pipe_color || PIPE_COLORS.cap,
    capOutline: currentWorld.pipe_shadow || PIPE_COLORS.capOutline,
    capHL: currentWorld.pipe_highlight || PIPE_COLORS.capHL,
  };
}

/**
 * Build ground colors from current world theme.
 */
export function getThemedGroundColors() {
  return {
    base: currentWorld.ground_color || GROUND_COLORS.base,
    stripe: currentWorld.ground_stripe || GROUND_COLORS.stripe,
    edge: currentWorld.ground_edge || GROUND_COLORS.edge,
  };
}
