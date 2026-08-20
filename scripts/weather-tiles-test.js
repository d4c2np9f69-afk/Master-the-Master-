#!/usr/bin/env node
// Verifies the Conditions tiles render the RIGHT value from realistic API payloads,
// with the network stubbed. Added 2026-08-20 with the soil-moisture / rain-90m /
// air-quality / hail tiles.
//
// Fixture shapes were captured from the real endpoints, not invented.
// Usage: node scripts/weather-tiles-test.js

const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require('playwright');

// Served over HTTP, not file://. On a file:// page a relative "/api/..." resolves to
// file:///api/... which never reaches Playwright's route interceptor, so every stubbed
// fetch silently failed and every tile read its fallback. Cost one debug cycle.
const ROOT = path.join(__dirname, '..');
function startServer() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('nope'); return;
    }
    const ext = path.extname(file);
    const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript'
      : ext === '.json' ? 'application/json' : ext === '.jpg' ? 'image/jpeg'
      : ext === '.png' ? 'image/png' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// Build an hourly series whose CURRENT hour is index 0-ish.
function hourly(soilMoist, soilMoistSurf) {
  const times = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);
  for (let i = 0; i < 72; i++) {
    times.push(new Date(now.getTime() + (i - 1) * 3600e3).toISOString().slice(0, 16));
  }
  const n = times.length;
  return {
    time: times,
    precipitation_probability: new Array(n).fill(10),
    precipitation: new Array(n).fill(0),
    soil_temperature_0cm: new Array(n).fill(70.7),
    soil_temperature_6cm: new Array(n).fill(72.8),
    soil_moisture_0_to_1cm: new Array(n).fill(soilMoistSurf),
    soil_moisture_3_to_9cm: new Array(n).fill(soilMoist),
    weathercode: new Array(n).fill(3),
  };
}

function minutely(amt, prob) {
  const times = [];
  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 15) * 15, 0, 0);
  for (let i = 0; i < 8; i++) times.push(new Date(now.getTime() + i * 900e3).toISOString().slice(0, 16));
  return {
    time: times,
    precipitation: times.map((_, i) => (i < 6 ? amt / 6 : 0)),
    precipitation_probability: new Array(8).fill(prob),
  };
}

const CASES = [
  {
    name: 'root-zone soil moisture 0.173 -> 17% DRY (amber)',
    soil: 0.173, surf: 0.314, rain: [0.0, 10], aq: { ok: true, aqi: 33, label: 'GOOD', level: 'ok', pm2_5: 4.9, measured: true },
    ltg: { ok: true, status: 'NONE', level: 'ok', hail: false, detail: 'quiet' },
    expect: { wxSoilMoist: '17%', wxAir: 'GOOD', wxHail: 'NONE' },
  },
  {
    name: 'saturated soil 0.44 -> 44%, and hail REPORTED',
    soil: 0.44, surf: 0.45, rain: [0.08, 90], aq: { ok: true, aqi: 165, label: 'UNHEALTHY', level: 'bad', pm2_5: 88, measured: false },
    ltg: { ok: true, status: 'OVERHEAD', level: 'bad', hail: true, detail: 'TS overhead' },
    expect: { wxSoilMoist: '44%', wxAir: 'UNHEALTHY ~', wxHail: 'REPORTED', wxLightning: 'OVERHEAD' },
  },
  {
    name: 'rain nowcast 0.06" at 90% shows both numbers',
    soil: 0.25, surf: 0.3, rain: [0.06, 90], aq: { ok: true, aqi: 51, label: 'MODERATE', level: 'warn' },
    ltg: { ok: true, status: 'NEARBY', level: 'warn', nearestMi: 33, hail: false, detail: 'distant' },
    expect: { wxRain90: '90% / 0.06"', wxLightning: 'NEARBY · 33 mi' },
  },
  {
    // THE 2026-08-20 08:10 BUG. sensor.home_lightning_distance reported the most
    // RECENT strike (48.9 mi south) while the CLOSEST was 4.2 mi. The tile said the
    // storm was 49 miles away while lightning hit four miles from the house.
    name: 'nearest strike wins over most-recent strike',
    soil: 0.25, surf: 0.3, rain: [0, 10], aq: { ok: true, aqi: 30, label: 'GOOD', level: 'ok' },
    ltg: { ok: true, status: 'NONE', level: 'ok', hail: false, detail: 'metar quiet' },
    blitz: { live: true, strikes: [[48.9, 0, 35.77, -86.66], [4.2, 4, 36.4162, -86.66]] },
    expect: { wxLightning: '4.2 mi S' },
  },
  {
    name: 'integration absent (live:false) falls through to METAR, never a false NONE',
    soil: 0.25, surf: 0.3, rain: [0, 10], aq: { ok: true, aqi: 30, label: 'GOOD', level: 'ok' },
    ltg: { ok: true, status: 'OVERHEAD', level: 'bad', hail: false, detail: 'metar sees it' },
    blitz: { live: false, strikes: [] },
    expect: { wxLightning: 'OVERHEAD' },
  },
  {
    name: 'blitzortung live but genuinely quiet -> NONE',
    soil: 0.25, surf: 0.3, rain: [0, 10], aq: { ok: true, aqi: 30, label: 'GOOD', level: 'ok' },
    ltg: { ok: true, status: 'OVERHEAD', level: 'bad', hail: false, detail: 'stale metar' },
    blitz: { live: true, strikes: [[70.0, 200, 35.5, -86.66]] },   // 200 min old = stale
    expect: { wxLightning: 'NONE' },
  },
];

async function main() {
  const server = await startServer();
  const BASE = 'http://127.0.0.1:' + server.address().port + '/index.html';
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let fails = 0;

  for (const c of CASES) {
    const page = await browser.newPage();
    const errors = [];
    const routed = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => { if (/\/api\//.test(r.url())) errors.push('requestfailed ' + r.url().slice(-28)); });

    await page.route('**/api/**', async (route) => {
      const u = route.request().url();
      routed.push(u.slice(u.indexOf('/api/')));
      let body;
      if (u.includes('/api/mowconditions')) {
        body = {
          current: { temperature_2m: 72, relative_humidity_2m: 80 },
          hourly: hourly(c.soil, c.surf),
          minutely_15: minutely(c.rain[0], c.rain[1]),
        };
      } else if (u.includes('/api/airquality')) {
        body = c.aq;
      } else if (u.includes('/api/lightning')) {
        body = c.ltg;
      } else if (u.includes('%2Fapi%2Ftemplate') && c.blitz) {
        // HA's /api/template returns the RENDERED STRING, not JSON, so reply as text.
        return route.fulfill({
          status: 200, contentType: 'text/plain',
          body: JSON.stringify({ live: c.blitz.live !== false, strikes: c.blitz.strikes || [] }),
        });
      } else {
        // includes /api/ha -- the Blitzortung tier fails here and falls through.
        return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });

    // The page calls loadWeather() itself on load, and the route stub is already
    // installed, so just let it run. Calling loadWeather() a SECOND time from evaluate
    // raced the first one's in-flight fetches and left tiles on their fallback -- that
    // was a harness bug that looked exactly like a product bug for three rounds.
    //
    // haFetch is deliberately left alone: other loaders on this page call it, and
    // undefining it throws "haFetch is not a function" everywhere. The stub returns 503
    // for /api/ha instead, so the Blitzortung tier fails the way it would in real life
    // and hands off to the METAR tier.
    await page.goto(BASE);
    await page.evaluate(() => {
      const s = document.getElementById('splashScreen');
      if (s) s.style.display = 'none';
    });
    await page.waitForTimeout(2000);

    const got = await page.evaluate(() => {
      const ids = ['wxSoilMoist', 'wxRain90', 'wxAir', 'wxHail', 'wxLightning', 'wxSoilTemp'];
      const o = {};
      for (const id of ids) {
        const e = document.getElementById(id);
        o[id] = e ? e.textContent.trim() : '(MISSING ELEMENT)';
      }
      return o;
    });

    console.log('\n  ' + c.name);
    console.log('    routed: ' + (routed.join(' , ') || '(NOTHING)'));
    for (const [k, want] of Object.entries(c.expect)) {
      const ok = got[k] === want;
      if (!ok) fails++;
      console.log(`    ${ok ? 'PASS' : 'FAIL'}  ${k} = "${got[k]}"${ok ? '' : `  want "${want}"`}`);
    }
    const real = errors.filter((e) => !/ServiceWorker/i.test(e));
    if (real.length) {
      fails++;
      console.log('    FAIL  page errors: ' + real.join(' | '));
    }
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('\n' + (fails ? `${fails} FAILURE(S)\n` : 'all tile checks passed\n'));
  process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
