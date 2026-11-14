#!/usr/bin/env node
// =============================================================================
// audit-handoff-gate-test.js  -  added 2026-11-12
//
// WHY THIS EXISTS. The hourly audit hands its findings to the next Claude
// session by writing HCC-Audit-for-session.json; Hook-SessionStart.ps1 puts
// that file in front of every new session. On 2026-11-12 that write sat inside
// `if fresh:` - i.e. it only happened when a finding survived BOTH the 12 h
// de-dup AND the night filter (`NIGHT = not (7 <= now.hour < 21)`).
//
// Measured consequence: the file froze at 20:10 holding 9 findings, captured at
// the 20:16 HA restart - the worst minute of the day - while the 21:10 and
// 22:10 runs each found 3. Six of those 9 had already healed. Every session
// started after 21:00 was briefed off a stale snapshot, and no fix made during
// an evening could ever reach the briefing.
//
// That is the project's oldest failure mode wearing a new hat: "a stale line
// misled sessions for 5 days" (CLAUDE.md Rule 4). The de-dup and night filter
// protect JEFF'S PHONE. They must never gate the hand-off to the session.
//
// This gate also pins the Mercedes baseline, because the obvious fix there was
// wrong in a dangerous way: a "binary_sensor.gle_350_" PREFIX would have
// swallowed low_brake_fluid_warning, low_coolant_level_warning,
// engine_light_warning and tire_warning on a car Jeff drives.
// =============================================================================
const fs = require('fs');

const RUN = 'C:/Users/jeffl/HCC-Scripts/HCC-AuditRun.py';
const AUD = 'C:/Users/jeffl/HCC-Scripts/HCC-Audit.py';
let fails = 0;
const fail = (m) => { console.log('  FAIL ' + m); fails++; };
const pass = (m) => console.log('  ok   ' + m);

for (const p of [RUN, AUD]) {
  if (!fs.existsSync(p)) {
    console.log('FAIL: ' + p + ' not found. This gate guards the live audit scripts on the');
    console.log('      Beast; they are outside the repo by design. Fix the path, do not delete');
    console.log('      the gate - the bug it catches silently misleads every future session.');
    process.exit(1);
  }
}

const run = fs.readFileSync(RUN, 'utf8');
const aud = fs.readFileSync(AUD, 'utf8');

// ---- 1. the hand-off must be unconditional (column 0 = module level) --------
const calls = run.split('\n')
  .map((l, i) => ({ l, n: i + 1 }))
  .filter((x) => /write_for_session\s*\(/.test(x.l) && !/^\s*def\s/.test(x.l));
const topLevel = calls.filter((x) => /^write_for_session\s*\(|^\w.*=\s*write_for_session\s*\(/.test(x.l));
if (!calls.length) fail('HCC-AuditRun.py never calls write_for_session - the session briefing is dead.');
else if (!topLevel.length) {
  fail('write_for_session is only called from INSIDE a conditional block (line ' +
       calls.map((c) => c.n).join(', ') + '). The session file must be written on EVERY run, ' +
       'or the briefing goes stale exactly when findings are healing. See the header.');
} else pass('session hand-off is unconditional (line ' + topLevel[0].n + ')');

// ---- 2. it must be fed the full finding set, not the push-filtered one ------
if (topLevel.length && !/write_for_session\(session_hits/.test(run)) {
  fail('write_for_session is not fed session_hits. If it is fed `fresh`, the de-dup and the ' +
       'night filter silently shrink the briefing to nothing after 21:00.');
} else if (topLevel.length) pass('hand-off is fed the full finding set (session_hits)');

// ---- 3. the night filter must STILL protect the phone -----------------------
if (!/NIGHT\s*=\s*not\s*\(7 <= now\.hour < 21\)/.test(run)) {
  fail('the NIGHT guard is gone. NO HA NOTIFICATIONS 10 PM - 6 AM is a standing rule: ' +
       'Jeff took 13 pushes between 10:05 PM and morning on 2026-10-24.');
} else pass('night guard on the phone push is intact');
if (!/if crits:/.test(run)) fail('the CRIT-only push condition is gone - non-crit findings could reach his phone.');
else pass('phone push is still CRIT-only');

// ---- 4. the Mercedes baseline: exact ids, never a prefix --------------------
const must = ['binary_sensor.gle_350_engine_state', 'binary_sensor.gle_350_remote_start_active',
              'binary_sensor.gle_350_theft_system_armed', 'device_tracker.gle_350_device_tracker'];
const exact = new Set();
const mEx = aud.match(/BASELINE_EXACT\s*=\s*\{([\s\S]*?)\n\}/);
if (mEx) for (const m of mEx[1].matchAll(/"([^"]+)"/g)) exact.add(m[1]);
const pre = [];
const mPre = aud.match(/BASELINE_PREFIXES\s*=\s*\(([\s\S]*?)\n\)/);
if (mPre) for (const m of mPre[1].matchAll(/"([^"]+)"/g)) pre.push(m[1]);
const baselined = (e) => exact.has(e) || pre.some((p) => e.startsWith(p));

for (const e of must) {
  if (!baselined(e)) fail(e + ' is not baselined. It died 2026-10-17 with the lapsed ' +
    'complimentary remote services; Jeff settled that on 11-05 ("if we can\'t get it for free ' +
    'then we don\'t need it") and it must never be reported as a fault again.');
}
if (must.every(baselined)) pass('the 4 lapsed Mercedes remote-service entities are baselined');

const neverSwallow = ['binary_sensor.gle_350_low_brake_fluid_warning',
  'binary_sensor.gle_350_low_coolant_level_warning', 'binary_sensor.gle_350_engine_light_warning',
  'binary_sensor.gle_350_tire_warning', 'binary_sensor.gle_350_windows_closed',
  'binary_sensor.gle_350_park_brake_status', 'binary_sensor.gle_350_deck_lid',
  'binary_sensor.gle_350_deck_lid_lock', 'binary_sensor.gle_350_low_wash_water_warning',
  'lock.gle_350_lock', 'cover.gle_350_windows',
  'climate.hcc_thermostat', 'sensor.water_meter_last_seen', 'sensor.gas_meter_last_seen'];
const swallowed = neverSwallow.filter(baselined);
if (swallowed.length) {
  fail('the baseline now SWALLOWS ' + swallowed.length + ' entity/entities that must still be ' +
       'able to fail: ' + swallowed.join(', ') + '. Brake fluid, coolant, engine light and tire ' +
       'warnings are safety signals on a car Jeff drives. Use exact ids, never a ' +
       '"binary_sensor.gle_350_" prefix.');
} else pass('all ' + neverSwallow.length + ' safety/liveness entities can still fail the audit');

console.log(fails ? '\naudit-handoff-gate-test: ' + fails + ' FAILURE(S)'
                  : '\naudit-handoff-gate-test: clean');
process.exit(fails ? 1 : 0);
