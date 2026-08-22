<#
  HCC ENFORCEMENT HOOK - SessionStart

  Rule 15 says "read docs/SESSION_START.md in full at the start of every session."
  Rule 1 has said "READ THIS FILE FIRST" since 2026-06-24. The archive's own
  finding: "Rule-1 compliance leaves no trace. How many sessions never read
  CLAUDE.md at all is uncountable. Only breakage is visible."

  So this stops relying on a session choosing to read anything. It INJECTS the
  cost ledger, the killed-hardware list, and the real clock directly into context
  before the session can do anything. No discipline required.
#>
$ErrorActionPreference = 'SilentlyContinue'
$repo = 'C:\Users\jeffl\Documents\GitHub\master-the-master-'

$out = @()
$out += "================= HCC PROJECT - MANDATORY SESSION BRIEFING ================="
$out += "Injected automatically. You did not choose to read this; that is the point."
$out += ""
$out += "REAL TIME NOW: " + (Get-Date -Format 'dddd yyyy-MM-dd hh:mm tt') + " local"
$out += "  (Rule 14. Never infer the time from conversation - it has been broken twice.)"
$out += ""

# The bill - the whole reason the rules exist
$ledger = Join-Path $repo 'docs\COST_LEDGER.md'
if (Test-Path $ledger) {
  $out += "----- WHAT IGNORING THE RULES HAS ALREADY COST JEFF -----"
  $out += "  29.0 measured hours of error-fighting (~44 incl. pre-commit)"
  $out += "  128 incident-days | 95 of 636 commits (14.9%) were self-inflicted fixes"
  $out += "  ~`$234 of Claude Max burned + mower sensors he did not need to buy"
  $out += "  Worst single failure: hour meter dead 50 days across 5 real mows."
  $out += "  Read docs\COST_LEDGER.md. Full detail: MASTER-RECORD\CLOUD_SESSION\."
  $out += ""
}

$out += "----- NEVER RE-PROPOSE (Jeff killed these; re-pitching costs trust) -----"
$out += "  Inovelli Blue 2-1 (~`$120/pair) - 'I was not paying `$120 for a freaking"
$out += "  dimmer switch.' Also: Enbrighten 43080, Enbrighten Z-Wave, Shelly Pro"
$out += "  3EM-400, Orbit 51059, HomeKit Secure Video, myQ integration, Blink RTSP."
$out += "  CURRENT lighting plan = Kasa switches + cheap Zigbee PLUGS for the mesh."
$out += ""
$out += "----- THE FIVE RULES THAT KEEP BREAKING -----"
$out += "  1. LOOK IT UP. The record contains NO case where guessing beat the lookup."
$out += "  2. VERIFY THE FAR END. Component checks were green through every failure."
$out += "  3. WRITE JEFF'S DECISIONS INTO A FILE THE SAME SESSION. Not later."
$out += "  4. SEARCH BEFORE CLAIMING. Never say 'that isn't documented' un-searched."
$out += "  5. NEVER NAME A PART FROM MEMORY. Verify in-session or say 'let me check.'"
$out += ""
$out += "----- YOUR TOOLS (cheap, use them) -----"
$out += "  .\windows-scripts\Show-HCCNext.ps1        where we are / what's next (~600 tok)"
$out += "  .\windows-scripts\Search-HCC.ps1 `"topic`"  what happened / what was decided"
$out += ""
$out += "----- LIVE SAFETY GAP, STILL OPEN -----"
$out += "  A person in the back yard at night may still be undetectable. See"
$out += "  CLAUDE.md Pending Item 0b before touching the camera stack."
$out += ""

# ---- OPEN ITEMS, injected live so no session can claim it did not see the list ----
# Added 2026-08-22. Jeff: "no session ever reads anything before continuing the
# behaviour that causes the failures." Documents get skipped; injected context does not.
# The 08-18 battery meter was flagged "still owed" in prose and then sat FOUR DAYS.
$oi = Join-Path $repo 'docs\OPEN_ITEMS.md'
if (Test-Path $oi) {
    $lines = Get-Content $oi
    $rows  = @($lines | Where-Object { $_ -match '^\|\s*\d+\s*\|' })
    # Count by SECTION, not by emoji - emoji matching is encoding-fragile.
    $p1 = @(); $sec = ''
    foreach ($l in $lines) {
        if ($l -match '^##\s')            { $sec = $l }
        elseif ($l -match '^\|\s*\d+\s*\|' -and $sec -match 'P1') { $p1 += $l }
    }
    $stale = [int]((Get-Date) - (Get-Item $oi).LastWriteTime).TotalDays
    $out += "----- OPEN ITEMS (docs\OPEN_ITEMS.md = THE list. UPDATE IT THIS SESSION) -----"
    $out += ("  {0} open items, {1} flagged P1. List last updated {2} day(s) ago." -f $rows.Count, $p1.Count, $stale)
    if ($stale -ge 2) {
        $out += "  *** THAT IS STALE. Sessions have done work and not struck items off. ***"
        $out += "  *** Closing an item means striking it HERE with the date and proof.  ***"
    }
    foreach ($r in ($p1 | Select-Object -First 3)) {
        $t = ($r -split '\|')[2].Trim() -replace '\*\*','' -replace '[^\x20-\x7E]',' ' -replace '\s+',' '
        if ($t.Length -gt 88) { $t = $t.Substring(0,88) + '...' }
        $out += ("   P1: {0}" -f $t.Trim())
    }
    $out += ""
}

$out += "----- BEFORE SAYING ANYTHING WORKS -----"
$out += "  A component check is NOT a feature check. On 08-21 the camera stream check"
$out += "  printed ALL GOOD eleven minutes AFTER the TV popups had been silently killed."
$out += "  Run the test that exercises the FEATURE, then say what proved it:"
$out += "    HCC-Scripts\Test-CameraFeature.ps1   fires a real detection, asserts the"
$out += "                                         popup + phone notify actually FIRED"
$out += "==========================================================================="

@{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = ($out -join "`n")
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
