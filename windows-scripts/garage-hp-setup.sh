#!/bin/bash
# ============================================================================
# HP TouchSmart 520 -> KITCHEN WALL (KitchenPC) - ONE-SHOT UBUNTU SETUP
# Renamed 2026-09-20: the LENOVO is the garage machine (GarageLaptop);
# this HP comes inside to the kitchen wall. Two machines must not both
# claim the garage identity. Filename kept so the README stays valid.
# Run once on the freshly-installed Ubuntu. It makes the machine match the rest
# of the house AND - critically - gets SSH + the Beast's key up FIRST, so the
# moment this box is on WiFi, Claude finishes everything else remotely from the
# Beast. Jeff plugs in, walks out of the 100-degree garage, done.
#
# Copy this to the USB stick's GARAGE-SETUP folder, then on the HP:
#   bash ~/garage-hp-setup.sh
# ============================================================================
set -u
BEAST_KEY='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILEXp6Xou70dPMujXg17J1akgvq9o8/vJX1VhXzAzFc4 claude-on-301server'
ME="$USER"
log(){ echo "  >> $*"; }

echo "==== 1. SSH + BEAST KEY FIRST (so Claude can finish this remotely) ===="
sudo DEBIAN_FRONTEND=noninteractive apt-get update -q >/dev/null 2>&1
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q openssh-server >/dev/null 2>&1
mkdir -p ~/.ssh && chmod 700 ~/.ssh
grep -qF "$BEAST_KEY" ~/.ssh/authorized_keys 2>/dev/null || echo "$BEAST_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
sudo systemctl enable --now ssh >/dev/null 2>&1
log "ssh: $(systemctl is-active ssh); the Beast can now reach this box"
# passwordless sudo so remote setup needs no typing
echo "$ME ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/90-$ME-nopasswd >/dev/null
log "passwordless sudo set"

echo "==== 2. IDENTITY ===="
sudo hostnamectl set-hostname KitchenPC 2>/dev/null
log "hostname: KitchenPC"

echo "==== 3. NEVER SLEEP / STAY REACHABLE ===="
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target >/dev/null 2>&1
sudo mkdir -p /etc/systemd/logind.conf.d
printf '[Login]\nHandleLidSwitch=ignore\nHandleLidSwitchExternalPower=ignore\nHandleLidSwitchDocked=ignore\n' | sudo tee /etc/systemd/logind.conf.d/99-hcc-nosleep.conf >/dev/null
# GNOME power (best effort; ignore if not present)
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing' 2>/dev/null || true
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-type 'nothing' 2>/dev/null || true
log "sleep disabled, lid ignored"

echo "==== 4. SSH WATCHDOG (re-arms ssh if it ever dies) ===="
sudo tee /usr/local/bin/hcc-ssh-watchdog.sh >/dev/null <<'WD'
#!/bin/bash
systemctl is-active --quiet ssh || systemctl restart ssh
WD
sudo chmod +x /usr/local/bin/hcc-ssh-watchdog.sh
sudo tee /etc/systemd/system/hcc-ssh-watchdog.service >/dev/null <<'SV'
[Unit]
Description=HCC ssh watchdog
[Service]
Type=oneshot
ExecStart=/usr/local/bin/hcc-ssh-watchdog.sh
SV
sudo tee /etc/systemd/system/hcc-ssh-watchdog.timer >/dev/null <<'TM'
[Unit]
Description=HCC ssh watchdog every 5 min
[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
TM
sudo systemctl daemon-reload
sudo systemctl enable --now hcc-ssh-watchdog.timer >/dev/null 2>&1
log "watchdog armed"

echo "==== 5. NETWORK IDENTITY: workgroup + shows up in Windows Network ===="
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q samba wsdd cifs-utils >/dev/null 2>&1
sudo sed -i 's/^\(\s*\)workgroup\s*=.*/\1workgroup = LOEWEN301/I' /etc/samba/smb.conf 2>/dev/null

# 🔴🔴 TWO BUGS COST JEFF TWO DAYS ON THE LENOVO. BOTH WERE IN THIS SCRIPT.
# Fixed 2026-09-19 so the HP never repeats them.
#
# BUG 1 - wsdd CRASH-LOOPS. GVFS spawns its own "wsdd --no-host" for browsing,
# and that instance squats TCP 5357. The host advertiser then dies with
#     OSError: [Errno 98] Address already in use
# forever, while Restart=always makes systemd report it "active". The machine
# is simply never advertised and nothing ever flags it. Pin the interface (it
# warns "no interface given, using all interfaces") and force IPv4 so the v6
# link-local sockets do not fight for the same port.
IFACE=$(ip route show default 2>/dev/null | awk '{print $5; exit}')
[ -z "$IFACE" ] && IFACE=$(ip -o -4 addr show scope global | awk '{print $2; exit}')
log "advertising on interface: $IFACE"
sudo tee /etc/systemd/system/wsdd-host.service >/dev/null <<WS
[Unit]
Description=wsdd host advertiser (makes this box appear in Windows Network)
After=network-online.target smbd.service
Wants=network-online.target
[Service]
ExecStart=/usr/bin/wsdd -i ${IFACE} -4 -w LOEWEN301 -n KitchenPC
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
WS
sudo systemctl daemon-reload
sudo systemctl enable --now wsdd-host.service >/dev/null 2>&1
sleep 3
if [ "$(systemctl show wsdd-host -p NRestarts --value)" -gt 2 ]; then
    log "WARNING: wsdd-host is restarting repeatedly - check: journalctl -u wsdd-host"
else
    log "wsdd-host advertising, NRestarts=$(systemctl show wsdd-host -p NRestarts --value)"
fi

# BUG 2 - NAME RESOLUTION. Ubuntu ships smb.conf with "disable netbios = Yes",
# which makes nmbd refuse to start ("Skipped due to exec-condition") and reports
# itself as inactive/enabled - looking like a service that merely is not
# running. With nothing answering name lookups, Windows LISTS the machine in
# Network but cannot turn KITCHENPC into an address, so clicking it fails while
# \\<ip>\share opens instantly. That was the entire two-day Lenovo symptom.
if grep -qiE '^\s*disable netbios' /etc/samba/smb.conf; then
    sudo sed -i -E 's/^\s*disable netbios\s*=.*/   disable netbios = no/I' /etc/samba/smb.conf
else
    sudo sed -i '/^\[global\]/a\   disable netbios = no' /etc/samba/smb.conf
fi
grep -qiE '^\s*netbios name' /etc/samba/smb.conf || sudo sed -i '/^\[global\]/a\   netbios name = KitchenPC' /etc/samba/smb.conf
sudo systemctl enable --now nmbd >/dev/null 2>&1
sleep 2
log "netbios ON, nmbd=$(systemctl is-active nmbd) (this is what makes \\\\KitchenPC resolve)"

echo "==== 6. SHARE ITS OWN FILES (guest, so the house can reach it) ===="
grep -q '^\[KitchenPCFiles\]' /etc/samba/smb.conf || sudo tee -a /etc/samba/smb.conf >/dev/null <<SHARE

[KitchenPCFiles]
   comment = Kitchen PC files
   path = /home/$ME
   browseable = yes
   read only = no
   guest ok = yes
   force user = $ME
   create mask = 0644
   directory mask = 0755
SHARE
sudo sed -i '/^\[global\]/a \   map to guest = Bad User' /etc/samba/smb.conf 2>/dev/null
# 2026-09-22: Windows 11 24H2 (the Beast, the Acer) refuses a GUEST session to a server that does not
# sign - proven on the Lenovo 09-18, fixed there by lenovo-samba-signing.sh, and it is what lets the
# Beast open \\GarageLaptop\GarageFiles today (26 entries, no password). SERVER side only: the
# CLIENT side must stay default, because an anonymous session cannot sign (that broke Network ->
# 301SERVER on the Lenovo for an evening).
sudo sed -i '/^\s*server signing/d;/^\s*client signing/d' /etc/samba/smb.conf
sudo sed -i '/^\[global\]/a \   server signing = required' /etc/samba/smb.conf
# validate BEFORE restarting - a bad smb.conf takes smbd AND nmbd down together
if sudo testparm -s >/dev/null 2>&1; then
    sudo systemctl enable --now smbd >/dev/null 2>&1
    sudo systemctl restart nmbd >/dev/null 2>&1
    log "sharing /home/$ME as KitchenPCFiles (smbd=$(systemctl is-active smbd) nmbd=$(systemctl is-active nmbd))"
else
    log "ERROR: smb.conf failed testparm - NOT restarting samba. Fix before rebooting."
fi

echo "==== 6b. CLOCK - every fault call in this project rests on timestamps ===="
# Found 2026-09-19: the Acer was on a free-running CMOS clock and the Beast's
# w32time was stopped. Both were accurate by luck that minute. A drifting clock
# silently corrupts event-log evidence, and there is no symptom until a
# conclusion is already wrong.
sudo timedatectl set-ntp true 2>/dev/null
sleep 2
log "clock synced=$(timedatectl show -p NTPSynchronized --value 2>/dev/null) tz=$(timedatectl show -p Timezone --value 2>/dev/null) now=$(date '+%H:%M:%S')"

echo "==== 7. MOUNT THE WHOLE HOUSE - Beast + Acer, guest, no password ===="
# Jeff 2026-09-22 6:04 PM: "pull up everything on the beast and the same for the acer ... no passwords
# on the network." Same mount line that was PROVEN on the Lenovo (username=Guest, empty password,
# ntlmssp). The Beast's Users, OneDrive and ClipArchive shares are Everyone; the Acer's Users share
# is Everyone since 09-22 too. nofail + automount: a machine that is off never hangs this boot.
UIDN=$(id -u); GIDN=$(id -g)
add_mount(){ # server share mountpoint ro|rw
  local srv=$1 share=$2 mnt=$3 mode=$4
  sudo mkdir -p "$mnt"
  local line="//$srv/$share $mnt cifs username=Guest,password=,sec=ntlmssp,$mode,vers=3.0,uid=$UIDN,gid=$GIDN,iocharset=utf8,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600 0 0"
  grep -qF "//$srv/$share " /etc/fstab && sudo sed -i "\#//$srv/$share #d" /etc/fstab
  echo "$line" | sudo tee -a /etc/fstab >/dev/null
}
add_mount 192.168.1.194 Users       /mnt/beast/Users       rw
add_mount 192.168.1.194 OneDrive    /mnt/beast/OneDrive    rw
add_mount 192.168.1.194 ClipArchive /mnt/beast/ClipArchive ro
add_mount 192.168.1.176 Users       /mnt/acer/Users        rw
sudo systemctl daemon-reload
for m in /mnt/beast/Users /mnt/beast/OneDrive /mnt/beast/ClipArchive /mnt/acer/Users; do
  sudo mount "$m" 2>/dev/null && log "mounted $m ($(ls -1 "$m" 2>/dev/null | wc -l) entries)" || log "$m will auto-mount on first use (that machine may be off)"
done
mkdir -p ~/Desktop
ln -sfn /mnt/beast/Users/jeffl "$HOME/Desktop/Beast" 2>/dev/null
ln -sfn /mnt/acer/Users/jeffl  "$HOME/Desktop/Acer"  2>/dev/null
ln -sfn /mnt/beast/OneDrive    "$HOME/Beast-OneDrive" 2>/dev/null
BM="$HOME/.config/gtk-3.0/bookmarks"; mkdir -p "$(dirname "$BM")"; touch "$BM"
grep -q 'file:///mnt/beast/Users/jeffl ' "$BM" || echo 'file:///mnt/beast/Users/jeffl Beast - everything' >> "$BM"
grep -q 'file:///mnt/acer/Users/jeffl ' "$BM"  || echo 'file:///mnt/acer/Users/jeffl Acer - everything'   >> "$BM"
grep -q 'file:///mnt/beast/ClipArchive ' "$BM" || echo 'file:///mnt/beast/ClipArchive Beast Clip Archive' >> "$BM"
log "desktop folders Beast + Acer, sidebar bookmarks added"

echo "==== 8. PRINTER (HP OfficeJet 4650, driverless IPP) ===="
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q cups printer-driver-all >/dev/null 2>&1
sudo systemctl enable --now cups >/dev/null 2>&1
sudo lpadmin -p HP_OfficeJet_4650 -E -v "ipp://192.168.1.208/ipp/print" -m everywhere 2>/dev/null && log "printer added" || log "printer add best-effort"

echo "==== 9. BROWSERS + BITWARDEN + APP SHORTCUTS ===="
snap install chromium >/dev/null 2>&1 || sudo snap install chromium >/dev/null 2>&1
sudo snap install bitwarden >/dev/null 2>&1
mkdir -p ~/Desktop ~/.local/share/applications
mkshort(){ # name, url
  local f=~/Desktop/"$1".desktop
  printf '[Desktop Entry]\nVersion=1.0\nType=Application\nName=%s\nExec=chromium --app=%s\nIcon=chromium\nTerminal=false\n' "$1" "$2" > "$f"
  cp "$f" ~/.local/share/applications/ 2>/dev/null
  chmod +x "$f"; gio set "$f" metadata::trusted true 2>/dev/null || true
}
mkshort 'Home Command Center' 'https://loewenhome.com'
mkshort 'Home Assistant' 'http://192.168.1.66:8123'
mkshort 'Email' 'https://www.xfinity.com/email'
log "Chromium + Bitwarden + desktop shortcuts"

echo "==== 10. AUTO-UPDATES ===="
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q unattended-upgrades >/dev/null 2>&1
sudo dpkg-reconfigure -f noninteractive unattended-upgrades >/dev/null 2>&1
log "unattended-upgrades on"

echo ""
echo "==== 11. SELF-VERIFY - PROVE it before Jeff walks out of the garage ===="
# Jeff, 2026-09-19: "I definitely don't want to go through this with the HP in
# the garage at 100 degrees." Every check below FAILED on a real machine during
# the 09-18/19 build, so each one is earned. A script that says DONE without
# proving it is exactly what cost those two days.
FAILED=0
chk(){ if [ "$2" = "ok" ]; then printf '  PASS  %-42s %s\n' "$1" "$3"; else printf '  FAIL  %-42s %s\n' "$1" "$3"; FAILED=$((FAILED+1)); fi; }

IP=$(hostname -I | awk '{print $1}')
[ -n "$IP" ] && chk "has an IP address" ok "$IP" || chk "has an IP address" no "NONE - check wifi"

ping -c1 -W3 192.168.1.194 >/dev/null 2>&1 && chk "can reach the Beast" ok "192.168.1.194" || chk "can reach the Beast" no "unreachable"

[ "$(systemctl is-active ssh)" = "active" ] && chk "sshd running (Claude finishes remotely)" ok "$(systemctl is-enabled ssh)" || chk "sshd running" no "DOWN - Claude cannot take over"
grep -q 'claude-on-301server' ~/.ssh/authorized_keys 2>/dev/null && chk "Beast key installed" ok "trusted" || chk "Beast key installed" no "MISSING"

[ "$(systemctl is-active smbd)" = "active" ] && chk "smbd (serves its files)" ok active || chk "smbd" no "$(systemctl is-active smbd)"
[ "$(systemctl is-active nmbd)" = "active" ] && chk "nmbd (name resolution - the 2-day bug)" ok active || chk "nmbd (name resolution)" no "INACTIVE - \\\\KitchenPC will NOT resolve"
[ "$(systemctl is-active wsdd-host)" = "active" ] && [ "$(systemctl show wsdd-host -p NRestarts --value)" -le 2 ] \
    && chk "wsdd-host (appears in Network)" ok "NRestarts=$(systemctl show wsdd-host -p NRestarts --value)" \
    || chk "wsdd-host" no "crash-looping - Errno 98, see journalctl -u wsdd-host"

# it must answer its OWN name, which is what Windows actually does when clicked
nmblookup -A 127.0.0.1 2>/dev/null | grep -qi 'KITCHENPC.*<20>' && chk "answers to the name KITCHENPC" ok "<20> file server registered" || chk "answers to the name KITCHENPC" no "NOT registered"

N=$(ls -1 /mnt/beast/Users/jeffl 2>/dev/null | wc -l); [ "$N" -gt 0 ] && chk "Beast - everything (Users/jeffl)" ok "$N items, no password" || chk "Beast - everything (Users/jeffl)" no "EMPTY - Beast off, or its share/NTFS not open"
N=$(ls -1 /mnt/beast/OneDrive 2>/dev/null | wc -l); [ "$N" -gt 0 ] && chk "Beast OneDrive" ok "$N items" || chk "Beast OneDrive" no "empty"
N=$(ls -1 /mnt/acer/Users 2>/dev/null | wc -l); [ "$N" -gt 0 ] && chk "Acer Users" ok "$N items" || chk "Acer Users" no "empty (Acer off or asleep is normal)"
testparm -s 2>/dev/null | grep -qi 'server signing = required' && chk "samba signs (Win11 guest can connect)" ok required || chk "samba signs" no "NOT set - the Beast/Acer will refuse guest"
lpstat -p 2>/dev/null | grep -qi 'officejet\|HP' && chk "printer installed" ok "$(lpstat -p 2>/dev/null | head -1)" || chk "printer installed" no "no HP queue"
[ "$(timedatectl show -p NTPSynchronized --value 2>/dev/null)" = "yes" ] && chk "clock synced" ok "$(date '+%H:%M:%S')" || chk "clock synced" no "NOT syncing - timestamps unreliable"

echo ""
echo "============================================================"
if [ "$FAILED" -eq 0 ]; then
  echo " ALL CHECKS PASSED - KitchenPC is genuinely set up."
else
  echo " $FAILED CHECK(S) FAILED - do NOT walk away yet, read the FAIL lines."
fi
echo " On the network as KitchenPC / LOEWEN301, reachable over SSH."
echo " IP: $IP"
echo " >> Tell Claude that IP. Everything else finishes from the Beast -"
echo "    no more garage time needed."
echo "============================================================"
