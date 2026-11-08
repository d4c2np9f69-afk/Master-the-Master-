#!/bin/bash
# ============================================================================
# HCC desktop LOOK = THE BEAST'S LOOK. Run as the desktop user (uses sudo for 2 steps).
#   bash hcc-desktop-theme.sh            (called by hcc-desktop-standard.sh)
#
# Jeff 2026-11-08 8:18 AM: "you have got to change your he theme on the desk tops of the garage and
# kitchen they are so depressing can you put a theme like the beast on it ?"
# The old standard was Greybird: grey windows + a near-black taskbar.
#
# THE BEAST, MEASURED 2026-11-08 (registry, not guessed):
#   Windows LIGHT mode (AppsUseLightTheme=1, SystemUsesLightTheme=1), transparency off,
#   accent 0063B1 (Windows blue), theme pack "Lighthouses by Night" = 12 photos,
#   slideshow every 60 s, in order (Interval=60000, Shuffle=0).
# HERE: Orchis-Light (Ubuntu's own package - light, rounded, blue accent: the nearest thing to
#   Windows 11 on XFCE), Papirus-Light icons (dark glyphs that read on a light taskbar), a light
#   taskbar, and THE SAME 12 lighthouse photos rotating every minute, in order.
# The photos are copied from the Beast's own theme folder over the house share. They are licensed
#   Microsoft/Getty images: they are NOT in this repo (it is public) and must never be added to it.
# Undo: the look before the first run is saved to ~/hcc-theme-backup-original/ (xfconf values + gtk.css).
# ============================================================================
set -u
U="${SUDO_USER:-$USER}"; H=$(getent passwd "$U" | cut -d: -f6)
export DISPLAY="${DISPLAY:-:0}" XAUTHORITY="${XAUTHORITY:-$H/.Xauthority}"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-unix:path=/run/user/$(id -u "$U")/bus}"
say() { printf '  %-42s %s\n' "$1" "$2"; }
x() { xfconf-query "$@" 2>/dev/null; }
echo "=== HCC desktop look (the Beast's) -> $(hostname) ==="

# ONE backup, taken on the FIRST run only - a re-run must not overwrite the original look with this one.
B="$H/hcc-theme-backup-original"
if [ ! -d "$B" ]; then
  mkdir -p "$B"; for c in xsettings xfwm4 xfce4-desktop xfce4-panel; do x -c $c -l -v > "$B/$c.txt"; done
  cp "$H/.config/gtk-3.0/gtk.css" "$B/gtk.css" 2>/dev/null
  say "original settings saved" "$B"
else say "original settings already saved" "$B"; fi

# 1. the theme package (Ubuntu archive)
dpkg -s orchis-gtk-theme >/dev/null 2>&1 || sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q orchis-gtk-theme >/dev/null
say "orchis-gtk-theme" "$(dpkg -s orchis-gtk-theme 2>/dev/null | awk '/^Version/{print $2}')"

# 2. the Beast's 12 lighthouse photos
SRC="/mnt/beast/Users/jeffl/AppData/Local/Microsoft/Windows/Themes/Lighthous (2)/DesktopBackground"
DST=/usr/share/backgrounds/hcc-lighthouses
sudo mkdir -p "$DST"
[ -d "$SRC" ] && sudo cp -n "$SRC"/*.jpg "$DST"/ 2>/dev/null
N=$(ls "$DST"/*.jpg 2>/dev/null | wc -l)
say "lighthouse photos in $DST" "$N of 12"

# 3. light theme, windows + apps + icons
x -c xsettings -p /Net/ThemeName     -s Orchis-Light
x -c xfwm4     -p /general/theme     -s "$( [ -d /usr/share/themes/Orchis-Light/xfwm4 ] && echo Orchis-Light || echo Orchis)"
x -c xsettings -p /Net/IconThemeName -s Papirus-Light
x -c xsettings -p /Gtk/FontName      -s "Noto Sans 10"
say "theme" "Orchis-Light / Papirus-Light / Noto Sans 10"

# 4. light taskbar, like Windows 11 light mode (F3F3F3)
x -c xfce4-panel -p /panels/panel-1/background-style -s 1
x -c xfce4-panel -p /panels/panel-1/background-rgba -n -t double -s 0.953 -t double -s 0.953 -t double -s 0.953 -t double -s 1.0 \
 || x -c xfce4-panel -p /panels/panel-1/background-rgba -t double -s 0.953 -t double -s 0.953 -t double -s 0.953 -t double -s 1.0
x -c xfce4-panel -p /panels/panel-1/dark-mode -n -t bool -s false || x -c xfce4-panel -p /panels/panel-1/dark-mode -s false
say "taskbar" "light (F3F3F3)"
# Orchis-Light draws taskbar text + tray icons at 60 % black (rgba(0,0,0,0.6)) - on the light taskbar
# the sound/bluetooth/network/bell icons came out washed-out grey (garage screenshot 11-08 8:22 AM).
# Full-strength dark, marked so a re-run replaces it instead of stacking copies.
mkdir -p "$H/.config/gtk-3.0"; CSS="$H/.config/gtk-3.0/gtk.css"; touch "$CSS"
sed -i '/HCC-THEME-BEGIN/,/HCC-THEME-END/d' "$CSS"
cat >> "$CSS" <<'CSSEOF'
/* HCC-THEME-BEGIN (hcc-desktop-theme.sh) - taskbar text and icons full-strength on the light taskbar */
.xfce4-panel, .xfce4-panel * { color: #1b1b1b; }
.xfce4-panel image, .xfce4-panel button image { opacity: 1; -gtk-icon-effect: none; }
/* HCC-THEME-END */
CSSEOF
xfce4-panel -r >/dev/null 2>&1 &
say "taskbar icons" "full-strength dark (gtk.css)"

# 5. wallpaper slideshow: every monitor, every workspace, 1 minute, in order
if [ "$N" -gt 0 ]; then
  FIRST=$(ls "$DST"/*.jpg | head -1)
  x -c xfce4-desktop -p /backdrop/single-workspace-mode   -n -t bool -s true || x -c xfce4-desktop -p /backdrop/single-workspace-mode -s true
  x -c xfce4-desktop -p /backdrop/single-workspace-number -n -t int  -s 0    || x -c xfce4-desktop -p /backdrop/single-workspace-number -s 0
  WS=$(x -c xfwm4 -p /general/workspace_count); WS=${WS:-1}
  for M in $(xrandr --listmonitors 2>/dev/null | awk 'NR>1{print $NF}'); do
    for ((w=0; w<WS; w++)); do
      P=/backdrop/screen0/monitor$M/workspace$w
      setp() { x -c xfce4-desktop -p "$P/$1" -n -t "$2" -s "$3" || x -c xfce4-desktop -p "$P/$1" -s "$3"; }
      setp last-image string "$FIRST"
      setp image-style int 5                    # 5 = zoomed: fill the screen, no bars
      setp color-style int 0
      setp backdrop-cycle-enable bool true
      setp backdrop-cycle-period int 1          # 1 = minutes
      setp backdrop-cycle-timer uint 1          # every 1 minute, as the Beast (Interval=60000)
      setp backdrop-cycle-random-order bool false   # in order, as the Beast (Shuffle=0)
    done
    say "slideshow on $M" "$WS workspace(s), every 1 min"
  done
  xfdesktop --reload >/dev/null 2>&1 &
fi
echo "=== done. Undo: restore the values in $B ==="
