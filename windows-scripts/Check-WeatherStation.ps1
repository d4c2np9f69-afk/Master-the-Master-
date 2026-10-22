<#
  Check-WeatherStation.ps1
  Is the Weather Underground PWS KTNWHITE21 actually reporting?

  Checks the FEATURE, not just a component:
    1. WU direct  - api.weather.com current observation (is the station uploading?)
    2. Staleness  - how old is the newest observation, in minutes
    3. Sensors    - which individual sensors are null / frozen
    4. 7-day      - are there gaps or dead days in the daily summary
    5. App        - does /api/weather on the live site still carry real WU data,
                    or has it silently fallen through to the Open-Meteo fallback

  Key is read from HCC-secrets and never printed.
  Written 2026-08-22.
#>

$ErrorActionPreference = 'Stop'
$keyFile = 'C:\Users\jeffl\HCC-secrets\weather_underground_api_key.txt'
$station = 'KTNWHITE21'
$fail = 0

Write-Output "=== WEATHER STATION CHECK - $station ==="
Write-Output ("run at: " + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + " local")
Write-Output ""

if (-not (Test-Path $keyFile)) { Write-Output "FAIL: no key file at $keyFile"; exit 1 }
# NOTE: this file is a 21-line PROSE NOTE, not a bare key. Reading it whole and
# trimming gives a 962-char string and a guaranteed 401. Pull the token out.
$keyRaw = Get-Content $keyFile -Raw
$m = [regex]::Matches($keyRaw, '[A-Za-z0-9]{25,}')
if ($m.Count -eq 0) { Write-Output "FAIL: no API key token found in $keyFile"; exit 1 }
$key = $m[$m.Count - 1].Value

# ---- 1. WU direct -------------------------------------------------------
$url = "https://api.weather.com/v2/pws/observations/current?stationId=$station&format=json&units=e&apiKey=$key&numericPrecision=decimal"
try {
    $resp = Invoke-RestMethod -Uri $url -TimeoutSec 25
    $o = $resp.observations[0]
} catch {
    Write-Output ("FAIL: WU direct call errored - " + $_.Exception.Message)
    exit 1
}

Write-Output "--- 1. WU DIRECT ---"
Write-Output ("station      : " + $o.stationID)
Write-Output ("neighborhood : " + $o.neighborhood)
Write-Output ("software     : " + $o.softwareType)
Write-Output ("qcStatus     : " + $o.qcStatus + "   (1=passed, 0=none, -1=failed)")
Write-Output ("obsTimeLocal : " + $o.obsTimeLocal)

# ---- 2. Staleness -------------------------------------------------------
$obsUtc = [datetimeoffset]::FromUnixTimeSeconds([int64]$o.epoch).UtcDateTime
$ageMin = [math]::Round(((Get-Date).ToUniversalTime() - $obsUtc).TotalMinutes, 1)
Write-Output ""
Write-Output "--- 2. STALENESS ---"
Write-Output ("age of newest observation: $ageMin minutes")
if ($ageMin -gt 60) { Write-Output "FAIL: station has not uploaded in over an hour"; $fail++ }
elseif ($ageMin -gt 20) { Write-Output "WARN: upload gap over 20 minutes"; }
else { Write-Output "OK: station is uploading now" }

# ---- 3. Per-sensor ------------------------------------------------------
Write-Output ""
Write-Output "--- 3. SENSORS ---"
$imp = $o.imperial
$sensors = [ordered]@{
    'temp'         = $imp.temp
    'dewpt'        = $imp.dewpt
    'heatIndex'    = $imp.heatIndex
    'windChill'    = $imp.windChill
    'pressure'     = $imp.pressure
    'windSpeed'    = $imp.windSpeed
    'windGust'     = $imp.windGust
    'precipRate'   = $imp.precipRate
    'precipTotal'  = $imp.precipTotal
    'humidity'     = $o.humidity
    'winddir'      = $o.winddir
    'solarRadiation' = $o.solarRadiation
    'uv'           = $o.uv
}
foreach ($n in $sensors.Keys) {
    $v = $sensors[$n]
    if ($null -eq $v) { Write-Output ("  {0,-15} NULL  <-- sensor not reporting" -f $n); $fail++ }
    else { Write-Output ("  {0,-15} {1}" -f $n, $v) }
}

# ---- 4. Seven-day history ----------------------------------------------
Write-Output ""
Write-Output "--- 4. LAST 7 DAYS (gaps = missed days) ---"
$url7 = "https://api.weather.com/v2/pws/dailysummary/7day?stationId=$station&format=json&units=e&apiKey=$key"
try {
    $r7 = Invoke-RestMethod -Uri $url7 -TimeoutSec 25
    Write-Output ("days returned: " + $r7.summaries.Count + " of 7")
    if ($r7.summaries.Count -lt 7) { Write-Output "WARN: fewer than 7 days - station missed whole days"; }
    foreach ($d in $r7.summaries) {
        Write-Output ("  {0}  hi {1,-5} lo {2,-5} rain {3,-5} windHi {4}" -f `
            $d.obsTimeLocal.Substring(0,10), $d.imperial.tempHigh, $d.imperial.tempLow, `
            $d.imperial.precipTotal, $d.imperial.windspeedHigh)
    }
} catch {
    Write-Output ("WARN: 7-day summary call failed - " + $_.Exception.Message)
}

# ---- 5. The app's own endpoint -----------------------------------------
Write-Output ""
Write-Output "--- 5. LIVE APP /api/weather ---"
try {
    $app = Invoke-RestMethod -Uri 'https://toro1-5rz.pages.dev/api/weather' -TimeoutSec 25
    if ($app.station -eq $station -and $app.neighborhood) {
        Write-Output ("OK: app is serving REAL station data (station=" + $app.station + ", obs=" + $app.obsTimeLocal + ")")
    } else {
        Write-Output "FAIL: app is NOT on the WU path - it fell through to the Open-Meteo fallback"
        Write-Output ($app | ConvertTo-Json -Compress)
        $fail++
    }
} catch {
    Write-Output ("FAIL: app endpoint errored - " + $_.Exception.Message)
    $fail++
}

Write-Output ""
if ($fail -eq 0) { Write-Output "RESULT: ALL CHECKS PASSED"; exit 0 }
else { Write-Output "RESULT: $fail CHECK(S) FAILED"; exit 1 }
