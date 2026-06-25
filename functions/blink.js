// Serves the Blink 2FA fix install script at /blink
// Usage from HA Terminal: curl -fsSL https://toro1-5rz.pages.dev/blink | bash

const SCRIPT = `#!/usr/bin/env bash
set -eu
HCC_BASE="https://toro1-5rz.pages.dev"
GH_BASE="https://raw.githubusercontent.com/home-assistant/core"
R='\\033[0;31m' G='\\033[0;32m' C='\\033[0;36m' Y='\\033[1;33m' N='\\033[0m'
OK="\${G}✓\${N}" ERR="\${R}✗\${N}" INFO="\${C}→\${N}"
ok()   { echo -e "  \${OK}  $1"; }
info() { echo -e "  \${INFO}  $1"; }
die()  { echo -e "  \${ERR}  $1"; exit 1; }

echo ""
echo -e "\${C}╔══════════════════════════════════════════════╗\${N}"
echo -e "\${C}║     HCC — BLINK 2FA FIX INSTALLER           ║\${N}"
echo -e "\${C}╚══════════════════════════════════════════════╝\${N}"
echo ""

[[ -d /config ]] || die "Must run inside the Beehive HA Terminal add-on"

DST="/config/custom_components/blink"
mkdir -p "\$DST"

info "Reading HA version..."
HA_VER=\$(cat /config/.HA_VERSION 2>/dev/null | tr -d '[:space:]')
[[ -n "\$HA_VER" ]] || die "Cannot read HA version — is /config/.HA_VERSION missing?"
ok "HA version: \$HA_VER"

info "Downloading Blink integration from GitHub (v\$HA_VER)..."
BASE="\${GH_BASE}/\${HA_VER}/homeassistant/components/blink"
FILES="__init__.py camera.py const.py coordinator.py manifest.json sensor.py strings.json binary_sensor.py diagnostics.py alarm_control_panel.py"
COUNT=0
for f in \$FILES; do
  if curl -fsSL "\${BASE}/\${f}" -o "\${DST}/\${f}" 2>/dev/null; then
    COUNT=\$((COUNT+1))
  fi
done
[[ \$COUNT -ge 4 ]] || die "Only downloaded \$COUNT files — check internet or HA version tag on GitHub"
ok "Downloaded \$COUNT integration files"

info "Installing 2FA patch..."
curl -fsSL "\${HCC_BASE}/beehive/blink/config_flow.py" -o "\${DST}/config_flow.py" \\
  || die "Failed to download patched config_flow.py"
ok "2FA patch applied"

info "Updating manifest (adding required version field)..."
if grep -q '"version"' "\${DST}/manifest.json"; then
  sed -i 's/"version": "[^"]*"/"version": "2026.6.4-hcc-2fa-fix"/' "\${DST}/manifest.json"
else
  awk 'NR==1{print; print "  \\"version\\": \\"2026.6.4-hcc-2fa-fix\\","} NR>1' "\${DST}/manifest.json" > /tmp/blink_manifest.json && mv /tmp/blink_manifest.json "\${DST}/manifest.json"
fi
grep '"version"' "\${DST}/manifest.json" | head -1 || die "Version field still missing after update"
ok "Manifest updated"

info "Restarting Home Assistant..."
ha core restart 2>/dev/null && ok "Restart triggered — wait ~60 seconds" || true

echo ""
echo -e "\${C}╔══════════════════════════════════════════════╗\${N}"
echo -e "\${C}║         BLINK 2FA FIX INSTALLED!             ║\${N}"
echo -e "\${C}╚══════════════════════════════════════════════╝\${N}"
echo ""
echo -e "  \${Y}AFTER HA RESTARTS:\${N}"
echo -e "  1. Settings → Integrations → Blink → ⋮ → Delete"
echo -e "  2. + Add Integration → Blink"
echo -e "  3. Enter your Blink email + password"
echo -e "  4. Code arrives by text — enter it immediately"
echo -e "  5. Cameras appear!"
echo ""
`;

export async function onRequest() {
  return new Response(SCRIPT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
