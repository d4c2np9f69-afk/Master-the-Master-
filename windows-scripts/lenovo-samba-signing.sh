#!/bin/bash
# The Beast (Win11 24H2) REQUIRES SMB signing and won't do guest to an unsigned
# server. Make the Lenovo's Samba sign, so the Beast accepts the connection - a
# Linux-side change (allowed), instead of weakening the Beast (blocked).
set -u
CONF=/etc/samba/smb.conf
echo "=== add server signing to [global] ==="
# remove any existing signing lines, then set mandatory
sudo sed -i '/^\s*server signing/d;/^\s*client signing/d' "$CONF"
sudo sed -i '/^\[global\]/a \   server signing = mandatory\n   client signing = mandatory' "$CONF"
grep -nE 'server signing|client signing|map to guest|workgroup' "$CONF" | sed 's/^/  /'
echo
echo "=== validate + restart ==="
testparm -s >/dev/null 2>&1 && echo "  config valid" || echo "  CONFIG ERROR"
sudo systemctl restart smbd
echo "  smbd: $(systemctl is-active smbd)"
echo "  port 445: $(sudo ss -tlnp 2>/dev/null | grep -c ':445') listener(s)"
