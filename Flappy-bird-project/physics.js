// ──────────────────────────────────────────────────────────────────────
// physics.js — All named constants and bird physics update.
// Every magic number lives here so the game loop stays clean.
// ──────────────────────────────────────────────────────────────────────

export const CFG = {
  // Canvas native resolution (original Flappy Bird dimensions)
  CANVAS_W: 288,
  CANVAS_H: 512,

  // Bird physics — these recreate the original game feel.
  // Do NOT change without documented IoT biometric reason.
  GRAVITY:        0.25,
  FLAP_FORCE:    -4.6,
  MAX_FALL_SPEED: 8.0,
  BIRD_X:         60,    // Fixed horizontal position
  get BIRD_START_Y() { return this.CANVAS_H / 2.4; },

  // Pipe geometry
  PIPE_BODY_W:  52,
  PIPE_CAP_W:   60,   // 4px wider each side
  PIPE_CAP_H:   16,
  PIPE_GAP_BASE: 130,  // Starting gap — comfortable for beginners
  PIPE_GAP_MIN:  90,   // Absolute floor. Below this is cruel.
  PIPE_SPEED_BASE: 2.4,
  PIPE_SPEED_MAX:  5.0,
  SPAWN_INTERVAL:  96,  // Frames between pipe spawns (1.6s at 60fps)
  MAX_PIPES:       3,

  // Ground
  GROUND_H: 80,

  // Parallax speeds (relative to pipe speed)
  CLOUD_SPEED_RATIO: 0.15,

  // Bird sprite
  BIRD_W: 17,
  BIRD_H: 12,
  BIRD_ANIM_FPS: 8,

  // Rotation
  ROTATION_FACTOR: 3.5,   // degrees per unit velocity
  ROTATION_MIN:   -25,
  ROTATION_MAX:    90,
  ROTATION_LERP:   0.2,

  // Juice effects
  FLASH_DURATION:   200,   // ms
  SHAKE_FRAMES:     8,
  SCORE_POP_SCALE:  1.4,
  SCORE_POP_MS:     150,

  // Scoring
  SCORE_PER_PIPE:    10,
  SCORE_NEAR_MISS:    5,
  NEAR_MISS_DIST:     8,  // px threshold for near-miss bonus
  SCORE_STREAK_10:   20,
  SCORE_STREAK_20:   50,
  SCORE_IOT_FLOW:    15,
  SCORE_FACE_MODE:   30,

  // Countdown
  READY_DURATION: 150, // frames (2.5s at 60fps)

  // IoT physics modifiers
  IOT_HIGH_BPM_SPEED:  0.85,
  IOT_LOW_BPM_SPEED:   1.15,
  IOT_GSR_GRAVITY:     0.9,
  IOT_GSR_DURATION:    180,  // frames (3s)
  IOT_GAP_WIDEN:       6,    // px added to gap when BPM 100-120
};

/**
 * Clamp value between min and max.
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Linear interpolation.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Convert degrees to radians.
 */
export function degToRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Create a fresh bird state object.
 */
export function createBird() {
  return {
    x: CFG.BIRD_X,
    y: CFG.BIRD_START_Y,
    vy: 0,
    angle: 0,        // Current visual rotation in degrees
    frame: 0,        // Animation frame (0, 1, 2)
    animTimer: 0,     // Accumulator for animation timing
    alive: true,
    flapMultiplier: 1.0, // IoT joystick can modify this
  };
}

/**
 * Apply one frame of physics to the bird.
 * @param {object} bird - Bird state from createBird()
 * @param {number} gravityMod - Multiplier (IoT can temporarily reduce)
 */
export function updateBird(bird, gravityMod = 1.0) {
  // Gravity
  bird.vy += CFG.GRAVITY * gravityMod;
  bird.vy = clamp(bird.vy, -CFG.MAX_FALL_SPEED, CFG.MAX_FALL_SPEED);

  // Position
  bird.y += bird.vy;

  // Rotation — lerp toward target for organic feel
  const targetAngle = clamp(
    bird.vy * CFG.ROTATION_FACTOR,
    CFG.ROTATION_MIN,
    CFG.ROTATION_MAX
  );
  bird.angle = lerp(bird.angle, targetAngle, CFG.ROTATION_LERP);
}

/**
 * Execute a flap on the bird.
 * @param {object} bird
 * @param {number} forceMultiplier - Joystick / turbo / face mode modifier
 */
export function flapBird(bird, forceMultiplier = 1.0) {
  bird.vy = CFG.FLAP_FORCE * bird.flapMultiplier * forceMultiplier;
}

/**
 * Update bird sprite animation frame.
 * Cycle: 0 → 1 → 2 → 1 → 0 at BIRD_ANIM_FPS.
 */
export function animateBird(bird, dt) {
  if (!bird.alive) return; // Freeze on death frame
  bird.animTimer += dt;
  const frameDuration = 1 / CFG.BIRD_ANIM_FPS;
  if (bird.animTimer >= frameDuration) {
    bird.animTimer -= frameDuration;
    // Sequence: 0,1,2,1,0,1,2,1,...
    const seq = [0, 1, 2, 1];
    bird.frame = (bird.frame + 1) % seq.length;
  }
}

/** Get actual sprite frame index from animation sequence */
export function getBirdFrame(bird) {
  const seq = [0, 1, 2, 1];
  return seq[bird.frame % seq.length];
}

/**
 * Create a pipe pair (top + bottom).
 * @param {number} gapSize - Vertical gap in pixels
 */
export function createPipe(gapSize = CFG.PIPE_GAP_BASE) {
  const playableH = CFG.CANVAS_H - CFG.GROUND_H;
  const minY = 90;
  const maxY = playableH - 90;
  const gapMid = minY + Math.random() * (maxY - minY);

  return {
    x: CFG.CANVAS_W + 10,
    gapTop: gapMid - gapSize / 2,
    gapBottom: gapMid + gapSize / 2,
    width: CFG.PIPE_BODY_W,
    capWidth: CFG.PIPE_CAP_W,
    capHeight: CFG.PIPE_CAP_H,
    scored: false,
  };
}

/**
 * Calculate current pipe speed based on score and IoT modifier.
 */
export function getPipeSpeed(score, iotSpeedMod = 1.0) {
  const progression = Math.min(score / 40, 1.0);
  const speed = CFG.PIPE_SPEED_BASE + progression * (CFG.PIPE_SPEED_MAX - CFG.PIPE_SPEED_BASE);
  return speed * iotSpeedMod;
}
