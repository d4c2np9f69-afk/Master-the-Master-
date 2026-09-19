# Deployed to the Acer and run by Audit-Mesh-Reality.ps1.
#
# Exists as a FILE because inlining PowerShell through ssh has failed more times
# in this project than any other single mistake - the quoting is mangled by
# PowerShell -> ssh -> cmd -> powershell and comes back EMPTY, which reads like
# a failing machine instead of a failing command.
#
# 🔴 TWO BAD INSTRUMENTS ALREADY BURNED HERE - do not reintroduce either:
#  1. The O: DRIVE LETTER. net use mappings are PER LOGON SESSION, so O: reads
#     "Unavailable" over SSH while Jeff's console session has it mounted. That
#     nearly got reported as a broken mesh leg.
#  2. COUNTING LIVE SMB SESSIONS. Windows times out IDLE sessions, so a healthy
#     machine that simply has not touched the share in a while reports 0 and
#     fails. Caught 2026-09-19 right after a Lenovo reboot.
# The honest test is to ATTEMPT THE READ and see whether it succeeds.
$ErrorActionPreference = 'SilentlyContinue'

# route 1 - can it READ the Beast's share right now, on demand?
# 🔴 THIRD bad instrument avoided here: a BARE Test-Path on the UNC. Windows
# offers the logged-on user's credentials first and does NOT automatically fall
# back to Guest, so an anonymous attempt fails on a machine that reaches the
# Beast perfectly well. The machine's REAL mechanism is HCC-MapBeastAtLogon,
# which connects with explicit Guest credentials. Test THAT mechanism.
$unc     = '\\192.168.1.194\OneDrive'
$canRead = $false
$count   = 0
$null = net use $unc /user:Guest "" 2>$null
if (Test-Path $unc) {
    $items = @(Get-ChildItem $unc -EA SilentlyContinue)
    $count = $items.Count
    $canRead = ($count -gt 0)
}
$null = net use $unc /delete /y 2>$null
$sessions = @(Get-SmbConnection -ServerName '192.168.1.194' -EA SilentlyContinue).Count
$mapped   = (Get-ItemProperty 'HKCU:\Network\O' -EA SilentlyContinue).RemotePath
$task     = Get-ScheduledTaskInfo -TaskName 'HCC-MapBeastAtLogon' -EA SilentlyContinue

# route 2 - OneDrive syncing locally (Jeff re-enabled it 09-19 07:54)
$odProc  = [bool](Get-Process OneDrive -EA SilentlyContinue)
$odPath  = "$env:USERPROFILE\OneDrive"
$odFiles = 0
if (Test-Path $odPath) { $odFiles = @(Get-ChildItem $odPath -Recurse -File -EA SilentlyContinue).Count }
$odOk = ($odProc -and $odFiles -gt 100)

$route = if ($canRead -and $odOk) { 'SMB+OneDrive' } elseif ($canRead) { 'SMB' } elseif ($odOk) { 'OneDrive' } else { 'NONE' }

# route|canReadNow|uncItems|sessions|onedriveFiles|taskOk|clock|uptimeMin
$boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
"{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}" -f $route, $canRead, $count, $sessions, $odFiles,
    ($task -ne $null -and $task.LastTaskResult -eq 0),
    (Get-Date).ToString('HH:mm:ss'),
    [math]::Floor(((Get-Date) - $boot).TotalMinutes)
