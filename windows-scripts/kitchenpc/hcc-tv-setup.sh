#!/bin/bash
# hcc-tv-setup.sh - the kitchen PC as Jeff's kitchen TV. Idempotent; run on KitchenPC as jeffloewen from this folder.
# 2026-11-08, Jeff 8:43 AM: "start Fox News at 6:00am every morning ... make sure it doesn't turn off till I turn
# it off. I don't want it timing out or the app popping up killing it. In fact I need a shortcut on the desktop
# to go to the app". And 8:2x AM: the on-screen keyboard must pop up on Sling's sign-in (hcc-browser flag).
set -u
HERE=$(cd "$(dirname "$0")" && pwd); H=$HOME
say(){ printf '  %-44s %s\n' "$1" "$2"; }
export DISPLAY=:0 XAUTHORITY="$H/.Xauthority" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

sudo install -m755 "$HERE/hcc-browser" "$HERE/hcc-fox-news" "$HERE/hcc-app" "$HERE/hcc-sling-click" "$HERE/hcc-cdp-click" /usr/local/bin/
sudo install -m755 "$HERE/osk-test.sh" /usr/local/bin/osk-test
say "scripts" "hcc-browser hcc-fox-news hcc-app hcc-sling-click hcc-cdp-click osk-test -> /usr/local/bin"

# THE KIOSK PROFILE (#281, 2026-11-11). hcc-browser runs Edge out of ~/.local/share/hcc/edge-kiosk
# instead of the default profile, for one reason: Edge 136+ REFUSES --remote-debugging-port on the
# default profile dir, and without that port the kiosk's buttons can only be pressed by tapping
# screen pixels with xdotool. That tapping is what broke 11-11: hcc-fox-news measured WATCH NOW
# before fullscreen was applied, fullscreen moved the window ~20 px, and the tap landed on the red
# REC dot - it started a DVR recording while the log said it had tapped WATCH NOW. hcc-cdp-click
# clicks the element's own viewport rect instead, so the window's screen position cannot make it miss.
# Seed it from the default profile so the existing Sling sign-in carries over; on a FRESH machine
# there is nothing to copy and JEFF MUST SIGN INTO SLING ONCE on the kitchen screen (Claude may not
# type passwords). Never overwrite an existing kiosk profile - that is where the sign-in now lives.
if [ ! -d "$H/.local/share/hcc/edge-kiosk" ]; then
  mkdir -p "$H/.local/share/hcc"
  if [ -d "$H/.config/microsoft-edge" ]; then
    pgrep -x msedge >/dev/null && say "kiosk profile" "SKIPPED - close Edge first, then re-run" || {
      cp -a "$H/.config/microsoft-edge" "$H/.local/share/hcc/edge-kiosk"
      say "kiosk profile" "seeded from the default Edge profile (sign-in carried over)"
    }
  else
    say "kiosk profile" "none to copy - JEFF must sign into Sling once on the kitchen screen"
  fi
else
  say "kiosk profile" "already present (left alone - the Sling sign-in lives here)"
fi

# Sling 7-403 fix (#281, 2026-11-11). Sling serves use-streamauth-qvt ON with use-stream-authoriser OFF,
# so loadTimeline neither downloads the QVT nor puts one in the stream-auth reply, then calls
# filterQvt(undefined) -> TypeError "...reading 'playback_info'" which Sling mislabels as 7-403.
# Sling's own bundle ships the override: isStreamAuthEnabled(){ return getLDFlagStatus(...) || window.enableStreamAuth }.
# Without this extension the kitchen screen CANNOT play Sling at all. hcc-browser --load-extension loads it.
mkdir -p "$H/.local/share/hcc/sling-streamauth"
install -m644 "$HERE/sling-streamauth/manifest.json" "$HERE/sling-streamauth/fix.js" "$H/.local/share/hcc/sling-streamauth/"
say "Sling stream-auth fix" "-> ~/.local/share/hcc/sling-streamauth (#281)"

# Edge's own menu entry goes through hcc-browser too, so Edge never starts without the keyboard/autoplay flags
mkdir -p "$H/.local/share/applications"
sed 's#/usr/bin/microsoft-edge-stable#/usr/local/bin/hcc-browser#' /usr/share/applications/microsoft-edge.desktop > "$H/.local/share/applications/microsoft-edge.desktop"
say "Edge menu entry" "-> hcc-browser"

# no "Restore pages?" bubble over the channel after Edge is closed hard (seen 11-08 during the keep-alive test)
echo '{ "HideRestoreDialogEnabled": true }' | sudo tee /etc/opt/edge/policies/managed/hcc-no-restore-bubble.json >/dev/null
say "Edge restore-pages bubble" "off (policy hcc-no-restore-bubble.json)"

# the app no longer pops up by itself (it covered Fox News); the desktop icon opens it
f="$H/.config/autostart/hcc-screensaver.desktop"
[ -f "$f" ] && { grep -q '^Hidden=true' "$f" || echo 'Hidden=true' >> "$f"; }
pkill -x xautolock 2>/dev/null
say "app auto-popup (xautolock)" "$(pgrep -x xautolock >/dev/null && echo STILL RUNNING || echo off)"

# the screen never blanks - the 09-23 setting (blank-on-ac 0); found back at 15 min on 11-08
for p in blank-on-ac blank-on-battery; do xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/$p -s 0 2>/dev/null || xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/$p -n -t int -s 0; done
xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/dpms-enabled -s false 2>/dev/null || xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/dpms-enabled -n -t bool -s false
xset s off; xset s noblank; xset -dpms
say "screen blanking" "$(xset q | awk '/timeout:/{print "X timeout " $2 " s"}'), $(xset q | grep -o 'DPMS is [A-Za-z]*')"

# 6 AM start + 2-minute keep-alive (cron runs in the PC's own clock - must be America/Chicago)
{ crontab -l 2>/dev/null | grep -v 'hcc-fox-news' | grep -v '^PATH=/usr/local/bin'
  echo 'PATH=/usr/local/bin:/usr/bin:/bin'
  echo '0 6 * * * /usr/local/bin/hcc-fox-news start   # Fox News on at 6 AM (Jeff 2026-11-08)'
  echo '*/2 * * * * /usr/local/bin/hcc-fox-news watch  # keep it on until Jeff closes it'
} | crontab -
say "cron" "$(crontab -l | grep -c hcc-fox-news) lines, clock $(timedatectl show -p Timezone --value)"

# desktop icons: app + Fox News; re-stamp trust (content checksum) and reload xfdesktop (10-26/10-27 lessons)
mk(){ printf '[Desktop Entry]\nVersion=1.0\nType=Application\nName=%s\nExec=%s\nIcon=%s\nTerminal=false\nStartupNotify=false\n' "$1" "$2" "$3" > "$H/Desktop/$1.desktop"; chmod +x "$H/Desktop/$1.desktop"; }
mk "Home Command Center" "/usr/local/bin/hcc-app" "microsoft-edge"
mk "Fox News" "/usr/local/bin/hcc-fox-news start" "video-television"
for f in "$H"/Desktop/*.desktop; do gio set -t string "$f" metadata::xfce-exe-checksum "$(sha256sum "$f" | cut -d' ' -f1)" 2>/dev/null; done
xfdesktop --reload 2>/dev/null &
say "desktop icons" "Home Command Center -> hcc-app, Fox News -> hcc-fox-news start, all re-stamped"
