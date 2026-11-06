#!/usr/bin/env node
// yard-map-test.js - the yard map, drawn by the real app in a real browser (2026-11-05).
//
// WHY THIS EXISTS: Jeff, 11-04: "there's no reason why that map should look like the shit hole
// that it does." Nothing in the gate ever looked at this map. Four separate faults sat in the
// drawing code with every gate green:
//   - the canvas was sized in CSS pixels, so a phone or iPad stretched it to mush
//   - it was 320 px tall on any screen, which left the yard in a strip on a wide one
//   - cells were drawn as beads, and a leg of any length as a confident solid line, so
//     8 samples 30 s apart became a red stroke straight across the house
//   - from firmware 1.5.0 the history holds only a 100-point sketch; without the separate
//     download a real mow would have drawn as that sketch forever
//
// Coordinates are made up (mid-ocean). Real yard positions never go in this public repo.
// Nothing here reaches the live site: every /api call and every tile is answered locally.
//
// Usage: node scripts/yard-map-test.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const SANDBOX_PW = '/opt/node22/lib/node_modules/playwright';
const SANDBOX_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let chromium;
let usingSandbox = false;
try {
  ({ chromium } = require(SANDBOX_PW));
  usingSandbox = fs.existsSync(SANDBOX_CHROME);
} catch (e) {
  ({ chromium } = require('playwright'));
}

const REPO = path.join(__dirname, '..');
const TILE = fs.readFileSync(path.join(REPO, 'images/zones/zone-1.jpg'));

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + detail : '')); }
}

// 3 m apart, heading north from a made-up point.
const walk = (n) => Array.from({ length: n }, (_, i) => [+(10 + i * 3 / 111320).toFixed(6), 20]);

const CELLS = {};
for (let i = 0; i < 40; i++) CELLS[`${1000000 + i},${2000000 + (i % 7)}`] = (i % 3) + 1;
const COV = JSON.stringify({ coverage: CELLS, coverage_n: 40, paused: false });

const hoursBody = (history) => JSON.stringify({
  hours: 8, hours_seconds: 28800, fw: '1.5.0', lastSync: new Date().toISOString(), source: 'heartbeat',
  engine_running: false, coverage_n: 40, track: [], history,
});
const MOW_14 = { date: '2026-11-03T20:48:30.000Z', hours_end: 7.5, track: walk(8) };
const MOW_15 = { date: '2026-11-04T20:48:30.000Z', hours_end: 8, mow_ids: [5], track_pts: 300, track_want: 300, track: walk(100) };

const server = http.createServer((q, r) => {
  const u = q.url.split('?')[0];
  fs.readFile(path.join(REPO, u === '/' ? 'index.html' : u), (e, b) => {
    if (e) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': u === '/' ? 'text/html' : 'application/octet-stream' });
    r.end(b);
  });
});

async function open(browser, port, { history, tracks, width = 1024, dsf = 1 }) {
  const ctx = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block', deviceScaleFactor: dsf });
  const page = await ctx.newPage();
  const errors = [];
  const hits = { hours: 0, track: 0 };
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__rect = 0; window.__arc = 0;
    const P = CanvasRenderingContext2D.prototype;
    const rect = P.rect, arc = P.arc;
    P.rect = function () { window.__rect++; return rect.apply(this, arguments); };
    P.arc = function () { window.__arc++; return arc.apply(this, arguments); };
  });
  await page.route('**/*', (rt) => {
    const u = rt.request().url();
    if (u.includes('/api/hours')) {
      let body = hoursBody(history);
      if (u.includes('coverage=1')) body = COV;
      else if (u.includes('track=')) { hits.track++; body = JSON.stringify(tracks || { ok: true, mow_ids: [], tracks: [] }); }
      else hits.hours++;
      return rt.fulfill({ status: 200, contentType: 'application/json', body });
    }
    if (u.includes('/api/')) return rt.fulfill({ status: 404, body: '{}' });
    if (u.startsWith(`http://localhost:${port}`)) return rt.continue();
    if (/arcgis|nationalmap|usgs/i.test(u)) {
      return rt.fulfill({ status: 200, contentType: 'image/jpeg', headers: { 'access-control-allow-origin': '*' }, body: TILE });
    }
    return rt.abort();
  });
  await page.goto(`http://localhost:${port}/`);
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none';
    document.getElementById('snav-yard').click();
  });
  await page.waitForFunction(() => Array.isArray(window._lastTrack) && window._lastTrack.length > 0, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const state = () => page.evaluate(() => {
    const c = document.getElementById('yardMap');
    return { track: (window._lastTrack || []).length, msg: document.getElementById('yardMapMsg').textContent,
      w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight };
  });
  return { page, ctx, errors, hits, state };
}

server.listen(0, async () => {
  const port = server.address().port;
  const launch = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  if (usingSandbox) launch.executablePath = SANDBOX_CHROME;
  const browser = await chromium.launch(launch);
  try {
    console.log('\n-- which track gets drawn --');
    {
      const a = await open(browser, port, { history: [MOW_14, MOW_15], tracks: { ok: true, mow_ids: [5], tracks: [{ id: 5, pts: walk(300) }] } });
      const s = await a.state();
      check('a 1.5.0 mow draws the FULL stored track, not the 100-point sketch', s.track === 300, s.track);
      check('and the message counts the real points', /300 GPS points/.test(s.msg), s.msg);
      check('every 60 s sync does not re-download it (several syncs, one fetch)',
            a.hits.hours >= 2 && a.hits.track === 1, JSON.stringify(a.hits));
      check('no page errors', a.errors.length === 0, a.errors.join(' | '));
      await a.ctx.close();

      const b = await open(browser, port, { history: [MOW_14] });
      const sb = await b.state();
      check('a 1.4.0 record asks for no full track', b.hits.track === 0, b.hits.track);
      check('and still draws the points it carries', sb.track === 8, sb.track);
      check('no page errors on an old record', b.errors.length === 0, b.errors.join(' | '));
      await b.ctx.close();

      const e = await open(browser, port, { history: [MOW_14, { ...MOW_15, track_pts: 0, track_want: 0, track: [] }] });
      check('a mow that recorded no points asks for nothing', e.hits.track === 0, e.hits.track);
      await e.ctx.close();

      const c = await open(browser, port, { history: [MOW_14, MOW_15], tracks: { ok: true, mow_ids: [6], tracks: [{ id: 6, pts: walk(500) }] } });
      const sc = await c.state();
      check('a track belonging to a different mow is not drawn as this one', sc.track === 100, sc.track);
      await c.ctx.close();

      const d = await open(browser, port, { history: [MOW_14, MOW_15], tracks: { ok: true, mow_ids: [5], tracks: [] } });
      const sd = await d.state();
      check('with nothing stored yet the sketch stays up', sd.track === 100, sd.track);
      check('and it asks again rather than giving up', d.hits.track >= 2, JSON.stringify(d.hits));
      await d.ctx.close();
    }

    console.log('\n-- drawing --');
    {
      const a = await open(browser, port, { history: [MOW_14], dsf: 2 });
      const s = await a.state();
      check('the canvas is drawn at the screen\'s real pixels (2x screen, 2x canvas)',
            s.w === s.cw * 2 && s.h === s.ch * 2, JSON.stringify(s));
      check('not a 320 px strip on a wide screen', s.ch >= 480, s.ch);

      const r = await a.page.evaluate(() => {
        window.__rect = 0; window.__arc = 0;
        drawYardMap(window._lastTrack);
        const fit = window._lastTileFit;
        return { rect: window.__rect, arc: window.__arc, msg: document.getElementById('yardMapMsg').textContent, fit: !!fit };
      });
      check('the test really is in satellite mode', /real satellite/.test(r.msg) && r.fit, r.msg);
      check('every coverage cell is painted as true-size ground, not a bead', r.rect === 40, JSON.stringify(r));
      check('8 sparse samples are each marked, plus the blue dot', r.arc === 9, JSON.stringify(r));

      const big = await a.page.evaluate(() => {
        const pts = [];
        for (let i = 0; i < 16000; i++) pts.push([10 + (i % 400) * 3 / 111320, 20 + Math.floor(i / 400) * 3 / 111320]);
        const t = performance.now();
        drawYardMap(pts);
        return +(performance.now() - t).toFixed(1);
      });
      console.log('  note: largest track file the box can hold (16,000 points) drew in ' + big + ' ms');
      check('the largest track the box can hold draws fast enough not to hang the app', big < 500, big + ' ms');
      check('no page errors while drawing', a.errors.length === 0, a.errors.join(' | '));
      await a.ctx.close();

      const p = await open(browser, port, { history: [MOW_14], width: 390 });
      const sp = await p.state();
      check('a phone keeps its 320 px height', sp.ch === 320, sp.ch);
      await p.ctx.close();
    }

    console.log('\n-- what a gap between two points may claim --');
    {
      const a = await open(browser, port, { history: [MOW_14] });
      const legs = await a.page.evaluate(() => {
        const m = (metres) => metres / 111320;
        const run = (gap) => { const r = window._trackLegs([[10, 20], [10 + m(gap), 20]]); return [r.solid.length, r.dashed.length]; };
        const skip = window._trackLegs([[10, 20], null, ['x', 1], [10 + m(5), 20]]);
        return { near: run(5), edge: run(14), mid: run(30), far: run(60), skip: [skip.solid.length, skip.dashed.length], empty: window._trackLegs(null) };
      });
      check('5 m is a line', legs.near.join() === '1,0', legs.near);
      check('14 m is a line', legs.edge.join() === '1,0', legs.edge);
      check('30 m is dashed: the two ends are known, the route between is not', legs.mid.join() === '0,1', legs.mid);
      check('60 m is not joined at all (a dropout or a new stretch)', legs.far.join() === '0,0', legs.far);
      check('junk points are skipped, not joined through', legs.skip.join() === '1,0', legs.skip);
      check('no track at all is not a crash', legs.empty.solid.length === 0);
      await a.ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
