#!/bin/bash
# Runs ON the Lenovo (Ubuntu). Makes Files -> Network -> 301SERVER open with NO password box, without
# weakening the Beast: store "Guest / empty password" for the Beast in Jeff's login keyring — exactly what
# the password box would have saved had he typed Guest and ticked "Remember forever".
# secret-tool cannot store an EMPTY secret from stdin (proven 2026-09-22), so this uses python secretstorage.
set -u
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u)/bus
export XDG_RUNTIME_DIR=/run/user/$(id -u)
python3 -c 'import secretstorage' 2>/dev/null || sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q python3-secretstorage >/dev/null 2>&1
python3 - <<'PY'
import secretstorage
conn = secretstorage.dbus_init()
coll = secretstorage.get_default_collection(conn)
if coll.is_locked():
    coll.unlock()
n = 0
for srv in ['301server', '301SERVER', '301Server', '192.168.1.194', '301server.local']:
    for dom in ['', 'LOEWEN301', 'WORKGROUP']:
        attrs = {'xdg:schema': 'org.gnome.keyring.NetworkPassword', 'protocol': 'smb', 'server': srv, 'user': 'Guest', 'domain': dom}
        coll.create_item('Beast (%s) as Guest' % srv, attrs, b'', replace=True)
        n += 1
print('stored %d keyring entries for the Beast as Guest' % n)
print('lookup check:', len(list(coll.search_items({'protocol': 'smb', 'server': '301server'}))), 'item(s) match protocol=smb server=301server')
PY
echo "--- the actual feature: open the Beast the way Files does, with no prompt"
gio mount -u smb://301server/Users/ >/dev/null 2>&1
if gio mount smb://301server/Users/ </dev/null 2>/tmp/gio.err; then
  echo "OPENED smb://301server/Users/ -> jeffl has: $(gio list smb://301server/Users/jeffl/ 2>/dev/null | tr '\n' ' ')"
else
  echo "gio mount FAILED: $(tr '\n' ' ' </tmp/gio.err)"
fi
echo "--- what the Network folder shows for the Beast:"
gio list smb://301server/ 2>/dev/null | sed 's/^/    /'
