# Pulls the latest Home Assistant automatic backup from Beehive and copies it into iCloud Drive.
# Run daily via Windows Scheduled Task (see task "HCC Beehive Backup Sync").
#
# 2026-08-19: made endpoint-agnostic. Proton VPN (free plan) blocks all LAN traffic from this
# PC and "Allow LAN connections" is a paid-only feature, so whenever the VPN is running the
# old ws://homeassistant.local path failed and the backup silently did not sync. The script
# now tries the LAN first (fast, no relay bandwidth) and falls back to the Nabu Casa remote
# URL, which works with the VPN up. See docs/incidents/beehive_false_offline_protonvpn_2026-08-19.md

$ErrorActionPreference = "Stop"

$tokenPath = "C:\Users\jeffl\HCC-secrets\ha_backup_token.txt"
$destDir   = "C:\Users\jeffl\iCloudDrive\HCC-Beehive-Backups"
$logPath   = "C:\Users\jeffl\HCC-Scripts\backup_sync.log"
$keepCount = 14

# LAN first: it is fast and does not consume Nabu Casa relay bandwidth (backups are ~400 MB).
# Nabu Casa second: works when the VPN is up or when this PC is off the home network.
#   LAN-IP first  - no mDNS lookup, connects in milliseconds.
#   LAN-mDNS next - covers the case where Beehive's IP ever changes (measured 5.8 s to
#                   resolve homeassistant.local on 2026-08-19, so it needs a roomy timeout).
#   NabuCasa last - works with a VPN up or off-site, but relays ~400 MB, so it is the fallback.
$endpoints = @(
    @{ Name = "LAN-IP";   Ws = "ws://192.168.1.66:8123";                                     Http = "http://192.168.1.66:8123";                                     ConnectMs = 5000;  DownloadSec = 1800 },
    @{ Name = "LAN-mDNS"; Ws = "ws://homeassistant.local:8123";                              Http = "http://homeassistant.local:8123";                              ConnectMs = 15000; DownloadSec = 1800 },
    @{ Name = "NabuCasa"; Ws = "wss://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa";        Http = "https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa";        ConnectMs = 25000; DownloadSec = 1800 }
)

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Add-Content -Path $logPath -Value $line
    Write-Output $line
}

function Recv($ws, $cts) {
    $buffer = New-Object byte[] 1048576
    $seg = New-Object System.ArraySegment[byte] (,$buffer)
    $all = ""
    do {
        $result = $ws.ReceiveAsync($seg, $cts.Token).Result
        $all += [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
    } until ($result.EndOfMessage)
    return $all
}
function Send($ws, $cts, $text) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $seg = New-Object System.ArraySegment[byte] (,$bytes)
    $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()
}

try {
    $token = [System.IO.File]::ReadAllText($tokenPath).Trim()

    # ---- Ask Beehive for its backup list, over whichever endpoint answers ----
    $infoResp = $null
    $used     = $null
    $failures = @()

    foreach ($ep in $endpoints) {
        $ws = $null
        try {
            $ws = New-Object System.Net.WebSockets.ClientWebSocket
            $cts = New-Object System.Threading.CancellationTokenSource
            $cts.CancelAfter($ep.ConnectMs)
            $ws.ConnectAsync([Uri]"$($ep.Ws)/api/websocket", $cts.Token).Wait()

            Recv $ws $cts | Out-Null
            Send $ws $cts (@{type = "auth"; access_token = $token} | ConvertTo-Json -Compress)
            $authResp = Recv $ws $cts | ConvertFrom-Json
            if ($authResp.type -ne "auth_ok") {
                throw "HA auth failed: $($authResp.message)"
            }

            Send $ws $cts (@{id = 1; type = "backup/info"} | ConvertTo-Json -Compress)
            $resp = Recv $ws $cts | ConvertFrom-Json
            $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $cts.Token).Wait()

            if (-not $resp.success) { throw "backup/info call failed" }

            $infoResp = $resp
            $used     = $ep
            break
        }
        catch {
            $msg = $_.Exception.Message
            if ($_.Exception.InnerException) { $msg = $_.Exception.InnerException.Message }
            $failures += "$($ep.Name): $msg"
            if ($ws) { try { $ws.Dispose() } catch { } }
        }
    }

    if (-not $infoResp) {
        throw "No endpoint reachable -- $($failures -join ' | ')"
    }
    if ($failures.Count -gt 0) {
        Write-Log "NOTE: used $($used.Name) after failure(s) -- $($failures -join ' | ')"
    }

    $automaticBackups = $infoResp.result.backups | Where-Object { $_.with_automatic_settings -eq $true }
    if (-not $automaticBackups) {
        throw "No automatic backups found"
    }
    $latest = $automaticBackups | Sort-Object date -Descending | Select-Object -First 1

    $agentId = ($latest.agents.PSObject.Properties | Select-Object -First 1).Name
    $expectedSize = $latest.agents.$agentId.size
    $dateStr = ([DateTimeOffset]$latest.date).ToString("yyyy-MM-dd")
    $destPath = Join-Path $destDir "HCC-Beehive-Backup-$dateStr.tar"

    if (Test-Path $destPath) {
        Write-Log "SKIP: $destPath already exists (backup_id $($latest.backup_id))"
        exit 0
    }

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    }

    $url = "$($used.Http)/api/backup/download/$($latest.backup_id)?agent_id=$agentId"
    $tmpPath = "$destPath.partial"
    Invoke-WebRequest -Uri $url -Headers @{Authorization = "Bearer $token"} -OutFile $tmpPath -TimeoutSec $used.DownloadSec

    $actualSize = (Get-Item $tmpPath).Length
    if ($actualSize -ne $expectedSize) {
        Remove-Item $tmpPath -Force
        throw "Size mismatch: expected $expectedSize, got $actualSize"
    }

    Move-Item $tmpPath $destPath
    Set-ItemProperty -Path $destPath -Name IsReadOnly -Value $true
    Write-Log "OK: downloaded $destPath ($actualSize bytes, backup_id $($latest.backup_id)) via $($used.Name)"

    $old = Get-ChildItem $destDir -Filter "HCC-Beehive-Backup-*.tar" | Sort-Object LastWriteTime -Descending | Select-Object -Skip $keepCount
    foreach ($f in $old) {
        Remove-Item $f.FullName -Force
        Write-Log "PRUNED: $($f.Name)"
    }
}
catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    exit 1
}
