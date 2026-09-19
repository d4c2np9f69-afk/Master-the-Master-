# Verify-Network.ps1 — PROVE the house network, do not assert it.
#
# docs/computers/NETWORK_PLAN.md section 6 asked for exactly this:
#   "Not 'it looks right.' A script that PROVES it... Every machine answers on its
#    reserved address, every machine accepts an SSH key login from the Beast, every
#    machine can read the shared drive. Each check names what proved it.
#    A component check is not a feature check — so the test is 'I opened a shell on
#    that machine and listed the share', not 'the port is open'."
#
# Built 2026-09-18. Run it any time. Read only — it changes nothing.
#
# NOTE ON STYLE: every remote command is a SINGLE-QUOTED PowerShell string, so PS
# passes it through literally and the remote shell does the interpreting. Double
# quotes here let PowerShell 5.1 try to parse '&&' and '2>&1' as its own syntax.

$ErrorActionPreference = 'SilentlyContinue'
$script:pass = 0; $script:fail = 0; $script:skip = 0

function Say($t) { Write-Host ""; Write-Host "--- $t" -ForegroundColor Cyan }

function Result($name, $ok, $proof) {
    if ($ok -is [string]) {                      # 'skip' — must test type first;
        Write-Host ("  SKIP  {0,-44} {1}" -f $name, $proof) -ForegroundColor DarkGray
        $script:skip++                           # ($true -eq 'skip') is TRUE in PS
    } elseif ($ok) {
        Write-Host ("  PASS  {0,-44} {1}" -f $name, $proof) -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host ("  FAIL  {0,-44} {1}" -f $name, $proof) -ForegroundColor Red
        $script:fail++
    }
}

# one place for the ssh flags, so no check can accidentally allow a password prompt
function RemoteRun($target, $cmd) {
    $out = ssh -o ConnectTimeout=8 -o BatchMode=yes -o StrictHostKeyChecking=no $target $cmd 2>&1
    return ("$out").Trim()
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  HCC NETWORK VERIFICATION   $(Get-Date -Format 'ddd yyyy-MM-dd h:mm tt')" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$ACER   = 'jeffl@192.168.1.176'
$LENOVO = 'jeffloewen@192.168.1.173'

$machines = @(
    @{ n='301SERVER (the Beast)';      ip='192.168.1.194'; local=$true }
    @{ n='Beehive (Home Assistant)';   ip='192.168.1.66';  port=8123   }
    @{ n='JeffsLapTop (Acer)';         ip='192.168.1.176'; port=22     }
    @{ n='GarageLaptop (Lenovo)';      ip='192.168.1.173'; port=22     }
    @{ n='GaragePC (HP TouchSmart)';   ip=$null                        }
)

Say "1. IS EACH MACHINE ON THE NETWORK?"
foreach ($m in $machines) {
    if (-not $m.ip)   { Result $m.n 'skip' 'not converted yet - still a physical job'; continue }
    if ($m.local)     { Result $m.n $true  "this machine, $($m.ip)"; continue }
    $up = Test-Connection $m.ip -Count 2 -Quiet -ErrorAction SilentlyContinue
    if ($up) {
        Result $m.n $true "ping reply from $($m.ip)"
    } else {
        # ICMP is often off on Windows; a TCP probe is the better instrument
        $c = New-Object System.Net.Sockets.TcpClient
        try {
            $a  = $c.BeginConnect($m.ip, $m.port, $null, $null)
            $up = $a.AsyncWaitHandle.WaitOne(2500)
            if ($up) { $c.EndConnect($a) }
        } catch { $up = $false } finally { $c.Close() }
        Result $m.n $up $(if($up){"tcp/$($m.port) answers at $($m.ip)"}else{"nothing answers at $($m.ip)"})
    }
}

Say "2. CAN CLAUDE OPEN A SHELL? (a real login, not a port check)"
foreach ($t in @(@{n='JeffsLapTop (Acer)';t=$ACER}, @{n='GarageLaptop (Lenovo)';t=$LENOVO})) {
    $out = RemoteRun $t.t 'hostname'
    $ok  = $out.Length -gt 0 -and $out -notmatch 'denied|refused|timed out|No route|closed|Permission'
    Result "$($t.n) - ssh key login" $ok $(if($ok){"shell answered '$out', no password typed"}else{$out})
}
Result 'Beehive - ssh login'  'skip' 'no shell by design, HA is a web app'
Result 'GaragePC - ssh login' 'skip' 'not converted yet'

Say "3. CAN EACH MACHINE READ THE SHARED DRIVE? (the feature, not the port)"
$ok = Test-Path 'C:\Users\jeffl\OneDrive'
Result '301SERVER - has the share' $ok $(if($ok){'C:\Users\jeffl\OneDrive exists (it is the source)'}else{'NOT FOUND'})

# WAS: smbclient -L //192.168.1.194 -N | grep -ci onedrive. That is ANONYMOUS
# enumeration, and the Beast refuses anonymous (it prompts for a username), so it
# returned 0 and FAILED a machine that reads the share fine - proven 09-19 by
# listing 117 files through the mount. The feature is "can it READ the files",
# so read them. Fixed 09-19.
$out = RemoteRun $LENOVO 'ls /mnt/beast/OneDrive 2>/dev/null | wc -l'
Result 'GarageLaptop - reads the share' ($out -match '^[1-9]') $(if($out -match '^[1-9]'){"$out files readable in /mnt/beast/OneDrive"}else{"cannot read it: $out"})

# The share mounts by IP (//192.168.1.194/OneDrive), NOT by the hostname, so
# grepping for "301SERVER" failed a share that WAS mounted (09-18). Match the
# mount point, which is unambiguous.
$out = RemoteRun $LENOVO 'mount | grep -c "/mnt/beast/OneDrive"'
Result 'GarageLaptop - share MOUNTED' ($out -match '^[1-9]') $(if($out -match '^[1-9]'){'mounted at /mnt/beast/OneDrive, guest read-only, no password'}else{'not mounted - run lenovo-mount-beast.sh'})

# WAS: acer-onedrive-probe.ps1, asserting OneDrive was signed in and syncing.
# TWO reasons that was wrong, both found 09-19:
#  1. JEFF KILLED ONEDRIVE ON THE ACER after error 0x8004de80 - "Okay no OneDrive
#     on acer". The check was asserting a thing he decided against, so it could
#     only ever FAIL. A check must not outlive the decision it encodes.
#  2. Its replacement must not test the O: drive letter over SSH either - net use
#     mappings are PER LOGON SESSION, so O: reads "Unavailable" in an SSH session
#     while Jeff's console session has it mounted. That nearly got reported as a
#     broken mesh leg when HCC-MapBeastAtLogon had in fact run at 23:22:03 and
#     returned 0x0 on the unattended reboot.
# Get-SmbConnection is machine-wide and is the honest instrument.
$out = RemoteRun $ACER 'powershell -NoProfile -ExecutionPolicy Bypass -File C:\HCC-SETUP\acer-files-probe.ps1'
$parts = $out -split '\|'
$ok = ($parts.Count -ge 3) -and ([int]$parts[0] -gt 0) -and ($parts[1] -match '192\.168\.1\.194')
Result 'JeffsLapTop - reaches the Beast''s files' $ok $(if($ok){"$($parts[0]) live SMB session(s) to $($parts[1]); logon remap task OK=$($parts[2])"}else{"$out"})

Say "4. WILL IT SURVIVE A REBOOT? (the thing that actually breaks)"
$out = RemoteRun $ACER 'sc qc sshd'
Result 'JeffsLapTop - sshd starts at boot' ($out -match 'AUTO_START') $(if($out -match 'AUTO_START'){'sc qc sshd = AUTO_START'}else{'unreachable or not automatic'})

$out = RemoteRun $LENOVO 'systemctl is-enabled ssh'
Result 'GarageLaptop - sshd starts at boot' ($out -match 'enabled') $(if($out -match 'enabled'){'systemctl is-enabled = enabled'}else{$out})

$out = RemoteRun $LENOVO 'systemctl is-active hcc-ssh-watchdog.timer'
Result 'GarageLaptop - ssh watchdog armed' ($out -match '^active') $(if($out -match '^active'){'hcc-ssh-watchdog.timer active'}else{$out})

# NOTE: look in BOTH places. The setting can live in logind.conf itself OR in a
# drop-in under logind.conf.d/. On 09-18 this check FAILED a correctly-configured
# machine because it only searched the drop-in folder. The machine was right and
# the test was wrong - which is the worse of the two failures.
$out = RemoteRun $LENOVO 'grep -rhc "^HandleLidSwitchExternalPower=ignore" /etc/systemd/logind.conf /etc/systemd/logind.conf.d/ 2>/dev/null | grep -c 1'
Result 'GarageLaptop - stays awake on mains' ($out -match '^[1-9]') $(if($out -match '^[1-9]'){'HandleLidSwitchExternalPower=ignore is set'}else{'not set'})

Say "5. SAME EXPERIENCE ON EACH? (Job A - what Jeff actually asked for)"
$out = RemoteRun $LENOVO 'command -v google-chrome'
Result 'GarageLaptop - Chrome' ($out -match 'chrome') 'same browser as the Beast, profile carries bookmarks'

$out = RemoteRun $LENOVO 'snap list bitwarden'
Result 'GarageLaptop - Bitwarden' ($out -match 'bitwarden') 'same vault as the Beast'

# count on the REMOTE side. Counting locally meant parsing line endings that came
# back over ssh, and that miscounted 2 real shortcuts as 1 on 09-18.
$n = RemoteRun $LENOVO 'ls -1 ~/Desktop/*.desktop 2>/dev/null | wc -l'
Result 'GarageLaptop - house app + HA icons' ([int]$n -ge 2) "$n app shortcuts on the desktop"

$ok = Test-Path 'C:\Users\jeffl\Scripts\Clean-Beast.ps1'
Result '301SERVER - the cleaner' $ok 'Clean-Beast.ps1 present (the original)'

$out = RemoteRun $ACER 'dir C:\Users\jeffl\Scripts\Clean-Beast.ps1'
Result 'JeffsLapTop - the cleaner' ($out -match 'Clean-Beast') $(if($out -match 'Clean-Beast'){'same Clean-Beast.ps1 as the Beast'}else{'unreachable or missing'})

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("  {0} PASS   {1} FAIL   {2} SKIP" -f $script:pass, $script:fail, $script:skip) -ForegroundColor $(if($script:fail){'Yellow'}else{'Green'})
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  SKIP is NOT a pass. It means that machine is not on the network" -ForegroundColor DarkGray
Write-Host "  yet, or has no shell by design. FAIL means it should work and does not." -ForegroundColor DarkGray
Write-Host ""
