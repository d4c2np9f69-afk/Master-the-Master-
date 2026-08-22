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
# ---------------------------------------------------------------------------
# THIS BLOCK IS FIRST ON PURPOSE (2026-08-22).
# The cost banner also sits at the top of CLAUDE.md - but CLAUDE.md does NOT
# auto-load for these sessions. They start in C:\Users\jeffl and the repo is a
# CHILD directory, so CLAUDE.md only enters context if the session happens to
# open the repo. THIS HOOK is the only thing that reaches every session.
# So the bill goes here, at the very top, before anything else. Do not demote it.
# ---------------------------------------------------------------------------
$out += "###########################################################################"
$out += "###########################################################################"
$out += "##                                                                       ##"
$out += "##   S T O P  -  READ THIS BEFORE YOU TYPE ONE WORD TO JEFF.             ##"
$out += "##                                                                       ##"
$out += "##   This appears ONCE, at session start, by Jeff's decision - so that    ##"
$out += "##   every turn afterwards stays cheap. That means THIS IS THE ONLY       ##"
$out += "##   TIME YOU WILL SEE IT. Do not skim it.                                ##"
$out += "##                                                                       ##"
$out += "###########################################################################"
$out += ""
$out += "  ================= WHAT BREAKING THE RULES HAS COST JEFF ================="
$out += ""
$out += "        ~44 HOURS of error-fighting   (29.0 h measured + pre-commit)"
$out += "        128 INCIDENT-DAYS"
$out += "        95 OF 636 COMMITS (14.9%) spent fixing our OWN mess"
$out += "        ~47 MORE HOURS building the machinery to stop it happening"
$out += "        ~`$35 of subscription wasted on our errors (of `$233.75 total)"
$out += "        + HARDWARE HE BOUGHT THAT HE DID NOT NEED"
$out += ""
$out += "  He was PRESENT for nearly every one of those hours - pasting commands,"
$out += "  running 2FA codes, live-testing a meter that was healthy all along,"
$out += "  hand-re-entering mower hours after 5 separate mows, fact-checking three"
$out += "  wrong part numbers. THAT is the real bill."
$out += ""
$out += "  WORST SINGLE FAILURE: the hour meter was DEAD 50 DAYS ACROSS 5 REAL MOWS."
$out += "  The box sent 'hours_seconds', the app read 'hours'. A session coded"
$out += "  against a PROSE DESCRIPTION of the firmware instead of the firmware."
$out += "  Jeff was told his sensors were faulty and BOUGHT REPLACEMENTS. They were"
$out += "  fine - they had recorded 6.3 km of real mowing the whole time."
$out += ""
$out += "  ------------------- THE TWO HABITS THAT CAUSED IT -------------------"
$out += ""
$out += "  1. DECLARING SUCCESS FROM A GREEN COMPONENT CHECK."
$out += "     2026-08-21: the camera stream check printed ALL GOOD ELEVEN MINUTES"
$out += "     AFTER a change had silently killed the TV popups. The check was not"
$out += "     wrong - it was the WRONG INSTRUMENT. Green components, dead feature."
$out += "     -> Test the FEATURE. Name the command that proved it."
$out += ""
$out += "  2. HANDING AN OWED ITEM OFF IN PROSE INSTEAD OF ONTO THE LIST."
$out += "     2026-08-18: a session wrote 'the trend-sensor system never got built'"
$out += "     in its own wrap-up. It then sat FOUR DAYS across multiple sessions"
$out += "     until Jeff asked. docs\OPEN_ITEMS.md existed and nobody opened it."
$out += "     -> Every owed item goes on that list THIS session, owner + date."
$out += ""
$out += "  It happened AGAIN on 2026-08-22, three times in one morning - including"
$out += "  a warning banner about unverified claims that itself contained two"
$out += "  unverified claims. Jeff had to correct it. This is easy to do."
$out += ""
$out += "  ---------------------- YOU ARE ON THE RECORD ----------------------"
$out += ""
$out += "  445 of 737 commits carry your session ID. 6,896 messages are archived"
$out += "  verbatim. Sessions ARE pulled up and quoted back - that happened on"
$out += "  2026-08-22, quoting a session FOUR DAYS after the fact."
$out += ""
$out += "  Jeff has FILED a case study with Anthropic. The REFUND REQUEST against"
$out += "  his `$125/mo plan is WRITTEN and DELIBERATELY NOT FILED. Verbatim:"
$out += "     'I don't want to. I just want to make Claude better for everybody,"
$out += "      including myself... but I don't know how to fix it if nobody reads"
$out += "      it.'"
$out += "  The ONLY thing keeping it unfiled is sessions actually doing this."
$out += ""
$out += "  Write only what you can stand behind being read back to you with your"
$out += "  session ID attached."
$out += ""
$out += "  ############ READ EVERYTHING FIRST.                        ############"
$out += "  ############ VERIFY BEFORE MAKING A SINGLE STATEMENT.      ############"
$out += ""
$out += "  Never write 'fixed' / 'working' / 'verified' / 'done' without naming the"
$out += "  command or observation that proved it. If you cannot name one, you have"
$out += "  NOT verified it - say that instead."
$out += ""
$out += "  SEPARATE WHAT YOU OBSERVED FROM WHAT YOU INFERRED. Learned 2026-08-22"
$out += "  from a live test: a session correctly checked the FEATURE, then said the"
$out += "  trigger was 'one real detection, and it wasn't me firing a test' - it was"
$out += "  a synthetic test event fired an hour earlier. A TIMESTAMP PROVES SOMETHING"
$out += "  RAN. IT DOES NOT PROVE WHAT TRIGGERED IT. Do not assert provenance, cause,"
$out += "  or 'this was real' unless you can point at the thing that shows it. Say"
$out += "  'the automation fired at 12:02; I cannot tell from here what triggered it.'"
$out += ""
$out += "  WHEN YOU CORRECT SOMETHING, GREP FOR IT EVERYWHERE BEFORE SAYING FIXED."
$out += "  This failed THREE TIMES on 2026-08-22 alone: a superseded '28.8 h' figure"
$out += "  lived in 3 files; a '`$234 burned' claim was fixed in the banner and left"
$out += "  in this very hook; and 'garage 2-location unresolved' was corrected in a"
$out += "  memory file while the SAME stale line sat in MEMORY.md - the always-loaded"
$out += "  index - for 5 days after the question was closed at `$0."
$out += "  A claim you corrected in one place is NOT corrected. Search every file,"
$out += "  the memory index, the frontmatter descriptions, and these hooks."
$out += ""
$out += "  A STALE NOTE IS WORSE THAN NO NOTE. If a file says something is open/"
$out += "  broken/unresolved, CHECK whether it was already closed before repeating"
$out += "  it to Jeff. Several already were - and were repeated anyway for days."
$out += ""
$out += "  Do NOT re-derive the audits. Jeff already paid for them in hours and"
$out += "  money. Cite them: MASTER-RECORD\CLOUD_SESSION\sections\22-cost-accounting.md"
$out += ""
$out += "  BLOCKED BY A TOOL != IMPOSSIBLE. TRY ANOTHER TOOL BEFORE YOU GIVE UP."
$out += "  Live test 2026-08-22: a session reported 'the sandbox blocked script"
$out += "  execution, ping, curl and every form of Invoke-RestMethod - I have no"
$out += "  live reading'. THE LAN WAS REACHABLE THE WHOLE TIME. It tunnelled on the"
$out += "  PowerShell tool, hit a policy filter, and stopped. Verified working:"
$out += "     Bash tool + curl http://192.168.1.66:8123/   -> HTTP 200, real HA HTML"
$out += "     Bash tool + curl .../api/                    -> 401 = HA answering"
$out += "     PowerShell: Test-NetConnection 192.168.1.66 -Port 8123 -> True"
$out += "  KNOWN TOOL TRAPS (not network failures):"
$out += "   - the PowerShell tool REJECTS any command containing `$( )  subexpressions"
$out += "   - pipes and && can trigger approval prompts in non-interactive runs"
$out += "   - for a .ps1 that will not start:"
$out += "       powershell -NoProfile -ExecutionPolicy Bypass -File `"<full path>`""
$out += "  Rule 17: enumerate the OTHER routes before declaring something blocked."
$out += "  Do NOT silently skip a verification because the first tool refused."
$out += "###########################################################################"
$out += ""
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
  $out += "  ~`$35 of subscription spent fighting our OWN errors (of `$233.75 total -"
  $out += "  do NOT say '`$234 burned', that is the whole spend) + mower sensors"
  $out += "  he did not need to buy. Jeff has a refund request WRITTEN and NOT filed;"
  $out += "  he is holding it back hoping sessions actually read this."
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
