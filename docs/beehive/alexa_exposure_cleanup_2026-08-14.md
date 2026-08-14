# Alexa exposure cleanup — findings 2026-08-14

Jeff spotted duplicate devices in Alexa. Audit of what Home Assistant exposes to Alexa
(`homeassistant/expose_entity/list` over WS — that command WORKS; the matching
`expose_entity/expose` WRITE command does NOT exist on HA 2026.8.1, and neither does
`cloud/alexa/entities/update`. Cleanup must be done in the UI:
**Settings → Voice assistants → Expose**, ⊗ button at the right of each row).

**67 entities are exposed to Alexa.** Two problems:

## 1. NINE HOME ASSISTANT ADD-ONS ARE VOICE-CONTROLLABLE — fix this first
```
switch.z_wave_js            switch.studio_code_server    switch.silicon_labs_flasher
switch.plex_media_server    switch.spotify_connect       switch.traccar
switch.vlc                  switch.cec_scanner           switch.blink_liveview_proxy
```
These are Supervisor add-ons, not home devices. "Alexa, turn off Z-Wave JS" would take down
the Zigbee/Z-Wave stack; Studio Code Server is how Beehive gets edited. Alexa fuzzy-matches
names, so a misheard command can plausibly hit one. **Un-expose all nine.**

## 2. DUPLICATES — every Tuya device appears twice in Alexa
HA exposes it AND Smart Life's own Alexa skill exposes it. HA's copies carry a "Socket 1"
suffix; Smart Life's have the clean names.

| HA's copy (remove from Alexa) | Smart Life's copy (keep) |
|---|---|
| Garage fan Socket 1 | Garage fan |
| Hot Water Circulation Pump Socket 1 | Hot Water Circulation Pump |
| Jeff's Bed lamp Socket 1 | Bed lamp. |
| Angela's Bed Lamp plug | Angela's Bed Lamp |
| Sharky Shark | Sharky |

**Remove HA's copies, not Smart Life's** — Smart Life's names are the ones you'd say out loud,
and **un-exposing from Alexa does NOT affect Home Assistant**: those devices keep working in HA,
in automations, and in the HCC app. Only the Alexa duplicate disappears.

## 3. Also junk, lower priority
`switch.all_devices_shuffle` / `_repeat` / `_do_not_disturb` and `media_player.all_devices` /
`this_device` — HA reading the Echos and handing those controls back to Alexa. Circular.
`media_player.dellmasterbed` (the B570 as a DLNA player) and `person.mqtt` also look like junk
but were NOT confirmed as unwanted — ask before removing.

## Note on the Sylvania plugs
They are NOT in HA (vendor-locked, settled 08-13) but ARE in Alexa via Sylvania's own skill,
grouped as "Living Room Lights" (a favourite). One showed **Unresponsive** on 08-14 — that was
the plug reset during the failed Smart Life experiment; Jeff re-paired it in the Sylvania app.
Alexa may hold the stale entry for a while.
