#!/bin/bash
# CLOSES THE LAST MESH LEG: Lenovo -> Acer. Jeff, 2026-09-18: "make sure they
# all connect both ways." Five of six legs worked for two days; this one never
# did, and it was the only SKIP in the reality audit.
#
# The old /etc/fstab line could never work:
#   //192.168.1.176/C/Users/jeffl cifs username=Guest,password=,sec=ntlmssp
# Guest CIFS into a Windows user profile is a dead end - NTFS denies Guest on
# C:\Users\jeffl whatever the share ACL says, and Win11 24H2 refuses to sign a
# guest session. That same wall forced Beast -> Acer onto authenticated SSH,
# which has worked flawlessly since. Use the thing that works.
#
# 🔴 The blocker that hid this for two days: on Windows, sshd IGNORES
# ~/.ssh/authorized_keys for accounts in the Administrators group - it reads
# C:\ProgramData\ssh\administrators_authorized_keys. The key looked correctly
# installed and still gave "Permission denied (publickey)". Fixed by
# acer-trust-lenovo.ps1, which writes both files and sets the strict ACL.
set -u
MNT=/mnt/acer
# 🔴 REMOTE PATH MUST BE EMPTY. Windows OpenSSH's sftp already lands in
# /C:/Users/jeffl, so giving a path makes sshfs resolve it RELATIVE to that -
# /C:/Users/jeffl/C:/Users/jeffl - which does not exist. The mount then SUCCEEDS
# and lists ZERO items, which looks like a permissions problem and is not.
REMOTE='jeffl@192.168.1.176:'

echo "=== 1. prove key auth works before touching fstab ==="
if ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=no jeffl@192.168.1.176 hostname >/dev/null 2>&1; then
    echo "  key auth OK"
else
    echo "  KEY AUTH FAILED - run acer-trust-lenovo.ps1 on the Acer first. Stopping."
    exit 1
fi

echo ""
echo "=== 2. retire the dead CIFS entry ==="
sudo umount -l "$MNT" 2>/dev/null
sudo cp /etc/fstab "/etc/fstab.bak-$(date +%Y%m%d-%H%M%S)"
sudo sed -i '\|/mnt/acer|d' /etc/fstab
echo "  removed any /mnt/acer line (fstab backed up)"

echo ""
echo "=== 2b. allow_other needs user_allow_other in /etc/fuse.conf ==="
# Without this, fusermount3 refuses allow_other - and allow_other is required
# because the boot-time automount runs as ROOT while Jeff's desktop session is
# a different user, so without it he would not see the mount at all.
if grep -qE '^\s*#?\s*user_allow_other' /etc/fuse.conf 2>/dev/null; then
    sudo sed -i 's/^\s*#\s*user_allow_other/user_allow_other/' /etc/fuse.conf
else
    echo 'user_allow_other' | sudo tee -a /etc/fuse.conf >/dev/null
fi
echo "  fuse.conf: $(grep -c '^user_allow_other' /etc/fuse.conf) user_allow_other line(s)"

echo ""
echo "=== 3. mount over SSH and PROVE it reads ==="
sudo mkdir -p "$MNT"
sudo chown "$USER:$USER" "$MNT"
# allow_other so the desktop session and root both see it; IdentityFile is
# explicit because this may run from a non-login context.
sshfs -o allow_other,default_permissions,reconnect,ServerAliveInterval=15,ServerAliveCountMax=3,StrictHostKeyChecking=no,IdentityFile=/home/jeffloewen/.ssh/id_ed25519 \
      "$REMOTE" "$MNT" 2>/tmp/sshfs.err
if mountpoint -q "$MNT"; then
    n=$(ls "$MNT" 2>/dev/null | wc -l)
    if [ "$n" -eq 0 ]; then
        echo "  MOUNTED BUT EMPTY - refusing to call this working. Wrong remote path."
        sudo umount -l "$MNT" 2>/dev/null
        exit 1
    fi
    echo "  MOUNTED - $n items readable:"
    ls "$MNT" 2>/dev/null | head -6 | sed 's/^/      /'
else
    echo "  MOUNT FAILED:"; sed 's/^/      /' /tmp/sshfs.err
    exit 1
fi

echo ""
echo "=== 4. make it survive a reboot ==="
echo "jeffl@192.168.1.176: $MNT fuse.sshfs _netdev,nofail,allow_other,default_permissions,reconnect,ServerAliveInterval=15,ServerAliveCountMax=3,StrictHostKeyChecking=no,IdentityFile=/home/jeffloewen/.ssh/id_ed25519,x-systemd.automount,x-systemd.idle-timeout=600 0 0" | sudo tee -a /etc/fstab >/dev/null
sudo systemctl daemon-reload
echo "  fstab entry written (nofail, so a sleeping Acer never blocks boot)"
grep -n 'acer' /etc/fstab | sed 's/^/      /'

echo ""
echo "=== 5. a desktop bookmark so Jeff can just click it ==="
BM="$HOME/.config/gtk-3.0/bookmarks"
mkdir -p "$(dirname "$BM")"
grep -qF "file://$MNT" "$BM" 2>/dev/null || echo "file://$MNT Acer Files" >> "$BM"
echo "  bookmark: Acer Files"

echo ""
echo "DONE - the mesh is now 6 of 6 legs, both directions."
