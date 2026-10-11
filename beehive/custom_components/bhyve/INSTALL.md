# Install Orbit B-Hyve in Home Assistant

This custom integration runs on YOUR Home Assistant (Beehive) so it calls
the B-Hyve API from your home IP — not from Cloudflare.

## Step 1 — Copy the files to HA

In Beehive, open the **File Editor** add-on (or SSH terminal).

Copy the entire `bhyve` folder to your HA config directory:

```
/config/custom_components/bhyve/
```

It should look like this when done:
```
/config/custom_components/bhyve/__init__.py
/config/custom_components/bhyve/manifest.json
/config/custom_components/bhyve/config_flow.py
/config/custom_components/bhyve/coordinator.py
/config/custom_components/bhyve/switch.py
/config/custom_components/bhyve/const.py
```

## Step 2 — Restart Home Assistant

Settings → System → Restart

## Step 3 — Add the Integration

1. Settings → Integrations → Add Integration
2. Search **"Orbit B-Hyve"** (or just "B-Hyve")
3. Enter your B-Hyve email and password
4. Click Submit

Your irrigation zones appear as switch entities:
- `switch.bhyve_zone_1` (or your zone name)
- `switch.bhyve_zone_2`
- etc.

## Step 4 — Open the HCC app

The irrigation section automatically picks up the new zones.
No further setup needed in the app.
