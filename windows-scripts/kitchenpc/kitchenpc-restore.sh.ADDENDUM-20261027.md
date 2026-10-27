# KitchenPC addendum - 2026-10-27 6:4x AM

Jeff morning: "I go in the kitchen this morning... the fucking computer is still not fixed".

ROOT CAUSE: yesterday's launcher-trust fixes landed cleanly on disk (10/10 launchers
stamped with metadata::xfce-exe-checksum and StartupNotify=false), BUT xfdesktop
caches that trust state. Without an explicit `xfdesktop --reload`, the icons stayed
dead the whole night because the cache never saw the new stamps.

PERMANENT FIX: added ~/.config/autostart/hcc-xfdesktop-reload.desktop on the box.
It runs `sleep 5; xfdesktop --reload` at every login. If the SSD rebuilds again,
kitchenpc-restore.sh must drop this autostart file alongside the launcher stamps.

VERIFY:
  ls -la ~/.config/autostart/hcc-xfdesktop-reload.desktop
  cat   ~/.config/autostart/hcc-xfdesktop-reload.desktop
