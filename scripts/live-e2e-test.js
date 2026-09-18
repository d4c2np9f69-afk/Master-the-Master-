#!/usr/bin/env node
/* live-e2e-test.js — drive the REAL deployed app with a REAL token (2026-09-15)
 *
 * WHY THIS EXISTS
 * ---------------
 * The existing gate is good at components and blind to the whole:
 *   lint-app          — anti-patterns in the source
 *   smoke-test        — the app running from a LOCAL file with MOCKED data
 *   image-fit-audit   — geometry
 *   creds-gate-test   — the app never holds credentials
 *   auth-gate-test    — the server gates every control endpoint
 *
 * Not one of them loads the page that is actually deployed, with the real API behind
 * it. So on 2026-09-15 `fetchWithCreds()` — which feeds BOTH the irrigation card and
 * the LUX card — was rewritten, four deploys went out (v109 → v112), every gate
 * passed, and nothing had opened the live app to see whether irrigation still
 * rendered. That is the exact shape of the failure this project keeps paying for:
 * green components, unexamined feature. See CLAUDE.md, "the two habits".
 *
 * WHAT IT ASSERTS against the deployed site:
 *   1. the A/C card shows a real temperature and is reading the weather station
 *   2. the WEATHER station card shows indoor, outdoor and pressure
 *   3. IRRIGATION renders and does NOT fall back to asking for a login — that
 *      fallback is what a broken credential path looks like from the outside
 *   4. no request URL anywhere carries a credential           (#186)
 *   5. no page errors, no failed requests
 *   6. all six nav sections still open
 *
 * CREDENTIAL: set the environment variable HCC_HA_TOKEN before running. The stored
 * location of that token is recorded in HCC_ACCESS.md §1 — which lives OUTSIDE this
 * repo, because this repo is public. Nothing here names or contains it.
 *
 *     $env:HCC_HA_TOKEN = (Get-Content <the path in HCC_ACCESS.md §1>).Trim()
 *     node scripts/live-e2e-test.js
 *
 * With no token set it SKIPS with exit 0 rather than failing: a missing local secret
 * is not a broken app, and a gate that fails for the wrong reason gets deleted.
 */
const path = require('path');

const TOKEN = (process.env.HCC_HA_TOKEN || '').trim();
if (!TOKEN) {
  console.log('live-e2e-test.js: SKIPPED — HCC_HA_TOKEN not set, cannot drive the live app.');
  console.log('  (the stored location is in HCC_ACCESS.md §1, outside this public repo)');
  process.exit(0);
}
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const URL = process.env.HCC_LIVE_URL || 'https://loewenhome.com';

let fails = 0;
const check = (name, ok, detail) => {
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (!ok && detail ? '   [' + String(detail).slice(0, 140) + ']' : ''));
  if (!ok) fails++;
};

(async () => {
  console.log('\nlive-e2e-test.js — the deployed app, real data: ' + URL + '\n');
  const browser = await chromium.launch();
  // Jeff's real screen is 1280x720 since the 150% scaling change (#163).
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, serviceWorkers: 'block' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('ha_token', t); } catch (e) {} }, TOKEN);
  const page = await ctx.newPage();

  const pageErrors = [], reqUrls = [], failedReqs = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('request', r => reqUrls.push(r.url()));
  page.on('requestfailed', r => failedReqs.push(r.url() + ' :: ' + ((r.failure() || {}).errorText || '')));

  await page.goto(URL + '/?cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const b = document.getElementById('acBanner');
    return b && !/Loading A\/C/.test(b.textContent);
  }, null, { timeout: 45000 });
  await page.evaluate(() => { const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none'; });

  const txt = id => page.evaluate(i => { const e = document.getElementById(i); return e ? e.textContent.trim() : ''; }, id);

  const acTemp = await txt('acTemp'), acSensor = await txt('acEcho');
  check('A/C card shows a real temperature', /\d+(\.\d+)?°/.test(acTemp), acTemp);
  check('A/C card reads the weather station, not the Echo', /station/i.test(acSensor), acSensor);

  // 2026-09-17: these three asserted on stIndoor/stOutdoor/stPressure and FAILED against a
  // correct app. Those ids belonged to the separate station CARD, which Jeff had deleted on
  // 2026-09-16 06:12 — "I don't want to look in two places for those readings" — when the
  // readings moved onto the WEATHER hero readout. index.html says so in a comment and tells
  // you not to re-add the card; stRender() still writes the st* ids defensively and set()
  // no-ops on a missing element, so nothing errored and the gate just went red forever.
  // A gate that fails on working code is worse than no gate: it trains you to ignore it.
  // Pointed at the hero ids, which is where the feature actually lives now.
  await page.click('#snav-weather'); await page.waitForTimeout(4000);
  check('station indoor temperature on the hero',  /\d+(\.\d+)?°F/.test(await txt('wxInTemp')),   await txt('wxInTemp'));
  check('station outdoor temperature on the hero', /\d+(\.\d+)?°F/.test(await txt('wxTemp')),     await txt('wxTemp'));
  check('station barometric pressure on the hero', /inHg/.test(await txt('wxPressure')),          await txt('wxPressure'));

  await page.click('#snav-irr'); await page.waitForTimeout(6000);
  const irr = await page.evaluate(() => {
    const sec = document.getElementById('section-irrigation');
    const t = sec ? sec.innerText : '';
    return { len: t.length, hasLogin: /log ?in|password|connect your/i.test(t), sample: t.slice(0, 160) };
  });
  check('irrigation section rendered', irr.len > 200, 'len=' + irr.len);
  check('irrigation does NOT fall back to a login prompt', !irr.hasLogin, irr.sample);

  const leaky = reqUrls.filter(u => /[?&](e|p)=[^&]+/.test(u.replace(/[?&]cb=\d+/, '')));
  check('no request URL carries a credential (#186)', leaky.length === 0, leaky.slice(0, 2).join(' | '));

  check('no page errors', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));
  const realFails = failedReqs.filter(f => !/favicon|blink|camera_proxy/i.test(f));
  check('no failed requests (camera/Blink excluded — documented upstream limits)',
    realFails.length === 0, realFails.slice(0, 2).join(' | '));

  const map = { home: 'home', weather: 'weather', irr: 'irrigation', yard: 'yard', guardian: 'guardian', car: 'car' };
  for (const id of Object.keys(map)) {
    await page.click('#snav-' + id); await page.waitForTimeout(700);
    const vis = await page.evaluate(s => {
      const el = document.getElementById('section-' + s);
      return !!el && getComputedStyle(el).display !== 'none';
    }, map[id]);
    check('section opens: ' + id, vis);
  }

  await browser.close();
  if (fails) { console.log(`\nLIVE E2E FAILED — ${fails} problem(s) on the deployed app.\n`); process.exit(1); }
  console.log('\nlive-e2e-test.js: clean — the deployed app works end to end.\n');
  process.exit(0);
})().catch(e => { console.error('HARNESS FAILED: ' + e.message); process.exit(1); });
