<#
  HCC ENFORCEMENT HOOK - PostToolUse on Edit|Write

  WHY THIS EXISTS. On 2026-08-22 the SAME failure happened THREE TIMES in one day:
  a claim was corrected in one file and the stale copies survived elsewhere.

    1. The superseded "28.8 h" figure lived in 3 files - COST_LEDGER.md and BOTH
       enforcement hooks - for 5 days after the audit corrected it to 29.0.
    2. "$234 burned" was corrected in CLAUDE.md and left sitting in the
       SessionStart hook, which then kept injecting it into every new session.
    3. "garage 2-location unresolved" was fixed in a memory file's body while the
       identical stale line sat in MEMORY.md - the ALWAYS-LOADED index - for 5
       days after the question had been closed at $0.

  A rule in a briefing did not stop this; it was IN the briefing and still happened.
  So this does it mechanically: after any edit to a .md, it searches the other
  places that matter for the text that was just removed. If the old claim still
  lives somewhere, Claude is told, in the same turn, before it says "fixed".

  PostToolUse CANNOT block - it only injects context. That is deliberate. A false
  positive here costs a sentence of reading, not a blocked edit.
#>
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { exit 0 }

$path = "$($j.tool_input.file_path)"
if (-not $path -or $path -notmatch '\.md$') { exit 0 }

# Only meaningful for an Edit (we need to know what was REPLACED).
$old = "$($j.tool_input.old_string)"
if (-not $old) { exit 0 }

# The places a stale claim actually does damage.
$searchRoots = @(
  'C:\Users\jeffl\.claude\projects\C--Users-jeffl\memory',
  'C:\Users\jeffl\Documents\GitHub\master-the-master-\docs',
  'C:\Users\jeffl\Documents\GitHub\master-the-master-\windows-scripts\hooks',
  'C:\Users\jeffl\CLAUDE.md',
  'C:\Users\jeffl\Documents\GitHub\master-the-master-\CLAUDE.md'
)

# Pull distinctive phrases out of what was removed. Short/boilerplate lines are
# skipped - they generate noise, not findings.
$phrases = @()
foreach ($line in ($old -split "`r?`n")) {
  $t = $line.Trim() -replace '^[#>\-\*\|\s]+','' -replace '\*\*',''
  if ($t.Length -lt 25) { continue }
  if ($t -match '^(---|===|\|)') { continue }
  # a distinctive middle slice, long enough to be specific
  $phrases += $t.Substring(0, [Math]::Min(60, $t.Length))
}
$phrases = $phrases | Select-Object -Unique | Select-Object -First 4
if (-not $phrases) { exit 0 }

$hits = @()
foreach ($p in $phrases) {
  foreach ($root in $searchRoots) {
    if (-not (Test-Path $root)) { continue }
    $found = Select-String -Path (Join-Path $root '*.md') -Pattern $p -SimpleMatch -ErrorAction SilentlyContinue
    if (-not $found -and (Test-Path $root -PathType Leaf)) {
      $found = Select-String -Path $root -Pattern $p -SimpleMatch -ErrorAction SilentlyContinue
    }
    foreach ($f in $found) {
      if ($f.Path -eq $path) { continue }   # the file just edited - not a copy
      $hits += [pscustomobject]@{ File = $f.Path; Line = $f.LineNumber; Phrase = $p }
    }
  }
}

# Also check the hooks themselves - they are .ps1, and a stale claim there gets
# injected into EVERY new session. That is exactly how "$234 burned" survived.
foreach ($p in $phrases) {
  $found = Select-String -Path 'C:\Users\jeffl\Documents\GitHub\master-the-master-\windows-scripts\hooks\*.ps1' -Pattern $p -SimpleMatch -ErrorAction SilentlyContinue
  foreach ($f in $found) { $hits += [pscustomobject]@{ File = $f.Path; Line = $f.LineNumber; Phrase = $p } }
}

$hits = $hits | Sort-Object File, Line -Unique | Select-Object -First 8
if (-not $hits) { exit 0 }

$msg  = "STALE-COPY CHECK - the text you just replaced still exists elsewhere.`n"
$msg += "You corrected it in $(Split-Path $path -Leaf). A claim corrected in ONE place is NOT corrected.`n"
$msg += "This exact failure happened 3x on 2026-08-22 (the 28.8h figure in 3 files; '`$234 burned' left in the`n"
$msg += "session hook; 'garage 2-location unresolved' left in MEMORY.md for 5 days).`n`nStill present:`n"
foreach ($h in $hits) {
  $msg += ("  {0}:{1}`n      ...{2}...`n" -f (Split-Path $h.File -Leaf), $h.Line, $h.Phrase)
}
$msg += "`nFix these too, or state explicitly why each one is correct as-is. Do not say 'fixed' until you have."

@{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $msg
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
