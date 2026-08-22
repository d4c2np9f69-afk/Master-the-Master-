# START HERE — the next session's job

**Written 2026-08-22 2:15 PM as Jeff closed the day. He said: "queue up the next session so we
can start on the sensors and garage door and the rest of the project."**

Cameras are CLOSED and frozen. Do not reopen them. Start on the two jobs below.

---

## JOB 1 — Mount the remaining Zigbee sensors

**Status verified live 2026-08-22 2:15 PM, not assumed:**

| Already paired and reporting | State |
|---|---|
| `front_door_contact` | closed |
| `mailbox_contact` | closed |
| `back_deck_door_contact` | **OPEN — see the warning below** |
| `guest_bath_leak` / `kitchen_refrigerator_leak` / `kitchen_sink_leak` | all dry |

**Z2M is up:** bridge connection `on`, version **2.13.0**, `switch.zigbee2mqtt_bridge_permit_join`
is **off** — that is the switch to flip when pairing.

**The fleet:** 7 door/window + 5 leak sensors + the dongle arrived 08-15 (OPEN_ITEMS #11). Six are
paired, so **the rest are still in boxes.** Count what is physically left before planning.

🔴 **BEFORE PAIRING ANYTHING — the one-way door:** disable automatic firmware updates in the
vendor app FIRST. Newer firmware can demand cloud credentials for what used to be local-only, and
it is **not reversible**. This already bit the Kasa devices.

**Mounting:** VHB 5952 tape, and **prep is 90% of the bond** — clean both surfaces with alcohol,
let them dry fully, press hard for 30 seconds. A sensor that falls off in August is a sensor Jeff
re-does in January.

✋ **`back_deck_door_contact` reads OPEN — JEFF ALREADY KNOWS.** His words, 2026-08-22: *"the door
sensor will be fixed when we fix the sensors. I know it's down."* It is part of THIS job, not a
separate problem and **not something to raise with him again**. Battery 100%, still reporting — the
sensor is alive, just not mounted/aligned yet. OPEN_ITEMS #38.

## JOB 2 — Wire the SONOFF MINI-D garage door opener

**On hand, $0, and it unlocks the CarPlay garage button.** Verified live: **no garage door entity
exists yet** — only `binary_sensor.garage_motion` and the camera's motion switch, neither of which
is the door.

Sequence (OPEN_ITEMS #8): **wire → power → eWeLink-pair in INCHING MODE → Matter-commission into
HA.** Inching mode is what makes it a momentary door-button rather than a latching switch — get
that wrong and it holds the relay closed.

**Jeff wired this house himself. On the electrical side he is your expert peer** — give him the
wiring facts, not a safety lecture, and never suggest an electrician.

**Do not name any part or price from memory.** The correct opener is the SONOFF MINI-D and it is
already bought — three wrong part numbers in a row on this exact job made Jeff the fact-checker.

## ALSO WORTH KNOWING

- **Position sensing:** two Zigbee contacts (CLOSED + FULLY-OPEN) are on the plan so HA can tell
  open from closed rather than just pulsing the door. OPEN_ITEMS #8.
- **`docs/OPEN_ITEMS.md` is THE list — 39 items, 6 P1. Update it THIS session.** An owed item
  handed off in prose on 08-18 sat four days untouched.

## STILL WAITING ON JEFF (do not do these for him, do not nag)

1. **Rotate the Weather Underground API key — WHENEVER, NO RUSH.** Downgraded from P1 on 08-22 by
   Jeff's call, and he was right: the station ID is public by design, and the key's worst case is
   a burnt rate limit after which the card falls back to Open-Meteo anyway. **Do NOT re-verify it
   every session and do NOT raise it as urgent.** When he mentions it: rotate, paste into
   Cloudflare Pages as `WU_API_KEY`, then delete the line-16 fallback.
2. **A durable copy of the HA backup encryption key** off this PC — without it every `.tar` in
   iCloud is undecryptable. This one is genuinely load-bearing.

## WHAT NOT TO REOPEN

- **Cameras.** `docs/CAMERAS_CLOSED_2026-08-22.md` is the stop sign. The ceiling is Blink's, not
  ours, and it is measured.
- **The battery experiment.** `front_right` (151) and `301_driveway` (146) are deliberately on
  their original cells to find the real failure voltage. **Do not advise replacing them.**
- **The RTSP camera purchase** — deferred on cost. Do not re-pitch.
- **The audits** — already paid for. Cite, never re-derive.
