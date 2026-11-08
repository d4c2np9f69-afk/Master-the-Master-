# Garage Electronics Repair Studio - Plan v1 (2026-11-08)

**Jeff, 2026-11-08 9:09 AM:** *"setting up the garage Claude / Jeff electronics repair workstation ... while I'm
working on stuff at the bench I can just talk to you like a conversation. It needs to almost be like a studio ...
turn my garage into a electronics repair studio so can film repairs for my YouTube channel. I have that really nice
Razer camera ... I need your help with designing and execution ... I know it is a mess now but that is why I need
your help getting it cleaned and organized."*

Photos (5, taken 11-08, private - NOT in this public repo): `iCloudDrive\HCC-Photos\garage-studio-2026-11-08\`
Tracked as OPEN_ITEMS **#282**.

**The rule for this build: $0 first, test the footage, then buy only what the test proves is missing.**

---

## 1. What we are working with (checked, not assumed)

| Fact | Source |
|---|---|
| Garage is **13 x 24 ft**, garage door on the north end, man door on the west wall ~2/3 of the way back | `docs/house-plan/plan-data.js` (taped) |
| Bench computer = **Lenovo B570 "GarageLaptop"** (.173, Ubuntu, Pentium B960, 8 GB). **Offline when checked 11-08 9:12 AM** (SSH timed out) - so its ability to record video is UNTESTED | NETWORK_MAP + live check |
| Garage TV / monitor above the bench, QFX PBX-BF120 Bluetooth speaker on the bench | plan-data.js, inventory |
| **Delam XLR mic** - the boom arm with its shock mount is already on the corner bench (photo 1). The record (09-17) says it **needs 48 V phantom power + an audio interface**; generic XLR condenser kits confirm that by search 11-08. **Exact Delam model not found online - read the box/label before buying the interface.** | IDEAS_FROM_WHAT_WE_OWN, web 11-08 |
| **Razer Kiyo Pro** - 1080p60 (HDR at 30), USB 3.0 (falls back to compressed H.264 on USB 2), 3 field-of-view presets 80/90/103 deg, detachable stand. **Discontinued.** Last used on the Beast (08-15 test rig). **NOT plugged into the Beast now** (device list 11-08 9:12 AM). Using it in the garage touches nothing in the frozen house-camera stack - none of the six AI streams use it; leave its old Beast stream entry alone (CAMERAS_CLOSED). | razer.com specs, live check |
| Already on hand for the bench: soldering station (kept 11-02), blue silicone repair mat, magnifier lamp, **two** boom arms, parts drawers, red wall cabinets with under-cabinet LED strip, pegboard, UPS | photos + RETURNS sheet |
| **Microwave salvage blower (120 V)** is on the KEEP list *for solder-fume extraction* | inventory, Microwave salvage |
| The iPhone Claude app has **hands-free voice mode** (listens continuously, answers out loud, all plans) | support.claude.com |

---

## 2. Before anything moves - two things that cost money if they get lost

1. 🔴 **The onn 75" return parts.** Four eBay returns **ship by Nov 17** (T-con, main board M21123-MT, 55" power
   supply, LED strips) and the ShopJimmy power board **by Dec 2** - `docs/tv/RETURNS_2026-11-02.md`. (A memory
   note says T-con Nov 15 / strips Nov 16 - **use Nov 15 as the safe date.**) The green board on the folding table in
   photo 2 may be one of them. **Box and label all five FIRST**, before cleanup starts, so nothing gets tossed.
2. **The HV capacitor from the microwave** - if it is still in the garage, discharge, confirm 0 V, dispose (inventory
   says so). Not something to have in a pile that gets sorted fast.

## 3. Safety items seen in the photos (Jeff's trade - flagged, not lectured)

- **Open electrical box beside the man door** (photo 4) - wires and a wire nut showing. That is the spot the
  Ecoeler YM2108T switch was assigned to (08-17). Cover it or install it before the floor gets busy.
- **Power hung from the shelf** - a yellow extension cord feeding a strip up at the light shelf, cords dangling
  through the work area (photo 1). For a studio: one mounted strip along the back of each bench, cords run behind,
  nothing hanging in the shot or in the iron's reach.
- **Fuel + 2-stroke gear share the room with the soldering iron** - keep all gas cans at the garage-door end
  (they are there now, photo 5) and never move them toward the studio half.

---

## 4. The layout - two zones

```
            NORTH - GARAGE DOOR
 +-------------------------------------------+
 |  YARD & POWER ZONE                        |
 |  mower, blowers, gas cans, spreader,      |
 |  table saw, miter saw, ladders, the tree  |
 |                                           |
 |== MAN DOOR (west) ======= dividing line ==|
 |  STUDIO ZONE  (~13 x 12 ft)               |
 |  [C] WKU wall + antique desk              |
 |      = intro / talking-head set           |
 |  [B] corner bench = "mission control":    |
 |      Claude + computer + garage TV        |
 |  [A] red-cabinet bench = THE REPAIR SET   |
 |      (filmed)                             |
 +-------------------------------------------+
            SOUTH - BACK WALL
```
*(My read of how photos 1-3 join: the corner bench in photo 1 sits at the right end of the red-cabinet bench in
photo 2, and the WKU wall in photo 3 runs from that corner toward the man door. **Confirm on the walk-through.**)*

- **[A] The repair set - the red-cabinet bench (photo 2).** Why this one: it already *looks* like a real shop on
  camera (red cabinets, pegboard, the logos), it has the under-cabinet LED strip, and it is long enough to hold the
  job plus the tools. **Rule: this bench holds only the job being filmed.** Everything else lives in the drawers,
  cabinets and pegboard. The folding table with the cardboard top goes away (or becomes the teardown/parts table).
- **[B] Mission control - the corner bench (photo 1).** Computer, garage TV as the big screen, the mic arm,
  the UPS, the parts drawers. This is where Claude lives: the screen shows the conversation / schematic / datasheet,
  right beside the repair set.
- **[C] The talking-head set - antique desk in front of the WKU mural (photo 3).** The mural is the best backdrop
  in the garage and it is already painted. Intro, outro, "here's what came in today", the before/after reveal.
  The desk clears to bare wood for filming.
- **Front half:** everything gas-powered or yard-related goes forward of the man door, on the wall hooks/rack.

## 5. Cameras - three angles, start with what Jeff owns

| Angle | Job | $0 start | Upgrade only if the test shows it |
|---|---|---|---|
| **Overhead "mat cam"** | the repair itself, hands + board - THE money shot for repair videos | **Jeff's iPhone** on the spare boom arm looking straight down (records 4K on its own - no computer needed) | phone holder for the arm if there isn't one |
| **Wide / face cam** | Jeff at the bench, reactions, talking | **Razer Kiyo Pro** on its stand at the end of the bench, 103 deg wide preset | - |
| **Close-up** | chip-level, solder joints, part numbers | magnifier lamp for Jeff's eyes; macro via the iPhone lens | USB digital microscope (later, priced when wanted) |

Recording: the iPhone records itself. The Kiyo needs a computer running OBS (free). **The Lenovo B570 is old
(Pentium B960) and I have NOT tested whether it can record 1080p** - that is test #1 when it is back online. If it
can't, the shoot is iPhone-led until a better bench machine is actually needed.

## 6. Sound - the thing viewers forgive least

YouTube's own guidance: viewers tolerate imperfect light far more than bad sound. So sound gets the first dollar.
- **The Delam XLR mic is already on the arm** - it only needs an interface with 48 V phantom power. The usual
  budget one (Behringer UM2) showed **$35 to $129 across retailers on 11-08** - prices all over the place, so
  **check the live price and the Delam's own spec before buying.** That one box serves BOTH jobs: the YouTube
  voice track AND the mic for talking to Claude on the bench computer.
- **Garage noise:** fans off while filming; the fridge compressor cycles - note when it runs. Hard walls + concrete
  = echo; a moving blanket behind the camera fixes most of it for little money.
- Option the creators use: film the repair quietly, record the narration afterwards at the desk.

## 7. Light

- $0 first: under-cabinet LED strip + the garage cans. **The test shoot decides** - look for hand shadows on the
  board, glare off shiny parts, and flicker (banding) at 60 fps.
- If it needs help: two soft lights at about 45 deg left and right of the bench, not one bulb straight overhead
  (overhead = hand shadows + glare). Same colour temperature on everything in the shot.

## 8. Talking to Claude at the bench - two routes, both tested before relying on them

1. **Today, $0: Claude iPhone app, voice mode (hands-free).** Phone on a stand at the bench; it listens, answers
   out loud, no hands. Good for "what's this part, how do I test it, what's the pinout". **Limit: that chat can't
   reach the house, the PCs or HA the way this session can.**
2. **With hands on the house: Claude Code on the bench computer, `/voice` push-to-talk.** Speech in, answers on
   the garage TV (it does not talk back). Push-to-talk = hold a key - a **USB foot pedal** set to that key keeps
   both hands on the work (single pedals **$16-35 seen 11-08**, unverified listings). **Untested on this hardware.**

Whichever is used: if Claude's voice is audible in the room it will be on the recording - which could be part of
the show ("Jeff and Claude fix a ___") or kept off the track with AirPods. Jeff's call.

## 9. Bench essentials for repair work

- **Fume extraction from the microwave blower - $0, and a ready-made first episode.**
- ESD: the silicone mat is not an ESD mat. An ESD mat + wrist strap is cheap insurance for board work - price when
  wanted.
- Small-parts trays / the drawer chest for screws per job (the magnetic dish is already there).

---

## 10. The sequence

| Phase | What | Who | $ |
|---|---|---|---|
| **0** | Box + label the 5 TV return parts; HV cap check | Jeff | $0 |
| **1** | **Clean-out.** Four piles: STUDIO / YARD / SALVAGE STOCK / GO (trash, recycle, sell). Yard gear forward of the man door. One zone per session so the garage is never torn up all at once: (a) repair bench, (b) corner bench, (c) WKU desk, (d) floor + front | Jeff (Claude keeps the checklist + inventory updated as things turn up) | $0 |
| **2** | Power + safety: close the door box, mount bench strips, route cords | Jeff | parts on hand? |
| **3** | Set the three stations with what's owned (Sections 4-5) | Jeff + Claude | $0 |
| **4** | **Test shoot - 2 minutes**, a real job, both cameras. Claude reviews the files frame by frame for sound, light, framing, flicker | both | $0 |
| **5** | Buy only what #4 proved missing - each item priced live and approved by Jeff | Jeff decides | TBD |
| **6** | Claude station: voice-mode stand, then the Claude Code + pedal trial | both | $0-35 |

**Owed by Claude next:** the Phase 1 checklist as a printable sheet; test #1 (can the Lenovo record the Kiyo) as
soon as the Lenovo is powered on; inventory rows for everything the clean-out turns up.

Sources checked 11-08: razer.com/streaming-cameras/razer-kiyo-pro/specs, support.claude.com/en/articles/11101966,
support.google.com/youtube/answer/11913513, jj5.net/wiki/Studio, Behringer UM2 listings (chucklevins.com,
chicagomusicexchange.com, reach.dog), Claude Code voice-mode reports (claudefa.st, digitalapplied.com).
