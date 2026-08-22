<#
  Log-BlinkBatteries.ps1  —  built 2026-08-22

  WHY THIS EXISTS (Jeff, 2026-08-22):
  Blink reports a coarse battery flag that reads "ok" right up until lithium cells die -
  ok one minute, dead the next. The ONLY way to learn the real failure voltage is to log
  the actual voltage over time and catch what it reads when a camera finally drops.

  The voltage is a CAMERA ATTRIBUTE, not a sensor entity, so HA's recorder never stores it.
  That is why no trend line has ever existed. This logger stores it locally instead.

  Read-only against HA. Touches nothing on the camera stack.
#>

$ErrorActionPreference = 'Stop'
$HaUrl    = 'http://192.168.1.66:8123'
$TokenPath= 'C:\Users\jeffl\HCC-secrets\ha_backup_token.txt'
$Csv      = 'C:\Users\jeffl\HCC-Scripts\blink-battery-log.csv'

$cams = @('301_driveway','front_right','back_left','301_backyard','301_front_doorbell','garage')

try {
    $token = (Get-Content $TokenPath -Raw).Trim()
    $h = @{ Authorization = "Bearer $token" }
    $states = Invoke-RestMethod -Uri "$HaUrl/api/states" -Headers $h -TimeoutSec 45
} catch {
    $line = '{0},ERROR,,,,,,{1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), ($_.Exception.Message -replace ',',';')
    Add-Content -Path $Csv -Value $line -Encoding UTF8
    exit 1
}

if (-not (Test-Path $Csv)) {
    'timestamp,camera,battery_flag,voltage,low_flag,wifi_dbm,temp_f,note' |
        Out-File -FilePath $Csv -Encoding UTF8
}

$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
foreach ($c in $cams) {
    $cam  = $states | Where-Object { $_.entity_id -eq "camera.$c" }
    if (-not $cam) { continue }

    $low  = $states | Where-Object { $_.entity_id -eq "binary_sensor.${c}_battery" }
    $wifi = $states | Where-Object { $_.entity_id -eq "sensor.blink_${c}_wi_fi_signal_strength" }
    $temp = $states | Where-Object { $_.entity_id -eq "sensor.blink_${c}_temperature" }

    $volts = $cam.attributes.battery_voltage
    $note  = ''
    if ([string]::IsNullOrWhiteSpace([string]$volts)) {
        $volts = ''
        # doorbell + mains Mini never report a voltage - capability, NOT a fault
        $note  = 'no voltage reported by this device type'
    }

    $line = '{0},{1},{2},{3},{4},{5},{6},{7}' -f `
        $stamp, $c, $cam.attributes.battery, $volts,
        $(if ($low) { $low.state } else { '' }),
        $(if ($wifi) { $wifi.state } else { '' }),
        $(if ($temp) { $temp.state } else { '' }),
        $note
    Add-Content -Path $Csv -Value $line -Encoding UTF8
}
