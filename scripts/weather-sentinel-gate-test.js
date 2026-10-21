#!/usr/bin/env node
/**
 * weather-sentinel-gate-test.js
 *
 * GATES: functions/api/weather.js
 *
 * WHY THIS EXISTS - found live 2026-10-20 while sweeping the house for real faults.
 * The weather station's OUTDOOR array stopped transmitting to its console. The console
 * and the cloud link stayed healthy, so Weather Underground kept serving observations -
 * with the station's raw "no data" SENTINEL in the dead fields.
 *
 * /api/weather was returning, live, to the real app:
 *     humidity: -32768      winddir: -32768      windDirCard: "N"
 *
 * Every field was guarded with `!= null`, which accepts -32768 happily BECAUSE IT IS A
 * NUMBER. Worse, toCard() then turned the garbage into a CONFIDENT wind direction:
 * Math.round(-32768 / 22.5) % 16 lands on exactly 0, which is "N". So the app would have
 * shown -32768% humidity beside a north wind that did not exist.
 *
 * 🔑 THE LESSON, and it is the same one as the 2026-08-21 "ALL GOOD" camera check:
 * A DEAD SENSOR DOES NOT REPORT NOTHING - IT REPORTS A SENTINEL. A null check does not
 * catch a number. temp, dewpt, windSpeed and uv were correctly null in the SAME payload,
 * which is exactly what made it look fine at a glance.
 *
 * This test is FUNCTIONAL, not a grep: it runs the real handler against a mocked WU
 * response carrying the sentinels and asserts nothing poisonous reaches the app.
 * PROVEN RED against the pre-fix source before being believed.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = process.env.HCC_WEATHER_JS || path.join(__dirname, '..', 'functions', 'api', 'weather.js');
let pass = 0, fail = 0;
const ok = (n, c, p) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n.padEnd(50)} ${p}`); c ? pass++ : fail++; };

// A real WU payload shape, with the sentinels a dead outdoor array actually emits.
const WU_DEAD_OUTDOOR = {
  observations: [{
    stationID: 'KTNWHITE21',
    humidity: -32768,
    winddir: -32768,
    uv: null,
    solarRadiation: null,
    obsTimeLocal: '2026-10-20 19:34:34',
    neighborhood: 'Indian Ridge',
    imperial: {
      temp: null, dewpt: null, heatIndex: null,
      windSpeed: null, windGust: null,
      pressure: 29.94, precipTotal: 0, precipRate: 0,
    },
  }],
};

// What Open-Meteo really answers for 36.477,-86.66. The array-dark path below must
// reach THIS, not the WU body - mocking one fetch for every URL is how the first
// version of this test would have silently passed a broken fallback.
const OPEN_METEO = {
  current: {
    temperature_2m: 59.4, relative_humidity_2m: 71,
    wind_speed_10m: 6.2, wind_direction_10m: 45, surface_pressure: 1013.2,
  },
  hourly: {
    time: ['2026-10-20T20:00', '2026-10-20T21:00'],
    dewpoint_2m: [49.1, 50.0], apparent_temperature: [58.0, 58.6],
    windgusts_10m: [11.0, 12.5], precipitation: [0, 0], uv_index: [0, 0],
  },
};

// Routes by URL so each upstream gets its own body, and so an unexpected URL is loud.
function makeFetch({ wu = WU_DEAD_OUTDOOR, meteoOk = true } = {}) {
  return async (url) => {
    const u = String(url);
    if (u.includes('api.weather.com')) {
      return { ok: true, status: 200, json: async () => wu, text: async () => '' };
    }
    if (u.includes('open-meteo.com')) {
      if (!meteoOk) return { ok: false, status: 503, json: async () => ({}), text: async () => '' };
      return { ok: true, status: 200, json: async () => OPEN_METEO, text: async () => '' };
    }
    throw new Error('unexpected fetch: ' + u.slice(0, 60));
  };
}

async function callHandler(fetchImpl) {
  const code = fs.readFileSync(SRC, 'utf8').replace(/export\s+async\s+function/g, 'async function');
  const captured = {};
  const sandbox = {
    console,
    Response: { json: (o) => { Object.assign(captured, o); return { __json: o }; } },
    fetch: fetchImpl,
    URL, URLSearchParams, Math, Date, JSON, isFinite, Set, Number,
  };
  vm.createContext(sandbox);
  vm.runInContext(code + '\n;globalThis.__h = onRequestGet;', sandbox);
  await sandbox.__h({ env: { WU_API_KEY: 'test', WU_STATION: 'KTNWHITE21' } });
  return captured;
}

async function run() {
  // PATH 1 - array dark AND the fallback is unreachable. The old assertions still
  // hold here: honest nulls, never a sentinel and never an invented direction.
  const captured = await callHandler(makeFetch({ meteoOk: false }));

  const SENTINELS = [-32768, 32767, -9999, 9999, -999];
  const offenders = Object.entries(captured)
    .filter(([, v]) => typeof v === 'number' && SENTINELS.includes(v))
    .map(([k]) => k);
  ok('no sentinel value reaches the app', offenders.length === 0,
     offenders.length ? `LEAKED: ${offenders.join(', ')}` : 'every dead field is null');
  ok('humidity is null, not -32768', captured.humidity === null, `humidity = ${captured.humidity}`);
  ok('winddir is null, not -32768', captured.winddir === null, `winddir = ${captured.winddir}`);
  ok('windDirCard is NOT invented from garbage', captured.windDirCard == null,
     `windDirCard = ${JSON.stringify(captured.windDirCard)} (was a confident "N")`);
  ok('a GOOD value still passes through', captured.pressure === 29.94, `pressure = ${captured.pressure}`);
  ok('precip still defaults to 0, not null', captured.precipTotal === 0, `precipTotal = ${captured.precipTotal}`);
  ok('a dead array is FLAGGED, not served as normal', captured.stationDark === true,
     `stationDark = ${captured.stationDark}`);

  // PATH 2 - THE DEFECT THIS SECTION EXISTS FOR, found live 2026-10-20 21:20.
  // WU answers 200 with an all-sentinel observation, so the handler never throws and
  // the Open-Meteo fallback that has sat in this file for months never fires. The app
  // showed 15 "--" fields on the WEATHER tab with a free data source one call away.
  // "HTTP 200" is not "the station is reporting".
  const warm = await callHandler(makeFetch({ meteoOk: true }));
  ok('array dark -> falls back instead of serving blanks', warm.temp === 59,
     `temp = ${warm.temp} (was null with WU returning 200)`);
  ok('fallback fills humidity', warm.humidity === 71, `humidity = ${warm.humidity}`);
  ok('fallback fills wind + a REAL direction', warm.windSpeed === 6 && warm.windDirCard === 'NE',
     `windSpeed = ${warm.windSpeed}, windDirCard = ${JSON.stringify(warm.windDirCard)}`);
  ok('fallback fills dewpoint', warm.dewpt === 50, `dewpt = ${warm.dewpt}`);
  ok("the console's own pressure is kept, not overwritten", warm.pressure === 29.94,
     `pressure = ${warm.pressure}`);
  ok("Jeff's own 7-day rain gauge survives the fallback", warm.rain7d === null || warm.rain7d !== undefined,
     `rain7d = ${JSON.stringify(warm.rain7d)}`);
  ok('the app is TOLD the numbers are not from the station', /Open-Meteo/.test(String(warm.station)),
     `station = ${JSON.stringify(warm.station)}`);
  ok('still flagged dark on the fallback path', warm.stationDark === true,
     `stationDark = ${warm.stationDark}`);

  // PATH 3 - a healthy station must be untouched by any of the above.
  const live = await callHandler(makeFetch({
    wu: { observations: [{ stationID: 'KTNWHITE21', humidity: 64, winddir: 90, uv: 3,
          solarRadiation: 120, obsTimeLocal: '2026-10-20 14:00:00',
          imperial: { temp: 72, dewpt: 58, heatIndex: 73, windSpeed: 5, windGust: 9,
                      pressure: 29.9, precipTotal: 0.1, precipRate: 0 } }] },
  }));
  ok('a HEALTHY station is served unchanged', live.temp === 72 && live.humidity === 64,
     `temp = ${live.temp}, humidity = ${live.humidity}`);
  ok('a healthy station is NOT flagged dark', live.stationDark === false,
     `stationDark = ${live.stationDark}`);
  ok('a healthy station keeps its own name', live.station === 'KTNWHITE21',
     `station = ${JSON.stringify(live.station)}`);

  console.log(`\nweather-sentinel-gate-test.js: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
run().catch(e => { console.error('  FAIL  harness error:', e.message); process.exit(1); });
