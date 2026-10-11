#!/usr/bin/env node
/* radar-layer-test.js — the map layer switcher (2026-09-16)
 *
 * Jeff, 2026-09-16 08:53: "I love the radar because it's interactive and has the
 * lightning data - that's what everything else needs."
 *
 * So the map he already likes got more layers instead of being replaced. This
 * guards the two ways that quietly breaks:
 *
 *  1. THE SRC ACCUMULATES PARAMS. Swapping a layer rewrites overlay= and product=
 *     in place. A naive `src + '&overlay=' + x` appends instead, and Windy honours
 *     the FIRST one - so the buttons would light up correctly and the map would
 *     never change. Exactly the class of bug that looks fine on screen.
 *  2. WRONG PRODUCT PAIRING. `radar` is its own product; the forecast overlays ride
 *     on product=ecmwf. Mismatch them and the map goes blank with no error.
 *
 * Also asserts the overlay names are ones Windy actually accepts. These were
 * verified against Windy's published URL-parameter and overlay-description docs on
 * 2026-09-16 - NOT recalled from memory. `thunder` is deliberately absent: it is not
 * a valid embed overlay, and promising lightning layers we cannot deliver is worse
 * than not offering them.
 */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = 'file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/');

// Every value Windy documents for embed2.html's overlay parameter.
const VALID = new Set(['radar', 'rain', 'wind', 'gust', 'temp', 'pressure', 'clouds',
  'rh', 'snow', 'lclouds', 'snowcover', 'waves', 'swell', 'satellite']);

let fails = 0;
const pass = (m) => console.log('  ✓ ' + m);
const fail = (m) => { fails++; console.log('  ✗ ' + m); };

(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (_) { console.log('radar-layer-test.js: SKIPPED — playwright not resolvable.'); process.exit(0); }

  console.log('radar-layer-test.js — the map layer switcher');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/api/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await page.goto(FILE);
  await page.evaluate(() => { const s = document.getElementById('splashScreen'); if (s) s.style.display = 'none'; });
  await page.evaluate(() => document.getElementById('snav-weather').click());
  await page.waitForTimeout(700);

  const buttons = await page.evaluate(() =>
    [].map.call(document.querySelectorAll('#wxLayers .wx-layer'), (b) => b.getAttribute('data-ov')));

  if (!buttons.length) { fail('no layer buttons found'); }
  else pass(buttons.length + ' layer buttons: ' + buttons.join(', '));

  const bad = buttons.filter((b) => !VALID.has(b));
  if (bad.length) fail('overlay name(s) Windy does not accept: ' + bad.join(', '));
  else pass('every overlay name is one Windy documents');

  const src0 = await page.evaluate(() => document.getElementById('wxRadarFrame').getAttribute('src'));
  if (/overlay=radar/.test(src0) && /product=radar/.test(src0)) pass('opens on radar');
  else fail('does not open on radar: ' + src0.slice(0, 90));

  for (const ov of buttons) {
    await page.evaluate((o) => { document.querySelector('.wx-layer[data-ov="' + o + '"]').click(); }, ov);
    await page.waitForTimeout(90);
    const r = await page.evaluate(() => {
      const s = document.getElementById('wxRadarFrame').getAttribute('src');
      return {
        src: s,
        overlays: s.split('overlay=').length - 1,
        products: s.split('product=').length - 1,
        overlay: (s.match(/overlay=([^&]*)/) || [])[1],
        product: (s.match(/product=([^&]*)/) || [])[1],
        active: (document.querySelector('.wx-layer.on') || {}).dataset
          ? document.querySelector('.wx-layer.on').getAttribute('data-ov') : null,
      };
    });
    const wantProduct = ov === 'radar' ? 'radar' : 'ecmwf';
    if (r.overlays !== 1 || r.products !== 1) {
      fail(ov + ': src accumulated params (overlay x' + r.overlays + ', product x' + r.products +
           ') — Windy honours the FIRST, so the map would never change');
    } else if (r.overlay !== ov) {
      fail(ov + ': src says overlay=' + r.overlay);
    } else if (r.product !== wantProduct) {
      fail(ov + ': product=' + r.product + ', expected ' + wantProduct);
    } else if (r.active !== ov) {
      fail(ov + ': the highlighted button is ' + r.active);
    } else {
      pass(ov + ' → overlay=' + r.overlay + ' product=' + r.product + ', button lit');
    }
  }

  const real = errors.filter((e) => e.indexOf('ServiceWorker') === -1);
  if (real.length) real.forEach((e) => fail('page error: ' + e));
  else pass('no page errors while switching layers');

  await browser.close();
  if (fails) { console.log('\nRADAR LAYER GATE FAILED — ' + fails + ' problem(s).'); process.exit(1); }
  console.log('\nradar-layer-test.js: clean.');
  process.exit(0);
})();
