# Jeff, 2026-09-19 07:45: "it never crashes when it's being used ... I will watch
# TV on it all night and it never crashes ... only when idle."
#
# The GLOBAL idle power path is already off on this machine - HIPM 0, DIPM 0,
# PCIe ASPM 0, USB selective suspend 0, fast startup off, no hiberfil, Ultimate
# Performance scheme, and the sleep log shows no sleep transition before any
# freeze. So sleep itself is not the trigger.
#
# What is STILL enabled is the per-device layer: the "Allow the computer to turn
# off this device to save power" checkbox, which is independent of the power
# scheme. The audit found it ON for, among others:
#   PCI\VEN_168C&DEV_0042  Atheros QCA6174 Wi-Fi
#   PCI\VEN_10EC&DEV_8168  Realtek RTL8168 Ethernet
#   PCI\VEN_8086&DEV_9D2F  Intel xHCI USB 3.0 controller
#   PCI\VEN_8086&DEV_9D3A  Intel Management Engine Interface
#   USB\ROOT_HUB30
# A network or bus controller powering itself down at idle is a documented hang
# source, and it only bites a machine that is sitting still - which is exactly
# the pattern Jeff described.
#
# This machine lives on AC, so there is nothing to gain from letting any of it
# sleep. Fully reversible: re-run with -Revert.
param([switch]$Revert)
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-52} {1}" -f $a,$b) }

$target = if ($Revert) { $true } else { $false }
$word   = if ($Revert) { 'RE-ENABLED (back to default)' } else { 'blocked from sleeping' }

Write-Output "=== devices currently ALLOWED to power down ==="
$all = Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\wmi -EA SilentlyContinue
$on  = @($all | Where-Object { $_.Enable -eq $true })
L 'count allowed to sleep (before)' $on.Count

$changed = 0
foreach ($d in $on) {
    try {
        Set-CimInstance -InputObject $d -Property @{ Enable = $target } -EA Stop
        $changed++
        Write-Output ("    {0}  {1}" -f $word, ($d.InstanceName -replace '\\','/'))
    } catch {
        Write-Output ("    COULD NOT CHANGE  {0}" -f ($d.InstanceName -replace '\\','/'))
    }
}

Write-Output ""
L 'devices changed' $changed
$after = @((Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\wmi -EA SilentlyContinue) | Where-Object { $_.Enable -eq $true })
L 'count allowed to sleep (after)' $after.Count

Write-Output ""
Write-Output "=== network adapters - the most likely culprits, set explicitly ==="
foreach ($n in (Get-NetAdapter -Physical -EA SilentlyContinue)) {
    if ($Revert) {
        Enable-NetAdapterPowerManagement -Name $n.Name -EA SilentlyContinue | Out-Null
    } else {
        Disable-NetAdapterPowerManagement -Name $n.Name -EA SilentlyContinue | Out-Null
    }
    $p = Get-NetAdapterPowerManagement -Name $n.Name -EA SilentlyContinue
    L $n.Name ("WakeOnMagic={0}" -f $p.WakeOnMagicPacket)
}

Write-Output ""
Write-Output "=== confirm the display/sleep timeouts Jeff set ==="
foreach ($s in @(@('SUB_VIDEO','VIDEOIDLE','display off'), @('SUB_SLEEP','STANDBYIDLE','sleep'), @('SUB_DISK','DISKIDLE','disk off'))) {
    $q = powercfg /query SCHEME_CURRENT $s[0] $s[1] 2>$null
    $ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
    if ($ac) {
        $secs = [convert]::ToInt32($ac,16)
        L "$($s[2]) on AC" $(if($secs -eq 0){'NEVER'}else{"$([math]::Round($secs/60,1)) min"})
    }
}
