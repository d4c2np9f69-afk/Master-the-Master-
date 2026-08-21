# Camera stack — what was fixed 2026-08-21, and how it was proven

**Jeff's standing complaint is that camera work gets declared done while half-finished.
So: every claim below has the evidence next to it, and the things that are NOT fixed are
listed at the bottom in the same detail.**

Session ran 12:05 PM → 2:00 PM Central, Friday 2026-08-21.

---

## The four fixes (all live, all verified)

### 1. Blank / stale pictures — ATTEMPTED, **REVERTED**, DO NOT RETRY THIS WAY

**Cause:** the scanners had no `always_save_latest_file`, which defaults to **false**. The
annotated red-box image is then only rewritten *when a target is found*. Any scan that found
nothing left the previous picture in place.

**Proof it was real:** at 12:19 PM on a bright sunny day, the backyard "latest annotated"
frame was a **night** shot of a deer labelled `sheep: 27.4%`, 640×360 / 26 KB — while the raw
input frame for the same camera was correctly current, sunny, 1280×720 / 169 KB.

**What was tried:** `always_save_latest_file: true` on all 6 scanners.

🔴 **IT WAS WRONG AND IT WAS REVERTED THE SAME SESSION. DO NOT RE-APPLY IT.**

**Why it is wrong:** with that option on, the annotated file is rewritten on **every** scan —
including scans that detect nothing, which write an image with **NO RED BOXES**. Jeff's
standing requirement (0e9a2e4, 2026-08-14) is the red-box frame. Proven live on
`301_front_doorbell`: a scan returning `targets found: 0 / all_objects: []` **overwrote** the
boxed file (md5 43348997a5 -> 5c7a2e1ea4).

**The DEFAULT (false) is correct for this house**, and here is the reasoning that was missed:
with it off, the annotated file is only ever written **when something was actually detected**,
so it always holds a real detection *with boxes*. A popup only fires on a detection — and at
that instant the file has just been written fresh. The "stale" window only exists when nothing
has triggered, which is exactly when nothing is popping up.

**Jeff caught this, not the tests.** He said: *"I know for a fact that it renders the ones with
the red boxes, it has in the past several times."* He was right.

⚠️ **The real, still-unsolved symptom:** Jeff reports the backyard deer frame has been on his
HomeKit tile **for over a week**. With `always_save_latest_file: false` that is *literally
correct behaviour* — it is the last thing the backyard AI actually detected. The HomeKit tile
is a "last detection" image, not a live view. Whether that is acceptable is Jeff's call. It is
also consistent with the known backyard PIR weakness in daylight.

### 2. Parked GLE generating endless "🚗 Vehicle detected" pushes — FIXED

**Cause, and it is not what it looks like:** the AI is **not** a motion detector. It never
compares frames. Blink's PIR fires on *anything* moving, the automation grabs a full still,
and CodeProject.AI labels **every object in that still**. Jeff's parked GLE is in frame, so
it is reported `car ~90%` on every single scan, without ever moving.

⚠️ **Masking the car inside the Blink app does NOT help** — a Blink privacy/activity zone only
affects Blink's own motion trigger. This pipeline pulls its own `camera.snapshot`, which comes
back **unmasked**. Proven: the 12:38 PM annotated frame boxes the car at 91.6% despite the mask.

**Measured position, 3 consecutive scans, rock steady:**

| detection | confidence | centroid | box_area |
|---|---|---|---|
| Jeff's parked GLE | 90.0% | 0.850, 0.667 | **0.049** |
| neighbour's car across the road | 51–63% | 0.185, 0.386 | **0.001** |

**Fix** — one line, the vehicle branch condition in `packages/hcc.yaml`. A vehicle push is
suppressed when **either**:

- `box_area < 0.005` → far-field street traffic (50× smaller than the GLE), **or**
- centroid is in the parking spot (`x ≥ 0.70`, `0.50 ≤ y ≤ 0.85`) **AND**
  `device_tracker.gle_350_device_tracker == 'home'`

**The GPS gate is the important half.** If the GLE is away and a vehicle appears in that spot,
**it still alerts** — that is a stranger parked in the driveway, which is exactly what Jeff
wants to know. `vehicle` remains an active target on the driveway; detection was never weakened,
only the *alerting* got smarter.

**This is the maintainer's own recommended approach**, not an invention — the integration docs
say *"Power users with advanced needs such as zoning detections… will need to use the
codeproject_ai.object_detected events"*, and document `centroid` / `box` for exactly this.

### 3. Apple TV announcing "somebody's at the door" on every motion — FIXED

**Cause:** the five `AI Doorbell <cam>` template binary sensors triggered on **any**
`codeproject_ai.object_detected` event for their camera, with no object-type filter. A car, a
cat or a bird rang the HomeKit doorbell, and tvOS dutifully announced a visitor.

**Fix:** `object_type: person` added to the event trigger's `event_data` on all 5 sensors in
`configuration.yaml`. The doorbell now only rings for an actual person.

**This is the documented filter pattern** — the integration's own example automation uses
`event_data: {name: person}` the same way.

**The previous session was RIGHT about one thing — do not re-litigate it:** Apple TV only
auto-pops camera feeds for **doorbell** accessories. A plain camera cannot pop up. The
`linked_doorbell_sensor` trick is genuinely required. What was wrong was letting that doorbell
ring for everything.

### 4. Verification no longer requires Jeff's phone — FIXED

`AI Object Detected Notify` had **no `id`**, so Home Assistant stored **no traces** for it,
so there was no way to tell whether a push actually went out. This session had to ask Jeff
"did your phone buzz?" — the exact run-around his rules forbid.

Added `id: hcc_ai_object_detected_notify`. Traces are now recorded.

⚠️ **Trap for the next session:** an automation's `last_triggered` updates when the automation
**runs**, which happens on *every* detection — **before** the `choose` decides whether to push.
`last_triggered` is therefore **useless** for "did a notification go out". Read the trace and
count actions whose `params.domain == "notify"`.

**Final proof, machine-read, no human in the loop:** driveway scan produced **3 car detections
→ 0 notify calls**, three runs in a row.

---

## Also changed

- `automation.ai_camera_scan_on_motion` turned **OFF**. It is the legacy
  `blink.save_video` → ffmpeg chain the 2026-08-19 snapshot work replaced, and it fails by
  design with no Blink subscription. `hcc_snapshot_frame_on_motion` covers motion→scan
  (traces confirm real `off → on` triggers). **Honest note: it was first disabled on a
  hypothesis that proved WRONG** — it was not causing the 30 s cadence. Turning it back on
  breaks nothing.
- Fire TV popup: 700 ms settle delay + `?v=` cache-buster on `image_url`.
- **New:** `automation.hcc_camera_ai_server_heartbeat_ai_down_alarm` — see below.

## Backups before any edit

`/config/configuration.yaml.bak-20260821-claude` · `/config/packages/hcc.yaml.bak-20260821-claude`

Full revert: `cp /config/configuration.yaml.bak-20260821-claude /config/configuration.yaml && ha core restart`

---

## The AI host is a single point of failure (new alarm added)

**CodeProject.AI runs as a Windows service on the BEAST** (301Server, 192.168.1.194:32168)
while HA runs on separate hardware. **Every beast crash or reboot takes the entire house's
camera AI dark, and nothing announced it.** A 38-hour detection gap on 08-20/21 was exactly
this — the crashes, the UPS install and the BIOS flash — not a broken automation.

**Diagnostic that proved it:** the motion automation ran at 16:26 UTC with **all steps
executed and no error**, yet the scanner stayed `unknown`. That run was 38 minutes *before*
the AI service started. *All-steps-green plus no result = the far end was absent.*

Added `HCC - Camera AI Server Heartbeat`: every 30 min, if there have been **no AI detections
in 6 h while motion is still being seen**, push + persistent notification. That distinguishes
"quiet house" from "AI is dead", which the existing Clip Pipeline Watchdog cannot — it only
checks after motion, waits 2 min, then rate-limits to one push per 6 h.

`Show-HCCNext.ps1` now also prints `CodeProject.AI: UP on this PC` on every run.

---

## Record corrections — bad notes that cost real time TODAY

1. **`beehive-config/hcc.yaml` is NOT a stale snapshot.** CLAUDE.md says it is. It is
   **byte-identical** to the live file (md5 verified on both, likewise `configuration.yaml`).
   **Read the repo copy — it is the real config**, and it is instant.
2. **Beehive HAS a working shell.** The record says "no SSH/Samba on Beehive — Studio Code
   Server only." The **Terminal add-on** in the HA sidebar is a full shell. TCP 22 is closed,
   which is what earlier sessions tested and mis-generalised.
3. **The logbook `?entity_id=` filter is NOT honoured on this instance.** A "filtered" request
   returned 12+ unrelated entities. A **6,465 alerts/day** figure was derived that way, told to
   Jeff, and is **WRONG — retracted.** Use `/api/history/period?filter_entity_id=` (which does
   work) or filter client-side.
4. **`AI Show Camera on Fire TV` carries `initial_state: false`** and stays off across
   restarts. The CLAUDE.md note calling it an unfixed time bomb is out of date.
5. **`blink_fast_motion_poll` is already disabled** (still in hcc.yaml at `seconds: "/10"`).
   Only `hcc_blink_motion_poll_30s` runs. Deleting the dead block is cosmetic, not urgent.

---

## NOT fixed / still unknown — do not claim otherwise

- **No trustworthy count of daily alert volume exists.** Two attempts were invalid
  (correction 3). Now that the notify automation has an `id`, count it from **traces**.
- **Phone notification image has no cache-buster** (the Fire TV popup does). This was
  deliberately **not** changed: the real staleness cause is fixed, and there is no evidence
  the phone ever showed a cached image. **If blank pictures recur on the phone, this is the
  first thing to try** — append `?v={{ now().timestamp() | int }}` to `snap_url` in hcc.yaml.
- **What turned the Fire TV off at ~12:40 PM.** Jeff's call: *"probably just a glitch on the
  TV."* Closed on his say-so, cause never established. An empty test POST to PiPup was the
  likeliest suspect and it was mine.
- **Backyard PIR** is still a physics limitation, not config. Unchanged.

---

## NEW DIAGNOSIS — the Apple TV popup is slow AND box-less, root cause found

**This had never been diagnosed. Prior sessions assumed the popup worked and blamed Blink.**

HA log, timestamped to the second of a live test at 13:52:

```
13:52:33  ERROR  homekit.type_cameras   Camera has no stream source
13:52:33  ERROR  pyhap.camera           Failed to start/reconfigure stream, deleting session
13:53:03  ERROR  pyhap.camera           Requested to stop stream ... no such session found
```

**13:52:33 -> 13:53:03 is exactly the 30 seconds Jeff sees.**

Apple TV answers a doorbell ring by requesting a **live video stream**. `camera.ai_driveway`
is a `local_file` camera — a still image — so it has **no stream source**. The stream fails
immediately, tvOS waits out a 30 s timeout, then falls back to a still.

**Measured, so the delay is definitively NOT ours:** HA serves that camera's snapshot in
**0.03 s** (three runs), and the doorbell binary_sensor flips within **2 s** of the event.

**Why the community fixes do not apply here:** every documented fix for
"Camera has no stream source" assumes the camera *has* a real stream — ffmpeg source, RTSP,
ONVIF. Blink provides none, and **Blink RTSP is on Jeff's never-re-propose list.**

**Candidate fix, NOT built, needs Jeff's go-ahead:** use **go2rtc** (already ships with HA) to
loop the annotated JPEG into a genuine video stream, and point the HomeKit camera at that.
tvOS would then get what it asks for: instant popup, and because the stream source *is* the
annotated frame, the red boxes would be visible in it.

⚠️ Also flagged by the log — HA recommends bridged cameras be paired in **accessory mode**
(a separate HomeKit instance per camera) "for best performance and to prevent unexpected
unavailability". Worth doing at the same time.

## Fire TV vs Apple TV are NOT in sync (Jeff asked directly)

Same trigger event, two independent paths:

| | Apple TV | Fire TV |
|---|---|---|
| path | doorbell sensor -> HomeKit | `hcc_ai_camera_popup_on_fire_tv` -> PiPup |
| fires on | **person only** (2026-08-21 fix) | **any** person/vehicle/animal |
| speed | ~30 s (stream bug above) | ~1 s |

They will still differ on *what* they pop for even after the stream bug is fixed, unless
deliberately aligned. Jeff has not asked for them to be aligned yet.

## Alexa announces a vacuum automation on every HA restart (Jeff, 2026-08-21)

Verified: **no HA automation fires on restart** that would announce anything. The cause is
almost certainly the Alexa Smart Home skill **re-syncing exposed entities** on HA start and
announcing rediscovered devices — `scene.turn_on_sharky` is a prime suspect.
**Not fixed. Next step: stop exposing that scene to Alexa** (no restart needed).

---

# ✅ SOLVED — the Apple TV popup, 2026-08-21 3:25 PM

**Jeff, on seeing it work:** *"That worked freaking perfect. It's the best one ever and it
was fast as soon as I got the warning it popped up on the TV."* — and, on a second camera
while watching the Braves game: *"Perfect and fast."* Photo confirms a picture-in-picture
popup with the **LIVE** badge over live TV.

## 🔴 DO NOT UNDO THIS. READ BEFORE TOUCHING THE CAMERA STACK.

**The HomeKit cameras MUST stay pointed at the `*_live` entities:**

```
camera.ai_driveway_live        camera.ai_front_right_live
camera.ai_backyard_live        camera.ai_back_left_live
camera.ai_front_doorbell_live  camera.ai_garage_live
```

**Pointing HomeKit back at `camera.ai_<name>` (the local_file stills) IS THE BUG.** Those
cannot stream. Doing that reintroduces the 30-second spinning circle and the box-less
picture. This took a long session to find; do not "tidy" it away.

**Health check, one command, run it before AND after any camera work:**
`.\windows-scripts\Verify-CameraStreams.ps1`

## The architecture now

```
Blink PIR motion
  -> hcc_snapshot_frame_on_motion  (camera.snapshot -> raw frame)
  -> image_processing.scan         (CodeProject.AI on the BEAST :32168)
  -> annotated red-box JPEG        /config/www/ai_snapshots/..._latest.jpg
       |                                   |
       |                                   +--> go2rtc on the BEAST :8554
       |                                        (ffmpeg loops the JPEG -> H264 RTSP)
       |                                                 |
       +--> AI Doorbell binary_sensor (person only)      +--> camera.ai_*_live (generic)
                       |                                              |
                       +----------> HomeKit bridge <------------------+
                                          |
                                    Apple TV popup  ->  INSTANT, LIVE, with red boxes
```

## Why it was broken, definitively

`homekit.type_cameras: "Camera has no stream source"` at 13:52:33, `pyhap` giving up at
13:53:03 — **exactly the 30 seconds Jeff saw**. tvOS demands live video from a doorbell
accessory; a `local_file` still cannot provide it, so tvOS timed out and fell back to a
still with no annotation. HA itself served that still in **0.03 s**, so the delay was never
ours. Jeff described it independently: *"it sits there and has a circle spinning waiting for
a video file."*

## What was installed, and where — all $0, all reversible

**go2rtc + ffmpeg were ALREADY on this PC** at `C:\Users\jeffl\HCC-Scripts\go2rtc\`
(ffmpeg since 08-12, set up 08-15 for the Kiyo webcam "front_yard" feed) **with firewall
rules already open for 1984/8554/8555.** That existing install is what we use.

⚠️ **SEARCH THE MACHINE BEFORE DOWNLOADING ANYTHING.** This session downloaded a redundant
162 MB ffmpeg into `C:\HCC-Stream\` before finding the copy that was already there. Windows
also auto-created **Block** firewall rules for that stray path (Block beats Allow), which
looked like a mystery network failure. `C:\HCC-Stream\` is scratch and can be deleted.

- `go2rtc.yaml` holds all 6 AI streams **plus the pre-existing `front_yard` Kiyo stream —
  do not remove that one.** Backup: `go2rtc.yaml.bak-20260821-preclaude`.
- Startup task **`HCC go2rtc camera streams`** — runs as SYSTEM at boot, auto-restarts every
  minute if it dies. **Verified by killing go2rtc and starting it via the task: it came back
  and the stream served a 211 KB frame.** Without this, a reboot silently kills every popup.
- HA side: 6 **Generic Camera** config entries (UI flow — the `generic` camera YAML platform
  has been REMOVED from HA; a YAML `camera:` block passes `ha core check` and silently
  creates nothing).

## Gotchas paid for the hard way

- **`-pix_fmt yuv420p` is mandatory** — HomeKit renders black without it.
- **`-stream_loop -1 -f image2`** keeps frames flowing even though the JPEG only changes on a
  real detection. Without it ffmpeg emits one frame and exits ("Stream ended; no additional
  packets").
- go2rtc's shorthand `ffmpeg:<url>#input=...` returned **"streams: unknown error"** on
  v1.9.14 here. The **`exec:`** form works.
- The 5 bulk-created Generic Cameras all arrived named `192_168_1_66`. They were mapped to
  the right cameras **by md5-matching each entity's served image against the known
  per-camera annotated file** — not by assuming creation order — then renamed.

## Still open

- **Fire TV** — its PiPup popup already fires in ~1 s with the annotated still. It is a
  separate path from Apple TV and was NOT changed. Whether it should also carry live video
  is Jeff's call.
- **Backyard stream is a low-res 19 KB night frame** (the others are 150-240 KB) because
  that is still the last real backyard detection. It self-corrects on the next one.

## ⚡ The last 5 seconds — keyframe interval (Jeff: *"That was instant"*)

First working version popped in **~7 seconds**. Our side was only 1.0 s of that; the rest was
Apple TV waiting to render.

**Cause: `-g 15` at `-framerate 5` = one keyframe every 3 SECONDS.** A decoder cannot render
anything until it receives a keyframe, so tvOS sat idle waiting for one. The picture is a
static image, so keyframes cost almost nothing here.

**Fix: `-framerate 10 -g 10` = one keyframe EVERY SECOND.** Measured backyard cold-start
first-frame latency afterwards: **2.6 s including ffmpeg spin-up** (was up to 3 s of pure
keyframe wait on top of that).

Result, Jeff's words: **"That was instant."**

⚠️ **Do not raise `-g` back up to "save bandwidth".** These are static images; the bitrate
saving is negligible and the cost is seconds of visible delay on every popup.

The working config is mirrored in this repo at **`windows-config/go2rtc.yaml`** — the live
file is `C:\Users\jeffl\HCC-Scripts\go2rtc\go2rtc.yaml`. If the live one is ever lost or
clobbered, copy the repo version back and run
`Start-ScheduledTask -TaskName "HCC go2rtc camera streams"`.

**Timing ladder, measured today:**

| stage | before | after |
|---|---|---|
| Apple TV popup | ~30 s, still image, NO red boxes | **instant, LIVE video, red boxes** |
| HA event -> HomeKit doorbell | n/a | 0.6-2.0 s |
| RTSP cold first frame | n/a (no stream existed) | 2.6 s |
