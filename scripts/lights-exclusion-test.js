#!/usr/bin/env node
// lights-exclusion-test.js — what the GUARDIAN "Lights & Plugs" card may and may NOT control.
//
// Why this exists (each line is a real incident):
//  - 2026-09-24: "ALL OFF" was killing the A/C (switch.ac_relay) and PULSING the garage door
//    (switch.garage_garage_door_opener); the siren strobe (switch.301_alarm_light) is not a light.
//  - 2026-09-28, Jeff: "make sure that the repeaters stay on 24-7 they are listed as on they come
//    up as lights". The Zigbee USB repeaters are light.* — every light.* was admitted, so ALL OFF
//    and the brightness slider switched the mesh's routers off.
//
// Runs the REAL filter: it cuts the `states.filter(function(s){ ... })` block out of index.html
// and evaluates it, so a later edit to that block is what gets tested — not a copy of it.
// Usage: node scripts/lights-exclusion-test.js [path/to/index.html]
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || path.join(__dirname, '..', 'index.html');
const src = fs.readFileSync(file, 'utf8');

// Anchor on the END marker: an unrelated one-line `var devs = states.filter(...)` sits earlier in
// the file (the doors card), so the start is the LAST filter before `window._lights = devs;`.
const end = src.indexOf('window._lights = devs;');
const start = src.lastIndexOf('var devs = states.filter(function(s){', end);
if (start < 0 || end < 0) {
  console.error('✗ lights-exclusion-test: could not find the Lights & Plugs filter in ' + file);
  process.exit(1);
}
const block = src.slice(start, end);
const sfx = src.match(/var LIGHT_CONFIG_SUFFIX = (\/.*\/);/);
if (!sfx) { console.error('✗ lights-exclusion-test: LIGHT_CONFIG_SUFFIX not found'); process.exit(1); }

const run = new Function('states', 'LIGHT_CONFIG_SUFFIX', 'lightIsIrrigation', 'isVacuumSwitch',
  block + '\nreturn devs.map(function(d){ return d.entity_id; });');

const st = (id, a) => ({ entity_id: id, state: 'on', attributes: a || {} });
const states = [
  st('light.garage_repeater'), st('light.floating_repeater'),                        // must be OUT
  st('switch.ac_relay', { device_class: 'outlet' }),
  st('switch.garage_garage_door_opener', { device_class: 'outlet' }),
  st('switch.301_alarm_light'),
  // 2026-10-20: the siren's own switch sat in Lights & Plugs reading "OFF" (its original_name is
  // "Socket 1"), which made ALL ON a button that sounds the 120 dB house siren. Jeff: "the siren
  // plug needs to be relabeled and moved out of the light chain and protected with the alarm."
  st('switch.house_alarm', { device_class: 'outlet' }),
  // 2026-10-20, found by running this filter against a LIVE /api/states dump rather than trusting
  // the card to look right: the card held 16 entities and only 9 were lights or plugs.
  st('switch.smoke_and_co2_identifying'),            // fires the Kidde's own chirp
  st('switch.living_room_echo_dot_amazon_kids'),     // an Alexa setting, not a device
  st('light.livingroom_cans'), st('light.bedroom_cans'), st('light.kitchen_dining_room_cans'), // must be IN
  st('switch.bed_lamp_socket_1', { device_class: 'outlet' }), st('switch.masterbath_cans'),
];
const kept = run(states, eval(sfx[1]), () => false, () => false);

const mustOut = ['light.garage_repeater', 'light.floating_repeater', 'switch.ac_relay',
  'switch.garage_garage_door_opener', 'switch.301_alarm_light', 'switch.house_alarm',
  'switch.smoke_and_co2_identifying', 'switch.living_room_echo_dot_amazon_kids'];
const mustIn = ['light.livingroom_cans', 'light.bedroom_cans', 'light.kitchen_dining_room_cans',
  'switch.bed_lamp_socket_1', 'switch.masterbath_cans'];

let bad = 0;
for (const id of mustOut) if (kept.includes(id)) { bad++; console.error('✗ ' + id + ' is controllable from Lights & Plugs (ALL OFF would switch it)'); }
for (const id of mustIn) if (!kept.includes(id)) { bad++; console.error('✗ ' + id + ' is MISSING from Lights & Plugs'); }
if (bad) { console.error('✗ lights-exclusion-test: ' + bad + ' failure(s)'); process.exit(1); }
console.log('✓ lights-exclusion-test: ' + mustOut.length + ' excluded (repeaters, A/C, garage door, strobe, house siren, Kidde chirp, Alexa Kids), ' + mustIn.length + ' real lights kept');
