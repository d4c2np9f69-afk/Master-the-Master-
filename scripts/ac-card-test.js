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
// 2026-09-16: extended after an audit found the app was fetching 12 of the station's 21 sensors,
// and NONE of the four A/C history_stats helpers Jeff asked for. Every field below is a real key
// the live template returns — verified against HA before this test was touched.
const LIVE = { auto: 'on', indoor: '71.4', indoor_reported: now, indoor_hum: '62',
  out_temp: '82.0', out_hum: '76', feels: '87.8', wind: '0.0', gust: '0.0', wind_dir: '223',
  rain_today: '0.00', pressure: '30.17', uv: '0', solar: '0.00',
  dew: '71.54', max_gust: '2.2', rain_rate: '0', rain_week: '0', rain_month: '1.05',
  rain_last: '2026-09-12T13:59:00+00:00', lux: '0', abs_pressure: '29.37', rain_life: '197.53',
  cyc_today: '1', cyc_24h: '5', run_today: '0.461757969326443', run_24h: '7.64325340853797',
  relay: 'on', relay_changed: now };

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
      stBanner: txt('stBanner'), stIndoor: txt('stIndoor'), stOutdoor: txt('stOutdoor'),
      stWind: txt('stWind'), stRain: txt('stRain'), stPressure: txt('stPressure'), stSun: txt('stSun'),
      stDew: txt('stDew'), stRainHist: txt('stRainHist'), stLastRain: txt('stLastRain'),
      acCycles: txt('acCycles'), acRuntime: txt('acRuntime'),
      // The hero readout must come from THE STATION, not from Weather Underground's
      // relay or an Open-Meteo forecast. Jeff, 2026-09-16 05:32, looking at the app:
      // "There are duplicate readings for the same thing ... I don't want it coming
      // from a source that is not real from the weather station." The hero read
      // dew 72F while the card below read 71.5F off the same instrument, and the
      // hero's dew point was not even measured - it was temp-((100-RH)/5).
      heroTemp: txt('wxTemp'), heroDew: txt('wxDew'), heroHum: txt('wxHumidity'),
      heroFeels: txt('wxFeels'), heroWind: txt('wxWindDir'), heroGust: txt('wxHeroGust'),
      heroPressure: txt('wxPressure'), heroRainDay: txt('wxRainDay'),
      heroRain7d: txt('wxHeroRain7d'), heroUV: txt('wxUV'),
      stCardShown: shown('stationCard'),
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
  check('indoor temp straight from the station', r.temp, '71.4°F');
  check('banner says Cooling', /Cooling/.test(r.banner), true);
  check('banner is the caution style', r.bannerClass, 'wx-banner wx-caution');
  check('A/C row says ON', /^ON since/.test(r.state), true);
  check('Automatic row says Active', r.auto, 'Active');
  check('sensor row names the weather station', /^Weather station • 62% RH/.test(r.echo), true);
  check('station card is shown', r.stCardShown, true);
  check('station indoor', /^71\.4°F • 62% RH/.test(r.stIndoor), true);
  check('station outdoor with feels-like', /^82\.0°F • 76% RH • feels 87\.8°/.test(r.stOutdoor), true);
  // These two expectations were updated 2026-09-16 when max-gust and absolute pressure were added
  // to their rows. The old assertions FAILED on the new output, which is exactly what they are for.
  check('station wind calm', r.stWind, 'Calm • max 2.2');
  check('station rain none', r.stRain, 'None');
  check('station pressure', r.stPressure, '30.17 inHg • 29.37 abs');
  check('station sun', r.stSun, 'UV 0 • 0 W/m²');
  check('station banner says live', /Live from your own console/.test(r.stBanner), true);

  // ── the nine sensors that were live in HA and invisible in the app until 2026-09-16 ──
  check('dew point, with the comfort word', r.stDew, '71.5°F • muggy');
  check('rain week and month', r.stRainHist, '0.00 in wk • 1.05 in mo • 197.53 all-time');

  // ── the hero readout must agree with the card, because it is the same instrument ──
  // LIVE payload: out_temp 82.0, dew 71.54, out_hum 76, feels 87.8, wind_dir 223,
  // gust 0.0, pressure 30.17, rain_today 0.00, rain_week 0, uv 0.
  check('hero Temp from the station',      r.heroTemp,     '82°F');
  check('hero Dew Point from the station', r.heroDew,      '72°F');
  check('hero Humidity from the station',  r.heroHum,      '76%');
  check('hero Feels Like from the station', r.heroFeels,   '88°F');
  check('hero Wind from the station',      r.heroWind,     '223° SW');
  check('hero Gust from the station',      r.heroGust,     'Calm');
  check('hero Pressure from the station',  r.heroPressure, '30.17 inHg');
  check('hero Rain Today from the station', r.heroRainDay, '0.00"');
  check('hero Rain 7 Days from the station', r.heroRain7d, '0.00"');
  check('hero UV from the station',        r.heroUV,       '0 • Low');
  check('last rain, dated and aged', /^Sep 12 • \d+d ago$/.test(r.stLastRain), true);
  check('max gust folded into the wind row', /max 2\.2/.test(r.stWind), true);
  check('absolute pressure alongside relative', /30\.17 inHg • 29\.37 abs/.test(r.stPressure), true);

  // ── the A/C statistics Jeff asked for, built the same night and never surfaced ──
  check('cycle count, today and 24 h', r.acCycles, '1 today • 5 in 24 h');
  // 0.461757969 h = 27.7 min, which rounds to 28 — my first expectation said 27 and was wrong.
  check('runtime with a duty cycle', r.acRuntime, '28 m today • 7 h 39 m in 24 h (32% duty)');
  check('boot made exactly ONE A/C request', r.acCallsBoot, 1);
  check('a refresh adds exactly ONE request', r.acCallsAfterRefresh - r.acCallsBoot, 1);
  check('no /api/climate calls any more', r.climateCalls, 0);
  check('no page errors', r.errors, []);

  console.log('\n  RESTING (relay off)');
  r = await run(browser, { payload: Object.assign({}, LIVE, { relay: 'off', indoor: '70.9' }) });
  check('banner says Resting', /Resting/.test(r.banner), true);
  check('banner is the go style', r.bannerClass, 'wx-banner wx-go');
  check('indoor 70.9 shown as-is', r.temp, '70.9°F');
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
  r = await run(browser, { payload: Object.assign({}, LIVE, { indoor: 'unavailable' }) });
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
