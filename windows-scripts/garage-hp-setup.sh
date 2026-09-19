#!/bin/bash
# ============================================================================
# GARAGE HP (GaragePC / HP TouchSmart 520) - ONE-SHOT UBUNTU SETUP
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
sudo hostnamectl set-hostname GaragePC 2>/dev/null
log "hostname: GaragePC"

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
# host-mode wsdd so it appears in the Win11 Network folder
sudo tee /etc/systemd/system/wsdd-host.service >/dev/null <<'WS'
[Unit]
Description=wsdd host advertiser
After=network-online.target
Wants=network-online.target
[Service]
ExecStart=/usr/bin/wsdd -w LOEWEN301 -n GaragePC
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
WS
sudo systemctl daemon-reload
sudo systemctl enable --now wsdd-host.service >/dev/null 2>&1
log "workgroup LOEWEN301 + wsdd host (appears in Network)"

echo "==== 6. SHARE ITS OWN FILES (guest, so the house can reach it) ===="
grep -q '^\[GarageHPFiles\]' /etc/samba/smb.conf || sudo tee -a /etc/samba/smb.conf >/dev/null <<SHARE

[GarageHPFiles]
   comment = Garage HP files
   path = /home/$ME
   browseable = yes
   read only = no
   guest ok = yes
   force user = $ME
   create mask = 0644
   directory mask = 0755
SHARE
sudo sed -i '/^\[global\]/a \   map to guest = Bad User' /etc/samba/smb.conf 2>/dev/null
sudo systemctl enable --now smbd >/dev/null 2>&1
log "sharing /home/$ME as GarageHPFiles"

echo "==== 7. MOUNT THE BEAST'S ONEDRIVE ===="
sudo mkdir -p /mnt/beast/OneDrive
FST='//192.168.1.194/OneDrive /mnt/beast/OneDrive cifs username=Guest,password=,sec=ntlmssp,ro,vers=3.0,uid=1000,gid=1000,iocharset=utf8,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600 0 0'
grep -qF '//192.168.1.194/OneDrive' /etc/fstab || echo "$FST" | sudo tee -a /etc/fstab >/dev/null
sudo systemctl daemon-reload
sudo mount /mnt/beast/OneDrive 2>/dev/null && log "Beast OneDrive mounted" || log "Beast mount will auto-mount on access"
ln -sfn /mnt/beast/OneDrive "$HOME/Beast-OneDrive" 2>/dev/null

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
echo "============================================================"
echo " GaragePC is set up. It is on the network as GaragePC/LOEWEN301,"
echo " reachable by Claude over SSH, and mounted to the Beast."
echo " IP: $(hostname -I | awk '{print $1}')"
echo " >> Tell Claude the IP and it finishes the rest (rclone mount"
echo "    back from the Beast, DHCP reservation) from the Beast - no"
echo "    more garage time needed."
echo "============================================================"
