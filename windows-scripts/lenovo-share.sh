#!/bin/bash
# Make the Lenovo SHARE its files so the Acer/Beast can reach it. Right now port 445
# is closed (no Samba server), so it appears in the Network folder but opens to
# nothing. This adds a guest, read+write share of Jeff's home dir - matching his
# standing decision that the LAN is open (router is the wall), same as the Beast.
set -u
echo "=== 1. install samba server ==="
if ! command -v smbd >/dev/null 2>&1; then
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q samba >/dev/null 2>&1
fi
command -v smbd >/dev/null 2>&1 && echo "  smbd: $(command -v smbd)" || { echo "  FAILED to install samba"; exit 1; }

echo
echo "=== 2. add a guest read+write share of /home/jeffloewen ==="
CONF=/etc/samba/smb.conf
# make sure [global] allows guest mapping + the workgroup
if ! grep -q '^\s*map to guest' "$CONF"; then
  sudo sed -i '/^\[global\]/a \   map to guest = Bad User\n   guest account = jeffloewen' "$CONF"
fi
# add the share if not already there
if ! grep -q '^\[GarageFiles\]' "$CONF"; then
  sudo tee -a "$CONF" >/dev/null <<'SHARE'

[GarageFiles]
   comment = Lenovo files (garage laptop)
   path = /home/jeffloewen
   browseable = yes
   read only = no
   guest ok = yes
   guest only = yes
   force user = jeffloewen
   create mask = 0644
   directory mask = 0755
SHARE
  echo "  added [GarageFiles] share"
else
  echo "  [GarageFiles] already defined"
fi

echo
echo "=== 3. validate the config ==="
testparm -s 2>/dev/null | grep -E '\[GarageFiles\]|map to guest|workgroup' | sed 's/^/  /'

echo
echo "=== 4. enable + start smbd (nmbd not needed; wsdd already does discovery) ==="
sudo systemctl enable --now smbd >/dev/null 2>&1
echo "  smbd: $(systemctl is-active smbd)/$(systemctl is-enabled smbd)"

echo
echo "=== 5. open the firewall if ufw is active ==="
if sudo ufw status 2>/dev/null | grep -q 'Status: active'; then
  sudo ufw allow from 192.168.1.0/24 to any port 445 proto tcp >/dev/null 2>&1
  echo "  ufw: allowed 445 from the LAN"
else
  echo "  ufw inactive - nothing to open"
fi

echo
echo "=== 6. PROVE port 445 is now listening ==="
sudo ss -tlnp 2>/dev/null | grep ':445' | sed 's/^/  /' || echo "  445 NOT listening - check smbd status"
echo "done - from Windows: \\\\GarageLaptop\\GarageFiles  or  \\\\192.168.1.173\\GarageFiles"
