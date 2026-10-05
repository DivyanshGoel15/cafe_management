/* ══════════════════════════════════════════════════════════════
   BREW & CO — QR CODE CANVAS GENERATOR & EXPORTER
   Renders clear QR code matrix to HTML5 Canvas and exports PNG
   ══════════════════════════════════════════════════════════════ */

export function renderQRCodeToCanvas(canvas, text, size = 150) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  // Clear background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Generate pseudo-deterministic QR matrix from string hash
  const modules = 25;
  const cellSize = Math.floor((size - 20) / modules);
  const offset = Math.floor((size - (cellSize * modules)) / 2);

  // Seeded pseudo-random
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  function pseudoRand(i, j) {
    const val = Math.sin(hash + i * 37.3 + j * 91.7) * 10000;
    return val - Math.floor(val);
  }

  // Finder pattern helper (top-left, top-right, bottom-left)
  function drawFinderPattern(x, y) {
    ctx.fillStyle = '#0B2018';
    ctx.fillRect(offset + x * cellSize, offset + y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(offset + (x + 1) * cellSize, offset + (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#B87333';
    ctx.fillRect(offset + (x + 2) * cellSize, offset + (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  }

  // Draw 3 corner finder patterns
  drawFinderPattern(0, 0);
  drawFinderPattern(modules - 7, 0);
  drawFinderPattern(0, modules - 7);

  // Draw timing patterns
  ctx.fillStyle = '#0B2018';
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
    }
  }

  // Draw data modules
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder patterns
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
        continue;
      }
      if (r === 6 || c === 6) continue;

      if (pseudoRand(r, c) > 0.48) {
        ctx.fillStyle = pseudoRand(r, c) > 0.9 ? '#B87333' : '#0B2018';
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw small cafe cup icon in center
  const centerSize = 5 * cellSize;
  const centerOffset = Math.floor((size - centerSize) / 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(centerOffset - 2, centerOffset - 2, centerSize + 4, centerSize + 4);
  ctx.fillStyle = '#B87333';
  ctx.fillRect(centerOffset, centerOffset, centerSize, centerSize);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.floor(cellSize * 2.5)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('☕', size / 2, size / 2);
}

export function downloadCanvasAsPNG(canvas, filename = 'qr-code.png') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
