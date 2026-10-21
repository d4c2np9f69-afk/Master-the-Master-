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

async function run() {
  const code = fs.readFileSync(SRC, 'utf8').replace(/export\s+async\s+function/g, 'async function');
  const captured = {};
  const sandbox = {
    console,
    Response: { json: (o) => { Object.assign(captured, o); return { __json: o }; } },
    fetch: async () => ({ ok: true, status: 200, json: async () => WU_DEAD_OUTDOOR, text: async () => '' }),
    URL, URLSearchParams, Math, Date, JSON, isFinite, Set, Number,
  };
  vm.createContext(sandbox);
  vm.runInContext(code + '\n;globalThis.__h = onRequestGet;', sandbox);
  await sandbox.__h({ env: { WU_API_KEY: 'test', WU_STATION: 'KTNWHITE21' } });

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

  console.log(`\nweather-sentinel-gate-test.js: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
run().catch(e => { console.error('  FAIL  harness error:', e.message); process.exit(1); });
