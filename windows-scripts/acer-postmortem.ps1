# ONE-SHOT post-freeze forensics for the Acer. Run this FIRST the moment the
# machine is back, before anything else touches it - some of this evidence is
# overwritten by normal use.
#
# Context: the 2026-09-19 05:05-05:23 freeze happened AFTER SATA AHCI Link Power
# Management was disabled at 00:33, so LPM is ruled out as the sole cause. Already
# eliminated: "end of life" (0 read errors, 0 wear), firmware M3CR046 (wrong
# family - the drive is M3CR033), thermal (43.1 C CPU, 25 C drive, no throttle
# events). Next suspect is RAM.
#
#   scp windows-scripts\acer-postmortem.ps1 jeffl@192.168.1.176:C:/Users/jeffl/
#   ssh jeffl@192.168.1.176 "powershell -ExecutionPolicy Bypass -File C:\Users\jeffl\acer-postmortem.ps1"
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-40} {1}" -f $a,$b) }
function H($t){ Write-Output ""; Write-Output "=== $t ===" }

H 'THE FREEZE - exact time'
$e41 = Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-Kernel-Power';Id=41;StartTime=(Get-Date).AddDays(-2)} -EA SilentlyContinue
if ($e41) { $e41 | ForEach-Object { Write-Output "    FROZE $($_.TimeCreated)" } } else { Write-Output '    no event 41 in 2 days' }
$boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
L 'booted (this session)' $boot
L 'uptime' ("{0}h {1}m" -f [math]::Floor(((Get-Date)-$boot).TotalHours), ((Get-Date)-$boot).Minutes)

H 'LAST GASP - what the log recorded in the 10 min BEFORE the freeze'
if ($e41) {
    $t = $e41[0].TimeCreated
    Get-WinEvent -FilterHashtable @{LogName='System';StartTime=$t.AddMinutes(-10);EndTime=$t} -EA SilentlyContinue |
      Sort-Object TimeCreated | Select-Object -Last 25 |
      ForEach-Object { Write-Output ("    {0}  [{1}] {2} {3}" -f $_.TimeCreated.ToString('HH:mm:ss'), $_.LevelDisplayName, $_.ProviderName, $_.Id) }
}

H 'DRIVE HANG FINGERPRINT (volmgr 161 / disk 153 / storahci 129)'
Get-WinEvent -FilterHashtable @{LogName='System';StartTime=(Get-Date).AddDays(-3)} -EA SilentlyContinue |
  Where-Object { ($_.ProviderName -match 'volmgr|disk|storahci|Ntfs') -and ($_.Id -in 7,9,11,15,50,51,129,153,157,161) } |
  Group-Object ProviderName,Id | Sort-Object Count -Descending | Select-Object -First 8 |
  ForEach-Object { L $_.Name "$($_.Count)x  (latest $(($_.Group | Sort-Object TimeCreated -Desc)[0].TimeCreated))" }

H 'RAM - the current prime suspect'
$cs = Get-CimInstance Win32_ComputerSystem
L 'total RAM' ("{0:N1} GB" -f ($cs.TotalPhysicalMemory/1GB))
Get-CimInstance Win32_PhysicalMemory | ForEach-Object {
  L "  slot $($_.DeviceLocator)" ("{0:N0} GB  {1} MT/s  {2} {3}" -f ($_.Capacity/1GB), $_.ConfiguredClockSpeed, $_.Manufacturer, $_.PartNumber)
}
L 'WHEA hardware errors (3 days)' (@(Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-WHEA-Logger';StartTime=(Get-Date).AddDays(-3)} -EA SilentlyContinue).Count)
$mem = Get-WinEvent -LogName System -EA SilentlyContinue | Where-Object { $_.ProviderName -match 'MemoryDiagnostic' } | Select-Object -First 3
if ($mem) { $mem | ForEach-Object { Write-Output "    $($_.TimeCreated): $($_.Message.Split("`n")[0])" } } else { L 'previous memory test result' 'none recorded - test has never run' }

H 'CRASH DUMPS / WER (may exist even when the dump failed)'
L 'dump setting' (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -EA SilentlyContinue).CrashDumpEnabled
foreach ($p in 'C:\Windows\MEMORY.DMP','C:\Windows\Minidump') {
  if (Test-Path $p) { L "exists: $p" ((Get-ChildItem $p -EA SilentlyContinue | Measure-Object).Count.ToString() + ' file(s)') }
}
Get-ChildItem "$env:ProgramData\Microsoft\Windows\WER\ReportQueue" -EA SilentlyContinue | Select-Object -Last 3 | ForEach-Object { L '  WER report' $_.Name }

H 'IS THE LPM FIX STILL APPLIED?'
$sub='0012ee47-9041-4b5d-9b77-535fba8b1442'; $hipm='0b2d69d7-a2a1-449c-9680-f91c70521c60'
$q = powercfg /query SCHEME_CURRENT $sub $hipm 2>$null | Select-String 'Current AC Power Setting Index'
L 'HIPM AC index (0 = disabled)' ($(if($q){($q -split ':')[-1].Trim()}else{'could not read'}))

H 'DRIVE HEALTH'
Get-PhysicalDisk | ForEach-Object {
  $r = Get-StorageReliabilityCounter -PhysicalDisk $_ -EA SilentlyContinue
  if ($r) { L $_.FriendlyName "temp $($r.Temperature)C  readErr $($r.ReadErrorsTotal)  writeErr $($r.WriteErrorsTotal)  wear $($r.Wear)  hours $($r.PowerOnHours)" }
}

H 'NEXT STEP'
Write-Output '  RAM is the remaining suspect. Jeff pulls ONE stick and runs on the other.'
Write-Output '  To queue the built-in test for the next reboot (free, no download):'
Write-Output '      mdsched.exe            (GUI, choose "restart now")'
Write-Output '  Results land in the System log under MemoryDiagnostics-Results.'
