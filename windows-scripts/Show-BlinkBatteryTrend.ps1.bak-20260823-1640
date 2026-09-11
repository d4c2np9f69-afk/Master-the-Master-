<#
  Show-BlinkBatteryTrend.ps1  —  built 2026-08-22

  Answers Jeff's actual question: "at what voltage do these things ACTUALLY fail?"
  Blink's own flag reads "ok" until lithium cells drop dead, so the flag is useless for
  prediction. This reports the logged voltage curve and, critically, captures the voltage
  READ JUST BEFORE any camera flipped to low or went dark - that is the real failure point.
#>

$Csv = 'C:\Users\jeffl\HCC-Scripts\blink-battery-log.csv'
if (-not (Test-Path $Csv)) { Write-Host "No log yet at $Csv"; exit }

$rows = Import-Csv $Csv | Where-Object { $_.camera -and $_.camera -ne 'ERROR' }
if (-not $rows) { Write-Host "Log is empty."; exit }

Write-Host ""
Write-Host "=== BLINK BATTERY TREND ===" -ForegroundColor Cyan
$span = ([datetime]$rows[-1].timestamp) - ([datetime]$rows[0].timestamp)
Write-Host ("    {0}   |   {1} samples over {2:N1} days" -f (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt'), $rows.Count, $span.TotalDays)
Write-Host ""

foreach ($cam in ($rows | Select-Object -ExpandProperty camera -Unique)) {
    $r = $rows | Where-Object { $_.camera -eq $cam }
    $v = $r | Where-Object { $_.voltage -match '^\d+$' }

    if (-not $v) {
        Write-Host ("{0,-22} no voltage - this device type never reports one (doorbell / mains Mini)" -f $cam) -ForegroundColor DarkGray
        continue
    }

    $first = $v[0]; $last = $v[-1]
    $days  = ([datetime]$last.timestamp - [datetime]$first.timestamp).TotalDays
    $delta = [int]$last.voltage - [int]$first.voltage
    $rate  = if ($days -gt 0.5) { [math]::Round($delta / $days, 2) } else { $null }

    $line = "{0,-22} now {1,-5} (was {2} {3:N1}d ago, {4:+#;-#;0})" -f $cam, $last.voltage, $first.voltage, $days, $delta
    if ($null -ne $rate -and $rate -lt 0) {
        $line += ("  {0}/day" -f $rate)
    } elseif ($days -le 0.5) {
        $line += "  - too early for a rate"
    }
    Write-Host $line

    # THE POINT OF ALL THIS: what did it read just before it flagged low or went dark?
    $prev = $null
    foreach ($s in $r) {
        if ($prev) {
            if ($prev.low_flag -eq 'off' -and $s.low_flag -eq 'on') {
                Write-Host ("    >> FLIPPED TO LOW at {0} - last voltage before that: {1}" -f $s.timestamp, $prev.voltage) -ForegroundColor Yellow
            }
            if ($prev.voltage -match '^\d+$' -and $s.voltage -notmatch '^\d+$') {
                Write-Host ("    >> WENT DARK at {0} - LAST VOLTAGE READ: {1}  <== the real failure point" -f $s.timestamp, $prev.voltage) -ForegroundColor Red
            }
        }
        $prev = $s
    }
}

Write-Host ""
Write-Host "Lowest reading is the next battery due. Blink's ok/low flag is NOT predictive -" -ForegroundColor DarkGray
Write-Host "that is exactly why this log exists. Raw data: $Csv" -ForegroundColor DarkGray
Write-Host ""
