/* Loewen House Plan — renderer, key, editing, persistence. Depends on plan-data.js (window.PLAN). */
(function () {
  const P = window.PLAN;
  const PF = 24;                         // px per foot
  const VX0 = -6, VY0 = -9, VW = 67, VH = 54;   // viewBox in feet
  const X = f => +((f - VX0) * PF).toFixed(1);
  const Y = f => +((f - VY0) * PF).toFixed(1);
  const FX = px => px / PF + VX0, FY = px => px / PF + VY0;
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#1f2833', NEW = '#2a78d6', NEWF = '#d7e7fb', OLD = '#77766f', OLDF = '#efeee9', WIRE = '#7b52ab';
  const TINT = { bed: '#dbe7f7', bath: '#cfecf0', kitchen: '#dcefcf', living: '#fbe6c4', hall: '#e9e4f4', garage: '#e3dfd7', porch: '#e8ddcb', clo: '#efece4', util: '#e6eaee' };
  const catById = Object.fromEntries(P.cats.map(c => [c.id, c]));

  const svg = document.getElementById('plan');
  svg.setAttribute('viewBox', `0 0 ${VW * PF} ${VH * PF}`);
  const world = el('g', { id: 'world' }, svg);
  const L = {};
  ['grid', 'yard', 'rooms', 'fixtures', 'lighting', 'duct', 'walls', 'labels', 'dims', 'devices'].forEach(k => { L[k] = el('g', { id: 'L-' + k, class: 'layer' }, world); });

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function T(x, y, s, o = {}, parent) {
    const t = el('text', { x, y, 'font-size': o.size || 10, 'text-anchor': o.anchor || 'middle', 'font-weight': o.weight || 400, fill: o.fill || INK, 'font-family': o.family || 'var(--body)', 'letter-spacing': o.ls || null, transform: o.rot ? `rotate(${o.rot} ${x} ${y})` : null, 'dominant-baseline': o.base || null, class: o.cls || null }, parent);
    t.textContent = s; return t;
  }
  const rectPx = r => ({ x: X(r[0]), y: Y(r[1]), w: +(r[2] * PF).toFixed(1), h: +(r[3] * PF).toFixed(1) });
  const pts = poly => poly.map(p => `${X(p[0])},${Y(p[1])}`).join(' ');

  /* ---------- grid ---------- */
  (function grid() {
    for (let f = Math.ceil(VX0); f < VX0 + VW; f++) el('line', { x1: X(f), y1: 0, x2: X(f), y2: VH * PF, stroke: f % 5 ? '#eef0f3' : '#e1e5ea', 'stroke-width': f % 5 ? 0.6 : 0.9 }, L.grid);
    for (let f = Math.ceil(VY0); f < VY0 + VH; f++) el('line', { x1: 0, y1: Y(f), x2: VW * PF, y2: Y(f), stroke: f % 5 ? '#eef0f3' : '#e1e5ea', 'stroke-width': f % 5 ? 0.6 : 0.9 }, L.grid);
  })();

  /* ---------- yard ---------- */
  P.yard.forEach(y => {
    if (y.kind === 'deck') {
      el('polygon', { points: pts(y.poly), fill: '#f3ecdf', stroke: '#b59a6a', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' }, L.yard);
      for (let i = 1; i < 12; i++) { const yy = Y(y.poly[0][1]) + i * 18; el('line', { x1: X(y.poly[0][0]) + 3, y1: yy, x2: X(y.poly[1][0]) - 3, y2: yy, stroke: '#e0d3bd', 'stroke-width': 0.7 }, L.yard); }
      T(X(y.poly[0][0]) + 14, Y(y.poly[2][1]) - 10, y.label, { anchor: 'start', size: 11, weight: 700, family: 'var(--display)', fill: '#8a6d3b', ls: '.08em' }, L.yard);
      T(X(y.poly[0][0]) + 14, Y(y.poly[2][1]) - 0, y.sub, { anchor: 'start', size: 7.5, fill: '#8a6d3b' }, L.yard);
      // steps at the west end
      for (let i = 0; i < 4; i++) el('rect', { x: X(y.poly[0][0]) - 14 - i * 6, y: Y(y.poly[0][1]) + 40, width: 6, height: 40, fill: '#fff', stroke: '#b59a6a', 'stroke-width': 0.8 }, L.yard);
    } else if (y.kind === 'drive' || y.kind === 'walk') {
      el('polygon', { points: pts(y.poly), fill: '#eceef0', stroke: '#c9ced4', 'stroke-width': 1 }, L.yard);
      T(X(y.poly[0][0]) + (y.kind === 'drive' ? 8 : 0) + (y.kind === 'walk' ? 66 : 0), Y(y.poly[0][1]) + (y.kind === 'drive' ? 16 : -26), y.label, { anchor: y.kind === 'drive' ? 'start' : 'middle', size: y.kind === 'drive' ? 9 : 7, fill: '#7a8087', family: 'var(--display)', ls: '.1em', weight: 600 }, L.yard);
    } else if (y.kind === 'box') {
      const r = rectPx(y.rect);
      el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: y.color, 'stroke-width': 2, rx: 2 }, L.yard);
      T(r.x + r.w / 2, r.y + r.h - 12, y.label, { size: 7.2, weight: 700, fill: y.color, family: 'var(--display)', ls: '.05em' }, L.yard);
      T(r.x + r.w / 2, r.y + r.h - 4, y.sub, { size: 6, fill: y.color }, L.yard);
    } else if (y.kind === 'firepit') {
      el('circle', { cx: X(y.at[0]), cy: Y(y.at[1]), r: y.r * PF, fill: '#f5eee4', stroke: '#b59a6a', 'stroke-width': 1.4 }, L.yard);
      el('circle', { cx: X(y.at[0]), cy: Y(y.at[1]), r: y.r * PF * 0.55, fill: 'none', stroke: '#b59a6a', 'stroke-width': 0.8, 'stroke-dasharray': '3 3' }, L.yard);
      T(X(y.at[0]), Y(y.at[1]) + y.r * PF + 11, y.label, { size: 7.5, fill: '#8a6d3b' }, L.yard);
    } else if (y.kind === 'mast') {
      const r = rectPx(y.rect);
      el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: '#455a64', 'stroke-width': 1.4, 'stroke-dasharray': '5 3', rx: 3 }, L.yard);
      T(r.x + r.w / 2, r.y + 12, y.label, { size: 8, weight: 700, fill: '#455a64', family: 'var(--display)', ls: '.08em' }, L.yard);
      T(r.x + r.w / 2, r.y + r.h - 5, y.sub, { size: 5.6, fill: '#455a64' }, L.yard);
    } else if (y.kind === 'steps') {
      const r = rectPx(y.rect);
      el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: '#b59a6a', 'stroke-width': 1 }, L.yard);
      for (let i = 1; i < 6; i++) el('line', { x1: r.x, y1: r.y + i * r.h / 6, x2: r.x + r.w, y2: r.y + i * r.h / 6, stroke: '#b59a6a', 'stroke-width': .8 }, L.yard);
      T(r.x + r.w / 2, r.y + r.h + 10, y.label, { size: 6.5, fill: '#8a6d3b' }, L.yard);
    } else if (y.kind === 'street') {
      el('line', { x1: X(y.seg[0]), y1: Y(y.seg[1]), x2: X(y.seg[2]), y2: Y(y.seg[3]), stroke: '#c9ced4', 'stroke-width': 2 }, L.yard);
      T(X(y.seg[0]) + 30, Y(y.seg[1]) - 6, y.label, { anchor: 'start', size: 8, fill: '#7a8087', family: 'var(--display)', ls: '.14em', weight: 600 }, L.yard);
    } else if (y.kind === 'neighbor') {
      // orientation marker only - which way the nearest houses are. Drawn light so it never
      // competes with the plan itself.
      T(X(y.at[0]), Y(y.at[1]), y.label + (y.sub ? '  · ' + y.sub : ''),
        { anchor: 'middle', size: 7, fill: '#9aa0a6', family: 'var(--display)', ls: '.14em', weight: 600, rot: y.rot }, L.yard);
    } else if (y.kind === 'crawl') {
      el('rect', { x: X(y.seg[0]), y: Y(y.seg[1]) - 4, width: (y.seg[2] - y.seg[0]) * PF, height: 8, fill: '#fff', stroke: INK, 'stroke-width': 1.2 }, L.labels);
      T(X(y.seg[0]) + (y.seg[2] - y.seg[0]) * PF / 2, Y(y.seg[1]) + 24, y.label, { size: 6.2, fill: '#5a636d' }, L.labels);
    }
  });

  /* ---------- rooms ---------- */
  P.rooms.forEach(r => {
    const fill = TINT[r.kind] || '#fff';
    let cx, cy;
    if (r.poly) { el('polygon', { points: pts(r.poly), fill, stroke: INK, 'stroke-width': 2.2, 'stroke-linejoin': 'miter' }, L.rooms); const b = r.label; cx = X(b[0]); cy = Y(b[1]); }
    else { const b = rectPx(r.rect); el('rect', { x: b.x, y: b.y, width: b.w, height: b.h, fill, stroke: INK, 'stroke-width': r.small ? 1.4 : 2.2 }, L.rooms); cx = r.label ? X(r.label[0]) : b.x + b.w / 2; cy = r.label ? Y(r.label[1]) : b.y + b.h / 2; }
    if (r.inferred) { const b = r.poly ? null : rectPx(r.rect); if (b) el('rect', { x: b.x + 3, y: b.y + 3, width: b.w - 6, height: b.h - 6, fill: 'none', stroke: '#c05621', 'stroke-width': .8, 'stroke-dasharray': '3 3' }, L.rooms); }
    if (!r.name) return;
    if (r.small) T(cx, cy + 3, r.name, { size: r.name.length > 4 ? 6.4 : 7, fill: '#5a636d', family: 'var(--display)', ls: '.06em', weight: 600 }, L.labels);
    else {
      T(cx, cy - (r.sub ? 2 : -4), r.name, { size: 12.5, weight: 700, family: 'var(--display)', ls: '.09em' }, L.labels);
      if (r.sub) T(cx, cy + 11, r.sub, { size: 7.4, fill: '#5a636d' }, L.labels);
    }
  });
  // outline (exterior walls, heavier)
  el('polygon', { points: pts(P.outline), fill: 'none', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'miter' }, L.walls);
  // dashed / open walls
  P.dashedWalls.forEach(d => {
    el('line', { x1: X(d.seg[0]), y1: Y(d.seg[1]), x2: X(d.seg[2]), y2: Y(d.seg[3]), stroke: '#fff', 'stroke-width': 4 }, L.walls);
    el('line', { x1: X(d.seg[0]), y1: Y(d.seg[1]), x2: X(d.seg[2]), y2: Y(d.seg[3]), stroke: INK, 'stroke-width': 1.3, 'stroke-dasharray': '6 5' }, L.walls);
    const mx = (X(d.seg[0]) + X(d.seg[2])) / 2, my = (Y(d.seg[1]) + Y(d.seg[3])) / 2, vert = d.seg[0] === d.seg[2];
    T(vert ? mx - 6 : mx, vert ? my : my - 5, d.label, { size: 6.2, fill: '#5a636d', rot: vert ? -90 : 0 }, L.labels);
  });
  // half walls (a real wall, ~42 in high)
  (P.halfWalls || []).forEach(d => {
    el('line', { x1: X(d.seg[0]), y1: Y(d.seg[1]), x2: X(d.seg[2]), y2: Y(d.seg[3]), stroke: INK, 'stroke-width': 5 }, L.walls);
    el('line', { x1: X(d.seg[0]), y1: Y(d.seg[1]), x2: X(d.seg[2]), y2: Y(d.seg[3]), stroke: '#fff', 'stroke-width': 1.6, 'stroke-dasharray': '3 3' }, L.walls);
    const vert = d.seg[0] === d.seg[2];
    T(X(d.seg[0]) + (vert ? -7 : 0), (Y(d.seg[1]) + Y(d.seg[3])) / 2, d.label, { size: 6, fill: '#5a636d', rot: vert ? -90 : 0 }, L.labels);
  });
  // doors
  P.doors.forEach(d => {
    el('line', { x1: X(d.gap[0]), y1: Y(d.gap[1]), x2: X(d.gap[2]), y2: Y(d.gap[3]), stroke: '#fff', 'stroke-width': 8 }, L.walls);
    const r = d.r * PF;
    el('path', { d: `M ${X(d.a[0])} ${Y(d.a[1])} A ${r} ${r} 0 0 ${d.sweep} ${X(d.b[0])} ${Y(d.b[1])}`, fill: 'none', stroke: '#8a3b2a', 'stroke-width': 1.2 }, L.walls);
    // the door leaf: from hinge toward the arc's start tangent
    const dx = X(d.b[0]) - X(d.a[0]), dy = Y(d.b[1]) - Y(d.a[1]);
    const leaf = d.sweep ? [-dy, dx] : [dy, -dx];
    el('line', { x1: X(d.a[0]), y1: Y(d.a[1]), x2: X(d.a[0]) + leaf[0], y2: Y(d.a[1]) + leaf[1], stroke: '#8a3b2a', 'stroke-width': 2 }, L.walls);
    if (d.label) T((X(d.a[0]) + X(d.b[0])) / 2, (Y(d.a[1]) + Y(d.b[1])) / 2 + (d.id === 'front' ? 30 : 14), d.label, { size: 6.4, weight: 700, fill: '#8a3b2a', family: 'var(--display)', ls: '.08em' }, L.labels);
  });
  P.bigDoors.forEach(d => {
    const x1 = X(d.seg[0]), y1 = Y(d.seg[1]), x2 = X(d.seg[2]), y2 = Y(d.seg[3]);
    el('line', { x1, y1, x2, y2, stroke: '#fff', 'stroke-width': 9 }, L.walls);
    if (d.kind === 'overhead') {
      el('line', { x1, y1, x2, y2, stroke: '#8a3b2a', 'stroke-width': 2.4 }, L.walls);
      for (let i = 0; i < 5; i++) el('line', { x1: x1 + 4 + i * (x2 - x1 - 8) / 4, y1: y1 - 3, x2: x1 + 4 + i * (x2 - x1 - 8) / 4, y2: y1 + 3, stroke: '#8a3b2a', 'stroke-width': 1 }, L.walls);
      T((x1 + x2) / 2, y1 - 8, d.label, { size: 7, weight: 700, fill: '#8a3b2a', family: 'var(--display)', ls: '.1em' }, L.labels);
    } else {
      el('line', { x1, y1: y1 - 2, x2: (x1 + x2) / 2 + 4, y2: y1 - 2, stroke: '#8a3b2a', 'stroke-width': 2 }, L.walls);
      el('line', { x1: (x1 + x2) / 2 - 4, y1: y1 + 2, x2, y2: y1 + 2, stroke: '#8a3b2a', 'stroke-width': 2 }, L.walls);
      T((x1 + x2) / 2, y1 + 13, d.label, { size: 6.2, fill: '#8a3b2a' }, L.labels);
    }
  });
  // windows
  P.windows.forEach(w => {
    const x1 = X(w.seg[0]), y1 = Y(w.seg[1]), x2 = X(w.seg[2]), y2 = Y(w.seg[3]);
    el('line', { x1, y1, x2, y2, stroke: '#fff', 'stroke-width': 7 }, L.walls);
    el('line', { x1, y1, x2, y2, stroke: '#2f6db5', 'stroke-width': 1.2 }, L.walls);
    el('line', { x1, y1: y1 - 2.4, x2, y2: y2 - 2.4, stroke: '#2f6db5', 'stroke-width': 1 }, L.walls);
    el('line', { x1, y1: y1 + 2.4, x2, y2: y2 + 2.4, stroke: '#2f6db5', 'stroke-width': 1 }, L.walls);
    if (w.seg[0] === w.seg[2]) { T(x1 + 12, (y1 + y2) / 2, w.label, { size: 6, fill: '#2f6db5', rot: -90 }, L.labels); return; }
    const below = w.seg[1] > 10;
    T((x1 + x2) / 2, y1 + (below ? 13 : -9), w.label, { size: 6, fill: '#2f6db5' }, L.labels);
  });

  /* ---------- fixtures ---------- */
  const FX_STROKE = '#9aa3ad';
  P.fixtures.forEach(f => {
    const g = el('g', { class: 'fx' }, L.fixtures);
    const line = a => el('line', { x1: a[0], y1: a[1], x2: a[2], y2: a[3], stroke: FX_STROKE, 'stroke-width': 0.9 }, g);
    if (f.rect) {
      const r = rectPx(f.rect);
      if (f.kind === 'bed') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1, rx: 3 }, g);
        if (f.head === 'w') { el('rect', { x: r.x, y: r.y, width: 10, height: r.h, fill: '#f2f2ef', stroke: FX_STROKE, 'stroke-width': .8 }, g); el('rect', { x: r.x + 14, y: r.y + 6, width: 18, height: r.h / 2 - 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); el('rect', { x: r.x + 14, y: r.y + r.h / 2 + 3, width: 18, height: r.h / 2 - 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); }
        else if (f.head === 'e') { el('rect', { x: r.x + r.w - 10, y: r.y, width: 10, height: r.h, fill: '#f2f2ef', stroke: FX_STROKE, 'stroke-width': .8 }, g); el('rect', { x: r.x + r.w - 32, y: r.y + 6, width: 18, height: r.h / 2 - 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); el('rect', { x: r.x + r.w - 32, y: r.y + r.h / 2 + 3, width: 18, height: r.h / 2 - 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); }
        else { el('rect', { x: r.x, y: r.y, width: r.w, height: 10, fill: '#f2f2ef', stroke: FX_STROKE, 'stroke-width': .8 }, g); el('rect', { x: r.x + 6, y: r.y + 14, width: r.w / 2 - 9, height: 18, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); el('rect', { x: r.x + r.w / 2 + 3, y: r.y + 14, width: r.w / 2 - 9, height: 18, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g); }
      } else if (f.kind === 'shower') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1 }, g);
        line([r.x, r.y, r.x + r.w, r.y + r.h]); line([r.x + r.w, r.y, r.x, r.y + r.h]);
        el('circle', { cx: r.x + r.w / 2, cy: r.y + r.h / 2, r: 4, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8 }, g);
      } else if (f.kind === 'bench' || f.kind === 'counter') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#f4f1ea', stroke: '#8a6d3b', 'stroke-width': 1 }, g);
        if (f.kind === 'bench') for (let i = 1; i < (f.vertical ? r.h : r.w) / 12; i++) f.vertical ? line([r.x, r.y + i * 12, r.x + r.w, r.y + i * 12]) : line([r.x + i * 12, r.y, r.x + i * 12, r.y + r.h]);
      } else if (f.kind === 'tub') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1, rx: 6 }, g);
        el('rect', { x: r.x + 5, y: r.y + 5, width: r.w - 10, height: r.h - 10, fill: 'none', stroke: FX_STROKE, 'stroke-width': .8, rx: 8 }, g);
      } else if (f.kind === 'tv') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#3b4450', stroke: 'none', rx: 1 }, g);
      } else if (f.kind === 'sofa') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1, rx: 5 }, g);
        el('rect', { x: r.x, y: r.y, width: 9, height: r.h, fill: '#f2f2ef', stroke: FX_STROKE, 'stroke-width': .8, rx: 4 }, g);
      } else if (f.kind === 'grille') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: INK, 'stroke-width': 1.2 }, g);
        for (let i = 1; i < 6; i++) line([r.x + i * r.w / 6, r.y + 2, r.x + i * r.w / 6, r.y + r.h - 2]);
      } else if (f.kind === 'table') {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1, rx: f.round ? Math.min(r.w, r.h) / 2 : 12 }, g);
        [[r.x - 8, r.y + r.h / 2], [r.x + r.w + 8, r.y + r.h / 2], [r.x + r.w / 2, r.y - 8], [r.x + r.w / 2, r.y + r.h + 8]].forEach(c => el('circle', { cx: c[0], cy: c[1], r: 5, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8 }, g));
      } else {
        el('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1, rx: f.kind === 'appliance' ? 1.5 : 2 }, g);
        if (f.kind === 'appliance') line([r.x, r.y, r.x + r.w, r.y + r.h]), line([r.x + r.w, r.y, r.x, r.y + r.h]);
      }
      if (f.label && f.kind !== 'tv') T(r.x + r.w / 2, f.vertical ? r.y + r.h / 2 : r.y + r.h / 2 + 3, f.label, { size: 6.2, fill: '#7a8087', rot: f.vertical ? -90 : 0 }, g);
      if (f.label && f.kind === 'tv') T(r.x + (r.w > 3 ? r.w / 2 : r.w + 9), r.y + r.h / 2 + 2, f.label, { size: 6, fill: '#7a8087', anchor: r.w > 3 ? 'middle' : 'start' }, g);
    } else if (f.kind === 'toilet') {
      const [x, y] = [X(f.at[0]), Y(f.at[1])];
      el('rect', { x: x - 8, y: y - 12, width: 16, height: 8, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .9, rx: 1 }, g);
      el('ellipse', { cx: x, cy: y + 4, rx: 7, ry: 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .9 }, g);
    } else if (f.kind === 'sink') {
      const [x, y] = [X(f.at[0]), Y(f.at[1])];
      el('ellipse', { cx: x, cy: y, rx: 9, ry: 7, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .9 }, g);
      el('circle', { cx: x, cy: y, r: 1.5, fill: FX_STROKE }, g);
    } else if (f.kind === 'wh') {
      const [x, y] = [X(f.at[0]), Y(f.at[1])];
      el('circle', { cx: x, cy: y, r: 13, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1 }, g);
      T(x, y + 2.5, 'WH', { size: 6.5, fill: '#7a8087', weight: 700 }, g);
    } else if (f.kind === 'fan') {
      const [x, y] = [X(f.at[0]), Y(f.at[1])];
      el('circle', { cx: x, cy: y, r: 3.5, fill: '#fff', stroke: FX_STROKE, 'stroke-width': 1 }, g);
      [0, 72, 144, 216, 288].forEach(a => el('ellipse', { cx: x, cy: y - 12, rx: 3.2, ry: 9, fill: '#fff', stroke: FX_STROKE, 'stroke-width': .8, transform: `rotate(${a} ${x} ${y})` }, g));
      T(x, y + 26, 'fan', { size: 5.6, fill: '#7a8087' }, g);
    }
  });

  /* ---------- lighting (cans + spider to the dimmer) ---------- */
  function renderCans() {
    L.lighting.innerHTML = '';
    Object.entries(P.cans).forEach(([n, list]) => {
      const dev = state.devices[n];
      if (dev && dev.removed) return;
      list.forEach(c => {
        if (dev) el('line', { x1: X(dev.x), y1: Y(dev.y), x2: X(c[0]), y2: Y(c[1]), stroke: '#d9b86a', 'stroke-width': .7, 'stroke-dasharray': '2 3' }, L.lighting);
        el('circle', { cx: X(c[0]), cy: Y(c[1]), r: 4.2, fill: '#fff8e6', stroke: '#c9a44a', 'stroke-width': 1 }, L.lighting);
        el('circle', { cx: X(c[0]), cy: Y(c[1]), r: 1.3, fill: '#c9a44a' }, L.lighting);
      });
    });
  }

  /* ---------- ductwork ---------- */
  const duct = P.duct;
  const cap600 = d => Math.round(Math.PI * Math.pow(d / 24, 2) * 600);
  function ductStyle(status) { return status === 'new' ? { fill: NEWF, stroke: NEW, 'stroke-width': 1.6 } : { fill: OLDF, stroke: OLD, 'stroke-width': 1.2 }; }
  function hduct(g, x1, x2, y, size, status) { const w = size / 12 * PF; const x = Math.min(X(x1), X(x2)); el('rect', Object.assign({ x, y: Y(y) - w / 2, width: Math.abs(X(x2) - X(x1)), height: w }, ductStyle(status)), g); }
  function vduct(g, x, y1, y2, size, status) { const w = size / 12 * PF; const y = Math.min(Y(y1), Y(y2)); el('rect', Object.assign({ x: X(x) - w / 2, y, width: w, height: Math.abs(Y(y2) - Y(y1)) }, ductStyle(status)), g); }
  function damper(g, x, y, status) { el('circle', { cx: X(x), cy: Y(y), r: 5, fill: '#fff', stroke: status === 'new' ? NEW : OLD, 'stroke-width': 1.3 }, g); el('line', { x1: X(x) - 4, y1: Y(y) + 4, x2: X(x) + 4, y2: Y(y) - 4, stroke: status === 'new' ? NEW : OLD, 'stroke-width': 1.3 }, g); }
  function register(g, x, y, status, id) {
    const r = el('g', { class: 'reg' + (editing ? ' drag' : ''), 'data-id': id }, g);
    el('rect', { x: X(x) - 8, y: Y(y) - 6, width: 16, height: 12, fill: '#fff', stroke: status === 'new' ? NEW : INK, 'stroke-width': 1.3 }, r);
    [-3, 0, 3].forEach(d => el('line', { x1: X(x) - 5, y1: Y(y) + d, x2: X(x) + 5, y2: Y(y) + d, stroke: status === 'new' ? NEW : INK, 'stroke-width': .9 }, r));
    return r;
  }
  function branchGeom(b) {
    const reg = state.regs[b.id] || b.reg;
    // viaY follows the register, so a side run dragged in edit mode keeps a connected path
    if (b.side) { const tapX = b.tapX, viaY = reg[1]; return { reg, path: [[tapX, duct.supplyY], [tapX, viaY], [reg[0], viaY]], len: Math.abs(viaY - duct.supplyY) + Math.abs(reg[0] - tapX), tap: [tapX, duct.supplyY] }; }
    return { reg, path: [[reg[0], duct.supplyY], [reg[0], reg[1]]], len: Math.abs(reg[1] - duct.supplyY), tap: [reg[0], duct.supplyY] };
  }
  function renderDuct() {
    const g = L.duct; g.innerHTML = '';
    const u = duct.unit;
    // return: unit -> west at returnY -> HP90 north across the trunk -> grille
    const rt = duct.ret; const rx = rt.turnX;
    hduct(g, u.x, rx, duct.returnY, rt.size, 'new');
    vduct(g, rx, duct.returnY, rt.grilleY, rt.size, 'new');
    el('rect', { x: X(rx) - rt.size / 24 * PF, y: Y(duct.returnY) - rt.size / 24 * PF, width: rt.size / 12 * PF, height: rt.size / 12 * PF, fill: NEWF, stroke: 'none' }, g);
    T(X(rx) - 22, Y(duct.returnY) + 12, 'HP90', { size: 6.5, weight: 700, fill: NEW, family: 'var(--display)' }, g);
    T(X(rx) + 24, Y(rt.grilleY) + 2, 'HP90', { size: 6.5, weight: 700, fill: NEW, family: 'var(--display)' }, g);
    T(X((u.x + rx) / 2), Y(duct.returnY) + 24, `${rt.size}" RETURN · NEW` + (rt.option ? ` (${rt.option}" option)` : ''), { size: 7, weight: 700, fill: NEW, family: 'var(--display)', ls: '.05em' }, g);
    // trunk
    duct.trunk.forEach((s, i) => {
      hduct(g, s.from, s.to, duct.supplyY, s.size, s.status);
      const w = s.size / 12 * PF; if (i > 0) { const p = duct.trunk[i - 1].size / 12 * PF; el('polygon', { points: `${X(s.from) + 6},${Y(duct.supplyY) - p / 2} ${X(s.from) - 6},${Y(duct.supplyY) - w / 2} ${X(s.from) - 6},${Y(duct.supplyY) + w / 2} ${X(s.from) + 6},${Y(duct.supplyY) + p / 2}`, fill: OLDF, stroke: OLD, 'stroke-width': 1.2 }, g); }
      T(X((s.from + s.to) / 2), Y(duct.supplyY) - w / 2 - 4, `${s.size}" SUPPLY · existing`, { size: 6.6, weight: 700, fill: '#4d4c48', family: 'var(--display)', ls: '.05em' }, g);
      if (s.capped) { el('rect', { x: X(s.to) - 3, y: Y(duct.supplyY) - w / 2 - 2, width: 4, height: w + 4, fill: INK }, g); T(X(s.to) - 8, Y(duct.supplyY) + 3, 'capped', { size: 6, fill: '#6f6e68', anchor: 'end' }, g); }
    });
    // transitions at the unit
    [duct.supplyY, duct.returnY].forEach(yy => el('polygon', { points: `${X(u.x)},${Y(yy) - 12} ${X(u.x)},${Y(yy) + 12} ${X(u.x) - 10},${Y(yy) + 8} ${X(u.x) - 10},${Y(yy) - 8}`, fill: NEWF, stroke: NEW, 'stroke-width': 1.6 }, g));
    T(X(u.x) + 4, Y(duct.unit.y) - 6, 'new square-to-round transitions, supply + return', { size: 5.8, fill: NEW, anchor: 'end' }, g);
    // branches
    duct.branches.forEach(b => {
      const gm = branchGeom(b); const p = gm.path;
      for (let i = 0; i < p.length - 1; i++) { const a = p[i], c = p[i + 1]; if (a[1] === c[1]) hduct(g, a[0], c[0], a[1], b.size, b.status); else vduct(g, a[0], a[1], c[1], b.size, b.status); }
      if (p.length > 2) { const w = b.size / 12 * PF; el('rect', { x: X(p[1][0]) - w / 2, y: Y(p[1][1]) - w / 2, width: w, height: w, fill: NEWF, stroke: 'none' }, g); }
      if (b.status === 'new') { const t = gm.tap; const dir = b.side ? [0, -1] : [0, gm.reg[1] > duct.supplyY ? 1 : -1]; damper(g, t[0] + dir[0] * 1.2, t[1] + dir[1] * 1.3, b.status); }
      register(g, gm.reg[0], gm.reg[1], b.status, b.id);
      const lab = `${b.room} · ${b.size}"` + (b.was ? ` (NEW, was ${b.was}")` : b.status === 'new' ? ' (NEW)' : '');
      const mid = p.length > 2 ? [(p[1][0] + p[2][0]) / 2, p[1][1]] : [p[0][0], (p[0][1] + p[1][1]) / 2];
      const vert = p.length === 2;
      T(X(mid[0]) + (vert ? -(b.size / 24 * PF) - 3 : 0), Y(mid[1]) + (vert ? 0 : -(b.size / 24 * PF) - 4), lab + ` · ${gm.len.toFixed(1)} ft`, { size: 6.4, weight: b.status === 'new' ? 700 : 500, fill: b.status === 'new' ? NEW : '#4d4c48', rot: vert ? -90 : 0, anchor: 'middle' }, g);
    });
    // thermostat wire
    el('path', { d: `M ${X(duct.wire.from[0])} ${Y(duct.wire.from[1])} L ${X(duct.wire.to[0]) + 14} ${Y(duct.wire.from[1])} L ${X(duct.wire.to[0]) + 14} ${Y(duct.wire.to[1])}`, fill: 'none', stroke: WIRE, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, g);
    g.setAttribute('opacity', '0.93');
    renderDuctTable();
  }
  function renderDuctTable() {
    const tb = document.getElementById('duct-rows'); if (!tb) return; tb.innerHTML = '';
    const row = (cells, cls) => { const tr = document.createElement('tr'); if (cls) tr.className = cls; cells.forEach((c, i) => { const td = document.createElement('td'); td.innerHTML = c; if (i > 1) td.className = 'num'; tr.appendChild(td); }); tb.appendChild(tr); };
    duct.trunk.forEach(s => row([`Supply trunk`, `${s.size}"`, 'existing', Math.abs(s.to - s.from).toFixed(1), cap600(s.size)]));
    const rt = duct.ret; const rl = (duct.unit.x - rt.turnX) + (duct.returnY - rt.grilleY);
    row([`Return to the 20 × 25 grille`, `${rt.size}"` + (rt.option ? ` <span class="dim">(${rt.option}" opt.)</span>` : ''), '<b class="new">NEW</b>', rl.toFixed(1), cap600(rt.size)]);
    let total = 0;
    duct.branches.forEach(b => { const gm = branchGeom(b); total += gm.len; row([b.room, `${b.size}"` + (b.was ? ` <span class="dim">was ${b.was}"</span>` : ''), b.status === 'new' ? '<b class="new">NEW</b>' : 'existing', gm.len.toFixed(1), cap600(b.size)], b.status === 'new' ? 'is-new' : ''); });
    row(['<b>All branches</b>', '', '', `<b>${total.toFixed(1)}</b>`, ''], 'total');
  }

  /* ---------- devices ---------- */
  const state = { devices: {}, regs: {}, selected: null, log: [] };
  P.devices.forEach(d => { state.devices[d.n] = Object.assign({ ip: '', removed: false }, d); });
  const overrides = {};
  function applyOverrides() {
    Object.values(overrides).forEach(o => { const base = P.devices.find(d => d.n === o.n) || {}; state.devices[o.n] = Object.assign({ ip: '', removed: false, note: '' }, base, o); });
    renderDevices(); renderCans(); renderKey(); renderDuct();
  }
  function renderDevices() {
    const g = L.devices; g.innerHTML = '';
    if (window.hccLive && window.hccLive.clear) window.hccLive.clear();   // lamps are redrawn below
    Object.values(state.devices).filter(d => !d.removed).sort((a, b) => a.n - b.n).forEach(d => {
      const c = (catById[d.cat] || catById.OTH).color;
      const gd = el('g', { class: 'dev' + (state.selected === d.n ? ' sel' : '') + (editing ? ' drag' : ''), 'data-n': d.n, transform: `translate(${X(d.x)} ${Y(d.y)})` }, g);
      el('circle', { r: 11.5, fill: '#fff', opacity: .92 }, gd);
      el('circle', { r: 9.2, fill: c, stroke: '#fff', 'stroke-width': 1.4, class: 'dot' }, gd);
      T(0, 3.2, d.n, { size: d.n > 9 ? 8.2 : 8.8, weight: 700, fill: '#fff', family: 'var(--display)' }, gd);
      const title = el('title', {}, gd); title.textContent = `#${d.n} ${d.name}`;
      if (window.hccLive) window.hccLive.decorate(gd, d);      // live status light (plan-live.js)
    });
  }

  /* ---------- key / sidebar ---------- */
  const keyEl = document.getElementById('key');
  let filter = '';
  function renderKey() {
    keyEl.innerHTML = '';
    const q = filter.trim().toLowerCase();
    const liveLed = n => (window.hccLive ? window.hccLive.led(n) : '');
    // Live view: anything amber or red is listed first, so a problem is never buried in a category.
    const probs = window.hccLive && !q ? window.hccLive.problems().filter(n => state.devices[n] && !state.devices[n].removed) : [];
    if (probs.length) {
      const grp = document.createElement('div'); grp.className = 'grp attn';
      grp.innerHTML = `<div class="grp-h"><span class="chip" style="background:#d7263d"></span>Needs attention<span class="cnt">${probs.length}</span></div>`;
      probs.forEach(n => { const d = state.devices[n], c = catById[d.cat] || catById.OTH; const r = document.createElement('div'); r.className = 'row' + (state.selected === n ? ' sel' : ''); r.dataset.n = n; r.innerHTML = `<span class="n" style="background:${c.color}">${n}</span><span class="nm">${esc(d.name)}<span class="nt">${esc(window.hccLive.tip(n))}</span></span>${liveLed(n)}`; r.addEventListener('click', () => select(n, true)); grp.appendChild(r); });
      keyEl.appendChild(grp);
    }
    P.cats.forEach(c => {
      const items = Object.values(state.devices).filter(d => d.cat === c.id && !d.removed && (!q || d.name.toLowerCase().includes(q) || String(d.n) === q || (d.note || '').toLowerCase().includes(q) || (d.ip || '').toLowerCase().includes(q))).sort((a, b) => a.n - b.n);
      if (!items.length) return;
      const grp = document.createElement('div'); grp.className = 'grp';
      grp.innerHTML = `<div class="grp-h"><span class="chip" style="background:${c.color}"></span>${c.name}<span class="cnt">${items.length}</span></div>`;
      items.forEach(d => {
        const r = document.createElement('div'); r.className = 'row' + (state.selected === d.n ? ' sel' : ''); r.dataset.n = d.n;
        r.innerHTML = `<span class="n" style="background:${c.color}">${d.n}</span><span class="nm">${esc(d.name)}${d.note ? `<span class="nt">${esc(d.note)}</span>` : ''}${d.ip ? `<span class="ip">${esc(d.ip)}</span>` : ''}</span>${liveLed(d.n)}`;
        r.addEventListener('click', () => select(d.n, true));
        grp.appendChild(r);
      });
      keyEl.appendChild(grp);
    });
    const removed = Object.values(state.devices).filter(d => d.removed);
    if (removed.length) {
      const grp = document.createElement('div'); grp.className = 'grp muted';
      grp.innerHTML = `<div class="grp-h"><span class="chip" style="background:#aaa"></span>Removed<span class="cnt">${removed.length}</span></div>`;
      removed.forEach(d => { const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<span class="n" style="background:#aaa">${d.n}</span><span class="nm">${esc(d.name)} <button class="lnk" data-restore="${d.n}">restore</button></span>`; grp.appendChild(r); });
      keyEl.appendChild(grp);
    }
    document.getElementById('count').textContent = Object.values(state.devices).filter(d => !d.removed).length;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function select(n, center) {
    state.selected = n;
    document.querySelectorAll('#key .row').forEach(r => r.classList.toggle('sel', +r.dataset.n === n));
    document.querySelectorAll('#L-devices .dev').forEach(g => g.classList.toggle('sel', +g.dataset.n === n));
    if (window.hccPanel) window.hccPanel(true);   // open the drawer FIRST: scrolling a row inside the closed, off-screen drawer dragged the map sideways (25 Sep)
    const row = keyEl.querySelector(`.row[data-n="${n}"]`); if (row) row.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const d = state.devices[n]; if (!d) return;
    if (center) panTo(d.x, d.y);
    showInspector(d);
    if (window.hccPanel) window.hccPanel(true);     // the panel hides by default (2026-09-25); a tapped dot opens it
  }
  function showInspector(d) {
    const ins = document.getElementById('inspector'); ins.hidden = false;
    const c = catById[d.cat] || catById.OTH;
    if (!editing) {
      ins.innerHTML = `<div class="ins-h"><span class="n" style="background:${c.color}">${d.n}</span><div><div class="ins-name">${esc(d.name)}</div><div class="ins-cat">${c.name}${d.ip ? ' · ' + esc(d.ip) : ''}</div></div></div>${window.hccLive ? window.hccLive.detail(d.n) : ''}${d.note ? `<div class="ins-note">${esc(d.note)}</div>` : ''}<div class="ins-pos">at ${fmtPos(d)}</div>`;
      return;
    }
    ins.innerHTML = `<div class="ins-h"><span class="n" style="background:${c.color}">${d.n}</span><div class="ins-name">Editing #${d.n}</div></div>
      <label>Name<input id="f-name" value="${esc(d.name)}"></label>
      <label>Category<select id="f-cat">${P.cats.map(x => `<option value="${x.id}"${x.id === d.cat ? ' selected' : ''}>${x.name}</option>`).join('')}</select></label>
      <label>Address / ID <span class="dim">(IP, entity, model)</span><input id="f-ip" value="${esc(d.ip || '')}" placeholder="192.168.1.…"></label>
      <label>Note<input id="f-note" value="${esc(d.note || '')}"></label>
      <div class="ins-pos">at ${fmtPos(d)} · drag the dot to move it</div>
      <div class="ins-btns"><button id="f-save" class="btn primary">Save</button><button id="f-remove" class="btn danger">Remove</button></div>`;
    ins.querySelector('#f-save').onclick = () => { d.name = ins.querySelector('#f-name').value.trim() || d.name; d.cat = ins.querySelector('#f-cat').value; d.ip = ins.querySelector('#f-ip').value.trim(); d.note = ins.querySelector('#f-note').value.trim(); persist(d, `#${d.n} ${d.name} — details edited`); renderDevices(); renderKey(); showInspector(d); };
    ins.querySelector('#f-remove').onclick = () => { d.removed = true; persist(d, `#${d.n} ${d.name} — removed`); state.selected = null; ins.hidden = true; renderDevices(); renderCans(); renderKey(); };
  }
  function fmtPos(d) { const inHouse = d.x >= P.G; const hx = inHouse ? d.x - P.G : d.x; return `${hx.toFixed(1)} ft ${inHouse ? 'from the house west wall' : 'from the garage west wall'}, ${d.y.toFixed(1)} ft from the front`; }

  keyEl.addEventListener('click', e => { const b = e.target.closest('[data-restore]'); if (!b) return; const d = state.devices[+b.dataset.restore]; d.removed = false; persist(d, `#${d.n} ${d.name} — restored`); renderDevices(); renderCans(); renderKey(); });
  document.getElementById('search').addEventListener('input', e => { filter = e.target.value; renderKey(); });

  /* ---------- quantities (rooms, floors, walls, exterior, roof) ---------- */
  const polyArea = poly => Math.abs(poly.reduce((s, p, i, a) => { const q = a[(i + 1) % a.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
  const polyPerim = poly => poly.reduce((s, p, i, a) => { const q = a[(i + 1) % a.length]; return s + Math.hypot(q[0] - p[0], q[1] - p[1]); }, 0);
  function renderQuantities() {
    const ceil = +(document.getElementById('q-ceil').value) || 8, pitch = +(document.getElementById('q-pitch').value) || 8, over = +(document.getElementById('q-over').value) || 1;
    const tb = document.getElementById('room-rows'); tb.innerHTML = '';
    const byFloor = {}; let houseArea = 0, wallTot = 0, ceilTot = 0;
    P.rooms.filter(r => r.id !== 'porch' && r.id !== 'fp' && r.id !== 'fclo' && r.name).forEach(r => {
      let w, h, area, perim;
      if (r.poly) { area = polyArea(r.poly); perim = polyPerim(r.poly); w = 16; h = 12.83; }
      else { w = r.rect[2]; h = r.rect[3]; area = w * h; perim = 2 * (w + h); }
      const wall = perim * ceil;
      if (r.id !== 'garage') { houseArea += area; wallTot += wall; ceilTot += area; }
      byFloor[r.floor || '—'] = (byFloor[r.floor || '—'] || 0) + area;
      const tr = document.createElement('tr'); if (r.inferred) tr.className = 'inf';
      tr.innerHTML = `<td>${r.name}${r.inferred ? ' <span class="dim">inferred</span>' : ''}</td><td class="num">${w.toFixed(1)} × ${h.toFixed(1)}</td><td class="num">${Math.round(area)}</td><td>${r.floor || ''}</td><td class="num">${Math.round(perim)}</td><td class="num">${Math.round(wall)}</td>`;
      tb.appendChild(tr);
    });
    const tr = document.createElement('tr'); tr.className = 'total'; tr.innerHTML = `<td><b>House (garage excluded)</b></td><td></td><td class="num"><b>${Math.round(houseArea)}</b></td><td></td><td></td><td class="num"><b>${Math.round(wallTot)}</b></td>`; tb.appendChild(tr);
    // floors
    const fl = document.getElementById('floor-rows'); fl.innerHTML = '';
    Object.entries(byFloor).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => { const t = document.createElement('tr'); t.innerHTML = `<td>${k}</td><td class="num">${Math.round(v)}</td><td class="num">${(v / 9).toFixed(1)}</td>`; fl.appendChild(t); });
    // exterior
    const o = P.outline; const sides = { front: 0, back: 0, east: 0, west: 0 };
    o.forEach((p, i) => { const q = o[(i + 1) % o.length]; const len = Math.hypot(q[0] - p[0], q[1] - p[1]); if (p[1] === q[1]) sides[p[1] < 15 ? 'front' : 'back'] += len; else sides[p[0] > 30 ? 'east' : 'west'] += len; });
    const perim = polyPerim(o), foot = polyArea(o);
    const eave = sides.back + sides.east + sides.west + Math.max(0, sides.front - P.exterior.gableSpans);
    const footOver = foot + perim * over + 4 * over * over;
    const roof = footOver * Math.sqrt(1 + Math.pow(pitch / 12, 2));
    const ex = document.getElementById('ext-rows'); ex.innerHTML = '';
    [['Footprint, house + garage (outline)', `${Math.round(foot)} sq ft`], ['Exterior wall perimeter', `${Math.round(perim)} ft`],
     ['Front wall (north)', `${Math.round(sides.front)} ft · two gables, ${P.exterior.gableSpans} ft of it`], ['Back wall (south)', `${Math.round(sides.back)} ft · eaved`],
     ['East side', `${Math.round(sides.east)} ft · eaved`], ['West side', `${Math.round(sides.west)} ft · eaved`],
     ['Gutter run (eaves only)', `≈ ${Math.round(eave)} ft`], ['Brick wall area at ' + ceil + ' ft', `≈ ${Math.round(perim * ceil)} sq ft gross, before windows and doors`],
     ['Roof area at ' + pitch + '/12 with ' + over + ' ft overhang', `≈ ${Math.round(roof)} sq ft = ${(roof / 100).toFixed(1)} squares`],
     ['Deck', `${Math.round(polyArea(P.yard.find(y => y.kind === 'deck').poly))} sq ft`]].forEach(([k, v]) => { const t = document.createElement('tr'); t.innerHTML = `<td>${k}</td><td class="num">${v}</td>`; ex.appendChild(t); });
    document.getElementById('ceil-total').textContent = Math.round(ceilTot);
  }
  ['q-ceil', 'q-pitch', 'q-over'].forEach(id => document.getElementById(id).addEventListener('input', renderQuantities));
  renderQuantities();

  /* ---------- pan / zoom ---------- */
  const view = { k: 1, tx: 0, ty: 0 };
  function applyView() { world.setAttribute('transform', `translate(${view.tx} ${view.ty}) scale(${view.k})`); }
  function zoomAt(f, cx, cy) { userMoved = true; const k2 = Math.min(6, Math.max(.5, view.k * f)); const r = k2 / view.k; view.tx = cx - (cx - view.tx) * r; view.ty = cy - (cy - view.ty) * r; view.k = k2; applyView(); }
  function svgPoint(e) { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
  function worldPoint(e) { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(world.getScreenCTM().inverse()); }
  function panTo(fx, fy) { const cx = VW * PF / 2, cy = VH * PF / 2; view.tx = cx - X(fx) * view.k; view.ty = cy - Y(fy) * view.k; applyView(); }
  svg.addEventListener('wheel', e => { e.preventDefault(); const p = svgPoint(e); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y); }, { passive: false });
  document.getElementById('z-in').onclick = () => zoomAt(1.25, VW * PF / 2, VH * PF / 2);
  document.getElementById('z-out').onclick = () => zoomAt(1 / 1.25, VW * PF / 2, VH * PF / 2);
  // FIT THE HOUSE (2026-09-25, Jeff: "the house doesn't get bigger and fill the page"). The viewBox
  // holds the whole lot (driveway, yard, fire pit) at a fixed 67x54 ft shape, so on a wide screen the
  // house sat in the middle with blank sides. This zooms the HOUSE (walls + back deck) to fill
  // whatever shape the map area is, using the svg's real on-screen size.
  const HOUSE = { x0: -0.5, x1: 55.5, y0: -1, y1: 42 };      // feet, same coords as plan-data.js
  let userMoved = false;
  function fitHouse() {
    const r = svg.getBoundingClientRect(); if (!r.width || !r.height) return;
    const W = VW * PF, Hh = VH * PF, s = Math.min(r.width / W, r.height / Hh);   // viewBox "meet" scale
    const visW = r.width / s, visH = r.height / s;                                 // visible area in viewBox units
    const bx0 = X(HOUSE.x0), bx1 = X(HOUSE.x1), by0 = Y(HOUSE.y0), by1 = Y(HOUSE.y1);
    view.k = Math.min(6, Math.max(.5, 0.96 * Math.min(visW / (bx1 - bx0), visH / (by1 - by0))));
    view.tx = W / 2 - view.k * (bx0 + bx1) / 2; view.ty = Hh / 2 - view.k * (by0 + by1) / 2;
    applyView(); userMoved = false;
  }
  document.getElementById('z-fit').onclick = fitHouse;
  window.addEventListener('resize', () => { if (!userMoved) fitHouse(); });
  requestAnimationFrame(fitHouse);

  let drag = null;
  svg.addEventListener('pointerdown', e => {
    const dev = e.target.closest('.dev'), reg = e.target.closest('.reg');
    if (editing && (dev || reg)) { const p = worldPoint(e); drag = { kind: dev ? 'dev' : 'reg', id: dev ? +dev.dataset.n : reg.dataset.id, el: dev || reg, sx: p.x, sy: p.y, moved: false }; svg.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    if (dev) { select(+dev.dataset.n, false); return; }
    const p = svgPoint(e); drag = { kind: 'pan', sx: p.x, sy: p.y, tx: view.tx, ty: view.ty }; svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', e => {
    if (!drag) { hover(e); return; }
    if (drag.kind === 'pan') { userMoved = true; const p = svgPoint(e); view.tx = drag.tx + (p.x - drag.sx); view.ty = drag.ty + (p.y - drag.sy); applyView(); return; }
    const p = worldPoint(e); drag.moved = true;
    if (drag.kind === 'dev') { const d = state.devices[drag.id]; d.x = +FX(p.x).toFixed(2); d.y = +FY(p.y).toFixed(2); drag.el.setAttribute('transform', `translate(${X(d.x)} ${Y(d.y)})`); }
    else { state.regs[drag.id] = [+FX(p.x).toFixed(2), +FY(p.y).toFixed(2)]; renderDuct(); }
  });
  svg.addEventListener('pointerup', e => {
    if (!drag) return; const d0 = drag; drag = null;
    if (d0.kind === 'dev') { const d = state.devices[d0.id]; if (d0.moved) { persist(d, `#${d.n} ${d.name} — moved`); renderCans(); } select(d.n, false); }
    else if (d0.kind === 'reg' && d0.moved) persistReg(d0.id);
  });
  const tip = document.getElementById('tip');
  function hover(e) {
    const dev = e.target.closest('.dev');
    if (!dev) { tip.hidden = true; return; }
    const d = state.devices[+dev.dataset.n]; const c = catById[d.cat] || catById.OTH;
    const lt = window.hccLive ? window.hccLive.tip(d.n) : '';
    tip.innerHTML = `<b>#${d.n}</b> ${esc(d.name)}<span>${c.name}${d.ip ? ' · ' + esc(d.ip) : ''}</span>${lt ? `<span class="tip-live">${esc(lt)}</span>` : ''}`;
    tip.hidden = false; const r = svg.getBoundingClientRect(); tip.style.left = (e.clientX - r.left + 14) + 'px'; tip.style.top = (e.clientY - r.top + 14) + 'px';
  }
  svg.addEventListener('pointerleave', () => { tip.hidden = true; });

  /* ---------- layers ---------- */
  document.querySelectorAll('[data-layer]').forEach(cb => cb.addEventListener('change', () => { L[cb.dataset.layer].style.display = cb.checked ? '' : 'none'; if (cb.dataset.layer === 'duct') document.body.classList.toggle('duct-on', cb.checked); }));
  document.body.classList.add('duct-on');

  /* ---------- tabs ---------- */
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t)); document.querySelectorAll('.pane').forEach(p => p.hidden = p.id !== 'pane-' + t.dataset.pane); }));

  /* ---------- editing + persistence ---------- */
  let editing = false, db = null, canWrite = null;
  const editBtn = document.getElementById('edit'), status = document.getElementById('status');
  editBtn.addEventListener('click', () => {
    if (!db) { status.textContent = 'Editing needs the shared database — open this page on claude.ai.'; return; }
    editing = !editing; document.body.classList.toggle('editing', editing); editBtn.textContent = editing ? 'Done editing' : 'Edit';
    if (editing && window.hccPanel) window.hccPanel(true);   // the edit status + inspector live in the panel
    renderDevices(); renderDuct(); if (state.selected) showInspector(state.devices[state.selected]);
    status.textContent = editing ? 'Drag any dot or register. Click a dot to edit its details.' : 'Changes saved.';
  });
  document.getElementById('add').addEventListener('click', () => {
    // 2026-09-25: this used to `return` silently when not editing - Jeff tapped Add and nothing
    // happened. Now Add turns editing on itself (or says why it can't).
    if (!editing) {
      if (!db) { status.textContent = 'Adding a device needs the shared database - open this page on claude.ai.'; return; }
      if (canWrite === false) { status.textContent = 'You have view-only access, so you cannot add devices.'; return; }
      editBtn.click();
    }
    const n = Math.max(...Object.keys(state.devices).map(Number)) + 1;
    const c = { x: FX((VW * PF / 2 - view.tx) / view.k), y: FY((VH * PF / 2 - view.ty) / view.k) };
    const d = { n, name: 'New device', cat: 'OTH', x: +c.x.toFixed(1), y: +c.y.toFixed(1), note: '', ip: '', removed: false };
    state.devices[n] = d; persist(d, `#${n} added`); renderDevices(); renderKey(); select(n, false);
  });
  async function persist(d, msg) {
    if (!db) return;
    try { await db.doc('devices/' + d.n).set({ n: d.n, name: d.name, cat: d.cat, x: d.x, y: d.y, note: d.note || '', ip: d.ip || '', removed: !!d.removed, updatedAt: new Date().toISOString() }); status.textContent = 'Saved · ' + msg; log(msg); }
    catch (e) { status.textContent = 'Could not save (' + (e && e.code || 'error') + ') — you may be view-only.'; }
  }
  async function persistReg(id) {
    if (!db) return; const r = state.regs[id]; const b = duct.branches.find(x => x.id === id);
    try { await db.doc('registers/' + id).set({ id, x: r[0], y: r[1], updatedAt: new Date().toISOString() }); status.textContent = `Saved · ${b.room} register moved`; log(`${b.room} register moved — run now ${branchGeom(b).len.toFixed(1)} ft`); }
    catch (e) { status.textContent = 'Could not save the register (' + (e && e.code || 'error') + ').'; }
  }
  async function log(msg) {
    if (!db) return;
    try { const ref = db.doc('meta/log'); const snap = await ref.get(); const entries = (snap.exists && Array.isArray(snap.data().entries)) ? snap.data().entries.slice(-59) : []; entries.push({ t: new Date().toISOString(), msg }); await ref.set({ entries }); } catch (e) { /* log is best-effort */ }
  }
  function renderLog(entries) {
    const ul = document.getElementById('log'); ul.innerHTML = '';
    if (!entries.length) { ul.innerHTML = '<li class="dim">No edits yet. Rev 1 as built from Jeff’s 22 Sep 2026 markup.</li>'; return; }
    entries.slice().reverse().forEach(e => { const li = document.createElement('li'); const t = new Date(e.t); li.innerHTML = `<span class="when">${t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>${esc(e.msg)}`; ul.appendChild(li); });
  }
  async function initDb() {
    if (!window.claude || typeof window.claude.use !== 'function') { editBtn.title = 'Open on claude.ai to edit'; return; }
    try { db = await window.claude.use('db'); } catch (e) { db = null; }
    if (!db) { editBtn.title = 'Editing is not available in this view'; return; }
    try { const user = await window.claude.use('user'); if (user) canWrite = await user.can('data.write'); } catch (e) { canWrite = null; }
    if (canWrite === false) { editBtn.disabled = true; editBtn.title = 'You have view-only access'; }
    db.collection('devices').onSnapshot(snap => { snap.docs.forEach(doc => { const o = doc.data(); if (o && o.n) overrides[o.n] = o; }); applyOverrides(); if (state.selected) select(state.selected, false); }, err => { status.textContent = 'Live sync stopped (' + err.code + ').'; });
    db.collection('registers').onSnapshot(snap => { snap.docs.forEach(doc => { const o = doc.data(); if (o && o.id) state.regs[o.id] = [o.x, o.y]; }); renderDuct(); });
    db.doc('meta/log').onSnapshot(snap => renderLog(snap.exists ? (snap.data().entries || []) : []));
    status.textContent = 'Live · shared edits sync to everyone with the link.';
  }

  /* ---------- print ---------- */
  document.getElementById('print').addEventListener('click', () => window.print());

  /* ---------- first paint ---------- */
  renderDevices(); renderCans(); renderDuct(); renderKey(); renderLog([]); applyView();
  // plan-live.js repaints the status lights through this after every poll. Editing is left alone
  // (a repaint mid-drag would drop the dot).
  window.hccPlan = {
    rerender() { if (drag) return; renderDevices(); renderKey(); if (state.selected && !editing && state.devices[state.selected]) showInspector(state.devices[state.selected]); },
    select(n) { if (state.devices[n]) select(n, true); },
    // geometry for plan-live.js's "alive" layer (room light, TVs, doors, sprinklers, air flow)
    X, Y, PF, P, devices: state.devices, branchGeom,
  };
  initDb();
})();
