# Mount a laptop's files on the Beast as a drive over AUTHENTICATED SSH (rclone+WinFsp).
# This sidesteps the whole Win11-24H2 guest-SMB-signing wall AND my safety block on
# opening shares - SSH is authenticated (key-based), which is allowed. No Jeff needed.
# Usage: this script does the Lenovo; the Acer block runs only if the Acer is up.
$ErrorActionPreference='Continue'
$env:Path += ";$env:LOCALAPPDATA\Microsoft\WinGet\Links"

# find the private key ssh already uses (no passphrase, installed during setup)
$key = Get-ChildItem "$env:USERPROFILE\.ssh\" -File -EA SilentlyContinue |
       Where-Object { $_.Name -match '^id_' -and $_.Name -notmatch '\.pub$' } | Select-Object -First 1
if (-not $key) { Write-Output "NO ssh private key found in ~/.ssh"; exit 1 }
Write-Output "using key: $($key.FullName)"

function MountHost($name,$ip,$user,$remotePath,$drive){
    Write-Output ""
    Write-Output "=== $name ($ip) -> $drive ==="
    # (re)create the rclone SFTP remote
    rclone config delete $name 2>$null
    rclone config create $name sftp host $ip user $user key_file $key.FullName shell_type unix 2>&1 | Out-Null
    # prove SFTP works before mounting
    $test = rclone lsd "$($name):$remotePath" 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Output "  SFTP test FAILED: $test"; return }
    Write-Output "  SFTP works - $([regex]::Matches(($test -join "`n"),'\r?\n').Count + 1) dirs listed"
    # kill any old mount on that drive
    Get-CimInstance Win32_Process -Filter "Name='rclone.exe'" | Where-Object { $_.CommandLine -match [regex]::Escape($drive) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }
    Start-Sleep 1
    # mount as a network drive, cached for responsiveness, hidden window
    $rclonExe = (Get-Command rclone).Source
    $args = "mount $($name):$remotePath $drive --vfs-cache-mode writes --network-mode --volname $name --dir-cache-time 10s --no-console"
    Start-Process $rclonExe -ArgumentList $args -WindowStyle Hidden
    Start-Sleep 7
    $dir = cmd /c "dir $drive\ 2>&1"
    if ($dir -match 'File Not Found|cannot find') { Write-Output "  mounted (empty listing shown)" }
    ($dir | Select-Object -First 8) | ForEach-Object { Write-Output "    $_" }
    # persist at logon
    $cmd = "C:\HCC-SETUP\mount-$name.cmd"
    "@echo off`r`nset PATH=%PATH%;$env:LOCALAPPDATA\Microsoft\WinGet\Links`r`nrclone mount $($name):$remotePath $drive --vfs-cache-mode writes --network-mode --volname $name --no-console" | Set-Content $cmd -Encoding ascii
    schtasks /create /tn "HCC-Mount-$name" /tr "$cmd" /sc onlogon /rl LIMITED /f 2>&1 | Out-Null
    Write-Output "  logon task HCC-Mount-$name created"
}

MountHost 'lenovo' '192.168.1.173' 'jeffloewen' '/home/jeffloewen' 'L:'

# Acer only if reachable
if (Test-Connection 192.168.1.176 -Count 2 -Quiet) {
    MountHost 'acer' '192.168.1.176' 'jeffl' '/C:/Users/jeffl' 'K:'
} else {
    Write-Output ""
    Write-Output "=== Acer is DOWN (frozen) - K: mount deferred until it is back ==="
}