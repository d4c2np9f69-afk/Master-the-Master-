# Is the Acer overheating? (the next suspect after SATA LPM). Reads ACPI thermal
# zones, checks for thermal-throttle / critical-temp events, and CPU load.
$ErrorActionPreference='SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-40} {1}" -f $a,$b) }

Write-Output "=== ACPI thermal zones (tenths of a Kelvin -> C) ==="
$tz = Get-CimInstance -Namespace 'root/WMI' -ClassName MSAcpi_ThermalZoneTemperature -EA SilentlyContinue
if ($tz) {
    foreach ($z in $tz) {
        $c = [math]::Round(($z.CurrentTemperature / 10) - 273.15, 1)
        L "zone $($z.InstanceName)" "$c C"
    }
} else { L 'ACPI thermal zones' 'not exposed by this BIOS (common on consumer laptops)' }

Write-Output ""
Write-Output "=== drive temperature (for comparison) ==="
Get-PhysicalDisk | ForEach-Object {
    $r = Get-StorageReliabilityCounter -PhysicalDisk $_ -EA SilentlyContinue
    if ($r) { L "$($_.FriendlyName) temp" "$($r.Temperature) C" }
}

Write-Output ""
Write-Output "=== thermal / power events in the last 7 days ==="
$therm = Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-7)} -EA SilentlyContinue |
  Where-Object { $_.ProviderName -match 'Thermal|Kernel-Processor-Power|WHEA' -or $_.Message -match 'thermal|throttl|overheat' }
if ($therm) {
    $therm | Group-Object ProviderName,Id | Sort-Object Count -Descending | Select-Object -First 6 |
      ForEach-Object { L $_.Name "$($_.Count) events" }
    $therm | Select-Object -First 3 | ForEach-Object { Write-Output "    [$($_.TimeCreated)] $($_.ProviderName): $($_.Message.Split("`n")[0])" }
} else { L 'thermal/throttle/WHEA events' 'NONE in 7 days' }

Write-Output ""
Write-Output "=== CPU + load right now ==="
$cpu = Get-CimInstance Win32_Processor
L 'cpu' $cpu.Name
L 'current clock / max' "$($cpu.CurrentClockSpeed) / $($cpu.MaxClockSpeed) MHz"
L 'load %' $cpu.LoadPercentage
L 'uptime' ((Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime).ToString('hh\:mm\:ss')

Write-Output ""
Write-Output "=== how many unclean shutdowns since the LPM fix was applied? ==="
$since = Get-Date '2026-09-19 00:33'
$e41 = Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-Kernel-Power';Id=41;StartTime=$since} -EA SilentlyContinue
L 'event 41 since LPM fix (00:33)' $(if($e41){"$($e41.Count) - LPM did NOT fix it"}else{'0 so far - promising, needs hours to confirm'})