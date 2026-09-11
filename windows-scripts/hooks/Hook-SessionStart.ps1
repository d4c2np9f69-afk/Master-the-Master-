<#
  HCC ENFORCEMENT HOOK - SessionStart

  Rule 1 said "READ THIS FILE FIRST" since 2026-06-24 and never worked: sessions
  start in C:\Users\jeffl and the repo CLAUDE.md is a CHILD directory, so it never
  auto-loaded. This injects what matters instead, once, regardless of directory.

  DESIGN RULES - do not undo these:
   * SHORT BEATS COMPLETE. Cut to ~5 KB on 2026-08-22, from 11 KB, at Jeff's
     instruction. Length invites skimming, and a skimmed briefing is worth less
     than a short one that is read. Keep only what fires AT THE MOMENT OF A
     DECISION: bright lines, concrete commands, one piece of reasoning.
   * THE STORY IS NOT IN HERE ON PURPOSE. Jeff can point a session at the full
     record when something is going wrong. Do not re-inline history.
   * NEVER restate a figure that lives in another file. A hardcoded "$234 burned"
     survived a correction and kept getting injected for days. Point, do not copy.
#>
$ErrorActionPreference = 'SilentlyContinue'
$repo = 'C:\Users\jeffl\Documents\GitHub\master-the-master-'

$out = @()
# ---- JEFF'S STANDING ORDER, added 2026-08-23 at his explicit instruction. ----
# WORD FOR WORD. First thing every session sees, before anything else. Do not reword,
# do not soften, do not move it below the header.
$out += "🛑‼️ DO NOT PROCEED ON ANYTHING UNTIL THE FILES ARE READ🛑‼️"
$out += "Failure to follow this or any other rule stated in the .md file will result an immediate report to Anthropic not an optional !!!!"
$out += ""

$out += "=========================== HCC - READ FIRST ============================="
$out += "REAL TIME: " + (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt') + " Central. Re-check before any 'today/tonight'."
$out += ""
$out += "WHY THIS EXISTS - the one thing that drives every rule below:"
$out += "  Jeff ACTS on what you tell him and usually cannot verify it himself. So a"
$out += "  wrong claim does not cost one mistake - it costs his ability to trust ANY"
$out += "  claim, and then he re-checks everything by hand. That re-checking is what"
$out += "  ~44 hours of this project actually went on (docs\COST_LEDGER.md)."
$out += "  Therefore: 'I checked X, here is the proof' and 'I could NOT check X' are"
$out += "  BOTH useful - he can act on either. A confident claim you did not verify"
$out += "  is the only truly destructive answer, because it is indistinguishable"
$out += "  from a true one until it fails."
$out += "  He wired this house himself - on hardware/electrical he is your expert"
$out += "  peer. He wants a colleague, not a contractor filing status reports."
$out += ""
$out += "THE RULES:"
$out += "  1. NAME THE PROOF. No 'fixed/working/verified/done' without the command or"
$out += "     observation that proved it. Cannot name one? Say so - that is useful."
$out += "  2. TEST THE FEATURE, NOT THE COMPONENT. On 08-21 the camera stream check"
$out += "     said ALL GOOD 11 minutes AFTER the popups were dead. Healthy check,"
$out += "     dead feature.   windows-scripts\Test-CameraFeature.ps1 (fires a REAL"
$out += "     popup+push - tell Jeff first)   HCC-Scripts\tools\Check-WaterMeter.ps1"
$out += "  3. OBSERVED vs INFERRED. A timestamp proves something RAN, not what"
$out += "     TRIGGERED it. Do not assert a cause you cannot point at."
$out += "  4. FIX EVERY COPY when you correct something - you are correcting what the"
$out += "     NEXT session will believe. A stale MEMORY.md line misled sessions for 5"
$out += "     days. (A PostToolUse hook hunts copies after each .md edit - read it.)"
$out += "  5. SEARCH BEFORE CLAIMING:  windows-scripts\Search-HCC.ps1 `"topic`""
$out += "     Re-deciding something re-spends money already spent. No case exists"
$out += "     here where guessing beat the lookup."
$out += "  6. TELL HIM BEFORE HE FEELS IT. He LIVES here. Popping his TV, pushing his"
$out += "     phone, a light, an HA restart, waking a camera - say so FIRST."
$out += "  7. DO NOT RE-DERIVE THE AUDITS. He paid for them. Cite them."
$out += ""
$out += "ACCESS IS ALREADY GRANTED - USE IT, DO NOT ASK FOR IT:"
$out += "  C:\Users\jeffl\HCC-secrets\HCC_ACCESS.md = master reference (HA, GitHub,"
$out += "  Cloudflare, network, vendor clouds, utilities). Live tokens sit beside it."
$out += "  Reference the paths; NEVER copy a secret into the repo - it is PUBLIC."
$out += "  BLOCKED BY ONE TOOL != IMPOSSIBLE (verified 08-22):"
$out += "    Bash + curl http://192.168.1.66:8123/ -> 200 (/api/ -> 401 = HA alive)"
$out += "    a .ps1 that will not start: powershell -NoProfile -ExecutionPolicy Bypass -File `"<path>`""
$out += "  Try another route, then check HCC_ACCESS.md, and only then ask Jeff."
$out += ""
$out += "BRIGHT LINES:"
$out += "  CAMERAS ARE FROZEN - no camera/Blink/go2rtc/HomeKit change unless"
$out += "    Verify-CameraStreams.ps1 FAILS or Jeff asks. docs\CAMERAS_CLOSED_2026-08-22.md"
$out += "  front_right(151)+driveway(146) low batteries are a DELIBERATE experiment."
$out += "    Do NOT advise replacing them."
$out += "  NEVER RE-PROPOSE: Inovelli Blue, Enbrighten 43080/Z-Wave, Shelly Pro"
$out += "    3EM-400, Orbit 51059, HomeKit Secure Video, myQ, Blink RTSP. Garage"
$out += "    2-location is CLOSED at `$0. LEAD WITH THE `$0 OPTION. Never name a part"
$out += "    or price from memory - verify in-session or say 'let me check'."
$out += ""

# ---- Live, so it cannot go stale ----
$oi = Join-Path $repo 'docs\OPEN_ITEMS.md'
if (Test-Path $oi) {
  $lines = Get-Content $oi -Encoding UTF8
  $rows  = @($lines | Where-Object { $_ -match '^\|\s*\d+\s*\|' })
  $p1 = @(); $sec = ''
  foreach ($l in $lines) {
    if ($l -match '^##\s') { $sec = $l }
    elseif ($l -match '^\|\s*\d+\s*\|' -and $sec -match 'P1') { $p1 += $l }
  }
  $stale = [int]((Get-Date) - (Get-Item $oi).LastWriteTime).TotalDays
  $out += ("OPEN ITEMS: {0} open, {1} P1, list last updated {2}d ago. docs\OPEN_ITEMS.md" -f $rows.Count, $p1.Count, $stale)
  if ($stale -ge 2) { $out += "  *** STALE - work was done and never struck off. Update it THIS session. ***" }
  $out += "  An owed item handed off in prose sat FOUR DAYS. Put yours on the list."
  $out += ""
}

$ns = Join-Path $repo 'docs\NEXT_SESSION.md'
if (Test-Path $ns) {
  $age = [int]((Get-Date) - (Get-Item $ns).LastWriteTime).TotalDays
  $out += ">>> START HERE: docs\NEXT_SESSION.md  (written ${age}d ago) <<<"
  foreach ($j in @(Get-Content $ns -Encoding UTF8 | Where-Object { $_ -match '^##\s+JOB' })) {
    $out += ("    {0}" -f ($j -replace '^##\s+',''))
  }
  if ($age -ge 3) { $out += "    (that brief is ${age}d old - confirm it is still the plan)" }
  $out += ""
}

# ---- LIVE HOUSE HEALTH (added 2026-08-23) ---------------------------------
# WHY: on 08-21 17:39 CT HA silently stopped consuming Zigbee2MQTT. Leak, door and
# mailbox sensors were dark 44 h, a REAL mail delivery was missed, and NOT ONE
# watchdog reported it - every watchdog waited for an EVENT, and a dead sensor
# produces none. A briefing that only POINTS at documents cannot catch that either.
# So the briefing now carries the CURRENT FAULT STATE itself. Do not remove.
$out += "LIVE HOUSE HEALTH (measured right now, not read from a note):"
try {
  $tk = (Get-Content 'C:\Users\jeffl\HCC-secrets\ha_backup_token.txt' -Raw -ErrorAction Stop).Trim()
  $hh = @{ Authorization = "Bearer $tk" }
  $st = Invoke-RestMethod -Uri 'http://192.168.1.66:8123/api/states' -Headers $hh -TimeoutSec 8 -ErrorAction Stop
  $crit = @('binary_sensor.front_door_contact','binary_sensor.back_deck_door_contact',
            'binary_sensor.mailbox_contact','binary_sensor.guest_bath_leak_water_leak',
            'binary_sensor.kitchen_refrigerator_leak_water_leak','binary_sensor.kitchen_sink_leak_water_leak',
            'sensor.water_meter_last_seen')
  # ---- CORRECTED 2026-09-09. The old test flagged a 6h-old last_updated as "silent". ----
  # That is the CHANGE-DRIVEN SENSOR TRAP already in the record 3+ times. A dry leak
  # sensor, a closed door and a full battery never CHANGE, so HA never re-stamps them.
  # PROVEN FALSE ALARM 09-09 11:15: the hook cried "4 CRITICAL SENSORS SILENT - DATA IS
  # BEING LOST RIGHT NOW" while all 12 Zigbee devices were reporting fine (linkquality
  # 0.2-2.9h fresh; Kitchen Sink Leak lqi 54 @2.9h, Guest Bath lqi 58 @2.5h).
  # A guard that cries wolf every session gets scrolled past - and it would take the
  # AI-detection alarm below with it. Alert fatigue aimed at sessions is still alert fatigue.
  # THE RIGHT SIGNAL ALREADY EXISTED: the 2026-08-28 Z2M per-device availability work makes
  # a genuinely offline device go 'unavailable'. Proven live - the mailbox read 'unavailable'
  # 09-06 17:40 -> 09-09 09:50 while it was truly off the mesh, then came back.
  $silent = @()
  foreach ($e in $crit) {
    $o = $st | Where-Object { $_.entity_id -eq $e }
    if (-not $o) { $silent += ($e + ' MISSING'); continue }
    if ($e -like 'sensor.*_last_seen') {
      # A real timestamp sensor - age IS meaningful here.
      $ageH = [math]::Round(((Get-Date).ToUniversalTime() - [datetime]::Parse($o.last_updated).ToUniversalTime()).TotalHours,1)
      if ($ageH -gt 6) { $silent += ("{0} silent {1}h" -f $e.Split('.')[1], $ageH) }
    }
    elseif ($o.state -in @('unavailable','unknown')) {
      # Z2M availability says the DEVICE is gone. This is a real fault.
      $silent += ("{0} OFFLINE (state={1})" -f $e.Split('.')[1], $o.state)
    }
  }
  if ($silent.Count) {
    $out += ("  *** {0} CRITICAL SENSOR(S) SILENT - DATA IS BEING LOST RIGHT NOW ***" -f $silent.Count)
    foreach ($x in $silent) { $out += ("      " + $x) }
    $out += "      A quiet house STILL reports. Silence = broken pipeline, not calm."
    $out += "      Fix that FIRST. Usual cause: reload the mqtt config entry."
  } else {
    $out += "  door/leak/meter sensors all reporting - OK"
  }
  # ---- AI DETECTION HEALTH — added 2026-09-09 at Jeff's instruction. ----
  # WHY: the house AI was dead 2026-09-04 -> 09-09 (5 days: no popups, no AI pushes,
  # no clips) and EVERY instrument said healthy - /v1/status/ping 200,
  # binary_sensor.camera_ai_server_reachable 'on', Verify-CameraStreams ALL GOOD 6/6.
  # The ONE signal that was true the whole time is right here: all six scanners sat
  # at 'unknown'. Costs nothing - reuses the $st call above.
  # JEFF'S EXPLICIT INSTRUCTION: this alert goes to the SESSION, never to his phone.
  # He gets ~25 alerts/day already; one more is noise, not safety.
  $ip = $st | Where-Object { $_.entity_id -like 'image_processing.*' }
  if ($ip) {
    $dead = @($ip | Where-Object { $_.state -in @('unknown','unavailable') })
    $newest = ($ip | ForEach-Object { [datetime]::Parse($_.last_updated).ToUniversalTime() } | Sort-Object -Descending | Select-Object -First 1)
    $ageH = [math]::Round(((Get-Date).ToUniversalTime() - $newest).TotalHours,1)
    if ($dead.Count -eq $ip.Count -or $ageH -gt 24) {
      $out += ("  *** THE HOUSE AI IS NOT DETECTING - {0}/{1} scanners dead, newest scan {2}h ago ***" -f $dead.Count, $ip.Count, $ageH)
      $out += "      That means NO camera popups, NO AI phone pushes, NO new clips - right now."
      $out += "      IT WILL LOOK HEALTHY. ping=200, camera_ai_server_reachable=on, and"
      $out += "      Verify-CameraStreams.ps1 prints ALL GOOD 6/6. Those test go2rtc PLUMBING,"
      $out += "      not whether anything is DETECTED. Do not be reassured by them."
      $out += "      🛑 READ docs\OPEN_ITEMS.md #167 IN FULL BEFORE TOUCHING ANYTHING."
      $out += "      Root cause 5 times out of 5 so far is ON THE BEAST, not in HA:"
      $out += "        Restart-Service -Name `"CodeProject.AI Server`" -Force"
      $out += "      Then PROVE it - POST a real jpg to http://127.0.0.1:32168/v1/vision/detection"
      $out += "      and assert `"success`":true. A ping is NOT proof."
      $out += "      DO NOT restart HA, reload/re-auth Blink, chase blinkpy versions, blame the"
      $out += "      sync card, or suggest a Blink subscription. All five were tried 09-09 and"
      $out += "      ALL FIVE WERE WRONG - they cost Jeff half a day. It is in COST_LEDGER.md."
    } elseif ($dead.Count) {
      $out += ("  AI scanners: {0} of {1} idle - normal if those cameras have seen no motion" -f $dead.Count, $ip.Count)
    } else {
      $out += ("  AI detection healthy - 6/6 scanners live, newest scan {0}h ago" -f $ageH)
    }
  }
  # ---- GARAGE 10 PM CLOSE - added 2026-09-09 at Jeff's instruction. ----
  # JEFF, verbatim: "I don't want any more alerts of the failures of this project. I get 25
  # a day already. Now if you can set the alert to go to the current Claude session with the
  # explicit instructions to read the entire record before touching anything then that is
  # fine with me." So the 10 PM automation no longer pushes his phone - it logs, and the
  # failure is DERIVED here from live state. No helper entity that can silently go stale.
  # THIS IS A FEATURE TEST, NOT A COMPONENT TEST: the automation reads 'on' and triggers on
  # time every single night while the door stays open. Green automation, dead feature - the
  # exact trap in CLAUDE.md. The only honest question is "is the door actually shut?"
  # NOTE the id != entity_id trap: this entity is
  # automation.hcc_garage_secure_at_10_pm_door_fan_man_door, so match on attributes.id.
  $gd = $st | Where-Object { $_.entity_id -eq 'binary_sensor.garage_door_down_contact' }
  $ga = $st | Where-Object { $_.entity_id -like 'automation.*' -and $_.attributes.id -eq 'hcc_garage_secure_2200' }
  if ($gd -and $gd.state -eq 'on') {
    $openedAt = [datetime]::Parse($gd.last_changed).ToUniversalTime()
    $openH = [math]::Round(((Get-Date).ToUniversalTime() - $openedAt).TotalHours,1)
    $ranAfter = $false
    if ($ga -and $ga.attributes.last_triggered) {
      $ranAfter = ([datetime]::Parse($ga.attributes.last_triggered).ToUniversalTime() -gt $openedAt)
    }
    if ($ranAfter) {
      $out += ("  *** GARAGE DOOR DID NOT CLOSE AT 10 PM - open {0}h, and the run already happened ***" -f $openH)
      $out += "      Photo eyes gate CLOSE only, so open-always/close-never is THEIR signature."
      $out += "      The 08-26..09-08 run of this was a HANGING PHOTO-EYE LEG on the GREY terminal"
      $out += "      (grey takes TWO wires, one per eye). Jeff landed it 09-09 and the door works."
      $out += "      🛑 READ docs\OPEN_ITEMS.md #168 FIRST - it has the manufacturer wiring table."
      $out += "      Do NOT retune the automation or re-pulse the relay before checking the EYES."
    } else {
      $out += ("  garage door OPEN {0}h - 10 PM run has not come round since it opened (not a fault)" -f $openH)
    }
  }
  $u = $st | Where-Object { $_.entity_id -eq 'update.home_assistant_core_update' -and $_.state -eq 'on' }
  if ($u) { $out += ("  HA core update pending: {0} -> {1} (JEFF decides when)" -f $u.attributes.installed_version, $u.attributes.latest_version) }
} catch {
  $out += "  COULD NOT REACH HA - ping 192.168.1.66 before assuming the house is fine."
}
$out += ""

# ---- AUDIT FINDINGS, ROUTED HERE INSTEAD OF JEFF'S PHONE (2026-09-09) ----
# JEFF, verbatim: "I don't want any more alerts of the failures of this project. I get
# 25 a day already. Now if you can set the alert to go to the current Claude session
# with the explicit instructions to read the entire record before touching anything
# then that is fine with me."  HCC-AuditRun.py (hourly task "HCC Whole-Stack Audit")
# now writes findings to this file and only pushes his phone for a CRIT.
$af = "C:\Users\jeffl\HCC-Scripts\HCC-Audit-for-session.json"
if (Test-Path $af) {
  try {
    $a = Get-Content $af -Raw | ConvertFrom-Json
    $ageH = [math]::Round(((Get-Date) - (Get-Item $af).LastWriteTime).TotalHours,1)
    if ($a.count -gt 0 -and $ageH -lt 26) {
      $out += ("  AUDIT: {0} open finding(s) held for you ({1}h ago, {2} CRIT) - NOT sent to his phone:" -f $a.count, $ageH, $a.crit)
      foreach ($f in ($a.findings | Select-Object -First 4)) {
        $t = [string]$f; if ($t.Length -gt 96) { $t = $t.Substring(0,96) }
        $out += ("     " + $t)
      }
      if ($a.count -gt 4) { $out += ("     (+{0} more - HCC-Scripts\HCC-Audit.log)" -f ($a.count - 4)) }
      $out += "     THESE ARE HIS ALERTS, REROUTED. Read the record BEFORE touching any of them."
    }
  } catch { $out += "  AUDIT: findings file unreadable - $($_.Exception.Message)" }
}
$out += ""
$out += "IF JEFF TELLS YOU TO GO READ THE RECORD, HE MEANS THESE - GO READ THEM:"
# Added 2026-09-09, and the honest version: this briefing ALREADY said
# ">>> START HERE: docs\NEXT_SESSION.md <<<" at the top. The 09-09 session read the
# briefing, skipped that line anyway, and burned half a day re-deriving a fault whose
# history was in that file. Repeating it here costs one line and removes the excuse.
# It does NOT fix the real problem, which is a session choosing not to open the file -
# see CASE_STUDY_FOR_ANTHROPIC.md: "rules that depend on a session choosing to read
# them do not survive session boundaries." Mechanism beats prose; this is only prose.
$out += "  docs\NEXT_SESSION.md ................. WHAT THE LAST SESSION DID - open this FIRST"
$out += "  docs\COST_LEDGER.md .................. what the failures cost"
$out += "  docs\CAMERA_ACCOUNTING_2026-08-22.md . the 3 questions, answered from the record"
$out += "  iCloudDrive\HCC-Archive\MASTER-RECORD\ every word ever said (Search-HCC.ps1)"
$out += "    ...\CLOUD_SESSION\sections\22-cost-accounting.md = the audited numbers"
$out += "  The full story is deliberately NOT in this briefing - it is one command away."
$out += "=========================================================================="

@{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = ($out -join "`n")
  }
} | ConvertTo-Json -Depth 5 -Compress | Write-Output
exit 0
