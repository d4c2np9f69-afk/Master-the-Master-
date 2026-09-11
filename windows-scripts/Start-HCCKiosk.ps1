<#
.SYNOPSIS
    Opens the HCC dashboard full screen as a live kiosk / screensaver.

.DESCRIPTION
    Jeff, 2026-08-20: "make loewenhome.com my screen saver and if you could make it rotate
    to a different page every 1 min or so so it doesn't screen burn. But I want it to be
    live so I can use it in that mode and then X out to go back to the computer."

    A real Windows .scr screensaver dies on the first mouse move, so it can never be
    "live". This opens the site as a Chrome APP WINDOW instead: no tabs, no address bar,
    full screen, fully interactive, with an on-screen X that closes it.

    THREE THINGS THAT ARE DELIBERATE, DO NOT "TIDY" THEM AWAY:

    1. NO --user-data-dir. The kiosk runs in Jeff's NORMAL Chrome profile on purpose.
       The app keeps his Home Assistant token in localStorage, so a fresh profile would
       show "connect to Beehive" on the GUARDIAN and camera sections and the rotation
       would parade broken panels across the TV. Using his own profile inherits it.

    2. --app= (not --kiosk). Chrome only lets a page call window.close() on a window it
       owns; an --app window qualifies, so the X button genuinely closes it. Verified on
       this PC 2026-08-20 by launching a probe page that called window.close().

    3. The window title check, not a PID check. Chrome funnels windows through one
       browser process, so PIDs cannot tell one window from another. Kiosk mode sets
       document.title to "HCC KIOSK — ..." precisely so this script can find it.

.PARAMETER RotateSeconds
    Seconds per section. Default 60, matching what Jeff asked for.

.PARAMETER Force
    Open another kiosk window even if one is already up.

.EXAMPLE
    .\Start-HCCKiosk.ps1
    .\Start-HCCKiosk.ps1 -RotateSeconds 30
#>
[CmdletBinding()]
param(
    [ValidateRange(5, 3600)] [int] $RotateSeconds = 60,
    [switch] $Force
)

$ErrorActionPreference = 'Stop'
$KioskTitlePrefix = 'HCC KIOSK'

# ── Is a kiosk window already open? ────────────────────────────────────────────────
# EnumWindows over every top-level window, because Get-Process MainWindowTitle only ever
# reports ONE window per process and Chrome shares a process across all of its windows.
$sig = @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class HccWin {
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
  delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)]
  static extern int GetWindowTextW(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  static extern bool IsWindowVisible(IntPtr hWnd);
  public static List<string> Titles() {
    var list = new List<string>();
    EnumWindows(delegate(IntPtr h, IntPtr l) {
      if (IsWindowVisible(h)) {
        var sb = new StringBuilder(512);
        if (GetWindowTextW(h, sb, sb.Capacity) > 0) list.Add(sb.ToString());
      }
      return true;
    }, IntPtr.Zero);
    return list;
  }
}
'@
if (-not ('HccWin' -as [type])) { Add-Type -TypeDefinition $sig -Language CSharp }

function Test-KioskOpen {
    foreach ($t in [HccWin]::Titles()) { if ($t -like "$KioskTitlePrefix*") { return $true } }
    return $false
}

if ((-not $Force) -and (Test-KioskOpen)) {
    Write-Output 'HCC kiosk is already open - not opening a second one.'
    exit 0
}

# ── Find Chrome ────────────────────────────────────────────────────────────────────
$chromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) {
    # Edge is Chromium too and supports --app identically. Better a working kiosk on Edge
    # than a dead shortcut, which is exactly the failure Jeff asked not to have.
    $edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
              "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
            Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $edge) { Write-Error 'Neither Chrome nor Edge was found. Cannot start the kiosk.'; exit 1 }
    $chrome = $edge
    Write-Output "Chrome not found - using Edge instead: $chrome"
}

$url = 'https://loewenhome.com/?kiosk=1&rot=' + $RotateSeconds
Start-Process -FilePath $chrome -ArgumentList @(
    "--app=$url"
    '--start-fullscreen'
    '--new-window'
)

# Confirm it actually appeared rather than assuming it did.
$deadline = (Get-Date).AddSeconds(25)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 700
    if (Test-KioskOpen) { Write-Output "HCC kiosk opened (rotating every $RotateSeconds s)."; exit 0 }
}
Write-Warning 'Launched the browser, but no kiosk window appeared within 25 s. Check the network or that loewenhome.com is reachable.'
exit 2
