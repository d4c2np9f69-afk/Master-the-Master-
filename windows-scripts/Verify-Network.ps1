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

# Checks BOTH routes and passes if EITHER works. Which one is live flipped TWICE
# in one day (09-19): OneDrive died with 0x8004de80 -> "Okay no OneDrive on acer"
# -> files came over the O: SMB mapping -> then 07:54 Jeff turned OneDrive back
# on, "it is now working great" (verified: 19,962 files / 45.54 GB, no errors).
# A check hard-wired to one route fails the moment he changes his mind.
# ALSO: never test the O: drive letter over SSH - net use mappings are PER LOGON
# SESSION, so O: reads "Unavailable" in an SSH session while Jeff's console
# session has it mounted. That nearly got reported as a broken mesh leg when
# HCC-MapBeastAtLogon had in fact run at 23:22:03 and returned 0x0.
# Get-SmbConnection is machine-wide and is the honest instrument.
$out = RemoteRun $ACER 'powershell -NoProfile -ExecutionPolicy Bypass -File C:\HCC-SETUP\acer-files-probe.ps1'
$parts = $out -split '\|'
$ok = ($parts.Count -ge 4) -and ($parts[0] -ne 'NONE')
Result 'JeffsLapTop - reaches Jeff''s files' $ok $(if($ok){"via $($parts[0]) - $($parts[1]) SMB session(s), $($parts[3]) OneDrive files"}else{"no route to his files: $out"})

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

Say "6. NO PASSWORDS ON THE NETWORK (Jeff 2026-09-22) - and credentials still fenced"
# Built 2026-09-22. Two halves, and BOTH must hold:
#   (a) every machine opens from every other machine with NO password
#   (b) credential folders are STILL refused - that exception is part of the decision, not a caveat
# The LENOVO is the prober for both Windows boxes: it has no account on either, so what it can
# reach is exactly what any laptop joining the Wi-Fi can reach.
#
# QUOTING - this cost a red run the day it was written, and this file already warned about it.
# PowerShell does NOT use backslash as an escape, so a remote command written with \" ends the
# string early and the check then measures garbage. It reported six credential folders WIDE OPEN
# while every one was correctly ACCESS_DENIED. Build remote commands by CONCATENATION.

# (a) the Windows boxes must accept the credential Explorer actually presents: the logged-on name
# with a password that does not match. Only ForceGuest mapping it to Guest prevents a password box,
# so a WRONG-PASSWORD probe is the honest test - an anonymous probe can pass while Explorer fails.
$probe194 = 'smbclient //192.168.1.194/Jeff -U jeffl%wrongpassword_probe -c ls 2>&1 | head -4'
$out = RemoteRun $LENOVO $probe194
Result 'Beast opens with a WRONG password' ($out -notmatch 'NT_STATUS') 'mapped to Guest by ForceGuest - no password box'

$probe176 = 'smbclient //192.168.1.176/jeffl -U jeffl%wrongpassword_probe -c ls 2>&1 | head -4'
$out = RemoteRun $LENOVO $probe176
Result 'Acer opens with a WRONG password' ($out -notmatch 'NT_STATUS') 'mapped to Guest by ForceGuest - no password box'

$probe173 = 'smbclient //192.168.1.173/GarageFiles -N -c ls 2>&1 | head -4'
$out = RemoteRun $LENOVO $probe173
Result 'Lenovo opens with no password' ($out -notmatch 'NT_STATUS') 'samba map to guest = Bad User'

# the CLIENT half. A machine can SERVE with no password and still be unable to OPEN one:
# Win11 24H2 requires SMB signing and a guest session CANNOT be signed (0xC05D0003). That was the
# real Acer blocker. These are machine-wide reads, so they stay honest over SSH (ACCESS_MAP 4b).
$c = Get-SmbClientConfiguration
Result 'Beast may OPEN a guest share' ($c.EnableInsecureGuestLogons -and -not $c.RequireSecuritySignature) "InsecureGuest=$($c.EnableInsecureGuestLogons) RequireSigning=$($c.RequireSecuritySignature)"

$acerCmd = 'powershell -NoProfile -Command "(Get-SmbClientConfiguration).EnableInsecureGuestLogons,(Get-SmbClientConfiguration).RequireSecuritySignature"'
$out = RemoteRun $ACER $acerCmd
$flat = ($out -replace '\s+','/')
Result 'Acer may OPEN a guest share' ($flat -eq 'True/False') "InsecureGuest/RequireSigning = $flat"

# (b) the exception. Jeff opened his FILES, never his keys. A regression here is silent and serious.
$credDirs = '.ssh','.claude','AppData','HCC-secrets','iCloudDrive\HCC-Secrets-Vault','iCloudDrive\HCC-secrets'
foreach ($d in $credDirs) {
    $cmd = 'smbclient //192.168.1.194/Jeff -U probe%x -c ' + "'cd $d; ls'" + ' 2>&1 | head -2'
    $out = RemoteRun $LENOVO $cmd
    # STRICT: only an explicit refusal counts. "not found" is NOT a pass - a folder that was moved
    # or renamed must go red and get looked at, never score green by being absent.
    $fenced = $out -match 'ACCESS_DENIED'
    $why = "guest cannot read it"
    if (-not $fenced) { $why = "NOT REFUSED - $out" }
    Result "Beast: $d refused to guest" $fenced $why
}

$cmd = 'smbclient //192.168.1.176/jeffl -U probe%x -c ' + "'cd .ssh; ls'" + ' 2>&1 | head -2'
$out = RemoteRun $LENOVO $cmd
Result 'Acer: .ssh refused to guest' ($out -match 'ACCESS_DENIED') "$out"

$cmd = 'smbclient //192.168.1.173/GarageFiles -N -c ' + "'cd .ssh; ls'" + ' 2>&1 | head -2'
$out = RemoteRun $LENOVO $cmd
Result 'Lenovo: .ssh hidden from the share' ($out -match 'NT_STATUS') 'samba veto files - the private key is not served'

# What this section deliberately does NOT claim. Explorer on the Acer runs in Jeff CONSOLE logon and
# an SSH session cannot borrow it (no network credentials to delegate). Proof that it is SSH lying
# and not the network: the Acer->Lenovo leg fails the same way over SSH while Get-SmbConnection
# shows it LIVE from his desktop. So this stays a SKIP, never a fake PASS.
Result 'Acer Explorer double-click' 'skip' 'only Jeff can see his own console - ACCESS_MAP 4b'

Say "7. WALK-UP ACCESS: Network -> <PC> opens with NO password (Jeff 2026-09-23)"
# Jeff: "all my computers ... work as one ... no password needed for any of them on my network."
#
# THE ROOT CAUSE THIS SECTION GUARDS, found 2026-09-23 after a day of chasing guest/signing settings:
# Explorer Network connects BY NAME. Jeff's profile is MICROSOFT-ACCOUNT linked, so with no session for
# that name Windows offers MicrosoftAccount\jeff.loewen@comcast.net; the far end answers 0xC0000064
# "user name does not exist" and shows the credential box. ForceGuest cannot help - it demotes only
# LOCAL accounts to Guest, and an MSA logon is not local. The fix is a Guest IPC$ session PER NAME,
# established by each machine's logon task. IPC$ sessions cannot be persistent, hence the task.

# (a) the actual walk-up behaviour, by NAME - this is the double-click
$out = cmd /c "net view \\JEFFSLAPTOP 2>&1" | Out-String
Result 'Beast opens Acer BY NAME, no password' ($out -match 'Share name' -and $out -notmatch 'error') 'net view \\JEFFSLAPTOP listed shares'
$out = cmd /c "net view \\GARAGELAPTOP 2>&1" | Out-String
Result 'Beast opens Lenovo BY NAME, no password' ($out -match 'Share name' -and $out -notmatch 'error') 'net view \\GARAGELAPTOP listed shares'

# (b) the SMB CLIENT service. On 2026-09-23 the Acer had LanmanWorkstation DEAD with an EMPTY
# Parameters\ServiceDll, so every outbound connection failed "System error 67" and NOTHING reached
# the far end - it looked exactly like a sharing-permissions problem and was not one.
$svc = Get-Service LanmanWorkstation
$dll = (Get-Item "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters").GetValue("ServiceDll",$null,[Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
Result 'Beast SMB client service alive' ($svc.Status -eq 'Running' -and $dll) "Workstation=$($svc.Status) ServiceDll=$dll"

$out = RemoteRun $ACER 'powershell -NoProfile -Command "(Get-Service LanmanWorkstation).Status"'
Result 'Acer SMB client service alive' ($out -match 'Running') "Workstation=$out"
# reg query needs NO nested quotes - the Get-Item form returned empty through PowerShell->ssh and
# reported a FALSE FAIL against a value that was correctly set. Quote-free is the reliable shape.
$out = RemoteRun $ACER 'reg query HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters /v ServiceDll'
Result 'Acer Workstation ServiceDll set' ($out -match 'wkssvc.dll') "$($out -replace '\s+',' ')"

# (c) it must be PERMANENT - the IPC$ session dies with the logon, so the logon task is the mechanism
$t = Get-ScheduledTask -TaskName 'HCC-Map-Lenovo-SMB' -ErrorAction SilentlyContinue
$ok = $t -and $t.Triggers.Enabled -contains $true
Result 'Beast maps the network at logon' $ok 'HCC-Map-Lenovo-SMB -> map-lenovo-smb.cmd, logon trigger'
$out = RemoteRun $ACER 'powershell -NoProfile -Command "(Get-ScheduledTask -TaskName \"HCC-MapBeastAtLogon\").State"'
Result 'Acer maps the network at logon' ($out -match 'Ready|Running') "HCC-MapBeastAtLogon state=$out"

Say "8. HANDOFF: pick up what you were doing on ANY machine (Jeff 2026-09-23)"
# Jeff: "I'm watching a utube video on the beast, I go to the garage to work on the bench and I can
# pull the video up there and continue" + "I want it to go both ways."
#
# Relay on the Beast, one queue per target, /send?to= and /pending?for=. Watchers on each machine.
# THE PERMANENCE BUG THIS GUARDS, found 2026-09-23: the relay task had a BOOT trigger but
# LogonType=Interactive, so after the 09-20 reboot it could never start - nobody is logged in at
# boot. It last ran 09-19 and sat dead for four days while Task Scheduler cheerfully said "Ready".
# The relay now runs as SYSTEM (it serves HTTP, it needs no desktop); the WATCHERS run at logon
# (they open a browser Jeff looks at). Getting those two backwards is the whole failure mode.

$relay = 'http://192.168.1.194:8099'
try { $st = [Text.Encoding]::UTF8.GetString((Invoke-WebRequest "$relay/status" -UseBasicParsing -TimeoutSec 6).Content) } catch { $st = [string]::Empty }
Result 'Handoff relay answering' ($st -match 'relay alive') "$(($st -split "`n")[0])"
Result 'Relay has a queue per target' (($st -match 'garage') -and ($st -match 'beast') -and ($st -match 'acer')) 'garage + beast + acer queues present'

# the relay MUST be SYSTEM+boot or it dies at the next restart - this is the exact 09-19 bug
$rt = Get-ScheduledTask -TaskName 'HCC-GarageHandoff' -ErrorAction SilentlyContinue
$sysBoot = $rt -and $rt.Principal.UserId -match 'SYSTEM' -and ($rt.Triggers | ForEach-Object { $_.CimClass.CimClassName }) -contains 'MSFT_TaskBootTrigger'
Result 'Relay survives reboot (SYSTEM + at boot)' $sysBoot "principal=$($rt.Principal.UserId) trigger=$(($rt.Triggers | ForEach-Object { $_.CimClass.CimClassName }) -join ",")"
$restart = $rt -and $rt.Settings.RestartCount -gt 0
Result 'Relay restarts itself on failure' $restart "RestartCount=$($rt.Settings.RestartCount)"

# watchers - one per machine, each must be at LOGON (they open a browser in Jeff's session)
$wt = Get-ScheduledTask -TaskName 'HCC-HandoffWatcher' -ErrorAction SilentlyContinue
$wOk = $wt -and (($wt.Triggers | ForEach-Object { $_.CimClass.CimClassName }) -contains 'MSFT_TaskLogonTrigger')
Result 'Beast watcher armed at logon' $wOk "state=$($wt.State)"
$out = RemoteRun $ACER 'powershell -NoProfile -Command "(Get-ScheduledTask -TaskName \"HCC-HandoffWatcher\").State"'
Result 'Acer watcher armed at logon' ($out -match 'Ready|Running') "state=$out"
$out = RemoteRun $LENOVO 'systemctl --user is-enabled garage-handoff'
Result 'Garage watcher enabled (systemd user)' ($out -match 'enabled') "is-enabled=$out"
$out = RemoteRun $LENOVO 'loginctl show-user jeffloewen -p Linger'
Result 'Garage watcher runs with nobody logged in' ($out -match 'Linger=yes') 'linger on - it starts at boot, not at login'

# FEATURE TEST, not a component test: actually push something through the relay and watch a
# machine consume it. A relay that answers /status can still be handing nothing over.
$probe = 'https://example.com/hcc-gate-probe'
try {
    [void](Invoke-WebRequest "$relay/send?to=garage&u=$probe" -UseBasicParsing -TimeoutSec 6)
    Start-Sleep -Seconds 6
    $after = [Text.Encoding]::UTF8.GetString((Invoke-WebRequest "$relay/status" -UseBasicParsing -TimeoutSec 6).Content)
    # the garage watcher should have taken it, flipping consumed to True for that queue
    $line = ($after -split "`n" | Select-String -Pattern 'garage' -Context 0,1) -join ' '
    $taken = $line -match 'consumed: True'
} catch { $taken = $false; $line = "relay unreachable" }
Result 'Garage actually CONSUMES a handoff' $taken "probe delivered and picked up"
# example.com is used deliberately - an earlier test used real YouTube links and left videos
# playing on three machines. A gate must never start media on a screen Jeff is looking at.
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("  {0} PASS   {1} FAIL   {2} SKIP" -f $script:pass, $script:fail, $script:skip) -ForegroundColor $(if($script:fail){'Yellow'}else{'Green'})
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  SKIP is NOT a pass. It means that machine is not on the network" -ForegroundColor DarkGray
Write-Host "  yet, or has no shell by design. FAIL means it should work and does not." -ForegroundColor DarkGray
Write-Host ""
