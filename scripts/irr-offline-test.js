#!/usr/bin/env node
// Regression test: the irrigation card must never claim ONLINE when it is not.
//
// 2026-08-20. Jeff: "the B-hyve commands all failed." Then: "the B-hyve is offline due to
// the leak." He had unplugged the controller because of the irrigation leak — and the app
// had been showing "● ONLINE" the entire week since, because the server computed:
//
//     isConnected = !!( ... || timer.hardware_version )
//
// Every device record carries a hardware_version, so that expression could never be false.
// Orbit was reporting is_connected:false with last_connected_at 2026-08-13 the whole time.
// The dashboard was confidently wrong, and every control command sat for ten seconds and
// timed out with no explanation because there was no controller to receive it.
//
// The invariants, in both directions:
//   OFFLINE  -> say OFFLINE, with the date, and refuse to send commands with a real reason.
//   ONLINE   -> say ONLINE and behave normally.
//   UNKNOWN  -> say CHECK APP. Never invent a cheerful ONLINE from missing data.
//
// Usage: node scripts/irr-offline-test.js

const path = require('path');
let chromium;
try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
catch (e) { ({ chromium } = require('playwright')); }

const FILE = 'file:///' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');

let fails = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`}`);
}

// Real shape from Orbit on 2026-08-20, with the controller genuinely offline.
function payload(connected, lastConnected) {
  return {
    ok: true,
    device: {
      id: '6164b5d84f0c6f063b834c42', name: 'Water Hog',
      connected: connected, last_connected: lastConnected,
      run_mode: 'auto', rain_delay: 0, active_station: null,
      last_watered: '2026-08-12T14:28:31.000Z', next_start_time: null
    },
    zones: [
      { station: 1, name: 'Z1 Front right', smart: true, image_url: null },
      { station: 5, name: 'Z5 Right Side Drive', smart: true, image_url: null }
    ],
    history: []
  };
}

async function load(browser, body) {
  const page = await browser.newPage({ viewport: { width: 1536, height: 864 } });
  await page.addInitScript((b) => {
    localStorage.clear();
    window.__posts = [];
    const orig = window.fetch;
    window.fetch = function (u, o) {
      const url = String(u);
      if (url.indexOf('/api/irrigation') >= 0) {
        window.__posts.push(url);
        return Promise.resolve(new Response(b, { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return orig.apply(this, arguments);
    };
  }, JSON.stringify(body));
  await page.goto(FILE);
  await page.waitForTimeout(700);
  await page.evaluate(() => { const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none'; });
  await page.evaluate(() => document.getElementById('snav-irr').click());
  await page.evaluate(() => { if (typeof loadIrrigationDirect === 'function') loadIrrigationDirect(); });
  await page.waitForTimeout(900);
  return page;
}
const read = (page) => page.evaluate(() => {
  const t = (id) => { const e = document.getElementById(id); return e ? (e.textContent || '').trim() : '(missing)'; };
  return { conn: t('irrConn'), banner: t('irrBanner'), calls: window.__posts.length };
});

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  console.log('\n  CONTROLLER OFFLINE (the real 2026-08-20 case)');
  {
    const page = await load(browser, payload(false, '2026-08-13T18:30:52.132Z'));
    const r = await read(page);
    check('badge says OFFLINE', /OFFLINE/.test(r.conn), true);
    check('badge does NOT say ONLINE', /(^|[^F])ONLINE/.test(r.conn.replace('OFFLINE', '')), false);
    check('badge carries the date it went offline', /Aug\s*13/.test(r.conn), true);
    check('banner warns controls will not reach it', /OFFLINE/.test(r.banner), true);

    // A command must fail fast with a real reason, not hang and time out.
    const before = r.calls;
    await page.evaluate(() => irrControl('rain_delay', { hours: 1 }));
    await page.waitForTimeout(500);
    const after = await read(page);
    check('no request is even attempted', after.calls, before);
    check('and it explains why', /nothing to send the command to/i.test(after.banner), true);
    check('and names when it was last seen', /Aug\s*13/.test(after.banner), true);
    await page.close();
  }

  console.log('\n  CONTROLLER ONLINE');
  {
    const page = await load(browser, payload(true, '2026-08-20T12:00:00.000Z'));
    const r = await read(page);
    check('badge says ONLINE', /ONLINE/.test(r.conn), true);
    check('badge does not say OFFLINE', /OFFLINE/.test(r.conn), false);
    check('banner shows normal status', /idle|WATERING/i.test(r.banner), true);
    await page.close();
  }

  console.log('\n  ORBIT TOLD US NOTHING (must not invent ONLINE)');
  {
    const page = await load(browser, payload(null, null));
    const r = await read(page);
    check('badge says CHECK APP', /CHECK APP/.test(r.conn), true);
    check('badge does NOT claim ONLINE', /ONLINE/.test(r.conn), false);
    await page.close();
  }

  await browser.close();
  console.log(fails === 0
    ? '\n✓ irr-offline-test.js: the card tells the truth about the controller.\n'
    : `\n✗ irr-offline-test.js: ${fails} check(s) failed.\n`);
  process.exit(fails === 0 ? 0 : 1);
})();
