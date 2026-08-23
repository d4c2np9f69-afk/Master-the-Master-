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

# ---- GUARD 1, reader side (added 2026-08-23) ----
# Log-BlinkBatteries.ps1 refuses to alert during an integration reload:
#     $isReload = ($blankNow.Count -ge 2) -or ($badState.Count -ge 2)
#     if ($isReload) { exit 0 }   # never alert during a reload
# The WRITER and the ALARM both had that guard. THIS READER never did, so it
# reported every reload as ">> WENT DARK ... <== the real failure point" - 11 per
# camera at identical timestamps across all four at once. Cameras do not fail in
# unison, and the whole point of this log is to capture ONE real failure voltage;
# burying it under fakes destroys the deliverable.
# Mirror the writer's rule exactly: >=2 voltage cameras blank at the SAME timestamp
# is a reload, not a battery event. One camera blank while the others still report
# IS a real failure and must still be reported.
$voltCams     = @($rows | Where-Object { $_.voltage -match '^\d+$' } |
                          Select-Object -ExpandProperty camera -Unique)
$reloadStamps = @{}
$rows | Where-Object { $_.camera -in $voltCams -and $_.voltage -notmatch '^\d+$' } |
        Group-Object timestamp |
        Where-Object { $_.Count -ge 2 } |
        ForEach-Object { $reloadStamps[$_.Name] = $true }

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
        if ($prev -and -not $reloadStamps.ContainsKey($s.timestamp)) {
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
if ($reloadStamps.Count -gt 0) {
    Write-Host ("{0} integration-reload window(s) excluded - >=2 cameras blank at the same" -f $reloadStamps.Count) -ForegroundColor DarkGray
    Write-Host "timestamp is a reload, not a battery event (same rule Log-BlinkBatteries.ps1" -ForegroundColor DarkGray
    Write-Host "uses to refuse to alert). A single camera going blank while the others still" -ForegroundColor DarkGray
    Write-Host "report IS a real failure and WILL still be reported above." -ForegroundColor DarkGray
    Write-Host ""
}
Write-Host "Lowest reading is the next battery due. Blink's ok/low flag is NOT predictive -" -ForegroundColor DarkGray
Write-Host "that is exactly why this log exists. Raw data: $Csv" -ForegroundColor DarkGray
Write-Host ""
