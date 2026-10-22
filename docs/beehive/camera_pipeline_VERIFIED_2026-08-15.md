# Camera Pipeline — VERIFIED WORKING 2026-08-15

**This is the permanent record.** Every claim below is backed by a timestamp from HA's own history
API or a photograph of the physical Apple TV screen, captured by a camera pointed at it while the
events happened. Nothing here is a component check or an assumption. **If a future session doubts
whether this was ever set up and proven: it was, on this date, as follows.**

Evidence photographs (Jeff appears in them — kept OUT of this public repo, stored at
`iCloudDrive/HCC-Photos/camera-verification-2026-08-15/`):
- `popup1_doorbell_15-57-58_motion+4.8s.jpg` — popup on the Apple TV, 4.8 s after motion
- `popup2_driveway_15-58-18_motion+6s.jpg` — driveway popup, 6 s after motion
- `popup3_doorbell_15-58-47_motion+4.7s.jpg` — second doorbell popup, different image (updated)
- `annotated_person_94.7pct_doorbell.jpg` — the AI output: red box, "person: 94.7%"
- `annotated_cars_93+71pct_driveway.jpg` — red boxes, "car: 93.0%" and "car: 71.2%"

## Measured performance (real events, not synthetic)

| Stage | Measured | Events |
|---|---|---|
| Motion → AI detection (red-box file written) | **8 seconds** | 5+ separate events, 4 cameras |
| Motion → popup visible on the Apple TV screen | **4.7–6 s** | 3 events photographed |
| Detection → phone push + Fire TV popup + cooldown + archive | **≤1 second** | every event |
| Blink cloud round-trip (`trigger_camera`, for contrast) | 67 s | measured once |

## Per-camera status

| Camera | Detection chain | Apple TV popup | Annotated image in HomeKit | Notes |
|---|---|---|---|---|
| 301 Front Doorbell | ✅ live-verified (94.7% person) | ✅ photographed ×2 | ✅ | |
| 301 Driveway | ✅ live-verified (2 cars) | ✅ photographed | ✅ | |
| Front Right | ✅ live-verified (walk 2, 16:37) | mechanism proven, not photographed | ✅ (swapped after its first annotated file existed, 15:59) | |
| Back Left | ✅ live-verified (walk 2: motion 16:37:50 → AI 16:37:58) | mechanism proven, not photographed (rig camera was unplugged) | ✅ | |
| **301 Backyard** | ⚠️ chain configured identically, **PIR never fired on either walk** | untested for the same reason | ✅ | **The one exception.** Not a config fault — the sensor did not see Jeff's path twice. Fix = aim/sensitivity in the Blink app. Weakest WiFi too (−65 dBm). |
| Garage | motion OFF by Jeff's choice | n/a | view-only by design | camera reports no temp/wifi — may be unplugged |

## What was fixed to get here (all on 2026-08-15)

1. **Feedback loop** (self-inflicted that morning): the HomeKit image swap also repointed the
   `image_processing` sources, so the AI scanned its own annotated output and detection went dead
   while every health check read green. Fixed: scanners on `camera.*_clipframe` (clean input),
   HomeKit on `camera.ai_*` (annotated output). This split is load-bearing — never point the
   scanners at `ai_*`.
2. **Mute/cooldown system had NEVER worked.** Two independent bugs: `camera_key` carried a
   `_clipframe` suffix so every mute wrote to a nonexistent helper, and a string-truthiness bug
   made the duration logic meaningless. Fixed in both `packages/hcc.yaml` (notify side) and the
   cooldown automation. **First successful mute writes in the system's history: 16:30 (manual
   test, 5 min) and 16:37–38 (walk: back_left 30 min because someone home + back camera;
   front cameras 5 min) — the differentiated behavior working exactly as designed.**
3. **Clip archive** — `blink.save_video` had overwritten one fixed file per camera forever.
   Now every detection copies its clip to `/config/www/blink_archive/<cam>_<timestamp>.mp4`
   (+ manifest.txt), pruned to 7 days on Beehive at 03:30, mirrored nightly at 04:00 to
   `D:\HCC-Clip-Archive` on the beast (`Pull-ClipArchive.ps1`, scheduled task). First six clips —
   Jeff's verification walk — archived and mirrored the same minute.
4. **Watchdogs now standing guard:** pipeline-stall watchdog (motion with no scan in 2 min →
   names the sync-module/USB cause), overnight water check (1 AM baseline → 5 AM alert over
   3.5 gal, thresholds from the flush=1.2 gal / ice=0.1 gal signature work), spring valve reminder.

## Verification method (the standard from now on)

A Razer Kiyo Pro on the beast, aimed at the Apple TV, capturing a frame every ~0.9 s with
millisecond filenames, cross-referenced against HA's motion/AI history timestamps. **Component
checks (bridge loaded, config valid, camera serves an image) said "healthy" through every one of
the day's real failures. Only watching the far end of the pipeline caught them.** This rig is the
project's regression test; Jeff's rule.

## Known open items (so this document never overclaims)

- Backyard PIR aim/sensitivity + driveway road-mask + Blink app notifications OFF — Jeff's phone.
- Back-left/backyard popup photos — optional completeness, needs the Kiyo replugged.
- ~~Popup image lag~~ **DECIDED AND SHIPPED same evening: Option B.** Popups now ride
  trigger-based template sensors (binary_sensor.ai_doorbell_*) fired by the AI detection event, so
  the annotated image exists BEFORE the ring and false motion never pops the TV. Verified live:
  sensor rang instantly on a manual scan, auto_off 8 s clean. ('What good is an old picture?' — Jeff)
- Apple Home alarm tile: `pyhap` logs `SecuritySystemState value=0 invalid` — glance at the tile;
  unexpose the alarm from the HCC Home bridge if it misbehaves.
