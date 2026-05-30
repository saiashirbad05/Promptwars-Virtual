// ──────────────────────────────────────────────────────────────────────
// renderer.js — Everything drawn to the canvas. Pure drawing logic.
// No game state mutations happen here — this module only reads state
// and puts pixels on screen. Parallax, bird rotation, pipes, effects.
// ──────────────────────────────────────────────────────────────────────

import { CFG, degToRad } from './physics.js';
import {
  getBirdSprite, drawPipe, drawGround, drawBigNumber,
  drawClouds, drawCitySilhouette, drawTitle, drawMedal, drawSmallNumber,
} from './sprites.js';
import { getWorld, getThemedPipeColors, getThemedGroundColors, getChapterName } from './world.js';

// ── Juice Effect State ────────────────────────────────────────────────
let flashAlpha = 0;
let shakeFrames = 0;
let scorePopScale = 1.0;
let scorePopTimer = 0;

/**
 * Trigger the white screen flash on collision.
 */
export function triggerFlash() {
  flashAlpha = 1.0;
}

/**
 * Trigger screen shake on collision.
 */
export function triggerShake() {
  shakeFrames = CFG.SHAKE_FRAMES;
}

/**
 * Trigger score pop animation when pipe is cleared.
 */
export function triggerScorePop() {
  scorePopScale = CFG.SCORE_POP_SCALE;
  scorePopTimer = CFG.SCORE_POP_MS;
}

/**
 * Main render function — draws everything for one frame.
 */
export function render(ctx, gameState) {
  const {
    state, bird, pipes, score, bestScore, scrollX,
    readyTimer, gameOverBounce, blink, iotConnected,
    biometricData, shadowBird, shadowMode, shadowDelta,
    worldReview, geminiReview, pipeClears, mode,
  } = gameState;

  const world = getWorld();
  const pipeColors = getThemedPipeColors();
  const groundColors = getThemedGroundColors();

  ctx.save();

  // ── Screen shake offset ──────────────────────────────────────────
  if (shakeFrames > 0) {
    const dx = Math.random() * 8 - 4;
    const dy = Math.random() * 8 - 4;
    ctx.translate(dx, dy);
    shakeFrames--;
  }

  // ── Layer 0: Sky (static fill) ───────────────────────────────────
  ctx.fillStyle = world.sky_color || '#70C5CE';
  ctx.fillRect(0, 0, CFG.CANVAS_W, CFG.CANVAS_H);

  // ── Layer 1: Clouds & city silhouette (parallax) ─────────────────
  drawCitySilhouette(ctx, scrollX, world.city_color || '#3C6E47');
  drawClouds(ctx, scrollX, world.cloud_color || '#FFFFFF');

  // ── Pipes ────────────────────────────────────────────────────────
  for (const pipe of pipes) {
    // Top pipe
    drawPipe(ctx, pipe.x, 0, pipe.gapTop, true, pipeColors);
    // Bottom pipe
    const bottomY = pipe.gapBottom;
    const bottomH = CFG.CANVAS_H - CFG.GROUND_H - bottomY;
    drawPipe(ctx, pipe.x, bottomY, bottomH, false, pipeColors);
  }

  // ── Layer 2: Ground (moves with pipes) ───────────────────────────
  drawGround(ctx, scrollX, groundColors);

  // ── Shadow Faby (if enabled) ─────────────────────────────────────
  if (shadowBird && (state === 'playing' || state === 'ready')) {
    ctx.globalAlpha = 0.32;
    const shadowSprite = getBirdSprite(0);
    ctx.save();
    ctx.translate(shadowBird.x + CFG.BIRD_W / 2, shadowBird.y + CFG.BIRD_H / 2);
    ctx.rotate(degToRad(shadowBird.angle || 0));
    ctx.drawImage(shadowSprite, -CFG.BIRD_W / 2, -CFG.BIRD_H / 2);

    // Glow effect
    const glowColors = { mentor: '#00FF00', rival: '#FFB000', ghost: '#FFFFFF' };
    ctx.shadowColor = glowColors[shadowMode] || '#FFFFFF';
    ctx.shadowBlur = 4;
    ctx.drawImage(shadowSprite, -CFG.BIRD_W / 2, -CFG.BIRD_H / 2);
    ctx.shadowBlur = 0;
    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  // ── Bird (Faby) ──────────────────────────────────────────────────
  if (bird) {
    const sprite = getBirdSprite(bird.displayFrame || 0);
    ctx.save();
    ctx.translate(bird.x + CFG.BIRD_W / 2, bird.y + CFG.BIRD_H / 2);
    ctx.rotate(degToRad(bird.angle));
    ctx.drawImage(sprite, -CFG.BIRD_W / 2, -CFG.BIRD_H / 2);
    ctx.restore();
  }

  // ── State-specific overlays ──────────────────────────────────────
  if (state === 'title') {
    renderTitle(ctx, blink, iotConnected, world, mode);
  } else if (state === 'ready') {
    renderReady(ctx, readyTimer, blink);
  } else if (state === 'playing') {
    renderHUD(ctx, score, biometricData, shadowDelta, iotConnected);
  } else if (state === 'gameover') {
    renderGameOver(ctx, score, bestScore, pipeClears, gameOverBounce, geminiReview);
  }

  // ── Biometric edge glow (high BPM) ──────────────────────────────
  if (biometricData && biometricData.bpm > 120) {
    ctx.fillStyle = 'rgba(255, 60, 40, 0.08)';
    ctx.fillRect(0, 0, CFG.CANVAS_W, CFG.CANVAS_H);
  }

  // ── Screen flash (collision) ─────────────────────────────────────
  if (flashAlpha > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, CFG.CANVAS_W, CFG.CANVAS_H);
    flashAlpha -= 1.0 / (CFG.FLASH_DURATION / 16.67); // ~60fps decay
    if (flashAlpha < 0) flashAlpha = 0;
  }

  // ── Score pop animation decay ────────────────────────────────────
  if (scorePopTimer > 0) {
    scorePopTimer -= 16.67;
    const t = Math.max(0, scorePopTimer / CFG.SCORE_POP_MS);
    scorePopScale = 1.0 + (CFG.SCORE_POP_SCALE - 1.0) * t;
  } else {
    scorePopScale = 1.0;
  }

  ctx.restore();
}

// ── Title Screen ──────────────────────────────────────────────────────
function renderTitle(ctx, blink, iotConnected, world, mode) {
  // Title logo
  drawTitle(ctx, 100);

  // Subtitle
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('The Human-First Evolved Flappy Bird', CFG.CANVAS_W / 2, 130);

  // Bird card
  const cardY = 170;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(44, cardY, 200, 60);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(world.bird_name || 'Faby', 56, cardY + 15);
  ctx.fillStyle = '#AAAAAA';
  ctx.font = '6px monospace';

  // Wrap bird lore text
  const lore = world.bird_lore || '';
  const maxW = 180;
  const words = lore.split(' ');
  let line = '';
  let ly = cardY + 28;
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), 56, ly);
      line = w + ' ';
      ly += 10;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), 56, ly);

  // Mode icons
  const modeLabels = ['Classic', 'Face', 'IoT'];
  const modeY = 290;
  ctx.textAlign = 'center';
  for (let i = 0; i < 3; i++) {
    const mx = 60 + i * 85;
    const isSelected = (mode === i);

    // Icon background
    ctx.fillStyle = isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(mx - 25, modeY, 50, 40);

    // Label
    ctx.fillStyle = isSelected ? '#FFFFFF' : '#888888';
    ctx.font = '7px monospace';
    ctx.fillText(modeLabels[i], mx, modeY + 28);

    // Simple icon symbols
    ctx.font = '14px monospace';
    if (i === 0) ctx.fillText('🎮', mx, modeY + 16);
    else if (i === 1) ctx.fillText('👤', mx, modeY + 16);
    else ctx.fillText('📡', mx, modeY + 16);
  }

  // Blink "TAP TO PLAY"
  if (blink) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TAP TO PLAY', CFG.CANVAS_W / 2, 370);
  }

  // IoT status
  const heartY = CFG.CANVAS_H - CFG.GROUND_H - 30;
  ctx.fillStyle = iotConnected ? '#FF4444' : '#666666';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(iotConnected ? '❤' : '💔', CFG.CANVAS_W / 2, heartY);
  ctx.fillStyle = '#888888';
  ctx.font = '6px monospace';
  ctx.fillText(iotConnected ? 'IoT Connected' : 'IoT Disconnected', CFG.CANVAS_W / 2, heartY + 10);

  // Version
  ctx.fillStyle = '#555555';
  ctx.font = '5px monospace';
  ctx.fillText('GDG x Hack2Skill · v2.0', CFG.CANVAS_W / 2, CFG.CANVAS_H - CFG.GROUND_H - 6);
}

// ── Get Ready Screen ──────────────────────────────────────────────────
function renderReady(ctx, readyTimer, blink) {
  // Countdown number
  const seconds = Math.ceil(readyTimer / 60);
  if (seconds > 0 && seconds <= 3) {
    drawBigNumber(ctx, seconds, CFG.CANVAS_W / 2, 180, 4, '#FFFFFF', '#333333');
  }

  // Blink GET READY
  if (blink) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GET READY', CFG.CANVAS_W / 2, 160);
  }
}

// ── Playing HUD ──────────────────────────────────────────────────────
function renderHUD(ctx, score, biometricData, shadowDelta, iotConnected) {
  // Score — center top, with pop scale
  ctx.save();
  ctx.translate(CFG.CANVAS_W / 2, 30);
  ctx.scale(scorePopScale, scorePopScale);
  drawBigNumber(ctx, score, 0, -7, 3, '#FFFFFF', '#000000');
  ctx.restore();

  // Biometric display (top-left)
  if (biometricData && iotConnected) {
    ctx.fillStyle = '#FF4444';
    ctx.font = '7px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('❤ ' + (biometricData.bpm || '--'), 8, 16);

    // Heart rate zone color
    const bpm = biometricData.bpm || 0;
    if (bpm >= 60 && bpm <= 100) {
      ctx.fillStyle = '#00FF00'; // Ideal zone
    } else if (bpm > 100 && bpm <= 120) {
      ctx.fillStyle = '#FFB000'; // Elevated
    } else if (bpm > 120) {
      ctx.fillStyle = '#FF4444'; // High stress
    }
    // Small indicator dot
    ctx.beginPath();
    ctx.arc(48, 12, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shadow delta (top-right)
  if (shadowDelta !== undefined && shadowDelta !== null) {
    const sign = shadowDelta >= 0 ? '+' : '';
    ctx.fillStyle = shadowDelta >= 0 ? '#00FF00' : '#FFB000';
    ctx.font = '6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Shadow ${sign}${shadowDelta}`, CFG.CANVAS_W - 8, 16);
  }

  // Chapter name (bottom-left, above ground)
  const chapter = getChapterName();
  if (chapter) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(chapter, 6, CFG.CANVAS_H - CFG.GROUND_H - 6);
  }
}

// ── Game Over Screen ──────────────────────────────────────────────────
function renderGameOver(ctx, score, bestScore, pipeClears, bounceY, geminiReview) {
  // Darken
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, CFG.CANVAS_W, CFG.CANVAS_H);

  // "GAME OVER" text with bounce
  const goY = 80 + (bounceY || 0);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', CFG.CANVAS_W / 2 + 1, goY + 1);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('GAME OVER', CFG.CANVAS_W / 2, goY);

  // Score panel
  const panelX = 34;
  const panelY = 120;
  const panelW = 220;
  const panelH = 120;

  // Panel background
  ctx.fillStyle = '#DED895';
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = '#8B7D42';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  // Labels
  ctx.fillStyle = '#8B4513';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE', panelX + 60, panelY + 20);
  ctx.fillText('BEST', panelX + 60, panelY + 56);

  // Scores
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'right';
  ctx.font = '12px monospace';
  ctx.fillText(String(score), panelX + panelW - 16, panelY + 35);
  ctx.fillText(String(bestScore), panelX + panelW - 16, panelY + 71);

  // Medal
  drawMedal(ctx, pipeClears || 0, panelX + 32, panelY + 45, 20);

  // Gemini review text
  if (geminiReview) {
    ctx.fillStyle = '#444444';
    ctx.font = '6px monospace';
    ctx.textAlign = 'center';
    const lines = wrapText(geminiReview, 55);
    for (let i = 0; i < Math.min(lines.length, 3); i++) {
      ctx.fillText(lines[i], CFG.CANVAS_W / 2, panelY + panelH - 20 + i * 9);
    }
  }

  // Buttons
  const btnY = 280;
  // Play Again
  ctx.fillStyle = '#73BF2E';
  ctx.fillRect(40, btnY, 90, 30);
  ctx.strokeStyle = '#548B20';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, btnY, 90, 30);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PLAY AGAIN', 85, btnY + 19);

  // Menu
  ctx.fillStyle = '#DED895';
  ctx.fillRect(158, btnY, 90, 30);
  ctx.strokeStyle = '#8B7D42';
  ctx.strokeRect(158, btnY, 90, 30);
  ctx.fillStyle = '#333333';
  ctx.fillText('MENU', 203, btnY + 19);
}

/**
 * Simple word-wrap utility.
 */
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + w).length > maxChars && line) {
      lines.push(line.trim());
      line = '';
    }
    line += w + ' ';
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}
