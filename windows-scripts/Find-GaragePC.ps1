# Find-GaragePC.ps1 - detect the garage PC the moment it joins the network, and prove it is
# actually THAT machine rather than something else answering at an address.
#
# Written 2026-09-16 02:05. Jeff: "If I bring it to the Ethernet cable you can fix the rest?"
# Yes - this is the part that runs the instant it appears.
#
# 🔴 WHY IDENTITY MATTERS HERE: at 01:41 tonight I pinged 192.168.1.215, got three replies, and
# was one sentence from reporting "GaragePC is back on the network." .215 is the Fire TV.
# A ping proves SOMETHING answers at an address. It never proves WHICH something.
# So this script never concludes from a ping alone - it wants a name or a service.
#
# Its old addresses (.121, .212) are stale by design: it takes a fresh DHCP lease every time it
# moves, and a cached DNS entry kept resolving the hostname to a dead .121 for weeks, which is
# precisely what made it look present when it was gone.
param(
    [int]$Minutes = 0,          # 0 = single sweep; >0 = keep watching for this many minutes
    [switch]$Quiet
)
$ErrorActionPreference = 'SilentlyContinue'

# Known occupants, so a "new" host is genuinely new. From docs/inventory/NETWORK_MAP.md.
$KNOWN = @{
    '192.168.1.66'  = 'Beehive / Home Assistant'
    '192.168.1.194' = 'the beast (301Server)'
    '192.168.1.196' = 'RE200 wired AP'
    '192.168.1.208' = 'HP OfficeJet 4650 printer'
    '192.168.1.215' = 'Fire TV (viewing room)   <-- NOT GaragePC'
    '192.168.1.222' = 'NETGEAR NTV300'
    '192.168.1.254' = 'BGW320 gateway'
    '192.168.1.164' = "Angela's work computer"
    '192.168.1.176' = 'JeffsLapTop'
    # Added from the 2026-09-16 02:04 baseline sweep, so the garage PC stands out when it lands:
    '192.168.1.186' = 'unidentified, reverse-DNS "none.local", no Windows services'
    '192.168.1.241' = 'Roku TV ("32onnRokuTV")'
    '192.168.1.173' = 'GarageLaptop (Lenovo)'
    '192.168.1.231' = 'Sharky (robot vacuum)'
}

function Sweep {
    $found = @()
    # ARP is cheap and shows anything that has talked recently
    $arp = arp -a | Select-String '192\.168\.1\.'
    foreach ($line in $arp) {
        $parts = ($line -replace '\s+', ' ').Trim() -split ' '
        if ($parts.Count -lt 2) { continue }
        $ip = $parts[0]; $mac = $parts[1]
        # `arp -a` prints an "Interface: 192.168.1.194 --- 0xN" header that matches the IP regex
        # and parses as a host whose "MAC" is an IP address. Caught on the first baseline run.
        if ($line -match 'Interface:') { continue }
        if ($ip -notmatch '^\d{1,3}(\.\d{1,3}){3}$') { continue }
        if ($mac -notmatch '^[0-9a-f]{2}(-[0-9a-f]{2}){5}$') { continue }   # must be a real MAC
        if ($ip -match '255$' -or $ip -match '^224\.' -or $ip -match '^239\.') { continue }
        $label = $KNOWN[$ip]
        $found += [pscustomobject]@{ IP = $ip; MAC = $mac; Known = $label }
    }
    return $found
}

function Identify($ip) {
    # Never conclude from a ping. Try to get a NAME or a service.
    # 2026-09-23: the HP is no longer becoming a Windows box. The stick builds it as UBUNTU named
    # KitchenPC with sshd and the Beast's key, and samba only appears LATER, once the setup script
    # has run. So looking for 445/3389 would have missed the very machine this script exists to
    # catch. Port 22 is the arrival signal now; SMB showing up afterwards means it is integrated.
    $out = [ordered]@{ ip = $ip; name = $null; smb = $false; rdp = $false; ssh = $false; sshName = $null }
    try { $out.name = [Net.Dns]::GetHostEntry($ip).HostName } catch {}
    foreach ($p in @(445, 3389, 22)) {
        $t = New-Object Net.Sockets.TcpClient
        $ok = $t.BeginConnect($ip, $p, $null, $null).AsyncWaitHandle.WaitOne(700)
        if ($ok -and $t.Connected) {
            switch ($p) { 445 { $out.smb = $true } 3389 { $out.rdp = $true } 22 { $out.ssh = $true } }
        }
        $t.Close()
    }
    # THE DECISIVE CHECK: ask the machine its own name over a real key login. A ping proves
    # something answers at an address; a hostname returned through an authenticated shell proves
    # WHICH something. That is the whole lesson of the .215 Fire TV near-miss above.
    if ($out.ssh) {
        $n = & ssh -o BatchMode=yes -o StrictHostKeyChecking=no -o ConnectTimeout=6 "jeff@$ip" hostname 2>$null
        if ($LASTEXITCODE -eq 0 -and $n) { $out.sshName = ("$n").Trim() }
    }
    return [pscustomobject]$out
}

$deadline = (Get-Date).AddMinutes([Math]::Max($Minutes, 0))
do {
    $hosts = Sweep
    $unknown = $hosts | Where-Object { -not $_.Known }
    if (-not $Quiet) {
        "`n{0}  -  {1} hosts in ARP, {2} not in the known list" -f (Get-Date -Format 'HH:mm:ss'), $hosts.Count, $unknown.Count
    }
    foreach ($h in $unknown) {
        $id = Identify $h.IP
        $isWindows = $id.smb -or $id.rdp
        "  NEW HOST  {0,-15} mac {1}" -f $h.IP, $h.MAC
        "            name : {0}" -f $(if ($id.name) { $id.name } else { '(no reverse DNS)' })
        "            SMB 445 {0}   RDP 3389 {1}   SSH 22 {2}" -f $(if ($id.smb) { 'OPEN' } else { 'closed' }), $(if ($id.rdp) { 'OPEN' } else { 'closed' }), $(if ($id.ssh) { 'OPEN' } else { 'closed' })
        if ($id.sshName) {
            "            answers to : {0}   (authenticated shell - this is REAL identity)" -f $id.sshName
        }
        if ($id.sshName -match 'KitchenPC') {
            "  >>> KITCHENPC IS UP. The stick built it and it took the Beast's key."
            "      Finish it from here - nothing needed in the garage:"
            "        ssh jeff@{0} 'bash ~/GARAGE-SETUP/garage-hp-setup.sh'" -f $h.IP
            "      That does workgroup, the guest share + credential fencing, the Beast and Acer"
            "      mounts, the printer, desktop shortcuts and the handoff watcher, then prints its"
            "      own PASS/FAIL list. Afterwards give it a DHCP reservation on the BGW320."
        } elseif ($isWindows) {
            "  >>> THIS LOOKS LIKE A WINDOWS MACHINE. Very likely the garage PC."
            "      Next: authenticate with the account in HCC_ACCESS.md section 5"
            "      (the account is 'Jeff Loewen Office 2', NOT jeffl), then set a DHCP"
            "      reservation on the BGW320 so this address stops drifting."
        } elseif ($id.ssh) {
            "      SSH is open but it did not answer as KitchenPC. Do NOT assume - check the name."
        } else {
            "      (no Windows services - could be a phone, a TV, a plug. Do NOT call it the"
            "       garage PC on the strength of an address alone.)"
        }
    }
    if ($Minutes -gt 0 -and (Get-Date) -lt $deadline) { Start-Sleep -Seconds 20 }
} while ($Minutes -gt 0 -and (Get-Date) -lt $deadline)
