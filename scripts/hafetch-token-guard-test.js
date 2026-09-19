/**
 * OPEN_ITEMS #89 — prove haFetch()/haStatsFetch() make NO network call without a token.
 *
 * Why this test exists: lint-app.js and smoke-test.js both pass whether or not this bug
 * is present, because neither inspects outbound requests. That is the green-component /
 * dead-feature trap this project keeps paying for (#94). This asserts the actual behaviour.
 *
 * Proven BOTH ways, deliberately:
 *   guest  (no token)   -> ZERO calls to /api/ha and /api/ha-stats
 *   logged in (token)   -> calls DO fire, carrying Authorization
 *
 * The page loads over file://, so /api/... resolves to file:///api/... and page.route()
 * never sees it — window.fetch is stubbed inside the page instead. That trap is recorded
 * in OPEN_ITEMS under the weather-emergency work; do not "fix" it with page.route().
 */
const { chromium } = require('playwright');
const path = require('path');

const APP = require('url').pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

async function run(label, token) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.addInitScript((tok) => {
    try {
      if (tok) localStorage.setItem('ha_token', tok);
      else localStorage.removeItem('ha_token');
    } catch (e) {}
    window.__calls = [];
    const real = window.fetch;
    window.fetch = function (url, init) {
      const u = String((url && url.url) || url || '');
      window.__calls.push({ url: u, auth: !!(init && init.headers && (init.headers.Authorization || init.headers.authorization)) });
      // never let a file:// fetch reject noisily; shape does not matter for this assertion
      return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    };
  }, token);

  // Registering a real ServiceWorker requires http(s), not file:// — expected here,
  // and filtered exactly the way scripts/smoke-test.js:116 already does it. This error
  // appears in BOTH the guest and logged-in runs and is unrelated to haFetch; the first
  // version of this harness counted it as a failure and reported a passing fix as broken.
  const errors = [];
  page.on('pageerror', e => { const m = String(e); if (m.indexOf('ServiceWorker') === -1) errors.push(m); });
  await page.goto(APP, { waitUntil: 'load' });
  await page.waitForTimeout(4000);

  // exercise the paths a viewer actually reaches
  for (const id of ['snav-home', 'snav-guardian', 'snav-car', 'snav-irr']) {
    const el = await page.$('#' + id);
    if (el) { await el.click().catch(() => {}); await page.waitForTimeout(600); }
  }
  await page.waitForTimeout(1500);

  const calls = await page.evaluate(() => window.__calls);
  await browser.close();

  const ha = calls.filter(c => c.url.indexOf('/api/ha') >= 0);
  return { label, total: calls.length, ha: ha.length, authed: ha.filter(c => c.auth).length, errors };
}

(async () => {
  const guest = await run('guest (no token)', null);
  const auth  = await run('logged in (token)', 'dummy-token-for-test-only');

  let fail = 0;
  console.log('OPEN_ITEMS #89 — haFetch token guard\n' + '='.repeat(62));
  for (const r of [guest, auth]) {
    console.log(`  ${r.label.padEnd(22)} total fetches ${String(r.total).padStart(3)}   /api/ha calls ${String(r.ha).padStart(3)}   with Authorization ${r.authed}`);
    if (r.errors.length) { console.log('    pageerrors: ' + r.errors.join(' | ')); fail++; }
  }
  console.log('='.repeat(62));

  if (guest.ha !== 0) { console.log(`✗ FAIL: guest mode made ${guest.ha} unauthenticated /api/ha call(s) — #89 is NOT fixed`); fail++; }
  else console.log('✓ guest mode made ZERO /api/ha calls — no unauthenticated relay, nothing for HA to log');

  if (auth.ha === 0) { console.log('✗ FAIL: logged-in mode made no /api/ha calls — the guard is over-blocking'); fail++; }
  else if (auth.authed !== auth.ha) { console.log(`✗ FAIL: ${auth.ha - auth.authed} logged-in call(s) went out WITHOUT Authorization`); fail++; }
  else console.log(`✓ logged-in mode still fires ${auth.ha} call(s), all carrying Authorization`);

  console.log(fail ? '\n✗ hafetch-token-guard-test.js FAILED' : '\n✓ hafetch-token-guard-test.js: all checks passed.');
  process.exit(fail ? 1 : 0);
})();
