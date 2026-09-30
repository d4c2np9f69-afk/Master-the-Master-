#!/usr/bin/env node
/* encoding-gate-test.js — no document may contain mojibake.
 *
 * Jeff's standing rule: "Every mistake you make gets a test in the gate that fails on exactly
 * that mistake... If you make the SAME mistake twice, that means the first test was missing or
 * too weak, and fixing it is the new first task."
 *
 * THIS ONE HAS HAPPENED TWICE, WHICH IS WHY IT IS OVERDUE:
 *   - an earlier session corrupted CLAUDE.md itself; its headings still read
 *     "HCC Toro TimeMaster 21200 Ã¢â‚¬â€ Project Memory" instead of an em dash
 *   - 2026-09-16 00:16 I did it again to docs/PROJECT_REFERENCE.md — 576 lines, every emoji
 *     mangled, e.g. "Ã°Å¸â€ºâ€˜ STOP" instead of "🛑 STOP"
 *
 * THE MECHANISM, so it is fixable rather than mysterious: these files are UTF-8 with NO BOM.
 * Windows PowerShell 5.1's `Get-Content` / `Get-Content -Raw` assumes the ANSI codepage (CP1252)
 * when there is no BOM, so every multi-byte character is decoded as two or three Latin-1
 * characters. Writing that string back out makes the corruption permanent.
 *
 *   BAD:  $t = Get-Content file.md -Raw ; ... ; Set-Content file.md $t
 *   GOOD: [IO.File]::ReadAllText($p, (New-Object Text.UTF8Encoding $false))
 *         [IO.File]::WriteAllText($p, $t, (New-Object Text.UTF8Encoding $false))
 *   BEST: do the edit in Python or with the Edit tool, which never guess the encoding.
 *
 * Checks every tracked .md in the repo. Exit 0 is the only pass.
 */
const fs = require('fs');
const path = require('path');
const REPO = path.join(__dirname, '..');

// Each signature is what a specific real character becomes when UTF-8 is read as CP1252/Latin-1.
const SIGNATURES = [
  ['Ã¢â‚¬â€', 'em dash —'],
  ['Ã¢â‚¬Å“', 'left curly quote “'],
  ['Ã¢â‚¬Â', 'curly quote / ellipsis'],
  ['Ã°Å¸', 'emoji (4-byte)'],
  ['Ã¯Â¸Â', 'variation selector'],
  ['Ã¢Å“', 'check mark ✓/✅'],
  ['Ã¢Å¡Â', 'warning sign ⚠'],
  ['Ã¢ÂÅ’', 'cross mark ❌'],
  ['â€”', 'em dash (Latin-1 read)'],
  ['â€™', 'right single quote (Latin-1 read)'],
  ['ðŸ', 'emoji (Latin-1 read)'],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

const files = walk(REPO);
console.log('\nencoding-gate-test.js — no document may contain mojibake\n');
console.log(`  scanning ${files.length} markdown files\n`);

let fails = 0;
const report = [];
for (const f of files) {
  // read as UTF-8 explicitly; a correct file round-trips, a corrupted one carries the signature
  let t;
  try { t = fs.readFileSync(f, 'utf8'); } catch (_) { continue; }
  const hits = [];
  for (const [sig, means] of SIGNATURES) {
    let n = 0, i = 0;
    while ((i = t.indexOf(sig, i)) !== -1) { n++; i += sig.length; }
    if (n) hits.push(`${n}x ${means}`);
  }
  if (hits.length) {
    fails++;
    const lineNo = (() => {
      const first = SIGNATURES.find(([s]) => t.includes(s));
      return t.slice(0, t.indexOf(first[0])).split('\n').length;
    })();
    report.push({ f: path.relative(REPO, f), hits, lineNo });
  }
}

if (report.length) {
  for (const r of report.sort((a, b) => b.hits.length - a.hits.length)) {
    console.log(`  FAIL  ${r.f}  (first at line ${r.lineNo})`);
    console.log(`          ${r.hits.join(', ')}`);
  }
  console.log(`\nENCODING GATE FAILED — ${report.length} file(s) contain mojibake.`);
  console.log('Cause: PowerShell Get-Content decodes BOM-less UTF-8 as CP1252. Re-read the file');
  console.log('with [IO.File]::ReadAllText($p, (New-Object Text.UTF8Encoding $false)), or repair');
  console.log('it in Python, and never round-trip a .md through Get-Content/Set-Content.\n');
  process.exit(1);
}
console.log('  PASS  no mojibake in any markdown file\n');
console.log('encoding-gate-test.js: clean.\n');
process.exit(0);
