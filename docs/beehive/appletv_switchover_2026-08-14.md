# Apple TV switchover — research + test plan (2026-08-14)

## Why
Fire TV Stick is slow, needs constant cache clearing / app offloading, and freezes.
Jeff wants his Apple TV 4K back as the living-room box. **Only 3 HDMI ports** (ARC/soundbar,
the beast, Fire TV) so it is a straight SWAP — cannot run both.

## What Jeff actually needs (clarified)
NOT live video. A **single still image** of whatever triggered the motion is fine — exactly what
PiPup shows today from the extracted clip frame.

## Research findings

### Jailbreak — DEAD, do not pursue
HA reports the device as **Apple TV 4K (gen 3), tvOS 18.6** = A15 chip. Every Apple TV jailbreak
(checkra1n, palera1n) depends on the `checkm8` bootrom exploit, which only reaches **Apple TV HD
and Apple TV 4K gen 1**. Apple fixed it in silicon years before gen 3. And no PiPup-equivalent
overlay app exists for tvOS anyway — a jailbreak would give a shell, not the feature.

### Blink RTSP bridges — NOT WORTH IT
`roger-/blinkbridge` and `femmeXFMR/blink-rtsp-mqtt-bridge` both fake a stream by **looping a
still frame** from an already-recorded clip. blinkbridge documents **~30 s added latency**; the
other refreshes on a 5-minute cycle. That is ON TOP of Blink's existing cloud delay, so popups
would get SLOWER. Both are hobby projects (16 commits/11 open issues; 4 stars/10 commits), both
want the Blink password in a config file, one warns of server bans from polling.

### HomeKit snapshot route — PLAUSIBLE, being tested
HomeKit cameras have **separate** snapshot and streaming capabilities; community reports are
consistent that snapshots/thumbnails work even when streaming fails. Since Jeff only needs a
still, this may be enough. The perfect source already exists: `camera.<cam>_clipframe`
(local_file cameras built 08-03) hold **the exact AI-extracted frame that triggered detection**.

**UNPROVEN:** whether tvOS renders its picture-in-picture popup for a snapshot-only camera, or
insists on a stream. Nobody online answers this specifically. Must be tested.

## What is already set up (done 08-14 by this session)
- **HomeKit Bridge integration created** — entry `01M009BBVWASB0YGP61S7Z4XXF`, title `HASS Bridge:21064`
- **Scoped deliberately narrow**: include mode, domain `camera`, entities = ONLY
  `camera.301_driveway_clipframe`. (Avoids an Alexa-style flood into the Home app.)
- Stale pairing notifications dismissed; one left.

## TEST — costs nothing, uses the BEDROOM Apple TV, no HDMI change needed
The Apple TV is currently in the master bedroom ("Main Bedroom (2)"), so all of this can be
proven before touching the living room.

1. iPhone → **Home app** → **+** → *Add Accessory* → *More options* / enter code manually
2. Pairing code: **937-37-048**  (accessory `301_driveway_clipframe:21069`)
3. Confirm it appears as a camera in the Home app, and shows the AI frame as its thumbnail
4. Check the **Apple TV → Home tab** — does the camera appear there?
5. Then trigger motion (walk the driveway) and watch the bedroom Apple TV for a popup

### If step 5 gives no popup
Motion notifications need `linked_motion_sensor`, which is **YAML-only** — the UI flow does not
expose it. Add to `configuration.yaml` on Beehive:

```yaml
homekit:
  - filter:
      include_entities:
        - camera.301_driveway_clipframe
    entity_config:
      camera.301_driveway_clipframe:
        linked_motion_sensor: binary_sensor.301_driveway_motion
```

**Timing caveat worth knowing:** Blink motion fires ~8 s BEFORE the frame is extracted, so
linking the raw Blink motion sensor would pop the PREVIOUS frame. The correct fix is a helper
that the existing AI automation pulses *after* extraction, then link that. Do this only if the
basic popup proves out — no point refining something that does not work at all.

## Rollback
Delete the HomeKit config entry in HA and remove the accessory from the Home app. Nothing else
is touched; the Fire TV setup is completely unaffected and keeps working throughout.
