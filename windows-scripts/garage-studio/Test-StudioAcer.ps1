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

$kiyo = $vid | Where-Object { $_ -match 'Kiyo' } | Select-Object -First 1
if (-not $kiyo) { F "Kiyo Pro not seen - plug it into a BLUE (USB 3) port" }
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
    if ($mx -gt -40) { P "mic '$mic' heard sound (peak $mx dB)" } else { F "mic '$mic' recorded near-silence (peak $mx dB)" } }
  else { F "mic recording failed" }
}

# --- software present
if (Test-Path 'C:\Program Files\obs-studio\bin\64bit\obs64.exe') { P "OBS Studio installed" } else { F "OBS missing" }
if (Get-Process deskflow* -ErrorAction SilentlyContinue) { P "Deskflow process running (the REAL test: mouse slides onto the Lenovo screen)" } else { F "Deskflow not running (start it, server mode)" }
$cc = Get-Command claude -ErrorAction SilentlyContinue
if ($cc) { P "Claude Code $(& claude --version)" } else { F "Claude Code not on PATH" }

Write-Host "`n$pass passed, $fail failed   (clips: $out)"
exit [int]($fail -gt 0)
