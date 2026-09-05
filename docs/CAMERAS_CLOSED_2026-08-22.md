# CAMERAS — CLOSED 2026-08-22 11:38 AM. Read this before touching anything camera-related.

Jeff, 2026-08-22: *"you gotta get this thing zipped up. I can't spend any more time on this…
if you add up all the hours that we've worked on the cameras it's astronomical."*

**This is the ceiling of what Blink can do. It is not a to-do list. Do not reopen it.**

## Final verified state — 11:38 AM

| Item | State |
|---|---|
| 6 RTSP streams (go2rtc) | **OK** — real frames pulled, verified 4× today |
| go2rtc / CodeProject.AI | **Running** |
| Fire TV popups | **on** — person + vehicle + animal, GLE/far-field filters kept |
| Apple TV / HomeKit | **untouched**, person-only |
| Phone notifications | **on** — person + vehicle + animal |
| Backyard night sweep | **on** — 20 min, 22:00–06:00 |
| Low-battery alert | **on**, armed, never fired |
| Battery voltage logger | **running**, 15 min, guarded against false alarms |
| Live voltages | driveway **146**, front_right **151**, back_left **168**, backyard **166** |

## What was fixed today

1. Display: HDR profile + DPI regression from 08-21, restored to 1536×864 (red-cast fix preserved).
2. Popups: the 08-21 person-only filter had killed them the same evening. Reverted per Jeff.
3. Backyard night sweep built — the only $0 way to get overnight coverage out of a sleeping camera.
4. Battery voltage logging built — it had never existed. Hardened after it false-alarmed 4× at 11:31.

## \U0001f534 THE CEILING — why no further software work will help

Proven by measurement today, not theorised:

- **Blink gives ONE still per event, and Blink picks it.** Angela walked out at 10:56 and the frame
  contained only parked cars — she was never in it.
- **`camera.snapshot` does not take a new picture.** It returns Blink's last thumbnail; that is why
  `blink.trigger_camera` exists separately. Any "scan every N seconds" idea rescans a stale frame.
- **Blink does not reliably tell HA anything.** The mail carrier at ~11:25 was seen by the camera and
  announced by **Alexa**, while HA logged `motion_detected=False` on all six. `front_right` likewise
  produced real Blink clips on 08-21 while its HA sensor never once went `on`.
- **Polling harder is known-harmful.** `Blink Fast Motion Poll` (10 s) is **OFF** and must stay off —
  aggressive polling caused the 08-19 auth code-storm. **Do not re-enable it.**

**Every past session fixed the half that already worked, because that is the only half software can
reach. That is the mechanical reason this has recurred ~8 times.** The remaining faults —
backyard PIR aim, front_right not reporting, doorbell motion — are physical or inside Blink's cloud.

## Known-open, deliberately NOT being worked

- Backyard PIR aimed wrong (since 08-15). Physical.
- `front_right` + doorbell log no motion to HA. Inside Blink.
- Clip archive stores duplicates; `back_left` clips are 40-byte stubs. **Counts corrected 2026-08-23 by direct measurement of D:\HCC-Clip-Archive: 53 of 131 files are byte-identical duplicates (not 4), and there are 14 40-byte stubs (not 30) spread across `back_left`, `301_driveway` and `301_front_doorbell` (not only `back_left`). Mechanism is now root-caused and written up in OPEN_ITEMS #29/#30/#61 — REFERENCE ONLY, still deliberately not being worked.**
- Zigbee sensors quiet 12–18 h and the mailbox missed a real delivery — **suspicion, not a
  diagnosis**; MQTT is up and one device did report at 23:00. Separate from cameras.
- `back_deck_door_contact` has read open for 17.8 h — ask Jeff, do not assume a fault.

## The rule

**No camera / Blink / go2rtc / HomeKit / camera-automation change unless
`Verify-CameraStreams.ps1` actually FAILS, or Jeff asks.** "It could be better" is not a reason.
The RTSP purchase is **deferred on cost** and must not be re-pitched.
See `feedback_camera_freeze_rule` and `reference_hcc_blink_upstream_limits` in memory.
