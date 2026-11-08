# Garage Electronics Repair Studio - Plan v1 (2026-11-08)

**Jeff, 2026-11-08 9:09 AM:** *"setting up the garage Claude / Jeff electronics repair workstation ... while I'm
working on stuff at the bench I can just talk to you like a conversation. It needs to almost be like a studio ...
turn my garage into a electronics repair studio so can film repairs for my YouTube channel. I have that really nice
Razer camera ... I need your help with designing and execution ... I know it is a mess now but that is why I need
your help getting it cleaned and organized."*

Photos (5, taken 11-08, private - NOT in this public repo): `iCloudDrive\HCC-Photos\garage-studio-2026-11-08\`
Tracked as OPEN_ITEMS **#282**.

**THE RULE FOR THIS BUILD - Jeff, 11-08 9:32 AM:** *"I'm not going to spend a dime on this unless it is absolutely
necessary!!! Look at all that shit I have out there we can build anything we need and I'm not spending $125 on a mic
amp we can do it with software and or build it ... you are a project manager ... that $125 mic amp look at that as
me going back to the Max plan if we can do all this with what I have."* **Build from what he owns. Buying is the last
resort, not phase 5.** Claude's job = project manager: plan, design the builds, verify every step.

---

## 1. What we are working with (checked, not assumed)

| Fact | Source |
|---|---|
| Garage is **13 x 24 ft**, garage door on the north end, man door on the west wall ~2/3 of the way back | `docs/house-plan/plan-data.js` (taped) |
| Bench computer = **Lenovo B570 "GarageLaptop"** (.173, Ubuntu, Pentium B960, 8 GB). **Offline when checked 11-08 9:12 AM** (SSH timed out) - so its ability to record video is UNTESTED | NETWORK_MAP + live check |
| Garage TV / monitor above the bench, QFX PBX-BF120 Bluetooth speaker on the bench | plan-data.js, inventory |
| **Delam XLR mic** - the boom arm with its shock mount is already on the corner bench (photo 1). The record (09-17) says it **needs phantom power + an audio interface**; generic XLR condenser kits confirm that by search 11-08. **Exact Delam model not found online - read the box/label before buying the interface.** | IDEAS_FROM_WHAT_WE_OWN, web 11-08 |
| **Razer Kiyo Pro** - 1080p60 (HDR at 30), USB 3.0 (falls back to compressed H.264 on USB 2), 3 field-of-view presets 80/90/103 deg, detachable stand. **Discontinued.** Last used on the Beast (08-15 test rig). **NOT plugged into the Beast now** (device list 11-08 9:12 AM). Using it in the garage touches nothing in the frozen house-camera stack - none of the six AI streams use it; leave its old Beast stream entry alone (CAMERAS_CLOSED). | razer.com specs, live check |
| Already on hand for the bench: soldering station (kept 11-02), blue silicone repair mat, magnifier lamp, **two** boom arms, parts drawers, red wall cabinets with under-cabinet LED strip, pegboard, UPS | photos + RETURNS sheet |
| **Microwave salvage blower (120 V)** is on the KEEP list *for solder-fume extraction* | inventory, Microwave salvage |
| The iPhone Claude app has **hands-free voice mode** (listens continuously, answers out loud, all plans) | support.claude.com |

---

## 2. Before anything moves

1. ✅ **The onn 75" return parts - ALREADY SHIPPED.** Jeff, 11-08 9:19 AM: *"All the stuff has been returned"* (eBay,
   Amazon, ShopJimmy). Nothing to box. Refunds are tracked on OPEN_ITEMS #255.
2. **The HV capacitor from the microwave** - if it is still in the garage, discharge, confirm 0 V, dispose (inventory
   says so). Not something to have in a pile that gets sorted fast.

## 3. Safety built into the design

- **One mounted power strip per bench**, cords run behind, nothing in the shot or in the iron's reach.
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

## 6. Sound - BUILD it, don't buy it

The mic is a **Delam BM-800-class condenser** (BEEHIVE_REFERENCE spare-hardware list, 08-05). Software can clean
up and level the sound (OBS has free noise-suppression, gain and compressor filters) but **software cannot make
the power the mic's capsule needs** - that part is hardware. Three $0 routes, in order:
1. **Read the mic first.** Some BM-800 variants carry their own AA battery and need no phantom power at all
   (forum reports, 11-08). If ours has a battery bay, the power problem is already solved.
2. **Build a phantom supply from salvage** - Jeff's trade. A DC source in the 12-48 V range fed to XLR pins 2 and 3
   through a matched resistor pair, DC-blocking capacitors on the audio out, enough current for the mic. Design it
   together once the mic is read; **the BM-800's exact voltage/current need was NOT found in a search 11-08 -
   measure it, don't assume 48 V is safe for it** (one forum thread questions exactly that).
3. **No-build fallback for the test shoot:** the Kiyo Pro's built-in mics and the iPhone's. The test shoot decides
   whether the Delam is even needed.
- **Garage noise:** fans off while filming; the fridge compressor cycles - note when it runs. Hard walls + concrete
  = echo; a moving blanket (owned?) behind the camera fixes most of it.
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
   both hands on the work - **build the pedal, $0: Jeff OWNS an old SEWING-MACHINE foot pedal (told 11-08 9:41 AM) - expected to be a speed control, not a clean switch; plan = its housing + a salvage microswitch the rocker presses. Donor keyboard: Jeff OWNS an old one (11-08 9:42 AM) - must be USB, not PS/2. ALL PEDAL PARTS OWNED - use its switch contacts only, unplugged from the wall, wired across the spacebar of a donor USB keyboard (spacebar = Claude Code push-to-talk; a mouse cannot send it). First: continuity test - momentary on/off vs variable speed-control type.** **Untested on this hardware.**

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
| **0** | HV cap check (TV returns already shipped) | Jeff | $0 |
| **1** | **Clean-out.** Four piles: STUDIO / YARD / SALVAGE STOCK / GO (trash, recycle, sell). Yard gear forward of the man door. One zone per session so the garage is never torn up all at once: (a) repair bench, (b) corner bench, (c) WKU desk, (d) floor + front | Jeff (Claude keeps the checklist + inventory updated as things turn up) | $0 |
| **2** | Power: a mounted strip per bench, cords routed behind | Jeff | $0 |
| **3** | Set the three stations with what's owned (Sections 4-5) | Jeff + Claude | $0 |
| **4** | **Test shoot - 2 minutes**, a real job, both cameras. Claude reviews the files frame by frame for sound, light, framing, flicker | both | $0 |
| **5** | Build what #4 proved missing, from owned parts. Buying = last resort, only if absolutely necessary, Jeff decides | both | $0 |
| **6** | Claude station: voice-mode stand, then the Claude Code + built pedal trial | both | $0 |

**Owed by Claude next:** the Phase 1 checklist as a printable sheet; test #1 (can the Lenovo record the Kiyo) as
soon as the Lenovo is powered on; inventory rows for everything the clean-out turns up.

Sources checked 11-08: razer.com/streaming-cameras/razer-kiyo-pro/specs, support.claude.com/en/articles/11101966,
support.google.com/youtube/answer/11913513, jj5.net/wiki/Studio, BM-800 phantom-power reports (forum.allaboutcircuits.com, forums.tomsguide.com, amateurradio.com, prosoundweb.com); UM2 listings seen and REJECTED by Jeff (chucklevins.com,
chicagomusicexchange.com, reach.dog), Claude Code voice-mode reports (claudefa.st, digitalapplied.com).
