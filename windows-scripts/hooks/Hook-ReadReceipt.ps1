<#
  HCC READ RECEIPT - PostToolUse on Read

  Records WHICH FILES this session has actually read, into a session-scoped
  receipt file. Hook-RequireRead.ps1 then refuses to let the session touch a
  subsystem whose docs are not on that list.

  WHY THIS EXISTS (2026-09-09, built the night it was earned):
  Jeff has written the instruction "read the files first" into CLAUDE.md, into
  the SessionStart briefing, into OPEN_ITEMS and into a case study he sent to
  Anthropic. It is violated anyway, by session after session. His own audit:
      "The record's answer to 'the file wasn't read' was never 'read harder'."
  A rule needs a session to CHOOSE to obey. A receipt needs nothing - it just
  records what happened, and the gate does the rest.

  This hook NEVER blocks anything. It only observes. Failing open is correct:
  a broken receipt writer must not be able to lock Jeff out of his own house.
#>
$ErrorActionPreference = 'SilentlyContinue'

$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { exit 0 }

$path = "$($j.tool_input.file_path)"

$sid = "$($j.session_id)"
if (-not $sid) { $sid = 'nosession' }
$sid = ($sid -replace '[^A-Za-z0-9\-_]', '')

$receipt = Join-Path $env:TEMP ("hcc-read-" + $sid + ".txt")

# Stamp every receipt line with unix epoch seconds.
#
# WHY (2026-09-11, Jeff): "Why don't you hold the same way to the read first rules?"
# Fair. The gate only proved a file had been opened ONCE this session - so a read from
# five hours ago still counted. That is how four go2rtc attempts got fired at a dead end
# that camera_fixes_2026-08-21.md had already documented: the file was on the receipt,
# just not in the session's head any more. A timestamp lets the gate demand a RECENT
# read for the subsystems where being wrong is expensive.
# The prefix is harmless to the old substring matching the gate already does.
$stamp = [int][double]::Parse((Get-Date -UFormat %s))
if ($path) {
  try { Add-Content -LiteralPath $receipt -Value ("$stamp|$path") -Encoding UTF8 } catch { }
}

# ---------------------------------------------------------------------------
# 2026-09-10: ALSO CREDIT READS DONE THROUGH Bash / PowerShell.
#
# THE GAP THIS CLOSES. This hook was PostToolUse on the Read TOOL ONLY, so it
# recorded nothing when a session read with cat / head / sed / Get-Content.
# Claude Code's auto mode explicitly instructs sessions to read that way - so a
# session could read every required file properly and leave the receipt EMPTY,
# handing Hook-RequireRead no evidence and shutting every gate. The session that
# found this had read 20+ files and its receipt had not moved in two hours.
#
# CONSERVATIVE BY DESIGN. The dangerous direction is crediting a read that never
# happened, because that OPENS a gate. So this is deliberately narrow:
#   * ONLY the exact filenames Hook-RequireRead gates on are ever credited.
#     A command naming any other file records nothing.
#   * ONLY segments starting with a real READ verb count.
#   * Any segment containing a redirection ( > or >> ) is skipped outright -
#     that is a WRITE that merely mentions a filename, not a read of it.
# Net effect: it can under-credit (safe, fails closed) but not over-credit.
# ---------------------------------------------------------------------------
$GATE_DOCS = @(
  'ACCESS_MAP.md',
  'CAMERAS_CLOSED_2026-08-22.md', 'camera_fixes_2026-08-21.md', 'OPEN_ITEMS.md',
  'zigbee_mesh_routers_2026-08-27.md', 'gps_firmware_coworker_findings_2026-08-11.md',
  'UTILITIES_REFERENCE.md', 'BEEHIVE_REFERENCE.md',
  'kasa_smart_lighting_project_2026-08-06.md', 'SESSION_START.md'
)
$READ_VERB = '^\s*(sudo\s+)?(cat|bat|head|tail|sed|less|more|type|grep|rg|awk|Get-Content|gc|Select-String|sls)\b'

$cmd = "$($j.tool_input.command)"
if ($cmd) {
  foreach ($seg in ($cmd -split '(\r?\n|;|&&|\|\||\|)')) {
    if ($seg -match '>>?\s*\S') { continue }
    if ($seg -notmatch $READ_VERB) { continue }
    foreach ($doc in $GATE_DOCS) {
      if ($seg -like ('*' + $doc + '*')) {
        try { Add-Content -LiteralPath $receipt -Value ("$stamp|[via-shell] " + $doc) -Encoding UTF8 } catch { }
      }
    }
  }
}

exit 0
