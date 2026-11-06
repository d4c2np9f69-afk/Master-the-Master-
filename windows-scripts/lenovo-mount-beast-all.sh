#!/bin/bash
# Runs ON the Lenovo (GarageLaptop, Ubuntu). Jeff 2026-09-22 6:04 PM: "pull up everything on the beast ...
# no passwords on the network." Extends lenovo-mount-beast.sh (OneDrive only) to the Beast's Users and
# ClipArchive shares, guest, and puts a "Beast" folder on the desktop + sidebar bookmarks.
# Same mount options that were PROVEN on 2026-09-18 (username=Guest, empty password, ntlmssp).
set -u
SERVER=192.168.1.194
UIDN=$(id -u); GIDN=$(id -g)
add_mount () {  # share  mountpoint  ro|rw
  local share=$1 mnt=$2 mode=$3
  sudo mkdir -p "$mnt"
  local line="//$SERVER/$share $mnt cifs username=Guest,password=,sec=ntlmssp,$mode,vers=3.0,uid=$UIDN,gid=$GIDN,iocharset=utf8,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600 0 0"
  if grep -qF "//$SERVER/$share " /etc/fstab; then sudo sed -i "\#//$SERVER/$share #d" /etc/fstab; fi
  echo "$line" | sudo tee -a /etc/fstab >/dev/null
  sudo umount "$mnt" 2>/dev/null || true
}
add_mount Users       /mnt/beast/Users       ro
add_mount ClipArchive /mnt/beast/ClipArchive ro
add_mount OneDrive    /mnt/beast/OneDrive    ro
sudo systemctl daemon-reload
for m in /mnt/beast/Users /mnt/beast/ClipArchive /mnt/beast/OneDrive; do
  if sudo mount "$m" 2>/tmp/mount.err; then echo "mounted $m: $(ls -1 "$m" 2>/dev/null | wc -l) entries"; else echo "MOUNT FAILED $m: $(cat /tmp/mount.err)"; fi
done
echo "--- Jeff's folders on the Beast, as seen from here:"
ls -1 /mnt/beast/Users/jeffl 2>/dev/null | head -20 | sed 's/^/    /'
echo "--- desktop folder + sidebar bookmarks"
ln -sfn /mnt/beast/Users/jeffl "$HOME/Desktop/Beast"
ln -sfn /mnt/acer "$HOME/Desktop/Acer"
BM="$HOME/.config/gtk-3.0/bookmarks"; mkdir -p "$(dirname "$BM")"; touch "$BM"
grep -q 'file:///mnt/beast/Users/jeffl ' "$BM" || echo 'file:///mnt/beast/Users/jeffl Beast - everything' >> "$BM"
grep -q 'file:///mnt/beast/ClipArchive ' "$BM" || echo 'file:///mnt/beast/ClipArchive Beast Clip Archive' >> "$BM"
ls -l "$HOME/Desktop" | grep -E 'Beast|Acer' | sed 's/^/    /'
echo "done"
