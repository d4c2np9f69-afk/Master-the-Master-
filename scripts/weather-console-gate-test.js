#!/usr/bin/env node
// weather-console-gate-test.js — the CONSOLE and the OUTDOOR ARRAY are two different radios
// (2026-10-19)
//
// WHY THIS GATE EXISTS — two real failures on 2026-10-19, both in the weather station path.
//
// 1. THE APP BUG IT GUARDS. The Ambient outdoor array on KTNWHITE21 failed on 10-17 (railing to
//    -40 / 140 F, then to NULL). `live-e2e-test.js` went red on "station indoor temperature on
//    the hero" and I nearly wrote it off as "the station is down, expected". It was NOT expected:
//    the INDOOR temperature, indoor humidity and barometric pressure were still arriving perfectly
//    (measured 08:1x — 62.6 F, 65 %, 30.12 inHg, all updating within the minute) and the app was
//    blanking them anyway, because every one of those cells sat inside `if (STATION_HA_LIVE)` and
//    STATION_HA_LIVE is computed from OUTDOOR temp / dew point.
//
//    The barometer and the indoor thermo-hygrometer are INSIDE the console. Temp, humidity, dew
//    point, wind, rain, UV and solar come from a pole outside over a separate 915 MHz link. One can
//    die while the other is fine. Gating one on the other lets a dead outdoor array take out
//    readings that never stopped working.
//
// 2. MY OWN MISTAKE THE SAME MORNING, which rule 3b says gets a test, not an apology. While fixing
//    the 246-error `rest data` storm, my first patch made the four Weather Underground sensors
//    return the STRING 'unknown' from value_template when WU sent null. That broke them harder: a
//    sensor carrying a `device_class` and a unit must have a NUMERIC state, so HA logged
//    "Error adding entity sensor.backyard_temperature for domain sensor with platform rest" and the
//    entities were never created at all. The correct idiom is `availability` — which
//    SESSION_START.md section 3 already told me, in writing, in the line about never defaulting a
//    sensor to 0. The live half below fails on the signature that bug leaves behind.
//
// Usage:  node scripts/weather-console-gate-test.js
//         HCC_WX_CONSOLE_APP=<path>   point at a fixture to prove it goes RED
//         HCC_HA_TOKEN=<token>        also run the live entity assertions

const fs = require('fs');
const path = require('path');

const APP = process.env.HCC_WX_CONSOLE_APP || path.join(__dirname, '..', 'index.html');
const HA = process.env.HCC_HA_URL || 'http://192.168.1.66:8123';

let failed = 0;
function check(name, cond, got) {
  if (!cond) failed++;
  console.log('  ' + (cond ? 'PASS' : 'FAIL') + '  ' + name
    + (got === undefined ? '' : '   got=' + JSON.stringify(got)));
}

const src = fs.readFileSync(APP, 'utf8');

console.log('\nweather-console-gate-test.js — console cells must survive a dead outdoor array\n');

// ── The structural assertion. Positional, because that IS the bug: these writes used to sit
// after `if (STATION_HA_LIVE) {`, and the fix was to move them before it. Anything that moves
// them back makes an index go the wrong way, which is exactly what must never happen again.
const iGate = src.indexOf('if (STATION_HA_LIVE) {');
const iConsole = src.indexOf('var CONSOLE_HA_LIVE');
const iInTemp = src.indexOf("hset('wxInTemp'");
const iInHum = src.indexOf("hset('wxInHum'");
const iPress = src.indexOf("hset('wxPressure'");

check('the outdoor gate `if (STATION_HA_LIVE) {` still exists', iGate > 0, iGate);
check('a separate CONSOLE_HA_LIVE flag exists', iConsole > 0, iConsole);
check('CONSOLE_HA_LIVE is declared BEFORE the outdoor gate', iConsole > 0 && iConsole < iGate);
check('indoor TEMPERATURE is written outside the outdoor gate', iInTemp > 0 && iInTemp < iGate, { iInTemp, iGate });
check('indoor HUMIDITY is written outside the outdoor gate', iInHum > 0 && iInHum < iGate, { iInHum, iGate });
check('barometric PRESSURE is written outside the outdoor gate', iPress > 0 && iPress < iGate, { iPress, iGate });

// CONSOLE_HA_LIVE must key off console readings only. If someone "tidies" it into reusing the
// outdoor values, the bug is back while the flag still looks right.
const consoleDecl = src.slice(iConsole, iConsole + 200).split(';')[0];
check('CONSOLE_HA_LIVE keys off indoor/pressure, never the outdoor array',
  /CONSOLE_HA_LIVE\s*=\s*\(\s*ind\s*!=\s*null/.test(consoleDecl)
  && !/\bout\b/.test(consoleDecl) && !/\bdew\b/.test(consoleDecl),
  consoleDecl);

// STATION_HA_LIVE must STILL be the outdoor flag — it is what stops Weather Underground and
// Open-Meteo writing over the station's own outdoor cells (Jeff, 2026-09-16 05:32).
check('STATION_HA_LIVE is still computed from the OUTDOOR readings',
  /STATION_HA_LIVE\s*=\s*\(out\s*!=\s*null\s*\|\|\s*dew\s*!=\s*null\)/.test(src));

// Jeff's rule: an outdoor cell with no station reading shows a dash, it does NOT fall back to a
// forecast. wxTemp / wxFeels / wxDew must stay in the blocked-cells list.
const cells = (src.match(/var STATION_CELLS = \{[\s\S]{0,400}?\};/) || [''])[0];
check('outdoor cells stay owned by the station (no forecast fallback)',
  /wxTemp:1/.test(cells) && /wxFeels:1/.test(cells) && /wxDew:1/.test(cells));

// The indoor cells must NOT be in that list — they have no second source to block, and listing
// them would hint that someone is feeding them from something other than the console.
check('indoor cells are NOT in the blocked list (the console is their only source)',
  !/wxInTemp/.test(cells) && !/wxInHum/.test(cells), cells.slice(0, 60));

// ── LIVE: my own 'unknown'-string mistake, caught by the signature it leaves on the entity. ──
// NOTE ON METHOD: the obvious check is "read HA's system_log and assert no 'Error adding entity'".
// That needs the WebSocket API, and `ws` is NOT installed in this repo (node_modules holds only
// playwright), so that version would have SKIPPED on every run forever — and a gate that cannot
// reach the code it names is worse than no gate, because it reports green. This project has been
// burned by exactly that twice: smoke-test.js ran logged out for its whole life, and
// weather-tiles-test.js asserted on a tier it had locked itself out of.
//
// So it checks the SIGNATURE instead, over plain REST, which needs nothing extra. When a
// value_template returns a non-numeric string and HA refuses to create the entity, what is left is
// a RESTORED STUB: `attributes.restored === true` with no device-specific attributes. That is
// exactly what sensor.backyard_temperature looked like at 07:41 on 2026-10-19. A healthy
// unavailable sensor — dead station, availability template correctly false — does NOT carry it.
(async () => {
  const tok = process.env.HCC_HA_TOKEN;
  const SENSORS = ['sensor.backyard_temperature', 'sensor.backyard_feels_like',
    'sensor.backyard_humidity', 'sensor.backyard_wind'];
  if (!tok) {
    console.log('\n  SKIP  live entity assertions (set HCC_HA_TOKEN to run them)');
  } else {
    console.log('');
    for (const id of SENSORS) {
      let st = null;
      try {
        const r = await fetch(HA + '/api/states/' + id, { headers: { Authorization: 'Bearer ' + tok } });
        st = r.ok ? await r.json() : { _http: r.status };
      } catch (e) { st = { _err: e.message }; }
      if (st && st._http === 404) {
        check(id + ' exists in HA', false, 'HTTP 404 — the sensor is gone entirely');
        continue;
      }
      if (st && (st._http || st._err)) {
        console.log('  SKIP  ' + id + ' (could not read: ' + JSON.stringify(st) + ')');
        continue;
      }
      const restored = !!(st.attributes && st.attributes.restored);
      check(id + ' was actually CREATED (not a restored stub)', !restored,
        { state: st.state, restored: restored });
      // Whatever it reports must be a real number or an honest unavailable/unknown — never a junk
      // string, which is what a template returning a word produces.
      const ok = /^-?\d+(\.\d+)?$/.test(st.state) || st.state === 'unavailable' || st.state === 'unknown';
      check(id + ' state is numeric or honestly unavailable', ok, st.state);
    }
  }

  if (failed) {
    console.log('\nweather-console-gate-test.js: ' + failed + ' FAILED.\n');
    process.exit(1);
  }
  console.log('\nweather-console-gate-test.js: clean — a dead outdoor array cannot blank the console.\n');
})();
