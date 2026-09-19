# Make Windows machines SHOW UP in each other's "Network" folder. This is the
# discovery layer - separate from the workgroup name. Aligns with Jeff's standing
# decision that the LAN is open (router is the wall).
$ErrorActionPreference = 'SilentlyContinue'
Write-Output "host: $env:COMPUTERNAME"

Write-Output ""
Write-Output "=== network profile (discovery only works on Private, never Public) ==="
Get-NetConnectionProfile | ForEach-Object {
    Write-Output "  '$($_.Name)' ($($_.InterfaceAlias)) = $($_.NetworkCategory)"
    if ($_.NetworkCategory -eq 'Public') {
        Set-NetConnectionProfile -InterfaceIndex $_.InterfaceIndex -NetworkCategory Private
        Write-Output "    -> switched to Private"
    }
}

Write-Output ""
Write-Output "=== turn on Network Discovery + File/Printer Sharing firewall rules (Private) ==="
Enable-NetFirewallRule -DisplayGroup 'Network Discovery' -EA SilentlyContinue
Enable-NetFirewallRule -DisplayGroup 'File and Printer Sharing' -EA SilentlyContinue
$nd = (Get-NetFirewallRule -DisplayGroup 'Network Discovery' -EA SilentlyContinue | Where-Object Enabled -eq 'True').Count
Write-Output "  Network Discovery rules enabled: $nd"

Write-Output ""
Write-Output "=== discovery services running + automatic ==="
foreach ($svc in 'FDResPub','FDPHost','SSDPSRV','upnphost') {
    Set-Service $svc -StartupType Automatic -EA SilentlyContinue
    Start-Service $svc -EA SilentlyContinue
    $s = Get-Service $svc -EA SilentlyContinue
    Write-Output ("  {0,-10} {1} / {2}" -f $svc, $s.Status, $s.StartType)
}

Write-Output ""
Write-Output "=== result ==="
Write-Output "  This machine will now advertise itself and browse others on the LAN."
Write-Output "  Open Explorer -> Network to see the other machines appear."