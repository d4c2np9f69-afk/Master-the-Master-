#!/usr/bin/env node
// Contrast auditor for the Conditions card + legend, run in BOTH themes.
//
// Why this exists: CLAUDE.md Pending Item 17 closed a whole bug CLASS where text used a
// hardcoded hex (or a token tuned for one theme) and vanished in the other. The auditor
// built for that was never committed, so the next change re-opened the same risk. This is
// that check, kept.
//
// Two traps item 17 paid for, both handled here:
//   1. A background set in a style= attribute beats any selector — so the REAL painted
//      background must be found by walking ancestors, not read off the element.
//   2. A checker that only reads backgroundColor LIES about any element using a
//      linear-gradient. It must treat a gradient as opaque and stop there, or it invents
//      failures that do not exist.
//
// Usage: node scripts/contrast-check.js

const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
// Whole visible app, not just the card that prompted the auditor. Jeff's standing rule:
// after fixing a bug, sweep for others of the same CLASS before reporting done.
const SELECTORS = ['body'];
const MIN_NORMAL = 4.5;
const MIN_LARGE = 3.0;

function startServer() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('nope'); return;
    }
    res.writeHead(200, { 'Content-Type': file.endsWith('.html') ? 'text/html' : 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

function auditInPage(opts) {
  const selectors = opts.selectors, minNormal = opts.minNormal, minLarge = opts.minLarge;
  function parse(c) {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function over(fg, bg) {
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  }
  function lum(c) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function ratio(a, b) {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  // Walk up compositing every translucent layer until something opaque is hit.
  function realBg(el) {
    const stack = [];
    let n = el;
    while (n && n.nodeType === 1) {
      const cs = getComputedStyle(n);
      // A gradient is opaque paint. Reading only backgroundColor here is the documented
      // way to invent failures that do not exist.
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { gradient: true, el: n };
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        if (c.a >= 0.999) {
          let out = c;
          for (let i = stack.length - 1; i >= 0; i--) out = over(stack[i], out);
          return { color: out };
        }
        stack.push(c);
      }
      n = n.parentElement;
    }
    let out = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) out = over(stack[i], out);
    return { color: out };
  }

  const out = [];
  for (const sel of selectors) {
    const root = document.querySelector(sel);
    if (!root) continue;
    const nodes = [root].concat(Array.from(root.querySelectorAll('*')));
    for (const el of nodes) {
      const txt = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(' ')
        .trim();
      if (!txt) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
      const fg = parse(cs.color);
      if (!fg) continue;
      const bg = realBg(el);
      if (bg.gradient) continue;               // opaque paint we cannot sample — skip, do not guess
      const composited = fg.a < 1 ? over(fg, bg.color) : fg;
      const cr = ratio(composited, bg.color);
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const min = large ? minLarge : minNormal;
      if (cr < min) {
        out.push({
          sel,
          theme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
          text: txt.slice(0, 46),
          tag: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          ratio: Math.round(cr * 100) / 100,
          need: min,
          color: cs.color,
          fontSize: size
        });
      }
    }
  }
  return out;
}

async function main() {
  const server = await startServer();
  const BASE = 'http://127.0.0.1:' + server.address().port + '/index.html';
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let fails = 0;
  const BASELINE = path.join(__dirname, 'contrast-baseline.json');
  const key = (b) => b.theme + '|' + b.tag + '|' + b.text;
  const writing = process.argv.indexOf('--update-baseline') >= 0;
  const baseline = (!writing && fs.existsSync(BASELINE))
    ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
  const found = {};

  for (const theme of ['dark', 'light']) {
    const page = await browser.newPage({ viewport: { width: 1536, height: 900 } });
    await page.goto(BASE);
    await page.waitForTimeout(500);
    await page.evaluate((t) => {
      const s = document.getElementById('splashScreen');
      if (s) s.style.display = 'none';
      document.documentElement.classList.toggle('light', t === 'light');
      const y = document.getElementById('snav-yard');
      if (y) y.click();
      const d = document.querySelector('.wx-legend');
      if (d) d.open = true;                        // the legend must be audited OPEN
      const w = document.getElementById('aqiChartWrap');
      if (w) w.style.display = '';                 // and the scale visible
    }, theme);
    await page.waitForTimeout(500);

    const bad = await page.evaluate(auditInPage, { selectors: SELECTORS, minNormal: MIN_NORMAL, minLarge: MIN_LARGE });
    found[theme] = bad.map(key).sort();

    // A gate that fails on 49 PRE-EXISTING problems is not a gate, it is noise nobody
    // runs twice. The baseline records what was already failing on 2026-08-20 and this
    // script fails only on NEW regressions. Shrink the baseline over time — never grow
    // it to make a build pass.
    const known = new Set(baseline[theme] || []);
    const fresh = bad.filter((b) => !known.has(key(b)));
    const newlyFixed = [...known].filter((k) => found[theme].indexOf(k) < 0);

    console.log('\n  ' + theme.toUpperCase() + ' — ' + bad.length + ' failing, ' + known.size +
                ' known, ' + fresh.length + ' NEW' +
                (newlyFixed.length ? ', ' + newlyFixed.length + ' newly fixed' : ''));
    for (const b of fresh) {
      console.log('    NEW  ' + b.ratio + ':1 (need ' + b.need + ')  ' + b.tag + '  "' + b.text + '"  ' + b.color);
    }
    fails += fresh.length;
    await page.close();
  }

  await browser.close();
  server.close();
  if (writing) {
    fs.writeFileSync(BASELINE, JSON.stringify(found, null, 2));
    console.log('\n  baseline written: ' + BASELINE + '\n');
    process.exit(0);
  }
  console.log('\n' + (fails ? fails + ' NEW contrast failure(s)\n' : 'no new contrast failures\n'));
  process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
