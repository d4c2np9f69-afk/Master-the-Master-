# Feature-test the session topic freeze. Negative control included: a check that cannot fail is
# not a check. Uses throwaway session ids so the live receipt is untouched.
$HOOK = 'C:\Users\jeffl\Documents\GitHub\master-the-master-\windows-scripts\hooks\Hook-RequireRead.ps1'
$pass = 0; $fail = 0
function Run($sid, $tool, $cmd, $path) {
  $j = @{ session_id = $sid; tool_name = $tool; tool_input = @{ command = $cmd; file_path = $path } } |
       ConvertTo-Json -Depth 5 -Compress
  return ($j | & powershell -NoProfile -ExecutionPolicy Bypass -File $HOOK 2>$null) -join "`n"
}
function Receipt($sid, $lines) {
  $p = Join-Path $env:TEMP ("hcc-read-$sid.txt")
  if ($lines) { Set-Content -LiteralPath $p -Value $lines -Encoding utf8 } elseif (Test-Path $p) { [IO.File]::Delete($p) }
}
function Check($n, $c, $d) { if ($c) { $script:pass++; "  PASS  $n" } else { $script:fail++; "  FAIL  $n   $d" } }

$now = [int][double]::Parse((Get-Date -UFormat %s))
$ALL = @("$now|docs/ACCESS_MAP.md", "$now|docs/SESSION_START.md", "$now|docs/OPEN_ITEMS.md")

# 1. A READ-ONLY command touching a frozen topic must be refused - this is the whole point,
#    and it is what the rest of the gate cannot do.
$s='fz-read'; Receipt $s $ALL
$o = Run $s 'PowerShell' 'Get-Content C:\config\custom_components\blink\manifest.json' ''
Check 'blocks a READ-ONLY command on a frozen topic' ($o -match 'FROZEN|BLOCKED') $o

# 2. The reason Jeff wrote must be shown, not a generic refusal.
Check '  and shows the reason from the freeze file' ($o -match 'too big a job tonight')

# 3. The second frozen topic works too.
$s='fz-gen'; Receipt $s $ALL
$o2 = Run $s 'PowerShell' 'node HCC-Scripts\genealogy\tree_crawl.js' ''
Check 'blocks the second frozen topic' ($o2 -match 'FROZEN|BLOCKED')
Check '  with its own reason' ($o2 -match 'not the main priority')

# 4. NEGATIVE CONTROL - an unrelated command must still pass.
$s='fz-ok'; Receipt $s $ALL
$o3 = Run $s 'PowerShell' 'Get-ChildItem C:\Users\jeffl\Documents' ''
Check 'an unfrozen command is NOT blocked' ([string]::IsNullOrWhiteSpace($o3)) "output: $o3"

# 5. Jeff's override still wins - it is his house.
$s='fz-ovr'; Receipt $s $ALL
$o4 = Run $s 'PowerShell' 'Get-Content blink.json  # HCC-OVERRIDE' ''
Check 'HCC-OVERRIDE still lifts it' ([string]::IsNullOrWhiteSpace($o4)) "output: $o4"

# 6. Writing the freeze file itself must never be gated, or a freeze cannot be declared.
$s='fz-self'; Receipt $s $null
$o5 = Run $s 'Write' '' 'C:\Users\jeffl\.claude\session-freeze.txt'
Check 'the freeze file itself is exempt' ([string]::IsNullOrWhiteSpace($o5)) "output: $o5"

foreach ($x in 'fz-read','fz-gen','fz-ok','fz-ovr','fz-self') {
  $p = Join-Path $env:TEMP "hcc-read-$x.txt"; if (Test-Path $p) { [IO.File]::Delete($p) }
}
""
"FREEZE GATE: $pass passed, $fail failed"
if ($fail) { exit 1 } else { exit 0 }
