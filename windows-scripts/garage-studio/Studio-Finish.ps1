# GARAGE STUDIO - ONE COMMAND THAT FINISHES THE BENCH. Run at the ACER'S OWN KEYBOARD:
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\jeffl\Studio-Finish.ps1
#
# Plug in the Dell's VGA cable and the Kiyo Pro FIRST, then run this.
#
# It adds ONLY the display half - nothing else in the repo does displays. It then CHAINS the
# two scripts that already exist and are already proven, instead of re-implementing them:
#   Test-StudioAcer.ps1    - records a real Kiyo clip, measures the mic, tests the 24800 LISTENER
#   Studio-Voice-Check.ps1 - the talk-to-Claude path
# (Searched first: Search-HCC.ps1 "studio display primary monitor resolution script" -> no
#  display tooling exists anywhere in the record. Both chained scripts were read before writing.)
#
# SCOPE: the bench only. It reads and sets Windows display modes on THIS laptop and nothing
# else. It touches no Home Assistant entity, no house device, and no other subsystem.
#
# What it changes, and both are reversible in Settings > System > Display:
#   1. the Dell on the VGA socket -> its NATIVE resolution
#   2. the 32in -> the PRIMARY screen, so the taskbar and new windows land on the big screen
#      (pass -KeepPrimary to leave that alone)
#
# Measured 2026-11-13: the Acer is an Aspire E5-576, 3 GPU pipes, 2 used (internal 1366x768 +
# SZM 32in 1920x1080 on HDMI at 125%). Its VGA socket is fed by an ONBOARD DP->VGA chip, so it
# reports as a DisplayPort lane and NEVER as HD15 - do not read that as "no VGA port".
param([switch]$KeepPrimary, [switch]$SkipWebcam, [switch]$SkipVoice)
$ErrorActionPreference = 'Continue'
$script:pass = 0; $script:fail = 0; $script:warn = 0
function P($m, $d) { $script:pass++; Write-Host ("  PASS  " + $m.PadRight(34) + ' ' + $d) -ForegroundColor Green }
function F($m, $d) { $script:fail++; Write-Host ("  FAIL  " + $m.PadRight(34) + ' ' + $d) -ForegroundColor Red }
function W($m, $d) { $script:warn++; Write-Host ("  WARN  " + $m.PadRight(34) + ' ' + $d) -ForegroundColor Yellow }
function I($m)     { Write-Host ("        " + $m) -ForegroundColor DarkGray }

Write-Host ""
Write-Host "=== GARAGE STUDIO - FINISH THE BENCH ===" -ForegroundColor Cyan
Write-Host ("    " + (Get-Date -Format 'ddd yyyy-MM-dd h:mm tt') + "   host " + $env:COMPUTERNAME)
Write-Host ""

# --- rule 0: an SSH session sees a session-0 stub desktop, never the real one.
if ([bool]$env:SSH_CONNECTION -or [bool]$env:SSH_CLIENT) {
  F "at the real keyboard" "NO - SSH session. Display calls here hit the session-0 stub."
  I "Measured 2026-11-13: over SSH, AllScreens reports one 'WinDisc' 1024x768 that does not exist."
  I "Run this at the Acer's own keyboard. Stopping before changing anything."
  exit 1
}
P "at the real keyboard" ("session " + (Get-Process -Id $PID).SessionId)

$code = @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class Disp {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
  public struct DEVMODE {
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string dmDeviceName;
    public ushort dmSpecVersion, dmDriverVersion, dmSize, dmDriverExtra;
    public uint dmFields;
    public int dmPositionX, dmPositionY;
    public uint dmDisplayOrientation, dmDisplayFixedOutput;
    public short dmColor, dmDuplex, dmYResolution, dmTTOption, dmCollate;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string dmFormName;
    public ushort dmLogPixels;
    public uint dmBitsPerPel, dmPelsWidth, dmPelsHeight, dmDisplayFlags, dmDisplayFrequency,
                dmICMMethod, dmICMIntent, dmMediaType, dmDitherType, dmReserved1, dmReserved2,
                dmPanningWidth, dmPanningHeight; }
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
  public struct DISPLAY_DEVICE {
    public uint cb;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)]  public string DeviceName;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceString;
    public uint StateFlags;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceID;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst=128)] public string DeviceKey; }

  [DllImport("user32.dll", CharSet=CharSet.Ansi)]
  public static extern bool EnumDisplayDevices(string dev, uint n, ref DISPLAY_DEVICE dd, uint f);
  [DllImport("user32.dll", CharSet=CharSet.Ansi)]
  public static extern bool EnumDisplaySettings(string dev, int mode, ref DEVMODE dm);
  [DllImport("user32.dll", CharSet=CharSet.Ansi)]
  public static extern int ChangeDisplaySettingsEx(string dev, ref DEVMODE dm, IntPtr h, uint f, IntPtr p);
  [DllImport("user32.dll")]
  public static extern int ChangeDisplaySettingsEx(IntPtr dev, IntPtr dm, IntPtr h, uint f, IntPtr p);

  const uint ATTACHED = 0x1, PRIMARY = 0x4;
  const uint UPDATEREGISTRY = 0x01, NORESET = 0x10000, SET_PRIMARY = 0x10;
  const uint F_POSITION = 0x20, F_WIDTH = 0x80000, F_HEIGHT = 0x100000, F_BPP = 0x40000, F_FREQ = 0x400000;

  static DISPLAY_DEVICE NewDD() {
    DISPLAY_DEVICE d = new DISPLAY_DEVICE();
    d.cb = (uint)Marshal.SizeOf(typeof(DISPLAY_DEVICE)); return d; }

  public static DEVMODE Cur(string dev) {
    DEVMODE dm = new DEVMODE(); dm.dmSize = (ushort)Marshal.SizeOf(typeof(DEVMODE));
    EnumDisplaySettings(dev, -1, ref dm); return dm; }

  public static List<string> Active() {
    List<string> r = new List<string>();
    DISPLAY_DEVICE dd = NewDD();
    for (uint i = 0; EnumDisplayDevices(null, i, ref dd, 0); i++) {
      if ((dd.StateFlags & ATTACHED) != 0) r.Add(dd.DeviceName);
      dd = NewDD(); }
    return r; }

  public static string MonitorOf(string dev) {
    DISPLAY_DEVICE dd = NewDD();
    if (EnumDisplayDevices(dev, 0, ref dd, 0)) return dd.DeviceString + "   " + dd.DeviceID;
    return "(no monitor attached to this output)"; }

  public static bool IsPrimary(string dev) {
    DISPLAY_DEVICE dd = NewDD();
    for (uint i = 0; EnumDisplayDevices(null, i, ref dd, 0); i++) {
      if (dd.DeviceName == dev) return (dd.StateFlags & PRIMARY) != 0;
      dd = NewDD(); }
    return false; }

  // largest 32bpp mode this output advertises, highest refresh at that size
  public static uint[] Best(string dev) {
    DEVMODE dm = new DEVMODE(); dm.dmSize = (ushort)Marshal.SizeOf(typeof(DEVMODE));
    uint bw = 0, bh = 0, bf = 0;
    for (int i = 0; EnumDisplaySettings(dev, i, ref dm); i++) {
      if (dm.dmBitsPerPel == 32) {
        if ((ulong)dm.dmPelsWidth * dm.dmPelsHeight > (ulong)bw * bh ||
            (dm.dmPelsWidth == bw && dm.dmPelsHeight == bh && dm.dmDisplayFrequency > bf)) {
          bw = dm.dmPelsWidth; bh = dm.dmPelsHeight; bf = dm.dmDisplayFrequency; } }
      dm = new DEVMODE(); dm.dmSize = (ushort)Marshal.SizeOf(typeof(DEVMODE)); }
    return new uint[] { bw, bh, bf }; }

  public static int SetMode(string dev, uint w, uint h, uint hz) {
    DEVMODE dm = Cur(dev);
    dm.dmPelsWidth = w; dm.dmPelsHeight = h; dm.dmBitsPerPel = 32;
    dm.dmFields = F_WIDTH | F_HEIGHT | F_BPP;
    if (hz > 0) { dm.dmDisplayFrequency = hz; dm.dmFields |= F_FREQ; }
    int rc = ChangeDisplaySettingsEx(dev, ref dm, IntPtr.Zero, UPDATEREGISTRY | NORESET, IntPtr.Zero);
    Commit(); return rc; }

  // every other screen shifts by the same delta, so the desktop keeps its shape
  public static int MakePrimary(string dev) {
    DEVMODE t = Cur(dev);
    int dx = -t.dmPositionX, dy = -t.dmPositionY, worst = 0;
    foreach (string d in Active()) {
      DEVMODE dm = Cur(d);
      dm.dmPositionX += dx; dm.dmPositionY += dy;
      dm.dmFields = F_POSITION;
      uint f = UPDATEREGISTRY | NORESET;
      if (d == dev) f |= SET_PRIMARY;
      int rc = ChangeDisplaySettingsEx(d, ref dm, IntPtr.Zero, f, IntPtr.Zero);
      if (rc != 0) worst = rc; }
    Commit(); return worst; }

  public static void Commit() {
    ChangeDisplaySettingsEx(IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, 0, IntPtr.Zero); }
}
'@
try { Add-Type -TypeDefinition $code -ErrorAction Stop }
catch { F "display API" ("Add-Type failed: " + $_.Exception.Message); exit 1 }

# ------------------------------------------------------------------ the screens
Write-Host ""
Write-Host "--- SCREENS ---" -ForegroundColor Cyan
$active = [Disp]::Active()
$dell = $null; $big = $null
foreach ($d in $active) {
  $dm = [Disp]::Cur($d); $b = [Disp]::Best($d)
  $tag = ''
  if ([Disp]::IsPrimary($d)) { $tag = "  <-- PRIMARY" }
  Write-Host ("  " + $d + "   " + $dm.dmPelsWidth + "x" + $dm.dmPelsHeight + " @" + $dm.dmDisplayFrequency +
              "Hz   pos=" + $dm.dmPositionX + "," + $dm.dmPositionY + "   best=" + $b[0] + "x" + $b[1] + $tag)
  I ([Disp]::MonitorOf($d))
  if ($b[0] -eq 1920 -and $b[1] -eq 1080) { $big = $d }
  elseif ($b[0] -eq 1366) { }                       # the internal panel - leave it alone
  else { $dell = $d }
}
Write-Host ""

if ($active.Count -ge 3) {
  P "three screens attached" ($active.Count.ToString() + " outputs - the Dell is live on the VGA socket")
} else {
  W "the Dell is not detected" ($active.Count.ToString() + " outputs attached, expected 3")
  I "VGA plug fully seated with BOTH thumbscrews snug, and the Dell POWERED ON."
  I "A VGA lane stays invisible to Windows until the monitor answers with an EDID - a dark monitor does not exist."
  I "If it still does not show: Win+P -> Extend, then re-run this script."
}

# the Dell -> native resolution
if ($dell) {
  $dm = [Disp]::Cur($dell); $b = [Disp]::Best($dell)
  if ($b[0] -gt 0 -and ($dm.dmPelsWidth -ne $b[0] -or $dm.dmPelsHeight -ne $b[1])) {
    $rc = [Disp]::SetMode($dell, $b[0], $b[1], $b[2])
    Start-Sleep -Seconds 2
    $now = [Disp]::Cur($dell)
    if ($now.dmPelsWidth -eq $b[0] -and $now.dmPelsHeight -eq $b[1]) {
      P "Dell set to its native mode" ($b[0].ToString() + "x" + $b[1] + " @" + $b[2] + "Hz")
    } else {
      F "Dell resolution change" ("asked " + $b[0] + "x" + $b[1] + ", got " + $now.dmPelsWidth + "x" + $now.dmPelsHeight + "  rc=" + $rc)
    }
  } else {
    P "Dell already at its best mode" ($dm.dmPelsWidth.ToString() + "x" + $dm.dmPelsHeight)
  }
}

# the 32in -> primary
if ($big) {
  if ([Disp]::IsPrimary($big)) {
    P "32in is the primary screen" $big
  } elseif ($KeepPrimary) {
    W "32in is not primary" "-KeepPrimary passed, left alone"
  } else {
    $rc = [Disp]::MakePrimary($big)
    Start-Sleep -Seconds 2
    if ([Disp]::IsPrimary($big)) {
      P "32in made the primary screen" "taskbar and new windows now open on the big screen"
      I "Undo: Settings > System > Display > pick the other screen > 'Make this my main display'."
    } else {
      W "could not make the 32in primary" ("ChangeDisplaySettingsEx rc=" + $rc + " - DO IT BY HAND, 2 clicks")
      I "Settings > System > Display > click the 32in box > tick 'Make this my main display'."
      I "KNOWN AND MEASURED 2026-11-13 9:20-9:23 AM on this laptop, not a surprise:"
      I "  legacy ChangeDisplaySettingsEx returns -4 DISP_CHANGE_NOTUPDATED on all 5 flag variants,"
      I "  and the modern CCD route (SetDisplayConfig) returns rc=0 yet GDI silently rearranges the"
      I "  source positions back - its own docs warn it does that. Everything else here still works."
    }
  }
} else {
  W "no 1920x1080 screen found" "expected the SZM 32in on HDMI"
}

# the dead dongle is stealing a port the Kiyo needs
$ms = Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue | Where-Object { $_.InstanceId -match 'VID_534D' }
if ($ms) {
  W "dead MacroSilicon dongle attached" "MS912x - bound to NO driver; none exists for this chip"
  I "UNPLUG IT. It occupies a USB port the Kiyo Pro needs. Closed with proof in OPEN_ITEMS #284."
} else {
  P "MacroSilicon dongle not attached" "no VID_534D device present"
}

Write-Host ""
Write-Host ("=== DISPLAYS: " + $script:pass + " pass, " + $script:fail + " fail, " + $script:warn + " warn ===") -ForegroundColor Cyan

# ------------------------------------------------------------------ chain the proven scripts
function RunIfPresent($label, $name, $skip) {
  if ($skip) { I ("skipping " + $label); return }
  $p = Join-Path $env:USERPROFILE $name
  if (-not (Test-Path $p)) { $p = Join-Path $PSScriptRoot $name }
  if (Test-Path $p) {
    Write-Host ""
    Write-Host ("--- " + $label + "  (" + $name + ") ---") -ForegroundColor Cyan
    & powershell -NoProfile -ExecutionPolicy Bypass -File $p
  } else {
    W ($name + " not found") "looked in your profile and beside this script"
  }
}
RunIfPresent 'WEBCAM / MIC / DESKFLOW LISTENER' 'Test-StudioAcer.ps1'    $SkipWebcam
RunIfPresent 'TALK TO CLAUDE'                   'Studio-Voice-Check.ps1' $SkipVoice

Write-Host ""
Write-Host "THE LAST STEP - the only thing nothing can do for you:" -ForegroundColor Yellow
Write-Host "    claude      then  /voice      then hold SPACE and talk" -ForegroundColor Yellow
I "/voice is hidden over SSH by design, so that one press has to happen at the bench."
Write-Host ""
