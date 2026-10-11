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

# ---- GUARD 2, reader side (added 2026-08-26) ----
# A dead camera does NOT always blank its voltage. 301_driveway died at 02:16 on
# 2026-08-25 and kept a numeric voltage of exactly 135 for 37+ consecutive samples,
# with temp pinned at exactly 66. GUARD 1 never saw it (voltage stayed numeric) and
# neither did the WENT DARK check, so this reader printed "now 135, -2.82/day" as
# though the camera were alive and getting worse. It was a corpse holding a value.
# The tell is Blink's OWN sentinel, already in the log: wifi_dbm goes to -255.
# Live cameras report a real dBm (-39..-62 across this house). This is not a
# heuristic invented here - it is the vendor's not-reporting marker.
# So: rows with wifi_dbm -255 are NOT live. Trend and rate come from live rows only,
# and a camera currently stuck at -255 is reported as STOPPED REPORTING with the
# last voltage it read while alive - which is the failure point this log exists for.
foreach ($cam in ($rows | Select-Object -ExpandProperty camera -Unique)) {
    $r = $rows | Where-Object { $_.camera -eq $cam }
    $vAll = $r | Where-Object { $_.voltage -match '^\d+$' }
    $v    = $vAll | Where-Object { $_.wifi_dbm -ne '-255' }

    if (-not $vAll) {
        Write-Host ("{0,-22} no voltage - this device type never reports one (doorbell / mains Mini)" -f $cam) -ForegroundColor DarkGray
        continue
    }

    # Is it stuck on the -255 sentinel right now? Walk back to where that run began.
    # MINIMUM RUN OF 4 SAMPLES (~1 hour) - added 2026-08-26 after checking 30 days of HA
    # history (~6000 rows/camera): EVERY camera blips to -255 briefly and it means nothing.
    # back_left did it 9 times, front_right 8, backyard 43 - all of them 0.0-0.2h. A real
    # death is SUSTAINED: 301_driveway held -255 from 02:02 to 10:30 on 2026-08-25 and was
    # still there 30h later. Without this floor a single unlucky 15-min sample would
    # declare a healthy camera dead, which is the crying-wolf failure this file exists to avoid.
    $staleSince = $null; $lastLive = $null; $staleRows = 0
    if ($vAll[-1].wifi_dbm -eq '-255') {
        for ($i = $vAll.Count - 1; $i -ge 0; $i--) {
            if ($vAll[$i].wifi_dbm -eq '-255') { $staleSince = $vAll[$i].timestamp; $staleRows++ }
            else { $lastLive = $vAll[$i]; break }
        }
        if ($staleRows -lt 4) { $staleSince = $null }   # transient blip, not a death
    }

    if (-not $v) {
        Write-Host ("{0,-22} NOT REPORTING - every logged row carries the -255 sentinel" -f $cam) -ForegroundColor Red
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

    # GUARD 2 result: say plainly that this camera is dead, and when, and at what voltage.
    if ($staleSince) {
        $deadFor = ([datetime]$rows[-1].timestamp - [datetime]$staleSince).TotalHours
        Write-Host ("    >> STOPPED REPORTING at {0} ({1:N1}h ago) - LAST LIVE VOLTAGE: {2}  <== the real failure point" -f `
                    $staleSince, $deadFor, $(if ($lastLive) { $lastLive.voltage } else { 'n/a' })) -ForegroundColor Red
        Write-Host ("       wifi_dbm has read -255 since then; the '{0}' above is a FROZEN value, not a live reading." -f $vAll[-1].voltage) -ForegroundColor Red
        Write-Host ("       Blink's own flag still reads '{0}' for this camera." -f $vAll[-1].battery_flag) -ForegroundColor Red
    }

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
