# GARAGE STUDIO - one command that proves the talk-to-Claude path at the bench, or says why not.
# RUN THIS AT THE ACER'S OWN KEYBOARD.  /voice is hidden over SSH by design (the binary tests
# !isSSH()), so the final press is the one thing that cannot be done for you from the Beast.
#   powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\jeffl\Studio-Voice-Check.ps1
$ErrorActionPreference = 'Continue'
$pass = 0; $fail = 0
function Chk($name, $ok, $detail) {
  if ($ok) { Write-Host ("  PASS  " + $name.PadRight(30) + $detail) -ForegroundColor Green; $script:pass++ }
  else     { Write-Host ("  FAIL  " + $name.PadRight(30) + $detail) -ForegroundColor Red;   $script:fail++ }
}
Write-Host ""
Write-Host "=== GARAGE STUDIO - TALK TO CLAUDE, BENCH CHECK ===" -ForegroundColor Cyan
Write-Host ("    " + (Get-Date -Format 'ddd yyyy-MM-dd h:mm tt') + "   host " + $env:COMPUTERNAME)
Write-Host ""

# 1. am I at the real console? /voice is HIDDEN over SSH and in remote sessions.
$isSsh = [bool]$env:SSH_CONNECTION -or [bool]$env:SSH_CLIENT
Chk "at the real keyboard" (-not $isSsh) $(if ($isSsh) { "NO - SSH session, /voice will be hidden" } else { "yes - local console" })

# 2. claude on PATH + version
$cc = Get-Command claude -ErrorAction SilentlyContinue
Chk "claude on PATH" ([bool]$cc) $(if ($cc) { ((& claude --version 2>&1 | Out-String).Trim()) } else { "not found" })

# 3. voice settings present and the right SHAPE (both key styles are valid)
$sp = Join-Path $env:USERPROFILE '.claude\settings.json'
$vOK = $false; $vTxt = "settings.json missing"
if (Test-Path $sp) {
  try {
    $o = Get-Content $sp -Raw | ConvertFrom-Json
    $vOK = ($o.voice.enabled -eq $true) -or ($o.voiceEnabled -eq $true)
    $vTxt = "enabled=" + $o.voice.enabled + "  mode=" + $o.voice.mode + "  autoSubmit=" + $o.voice.autoSubmit
  } catch { $vTxt = "settings.json is NOT valid JSON: " + $_.Exception.Message }
}
Chk "voice enabled in settings" $vOK $vTxt

# 4. Windows lets apps use the mic at all
$mp = (Get-ItemProperty 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\microphone' -ErrorAction SilentlyContinue).Value
Chk "mic allowed by Windows" ($mp -eq 'Allow') ("ConsentStore = " + $mp)

# 5. capture level - measured 2026-11-12: 85% CLIPS speech, 55% peaks -8.7 dB
$cs = @'
using System; using System.Runtime.InteropServices;
public class SVol {
  [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] internal class E { }
  [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  internal interface IEnum { int N1(); int GetDefault(int f, int r, out IDev d); }
  [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  internal interface IDev { int Activate(ref Guid i, int c, IntPtr p, [MarshalAs(UnmanagedType.IUnknown)] out object o); }
  [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
  internal interface IVol { int R(IntPtr p); int U(IntPtr p); int GC(out uint c);
    int SML(float l, Guid g); int SMLS(float l, Guid g); int GML(out float l); int GMLS(out float l); }
  static IVol V() { IDev d; var e = (IEnum)new E(); Marshal.ThrowExceptionForHR(e.GetDefault(1, 0, out d));
    Guid i = typeof(IVol).GUID; object o; Marshal.ThrowExceptionForHR(d.Activate(ref i, 23, IntPtr.Zero, out o)); return (IVol)o; }
  public static float Get() { float f; Marshal.ThrowExceptionForHR(V().GMLS(out f)); return f; }
}
'@
$lvl = $null
try { Add-Type -TypeDefinition $cs -Language CSharp -ErrorAction Stop; $lvl = [math]::Round([SVol]::Get() * 100, 0) } catch {}
Chk "capture level sane" ($null -ne $lvl -and $lvl -ge 35 -and $lvl -le 70) ("level = " + $lvl + " %  (85%+ CLIPS, measured 11-12)")

# 6. the network path transcription needs
foreach ($h in 'api.anthropic.com', 'claude.ai') {
  $r = Test-NetConnection -ComputerName $h -Port 443 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
  Chk ("reach " + $h) ([bool]$r.TcpTestSucceeded) ":443"
}

# 7. HEAR YOURSELF - the only step that tests the FEATURE'S INPUT, not a component.
Write-Host ""
Write-Host "  >>> TALK NOW for 6 seconds - normal bench voice, normal distance." -ForegroundColor Yellow
Start-Sleep -Milliseconds 700
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Chk "your voice at 16 kHz" $false "ffmpeg not on PATH" }
else {
  $dl  = & ffmpeg -hide_banner -list_devices true -f dshow -i dummy 2>&1 | Out-String
  $mic = ([regex]::Matches($dl, '"([^"]+)"\s+\(audio\)') | ForEach-Object { $_.Groups[1].Value } |
          Where-Object { $_ -notmatch '(?i)hands-free' } | Select-Object -First 1)
  $wav = Join-Path $env:TEMP 'studio-voice.wav'
  & ffmpeg -hide_banner -loglevel error -f dshow -i ("audio=" + $mic) -ar 16000 -ac 1 -t 6 -y $wav 2>&1 | Out-Null
  if (-not (Test-Path $wav)) { Chk "your voice at 16 kHz" $false ("no file from '" + $mic + "'") }
  else {
    $det = & ffmpeg -hide_banner -i $wav -af volumedetect -f null NUL 2>&1
    $mx = [double]((($det | Select-String 'max_volume:'  | Select-Object -First 1).ToString() -replace '.*max_volume:\s*', '')  -replace '\s*dB.*', '')
    $mn = [double]((($det | Select-String 'mean_volume:' | Select-Object -First 1).ToString() -replace '.*mean_volume:\s*', '') -replace '\s*dB.*', '')
    $verdict = if ($mx -ge -0.5) { "CLIPPING - turn the level DOWN" }
               elseif ($mx -lt -30) { "TOO QUIET - closer, or level UP" }
               else { "good - peak has headroom" }
    Chk "your voice at 16 kHz" ($mx -lt -0.5 -and $mx -ge -30) ("mean " + $mn + " dB  peak " + $mx + " dB -> " + $verdict)
    Write-Host ("        device: " + $mic)
  }
}

Write-Host ""
Write-Host ("  " + $pass + " passed, " + $fail + " failed") -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "  NEXT - the part only you can do, at this keyboard:" -ForegroundColor Cyan
Write-Host "    1.  cd C:\Users\jeffl\Documents\GitHub\master-the-master-"
Write-Host "    2.  claude"
Write-Host "    3.  type   /voice     -> should answer that voice mode is enabled"
Write-Host "    4.  HOLD SPACE, talk, let go. autoSubmit sends it when you release."
Write-Host ""
Write-Host "  IF /voice IS NOT IN THE SLASH LIST:" -ForegroundColor Yellow
Write-Host "    It is gated per-ACCOUNT by Anthropic (flag 'allow_voice_mode'), not by"
Write-Host "    anything on this machine. Nothing here can turn that on. Tell Claude and"
Write-Host "    we use the claude.ai tab in Edge with its mic button instead."
Write-Host ""
