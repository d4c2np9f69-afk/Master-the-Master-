# THE LAST MESH GAP. Jeff, 2026-09-18: "make sure they all connect both ways."
# Five of six legs have worked for two days; Lenovo -> Acer never has.
#
# Why the old approach cannot work: /etc/fstab on the Lenovo tries
#   //192.168.1.176/C/Users/jeffl  cifs  username=Guest,password=,sec=ntlmssp
# Guest CIFS into a Windows user profile is a dead end - NTFS denies Guest on
# C:\Users\jeffl whatever the share ACL says, and Win11 24H2 will not sign a
# guest session anyway. That same wall forced Beast -> Acer onto authenticated
# SSH, which has worked flawlessly since. So do what already works.
#
# 🔴 THE GOTCHA THAT COST A ROUND TRIP, 2026-09-19: on Windows, OpenSSH IGNORES
# ~/.ssh/authorized_keys for any account in the Administrators group. It reads
#   C:\ProgramData\ssh\administrators_authorized_keys
# instead. Adding the key to the user file looked completely correct and still
# gave "Permission denied (publickey)". jeffl IS an admin, which is why the
# Beast's key lives in the admin file. Write BOTH, and set the strict ACL the
# admin file requires (Administrators + SYSTEM only) or sshd silently skips it.
$ErrorActionPreference = 'Stop'
function L($a,$b){ Write-Output ("  {0,-42} {1}" -f $a,$b) }

$key = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBcxyQp5omV5weQEsdqMDslrxS5JPFWUILZrSBY6bDOU lenovo-to-acer'

$isAdmin = (Get-LocalGroupMember -Group 'Administrators' -EA SilentlyContinue | Where-Object { $_.Name -match [regex]::Escape($env:USERNAME) }) -ne $null
L 'this account is an Administrator' $isAdmin
L '  => sshd reads' $(if($isAdmin){'administrators_authorized_keys'}else{'~/.ssh/authorized_keys'})

foreach ($target in @("$env:USERPROFILE\.ssh\authorized_keys", "$env:ProgramData\ssh\administrators_authorized_keys")) {
    Write-Output ""
    L 'file' $target
    if (-not (Test-Path $target)) { New-Item -ItemType File -Path $target -Force | Out-Null; L '  created' 'yes' }
    $existing = @(Get-Content $target -EA SilentlyContinue)
    if ($existing -contains $key) { L '  lenovo key' 'already present' }
    else { Add-Content -Path $target -Value $key -Encoding ASCII; L '  lenovo key' 'ADDED' }
    Get-Content $target | Where-Object { $_.Trim() } | ForEach-Object { L '  trusted' (($_ -split ' ')[-1]) }
}

Write-Output ""
Write-Output "=== ACLs - sshd SILENTLY ignores a key file with loose permissions ==="
$admKeys = "$env:ProgramData\ssh\administrators_authorized_keys"
icacls $admKeys /inheritance:r /grant 'Administrators:F' /grant 'SYSTEM:F' | Out-Null
L 'administrators_authorized_keys' 'Administrators + SYSTEM only'
icacls "$env:USERPROFILE\.ssh\authorized_keys" /inheritance:r /grant "$($env:USERNAME):F" /grant 'SYSTEM:F' | Out-Null
L 'user authorized_keys' 'owner + SYSTEM only'

Write-Output ""
$s = Get-Service sshd -EA SilentlyContinue
L 'sshd' "$($s.Status) / $((Get-CimInstance Win32_Service -Filter "Name='sshd'").StartMode)"
Restart-Service sshd -Force -EA SilentlyContinue
Start-Sleep -Seconds 2
L 'sshd after restart' (Get-Service sshd).Status
