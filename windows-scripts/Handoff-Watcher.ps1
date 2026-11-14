# Runs on a WINDOWS machine (Beast or Acer). Polls the handoff relay and opens whatever the other
# machine sent - a YouTube video at the exact second, or a PDF at the page.
# The Lenovo's equivalent is garage-handoff-watcher.sh (systemd user service, linger on).
#
# Jeff, 2026-09-23: "I want it to go both ways."
#
# Must run IN JEFF'S LOGON SESSION - it opens a browser window he will look at, so it is a LOGON
# task with LogonType=Interactive. (The relay is the opposite: it talks to nobody, so it runs as
# SYSTEM at boot. Getting those two backwards is what left the relay dead from 09-19 to 09-23.)
param(
    [ValidateSet('beast','acer')][string]$For = 'beast',
    [string]$Relay = 'http://192.168.1.194:8099',
    [int]$PollSeconds = 3
)
$ErrorActionPreference = 'Continue'
$logDir = 'C:\HCC-Heartbeat'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
$log = Join-Path $logDir "handoff-watcher-$For.log"

function Say($m) { Add-Content $log ("{0}`t{1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m) -EA SilentlyContinue }
Say "watcher up on $env:COMPUTERNAME as '$For', relay $Relay"

while ($true) {
    try {
        # PS 5.1 -UseBasicParsing returns .Content as a BYTE ARRAY, not a string. Calling .Trim()
        # on it throws "[System.Byte] does not contain a method named 'Trim'" and the watcher then
        # logs "relay unreachable" forever while the relay is perfectly fine. Caught 2026-09-23 by
        # an actual end-to-end send, not by reading the code. Always decode explicitly.
        $raw = (Invoke-WebRequest "$Relay/pending?for=$For" -UseBasicParsing -TimeoutSec 8).Content
        if ($raw -is [byte[]]) { $u = [Text.Encoding]::UTF8.GetString($raw) } else { $u = [string]$raw }
        if ($u -and $u.Trim()) {
            $u = $u.Trim()
            Say "OPEN $u"
            # Start-Process on a URL hands it to the default browser in this interactive session
            Start-Process $u
        }
    } catch {
        # relay down or rebooting - stay quiet, keep polling. Log once a minute at most.
        $now = Get-Date
        if (-not $script:lastWarn -or ($now - $script:lastWarn).TotalSeconds -gt 60) {
            Say "relay unreachable: $($_.Exception.Message)"
            $script:lastWarn = $now
        }
    }
    Start-Sleep -Seconds $PollSeconds
}
