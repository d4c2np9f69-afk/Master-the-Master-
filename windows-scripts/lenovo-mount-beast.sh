#!/bin/bash
# Runs ON the Lenovo (GarageLaptop). Mounts the Beast's OneDrive share, no password.
# Jeff's decision 2026-09-18: the LAN is private, the router is the wall, no logins
# between his own machines. The share on the Beast is opened read-only to the LAN
# (open-onedrive-share.ps1); this is the client side.
set -u
SERVER=192.168.1.194
SHARE=OneDrive
MNT=/mnt/beast/OneDrive
LINK="$HOME/Beast-OneDrive"
UIDN=$(id -u); GIDN=$(id -g)

echo "=== 1. cifs client present? ==="
if ! command -v mount.cifs >/dev/null 2>&1; then
  echo "  installing cifs-utils..."
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q cifs-utils >/dev/null 2>&1
fi
command -v mount.cifs >/dev/null 2>&1 && echo "  mount.cifs: $(command -v mount.cifs)" || { echo "  FAILED to get cifs-utils"; exit 1; }

echo
echo "=== 2. can the Beast be seen at all? ==="
if smbclient -L "//$SERVER" -N 2>/dev/null | grep -q "$SHARE"; then
  echo "  share '$SHARE' is advertised by $SERVER"
else
  echo "  WARN: could not list shares anonymously (may still mount)"
fi

echo
echo "=== 3. mount point + fstab (survives reboot, does not hang boot if the Beast is off) ==="
sudo mkdir -p "$MNT"
# NOT the bare 'guest' flag: on this Beast that sends a NULL session and Windows
# returns 0xc0000022 STATUS_ACCESS_DENIED (proven 2026-09-18). An explicit
# username=Guest with an empty password over ntlmssp is accepted - that is what
# actually mounted 115 entries in the diagnosis. No password is stored; Guest's
# password is empty by design.
FSTAB_LINE="//$SERVER/$SHARE $MNT cifs username=Guest,password=,sec=ntlmssp,ro,vers=3.0,uid=$UIDN,gid=$GIDN,iocharset=utf8,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600 0 0"
if grep -qF "//$SERVER/$SHARE " /etc/fstab; then
  sudo sed -i "\#//$SERVER/$SHARE #d" /etc/fstab
fi
echo "$FSTAB_LINE" | sudo tee -a /etc/fstab >/dev/null
echo "  fstab: $(grep -F "//$SERVER/$SHARE " /etc/fstab)"
sudo systemctl daemon-reload

echo
echo "=== 4. mount it now ==="
sudo umount "$MNT" 2>/dev/null || true
if sudo mount "$MNT" 2>/tmp/mount.err; then
  echo "  mounted"
else
  echo "  MOUNT FAILED:"; sed 's/^/    /' /tmp/mount.err
  echo "  (if it says permission denied, the Beast side has not been opened yet)"
  exit 2
fi

echo
echo "=== 5. THE FEATURE: can I actually list Jeff's files? ==="
N=$(ls -1 "$MNT" 2>/dev/null | wc -l)
echo "  top-level entries visible: $N"
ls -1 "$MNT" 2>/dev/null | head -8 | sed 's/^/    /'
[ "$N" -gt 0 ] || { echo "  mounted but EMPTY - NTFS side not granted"; exit 3; }

echo
echo "=== 6. put it where Jeff will see it ==="
ln -sfn "$MNT" "$LINK"
echo "  $LINK -> $MNT"
# GNOME Files bookmark so it shows in the sidebar like a drive
BM="$HOME/.config/gtk-3.0/bookmarks"; mkdir -p "$(dirname "$BM")"
grep -qF "file://$MNT" "$BM" 2>/dev/null || echo "file://$MNT Beast OneDrive" >> "$BM"
echo "  Files sidebar bookmark added"
echo
echo "DONE - $N entries readable from the Beast, no password, survives reboot."
