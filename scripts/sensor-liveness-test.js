#!/usr/bin/env node
/* sensor-liveness-test.js — a sensor that has gone SILENT must be caught by a gate,
 * not by someone happening to look.
 *
 * Jeff, 2026-09-20 02:27: "Did you read before you did anything?"
 *
 * WHAT HAPPENED: `binary_sensor.mailbox_contact` went off the mesh on 2026-09-16 at
 * 07:44 local and has been frozen ever since — 92 hours by the time this was written.
 * HA kept cheerfully displaying its last state (`on`), so the house believed the
 * mailbox was standing open for four days. Nothing failed. Nothing went red. It was
 * found by a human reading a table, twice, days apart.
 *
 * `sensor-coverage-test.js` asks "is a sensor we built VISIBLE?" — a different question.
 * A sensor can be perfectly visible on a card and completely dead behind it. Nothing in
 * the gate suite asked "is it still TALKING?" until this file.
 *
 * THE DISCRIMINATOR THAT MAKES THIS WORK (measured 2026-09-20 02:30, both cases live):
 *   - an ORPHANED device goes silent on its LINKQUALITY too   -> Mailbox, 3.8 DAYS frozen
 *   - a LIVE device keeps reporting LQI whatever the contact says -> Garage Man Door, 0.9 h
 * So linkquality age — NOT contact state — separates "gone" from "really open".
 * Checking contact state alone cannot tell those apart, which is exactly why the
 * mailbox looked like an open door instead of a dead radio.
 *
 * Healthy baseline measured the same minute: front door 3.4 h, back deck 1.6 h,
 * garage down 1.1 h, man door 0.9 h. The 12 h threshold sits far above all of them,
 * so this does not cry wolf — and a gate that cries wolf is worse than no gate
 * (SESSION_START.md §3b, condition 2).
 *
 * USAGE:  node scripts/sensor-liveness-test.js <states.json>
 * The states dump is the same one doors-entity-test.js and garage-entity-test.js take.
 * Without it: SKIP at exit 0 — and a skip is not a pass.
 */
/* 🔴🔴 READ THIS BEFORE TRUSTING OR EXTENDING THIS GATE — 2026-09-20 14:50.
 *
 * I WROTE THIS WITHOUT CHECKING WHAT ALREADY EXISTED, AND SOMETHING DID.
 * `automation.hcc_sensor_silence_watchdog_reports_absence_not_events`
 * ("HCC - SENSOR OFFLINE WATCHDOG (Z2M availability, real signal)") has been
 * live in Home Assistant since 2026-08-30 doing this job, and doing it BETTER:
 *
 *   - it keys off **Z2M availability**, the real signal. This file keys off
 *     linkquality AGE, which I then had to patch after it wrongly condemned two
 *     healthy mains-powered repeaters. Availability would never have made that
 *     mistake.
 *   - it already carries the scar tissue: 07:00-21:00 only, a 12-hour cooldown,
 *     and the mailbox deliberately removed as acknowledged-dead (#86). That
 *     tuning exists because an earlier version "woke Jeff and Angela all night"
 *     — Jeff, 2026-08-30: "to wake Angela and me up all night with a continuous
 *     warning over a mail box sensor come on."
 *
 * COST_LEDGER 2026-08-26 states the rule I broke: "enumerate what already
 * exists before building anything, and read the incident doc named in the thing
 * you are about to duplicate."
 *
 * WHY THIS FILE STILL EARNS ITS PLACE (measured, not assumed): the HA watchdog
 * watches exactly SEVEN entities — front door, back deck door, three leak
 * sensors, garage man door, garage door down. **It does NOT watch the siren.**
 * `siren.301_alarm` — the house's only annunciator, and the one thing
 * `automation.hcc_panic_button_v2` depends on — was unwatched by anything until
 * this gate caught it. The two layers also differ in kind: that automation
 * pushes phone alerts; this is a CI gate that notifies nobody.
 *
 * ⚠️ IF THIS IS EXTENDED: switch it to Z2M availability rather than linkquality
 * age, and narrow it to what the HA watchdog does not already cover. Do not
 * grow a parallel alerting path.
 */
const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.log('sensor-liveness-test.js: SKIPPED — no states file. Pass one: --states=<file>. A skip is not a pass.');
  process.exit(0);
}

// .replace(/^﻿/,'') is load-bearing — PowerShell 5.1 `Set-Content -Encoding UTF8`
// writes a BOM and JSON.parse throws on it. Same note as doors-entity-test.js; that
// one cost 10 minutes on 2026-09-19.
let states;
try {
  states = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
} catch (e) {
  console.log('sensor-liveness-test.js: SKIPPED — cannot read states file (' + e.message + ').');
  process.exit(0);
}

const HOURS_SILENT_FAIL = 12;

/* 🔴 THE FALSE-POSITIVE CLASS THIS GATE HAD ON DAY ONE, AND HOW IT IS FIXED.
 *
 * First run flagged Garage Repeater and Floating Repeater as SILENT for 106 h
 * and 72 h. **Both were perfectly alive.** An active poke (light.turn_on to a
 * bulb already on) brought fresh linkquality back from both within 20 s —
 * LQI 83→65 and 80→72, changed values, so genuinely new readings.
 *
 * WHY THEY LOOKED DEAD: they are MAINS-POWERED ROUTER BULBS. They only publish
 * when something CHANGES. Battery sensors check in on a periodic heartbeat
 * (measured here: 0.7–3.5 h). A mains router sitting at a steady state has
 * nothing to say and says nothing — for days. That is normal.
 *
 * This is COST_LEDGER 2026-08-26 almost word for word: "do not diagnose a
 * device as dead from an absence of messages when the mechanism only sends on
 * change. Cycle the input and watch, or say plainly that you cannot tell yet."
 * I wrote a gate that made exactly that mistake automatic.
 *
 * THE FIX: classify by whether the device has a BATTERY entity.
 *   battery-powered -> it OWES a periodic check-in. Silence = FAIL.
 *   mains-powered   -> silence proves nothing. WARN, and say to poke it.
 * A gate that cries wolf gets ignored, which is worse than no gate.
 */
const KNOWN_DEAD = {
  // ── 2026-09-21 08:49: '301 Alarm' REMOVED FROM THIS TABLE. IT IS FIXED. ──
  // It was listed here as "UNREACHABLE — proven by active test 2026-09-20 09:33",
  // which was TRUE when written: a silent siren.turn_off produced no linkquality
  // report in 20 s while both repeaters answered the same poke.
  //
  // Jeff then found the cause ("check the battery on it because it not charging any
  // more") and repaired the power side. Proven working by ACTIVE FEATURE TEST twice:
  //   2026-09-20 18:47  strobe ON -> replied LQI 167 ; OFF -> replied LQI 163
  //   2026-09-21 08:49  strobe ON -> replied LQI 142 ; OFF -> replied LQI 145
  // Linkquality CHANGED across each pair, so both are genuinely new reports, not
  // retained values — the same discriminator that retracted #193. OPEN_ITEMS #192 closed.
  //
  // 🔴 THE LESSON THIS ENTRY LEAVES BEHIND: a hardcoded KNOWN_DEAD goes stale the
  // moment the device is repaired, and then the gate LIES in the dangerous direction —
  // this one asserted "the house has no working annunciator" over a working siren.
  // Anything added here MUST be re-tested and removed when fixed, or it becomes the
  // 08-21 `ALL GOOD` problem inverted: a red light over a healthy device.
};

// Known-silent devices, each with a REASON and the item that tracks the fix.
// An excuse with no reason is itself a failure (same rule as sensor-coverage-test.js).
const EXCUSED = {
  'Mailbox': 'absent from the Z2M roster entirely (not merely silent) — verified across three registries 2026-09-20 18:26. OPEN_ITEMS #196; the fix is a re-pair and needs no repeater.',
};

// Contacts that are DELIBERATELY open forever, so "open for N hours" is not a finding.
// Without this the gate warns on every single run, and a check that cries wolf gets
// ignored — which is worse than no check (SESSION_START 3b).
const ALWAYS_OPEN = {
  'Spare Contact 1': 'unmounted spare sensor with no magnet near it, so it reads "on" permanently. It is the device once labelled "Garage Door Up" (IEEE 0xa4c13864378427d2), renamed and repurposed — Jeff 2026-09-20: "there is no garage door up sensor because if it\'s not closed it\'s open."',
};

const now = Date.now();
const ageH = (iso) => (now - new Date(iso).getTime()) / 36e5;

/* THE FLOOR, and why reporting an age without it is misleading.
 *
 * OPEN_ITEMS line 52: "Identical timestamps across unrelated devices is the
 * documented signature of an HA restart flooring last_updated, not simultaneous
 * failures." That trap is real and this gate walked into it on its first run:
 * 301 Alarm and Garage Repeater both read exactly 105.9 h.
 *
 * Measured 2026-09-20 02:44: that timestamp is a ZIGBEE2MQTT RESTART at
 * 2026-09-15 16:37:45 — the same second carries bridge_version, permit_join,
 * connection_state and bridge_restart. Z2M republishes every device's retained
 * attributes on startup, so EVERY device gets stamped then.
 *
 * So a device sitting exactly at the floor has not been heard from since the
 * restart — its true failure time is unknown and may be EARLIER. Say that,
 * rather than implying the restart is when it broke.
 *
 * What makes the silence real rather than an artifact: sibling devices on the
 * same bridge reported afterwards. 8 did, within 0.7-3.5 h. These did not.
 */
const bridge = states.find((s) => s.entity_id === 'sensor.zigbee2mqtt_bridge_version');
const floorH = bridge ? ageH(bridge.last_updated) : null;
const atFloor = (h) => floorH !== null && Math.abs(h - floorH) < 0.2;

// Every device that publishes a linkquality is a Zigbee device we can hold to this.
const lq = states.filter((s) => /\slinkquality$/i.test(s.attributes && s.attributes.friendly_name || ''));

let fails = 0;
let warns = 0;
console.log('\nsensor-liveness-test.js — a silent sensor is a fault, even when its last value looks fine\n');

if (!lq.length) {
  console.log('  FAIL  no linkquality entities found at all — either the states dump is wrong or Zigbee is down.');
  process.exit(1);
}

for (const s of lq.sort((a, b) => a.attributes.friendly_name.localeCompare(b.attributes.friendly_name))) {
  const device = s.attributes.friendly_name.replace(/\s+linkquality$/i, '');
  const h = ageH(s.last_updated);
  const excuse = EXCUSED[device];

  if (h > HOURS_SILENT_FAIL) {
    // A device pinned exactly at the Z2M restart stamp has said nothing SINCE
    // that restart — so its real failure time is unknown and may be earlier.
    const how = atFloor(h)
      ? `SILENT since the Z2M restart ${h.toFixed(1)} h ago (nothing after it — true failure time unknown)`
      : `SILENT ${h.toFixed(1)} h`;

    // Does this device owe us a heartbeat? Battery devices do; mains do not.
    const slug = device.toLowerCase().replace(/\s+/g, '_');
    const battery = states.some((s) => s.entity_id === `sensor.${slug}_battery`);

    if (KNOWN_DEAD[device]) {
      fails++;
      console.log(`  FAIL  ${device.padEnd(22)} ${how}`);
      console.log(`        ${KNOWN_DEAD[device]}`);
    } else if (excuse) {
      console.log(`  ok    ${device.padEnd(22)} ${how} — excused: ${excuse.split(';')[0]}`);
    } else if (battery) {
      fails++;
      console.log(`  FAIL  ${device.padEnd(22)} ${how} — battery device, it owes a periodic check-in. The value on the card is a ghost.`);
    } else {
      warns++;
      console.log(`  WARN  ${device.padEnd(22)} ${how} — MAINS device: it only reports on CHANGE, so silence proves nothing.`);
      console.log(`        Confirm with an active poke before calling it dead (light.turn_on / siren.turn_off).`);
    }
    continue;
  }

  // Alive. Now its contact state can be trusted — so a long-open door is a real door.
  const base = device.toLowerCase().replace(/\s+/g, '_');
  const contact = states.find((c) => c.entity_id === `binary_sensor.${base}_contact`);
  if (contact && contact.state === 'on' && ALWAYS_OPEN[device]) {
    console.log(`  ok    ${device.padEnd(22)} open by design — ${ALWAYS_OPEN[device].split(',')[0]}`);
  } else if (contact && contact.state === 'on' && ageH(contact.last_changed) > HOURS_SILENT_FAIL) {
    warns++;
    console.log(`  WARN  ${device.padEnd(22)} alive (LQI ${h.toFixed(1)} h) but OPEN for ${ageH(contact.last_changed).toFixed(1)} h — real door or dropped magnet, needs eyes.`);
  } else {
    console.log(`  ok    ${device.padEnd(22)} reporting ${h.toFixed(1)} h ago`);
  }
}

for (const [k, v] of Object.entries(EXCUSED)) {
  if (!v || !v.trim()) { fails++; console.log(`  FAIL  ${k} is excused with no reason given`); }
}

console.log('');
if (fails) {
  console.log(`SENSOR LIVENESS FAILED — ${fails} sensor(s) silent with no excuse.\n`);
  process.exit(1);
}
console.log(`sensor-liveness-test.js: clean — every Zigbee device still talking${warns ? ` (${warns} open-door warning(s), not failures)` : ''}.\n`);
process.exit(0);
