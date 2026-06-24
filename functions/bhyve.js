// /bhyve — serves the B-Hyve custom component install script
// Jeff runs: wget https://toro1-5rz.pages.dev/bhyve -O /tmp/b.sh && sh /tmp/b.sh
export async function onRequestGet() {
  const BASE = 'https://raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/beehive/custom_components/bhyve';
  const script = `#!/bin/sh
DEST=/config/custom_components/bhyve
mkdir -p "$DEST"
for f in __init__.py manifest.json config_flow.py coordinator.py switch.py const.py; do
  wget -q -O "$DEST/$f" "${BASE}/$f" && echo "  OK $f" || echo "  FAILED $f"
done
echo ""
echo "Done! Settings > System > Restart"
echo "Then: Settings > Integrations > Add Integration > Orbit B-Hyve"
`;
  return new Response(script, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
