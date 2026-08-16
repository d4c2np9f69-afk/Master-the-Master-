<#
.SYNOPSIS
    Search everything ever said or done on the HCC project.

.EXAMPLE
    .\Search-HCC.ps1 inovelli
    .\Search-HCC.ps1 "dimmer|kasa|plug" -Context 6
    .\Search-HCC.ps1 valve -DecisionsOnly

.NOTES
    Built 2026-08-16. THE FIRST THING to run when Jeff says "we discussed this",
    "I told you", or "that was settled" - BEFORE claiming anything is or is not
    documented. Getting that wrong is what made this script necessary.
#>
param(
    [Parameter(Mandatory = $true, Position = 0)][string]$Pattern,
    [int]$Context = 4,
    [switch]$DecisionsOnly,
    [switch]$IncludeActions
)

$root = "C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
$rec  = Join-Path $root "HCC_MASTER_RECORD.md"
$dec  = Join-Path $root "HCC_DECISIONS_LEDGER.md"
$act  = Join-Path $root "HCC_ACTIONS_LOG.md"

if (-not (Test-Path $rec)) {
    Write-Warning "Master record missing. Run Update-HCCMasterRecord.ps1 first."
    return
}

Write-Host "`n=== JEFF'S DECISIONS matching '$Pattern' ===" -ForegroundColor Yellow
$d = Select-String -Path $dec -Pattern $Pattern -Context 1, 1
if ($d) { $d | ForEach-Object { $_.Context.PreContext; $_.Line; "" } } else { Write-Host "  (none)" }

if ($DecisionsOnly) { return }

Write-Host "`n=== CONVERSATION matching '$Pattern' ===" -ForegroundColor Cyan
$m = Select-String -Path $rec -Pattern $Pattern -Context $Context, $Context
if ($m) {
    Write-Host "  $($m.Count) hits`n"
    $m | ForEach-Object {
        $_.Context.PreContext | ForEach-Object { "    $_" }
        Write-Host "  > $($_.Line)" -ForegroundColor Green
        $_.Context.PostContext | ForEach-Object { "    $_" }
        "  " + ("-" * 70)
    }
} else { Write-Host "  (none)" }

if ($IncludeActions) {
    Write-Host "`n=== ACTIONS matching '$Pattern' ===" -ForegroundColor Magenta
    Select-String -Path $act -Pattern $Pattern | Select-Object -First 40 |
        ForEach-Object { "  $($_.Line)" }
}
