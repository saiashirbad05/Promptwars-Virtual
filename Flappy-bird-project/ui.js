// ──────────────────────────────────────────────────────────────────────
// ui.js — HUD, screens, medals, score display, toast notifications.
// This module manages UI state overlaid on the game canvas.
// Pixel-font rendering uses the Apple Watch "glanceable" principle:
// one number dominates (score), everything else is much smaller.
// ──────────────────────────────────────────────────────────────────────

// ── Toast Notifications ──────────────────────────────────────────────
let toastTimer = null;

/**
 * Show a toast message at the bottom of the screen.
 * @param {string} message
 * @param {number} duration - ms to show (default 3000)
 */
export function showToast(message, duration = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, duration);
}

// ── Blink Controller ─────────────────────────────────────────────────
let blinkState = true;
let blinkInterval = null;

/**
 * Start the blink controller (1.1s interval, 660ms toggle).
 */
export function startBlink() {
  if (blinkInterval) return;
  blinkState = true;
  blinkInterval = setInterval(() => {
    blinkState = !blinkState;
  }, 660);
}

/**
 * Stop blink and reset to visible.
 */
export function stopBlink() {
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }
  blinkState = true;
}

/**
 * Get current blink state (true = visible).
 */
export function getBlinkState() {
  return blinkState;
}

// ── Best Score Persistence ───────────────────────────────────────────
const BEST_KEY = 'flapai_best_score';

/**
 * Get best score from localStorage.
 */
export function getBestScore() {
  try {
    return parseInt(localStorage.getItem(BEST_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

/**
 * Save best score to localStorage.
 */
export function saveBestScore(score) {
  try {
    const current = getBestScore();
    if (score > current) {
      localStorage.setItem(BEST_KEY, String(score));
      return true; // New best!
    }
  } catch { /* Silently fail if localStorage unavailable */ }
  return false;
}

// ── Game Over Button Hit Detection ───────────────────────────────────
/**
 * Check if a canvas-space click hits the Play Again or Menu button.
 * Returns 'replay' | 'menu' | null.
 */
export function checkGameOverButtons(canvasX, canvasY) {
  const btnY = 280;
  // Play Again button: (40, btnY) to (130, btnY+30)
  if (canvasX >= 40 && canvasX <= 130 && canvasY >= btnY && canvasY <= btnY + 30) {
    return 'replay';
  }
  // Menu button: (158, btnY) to (248, btnY+30)
  if (canvasX >= 158 && canvasX <= 248 && canvasY >= btnY && canvasY <= btnY + 30) {
    return 'menu';
  }
  return null;
}
