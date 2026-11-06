# Ecoeler YM2108T — Garage Man-Door Motion Sensor Switch

**Decision (Jeff, 2026-08-17):** No smart switch in the garage. Jeff found this brand-new
Ecoeler YM2108T 3-way PIR sensor switch in his electrical supplies — $0, and it **closes the
long-open garage two-location question** (old CLAUDE.md Pending Item 19):

- **YM2108T goes at the GARAGE MAN DOOR** (master position) — lights come on automatically
  when anyone walks in.
- **The existing kitchen-position toggle stays as the 3-way AUXILIARY** — still works,
  nothing capped, nothing repurposed.
- The HS200/HS210 purchase is **dead — nothing to buy.**

Trade-off accepted: the garage lights are dumb/local — not in HA, no voice control. For a
garage, walk-in auto-on beats app control anyway (Jeff's call).

## The unit
- **Ecoeler YM2108T**, three-way 180° PIR occupancy/vacancy sensor switch, date code 0521,
  UL file E307893. Manual: `ecoeler_ym2108t_manual.jpg` (this folder) · unit photo
  `ecoeler_ym2108t_unit.jpg` · label `ecoeler_ym2108t_label.jpg`.
- 120 VAC, 800 W max lamp load, 1/6 hp motor load. **LED-compatible** (relay switch, and it
  is neutral-powered so there is no minimum-load problem — verified by web search 08-17).
  Garage load is 8× LED ≈ 96 W → trivially within rating.
- **NEUTRAL REQUIRED** — garage boxes have neutrals (Jeff confirmed every box, 08-13). ✅
- Coverage: 180°, ~720 ft², 30 ft reach. Indoor only.

## Wiring (Fig. 4 of the manual, "Typical 3-way switch wiring")
- YM2108T = **MASTER** — it must sit in the box that has **LOAD (power to lamp)**.
- Existing toggle = **AUXILIARY** — sits in the box with **HOT/common (power from panel)**.
- Two travelers between them, neutral present in both boxes, ground tied.
- ⚠️ If the garage man-door box turns out to be the HOT side (not the LOAD side), the
  YM2108T must go in the other position — identify line vs load before mounting. In a
  standard 3-way, line and load are usually in *different* boxes.
- Wire colors on the unit: black + red (travelers/hot per manual), blue, white (neutral),
  green (ground) — follow the manual's 3-way diagram, not color memory.

## Dial settings — starting point for the garage
Remove the control-panel cover to reach three dials + mode slider:

| Control | Set to | Why |
|---|---|---|
| **Mode (VAC/OCC)** | **OCC** (button released) | Occupancy = auto-ON when you walk in carrying stuff — the whole point in a garage. Vacancy would make you press the button every time. |
| **Time Delay** | **30 min (max)** — Jeff works long sessions out there | Any motion RESETS the timer, so while actively working the lights stay on indefinitely; 30 min only starts counting once he's completely still or gone. Auto-off still catches the "left the lights on" case. |
| **Sensitivity** | **3 (mid)**, raise if it misses you at the far bay | Start mid; the garage is one enclosed room, no hallway-traffic false-trigger risk. |
| **Ambient Light** | **Max (always trigger)** | The garage is dark even by day — never let a light-level lockout stop the auto-on. |
| Test | 15 s "TEST" position on the time-delay dial | Use for walk-testing coverage before buttoning up. |

**⚠️ No permanent-on override (Jeff asked 08-17, verified in the manual):** there is no hold/
always-on mode on this unit. In practice it doesn't matter much — in OCC mode every detected
motion resets the timer, so during active work the lights never drop; the only failure case is
being perfectly still (or hidden from the lens) for the full 30-minute delay. Mitigations:
delay dial at 30 min, sensitivity up (4–5) so bench-level movement registers, and mount with a
clear view of the work areas. If it ever proves annoying in real use, the kitchen-side
auxiliary is still a normal toggle — but there is no documented bypass wiring that keeps the
sensor's auto-on AND adds a true hold; changing behavior means changing the device.

PIR note (same physics as the Blink cameras): it needs a *clear line of sight* — don't mount
where the truck or shelving blocks the lens, and expect reduced range on 100 °F+ summer days.
PIR sees *heat contrast* moving — on 100 °F+ days in an uninsulated garage, range drops.

## Sources (verified 2026-08-17)
- [Amazon — ECOELER YM2108T 3-Way Wall Switch Vacancy & Occupancy Sensor](https://www.amazon.com/ECOELER-YM2108T-Switch-Vacancy-Occupancy/dp/B01A2VTO1C)
- [Manuals+ — ECOELER 3 Way Motion Sensor Light Switch Installation Guide](https://manuals.plus/ecoeler/ecoeler-3-way-motion-sensor-light-switch-manual)
