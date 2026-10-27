# The part of "free the network" that does NOT weaken anything and can run
# unattended: make sure every sharing/discovery FEATURE is switched on and every
# service that serves it is running and set to start at boot.
#
# The remaining half - SMB signing off, insecure guest logons, guest network
# logon rights, password-protected sharing off - is a genuine hardening removal
# and is blocked from automated execution. Jeff approved it at 2026-09-19 09:15
# ("Yes"), so it runs from Open-PrivateLanSharing.ps1 with him invoking it.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-44} {1}" -f $a,$b) }

Write-Output "=== $env:COMPUTERNAME - network profile must be Private ==="
Get-NetConnectionProfile | ForEach-Object {
    if ($_.NetworkCategory -ne 'Private') {
        Set-NetConnectionProfile -InterfaceIndex $_.InterfaceIndex -NetworkCategory Private
        L "$($_.InterfaceAlias)" 'switched to Private'
    } else { L "$($_.InterfaceAlias)" 'already Private' }
}

Write-Output ""
Write-Output "=== sharing + discovery firewall groups ON for Private ==="
foreach ($grp in 'Network Discovery','File and Printer Sharing') {
    Enable-NetFirewallRule -DisplayGroup $grp -EA SilentlyContinue
    $r = @(Get-NetFirewallRule -DisplayGroup $grp -EA SilentlyContinue)
    $on = @($r | Where-Object { $_.Enabled -eq 'True' }).Count
    L $grp "$on / $($r.Count) rules enabled"
}

Write-Output ""
Write-Output "=== the services that actually serve it ==="
foreach ($s in 'FDResPub','fdPHost','SSDPSRV','upnphost','LanmanServer','LanmanWorkstation') {
    Set-Service -Name $s -StartupType Automatic -EA SilentlyContinue
    Start-Service -Name $s -EA SilentlyContinue
    $svc = Get-Service $s -EA SilentlyContinue
    $mode = (Get-CimInstance Win32_Service -Filter "Name='$s'" -EA SilentlyContinue).StartMode
    L $s "$($svc.Status) / $mode"
}

Write-Output ""
Write-Output "=== what is still holding sharing shut (needs the approved script) ==="
$lsa = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa' -EA SilentlyContinue
L 'everyoneincludesanonymous (want 1)' $lsa.everyoneincludesanonymous
L 'LimitBlankPasswordUse (want 0)'     $lsa.LimitBlankPasswordUse
$sc = Get-SmbClientConfiguration; $ss = Get-SmbServerConfiguration
L 'client RequireSecuritySignature (want False)' $sc.RequireSecuritySignature
L 'client EnableInsecureGuestLogons (want True)' $sc.EnableInsecureGuestLogons
L 'server RequireSecuritySignature (want False)' $ss.RequireSecuritySignature
L 'Guest account enabled (want True)' (Get-LocalUser -Name Guest -EA SilentlyContinue).Enabled

Write-Output ""
L 'Defender antivirus' 'left ON deliberately'
L 'Firewall Public profile' "$((Get-NetFirewallProfile -Name Public).Enabled)  (protects him off-LAN)"
