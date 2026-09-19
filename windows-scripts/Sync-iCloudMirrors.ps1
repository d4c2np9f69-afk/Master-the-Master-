<#
  Sync-iCloudMirrors.ps1
  ----------------------
  CLAUDE.md declares several repo documents as having an iCloud "mirror".
  Nobody ever automated it, so on 2026-09-18 all five were found to be
  EXACTLY 33 days stale - mirrored once on 2026-08-16 and never again.

  SESSION_START.md was the dangerous one: its entire job is to be read at
  the start of a session, and the iCloud copy would have handed a session
  August's picture of the house. That is the stale-document failure this
  project has paid for more than any other.

  THE RULE THIS ENFORCES:
    The repo is the ONLY writable home for these documents.
    iCloud gets a one-way copy. There are never two writable copies.

  Run it any time. It is idempotent and it only ever writes into iCloud.
  -WhatIf shows what it would do without touching anything.
#>
[CmdletBinding(SupportsShouldProcess)]
param()

$repo   = 'C:\Users\jeffl\Documents\GitHub\master-the-master-'
$icloud = 'C:\Users\jeffl\iCloudDrive\HCC-Archive'

# repo path  ->  iCloud filename   (names differ in one case, deliberately)
$pairs = @(
    @{ src = 'docs\BEEHIVE_REFERENCE.md';   dst = 'BEEHIVE_REFERENCE.md'        }
    @{ src = 'docs\UTILITIES_REFERENCE.md'; dst = 'UTILITIES_REFERENCE.md'      }
    @{ src = 'docs\SESSION_START.md';       dst = 'SESSION_START.md'            }
    @{ src = 'docs\COST_LEDGER.md';         dst = 'COST_LEDGER.md'              }
    @{ src = 'docs\CHANGELOG_ARCHIVE.md';   dst = 'CLAUDE_CHANGELOG_FULL.md'    }
    @{ src = 'docs\OPEN_ITEMS.md';          dst = 'OPEN_ITEMS.md'               }
)

Write-Host ""
Write-Host "=== iCloud mirror sync  $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===" -ForegroundColor Cyan
Write-Host "    repo is the source of truth; iCloud is a one-way copy"
Write-Host ""

$changed = 0; $same = 0; $missing = 0

foreach ($p in $pairs) {
    $s = Join-Path $repo   $p.src
    $d = Join-Path $icloud $p.dst

    if (-not (Test-Path $s)) {
        Write-Host ("  MISSING IN REPO  {0}" -f $p.src) -ForegroundColor Red
        $missing++; continue
    }

    $sh = (Get-FileHash $s -Algorithm SHA256).Hash
    $dh = if (Test-Path $d) { (Get-FileHash $d -Algorithm SHA256).Hash } else { 'none' }

    if ($sh -eq $dh) {
        Write-Host ("  same      {0}" -f $p.dst) -ForegroundColor DarkGray
        $same++
    }
    else {
        $age = if (Test-Path $d) {
                   '{0:N0} days behind' -f ((Get-Date) - (Get-Item $d).LastWriteTime).TotalDays
               } else { 'did not exist' }
        if ($PSCmdlet.ShouldProcess($d, "copy from $($p.src)")) {
            Copy-Item $s $d -Force
            Write-Host ("  UPDATED   {0}   (was {1})" -f $p.dst, $age) -ForegroundColor Green
        }
        $changed++
    }
}

Write-Host ""
Write-Host ("  {0} updated, {1} already current, {2} missing" -f $changed, $same, $missing)
Write-Host ""
