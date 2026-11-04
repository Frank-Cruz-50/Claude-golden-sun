// Weapons drawn into material rows. 'behind' mode only fills transparent
// pixels (so a slung weapon peeks out around the body); 'front' draws over.
export function stamp(rows, points, mode = 'front') {
  const out = rows.map((r) => [...r]);
  for (const [x, y, ch] of points) {
    if (y < 0 || y >= out.length || x < 0 || x >= out[0].length) continue;
    if (mode === 'behind' && out[y][x] !== '.') continue;
    out[y][x] = ch;
  }
  return out.map((r) => r.join(''));
}

function line(x0, y0, x1, y1) {
  const pts = [];
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) pts.push([Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n)]);
  return pts;
}

/**
 * A sword from hilt (x0,y0) to tip (x1,y1). sheathed → leather scabbard 'v',
 * otherwise a steel blade 'e'. Guard 'g' crosses perpendicular; grip 'l'.
 */
export function sword(x0, y0, x1, y1, { sheathed = true, thick = true } = {}) {
  const pts = line(x0, y0, x1, y1);
  const out = [];
  const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0);
  pts.forEach(([x, y], i) => {
    if (i === 0) out.push([x, y, 'g']); // pommel
    else if (i <= 3) out.push([x, y, 'l']); // grip
    else if (i === 4) {
      out.push([x, y, 'g'], [x + dy, y - dx, 'g'], [x - dy, y + dx, 'g'], [x + 2 * dy, y - 2 * dx, 'g'], [x - 2 * dy, y + 2 * dx, 'g']);
    } else {
      const ch = sheathed ? (i === pts.length - 1 ? 'g' : 'v') : 'e';
      out.push([x, y, ch]);
      if (thick && i < pts.length - 1) out.push([x + 1, y, ch]); // 2px thick
    }
  });
  return out;
}

/** A frying pan: round iron pan centred at (cx,cy) with a handle toward (hx,hy). */
export function pan(cx, cy, r, hx, hy) {
  const out = [];
  for (const [x, y] of line(cx, cy, hx, hy)) out.push([x, y, 'l']);
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + r * 0.6) out.push([x, y, 'f']);
  return out;
}
