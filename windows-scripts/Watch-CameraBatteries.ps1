<#
.SYNOPSIS
    Catches a camera whose battery has died - by watching the WHOLE VALUE FAMILY freeze,
    not one value, and not the vendor flag.

.DESCRIPTION
    MONITOR ONLY. Reads HCC-Scripts\blink-battery-log.csv, writes its own log, sends a phone push
    through HA. It NEVER touches any camera setting - the camera stack stays frozen per
    docs/CAMERAS_CLOSED_2026-08-22.md.

    WHY THIS EXISTS (2026-10-07). Two cameras were dead and nothing said a word:
      back_left     died 2026-09-28 00:01, frozen at 147  -  unnoticed for 9.3 days
      301_backyard  died 2026-10-01 20:46, frozen at 147  -  unnoticed for 5.5 days
    The vendor reported low_flag=off and battery_flag=ok right through dying, across ~4,000
    readings each, and is STILL reporting ok for both. The alert watched a flag that never gets set.

    WHY IT WAS REWRITTEN (2026-10-11). The first version watched ONE value - voltage - and called
    a camera dead when it had not changed in 24 h. That rule CANNOT work, and it cried wolf:
      2026-10-10 07:30  "301_driveway DEAD at 153 since Oct 09"   <- alive the whole time;
                                                                     it moved 153->152 at 07:46.
    Measured over 2026-09-27 -> 10-11, worst gap between VOLTAGE changes on a live camera:
      301_driveway 48.5 h   front_right 45.8 h   301_backyard 46.0 h   back_left 26.7 h
    A cell falling ~0.39 units/day only changes the reported value every ~2.5 days, so a 24 h
    voltage-freeze rule is guaranteed to fire on healthy cameras. The threshold was never the
    problem - watching a single change-driven value was.
    (Same trap, already in memory as reference_change_driven_sensor_not_a_heartbeat: Home
    Assistant moves last_updated only when a value CHANGES, so one value measures the WORLD,
    not the feed. Watch the FAMILY.)

    THE FIX - WATCH THE FAMILY: voltage + temp_f + wifi_dbm together. Something in that trio is
    almost always moving on a live camera, while a dead one freezes all three at once, because HA
    keeps serving the last values it ever received. Measured on the same window:
                        worst normal gap     frozen right now
      301_driveway             18.7 h              0.8 h      (alive)
      front_right              18.7 h              0.2 h      (alive)
      301_backyard             10.5 h            232.2 h      (DEAD)
      back_left                 9.2 h            314.8 h      (DEAD)
    Worst live gap 18.7 h vs 232 h and 315 h on the dead pair. Default FrozenHours = 36 gives
    ~2x headroom over the worst observed healthy gap and still catches a death inside a day and a
    half. The old voltage-only rule had LESS headroom than its own threshold - that is the bug.

    SECOND, INDEPENDENT SIGNAL - the camera's own temperature, as corroboration printed next to a
    DEAD call. A camera that died in summer keeps reporting summer: on 2026-10-11 back_left read
    82 F and 301_backyard 76 F while the live pair read 64-66 F, matching the real outdoor temp.
    It is NOT the trigger, because a camera that dies today still has a plausible temperature today.

    THE SOON CHECK AND COLD WEATHER. back_left is going on the ROOF, where a battery change is a
    real job, and it is going there for the winter. A lithium AA reads lower when cold WITHOUT
    having lost capacity, so a cold snap can look exactly like a dying cell.
    HONEST LIMIT: the cold-sag coefficient could NOT be measured from this log, and no invented
    one is used here. Tried 2026-10-11 - a joint fit of voltage on (age, temp_f) over Jeff's own
    data returns physically impossible answers (voltage RISING +0.10 and +0.45 per day), because
    over the only window available age and temperature fall together, so the two are confounded;
    the fresh-cell install jumps contaminate the fit on top of that. Correcting with a made-up
    number would just be a different lie. What IS done instead:
      * the decline rate is a LEAST-SQUARES SLOPE over RateDays (14) of daily medians, not the old
        first-day-minus-last-day difference, which one cold day at either end could swing by itself;
      * any window containing an upward jump >= JumpIgnore (15) is skipped - that is a fresh-cell
        install, which invalidates a decline rate completely;
        🔴 JumpIgnore was 5 for about ten minutes on 2026-10-11 and that was WRONG - it threw away
        the window on BOTH live cameras, so the SOON check never ran at all. Measured daily medians
        swing +-6 in BOTH directions day to day (driveway 10-08 +5 then 10-09 -5; front_right
        10-08 +6 then 10-11 -6) - that is the Blink cloud re-reporting the same cell, not charge
        coming back. A real fresh-cell install is +29 (front_right 09-03) to +39 (driveway 08-26).
        15 sits cleanly between the two populations. The least-squares slope below is what absorbs
        the +-6 noise; the jump filter only has to catch a battery swap;
      * the temperature trend over the same window is MEASURED and printed with the alert, so a
        SOON during a cold snap says so out loud instead of hiding it;
      * SOON must hold on two consecutive runs before it pushes, so one cold night cannot page Jeff.

.PARAMETER NoPush
    Report only; send no notification. Used to prove detection without texting Jeff.
#>
[CmdletBinding()]
param(
    [double] $FrozenHours = 36,
    [double] $WarnDays    = 7,
    [int]    $RateDays    = 14,
    [int]    $JumpIgnore  = 15,
    [double] $MinRate     = 0.15,
    [int]    $Floor       = 147,
    [switch] $NoPush
)

$ErrorActionPreference = 'Stop'
$here  = Split-Path -Parent $MyInvocation.MyCommand.Path
$csv   = Join-Path $here 'blink-battery-log.csv'
$log   = Join-Path $here 'camera-battery-watch.log'
$state = Join-Path $here 'camera-battery-seen.json'
$token = 'C:\Users\jeffl\HCC-secrets\ha_backup_token.txt'

function Write-Log([string] $m) {
    $line = ('{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m)
    Add-Content -Path $log -Value $line -Encoding utf8
    Write-Output $line
    if ((Test-Path $log) -and (Get-Item $log).Length -gt 512KB) {
        Set-Content -Path $log -Value (Get-Content $log -Tail 400) -Encoding utf8
    }
}

function Get-Num($v) {
    if ($null -eq $v) { return $null }
    $s = ([string]$v).Trim()
    if ($s -eq '' -or $s -eq 'unknown' -or $s -eq 'unavailable') { return $null }
    $d = 0.0
    if ([double]::TryParse($s, [ref]$d)) { return $d }
    return $null
}

if (-not (Test-Path $csv)) { Write-Log "no battery log at $csv"; exit 0 }

$rows = Import-Csv $csv | Where-Object { $_.voltage -match '^\d+$' }
if (-not $rows) { Write-Log 'no numeric voltage rows yet'; exit 0 }

$now = Get-Date
$dead = @(); $soon = @(); $ok = @()

foreach ($g in ($rows | Group-Object camera)) {
    $cam  = $g.Name
    $rs   = @($g.Group | Sort-Object { [datetime]$_.timestamp })
    $last = $rs[-1]
    $vNow = [int]$last.voltage

    # ---- DEAD: the whole family (voltage + temp_f + wifi_dbm) has stopped moving -------------
    $fam = @()
    foreach ($r in $rs) {
        $tf = Get-Num $r.temp_f
        $wd = Get-Num $r.wifi_dbm
        if ($null -eq $tf -or $null -eq $wd) { continue }
        $fam += [pscustomobject]@{
            t   = [datetime]$r.timestamp
            key = ('{0}|{1}|{2}' -f $r.voltage, $tf, $wd)
        }
    }

    if ($fam.Count -lt 2) {
        # garage Mini / doorbell report no temp or wifi - nothing here to watch
        $ok += "$cam (no temp/wifi from this device type - not watched)"
        continue
    }

    $kNow = $fam[-1].key
    $tChanged = $null
    for ($i = $fam.Count - 2; $i -ge 0; $i--) {
        if ($fam[$i].key -ne $kNow) { $tChanged = $fam[$i].t; break }
    }
    if ($null -eq $tChanged) { $ok += "$cam (family never changed - too little data)"; continue }

    $frozenH = ($fam[-1].t - $tChanged).TotalHours
    if ($frozenH -ge $FrozenHours) {
        $dead += [pscustomobject]@{
            cam = $cam; v = $vNow; since = $tChanged; hours = $frozenH; temp = (Get-Num $last.temp_f)
        }
        continue
    }

    # ---- SOON: robust decline rate over RateDays of daily medians ----------------------------
    $cut    = $now.AddDays(-$RateDays)
    $recent = @($rs | Where-Object { [datetime]$_.timestamp -ge $cut })
    $byDay  = @($recent | Group-Object { ([datetime]$_.timestamp).ToString('yyyy-MM-dd') } |
                ForEach-Object {
                    $vals  = @($_.Group | ForEach-Object { [int]$_.voltage } | Sort-Object)
                    $temps = @($_.Group | ForEach-Object { Get-Num $_.temp_f } |
                               Where-Object { $null -ne $_ } | Sort-Object)
                    [pscustomobject]@{
                        d    = $_.Name
                        med  = $vals[[int]($vals.Count / 2)]
                        temp = $(if ($temps.Count) { $temps[[int]($temps.Count / 2)] } else { $null })
                    }
                } | Sort-Object d)

    if ($byDay.Count -lt 4) { $ok += "$cam ($vNow, too few days for a rate)"; continue }

    # a battery change or a Blink cloud re-report invalidates the window
    $jumped = $false
    for ($i = 1; $i -lt $byDay.Count; $i++) {
        if (($byDay[$i].med - $byDay[$i-1].med) -ge $JumpIgnore) { $jumped = $true; break }
    }
    if ($jumped) { $ok += "$cam ($vNow, window has an upward jump - rate not trusted)"; continue }

    # least-squares slope of median voltage vs day index
    $n = $byDay.Count
    $sx = 0.0; $sy = 0.0; $sxx = 0.0; $sxy = 0.0
    for ($i = 0; $i -lt $n; $i++) {
        $sx  += $i
        $sy  += $byDay[$i].med
        $sxx += [double]$i * $i
        $sxy += [double]$i * $byDay[$i].med
    }
    $den = ($n * $sxx) - ($sx * $sx)
    if ($den -eq 0) { $ok += "$cam ($vNow)"; continue }
    $slope = (($n * $sxy) - ($sx * $sy)) / $den      # units/day, negative = draining
    $drop  = -$slope

    # temperature trend over the same window, for disclosure - NOT a correction
    $tFirst = ($byDay | Where-Object { $null -ne $_.temp } | Select-Object -First 1).temp
    $tLastD = ($byDay | Where-Object { $null -ne $_.temp } | Select-Object -Last  1).temp
    $dTemp  = $(if ($null -ne $tFirst -and $null -ne $tLastD) { $tLastD - $tFirst } else { $null })

    if ($drop -gt $MinRate) {
        $days = ($vNow - $Floor) / $drop
        if ($days -le $WarnDays) {
            $soon += [pscustomobject]@{
                cam = $cam; v = $vNow; rate = $drop; days = $days; dTemp = $dTemp; win = $n
            }
            continue
        }
    }
    $ok += "$cam ($vNow)"
}

foreach ($d in $dead) {
    $t = $(if ($null -ne $d.temp) { (' - still reporting {0:N0} F' -f $d.temp) } else { '' })
    Write-Log ("DEAD  {0}: voltage+temp+wifi ALL frozen at {1} since {2:yyyy-MM-dd HH:mm} ({3:N1} h){4}" -f $d.cam, $d.v, $d.since, $d.hours, $t)
}
foreach ($s in $soon) {
    $c = $(if ($null -ne $s.dTemp -and $s.dTemp -le -10) {
               (' [temp also fell {0:N0} F over the window - some of this may be cold sag, not capacity]' -f [math]::Abs($s.dTemp))
           } else { '' })
    Write-Log ("SOON  {0}: {1}, falling {2:N2}/day over {3} days -> hits {4} in ~{5:N0} days{6}" -f $s.cam, $s.v, $s.rate, $s.win, $Floor, $s.days, $c)
}
if ($ok) { Write-Log ("ok    " + ($ok -join ', ')) }

if (-not $dead -and -not $soon) { exit 0 }

$seen = @{}
if (Test-Path $state) {
    try { (Get-Content $state -Raw | ConvertFrom-Json).PSObject.Properties |
          ForEach-Object { $seen[$_.Name] = $_.Value } } catch {}
}

$new = @()
foreach ($d in $dead) {
    $k = "dead:" + $d.cam
    if ($seen[$k] -ne $d.v) { $new += ("{0} DEAD at {1} since {2:MMM dd}" -f $d.cam, $d.v, $d.since); $seen[$k] = $d.v }
}
# SOON must hold on two consecutive runs before it pushes - one cold night must not page Jeff
foreach ($s in $soon) {
    $k     = "soon:"    + $s.cam
    $armed = "soonarm:" + $s.cam
    if ($seen[$k]) { continue }
    if (-not $seen[$armed]) {
        $seen[$armed] = 1
        Write-Log ("      {0} SOON armed - needs a second consecutive run before it pushes" -f $s.cam)
        continue
    }
    $c = $(if ($null -ne $s.dTemp -and $s.dTemp -le -10) { ' (note: it also got colder - may be cold sag)' } else { '' })
    $new += ("{0} dies in ~{1:N0} days ({2}){3}" -f $s.cam, $s.days, $s.v, $c)
    $seen[$k] = 1
}
# disarm anything no longer SOON, so the two-run rule needs two FRESH runs next time
foreach ($key in @($seen.Keys)) {
    if ($key -like 'soonarm:*') {
        $c = $key.Substring(8)
        if (-not ($soon | Where-Object { $_.cam -eq $c })) { $seen.Remove($key) }
    }
}
($seen | ConvertTo-Json) | Set-Content $state -Encoding utf8

if (-not $new) { Write-Log 'nothing new since the last alert'; exit 1 }
if ($NoPush) { Write-Log ("NoPush - would have sent: " + ($new -join ' | ')); exit 1 }

try {
    $tok = (Get-Content $token -Raw).Trim()
    $msg = ($new -join ' | ') + '  (the vendor still reports these ok - the frozen value FAMILY is the real signal)'
    $payload = @{ title = 'Camera battery'; message = $msg } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Post -TimeoutSec 30 `
        -Uri 'http://192.168.1.66:8123/api/services/notify/mobile_app_jeffs_iphone' `
        -Headers @{ Authorization = "Bearer $tok"; 'Content-Type' = 'application/json' } `
        -Body $payload | Out-Null
    Write-Log ("phone alert sent: " + $msg)
} catch { Write-Log ("phone alert FAILED: " + $_.Exception.Message) }
exit 1
