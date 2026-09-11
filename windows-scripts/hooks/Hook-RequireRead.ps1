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

# ---- Writing documentation is always allowed ----
# Scratchpad is isolated and temporary - writing there NEVER changes the house.
# 2026-09-09: the gate blocked a scratchpad .py whose TEXT mentioned index.html.
# Right call on substance, wrong target. Exempt the whole directory.
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
if ($readSoFar -notmatch [regex]::Escape('ACCESS_MAP.md')) {
  Deny 'ACCESS MAP' @('docs/ACCESS_MAP.md') ('It is the route to every live system, and section 7 carries the workaround for every wall this project has hit - plus the ONLY five genuine blockers, so anything else has a route you have not found yet. Jeff, 2026-09-10: "if it won''t make you read and apply it don''t put it in, use a gate."')
}

foreach ($g in $GATES) {
  if ($blob -match ("(?i)" + $g.Match)) {
    $missing = @()
    foreach ($doc in $g.Requires) {
      if ($readSoFar -notmatch [regex]::Escape($doc)) { $missing += $doc }
    }
    if ($missing.Count -gt 0) { Deny $g.Name $missing $g.Why }
  }
}

exit 0