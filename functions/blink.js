// Serves the Blink 2FA fix install script at /blink
// Usage from HA Terminal: curl -fsSL https://toro1-5rz.pages.dev/blink | bash

const SCRIPT = `#!/usr/bin/env bash
set -eu
HCC_BASE="https://toro1-5rz.pages.dev"
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

info "Locating built-in Blink component..."
SRC=\$(python3 -c "import homeassistant.components.blink as m, os; print(os.path.dirname(m.__file__))" 2>/dev/null || true)
if [[ -z "\$SRC" ]]; then
  SRC=\$(find / -path "*/homeassistant/components/blink" -type d 2>/dev/null | head -1 || true)
fi
[[ -n "\$SRC" && -d "\$SRC" ]] || die "Cannot find built-in Blink component — try: find / -path '*/components/blink' -type d"
ok "Found at \$SRC"

info "Copying built-in Blink component to custom_components..."
mkdir -p /config/custom_components
rm -rf "\$DST"
cp -R "\$SRC" "\$DST"
ok "Copied to \$DST"

info "Downloading patched config_flow.py..."
curl -fsSL "\${HCC_BASE}/beehive/blink/config_flow.py" -o "\${DST}/config_flow.py" \\
  || die "Download failed — check internet connection and try again"
ok "Patched config_flow.py installed"

info "Updating manifest version..."
python3 - <<'PY'
import json
p='/config/custom_components/blink/manifest.json'
with open(p) as f: data=json.load(f)
data['version']='2026.6.4-hcc-2fa-fix'
data['name']='Blink (2FA Fix)'
with open(p,'w') as f: json.dump(data,f,indent=2)
print("  manifest updated")
PY
ok "Manifest updated"

info "Restarting Home Assistant..."
ha core restart 2>/dev/null && ok "Restart triggered — wait ~60 seconds" || true

echo ""
echo -e "\${C}╔══════════════════════════════════════════════╗\${N}"
echo -e "\${C}║         BLINK 2FA FIX INSTALLED              ║\${N}"
echo -e "\${C}╚══════════════════════════════════════════════╝\${N}"
echo ""
echo -e "  \${Y}NEXT STEPS (after HA restarts):\${N}"
echo -e "  1. Settings → Integrations → find Blink card"
echo -e "  2. Tap the ⋮ three dots → Delete"
echo -e "  3. Tap + Add Integration → search Blink"
echo -e "  4. Enter your Blink email + password"
echo -e "  5. A 6-digit code will arrive by text"
echo -e "  6. Enter the code in the HA dialog immediately"
echo -e "  7. Cameras will appear!"
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
