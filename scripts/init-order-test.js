#!/usr/bin/env node
/* init-order-test.js - boot-order + logged-in boot gate (2026-09-16)
 *
 * WHY THIS EXISTS
 * ---------------
 * Jeff, 2026-09-16 02:27: "it is not loading the sensors in the guardian section
 * and I don't see the new sensor readings in the weather".
 *
 * ONE bug caused both. The shared-fetch cache added for #183 declared its state
 * at line ~10240:
 *
 *     var _haShared = {};
 *
 * ...but the top-level boot sequence calls loadIrrigation() at line ~7639, about
 * 2,600 lines EARLIER. `var` hoists the NAME, never the ASSIGNMENT, so _haShared
 * was still `undefined` when haShared() indexed it:
 *
 *     TypeError: Cannot read properties of undefined (reading '/api/states')
 *         at haShared -> haFetch -> loadIrrigationFromHA -> loadIrrigation -> (top level)
 *
 * An uncaught throw at top level ABORTS THE REST OF THE SCRIPT. Function
 * declarations hoist, so every function still existed and the page looked normal,
 * but no loader below that line ever ran. Guardian sat on placeholders; the
 * station and A/C cards sat on "Loading..." forever.
 *
 * WHY THE EXISTING GATE MISSED IT - the important half
 * ---------------------------------------------------
 * smoke-test.js DOES fail on a pageerror. But it loads file://index.html with NO
 * HA token, and both crashing paths are token-gated:
 *     loadGuardian()        -> if (!getHaToken()) { grdPlaceholder(); return; }
 *     loadIrrigationFromHA  -> only called `if (haToken && haBase)`
 * So the crash was unreachable in the test and guaranteed in Jeff's browser. The
 * whole logged-in half of the app had never been exercised by any gate.
 *
 * WHAT THIS CHECKS (exit 0 is the only pass)
 *   PART A (static, no deps): no top-level statement may reach a top-level `var`
 *          that is initialised further down the file.
 *   PART B (runtime, Playwright): boot the app WITH a token present and every
 *          /api/* call stubbed, and fail on ANY uncaught exception.
 *
 * NEGATIVE CONTROL - prove this test can still fail:
 *     git show HEAD~1:index.html > /tmp/buggy.html
 *     node scripts/init-order-test.js /tmp/buggy.html      # must exit 1
 */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'index.html');

let failures = 0;
const fail = (msg) => { failures++; console.log('  ✗ ' + msg); };
const pass = (msg) => console.log('  ✓ ' + msg);

console.log('init-order-test.js - boot order + logged-in boot');
console.log('  target: ' + TARGET);
const html = fs.readFileSync(TARGET, 'utf8');

/* ---------------------------------------------------------------- PART A */
console.log('\nPART A - static boot-order analysis');

// The main JS block is the LAST <script> ... </script> pair.
const openIdx = html.lastIndexOf('<script>');
const closeIdx = html.indexOf('</script>', openIdx);
if (openIdx < 0 || closeIdx < 0) {
  fail('could not locate the main <script> block');
} else {
  const script = html.slice(openIdx + '<script>'.length, closeIdx);
  // Strip CR. This file is CRLF, and in JS `.` does NOT match \r (it is a line
  // terminator) and `$` without /m will not match before it - so /^var\s+(.*)$/
  // silently matched NOTHING and the first version of this gate reported "0
  // top-level vars" and passed its own negative control. Caught 2026-09-16.
  const lines = script.split('\n').map((s) => s.replace(/\r$/, ''));

  const RESERVED = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'function',
    'typeof', 'new', 'delete', 'var', 'let', 'const', 'else', 'do', 'try', 'throw']);

  // Top-level = starts at column 0.
  const varDeclLine = new Map();   // name -> line index of its ASSIGNMENT
  const funcBody = new Map();      // name -> body source
  const topCalls = [];             // { name, line }

  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!L || /^\s/.test(L)) continue;            // not top level

    const vm = L.match(/^var\s+(.*)$/);
    if (vm) {
      const re = /([A-Za-z_$][\w$]*)\s*=/g;
      let m;
      while ((m = re.exec(vm[1])) !== null) {
        if (!varDeclLine.has(m[1])) varDeclLine.set(m[1], i);
      }
      continue;
    }

    const fm = L.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (fm) {
      // capture the body by brace matching from this line
      let depth = 0, started = false, buf = [];
      for (let j = i; j < lines.length; j++) {
        const s = lines[j];
        buf.push(s);
        for (const ch of s) {
          if (ch === '{') { depth++; started = true; }
          else if (ch === '}') depth--;
        }
        if (started && depth <= 0) break;
      }
      funcBody.set(fm[1], buf.join('\n'));
      continue;
    }

    const cm = L.match(/^([A-Za-z_$][\w$]*)\s*\(/);
    if (cm && !RESERVED.has(cm[1])) topCalls.push({ name: cm[1], line: i });
  }

  pass('parsed ' + varDeclLine.size + ' top-level vars, ' + funcBody.size +
       ' top-level functions, ' + topCalls.length + ' top-level calls');

  // For each top-level call, walk the functions it can reach and look for a
  // top-level var that is assigned AFTER the call site.
  const problems = [];
  for (const call of topCalls) {
    const seen = new Set();
    const stack = [call.name];
    while (stack.length) {
      const fn = stack.pop();
      if (seen.has(fn) || !funcBody.has(fn)) continue;
      seen.add(fn);
      const body = funcBody.get(fn);
      const re = /\b([A-Za-z_$][\w$]*)\b/g;
      let m;
      while ((m = re.exec(body)) !== null) {
        const id = m[1];
        if (RESERVED.has(id)) continue;
        if (funcBody.has(id)) { stack.push(id); continue; }
        if (varDeclLine.has(id) && varDeclLine.get(id) > call.line) {
          problems.push({
            varName: id,
            declLine: varDeclLine.get(id) + 1,
            call: call.name,
            callLine: call.line + 1,
            via: fn
          });
        }
      }
    }
  }

  // De-duplicate on the variable name, keeping the earliest call site.
  const byVar = new Map();
  for (const p of problems) {
    const prev = byVar.get(p.varName);
    if (!prev || p.callLine < prev.callLine) byVar.set(p.varName, p);
  }

  if (byVar.size === 0) {
    pass('no top-level statement reaches a variable initialised below it');
  } else {
    for (const p of byVar.values()) {
      fail('USE BEFORE INIT: `' + p.varName + '` is assigned at script line ' + p.declLine +
           ' but ' + p.call + '() runs at script line ' + p.callLine +
           ' (reached via ' + p.via + '). `var` hoists the name, not the value - ' +
           'the boot sequence will throw and abort the rest of the script.');
    }
  }
}

/* ---------------------------------------------------------------- PART B */
console.log('\nPART B - logged-in boot (a token present, all /api stubbed)');

async function runtimeCheck() {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch (_) {
    console.log('  ! playwright not resolvable - PART B skipped (PART A still binding)');
    return;
  }

  // Serve over http so localStorage has a normal origin (file:// does not).
  const dir = path.dirname(TARGET);
  const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    const file = url === '/' ? path.basename(TARGET) : url.replace(/^\//, '');
    const full = path.join(dir, file);
    if (!full.startsWith(dir) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      res.writeHead(404); res.end('no'); return;
    }
    const ext = path.extname(full);
    const type = ext === '.js' ? 'application/javascript'
      : ext === '.css' ? 'text/css'
      : ext === '.json' ? 'application/json'
      : ext === '.html' ? 'text/html' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(full).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // A token must exist BEFORE the page script runs - that is the whole point.
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('ha_token', 'gate-test-token-not-a-real-credential');
      localStorage.setItem('ctrl_token', 'gate-test-ctrl-not-a-real-credential');
      // ha_base is REQUIRED to reproduce. loadIrrigation() only reaches the
      // crashing haFetch path `if (haToken && haBase)`, and haBase falls back to
      // `var HA_BASE` which is itself declared BELOW the boot call - so without
      // this key the branch is skipped and the bug hides. Jeff's browser has it
      // set from connecting Beehive, which is why it broke for him and not here.
      localStorage.setItem('ha_base', 'https://gate-test.invalid');
    } catch (_) {}
  });

  // Stub every backend call. Nothing real is contacted.
  await page.route('**/api/**', (route) => {
    const u = route.request().url();
    let body = '{}';
    if (/\/api\/states/.test(u)) body = '[]';
    else if (/\/api\/template/.test(u)) body = '{}';
    return route.fulfill({ status: 200, contentType: 'application/json', body });
  });

  await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'load' });
  await page.waitForTimeout(3500);

  // Did the script actually finish? If a top-level throw aborted it, the values
  // declared at the very bottom of the block never come into existence.
  const reachedEnd = await page.evaluate(() => ({
    haShared: typeof window._haShared,
    loadGuardian: typeof window.loadGuardian,
    loadAcRelay: typeof window.loadAcRelay
  }));

  await browser.close();
  server.close();

  const real = errors.filter((e) => e.indexOf('ServiceWorker') === -1);
  if (real.length) {
    real.forEach((e) => fail('UNCAUGHT AT BOOT WITH A TOKEN PRESENT: ' + e));
  } else {
    pass('booted with a token present, zero uncaught exceptions');
  }

  if (reachedEnd.haShared === 'undefined') {
    fail('the script did NOT run to completion - `_haShared` is undefined after load, ' +
         'which is the signature of a top-level throw aborting the rest of the block');
  } else {
    pass('script ran to completion (_haShared is ' + reachedEnd.haShared + ')');
  }
}

runtimeCheck()
  .catch((e) => { fail('PART B crashed: ' + e.message); })
  .then(() => {
    if (failures) {
      console.log('\nINIT-ORDER GATE FAILED - ' + failures + ' problem(s).');
      console.log('Anything the boot sequence can reach must be initialised ABOVE it.');
      process.exit(1);
    }
    console.log('\ninit-order-test.js: clean.');
    process.exit(0);
  });
