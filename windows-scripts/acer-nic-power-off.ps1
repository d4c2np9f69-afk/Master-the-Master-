# Jeff, 2026-09-19 07:49: "Can't you set those settings like WiFi to never go to sleep"
#
# Three separate layers control this, and clearing one does NOT clear the others:
#   1. Device Manager checkbox   -> MSPower_DeviceEnable   (done: 15/15 cleared)
#   2. Power plan                -> SUB_WIRELESS Power Saving Mode
#   3. Driver advanced properties-> per-vendor, per-adapter
#
# Measured state before this script:
#   Wi-Fi  (Qualcomm Atheros QCA9377) - ALREADY fully covered. Power plan reads
#          Maximum Performance on AC and DC, checkbox cleared, and the driver
#          exposes NO power-save property (only band/roaming/wireless mode).
#          Nothing further exists to set. (Earlier note said QCA6174 - wrong,
#          it is QCA9377.)
#   Ethernet (Realtek PCIe GbE) - THREE power savers still ENABLED:
#          Energy-Efficient Ethernet, Green Ethernet, Power Saving Mode.
#          Realtek EEE/Green Ethernet is a documented cause of idle link drops
#          and hangs, and it only acts when the link is quiet - which matches
#          "never crashes while I'm using it, only when idle".
#
# This machine lives on AC. There is nothing to gain from any of it.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-46} {1}" -f $a,$b) }

# name -> desired value. Names are taken from the live enumeration, not guessed.
$want = @{
  'Energy-Efficient Ethernet'  = 'Disabled'
  'Green Ethernet'             = 'Disabled'
  'Power Saving Mode'          = 'Disabled'
  'Advanced EEE'               = 'Disabled'
  'Auto Disable Gigabit'       = 'Disabled'
  'Shutdown Wake-On-Lan'       = 'Disabled'
}

foreach ($n in (Get-NetAdapter -Physical -EA SilentlyContinue)) {
    Write-Output "=== $($n.Name)  [$($n.InterfaceDescription)] ==="
    $props = Get-NetAdapterAdvancedProperty -Name $n.Name -EA SilentlyContinue
    foreach ($k in $want.Keys) {
        $p = $props | Where-Object { $_.DisplayName -eq $k }
        if (-not $p) { continue }                       # adapter does not expose it - skip silently
        if ($p.DisplayValue -eq $want[$k]) { L "$k (already)" $p.DisplayValue; continue }
        try {
            Set-NetAdapterAdvancedProperty -Name $n.Name -DisplayName $k -DisplayValue $want[$k] -NoRestart -EA Stop
            $now = (Get-NetAdapterAdvancedProperty -Name $n.Name -DisplayName $k -EA SilentlyContinue).DisplayValue
            L "$k  CHANGED" ("{0} -> {1}" -f $p.DisplayValue, $now)
        } catch {
            L "$k  FAILED" $_.Exception.Message
        }
    }
    Write-Output ""
}

Write-Output "=== power plan: wireless power saving (0 = Maximum Performance) ==="
powercfg /setacvalueindex SCHEME_CURRENT 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 0
powercfg /setdcvalueindex SCHEME_CURRENT 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 0
powercfg /setactive SCHEME_CURRENT
$q = powercfg /query SCHEME_CURRENT 19cbb8fa-5279-450e-9fac-8a3d5fedd0c1 12bbebe6-58d6-4636-95bb-3217ef867c1a 2>$null
L 'wireless AC' (($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*','')
L 'wireless DC' (($q | Select-String 'Current DC Power Setting Index') -replace '.*:\s*','')

Write-Output ""
Write-Output "=== final state of every power-related NIC property ==="
foreach ($n in (Get-NetAdapter -Physical -EA SilentlyContinue)) {
    Get-NetAdapterAdvancedProperty -Name $n.Name -EA SilentlyContinue |
      Where-Object { $_.DisplayName -match 'EEE|Green|Power|Wake|Disable Gigabit' } |
      ForEach-Object { L "$($n.Name): $($_.DisplayName)" $_.DisplayValue }
}
L 'devices still allowed to power down' (@((Get-CimInstance -ClassName MSPower_DeviceEnable -Namespace root\wmi -EA SilentlyContinue) | Where-Object { $_.Enable -eq $true }).Count)
