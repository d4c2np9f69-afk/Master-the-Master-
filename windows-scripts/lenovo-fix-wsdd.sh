#!/bin/bash
# MAKING THE LENOVO VISIBLE IN WINDOWS' NETWORK - the full trail, 2026-09-19.
#
# Symptom: ping and SMB to 192.168.1.173 work from everywhere, but Explorer never
# lists it. Proven with real WS-Discovery probes (UDP 3702 -> 239.255.255.250):
#     from Acer  (5 GHz) -> Beast OK, printer OK, Lenovo SILENT
#     from Beast (wired) ->            printer OK, Lenovo SILENT
# The HP printer is a 2.4 GHz-only device and answers BOTH, so multicast does
# cross the Loewen301 / Loewen301-5G split. Jeff's 5-vs-2.4 GHz theory: RULED OUT.
#
# Cause 1: wsdd-host.service was CRASH-LOOPING since creation -
#          OSError: [Errno 98] Address already in use - because GVFS spawns its
#          own wsdd with --no-host (discovery only, never advertises) which owns
#          the port. Restart=always made a permanent crash-loop read as "active",
#          so nothing ever flagged it.
# Cause 2: and the real killer - this box runs PYTHON 3.14.4, and wsdd 0.8 is a
#          PYTHON daemon that is not compatible with it:
#              RuntimeError: There is no current event loop in thread 'MainThread'
#              at asyncio.get_event_loop().set_debug(True)
#          asyncio.get_event_loop() with no running loop was removed in modern
#          Python. It binds its sockets and then answers nobody.
#
# FIX: switch to wsdd2 - the C implementation of the same protocol, no Python
# involved, packaged as wsdd2 1.8.7. It reads the workgroup from smb.conf
# (already LOEWEN301) and is built precisely to make a Samba host appear in
# Windows Explorer.
#
# (I also created a duplicate wsdd.service earlier because I checked for a unit
# named "wsdd" and got not-found - the existing one is wsdd-host. Removed.)
set -u
echo "=== 1. retire the Python wsdd - it cannot work on Python 3.14 ==="
sudo systemctl disable --now wsdd-host.service 2>/dev/null
sudo systemctl disable --now wsdd.service 2>/dev/null
sudo rm -f /etc/systemd/system/wsdd.service
sudo systemctl daemon-reload
sudo pkill -f '/usr/bin/wsdd' 2>/dev/null
echo "  python wsdd stopped and disabled"

echo ""
echo "=== 2. install wsdd2 (C, no Python) ==="
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q wsdd2 >/dev/null 2>&1
dpkg -l wsdd2 2>/dev/null | tail -1 | sed 's/^/  /'

echo ""
echo "=== 3. enable + start it ==="
sudo systemctl enable wsdd2 >/dev/null 2>&1
sudo systemctl restart wsdd2
sleep 4
echo "  wsdd2: $(systemctl is-active wsdd2) / $(systemctl is-enabled wsdd2)"
echo "  restarts: $(systemctl show wsdd2 -p NRestarts --value 2>/dev/null)"
echo "  --- log ---"
journalctl -u wsdd2 -n 8 --no-pager 2>/dev/null | sed 's/^/    /'

echo ""
echo "=== 4. who owns 3702 / 5355 now? ==="
sudo ss -lunp 2>/dev/null | grep -E '3702|5355' | sed 's/^/  /'
echo "  --- processes ---"
ps -eo pid,user,args 2>/dev/null | grep -i '[w]sdd' | sed 's/^/  /'

echo ""
echo "=== 5. samba is the thing being advertised - confirm it is up ==="
echo "  smbd: $(systemctl is-active smbd)"
echo "  workgroup: $(testparm -s 2>/dev/null | grep -i workgroup | head -1 | tr -d '\t')"
