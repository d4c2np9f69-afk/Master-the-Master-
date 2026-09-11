/* button-audit.js — does every button in the app actually DO something?
 *
 * Jeff, 2026-08-29: "make sure all the buttons actually go and do what they are
 * supposed to do and I don't know if all the refresh buttons are working when I
 * press them they don't make anything refresh."
 *
 * Checks, across EVERY section (not one — see OPEN_ITEMS #94):
 *   1. every onclick handler names a function that actually EXISTS
 *   2. every <a> has a real http(s) href, or an explicit in-page action
 *   3. every element that looks like a refresh control is inventoried, so the
 *      "nothing happens when I press it" complaint can be checked one by one
 *
 * A dead handler is a silent no-op — the 07-31 window.open() audit found ~20 of
 * those. This is the same sweep, generalised and repeatable.
 *
 * Run: node scripts/button-audit.js
 */
const path = require('path');
const { chromium } = require('playwright');

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 864 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await page.goto(FILE_URL);
  await page.waitForTimeout(1000);
  await page.evaluate(() => { if (typeof dismissSplash === 'function') dismissSplash(); });
  await page.waitForTimeout(400);

  const report = await page.evaluate(() => {
    const out = { handlers: [], links: [], refresh: [] };
    const secOf = (el) => {
      const s = el.closest('.hcc-section');
      return s ? s.id.replace('section-', '') : (el.closest('#splash') ? 'splash' : 'global');
    };
    const label = (el) => (el.textContent || el.getAttribute('title') || '')
      .replace(/\s+/g, ' ').trim().slice(0, 44);

    // 1 + 3 — every onclick in the document
    document.querySelectorAll('[onclick]').forEach((el) => {
      const code = el.getAttribute('onclick') || '';
      // pull every bare function call name out of the handler
      // BARE calls only. A negative lookbehind for '.' keeps document.getElementById(),
      // el.scrollIntoView(), event.stopPropagation() etc. out — those are methods, not
      // globals, and flagging them buries the real dead handlers in noise.
      const names = Array.from(code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)).map((m) => m[1]);
      const missing = names.filter((n) => {
        if (['if', 'for', 'while', 'switch', 'catch', 'return', 'typeof', 'function'].indexOf(n) > -1) return false;
        try { return typeof window[n] !== 'function'; } catch (e) { return true; }
      });
      const rec = { sec: secOf(el), tag: el.tagName.toLowerCase(), label: label(el), code: code.slice(0, 70), missing: missing };
      out.handlers.push(rec);
      if (/refresh|reload|sync|update/i.test(code) || /refresh|reload|sync/i.test(label(el))) out.refresh.push(rec);
    });

    // 2 — every anchor
    document.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      // tel: and mailto: are legitimate and deliberate (the Dispatch call buttons).
      // A '#' href is fine only if an onclick actually handles it.
      // An <a> with role="button" + tabindex + a handler is a deliberate hotspot
      // (the panic overlay on the HOME hero), not a broken link. Accept it.
      const asButton = a.getAttribute('role') === 'button' && a.getAttribute('onclick');
      const ok = /^(https?:|tel:|mailto:)/.test(href)
        || (href.charAt(0) === '#' && a.getAttribute('onclick'))
        || asButton;
      if (!ok) out.links.push({ sec: secOf(a), label: label(a), href: href.slice(0, 60), onclick: !!a.getAttribute('onclick') });
    });
    return out;
  });

  const dead = report.handlers.filter((h) => h.missing.length);
  console.log('BUTTON AUDIT — ' + report.handlers.length + ' onclick handlers, '
    + document_count(report) + ' anchors flagged, ' + report.refresh.length + ' refresh-ish controls');
  function document_count(r) { return r.links.length; }

  console.log('\n=== 1. DEAD HANDLERS (function does not exist) ===');
  if (!dead.length) console.log('  none — every onclick names a real function');
  dead.forEach((h) => console.log('  [' + h.sec + '] ' + h.label + '  ->  MISSING: ' + h.missing.join(', ') + '   (' + h.code + ')'));

  console.log('\n=== 2. ANCHORS WITHOUT A REAL http(s) HREF ===');
  if (!report.links.length) console.log('  none');
  report.links.forEach((l) => console.log('  [' + l.sec + '] ' + l.label + '  href="' + l.href + '" onclick=' + l.onclick));

  console.log('\n=== 3. REFRESH CONTROLS INVENTORY (' + report.refresh.length + ') ===');
  const bySec = {};
  report.refresh.forEach((r) => { (bySec[r.sec] = bySec[r.sec] || []).push(r); });
  Object.keys(bySec).sort().forEach((s) => {
    console.log('  --- ' + s + ' ---');
    bySec[s].forEach((r) => console.log('     ' + (r.missing.length ? 'DEAD ' : 'ok   ') + r.label.padEnd(34) + ' -> ' + r.code));
  });

  console.log('\npageErrors: ' + JSON.stringify(pageErrors));
  await browser.close();
  process.exit(dead.length ? 1 : 0);
})();
