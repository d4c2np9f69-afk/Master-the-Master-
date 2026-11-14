# On a Windows machine: (1) start the DLNA media-streaming service, (2) drop an
# "Email" shortcut that opens Jeff's Comcast webmail in Chrome. Webmail is the
# zero-setup, no-password way to have his email on every machine - and it is the
# SAME mail proven working today, so nothing here can "break" his email.
$ErrorActionPreference = 'SilentlyContinue'
Write-Output "host: $env:COMPUTERNAME"

Write-Output "=== DLNA media streaming service ==="
$svc = Get-Service WMPNetworkSvc -EA SilentlyContinue
if ($svc) {
    Set-Service WMPNetworkSvc -StartupType Automatic
    Start-Service WMPNetworkSvc
    Write-Output "  WMPNetworkSvc: $((Get-Service WMPNetworkSvc).Status)"
} else {
    Write-Output "  WMPNetworkSvc not present (needs WMP Legacy / Media Feature Pack) - noted, not installed"
}

Write-Output "=== Email shortcut ==="
$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe" }
$desk = [Environment]::GetFolderPath('Desktop')   # respects the OneDrive redirect
$sh = New-Object -ComObject WScript.Shell
$lnk = $sh.CreateShortcut((Join-Path $desk 'Email.lnk'))
$lnk.TargetPath = $chrome
$lnk.Arguments  = '--app=https://www.xfinity.com/email'
$lnk.IconLocation = $chrome
$lnk.Description = 'Comcast / Xfinity webmail'
$lnk.Save()
Write-Output "  Email shortcut on desktop: $(Test-Path (Join-Path $desk 'Email.lnk'))  (in $desk)"