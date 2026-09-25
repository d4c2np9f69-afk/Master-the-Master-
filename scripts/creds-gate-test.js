#!/usr/bin/env node
// Regression test for the "logged-in page keeps asking for a login" bug class.
//
// Jeff, 2026-08-20: "the lux is still asking for credentials on the logged in
// loewenhome.com page and it looks like there maybe other as well. That was supposed to
// be fixed yesterday."
//
// It had been fixed — on the SERVER, three times (08-04, 08-06, 08-18). The client was
// never updated. NINE call sites checked localStorage and returned EARLY, before ever
// calling the API, even though /api/climate and /api/irrigation both hold their
// credentials in Cloudflare env and answer with none supplied (verified live 08-20).
//
// So the invariant this file protects is simple and it is the one that was violated:
//
//   WITH NO SAVED CREDENTIALS ON THE DEVICE, AND A SERVER THAT ANSWERS,
//   THE APP MUST RENDER THE DATA AND MUST NOT ASK FOR A LOGIN.
//
// And the converse, which must keep working:
//
//   IF THE SERVER ITSELF SAYS credentials_not_provided, THE LOGIN FORM MUST APPEAR.
//
// Usage: node scripts/creds-gate-test.js

const path = require('path');
let chromium;
try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
catch (e) { ({ chromium } = require('playwright')); }

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');

// Shapes copied from the real live responses, 2026-08-20.
const CLIMATE_OK = { ok: true, thermostat: {
  device_id: 'd0-17-69-df-dd-fb', name: 'CS1-DD-FB', current_temp: 72,
  heat_sp: 70, cool_sp: 72, op_mode: 'cool', fan_mode: 'auto', raw: {} } };
const IRR_OK = { ok: true,
  device: { id: '6164b5d84f0c6f063b834c42', name: 'Water Hog', connected: true,
            run_mode: 'auto', rain_delay: 0, active_station: null,
            last_watered: '2026-08-12T14:28:31.000Z', next_start_time: null },
  zones: [{ station: 1, name: 'Front Right', smart: true, image_url: null },
          { station: 2, name: 'Front Left', smart: true, image_url: null }],
  history: [] };
const NO_CREDS = { ok: false, error: 'credentials_not_provided' };

let fails = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`}`);
}

// Serve stubbed API responses and record which URLs were requested, so we can prove the
// client actually CALLED the server instead of short-circuiting on localStorage.
async function run(page, { climate, irrigation }) {
  const calls = [];
  await page.addInitScript(([c, i]) => {
    window.__calls = [];
    localStorage.clear();                      // a device with NO saved login
    const orig = window.fetch;
    window.fetch = function (u, o) {
      const url = String(u);
      window.__calls.push(url);
      const body = url.indexOf('/api/climate') >= 0 ? c
                 : url.indexOf('/api/irrigation') >= 0 ? i : null;
      if (body !== null) {
        return Promise.resolve(new Response(body, {
          status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return orig.apply(this, arguments);
    };
  }, [JSON.stringify(climate), JSON.stringify(irrigation)]);

  await page.goto(FILE_URL);
  await page.waitForTimeout(700);
  await page.evaluate(() => { const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none'; });
  await page.evaluate(() => { if (typeof loadClimate === 'function') loadClimate(); });
  await page.evaluate(() => { document.getElementById('snav-irr').click(); });
  await page.evaluate(() => { if (typeof loadIrrigationDirect === 'function') loadIrrigationDirect(); });
  await page.waitForTimeout(900);

  return page.evaluate(() => {
    const vis = (id) => { const e = document.getElementById(id); return !!e && e.style.display !== 'none'; };
    const txt = (id) => { const e = document.getElementById(id); return e ? (e.textContent || '') : ''; };
    return {
      calls: window.__calls.filter((u) => u.indexOf('/api/') >= 0),
      luxBanner: txt('luxBanner').trim(),
      luxSetupVisible: vis('luxSetupCard'),
      irrBanner: txt('irrBanner').trim(),
      irrSetupVisible: vis('irrSetupCard'),
      luxTemp: txt('luxCurTemp').trim()
    };
  });
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  // ── 1. THE BUG: no saved creds, server answers fine. Must NOT ask for a login. ──
  console.log('\n  NO SAVED CREDENTIALS + SERVER HAS ITS OWN (the real-world case)');
  const p1 = await browser.newPage();
  const r1 = await run(p1, { climate: CLIMATE_OK, irrigation: IRR_OK });
  check('the app actually CALLED /api/climate', r1.calls.some((u) => u.indexOf('/api/climate') >= 0), true);
  check('the app actually CALLED /api/irrigation', r1.calls.some((u) => u.indexOf('/api/irrigation') >= 0), true);
  check('LUX does NOT ask for a login', /Enter your LUX login/i.test(r1.luxBanner), false);
  check('LUX setup card stays hidden', r1.luxSetupVisible, false);
  check('B-Hyve does NOT ask for a login', /Enter your B-Hyve login/i.test(r1.irrBanner), false);
  check('B-Hyve setup card stays hidden', r1.irrSetupVisible, false);
  check('irrigation actually rendered', /idle|WATERING/i.test(r1.irrBanner), true);
  // And the password must never appear in a URL on this path.
  check('no credentials in any request URL', r1.calls.some((u) => /[?&]p=/.test(u)), false);
  await p1.close();

  // ── 2. THE CONVERSE: server has none either. The form MUST appear. ──
  console.log('\n  SERVER HAS NO CREDENTIALS EITHER (the form must still appear)');
  const p2 = await browser.newPage();
  const r2 = await run(p2, { climate: NO_CREDS, irrigation: NO_CREDS });
  check('LUX asks for a login', /Enter your LUX login/i.test(r2.luxBanner), true);
  check('LUX setup card is REVEALED', r2.luxSetupVisible, true);
  check('B-Hyve asks for a login', /Enter your B-Hyve login/i.test(r2.irrBanner), true);
  check('B-Hyve setup card is REVEALED', r2.irrSetupVisible, true);
  await p2.close();

  await browser.close();
  console.log(fails === 0
    ? '\n✓ creds-gate-test.js: the app asks the server, not the user.\n'
    : `\n✗ creds-gate-test.js: ${fails} check(s) failed.\n`);
  process.exit(fails === 0 ? 0 : 1);
})();
