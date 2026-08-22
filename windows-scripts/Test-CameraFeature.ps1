<#
  Test-CameraFeature.ps1  —  built 2026-08-22

  WHY THIS EXISTS — the most expensive habit on this project:

    Verify-CameraStreams.ps1 pulls RTSP frames and prints "ALL GOOD".
    On 2026-08-21 it printed ALL GOOD at 16:08 — eleven minutes AFTER a change had
    silently killed the TV popups. The check was not wrong; it was the wrong
    instrument. A stream check CANNOT detect "the popup never fires."

    Green components, dead feature. That is what has made the cameras feel broken
    ~8 times while every health check passed.

  THIS tests the FEATURE end to end: it fires a real codeproject_ai.object_detected
  event into the live chain, then ASSERTS that the popup automation and the phone
  notify automation actually ran.

  Run on 08-21 at 16:09 this would have FAILED instantly and the regression would
  never have reached the evening.

  WARNING: produces ONE real TV popup and ONE real phone notification. That IS the
  proof. Do not run it in a loop.

  Usage:  .\Test-CameraFeature.ps1
          .\Test-CameraFeature.ps1 -Camera front_right
#>

param(
    [string]$Camera = '301_driveway',
    [string]$ObjectType = 'person'
)

$HaUrl  = 'http://192.168.1.66:8123'
$Secret = Join-Path $env:USERPROFILE 'HCC-secrets\ha_backup_token.txt'

$POPUP  = 'automation.hcc_ai_camera_popup_on_fire_tv'
$NOTIFY = 'automation.ai_object_detected_notify'

$h = @{ Authorization = "Bearer $((Get-Content $Secret -Raw).Trim())" }

function Get-LastTriggered($entity) {
    try { (Invoke-RestMethod -Uri "$HaUrl/api/states/$entity" -Headers $h -TimeoutSec 30).attributes.last_triggered }
    catch { $null }
}

Write-Host ""
Write-Host "=== HCC CAMERA FEATURE TEST (end-to-end, NOT a component check) ===" -ForegroundColor Cyan
Write-Host ("    {0}   camera={1}  object={2}" -f (Get-Date -Format 'dddd yyyy-MM-dd h:mm tt'), $Camera, $ObjectType)
Write-Host "    Produces ONE real TV popup and ONE phone notification. That is the proof." -ForegroundColor DarkGray
Write-Host ""

$states = Invoke-RestMethod -Uri "$HaUrl/api/states" -Headers $h -TimeoutSec 45
foreach ($e in @($POPUP, $NOTIFY)) {
    $s = $states | Where-Object { $_.entity_id -eq $e }
    if (-not $s)               { Write-Host ("  MISSING  {0}" -f $e) -ForegroundColor Red }
    elseif ($s.state -ne 'on') { Write-Host ("  DISABLED {0} is '{1}' - the feature is OFF" -f $e, $s.state) -ForegroundColor Red }
    else                       { Write-Host ("  enabled  {0}" -f $e) -ForegroundColor DarkGray }
}

$beforePopup  = Get-LastTriggered $POPUP
$beforeNotify = Get-LastTriggered $NOTIFY

$ev = @{
    entity_id   = "image_processing.codeproject_ai_object_${Camera}_clipframe"
    object_type = $ObjectType
    name        = $ObjectType
    confidence  = 94.7
    box_area    = 0.08
    centroid    = @{ x = 0.42; y = 0.55 }
    saved_file  = "/config/www/ai_snapshots/codeproject_ai_object_${Camera}_clipframe_latest.jpg"
} | ConvertTo-Json -Depth 6

Write-Host ""
Write-Host "  firing codeproject_ai.object_detected ..." -ForegroundColor DarkGray
Invoke-RestMethod -Uri "$HaUrl/api/events/codeproject_ai.object_detected" -Headers $h -Method Post `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($ev)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 30 | Out-Null
Start-Sleep -Seconds 6

$popupRan  = ((Get-LastTriggered $POPUP)  -ne $beforePopup)
$notifyRan = ((Get-LastTriggered $NOTIFY) -ne $beforeNotify)

Write-Host ""
Write-Host ("  TV popup automation    : {0}" -f $(if ($popupRan)  { 'FIRED' } else { 'DID NOT FIRE' })) -ForegroundColor $(if ($popupRan)  { 'Green' } else { 'Red' })
Write-Host ("  phone notify automation: {0}" -f $(if ($notifyRan) { 'FIRED' } else { 'DID NOT FIRE' })) -ForegroundColor $(if ($notifyRan) { 'Green' } else { 'Red' })
Write-Host ""

if ($popupRan -and $notifyRan) {
    Write-Host "  PASS - the feature works end to end." -ForegroundColor Green
    Write-Host "  Confirm with your eyes: a popup with a RED BOX should be on the TV now." -ForegroundColor Green
    Write-Host "  (Fire TV powered off = PiPup has no screen. That is not a fault.)" -ForegroundColor DarkGray
} else {
    Write-Host "  FAIL - a detection did NOT reach the TV and/or the phone." -ForegroundColor Red
    Write-Host "  DO NOT report the cameras as working. Likely causes, in order:" -ForegroundColor Red
    Write-Host "    1. A CONDITION on the popup automation is filtering everything out." -ForegroundColor Yellow
    Write-Host "       (This is exactly what happened 08-21: a person-only filter killed every popup.)" -ForegroundColor Yellow
    Write-Host "    2. The automation is disabled - see the lines above." -ForegroundColor Yellow
    Write-Host "    3. rest_command.pipup_notify or the notify service is broken." -ForegroundColor Yellow
}
Write-Host ""
Write-Host "  Verify-CameraStreams.ps1 checks the PLUMBING. This checks the FEATURE." -ForegroundColor DarkGray
Write-Host "  Run BOTH before telling Jeff the cameras work." -ForegroundColor DarkGray
Write-Host ""
