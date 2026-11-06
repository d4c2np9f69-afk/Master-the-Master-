<#
.SYNOPSIS
    Opens the HCC kiosk automatically once the PC has been idle for a while.

.DESCRIPTION
    The "screensaver" half of Jeff's 2026-08-20 request. Runs quietly in the background
    from logon and opens the kiosk when he walks away.

    WHY NOT THE TASK SCHEDULER "ON IDLE" TRIGGER: Windows' own idle trigger needs BOTH no
    user input AND low CPU for its own fixed interval, it re-checks only every 15 minutes,
    and it silently refuses to fire on machines that never look idle enough. It is a
    well-known source of "it just doesn't come on sometimes". GetLastInputInfo is the same
    API the OS screensaver uses, it is exact, and the threshold is ours to set.

    RE-ARMING, which is the bit that is easy to get wrong: after the kiosk opens, the
    watcher disarms. It only re-arms once Jeff is actually active again (idle under 10 s).
    Without that, closing the kiosk while already idle would instantly reopen it and he
    could never get back to his desktop.

.PARAMETER IdleMinutes
    Minutes of no keyboard/mouse before the kiosk opens. Default 10.

.PARAMETER RotateSeconds
    Passed through to the kiosk. Default 60.

.PARAMETER Once
    Run a single check and exit. Used by the installer to prove the script works.
#>
[CmdletBinding()]
param(
    [ValidateRange(1, 240)] [int] $IdleMinutes = 10,
    [ValidateRange(5, 3600)] [int] $RotateSeconds = 60,
    [switch] $Once
)

$ErrorActionPreference = 'Stop'
$here    = Split-Path -Parent $MyInvocation.MyCommand.Path
$starter = Join-Path $here 'Start-HCCKiosk.ps1'
$logDir  = Join-Path $env:LOCALAPPDATA 'HCC'
$log     = Join-Path $logDir 'kiosk-watcher.log'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Write-Log([string] $msg) {
    $line = ('{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $msg)
    Add-Content -Path $log -Value $line -Encoding utf8
    Write-Output $line
    # Keep the log from growing forever on a machine that runs for months.
    if ((Get-Item $log).Length -gt 512KB) {
        $keep = Get-Content $log -Tail 500
        Set-Content -Path $log -Value $keep -Encoding utf8
    }
}

if (-not (Test-Path $starter)) { Write-Log "FATAL: Start-HCCKiosk.ps1 not found next to this script ($starter)"; exit 1 }

# ── Idle time, straight from Win32 ─────────────────────────────────────────────────
$idleSig = @'
using System;
using System.Runtime.InteropServices;
public class HccIdle {
  [StructLayout(LayoutKind.Sequential)]
  struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }
  [DllImport("user32.dll")] static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);
  [DllImport("kernel32.dll")] static extern uint GetTickCount();
  public static double Seconds() {
    LASTINPUTINFO lii = new LASTINPUTINFO();
    lii.cbSize = (uint)Marshal.SizeOf(lii);
    if (!GetLastInputInfo(ref lii)) return 0;
    // Unsigned subtraction, so this stays correct across the ~49-day GetTickCount wrap.
    return (double)(unchecked(GetTickCount() - lii.dwTime)) / 1000.0;
  }
}
'@
if (-not ('HccIdle' -as [type])) { Add-Type -TypeDefinition $idleSig -Language CSharp }

$winSig = @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class HccWinW {
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
  delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)]
  static extern int GetWindowTextW(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  static extern bool IsWindowVisible(IntPtr hWnd);
  public static bool KioskOpen() {
    bool found = false;
    EnumWindows(delegate(IntPtr h, IntPtr l) {
      if (IsWindowVisible(h)) {
        var sb = new StringBuilder(512);
        if (GetWindowTextW(h, sb, sb.Capacity) > 0 && sb.ToString().StartsWith("HCC KIOSK")) { found = true; return false; }
      }
      return true;
    }, IntPtr.Zero);
    return found;
  }
}
'@
if (-not ('HccWinW' -as [type])) { Add-Type -TypeDefinition $winSig -Language CSharp }

$threshold = $IdleMinutes * 60
$armed = $true

Write-Log "watcher started - idle threshold ${IdleMinutes}m, rotate ${RotateSeconds}s"

do {
    try {
        $idle = [HccIdle]::Seconds()
        $open = [HccWinW]::KioskOpen()

        if ($idle -lt 10) { $armed = $true }     # Jeff is back at the keyboard - re-arm

        if ((-not $open) -and $armed -and ($idle -ge $threshold)) {
            Write-Log ("idle {0:N0}s >= {1}s - opening kiosk" -f $idle, $threshold)
            & powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden `
                -File $starter -RotateSeconds $RotateSeconds | Out-Null
            $armed = $false
        }

        if ($Once) {
            Write-Log ("single check done - idle {0:N0}s, kiosk open: {1}, armed: {2}" -f $idle, $open, $armed)
            break
        }
    }
    catch {
        # Never let one bad poll kill the watcher - it has to survive for months.
        Write-Log ("poll error (continuing): " + $_.Exception.Message)
    }
    Start-Sleep -Seconds 5
} while ($true)
