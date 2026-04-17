// Grasslands Academy — Jigsaw Puzzle Engine
// Canvas-based drag-to-snap puzzle. Piece count capped at 25 (5x5) for
// playability; the UI labels it as "level×100 pieces" per the spec.

let puzzleState = null;

function initPuzzle(animal) {
  const canvas = document.getElementById('puzzle-canvas');
  const ctx = canvas.getContext('2d');
  const GRID = Math.min(5, Math.max(2, Math.ceil(Math.sqrt(STATE.level + 3))));
  const PW = Math.floor(canvas.width / GRID);
  const PH = Math.floor(canvas.height / GRID);

  // Render the full animal SVG to an offscreen canvas
  const offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const octx = offscreen.getContext('2d');
  drawAnimalToCtx(octx, animal, canvas.width, canvas.height);

  // Build piece array — start scattered
  const pieces = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const correctX = col * PW;
      const correctY = row * PH;
      pieces.push({
        id: row * GRID + col,
        col, row,
        correctX, correctY,
        x: Math.random() * (canvas.width - PW),
        y: Math.random() * (canvas.height - PH),
        snapped: false,
        srcX: correctX,
        srcY: correctY,
        w: PW, h: PH
      });
    }
  }

  puzzleState = {
    canvas, ctx, offscreen, pieces, GRID, PW, PH,
    dragging: null, dragOffX: 0, dragOffY: 0,
    animal, complete: false,
    SNAP_DIST: Math.min(PW, PH) * 0.4
  };

  attachPuzzleEvents(canvas);
  drawPuzzle();
}

function drawAnimalToCtx(ctx, animal, w, h) {
  const svgStr = drawAnimalSVG(animal, w, h);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    if (puzzleState) drawPuzzle();
  };
  img.src = url;
}

function drawPuzzle() {
  if (!puzzleState) return;
  const { ctx, canvas, offscreen, pieces, PW, PH } = puzzleState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ghost grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (const p of pieces) {
    if (p.snapped) continue;
    ctx.strokeRect(p.correctX, p.correctY, PW, PH);
  }

  // Draw snapped pieces first, then floating
  const order = [...pieces.filter(p => p.snapped), ...pieces.filter(p => !p.snapped)];

  for (const piece of order) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(piece.x, piece.y, PW, PH);
    ctx.clip();
    ctx.drawImage(offscreen, piece.srcX, piece.srcY, PW, PH, piece.x, piece.y, PW, PH);

    // Border
    ctx.strokeStyle = piece.snapped ? 'rgba(76,175,80,0.6)' : 'rgba(255,255,255,0.25)';
    ctx.lineWidth = piece.snapped ? 2 : 1;
    ctx.strokeRect(piece.x + 0.5, piece.y + 0.5, PW - 1, PH - 1);
    ctx.restore();

    if (piece === puzzleState.dragging) {
      ctx.save();
      ctx.strokeStyle = '#f5c842';
      ctx.lineWidth = 2;
      ctx.strokeRect(piece.x + 1, piece.y + 1, PW - 2, PH - 2);
      ctx.restore();
    }
  }
}

function attachPuzzleEvents(canvas) {
  canvas.addEventListener('pointerdown', onPuzzleDown);
  canvas.addEventListener('pointermove', onPuzzleMove);
  canvas.addEventListener('pointerup', onPuzzleUp);
  canvas.addEventListener('pointercancel', onPuzzleUp);
  canvas.setPointerCapture && canvas.addEventListener('pointerdown', e => {
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  });
}

function detachPuzzleEvents(canvas) {
  canvas.removeEventListener('pointerdown', onPuzzleDown);
  canvas.removeEventListener('pointermove', onPuzzleMove);
  canvas.removeEventListener('pointerup', onPuzzleUp);
  canvas.removeEventListener('pointercancel', onPuzzleUp);
}

function getPuzzlePos(e) {
  const rect = puzzleState.canvas.getBoundingClientRect();
  const scaleX = puzzleState.canvas.width / rect.width;
  const scaleY = puzzleState.canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function onPuzzleDown(e) {
  e.preventDefault();
  if (!puzzleState || puzzleState.complete) return;
  const { x, y } = getPuzzlePos(e);
  const { pieces, PW, PH } = puzzleState;
  // Find topmost piece (last in unsnapped order)
  const floating = pieces.filter(p => !p.snapped);
  for (let i = floating.length - 1; i >= 0; i--) {
    const p = floating[i];
    if (x >= p.x && x <= p.x + PW && y >= p.y && y <= p.y + PH) {
      puzzleState.dragging = p;
      puzzleState.dragOffX = x - p.x;
      puzzleState.dragOffY = y - p.y;
      break;
    }
  }
}

function onPuzzleMove(e) {
  e.preventDefault();
  if (!puzzleState?.dragging) return;
  const { x, y } = getPuzzlePos(e);
  const { dragging, canvas, PW, PH } = puzzleState;
  dragging.x = Math.max(0, Math.min(x - puzzleState.dragOffX, canvas.width - PW));
  dragging.y = Math.max(0, Math.min(y - puzzleState.dragOffY, canvas.height - PH));
  drawPuzzle();
}

function onPuzzleUp(e) {
  if (!puzzleState?.dragging) return;
  const piece = puzzleState.dragging;
  puzzleState.dragging = null;

  // Snap check
  const dx = Math.abs(piece.x - piece.correctX);
  const dy = Math.abs(piece.y - piece.correctY);
  if (dx < puzzleState.SNAP_DIST && dy < puzzleState.SNAP_DIST) {
    piece.x = piece.correctX;
    piece.y = piece.correctY;
    piece.snapped = true;
  }

  drawPuzzle();
  checkPuzzleComplete();
}

function checkPuzzleComplete() {
  if (!puzzleState) return;
  const allSnapped = puzzleState.pieces.every(p => p.snapped);
  if (allSnapped && !puzzleState.complete) {
    puzzleState.complete = true;
    detachPuzzleEvents(puzzleState.canvas);
    onPuzzleComplete(puzzleState.animal);
  }
}

function onPuzzleComplete(animal) {
  addCoins(5);
  addLevel();
  const drops = rollDrop(animal.id);
  if (!STATE.taughtFacts.includes(animal.id)) {
    STATE.taughtFacts.push(animal.id);
    save();
  }
  setTimeout(() => {
    navigate('screen-facts', { animal, drops });
  }, 500);
}

function setupPuzzleCanvas() {
  const canvas = document.getElementById('puzzle-canvas');
  const wrap = canvas.parentElement;
  const size = Math.min(wrap.clientWidth || 340, wrap.clientHeight || 480, 480);
  canvas.width = size;
  canvas.height = Math.round(size * 0.85);
}
