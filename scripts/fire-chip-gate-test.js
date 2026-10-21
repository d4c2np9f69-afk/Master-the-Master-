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
      state: opts.unavail ? 'unavailable' : (opts.smokeOn ? 'on' : 'off'),
      last_changed: new Date(Date.now() - 3600000).toISOString(),
      last_reported: new Date(Date.now() - (opts.staleWrite ? 90 * 60000 : 20000)).toISOString(),
      attributes: { device_class: 'smoke', friendly_name: 'Hallway Smoke Alarm' } },
    { entity_id: 'binary_sensor.hallway_co_alarm',
      state: opts.unavail ? 'unavailable' : (opts.coOn ? 'on' : 'off'),
      last_changed: new Date(Date.now() - 7200000).toISOString(),
      last_reported: new Date(Date.now() - (opts.staleWrite ? 90 * 60000 : 20000)).toISOString(),
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
    // 2026-10-21: the signals the cloud actually keeps CURRENT. `online`/`lost` are the
    // detector's real liveness; `last_reported` is how long since HA fetched at all.
    { entity_id: 'binary_sensor.hallway_online',
      state: opts.unavail ? 'unavailable' : (opts.offline ? 'off' : 'on'),
      last_reported: new Date(Date.now() - (opts.staleWrite ? 90 * 60000 : 20000)).toISOString(),
      attributes: { device_class: 'connectivity', friendly_name: 'Hallway Online' } },
    { entity_id: 'binary_sensor.hallway_lost',
      state: opts.lost ? 'on' : 'off',
      last_reported: new Date(Date.now() - (opts.staleWrite ? 90 * 60000 : 20000)).toISOString(),
      attributes: { friendly_name: 'Hallway Lost' } },
    // 2026-10-19: the detector's own cloud check-in time. `opts.stale` reproduces the real
    // failure of that day — a detector on WiFi, answering ping, whose last report to Kidde was
    // 9 h old while the card rendered every reading in green and said "LIVE".
    { entity_id: 'sensor.hallway_last_seen',
      state: new Date(Date.now() - (opts.deadCheckIn ? 30 * 3600000
                                  : opts.stale ? 9 * 3600000 : 60000)).toISOString(),
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
  // 2026-10-21: this used to demand the literal 'Not reporting'. The chip now distinguishes
  // the three things that were being conflated under that one word - the cloud says the
  // detector is OFFLINE, we have stopped FETCHING, or there has been no CHECK-IN in 26 h -
  // so assert the intent (a non-green staleness state exists, driven by online/lost rather
  // than by last_seen alone) instead of one wording.
  check('chip reports staleness instead of a green lie (Jeff 2026-10-19)',
    /grdSet\('grd-smoke',\s*'(Offline|Not updating|No check-in|Not reporting)'/.test(src));
  check('chip liveness is NOT judged by last_seen alone (Jeff 2026-10-21)',
    /sOffline/.test(src) && /_online'\)/.test(src) && !/sMin !== null && sMin > 120/.test(src));
  // Both 2026-10-21 mistakes, nailed shut at the source.
  // ⚠️ The first draft of this check used /sFetch/ and went red on `haStatsFetch`, an unrelated
  // electric-statistics function — rule 3b's "a test that cries wolf" caught in the test itself.
  // Anchor on the variable declarations, which only the deleted timer had.
  check('liveness never uses a last_reported AGE THRESHOLD (the 10-21 10:2x false alarm)',
    !/var\s+fetchAge\b/.test(src) && !/var\s+sFetch\b/.test(src)
    && !/function\s+repAgeMin\b/.test(src) && !/function\s+sRepAge\b/.test(src));
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
  // 2026-10-20: tightened. The rule is that the app must never COMMAND the siren — the single
  // owner is automation hcc_smoke_co_alarm, which fires the hcc_siren event. Reading the switch's
  // state to DISPLAY it, and naming it to EXCLUDE it from the lights toggle list, are the opposite
  // of the mistake this guards: before today switch.house_alarm sat in Lights & Plugs reading
  // "OFF" and was a target of ALL ON, i.e. one tap sounded the 120 dB siren. A check that forbade
  // the fix as well as the fault would have blocked the safety change (SESSION_START 3b: a gate
  // that cries wolf is worse than no gate). So: flag it only where the entity is being SENT to HA.
  const sirenCmd = src.split('\n').filter((ln) =>
    /['"]switch\.house_alarm['"]/.test(ln) &&
    /(lightToggle\s*\(|JSON\.stringify|body\s*:|api\/services|turn_on|turn_off|\btoggle\s*\()/.test(ln));
  check('the siren stays single-owner: the app never COMMANDS switch.house_alarm',
    sirenCmd.length === 0, sirenCmd.join(' | ').slice(0, 160));

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

  // ── LIVENESS. Two real failures, and one FALSE alarm that cost a morning. ──
  //
  // 2026-10-19: every reading correct, all of it 9 h old, card green and badged "LIVE".
  // 2026-10-21: the fix for that judged liveness by `_last_seen` at a 2-HOUR threshold, and
  //   `_last_seen` is NOT a heartbeat. Measured over 4 days of recorder history its gaps were
  //   19.0 h, 7.7 h and 14.1 h, while coordinator debug logging showed HA polling Kidde every
  //   30 s, succeeding every time, each poll returning the SAME last_seen with online/lost/rssi
  //   all current. So the card screamed NOT REPORTING at a perfectly healthy detector most of
  //   every day. Jeff: "Why is the Kidde not reporting it is online and everything is working
  //   in the kiddie app." A card that cries wolf gets ignored, which is worse than no card.
  const render = async (opts) => page.evaluate((a) => {
    const mockStates = eval('(' + a.fn + ')');
    window.renderSmokeCard(mockStates(a.opts));
    const b = document.getElementById('smokeBanner') || {};
    return { note: (document.getElementById('smokeNote') || {}).textContent || '',
             rows: (document.getElementById('smokeList') || {}).innerText || '',
             banner: b.innerText || '',
             bannerShown: (b.style || {}).display !== 'none',
             conn: (document.getElementById('smokeConn') || {}).textContent || '' };
  }, { fn, opts });

  // THE REGRESSION TEST FOR 2026-10-21 — a slow cloud check-in is NOT a fault.
  const slow = await render({ stale: true });
  check('SLOW CHECK-IN: 9 h since the cloud logged one is NOT called a fault',
    !slow.bannerShown || !/NOT REPORTING|OFFLINE|NOT UPDATING/i.test(slow.banner),
    slow.banner.slice(0, 90) || '(no banner)');
  check('SLOW CHECK-IN: the badge still reads LIVE', /LIVE/i.test(slow.conn), slow.conn);

  // REAL FAILURE 1 — the cloud itself says the detector is not connected.
  const off = await render({ offline: true });
  check('OFFLINE: a warning banner is shown',
    off.bannerShown && /OFFLINE/i.test(off.banner), off.banner.slice(0, 90));
  check('OFFLINE: the badge no longer claims LIVE', !/LIVE/i.test(off.conn), off.conn);
  check('OFFLINE: rows use the past tense, not a bare "Clear"',
    /Was clear/i.test(off.rows), off.rows.slice(0, 90));
  check('OFFLINE: the note says it is not reporting', /Not reporting/i.test(off.note), off.note);
  check('OFFLINE: it still never cries ALARM while nothing is burning', !/ALARM/.test(off.rows));

  // REAL FAILURE 1b — the `lost` flag is the same verdict by another name.
  const lost = await render({ lost: true });
  check('LOST: the cloud\'s lost flag also warns',
    lost.bannerShown && /OFFLINE/i.test(lost.banner), lost.banner.slice(0, 90));

  // THE SECOND REGRESSION TEST FOR 2026-10-21, written 40 minutes after the first fix shipped
  // BROKE THIS EXACT WAY. That fix called it "not updating" when last_reported was older than
  // 15 min. Measured live at 10:25: every Kidde entity read last_reported 66.9 min old while
  // the coordinator debug log proved successful fetches every 30 s. last_reported moves when a
  // state is WRITTEN, and HA's DataUpdateCoordinator does not notify listeners when the newly
  // fetched payload is identical - so steady readings write nothing for hours. One crying-wolf
  // card was swapped for another in under an hour. A stale WRITE CLOCK is not a dead feed.
  const quietWrites = await render({ staleWrite: true });
  check('STALE WRITE CLOCK: 90 min since the last state write is NOT a fault',
    !quietWrites.bannerShown || !/NOT UPDATING|OFFLINE|NOT REPORTING/i.test(quietWrites.banner),
    quietWrites.banner.slice(0, 90) || '(no banner)');
  check('STALE WRITE CLOCK: the badge still reads LIVE',
    /LIVE/i.test(quietWrites.conn), quietWrites.conn);

  // REAL FAILURE 2 — OUR side broke. When a coordinator update fails, HA's own
  // CoordinatorEntity.available goes false and every entity reads `unavailable`. That is the
  // honest signal, and it needs no timer and no threshold.
  const cold = await render({ unavail: true });
  check('NOT UPDATING: warns when HA cannot read the detector',
    cold.bannerShown && /NOT UPDATING/i.test(cold.banner), cold.banner.slice(0, 90));
  check('NOT UPDATING: the badge no longer claims LIVE', !/LIVE/i.test(cold.conn), cold.conn);

  // REAL FAILURE 3 — the long backstop, past the measured 19.0 h worst case.
  const dead = await render({ deadCheckIn: true });
  check('NO CHECK-IN: the 26 h backstop still fires on a truly dead device',
    dead.bannerShown && /NO CHECK-IN/i.test(dead.banner), dead.banner.slice(0, 90));

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
