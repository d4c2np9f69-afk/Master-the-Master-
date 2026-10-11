#!/usr/bin/env node
/* sw-restart-gate-test.js — a stale build must not survive a restart.
 *
 * Jeff, 2026-09-17: "You can fix that shit that is stuck it is called a restart. And if what
 * you have fixed or build can't withstand a restart then it's not fixed."
 *
 * He is right, and this gate is the proof rather than my word for it.
 *
 * THE BUG THIS EXISTS FOR. On 2026-09-15 the client and server changed together: v111 locked
 * the control endpoints and v112 moved credentials out of the query string into the
 * `x-hcc-creds` header, in functions/api/climate.js and functions/api/irrigation/index.js,
 * with NO query-param fallback. Cloudflare Functions go live the instant the push lands;
 * index.html does not — it waits on the service worker. A device holding a pre-v112 cached
 * build therefore sends credentials the server no longer reads, and EXACTLY the A/C card and
 * Irrigation break while weather, Guardian and the cameras look fine. Registering the worker
 * was not enough: an installed PWA resumed from the app switcher never re-navigates, so it
 * never checks for a new build and can sit on one for days.
 *
 * WHAT A RESTART HAS TO GUARANTEE, and what each check below asserts:
 *   1. a fresh boot registers the worker with updateViaCache:'none'
 *   2. a fresh boot ASKS for a new build (reg.update()) — registration alone is not a check
 *   3. coming back to the foreground asks AGAIN — this is the resumed-PWA case
 *   4. a new worker taking over reloads the page ONCE — that is what un-sticks a stale build
 *   5. the FIRST install does NOT reload — otherwise every new device reload-loops on boot
 *   6. the reload NEVER fires while an input has focus — the splash login, SET HOURS and the
 *      credential fields are plain inputs and a reload there loses what was typed
 *
 * NEGATIVE CONTROL — prove this gate can still fail:
 *     git show 46ef4fe~1:index.html > /tmp/prefix.html
 *     node scripts/sw-restart-gate-test.js /tmp/prefix.html     # MUST exit 1
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'index.html');

let failures = 0;
const fail = (m) => { failures++; console.log('  ✗ ' + m); };
const pass = (m) => console.log('  ✓ ' + m);

console.log('\nsw-restart-gate-test.js — a stale build must not survive a restart');
console.log('  target: ' + TARGET + '\n');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css' };

(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (e) { console.log('  playwright not resolvable — cannot run'); process.exit(1); }

  // Serve the repo so the page loads over http (file:// changes origin behaviour).
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/' || p === '/index.html') p = TARGET; else p = path.join(ROOT, p);
    fs.readFile(p, (err, buf) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  await new Promise((r) => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port;

  const browser = await chromium.launch();

  // One scenario = one fresh page. `hadController` decides whether this boot looks like a
  // device that already had a worker (a restart) or a brand-new install.
  async function boot({ hadController, focusInput }) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.route('**/api/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
    await page.addInitScript(({ hadController }) => {
      window.__sw = { registered: null, updates: 0, handlers: {} };
      const reg = { update() { window.__sw.updates++; } };
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: {
          controller: hadController ? {} : null,
          register(url, opts) { window.__sw.registered = { url, opts }; return Promise.resolve(reg); },
          addEventListener(ev, fn) { (window.__sw.handlers[ev] = window.__sw.handlers[ev] || []).push(fn); },
        },
      });
    }, { hadController });
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.waitForTimeout(400);
    // Count REAL navigations. Stubbing location.reload does not work - Chromium resolves it
    // off the live Location and the page navigates for real, which is exactly the behaviour
    // under test. So measure the thing itself rather than a proxy for it.
    let navs = 0;
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) navs++; });
    page.__navs = () => navs;
    if (focusInput) {
      await page.evaluate(() => {
        const i = document.createElement('input');
        i.id = '__probe'; document.body.appendChild(i); i.focus();
      });
    }
    return { ctx, page };
  }

  // Fire and tolerate the context being torn down by the reload we are testing for.
  const fire = async (page, ev) => {
    try {
      await page.evaluate((e) => {
        (window.__sw.handlers[e] || []).forEach((fn) => fn(new Event(e)));
      }, ev);
    } catch (e) { if (!/context was destroyed|Execution context/i.test(e.message)) throw e; }
    await page.waitForTimeout(500);
  };

  /* 1 + 2 — a fresh boot registers AND asks for a new build */
  {
    const { ctx, page } = await boot({ hadController: true });
    const s = await page.evaluate(() => window.__sw);
    if (s.registered && /service-worker\.js/.test(s.registered.url)) pass('boot registers the service worker');
    else fail('boot did NOT register the service worker');
    if (s.registered && s.registered.opts && s.registered.opts.updateViaCache === 'none') pass("registered with updateViaCache:'none'");
    else fail("registered WITHOUT updateViaCache:'none' — a CDN-cached worker can pin an old build");
    if (s.updates >= 1) pass('boot ASKS for a new build (reg.update called ' + s.updates + 'x)');
    else fail('boot never called reg.update() — registering alone is not a check, this is the bug');
    await ctx.close();
  }

  /* 3 — returning to the foreground asks again (the resumed-PWA case) */
  {
    const { ctx, page } = await boot({ hadController: true });
    const before = (await page.evaluate(() => window.__sw)).updates;
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(200);
    const after = (await page.evaluate(() => window.__sw)).updates;
    if (after > before) pass('returning to the foreground re-checks (' + before + ' → ' + after + ')');
    else fail('foreground return did NOT re-check — a resumed PWA would sit on a stale build forever');
    await ctx.close();
  }

  /* 4 — a new worker taking over reloads ONCE */

  {
    const { ctx, page } = await boot({ hadController: true });
    await fire(page, 'controllerchange');
    const n = page.__navs();
    if (n === 1) pass('a new worker taking over RELOADS — the stale build is replaced');
    else fail('controllerchange produced ' + n + ' navigation(s), expected 1 — ' + (n ? 'reload loop' : 'a stale build would never be swapped in'));
    await ctx.close();
  }

/* 5 — the first install must NOT reload */

  {
    const { ctx, page } = await boot({ hadController: false });
    await fire(page, 'controllerchange');
    const n = page.__navs();
    if (n === 0) pass('a FIRST install does NOT reload (no boot loop on a new device)');
    else fail('first install navigated ' + n + 'x — every new device would reload-loop on boot');
    await ctx.close();
  }

/* 6 — never reload out from under someone typing */

  {
    const { ctx, page } = await boot({ hadController: true, focusInput: true });
    await fire(page, 'controllerchange');
    const during = page.__navs();
    if (during === 0) pass('reload is HELD while an input has focus');
    else fail('reloaded while an input was focused — that loses the family password mid-entry');
    try { await page.evaluate(() => { const i = document.getElementById('__probe'); if (i) i.blur(); }); }
    catch (e) { /* the reload may already be in flight */ }
    await page.waitForTimeout(700);
    const after = page.__navs();
    if (after === 1) pass('and it fires once focus leaves the field — held, not lost');
    else fail('after blur expected 1 navigation, got ' + after + ' — ' + (after ? 'loop' : 'the held reload was DROPPED, build stays stale'));
    await ctx.close();
  }

  await browser.close();
  server.close();

  if (failures) {
    console.log('\nSW RESTART GATE FAILED — ' + failures + ' problem(s).');
    console.log('A build that cannot be replaced by a restart is not fixed.\n');
    process.exit(1);
  }
  console.log('\nsw-restart-gate-test.js: clean.\n');
  process.exit(0);
})().catch((e) => { console.log('  ERROR: ' + (e && e.message)); process.exit(1); });
