#!/bin/bash
# ============================================================================
# KitchenPC (HP TouchSmart 520) - FULL RESTORE after a fresh Ubuntu install.
# Written 2026-09-26 when the HDD was replaced by a Patriot P210 SSD and the box was reinstalled
# by PXE autoinstall. Rebuilds everything the 09-23/24 sessions set up by hand, in its FINAL
# state (docs/computers/kitchenpc_change_log_2026-09-23.md sec.4 + OPEN_ITEMS #202-#205):
#   touchscreen (nwfermi DKMS + daemon + xf86-input-nextwindow), audio + EasyEffects preset,
#   Bluetooth loudspeaker mode, kiosk + app screensaver, launchers (Firefox - NEVER Chrome, #205).
# The house-network half (ssh, samba, mounts, printer, handoff) is garage-hp-setup.sh; the look
# (panel, theme, no-lock, autologin, Firefox policy) is hcc-desktop-standard.sh.
#
# Run as the desktop user with passwordless sudo, AFTER the package list below is installed:
#   bash kitchenpc-restore.sh           (from a copy of windows-scripts/kitchenpc/ on the HP)
# Idempotent: safe to re-run.
#
# PACKAGES (installed first, 09-26):
#   xubuntu-desktop-minimal lightdm xinput onboard blueman pipewire-audio libspa-0.2-bluetooth
#   pulseaudio-utils pipewire-audio-client-libraries easyeffects calf-plugins lsp-plugins-lv2 firefox
#   vlc libreoffice-{writer,calc,impress,draw,gtk3} xfce4-{whiskermenu,clipman}-plugin
#   xfce4-taskmanager mousepad ristretto file-roller gvfs-backends xautolock unclutter
#   fonts-liberation fonts-liberation2 fonts-crosextra-{carlito,caladea} papirus-icon-theme
#   greybird-gtk-theme xprintidle wmctrl xdotool smartmontools alsa-utils lm-sensors
#   build-essential linux-headers-$(uname -r) dkms git autoconf xutils-dev libtool xserver-xorg-dev
#   libc6-i386 pkg-config evtest
# ============================================================================
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
U=$(id -un); H=$HOME
say() { printf '  %-44s %s\n' "$1" "$2"; }
echo "=== KitchenPC restore on $(hostname) as $U ==="

# ---- 1. TOUCHSCREEN (NextWindow Fermi, USB 1926:0dbe). ALL THREE PIECES ARE REQUIRED. --------
# (1) DKMS module, (2) the 32-bit daemon (needs libc6-i386), (3) the Xorg input driver built from
# source - without (3) the device attaches and creates an input node but never emits. Plus the
# user must be in 'input'. glorang/nwfermi, NOT the old zips on the USB stick.
if ! dkms status 2>/dev/null | grep -q 'nwfermi.*installed'; then
  rm -rf "$H/nwfermi" && git clone -q --depth 1 https://github.com/glorang/nwfermi.git "$H/nwfermi"
  sudo cp -r "$H/nwfermi/usr/src/nwfermi-0.7.0.1" /usr/src/
  sudo dkms add -m nwfermi -v 0.7.0.1 >/dev/null 2>&1
  sudo dkms build -m nwfermi -v 0.7.0.1 >/dev/null 2>&1
  sudo dkms install -m nwfermi -v 0.7.0.1 >/dev/null 2>&1
fi
cd "$H/nwfermi" || exit 1
sudo install -m755 usr/sbin/nwfermi_daemon usr/sbin/fwprod /usr/sbin/
sudo install -m644 etc/udev/rules.d/40-nw-fermi.rules /etc/udev/rules.d/
sudo install -m644 etc/systemd/system/nwfermi@.service /etc/systemd/system/
sudo mkdir -p /etc/X11/xorg.conf.d && sudo install -m644 etc/X11/xorg.conf.d/10-nwfermi.conf /etc/X11/xorg.conf.d/
if [ ! -f /usr/lib/xorg/modules/input/nextwindow_drv.so ]; then
  cd usr/src/xf86-input-nextwindow-0.3.4 && chmod +x autogen.sh
  ./autogen.sh >/tmp/nw-agen.log 2>&1 && make >/tmp/nw-make.log 2>&1 && sudo make install >/tmp/nw-mi.log 2>&1
  sudo cp -f /usr/local/lib/xorg/modules/input/nextwindow_drv.so /usr/lib/xorg/modules/input/
fi
sudo usermod -a -G input "$U"
sudo systemctl daemon-reload; sudo udevadm control --reload-rules; sudo udevadm trigger --subsystem-match=usb --action=add
say "touchscreen driver (3 pieces)" "dkms:$(dkms status 2>/dev/null | grep -c 'nwfermi.*installed') xorg:$(ls /usr/lib/xorg/modules/input/nextwindow_drv.so 2>/dev/null | wc -l)"
cd "$H"

# ---- 2. AUDIO (#203 final) ---------------------------------------------------------------
# Hardware gains measured 09-23: two stages were stacked at -24 + -18.75 dB. All playback stages 0 dB.
amixer -q -c 0 sset Master 0dB unmute 2>/dev/null; amixer -q -c 0 sset 'Speaker+LO' 0dB unmute 2>/dev/null
amixer -q -c 0 sset PCM 0dB unmute 2>/dev/null; amixer -q -c 0 sset Capture 40 2>/dev/null
amixer -q -c 0 sset 'Internal Mic Boost' 1 2>/dev/null; sudo alsactl store 0 2>/dev/null
systemctl --user enable --now pipewire.socket pipewire-pulse.socket pipewire pipewire-pulse wireplumber >/dev/null 2>&1
mkdir -p "$H/.local/share/easyeffects/output" "$H/.config/autostart"
cp -f "$HERE/easyeffects-KitchenPC-FINAL-2026-09-24-wide.json" "$H/.local/share/easyeffects/output/KitchenPC.json"
printf '[Desktop Entry]\nType=Application\nName=EasyEffects preset\nExec=sh -c "sleep 12; easyeffects -l KitchenPC"\nX-GNOME-Autostart-enabled=true\n' > "$H/.config/autostart/easyeffects-preset.desktop"
# #203: the HARDWARE sink must be default (the taskbar volume did nothing on easyeffects_sink);
# EasyEffects still captures every app stream.
cat > "$H/.config/autostart/hcc-default-sink.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=Default sink = speakers
Exec=sh -c "sleep 20; pactl set-default-sink $(pactl list short sinks | awk '/alsa_output/{print $2; exit}')"
X-GNOME-Autostart-enabled=true
EOF
say "audio gains 0 dB + EasyEffects preset (wide)" "KitchenPC.json"

# ---- 3. BLUETOOTH LOUDSPEAKER (#203) ------------------------------------------------------
sudo mkdir -p /etc/wireplumber/wireplumber.conf.d
sudo tee /etc/wireplumber/wireplumber.conf.d/51-hcc-bluetooth.conf >/dev/null <<'EOF'
# HCC 2026-09-23 - KitchenPC is a wall panel: it must RECEIVE audio from Jeff's phone (a2dp_sink)
# and act as a speakerphone for calls (hfp_hf).
monitor.bluez.properties = {
  bluez5.roles = [ a2dp_sink a2dp_source hfp_hf hfp_ag hsp_hs hsp_ag ]
  bluez5.enable-sbc-xq   = true
  bluez5.enable-msbc     = true
  bluez5.enable-hw-volume = true
  bluez5.hfphsp-backend  = native
  bluez5.autoswitch-profile = true
}
EOF
sudo tee /etc/systemd/system/hcc-bt-loudspeaker.service >/dev/null <<'EOF'
[Unit]
Description=HCC - advertise KitchenPC as a Bluetooth Loudspeaker, not a Computer
# iOS filters its audio picker by Class of Device: a 'Computer' is never offered as a speaker.
# BlueZ ignores Class= in main.conf AND resets the class after registering profiles, so this runs
# LATE and repeats. Proven 2026-09-23. The phone must FORGET and re-pair after a class change.
After=bluetooth.service
Requires=bluetooth.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/sh -c 'for d in 15 45 90; do sleep $d; /usr/bin/hciconfig hci0 class 0x240414; done; /usr/bin/bluetoothctl discoverable-timeout 0; /usr/bin/bluetoothctl discoverable on; /usr/bin/bluetoothctl pairable on'

[Install]
WantedBy=bluetooth.target
EOF
sudo systemctl daemon-reload; sudo systemctl enable hcc-bt-loudspeaker >/dev/null 2>&1
command -v hciconfig >/dev/null || say "WARNING" "hciconfig missing - the loudspeaker class cannot be set"
printf '[Desktop Entry]\nType=Application\nName=Bluetooth Manager\nExec=blueman-applet\nX-GNOME-Autostart-enabled=true\n' > "$H/.config/autostart/blueman.desktop"
say "bluetooth loudspeaker mode" "class 0x240414 service + wireplumber roles"

# ---- 4. KIOSK + APP SCREENSAVER (Firefox, #204/#205) ------------------------------------
sudo install -m755 "$HERE/hcc-kiosk-start" "$HERE/hcc-screensaver" /usr/local/bin/
printf '[Desktop Entry]\nType=Application\nName=HCC Wall Panel\nComment=Bring the Home Command Center up on screen at login and keep it there\nExec=/usr/local/bin/hcc-kiosk-start\nX-GNOME-Autostart-enabled=true\n' > "$H/.config/autostart/hcc-kiosk.desktop"
say "kiosk + screensaver" "/usr/local/bin/hcc-kiosk-start, hcc-screensaver"

# ---- 5. STREAMING LAUNCHERS (#204 - HP DESKTOP ONLY, never in the shared app / iPad) -----
mkdir -p "$H/Desktop"
for L in "Sling TV|https://watch.sling.com" "Braves|https://braves.tv"; do
  n=${L%%|*}; url=${L#*|}
  printf '[Desktop Entry]\nVersion=1.0\nType=Application\nName=%s\nExec=firefox --new-window %s\nIcon=firefox\nTerminal=false\n' "$n" "$url" > "$H/Desktop/$n.desktop"
  chmod +x "$H/Desktop/$n.desktop"
done
say "Sling + Braves launchers (desktop)" "Firefox"

# ---- 6. CLOCK: Central -------------------------------------------------------------------
sudo timedatectl set-timezone America/Chicago; sudo timedatectl set-ntp true
say "timezone" "$(timedatectl show -p Timezone --value)"

# ---- 7. NETWORK ICON: netplan -> NetworkManager (else the tray shows an X on a working link) --
# Found again 09-26 after the reinstall (subiquity writes a networkd-only config). Applied via
# systemd-run so an SSH session that runs this survives the brief link bounce.
if ! sudo grep -q 'renderer: NetworkManager' /etc/netplan/*.yaml 2>/dev/null; then
  IF=$(ip route show default | awk '{print $5; exit}')
  sudo cp /etc/netplan/00-installer-config.yaml /root/00-installer-config.yaml.bak 2>/dev/null
  printf 'network:\n  version: 2\n  renderer: NetworkManager\n  ethernets:\n    %s:\n      dhcp4: true\n      dhcp-identifier: mac\n      wakeonlan: true\n' "$IF" | sudo tee /etc/netplan/00-installer-config.yaml >/dev/null
  sudo chmod 600 /etc/netplan/00-installer-config.yaml
  sudo netplan generate && sudo systemd-run --unit=hcc-netplan-apply netplan apply
fi
say "network renderer" "NetworkManager"

# ---- 8. SESSION SETTINGS (need the logged-in desktop's D-Bus; re-run this script from the desktop
#         or it prints SKIPPED) - on-screen keyboard pops up on text fields, 12-hour clock --------
if [ -n "${DBUS_SESSION_BUS_ADDRESS:-}" ]; then
  # 09-26: without this, Onboard's auto-show puts an "Enable accessibility now?" box in the middle
  # of the wall panel at every login (seen on the first reboot after the rebuild).
  gsettings set org.gnome.desktop.interface toolkit-accessibility true
  gsettings set org.onboard.auto-show enabled true
  gsettings set org.onboard.auto-show tablet-mode-detection-enabled false 2>/dev/null
  gsettings set org.onboard.auto-show keyboard-device-detection-enabled false 2>/dev/null
  gsettings set org.onboard.icon-palette in-use true; gsettings set org.onboard show-status-icon true
  gsettings set org.onboard.window docking-enabled true; gsettings set org.onboard.window docking-edge bottom
  gsettings set org.onboard start-minimized true
  for p in $(xfconf-query -c xfce4-panel -l 2>/dev/null | grep -E '/plugins/plugin-[0-9]+/digital-(time-)?format$'); do
    xfconf-query -c xfce4-panel -p "$p" -s '%a %b %d, %l:%M %p'
  done
  easyeffects -l KitchenPC >/dev/null 2>&1
  say "keyboard auto-show + 12-hour clock + preset" "applied"
else
  say "SKIPPED session settings" "run again from the desktop session"
fi
sudo systemctl start --no-block hcc-bt-loudspeaker
echo "=== restore done. Next: hcc-desktop-standard.sh (sudo AND as the user in the session), restart lightdm. ==="
