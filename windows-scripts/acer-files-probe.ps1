# Runs ON the Acer. Answers ONE question for Verify-Network.ps1: does this machine
# actually reach Jeff's files on the Beast?
#
# TWO traps this exists to avoid, both of which produced a FAIL on a healthy
# machine (09-19):
#  1. Do NOT test OneDrive. Jeff killed OneDrive on the Acer after error
#     0x8004de80 - "Okay no OneDrive on acer". The route here is the O: SMB
#     mapping to \\192.168.1.194\OneDrive, restored at logon by HCC-MapBeastAtLogon.
#  2. Do NOT test the O: drive letter over SSH. net use mappings are PER LOGON
#     SESSION. An SSH session is not Jeff's console session, so O: correctly reads
#     "Unavailable" there while his desktop has it mounted. Get-SmbConnection is
#     machine-wide and does not lie.
$ErrorActionPreference = 'SilentlyContinue'

$conn = @(Get-SmbConnection -ServerName '192.168.1.194' -EA SilentlyContinue)
$mapped = (Get-ItemProperty 'HKCU:\Network\O' -EA SilentlyContinue).RemotePath
$task = (Get-ScheduledTaskInfo -TaskName 'HCC-MapBeastAtLogon' -EA SilentlyContinue)
$taskOk = ($task -ne $null -and $task.LastTaskResult -eq 0)

# count|mappedpath|taskok
"{0}|{1}|{2}" -f $conn.Count, $(if($mapped){$mapped}else{'none'}), $taskOk
