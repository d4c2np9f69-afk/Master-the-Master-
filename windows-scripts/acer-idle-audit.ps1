# JEFF'S OBSERVATION, 2026-09-19 07:45, and it reframes the whole investigation:
#   "it never crashes when it's being used ... I will watch TV on it all night
#    and it never crashes or shuts off only when idle"
#
# That points AWAY from RAM (bad memory fails under load, not at rest) and
# straight at the idle power path: display off, sleep/standby entry, disk
# spindown, link power management, selective suspend.
#
# It also exposes a gap in my own earlier fix: on 09-19 00:33 I disabled HIPM
# (host-initiated link power management) and called SATA LPM "disabled". There
# is a SECOND half - DIPM, device-initiated - and I never touched it.
$ErrorActionPreference='SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-42} {1}" -f $a,$b) }
function H($t){ Write-Output ""; Write-Output "=== $t ===" }

H 'which sleep states does this machine actually support?'
(powercfg /a 2>&1) | ForEach-Object { Write-Output "    $_" }

H 'active power scheme'
$scheme = (powercfg /getactivescheme 2>&1)
Write-Output "    $scheme"

H 'the idle timeouts that matter (AC / DC, in seconds; 0 = never)'
$map = @{
  'VIDEOIDLE'    = 'turn off display after'
  'STANDBYIDLE'  = 'sleep after'
  'HIBERNATEIDLE'= 'hibernate after'
  'DISKIDLE'     = 'turn off hard disk after'
}
foreach ($k in $map.Keys) {
  $out = powercfg /query SCHEME_CURRENT SUB_VIDEO $k 2>$null
  if (-not $out) { $out = powercfg /query SCHEME_CURRENT SUB_SLEEP $k 2>$null }
  if (-not $out) { $out = powercfg /query SCHEME_CURRENT SUB_DISK $k 2>$null }
  $ac = ($out | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
  $dc = ($out | Select-String 'Current DC Power Setting Index') -replace '.*:\s*',''
  if ($ac) { L $map[$k] ("AC={0} ({1} min)   DC={2}" -f $ac, [convert]::ToInt32($ac,16)/60, $dc) }
}

H 'SATA link power management - BOTH halves'
$sub='0012ee47-9041-4b5d-9b77-535fba8b1442'
$hipm='0b2d69d7-a2a1-449c-9680-f91c70521c60'   # host-initiated  (I disabled this one)
$dipm='dab60367-53fe-4fbc-825e-521d069d2456'   # device-initiated (NEVER TOUCHED)
foreach ($pair in @(@('HIPM',$hipm), @('DIPM',$dipm))) {
  $q = powercfg /query SCHEME_CURRENT $sub $pair[1] 2>$null
  $ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
  L "$($pair[0]) AC index (0 = disabled)" $(if($ac){$ac}else{'not exposed'})
}

H 'PCI Express ASPM link state power management'
$pciSub='501a4d13-42af-4429-9fd1-a8218c268e20'; $aspm='ee12f906-d277-404b-b6da-e5fa1a576df5'
$q = powercfg /query SCHEME_CURRENT $pciSub $aspm 2>$null
$ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
L 'ASPM AC (0 = off, 1 = moderate, 2 = max)' $(if($ac){$ac}else{'not exposed'})

H 'USB selective suspend'
$usbSub='2a737441-1930-4402-8d77-b2bebba308a3'; $usbSel='48e6b7a6-50f5-4782-a5d4-53bb8f07e226'
$q = powercfg /query SCHEME_CURRENT $usbSub $usbSel 2>$null
$ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
L 'USB selective suspend AC (0 = disabled)' $(if($ac){$ac}else{'not exposed'})

H 'fast startup (hybrid boot) - a known hang source'
$hib = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -EA SilentlyContinue
L 'HiberbootEnabled (1 = fast startup ON)' $hib.HiberbootEnabled
L 'hibernate file' $(if(Test-Path C:\hiberfil.sys){'present'}else{'absent'})

H 'network adapters allowed to sleep'
Get-NetAdapter -Physical -EA SilentlyContinue | ForEach-Object {
  $p = Get-NetAdapterPowerManagement -Name $_.Name -EA SilentlyContinue
  if ($p) { L $_.Name ("WakeOnMagic={0} SelectiveSuspend={1} DeviceSleep={2}" -f $p.WakeOnMagicPacket, $p.SelectiveSuspend, $p.DeviceSleepOnDisconnect) }
}

H 'devices allowed to power down (the storage + chipset ones matter most)'
Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\wmi -EA SilentlyContinue |
  Where-Object { $_.Enable -eq $true } | Select-Object -First 12 |
  ForEach-Object { Write-Output ("    allowed to sleep: {0}" -f ($_.InstanceName -replace '\\','/')) }

H 'recent sleep / resume transitions (did a freeze follow one?)'
Get-WinEvent -FilterHashtable @{LogName='System';ProviderName='Microsoft-Windows-Kernel-Power';StartTime=(Get-Date).AddDays(-2)} -EA SilentlyContinue |
  Where-Object { $_.Id -in 42,107,105,131,506,507 } | Sort-Object TimeCreated | Select-Object -Last 20 |
  ForEach-Object { Write-Output ("    {0} [id {1}] {2}" -f $_.TimeCreated.ToString('MM-dd HH:mm:ss'), $_.Id, ($_.Message -split "`n")[0].Trim()) }
