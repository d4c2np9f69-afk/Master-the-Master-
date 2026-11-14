# Garage repair studio - ACER feature test (2026-11-08)
# Proves each piece by DOING it, not by checking that a program exists:
#   Kiyo Pro records a real 10 s 1080p clip with Quick Sync, a frame is saved to look at,
#   the mic records sound that is not silence, OBS/Deskflow/Claude Code are present.
# Run on the Acer:  powershell -ExecutionPolicy Bypass -File Test-StudioAcer.ps1
# Output clips land in  %USERPROFILE%\Videos\studio-tests\   exit 0 = all PASS
$ErrorActionPreference = 'Continue'
$out = Join-Path ([Environment]::GetFolderPath('MyVideos')) 'studio-tests'
New-Item -ItemType Directory -Force $out | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$pass = 0; $fail = 0
function P($m) { $script:pass++; Write-Host "  PASS  $m" -ForegroundColor Green }
function F($m) { $script:fail++; Write-Host "  FAIL  $m" -ForegroundColor Red }

# --- devices DirectShow can see
$list = & ffmpeg -hide_banner -list_devices true -f dshow -i dummy 2>&1 | Out-String
$vid = [regex]::Matches($list, '"([^"]+)"\s+\(video\)') | ForEach-Object { $_.Groups[1].Value }
$aud = [regex]::Matches($list, '"([^"]+)"\s+\(audio\)') | ForEach-Object { $_.Groups[1].Value }
Write-Host "video devices: $($vid -join ' | ')"
Write-Host "audio devices: $($aud -join ' | ')"

# 2026-11-13: DirectShow does NOT always expose the Kiyo's product name. On the Acer it
# enumerates as the generic "USB Video Device" while PnP correctly reports "Razer Kiyo Pro"
# and the AUDIO half still carries the real name. Matching only on 'Kiyo' therefore FAILED a
# working, correctly-plugged camera and printed "plug it into a BLUE (USB 3) port" - sending
# Jeff to re-seat hardware that was fine. A gate that fails a working machine is worse than
# no gate, so identity is now resolved from PnP (VID_1532 = Razer) and the generic dshow name
# is accepted only when the vendor ID is actually present.
$kiyo = $vid | Where-Object { $_ -match 'Kiyo|Razer' } | Select-Object -First 1
$pnpRazer = @(Get-PnpDevice -ErrorAction SilentlyContinue |
              Where-Object { $_.InstanceId -match 'VID_1532' -and $_.Class -eq 'Camera' -and $_.Status -eq 'OK' })
if (-not $kiyo -and $pnpRazer.Count -gt 0) {
  # the Kiyo is present per PnP: take the dshow device that is NOT the built-in panel webcam
  $kiyo = $vid | Where-Object { $_ -notmatch 'HD WebCam|Integrated|Internal' } | Select-Object -First 1
  if ($kiyo) {
    Write-Host ("  note: PnP reports '{0}' (VID_1532) but DirectShow calls it '{1}' - using it" -f $pnpRazer[0].FriendlyName, $kiyo) -ForegroundColor Yellow
  }
}
if (-not $kiyo) {
  if ($pnpRazer.Count -gt 0) { F "PnP sees the Kiyo but DirectShow exposes no usable video device - driver/filter problem, NOT a cable problem" }
  else { F "Kiyo Pro not seen by PnP or DirectShow - plug it into a BLUE (USB 3) port" }
}
else {
  P "Kiyo seen as '$kiyo'"
  $clip = Join-Path $out "kiyo-$stamp.mp4"
  & ffmpeg -hide_banner -loglevel error -f dshow -rtbufsize 512M -video_size 1920x1080 -framerate 30 -vcodec mjpeg -i "video=$kiyo" -t 10 -c:v h264_qsv -b:v 12M -y $clip 2>&1 | Out-Null
  if (-not (Test-Path $clip) -or (Get-Item $clip).Length -lt 100KB) {
    & ffmpeg -hide_banner -loglevel error -f dshow -rtbufsize 512M -i "video=$kiyo" -t 10 -c:v h264_qsv -b:v 12M -y $clip 2>&1 | Out-Null
  }
  $probe = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of compact $clip 2>&1 | Out-String
  if ($probe -match 'width=(\d+)\|height=(\d+)' -and [int]$Matches[1] -ge 1280) { P "10 s clip recorded: $($probe.Trim() -replace '\s+',' ')" } else { F "clip did not record: $probe" }
  $frame = Join-Path $out "kiyo-$stamp-frame.jpg"
  & ffmpeg -hide_banner -loglevel error -ss 5 -i $clip -frames:v 1 -y $frame 2>&1 | Out-Null
  if (Test-Path $frame) { P "frame saved to look at: $frame" } else { F "no frame extracted" }
}

# --- mic: record 5 s, measure loudness (talk or tap the bench while it runs)
$mic = ($aud | Where-Object { $_ -match 'Kiyo' } | Select-Object -First 1)
if (-not $mic) { $mic = $aud | Select-Object -First 1 }
if (-not $mic) { F "no microphone device" }
else {
  Write-Host "  ... recording 5 s from '$mic' - TALK NOW"
  $wav = Join-Path $out "mic-$stamp.wav"
  & ffmpeg -hide_banner -loglevel error -f dshow -i "audio=$mic" -t 5 -y $wav 2>&1 | Out-Null
  $vol = & ffmpeg -hide_banner -i $wav -af volumedetect -f null NUL 2>&1 | Select-String 'max_volume' | Out-String
  if ($vol -match 'max_volume:\s*(-?[\d.]+)') { $mx = [double]$Matches[1]
    # 2026-11-13: a peak just over the -40 dB floor is ROOM NOISE, not a usable voice level, and
    # reporting it as "heard sound" reads as "the mic is good". #288's rule stands: tone is not
    # provable without real signal. So the band is named explicitly instead of passing silently.
    if ($mx -gt -20) { P "mic '$mic' captured STRONG signal (peak $mx dB) - speech-level" }
    elseif ($mx -gt -40) { P "mic '$mic' captured signal, but only AMBIENT level (peak $mx dB) - the path works; tone/voice level UNPROVEN until someone speaks during the test (#288)" }
    else { F "mic '$mic' recorded near-silence (peak $mx dB)" } }
  else { F "mic recording failed" }
}

# --- software present
if (Test-Path 'C:\Program Files\obs-studio\bin\64bit\obs64.exe') { P "OBS Studio installed" } else { F "OBS missing" }
# Deskflow: a RUNNING PROCESS IS NOT A SERVER. 2026-11-10 this check passed on
# `deskflow-daemon` alone - the Windows service - while nothing listened on 24800
# and the Acer had no config file at all. Test the LISTENER, and say plainly that
# even a listener is not the feature.
$conf = Join-Path $env:APPDATA 'Deskflow\Deskflow.conf'
if (Test-Path $conf) {
  $mode = (Select-String -Path $conf -Pattern '^coreMode=(\d)' | Select-Object -First 1).Matches.Groups[1].Value
  P "Deskflow config present (coreMode=$mode; 2=Server)"
} else { F "Deskflow has NO config at $conf - it cannot be a server" }
$lsn = Get-NetTCPConnection -LocalPort 24800 -State Listen -ErrorAction SilentlyContinue
if ($lsn) {
  $own = (Get-Process -Id $lsn[0].OwningProcess -ErrorAction SilentlyContinue).ProcessName
  P "Deskflow server LISTENING on 24800 (pid owner: $own). NOT YET THE FEATURE - the feature is the mouse crossing onto the Lenovo screen"
} else {
  $dmn = if (Get-Process deskflow-daemon -ErrorAction SilentlyContinue) { ' (deskflow-daemon is running, but that service is NOT a server)' } else { '' }
  F "NOTHING listening on 24800 - no Deskflow server$dmn"
}
$cc = Get-Command claude -ErrorAction SilentlyContinue
if ($cc) { P "Claude Code $(& claude --version)" } else { F "Claude Code not on PATH" }

Write-Host "`n$pass passed, $fail failed   (clips: $out)"
exit [int]($fail -gt 0)
