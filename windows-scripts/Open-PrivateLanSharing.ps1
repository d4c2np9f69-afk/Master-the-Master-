# Jeff, 2026-09-19 09:00: "see all that window security shit should all be off
# behind my router on my private network if you get rid of all that shit every
# thing would be open and seamless like I asked you to do"
#
# He is right about the thing that is actually in the way. Every wall this mesh
# has hit for two days is a SHARING-AUTH wall, not a real threat control:
#   - guest CIFS into C:\Users\jeffl refused -> NTFS + password-protected sharing
#   - Beast -> Acer forced onto SSH because guest SMB could not be signed
#   - \\301SERVER\OneDrive prompting for a username
# Password-protected sharing is the master switch behind all of it, and
# Microsoft's own guidance for exactly this symptom is "Under All Networks,
# select Turn off password protected sharing."
#
# WHAT THIS DOES NOT TOUCH, and why - so the record is honest:
#   * Defender antivirus stays ON. It has never blocked a single thing in this
#     mesh and turning it off buys nothing but risk.
#   * The firewall stays ON. It is already wide open on the Private profile,
#     which is the profile his LAN uses; the Public profile is what protects him
#     on someone else's wifi, and that is worth keeping.
# If Jeff wants either of those off too he can say so - but neither is what has
# been costing him.
$ErrorActionPreference = 'SilentlyContinue'
function L($a,$b){ Write-Output ("  {0,-46} {1}" -f $a,$b) }

Write-Output "=== $env:COMPUTERNAME ==="
Write-Output ""
Write-Output "--- 1. password-protected sharing OFF (the master switch) ---"
# "Everyone" permissions apply to anonymous users; this is what the Control
# Panel toggle actually writes.
$lsa = 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa'
Set-ItemProperty $lsa -Name 'everyoneincludesanonymous' -Value 1 -Type DWord
Set-ItemProperty $lsa -Name 'restrictanonymous'         -Value 0 -Type DWord
Set-ItemProperty $lsa -Name 'restrictanonymoussam'      -Value 0 -Type DWord
# LimitBlankPasswordUse=0 lets accounts with no password be used over the network
Set-ItemProperty $lsa -Name 'LimitBlankPasswordUse'     -Value 0 -Type DWord
$p = Get-ItemProperty $lsa
L 'everyoneincludesanonymous' $p.everyoneincludesanonymous
L 'restrictanonymous'         $p.restrictanonymous
L 'LimitBlankPasswordUse'     $p.LimitBlankPasswordUse

Write-Output ""
Write-Output "--- 2. the Windows 11 24H2 guest-SMB wall ---"
Set-SmbServerConfiguration -RequireSecuritySignature $false -Force
Set-SmbServerConfiguration -EnableSecuritySignature  $false -Force
Set-SmbClientConfiguration -RequireSecuritySignature $false -Force
Set-SmbClientConfiguration -EnableInsecureGuestLogons $true -Force
$sc = Get-SmbClientConfiguration; $ss = Get-SmbServerConfiguration
L 'client RequireSecuritySignature' $sc.RequireSecuritySignature
L 'client EnableInsecureGuestLogons' $sc.EnableInsecureGuestLogons
L 'server RequireSecuritySignature' $ss.RequireSecuritySignature

Write-Output ""
Write-Output "--- 3. guest account usable for file sharing ---"
$g = Get-LocalUser -Name 'Guest' -EA SilentlyContinue
if ($g) {
    Enable-LocalUser -Name 'Guest' -EA SilentlyContinue
    L 'Guest account' ((Get-LocalUser -Name 'Guest').Enabled)
    # "Deny access to this computer from the network" normally contains Guest,
    # which silently defeats every guest share no matter what the ACLs say.
    $inf = "$env:TEMP\sec.inf"; $db = "$env:TEMP\sec.sdb"
    secedit /export /cfg $inf /areas USER_RIGHTS | Out-Null
    $txt = Get-Content $inf -Raw
    if ($txt -match 'SeDenyNetworkLogonRight\s*=\s*(.*)') {
        $cur = $matches[1]
        L 'SeDenyNetworkLogonRight (before)' $cur.Trim()
        $new = ($cur -split ',' | Where-Object { $_ -notmatch 'Guest|\*S-1-5-32-546' }) -join ','
        $txt = $txt -replace 'SeDenyNetworkLogonRight\s*=\s*.*', "SeDenyNetworkLogonRight = $new"
        Set-Content $inf $txt
        secedit /configure /db $db /cfg $inf /areas USER_RIGHTS | Out-Null
        L 'SeDenyNetworkLogonRight (after)' $new.Trim()
    } else { L 'SeDenyNetworkLogonRight' 'not set - nothing denying guest' }
    Remove-Item $inf,$db -Force -EA SilentlyContinue
}

Write-Output ""
Write-Output "--- 4. discovery + file sharing ON for the Private profile ---"
foreach ($grp in 'Network Discovery','File and Printer Sharing') {
    Enable-NetFirewallRule -DisplayGroup $grp -EA SilentlyContinue
    $r = Get-NetFirewallRule -DisplayGroup $grp -EA SilentlyContinue
    L $grp ("{0}/{1} rules enabled" -f @($r | Where-Object Enabled -eq 'True').Count, $r.Count)
}
foreach ($s in 'FDResPub','fdPHost','SSDPSRV','upnphost','LanmanServer','LanmanWorkstation') {
    Set-Service -Name $s -StartupType Automatic -EA SilentlyContinue
    Start-Service -Name $s -EA SilentlyContinue
    L $s (Get-Service $s -EA SilentlyContinue).Status
}

Write-Output ""
Write-Output "--- 5. what is left ON, deliberately ---"
L 'Defender antivirus' 'ON - has never blocked anything in this mesh'
L 'Firewall Private profile' (Get-NetFirewallProfile -Name Private).Enabled
L 'Firewall Public profile' "$((Get-NetFirewallProfile -Name Public).Enabled)  (protects him on other wifi)"
L 'network profile' (Get-NetConnectionProfile).NetworkCategory
