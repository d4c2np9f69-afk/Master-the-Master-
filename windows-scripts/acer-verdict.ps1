# THE VERDICT on the Acer freezes. SATA AHCI Link Power Management was disabled
# 2026-09-19 00:33. A freeze on this machine leaves NO BSOD and NO bugcheck - the
# only reliable fingerprint is Kernel-Power 41 (unclean shutdown) plus a break in
# uptime. Last known freeze before the fix: 2026-09-18 23:21.
$ErrorActionPreference='SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

$fix  = Get-Date '2026-09-19 00:33'
$boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
$up   = (Get-Date) - $boot

Write-Output "=== uptime ==="
L 'booted'            $boot
# [int] in PowerShell ROUNDS (5.6 -> 6), it does not truncate. That printed
# "6h 35m" for a 5h36m uptime and briefly looked like the machine had rebooted.
# Floor it. Fixed 2026-09-19.
L 'uptime'            ("{0}h {1}m" -f [math]::Floor($up.TotalHours), $up.Minutes)
L 'LPM fix applied'   $fix
L 'hours since fix'   ([math]::Round(((Get-Date)-$fix).TotalHours,1))

Write-Output ""
Write-Output "=== Kernel-Power 41 (unclean shutdown = a real freeze) ==="
$e41 = Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-Kernel-Power';Id=41;StartTime=$fix} -EA SilentlyContinue
if ($e41) {
    L 'event 41 SINCE the fix' "$($e41.Count)  <-- LPM did NOT fix it"
    $e41 | Select-Object -First 5 | ForEach-Object { Write-Output "    FROZE AT $($_.TimeCreated)" }
} else {
    L 'event 41 SINCE the fix' '0'
}

Write-Output ""
Write-Output "=== all event 41 in the last 7 days (for the before/after picture) ==="
$all = Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-Kernel-Power';Id=41;StartTime=(Get-Date).AddDays(-7)} -EA SilentlyContinue
if ($all) { $all | ForEach-Object { Write-Output "    $($_.TimeCreated)" } } else { Write-Output '    none' }

Write-Output ""
Write-Output "=== volmgr 161 (drive hung so hard the dump could not be written) ==="
$v = Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='volmgr';Id=161;StartTime=(Get-Date).AddDays(-7)} -EA SilentlyContinue
if ($v) { $v | ForEach-Object { Write-Output "    $($_.TimeCreated)" } } else { Write-Output '    none in 7 days' }

Write-Output ""
Write-Output "=== is the LPM fix still actually applied? ==="
$sub='0012ee47-9041-4b5d-9b77-535fba8b1442'; $hipm='0b2d69d7-a2a1-449c-9680-f91c70521c60'
$q = powercfg /query SCHEME_CURRENT $sub $hipm 2>$null | Select-String 'Current AC Power Setting Index'
L 'HIPM AC index (0 = disabled)' ($(if($q){($q -split ':')[-1].Trim()}else{'could not read'}))

Write-Output ""
Write-Output "=== drive health right now ==="
Get-PhysicalDisk | ForEach-Object {
    $r = Get-StorageReliabilityCounter -PhysicalDisk $_ -EA SilentlyContinue
    if ($r) { L "$($_.FriendlyName)" "temp $($r.Temperature)C  readErr $($r.ReadErrorsTotal)  wear $($r.Wear)" }
}
