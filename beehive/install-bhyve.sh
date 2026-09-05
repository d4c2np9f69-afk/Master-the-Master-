#!/bin/sh
# One-command installer for the B-Hyve custom HA integration
# Run this from the HA Terminal add-on

DEST=/config/custom_components/bhyve
BASE="https://raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/beehive/custom_components/bhyve"

echo "Creating $DEST ..."
mkdir -p "$DEST"

for f in __init__.py manifest.json config_flow.py coordinator.py switch.py const.py strings.json; do
  echo "  Downloading $f ..."
  wget -q "$BASE/$f" -O "$DEST/$f"
done

echo ""
echo "Done! Now restart Home Assistant:"
echo "  Settings → System → Restart"
echo ""
echo "Then: Settings → Integrations → Add Integration → search 'Orbit B-Hyve'"
