# Jeff, 2026-09-19 08:37: "I want media sharing on on my network"
#
# NO supported cmdlet exists on consumer Windows - verified against Microsoft's
# own docs this session: the Windows Media Streaming API is flagged LEGACY,
# SetMediaStreamingEnabled is Windows Server Essentials only, and the Policy CSP
# only sets the SERVICE start mode, not the sharing toggle. So drive the
# supported UI. Do NOT hand-write NSS registry values - a half-written key gives
# a feature that reads "on" and serves nothing.
#
# TWO DEAD ENDS ALREADY PAID FOR, recorded so nobody repeats them:
#  1. "control.exe /name Microsoft.NetworkAndSharingCenter /page Share" is NOT a
#     valid page. It raises "Windows cannot find". That was a guess, and wrong.
#  2. On this page "Turn on media streaming" / "OK" / "Cancel" are exposed as
#     ControlType PANE, not Button. A UIA InvokePattern call on them RETURNS
#     SUCCESS AND DOES NOTHING - the page still read "Media streaming is not
#     turned on" afterwards. A click that reports success is not a click that
#     happened. Drive real mouse input at the element's rectangle instead.
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class Click {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, IntPtr e);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    public static void At(int x, int y) {
        SetCursorPos(x, y);
        System.Threading.Thread.Sleep(250);
        mouse_event(0x0002, 0, 0, 0, IntPtr.Zero);   // left down
        System.Threading.Thread.Sleep(80);
        mouse_event(0x0004, 0, 0, 0, IntPtr.Zero);   // left up
    }
}
'@
function L($a,$b){ Write-Output ("  {0,-36} {1}" -f $a,$b) }

function Get-Win($match, $sec = 15) {
    $root = [Windows.Automation.AutomationElement]::RootElement
    $end = (Get-Date).AddSeconds($sec)
    while ((Get-Date) -lt $end) {
        foreach ($w in $root.FindAll([Windows.Automation.TreeScope]::Children, [Windows.Automation.Condition]::TrueCondition)) {
            if ($w.Current.Name -match $match) { return $w }
        }
        Start-Sleep -Milliseconds 400
    }
    return $null
}
function Find-In($win, $pattern, $sec = 12) {
    $end = (Get-Date).AddSeconds($sec)
    while ((Get-Date) -lt $end) {
        foreach ($e in $win.FindAll([Windows.Automation.TreeScope]::Descendants, [Windows.Automation.Condition]::TrueCondition)) {
            if ($e.Current.Name -match $pattern) { return $e }
        }
        Start-Sleep -Milliseconds 400
    }
    return $null
}
function ClickEl($el, $label) {
    if (-not $el) { L $label 'NOT FOUND'; return $false }
    $r = $el.Current.BoundingRectangle
    if ($r.Width -le 0 -or $r.Height -le 0) { L $label 'no clickable rectangle'; return $false }
    $x = [int]($r.X + $r.Width / 2); $y = [int]($r.Y + $r.Height / 2)
    [Click]::At($x, $y)
    L $label "clicked at $x,$y"
    return $true
}

Write-Output "=== find or open the Media streaming options page ==="
$ms = Get-Win 'Media streaming options' 4
if (-not $ms) {
    Start-Process 'control.exe' -ArgumentList '/name Microsoft.NetworkAndSharingCenter'
    $nsc = Get-Win 'Network and Sharing Center' 20
    if ($nsc) { ClickEl (Find-In $nsc 'Media streaming options' 15) 'Media streaming options link' | Out-Null }
    $ms = Get-Win 'Media streaming options' 15
}
if (-not $ms) { Write-Output "  could not reach the page"; exit 1 }
L 'page open' $ms.Current.Name
[Click]::SetForegroundWindow($ms.Current.NativeWindowHandle) | Out-Null
Start-Sleep -Seconds 1

$state = Find-In $ms 'Media streaming is (not )?turned on' 4
if ($state) { L 'current state' $state.Current.Name }

Write-Output ""
Write-Output "=== click 'Turn on media streaming' with REAL mouse input ==="
ClickEl (Find-In $ms '^Turn on media streaming$' 10) 'Turn on media streaming' | Out-Null
Start-Sleep -Seconds 6

Write-Output ""
Write-Output "=== accept the follow-up page ==="
$ms2 = Get-Win 'Media streaming options' 10
if ($ms2) {
    $s2 = Find-In $ms2 'Media streaming is (not )?turned on|Choose media streaming' 3
    if ($s2) { L 'now showing' $s2.Current.Name }
    ClickEl (Find-In $ms2 '^OK$' 8) 'OK' | Out-Null
}
Start-Sleep -Seconds 5

Write-Output ""
Write-Output "=== PROOF - is wmpnetwk actually SERVING? (ports, not registry) ==="
$svc = Get-CimInstance Win32_Service -Filter "Name='WMPNetworkSvc'"
L 'WMPNetworkSvc' "$($svc.State) / $($svc.StartMode)  pid=$($svc.ProcessId)"
$ports = @(Get-NetTCPConnection -State Listen -EA SilentlyContinue | Where-Object { $_.OwningProcess -eq $svc.ProcessId })
if ($ports) { $ports | ForEach-Object { L '  TCP LISTEN' "$($_.LocalAddress):$($_.LocalPort)" } }
else { L '  TCP LISTEN' 'none - NOT serving yet' }
L 'NSS Server key' $(if(Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows Media Player NSS\3.0\Server'){'exists'}else{'absent'})
