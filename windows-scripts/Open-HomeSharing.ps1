# Open-HomeSharing.ps1 — Jeff's rule, 2026-09-22 6:04 PM CT: "I want to be able to go to Network and pull up
# everything on the Beast and the same for the Acer ... no passwords on the network."
# (First said 2026-08-23 12:20 PM for the Apple TV: "You asked twice for no password. That's your call on
#  your own network, so I'm doing it.")
#
# RUN AS ADMINISTRATOR on each PC (Beast, Acer, Lenovo). One script does both halves on whatever PC it runs on:
#   CLIENT  - this PC may open other PCs' open shares with no password (Windows 11 blocks that by default)
#   SERVER  - this PC's user folders and extra drives are shared to Everyone, Guest on, no password
# Folders that hold credentials (HCC-secrets, .ssh, .claude, AppData) are fenced off first and NEVER shared.
#
# From the Beast the one-liner for another PC (elevated PowerShell) is:
#   irm https://raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/windows-scripts/Open-HomeSharing.ps1 | iex
param([string[]]$ExtraFolders = @())
$ErrorActionPreference = 'Continue'
function Say($m) { Write-Host "  $m" }
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { Write-Host "Run this from an ADMINISTRATOR PowerShell (right-click > Run as administrator)." -ForegroundColor Red; exit 1 }
Write-Host "Opening home sharing on $env:COMPUTERNAME ..." -ForegroundColor Cyan

# 1. the home network counts as Private (discovery and sharing are only allowed on Private)
Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -ne 'Private' } | ForEach-Object {
  Set-NetConnectionProfile -InterfaceIndex $_.InterfaceIndex -NetworkCategory Private; Say "network '$($_.Name)' set to Private" }

# 2. network discovery + file sharing: firewall rules and the services that make PCs show up under Network
Enable-NetFirewallRule -DisplayGroup 'Network Discovery' -ErrorAction SilentlyContinue | Out-Null
Enable-NetFirewallRule -DisplayGroup 'File and Printer Sharing' -ErrorAction SilentlyContinue | Out-Null
foreach ($s in 'fdPHost', 'FDResPub', 'SSDPSRV', 'LanmanServer', 'LanmanWorkstation') {
  Set-Service $s -StartupType Automatic -ErrorAction SilentlyContinue; Start-Service $s -ErrorAction SilentlyContinue }
Say 'discovery + sharing on'

# 3. CLIENT half — let this PC connect to open shares without a password
Set-SmbClientConfiguration -EnableInsecureGuestLogons $true -RequireSecuritySignature $false -Force
New-Item -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters' -Force | Out-Null
Set-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters' -Name AllowInsecureGuestAuth -Value 1 -Type DWord
Say 'this PC can open other PCs without a password'

# 4. SERVER half — Guest on, no password, allowed to log on over the network
Enable-LocalUser -Name Guest -ErrorAction SilentlyContinue
net user Guest "" 2>$null | Out-Null
Set-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa' -Name LimitBlankPasswordUse -Value 0 -Type DWord
Set-SmbServerConfiguration -RequireSecuritySignature $false -EnableSMB2Protocol $true -Force
$cfg = Join-Path $env:TEMP 'sec-export.cfg'
secedit /export /cfg $cfg /quiet | Out-Null
$txt = Get-Content $cfg -Raw
if ($txt -match 'SeDenyNetworkLogonRight\s*=\s*([^\r\n]*)') {
  $keep = ($Matches[1] -split ',' | Where-Object { $_ -and $_ -notmatch 'Guest|S-1-5-32-546|S-1-5-21-\d+-\d+-\d+-501' }) -join ','
  $txt = $txt -replace [regex]::Escape($Matches[0]), "SeDenyNetworkLogonRight = $keep"
  Set-Content $cfg $txt
  secedit /configure /db (Join-Path $env:TEMP 'sec-open.sdb') /cfg $cfg /areas USER_RIGHTS /quiet | Out-Null
  Say 'Guest is allowed on the network'
}

# 5. fence off anything that holds credentials BEFORE opening the profile
$me = [Environment]::GetFolderPath('UserProfile')
foreach ($sens in 'HCC-secrets', '.ssh', '.claude', 'AppData', 'HCC-Secrets-Vault') {
  $p = Join-Path $me $sens
  if (Test-Path $p) { icacls $p /inheritance:d /C /Q | Out-Null; icacls $p /remove:g Everyone /remove:g Guest /T /C /Q | Out-Null; Say "kept private: $sens" }
}

# 6. share this PC's folders to Everyone, read + change
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Name -ne 'C' -and $_.Used -gt 0 } | ForEach-Object { $_.Root }
foreach ($f in @($me) + $ExtraFolders + $drives) {
  if (-not (Test-Path $f)) { continue }
  $name = if ($f -match '^[A-Za-z]:\\$') { $f.Substring(0, 1) } else { Split-Path $f -Leaf }
  $share = Get-SmbShare -Name $name -ErrorAction SilentlyContinue
  if (-not $share) { New-SmbShare -Name $name -Path $f -FullAccess Everyone | Out-Null; Say "shared \\$env:COMPUTERNAME\$name  ($f)" }
  else {
    Get-SmbShareAccess -Name $name | Where-Object { $_.AccessControlType -eq 'Deny' } | ForEach-Object { Unblock-SmbShareAccess -Name $name -AccountName $_.AccountName -Force | Out-Null }
    Grant-SmbShareAccess -Name $name -AccountName Everyone -AccessRight Full -Force | Out-Null; Say "opened \\$env:COMPUTERNAME\$name  ($f)" }
  if ($f -eq $me) {
    icacls $f /grant "Everyone:(OI)(CI)M" /C /Q | Out-Null
    foreach ($sub in 'Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos', 'Music', 'OneDrive', 'iCloudDrive') {
      $p = Join-Path $me $sub; if (Test-Path $p) { icacls $p /grant "Everyone:(OI)(CI)M" /T /C /Q | Out-Null; Say "  $sub open to everyone" } }
  } else { icacls $f /grant "Everyone:(OI)(CI)M" /T /C /Q | Out-Null }
}
# the whole Users tree (other accounts' folders stay as they are; only this profile was opened above)
if (Get-SmbShare -Name Users -ErrorAction SilentlyContinue) {
  Get-SmbShareAccess -Name Users | Where-Object { $_.AccessControlType -eq 'Deny' } | ForEach-Object { Unblock-SmbShareAccess -Name Users -AccountName $_.AccountName -Force | Out-Null }
  Grant-SmbShareAccess -Name Users -AccountName Everyone -AccessRight Full -Force | Out-Null; Say "opened \\$env:COMPUTERNAME\Users" }

Write-Host "Done. Under Network, other PCs will see \\$env:COMPUTERNAME with no password." -ForegroundColor Green
Write-Host "If a PC still asks for a password: reboot it once (Windows caches the old refusal)." -ForegroundColor Yellow
