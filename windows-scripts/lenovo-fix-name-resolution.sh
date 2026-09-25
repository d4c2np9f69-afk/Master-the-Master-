#!/bin/bash
# ROOT CAUSE of Jeff's "it still can't reach the other computers on network",
# found 2026-09-19 by testing the FEATURE (Explorer's Network folder) instead of
# my own hand-rolled WS-Discovery probe, which was an unreliable instrument and
# reported healthy machines as silent.
#
# Explorer's Network on the Acer ALREADY lists GARAGELAPTOP and 301SERVER, so
# discovery was never the problem. The next step is what fails:
#     GarageLaptop                 -> NOT RESOLVABLE
#     \\GarageLaptop\GarageFiles   -> False
#     \\192.168.1.173\GarageFiles  -> True    (same share, by IP)
# Click the machine in Network, Windows cannot turn GARAGELAPTOP into an
# address, and it looks like the machine is unreachable.
#
# WHY: smb.conf carries "disable netbios = Yes". nmbd - the Samba daemon that
# answers NetBIOS name queries - therefore refuses to start:
#     nmbd.service: Skipped due to 'exec-condition'
# It reads "inactive / enabled", which looks like a service that simply is not
# running rather than one that is configured off.
set -u
CONF=/etc/samba/smb.conf
STAMP=$(date +%Y%m%d-%H%M%S)

echo "=== back up smb.conf first ==="
sudo cp "$CONF" "$CONF.bak-$STAMP"
echo "  $CONF.bak-$STAMP"

echo ""
echo "=== before ==="
testparm -s 2>/dev/null | grep -iE 'disable netbios|netbios name|workgroup' | sed 's/^/  /'

echo ""
echo "=== turn NetBIOS back on and pin the name Windows will look up ==="
if grep -qiE '^\s*disable netbios' "$CONF"; then
    sudo sed -i -E 's/^\s*disable netbios\s*=.*/   disable netbios = no/I' "$CONF"
    echo "  set: disable netbios = no"
else
    sudo sed -i '/^\[global\]/a\   disable netbios = no' "$CONF"
    echo "  added: disable netbios = no"
fi
if ! grep -qiE '^\s*netbios name' "$CONF"; then
    sudo sed -i '/^\[global\]/a\   netbios name = GarageLaptop' "$CONF"
    echo "  added: netbios name = GarageLaptop"
fi

echo ""
echo "=== validate the config BEFORE restarting anything ==="
if sudo testparm -s >/dev/null 2>&1; then
    echo "  testparm: OK"
else
    echo "  testparm FAILED - restoring the backup and stopping"
    sudo cp "$CONF.bak-$STAMP" "$CONF"
    exit 1
fi

echo ""
echo "=== after ==="
testparm -s 2>/dev/null | grep -iE 'disable netbios|netbios name|workgroup' | sed 's/^/  /'

echo ""
echo "=== start nmbd (and reload smbd so it picks up the change) ==="
sudo systemctl restart smbd
sudo systemctl enable nmbd >/dev/null 2>&1
sudo systemctl restart nmbd
sleep 3
echo "  smbd: $(systemctl is-active smbd)"
echo "  nmbd: $(systemctl is-active nmbd) / $(systemctl is-enabled nmbd)"

echo ""
echo "=== is it answering on 137/138 now? ==="
sudo ss -lunp 2>/dev/null | grep -E ':137|:138' | sed 's/^/  /' || echo "  NOTHING on 137/138 - still broken"

echo ""
echo "=== its own view of the name ==="
nmblookup -A 127.0.0.1 2>/dev/null | head -8 | sed 's/^/  /'
