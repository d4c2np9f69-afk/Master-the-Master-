# Pulls the latest Home Assistant automatic backup from Beehive and copies it into iCloud Drive.
# Run daily via Windows Scheduled Task (see task "HCC Beehive Backup Sync").

$ErrorActionPreference = "Stop"

$tokenPath = "C:\Users\jeffl\HCC-secrets\ha_backup_token.txt"
$destDir   = "C:\Users\jeffl\iCloudDrive\HCC-Beehive-Backups"
$logPath   = "C:\Users\jeffl\HCC-Scripts\backup_sync.log"
$haHost    = "homeassistant.local:8123"
$keepCount = 14

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Add-Content -Path $logPath -Value $line
    Write-Output $line
}

try {
    $token = [System.IO.File]::ReadAllText($tokenPath).Trim()

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $cts = New-Object System.Threading.CancellationTokenSource
    $cts.CancelAfter(20000)
    $ws.ConnectAsync([Uri]"ws://$haHost/api/websocket", $cts.Token).Wait()

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

    Recv $ws $cts | Out-Null
    Send $ws $cts (@{type="auth"; access_token=$token} | ConvertTo-Json -Compress)
    $authResp = Recv $ws $cts | ConvertFrom-Json
    if ($authResp.type -ne "auth_ok") {
        throw "HA auth failed: $($authResp.message)"
    }

    Send $ws $cts (@{id=1; type="backup/info"} | ConvertTo-Json -Compress)
    $infoResp = Recv $ws $cts | ConvertFrom-Json
    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $cts.Token).Wait()

    if (-not $infoResp.success) {
        throw "backup/info call failed"
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

    $url = "http://$haHost/api/backup/download/$($latest.backup_id)?agent_id=$agentId"
    $tmpPath = "$destPath.partial"
    Invoke-WebRequest -Uri $url -Headers @{Authorization = "Bearer $token"} -OutFile $tmpPath -TimeoutSec 300

    $actualSize = (Get-Item $tmpPath).Length
    if ($actualSize -ne $expectedSize) {
        Remove-Item $tmpPath -Force
        throw "Size mismatch: expected $expectedSize, got $actualSize"
    }

    Move-Item $tmpPath $destPath
    Set-ItemProperty -Path $destPath -Name IsReadOnly -Value $true
    Write-Log "OK: downloaded $destPath ($actualSize bytes, backup_id $($latest.backup_id))"

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
