#!/bin/bash
# Runs ON the Lenovo (Ubuntu). After Jeff ran Allow-AnonymousBrowse on the Beast (2026-09-22 7:12 PM), the
# Lenovo still failed with "Invalid argument": lenovo-samba-signing.sh had set  client signing = mandatory,
# and an ANONYMOUS session has no key to sign with. The Beast does not require client signing (measured:
# RequireSecuritySignature=False), so the Lenovo's CLIENT side goes back to default; the SERVER side keeps
# signing required (that is what the Beast -> Lenovo direction uses and it works).
set -u
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u)/bus
export XDG_RUNTIME_DIR=/run/user/$(id -u)
CONF=/etc/samba/smb.conf
sudo sed -i '/^\s*client signing/d;/^\s*client ipc signing/d;/^\s*client min protocol/d' "$CONF"
sudo sed -i '/^\[global\]/a \   client signing = default\n   client ipc signing = auto\n   client min protocol = SMB2' "$CONF"
testparm -s 2>/dev/null | grep -E 'client signing|client ipc signing|server signing|client min protocol' | sed 's/^/  /'
echo "--- anonymous share list from the Beast (what Network -> 301SERVER shows):"
smbclient -L //192.168.1.194 -N -m SMB3 2>&1 | grep -E 'Disk|NT_STATUS' | sed 's/^/  /'
echo "--- Files path, anonymous, no prompt:"
gio mount -u smb://301server/Users/ >/dev/null 2>&1
if gio mount -a smb://301server/Users/ </dev/null 2>/tmp/gio.err; then
  echo "  OPENED smb://301server/Users/ -> jeffl: $(gio list smb://301server/Users/jeffl/ 2>/dev/null | tr '\n' ' ')"
else
  echo "  FAILED: $(tr '\n' ' ' </tmp/gio.err)"
fi
echo "--- Network -> 301SERVER share list via Files:"
gio mount -a smb://301server/ </dev/null >/dev/null 2>&1
gio list smb://301server/ 2>&1 | sed 's/^/  /' | head -8
