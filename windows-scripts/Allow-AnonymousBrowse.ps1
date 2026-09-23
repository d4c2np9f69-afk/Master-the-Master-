# Allow-AnonymousBrowse.ps1 — the ONE setting that makes  Network -> 301SERVER  open with no password box
# from a machine that has no Windows account here (the Lenovo). Jeff, 2026-09-22 6:52 PM: "full access in
# my network to go into any of the computers through Network -> 301SERVER, that is what I said from the
# beginning." Run as Administrator on the Beast (and on the Acer for the same effect there).
#
# What it changes: Windows normally refuses a caller that gives no name at all (anonymous), even on a share
# that says Everyone. These four values tell Windows to treat that caller as Everyone, so the share list and
# the Everyone-shares open. The credential folders were fenced off earlier and stay private regardless.
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "Run this as ADMINISTRATOR (right-click > Run as administrator)." -ForegroundColor Red; exit 1 }
$lsa = 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa'
$srv = 'HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters'
Set-ItemProperty $lsa -Name EveryoneIncludesAnonymous -Value 1 -Type DWord
Set-ItemProperty $lsa -Name RestrictAnonymous -Value 0 -Type DWord
Set-ItemProperty $srv -Name RestrictNullSessAccess -Value 0 -Type DWord
# Guest-only sharing model = Windows' own "password protected sharing OFF". Any name with no password
# (a Linux file manager knocks as its own user) is treated as Guest instead of being refused. Added 19:40.
Set-ItemProperty $lsa -Name ForceGuest -Value 1 -Type DWord
$shares = (Get-SmbShare | Where-Object { $_.Name -notmatch '\$$' -and $_.ShareType -eq 'FileSystemDirectory' }).Name
Set-ItemProperty $srv -Name NullSessionShares -Value $shares -Type MultiString
Restart-Service LanmanServer -Force
Write-Host ("EveryoneIncludesAnonymous=" + (Get-ItemProperty $lsa).EveryoneIncludesAnonymous + "  RestrictAnonymous=" + (Get-ItemProperty $lsa).RestrictAnonymous + "  RestrictNullSessAccess=" + (Get-ItemProperty $srv).RestrictNullSessAccess)
Write-Host ("anonymous may open: " + ($shares -join ', '))
Write-Host "Done - Network -> $env:COMPUTERNAME now opens from any machine on the Wi-Fi with no password." -ForegroundColor Green
