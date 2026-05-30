// ──────────────────────────────────────────────────────────────────────
// game.js — The 60fps game loop. Physics. Collision. State machine.
// Four states: TITLE → READY → PLAYING → GAME_OVER.
// This is the beating heart. Every system feeds into and out of here.
// ──────────────────────────────────────────────────────────────────────

import { CFG, createBird, updateBird, flapBird, animateBird, getBirdFrame, createPipe, getPipeSpeed, clamp } from './physics.js';
import { checkCollision, checkPipeClears } from './collision.js';
import { initAudio, playFlapSound, playDeathSound, playScoreSound, playCountdownSound } from './audio.js';
import { render, triggerFlash, triggerShake, triggerScorePop } from './renderer.js';
import { setInputCallbacks, initInput, triggerFlap as inputTriggerFlap } from './input.js';
import { getBlinkState, startBlink, stopBlink, getBestScore, saveBestScore, showToast, checkGameOverButtons } from './ui.js';
import { getWorld, setWorld, getRandomFallbackWorld, advanceChapter, resetChapter, getChapterIndex } from './world.js';
import { generateWorld, generateReview, isGeminiAvailable, setGeminiApiKey } from './gemini.js';
import { queueEvent, clearNarrator, getSubtitle } from './narrator.js';
import { initShadow, disableShadow, getShadowBird, getShadowMode, updateShadow, recordPlayerFlap, recordPlayerPipePass, recordFrameForGhost, saveBestRun, resetShadow, getShadowDelta } from './shadow.js';
import { initIoT, isIoTConnected, setIoTCallbacks } from './iot.js';
import { processBiometric, updateBiometricFrame, getBiometricData, getGameMods, resetBiometricSession, getSessionSummary, hasBiometricData } from './biometric.js';
import { processEnvironment, checkPauseRequest, clearMotion } from './environment.js';

// ── Game State ────────────────────────────────────────────────────────
let state = 'title';   // 'title' | 'ready' | 'playing' | 'gameover'
let bird = null;
let pipes = [];
let score = 0;
let pipeClears = 0;     // Raw pipe count (for medals)
let bestScore = 0;
let scrollX = 0;
let readyTimer = 0;
let spawnTimer = 0;
let deaths = 0;
let nearMisses = 0;
let streak = 0;
let gameOverBounce = 0;
let gameOverBounceVY = 0;
let geminiReview = '';
let paused = false;
let mode = 0;           // 0 = Classic, 1 = Face, 2 = IoT
let shadowPipeClears = 0;

// Canvas
let canvas = null;
let ctx = null;
let lastTime = 0;

/**
 * Initialize the game. Call once from main.js.
 */
export function initGame(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');

  // Set native resolution
  canvas.width = CFG.CANVAS_W;
  canvas.height = CFG.CANVAS_H;

  // Disable image smoothing for pixel-perfect scaling
  ctx.imageSmoothingEnabled = false;

  // Load best score
  bestScore = getBestScore();

  // Set up input callbacks
  setInputCallbacks({
    flap: handleFlap,
    turboFlap: handleTurboFlap,
    shield: handleShield,
    anyInput: handleAnyInput,
  });

  initInput(canvas);

  // Handle game over button clicks with coordinate transform
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('touchend', handleCanvasTouch);

  // Set up IoT callbacks
  setIoTCallbacks({
    button: handleIoTButton,
    joystick: handleIoTJoystick,
    biometric: (data) => processBiometric(data),
    environment: (data) => processEnvironment(data),
  });

  // Try to connect IoT (non-blocking, fails silently)
  initIoT();

  // Start on title screen
  enterTitle();

  // Start blink controller
  startBlink();

  // Begin the game loop
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

/**
 * Set Gemini API key (called from main.js).
 */
export function setApiKey(key) {
  setGeminiApiKey(key);
}

// ── State Transitions ─────────────────────────────────────────────────

function enterTitle() {
  state = 'title';
  bird = createBird();
  pipes = [];
  score = 0;
  pipeClears = 0;
  scrollX = 0;
  streak = 0;
  nearMisses = 0;
  geminiReview = '';
  deaths = 0;
  startBlink();
  clearNarrator();
  resetBiometricSession();
}

async function enterReady() {
  state = 'ready';
  bird = createBird();
  pipes = [];
  score = 0;
  pipeClears = 0;
  readyTimer = CFG.READY_DURATION;
  spawnTimer = 0;
  streak = 0;
  nearMisses = 0;
  scrollX = 0;
  geminiReview = '';
  shadowPipeClears = 0;

  resetChapter();
  resetShadow();

  // Generate a new world via Gemini (or fall back)
  if (isGeminiAvailable()) {
    try {
      const worldObj = await generateWorld();
      if (worldObj) {
        setWorld(worldObj);
      } else {
        setWorld(getRandomFallbackWorld());
      }
    } catch {
      setWorld(getRandomFallbackWorld());
    }
  } else {
    setWorld(getRandomFallbackWorld());
  }

  queueEvent('game_start');
  stopBlink();
  startBlink();
  initAudio();
}

function enterPlaying() {
  state = 'playing';
  stopBlink();
}

async function enterGameOver() {
  state = 'gameover';
  bird.alive = false;

  playDeathSound();
  triggerFlash();
  triggerShake();

  deaths++;
  gameOverBounce = -40; // Start above final position for bounce
  gameOverBounceVY = 0;

  // Check for new best
  const isNewBest = saveBestScore(score);
  bestScore = getBestScore();

  if (isNewBest) {
    queueEvent('new_best', { score });
    saveBestRun();
  } else if (deaths === 1) {
    queueEvent('first_death', { score, pipeClears });
  } else if (deaths === 3) {
    queueEvent('third_death', { score, pipeClears, deaths });
  }

  startBlink();

  // Generate Gemini review
  if (isGeminiAvailable()) {
    try {
      const world = getWorld();
      const bio = getSessionSummary();
      const review = await generateReview({
        birdName: world.bird_name,
        worldName: world.name,
        pipeClears,
        score,
        nearMisses,
        deaths,
        peakBPM: bio.peakBPM > 0 ? bio.peakBPM : undefined,
      });
      if (review) geminiReview = review;
    } catch {
      // No review — that's fine
    }
  }
}

// ── Input Handlers ────────────────────────────────────────────────────

function handleFlap(forceMultiplier = 1.0) {
  // Allow flapping during both READY and PLAYING states
  if ((state === 'playing' || state === 'ready') && bird && bird.alive) {
    flapBird(bird, forceMultiplier);
    playFlapSound();
    recordPlayerFlap(Date.now(), bird.y);
  }
}

function handleTurboFlap() {
  handleFlap(1.5);
}

function handleShield() {
  // Shield absorbs one hit — implement as invincibility frames
  showToast('Shield activated! 🛡️', 1500);
}

function handleAnyInput() {
  if (state === 'title') {
    enterReady();
  } else if (state === 'gameover') {
    // Handled by button click detection
  } else if (paused) {
    paused = false;
    clearMotion();
  }
}

function handleCanvasClick(e) {
  if (state !== 'gameover') return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = CFG.CANVAS_W / rect.width;
  const scaleY = CFG.CANVAS_H / rect.height;
  const cx = (e.clientX - rect.left) * scaleX;
  const cy = (e.clientY - rect.top) * scaleY;
  const action = checkGameOverButtons(cx, cy);
  if (action === 'replay') enterReady();
  else if (action === 'menu') enterTitle();
}

function handleCanvasTouch(e) {
  if (state !== 'gameover') return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.changedTouches[0];
  if (!touch) return;
  const scaleX = CFG.CANVAS_W / rect.width;
  const scaleY = CFG.CANVAS_H / rect.height;
  const cx = (touch.clientX - rect.left) * scaleX;
  const cy = (touch.clientY - rect.top) * scaleY;
  const action = checkGameOverButtons(cx, cy);
  if (action === 'replay') enterReady();
  else if (action === 'menu') enterTitle();
}

// ── IoT Input Handlers ───────────────────────────────────────────────

function handleIoTButton(data) {
  handleAnyInput();
  switch (data.action) {
    case 'flap':   handleFlap(); break;
    case 'turbo':  handleTurboFlap(); break;
    case 'shield': handleShield(); break;
  }
}

function handleIoTJoystick(data) {
  if (!bird) return;
  // Map joystick Y (-1 to +1) to flap force multiplier (0.7 to 1.4)
  const y = clamp(data.y || 0, -1, 1);
  bird.flapMultiplier = 1.0 + y * 0.4; // -1 → 0.6, 0 → 1.0, +1 → 1.4
  bird.flapMultiplier = clamp(bird.flapMultiplier, 0.7, 1.4);
}

// ── Game Loop ─────────────────────────────────────────────────────────

function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05); // Cap delta to avoid spiral
  lastTime = now;

  if (paused) {
    renderPaused();
    requestAnimationFrame(gameLoop);
    return;
  }

  // Check environment pause request
  if (checkPauseRequest() && state === 'playing') {
    paused = true;
    requestAnimationFrame(gameLoop);
    return;
  }

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  // Update biometric frame processing
  updateBiometricFrame();

  const mods = getGameMods();

  switch (state) {
    case 'title':
      updateTitle(dt);
      break;
    case 'ready':
      updateReady(dt, mods);
      break;
    case 'playing':
      updatePlaying(dt, mods);
      break;
    case 'gameover':
      updateGameOver(dt);
      break;
  }
}

function updateTitle(dt) {
  // Gentle bob animation for bird on title screen
  if (bird) {
    bird.y = CFG.BIRD_START_Y + Math.sin(Date.now() / 300) * 6;
    animateBird(bird, dt);
  }
  // Slowly scroll background for visual interest
  scrollX += 0.5;
}

function updateReady(dt, mods) {
  if (bird) {
    // During GET READY, bird has gravity + can flap (like original game).
    // This lets the player feel the bird's weight before pipes arrive.
    updateBird(bird, mods.gravityMod);
    animateBird(bird, dt);

    // Clamp bird to play area during ready — don't let it die before play
    const groundY = CFG.CANVAS_H - CFG.GROUND_H;
    if (bird.y + CFG.BIRD_H > groundY - 4) {
      bird.y = groundY - CFG.BIRD_H - 4;
      bird.vy = 0;
    }
    if (bird.y < 10) {
      bird.y = 10;
      bird.vy = 0;
    }
  }

  readyTimer--;

  // Countdown sound at second boundaries
  const prevSec = Math.ceil((readyTimer + 1) / 60);
  const curSec = Math.ceil(readyTimer / 60);
  if (curSec !== prevSec && curSec > 0 && curSec <= 3) {
    playCountdownSound();
  }

  if (readyTimer <= 0) {
    enterPlaying();
  }
}

function updatePlaying(dt, mods) {
  if (!bird || !bird.alive) return;

  // Bird physics
  updateBird(bird, mods.gravityMod);
  animateBird(bird, dt);

  // Pipe movement & spawning
  const speed = getPipeSpeed(pipeClears, mods.pipeSpeedMod);
  scrollX += speed;
  spawnTimer++;

  const adjustedInterval = Math.max(CFG.SPAWN_INTERVAL - pipeClears * 0.3, 70);

  if (spawnTimer >= adjustedInterval && pipes.length < 5) {
    // Gap shrinks gently: 0.5px per pipe cleared (was 1.5 — too aggressive)
    const gap = CFG.PIPE_GAP_BASE - pipeClears * 0.5 + mods.gapMod;
    const clampedGap = clamp(gap, CFG.PIPE_GAP_MIN, CFG.PIPE_GAP_BASE + 20);
    pipes.push(createPipe(clampedGap));
    spawnTimer = 0;
  }

  // Move pipes
  for (const pipe of pipes) {
    pipe.x -= speed;
  }

  // Remove off-screen pipes
  pipes = pipes.filter(p => p.x + p.width + 10 > -10);

  // Clamp bird to prevent going above the screen (don't kill — just stop)
  if (bird.y < 0) {
    bird.y = 0;
    bird.vy = 0;
  }

  // Collision detection
  const frameIdx = getBirdFrame(bird);
  const collision = checkCollision(bird, pipes, frameIdx);

  if (collision.hit) {
    enterGameOver();
    return;
  }

  if (collision.nearMiss) {
    nearMisses++;
    score += CFG.SCORE_NEAR_MISS;
    queueEvent('near_miss', { distance: collision.nearMissDist, nearMisses });
  }

  // Pipe clearing / scoring
  const cleared = checkPipeClears(bird, pipes);
  for (const pipe of cleared) {
    pipeClears++;
    score += CFG.SCORE_PER_PIPE;
    streak++;
    playScoreSound();
    triggerScorePop();

    // Record for Shadow analysis
    recordPlayerPipePass(bird.y, pipe.gapTop, pipe.gapBottom);

    // Narrator events for streaks
    if (pipeClears === 1) {
      queueEvent('first_pipe');
    }
    if (streak === 10) {
      score += CFG.SCORE_STREAK_10;
      queueEvent('streak_10', { streak });
    }
    if (streak === 20) {
      score += CFG.SCORE_STREAK_20;
      queueEvent('streak_20', { streak });
    }

    // Chapter advancement every 10 pipes
    if (pipeClears % 10 === 0) {
      advanceChapter();
    }
  }

  // Shadow Faby update
  updateShadow(pipes, bird, pipeClears, dt);
  recordFrameForGhost(bird);

  // Shadow pipe tracking (approximate)
  const shadow = getShadowBird();
  if (shadow) {
    for (const pipe of pipes) {
      if (!pipe._shadowScored && pipe.x + pipe.width < shadow.x) {
        pipe._shadowScored = true;
        shadowPipeClears++;
      }
    }
  }
}

function updateGameOver(dt) {
  // Bounce the "GAME OVER" text into position
  if (gameOverBounce < 0) {
    gameOverBounceVY += 1.5;
    gameOverBounce += gameOverBounceVY;
    if (gameOverBounce >= 0) {
      gameOverBounce = 0;
      gameOverBounceVY = -gameOverBounceVY * 0.3;
      if (Math.abs(gameOverBounceVY) < 1) gameOverBounceVY = 0;
    }
  }

  // Dead bird falls and rotates
  if (bird) {
    bird.vy += CFG.GRAVITY;
    bird.y += bird.vy;
    bird.angle = 90; // Freeze rotation on death
    const groundY = CFG.CANVAS_H - CFG.GROUND_H;
    if (bird.y + CFG.BIRD_H > groundY) {
      bird.y = groundY - CFG.BIRD_H;
      bird.vy = 0;
    }
  }
}

function draw() {
  const shadowBird = getShadowBird();
  const shadowMode = getShadowMode();
  const shadowDelta = shadowBird ? getShadowDelta(pipeClears, shadowPipeClears) : null;

  render(ctx, {
    state,
    bird: bird ? { ...bird, displayFrame: getBirdFrame(bird) } : null,
    pipes,
    score,
    bestScore,
    scrollX,
    readyTimer,
    gameOverBounce,
    blink: getBlinkState(),
    iotConnected: isIoTConnected(),
    biometricData: hasBiometricData() ? getBiometricData() : null,
    shadowBird,
    shadowMode,
    shadowDelta,
    geminiReview,
    pipeClears,
    mode,
    subtitle: getSubtitle(),
  });
}

function renderPaused() {
  // Draw the normal game frame
  draw();

  // Overlay pause screen
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CFG.CANVAS_W, CFG.CANVAS_H);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', CFG.CANVAS_W / 2, CFG.CANVAS_H / 2 - 20);

  ctx.font = '8px monospace';
  ctx.fillText("SOMEONE'S WATCHING", CFG.CANVAS_W / 2, CFG.CANVAS_H / 2 + 5);

  ctx.fillStyle = '#888888';
  ctx.font = '7px monospace';
  ctx.fillText('Tap to resume', CFG.CANVAS_W / 2, CFG.CANVAS_H / 2 + 30);
}
