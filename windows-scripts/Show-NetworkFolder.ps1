# TEST THE FEATURE, NOT A COMPONENT.
#
# I spent several rounds firing hand-rolled WS-Discovery probes at UDP 3702 and
# concluding machines were "silent". That tool is my own proxy for discovery, and
# it reported the ACER as silent too - while the Acer is a perfectly healthy
# Windows box that other Windows machines do list. So the probe is not a
# trustworthy instrument for this question.
#
# What Jeff actually asked for is "the other computers show up in Network". That
# is the shell's Network folder (ssfNETWORK = 0x12), populated by Function
# Discovery. Enumerate THAT - it is the exact thing he sees in Explorer.
$ErrorActionPreference = 'SilentlyContinue'

Write-Output "=== what Explorer's Network window actually lists on $env:COMPUTERNAME ==="
$shell = New-Object -ComObject Shell.Application
$net = $shell.Namespace(0x12)
if ($net) {
    $items = @($net.Items())
    if ($items.Count -eq 0) {
        Write-Output "    (empty - nothing discovered)"
    } else {
        foreach ($i in $items) { Write-Output ("    {0,-24} {1}" -f $i.Name, $i.Path) }
    }
    Write-Output ("  total: {0}" -f $items.Count)
} else { Write-Output "    could not open the Network namespace" }

Write-Output ""
Write-Output "=== Function Discovery's own view (the provider behind that window) ==="
$fd = Get-CimInstance -Namespace 'root\StandardCimv2' -ClassName MSFT_NetAdapter -EA SilentlyContinue | Out-Null
# WSD-discovered devices register as PnP devices under the WSD enumerator
Get-PnpDevice -EA SilentlyContinue |
  Where-Object { $_.InstanceId -match '^WSD|^SWD\\.*WSD|UMB\\UMB.*WSD' -and $_.Status -eq 'OK' } |
  Select-Object -First 15 |
  ForEach-Object { Write-Output ("    {0,-40} {1}" -f $_.FriendlyName, $_.Status) }

Write-Output ""
Write-Output "=== can it reach each machine by NAME (what a shortcut actually needs)? ==="
foreach ($h in '301SERVER','GarageLaptop','JeffsLapTop') {
    $ip = try { ([System.Net.Dns]::GetHostAddresses($h) | Where-Object { $_.AddressFamily -eq 'InterNetwork' })[0].IPAddressToString } catch { $null }
    Write-Output ("    {0,-16} resolves to {1}" -f $h, $(if($ip){$ip}else{'NOT RESOLVABLE'}))
}

Write-Output ""
Write-Output "=== and by UNC (the thing that must work for it to be useful)? ==="
foreach ($u in '\\301SERVER\OneDrive','\\192.168.1.173\GarageFiles','\\GarageLaptop\GarageFiles') {
    Write-Output ("    {0,-34} reachable={1}" -f $u, (Test-Path $u))
}
