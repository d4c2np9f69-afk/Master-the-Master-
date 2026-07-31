#!/usr/bin/env node
// Smoke test — loads index.html headless and exercises every nav section,
// every YARD/CAR tab, every Guardian quick-action chip, every modal, and
// checks that generated external links have real hrefs (not window.open()
// no-ops). Run before reporting any UI change as done.
//
// Usage: node scripts/smoke-test.js

const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html');

async function main() {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(FILE_URL);
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    var s = document.getElementById('splashScreen');
    if (s) s.style.display = 'none';
  });

  const results = {};

  results.navSections = await page.evaluate(() => {
    var ids = ['home', 'weather', 'irr', 'yard', 'guardian', 'car'];
    return ids.map((id) => {
      try {
        document.getElementById('snav-' + id).click();
        return 'ok';
      } catch (e) {
        return 'ERR:' + e.message;
      }
    });
  });

  results.yardTabs = await page.evaluate(() => {
    document.getElementById('snav-yard').click();
    return Array.from(document.querySelectorAll('button.tab')).map((t) => {
      try { t.click(); return 'ok'; } catch (e) { return 'ERR:' + e.message; }
    });
  });

  results.carTabs = await page.evaluate(() => {
    document.getElementById('snav-car').click();
    return Array.from(document.querySelectorAll('button.car-tab')).map((t) => {
      try { t.click(); return 'ok'; } catch (e) { return 'ERR:' + e.message; }
    });
  });

  results.guardianChips = await page.evaluate(() => {
    document.getElementById('snav-guardian').click();
    return Array.from(document.querySelectorAll('.hive-chip')).map((c) => {
      try { c.click(); return 'ok'; } catch (e) { return 'ERR:' + e.message; }
    });
  });

  results.modals = await page.evaluate(() => {
    var out = {};
    ['mow', 'hours', 'svc', 'cart'].forEach(function (t) {
      try {
        showModal(t);
        var ov = document.querySelector('.modal-ov');
        out[t] = ov ? ov.classList.contains('show') : false;
        closeModal();
      } catch (e) {
        out[t] = 'ERR:' + e.message;
      }
    });
    return out;
  });

  // Every external link (PARTS vendor buttons, diagnostics/upgrade videos, etc.)
  // must be a real <a> with a non-empty http(s) href — this is the exact class
  // of bug the 07-31 audit found (window.open() silently doing nothing).
  await page.evaluate(() => { document.getElementById('snav-yard').click(); });
  await page.evaluate(() => {
    var tabs = Array.from(document.querySelectorAll('button.tab'));
    ['parts', 'services', 'diagnostics', 'upgrades'].forEach(function (name) {
      var t = tabs.find((el) => new RegExp(name, 'i').test(el.textContent));
      if (t) t.click();
    });
  });
  await page.waitForTimeout(200);
  results.externalLinks = await page.evaluate(() => {
    var links = Array.from(document.querySelectorAll('#section-yard a[target="_blank"]'));
    var bad = links.filter((a) => !/^https?:\/\//.test(a.getAttribute('href') || ''));
    return { total: links.length, badCount: bad.length, badSamples: bad.slice(0, 5).map((a) => a.outerHTML.slice(0, 120)) };
  });

  await browser.close();

  // Registering a real ServiceWorker requires http(s), not file:// — expected
  // and harmless under this test protocol, not a real app bug.
  const realErrors = errors.filter((e) => e.indexOf('ServiceWorker') === -1);

  console.log(JSON.stringify(results, null, 2));
  console.log('\npageErrors:', JSON.stringify(realErrors));

  const flat = [].concat(
    results.navSections, results.yardTabs, results.carTabs, results.guardianChips
  );
  const hasErr = flat.some((r) => String(r).indexOf('ERR:') === 0)
    || Object.values(results.modals).some((v) => v !== true)
    || results.externalLinks.badCount > 0
    || realErrors.length > 0;

  if (hasErr) {
    console.error('\n✗ smoke-test.js: FAILURES FOUND — see above.');
    process.exit(1);
  } else {
    console.log('\n✓ smoke-test.js: all checks passed.');
    process.exit(0);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
