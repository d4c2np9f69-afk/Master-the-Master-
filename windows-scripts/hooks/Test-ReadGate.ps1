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

foreach ($x in $sids) { $p = Join-Path $env:TEMP ("hcc-read-$x.txt"); if (Test-Path $p) { [IO.File]::Delete($p) } }
""
"READ GATE: $pass passed, $fail failed"
if ($fail -gt 0) { exit 1 } else { exit 0 }
