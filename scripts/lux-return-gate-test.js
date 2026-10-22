#!/usr/bin/env node
// lux-return-gate-test.js — the LUX thermostat must come back ON ITS OWN (2026-10-21)
//
// WHY THIS GATE EXISTS
// Jeff, during the A/C install, 2026-10-21 6:3x PM: "The LUX is most likely fine it was the
// thermostat wire that was chewed up so that is what they are installing. So the Lux should be
// ready to comeback online when they get it put in make sure it's ready in the app."
//
// Before this, the app carried `var LUX_RETIRED = true`, and loadThermostat() sent every caller
// to the A/C relay card unconditionally. The thermostat could have come back online and the app
// would have shown nothing until somebody remembered the boolean, edited index.html and
// redeployed — on a day when the person who knows that is standing in a hallway with an
// installer. "Ready in the app" has to mean ready WITHOUT a deploy.
//
// It also pins the throttle. The retirement existed to stop failing /api/climate round trips
// burning the Cloudflare request budget (OPEN_ITEMS #183). loadThermostat() runs on boot, on
// opening HOME, and from the 60 s self-heal, so an unthrottled probe is ~60 failed calls an
// hour from every open client. One probe per 10 minutes while absent, and NONE once it is back.
//
// Usage: node scripts/lux-return-gate-test.js
// Point at a fixture with HCC_LUX_APP=<path> to prove it goes RED. Never edit the live
// index.html to test the gate that guards it.

const path = require('path');
const fs = require('fs');

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

const APP = process.env.HCC_LUX_APP || path.join(__dirname, '..', 'index.html');
const FILE_URL = 'file://' + APP;

let failed = 0;
function check(name, cond, got) {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${got === undefined ? '' : '   got=' + JSON.stringify(got)}`);
}

async function main() {
  console.log('\nlux-return-gate-test.js — the thermostat must return without a deploy\n');

  // ── Source-level: the hard retirement must not come back. ──
  const src = fs.readFileSync(APP, 'utf8');
  check('the hard LUX_RETIRED switch is gone from the code',
    !/var\s+LUX_RETIRED\s*=/.test(src));
  check('loadThermostat still draws the A/C relay card',
    /function\s+loadThermostat\s*\([\s\S]{0,600}?loadAcRelay\s*\(/.test(src));
  check('loadThermostat probes /api/climate',
    /function\s+loadThermostat\s*\([\s\S]{0,900}?\/api\/climate/.test(src));
  check('the probe is throttled, not once per refresh',
    /LUX_PROBE_MS/.test(src) && /luxLastProbe/.test(src));

  const browser = await chromium.launch(
    usingSandbox ? { executablePath: SANDBOX_CHROME } : {});
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(FILE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  // Replace fetch with a counting stub so the probe can be driven deterministically.
  // loadAcRelay() is stubbed out: it needs a Beehive token and is not what is under test.
  const prep = async () => page.evaluate(() => {
    window.__climateCalls = 0;
    window.__luxPayload = { ok: false, error: 'location_user: 403' };
    window.loadAcRelay = function(){ window.__acDrawn = (window.__acDrawn || 0) + 1; };
    window.loadClimate = function(){ window.__climateDrawn = (window.__climateDrawn || 0) + 1; };
    window.fetch = function(u){
      if (String(u).indexOf('/api/climate') >= 0){
        window.__climateCalls++;
        return Promise.resolve({ ok: true, json: () => Promise.resolve(window.__luxPayload) });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    };
    window.luxLastProbe = 0;
    window.luxIsLive = false;
    window.__acDrawn = 0;
    window.__climateDrawn = 0;
    const lc = document.getElementById('luxCard');
    if (lc) lc.style.display = 'none';
  });

  // ── 1. Thermostat still absent: relay card drawn, LUX card stays hidden. ──
  await prep();
  await page.evaluate(() => window.loadThermostat());
  await page.waitForTimeout(250);
  let st = await page.evaluate(() => ({
    calls: window.__climateCalls, ac: window.__acDrawn, lux: window.__climateDrawn,
    cardShown: (document.getElementById('luxCard') || {}).style.display !== 'none',
    live: window.luxIsLive,
  }));
  check('ABSENT: the A/C relay card is still drawn', st.ac === 1, st.ac);
  check('ABSENT: the LUX card stays hidden', !st.cardShown);
  check('ABSENT: it does not claim the thermostat is live', st.live === false);

  // ── 2. THE THROTTLE. Repeated calls inside the window must not re-probe. ──
  await page.evaluate(() => { window.loadThermostat(); window.loadThermostat(); window.loadThermostat(); });
  await page.waitForTimeout(250);
  st = await page.evaluate(() => ({ calls: window.__climateCalls, ac: window.__acDrawn }));
  check('THROTTLE: 4 calls in one window still only probed once', st.calls === 1, st.calls);
  check('THROTTLE: but the relay card is redrawn every time', st.ac === 4, st.ac);

  // ── 3. THE THING JEFF ASKED FOR. The stat comes back; the app must notice unprompted. ──
  await page.evaluate(() => {
    window.__luxPayload = { ok: true, thermostat: { name: 'LUX', op_mode: 'cool',
                                                    cool_sp: 72, heat_sp: 68, current_temp: 71 } };
    window.luxLastProbe = 0;          // the 10-minute window has elapsed
    window.loadThermostat();
  });
  await page.waitForTimeout(300);
  st = await page.evaluate(() => ({
    live: window.luxIsLive, lux: window.__climateDrawn,
    cardShown: (document.getElementById('luxCard') || {}).style.display !== 'none',
    calls: window.__climateCalls,
  }));
  check('RETURN: the app notices the thermostat with no deploy', st.live === true);
  check('RETURN: the LUX card is unhidden', st.cardShown);
  check('RETURN: loadClimate is called to fill it', st.lux >= 1, st.lux);

  // ── 4. Once back, stop probing — it is just used. ──
  await page.evaluate(() => { window.loadThermostat(); window.loadThermostat(); });
  await page.waitForTimeout(200);
  st = await page.evaluate(() => ({ calls: window.__climateCalls, lux: window.__climateDrawn }));
  check('SETTLED: no further probe once the thermostat answers', st.calls === 2, st.calls);
  check('SETTLED: it keeps rendering the real thermostat', st.lux >= 3, st.lux);

  check('no page errors', errs.length === 0, errs.slice(0, 2));

  await browser.close();
  console.log(failed
    ? `\nlux-return-gate-test.js: ${failed} FAILED.\n`
    : '\nlux-return-gate-test.js: clean — the thermostat returns on its own.\n');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('  FAIL  harness error:', e.message); process.exit(1); });
