#!/bin/bash
# ============================================================================
# HCC — THE STANDARD DESKTOP. Run on ANY house Ubuntu machine; they end up
# identical. Written 2026-09-23 after the two Ubuntu boxes were found to be
# running completely different desktops (XFCE/X11 vs GNOME/Wayland).
#
#   bash hcc-desktop-standard.sh
#
# Idempotent — safe to re-run. Removes nothing; GNOME stays installed as a
# fallback session that can still be picked at the login screen.
#
# WHY XFCE AND X11, not GNOME/Wayland:
#   1. Every machine here is a 2011-era Pentium. XFCE is what makes them usable.
#   2. The HP's NextWindow touchscreen driver is an XORG driver. Under Wayland
#      it cannot load at all.
#   3. Only XFCE can be made to look like Windows (taskbar, start menu,
#      window buttons on the right) without fighting it.
# ============================================================================
set -u
U="${SUDO_USER:-$USER}"
H=$(getent passwd "$U" | cut -d: -f6)
say() { printf '  %-42s %s\n' "$1" "$2"; }
echo "=== HCC standard desktop -> $(hostname) (user $U) ==="

# --- panel: bottom, full width, touch-sized -------------------------------
# p=10 is BOTTOM. NOT p=11 — that renders at the TOP on xfce4-panel 4.20.
# Measured empirically 2026-09-23: p=8/10/12 -> bottom, p=2/6/9/11 -> top.
SH=$(xrandr 2>/dev/null | awk '/\*/{split($1,a,"x"); print a[2]; exit}')
SH=${SH:-1080}
xfconf-query -c xfce4-panel -p /panels/panel-1/position-locked -s false 2>/dev/null
xfconf-query -c xfce4-panel -p /panels/panel-1/position   -s "p=10;x=0;y=${SH}" 2>/dev/null
xfconf-query -c xfce4-panel -p /panels/panel-1/size       -s 44   2>/dev/null
xfconf-query -c xfce4-panel -p /panels/panel-1/length     -s 100  2>/dev/null
xfconf-query -c xfce4-panel -p /panels/panel-1/mode       -s 0    2>/dev/null
xfconf-query -c xfce4-panel -p /panels/panel-1/autohide-behavior -s 0 2>/dev/null
say "taskbar bottom, 44px, full width" "p=10;y=${SH}"

# --- power buttons on the panel (a wall-mounted box has no reachable button)
if ! xfconf-query -c xfce4-panel -p /plugins/plugin-10 >/dev/null 2>&1; then
  xfconf-query -c xfce4-panel -p /plugins/plugin-10 -n -t string -s 'actions' 2>/dev/null
  xfconf-query -c xfce4-panel -p /plugins/plugin-10/appearance -n -t int -s 1 2>/dev/null
  ids=$(xfconf-query -c xfce4-panel -p /panels/panel-1/plugin-ids 2>/dev/null | tail -n +3 | tr '\n' ' ')
  args=""; for i in $ids 10; do args="$args -t int -s $i"; done
  # shellcheck disable=SC2086
  xfconf-query -c xfce4-panel -p /panels/panel-1/plugin-ids $args -a 2>/dev/null
fi
say "power buttons on the taskbar" "actions plugin"

# --- window buttons on the RIGHT, Windows order ---------------------------
xfconf-query -c xfwm4 -p /general/button_layout  -s '|HMC' 2>/dev/null
xfconf-query -c xfwm4 -p /general/click_to_focus -s true   2>/dev/null
xfconf-query -c xfwm4 -p /general/snap_to_border -s true   2>/dev/null
xfconf-query -c xfwm4 -p /general/theme          -s Greybird 2>/dev/null
xfconf-query -c xsettings -p /Net/ThemeName      -s Greybird 2>/dev/null
xfconf-query -c xsettings -p /Net/IconThemeName  -s Papirus  2>/dev/null
say "window buttons right + theme" "Greybird / Papirus"

# --- NEVER LOCK. A wall panel that asks for a password is a brick. --------
xfconf-query -c xfce4-screensaver -p /saver/enabled -n -t bool -s false 2>/dev/null
xfconf-query -c xfce4-screensaver -p /lock/enabled  -n -t bool -s false 2>/dev/null
xfconf-query -c xfce4-screensaver -p /saver/idle-activation/enabled -n -t bool -s false 2>/dev/null
xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/dpms-enabled -n -t bool -s false 2>/dev/null
mkdir -p "$H/.config/autostart"
for k in xfce4-screensaver light-locker; do
  printf '[Desktop Entry]\nType=Application\nName=%s\nHidden=true\n' "$k" > "$H/.config/autostart/$k.desktop"
done
say "screen lock disabled + blocked" "no password, ever"

# --- autostarts -----------------------------------------------------------
auto() { printf '[Desktop Entry]\nType=Application\nName=%s\nExec=%s\nX-GNOME-Autostart-enabled=true\n' "$1" "$2" > "$H/.config/autostart/$3.desktop"; }
auto "On-screen Keyboard" "onboard"                                  onboard
auto "Bluetooth Manager"  "blueman-applet"                           blueman
auto "EasyEffects"        "easyeffects --gapplication-service"       easyeffects-service
auto "Hide cursor"        "unclutter -idle 5 -root"                  unclutter
auto "HCC App Screensaver" "xautolock -time 10 -locker /usr/local/bin/hcc-screensaver -detectsleep" hcc-screensaver
say "autostarts written" "keyboard, bluetooth, audio, screensaver"

# --- NO KEYRING PROMPT. A box that auto-logs in has no password. ----------
# The GNOME login keyring is unlocked by the password typed at the login
# screen. With auto-login nobody ever types one, so Chrome's first save pops
# an "Unlock Login Keyring" box that CANNOT BE ANSWERED and comes back at
# every boot. Measured 2026-09-23 on KitchenPC.
# An empty-password keyring was tried first and did NOT survive a reboot.
# What works is removing the secrets service entirely: Chrome then falls back
# to its own basic store, which is the right trade on a wall panel.
printf '[Desktop Entry]
Type=Application
Name=Secret Storage Service
Exec=/usr/bin/gnome-keyring-daemon --start --components=secrets
Hidden=true
X-GNOME-Autostart-enabled=false
'   > "$H/.config/autostart/gnome-keyring-secrets.desktop"
say "keyring secrets service disabled" "no unanswerable password box"

# --- desktop shortcuts ----------------------------------------------------
mkdir -p "$H/Desktop"
shortcut() { printf '[Desktop Entry]\nVersion=1.0\nType=Application\nName=%s\nExec=%s\nIcon=%s\nTerminal=false\n' "$1" "$2" "$3" > "$H/Desktop/$1.desktop"; chmod +x "$H/Desktop/$1.desktop"; }
# KitchenPC runs FIREFOX, not Chrome (OPEN_ITEMS #205, 2026-09-24): Chrome on that
# machine's Sandy Bridge GPU hard-reset it; Firefox uses the same GPU without resetting,
# and Jeff said "remove chrome completely". Other machines keep Chrome.
case "$(hostname)" in
  KitchenPC|kitchenpc) web() { echo "firefox --new-window $1"; }; WICON=firefox ;;
  *)                   web() { echo "google-chrome-stable --password-store=basic --app=$1"; }; WICON=google-chrome ;;
esac
shortcut "Home Command Center" "$(web https://loewenhome.com)" "$WICON"
shortcut "Home Assistant"      "$(web http://192.168.1.66:8123)" "$WICON"
shortcut "Email"               "$(web https://www.xfinity.com/email)" "$WICON"
shortcut "Office 365"          "$(web https://www.office.com)" applications-office
shortcut "LibreOffice"         "libreoffice --startcenter %U" libreoffice-startcenter
ln -sfn /mnt/beast/Users/jeffl "$H/Desktop/Beast"    2>/dev/null
ln -sfn /mnt/beast/OneDrive    "$H/Desktop/OneDrive" 2>/dev/null
ln -sfn /mnt/acer/Users        "$H/Desktop/Acer"     2>/dev/null
say "desktop shortcuts + house mounts" "HCC, HA, Email, Beast, Acer"

# --- auto-login, console and desktop (gateway-only security model) --------
if [ "$(id -u)" = 0 ]; then
  mkdir -p /etc/lightdm/lightdm.conf.d
  printf '[Seat:*]\nautologin-user=%s\nautologin-user-timeout=0\n' "$U" > /etc/lightdm/lightdm.conf.d/60-autologin.conf
  groupadd -f autologin; gpasswd -a "$U" autologin >/dev/null 2>&1
  mkdir -p /etc/systemd/system/getty@tty1.service.d
  printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty --autologin %s --noclear %%I $TERM\n' "$U" \
     > /etc/systemd/system/getty@tty1.service.d/override.conf
  ln -sf /lib/systemd/system/lightdm.service /etc/systemd/system/display-manager.service
  echo lightdm > /etc/X11/default-display-manager
  systemctl set-default graphical.target >/dev/null 2>&1
  systemctl daemon-reload
  say "auto-login console + desktop" "lightdm, XFCE/X11"
  # OPEN_ITEMS #205 (2026-09-24): on the HP TouchSmart 520 (KitchenPC, Sandy Bridge graphics),
  # Chrome WITH GPU acceleration hard-reset the machine 80-210 s into every cold desktop boot
  # (0 of 4 survived). Chrome was REMOVED; Firefox uses the same GPU (holds /dev/dri/renderD128)
  # and survived. This writes the Firefox system policy the kiosk and Sling depend on.
  # Policy names verified against mozilla/policy-templates docs 2026-09-24.
  # NEVER reinstall Chrome on this machine with GPU acceleration on.
  # Kiosk + screensaver launchers for this box are kept in windows-scripts/kitchenpc/.
  if [ "$(hostname)" = "KitchenPC" ] || [ "$(hostname)" = "kitchenpc" ]; then
    mkdir -p /etc/firefox/policies
    cat > /etc/firefox/policies/policies.json <<'JSON'
{
  "policies": {
    "DontCheckDefaultBrowser": true,
    "DisableTelemetry": true,
    "OverrideFirstRunPage": "",
    "OverridePostUpdatePage": "",
    "UserMessaging": { "SkipOnboarding": true, "ExtensionRecommendations": false, "FeatureRecommendations": false, "MoreFromMozilla": false, "Locked": true },
    "EncryptedMediaExtensions": { "Enabled": true, "Locked": true },
    "Preferences": {
      "dom.allow_scripts_to_close_windows": { "Value": true,  "Status": "locked" },
      "media.autoplay.default":             { "Value": 0,     "Status": "locked" },
      "browser.sessionstore.resume_from_crash": { "Value": false, "Status": "locked" },
      "browser.aboutwelcome.enabled":       { "Value": false, "Status": "locked" }
    }
  }
}
JSON
    say "Firefox policy (#205)" "kiosk X closes it, DRM on, autoplay on"
    # The streaming site nagged "unsupported browser" and served a softer stream (3.3 Mb/s) to
    # Firefox/Linux; presenting as Chrome/Windows gave 4.5-5.8 Mb/s and Jeff: "Yes it's better"
    # (09-24 08:03). Applies to EVERY site - if one misbehaves on the HP, suspect this first.
    for P in "$H"/snap/firefox/common/.mozilla/firefox/*.default*; do
      [ -d "$P" ] || continue
      grep -q general.useragent.override "$P/user.js" 2>/dev/null || \
        echo 'user_pref("general.useragent.override", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36");' >> "$P/user.js"
      chown "$U:$U" "$P/user.js"; say "Firefox user agent = Chrome/Windows" "$P/user.js"
    done
  fi
  # wake-on-lan: the BIOS switch is NOT enough, the driver defaults to off
  for n in $(ls /sys/class/net | grep -E '^(en|eth)'); do
    # NOTE: ethtool prints "Supports Wake-on: pumbg" BEFORE "Wake-on: g", so a
    # plain grep -m1 'Wake-on:' reports the CAPABILITY and never the setting.
    # That reads as armed on a card where wol is off. Anchor on the real line.
    ethtool -s "$n" wol g 2>/dev/null && say "wake-on-lan armed on $n"       "$(ethtool "$n" 2>/dev/null | grep -E '^[[:space:]]+Wake-on:' | awk '{print $2}')"
  done
else
  say "SKIPPED (needs root)" "auto-login + wake-on-lan"
fi
echo "=== done. Log out and back in, or restart lightdm, to see it. ==="
