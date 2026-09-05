#!/usr/bin/env node
// Guardrail lint — checks index.html for the exact anti-patterns that have
// caused real production bugs in this app before. Run before every push.
// Exit code 0 = clean, 1 = a known bad pattern crept back in.
//
// Each check exists because of a specific incident:
//   - window.open()      -> no-op in an installed iOS PWA (07-31 audit, ~20 dead buttons)
//   - fetch(base+...)     -> bypasses haFetch()/api proxy -> "Beehive Offline" bug class
//   - <script>/</script>  -> inside the JS block -> fatal SyntaxError, blank page (06-23 incident)
//   - unguarded JSON.parse -> same failure class as the blank-page incident

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const scriptOpenIdx = html.indexOf('<script>', html.indexOf('<script>') + 1);
const scriptCloseIdx = html.lastIndexOf('</script>');
const js = html.slice(scriptOpenIdx + '<script>'.length, scriptCloseIdx);

let failures = [];

function lineOf(idx, text) {
  return text.slice(0, idx).split('\n').length;
}

// 1. window.open( anywhere in the JS block, outside of the openExternal() comment
js.split('\n').forEach((line, i) => {
  if (/window\.open\s*\(/.test(line) && !/^\s*\/\//.test(line.trim())) {
    failures.push(`Line ~${i + 1}: window.open() found — use openExternal() or a real <a target="_blank"> instead (no-op in installed iOS PWA).`);
  }
});

// 2. raw fetch(base ...) instead of haFetch()
js.split('\n').forEach((line, i) => {
  if (/fetch\(\s*base\s*\+/.test(line)) {
    failures.push(`Line ~${i + 1}: raw fetch(base+...) found — use haFetch() instead (bypasses the /api/ha proxy).`);
  }
});

// 3. a literal <script or </script inside the JS block itself
const scriptTagRe = /<\/?script/gi;
let m;
while ((m = scriptTagRe.exec(js))) {
  failures.push(`Line ~${lineOf(m.index, js)}: literal <script>/</script> substring inside the JS block — fatal SyntaxError risk (this is the exact 06-23 blank-page bug).`);
}

// 4. the top-level state load must stay guarded
if (!/var S;\s*try\s*\{\s*S\s*=\s*JSON\.parse/.test(js) && !/try\s*\{\s*S\s*=\s*JSON\.parse\(localStorage\.getItem\('toro21200'\)/.test(js)) {
  failures.push(`The top-level "var S = JSON.parse(localStorage...)" state load is no longer wrapped in try/catch — a corrupted save would blank the whole app on boot.`);
}

// 5. THE JS MUST ACTUALLY PARSE.
// Added 2026-08-20 after this lint passed a build whose entire <script> block was dead.
// A tooltip string ended up containing a LITERAL NEWLINE inside single quotes:
//     w7.title='Last 7 days: '+w.toFixed(2)+'"
//     '+
// which is "Invalid or unexpected token". Every handler in the app vanished —
// hccSection, showTab, carTab, showModal, toggleTheme — and lint said "clean", because
// every check above is a REGEX. Greps cannot tell you whether JavaScript is valid.
// vm.Script COMPILES without executing, so this catches the whole syntax-error class —
// the same class as the 2026-06-23 blank-page incident — for about 30 ms.
try {
  new (require('vm').Script)(js, { filename: 'index.html:<script>' });
} catch (e) {
  let where = '';
  const m2 = String(e.stack || '').match(/index\.html:<script>:(\d+)/);
  if (m2) {
    const lineInJs = parseInt(m2[1], 10);
    const htmlLine = lineOf(scriptOpenIdx, html) + lineInJs;
    where = ` at index.html line ~${htmlLine}`;
    const src = js.split('\n')[lineInJs - 1];
    if (src) where += `\n      >> ${src.trim().slice(0, 110)}`;
  }
  failures.push(`FATAL: the JS block does not parse — ${e.message}${where}\n      The entire app is blank in this state. Nothing else in this lint matters.`);
}

if (failures.length) {
  console.error(`\n✗ lint-app.js: ${failures.length} issue(s) found:\n`);
  failures.forEach(f => console.error('  - ' + f));
  console.error('\nFix these before pushing.\n');
  process.exit(1);
} else {
  console.log('✓ lint-app.js: clean — no known anti-patterns found.');
  process.exit(0);
}
