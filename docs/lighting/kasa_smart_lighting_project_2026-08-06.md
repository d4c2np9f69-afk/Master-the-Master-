# Smart Lighting Project — Summary

**Final decision:** Kasa HS220 (dimmer) / HS200 (non-dim), local HA integration via `python-kasa`.

## Room-by-room

| Room | LEDs | Load | Switch locations (final) | Device |
|---|---|---|---|---|
| Bedroom | 9× 12W ProGreen | 108W | 1 (door only — bedside + middle switches removed, blank plates) | Kasa HS220 |
| Kitchen + Dining (combined) | 9× 12W ProGreen | 108W | 1 (one of the 3 existing kitchen switches; other 2 removed) | Kasa HS220 |
| Living room | 8× 12W ProGreen | 96W | 1 (existing) | Kasa HS220 |
| Garage | 8× LED, not dimmed | 96W | 2 (kitchen + garage, 2-way) | Kasa HS200 |

**Shopping list:** Kasa HS220P3 (3-pack, covers bedroom/kitchen-dining/living room) + 1× Kasa HS200 (garage). No modules, no momentary switches, no plate swaps — HS220/HS200 replace the switch directly.

## Why Kasa over MOES/Shelly

- **MOES WM-105B-M** (already owned): 100W/gang limit, doesn't fit any single-channel group above 100W once rooms were combined to one switch each. Requires momentary/reset switches — confirmed via GitHub issues and HA community threads that standard toggles cause continuous ramp behavior, not clean toggle.
- **Shelly Dimmer Gen3**: works, local HA, keeps existing switches, but ~$35/unit vs Kasa ~$14-16/unit, and needs input-mode config per unit.
- **Kasa HS220**: replaces switch entirely, no separate module/switch pairing, mature local HA integration (python-kasa), single-pole only — which matches every room now that they're consolidated to one switch each.

## Bedroom wiring (already fully mapped, reversed-feed design)

- Original 4-way at bedside was the power ORIGIN — reversed so the DOOR box becomes the origin instead.
- Chain: door → middle box (splice through) → 3 bed LEDs (red terminates here) → bedside (end of run, receptacle only).
- Black = constant hot (feeds 2 receptacles), Red = switched leg to bed LEDs, White = neutral throughout.
- Old bedside receptacle tap (both hot + neutral) fully disconnected and removed — that was the original power source, now abandoned.
- **UPDATED — bedside + middle switches NOT removed.** Instead, each existing toggle is repurposed as a dumb (non-smart) switch controlling ONLY its own box's receptacle:
  - Black (constant hot) lands on the toggle's input, toggle output feeds that box's receptacle hot only.
  - White/ground pass through unswitched.
  - Black continues past the toggle to the next box in the chain, unaffected by that box's switch position.
  - No blank plates needed anywhere — every existing switch keeps a real job.
  - These two switches are completely independent of each other and of the lighting circuit — no WiFi, no HA entity, purely mechanical, same as a switched lamp outlet.
- 15A receptacle already on hand to replace an over-rated 20A receptacle found at bedside.
- Kasa HS220 lands in the door box only, drives lighting exclusively — unrelated to the switched-outlet circuit.

(Full box-by-box wiring detail in `docs/lighting/bedroom_wiring_plan_2026-08-06.md` — has the diagram.)

## Kitchen

- 3 switches currently: kitchen 3-LED group + 6-LED group (2 separate dimmers) + garage 2-way leg.
- Combining kitchen 3+6 onto one Kasa HS220 — 2 of the 3 switch positions come out.
- Garage's 2-way switch position in this box stays, wired to the Kasa HS200 for garage.

## Open items / not yet fully field-verified

- Kitchen and living room box fill/depth not yet inspected via photo (bedroom boxes were — combo switch+receptacle, already crowded, confirmed OK once devices reduced).
- Confirm neutral present at kitchen and living room switch boxes (assumed yes per house pattern, not individually confirmed via photo).
- Kasa app/local discovery should be tested on Jeff's network before buying all 4 units.
- **Added by cloud session (08-06):** the garage's "2 (kitchen + garage, 2-way)" control point is listed against a single Kasa HS200 — verified via research this needs the **HS210 kit** (matched pair, WiFi-coordinated) to keep BOTH the kitchen and garage switch positions live; a lone HS200 in a 3-way/2-way circuit makes the other physical switch position non-functional. See CLAUDE.md Pending Items for the specific question to resolve before ordering.

## Home Assistant integration target

- Instance: "Beehive" — local `homeassistant.local` / `192.168.1.66`, remote via Nabu Casa.
- Kasa devices auto-discover locally, no cloud dependency for core on/off/dim control — matches the local-first pattern used elsewhere in the house (RTL-SDR utility reads, WS calls to HA).
