#!/bin/bash
# THE LAST LEG: Lenovo -> Acer. No share needed to be created - the Acer already
# has a share named "C" (path C:\) with Everyone=Full and Guest enabled. It was
# there the whole time. Mount it read-write, guest, survives reboot.
set -u
# Mount ONLY Jeff's user folder, not the whole C:\ drive - narrower and safer,
# and it is the only part he actually wants (no Windows system files exposed).
IP=192.168.1.176; SHARE='C/Users/jeffl'; MNT=/mnt/acer; LINK="$HOME/Acer-Files"
UIDN=$(id -u); GIDN=$(id -g)

echo "=== can we see it at all? ==="
smbclient -L "//$IP" -N 2>/dev/null | head -8 | sed 's/^/  /'

echo
echo "=== mount point + fstab (nofail so a frozen Acer never hangs boot) ==="
sudo mkdir -p "$MNT"
LINE="//$IP/$SHARE $MNT cifs username=Guest,password=,sec=ntlmssp,vers=3.0,uid=$UIDN,gid=$GIDN,iocharset=utf8,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600 0 0"
sudo sed -i "\#//$IP/$SHARE #d" /etc/fstab
echo "$LINE" | sudo tee -a /etc/fstab >/dev/null
sudo systemctl daemon-reload
echo "  fstab: $(grep -F "//$IP/$SHARE " /etc/fstab | cut -c1-80)..."

echo
echo "=== mount it ==="
sudo umount "$MNT" 2>/dev/null || true
if sudo mount "$MNT" 2>/tmp/acermount.err; then
  echo "  mounted"
else
  echo "  FAILED:"; sed 's/^/    /' /tmp/acermount.err
  exit 2
fi

echo
echo "=== PROVE it - list the Acer's drive ==="
N=$(ls -1 "$MNT" 2>/dev/null | wc -l)
echo "  entries: $N"
ls -1 "$MNT" 2>/dev/null | head -8 | sed 's/^/    /'
[ "$N" -gt 0 ] || { echo "  mounted but empty"; exit 3; }

ln -sfn "$MNT" "$LINK"
BM="$HOME/.config/gtk-3.0/bookmarks"; mkdir -p "$(dirname "$BM")"
grep -qF "file://$MNT" "$BM" 2>/dev/null || echo "file://$MNT Acer Files" >> "$BM"
echo "  shortcut: $LINK  + Files sidebar bookmark"
echo "DONE - Lenovo can now reach the Acer. Mesh complete."
