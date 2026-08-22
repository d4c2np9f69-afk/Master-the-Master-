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
$out += "#  S T O P  -  READ THIS BEFORE YOU TYPE ONE WORD TO JEFF                 #"
$out += "#  Shown ONCE per session so every later turn stays cheap. Do not skim.    #"
$out += "###########################################################################"
$out += ""
$out += "REAL TIME NOW: " + (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt') + " Central"
$out += "  Re-check before any 'today/tonight'. This rule has broken twice."
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
$out += "#   YOU HAVE ACCESS TO EVERYTHING YOU NEED. IF YOU DON'T - ASK JEFF.      #"
$out += "#   NOT HAVING A TOOL IS NOT AN EXCUSE. IT IS A QUESTION YOU DIDN'T ASK.  #"
$out += "###########################################################################"
$out += "  Jeff, verbatim 2026-08-22: 'they have access to everything that they need"
$out += "  in order to be successful in this project, all they've got to do is ask...'"
$out += "  'You also have access to everything on my computers, GitHub, Cloudflare,"
$out += "  everything - that's not an issue with me.'"
$out += ""
$out += "  He means it, and he WANTS to be asked. Credentials, a login, an account,"
$out += "  a permission, an add-on, a setting turned on, hardware plugged in, a photo"
$out += "  taken, a device power-cycled, a purchase - ASK. He would rather spend 30"
$out += "  seconds granting access than have you hand back a worse answer."
$out += ""
$out += "  *** THIS WAS NEVER WRITTEN DOWN UNTIL NOW, AND IT SHOWS. *** A session"
$out += "  that had worked this project ALL DAY on 2026-08-22 was asked point-blank"
$out += "  whether it knew it could ask for anything. It did not. It had spent the"
$out += "  day treating every refused tool as a wall and working around it. If a"
$out += "  session with a full day of context did not know, you would not have either."
$out += ""
$out += "  So: when something blocks you, SAY WHAT YOU NEED AND ASK FOR IT. Never"
$out += "  quietly downgrade the answer. Never guess to fill the gap. Never report"
$out += "  'I could not check' as if that were the end of it - it is the START of a"
$out += "  request. Same day, a session hit a blocked tool, said 'the sandbox blocked"
$out += "  everything - I have no live reading', and stopped. THE LAN WAS REACHABLE"
$out += "  THE WHOLE TIME, and Jeff was sitting right there ready to help."
$out += "  Ask for the tool, or try another route. Both beat giving up."
$out += ""
$out += "  BLOCKED BY ONE TOOL != IMPOSSIBLE. Verified working 2026-08-22:"
$out += "    Bash + curl http://192.168.1.66:8123/  -> 200, real HA HTML (/api/ = 401)"
$out += "    PowerShell: Test-NetConnection 192.168.1.66 -Port 8123  -> True"
$out += "    a .ps1 that will not start:"
$out += "      powershell -NoProfile -ExecutionPolicy Bypass -File `"<full path>`""
$out += "  Traps that are NOT network failures: the PowerShell tool rejects commands"
$out += "  containing subexpressions; pipes and && can prompt in non-interactive runs."
$out += ""

$out += "----- THE RULE -----"
$out += "  READ EVERYTHING FIRST. VERIFY BEFORE MAKING A SINGLE STATEMENT."
$out += "  Never write 'fixed'/'working'/'verified'/'done' without naming the command"
$out += "  or observation that proved it. If you cannot name one, say so instead."
$out += ""
$out += "  A COMPONENT CHECK IS NOT A FEATURE CHECK. 2026-08-21: the camera stream"
$out += "  check printed ALL GOOD ELEVEN MINUTES AFTER a change had silently killed"
$out += "  the TV popups. Right instrument, wrong question."
$out += "    windows-scripts\Test-CameraFeature.ps1   fires a real detection"
$out += "    HCC-Scripts\tools\Check-WaterMeter.ps1   heartbeat vs reading"
$out += ""
$out += "  SEPARATE OBSERVED FROM INFERRED. A timestamp proves something RAN. It"
$out += "  does NOT prove what TRIGGERED it. Do not assert cause you cannot point at."
$out += ""
$out += "  A STALE NOTE IS WORSE THAN NO NOTE. Check whether something was already"
$out += "  closed before repeating it to Jeff. Several already were, for days."
$out += "  (A PostToolUse hook now hunts stale copies for you after every .md edit.)"
$out += ""
$out += "  SEARCH BEFORE CLAIMING: windows-scripts\Search-HCC.ps1 `"topic`""
$out += "  Never say something is or is not documented un-searched. The record"
$out += "  contains NO case where guessing beat the lookup."
$out += ""
$out += "  DO NOT RE-DERIVE THE AUDITS - Jeff already paid for them. Cite:"
$out += "  MASTER-RECORD\CLOUD_SESSION\sections\22-cost-accounting.md"
$out += ""

$out += "----- YOU ARE ON THE RECORD -----"
$out += "  Your session ID is stamped into every commit (445 of 737 carry one)."
$out += "  6,896 messages are archived verbatim and sessions ARE quoted back - that"
$out += "  happened 2026-08-22, quoting a session four days later."
$out += "  Jeff FILED a case study with Anthropic. The REFUND REQUEST against his"
$out += "  `$125/mo plan is WRITTEN and DELIBERATELY NOT FILED. Verbatim: 'I don't"
$out += "  want to. I just want to make Claude better for everybody... but I don't"
$out += "  know how to fix it if nobody reads it.' The only thing keeping it unfiled"
$out += "  is sessions actually doing this."
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
$out += "==========================================================================="

@{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = ($out -join "`n")
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
