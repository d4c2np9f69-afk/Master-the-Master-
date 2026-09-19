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
      acCycles: txt('acCycles'), acRuntime: txt('acRuntime'),
      // 2026-09-16: the station CARD is deleted. Jeff: "I don't want to look in two
      // places for those readings." All 21 sensors are on the hero readout now, so
      // that is what gets asserted. stationCard must STAY gone - see the last check.
      stationCardGone: document.getElementById('stationCard') === null,
      // The hero readout must come from THE STATION, not from Weather Underground's
      // relay or an Open-Meteo forecast. Jeff, 2026-09-16 05:32, looking at the app:
      // "There are duplicate readings for the same thing ... I don't want it coming
      // from a source that is not real from the weather station." The hero read
      // dew 72F while the card below read 71.5F off the same instrument, and the
      // hero's dew point was not even measured - it was temp-((100-RH)/5).
      heroInTemp: txt('wxInTemp'), heroInHum: txt('wxInHum'),
      heroTemp: txt('wxTemp'), heroFeels: txt('wxFeels'), heroDew: txt('wxDew'),
      heroHum: txt('wxHumidity'),
      heroWindSpd: txt('wxWindSpd'), heroWind: txt('wxWindDir'), heroGust: txt('wxHeroGust'),
      heroPressure: txt('wxPressure'), heroAbsPress: txt('wxAbsPress'), heroObsTime: txt('wxObsTime'),
      heroRainDay: txt('wxRainDay'), heroRainRate: txt('wxRainRate'),
      heroRain7d: txt('wxHeroRain7d'), heroRainMonth: txt('wxRainMonth'),
      heroLastRain: txt('wxLastRain'), heroRainLife: txt('wxRainLife'),
      heroUV: txt('wxUV'), heroSolar: txt('wxSolarRad'), heroLux: txt('wxLux'),
      heroHeat: txt('wxHeroHeat'),
      heroCellCount: document.querySelectorAll('#wxHeroReadout .wx-hero-cell').length,
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
  // ── ONE PLACE, NOT TWO ──────────────────────────────────────────────────────
  // Jeff, 2026-09-16 06:12: "I don't want to look in two places for those readings."
  // The station card that used to duplicate this panel row-for-row is deleted. If a
  // future session re-adds it, this fails - that is the point.
  check('station card stays deleted', r.stationCardGone, true);
  check('hero readout is 24 cells', r.heroCellCount, 24);

  // ── all 21 station sensors, on the photo, from the console on the pole ───────
  // LIVE payload: indoor 71.4 / 62%, out_temp 82.0, out_hum 76, feels 87.8,
  // dew 71.54, wind 0.0, dir 223, gust 0.0, max_gust 2.2, pressure 30.17,
  // abs 29.37, rain_today 0.00, rate 0, week 0, month 1.05, last Sep 12,
  // life 197.53, uv 0, solar 0, lux 0.
  check('hero Indoor',      r.heroInTemp,    '71°F');
  check('hero Indoor RH',   r.heroInHum,     '62%');
  check('hero Temp',        r.heroTemp,      '82°F');
  check('hero Feels Like',  r.heroFeels,     '88°F');
  check('hero Dew Point',   r.heroDew,       '72°F');
  check('hero Humidity',    r.heroHum,       '76%');
  check('hero Wind',        r.heroWindSpd,   'Calm');
  check('hero Direction',   r.heroWind,      '223° SW');
  check('hero Gust / Max',  r.heroGust,      'Calm / 2.2 mph');
  check('hero Pressure',    r.heroPressure,  '30.17 inHg');
  check('hero Abs Press',   r.heroAbsPress,  '29.37 inHg');
  check('hero Rain Today',  r.heroRainDay,   '0.00"');
  check('hero Rain Rate',   r.heroRainRate,  '0.00 in/h');
  check('hero Rain 7 Days', r.heroRain7d,    '0.00"');
  check('hero Rain Month',  r.heroRainMonth, '1.05"');
  check('hero Last Rain',   r.heroLastRain,  'Sep 12');
  check('hero All Time',    r.heroRainLife,  '197.53"');
  check('hero UV Index',    r.heroUV,        '0 Low');
  check('hero Solar',       r.heroSolar,     '0 W/m²');
  check('hero Lux',         r.heroLux,       '0');
  check('hero Heat Stress', r.heroHeat,      'MODERATE');
  // The clock is the STATION's observation time, 12-hour per Jeff's ask. The payload
  // stamps it at "now", so assert the shape, not a frozen value.
  check('hero Updated is 12-hour', /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(r.heroObsTime), true);

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
