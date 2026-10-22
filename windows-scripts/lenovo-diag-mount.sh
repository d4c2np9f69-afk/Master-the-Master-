#!/bin/bash
# Diagnose mount error(13) with EVIDENCE: the kernel log carries the NT status
# Windows returned, and each auth form gets a distinct status. Read-only.
S=192.168.1.194; SH=OneDrive; M=/mnt/beast/OneDrive
echo "=== A. what did the kernel log say on the last attempt? ==="
sudo dmesg 2>/dev/null | grep -i -E 'cifs|smb' | tail -8 | sed 's/^/  /'

echo
echo "=== B. smbclient as anonymous (null session) ==="
smbclient "//$S/$SH" -N -c 'ls' 2>&1 | head -3 | sed 's/^/  /'

echo
echo "=== C. smbclient as explicit user Guest with EMPTY password ==="
smbclient "//$S/$SH" -U 'Guest%' -c 'ls' 2>&1 | head -3 | sed 's/^/  /'

echo
echo "=== D. mount.cifs with username=Guest, empty password (not the 'guest' flag) ==="
sudo umount "$M" 2>/dev/null
sudo mount -t cifs "//$S/$SH" "$M" -o 'username=Guest,password=,ro,vers=3.0,uid=1000,gid=1000,sec=ntlmssp' 2>&1 | sed 's/^/  /'
if mountpoint -q "$M"; then echo "  MOUNTED with username=Guest -> $(ls -1 $M | wc -l) entries"; sudo umount "$M"; else echo "  not mounted"; fi
echo "  kernel said:"; sudo dmesg 2>/dev/null | grep -i cifs | tail -2 | sed 's/^/    /'

echo
echo "=== E. sanity: the ClipArchive share, which ALREADY had Everyone=Read before tonight ==="
smbclient "//$S/ClipArchive" -N -c 'ls' 2>&1 | head -2 | sed 's/^/  /'
