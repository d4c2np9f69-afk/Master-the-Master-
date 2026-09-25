<#
.SYNOPSIS
    Rebuilds the HCC MASTER RECORD in iCloud from every Claude Code session transcript.

.DESCRIPTION
    Built 2026-08-16 after decisions kept getting lost between sessions. Jeff:
    "I can't keep doing this every time the session changes."

    Regenerates, verbatim, into iCloudDrive\HCC-Archive\MASTER-RECORD\:
      HCC_MASTER_RECORD.md     every message ever, chronological
      HCC_ACTIONS_LOG.md       every tool action
      HCC_MASTER_INDEX.md      session table + topic->dates index
      HCC_DECISIONS_LEDGER.md  Jeff's decisions/rejections/price limits

    Runs daily via scheduled task "HCC Master Record Update". Safe to run any time.
#>

$ErrorActionPreference = 'Stop'
$py = "C:\Users\jeffl\AppData\Local\Programs\Python\Python313\python.exe"
$gen = Join-Path $PSScriptRoot "hcc_master_record.py"
$out = "C:\Users\jeffl\iCloudDrive\HCC-Archive\MASTER-RECORD"
$log = Join-Path $out "_update.log"

if (-not (Test-Path $py))  { throw "Python not found at $py" }
if (-not (Test-Path $gen)) { throw "Generator not found at $gen" }

New-Item -ItemType Directory -Force -Path $out | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

try {
    $result = & $py $gen 2>&1 | Out-String
    Add-Content -Path $log -Value "[$stamp] OK`n$result" -Encoding utf8
    Write-Output $result
} catch {
    Add-Content -Path $log -Value "[$stamp] FAILED: $_" -Encoding utf8
    throw
}
