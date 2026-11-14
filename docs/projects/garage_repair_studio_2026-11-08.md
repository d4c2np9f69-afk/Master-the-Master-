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
| **Delam XLR mic** - the boom arm with its shock mount is already on the corner bench (photo 1). 🔴 **CORRECTED 11-10, see §13: it does NOT need 48 V phantom or an audio interface.** The capsule is a pre-charged electret wanting a few volts of bias, and the **Lenovo has a dedicated PINK mic jack (`[Jack] Mic at Ext Rear, Conn = 1/8, Color = Pink`) with a 30 dB `Mic Boost` still at 0 dB** - measured 11-10. That is the $0 route. Exact Delam model still not findable online - read the box for the kit cable and whether a USB sound card shipped in it. | measured 11-10 over SSH; Podcastage BM-800 test; §13 |
| **Razer Kiyo Pro** - 1080p60 (HDR at 30), USB 3.0 (falls back to compressed H.264 on USB 2), 3 field-of-view presets 80/90/103 deg, detachable stand. **Discontinued.** Last used on the Beast (08-15 test rig). **NOT plugged into the Beast now** (device list 11-08 9:12 AM). Using it in the garage touches nothing in the frozen house-camera stack - none of the six AI streams use it; leave its old Beast stream entry alone (CAMERAS_CLOSED). | razer.com specs, live check |
| Already on hand for the bench: soldering station (kept 11-02), blue silicone repair mat, magnifier lamp, **two** boom arms, parts drawers, red wall cabinets with under-cabinet LED strip, pegboard, UPS | photos + RETURNS sheet |
| **Microwave salvage blower (120 V)** is on the KEEP list *for solder-fume extraction* | inventory, Microwave salvage |
| The iPhone Claude app has **hands-free voice mode** (listens continuously, answers out loud, all plans) | support.claude.com |

---

## 2. Before anything moves

1. ✅ **The onn 75" return parts - ALREADY SHIPPED.** Jeff, 11-08 9:19 AM: *"All the stuff has been returned"* (eBay,
   Amazon, ShopJimmy). Nothing to box. Refunds are tracked on OPEN_ITEMS #255.

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

🔴 **SUPERSEDED 2026-11-10 — read §13 instead of the three routes below.** The "48 V phantom + an
interface" framing came from the 09-17 note, which was wrong. The capsule is a pre-charged electret
needing only a few volts of bias, and the **GarageLaptop has a dedicated PINK mic jack with a 30 dB
Mic Boost in reserve** (measured 11-10). Route 2 below — building a phantom supply from salvage — is
**no longer needed and should not be built.** Route 1 (read the box) still stands, for the kit's
cable and whether a USB sound card shipped with it.

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
   both hands on the work - **build the pedal, $0: Jeff OWNS an old SEWING-MACHINE foot pedal (told 11-08 9:41 AM) - expected to be a speed control, not a clean switch; plan = its housing + a salvage microswitch the rocker presses. Donor keyboard: Jeff OWNS an old one (11-08 9:42 AM) - must be USB, not PS/2. ALL PEDAL PARTS OWNED - use its switch contacts only, unplugged from the wall, wired across the spacebar of a donor USB keyboard (spacebar = Claude Code push-to-talk; a mouse cannot send it). First: continuity test - momentary on/off vs variable speed-control type.** ✅ **THE SPACEBAR HALF IS NOW CONFIRMED, 11-12:** Claude Code **2.1.317** really does ship
   push-to-talk, and the binding is `voice:pushToTalk` **default-bound to SPACE** - read out of the binary's
   own strings - so the pedal-across-the-spacebar design is validated at the software end. Capture is 16 kHz
   mono and transcription happens on Anthropic's socket `/api/ws/speech_to_text/voice_stream`, so
   🔑 **no Whisper, no ffmpeg and no SoX are needed for voice** - an earlier plan to install a local
   speech stack was unnecessary.
   🔴 **STILL UNTESTED, and these are two different things:** (a) the **pedal hardware** - no continuity
   test has been run on the sewing pedal yet; (b) the **`/voice` press itself**, because the binary hides the
   command over SSH (`!isSSH() && !CLAUDE_CODE_REMOTE`) and SSH is the only route I have to the Acer. One press
   at the Acer's own keyboard settles (b). See OPEN_ITEMS #282 / #295.

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

## 11. Software - BUILT 2026-11-08 (while Jeff cleans)

Jeff 10:30 AM: *"build the software on the Acer and the garage Lenovo ... three screens the 2 computers and I have
more monitors."*

| Machine | Role | Measured 11-08 | Installed 11-08 (proof) |
|---|---|---|---|
| **Acer** Aspire E5-576 (`192.168.1.159`) | **Recording + Claude.** OBS records the Kiyo; Claude Code voice; Deskflow SERVER (Jeff's keyboard/mouse live here) | i3-8130U, 16 GB, UHD 620, **USB 3.0**, Win 11 Home, 0 crashes in 14 days | restore point #137 first; OBS 33.0.0, Git, Deskflow 1.27.0, Claude Code 2.1.317 (winget, `claude --version`). **Quick Sync proven:** 5 s 1080p60 H.264 encoded in hardware |
| **Lenovo** B570 (`192.168.1.158`, wired) | **Reference screen.** Manuals, schematics, Claude chat; Deskflow CLIENT | Pentium B960, 7 GB, **USB 2.0 only**, Xubuntu X11 | Claude Code 2.1.311 (Anthropic apt repo, key fingerprint checked), Deskflow 1.26.0, v4l-utils |

- **Screens:** Acer laptop + a monitor on the Acer's HDMI (Claude's big screen / OBS preview), Lenovo laptop + a monitor
  on its HDMI or VGA (reference). Neither external monitor is connected yet (checked 11-08).
- **Voice:** Claude Code voice is ON (`"voice": {"enabled": true, "mode": "hold"}`) on both. It is **dictation only** -
  speech in, text out; it does not talk back (code.claude.com/docs/en/voice-dictation). Hold key = **Space**, which is
  exactly what the sewing-machine pedal + donor keyboard sends. Needs a claude.ai sign-in (`/login`) and a LOCAL mic -
  not over SSH. Talking back at the bench = the Claude iPhone app voice mode.
- **Overhead iPhone:** records 4K on its own. Live into OBS for free was checked: the free tier found is 640x480 - not
  worth it; revisit only if the test shoot shows a live overhead preview is needed.
- **Feature tests (run, not assumed):** `windows-scripts/garage-studio/Test-StudioAcer.ps1` (Kiyo records a real 10 s
  clip + saves a frame, mic hears sound) and `test-studio-lenovo.sh` (mic, external monitor, Deskflow). Dry run 11-08:
  Acer 4/5 (only fail = Kiyo not plugged in), Lenovo 2/4 (monitor + Deskflow not set up yet).
- **Lenovo mic was clipping** (capture 31/31 = +30 dB; 251 samples at 0 dB in 3 s). Set to 22/31 (+16.5 dB) and saved
  with `alsactl store`; re-measured peaks -18 / -33 dB, none at 0. Real voice check = Jeff talking at the bench.

**Jeff's 10-minute block after cleaning:** Kiyo into a BLUE USB port on the Acer - monitors on both HDMI ports - open
Deskflow on both (Acer = server, Lenovo = client -> `192.168.1.159` **corrected 11-13; .176 is the Acer's Wi-Fi and does not answer**, click trust on each) - `/login` in Claude Code on
both. Then Claude runs both tests and looks at the Kiyo frame.

---

## 12. Readiness measured 2026-11-10 (~10:05 AM Central) - both machines

**Printable Phase 1 sheet - DELIVERED:** `docs/projects/garage_studio_phase1_checklist.html`
(four piles, four zones, the three Jeff-only hardware steps, Deskflow, phases 2-4). It carries the
measurements below, so reprint it after the hardware steps change them.

| Checked | Acer `JeffsLapTop` .176 | Garage Lenovo `GarageLaptop` .158 |
|---|---|---|
| Kiyo Pro seen | **NO** - only built-in "HD WebCam" enumerated | n/a |
| Recording chain | **PROVEN** with the built-in cam: 10.0 s in 11.1 s wall, h264 1280x720@30 via Quick Sync; `h264_qsv/hevc_qsv/av1_qsv/mjpeg_qsv/vp9_qsv` available; 320.0 GB free of 464.5 GB | untested - no camera attached |
| Picture quality | **FRAME IS BLACK** with sensor noise - real capture, no light on the lens. Not a software fault | n/a |
| Mic | PASS -31.1 dB peak | PASS **-18.4 dB** peak - the 31/31 -> 22/31 gain change took, no clipping |
| External monitor | built-in panel | **FAIL** - HDMI and VGA both `disconnected` in `/sys/class/drm/` |
| OBS | PASS (installed) | not installed |
| Claude Code | PASS 2.1.317 | PASS 2.1.311 |
| Deskflow | **had NO config at all.** Written today: `[core] coreMode=2`, `computerName=JeffsLapTop`, `port=24800` at `%APPDATA%\Deskflow\Deskflow.conf` | Written today: `[core] coreMode=1 port=24800` + `[client] remoteHost=192.168.1.176`; prior conf backed up to `Deskflow.conf.bak-1110-100733` |

### Deskflow - what is proven and what is Jeff's

🔴 **CORRECTION to the 11-08 test result:** `Test-StudioAcer.ps1` counted `Get-Process deskflow*` as a
Deskflow PASS. The only process was **`deskflow-daemon`**, the Windows service - which is **not a server**
and serves nothing. Nothing was listening on 24800 and the Acer had no config file. That was a component
check standing in for the feature, the exact 08-21 failure mode. The script's Deskflow check should test a
**listener on 24800**, not a process name.

**Proven by observation, not assumed:**
- `[client] remoteHost` IS read: the Lenovo client log printed `NOTE: configured 1 server address(es)` then
  `IPC: connecting to '192.168.1.176': 192.168.1.176:24800`, then `failed to connect: Timed out` - correct,
  because no server was listening yet.
- Acer firewall already allows it: two rules, `Deskflow Server` and `Deskflow Client`, both
  `prog=C:\Program Files\Deskflow\deskflow-core.exe`, `localport=Any`, `profile=Any`, `enabled=True`.
- LAN path good: ping Lenovo->Acer **3/3 received, 4.6-7.4 ms**, and a TCP connect from the Lenovo to the
  Acer's port 22 succeeded.
- ⚠️ A dummy PowerShell TcpListener on 24800 was NOT reachable from the Lenovo - **that test is invalid**,
  because the firewall rules are program-scoped to `deskflow-core.exe` and PowerShell has no rule. It proves
  nothing in either direction; the port-22 test above is the valid path proof.

**Key names came from the official wiki, not memory** (`github.com/deskflow/deskflow/wiki/GUI-Settings`,
read 2026-11-10): `[core] coreMode` 0=None/1=Client/2=Server, `port`, `computerName`; `[client] remoteHost`
(IP or hostname, comma-separated list allowed); `[security] tlsEnabled` / `certificate` / `keySize` /
`checkPeerFingerprints`; `[server] externalConfig` / `externalConfigFile`.

**JEFF's two clicks, and why I did not do them for you:**
1. **Acer:** open Deskflow (already Server mode), put a screen in the grid next to `JeffsLapTop` named
   exactly `GarageLaptop`, Start. The layout lives in `[internalConfig] screens\N\name` and the
   **index->grid-cell mapping is undocumented** - a wrong guess puts the two screens in non-adjacent cells
   and the mouse then never crosses, with no error shown anywhere. Not guessing it.
2. **Lenovo:** open Deskflow (already Client, host filled in), Start, accept the TLS fingerprint once.
   `checkPeerFingerprints` was left at its default **true** on purpose - turning it off would have been a
   silent security downgrade.
3. **The feature test is the mouse crossing the screen edge.** Nothing short of that counts.

**Still owed to Jeff:** inventory rows for whatever the clean-out turns up (he tells me, I write them).

---

## 13. THE MIC — ANSWERED 2026-11-10, and the 09-17 note was wrong

Jeff, 11-10 12:22 PM: *"The software to the microphone it does not have batteries so the power needs
to come from a sub port: just look up the microphone and find out how to make it work."*

### What the mic actually needs

A BM-800-class body is a **pre-charged (electret) capsule**. It does not need true 48 V phantom
power; it needs a small **bias voltage — "plug-in power", on the order of 5 V**. Evidence, not memory:

- **Hands-on, same class of mic:** Podcastage's test of the Excelvan BM-800 ran it through a **USB
  audio adapter supplying at most 5 V** and reported it working fine "despite the 48 V labeling."
  The same source warns that going **straight into a computer's mic jack may not work** — so the
  jack route is worth testing but is not guaranteed.
- **Kit contents:** generic BM-800 kits normally ship an **XLR→3.5 mm cable plus a small USB sound
  card**; phantom power is sold as an *optional* extra. An under-powered input records quiet, not
  silent — low level is the symptom to expect, and it is fixable with gain.
- **No listing exists under the "Delam" brand name** (searched 11-08 and 11-10). The exact kit
  contents cannot be confirmed online. **The box is the only source** — that part is Jeff's.

### What the two machines actually have — measured 11-10 over SSH

| Machine | Finding | How it was measured |
|---|---|---|
| **Lenovo `GarageLaptop` .158** | 🟢 **DEDICATED PINK MIC JACK.** `/proc/asound/card0/codec#0` node 0x18: `Pin Default 0x01a19820: [Jack] Mic at Ext Rear, Conn = 1/8, Color = Pink`. A dedicated pink jack is the kind that carries plug-in power; a modern single combo headset jack usually does not. | `grep` of the live codec dump |
| **Lenovo — gain in reserve** | 🟢 `Mic Boost` has **4 steps (0–3) at 27 dB a step and is sitting at 0 dB**; `Capture` is at 22/31 (16.50 dB). So there is roughly **30 dB of untouched boost** for a quiet mic. | `amixer -c 0 get Capture` / `get "Mic Boost"` |
| **Lenovo — USB audio** | 🔴 **None.** `lsusb` shows only the Bluetooth radio, the Chicony EasyCamera, the Rapoo 2.4 G receiver and the Realtek card reader. `arecord -l` lists exactly one card: `ALC272 Analog`. | `lsusb`, `arecord -l` |
| **Acer `JeffsLapTop` .176** | 🔴 **No USB audio either** — audio endpoints are only `Speakers (High Definition Audio Device)` and `Microphone (High Definition Audio Device)`; the USB class lists only root hub / controller / composite device. | `Get-PnpDevice -Class AudioEndpoint,MEDIA,USB` |
| **The record** | ⚠️ **THIS ROW WAS WRONG — CORRECTED 11-11 BY JEFF.** `HCC_INVENTORY.md` recorded no USB audio, and that is still true of the *file* — but **Jeff owns one**, plus a **lapel mic (2 ports)** and a **gaming headset w/ mic (dual ports)**. Nothing needs buying. 🔑 **THE LESSON: `lsusb` / `Get-PnpDevice` can only see what is PLUGGED IN. A cable sitting in a box is invisible to every probe in the rows above — an absence found by hardware scan is NOT an absence of ownership. ASK HIM.** | Jeff, in conversation 11-11 |

### The ladder — cheapest first, and it probably ends at step 1

1. **$0 — the kit cable into the Lenovo's pink jack.** Plug the XLR→3.5 mm cable from the mic's box
   into the pink jack, then raise `Mic Boost` from 0 to 3 (+~30 dB) and re-run the mic test. This is
   the dedicated-jack case, which is the favourable one.
2. **$0 — the kit's own USB sound card,** if one shipped in the box. These kits usually include one,
   and 5 V from a USB adapter is exactly what the hands-on test above proved sufficient. This is
   also precisely what Jeff described: *power from a USB port.*
3. **~$3–$16 — a USB audio adapter, only if 1 and 2 both fail.** Live prices checked 11-10: a 20 cm
   dual-jack USB-to-3.5 mm adapter at **$3.49** (Walmart clearance), a DUKABEL at **$8.99** (Amazon),
   generic 7.1 USB sound cards from **~$2.69** (eBay), Plugable at **$12.95–$19.99** (CDW/Office
   Depot). A buying guide puts a decent dual-jack adapter at **$8–$12** and warns off sub-$3 parts.
   **Do not buy anything until steps 1 and 2 are tried.**
4. ❌ **Do NOT build a phantom supply, and do NOT buy an audio interface.** Both were on the table in
   §1 and in the 09-17 note. Both are now unnecessary: the capsule never wanted 48 V.

### The one measurement only Jeff can take — and he is the expert for it

A DMM on the pink jack settles step 1 before anything is plugged in. **Ring to sleeve, DC volts, with
the machine awake.** A reading in the **~2–5 V** range means plug-in power is present and step 1 will
work. Near 0 V means skip to step 2. Jeff wired this house; this is a ten-second read for him and it
is the only thing on this page that software cannot answer.

### Software the mic needs — installed 11-10

| Machine | Tool | State | Proof |
|---|---|---|---|
| Lenovo | `audacity` 3.7.7 | 🟢 **INSTALLED 11-10** — the tool for watching the level while the gain is dialled in | `apt-get install -y audacity` exit 0; `command -v audacity` → `/usr/bin/audacity` |
| Lenovo | `arecord`, `ffmpeg`, `pavucontrol`, `alsamixer` | 🟢 already present | `command -v` on each |
| Lenovo | OBS | 🔴 not installed — and **not needed**: the Lenovo is the Claude station, the Acer is the recorder | `command -v obs` → MISSING |
| Acer | OBS Studio | 🟢 present | `Test-StudioAcer.ps1` PASS |

### Sources read for this section

Podcastage Excelvan BM-800 hands-on review; BM-800 phantom-power threads (allaboutcircuits,
tomsguide, prosoundweb); adapter pricing 11-10 from walmart.com, amazon.com, ebay.com, cdw.com,
officedepot.com. **"Delam" returns no product listing on any of them** — the box is the only source
for the kit contents.

---

## 14. THE MONITOR TREE, SOUND AND FACETIME — designed 2026-11-10 from measured limits

> 🔴 **SUPERSEDED 2026-11-13 10:30 by `OPEN_ITEMS.md` #298: THE STUDIO RUNS ON THE ACER ALONE.** 32in on the Acer's HDMI, Dell on the Acer's VGA, **24in Toshiba on a DisplayLink USB 3.0 adapter** (Wavlink WL-UG3501H, $39.99), plus the Acer's own panel = 4 screens, one computer, no Deskflow. The DisplayLink 12.3 driver is already installed on the Acer. The two-computer map below is kept only as history. **It was the wrong design:** the one-computer option was never priced against it (`COST_LEDGER.md` 2026-11-13).

Jeff, 11-10 1:09 PM: *"I just want all the software and drivers in place so it is all plug and play
when we do hook it up… three monitor tree… we only have one hdmi jack in each computer so that has
to be worked out… I want the sound quality to be top of the line and we will need to do use my
external blue tooth speaker… I also want to be able to face time on this as well… 5 monitors that
need to work together with one mouse and one keyboard."*

### The hard limit nobody can design around — measured, then confirmed against Intel

| Machine | GPU | **Max displays INCLUDING its own panel** | Authority |
|---|---|---|---|
| **Acer `JeffsLapTop`** Aspire E5-576, Core i3-8130U | **Intel UHD Graphics 620** | **3** | Intel: three-display support exists on 3rd-gen and newer; Intel Community states UHD 620 tops out at 3 monitors total. `Get-CimInstance Win32_VideoController` 11-10 |
| **Lenovo `GarageLaptop`** B570, Pentium B960 | **Intel HD (Sandy Bridge, 2nd gen)** | **2** | Intel's own support article: three simultaneous displays start at **3rd-generation**. Sandy Bridge is 2nd gen, so it is 2. `lspci` 11-10: `2nd Generation Core Processor Family Integrated Graphics` |

**So the ceiling is 3 + 2 = exactly 5 screens — which is exactly what Jeff asked for, with nothing
bought.** It is also a hard ceiling: a **6th** screen needs a USB DisplayLink adapter — ⚠️ **and it MUST go on the ACER, not “one machine” (corrected 11-11). Measured: the Lenovo has NO USB 3 at all** — both buses enumerate as `480M` ehci-pci — while the Acer has an `Intel(R) USB 3.0 eXtensible Host Controller`. DisplayLink on USB 2 is not worth owning, and **the USB-3 Kiyo belongs on the Acer for the same reason.**

### Connectors each machine actually has — read from the hardware, not a spec sheet

- **Lenovo:** `/sys/class/drm/` lists `card1-LVDS-1` (its own panel, `connected`), **`card1-HDMI-A-1`**,
  **`card1-VGA-1`**, and `card1-DP-1`. Both externals read `disconnected` today. ⚠️ The `DP-1`
  connector is almost certainly **not routed to a physical socket** on a B570 — do not plan on it.
  And it would not help anyway: the 2-display cap is the binding constraint, not the socket count.
- **Acer:** `Win32_VideoController` = UHD 620 only; **no USB-C video device, no DisplayLink, no
  Thunderbolt enumerates** (`Get-PnpDevice` matched nothing on Type-C/Thunderbolt/DisplayLink/
  Billboard). Published E5-576 port lists show **one full-size HDMI *and* one VGA**, with USB-C 3.1
  present on some SKUs but **without Thunderbolt** — so that USB-C, if this SKU even has it, should
  **not** be assumed to carry video. 🔑 **Two things must be confirmed by eye before buying anything:
  (a) is there a blue 15-pin VGA socket on the Acer, (b) does the 24" Toshiba have an HDMI input.**

### The wiring map that costs $0 and respects both caps

| # | Screen | Driven by | Cable | Why this screen goes here |
|---|---|---|---|---|
| 1 | Acer's own 15.6" panel | Acer | built-in | — |
| 2 | **32" onn Roku TV** | **Acer** | **HDMI** | Biggest screen on the machine with the most display headroom, and **HDMI carries audio** — this is the good-sound path (see below). It is `32onnRokuTV` at **192.168.1.241** in `NETWORK_MAP.md`. |
| 3 | **old Dell (VGA, no sound)** | **Acer** | **VGA** | The Dell is VGA-only and silent **by design**, which makes it the perfect match for a VGA port — VGA carries no audio anyway, so nothing is lost. Fills the Acer's 3rd and last slot. |
| 4 | Lenovo's own 15.6" panel | Lenovo | built-in | — |
| 5 | **24" Toshiba** | **Lenovo** | **HDMI** | The Lenovo can drive exactly one external, so it gets the one remaining HDMI screen. |

**Total: 5 screens, 0 adapters, $0.** The two HDMI-needing screens (onn + Toshiba) land on
*different* machines, which is precisely how one HDMI jack per laptop stops being a problem.

**If the Acer turns out to have no VGA socket,** the Dell is the screen that cannot be placed, and the
cheapest fix is a **USB→VGA/HDMI DisplayLink adapter (~$20–30)** on the Acer — a driver install, which
is prep work that can be done in advance. Nothing else in the map changes.

### One keyboard and mouse across all five — already built

Deskflow maps **machines, not monitors.** It sees `JeffsLapTop` as one desktop (3 screens wide) and
`GarageLaptop` as one desktop (2 screens wide), so the grid stays **two cells**, exactly as already
configured 11-10 (§12). Adding monitors does not add Deskflow work. ⚠️ What *does* matter: put the
`GarageLaptop` cell on the side the Lenovo physically sits on, or the mouse will cross the wrong edge.

### Sound — and the honest tradeoff on "top of the line"

**Measured on the Acer 11-10:** `BIG MAGICBOX`, `F1`, `H5 HeadSound` and `Jeff's AirPods Pro` are all
paired, and each exposes **both** an `Avrcp Transport` (A2DP, media) **and** a `Hands-Free`/`Hands-Free
AG` profile (HFP, calls).

🔑 **That dual profile is the catch, and it is why "top of the line" and "Bluetooth speaker" pull in
opposite directions:**

- **A2DP** (music/playback) sounds good — but Bluetooth adds roughly **100–300 ms of latency**. That is
  harmless for listening and **ruinous for monitoring yourself while recording**, and it shows up as
  lip-sync drift on video.
- **HFP** (what Windows switches to the moment a call app grabs the speaker) is **narrowband** — the
  quality drop is large and automatic. A FaceTime call on the BIG MAGICBOX will sound worse than the
  same speaker playing music, through no fault of the speaker.

**So the recommendation is to split the jobs rather than ask one device to do all three:**

| Job | Device | Why |
|---|---|---|
| **Capture / the voice on the recording** | the **XLR mic** into the Lenovo's pink jack (§13) | wired, zero latency, full bandwidth |
| **Monitoring while working, and best playback** | **HDMI audio into the 32" onn TV** | lossless, **zero latency**, no pairing to drop, already in the cable that carries the picture |
| **Music / casual listening** | **BIG MAGICBOX over A2DP** | where its quality shows and latency does not matter |
| **Calls** | the speaker will drop to HFP automatically — accept it, or use a wired headset | not a fault to chase |

🔴 **DO NOT move studio audio onto the Lenovo's Bluetooth.** The Lenovo's radio is already committed:
`bluetoothctl devices` on it 11-10 returns **`iDea W200`**, which is the **iDeaUSA iDeaPLAY W200 — the
grandfather clock's speaker** (OPEN_ITEMS_CLOSED #216, moved to the Lenovo 09-29, chimes play on it).
Repurposing that radio would silently break a working feature Jeff likes. **Studio audio lives on the
Acer.**

### FaceTime — what is actually possible, stated plainly

🔴 **A Windows PC cannot START a FaceTime call. There is no FaceTime app for Windows or Linux, and
there is not going to be one.** Per **Apple's own support page**, a Windows or Android device can only
**JOIN** a call from a **link created by someone on an Apple device**, opening it in the **latest
Chrome or Edge**, entering a name, and waiting for the host to admit them. **SharePlay and screen
sharing are not available** in FaceTime on the web, and the host-approval step cannot be bypassed.

**The good news: the Acer is already fully prepared for the join path. Verified 11-10:**

| Requirement | State | Proof |
|---|---|---|
| Latest Chrome or Edge | 🟢 **Edge 157.0.4341.42** | `(Get-Item msedge.exe).VersionInfo.ProductVersion` |
| Camera permitted to the browser | 🟢 **Allow**, user *and* machine scope | `ConsentStore\webcam` = `Allow` in both HKCU and HKLM |
| Microphone permitted | 🟢 **Allow** | `ConsentStore\microphone` = `Allow` |
| No policy override | 🟢 `AppPrivacy` policy key **absent** | a GPO there would silently beat the user setting |
| A camera | 🟢 `HD WebCam` present and `OK`; **Razer Kiyo Pro appears 4× with status `Unknown`** — those are stale per-port registrations from past connections, i.e. it has been plugged in before and is simply not connected now | `Get-PnpDevice -Class Camera,Image` |

**So FaceTime needs nothing installed.** The workflow: Jeff starts the call or creates the link on his
**iPhone** (`Jeff's-iPhone`, `.223` in `NETWORK_MAP.md`), opens that link on the Acer in Edge, joins.

🔑 **If he wants to *originate* video calls from the bench** — which FaceTime will never allow from
these machines — **Zoom, Google Meet, WhatsApp Web and Teams all run natively on the Acer** and can
start a call outright. That is a different ask and a real option; it is not a FaceTime workaround,
and it should not be pitched as one.

### Software and drivers put in place today — so the hookup is plug-and-play

| Machine | Installed / verified 11-10 | Proof |
|---|---|---|
| Lenovo | **`arandr`** — the GUI for dragging an external monitor into position | `command -v arandr` → `/usr/bin/arandr` |
| Lenovo | **`audacity` 3.7.7** (§13) | `/usr/bin/audacity` |
| Lenovo | `xrandr` present; desktop is **XFCE** (`xfce.desktop`, `xubuntu.desktop` via lightdm) | `command -v xrandr`, `ls /usr/share/xsessions/` |
| Lenovo | Audio stack is **PipeWire** with `wpctl` + `pactl` (no PulseAudio) — so Bluetooth routing is done with `wpctl`, not `pacmd` | `command -v` on each |
| Lenovo | Bluetooth radio live and unblocked — `ideapad_bluetooth` + `hci0`, neither soft- nor hard-blocked | `rfkill list bluetooth` |
| Acer | Edge current, camera + mic consent **Allow**, no blocking policy | table above |
| Acer | OBS, ffmpeg + Quick Sync, Claude Code 2.1.317 | §12 |
| Both | Deskflow configs written and verified; firewall and LAN path proven | §12 |

⚠️ **“PLUG-AND-PLAY” CORRECTED 2026-11-12 - the table above is true and was still not enough.**
Jeff's standard was *“all that need to be done is plug everything in and it would work form the jump.”*
Measured against it, two things were **not** ready, and both are now fixed:

1. **Voice mode was off.** `settings.json` on the Acer now reads `enabled=true mode=hold autoSubmit=true`
   (backup `settings.json.bak-20261112-210241`). As it sat, it would not have worked on first use.
2. 🔑 **The mic level was genuinely misset - and the Windows capture scalar is a dB taper, not linear.**
   It was at **95.6%**, where every word clipped. A closed-loop test (the Acer speaks and records itself) put
   speech at **0 dBFS at 85%**. Settled at **55%**: speech mean **−32.1 dB**, peak **−8.7 dB**.
   ⚠️ A quiet-room reading proves nothing here - room noise is a floor, not speech, so only speech-band
   audio can show clipping. That is why the test had to make the machine talk.

**One command at the bench now proves or disproves the whole path:**
`powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\jeffl\Studio-Voice-Check.ps1`
(source in the repo: `windows-scripts\garage-studio\Studio-Voice-Check.ps1`). Nine checks, and
🔑 **its speech step is proven in BOTH directions** - a silent garage reads **peak −34.4 dB → FAIL**, the
Acer's own voice **−9.5 dB → PASS**. **25 dB of discrimination**, so it can actually tell talking from a quiet
room rather than always going green.

🔴 **What remains is one press that cannot be done from the Beast**, because `/voice` is gated on
`!isSSH() && !CLAUDE_CODE_REMOTE` **and** on a server-side account flag (`allow_voice_mode`) that nothing local
can change. If `/voice` does not appear in the slash list, that flag is the reason - **do not debug the Acer**;
the fallback is the claude.ai tab in Edge with its mic button, already installed and permitted (measured 11-10).

### Still genuinely unknown — and they are *look at it* items, not research items

1. **Does the Acer have a VGA socket?** Published E5-576 port lists say yes, but that family shipped
   in many SKUs. A blue 15-pin trapezoid on the side settles it. **This decides $0 vs ~$20–30.**
2. **Does the 24" Toshiba have an HDMI input?** If it is VGA-only, it swaps places with the Dell and
   the map still works. If *both* are VGA-only, one DisplayLink adapter is needed.
3. **The 6th screen.** Jeff mentioned a possible 4th external. Both GPUs are at their ceiling at 5,
   so a 6th is the one case that **requires** buying a USB display adapter. Worth knowing before he
   counts on it.

### Sources read for this section

Intel support — three-display support and supported three-display configurations; Intel Community on
the UHD 620 three-display ceiling; Notebookcheck on three-display support arriving with Ivy Bridge;
LaptopMedia / Notebookcheck / laptoping E5-576 port listings; **Apple Support "Join a FaceTime call
from an Android or Windows device"** for the join-only limitation, browser requirement and the
SharePlay/screen-sharing exclusion.
