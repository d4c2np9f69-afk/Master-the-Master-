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
    if ($mTotal -gt $Max) {
        $script:HCCTruncated = $true
        Write-Host ("  ...{0} MORE HITS NOT SHOWN - you have seen {1}% of them." -f ($mTotal - $Max), [int](100 * $Max / $mTotal)) -ForegroundColor Red
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
        if ($gTotal -gt $Max) { $script:HCCTruncated = $true; Write-Host ("  ...{0} more - narrow the pattern" -f ($gTotal - $Max)) }
    } else { Write-Host "  (none)" }
} else {
    Write-Host "  (HCC-Archive not present - is iCloud synced?)"
}

# ---------------------------------------------------------------------------
# THE REPO ITSELF - added 2026-10-08, the same session it was earned.
#
# WHAT HAPPENED: Jeff asked why the house map was not "alive" with lights and working
# ceiling fans. I ran THIS SCRIPT three times with three different patterns, got no
# on-point hit, and told him his request "is not written anywhere". It WAS. It was at
# the top of paintLife() in docs/house-plan/plan-live.js:
#     Jeff 09:40: "add more life to the map, show the tvs on off etc really make it
#     look like it's alive"
# and the features he was asking for were ALREADY BUILT underneath it - duct airflow on
# switch.ac_relay, sprinkler spray on the six zone switches, warm pools scaled by each
# dimmer's real brightness. He was being asked to re-request work he had already paid
# for, because the search meant to prevent exactly that could not see the repo.
#
# THIS SCRIPT HAD THIS HOLE ONCE BEFORE. The REFERENCE GUIDES tier above was added
# 2026-08-21 for the identical reason - it "only ever searched the MASTER-RECORD
# subfolder", so material one directory up was invisible. Same class, new tier.
#
# WHY IT MATTERS MORE THAN AN ORDINARY MISS: CASE_STUDY_FOR_ANTHROPIC.md names this as
# failure mode #6 - "grepping for a dead plan's keyword, finding nothing, and concluding
# no plan was documented" - and says it "twice nearly ended the project". A UserPromptSubmit
# hook ALREADY forces this search before any "that was never documented" claim. The hook
# worked. The tool it forced was incomplete, so the session complied and was still wrong.
#
# THE PRINCIPLE: when enforcement is mechanical, the MECHANISM MUST BE COMPLETE. Fixing the
# tool beats writing a rule telling the next session to also grep the repo by hand - that
# rule would be prose, and prose is what this project has already proved does not survive a
# session boundary.
# ---------------------------------------------------------------------------
$repo = Split-Path -Parent $PSScriptRoot
Write-Host "`n=== THE REPO (code + docs) matching '$Pattern' ===" -ForegroundColor Magenta
if (Test-Path $repo) {
    $rFiles = Get-ChildItem -Path $repo -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $_.FullName -notmatch '\\\.git\\' -and
            $_.FullName -notmatch '\\node_modules\\' -and
            $_.Length -lt 2MB -and
            $_.Extension -match '^\.(md|js|mjs|ps1|py|yaml|yml|json|html|css|txt|cmd|sh)$'
        }
    $rHits = $rFiles | Select-String -Pattern $Pattern -ErrorAction SilentlyContinue
    $rTotal = @($rHits).Count
    if ($rTotal -gt 0) {
        Write-Host "  $rTotal hits (showing up to $Max)`n"
        $rHits | Select-Object -First $Max | ForEach-Object {
            $rel = $_.Path.Replace($repo, '').TrimStart('\')
            Write-Host ("  [{0}:{1}]" -f $rel, $_.LineNumber) -ForegroundColor DarkMagenta
            Write-Host "  > $($_.Line.Trim())" -ForegroundColor Green
            "  " + ("-" * 70)
        }
        if ($rTotal -gt $Max) { $script:HCCTruncated = $true; Write-Host ("  ...{0} more - narrow the pattern" -f ($rTotal - $Max)) }
    } else {
        Write-Host "  (none)"
    }
} else {
    Write-Host "  (repo not found at $repo)"
}

# ---------------------------------------------------------------------------
# TRUNCATION WARNING - added 2026-09-20, the same session it was earned.
#
# WHAT HAPPENED: a session ran this script, saw "60 hits (showing 8)", read those
# 8 snippets and treated that as having read the record. It then reported a device
# as MISSING when the archive said plainly it was "still on your bench" - in one of
# the 52 hits it never saw. Jeff: "you didn't fully read the file."
#
# The CONVERSATION tier was the only one that printed a hit count with NO follow-up
# hint, so it read like a complete answer. It never was.
#
# THE RULE THIS ENFORCES: a search is a POINTER TO FILES, not an answer. The read
# gates already say "use the Read tool - grep does NOT count", and this script IS a
# grep. Truncated output must never be the basis of a claim.
# ---------------------------------------------------------------------------
if ($script:HCCTruncated) {
    Write-Host ""
    Write-Host ("=" * 74) -ForegroundColor Red
    Write-Host "  THIS OUTPUT IS A SAMPLE, NOT THE RECORD. Results were TRUNCATED." -ForegroundColor Red
    Write-Host "  A search is a POINTER TO FILES. Do not make a claim from it." -ForegroundColor Red
    Write-Host "  -> Re-run with -Full, narrow the pattern, or OPEN the files it named." -ForegroundColor Red
    Write-Host "  Earned 2026-09-20: 8 of 60 hits were read; the answer was in the 52." -ForegroundColor DarkRed
    Write-Host ("=" * 74) -ForegroundColor Red
}
