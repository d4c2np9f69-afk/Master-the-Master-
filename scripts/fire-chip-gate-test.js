#!/usr/bin/env node
// fire-chip-gate-test.js — the Guardian SMOKE & CO chip and card (2026-10-18)
//
// NAME: deliberately NOT "smoke-*". `smoke-test.js` in this directory is the UI smoke
// test (the testing term). This one is about actual smoke. Do not merge them.
//
// WHY THIS GATE EXISTS
// Jeff bought Kidde hardwired alarms (20SAR-W / 30CUAR-W) and asked for three things:
// into HA, onto the Guardian page reading "Off" when clear, and firing the siren.
// This gates the app half, and it matters more than most gates here for one reason:
//
//   A FALSE FIRE ALARM IS THE WORST CHIP IN THIS APP TO CRY WOLF ON.
//
// The WATER chip already did exactly that (2026-09-16): a SUBSTRING match on the entity
// id read LEAK permanently off `binary_sensor.water_monitor_upstream_sensors_health` —
// device_class `connectivity`, whose `on` means HEALTHY. A permanent false alert teaches
// Jeff to ignore the one warning in this house that has already cost him real money.
// SMOKE & CO is built on device_class for that reason; this gate keeps it that way.
//
// It also pins the two things that are easy to "tidy up" later and must not change:
//   1. `too_much_smoke` is EXCLUDED. The Kidde integration ships it as a DIAGNOSTIC
//      entity carrying device_class `smoke`, and it is the one most likely to trip on
//      cooking. The siren automation `hcc_smoke_co_alarm` rejects the identical string,
//      so if the app stops excluding it the chip and the siren disagree about what
//      counts as a fire.
//   2. The clear-state word is exactly "Off" — Jeff's own instruction, 2026-10-18.
//
// Usage: node scripts/fire-chip-gate-test.js

const path = require('path');
const fs = require('fs');

const SANDBOX_PW = '/opt/node22/lib/node_modules/playwright';
const SANDBOX_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let chromium;
let usingSandbox = false;
try {
  ({ chromium } = require(SANDBOX_PW));
  usingSandbox = fs.existsSync(SANDBOX_CHROME);
} catch (e) {
  ({ chromium } = require('playwright'));
}

// Point at a fixture with HCC_FIRE_CHIP_APP=<path> to prove this gate goes RED on a real
// fault — same convention crash-watchdog-gate-test.js uses. NEVER edit the live index.html
// to test the gate that guards it.
const APP = process.env.HCC_FIRE_CHIP_APP || path.join(__dirname, '..', 'index.html');
const FILE_URL = 'file://' + APP;

let failed = 0;
function check(name, cond, got) {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${got === undefined ? '' : '   got=' + JSON.stringify(got)}`);
}

// Mock states, carrying the three traps this gate exists to catch:
//   - too_much_smoke          : right device_class, must STILL be excluded
//   - *_smoke_detected_health : the 09-16 WATER bug's exact shape — 'smoke' in the id,
//                               wrong device_class, state 'on' meaning HEALTHY
//   - a moisture sensor       : a real safety sensor that must never land here
function mockStates(opts) {
  opts = opts || {};
  const S = [
    { entity_id: 'binary_sensor.hallway_smoke_alarm',
      state: opts.smokeOn ? 'on' : 'off',
      last_changed: new Date(Date.now() - 3600000).toISOString(),
      attributes: { device_class: 'smoke', friendly_name: 'Hallway Smoke Alarm' } },
    { entity_id: 'binary_sensor.hallway_co_alarm',
      state: opts.coOn ? 'on' : 'off',
      last_changed: new Date(Date.now() - 7200000).toISOString(),
      attributes: { device_class: 'carbon_monoxide', friendly_name: 'Hallway CO Alarm' } },
    { entity_id: 'binary_sensor.hallway_too_much_smoke',
      state: 'on',
      attributes: { device_class: 'smoke', friendly_name: 'Hallway Too Much Smoke' } },
    { entity_id: 'binary_sensor.kidde_smoke_detected_health',
      state: 'on',
      attributes: { device_class: 'connectivity', friendly_name: 'Kidde Smoke Detected Health' } },
    { entity_id: 'binary_sensor.kitchen_sink_leak',
      state: 'off',
      attributes: { device_class: 'moisture', friendly_name: 'Kitchen Sink Leak' } },
    { entity_id: 'sensor.hallway_smoke_alarm_battery',
      state: '87', attributes: { device_class: 'battery' } },
    // 2026-10-19: the detector's own cloud check-in time. `opts.stale` reproduces the real
    // failure of that day — a detector on WiFi, answering ping, whose last report to Kidde was
    // 9 h old while the card rendered every reading in green and said "LIVE".
    { entity_id: 'sensor.hallway_last_seen',
      state: new Date(Date.now() - (opts.stale ? 9 * 3600000 : 60000)).toISOString(),
      attributes: { friendly_name: 'Hallway Last Seen' } },
  ];
  if (opts.none) {
    return S.filter((s) => s.attributes.device_class !== 'smoke'
                        && s.attributes.device_class !== 'carbon_monoxide');
  }
  return S;
}

async function main() {
  console.log('\nfire-chip-gate-test.js — the Guardian SMOKE & CO chip and card\n');

  // ── Source-level assertions: intent a DOM check cannot see. ──
  const src = fs.readFileSync(APP, 'utf8');
  // 2026-10-19 SUPERSEDES the 10-18 "Off" instruction. Jeff, seeing it rendered in context:
  // "off looks like it's not on and not monitored". "Off" is a power state; "Clear" is a status.
  check('chip clear-state word is "Clear", never "Off" (Jeff 2026-10-19)',
    /grdSet\('grd-smoke',\s*'Clear'/.test(src) && !/grdSet\('grd-smoke',\s*'Off'/.test(src));
  check('chip reports staleness instead of a green lie (Jeff 2026-10-19)',
    /grdSet\('grd-smoke',\s*'Not reporting'/.test(src));
  check('hccSmokeDetectors exists and excludes too_much',
    /function hccSmokeDetectors/.test(src) && /too_much/.test(src));
  check('filter keys off device_class, not the entity id',
    /cls\[s\.attributes\.device_class\]/.test(src));
  check('GAS chip no longer also claims smoke/carbon_monoxide (no double alert)',
    !/fireCls\s*=\s*\{\s*gas:\s*1,\s*smoke:/.test(src));
  check('grdPlaceholder resets the new chip',
    /grdSet\('grd-smoke',\s*'Sensor pending'/.test(src));
  // Quoted form only. A bare mention is prose — the comment on smokeCard explains that the
  // app deliberately does NOT touch this entity, and the first draft of this check matched
  // that comment and reported a failure against perfectly correct code. A gate that cries
  // wolf gets ignored, which is worse than no gate (SESSION_START 3b).
  check('the siren stays single-owner: the app never calls switch.house_alarm in code',
    !/['"]switch\.house_alarm['"]/.test(src));

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  if (usingSandbox) launchOpts.executablePath = SANDBOX_CHROME;
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(FILE_URL);
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const s = document.getElementById('splashScreen');
    if (s) s.style.display = 'none';
  });

  check('the grd-smoke hero chip exists in the DOM',
    await page.evaluate(() => !!document.getElementById('grd-smoke')));
  check('the smokeCard exists in the DOM',
    await page.evaluate(() => !!document.getElementById('smokeCard')));
  check('hccSmokeDetectors is reachable at runtime',
    await page.evaluate(() => typeof window.hccSmokeDetectors === 'function'));
  check('renderSmokeCard is reachable at runtime',
    await page.evaluate(() => typeof window.renderSmokeCard === 'function'));

  const fn = mockStates.toString();

  // ── The filter — the part that must never regress to a substring match. ──
  const picked = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    return window.hccSmokeDetectors(mockStates({})).map((s) => s.entity_id);
  }, { fn });
  check('picks exactly the two real alarms', picked.length === 2, picked);
  check('EXCLUDES too_much_smoke (diagnostic; cooking trips it)',
    picked.indexOf('binary_sensor.hallway_too_much_smoke') < 0);
  check('EXCLUDES a connectivity sensor with "smoke" in its id (the 09-16 WATER bug)',
    picked.indexOf('binary_sensor.kidde_smoke_detected_health') < 0);
  check('EXCLUDES a moisture sensor',
    picked.indexOf('binary_sensor.kitchen_sink_leak') < 0);
  check('INCLUDES the carbon_monoxide alarm',
    picked.indexOf('binary_sensor.hallway_co_alarm') >= 0);

  // ── The card, all three states. ──
  const quiet = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates({}));
    const l = document.getElementById('smokeList') || {};
    return { note: (document.getElementById('smokeNote') || {}).textContent || '',
             rows: l.innerText || '', shown: (l.style || {}).display !== 'none' };
  }, { fn });
  check('all-clear card says "Clear" on each row, never "Off" (Jeff 2026-10-19)',
    /Clear/.test(quiet.rows) && !/\bOff\b/.test(quiet.rows), quiet.rows.slice(0, 70));
  check('all-clear card never says ALARM', !/ALARM/.test(quiet.rows));
  check('all-clear note reports both as clear', /All 2 clear/.test(quiet.note), quiet.note);
  check('all-clear note says it is actively monitoring (Jeff 2026-10-19)',
    /Monitoring/i.test(quiet.note), quiet.note);
  check('all-clear card shows its list', quiet.shown);
  check('rows name the function, not the raw entity (Jeff 2026-10-19)',
    /Carbon monoxide/.test(quiet.rows) && /Smoke/.test(quiet.rows), quiet.rows.slice(0, 90));

  // ── STALE DATA. The 2026-10-19 failure: every reading correct, all of it 9 h old, card green
  // and badged "LIVE". A safety card must never present stale data as current. ──
  const old = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates({ stale: true }));
    const b = document.getElementById('smokeBanner') || {};
    return { note: (document.getElementById('smokeNote') || {}).textContent || '',
             rows: (document.getElementById('smokeList') || {}).innerText || '',
             banner: b.innerText || '',
             bannerShown: (b.style || {}).display !== 'none',
             conn: (document.getElementById('smokeConn') || {}).textContent || '' };
  }, { fn });
  check('STALE: a warning banner is shown', old.bannerShown && /NOT REPORTING/i.test(old.banner),
    old.banner.slice(0, 90));
  check('STALE: the badge no longer claims LIVE', !/LIVE/i.test(old.conn), old.conn);
  check('STALE: rows use the past tense, not a bare "Clear"',
    /Was clear/i.test(old.rows), old.rows.slice(0, 90));
  check('STALE: the note says it is not reporting', /Not reporting/i.test(old.note), old.note);
  check('STALE: it still never cries ALARM while nothing is burning', !/ALARM/.test(old.rows));

  const smoking = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates({ smokeOn: true }));
    return { note: (document.getElementById('smokeNote') || {}).textContent || '',
             rows: (document.getElementById('smokeList') || {}).innerText || '' };
  }, { fn });
  check('a firing smoke alarm reads SMOKE ALARM', /SMOKE ALARM/.test(smoking.rows));
  check('a firing smoke alarm reports 1 ALARMING', /1 ALARMING/.test(smoking.note), smoking.note);

  const co = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates({ coOn: true }));
    return (document.getElementById('smokeList') || {}).innerText || '';
  }, { fn });
  check('a firing CO alarm reads CO ALARM, not SMOKE ALARM', /CO ALARM/.test(co));

  const empty = await page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates({ none: true }));
    const b = document.getElementById('smokeBanner') || {};
    return { shown: (b.style || {}).display !== 'none', banner: b.textContent || '',
             note: (document.getElementById('smokeNote') || {}).textContent || '' };
  }, { fn });
  check('with no detectors the card says so honestly',
    empty.shown && /No smoke or CO alarm/.test(empty.banner), empty.banner);
  check('with no detectors the note never implies coverage',
    !/clear/i.test(empty.note) && !/armed/i.test(empty.note), empty.note);

  check('no page errors', errors.length === 0, errors);

  await browser.close();

  if (failed) {
    console.log(`\nfire-chip-gate-test.js: ${failed} FAILED.\n`);
    process.exit(1);
  }
  console.log('\nfire-chip-gate-test.js: clean — the fire chip reports only real fire.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
