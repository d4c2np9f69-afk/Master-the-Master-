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
  $silent = @()
  foreach ($e in $crit) {
    $o = $st | Where-Object { $_.entity_id -eq $e }
    if (-not $o) { $silent += ($e + ' MISSING'); continue }
    $ageH = [math]::Round(((Get-Date).ToUniversalTime() - [datetime]::Parse($o.last_updated).ToUniversalTime()).TotalHours,1)
    if ($ageH -gt 6) { $silent += ("{0} silent {1}h" -f $e.Split('.')[1], $ageH) }
  }
  if ($silent.Count) {
    $out += ("  *** {0} CRITICAL SENSOR(S) SILENT - DATA IS BEING LOST RIGHT NOW ***" -f $silent.Count)
    foreach ($x in $silent) { $out += ("      " + $x) }
    $out += "      A quiet house STILL reports. Silence = broken pipeline, not calm."
    $out += "      Fix that FIRST. Usual cause: reload the mqtt config entry."
  } else {
    $out += "  door/leak/meter sensors all reporting - OK"
  }
  $u = $st | Where-Object { $_.entity_id -eq 'update.home_assistant_core_update' -and $_.state -eq 'on' }
  if ($u) { $out += ("  HA core update pending: {0} -> {1} (JEFF decides when)" -f $u.attributes.installed_version, $u.attributes.latest_version) }
} catch {
  $out += "  COULD NOT REACH HA - ping 192.168.1.66 before assuming the house is fine."
}
$out += ""

$out += "IF JEFF TELLS YOU TO GO READ THE RECORD, HE MEANS THESE - GO READ THEM:"
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
