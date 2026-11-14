#!/bin/bash
# Install the garage handoff watcher as a SYSTEMD USER service.
#
# It must be a USER service, not a system one: it opens a browser window, so it
# has to live inside the desktop session that owns the display. A system service
# runs with no DISPLAY and the window would go nowhere.
#
# This machine already auto-logs in (gdm custom.conf: AutomaticLoginEnable=true,
# AutomaticLogin=jeffloewen), so that session exists from boot with nobody
# typing anything - which is the whole point.
#
# NOTE: "who" reports 0 sessions here even when the desktop IS up, because it
# does not see modern GNOME/Wayland sessions. Use loginctl, not who.
set -u
mkdir -p ~/.config/systemd/user
install -m 755 /tmp/garage-handoff-watcher.sh ~/garage-handoff-watcher.sh

cat > ~/.config/systemd/user/garage-handoff.service <<'EOF'
[Unit]
Description=Garage video handoff - opens what Jeff sent from the house
After=graphical-session.target
PartOf=graphical-session.target

[Service]
Type=simple
ExecStart=%h/garage-handoff-watcher.sh
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable garage-handoff.service >/dev/null 2>&1
systemctl --user restart garage-handoff.service
sleep 3

# linger so the user service starts at BOOT, not only when someone logs in
sudo loginctl enable-linger "$USER" 2>/dev/null

echo "  service : $(systemctl --user is-active garage-handoff) / $(systemctl --user is-enabled garage-handoff)"
echo "  linger  : $(loginctl show-user $USER -p Linger --value 2>/dev/null)"
echo "  --- log ---"
journalctl --user -u garage-handoff -n 6 --no-pager 2>/dev/null | sed 's/^/    /'
