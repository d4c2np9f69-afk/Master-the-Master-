#!/usr/bin/env node
/* sensor-coverage-test.js — a sensor we built must be VISIBLE, or explicitly excused.
 *
 * Jeff, 2026-09-16 00:47:
 *   "See this is a perfect example of shit not being completed and left hanging."
 *
 * WHAT HAPPENED: on 2026-09-15 he asked for "a way to track how many times it cycles on and off
 * and other statistics". Four `history_stats` helpers were created in HA the same night — and
 * never put on a card. They were live and reading the whole time (5 cycles, 7.64 h in 24 h) and
 * he could not see any of it. The same audit found the app fetching 12 of the weather station's
 * 21 sensors. Nine more sensors, live in HA, invisible in the app.
 *
 * Building a sensor is not finishing a sensor. This test is the difference.
 *
 * HOW IT WORKS: reads every entity from HA, keeps the families WE created, and fails if any of
 * them is not referenced anywhere in index.html. An entity that genuinely should not be on a card
 * goes in EXCUSED below WITH A REASON — which forces the decision to be made and written down
 * rather than forgotten.
 *
 * Needs HCC_HA_TOKEN (stored location is in HCC_ACCESS.md §1, outside this public repo).
 * Without it, SKIPS at exit 0 — a missing local secret is not a broken app.
 */
const fs = require('fs');
const path = require('path');

const TOKEN = (process.env.HCC_HA_TOKEN || '').trim();
if (!TOKEN) {
  console.log('sensor-coverage-test.js: SKIPPED — HCC_HA_TOKEN not set.');
  process.exit(0);
}
const HA = process.env.HCC_HA_BASE || 'http://192.168.1.66:8123';
const app = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Families we introduced. Anything matching these must be visible or excused.
const OURS = [
  { name: 'weather station', rx: /^sensor\.my_weather_station_/ },
  { name: 'A/C relay + stats', rx: /^(switch\.ac_relay$|sensor\.a_c_relay_)/ },
];

// Excused, each with the reason. An empty reason is not allowed.
const EXCUSED = {
  'sensor.my_weather_station_lifetime_rain':
    'trivia — 197 in since the station was installed; no decision depends on it',
};

(async () => {
  let states;
  try {
    const r = await fetch(HA + '/api/states', { headers: { Authorization: 'Bearer ' + TOKEN } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    states = await r.json();
  } catch (e) {
    console.log('sensor-coverage-test.js: SKIPPED — cannot reach HA (' + e.message + ').');
    process.exit(0);
  }

  const inApp = (eid) => app.includes(eid) || app.includes(eid.split('.', 1)[1] === undefined ? eid : eid.slice(eid.indexOf('.') + 1));

  let fails = 0;
  console.log('\nsensor-coverage-test.js — every sensor we built must be visible or excused\n');

  for (const fam of OURS) {
    const ents = states.map((s) => s.entity_id).filter((e) => fam.rx.test(e)).sort();
    const missing = ents.filter((e) => !inApp(e) && !(e in EXCUSED));
    const excused = ents.filter((e) => e in EXCUSED);
    const shown = ents.length - missing.length - excused.length;
    console.log(`  ${fam.name}: ${ents.length} entities — ${shown} in the app, ${excused.length} excused, ${missing.length} missing`);
    for (const e of missing) {
      fails++;
      console.log(`    FAIL  ${e}  — live in HA, invisible in the app. Put it on a card or excuse it with a reason.`);
    }
    for (const e of excused) console.log(`    ok    ${e}  (excused: ${EXCUSED[e]})`);
  }

  // an excuse without a reason is not an excuse
  for (const [k, v] of Object.entries(EXCUSED)) {
    if (!v || !v.trim()) { fails++; console.log(`  FAIL  ${k} is excused with no reason given`); }
  }

  if (fails) {
    console.log(`\nSENSOR COVERAGE FAILED — ${fails} sensor(s) built and not finished.\n`);
    process.exit(1);
  }
  console.log('\nsensor-coverage-test.js: clean — nothing built and left hanging.\n');
  process.exit(0);
})();
