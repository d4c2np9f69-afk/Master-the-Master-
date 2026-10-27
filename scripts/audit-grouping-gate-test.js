#!/usr/bin/env node
/**
 * audit-grouping-gate-test.js
 *
 * GATES: C:\Users\jeffl\HCC-Scripts\HCC-Audit.py  (override with HCC_AUDIT=<path>)
 *
 * WHY THIS EXISTS - 2026-10-20, and Jeff said it best:
 *   "You are sitting here right now and the house has 9 errors. It's becoming laughable
 *    when I get the error report. And quite frankly, it's embarrassing because Angela
 *    knows how much time and money that we've spent on all of this."
 *
 * The house status he hears four times a day said 9, then 10. It was NOT nine problems.
 * THREE separate defects inflated one real fault into many:
 *
 *   1. GROUPING BY THE FIRST WORD OF THE ENTITY ID. One offline Kidde produced THREE
 *      findings - `smoke` (26 entities), `kidde` (4) and `hallway` (1) - because its
 *      entities are named from three different prefixes. One dead device must be ONE error.
 *   2. NEVER-PRESSED BUTTONS COUNTED AS FAULTS. A button's state IS the timestamp it was
 *      last pressed, so one nobody has pressed reads `unknown` forever. 7 of the 12
 *      button.* entities in this house were being counted as broken.
 *   3. A SELF_HEALING KEY THAT NEVER MATCHED. The filter matches the LOGGER NAME, and HA
 *      logs Kasa failures under `homeassistant.components.tplink.coordinator` - the word
 *      "kasa" appears nowhere in it. A carefully measured 50/day allowance had never once
 *      applied, so every one of those errors went to FAIL.
 *
 * Defect 3 is the nastiest class, because the rule LOOKS present and documented while
 * doing nothing. That is this project's oldest failure mode - the 2026-08-21 stream check
 * that printed ALL GOOD eleven minutes after the popups were dead.
 *
 * PROVEN RED before being believed (SESSION_START 3b): each check was re-run against a
 * fixture with the original bug restored, and each one failed.
 */
const fs = require('fs');
const path = require('path');

const AUDIT = process.env.HCC_AUDIT ||
  path.join(process.env.USERPROFILE || process.env.HOME || '', 'HCC-Scripts', 'HCC-Audit.py');

let pass = 0, fail = 0;
const ok = (name, cond, proof) => {
  if (cond) { console.log(`  PASS  ${name.padEnd(54)} ${proof}`); pass++; }
  else { console.log(`  FAIL  ${name.padEnd(54)} ${proof}`); fail++; }
};

if (!fs.existsSync(AUDIT)) {
  console.log(`audit-grouping-gate-test.js: SKIP - ${AUDIT} not found`);
  process.exit(0);
}
const src = fs.readFileSync(AUDIT, 'utf8');

// ---- defect 1: findings must be grouped by DEVICE ----------------------------------
ok('device_map() exists', /def\s+device_map\s*\(/.test(src),
   'entity -> device registry lookup');
ok('check_entities groups by device', /dmap\s*=\s*device_map\(\)/.test(src),
   'uses the registry, not the entity prefix');
ok('old first-word grouping is gone',
   !/dev\s*=\s*e\["entity_id"\]\.split\("\.",\s*1\)\[1\]\.split\("_"\)\[0\]\s*\n\s*groups\.setdefault\(dev/.test(src),
   'one device no longer reads as several errors');
ok('alias map for one device registered twice', /DEVICE_ALIASES\s*=\s*\{/.test(src),
   'cloud + Bluetooth halves of one detector collapse');

// ---- defect 2: a never-pressed button is not a fault -------------------------------
ok('never_fired() exists', /def\s+never_fired\s*\(/.test(src), 'timestamp-domain rule');
ok('never_fired is APPLIED to the bad list', /not\s+never_fired\(e\["entity_id"\],\s*e\["state"\]\)/.test(src),
   'a defined-but-unused helper proves nothing');
ok('rule is scoped to unknown, NOT unavailable',
   /state\s*==\s*"unknown"\s+and\s+eid\.startswith\(NEVER_FIRED_DOMAINS\)/.test(src),
   'unavailable still FAILs - that means the device is GONE');

// ---- defect 3: every self-healing key must match a REAL logger name ----------------
// Logger names captured live from HA's system_log on 2026-10-20. If an integration is
// listed as self-healing, its key has to actually match the name HA emits.
const REAL_LOGGERS = [
  'homeassistant.components.tplink.coordinator',
  'custom_components.mbapi2020.websocket',
  'custom_components.bhyve.coordinator',
  'homeassistant.components.androidtv.entity',
  'homeassistant.components.alexa.state_report',
];
const block = (src.match(/SELF_HEALING\s*=\s*\{[\s\S]*?\n\}/) || [''])[0];
const keys = [...block.matchAll(/^\s{4}"([^"]+)":/gm)].map(m => m[1]);
ok('SELF_HEALING parsed', keys.length > 0, `${keys.length} keys`);
for (const logger of REAL_LOGGERS) {
  const hit = keys.find(k => logger.includes(k));
  ok(`a key matches ${logger.split('.').slice(-2)[0]}`, !!hit,
     hit ? `key "${hit}" matches ${logger}` : `NO key matches ${logger} - the rule is dead code`);
}

console.log(`\naudit-grouping-gate-test.js: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
