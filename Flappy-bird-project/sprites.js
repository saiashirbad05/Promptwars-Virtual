// ──────────────────────────────────────────────────────────────────────
// sprites.js — Programmatic pixel art. No external images.
// Every sprite is drawn with canvas fillRect calls so the game is
// fully self-contained. Two-tone flat shading, 1px black outlines.
// ──────────────────────────────────────────────────────────────────────

import { CFG } from './physics.js';

// ── Color Palettes ────────────────────────────────────────────────────
const BIRD_COLORS = {
  outline: '#000000',
  bodyLight: '#F8D830',   // Bright yellow
  bodyDark:  '#D0A020',   // Darker yellow shade
  wing:      '#F89830',   // Orange wing
  wingDark:  '#C87020',   // Darker orange
  belly:     '#FAE8C8',   // Light cream belly
  beak:      '#FA3030',   // Red beak
  beakDark:  '#C82020',
  eye:       '#FFFFFF',
  pupil:     '#000000',
  cheek:     '#F87878',   // Rosy cheek
};

const PIPE_COLORS = {
  body:      '#73BF2E',
  outline:   '#548B20',
  highlight: '#8CD43F',
  cap:       '#73BF2E',
  capOutline:'#548B20',
  capHL:     '#8CD43F',
};

const GROUND_COLORS = {
  base:     '#DED895',
  stripe:   '#C8C070',
  edge:     '#73BF2E',
};

const MEDAL_COLORS = {
  bronze:   { fill: '#CD7F32', shine: '#E8A860' },
  silver:   { fill: '#C0C0C0', shine: '#E0E0E0' },
  gold:     { fill: '#FFD700', shine: '#FFF060' },
  platinum: { fill: '#E8E8E8', shine: '#FFFFFF', star: '#FFD700' },
  diamond:  { fill: '#00CED1', shine: '#AAFFFF', star: '#FFFFFF' },
};

// ── Pixel Font (3×5 monospaced digits) ────────────────────────────────
// Each digit is a 3×5 grid. 1 = filled pixel, 0 = empty.
const DIGIT_DATA = {
  0: [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
  1: [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1],
  2: [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1],
  3: [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
  4: [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1],
  5: [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
  6: [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1],
  7: [1,1,1, 0,0,1, 0,1,0, 0,1,0, 0,1,0],
  8: [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1],
  9: [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1],
};

// ── Large pixel font for HUD score (5×7) ─────────────────────────────
const BIG_DIGIT_DATA = {
  0: [0,1,1,1,0, 1,0,0,0,1, 1,0,0,1,1, 1,0,1,0,1, 1,1,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  1: [0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0],
  2: [0,1,1,1,0, 1,0,0,0,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0, 1,1,1,1,1],
  3: [0,1,1,1,0, 1,0,0,0,1, 0,0,0,0,1, 0,0,1,1,0, 0,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  4: [0,0,0,1,0, 0,0,1,1,0, 0,1,0,1,0, 1,0,0,1,0, 1,1,1,1,1, 0,0,0,1,0, 0,0,0,1,0],
  5: [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,0, 0,0,0,0,1, 0,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  6: [0,1,1,1,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  7: [1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0],
  8: [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
  9: [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,1,1,1,0],
};

// ── Faby Sprite Data (17×12 per frame, 3 frames) ─────────────────────
// Each frame is a 2D grid of color keys: o=outline, y=bodyLight, d=bodyDark,
// w=wing, v=wingDark, b=belly, k=beak, r=beakDark, e=eye, p=pupil, c=cheek, _=transparent
const FABY_FRAMES = [
  // Frame 0: Wings UP (rising)
  [
    '____ooooo________',
    '___oeeeppooo_____',
    '__oyyeeppooooo___',
    '_oyyyyyoooowwwo__',
    '_oyydyyyyowwwwvo_',
    'oyyydddyyowvvvo__',
    'obbydddyoooooo___',
    'obbyyyykkro______',
    '_obbbbbkkro______',
    '__obbboorro______',
    '___ooooo_________',
    '_________________',
  ],
  // Frame 1: Wings MID (glide)
  [
    '____ooooo________',
    '___oeeeppooo_____',
    '__oyyeeppooooo___',
    '_oyyyyyooo___o___',
    '_oyydyyyyowwwwo__',
    'oyyydddyyowwwwvo_',
    'obbydddyoovvvvo__',
    'obbyyyykkroooo___',
    '_obbbbbkkro______',
    '__obbboorro______',
    '___ooooo_________',
    '_________________',
  ],
  // Frame 2: Wings DOWN (falling/tired)
  [
    '____ooooo________',
    '___oeeeppooo_____',
    '__oyyeeppooooo___',
    '_oyyyyyooo___o___',
    '_oyydyyyyo___o___',
    'oyyydddyyooooo___',
    'obbydddyowwwwo___',
    'obbyyyyoowwwwvo__',
    '_obbbbbkkrvvvo___',
    '__obbbokkroooo___',
    '___ooooorro______',
    '_________________',
  ],
];

// Map character to color
const FABY_COLOR_MAP = {
  'o': BIRD_COLORS.outline,
  'y': BIRD_COLORS.bodyLight,
  'd': BIRD_COLORS.bodyDark,
  'w': BIRD_COLORS.wing,
  'v': BIRD_COLORS.wingDark,
  'b': BIRD_COLORS.belly,
  'k': BIRD_COLORS.beak,
  'r': BIRD_COLORS.beakDark,
  'e': BIRD_COLORS.eye,
  'p': BIRD_COLORS.pupil,
  'c': BIRD_COLORS.cheek,
  '_': null,
};

// ── Sprite Cache ──────────────────────────────────────────────────────
let birdCanvases = [];   // 3 offscreen canvases for bird frames
let birdMasks = [];      // Pixel masks for collision detection
let spritesCached = false;

/**
 * Initialize all sprite caches. Call once at startup.
 */
export function initSprites() {
  if (spritesCached) return;
  birdCanvases = [];
  birdMasks = [];

  for (let f = 0; f < 3; f++) {
    const offscreen = document.createElement('canvas');
    offscreen.width = CFG.BIRD_W;
    offscreen.height = CFG.BIRD_H;
    const octx = offscreen.getContext('2d');

    const mask = [];
    const frameData = FABY_FRAMES[f];

    for (let row = 0; row < CFG.BIRD_H; row++) {
      const line = frameData[row] || '';
      for (let col = 0; col < CFG.BIRD_W; col++) {
        const ch = line[col] || '_';
        const color = FABY_COLOR_MAP[ch];
        if (color) {
          octx.fillStyle = color;
          octx.fillRect(col, row, 1, 1);
          mask.push({ x: col, y: row });
        }
      }
    }

    birdCanvases.push(offscreen);
    birdMasks.push(mask);
  }
  spritesCached = true;
}

/**
 * Get the offscreen canvas for a bird frame.
 */
export function getBirdSprite(frameIndex) {
  return birdCanvases[frameIndex] || birdCanvases[0];
}

/**
 * Get the collision mask for a bird frame.
 * Returns array of {x, y} pixel positions (local to sprite).
 */
export function getBirdMask(frameIndex) {
  return birdMasks[frameIndex] || birdMasks[0];
}

/**
 * Draw a pipe (top or bottom) using fillRect calls.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge x
 * @param {number} y - Top edge y (for top pipe, this is gapTop - pipeHeight)
 * @param {number} height - Pipe body height
 * @param {boolean} flipped - true for top pipe (cap at bottom), false for bottom pipe (cap at top)
 * @param {object} colors - Optional custom pipe colors for world theming
 */
export function drawPipe(ctx, x, y, height, flipped, colors = PIPE_COLORS) {
  const bw = CFG.PIPE_BODY_W;
  const cw = CFG.PIPE_CAP_W;
  const ch = CFG.PIPE_CAP_H;
  const capOffsetX = (cw - bw) / 2;

  // Body outline
  ctx.fillStyle = colors.outline;
  ctx.fillRect(x - 1, y, bw + 2, height);

  // Body fill
  ctx.fillStyle = colors.body;
  ctx.fillRect(x + 1, y, bw - 2, height);

  // Body highlight (left strip)
  ctx.fillStyle = colors.highlight;
  ctx.fillRect(x + 2, y, 4, height);

  // Cap
  let capY;
  if (flipped) {
    // Top pipe — cap at the bottom of the pipe body
    capY = y + height - ch;
  } else {
    // Bottom pipe — cap at the top of the pipe body
    capY = y;
  }

  // Cap outline
  ctx.fillStyle = colors.capOutline;
  ctx.fillRect(x - capOffsetX - 1, capY, cw + 2, ch);

  // Cap fill
  ctx.fillStyle = colors.cap;
  ctx.fillRect(x - capOffsetX + 1, capY, cw - 2, ch - 1);

  // Cap highlight (top 2px of cap)
  ctx.fillStyle = colors.capHL;
  ctx.fillRect(x - capOffsetX + 2, capY + 1, cw - 4, 2);
}

/**
 * Draw ground with alternating stripes.
 */
export function drawGround(ctx, scrollX, colors = GROUND_COLORS) {
  const groundY = CFG.CANVAS_H - CFG.GROUND_H;

  // Green edge line
  ctx.fillStyle = colors.edge;
  ctx.fillRect(0, groundY, CFG.CANVAS_W, 4);

  // Ground base
  ctx.fillStyle = colors.base;
  ctx.fillRect(0, groundY + 4, CFG.CANVAS_W, CFG.GROUND_H - 4);

  // Alternating 16px stripes
  ctx.fillStyle = colors.stripe;
  const stripeW = 16;
  const offset = ((scrollX % (stripeW * 2)) + stripeW * 2) % (stripeW * 2);
  for (let sx = -stripeW * 2 + offset; sx < CFG.CANVAS_W + stripeW; sx += stripeW * 2) {
    // Offset stripes so they alternate
    ctx.fillRect(sx, groundY + 4, stripeW, CFG.GROUND_H - 4);
  }
}

/**
 * Draw a number using the big pixel font (5×7 per digit).
 * @param {number} pixelSize - Size of each "pixel" on screen
 */
export function drawBigNumber(ctx, num, centerX, y, pixelSize = 2, color = '#FFFFFF', shadow = '#000000') {
  const digits = String(num).split('').map(Number);
  const digitW = 5 * pixelSize;
  const gap = pixelSize;
  const totalW = digits.length * digitW + (digits.length - 1) * gap;
  let startX = centerX - totalW / 2;

  for (const d of digits) {
    const data = BIG_DIGIT_DATA[d];
    if (!data) continue;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (data[row * 5 + col]) {
          // Shadow
          if (shadow) {
            ctx.fillStyle = shadow;
            ctx.fillRect(startX + col * pixelSize + 1, y + row * pixelSize + 1, pixelSize, pixelSize);
          }
          // Fill
          ctx.fillStyle = color;
          ctx.fillRect(startX + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    startX += digitW + gap;
  }
}

/**
 * Draw small number (3×5 font, for panels etc.).
 */
export function drawSmallNumber(ctx, num, x, y, pixelSize = 1, color = '#FFFFFF') {
  const digits = String(num).split('').map(Number);
  let cx = x;
  for (const d of digits) {
    const data = DIGIT_DATA[d];
    if (!data) continue;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if (data[row * 3 + col]) {
          ctx.fillStyle = color;
          ctx.fillRect(cx + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    cx += 4 * pixelSize;
  }
}

/**
 * Draw a medal based on score (pipe clears, not points).
 */
export function drawMedal(ctx, score, cx, cy, size = 16) {
  let tier;
  if (score >= 50)      tier = 'diamond';
  else if (score >= 30) tier = 'platinum';
  else if (score >= 20) tier = 'gold';
  else if (score >= 10) tier = 'silver';
  else                  tier = 'bronze';

  const c = MEDAL_COLORS[tier];
  const r = size / 2;

  // Circle
  ctx.fillStyle = c.fill;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Outline
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Shine highlight
  ctx.fillStyle = c.shine;
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Star for platinum/diamond
  if (tier === 'platinum' || tier === 'diamond') {
    ctx.fillStyle = c.star;
    drawPixelStar(ctx, cx, cy, r * 0.5);
  }
}

function drawPixelStar(ctx, cx, cy, size) {
  const s = Math.max(1, Math.floor(size / 3));
  ctx.fillRect(cx - s, cy - s * 2, s * 2, s);  // top
  ctx.fillRect(cx - s * 2, cy - s, s * 4, s * 2); // middle wide
  ctx.fillRect(cx - s, cy + s, s * 2, s);       // bottom
}

/**
 * Draw simple pixel-art clouds for the background.
 */
export function drawClouds(ctx, scrollX, color = '#FFFFFF') {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;

  // A few simple cloud shapes at fixed offsets, wrapped by scrollX
  const clouds = [
    { x: 30, y: 60, w: 40, h: 12 },
    { x: 140, y: 40, w: 55, h: 14 },
    { x: 250, y: 80, w: 35, h: 10 },
    { x: 380, y: 55, w: 48, h: 13 },
  ];

  const wrapW = CFG.CANVAS_W + 200;
  for (const cl of clouds) {
    let cx = ((cl.x - scrollX * CFG.CLOUD_SPEED_RATIO) % wrapW + wrapW) % wrapW - 80;

    // Draw rounded-ish cloud with overlapping rects
    ctx.fillRect(cx + 4, cl.y, cl.w - 8, cl.h);
    ctx.fillRect(cx, cl.y + 3, cl.w, cl.h - 6);
    // Bumps
    ctx.fillRect(cx + cl.w * 0.2, cl.y - 4, cl.w * 0.3, 6);
    ctx.fillRect(cx + cl.w * 0.5, cl.y - 2, cl.w * 0.25, 4);
  }
  ctx.globalAlpha = 1.0;
}

/**
 * Draw a simple city silhouette in the background.
 */
export function drawCitySilhouette(ctx, scrollX, color = '#3C6E47') {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.4;
  const groundY = CFG.CANVAS_H - CFG.GROUND_H;

  // Simple building silhouette rectangles
  const buildings = [
    { x: 10, w: 20, h: 50 },
    { x: 35, w: 14, h: 70 },
    { x: 55, w: 22, h: 45 },
    { x: 90, w: 18, h: 65 },
    { x: 115, w: 25, h: 55 },
    { x: 150, w: 12, h: 80 },
    { x: 170, w: 30, h: 40 },
    { x: 210, w: 16, h: 60 },
    { x: 235, w: 22, h: 50 },
    { x: 265, w: 20, h: 72 },
    { x: 300, w: 18, h: 44 },
    { x: 325, w: 24, h: 62 },
  ];

  const wrapW = 360;
  for (const b of buildings) {
    let bx = ((b.x - scrollX * CFG.CLOUD_SPEED_RATIO) % wrapW + wrapW) % wrapW - 30;
    ctx.fillRect(bx, groundY - b.h, b.w, b.h);
  }
  ctx.globalAlpha = 1.0;
}

/**
 * Draw the "FLAP.AI" pixel-art title logo using fillRect blocks.
 */
export function drawTitle(ctx, y) {
  const s = 3; // pixel size
  ctx.fillStyle = '#FFFFFF';

  // Simple blocky letters: F L A P . A I
  const cx = CFG.CANVAS_W / 2;
  const letterW = 4 * s;
  const gap = s;
  const letters = 'FLAP.AI';
  const totalW = letters.length * (letterW + gap) - gap;
  let x = cx - totalW / 2;

  // Shadow
  ctx.fillStyle = '#000000';
  drawTitleText(ctx, x + 1, y + 1, s);
  // Main
  ctx.fillStyle = '#FFFFFF';
  drawTitleText(ctx, x, y, s);
}

function drawTitleText(ctx, startX, y, s) {
  let x = startX;
  // F
  fillBlock(ctx, x, y, 4, 1, s);
  fillBlock(ctx, x, y + s, 1, 1, s);
  fillBlock(ctx, x, y + 2*s, 3, 1, s);
  fillBlock(ctx, x, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 1, 1, s);
  x += 5 * s;
  // L
  fillBlock(ctx, x, y, 1, 1, s);
  fillBlock(ctx, x, y + s, 1, 1, s);
  fillBlock(ctx, x, y + 2*s, 1, 1, s);
  fillBlock(ctx, x, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 4, 1, s);
  x += 5 * s;
  // A
  fillBlock(ctx, x + s, y, 2, 1, s);
  fillBlock(ctx, x, y + s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + s, 1, 1, s);
  fillBlock(ctx, x, y + 2*s, 4, 1, s);
  fillBlock(ctx, x, y + 3*s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + 4*s, 1, 1, s);
  x += 5 * s;
  // P
  fillBlock(ctx, x, y, 3, 1, s);
  fillBlock(ctx, x, y + s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + s, 1, 1, s);
  fillBlock(ctx, x, y + 2*s, 3, 1, s);
  fillBlock(ctx, x, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 1, 1, s);
  x += 5 * s;
  // .
  fillBlock(ctx, x + s, y + 4*s, 1, 1, s);
  x += 3 * s;
  // A
  fillBlock(ctx, x + s, y, 2, 1, s);
  fillBlock(ctx, x, y + s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + s, 1, 1, s);
  fillBlock(ctx, x, y + 2*s, 4, 1, s);
  fillBlock(ctx, x, y + 3*s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 1, 1, s);
  fillBlock(ctx, x + 3*s, y + 4*s, 1, 1, s);
  x += 5 * s;
  // I
  fillBlock(ctx, x, y, 3, 1, s);
  fillBlock(ctx, x + s, y + s, 1, 1, s);
  fillBlock(ctx, x + s, y + 2*s, 1, 1, s);
  fillBlock(ctx, x + s, y + 3*s, 1, 1, s);
  fillBlock(ctx, x, y + 4*s, 3, 1, s);
}

function fillBlock(ctx, x, y, w, h, s) {
  ctx.fillRect(x, y, w * s, h * s);
}

// Export colors for world theming
export { PIPE_COLORS, GROUND_COLORS, BIRD_COLORS, MEDAL_COLORS };
