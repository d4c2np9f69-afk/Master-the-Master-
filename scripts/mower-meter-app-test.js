#!/usr/bin/env node
// The mower's hours as the APP shows them, in a real browser, against a fake /api/hours.
//
// Jeff, 2026-11-05: "The hours say 14.5 instead of 15.5" and "Make sure the app all matches
// the box that is the whole damn point". Each device used to work its hours out from a
// baseline in its own localStorage, so devices disagreed and none knew his last reading.
// The server now sends meter_hours (functions/api/hours.js); this checks the app shows it,
// lets it go DOWN to the meter, saves a typed reading back to the server, and does not
// overwrite a reading the server has not taken yet. Also the Total Mows count from the box.
// (scripts/mower-hours-test.mjs covers the server side; this is the app side, which had no test.)
//
// Usage: node scripts/mower-meter-app-test.js     (needs Playwright, like smoke-test.js)

const http = require('http');
const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch (e) { ({ chromium } = require('playwright')); }

const ROOT = path.join(__dirname, '..');
const CAL_AT = '2026-11-05T20:49:22.000Z';
// The real record after the 11-05 repair, GPS points removed (this repo is public).
const HISTORY = [
  { date: '2026-08-12T00:35:27.411Z', hours_end: 5.575, hours_mow: 0.05 },
  { date: '2026-09-24T20:53:41.813Z', hours_end: 6.65, hours_mow: 1.075 },
  { date: '2026-10-23T21:58:25.482Z', hours_end: 7.0833, hours_mow: 0.4333 },
  { date: '2026-11-03T19:55:21.535Z', hours_end: 7.1583, hours_mow: 0.075 },
  { date: '2026-11-03T21:17:07.143Z', hours_end: 7.7583, hours_mow: 0.6, segments: 2 },
];

const state = { meter: 15.5, calAt: CAL_AT, posts: [], failPosts: 0 };
const hoursBody = () => JSON.stringify({
  source: 'heartbeat', engine_running: false, hours: 7.7583, dist_total_m: 9541, battery: 13.4,
  lastSync: new Date().toISOString(), history: HISTORY, coverage_n: 0, tracking_paused: false,
  meter_hours: state.meter, meter_cal: { meter: state.meter, box: 7.7583, at: state.calAt, by: 'test' },
});

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/json' };

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/hours' && req.method === 'GET' && ![...u.searchParams.keys()].length) {
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(hoursBody());
  }
  if (u.pathname === '/api/hours' && req.method === 'POST') {
    let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => {
      let j = {}; try { j = JSON.parse(b); } catch (_) {}
      state.posts.push(j);
      if (j.__cmd === 'set_hours' && state.failPosts > 0) {
        state.failPosts--; res.writeHead(503, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'kv_down' }));
      }
      if (j.__cmd === 'set_hours') {
        state.meter = j.meter; state.calAt = new Date().toISOString();
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, meter_hours: j.meter, meter_cal: { meter: j.meter, box: 7.7583, at: state.calAt } }));
      }
      res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}');
    });
    return;
  }
  if (u.pathname.startsWith('/api/')) { res.writeHead(404, { 'content-type': 'application/json' }); return res.end('{}'); }
  const f = path.join(ROOT, u.pathname === '/' ? 'index.html' : decodeURIComponent(u.pathname));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? '  -> ' + detail : ''}`); }
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  // This device had drifted ABOVE the meter, the case "only ever move forward" could not fix.
  await ctx.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('toro21200_core', JSON.stringify({ hours: 16.4, hoursBaseline: 8.64, lastSensorHours: 7.7583 }));
    localStorage.setItem('ctrl_token', 'family-ctrl-token-abcdef0123456789');
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.goto(base);
  await page.waitForTimeout(800);
  await page.evaluate(() => { const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none'; });

  const sync = async () => { await page.evaluate(() => window.mowerSync(true)); await page.waitForTimeout(600); };
  const shown = () => page.evaluate(() => ({
    main: document.getElementById('mainHours').textContent, hdr: document.getElementById('hdrHours').textContent,
    mows: document.getElementById('totalMows').textContent, S: S.hours, pending: S.meterPending || null,
  }));

  console.log('\n-- the app shows the server\'s meter hours --');
  await sync();
  let v = await shown();
  check('a device that had drifted to 16.4 shows the meter: 15.5', v.main === '15.5' && v.hdr === '15.5' && v.S === 15.5, JSON.stringify(v));
  // A fresh device: the 2 pre-app mows + the built-in Mow #3 (05-31) + the box's 09-24, 10-23, 11-03.
  // 08-12 (3 min, garage calibration) and 11-03 1:55 PM (4.5 min start) are not mows. The old page said 3.
  check('Total Mows counts the box\'s mows on a device that never typed one (2 + 1 + 3)', v.mows === '6', `shows ${v.mows}`);

  console.log('\n-- a reading typed in goes to the server --');
  await page.evaluate(() => { showModal('hours'); document.getElementById('mi-newhrs').value = '15.7'; saveHours(); });
  await page.waitForTimeout(600);
  const sent = state.posts.filter((p) => p.__cmd === 'set_hours');
  check('Set Hours posts set_hours with the reading and the family login', sent.length === 1 && sent[0].meter === 15.7 && sent[0].ctrl_token === 'family-ctrl-token-abcdef0123456789',
    JSON.stringify(sent));
  v = await shown();
  check('  and nothing is left pending', v.pending === null && v.main === '15.7', JSON.stringify(v));
  await sync();
  v = await shown();
  check('  the next sync agrees', v.main === '15.7', JSON.stringify(v));

  console.log('\n-- a reading the server has not taken is not overwritten --');
  state.failPosts = 1;
  await page.evaluate(() => { showModal('hours'); document.getElementById('mi-newhrs').value = '15.9'; saveHours(); });
  await page.waitForTimeout(600);
  v = await shown();
  check('a failed save is held as pending', v.pending && v.pending.meter === 15.9, JSON.stringify(v));
  const before = state.posts.length;
  await sync();
  v = await shown();
  check('  the sync does not drag it back to the server\'s older 15.7', v.main === '15.9', JSON.stringify(v));
  check('  it retries the save', state.posts.length > before && state.posts[state.posts.length - 1].meter === 15.9);
  await sync();
  v = await shown();
  check('  and once the server has it, pending clears and all agree', v.pending === null && v.main === '15.9' && state.meter === 15.9, JSON.stringify({ v, server: state.meter }));

  console.log('\n-- Log Mow saves its meter reading too --');
  await page.evaluate(() => { showModal('mow'); document.getElementById('mi-hrs').value = '16.6'; saveMow(); });
  await page.waitForTimeout(600);
  check('Log Mow posts the reading', state.meter === 16.6, `server ${state.meter}`);
  v = await shown();
  check('  a typed mow today adds one: 7', v.mows === '7', `shows ${v.mows}`);

  const ours = errs.filter((m) => /mowerSync|pushMeterReading|totalMowCount|meter/i.test(m));
  check('no page errors from this code', ours.length === 0, ours.join(' | '));

  await browser.close(); server.close();
  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); server.close(); process.exit(1); });
