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
