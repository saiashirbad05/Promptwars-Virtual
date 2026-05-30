// ──────────────────────────────────────────────────────────────────────
// main.js — Entry point. Initializes all modules. Sets up the canvas
// and starts the game. This is what index.html loads.
// ──────────────────────────────────────────────────────────────────────

import { CFG } from './physics.js';
import { initSprites } from './sprites.js';
import { initGame, setApiKey } from './game.js';

// ── Canvas Setup ──────────────────────────────────────────────────────
// The canvas is sized at the original Flappy Bird resolution (288×512)
// and scaled up to fill the screen using CSS with nearest-neighbor
// interpolation. This keeps every pixel crisp at any display size.

function setupCanvas() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Canvas element #game-canvas not found');
    return null;
  }

  // Resize handler: scale canvas to fill screen while maintaining aspect ratio
  function resize() {
    const aspectRatio = CFG.CANVAS_W / CFG.CANVAS_H;
    const windowAspect = window.innerWidth / window.innerHeight;

    let displayW, displayH;

    if (windowAspect > aspectRatio) {
      // Window is wider than game — fit to height
      displayH = window.innerHeight;
      displayW = displayH * aspectRatio;
    } else {
      // Window is taller than game — fit to width
      displayW = window.innerWidth;
      displayH = displayW / aspectRatio;
    }

    canvas.style.width = Math.floor(displayW) + 'px';
    canvas.style.height = Math.floor(displayH) + 'px';
    canvas.style.marginTop = Math.floor((window.innerHeight - displayH) / 2) + 'px';
  }

  resize();
  window.addEventListener('resize', resize);

  return canvas;
}

// ── API Key Setup ─────────────────────────────────────────────────────
// The Gemini API key can be set via:
// 1. window.__ENV__?.GEMINI_API_KEY (injected by build tool or server)
// 2. A prompt on first load (stored in localStorage)

function setupApiKey() {
  // Check for injected env var
  const envKey = window.__ENV__?.GEMINI_API_KEY;
  if (envKey) {
    setApiKey(envKey);
    return;
  }

  // Check localStorage
  const storedKey = localStorage.getItem('flapai_gemini_key');
  if (storedKey) {
    setApiKey(storedKey);
    return;
  }

  // No key — game works fine without Gemini (uses fallback worlds)
  console.info('No Gemini API key set. Game will use fallback worlds and narrator.');
  console.info('To enable Gemini: localStorage.setItem("flapai_gemini_key", "YOUR_KEY")');
}

// ── Initialize ────────────────────────────────────────────────────────

function init() {
  // Set up canvas
  const canvas = setupCanvas();
  if (!canvas) return;

  // Initialize pixel art sprite caches
  initSprites();

  // Set up Gemini API key
  setupApiKey();

  // Start the game
  initGame(canvas);

  console.log(
    '%c FLAP.AI × IoT %c v2.0 %c GDG × Hack2Skill',
    'background: #73BF2E; color: #000; padding: 2px 6px; font-weight: bold;',
    'background: #333; color: #fff; padding: 2px 6px;',
    'background: #70C5CE; color: #000; padding: 2px 6px;'
  );
}

// Wait for DOM to be ready, then start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
