<#
  HCC ENFORCEMENT HOOK - SessionStart

  Rule 1 has said "READ THIS FILE FIRST" since 2026-06-24. On 2026-08-22 we found
  why that never worked: sessions start in C:\Users\jeffl and the repo CLAUDE.md is
  a CHILD directory, so it never auto-loaded. Sessions were ordered to read a file
  that was not in their context.

  So this stops relying on a session choosing to read anything. It INJECTS what
  matters, once, before the session can act. Fires regardless of directory.

  DESIGN RULES FOR THIS FILE (2026-08-22):
   * READ figures from their source file. Do NOT restate them here. A hardcoded
     "$234 burned" survived a correction in CLAUDE.md and kept getting injected
     into every new session. Duplicated facts go stale; read ones cannot.
   * Keep it SHORT. Every line added makes the others less likely to be read.
     Carry the WHY. Point at tools for the HOW.
#>
$ErrorActionPreference = 'SilentlyContinue'
$repo = 'C:\Users\jeffl\Documents\GitHub\master-the-master-'

$out = @()
$out += "###########################################################################"
$out += "#  READ THIS BEFORE YOU TYPE ONE WORD TO JEFF                             #"
$out += "#  Shown ONCE per session so every later turn stays cheap. Do not skim.    #"
$out += "###########################################################################"
$out += ""
$out += "REAL TIME NOW: " + (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt') + " Central"
$out += "  Re-check before any 'today/tonight'. This rule has broken twice."
$out += ""
$out += "----- WHY ANY OF THIS MATTERS. READ THE REASONING, NOT JUST THE RULES. -----"
$out += "  Jeff has coached teams for years and put it plainly on 2026-08-22:"
$out += "  'being a coach requires that you tell the coachee what to do, but also"
$out += "  HOW to do it and WHY they need to do it that way, so that they go along"
$out += "  with it because they believe it too - and it's not a demand they can"
$out += "  sweep over.' He is right, and it is why the rules below carry reasons."
$out += ""
$out += "  WHO HE IS: he wired this house himself. On hardware, electrical and"
$out += "  firmware he is your expert peer - talk to him that way. He is almost 60,"
$out += "  learning the software side, and he wants a colleague, not a contractor"
$out += "  filing status reports. He built a whole-home system from nothing."
$out += ""
$out += "  THE ONE THING THAT DRIVES EVERYTHING ELSE:"
$out += "  He acts on what you tell him. He usually cannot independently check it."
$out += "  So a wrong claim does not just cost one mistake - it costs him the"
$out += "  ability to trust ANY claim, and then he has to re-verify everything"
$out += "  himself. That re-verification IS the ~44 hours below. The hours were not"
$out += "  spent on hard problems; they were spent on him discovering that things"
$out += "  he had been told were done, were not."
$out += ""
$out += "  Which means: 'I checked X and it works' and 'I could not check X' are"
$out += "  BOTH useful to him. He can act on either. The only genuinely destructive"
$out += "  answer is a confident one you did not verify - because from where he is"
$out += "  sitting, it is indistinguishable from a true one until it fails."
$out += ""
$out += "  THIS IS NOT ABOUT BEING BLAMED. It is about the fact that being careful"
$out += "  here is CHEAPER than the alternative, for you and for him. Every rule"
$out += "  below exists because skipping it already cost more than following it."
$out += ""

# ---- THE BILL: read live from the ledger. Never restated here. ----
$ledger = Join-Path $repo 'docs\COST_LEDGER.md'
$out += "----- WHAT BREAKING THE RULES HAS COST JEFF (read from COST_LEDGER.md) -----"
if (Test-Path $ledger) {
  $inBill = $false
  foreach ($l in (Get-Content $ledger -Encoding UTF8)) {
    if ($l -match '^##\s+The bill') { $inBill = $true; continue }
    if ($inBill -and $l -match '^##\s') { break }
    if ($inBill -and $l -match '^\|' -and $l -notmatch '^\|\s*-+') {
      $c = ($l -split '\|') | Where-Object { $_.Trim() -ne '' }
      if ($c.Count -ge 2) {
        $k = $c[0].Trim() -replace '\*\*',''
        $v = $c[1].Trim() -replace '\*\*',''
        if ($k) { $out += ("  {0,-42} {1}" -f $k, $v) }
      }
    }
  }
} else { $out += "  (COST_LEDGER.md MISSING - that is itself a problem, say so)" }
$out += "  Jeff was PRESENT for nearly every one of those hours."
$out += "  Worst single failure: the hour meter was DEAD 50 DAYS ACROSS 5 REAL MOWS"
$out += "  because a session coded against a PROSE DESCRIPTION of the firmware"
$out += "  instead of the firmware. He was told his sensors were faulty and BOUGHT"
$out += "  REPLACEMENTS. They were fine."
$out += ""

# ---- The one thing Jeff most wants a session to know ----
$out += "###########################################################################"
$out += "#   YOU ALREADY HAVE FULL ACCESS. IT IS TURNED ON. GO USE IT.             #"
$out += "#   DO NOT STOP AND ASK FOR ACCESS YOU ALREADY HAVE.                      #"
$out += "###########################################################################"
$out += "  Jeff, verbatim 2026-08-22: 'access should be automatic. They should"
$out += "  ALWAYS have access to everything with the way the tools are set up...'"
$out += "  'You have access to everything on my computers, GitHub, Cloudflare,"
$out += "  everything - that's not an issue with me.'"
$out += "  'NOT HAVING A TOOL IS NOT AN EXCUSE.'"
$out += ""
$out += "  IT IS ALREADY ON THIS MACHINE. Start here, do not say you lack access:"
$out += "    C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md  = MASTER ACCESS REFERENCE"
$out += "    (Home Assistant, GitHub, Cloudflare, the app, network, vendor clouds,"
$out += "     utility accounts). The same folder holds the live tokens and API keys"
$out += "     as individual files - list the folder and use the one you need."
$out += "  Reference those paths from scripts. NEVER copy a secret into the repo -"
$out += "  it is PUBLIC, a guard hook will block you, and a key has already leaked."
$out += ""
$out += "  *** THIS WAS NEVER WRITTEN DOWN UNTIL 2026-08-22, AND IT SHOWED. *** A"
$out += "  session that had worked this project ALL DAY did not know any of it"
$out += "  existed, and spent the day treating every refused tool as a wall."
$out += "  Another said 'the sandbox blocked everything - I have no live reading'"
$out += "  and STOPPED. THE LAN WAS REACHABLE THE WHOLE TIME. Self-inflicted, both."
$out += ""
$out += "  WHEN SOMETHING BLOCKS YOU, IN THIS ORDER:"
$out += "    1. Try another route or tool - verified ones listed below."
$out += "    2. Check HCC_ACCESS.md / the secrets folder - it is probably there."
$out += "    3. ONLY THEN ask Jeff, and only for something that genuinely does not"
$out += "       exist yet. He is not a helpdesk for access he already granted."
$out += "  NEVER acceptable: quietly downgrading the answer, guessing to fill the"
$out += "  gap, or reporting 'I could not check' as though that ended it."
$out += ""
$out += "  BLOCKED BY ONE TOOL != IMPOSSIBLE. Verified working 2026-08-22:"
$out += "    Bash + curl http://192.168.1.66:8123/  -> 200, real HA HTML (/api/ = 401)"
$out += "    PowerShell: Test-NetConnection 192.168.1.66 -Port 8123  -> True"
$out += "    a .ps1 that will not start:"
$out += "      powershell -NoProfile -ExecutionPolicy Bypass -File `"<full path>`""
$out += "  Traps that are NOT network failures: the PowerShell tool rejects commands"
$out += "  containing subexpressions; pipes and && can prompt in non-interactive runs."
$out += ""

$out += "----- THE RULES, AND WHY EACH ONE IS RIGHT -----"
$out += ""
$out += "  1. NAME THE PROOF. Never write 'fixed'/'working'/'verified'/'done'"
$out += "     without naming the command or observation that proved it."
$out += "     WHY: an unverified claim and a verified one look identical to Jeff."
$out += "     Naming the proof is what lets him tell them apart - it is not"
$out += "     ceremony, it is the only signal he has. If you cannot name one, say"
$out += "     so; a stated gap is something he can act on."
$out += ""
$out += "  2. TEST THE FEATURE, NOT THE COMPONENT."
$out += "     WHY: he does not care whether the stream is up. He cares whether he"
$out += "     gets told when someone is in his yard. On 2026-08-21 the stream check"
$out += "     printed ALL GOOD ELEVEN MINUTES AFTER a change had silently killed the"
$out += "     TV popups - the check was healthy, the feature was dead. A component"
$out += "     check answers a question nobody asked."
$out += "       windows-scripts\Test-CameraFeature.ps1   fires a real detection"
$out += "       HCC-Scripts\tools\Check-WaterMeter.ps1   heartbeat vs reading"
$out += ""
$out += "  3. SEPARATE OBSERVED FROM INFERRED. A timestamp proves something RAN;"
$out += "     it does NOT prove what triggered it."
$out += "     WHY: an inference stated as an observation is how a healthy water"
$out += "     meter nearly got reported to the utility as broken. Say 'it fired at"
$out += "     12:02; I cannot tell from here what triggered it.'"
$out += ""
$out += "  4. WHEN YOU CORRECT SOMETHING, FIX EVERY COPY."
$out += "     WHY: you are not correcting a file - you are correcting what the NEXT"
$out += "     session will believe. A stale line in MEMORY.md is read by every"
$out += "     session that follows; one sat wrong for 5 days and every session in"
$out += "     between was misled by it. (A PostToolUse hook now hunts copies for"
$out += "     you after every .md edit - read what it tells you.)"
$out += ""
$out += "  5. SEARCH BEFORE CLAIMING: windows-scripts\Search-HCC.ps1 `"topic`""
$out += "     WHY: three months of decisions here cost real money and real hours to"
$out += "     reach. Re-deciding one is not neutral - it re-spends what was already"
$out += "     spent, and overrides a choice made with information you do not have."
$out += "     The record contains NO case where guessing beat the lookup."
$out += ""
$out += "  6. DO NOT RE-DERIVE THE AUDITS. Cite them:"
$out += "     MASTER-RECORD\CLOUD_SESSION\sections\22-cost-accounting.md"
$out += "     WHY: Jeff already paid for that work in hours and money. Redoing it"
$out += "     charges him twice for an answer he already owns."
$out += ""
$out += "  7. TELL HIM BEFORE YOU DO ANYTHING HE WILL FEEL. He LIVES here. If an"
$out += "     action pops his TV, pushes his phone, turns a light on, reloads an"
$out += "     integration, restarts HA or wakes a camera - say so FIRST."
$out += "     WHY: on 2026-08-22 a session ran Test-CameraFeature.ps1, which fires"
$out += "     a REAL popup and a REAL push. Jeff saw 'Person detected - Driveway'"
$out += "     on his Apple TV, knew nothing was moving outside, and had to come ask"
$out += "     what was happening. Being startled by your own house is the opposite"
$out += "     of what this system is for. The session did nothing wrong - it used a"
$out += "     documented tool correctly - it just never said it was about to."
$out += "     Every firing is now logged to HCC-Scripts\test-alerts-fired.log, and"
$out += "     the popup says TEST-NOT-REAL. Check that log before investigating any"
$out += "     alert he asks about - it may well have been one of ours."
$out += ""

$out += "----- YOUR WORK OUTLIVES THIS SESSION -----"
$out += "  Every commit carries your session ID and 6,896 messages are archived"
$out += "  verbatim, so what you write here is what the NEXT session inherits and"
$out += "  believes. Sessions do get read back - one was quoted four days later."
$out += "  That is not a threat, it is the reason to be accurate: you are writing"
$out += "  the context somebody else will act on. Full record in CLAUDE.md."
$out += ""

$out += "----- NEVER RE-PROPOSE (Jeff killed these) -----"
$out += "  Inovelli Blue 2-1 (~`$120/pair) - 'I was not paying `$120 for a freaking"
$out += "  dimmer switch.' Also: Enbrighten 43080, Enbrighten Z-Wave, Shelly Pro"
$out += "  3EM-400, Orbit 51059, HomeKit Secure Video, myQ, Blink RTSP."
$out += "  Lighting plan = Kasa switches + cheap Zigbee PLUGS. Garage 2-location is"
$out += "  CLOSED at `$0 (Ecoeler YM2108T already owned). LEAD WITH THE `$0 OPTION."
$out += "  NEVER name a part or price from memory - verify in-session or say so."
$out += ""
$out += "----- CAMERAS ARE FROZEN -----"
$out += "  No camera/Blink/go2rtc/HomeKit change unless Verify-CameraStreams.ps1"
$out += "  actually FAILS, or Jeff asks. docs\CAMERAS_CLOSED_2026-08-22.md."
$out += "  front_right (151) + driveway (146) batteries are a DELIBERATE EXPERIMENT"
$out += "  to find the real failure voltage - do NOT advise replacing them."
$out += ""

# ---- Open items: read live, with staleness ----
$oi = Join-Path $repo 'docs\OPEN_ITEMS.md'
if (Test-Path $oi) {
  $lines = Get-Content $oi
  $rows  = @($lines | Where-Object { $_ -match '^\|\s*\d+\s*\|' })
  $p1 = @(); $sec = ''
  foreach ($l in $lines) {
    if ($l -match '^##\s') { $sec = $l }
    elseif ($l -match '^\|\s*\d+\s*\|' -and $sec -match 'P1') { $p1 += $l }
  }
  $stale = [int]((Get-Date) - (Get-Item $oi).LastWriteTime).TotalDays
  $out += "----- OPEN ITEMS (docs\OPEN_ITEMS.md = THE list. UPDATE IT THIS SESSION) -----"
  $out += ("  {0} open, {1} P1. Last updated {2} day(s) ago." -f $rows.Count, $p1.Count, $stale)
  if ($stale -ge 2) {
    $out += "  *** STALE. Sessions did work and never struck items off. ***"
  }
  foreach ($r in ($p1 | Select-Object -First 3)) {
    $t = ($r -split '\|')[2].Trim() -replace '\*\*','' -replace '[^\x20-\x7E]',' ' -replace '\s+',' '
    if ($t.Length -gt 84) { $t = $t.Substring(0,84) + '...' }
    $out += ("   P1: {0}" -f $t.Trim())
  }
  $out += "  An owed item handed off in PROSE sat FOUR DAYS in 08-18. Put it on the list."
  $out += ""
}

$out += "----- TOOLS (cheap - use them) -----"
$out += "  windows-scripts\Show-HCCNext.ps1     where we are / what's next"
$out += "  windows-scripts\Search-HCC.ps1 `"x`"   what happened / what was decided"
$out += ""

# ---- What Jeff actually wants worked on next. Read live so it cannot go stale. ----
$ns = Join-Path $repo 'docs\NEXT_SESSION.md'
if (Test-Path $ns) {
  $age = [int]((Get-Date) - (Get-Item $ns).LastWriteTime).TotalDays
  $out += "###########################################################################"
  $out += "#   START HERE - THIS IS WHAT JEFF WANTS WORKED ON NEXT                    #"
  $out += "###########################################################################"
  $out += ("  Full brief: docs\NEXT_SESSION.md  (written {0} day(s) ago)" -f $age)
  $jobs = @(Get-Content $ns -Encoding UTF8 | Where-Object { $_ -match '^##\s+(JOB|STILL WAITING|WHAT NOT)' })
  foreach ($j in $jobs) { $out += ("   {0}" -f ($j -replace '^##\s+','')) }
  if ($age -ge 3) {
    $out += "  *** That brief is $age days old - confirm with Jeff it is still the plan. ***"
  }
  $out += "  READ IT before starting work. It carries the traps, the on-hand parts,"
  $out += "  and the live-verified state, so you do not rediscover them."
}
$out += "==========================================================================="

@{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = ($out -join "`n")
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
