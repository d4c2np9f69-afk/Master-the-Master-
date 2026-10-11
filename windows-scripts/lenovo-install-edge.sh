#!/bin/bash
# Put Jeff's ACTUAL browser on the Lenovo. The Beast and Acer both run Edge signed
# in as jeff.loewen@comcast.net with 126 bookmarks already syncing between them.
# Edge has a native Linux build, so installing it here means one sign-in makes all
# THREE machines identical - same bookmarks, same passwords, same browser.
set -u
echo "=== add Microsoft's official Edge repo ==="
if [ ! -f /usr/share/keyrings/microsoft-edge.gpg ]; then
  curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-edge.gpg 2>/dev/null
fi
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-edge.gpg] https://packages.microsoft.com/repos/edge stable main" \
  | sudo tee /etc/apt/sources.list.d/microsoft-edge.list >/dev/null
sudo DEBIAN_FRONTEND=noninteractive apt-get update -q >/dev/null 2>&1

echo "=== install Edge ==="
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q microsoft-edge-stable >/dev/null 2>&1
if command -v microsoft-edge >/dev/null 2>&1; then
  echo "  installed: $(microsoft-edge --version 2>/dev/null)"
else
  echo "  FAILED to install Edge"; exit 1
fi

echo "=== desktop shortcut ==="
D=~/Desktop; mkdir -p "$D"
cat > "$D/Microsoft Edge.desktop" <<'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=Microsoft Edge
Exec=microsoft-edge-stable %U
Icon=microsoft-edge
Terminal=false
Categories=Network;WebBrowser;
EOF
chmod +x "$D/Microsoft Edge.desktop"
gio set "$D/Microsoft Edge.desktop" metadata::trusted true 2>/dev/null || true
echo "  shortcut placed"
echo ""
echo "DONE. Open Edge on the Lenovo, sign in as jeff.loewen@comcast.net once,"
echo "and its 126 bookmarks + passwords sync down automatically."
