# Room geometry — what the evidence actually supports, 2026-10-08

**Jeff, 2026-10-08:** *"He still doesn't have the map right with all the information he had he
could have been able to get the room layouts correct"* · *"I sent him tons of pictures"* ·
*"Yes use everything you have."*

He is right that the drawing disagrees with his measurements. This file is the audit, so **nobody
re-derives it again.** Every source below was read this session.

## Sources used — all of them

| Source | What it is good for | What it is NOT good for |
|---|---|---|
| `docs/lighting/MEASUREMENTS_2026-09-22.md` | 9 Bosch GLM 20 laser readings + the perimeter walk + closure math | — |
| `docs/lighting/final_markup_2026-09-22_1244.jpg` | **The newest markup — 12:44, AFTER the 9:52 laser table and the 10:39 closure.** Carries the closure dims on the sheet | hand-drawn; do not scale pixels |
| `docs/lighting/revG_markup_authoritative.jpg` | Jeff's topology corrections (fireplace, pantry/laundry, toilet/tub/sink) | ⛔ **SUPERSEDED dimensions** — prints the pre-laser 12×24 garage, 15×13 master, 18×15 living |
| `docs/lighting/sharky_room_map_2026-09-22.jpg` + crosscheck | **Topology only** — confirms hall runs E–W, office S of the corridor's east end, guest bath off the east end | ⛔ **DIMENSIONS. Jeff: "it is really off in a lot of ways."** A session already read 187 px off his red guide walls, stretched the corridor to 8 ft, and retracted it when Jeff said *"those walls… are not to scale."* Do not repeat it |
| 18 photos in `docs/lighting`, 4 in `docs/house-plan`, 50 in `HCC-Photos`, 167 in the master record | context, adjacency, fixtures | — |

## ✅ CONFIRMED CORRECT — the drawing matches the markup

Front **39′6″** (drawn 39.42 = 39′5″) · east side **29′3″** (drawn 29.25) · porch **5′6″ × 3′8″
recess** · **kitchen bumps out 5′7″** · **garage door in the west wall, 8′ back** · garage 13 wide ·
kitchen/dining 16 × 13 · foyer block present · master bath "8 ft to shower end".

**Master bedroom 19.67 wide is CORRECT, not an error.** The markup says 15 × 11, but Jeff on
**25 Sep** said *"the bedroom goes all the way to the west wall"* — newer than the 22 Sep sheet.
Newest wins. The `inferred` closet strip that used to fill the west 4.67 ft was removed then.

## ❌ CORRECTION TO WHAT I TOLD JEFF EARLIER TONIGHT — the living room

I reported the living room as **2.75 ft short** (measured 14 × 17, drawn 14.42 × 14.25). **That was
wrong, and here is what I missed:** the hallway's south edge is drawn **DASHED** on the 12:44
markup and annotated *"open to living room"* — and `plan-data.js` says the same thing in the hall's
own subtitle, *"open to the living room."* The hallway runs y 11→15; the living room is drawn
y 15→29.25. **14.25 + 2.75 of open hallway = 17.** The 17 ft reading runs from the hallway's north
wall to the back wall, through an opening that is not a room boundary.

**So the geometry is right and the LABEL is what misleads** — a `sub` reading "14 × 17" sitting on a
14.25-deep rectangle. Fix the label, do not redraw the room.

## 🔴 STILL GENUINELY WRONG — and the arithmetic that proves it

**There are 4.25 ft unaccounted for down the east wall, and the drawing hides them by stretching
two rooms.**

```
east side, perimeter walk (24'3" + 5'0")        29.25 ft   <- measured
  guest bath depth                               ~8.50     <- ESTIMATED, never measured
  office depth (laser)                           13.00     <- measured
  NE corner notch (drawn)                         3.50     <- not measured
                                                 ------
  accounted for                                  25.00
  UNEXPLAINED                                     4.25 ft
```

What `plan-data.js` actually draws: guest bath **11.5** deep (+3.00 over the estimate) and office
**14.25** deep (+1.25 over the laser). **3.00 + 1.25 = 4.25 — exactly the gap.** The two east rooms
were inflated by precisely the amount nobody could explain, which makes the outline close while
contradicting the one room on that wall that was actually measured.

This is the failure mode `MEASUREMENTS_2026-09-22.md` names four paragraphs before it happens:
*"when measured parts refuse to fit an assumed whole, question the WHOLE before you question the
parts."* Here the whole (29.25) is measured and trustworthy, so the missing piece is a **room that
is not on the drawing.**

🔑 **And the 12:44 markup shows one.** Between the guest bath and the office there is a strip
carrying `clo`, a closet box and hatching, with the A/C pad outside it. A closet/mechanical strip of
roughly 4–5 ft in that position would close the east wall **without touching the office's measured
13 ft.** That is a hypothesis from a hand-drawn sheet, not a measurement — it is written here to be
checked, not to be drawn.

### The other two

- **Office / Bed 3** — laser **10 × 13**, drawn **10 × 14.25**. 1.25 ft too deep. Falls out of the
  gap above; fixing the gap fixes this.
- **Foyer** — markup **8 × 6**, drawn **5.5 × 7.33**. Wrong on both axes and looks transposed.
  Unexplained by anything above.

## What would actually close this — 3 numbers and one sentence

Photos cannot settle it; a tape can. Nothing else is needed.

1. **Guest bath, north–south depth.** The 8½ ft has never been measured — it is the single
   weakest number in the whole drawing, and it sits on the wall that does not close.
2. **The strip between the guest bath and the office** (the `clo` / closet area on the 12:44
   sheet): is it a closet, a mechanical chase, or nothing? How deep?
3. **Foyer** — width and depth, to settle 8 × 6 against the drawn 5.5 × 7.33.
4. **The west wall, north to south, from the NW corner to the garage door — in Jeff's own words.**
   `MEASUREMENTS_2026-09-22.md` is explicit that this cannot be inferred: *"re-ordering a stack does
   not change its sum — so this needs Jeff to name the order, not another inference from me."*

## The rule this pays off

**A room with no data is not a room with a safe default.** Every repeated correction across Revs
A–Q has landed in the guest bedroom / guest bath corner — the only part of the house no instrument
has ever measured. The east wall still does not close for exactly that reason. Mark the guesses and
leave them marked until a tape replaces them; do not let a plausible fill-in sit on the drawing
looking exactly like a measured room.
