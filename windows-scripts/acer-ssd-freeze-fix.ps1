# RESEARCHED FIX for the Acer's hard freezes (no BSOD, nothing in the event log).
# The Acer has a Crucial MX500. Two documented causes of exactly this symptom:
#   1. MX500 firmware - Crucial's M3CR046 "repairs a hang condition occurring
#      under corner-case workloads".
#   2. SATA AHCI Link Power Management (HIPM/DIPM) - documented to hang Crucial
#      SSDs on Intel SATA controllers. NOTE: this is NOT the PCIe ASPM setting
#      already disabled; it is a separate, usually-hidden power setting.
# This reports the firmware and disables SATA LPM (free, reversible, no reboot).
$ErrorActionPreference='SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-38} {1}" -f $a,$b) }

Write-Output "=== 1. THE DRIVE + ITS FIRMWARE ==="
Get-PhysicalDisk | ForEach-Object {
    $d = $_
    L 'model'    $d.FriendlyName
    L 'firmware' $d.FirmwareVersion
    L 'size'     ("{0:N0} GB" -f ($d.Size/1GB))
    L 'health'   "$($d.HealthStatus) / $($d.OperationalStatus)"
    L 'bus'      $d.BusType
}

Write-Output ""
Write-Output "=== 2. SMART / reallocated sectors (is the drive itself failing?) ==="
$rel = Get-StorageReliabilityCounter -PhysicalDisk (Get-PhysicalDisk | Select-Object -First 1) -EA SilentlyContinue
if ($rel) {
    L 'power-on hours'      $rel.PowerOnHours
    L 'read errors (total)' $rel.ReadErrorsTotal
    L 'write errors (total)'$rel.WriteErrorsTotal
    L 'wear'                $rel.Wear
    L 'temperature C'       $rel.Temperature
}

Write-Output ""
Write-Output "=== 3. DISABLE SATA AHCI LINK POWER MANAGEMENT (the documented fix) ==="
$sub  = '0012ee47-9041-4b5d-9b77-535fba8b1442'   # Hard disk
$hipm = '0b2d69d7-a2a1-449c-9680-f91c70521c60'   # AHCI Link Power Management - HIPM/DIPM
$adap = 'dab60367-53fe-4fbc-825e-521d069d2456'   # AHCI Link Power Management - Adaptive
# these settings are hidden by default - unhide so they can be set
powercfg -attributes $sub $hipm -ATTRIB_HIDE | Out-Null
powercfg -attributes $sub $adap -ATTRIB_HIDE | Out-Null
# 0 = Active (link power management OFF = no low-power link states)
powercfg /setacvalueindex SCHEME_CURRENT $sub $hipm 0
powercfg /setdcvalueindex SCHEME_CURRENT $sub $hipm 0
powercfg /setacvalueindex SCHEME_CURRENT $sub $adap 0
powercfg /setdcvalueindex SCHEME_CURRENT $sub $adap 0
# and never spin down / idle the disk
powercfg /change disk-timeout-ac 0
powercfg /change disk-timeout-dc 0
powercfg /setactive SCHEME_CURRENT
$q = powercfg /q SCHEME_CURRENT $sub $hipm
$ac = ($q | Select-String 'Current AC').ToString() -replace '.*:\s*',''
$dc = ($q | Select-String 'Current DC').ToString() -replace '.*:\s*',''
L 'AHCI LPM HIPM/DIPM  AC/DC' "$ac / $dc   (0x0 = Active = LPM OFF)"
L 'disk sleep timeout' 'never (AC+DC)'

Write-Output ""
Write-Output "=== 4. STORAGE-RELATED ERRORS IN THE LOG (disk/controller resets) ==="
$ev = Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-7)} -EA SilentlyContinue |
      Where-Object { $_.ProviderName -match 'disk|storahci|stornvme|Ntfs|volmgr' -and $_.LevelDisplayName -match 'Error|Warning' }
if ($ev) {
    $ev | Group-Object ProviderName,Id | Sort-Object Count -Descending | Select-Object -First 6 |
        ForEach-Object { L $_.Name "$($_.Count) in 7 days" }
    Write-Output "  most recent:"
    $ev | Select-Object -First 3 | ForEach-Object { Write-Output "    [$($_.TimeCreated)] $($_.ProviderName) id=$($_.Id): $($_.Message.Split("`n")[0])" }
} else { L 'disk/controller errors' 'NONE in 7 days' }