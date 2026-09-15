#!/usr/bin/env node
// Test for the A/C relay card on HOME (2026-09-15, OPEN_ITEMS #185).
//
// The LUX died in a power surge; a SONOFF MINI-D (switch.ac_relay) now closes the cooling call,
// run by automation.hcc_ac_relay_thermostat off the master bedroom Echo Dot + an offset helper.
// The card must tell Jeff the truth in every state, and must cost ONE request per refresh
// (Cloudflare Pages Functions budget, #183).
//
// Payload shape copied from the live HA /api/template reply, 2026-09-15 16:08:
//   {"auto":"on","echo":"75.2","echo_reported":"2026-09-15T21:04:54+00:00",
//    "offset":"-3.2","relay":"on","relay_changed":"2026-09-15T20:59:19+00:00"}
//
// Usage: node scripts/ac-card-test.js

const path = require('path');
let chromium;
try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
catch (e) { ({ chromium } = require('playwright')); }

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
const now = new Date().toISOString();
const LIVE = { auto: 'on', echo: '75.2', echo_reported: now, offset: '-3.2', relay: 'on', relay_changed: now };

let fails = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`}`);
}

async function run(browser, { payload, token = true, status = 200 }) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(([p, tok, st]) => {
    localStorage.clear();
    if (tok) localStorage.setItem('ha_token', 'test-token');
    window.__calls = [];
    const orig = window.fetch;
    window.fetch = function (u, o) {
      const url = String(u);
      const body = o && o.body ? String(o.body) : '';
      window.__calls.push({ url, body });
      if (url.indexOf('/api/ha?path=%2Fapi%2Ftemplate') >= 0 && body.indexOf('ac_relay') >= 0) {
        return Promise.resolve(new Response(p, { status: st, headers: { 'Content-Type': 'application/json' } }));
      }
      if (url.indexOf('/api/') >= 0) {
        return Promise.resolve(new Response('{}', { status: 503, headers: { 'Content-Type': 'application/json' } }));
      }
      return orig.apply(this, arguments);
    };
  }, [JSON.stringify(payload), token, status]);
  await page.goto(FILE_URL);
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const txt = (id) => { const e = document.getElementById(id); return e ? e.textContent.trim() : null; };
    const shown = (id) => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none'; };
    const acCalls = window.__calls.filter((c) => c.body.indexOf('ac_relay') >= 0).length;
    // one manual refresh must add exactly one request
    loadThermostat();
    return new Promise((res) => setTimeout(() => res({
      banner: txt('acBanner'), bannerClass: (document.getElementById('acBanner') || {}).className,
      temp: txt('acTemp'), state: txt('acState'), auto: txt('acAuto'), echo: txt('acEcho'),
      acCallsBoot: acCalls,
      acCallsAfterRefresh: window.__calls.filter((c) => c.body.indexOf('ac_relay') >= 0).length,
      climateCalls: window.__calls.filter((c) => c.url.indexOf('/api/climate') >= 0).length,
      luxCardShown: shown('luxCard'), luxSetupShown: shown('luxSetupCard'), acCardShown: shown('acCard')
    }), 400));
  });
  // Registering a real ServiceWorker requires http(s), not file:// — expected, and filtered the
  // same way scripts/smoke-test.js:114-116 does. Every other page error still fails the test.
  r.errors = errors.filter((e) => e.indexOf('ServiceWorker') === -1);
  await page.close();
  return r;
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  console.log('\n  LIVE STATE (cooling, automation on, offset -3.2)');
  let r = await run(browser, { payload: LIVE });
  check('A/C card is shown', r.acCardShown, true);
  check('dead LUX card is hidden', r.luxCardShown, false);
  check('LUX login card is hidden', r.luxSetupShown, false);
  check('corrected bedroom temp = 75.2 - 3.2', r.temp, '72.0°F');
  check('banner says Cooling', /Cooling/.test(r.banner), true);
  check('banner is the caution style', r.bannerClass, 'wx-banner wx-caution');
  check('A/C row says ON', /^ON since/.test(r.state), true);
  check('Automatic row says Active', r.auto, 'Active');
  check('Echo row shows raw and correction', /^75\.2° raw −3\.2°/.test(r.echo), true);
  check('boot made exactly ONE A/C request', r.acCallsBoot, 1);
  check('a refresh adds exactly ONE request', r.acCallsAfterRefresh - r.acCallsBoot, 1);
  check('no /api/climate calls any more', r.climateCalls, 0);
  check('no page errors', r.errors, []);

  console.log('\n  RESTING (relay off)');
  r = await run(browser, { payload: Object.assign({}, LIVE, { relay: 'off', echo: '74.1' }) });
  check('banner says Resting', /Resting/.test(r.banner), true);
  check('banner is the go style', r.bannerClass, 'wx-banner wx-go');
  check('temp 74.1 - 3.2 = 70.9', r.temp, '70.9°F');
  check('A/C row says OFF', /^OFF since/.test(r.state), true);

  console.log('\n  RELAY OFFLINE');
  r = await run(browser, { payload: Object.assign({}, LIVE, { relay: 'unavailable' }) });
  check('banner warns relay offline', /relay offline/.test(r.banner), true);
  check('banner is the bad style', r.bannerClass, 'wx-banner wx-no');
  check('A/C row says OFFLINE', r.state, 'OFFLINE');

  console.log('\n  AUTOMATION TURNED OFF');
  r = await run(browser, { payload: Object.assign({}, LIVE, { auto: 'off' }) });
  check('banner warns automatic control is off', /Automatic control is OFF/.test(r.banner), true);
  check('Automatic row warns', /OFF/.test(r.auto), true);

  console.log('\n  ECHO SENSOR UNAVAILABLE');
  r = await run(browser, { payload: Object.assign({}, LIVE, { echo: 'unavailable' }) });
  check('banner warns temperature missing', /temperature missing/.test(r.banner), true);
  check('temp row says no reading', r.temp, 'no reading');
  check('no page errors', r.errors, []);

  console.log('\n  HA UNREACHABLE (proxy 502)');
  r = await run(browser, { payload: {}, status: 502 });
  check('banner says unavailable, not a fake reading', /A\/C status unavailable: ha 502/.test(r.banner), true);
  check('temp stays blank', r.temp, '--');

  console.log('\n  NO HA TOKEN ON THIS DEVICE');
  r = await run(browser, { payload: LIVE, token: false });
  check('asks to connect Beehive', /Connect Beehive/.test(r.banner), true);
  check('fires NO request without a token', r.acCallsAfterRefresh, 0);

  await browser.close();
  console.log(fails === 0 ? '\n✓ ac-card-test.js: all checks passed.\n' : `\n✗ ac-card-test.js: ${fails} check(s) failed.\n`);
  process.exit(fails === 0 ? 0 : 1);
})();
