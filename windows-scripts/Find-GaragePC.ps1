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
    # Never conclude from a ping. Try to get a NAME or a Windows service.
    $out = [ordered]@{ ip = $ip; name = $null; smb = $false; rdp = $false }
    try { $out.name = [Net.Dns]::GetHostEntry($ip).HostName } catch {}
    foreach ($p in @(445, 3389)) {
        $t = New-Object Net.Sockets.TcpClient
        $ok = $t.BeginConnect($ip, $p, $null, $null).AsyncWaitHandle.WaitOne(700)
        if ($ok -and $t.Connected) { if ($p -eq 445) { $out.smb = $true } else { $out.rdp = $true } }
        $t.Close()
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
        "            SMB 445 {0}   RDP 3389 {1}" -f $(if ($id.smb) { 'OPEN' } else { 'closed' }), $(if ($id.rdp) { 'OPEN' } else { 'closed' })
        if ($isWindows) {
            "  >>> THIS LOOKS LIKE A WINDOWS MACHINE. Very likely the garage PC."
            "      Next: authenticate with the account in HCC_ACCESS.md section 5"
            "      (the account is 'Jeff Loewen Office 2', NOT jeffl), then set a DHCP"
            "      reservation on the BGW320 so this address stops drifting."
        } else {
            "      (no Windows services - could be a phone, a TV, a plug. Do NOT call it the"
            "       garage PC on the strength of an address alone.)"
        }
    }
    if ($Minutes -gt 0 -and (Get-Date) -lt $deadline) { Start-Sleep -Seconds 20 }
} while ($Minutes -gt 0 -and (Get-Date) -lt $deadline)
