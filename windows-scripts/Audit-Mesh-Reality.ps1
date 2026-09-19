# A PROACTIVE end-to-end audit of what Jeff would ACTUALLY do at each machine.
#
# WHY THIS EXISTS. Rule 10 has stood since 2026-06-24: "Be proactive - find and
# fix bugs before Jeff sees them. Do not wait for Jeff to report issues." On
# 2026-09-19 Jeff had to tell me the Lenovo was unreachable, had to raise the
# 5 GHz question, and had to point at media sharing. I found none of it myself,
# and he said so plainly: "unless I bring up these things you never look for
# them on your own". This script is the answer to that - run it UNPROMPTED.
#
# It deliberately does NOT reuse Verify-Network.ps1's checks. SIX of those have
# been caught failing healthy machines. This tests the USER-FACING act: resolve
# each machine BY NAME, open its shares, and confirm the reverse direction too.
#
# THREE TRAPS BAKED IN, each already paid for:
#  1. Do NOT name helpers R or H. R is an alias for Invoke-History and H for
#     Get-History, so calls silently go to the wrong cmdlet and print NOTHING.
#  2. Do NOT write `$ok -eq 'skip'`. When $ok is $true PowerShell coerces and
#     that comparison is TRUE, so every PASS prints as SKIP. Test the type.
#  3. Do NOT inline PowerShell/bash through ssh. The quoting gets mangled and
#     returns EMPTY, which reads like a broken MACHINE instead of a broken
#     COMMAND. Deploy a probe file and run it by path.
$ErrorActionPreference = 'SilentlyContinue'
$here = Split-Path $MyInvocation.MyCommand.Path
$script:pass = 0; $script:fail = 0; $script:skip = 0

function Section($t){ Write-Output ""; Write-Output "===== $t =====" }
function Res($label, $ok, $detail){
    if ($ok -is [string] -and $ok -eq 'skip') { $tag = 'SKIP'; $script:skip++ }
    elseif ($ok)                              { $tag = 'PASS'; $script:pass++ }
    else                                      { $tag = 'FAIL'; $script:fail++ }
    Write-Output ("  {0}  {1,-44} {2}" -f $tag, $label, $detail)
}

Write-Output "================================================================"
Write-Output "  HCC MESH REALITY AUDIT   $(Get-Date -Format 'ddd yyyy-MM-dd h:mm tt')"
Write-Output "================================================================"

# --- deploy the probes as FILES, never inline ---
& scp -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$here\audit-probe-acer.ps1" jeffl@192.168.1.176:C:/HCC-SETUP/audit-probe.ps1 2>$null | Out-Null
$tmp = [IO.Path]::GetTempFileName()
[IO.File]::WriteAllText($tmp, ([IO.File]::ReadAllText("$here\audit-probe-lenovo.sh") -replace "`r",""))
& scp -o StrictHostKeyChecking=no -o ConnectTimeout=10 $tmp jeffloewen@192.168.1.173:/tmp/audit-probe.sh 2>$null | Out-Null
Remove-Item $tmp -Force

$A = (& ssh -o ConnectTimeout=15 -o BatchMode=yes jeffl@192.168.1.176 'powershell -NoProfile -ExecutionPolicy Bypass -File C:\HCC-SETUP\audit-probe.ps1' 2>$null) -split '\|'
$L = (& ssh -o ConnectTimeout=15 -o BatchMode=yes jeffloewen@192.168.1.173 'bash /tmp/audit-probe.sh' 2>$null) -split '\|'

Section 'NAME RESOLUTION - clicking a machine in Network uses the NAME'
foreach ($m in @(@('301SERVER','192.168.1.194'), @('JeffsLapTop','192.168.1.176'), @('GarageLaptop','192.168.1.173'))) {
    $ip = try { ([Net.Dns]::GetHostAddresses($m[0]) | Where-Object { $_.AddressFamily -eq 'InterNetwork' })[0].IPAddressToString } catch { $null }
    Res "resolve $($m[0])" ($ip -eq $m[1]) $(if($ip){"-> $ip"}else{'NOT RESOLVABLE'})
}

Section 'SHARES - can the Beast actually OPEN what each machine offers?'
foreach ($t in @(@('\\GarageLaptop\GarageFiles','the Lenovo share, BY NAME'), @('\\192.168.1.173\GarageFiles','the same share, by IP'))) {
    $ok = Test-Path $t[0]
    $n = if ($ok) { @(Get-ChildItem $t[0] -EA SilentlyContinue).Count } else { 0 }
    Res $t[0] $ok $(if($ok){"$n items - $($t[1])"}else{"cannot open - $($t[1])"})
}

Section 'REVERSE - can each machine reach the BEAST? (the half that gets forgotten)'
Res 'Acer -> Beast live SMB sessions' ([int]$A[0] -gt 0) "$($A[0]) session(s)"
Res 'Lenovo -> Beast mount readable'  ([int]$L[0] -gt 0) "$($L[0]) files"
Res 'Lenovo -> Acer' $(if([int]$L[1] -gt 0){$true}else{'skip'}) $(if([int]$L[1] -gt 0){"$($L[1]) items"}else{'not mounted - documented gap, NTFS denies guest'})

Section 'DISCOVERY + NAME SERVICE on the Lenovo'
Res 'wsdd-host (advertises to Windows)' ($L[2] -eq 'active') $L[2]
Res 'nmbd (answers name lookups)'       ($L[3] -eq 'active') $L[3]
Res 'smbd (serves the files)'           ($L[4] -eq 'active') $L[4]

Section 'PRINTER'
$pr = Test-NetConnection -ComputerName 192.168.1.208 -Port 9100 -WarningAction SilentlyContinue
Res 'printer 192.168.1.208:9100' $pr.TcpTestSucceeded $(if($pr.TcpTestSucceeded){'accepting jobs'}else{'NOT REACHABLE'})
$ka = Get-ScheduledTask -TaskName 'HCC-PrinterKeepAlive' -EA SilentlyContinue
Res 'keepalive task' ($ka -ne $null) $(if($ka){$ka.State}else{'MISSING'})

Section 'AUTO-RECOVERY - will it survive a reboot?'
Res 'Lenovo services enabled at boot' ($L[5] -and $L[5] -notmatch 'disabled') $L[5]
Res 'Acer drive-remap task'           ($A[1] -match 'Ready|Running') $A[1]

Section 'TIME - every fault call here rests on event timestamps'
Res 'Beast clock'  $true (Get-Date).ToString('HH:mm:ss')
Res 'Acer clock'   ($A[2] -ne '') $(if($A[2]){$A[2]}else{'no answer'})
Res 'Lenovo clock' ($L[6] -ne '') $(if($L[6]){$L[6]}else{'no answer'})

Section 'UPTIME (the Acer is under freeze observation)'
Res 'Acer uptime'   ($A[4] -ne '') "$($A[4]) min"
Res 'Lenovo uptime' ($L[7] -ne '') "$($L[7]) min"
$w = Get-ScheduledTask -TaskName 'HCC-WatchAcer' -EA SilentlyContinue
Res 'freeze watcher running' ($w.State -eq 'Running') $w.State

Write-Output ""
Write-Output "================================================================"
Write-Output ("  {0} PASS   {1} FAIL   {2} SKIP" -f $script:pass, $script:fail, $script:skip)
Write-Output "================================================================"
