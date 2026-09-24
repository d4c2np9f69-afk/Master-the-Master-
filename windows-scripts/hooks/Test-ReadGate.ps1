# Test-ReadGate.ps1 - feature-test for Hook-RequireRead.ps1.
#
# Run this after ANY edit to the read gate. It runs the real hook with simulated
# tool calls and asserts what it actually does - a component check ("the file
# contains the right lines") would not prove that it blocks, and the whole point
# of this gate is that it blocks.
#
# Throwaway session ids are used so the live session's own read receipt is never
# touched or cleared.
#
# Written 2026-09-15 alongside the change that widened the universal gate from
# ACCESS_MAP.md alone to ACCESS_MAP + SESSION_START + OPEN_ITEMS.
$HOOK = Join-Path $PSScriptRoot 'Hook-RequireRead.ps1'
$pass = 0; $fail = 0

function Run($sid, $toolName, $cmd, $filePath) {
  $j = @{
    session_id = $sid
    tool_name  = $toolName
    tool_input = @{ command = $cmd; file_path = $filePath }
  } | ConvertTo-Json -Depth 5 -Compress
  return ($j | & powershell -NoProfile -ExecutionPolicy Bypass -File $HOOK 2>$null) -join "`n"
}
function Receipt($sid, $lines) {
  $p = Join-Path $env:TEMP ("hcc-read-" + $sid + ".txt")
  if ($lines) { Set-Content -LiteralPath $p -Value $lines -Encoding utf8 }
  elseif (Test-Path $p) { [IO.File]::Delete($p) }
}
function Check($name, $cond, $detail) {
  if ($cond) { $script:pass++; "  PASS  $name" }
  else { $script:fail++; "  FAIL  $name   $detail" }
}

$now  = [int][double]::Parse((Get-Date -UFormat %s))
$ALL  = @("$now|docs/ACCESS_MAP.md", "$now|docs/SESSION_START.md", "$now|docs/OPEN_ITEMS.md")
$APP  = 'C:\Users\jeffl\Documents\GitHub\master-the-master-\index.html'
$sids = @()

function T($sid) { $script:sids += $sid; return $sid }

$s = T 'rg-empty';    Receipt $s $null
$o = Run $s 'Edit' '' $APP
Check 'blocks a mutation when nothing has been read' ($o -match 'BLOCKED') $o
Check '  names all three required files' (($o -match 'ACCESS_MAP') -and ($o -match 'SESSION_START') -and ($o -match 'OPEN_ITEMS'))

$s = T 'rg-partial';  Receipt $s @("$now|docs/ACCESS_MAP.md")
$o = Run $s 'Edit' '' $APP
Check 'still blocks when ONLY ACCESS_MAP was read' ($o -match 'BLOCKED')
Check '  asks for exactly the two missing' (($o -match 'SESSION_START') -and ($o -match 'OPEN_ITEMS'))

$s = T 'rg-full';     Receipt $s $ALL
$o = Run $s 'Edit' '' $APP
Check 'allows the mutation once all three are read' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-override'; Receipt $s $null
$o = Run $s 'PowerShell' 'Remove-Item foo.txt  # HCC-OVERRIDE' ''
Check 'HCC-OVERRIDE stands the gate down' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-docs';     Receipt $s $null
$o = Run $s 'Write' '' 'C:\Users\jeffl\Documents\GitHub\master-the-master-\docs\OPEN_ITEMS.md'
Check 'writing a doc is exempt' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-scratch';  Receipt $s $null
$o = Run $s 'Write' '' 'C:\tmp\scratchpad\foo.py'
Check 'scratchpad is exempt' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-read';     Receipt $s $null
$o = Run $s 'PowerShell' 'Get-ChildItem C:\Users\jeffl' ''
Check 'a non-mutating command is never blocked' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-camera';   Receipt $s $ALL
$o = Run $s 'PowerShell' 'Restart-Service go2rtc' ''
Check 'the CAMERAS topic gate still stacks on top' ($o -match 'CAMERAS')

# ---------------------------------------------------------------------------
# 2026-09-20 - HEADER gate and CREATE gate, plus the receipt fields they rely on.
# Each pair proves the gate FAILS on the real mistake AND PASSES when satisfied
# (SESSION_START 3b: a check that cannot fail is not a check; one that cries
# wolf is worse than none). The CREATE gate also proves its stand-down: with no
# shell-receipt marker it must ALLOW and say so, never block the unsatisfiable.
# ---------------------------------------------------------------------------
$RECEIPT_HOOK = Join-Path $PSScriptRoot 'Hook-ReadReceipt.ps1'
$TOP    = "$now|docs/OPEN_ITEMS.md|offset=0"
$DEEP   = "$now|docs/OPEN_ITEMS.md|offset=113"
$STALE  = "$($now - 300*60)|docs/OPEN_ITEMS.md|offset=0"
$SEARCH = "$now|[search] mailbox"
$BASE   = @("$now|docs/ACCESS_MAP.md", "$now|docs/SESSION_START.md")
$NEWJS  = 'C:\Users\jeffl\Documents\GitHub\master-the-master-\scripts\zz-test-does-not-exist.js'
function Marker($sid) { Set-Content -LiteralPath (Join-Path $env:TEMP ("hcc-shellreceipt-" + $sid + ".flag")) -Value $now -Encoding ASCII }

$s = T 'rg-hdr-deep';   Receipt $s ($BASE + $DEEP)
$o = Run $s 'Edit' '' $APP
Check 'HEADER: blocks when OPEN_ITEMS was only read from the MIDDLE (offset 113)' ($o -match 'OPEN_ITEMS HEADER') $o

$s = T 'rg-hdr-top';    Receipt $s ($BASE + $TOP)
$o = Run $s 'Edit' '' $APP
Check 'HEADER: passes on a top-of-file read' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-hdr-stale';  Receipt $s ($BASE + $STALE)
$o = Run $s 'Edit' '' $APP
Check 'HEADER: blocks when the top read is 5 h old' ($o -match 'OPEN_ITEMS HEADER') $o

$s = T 'rg-create-nosearch'; Receipt $s ($BASE + $TOP); Marker $s
$o = Run $s 'Write' '' $NEWJS
Check 'CREATE: blocks a NEW scripts/ file with no Search-HCC run' ($o -match 'BUILD-FIRST') $o

$s = T 'rg-create-search';   Receipt $s ($BASE + $TOP + $SEARCH); Marker $s
$o = Run $s 'Write' '' $NEWJS
Check 'CREATE: passes once Search-HCC was run' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-create-auto';     Receipt $s ($BASE + $TOP); Marker $s
$o = Run $s 'PowerShell' 'Invoke-RestMethod -Uri http://192.168.1.66:8123/api/config/automation/config/zz_test -Method POST' ''
Check 'CREATE: blocks an HA automation create (shell) with no search' ($o -match 'BUILD-FIRST') $o

$s = T 'rg-create-edittext'; Receipt $s ($BASE + $TOP); Marker $s
$o = Run $s 'Edit' '' $APP
Check 'CREATE: an Edit whose TEXT mentions the API path does NOT fire (only a shell call can POST)' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-create-existing'; Receipt $s ($BASE + $TOP); Marker $s
$o = Run $s 'Write' '' $APP
Check 'CREATE: does NOT fire on an EXISTING file' ([string]::IsNullOrWhiteSpace($o)) "output: $o"

$s = T 'rg-create-standdown'; Receipt $s ($BASE + $TOP)    # NO marker on purpose
$o = Run $s 'Write' '' $NEWJS
Check 'CREATE: with no shell-receipt marker it ALLOWS and says INACTIVE (never blocks the unsatisfiable)' (($o -match 'CREATE GATE INACTIVE') -and ($o -notmatch 'BUILD-FIRST')) $o

# The receipt hook itself must write the fields the gates read.
$s = T 'rg-receipt'; Receipt $s $null
$pj = @{ session_id = $s; tool_name = 'PowerShell'; tool_input = @{ command = '& "C:\x\Search-HCC.ps1" "mailbox"' } } | ConvertTo-Json -Compress
$pj | & powershell -NoProfile -ExecutionPolicy Bypass -File $RECEIPT_HOOK 2>$null | Out-Null
$pj = @{ session_id = $s; tool_name = 'Read'; tool_input = @{ file_path = 'C:\x\docs\OPEN_ITEMS.md'; offset = 113 } } | ConvertTo-Json -Compress
$pj | & powershell -NoProfile -ExecutionPolicy Bypass -File $RECEIPT_HOOK 2>$null | Out-Null
$rc = ''
$rp = Join-Path $env:TEMP ("hcc-read-$s.txt"); if (Test-Path $rp) { $rc = Get-Content $rp -Raw }
Check 'RECEIPT: a Search-HCC run is credited as [search] <term>' ($rc -match '\[search\] mailbox') $rc
Check 'RECEIPT: a Read records its offset' ($rc -match 'OPEN_ITEMS\.md\|offset=113') $rc
Check 'RECEIPT: a shell call drops the liveness marker' (Test-Path (Join-Path $env:TEMP ("hcc-shellreceipt-$s.flag")))

foreach ($x in $sids) {
  $p = Join-Path $env:TEMP ("hcc-read-$x.txt");         if (Test-Path $p) { [IO.File]::Delete($p) }
  $m = Join-Path $env:TEMP ("hcc-shellreceipt-$x.flag"); if (Test-Path $m) { [IO.File]::Delete($m) }
}
""
"READ GATE: $pass passed, $fail failed"
if ($fail -gt 0) { exit 1 } else { exit 0 }
