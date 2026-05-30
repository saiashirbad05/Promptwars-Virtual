// ──────────────────────────────────────────────────────────────────────
// collision.js — Bitmap mask collision system.
// We use bitmap collision instead of bounding boxes because a 2px
// near-miss should FEEL like a near-miss, not an invisible wall death.
// Player trust is more important than collision performance here.
// ──────────────────────────────────────────────────────────────────────

import { CFG } from './physics.js';
import { getBirdMask } from './sprites.js';

/**
 * Check if the bird collides with any pipe or the ground.
 * Uses the pre-computed pixel mask for the bird's current frame.
 *
 * @param {object} bird     - Bird state {x, y, frame, alive}
 * @param {Array}  pipes    - Array of pipe objects
 * @param {number} frameIdx - Current animation frame index (0,1,2)
 * @returns {{ hit: boolean, nearMiss: boolean, nearMissDist: number }}
 */
export function checkCollision(bird, pipes, frameIdx) {
  const mask = getBirdMask(frameIdx);
  const groundY = CFG.CANVAS_H - CFG.GROUND_H;
  let nearMiss = false;
  let nearMissDist = Infinity;

  // Ground collision — simple Y check (faster than per-pixel for ground)
  if (bird.y + CFG.BIRD_H >= groundY) {
    return { hit: true, nearMiss: false, nearMissDist: 0 };
  }

  // Ceiling is handled by the game loop (clamps position, does not kill)

  // Pipe collision — check each non-transparent bird pixel against pipe rects
  for (const pipe of pipes) {
    const capOffset = (pipe.capWidth - pipe.width) / 2;

    // Define pipe collision rectangles (top pipe body, top cap, bottom pipe body, bottom cap)
    const rects = [
      // Top pipe body
      { x: pipe.x, y: 0, w: pipe.width, h: pipe.gapTop - pipe.capHeight },
      // Top pipe cap
      { x: pipe.x - capOffset, y: pipe.gapTop - pipe.capHeight, w: pipe.capWidth, h: pipe.capHeight },
      // Bottom pipe cap
      { x: pipe.x - capOffset, y: pipe.gapBottom, w: pipe.capWidth, h: pipe.capHeight },
      // Bottom pipe body
      { x: pipe.x, y: pipe.gapBottom + pipe.capHeight, w: pipe.width, h: groundY - pipe.gapBottom - pipe.capHeight },
    ];

    // Bitmap mask check — each non-transparent pixel
    for (const px of mask) {
      const worldX = bird.x + px.x;
      const worldY = bird.y + px.y;

      for (const rect of rects) {
        if (
          worldX >= rect.x &&
          worldX < rect.x + rect.w &&
          worldY >= rect.y &&
          worldY < rect.y + rect.h
        ) {
          return { hit: true, nearMiss: false, nearMissDist: 0 };
        }
      }
    }

    // Near-miss detection: check if bird is within the gap but close to edges
    const birdCenterX = bird.x + CFG.BIRD_W / 2;
    const birdCenterY = bird.y + CFG.BIRD_H / 2;

    // Only check for near-miss if bird is horizontally aligned with pipe
    if (birdCenterX >= pipe.x && birdCenterX <= pipe.x + pipe.width) {
      const distToTop = birdCenterY - pipe.gapTop;
      const distToBottom = pipe.gapBottom - birdCenterY;
      const minDist = Math.min(distToTop, distToBottom);

      if (minDist > 0 && minDist <= CFG.NEAR_MISS_DIST) {
        nearMiss = true;
        nearMissDist = Math.min(nearMissDist, minDist);
      }
    }
  }

  return { hit: false, nearMiss, nearMissDist };
}

/**
 * Check if bird just passed a pipe (for scoring).
 * @returns {Array} Array of pipes that were just cleared.
 */
export function checkPipeClears(bird, pipes) {
  const cleared = [];
  for (const pipe of pipes) {
    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      pipe.scored = true;
      cleared.push(pipe);
    }
  }
  return cleared;
}
