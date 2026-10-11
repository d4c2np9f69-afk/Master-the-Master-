# Runs ON the Acer. Answers ONE question for Verify-Network.ps1: does this machine
# actually reach Jeff's files?
#
# It deliberately checks BOTH routes and passes if EITHER works, because which
# one is live has already flipped twice in a single day:
#   09-19 early - OneDrive failed with 0x8004de80, Jeff: "Okay no OneDrive on acer".
#                 Files reached over the O: SMB mapping to the Beast instead.
#   09-19 07:54 - Jeff turned OneDrive back on: "it is now working great".
#                 Verified: 19,962 files / 45.54 GB, signed in, zero sync errors.
# A check hard-wired to one route fails the moment he changes his mind, and that
# is how a gate ends up failing a healthy machine.
#
# THE OTHER TRAP, and it is the reason this file exists: do NOT test the O: drive
# letter over SSH. net use mappings are PER LOGON SESSION, so O: reads
# "Unavailable" in an SSH session while Jeff's console session has it mounted.
# That nearly got reported as a broken mesh leg when HCC-MapBeastAtLogon had in
# fact run at 23:22:03 and returned 0x0. Get-SmbConnection is machine-wide and
# does not lie.
$ErrorActionPreference = 'SilentlyContinue'

# route 1 - SMB to the Beast (machine-wide, session-proof)
$conn   = @(Get-SmbConnection -ServerName '192.168.1.194' -EA SilentlyContinue)
$mapped = (Get-ItemProperty 'HKCU:\Network\O' -EA SilentlyContinue).RemotePath
$task   = Get-ScheduledTaskInfo -TaskName 'HCC-MapBeastAtLogon' -EA SilentlyContinue
$smbOk  = ($conn.Count -gt 0)

# route 2 - OneDrive syncing locally
$odProc = [bool](Get-Process OneDrive -EA SilentlyContinue)
$odPath = "$env:USERPROFILE\OneDrive"
$odFiles = 0
if (Test-Path $odPath) { $odFiles = @(Get-ChildItem $odPath -Recurse -File -EA SilentlyContinue).Count }
$odOk = ($odProc -and $odFiles -gt 100)

$route = if ($smbOk -and $odOk) { 'SMB+OneDrive' } elseif ($smbOk) { 'SMB' } elseif ($odOk) { 'OneDrive' } else { 'NONE' }

# route|smbsessions|mappedpath|onedrivefiles|taskok
"{0}|{1}|{2}|{3}|{4}" -f $route, $conn.Count, $(if($mapped){$mapped}else{'none'}), $odFiles, ($task -ne $null -and $task.LastTaskResult -eq 0)
