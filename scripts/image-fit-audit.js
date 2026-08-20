#!/usr/bin/env node
// Image-fit audit — Jeff's rule 2026-08-19:
//   "if you edit the pic make sure they fit all devices when you finish
//    Web, TV, iPad, computer and iPhone both landscape and portrait"
//
// This does NOT take screenshots and eyeball them. It computes, for every
// <img> on the page at every device size, the EXACT rectangle of the source
// photograph that is actually visible after object-fit/object-position crop —
// then flags the specific failures that have already bitten this project:
//
//   HEAD-CROP  the top of hero-yard.jpg is cut. Jeff's hair starts at source
//              row ~22 of 851 (2.6%). This shipped once already (08-11).
//   LETTERBOX  image smaller than its container -> blank bars beside the photo
//              (the 08-06 desktop gap bug).
//   OVERCROP   more than HALF the source is thrown away at some device size.
//   OVERFLOW   the page scrolls sideways.
//
// Usage: node scripts/image-fit-audit.js
//        node scripts/image-fit-audit.js --json

const path = require('path');
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('Playwright not resolvable from the repo.');
  process.exit(2);
}

const FILE_URL = 'file://' + path.join(__dirname, '..', 'index.html');

// Every device Jeff named, both orientations where a rotation is real.
const DEVICES = [
  { name: 'iPhone portrait', w: 390, h: 844, dpr: 3 },
  { name: 'iPhone landscape', w: 844, h: 390, dpr: 3 },
  { name: 'iPhone Max portrait', w: 430, h: 932, dpr: 3 },
  { name: 'iPhone Max landscape', w: 932, h: 430, dpr: 3 },
  { name: 'iPad portrait', w: 768, h: 1024, dpr: 2 },
  { name: 'iPad landscape', w: 1024, h: 768, dpr: 2 },
  { name: 'iPad Air portrait', w: 834, h: 1194, dpr: 2 },
  { name: 'iPad Air landscape', w: 1194, h: 834, dpr: 2 },
  // JEFF'S ACTUAL SCREEN — measured 2026-08-20, not assumed. The beast PC drives a
  // 60" Vizio (panel 133x75cm) at 1920x1080 with Windows at 125% scaling, so the
  // browser reports 1536x864 CSS px. His "computer" and his "TV" are ONE device.
  // Every earlier test jumped 1440 -> 1920 and skipped the only size he ever sees.
  { name: "Jeff's 60in Vizio @125%", w: 1536, h: 864, dpr: 1.25 },
  { name: 'TV browser 720p', w: 1280, h: 720, dpr: 1 },
  { name: 'Computer (laptop)', w: 1440, h: 900, dpr: 2 },
  { name: 'Web (desktop)', w: 1920, h: 1080, dpr: 1 },
  { name: 'Monitor 1440p', w: 2560, h: 1440, dpr: 1 },
  { name: 'TV / monitor 4K', w: 3840, h: 2160, dpr: 1 },
];

const SECTIONS = ['home', 'weather', 'irr', 'yard', 'guardian', 'car'];

// Source images with a known protected region near an edge.
// frac = how far into the image the protected content begins.
const PROTECTED_TOP = {
  'hero-yard.jpg': { frac: 22 / 851, what: 'Jeff is in this photo — hair starts at source row ~22 of 851' },
  'hero-irr.jpg': { frac: 0.04, what: 'Jeff is in this photo' },
};

// Measured inside the page. Returns every visible <img> with the exact source
// rectangle that survives the crop.
function collectImages() {
  const out = { imgs: [], overflow: null };
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    out.overflow = { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };
  }
  const imgs = Array.from(document.querySelectorAll('img'));
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (!im.currentSrc && !im.src) continue;
    const cs = getComputedStyle(im);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const nw = im.naturalWidth;
    const nh = im.naturalHeight;
    const file = im.src.split('/').pop().split('?')[0];
    if (!nw || !nh) {
      out.imgs.push({ file: file, broken: true });
      continue;
    }

    const op = cs.objectPosition.split(' ');
    const toFrac = function (v, fallback) {
      if (v == null) return fallback;
      if (v.slice(-1) === '%') return parseFloat(v) / 100;
      if (v === 'left' || v === 'top') return 0;
      if (v === 'right' || v === 'bottom') return 1;
      if (v === 'center') return 0.5;
      return fallback;
    };
    const px = toFrac(op[0], 0.5);
    const py = toFrac(op[1], 0.5);

    const fit = cs.objectFit || 'fill';
    let scale = null;
    if (fit === 'cover') scale = Math.max(r.width / nw, r.height / nh);
    else if (fit === 'contain') scale = Math.min(r.width / nw, r.height / nh);
    else if (fit === 'none') scale = 1;

    let vis = null;
    let pad = null;
    if (scale != null) {
      const rw = nw * scale;
      const rh = nh * scale;
      const ovx = rw - r.width;
      const ovy = rh - r.height;
      if (ovx >= -0.5 && ovy >= -0.5) {
        const ox = Math.max(0, ovx) * px;
        const oy = Math.max(0, ovy) * py;
        vis = {
          x0: ox / scale / nw,
          x1: (ox + r.width) / scale / nw,
          y0: oy / scale / nh,
          y1: (oy + r.height) / scale / nh,
        };
      } else {
        pad = { x: Math.max(0, -ovx), y: Math.max(0, -ovy) };
        vis = { x0: 0, x1: 1, y0: 0, y1: 1 };
      }
    }
    out.imgs.push({
      file: file,
      nw: nw,
      nh: nh,
      box: { w: Math.round(r.width), h: Math.round(r.height) },
      fit: fit,
      objectPosition: cs.objectPosition,
      vis: vis,
      pad: pad,
    });
  }
  return out;
}

async function main() {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const findings = [];
  let measured = 0;

  for (const dev of DEVICES) {
    const ctx = await browser.newContext({
      viewport: { width: dev.w, height: dev.h },
      deviceScaleFactor: dev.dpr,
    });
    const page = await ctx.newPage();
    await page.goto(FILE_URL);
    await page.waitForTimeout(500);
    await page.evaluate(function () {
      const s = document.getElementById('splashScreen');
      if (s) s.style.display = 'none';
    });

    for (const sec of SECTIONS) {
      await page.evaluate(function (s) {
        const b = document.getElementById('snav-' + s);
        if (b) b.click();
      }, sec);
      await page.waitForTimeout(300);

      const shot = await page.evaluate(collectImages);

      if (shot.overflow) {
        findings.push({
          kind: 'OVERFLOW',
          device: dev.name,
          section: sec,
          file: '',
          detail:
            'page scrolls sideways: scrollWidth ' +
            shot.overflow.scrollWidth +
            ' > viewport ' +
            shot.overflow.clientWidth,
        });
      }

      for (const im of shot.imgs) {
        if (im.broken) {
          findings.push({
            kind: 'BROKEN',
            device: dev.name,
            section: sec,
            file: im.file,
            detail: 'image failed to decode',
          });
          continue;
        }
        measured++;
        if (!im.vis) continue;

        const prot = PROTECTED_TOP[im.file];
        if (prot && im.vis.y0 > prot.frac + 0.002) {
          findings.push({
            kind: 'HEAD-CROP',
            device: dev.name,
            section: sec,
            file: im.file,
            detail:
              'crop starts ' +
              (im.vis.y0 * 100).toFixed(1) +
              '% down the source; ' +
              prot.what +
              ' (' +
              (prot.frac * 100).toFixed(1) +
              '%)',
          });
        }
        if (im.pad && (im.pad.x > 2 || im.pad.y > 2)) {
          findings.push({
            kind: 'LETTERBOX',
            device: dev.name,
            section: sec,
            file: im.file,
            detail:
              'blank bars ' +
              Math.round(im.pad.x) +
              'x' +
              Math.round(im.pad.y) +
              'px around the photo',
          });
        }
        const keptH = im.vis.y1 - im.vis.y0;
        const keptW = im.vis.x1 - im.vis.x0;
        if (keptH < 0.5 || keptW < 0.5) {
          findings.push({
            kind: 'OVERCROP',
            device: dev.name,
            section: sec,
            file: im.file,
            detail:
              'only ' +
              (keptW * 100).toFixed(0) +
              '% wide x ' +
              (keptH * 100).toFixed(0) +
              '% tall of the source survives',
          });
        }
      }
    }
    await ctx.close();
  }
  await browser.close();

  if (process.argv.indexOf('--json') >= 0) {
    console.log(JSON.stringify({ findings: findings }, null, 2));
    process.exit(findings.length ? 1 : 0);
  }

  console.log('');
  console.log('IMAGE-FIT AUDIT — ' + DEVICES.length + ' device sizes x ' + SECTIONS.length + ' sections');
  console.log(measured + ' image renders measured');
  console.log('');

  if (!findings.length) {
    console.log('  PASS — every image fits every device, nothing cropped past a protected edge.');
    console.log('');
    process.exit(0);
  }

  const byKind = {};
  for (const f of findings) {
    if (!byKind[f.kind]) byKind[f.kind] = [];
    byKind[f.kind].push(f);
  }
  for (const k of Object.keys(byKind)) {
    console.log('  ' + k + ' — ' + byKind[k].length + ' render(s)');
    const seen = new Map();
    for (const f of byKind[k]) {
      const key = (f.file || '(page)') + ' [' + f.section + '] ' + f.detail;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(f.device);
    }
    for (const entry of seen) {
      console.log('    ' + entry[0]);
      console.log('        on: ' + entry[1].join(', '));
    }
    console.log('');
  }
  process.exit(1);
}

main().catch(function (e) {
  console.error(e);
  process.exit(2);
});
