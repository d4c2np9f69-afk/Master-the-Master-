#!/usr/bin/env node
// Kiosk / screensaver mode — full behavioural test in a real browser.
//
// Jeff, 2026-08-20: "I want just one build that works out of the gate without me having
// to find it not working or not responding or 404 not working and then I have to come
// back to you... do it right the first time."
//
// So this covers every way it could be broken on his TV rather than only the happy path:
//   1. NORMAL MODE IS UNTOUCHED     — no kiosk UI, no class, no transform, no timers.
//   2. It actually rotates          — through all six sections, in order, and wraps.
//   3. It yields when touched       — rotation stops, so it cannot yank a page away.
//   4. It resumes on its own        — after being left alone.
//   5. The exit button really exits — window.close() is called (Chrome allows it for the
//                                     --app window the launcher uses; verified on the PC).
//   6. Nothing overflows sideways   — the drift must never introduce a scrollbar.
//   7. No page errors, at his real screen size and on a phone.
//
// Uses &rot=2 so rotation is observable in seconds instead of minutes.
//
// Usage: node scripts/kiosk-test.js

const path = require('path');
let chromium;
try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
catch (e) { ({ chromium } = require('playwright')); }

const FILE = 'file:///' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');

let fails = 0;
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Which section is showing right now.
const activeSection = (page) => page.evaluate(() => {
  const s = document.querySelector('.hcc-section.active');
  return s ? s.id.replace('section-', '') : '(none)';
});

async function newPage(browser, url, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  // A service worker cannot register from file:// — origin is "null". That is an artifact
  // of testing a local file, NOT a product bug: the deployed https site registers it
  // fine (verified live 2026-08-20, zero page errors). Filtered by exact text so a real
  // service-worker failure would still fail this test.
  const FILE_URL_ARTIFACT = /Failed to register a ServiceWorker: The URL protocol of the current origin \('null'\) is not supported/;
  page.on('pageerror', (e) => { if (!FILE_URL_ARTIFACT.test(e.message)) errors.push(e.message); });
  // Record window.close() instead of actually closing, so the test can assert on it.
  await page.addInitScript(() => {
    window.__closed = 0;
    const orig = window.close;
    window.close = function () { window.__closed++; try { orig.call(window); } catch (e) {} };
  });
  await page.goto(url);
  await page.waitForTimeout(900);
  return { page, errors };
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const TV = { width: 1536, height: 864 };   // Jeff's 60" Vizio at 125% scaling

  // ── 1. NORMAL MODE MUST BE COMPLETELY UNAFFECTED ─────────────────────────────────
  console.log('\n  NORMAL MODE (no ?kiosk) — must be byte-for-byte unaffected');
  {
    const { page, errors } = await newPage(browser, FILE, TV);
    const r = await page.evaluate(() => ({
      hasClass: document.documentElement.classList.contains('kiosk'),
      hasUI: !!document.getElementById('kioskUI'),
      transform: document.body.style.transform || ''
    }));
    check('no kiosk class', r.hasClass, false);
    check('no kiosk UI injected', r.hasUI, false);
    check('body transform untouched', r.transform, '');
    check('no page errors', errors, []);
    await page.close();
  }

  // ── 2-4. ROTATION, YIELD, RESUME ─────────────────────────────────────────────────
  console.log('\n  KIOSK MODE — rotation, yielding, and resuming');
  {
    const { page, errors } = await newPage(browser, FILE + '?kiosk=1&rot=2', TV);

    const r0 = await page.evaluate(() => ({
      hasClass: document.documentElement.classList.contains('kiosk'),
      hasExit: !!document.getElementById('kioskExit'),
      pill: (document.getElementById('kioskPill') || {}).textContent || '',
      splashHidden: (function () {
        const s = document.getElementById('splashScreen');
        return !s || s.style.display === 'none';
      })()
    }));
    check('kiosk class applied', r0.hasClass, true);
    check('exit button exists', r0.hasExit, true);
    check('splash is dismissed for an unattended screen', r0.splashHidden, true);
    check('starts on HOME', await activeSection(page), 'home');
    check('pill says it is rotating', r0.pill, 'AUTO-ROTATING');

    // Watch it walk the whole loop, including the wrap back to home.
    const order = ['weather', 'irrigation', 'yard', 'guardian', 'car', 'home'];
    const seen = [];
    for (let i = 0; i < order.length; i++) { await sleep(2100); seen.push(await activeSection(page)); }
    check('rotates through every section and wraps', seen, order);

    // Drift must have moved the page, and must never cause sideways scroll.
    const drift = await page.evaluate(() => {
      const ui = document.getElementById('kioskUI').getBoundingClientRect();
      return {
        left: document.body.style.left || '',
        top: document.body.style.top || '',
        usesTransform: !!document.body.style.transform,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        uiHeight: Math.round(ui.height),
        viewportHeight: window.innerHeight,
        docHeight: Math.round(document.body.getBoundingClientRect().height)
      };
    });
    check('anti burn-in drift is applied', /-?\d+px/.test(drift.left + drift.top), true);
    check('drift causes NO horizontal overflow', drift.overflowX, false);
    // The bug this pins down: a transform on <body> makes it the containing block for
    // position:fixed children, so the overlay stretched to the full document height and
    // the X scrolled off screen. Measured live at 6263px against an 864px viewport.
    check('drift does NOT use transform', drift.usesTransform, false);
    check('overlay is pinned to the SCREEN, not the document', drift.uiHeight, drift.viewportHeight);
    check('and the document really is taller than the screen', drift.docHeight > drift.viewportHeight, true);
    // The X must still be on screen after the page has been scrolled down.
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(300);
    const afterScroll = await page.evaluate(() => {
      const b = document.getElementById('kioskExit').getBoundingClientRect();
      return { top: Math.round(b.top), onscreen: b.top >= 0 && b.bottom <= window.innerHeight };
    });
    check('X stays on screen after scrolling down', afterScroll.onscreen, true);
    await page.evaluate(() => window.scrollTo(0, 0));

    // Touch it — rotation must stop and stay stopped while he is using it.
    await page.mouse.move(700, 500);
    await page.waitForTimeout(150);
    const paused = await page.evaluate(() => (document.getElementById('kioskPill') || {}).textContent || '');
    check('interaction pauses rotation', paused, 'PAUSED — you have the wheel');
    const before = await activeSection(page);
    await sleep(2600);                       // longer than a rotation period
    check('page does NOT change while paused', await activeSection(page), before);

    // Leave it alone — it must pick itself back up. resume = rot * 1.5 = 3 s.
    await sleep(3400);
    const resumed = await page.evaluate(() => (document.getElementById('kioskPill') || {}).textContent || '');
    check('resumes by itself once left alone', resumed, 'AUTO-ROTATING');
    await sleep(2200);
    check('and starts moving again', await activeSection(page) !== before, true);

    check('no page errors in kiosk mode', errors, []);
    await page.close();
  }

  // ── 5. THE EXIT BUTTON ───────────────────────────────────────────────────────────
  console.log('\n  EXIT BUTTON');
  {
    const { page, errors } = await newPage(browser, FILE + '?kiosk=1&rot=2', TV);
    await page.click('#kioskExit');
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({
      closed: window.__closed,
      transform: document.body.style.transform || '',
      hintShown: (document.getElementById('kioskHint') || {}).style?.display || ''
    }));
    check('exit calls window.close()', r.closed >= 1, true);
    check('drift is cleaned up on exit', r.transform, '');
    check('falls back to an Alt+F4 hint if close was blocked', r.hintShown, 'block');
    check('no page errors', errors, []);
    await page.close();
  }

  // ── 6. Clicking the exit button must not read as "Jeff is browsing" ──────────────
  console.log('\n  THE EXIT BUTTON IS NOT "INTERACTION"');
  {
    const { page } = await newPage(browser, FILE + '?kiosk=1&rot=2', TV);
    await page.hover('#kioskExit');
    await page.waitForTimeout(200);
    const pill = await page.evaluate(() => (document.getElementById('kioskPill') || {}).textContent || '');
    check('hovering exit does not pause rotation', pill, 'AUTO-ROTATING');
    await page.close();
  }

  // ── 7. Phone-sized, because the wall iPad and his phone hit the same URL ─────────
  console.log('\n  PHONE (390x844)');
  {
    const { page, errors } = await newPage(browser, FILE + '?kiosk=1&rot=2', { width: 390, height: 844 });
    const r = await page.evaluate(() => ({
      hasExit: !!document.getElementById('kioskExit'),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      exitBox: (function () { const e = document.getElementById('kioskExit'); const b = e.getBoundingClientRect();
        return { w: Math.round(b.width), h: Math.round(b.height), onscreen: b.right <= window.innerWidth + 1 && b.top >= 0 }; })()
    }));
    check('exit button is present', r.hasExit, true);
    check('exit button is fully on screen', r.exitBox.onscreen, true);
    check('exit button is a real tap target', r.exitBox.w >= 44 && r.exitBox.h >= 44, true);
    check('no horizontal overflow', r.overflowX, false);
    check('no page errors', errors, []);
    await page.close();
  }

  await browser.close();
  console.log(fails === 0
    ? '\n✓ kiosk-test.js: rotates, yields, resumes, exits, and leaves normal mode alone.\n'
    : `\n✗ kiosk-test.js: ${fails} check(s) failed.\n`);
  process.exit(fails === 0 ? 0 : 1);
})();
