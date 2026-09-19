# Deployed to the Acer and run by Audit-Mesh-Reality.ps1. Exists as a FILE
# because inlining PowerShell through ssh has now failed more times in this
# project than any other single mistake - the quoting is mangled by
# PowerShell -> ssh -> cmd -> powershell and comes back empty, which reads like
# a failing machine instead of a failing command.
$ErrorActionPreference = 'SilentlyContinue'
$smb   = @(Get-SmbConnection -ServerName '192.168.1.194' -EA SilentlyContinue).Count
$task  = (Get-ScheduledTask -TaskName 'HCC-MapBeastAtLogon' -EA SilentlyContinue).State
$clock = (Get-Date).ToString('HH:mm:ss')
$od    = [bool](Get-Process OneDrive -EA SilentlyContinue)
$boot  = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
$up    = [math]::Floor(((Get-Date) - $boot).TotalMinutes)
# smb|task|clock|onedrive|uptimeMin
"{0}|{1}|{2}|{3}|{4}" -f $smb, $task, $clock, $od, $up
