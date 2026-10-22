# Jeff, 2026-09-19 09:19: "Pull it up and I will make the change on the acer"
#
# A GUI launched over SSH runs in the SSH session, NOT his interactive console
# session, so it never appears on his screen. Putting a shortcut on the desktop
# is the honest way to hand him a one-click action instead of a click-path to
# follow.
#
# What it runs: Open-PrivateLanSharing.ps1, which he approved at 09:15 ("Yes")
# and 09:16 ("Free the network"). On THIS machine only two values are actually
# left - everyoneincludesanonymous 0->1 and LimitBlankPasswordUse 1->0. The
# Beast is already fully open; signing, guest logons and the Guest account are
# already correct here too.
#
# LimitBlankPasswordUse=1 blocks network logon for blank-password accounts,
# which is exactly what Guest is - so it is very likely the real reason the
# Lenovo -> Acer leg has never worked, regardless of share or NTFS settings.
$ErrorActionPreference = 'Stop'
function L($a,$b){ Write-Output ("  {0,-34} {1}" -f $a,$b) }

$script   = 'C:\Users\jeffl\Open-PrivateLanSharing.ps1'
if (-not (Test-Path $script)) { Write-Output "  MISSING: $script"; exit 1 }

$desktop  = [Environment]::GetFolderPath('DesktopDirectory')
$lnkPath  = Join-Path $desktop 'FREE THE NETWORK.lnk'

$sh = New-Object -ComObject WScript.Shell
$lnk = $sh.CreateShortcut($lnkPath)
$lnk.TargetPath       = 'powershell.exe'
$lnk.Arguments        = "-NoProfile -ExecutionPolicy Bypass -NoExit -File `"$script`""
$lnk.WorkingDirectory = 'C:\Users\jeffl'
$lnk.IconLocation     = 'shell32.dll,13'
$lnk.Description      = 'Opens LAN sharing on this machine (Jeff approved 2026-09-19). Run as administrator.'
$lnk.Save()

# force "Run as administrator" - byte 21 of the link header, bit 0x20.
# Without this the registry writes silently fail and it looks like it worked.
$bytes = [IO.File]::ReadAllBytes($lnkPath)
$bytes[0x15] = $bytes[0x15] -bor 0x20
[IO.File]::WriteAllBytes($lnkPath, $bytes)

L 'shortcut created' $lnkPath
L 'runs as admin' 'yes (required, or the writes fail silently)'
L 'keeps window open' 'yes (-NoExit, so Jeff can read the result)'

Write-Output ""
Write-Output "=== what it will change on THIS machine ==="
$lsa = Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Lsa'
L 'everyoneincludesanonymous' "$($lsa.everyoneincludesanonymous)  -> 1"
L 'LimitBlankPasswordUse'     "$($lsa.LimitBlankPasswordUse)  -> 0"
$sc = Get-SmbClientConfiguration
L 'client signing (already ok)'        $sc.RequireSecuritySignature
L 'guest logons (already ok)'          $sc.EnableInsecureGuestLogons
L 'Guest account (already ok)'         (Get-LocalUser -Name Guest).Enabled
