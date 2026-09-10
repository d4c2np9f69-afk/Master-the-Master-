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
if (-not $path) { exit 0 }

$sid = "$($j.session_id)"
if (-not $sid) { $sid = 'nosession' }
$sid = ($sid -replace '[^A-Za-z0-9\-_]', '')

$receipt = Join-Path $env:TEMP ("hcc-read-" + $sid + ".txt")

try {
  Add-Content -LiteralPath $receipt -Value $path -Encoding UTF8
} catch { }

exit 0
