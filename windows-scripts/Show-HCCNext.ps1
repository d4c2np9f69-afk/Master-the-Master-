<#
.SYNOPSIS
    THE PROJECT DRIVER - where HCC stands right now and what to do next.

.DESCRIPTION
    Search-HCC answers "what happened." This answers "what now."

    Built 2026-08-16. Everything is read LIVE from the real sources - Home Assistant,
    git, the inventory, the pending list - never from memory. That is the point: a
    session that runs this cannot tell Jeff a stale story.

    Output is deliberately short (~1k tokens). Use -Full for everything.

.EXAMPLE
    .\Show-HCCNext.ps1            # the standing briefing
    .\Show-HCCNext.ps1 -Full      # every open item
    .\Show-HCCNext.ps1 -Quiet     # skip the live HA check (fast / offline)

.NOTES
    WHEN TO RUN IT
      - Start of every work session, before proposing anything
      - When Jeff asks "what's next" / "where are we" / "what's left"
      - After finishing a task, to pick the next one
      - Before claiming anything is done - it shows what actually is
#>
param([switch]$Full, [switch]$Quiet)

$repo = "C:\Users\jeffl\Documents\GitHub\master-the-master-"
$max  = if ($Full) { 100 } else { 6 }

# NOTE: do NOT name this function H - that is PowerShell's alias for Get-History.
function Section($text, $colour = 'Cyan') { Write-Host "`n$text" -ForegroundColor $colour }
function Clip($s, $n) { if ($s.Length -le $n) { $s } else { $s.Substring(0, $n) + '...' } }

Section "=== HCC PROJECT STATUS ===" 'White'
Write-Host ("  " + (Get-Date -Format 'dddd yyyy-MM-dd hh:mm tt') + " local")

# ---------------------------------------------------------------- repo
Section "REPO"
Push-Location $repo
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$dirty  = @(git status --porcelain).Count
$ahead  = (git rev-list --count '@{u}..HEAD' 2>$null)
Write-Host "  branch $branch | uncommitted: $dirty | unpushed: $(if($ahead){$ahead}else{0})"
Write-Host "  last: $((git log -1 --format='%ad  %s' --date=short))"
if ($dirty -gt 0) { Write-Host "  ** uncommitted work present **" -ForegroundColor Yellow }

# ---------------------------------------------------------------- live HA
if (-not $Quiet) {
    Section "BEEHIVE (live)"
    $py = "C:\Users\jeffl\AppData\Local\Programs\Python\Python313\python.exe"
    $probe = Join-Path $repo "windows-scripts\hcc_status_probe.py"
    if ((Test-Path $py) -and (Test-Path $probe)) { & $py $probe }
    else { Write-Host "  (probe unavailable)" }
}

# ---------------------------------------------------------------- open items
# Scope to the Pending Items section ONLY - the Mandatory Rules are also a numbered
# list and were being parsed as open work on the first build of this script.
$claude  = Get-Content (Join-Path $repo "CLAUDE.md") -Raw
$start   = $claude.IndexOf("## Pending Items")
$section = if ($start -ge 0) {
    $end = $claude.IndexOf("`n## ", $start + 10)
    if ($end -lt 0) { $claude.Substring($start) } else { $claude.Substring($start, $end - $start) }
} else { "" }

$items = @()
foreach ($m in [regex]::Matches($section, '(?m)^(\d+[a-z]?)\.\s+(.{0,170})')) {
    $txt = $m.Groups[2].Value
    if ($txt -match '^~~') { continue }                      # already closed
    $items += [pscustomobject]@{ N = $m.Groups[1].Value; T = ($txt -replace '\*\*','').Trim() }
}

$jeffOnly = 'Jeff|physical|install|order|buy|purchase|decide|confirm|log in|rotate|unplug|wire'

Section "WAITING ON JEFF (only he can do these)" 'Yellow'
$j = @($items | Where-Object { $_.T -match $jeffOnly })
if ($j) { $j | Select-Object -First $max | ForEach-Object { Write-Host "  [$($_.N)] $(Clip $_.T 130)" } }
else { Write-Host "  (none)" }
if ($j.Count -gt $max) { Write-Host "  ...$($j.Count - $max) more (-Full)" }

Section "I CAN DO THESE NOW (no spend, no Jeff)" 'Green'
$c = @($items | Where-Object { $_.T -notmatch $jeffOnly })
if ($c) { $c | Select-Object -First $max | ForEach-Object { Write-Host "  [$($_.N)] $(Clip $_.T 130)" } }
else { Write-Host "  (none)" }
if ($c.Count -gt $max) { Write-Host "  ...$($c.Count - $max) more (-Full)" }

# ---------------------------------------------------------------- money
Section "WAITING ON SPEND" 'Yellow'
$inv = Join-Path $repo "docs\inventory\HCC_INVENTORY.md"
if (Test-Path $inv) {
    $buy = @(Select-String -Path $inv -Pattern 'TO BUY|to order' |
             Where-Object { $_.Line -notmatch 'SCRAPPED|DO NOT BUY' })
    if ($buy) {
        $buy | Select-Object -First $max | ForEach-Object {
            Write-Host ("  " + (Clip (($_.Line -replace '\|', ' ' -replace '\s{2,}', ' ').Trim()) 120))
        }
    } else { Write-Host "  (nothing flagged)" }
}

# ---------------------------------------------------------------- guardrails
Section "BEFORE PROPOSING ANYTHING" 'Magenta'
Write-Host "  1. docs\COST_LEDGER.md  - what skipping the rules has already cost"
Write-Host "  2. .\windows-scripts\Search-HCC.ps1 `"<topic>`"  - search before claiming"
Write-Host "  3. CLAUDE.md SETTLED DECISIONS - never re-pitch something Jeff killed"
Write-Host "  4. Write any decision Jeff makes into a file THE SAME SESSION"
Pop-Location
