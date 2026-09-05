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
    [int]$Context = 2,          # was 4 - halves output for the same information
    [int]$Max = 8,              # hits per tier. Keeps a search ~1-2k tokens, not 16k.
    [switch]$DecisionsOnly,
    [switch]$IncludeActions,
    [switch]$Full               # lift the caps when you genuinely need everything
)
if ($Full) { $Max = 200; $Context = 4 }

# Cost discipline: an unbounded search returned ~16,000 tokens on 2026-08-16, which is
# more than the entire CLAUDE.md it was built to keep small. A tool that is expensive to
# run does not get run. Capped output + a hit count tells you whether to narrow instead.

$root  = "C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
$rec   = Join-Path $root "HCC_MASTER_RECORD.md"
$dec   = Join-Path $root "HCC_DECISIONS_LEDGER.md"
$act   = Join-Path $root "HCC_ACTIONS_LOG.md"
$git   = Join-Path $root "HCC_GIT_HISTORY.md"
$cloud = Join-Path $root "CLOUD_SESSION"          # the reconstructed 05-20 -> 08-16 history

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
    $mTotal = @($m).Count; $m = @($m) | Select-Object -First $Max
if ($m) {
    Write-Host "  $mTotal hits (showing $(@($m).Count))`n"
    $m | ForEach-Object {
        $_.Context.PreContext | ForEach-Object { "    $_" }
        Write-Host "  > $($_.Line)" -ForegroundColor Green
        $_.Context.PostContext | ForEach-Object { "    $_" }
        "  " + ("-" * 70)
    }
} else { Write-Host "  (none)" }

Write-Host "`n=== PROJECT HISTORY (2026-05-20 onward, incl. the pre-transcript era) ===" -ForegroundColor Yellow
if (Test-Path $cloud) {
    $h = Select-String -Path (Join-Path $cloud "sections\*.md") -Pattern $Pattern -Context 2, 2
    if ($h) {
        Write-Host "  $($h.Count) hits across the chronicles`n"
        $h | Select-Object -First $Max | ForEach-Object {
            Write-Host "  [$([IO.Path]::GetFileNameWithoutExtension($_.Path))]" -ForegroundColor DarkYellow
            $_.Context.PreContext | ForEach-Object { "    $_" }
            Write-Host "  > $($_.Line)" -ForegroundColor Green
            $_.Context.PostContext | ForEach-Object { "    $_" }
            "  " + ("-" * 70)
        }
        if ($h.Count -gt 25) { Write-Host ("  ...{0} more - narrow the pattern" -f ($h.Count - 25)) }
    } else { Write-Host "  (none)" }
} else {
    Write-Host "  (CLOUD_SESSION archive not present)"
}

if ($IncludeActions) {
    Write-Host "`n=== ACTIONS matching '$Pattern' ===" -ForegroundColor Magenta
    Select-String -Path $act -Pattern $Pattern | Select-Object -First 40 |
        ForEach-Object { "  $($_.Line)" }
    Write-Host "`n=== COMMITS matching '$Pattern' ===" -ForegroundColor DarkCyan
    Select-String -Path $git -Pattern $Pattern | Select-Object -First 30 |
        ForEach-Object { "  $($_.Line)" }
}



# ---------------------------------------------------------------------------
# REFERENCE GUIDES in iCloud\HCC-Archive (added 2026-08-21, Jeff's request:
# "make it searchable in iCloud, so that future sessions can search for it if
# something goes wrong").
#
# WHY THIS WAS ADDED: this script only ever searched the MASTER-RECORD subfolder,
# so the how-to guides sitting in HCC-Archive itself - FAMILY_RUNBOOK,
# BEEHIVE_REFERENCE, UTILITIES_REFERENCE, CAMERA_POPUP_REBUILD_GUIDE and the rest
# - were INVISIBLE to search. A search for "Fire TV Apple TV sync" returned
# nothing on 2026-08-21 for exactly that reason. An unsearchable guide is no
# better than no guide.
# ---------------------------------------------------------------------------
$guides = "C:\Users\jeffl\iCloudDrive\HCC-Archive"
Write-Host "`n=== REFERENCE GUIDES (iCloud\HCC-Archive) matching '$Pattern' ===" -ForegroundColor Green
if (Test-Path $guides) {
    $g = Select-String -Path (Join-Path $guides "*.md") -Pattern $Pattern -Context 1, 1 -ErrorAction SilentlyContinue |
         Where-Object { $_.Path -notmatch 'STALE' }          # never surface the retired CLAUDE.md
    if ($g) {
        $gTotal = @($g).Count
        Write-Host "  $gTotal hits (showing up to $Max)`n"
        @($g) | Select-Object -First $Max | ForEach-Object {
            Write-Host ("  [{0}]" -f [IO.Path]::GetFileName($_.Path)) -ForegroundColor DarkGreen
            $_.Context.PreContext  | ForEach-Object { "    $_" }
            Write-Host "  > $($_.Line)" -ForegroundColor Green
            $_.Context.PostContext | ForEach-Object { "    $_" }
            "  " + ("-" * 70)
        }
        if ($gTotal -gt $Max) { Write-Host ("  ...{0} more - narrow the pattern" -f ($gTotal - $Max)) }
    } else { Write-Host "  (none)" }
} else {
    Write-Host "  (HCC-Archive not present - is iCloud synced?)"
}
