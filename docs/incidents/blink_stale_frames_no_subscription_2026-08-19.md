# The camera popups and AI were reading days-old pictures — 2026-08-19

**Found by reading Jeff's uploaded HA log.** Not by the API, which showed everything healthy.

## The symptom nobody could see

Clips were updating; the still frames were not.

| camera | clip updated | frame updated | stale by |
|---|---|---|---|
| 301_backyard | 11:28:44 | 11:28:46 | ok |
| **301_driveway** | 15:51:49 | 11:42:35 | **4 h** |
| **301_front_doorbell** | 18:29:58 | **Aug 17 23:51:54** | **2.8 DAYS** |
| **back_left** | 19:38:15 | 01:25:47 | **18 h** |
| garage | Aug 14 15:10 | Aug 14 15:10 | ok |
| front_right | Aug 15 21:38 | Aug 15 21:38 | ok |

`<cam>_latest.jpg` is what the **Fire TV / Apple TV popup** shows and what **CodeProject.AI scans**.
So the front doorbell had been popping up and being AI-analysed on a **Monday-night photograph**
for two and a half days. A stale frame is byte-identical in appearance to a fresh one, so nothing
ever surfaced it.

## The chain, proven end to end

1. **All six cameras report `recent_clips = 0`, `video = None`, `last_record = None`.** No clip
   references at all — measured live on every camera.
2. **Jeff has NO Blink subscription** — already in the record: *"All six cameras show 'Not Covered'
   … 6 unsubscribed devices."* Without a plan Blink does no cloud clip storage.
3. So `blink.save_video` fetches a clip that does not exist and gets
   **`{"message":"Media not found","code":700}`**.
4. **blinkpy writes that error body into the .mp4.** From `blinkpy/camera.py`:

       async def video_to_file(self, path):
           response = await self.get_media(media_type="video")
           if response is None: ... return
           await vidfile.write(await response.read())

   It checks only `response is None` and **never checks `response.status`** — unlike
   `image_to_file` in the same file, which does check `status == 200`. **Upstream inconsistency.**
   HA's `camera.py` adds nothing: no content validation, only OSError/UnauthorizedError caught.
   Confirmed live: `blink.save_video` returned **HTTP 200 while writing 40 bytes of JSON.**
5. ffmpeg then fails `moov atom not found` (return 183/234), so `<cam>_latest.jpg` is never
   rewritten and the OLD frame silently survives.

## THE FIX — $0, no subscription, no clips (Jeff: "I pay them or pay you")

**The pipeline only ever needed a STILL PICTURE. `camera.snapshot` is a free Blink feature** —
the record says so: *"Free Blink features only (on-demand snapshot/liveview/clip-save/arm);
cloud clip history is the only thing the paid plan adds."*

Snapshot needs **no subscription, no clip, no manifest, no ffmpeg**. Verified live: HTTP 200,
118,948 bytes, magic bytes `ffd8ffe0` = real JPEG.

**Built: `automation.hcc_snapshot_frame_on_motion_no_subscription_path`** (ON). Same six motion
triggers as the existing AI scan, same `cam_map`, writes `camera.snapshot` straight to
`/config/www/blink_clip_frames/<cam>_latest.jpg` — **the exact path the rest of the pipeline
already reads, so nothing downstream changes.** `mode: parallel, max: 10`.

**All six frames refreshed by hand 2026-08-19 21:29-21:30 CT** — every one now a valid JPEG
(`ffd8`) minutes old instead of days.

## Side benefit worth testing

The old chain was motion -> save_video (download) -> ffmpeg -> scan. Snapshot removes the download
and the ffmpeg step entirely, so it should also cut the **Fire TV popup latency** that Pending
Item 12 recorded as "root cause identified but not fixable from HA."

## Also built

`automation.hcc_clip_frame_extraction_failed_alert` (ON) — makes a failed extraction audible
instead of silent. Honest limitation: `system_log_event` fires once per message per HA session,
so it is a signal, not a counter.

## Method note — this cost hours it should not have

Jeff: *"I bet $50 if you looked on the forums and checked the web you could find the answers
without all this guessing."* He was right. The subscription fact was **already in the master
record**; one `Search-HCC.ps1 "Blink subscription"` returned it. Instead `blink.save_video` was
retried five times with different parameters first. **Look it up before touching the service.**


---

# CORRECTION + the bigger finding: camera-by-camera reality (2026-08-19 21:40)

## I overstated the clip failure — the archive disproves it

I wrote that the clip layer was entirely empty. **Wrong.** Jeff: *"The clips are on the beast in
D drive."* He was right. `D:\HCC-Clip-Archive` holds **75 real MP4s** (700 KB - 3.6 MB, valid
`ftyp` headers), and Beehive's `blink_archive` is still growing — `back_left_20260819_143818.mp4`.
**`blink.save_video` works whenever a clip actually exists.** `recent_clips=0` means none is
pending *at that moment*, not that the system is broken. The stale-frame chain above is still
correct; my generalisation from it was not.

## The D: archive had silently fallen behind

`D:\HCC-Clip-Archive\pull.log`:

    2026-08-17 04:00:01  manifest fetch FAILED: Unable to connect to the remote server
    2026-08-18 04:01:13  run complete: 67 in manifest, 57 new pulled
    2026-08-19 04:00:02  manifest fetch FAILED: Unable to connect to the remote server

Two of the last three nightly pulls failed — the 4 AM run cannot reach Beehive when this PC's
network is disturbed (08-19 04:00 sits right after the VPN/DNS mess of that morning). Beehive had
75, D: had 67. **Ran it manually 21:38: "75 in manifest, 8 new pulled." Archive now current.**
**The script logs the failure and nothing reads that log** — same silent-failure shape as
everything else tonight.

## CAMERA-BY-CAMERA — half the coverage is not contributing

| camera | batt | temp | wifi | motion sw | clips | newest clip |
|---|---|---|---|---|---|---|
| 301_driveway | ok | 72 | -39 | on | **43** | 08-19 10:51 |
| back_left | ok | 77 | -38 | on | **21** | 08-19 14:38 |
| 301_front_doorbell | ok | unknown | unknown | on | 8 | 08-19 13:30 |
| 301_backyard | ok | 75 | -65 | on | **1** | 08-16 06:59 |
| front_right | ok | 75 | -48 | on | **1** | 08-15 16:38 |
| **garage** | **LOW** | unknown | unknown | **OFF** | **1** | 08-17 06:13 |

**🔴 GARAGE — needs Jeff physically.** Motion detection is **OFF**, battery reads **LOW**
(`binary_sensor.garage_battery` = `on`, device_class `battery`; driveway reads `off` as the
control), and it reports no temperature or WiFi. One clip ever, zero motion in 26 h.
`switch.turn_on` returns HTTP 200 and the switch **stays off** even after a forced refresh — it
cannot be re-armed remotely. A `camera.snapshot` does return an image, so Blink's cloud has a
cached thumbnail, but the device is not live on the sync module. **This is open item I.14
confirmed and extended: it needs batteries / a physical check.** Meanwhile
`alarm_control_panel.blink_loewen301` reads `armed_away`, so nothing ever surfaced it.

**front_right — alive but blind.** Telemetry healthy (75 °F, -48 dBm), armed, and still only
**1 clip since 08-15** with zero motion in 26 h. Same shape as the backyard: the camera works,
the PIR is not triggering. Not previously recorded.

**301_backyard** — 1 clip since 08-16. The known thermal/PIR problem.

**Net: driveway and back_left carry the system. The doorbell contributes lightly. Backyard,
front_right and garage contribute almost nothing.**

## Still unexplained

- `301_front_doorbell` and `garage` report `temp`/`wifi` = unknown while others report fine.
  The doorbell still produces clips, so it is not simply dead. Not root-caused.
- `blinkpy.sync_module` manifest errors (2102 stale / 307 busy) continue at ~4/hr.
