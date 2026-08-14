# ✅ SOLVED — Apple TV camera popups working (2026-08-14)

Blink motion -> Home Assistant -> HomeKit -> **popup on the Apple TV screen**. Confirmed working.

## THE KEY INSIGHT
**`linked_motion_sensor` alone is NOT enough.** Motion earns a phone notification but does NOT
interrupt the TV. HomeKit reserves the picture-in-picture screen takeover for **DOORBELL** events
("someone is at your door" is worth pausing a show for; motion is not).

**Fix: point `linked_doorbell_sensor` at the SAME motion sensor.** Motion then "rings the
doorbell" and tvOS renders the popup.

## Working config (`/config/configuration.yaml`)
```yaml
homekit:
  - name: HCC Cameras
    port: 21081
    filter:
      include_entities:
        - camera.301_driveway_clipframe
    entity_config:
      camera.301_driveway_clipframe:
        name: Driveway
        linked_motion_sensor: binary_sensor.301_driveway_motion
        linked_doorbell_sensor: binary_sensor.301_driveway_motion   # <-- THE ONE THAT MATTERS
```
Requires a **full HA restart** (`ha core restart`) — YAML homekit does not hot-reload.

## How to tell it worked before testing
In the Home app the accessory shows **TWO services**: a doorbell icon AND a motion icon.
With motion only, there is one. Apple also starts offering a **"Single Press"** automation,
which only exists for doorbells.

## Other requirements (all verified, all necessary)
- Apple TV must be a **Home Hub** (Settings -> AirPlay and HomeKit)
- Per-camera **Activity Notifications** on; conditions Time=Any, People=Off
- Apple TV Settings -> Cameras & Doorbells -> **Show on this Apple TV = On**
- Apple TV should be **playing** something — a popup overlays content

## Traps hit along the way (do not repeat)
1. Creating the bridge in the **UI** made 13 separate config entries (one per camera). Deleting
   the "bridge" left 12 orphans still advertising -> Home app offered a dozen pairing codes.
   Delete every `homekit` config entry, not just the bridge.
2. `ha core reload` does NOT reload automations in packages, and does NOT load YAML homekit.
   Use `automation.reload` / `ha core restart`.
3. Each rebuild generates a NEW pairing code — old codes look "wasted".
4. Cameras with no linked motion sensor show **no "Activity Notifications" option at all** —
   that absence is the diagnostic.

## Still to do
- Add the other 5 cameras (same doorbell trick each).
- Point the HomeKit camera at the **annotated** image (red box + confidence) instead of the raw
  clipframe: `/config/www/ai_snapshots/codeproject_ai_object_<cam>_clipframe_latest.jpg` — fixed
  filename, overwritten per detection, so a local_file camera can serve it directly.
- Decide notification split: keep HA's phone alerts (AI-filtered, cooldown, annotated image),
  let HomeKit handle ONLY the TV popup, or the double-alert problem returns.
