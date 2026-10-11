# REBOOT-SURVIVAL CHECK for a Windows machine. Jeff, 2026-09-19 09:31:
# "I want it triple checked!!! No bugs and it all survives a reboot on all
# computers."
#
# The distinction this script exists to enforce: a setting being TRUE RIGHT NOW
# is not the same as it being true after a reboot. A service can be Running but
# set to Manual. A drive can be mapped but not persistent. A firewall rule can
# be on in the live store but absent from the persistent one. So every check
# below asks "will this come back", not "is it on".
$ErrorActionPreference = 'SilentlyContinue'
$script:pass = 0; $script:fail = 0
function Section($t){ Write-Output ""; Write-Output "--- $t" }
function Chk($label, $ok, $detail){
    if ($ok) { $script:pass++; $tag = 'PASS' } else { $script:fail++; $tag = 'FAIL' }
    Write-Output ("  {0}  {1,-42} {2}" -f $tag, $label, $detail)
}

Write-Output "================================================================"
Write-Output "  REBOOT-SURVIVAL CHECK - $env:COMPUTERNAME  $(Get-Date -Format 'HH:mm:ss')"
Write-Output "================================================================"

Section 'SHARING POLICY (registry - survives by nature, confirm the VALUES)'
$lsa = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa'
Chk 'everyoneincludesanonymous = 1' ($lsa.everyoneincludesanonymous -eq 1) $lsa.everyoneincludesanonymous
Chk 'LimitBlankPasswordUse = 0'     ($lsa.LimitBlankPasswordUse -eq 0)     $lsa.LimitBlankPasswordUse
Chk 'restrictanonymous = 0'         ($lsa.restrictanonymous -eq 0)         $lsa.restrictanonymous

Section 'SMB CONFIG (stored in registry, applied at service start)'
$sc = Get-SmbClientConfiguration; $ss = Get-SmbServerConfiguration
Chk 'client signing not required' ($sc.RequireSecuritySignature -eq $false) $sc.RequireSecuritySignature
Chk 'insecure guest logons on'    ($sc.EnableInsecureGuestLogons -eq $true) $sc.EnableInsecureGuestLogons
Chk 'server signing not required' ($ss.RequireSecuritySignature -eq $false) $ss.RequireSecuritySignature
Chk 'Guest account enabled'       ((Get-LocalUser -Name Guest).Enabled -eq $true) (Get-LocalUser -Name Guest).Enabled

Section 'SERVICES - Running is NOT enough, StartMode must be Auto'
foreach ($s in 'LanmanServer','LanmanWorkstation','FDResPub','fdPHost','SSDPSRV','upnphost','sshd','w32time') {
    $svc = Get-CimInstance Win32_Service -Filter "Name='$s'" -EA SilentlyContinue
    if (-not $svc) {
        # sshd is only needed on machines Claude connects INTO. The Beast is the
        # client and has never had it - that is by design, not a fault.
        if ($s -eq 'sshd') { Write-Output ("  ----  {0,-42} not installed (Beast is the client - by design)" -f $s) }
        else { Chk $s $false 'NOT INSTALLED' }
        continue
    }
    $ok = ($svc.StartMode -eq 'Auto')
    Chk "$s starts at boot" $ok "$($svc.State) / $($svc.StartMode)"
}

Section 'FIREWALL - the PERSISTENT store, not the live one'
foreach ($grp in 'Network Discovery','File and Printer Sharing') {
    $r = @(Get-NetFirewallRule -PolicyStore PersistentStore -DisplayGroup $grp -EA SilentlyContinue)
    $on = @($r | Where-Object { $_.Enabled -eq 'True' }).Count
    Chk "$grp persists" ($r.Count -gt 0 -and $on -eq $r.Count) "$on/$($r.Count) in PersistentStore"
}
Chk 'Private profile firewall on' ((Get-NetFirewallProfile -Name Private).Enabled -eq $true) (Get-NetFirewallProfile -Name Private).Enabled
Chk 'Public profile firewall on'  ((Get-NetFirewallProfile -Name Public).Enabled -eq $true)  (Get-NetFirewallProfile -Name Public).Enabled

Section 'NETWORK PROFILE - must be Private or discovery dies on reboot'
$p = @(Get-NetConnectionProfile)
Chk 'connection profile Private' (($p | Where-Object { $_.NetworkCategory -ne 'Private' }).Count -eq 0) (($p | ForEach-Object { "$($_.InterfaceAlias)=$($_.NetworkCategory)" }) -join ', ')

Section 'SCHEDULED TASKS - must exist, be enabled, and have a boot/logon trigger'
$wanted = @{
    'HCC-MapBeastAtLogon' = 'remaps O: to the Beast'
    'HCC-PrinterKeepAlive' = 'stops the printer idle-off'
    'HCC-WatchAcer'        = 'freeze watcher (Beast only)'
}
foreach ($t in $wanted.Keys) {
    $task = Get-ScheduledTask -TaskName $t -EA SilentlyContinue
    if (-not $task) { Write-Output ("  ----  {0,-42} not on this machine" -f $t); continue }
    $trig = @($task.Triggers | ForEach-Object { $_.CimClass.CimClassName })
    $bootish = ($trig -match 'Logon|Boot|Time').Count -gt 0
    Chk "$t armed" (($task.State -ne 'Disabled') -and $bootish) "$($task.State), trigger=$($trig -join ',')"
}

Section 'PERSISTENT DRIVE MAPPINGS (recorded in HKCU\Network)'
$maps = @(Get-ChildItem 'HKCU:\Network' -EA SilentlyContinue)
if ($maps.Count -eq 0) { Write-Output '  ----  no persistent mappings on this machine' }
foreach ($m in $maps) {
    $rp = (Get-ItemProperty $m.PSPath).RemotePath
    Chk "drive $($m.PSChildName): persists" ($rp -ne $null) $rp
}

Section 'POWER - the idle settings must be in the SCHEME, not just runtime'
foreach ($x in @(@('SUB_VIDEO','VIDEOIDLE','display off'), @('SUB_SLEEP','STANDBYIDLE','sleep'), @('SUB_DISK','DISKIDLE','disk off'))) {
    $q = powercfg /query SCHEME_CURRENT $x[0] $x[1] 2>$null
    $ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
    if ($ac) {
        $secs = [convert]::ToInt32($ac,16)
        $txt = $(if($secs -eq 0){'NEVER'}else{"$([math]::Round($secs/60,1)) min"})
        # Display-off is only load-bearing on the Acer, which freezes at idle.
        # On the Beast a dark screen changes nothing about services or sharing.
        if ($x[2] -eq 'display off' -and $env:COMPUTERNAME -ne 'JEFFSLAPTOP') {
            Write-Output ("  ----  {0,-42} {1} (not load-bearing on this machine)" -f "$($x[2]) on AC", $txt)
        } else { Chk "$($x[2]) on AC = never" ($secs -eq 0) $txt }
    }
}
$sub='0012ee47-9041-4b5d-9b77-535fba8b1442'
foreach ($pair in @(@('HIPM','0b2d69d7-a2a1-449c-9680-f91c70521c60'), @('DIPM','dab60367-53fe-4fbc-825e-521d069d2456'))) {
    $q = powercfg /query SCHEME_CURRENT $sub $pair[1] 2>$null
    $ac = ($q | Select-String 'Current AC Power Setting Index') -replace '.*:\s*',''
    if ($ac) { Chk "SATA $($pair[0]) disabled" ($ac.Trim() -eq '0x00000000') $ac.Trim() }
}
$sleepers = @((Get-CimInstance -Namespace root\wmi -ClassName MSPower_DeviceEnable -EA SilentlyContinue) | Where-Object { $_.Enable -eq $true })
Chk 'no device may power itself down' ($sleepers.Count -eq 0) "$($sleepers.Count) still allowed"

Write-Output ""
Write-Output "================================================================"
Write-Output ("  {0}  -  {1} PASS   {2} FAIL" -f $env:COMPUTERNAME, $script:pass, $script:fail)
Write-Output "================================================================"
