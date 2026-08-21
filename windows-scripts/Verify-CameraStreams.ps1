<#
.SYNOPSIS
    Health check for the HCC camera popup pipeline (Apple TV / HomeKit).

.DESCRIPTION
    Run this BEFORE touching anything in the camera stack, and again after.
    It proves, end to end, that the Apple TV popup path is intact:

      annotated red-box JPEG  ->  go2rtc (RTSP on the beast)  ->  HA generic camera
      ->  HomeKit bridge  ->  Apple TV popup

    WHY THIS EXISTS (2026-08-21): Apple TV answers a HomeKit doorbell ring by
    demanding a LIVE VIDEO STREAM. The old camera.ai_* entities were local_file
    STILLS, so HA logged "Camera has no stream source", tvOS sat through a 30 s
    timeout and then showed a still with NO red boxes. That was Jeff's spinning
    circle. go2rtc republishes the annotated frame as real H264 RTSP, which fixed it.

    Jeff's words when it finally worked: "That worked freaking perfect. It's the best
    one ever and it was fast as soon as I got the warning it popped up on the TV."

    DO NOT "simplify" this by pointing HomeKit back at the local_file cameras.
    That is the bug, not the fix.
#>

$ErrorActionPreference = 'SilentlyContinue'
$go2rtcDir = 'C:\Users\jeffl\HCC-Scripts\go2rtc'
$ffmpeg    = "$go2rtcDir\ffmpeg.exe"
$beast     = '192.168.1.194'
$streams   = 'driveway','backyard','front_doorbell','front_right','back_left','garage'

Write-Host "`n=== HCC CAMERA STREAM HEALTH CHECK ===" -ForegroundColor Cyan
Write-Host "    $(Get-Date -Format 'dddd yyyy-MM-dd h:mm tt')`n"

# 1. go2rtc process
$p = Get-Process go2rtc -ErrorAction SilentlyContinue
if ($p) {
    Write-Host ("go2rtc          RUNNING  pid {0}  {1}" -f $p.Id, $p.Path) -ForegroundColor Green
} else {
    Write-Host "go2rtc          *** NOT RUNNING - every popup will spin for 30s ***" -ForegroundColor Red
    Write-Host "                fix: Start-ScheduledTask -TaskName 'HCC go2rtc camera streams'" -ForegroundColor Yellow
}

# 2. the startup task (this is what makes it survive a reboot)
$task = Get-ScheduledTask -TaskName 'HCC go2rtc camera streams' -ErrorAction SilentlyContinue
if ($task) {
    Write-Host ("startup task    {0}" -f $task.State) -ForegroundColor Green
} else {
    Write-Host "startup task    *** MISSING - go2rtc will NOT come back after a reboot ***" -ForegroundColor Red
}

# 3. CodeProject.AI - no detections at all without it
try {
    $ping = Invoke-RestMethod "http://127.0.0.1:32168/v1/status/ping" -TimeoutSec 5
    if ($ping.success) { Write-Host "CodeProject.AI  UP" -ForegroundColor Green }
    else { Write-Host "CodeProject.AI  answered but not OK" -ForegroundColor Red }
} catch {
    Write-Host "CodeProject.AI  *** DOWN - no detections, so no popups at all ***" -ForegroundColor Red
}

# 4. every RTSP stream must actually hand over a frame
Write-Host "`n--- RTSP streams (pulling one real frame each) ---"
$bad = @()
foreach ($s in $streams) {
    $out = "$env:TEMP\hccverify_$s.jpg"
    Remove-Item $out -Force -ErrorAction SilentlyContinue
    $t = Start-Process -FilePath $ffmpeg -ArgumentList '-rtsp_transport','tcp','-i',"rtsp://$beast`:8554/$s",'-frames:v','1','-y',$out `
         -NoNewWindow -PassThru -RedirectStandardError "$env:TEMP\hccverify_$s.err"
    $t | Wait-Process -Timeout 40 -ErrorAction SilentlyContinue
    if (-not $t.HasExited) { $t | Stop-Process -Force }
    if (Test-Path $out) {
        Write-Host ("  {0,-16} OK   {1,6} KB" -f $s, [math]::Round((Get-Item $out).Length/1KB,0)) -ForegroundColor Green
    } else {
        Write-Host ("  {0,-16} FAILED" -f $s) -ForegroundColor Red
        $bad += $s
    }
}

Write-Host ""
if ($p -and $task -and $bad.Count -eq 0) {
    Write-Host "ALL GOOD - Apple TV popups should be instant, with red boxes." -ForegroundColor Green
} else {
    Write-Host "NEEDS ATTENTION - see red lines above." -ForegroundColor Red
    if ($bad.Count) { Write-Host ("  broken streams: {0}" -f ($bad -join ', ')) -ForegroundColor Red }
}

Write-Host "`nHomeKit must point at the *_live cameras, NOT camera.ai_<name>:" -ForegroundColor Cyan
Write-Host "  camera.ai_driveway_live / ai_backyard_live / ai_front_doorbell_live"
Write-Host "  camera.ai_front_right_live / ai_back_left_live / ai_garage_live"
Write-Host "Full write-up: docs\incidents\camera_fixes_2026-08-21.md`n"
