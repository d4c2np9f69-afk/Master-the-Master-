#!/bin/bash
# Set the Lenovo's Samba workgroup to LOEWEN301 to match the Beast and Acer.
# Cosmetic (the Lenovo is an SMB client, not a server) but it makes the browse
# grouping uniform. Also install/enable wsdd so a Linux box actually SHOWS UP in
# Windows 11's Network folder (Win11 dropped the old NetBIOS browser; it uses
# WS-Discovery now, which wsdd provides).
set -u
CONF=/etc/samba/smb.conf

echo "=== before ==="
grep -i 'workgroup' "$CONF" 2>/dev/null | sed 's/^/  /'

echo
echo "=== set workgroup = LOEWEN301 ==="
if [ -f "$CONF" ]; then
  sudo sed -i 's/^\(\s*\)workgroup\s*=.*/\1workgroup = LOEWEN301/I' "$CONF"
  grep -i 'workgroup' "$CONF" | sed 's/^/  now: /'
else
  echo "  no smb.conf (samba server not installed) - nothing to set on the client side"
fi

echo
echo "=== make the Lenovo visible in Windows 'Network' (WS-Discovery) ==="
if ! command -v wsdd >/dev/null 2>&1 && ! dpkg -l wsdd 2>/dev/null | grep -q '^ii'; then
  echo "  installing wsdd..."
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q wsdd >/dev/null 2>&1
fi
if command -v wsdd >/dev/null 2>&1 || dpkg -l wsdd 2>/dev/null | grep -q '^ii'; then
  sudo systemctl enable --now wsdd >/dev/null 2>&1
  echo "  wsdd: $(systemctl is-active wsdd 2>/dev/null) / $(systemctl is-enabled wsdd 2>/dev/null)"
else
  echo "  wsdd not available from apt - the Lenovo still WORKS on the network, it just"
  echo "  will not appear as an icon in Explorer's Network folder. No function lost."
fi

echo
echo "=== reload samba services if any are running (harmless if none) ==="
for svc in smbd nmbd; do
  if systemctl is-active --quiet "$svc"; then sudo systemctl restart "$svc"; echo "  restarted $svc"; fi
done
echo "done"
