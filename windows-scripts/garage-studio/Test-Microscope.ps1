# GARAGE LAB - USB microscope: identify it, then MEASURE WHAT IT ACTUALLY IS.
# Run ON THE ACER, after plugging the scope into a USB port:
#   powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\jeffl\Test-Microscope.ps1
#
# SEARCHED FIRST (2026-11-14, Search-HCC.ps1 "microscope" + "USB camera identify DirectShow"):
#   nothing in the record identifies a USB camera by vendor id. Test-StudioAcer.ps1 does it for the
#   Kiyo ONLY and hardcodes its dshow name. This is the generic version. Nothing else overlaps.
#
# WHY IT EXISTS: DirectShow on the Acer already calls the Razer Kiyo Pro the generic
# "USB Video Device" - its real identity shows up only in PnP (VID_1532). A no-name UVC microscope
# will very likely enumerate with the SAME generic name. Two identical names = OBS silently binds
# the wrong camera. So identity is resolved from the PnP vendor id, never from the name.
#
# It also MEASURES real capability instead of trusting "40 to 1000x / 8 LED" box copy: the sensor
# modes ffmpeg reports, and a real frame on disk to look at.
# NOTHING IS CHANGED. No light is fired, no sound is made, no setting is written.
$ErrorActionPreference = 'Continue'
$out = Join-Path ([Environment]::GetFolderPath('MyVideos')) 'studio-tests'
New-Item -ItemType Directory -Force $out | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$script:pass = 0; $script:fail = 0
function P($m) { $script:pass++; Write-Host "  PASS  $m" -ForegroundColor Green }
function F($m) { $script:fail++; Write-Host "  FAIL  $m" -ForegroundColor Red }
function I($m) { Write-Host "  INFO  $m" -ForegroundColor Yellow }

Write-Host ""
Write-Host "=== GARAGE LAB - USB MICROSCOPE ===" -ForegroundColor Cyan
Write-Host ("    " + (Get-Date -Format 'ddd yyyy-MM-dd h:mm tt') + "   host " + $env:COMPUTERNAME)
Write-Host ""

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  F "ffmpeg is not on PATH - every measurement below needs it"; Write-Host ""; exit 1
}

# ---- 1. every camera PnP can see, with its vendor id
$cams = @(Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue |
          Where-Object { $_.Class -eq 'Camera' -and $_.Status -eq 'OK' })
Write-Host "  cameras PnP reports:"
foreach ($c in $cams) {
  $v = if ($c.InstanceId -match 'VID_([0-9A-Fa-f]{4})') { $Matches[1] } else { '????' }
  Write-Host ("    VID_{0}  {1}" -f $v, $c.FriendlyName)
}

# The scope = a camera that is NOT Razer (1532) and NOT the laptop's built-in panel cam.
$scopePnp = @($cams | Where-Object { $_.InstanceId -notmatch 'VID_1532' -and
                                     $_.FriendlyName -notmatch 'HD WebCam|Integrated|Internal' })
if ($scopePnp.Count -eq 0) {
  F "no third camera present - the scope is not plugged in, or Windows has not enumerated it"
  I "if the LEDs light but nothing appears here, suspect the cable/port, not the scope"
  Write-Host ""; Write-Host "$script:pass passed, $script:fail failed"; exit 1
}
if ($scopePnp.Count -gt 1) {
  I ("more than one candidate: " + (($scopePnp | ForEach-Object FriendlyName) -join ' | '))
}
$scopeVid = if ($scopePnp[0].InstanceId -match 'VID_([0-9A-Fa-f]{4})') { $Matches[1] } else { '????' }
P ("microscope present in PnP: '{0}'  VID_{1}" -f $scopePnp[0].FriendlyName, $scopeVid)
I ("WRITE VID_{0} DOWN - that is the scope's permanent identity; its NAME is not." -f $scopeVid)

# ---- 2. what DirectShow calls it, and whether the name collides with the Kiyo
$list = & ffmpeg -hide_banner -list_devices true -f dshow -i dummy 2>&1 | Out-String
$vid  = [regex]::Matches($list, '"([^"]+)"\s+\(video\)') | ForEach-Object { $_.Groups[1].Value }
Write-Host ("  DirectShow video devices: " + ($vid -join '  |  '))
$dupes = @($vid | Group-Object | Where-Object { $_.Count -gt 1 })
if ($dupes.Count) {
  F ("NAME COLLISION - DirectShow lists '{0}' {1} times. OBS CANNOT tell them apart by name and will bind whichever it finds first. In OBS pick the source by its DEVICE PATH (the entry containing usb#vid_...), not the friendly name." -f $dupes[0].Name, $dupes[0].Count)
} else {
  P "no duplicate DirectShow names - each camera is safely bindable by name"
}

$kiyoName = $vid | Where-Object { $_ -match 'Kiyo|Razer' } | Select-Object -First 1
$cand = @($vid | Where-Object { $_ -notmatch 'HD WebCam|Integrated|Internal' -and $_ -ne $kiyoName })
$scope = $cand | Select-Object -First 1
if (-not $scope) {
  F "PnP sees the scope but DirectShow exposes no usable device for it - that is a driver/filter problem, NOT a cable problem"
  Write-Host ""; Write-Host "$script:pass passed, $script:fail failed"; exit 1
}
I ("using DirectShow device: '{0}'" -f $scope)

# ---- 3. THE REAL CAPABILITY - what the sensor actually offers
Write-Host ""
Write-Host "  --- what the sensor ACTUALLY supports (not the box claims) ---" -ForegroundColor Cyan
$opts = & ffmpeg -hide_banner -f dshow -list_options true -i "video=$scope" 2>&1 | Out-String
$modes = [regex]::Matches($opts, 'max s=(\d+)x(\d+) fps=([\d.]+)') |
         ForEach-Object { "{0}x{1} @ {2}fps" -f $_.Groups[1].Value, $_.Groups[2].Value, $_.Groups[3].Value } |
         Select-Object -Unique
if ($modes) {
  $modes | ForEach-Object { Write-Host ("      " + $_) }
  $best = [regex]::Matches($opts,'max s=(\d+)x(\d+)') |
          ForEach-Object { [int]$_.Groups[1].Value } | Sort-Object -Descending | Select-Object -First 1
  if ($best -ge 1280) { P "max width ${best}px - 720p or better; good enough for board work on the Dell" }
  else { I "max width ${best}px - a low-res sensor. Fine on the Dell; it will look soft blown up on the 32in." }
} else {
  I "ffmpeg listed no modes - it will negotiate a default; not a fault by itself"
}

# ---- 4. a real frame, saved so it can be looked at
$png = Join-Path $out "scope-$stamp.png"
& ffmpeg -hide_banner -loglevel error -f dshow -rtbufsize 256M -i "video=$scope" -frames:v 1 -y $png 2>&1 | Out-Null
if ((Test-Path $png) -and (Get-Item $png).Length -gt 10KB) {
  P ("real frame captured: {0} ({1} KB) - OPEN IT and judge focus before building anything around it" -f $png, [math]::Round((Get-Item $png).Length/1KB))
} else {
  F "no frame captured from '$scope' - the device enumerates but will not deliver video"
}

# ---- 5. how bright is it through the scope (the built-in LEDs are a MANUAL wheel)
$raw = & ffmpeg -hide_banner -f dshow -i "video=$scope" -frames:v 12 `
       -vf "signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null NUL 2>&1 | Out-String
$vals = [regex]::Matches($raw,'lavfi\.signalstats\.YAVG=([\d.]+)') | ForEach-Object { [double]$_.Groups[1].Value }
if ($vals.Count) {
  $avg = ($vals | Measure-Object -Average).Average
  I ("scope image luma YAVG {0:N1} / 255 ({1:N0} %) - the on-barrel LED wheel is MANUAL, so this is whatever it was last set to. The lab light grid cannot change it." -f $avg, ($avg/255*100))
} else {
  I "no luma reading off the scope feed"
}

Write-Host ""
Write-Host "$script:pass passed, $script:fail failed   (frames in $out)"
Write-Host ""
Write-Host "  NEXT, once this is green:" -ForegroundColor Cyan
Write-Host "    OBS -> Sources -> Video Capture Device -> pick the scope (BY PATH if the name collided)"
Write-Host "    then right-click the preview -> Fullscreen Projector -> the DELL."
Write-Host "    That is the AD409 build - except the Acer can also record it and show it to Claude."
exit [int]($script:fail -gt 0)
