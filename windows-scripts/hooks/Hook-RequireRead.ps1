<#
  HCC READ GATE - PreToolUse on Bash|PowerShell|Edit|Write|NotebookEdit

  HARD BLOCK: a session may not CHANGE a subsystem until it has READ that
  subsystem's files IN THIS SESSION. Not "should". Cannot.

  WHY (2026-09-09). Hook-GuardProtected matched only Edit|Write. That night a
  session spent six hours on the camera stack and changed two automations,
  restarted HA twice, renamed a custom component and edited its manifest - ALL
  through Bash/PowerShell and the browser. The guard never fired once. It had
  been guarding the one door nobody used.

  Jeff, that night: "put hard rules that can't be broken ... I've tried
  everything to just get the sessions to read the files before they act."
  An earlier session had told him to make it optional and be nice. That advice
  was wrong and it cost him.

  His case study to Anthropic: "Rules that depend on a session choosing to read
  them do not survive session boundaries."  The read was never the hard part.

  DESIGN RULES, do not weaken these:
    * READS ARE NEVER BLOCKED. Only mutations.
    * WRITING DOCS IS NEVER BLOCKED - documenting a finding is not changing the
      house, and a gate that stops you writing the record defeats the record.
    * Required lists stay SHORT. A gate nobody can satisfy gets deleted.
    * HCC-OVERRIDE in the command stands it down. Jeff's house, Jeff's call.
    * FAIL OPEN on any internal error. This must never lock Jeff out.
#>
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { exit 0 }

$cmdText  = "$($j.tool_input.command)"
$filePath = "$($j.tool_input.file_path)"
$blob = @($cmdText, $filePath, "$($j.tool_input.content)", "$($j.tool_input.new_string)") -join ' '
if (-not $blob.Trim()) { exit 0 }

# ---- Jeff's escape hatch ----
if ($blob -match '(?i)HCC-OVERRIDE') { exit 0 }

# ---- The freeze must not block the RECORD of the freeze ----
# 2026-09-16 01:06, five minutes after the freeze went in: writing a line in OPEN_ITEMS.md that
# merely NAMED a frozen subsystem was refused. Documenting a freeze is not working on the frozen
# thing, and a gate that stops you writing the record defeats the record - the same reasoning the
# docs/scratchpad exemptions below already carry. Exempt them here too, before the check.
if ($filePath -match '(?i)session-freeze\.txt$') { exit 0 }
if ($filePath -match '(?i)[\\/]scratchpad[\\/]') { exit 0 }
if ($filePath -match '(?i)[\\/]docs[\\/].*\.(md|txt|json)$') { exit 0 }
if ($filePath -match '(?i)(OPEN_ITEMS|COST_LEDGER|NEXT_SESSION|CHANGELOG_ARCHIVE)\.md$') { exit 0 }

# ---------------------------------------------------------------------------
# SESSION TOPIC FREEZE - added 2026-09-16 01:00, after I did the thing it stops.
#
# Jeff, 00:40: "Do not start with the cameras you will get no where with them it's
# too big a job for you, move to the next thing."  Jeff, 01:00: "We said no cameras
# tonight." Between those two messages I read the Blink component off the Beehive to
# answer a question filed under #181 "updates". Nothing was changed - but he had to
# spend attention stopping me, and that is the expensive part.
#
# WHY THE REST OF THIS FILE COULD NOT CATCH IT: the gate below deliberately never
# blocks reads ("READS ARE NEVER BLOCKED" is its own first design rule, and that rule
# is right). A read-only excursion into a frozen subsystem is invisible to it. So this
# is a SEPARATE check aimed at a different thing, not a tightening of that one.
#
# A freeze is on the SUBSYSTEM, not the item number. #181 does not look like a camera
# item from its title; it became one the moment the work reached for custom_components
# /blink. Ask what the task TOUCHES, not what list it is filed under.
#
# HOW TO USE IT: put one topic per line in .claude\session-freeze.txt, optionally with
# a reason after a pipe. Blank lines and # comments ignored. Delete the file - or the
# line - to lift it. HCC-OVERRIDE above still wins, because it is Jeff's house.
# ---------------------------------------------------------------------------
$freezeFile = Join-Path $env:USERPROFILE '.claude\session-freeze.txt'
if (Test-Path $freezeFile) {
  foreach ($line in (Get-Content -LiteralPath $freezeFile)) {
    $t = $line.Trim()
    if (-not $t -or $t.StartsWith('#')) { continue }
    $parts  = $t -split '\|', 2
    $topic  = $parts[0].Trim()
    $reason = if ($parts.Count -gt 1) { $parts[1].Trim() } else { 'Jeff froze this topic for this session.' }
    if (-not $topic) { continue }
    if ($blob -match ("(?i)" + $topic)) {
      $msg = @"
BLOCKED - THIS SUBSYSTEM IS FROZEN FOR THIS SESSION.

Jeff closed this topic. The pattern that matched: $topic

    $reason

This blocks READS as well as writes, which the rest of this gate deliberately does
not. It exists because on 2026-09-16 a session was told "no cameras tonight" and was
reading the Blink component 20 minutes later - because the work was filed under an
item about UPDATES, not cameras.

A freeze is on the SUBSYSTEM, not the item number. Ask what the task TOUCHES.

Work on something else. To lift it, Jeff removes the line from
.claude\session-freeze.txt - or put HCC-OVERRIDE in the command if he says so.
"@
      @{
        hookSpecificOutput = @{
          hookEventName            = 'PreToolUse'
          permissionDecision       = 'deny'
          permissionDecisionReason = $msg
        }
        systemMessage = "FROZEN TOPIC - '$topic' is closed for this session"
      } | ConvertTo-Json -Depth 5 -Compress | Write-Output
      exit 0
    }
  }
}

# ---- Writing documentation is always allowed ----
# Scratchpad is isolated and temporary - writing there NEVER changes the house.
# 2026-09-09: the gate blocked a scratchpad .py whose TEXT mentioned index.html.
# Right call on substance, wrong target. Exempt the whole directory.
# The freeze list itself must never be gated. It NAMES the subsystems it closes, so the topic
# gates below match its own text - declaring a freeze was refused by the very gate for the topic
# being frozen. Caught 2026-09-16 01:02 writing the first one. Declaring a freeze changes nothing
# in the house; it only takes work away from the session.
if ($filePath -match '(?i)session-freeze\.txt$') { exit 0 }
if ($filePath -match '(?i)[\\/]scratchpad[\\/]') { exit 0 }
if ($filePath -match '(?i)[\\/]docs[\\/].*\.(md|txt|json)$') { exit 0 }
if ($filePath -match '(?i)(OPEN_ITEMS|COST_LEDGER|NEXT_SESSION|CHANGELOG_ARCHIVE)\.md$') { exit 0 }

# ---- Does this call actually MUTATE anything? ----
$MUTATES = @(
  '/api/services/', 'api/config/automation', 'config_entries', 'config/config_entries',
  'turn_on', 'turn_off', 'homeassistant/restart', 'reload_config_entry', 'set_value',
  'trigger_camera', 'save_video', 'save_recent_clips', 'logger/set_level',
  'Remove-Item', 'Set-Content', 'Add-Content', 'Out-File', 'New-Item',
  '\bmv\b', '\brm\b', '\bcp\b', '\bdd\b', '>\s*/', 'git\s+(commit|push|checkout|reset)',
  'Restart-Service', 'Stop-Service', 'Start-Service',
  'Start-ScheduledTask', 'Disable-ScheduledTask', 'Enable-ScheduledTask', 'Register-ScheduledTask'
)
$isMutation = $false
foreach ($m in $MUTATES) { if ($blob -match $m) { $isMutation = $true; break } }
if ("$($j.tool_name)" -match '^(Edit|Write|NotebookEdit)$') { $isMutation = $true }
if (-not $isMutation) { exit 0 }

$sid = "$($j.session_id)"; if (-not $sid) { $sid = 'nosession' }
$sid = ($sid -replace '[^A-Za-z0-9\-_]', '')
$receipt = Join-Path $env:TEMP ("hcc-read-" + $sid + ".txt")
$readSoFar = ''
if (Test-Path $receipt) { $readSoFar = (Get-Content -LiteralPath $receipt -Raw) }

function Deny($name, $missing, $why) {
  $list = ($missing | ForEach-Object { "        " + $_ }) -join "`n"
  $reason = @"
BLOCKED - YOU HAVE NOT READ THE $name FILES IN THIS SESSION.

This is a mechanical gate, not a suggestion. It fired because you tried to
CHANGE something before reading what is already known about it.

READ THESE FIRST (use the Read tool - grep does NOT count):
$list

WHY THIS GATE EXISTS:
    $why

Jeff, 2026-09-09: "I've tried everything to just get the sessions to read the
files before they act." Every soft version of this rule has been violated.
His case study to Anthropic: "Rules that depend on a session choosing to read
them do not survive session boundaries."

An empty grep is NOT evidence of absence - search for what the plan IS.
If Jeff explicitly tells you to skip this, put HCC-OVERRIDE in the command.
"@
  @{
    hookSpecificOutput = @{
      hookEventName            = 'PreToolUse'
      permissionDecision       = 'deny'
      permissionDecisionReason = $reason
    }
    systemMessage = "HCC READ GATE BLOCKED THIS - $name files unread this session"
  } | ConvertTo-Json -Depth 5 -Compress | Write-Output
  exit 0
}

$GATES = @(
  @{ Name = 'CAMERAS / BLINK'
     Match = 'blink|camera|go2rtc|homekit|image_processing|pipup|clipframe|ai_snapshot|doorbell'
     Requires = @('CAMERAS_CLOSED_2026-08-22.md', 'camera_fixes_2026-08-21.md')
     # 2026-09-11: this gate alone demands a RECENT read, not a once-per-session one.
     # Earned the same night: camera_fixes was read at ~22:00, then at ~23:00 four go2rtc
     # attempts were fired at the exact dead end it documents ("the ffmpeg: shorthand
     # returned 'streams: unknown error'... the exec: form works"). The file was on the
     # receipt and out of mind. An hour is long enough not to nag and short enough that
     # the gotchas are still in front of you.
     FreshMin = 60
     Why = 'Cameras are FROZEN. 2026-09-09 cost six hours because these went unread: the 307 ''System is busy'' over-polling lockout signature, and the DO-NOT-UNDO HomeKit repoint to the *_live entities.' }
  @{ Name = 'GARAGE DOOR'
     Match = 'garage|door_opener|cover\.garage|mini-?d'
     Requires = @('OPEN_ITEMS.md')
     Why = '#168 has the Chamberlain 41AC050-2M terminal map. On 2026-09-09 a session told Jeff to REMOVE the wire that was fixing his photo eyes. GREY takes TWO conductors, one per eye.' }
  @{ Name = 'HA CORE / ADD-ON UPDATE'
     Match = 'home_assistant_core_update|core[_ ]update|ha core update|supervisor/.*update|addon.*update'
     Requires = @('OPEN_ITEMS.md')
     Why = '2026-09-04: a core update went in without reading the release notes, broke blink + alexa_media on Python 3.14, and had to be rolled back. A backup is a rollback plan, NOT research.' }
  @{ Name = 'IRRIGATION / B-HYVE'
     Match = 'irrigation|bhyve|b-hyve|sprinkler|zone_?[1-6]|orbit'
     Requires = @('OPEN_ITEMS.md')
     Why = '#109 is an explicit HOLD from Jeff on the irrigation/sewer-overcharge code. #135: active_station reads None WHILE A ZONE IS RUNNING - do not use it to decide if watering is on. Zone 4 bonnet was freeze-cracked.' }
  @{ Name = 'ZIGBEE / Z2M / SENSORS'
     Match = 'zigbee|z2m|zigbee2mqtt|permit_join|mqtt|contact_sensor|leak_sensor'
     Requires = @('zigbee_mesh_routers_2026-08-27.md', 'OPEN_ITEMS.md')
     Why = 'Availability is the ONLY real liveness signal - last_updated/last_reported are the change-driven-sensor trap that has produced FOUR false alarms (08-24, 08-26, 08-28, 09-09). An automation in a non-default state is EVIDENCE, not a fault.' }
  @{ Name = 'MOWER / ESP32 FIRMWARE'
     Match = 'mower|toro|esp32|hours_seconds|firmware|\.ino\b'
     Requires = @('gps_firmware_coworker_findings_2026-08-11.md', 'OPEN_ITEMS.md')
     Why = 'The hour meter was dead 50 days across 5 real mows because a session coded against a PROSE DESCRIPTION of the firmware instead of the firmware. Jeff bought replacement sensors that were fine. Field contract: the box sends ''hours'', not ''hours_seconds''.' }
  @{ Name = 'UTILITIES / METERS'
     Match = 'water_meter|gas_meter|rtlamr|smarthub|kwh|utility|electric_disagg|sewer'
     Requires = @('UTILITIES_REFERENCE.md', 'OPEN_ITEMS.md')
     Why = 'The rate formulas, meter serials and endpoint IDs are already validated in there. The 08-01 ''stuck meter'' theory was RETRACTED the same day - the meter was healthy. Do not re-derive the audited numbers.' }
  @{ Name = 'ALEXA / TV / MEDIA'
     Match = 'alexa|fire_?tv|apple_?tv|media_player|sling|pipup|announce'
     Requires = @('BEEHIVE_REFERENCE.md', 'OPEN_ITEMS.md')
     Why = '''Fast forward'' is an Alexa-RESERVED phrase that never reaches a custom Routine - the fix is native ''turn on <script name>'' phrasing. BRAVES HERE was removed twice and must not return.' }
  @{ Name = 'LIGHTING / KASA'
     Match = 'kasa|hs220|hs200|dimmer|light\.|lighting|inovelli|ecoeler'
     Requires = @('kasa_smart_lighting_project_2026-08-06.md', 'OPEN_ITEMS.md')
     Why = 'Inovelli is SCRAPPED ON PRICE and must never be re-proposed. Kasa is the plan; mesh comes from cheap Zigbee plugs, not premium switches. Garage is the Ecoeler YM2108T Jeff already owns.' }
  @{ Name = 'VPN / NETWORK / WARP'
     Match = 'warp|windscribe|vpn|proton|bgw320|gateway|firewall'
     Requires = @('OPEN_ITEMS.md')
     Why = 'ALWAYS run ''warp-cli settings'' - never quote the mode from memory. ''Beehive offline'' has meant the PC''s VPN, not HA: ping the router .254 FIRST. WARP+Windscribe together = dead DNS.' }
  @{ Name = 'APP / DEPLOY / CLOUDFLARE'
     Match = 'index\.html|cloudflare|pages\.dev|service-worker|functions/api|wrangler'
     Requires = @('SESSION_START.md', 'OPEN_ITEMS.md')
     Why = 'Run ''node scripts/lint-app.js'' AND ''node scripts/smoke-test.js'' before calling any app change done - both work on this PC. NEVER put a <script> tag inside the JS block (the 06-23 blank-page incident).' }
  @{ Name = 'SECRETS / CREDENTIALS'
     Match = 'HCC-secrets|ha_backup_token|api[_ ]key|password|credential|token\.txt'
     Requires = @('OPEN_ITEMS.md')
     Why = 'The repo is PUBLIC. Secrets live ONLY in C:\Users\jeffl\HCC-secrets and are referenced, never copied. A Weather Underground key sat exposed in CLAUDE.md and is still in git history.' }
)

# ---------------------------------------------------------------------------
# UNIVERSAL GATE - the ACCESS MAP, required before ANY mutation. Added 2026-09-10.
#
# Jeff, 2026-09-10 9:28 PM, on being handed a new reference file:
#     "Well if it won't make you read and apply it don't put it in, use a gate."
#
# He is right, and it is his own case-study line back again: "Rules that depend on
# a session choosing to read them do not survive session boundaries." A document
# nobody is forced to open is worth nothing - ACCESS_MAP.md would have become the
# 53rd unread file in docs/.
#
# WHAT IT PROTECTS: that file is the route to every live system, and its section 7
# is the workaround for every wall this project has actually hit, plus a closed
# list of the ONLY five genuine blockers. Both failures it prevents are real and
# recent: on 2026-09-10 a session re-derived access paths that already existed
# (the Supervisor websocket, the SmartHub puller, the Bitwarden tooling), and the
# same session twice called a wall a reason the work stopped when a documented
# route existed.
#
# Deliberately NOT costly: reads are never gated, and writing docs is exempted
# above, so recording a finding is never blocked. This only fires before a real
# mutation - which is exactly the moment the route matters.
# ---------------------------------------------------------------------------
#
# 2026-09-15 23:30 - WIDENED FROM ONE FILE TO THREE, at Jeff's instruction:
#     "the not reading the files has got to stop some how it's wasting my time and money"
#
# Cross-checked against a proposed replacement gate the same night. Everything in
# that proposal already existed here EXCEPT this: the universal gate demanded only
# ACCESS_MAP.md, so a session could change anything that did not happen to match one
# of the 12 topic patterns below WITHOUT EVER OPENING THE RULES OR THE OPEN LIST.
# That is the actual hole, and it is the one Jeff keeps paying for.
#
# Why these three specifically, and nothing more (the SHORT-LIST rule above still
# stands - a gate nobody can satisfy gets deleted):
#   ACCESS_MAP.md    - the route to every system + the workaround for every wall.
#   SESSION_START.md - the briefing. Its section 5 is titled "check status, don't
#                      assume" and was itself STALE in four places until 09-10.
#   OPEN_ITEMS.md    - THE list of what is not done. On 2026-09-15 a measurement
#                      found 17 of 61 items marked finished and never struck, while
#                      OPEN_ITEMS_CLOSED.md held only 12. A session that never opens
#                      the list re-does finished work and abandons unfinished work -
#                      which is the exact complaint that produced this edit.
#
# Cost of satisfying it: three Read calls. Reads are never blocked, so this can
# always be cleared immediately, and writing docs stays exempt (above), so recording
# a finding is never gated. HCC-OVERRIDE still stands it all down.
#
$UNIVERSAL = @('ACCESS_MAP.md', 'SESSION_START.md', 'OPEN_ITEMS.md')
$missingUniversal = @()
foreach ($u in $UNIVERSAL) {
  if ($readSoFar -notmatch [regex]::Escape($u)) { $missingUniversal += ('docs/' + $u) }
}
if ($missingUniversal.Count -gt 0) {
  Deny 'READ-FIRST (rules, briefing, open list)' $missingUniversal ('These three are the standing context for every change: the route to every system and the workaround for every wall (ACCESS_MAP), the briefing and hard-won invariants (SESSION_START), and THE list of what is not done (OPEN_ITEMS). Jeff, 2026-09-15: "the not reading the files has got to stop some how it''s wasting my time and money." Reads are never blocked - open them and continue.')
}

foreach ($g in $GATES) {
  if ($blob -match ("(?i)" + $g.Match)) {
    $missing = @()
    $now = [int][double]::Parse((Get-Date -UFormat %s))
    foreach ($doc in $g.Requires) {
      if ($readSoFar -notmatch [regex]::Escape($doc)) { $missing += $doc; continue }
      # Freshness, only where a gate asks for it. Receipt lines are "<epoch>|<path>";
      # take the NEWEST stamp for this doc and require it inside the window.
      if ($g.FreshMin) {
        $newest = 0
        foreach ($ln in ($readSoFar -split "`r?`n")) {
          if ($ln -like ('*' + $doc + '*') -and $ln -match '^(\d{9,})\|') {
            if ([int]$Matches[1] -gt $newest) { $newest = [int]$Matches[1] }
          }
        }
        # A receipt with no timestamp is pre-2026-09-11 format - treat as unknown age and
        # let it pass, so an old receipt can never lock Jeff out.
        if ($newest -gt 0 -and (($now - $newest) / 60) -gt $g.FreshMin) {
          $missing += ($doc + "   (read " + [math]::Round(($now - $newest) / 60) +
                       " min ago - this gate needs it re-read within " + $g.FreshMin + " min)")
        }
      }
    }
    if ($missing.Count -gt 0) { Deny $g.Name $missing $g.Why }
  }
}

exit 0