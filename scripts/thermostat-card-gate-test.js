#!/usr/bin/env node
// thermostat-card-gate-test.js — the HOME screen must show the REAL thermostat (2026-10-26)
//
// RENAMED FROM lux-return-gate-test.js, AND THE RENAME IS THE POINT.
// That gate asserted the app would notice the LUX coming back on its own. It was correct on
// 2026-10-21, when Jeff said during the A/C install: "The LUX is most likely fine it was the
// thermostat wire that was chewed up... So the Lux should be ready to comeback online when they
// get it put in make sure it's ready in the app."
//
// The LUX never came back. On 2026-10-26 a Meross MTS300 was wired to the Tempstar packaged unit
// (R/W/Y/G/C, Rc–Rh jumper kept) and is live in HA as climate.hcc_thermostat. /api/climate has
// answered 503 since 10-15 because the Azure B2C device behind it is gone. So the old gate was
// holding the app to a promise about hardware that no longer exists — a green check guarding a
// dead premise, which is the same failure class as the `ALL GOOD` stream check: it cannot fail
// usefully, and it blocks the correct change.
//
// WHAT THIS GATE NOW PROTECTS, and why each one is here:
//   1. No probing /api/climate. Every probe was a guaranteed-failing Pages Function request
//      charged against the Cloudflare budget — the exact cost OPEN_ITEMS #183 was opened over.
//   2. The thermostat card renders from the A/C card's EXISTING template payload, so a live
//      thermostat costs ZERO extra requests per refresh.
//   3. 🔴 'unavailable' is never rendered as a temperature. A dropped LAN device must read as
//      "not reporting", not as a stale number — a frozen sensor that still prints is the #240
//      Kidde failure, where `off` was indistinguishable from "no smoke" for 12.7 hours.
//   4. 🔴 The dead SONOFF relay card must HIDE, not show red. switch.ac_relay was removed from
//      HA at the Tempstar install; left alone the card shows OFFLINE in red forever, which
//      trains Jeff to ignore a red banner on the one screen that has to be trustworthy.
//   5. loadClimate(), luxShowCard() and the LUX markup must SURVIVE — scripts/creds-gate-test.js
//      covers that path, and tidying them away would break it for no gain.
//
// Usage: node scripts/thermostat-card-gate-test.js
// Point at a fixture with HCC_LUX_APP=<path> to prove it goes RED. Never edit the live
// index.html to test the gate that guards it.

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

const APP = process.env.HCC_LUX_APP || path.join(__dirname, '..', 'index.html');
const FILE_URL = 'file://' + APP;

let failed = 0;
function check(name, cond, got) {
  if (!cond) failed++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${got === undefined ? '' : '   got=' + JSON.stringify(got)}`);
}

async function main() {
  console.log('\nthermostat-card-gate-test.js — HOME must show the real thermostat\n');

  const src = fs.readFileSync(APP, 'utf8');
  const loadTherm = (src.match(/function\s+loadThermostat\s*\([\s\S]{0,2600}?\n\}/) || [''])[0];
  // Strip // comments before the source check: the function's own comment EXPLAINS why the
  // /api/climate probe was removed, and a naive text search scores that explanation as the
  // thing it forbids. (It did, on this gate's first run.) The behavioural fetch count below is
  // the real proof; this source check is the cheap early warning.
  const loadThermCode = loadTherm.replace(/^\s*\/\/.*$/gm, '');

  // ── Source-level invariants ──
  check('the hard LUX_RETIRED switch is gone from the code',
    !/var\s+LUX_RETIRED\s*=/.test(src));
  check('loadThermostat still draws the A/C relay card',
    /loadAcRelay\s*\(/.test(loadTherm));
  check('loadThermostat NO LONGER probes the dead /api/climate',
    loadThermCode.indexOf('/api/climate') === -1);
  check('the thermostat entity rides on the A/C template (no extra request)',
    /climate\.hcc_thermostat/.test(src) && /ts_cur/.test(src));
  check('the calibration trim is surfaced, so a stuck tracker is visible',
    /_calibration/.test(src) && /ts_cal/.test(src));
  check('loadClimate + the LUX markup survive for creds-gate-test.js',
    /function\s+loadClimate\s*\(/.test(src) && /id="luxCard"/.test(src));

  const browser = await chromium.launch(
    usingSandbox ? { executablePath: SANDBOX_CHROME } : {});
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(FILE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  // Count every fetch so a re-introduced probe is caught behaviourally, not just by regex.
  await page.evaluate(() => {
    window.__fetches = [];
    window.loadAcRelay = function(){ window.__acDrawn = (window.__acDrawn || 0) + 1; };
    window.__acDrawn = 0;
    const real = window.fetch;
    window.fetch = function(u){
      window.__fetches.push(String(u));
      return Promise.resolve({ ok: false, status: 503, json: () => Promise.resolve({}),
                               text: () => Promise.resolve('') });
    };
    window.__realFetch = real;
    // 🔴 Reset the old probe's throttle state before counting. Without this the gate is a
    // FALSE GREEN: the app's own boot already ran loadThermostat() once, so a re-introduced
    // 10-minute throttle would swallow every probe this gate makes and the check would pass
    // against the exact code it exists to forbid. Caught on this gate's own red-proof run,
    // which is the only reason it is known. These are no-ops once the probe is gone.
    window.luxLastProbe = 0;
    window.luxIsLive = false;
  });

  // ── 1. loadThermostat must cost nothing on the dead endpoint. ──
  await page.evaluate(() => { window.loadThermostat(); window.loadThermostat(); window.loadThermostat(); });
  await page.waitForTimeout(250);
  let st = await page.evaluate(() => ({
    climate: window.__fetches.filter((u) => u.indexOf('/api/climate') >= 0).length,
    ac: window.__acDrawn,
    luxShown: (document.getElementById('luxCard') || {}).style.display !== 'none',
  }));
  check('COST: zero /api/climate requests, however often it runs', st.climate === 0, st.climate);
  check('COST: the A/C path still runs every time', st.ac === 3, st.ac);
  check('the LUX card stays hidden', !st.luxShown);

  // ── 2. A LIVE thermostat renders real numbers. ──
  await page.evaluate(() => window.tsRender({
    ts_cur: 69, ts_set: 72, ts_mode: 'cool', ts_act: 'idle',
    ts_cal: '1.6', ts_filter: '100.0', ts_signal: '100', ts_track: 'on',
  }));
  st = await page.evaluate(() => ({
    cur: (document.getElementById('tsCur') || {}).textContent,
    set: (document.getElementById('tsSet') || {}).textContent,
    coolBtn: ((document.getElementById('tsBtnCool') || {}).className || ''),
    heatBtn: ((document.getElementById('tsBtnHeat') || {}).className || ''),
    cal: (document.getElementById('tsCal') || {}).textContent,
    banner: (document.getElementById('tsBanner') || {}).className,
    hasBumpBtn: !!document.querySelector('button[onclick*="tstatBump"]'),
    hasModeBtns: !!document.querySelector('button[onclick*="tstatMode"]'),
    hasFanBtns: !!document.querySelector('button[onclick*="tstatFan"]'),
    hasLockBtn: !!document.querySelector('button[onclick*="tstatLockToggle"]'),
  }));
  check('LIVE: the room temperature is shown', /69/.test(st.cur || ''), st.cur);
  check('LIVE: the setpoint is shown', /72/.test(st.set || ''), st.set);
  // Mode is signalled by which button is highlighted (primary vs secondary), not a label.
  check('LIVE: the active mode button is highlighted',
    /primary/.test(st.coolBtn) && !/primary/.test(st.heatBtn),
    { cool: st.coolBtn.slice(0, 40), heat: st.heatBtn.slice(0, 40) });
  check('CONTROLS: setpoint arrows are wired', st.hasBumpBtn);
  check('CONTROLS: mode buttons are wired', st.hasModeBtns);
  check('CONTROLS: fan speed buttons are wired', st.hasFanBtns);
  check('CONTROLS: child lock toggle is wired', st.hasLockBtn);
  // 1.6 C of trim is 2.9 F — the card must speak Fahrenheit (Jeff's standing rule).
  check('LIVE: the trim is shown in FAHRENHEIT, not celsius', /2\.9/.test(st.cal || ''), st.cal);
  check('LIVE: no error banner on a healthy thermostat', !/wx-no/.test(st.banner || ''), st.banner);

  // ── 3. A tracker that has been switched off must be visible, not silent. ──
  await page.evaluate(() => window.tsRender({
    ts_cur: 69, ts_set: 72, ts_mode: 'cool', ts_act: 'idle',
    ts_cal: '1.6', ts_filter: '100.0', ts_signal: '100', ts_track: 'off',
  }));
  st = await page.evaluate(() => ({ cal: (document.getElementById('tsCal') || {}).textContent }));
  check('TRACKER OFF: the card says so instead of hiding it',
    /TRACKING OFF/i.test(st.cal || ''), st.cal);

  // ── 4. 🔴 THE #240 LESSON. Unavailable must never render as a temperature. ──
  await page.evaluate(() => window.tsRender({
    ts_cur: null, ts_set: null, ts_mode: 'unavailable', ts_act: null, ts_cal: null,
  }));
  st = await page.evaluate(() => ({
    cur: (document.getElementById('tsCur') || {}).textContent,
    banner: (document.getElementById('tsBanner') || {}).className,
    conn: (document.getElementById('tsConn') || {}).textContent,
  }));
  check('DEAD: it says no reading instead of printing a number',
    /no reading/i.test(st.cur || '') && !/\d+°/.test(st.cur || ''), st.cur);
  check('DEAD: the banner goes red', /wx-no/.test(st.banner || ''), st.banner);
  check('DEAD: the connection chip says OFFLINE', /OFFLINE/i.test(st.conn || ''), st.conn);

  // ── 5. 🔴 The removed SONOFF relay must hide its card, not show a red fault. ──
  await page.evaluate(() => {
    const el = document.getElementById('acCard'); if (el) el.style.display = '';
    window.acRender({ relay: 'missing', ts_mode: 'cool', indoor: '69.3' });
  });
  st = await page.evaluate(() => ({
    shown: (document.getElementById('acCard') || {}).style.display !== 'none',
    banner: (document.getElementById('acBanner') || {}).innerHTML,
  }));
  check('RELAY GONE: the obsolete A/C relay card is hidden', !st.shown, st.shown);
  check('RELAY GONE: it does NOT shout OFFLINE in red', !/OFFLINE/.test(st.banner || ''));

  // ── 6. If the relay ever comes back, so does its card — no deploy either direction. ──
  await page.evaluate(() => window.acRender({
    relay: 'on', relay_changed: new Date().toISOString(), ts_mode: 'cool',
    indoor: '69.3', auto: 'on', master: 'on',
  }));
  st = await page.evaluate(() => ({
    shown: (document.getElementById('acCard') || {}).style.display !== 'none',
    state: (document.getElementById('acState') || {}).textContent,
  }));
  check('RELAY BACK: the card reappears on its own', st.shown, st.shown);
  check('RELAY BACK: it reports the relay state', /ON/.test(st.state || ''), st.state);

  check('no page errors', errs.length === 0, errs.slice(0, 2));

  await browser.close();
  console.log(failed
    ? `\nthermostat-card-gate-test.js: ${failed} FAILED.\n`
    : '\nthermostat-card-gate-test.js: clean — HOME shows the real thermostat.\n');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('  FAIL  harness error:', e.message); process.exit(1); });
