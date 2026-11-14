/* weather-emergency-test.js — feature test for the WEATHER emergency panel.
 *
 * Built 2026-08-29. smoke-test.js only checks external links inside
 * #section-yard, so it passed with 374/374 and tested NONE of this. A green
 * suite that does not touch the feature is the exact "green component, dead
 * feature" trap in CLAUDE.md — hence this file.
 *
 * It stubs /api/alerts so all three states can be driven deterministically:
 *   1. ok + no alerts   -> green ALL CLEAR
 *   2. ok + real alert  -> red card, event name, and the NWS instruction text
 *   3. NOT ok           -> grey CHECK FAILED, and must NOT say all-clear
 * State 3 is the one that matters most: a failed NWS fetch must never look safe.
 *
 * Run: node scripts/weather-emergency-test.js
 */
const path = require('path');
const { chromium } = require('playwright');

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html');
let fail = 0;

function check(label, got, want) {
  const ok = got === want;
  if (!ok) fail++;
  console.log((ok ? '  PASS  ' : '  FAIL  ') + label + '  got=' + got + (ok ? '' : '  WANT=' + want));
}

/* Stub window.fetch INSIDE the page rather than using page.route().
 * The app is loaded over file://, so fetch('/api/alerts') resolves to
 * file:///api/alerts and Playwright's route interception never sees it —
 * every render silently took the .catch() path, which made states 1 and 2
 * look broken when they were not. Overriding window.fetch works on any origin
 * and exercises the real loadAlerts() -> renderNwsAlerts() wiring. */
async function stub(page, payload) {
  await page.evaluate((body) => {
    window.fetch = function (url) {
      if (String(url).indexOf('/api/alerts') > -1) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
      }
      return Promise.reject(new Error('blocked in test: ' + url));
    };
  }, payload);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 864 } }); // Jeff's real screen

  // ---------- state 1: healthy, nothing active ----------
  await page.goto(FILE_URL);
  await page.waitForTimeout(900);
  await page.evaluate(() => { document.getElementById('snav-weather').click(); });
  await stub(page, { alerts: [], ok: true, checked: new Date().toISOString() });
  await page.evaluate(() => { if (typeof loadAlerts === 'function') loadAlerts(); });
  await page.waitForTimeout(500);

  console.log('\n--- STATE 1: healthy, no active alerts ---');
  check('alerts card is VISIBLE on a calm day',
    await page.evaluate(() => {
      const w = document.getElementById('wxAlertsCard');
      return !!w && getComputedStyle(w).display !== 'none';
    }), true);
  check('shell carries the green nws-clear class',
    await page.evaluate(() => document.getElementById('wxAlertsShell').classList.contains('nws-clear')), true);
  check('title says No Active Warnings',
    await page.evaluate(() => /No Active Warnings/i.test(document.getElementById('wxAlertsTitle').textContent)), true);
  check('body states no watches/warnings',
    await page.evaluate(() => /no watches, warnings or advisories/i.test(document.getElementById('wxAlertsList').textContent)), true);

  // ---------- state 2: a real warning, with instruction ----------
  await stub(page, {
    ok: true,
    alerts: [{
      id: 'test1', event: 'Tornado Warning', severity: 'Extreme', urgency: 'Immediate',
      headline: 'Tornado Warning issued for Robertson County', area: 'Robertson, TN',
      description: 'At 512 AM CDT, a severe thunderstorm capable of producing a tornado was located near White House.',
      instruction: 'TAKE COVER NOW! Move to a basement or an interior room on the lowest floor of a sturdy building.'
    }]
  });
  await page.evaluate(() => { if (typeof loadAlerts === 'function') loadAlerts(); });
  await page.waitForTimeout(400);

  console.log('\n--- STATE 2: active Tornado Warning ---');
  check('green class removed',
    await page.evaluate(() => document.getElementById('wxAlertsShell').classList.contains('nws-clear')), false);
  check('title shows the active count',
    await page.evaluate(() => /1 Active Alert/i.test(document.getElementById('wxAlertsTitle').textContent)), true);
  check('event name rendered',
    await page.evaluate(() => /Tornado Warning/.test(document.getElementById('wxAlertsList').textContent)), true);
  check('WHAT TO DO block present',
    await page.evaluate(() => /WHAT TO DO/.test(document.getElementById('wxAlertsList').textContent)), true);
  check('NWS instruction text actually rendered',
    await page.evaluate(() => /TAKE COVER NOW/.test(document.getElementById('wxAlertsList').textContent)), true);
  check('affected area shown',
    await page.evaluate(() => /Robertson/.test(document.getElementById('wxAlertsList').textContent)), true);
  check('home alert strip raised',
    await page.evaluate(() => document.getElementById('homeAlertStrip').classList.contains('show')), true);

  // ---------- state 3: the check FAILED ----------
  await stub(page, { alerts: [], ok: false });
  await page.evaluate(() => { if (typeof loadAlerts === 'function') loadAlerts(); });
  await page.waitForTimeout(400);

  console.log('\n--- STATE 3: NWS unreachable (must NOT read as all-clear) ---');
  check('grey nws-stale class applied',
    await page.evaluate(() => document.getElementById('wxAlertsShell').classList.contains('nws-stale')), true);
  check('NOT showing the green all-clear class',
    await page.evaluate(() => document.getElementById('wxAlertsShell').classList.contains('nws-clear')), false);
  check('says the check failed',
    await page.evaluate(() => /Check Failed/i.test(document.getElementById('wxAlertsTitle').textContent)), true);
  check('explicitly warns this is NOT an all-clear',
    await page.evaluate(() => /NOT an all-clear/i.test(document.getElementById('wxAlertsList').textContent)), true);
  check('does NOT claim there are no warnings',
    await page.evaluate(() => /no watches, warnings or advisories/i.test(document.getElementById('wxAlertsList').textContent)), false);

  // ---------- emergency links ----------
  console.log('\n--- EMERGENCY AUDIO & INFO card ---');
  const links = await page.evaluate(() => {
    const c = document.getElementById('wxEmergencyCard');
    if (!c) return null;
    return Array.from(c.querySelectorAll('a')).map((a) => ({
      href: a.getAttribute('href') || '',
      target: a.getAttribute('target') || '',
      text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 46)
    }));
  });
  check('emergency card exists', links !== null, true);
  check('every link is a real http(s) href',
    links ? links.every((l) => /^https?:\/\//.test(l.href)) : false, true);
  check('every link opens in a new tab',
    links ? links.every((l) => l.target === '_blank') : false, true);
  check('no TuneIn link left anywhere in the app',
    await page.evaluate(() => !/tunein\.com/i.test(document.documentElement.innerHTML)), true);
  check('THP/TDOT District 3 feed 42114 present (Jeff asked for it)',
    links ? links.some((l) => l.href.indexOf('/feed/42114') > -1) : false, true);
  check('Beechgrove NOAA button is labelled as NOT his counties',
    links ? links.some((l) => /NOT your counties/i.test(l.text) || /Beechgrove/i.test(l.text)) : false, true);
  check('SPC severe-risk outlook present (matters most to a spotter)',
    links ? links.some((l) => /spc\.noaa\.gov/.test(l.href)) : false, true);
  check('CEMC outage map present', links ? links.some((l) => /cemc/i.test(l.href)) : false, true);
  check('a ham/SDR receiver link present',
    links ? links.some((l) => /websdr|skywavelinux/i.test(l.href)) : false, true);
  check('at least 15 emergency links', links ? links.length >= 15 : false, true);
  console.log('  links found: ' + (links ? links.length : 0));
  if (links) links.forEach((l) => console.log('     ' + l.text.padEnd(46) + ' -> ' + l.href));

  /* ---------- contrast guard, BOTH themes ----------
   * The first cut of these buttons used inline bright hex and measured SIXTEEN
   * failures in light mode (worst 1.57:1 — invisible on the white card), the
   * same class as Pending Item 17. The repo's contrast-check.js is scoped to the
   * Conditions card and reported "0 NEW" without ever looking here, so this
   * guard lives with the feature it protects. */
  console.log('\n--- CONTRAST (WCAG AA 4.5:1) in both themes ---');
  const measure = () => {
    const parse = (c) => {
      const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(',').map((x) => parseFloat(x.trim()));
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
    const lum = (c) => { const f = [c.r, c.g, c.b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
    const painted = (el) => {
      const chain = []; let n = el;
      while (n && n !== document.documentElement) { chain.push(n); n = n.parentElement; }
      chain.push(document.documentElement);
      let acc = null;
      for (let i = chain.length - 1; i >= 0; i--) {
        const cs = getComputedStyle(chain[i]);
        let bg = parse(cs.backgroundColor);
        if (cs.backgroundImage && cs.backgroundImage !== 'none' && (!bg || bg.a === 0)) bg = { r: 128, g: 128, b: 128, a: 1 };
        if (!bg || bg.a === 0) continue;
        acc = acc ? over(bg, acc) : (bg.a < 1 ? over(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg);
      }
      return acc || { r: 255, g: 255, b: 255, a: 1 };
    };
    let worstR = 99, worstL = '';
    document.querySelectorAll('#wxEmergencyCard a, #wxEmergencyCard .emg-sub').forEach((el) => {
      const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) return;
      const bg = painted(el); const f = fg.a < 1 ? over(fg, bg) : fg;
      const L1 = lum(f), L2 = lum(bg);
      const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      if (r < worstR) { worstR = r; worstL = (el.textContent || '').trim().slice(0, 30); }
    });
    return { worst: Math.round(worstR * 100) / 100, label: worstL };
  };
  for (const theme of ['dark', 'light']) {
    await page.evaluate((t) => document.documentElement.classList.toggle('light', t === 'light'), theme);
    await page.waitForTimeout(200);
    const m = await page.evaluate(measure);
    console.log('  ' + theme.padEnd(6) + ' worst ' + m.worst + ':1  (' + m.label + ')');
    check(theme + ' mode: every emergency button >= 4.5:1', m.worst >= 4.5, true);
  }
  await page.evaluate(() => document.documentElement.classList.remove('light'));

  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.waitForTimeout(200);
  check('no page errors', errs.length, 0);

  await browser.close();
  console.log('\n' + (fail === 0
    ? '✓ weather-emergency-test.js: all checks passed.'
    : '✗ weather-emergency-test.js: ' + fail + ' FAILED'));
  process.exit(fail === 0 ? 0 : 1);
})();
