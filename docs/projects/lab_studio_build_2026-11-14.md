# THE LAB — microscope rig, light grid, and one brain that runs all of it

**Jeff's brief, 2026-11-14:** *"make sure all of this is connected and works together and is
completely automated with HA and the studio driver on the Acer. The biggest is the lighting has to
be controlled by the studio driver… The big key here is integration and imagination."*

Supersedes nothing. Builds on **#282** (the bench), **#298** (the screen map), **#287** (the Studio tab).

---

## 0. WHAT IS ACTUALLY TRUE THIS MORNING — measured 2026-11-14 07:44–07:46, not assumed

| Thing | State | How it was proven |
|---|---|---|
| **DisplayLink driver** | ✅ **ALREADY INSTALLED — 12.3.5011.0** | Uninstall registry on the Acer |
| WAVLINK / any USB display hardware | ❌ **NOT PLUGGED IN** | no `VID_17E9`, no `VID_534D` present |
| 3 × `MS Idd Device` | present with no hardware behind them | the DisplayLink driver's indirect-display stubs → the #299(b) orphan |
| Screens live right now | **2 only**: `BOE` internal panel + `TSB / TOSHIBA-TV` | `WmiMonitorID` |
| 32in onn (Miracast) | **not connected at this moment** | absent from the monitor list |
| Dell | **not connected** | absent from the monitor list |
| Microscope | **not plugged in** | imaging list holds only `Razer Kiyo Pro` + internal `HD WebCam` |
| Kiyo Pro | ✅ OK, `VID_1532`, dshow `USB Video Device` | PnP + DirectShow |
| OBS Studio | ✅ **33.0.1** — has obs-websocket built in | install path + Uninstall registry |
| **Mosquitto MQTT `192.168.1.66:1883`** | ✅ **reachable from the bench** | `Test-NetConnection` → True |
| **Home Assistant `:8123`** | ✅ reachable from the bench | `Test-NetConnection` → True |
| 🔑 **Light at the bench** | 🔴 **YAVG 48.9 / 255 = 19 % — DARK** | `ffmpeg … signalstats`, 20 frames, min 30.8 / max 59.4 |

**That last row is the whole justification for the lighting job, and it is a measurement.**

---

## 1. ANSWER TO "DID YOU LOAD THE PICTURE-3 SOFTWARE"

**The DisplayLink driver is already on the Acer — 12.3.5011.0. I did not install it; it predates
this session.** What is *not* there is the hardware: no DisplayLink and no MacroSilicon device is
present. So if the WAVLINK arrives, it should come up on the driver that is already loaded.

**And per #298 you probably still do not need it.** With the microscope added, the pipe budget is:

| Screen | Path | Intel pipe used |
|---|---|---|
| Internal panel | LVDS | 1 |
| Toshiba | the Acer's own HDMI | 2 |
| **Dell — DEDICATED TO THE MICROSCOPE** | the Acer's VGA | 3 |
| 32in onn | **Miracast — wireless** | **0** |

Intel UHD 620 caps at **3 physical pipes**, and that is exactly 3. **Four screens, no dongle, $0.**
~~The WAVLINK only earns its keep if the Dell has no VGA input~~ — **settled 11-14: it HAS one.**

### ✅ THE DELL IS IDENTIFIED — `P2012Ht` = Dell P2012H (Jeff photographed the label 11-14)

| Spec | Value | Why it matters here |
|---|---|---|
| Panel | **TN**, 20 in | 🔑 **TN washes out worst viewed from ABOVE** — exactly the axis of a recessed bench monitor. **The recess must tilt by sinking the BACK edge ~1 in.** Not optional. |
| Native | **1600 x 900 @ 60 Hz** | 🔑 **Run the OBS Source projector at 1600x900, NOT 1080p** — anything else makes the panel rescale fine traces. Note this is BELOW 1080p: a 1080p scope feed loses real detail on this screen. Free monitor, honest trade. |
| Inputs | **DVI-D · VGA · USB-B** | **VGA confirmed → $0, no adapter, WAVLINK stays withdrawn.** 1600x900 over analog VGA is clean. DVI-D is a sharper digital path IF the Acer HDMI pipe ever frees — it has not, and this does **not** reopen the onn. |
| Other | 5 ms · 250 cd/m² · 1000:1 · ~92 ppi · **built Oct 2011** · 11.9 W | 15 years of backlight on it. Build the recess as a **drop-in from above**, not a fixed frame, so swapping it is not demolition. |

*Verified by search 11-14 against Dell’s own user manual (panel type + native resolution), no
conflicting figure found; brightness/contrast/ppi from retailer and aggregator listings.*

---

## 2. THE MICROSCOPE RIG — build picture 2 from parts you own

### 2a. The architecture decision, and it is the important one

**Do NOT wire the microscope straight into the Dell.** That is how the AD409 works and it is the
AD409's one real limitation: the computer never sees the image.

```
  ❌ DUMB:   microscope ──HDMI──> Dell          (a picture, and nothing else)

  ✅ RIGHT:  microscope ──> ACER ──> OBS ──┬── Fullscreen Projector ──> DELL  (same picture)
                                           ├── recording          (every repair, on disk)
                                           ├── still hotkey       (timestamped board photos)
                                           ├── PiP with the Kiyo  (your face + the board)
                                           └── a frame published  (SO I CAN LOOK AT THE BOARD)
```

Same picture on the Dell either way. The right one costs nothing extra and buys four more things —
including the one I care about most: **you can show me what you are looking at.**

### 2b. How the scope gets into the Acer — depends on the $17 unit

| If the scope outputs… | Route | Cost |
|---|---|---|
| **USB (UVC)** | straight into the Acer, shows up in DirectShow, OBS "Video Capture Device" | **$0** |
| **HDMI only** | HDMI → **USB capture dongle** → same path | $0 **if the MacroSilicon dongle is still in a drawer** |

🔑 **The MacroSilicon dongle (`VID_534D`) that #284 called a PROVEN DEAD END was a dead end as a
*display adapter*. That chip family is an HDMI→USB *capture* device — which is exactly this job.**
It is not plugged in anywhere right now. If you still have it, it may be the $0 answer. If not,
this is a cheap part and I will price it rather than name one from memory.

### 2c. The mechanical half — where this build actually succeeds or fails

At 300X the depth of field is well under a millimetre, and **vibration is the enemy, not light.**

🔴 **Do not hang the scope off a long overhead 2x4 span.** A cantilevered boom rings like a diving
board; every tool you set down will make the image jump, and it will be maddening. Look at picture
2 again — Andonstar clamps a **short, stiff post to the bench top**, so the scope and the work sit
on the same mass and move together.

**Recommendation:** lighting goes overhead on the booms; **the scope gets its own short post
clamped to the bench.** If you want it on the boom anyway, **triangulate** — one diagonal brace
from the boom back to the wall or a post turns a cantilever into a truss and kills most of the ring.
You know this better than I do; I am flagging it because it is the part that is annoying to
discover after it is built.

**The genuinely good idea to steal from picture 2 is the slide rail** — it lets you track across a
board without re-aiming. A drawer slide or a length of extrusion does the same thing cheaply.

---

## 3. THE LIGHT GRID — what makes it look professional

Black 2x4 booms are the right call: cheap, rigid, and dark. **Paint them FLAT black, not satin** —
satin throws specular hot spots straight into the Kiyo.

### 3a. Three things separate "studio" from "webcam in a garage"

1. **Diffusion.** Bare strip looks cheap on camera. In aluminium channel with a frosted lens, or
   bounced off white board, it turns into a big soft source — which is what expensive light *is*.
2. **Separation.** A rim light behind you so you do not melt into the background. Biggest single
   upgrade per dollar, and it is one short run of strip.
3. **Everything else flat black.**

### 3b. Zoning the 25 ft — four zones, 24 ft, and that is a good sign the reel is the right size

| Zone | Length | Where | Job |
|---|---|---|---|
| **KEY** | ~8 ft | boom, camera-LEFT, angled ~45° down, diffused | the main light on your face and hands |
| **FILL** | ~6 ft | camera-RIGHT, bounced or run at ~30 % of key | softens the shadow without killing it |
| **RIM** | ~4 ft | rear boom, behind + above you, onto your shoulders | the separation that reads as "professional" |
| **BENCH TASK** | ~6 ft | directly over the work, straight down | so you can see solder |

**Colour temperature, and it matters for electronics:** the **bench task zone wants neutral-to-cool
(4000–5000 K)** so solder joints and resistor bands read true. **Key/fill on your face look better
warmer (3200–4000 K).** If the reel is CCT-tunable or RGBW you get both; if it is fixed white, you
get whatever it is — which is fine, but it is worth knowing before it goes up.

### 3c. 🔑 BLOCKED ON ONE ANSWER — what IS the 25 ft?

The controller is picked entirely by this and nothing downstream can be finalised without it:

| If the strip is… | Control |
|---|---|
| **Addressable (WS2812 / WS2815)** | 🏆 **best case** — ONE ESP32 runs all four zones as WLED *segments* |
| 12 V / 24 V single-colour | a PWM channel per zone |
| 12 V / 24 V RGB / RGBW | an RGB controller per zone |
| 120 V AC rope | on/off only — a smart plug, no dimming |

**A photo of the reel or its label settles it in one shot.**

### 3d. The controller: WLED on an ESP32

Not a product recommendation — **WLED is free software and you already flash ESP32s** (the mower
hours box is yours). It is the right answer here specifically because:

- **native HA discovery** — the zones appear as HA lights with no YAML, which matters because of the
  known `script:`/`scene:` include gap on Beehive (`reference_ha_yaml_include_gap`)
- a plain **HTTP/JSON API** the studio driver can drive directly, plus MQTT
- **segments** = four zones from one board, if the strip is addressable

I will price the board and the power supply in-session rather than quoting a part from memory.

---

---

## 0b. 🖼️ JEFF'S POSTER IS THE GUIDE — with two corrections, both measured

**Jeff, 2026-11-14 8:01 AM: "Us this as a guide."** The "JEFF ELECTRONICS REPAIR STUDIO — REUSE
FIRST / ADD ONLY WHAT'S NEEDED" poster is now the target layout. Its zones: red cabinet workbench ·
ESD mat as the primary repair surface · monitors + Acer · mic on the existing boom · scope on the
Dell · Razer on a boom overhead. **Its philosophy matches this project's: reuse first, buy last.**

### ❌ CORRECTION 1 — the poster's scope is NOT the scope Jeff bought. DO NOT BUY THE CONVERTER.

Poster items 5 & 6 read **"Andonstar AD409 SA — HDMI Out → Dell Monitor"**, and its buy-list offers
an **"Active HDMI-to-VGA converter."** The AD409 was only ever Jeff's *example* (picture 2 of his
11-14 message). What he actually bought, for $17, is the **Jiusion 40-1000x, USB 2.0**.

**There is no HDMI anywhere in the scope path.** That buy-list line is dead, and any future session
that acts on the poster literally will send Jeff after a converter he cannot use. The real path:

```
  Jiusion ──USB──> Acer ──OBS──> Fullscreen Projector ──VGA──> Dell
```

### ✅ CORRECTION 2 — the poster moves the Kiyo OVERHEAD, and that is the better call

The poster labels the Razer **"on boom, Overhead Bench View"**, which contradicts the earlier record
(*"Overhead 'mat cam': iPhone on the spare boom arm. Wide/face cam: Kiyo Pro at 103°"*). **The
poster is newer and it wins.** 103° is genuinely excellent top-down, and it dissolves the iPhone
problem — iPhone-as-webcam on *Windows* is not Continuity Camera (macOS only) and needs a helper app
that is not in the record. Talking head becomes **the Acer's own built-in `HD WebCam`**, measured
present 11-14. ⚠️ Honest limit: a lid camera is visibly softer than the Kiyo — fine as a cutaway,
weak as a primary face shot. **$0 either way, and nothing is bought to find out.**

| Poster zone | Camera | Status 11-14 |
|---|---|---|
| Overhead / bench view | **Razer Kiyo Pro on the boom** | ✅ measured working on the Acer (`VID_1532`) |
| Talking head | **Acer built-in `HD WebCam`** | ✅ present; quality unproven on camera |
| Detail / close-up | **Jiusion USB scope** | 📦 **lands week of 2026-11-16**; `Test-Microscope.ps1` waiting |

### ⚠️ CORRECTION 3 — "use existing lighting" was measured, and it is not enough

The poster's Lighting Plan says *"Use existing overhead & bench lights"* and treats the 4 ft task
light as optional *"if dim."* **It is dim — measured, not guessed: `YAVG 48.9 / 255 = 19 %`** against
a lit-studio band of 100-140. So that optional line resolves to YES.

🟢 **The poster's "5000K, CRI 90+" is the most important spec on it, and it is correct.** For
electronics specifically: low-CRI LEDs collapse brown, red and orange into near-identical shades —
which is exactly the 4-band resistor problem. CRI 90+ here is not videography fussiness, it is
whether Jeff can read a resistor under his own bench light.

---

## 3b. 💡 DIFFUSERS — priced 11-14, because Jeff is ordering before the scope lands

**Jeff, 11-14: "I will need to order some cheap studio light defusers or make some."**

### The principle that saves the most money
**Softness = the APPARENT SIZE of the source relative to the subject — not the material.** A 4 ft
strip 18 in from the board is soft; the same strip with the same diffuser at 6 ft is hard. Doubling
the distance halves apparent size. **The cheapest softness upgrade is moving the light closer, $0.**
Material is the last 20 %.

### 🟢 The $0 answers, and they use the carpentry Jeff is already doing
1. **Trough + white paint, in the boom itself.** Build a shallow trough in the black 2x4, paint the
   INSIDE white, aim the strip UP into it. Nothing ever sees a diode. That is *indirect*, which is
   softer than any purchased diffuser, for the price of paint on hand. It is the fix for "bare strip
   reads cheap on video" — the camera is seeing a row of hot dots, and this removes them entirely.
2. **Bounce the FILL, do not diffuse it.** White poster board or a white-painted scrap, light aimed
   into it. Softest light available, $0, and it lands near the 30 %-of-key target without dimming.

### Verified retail, 2026-11-14 (searched this session — not recalled)
| Item | Price found | Verdict |
|---|---|---|
| Aluminum channel **+ frosted cover** | **$2.50-$3.70 / ft** | 24 ft = **$60-89.** Too much for all 4 zones |
| **Frosted cover only** (Lee Valley 36 in $4.60 · 72 in $8.60) | **$1.20-$1.43 / ft** | the smart buy |
| Diffusion fabric, 2 yd x 60 in (Neewer, Best Buy) | **$22.99** | one piece covers every zone |
| White shower-curtain liner | a few dollars | a DIY guide names it among the best options |

**Recommendation: buy channel + cover for the BENCH TASK zone only** — that is the one in frame over
the work and it should look clean. Key, fill and rim live overhead on black booms where nobody sees
them: trough + paint, or fabric on a scrap frame.

### ⚠️ Budget for the light diffusion EATS
Diffusion typically passes only a third to a half of the output. The bench is **already at 19 %**, so
plan to run the strips harder after diffusing. **This does not have to be guessed** — the luma check
that produced 48.9 can be re-run before and after, and give a number.

## 4. THE LIGHT METER — the imagination answer, and it is already proven

You asked for *"some kind of either diy or cheap light meter to fire the lights when needed."*

### 🏆 **The Kiyo IS the light meter. It is $0, and it already works.**

```
ffmpeg -f dshow -i video="USB Video Device" -vf signalstats … YAVG
   →  2026-11-14 07:46:40   YAVG 48.9 / 255  = 19 %   "DARK"
```

**That ran on your bench this morning.** One number, 0–255, sampled off the live feed.

**Why this beats a lux puck for this job:** it measures the light **at the camera, in frame** — the
only place it matters. A sensor on the wall measures the wall. And because it is a closed loop, the
driver can **drive the lights up until YAVG hits target** — auto-exposure for the whole room, in
about forty lines of code. A studio target is roughly **YAVG 100–140**; you are at 48.9.

### ⚠️ Its one blind spot, stated plainly

**The camera cannot tell you the room is dark while the camera is off.** So it cannot do
"walk in, lights come on." For that, one of:

- **$0:** the garage door contact + the Acer's session being awake = you are out there
- **cheap, and the robust one:** a Zigbee motion sensor at the door — you already run Z2M with a
  dongle. Worth the small money because it works when everything else is asleep. **Price owed —
  I will not name a model from memory.**

**Use both: the Zigbee sensor says *someone is here*, the camera says *how much light it needs*.**

---

## 5. THE BRAIN — `hcc-studio`, one service on the Acer

A small Python service that owns **"what the lab is doing right now"** and tells everything else.

```
                       ┌──────────────────────────────────────┐
   Kiyo luma  ────────>│                                      │──────> WLED  (4 zones, HTTP)
   Zigbee motion ─────>│          hcc-studio  (Acer)          │──────> OBS   (obs-websocket 33.0.1)
   garage door ───────>│   owns the MODE, nothing else does   │──────> the Dell (fullscreen projector)
   OBS state  ────────>│                                      │──────> MQTT discovery ──> HOME ASSISTANT
                       └──────────────────────────────────────┘                             (auto-creates
                                                                                              every entity)
```

**It publishes MQTT discovery, so HA creates the entities itself — no `configuration.yaml` edit,
which sidesteps the Beehive include gap entirely.** Everything lands in the existing Studio tab (#287).

| Entity | What it is |
|---|---|
| `select.studio_mode` | OFF · BENCH · MICROSCOPE · RECORD · MICROSCOPE+RECORD |
| `light.studio_key / fill / rim / task` | the four zones, dimmable |
| `sensor.studio_frame_luma` | the live YAVG — the light meter, as a number in HA |
| `binary_sensor.studio_recording` | is OBS rolling |
| `camera.studio_microscope` | last scope frame — **this is how I get to see the board** |

### The modes, and what each one physically does

| Mode | Lights | Screens | OBS |
|---|---|---|---|
| **BENCH** | task 100 %, key/fill low | normal desktop | idle |
| **MICROSCOPE** | 🔑 **task up, key+fill DOWN** — glare off a glossy board is the enemy | **scope full-screen on the Dell** | scope scene |
| **RECORD** | key + fill + rim up to hit **YAVG ≈ 120** | 32in = program out | rolling |
| **MICRO+RECORD** | both, scope as the A-cam | Dell = scope, 32in = program | rolling, PiP |
| **OFF** | all down after a delay | — | stopped |

### Triggers

- motion at the door → **BENCH**
- OBS starts recording → **RECORD** (the driver watches OBS, so hitting record *is* the switch —
  no extra button, per your own rule that a feature needing you to remember it is not finished)
- microscope mode selected → scope to the Dell, lighting flips
- **luma below target while recording → trim the lights up automatically**
- garage door closes / no motion for N min → **OFF**

### Rules this build obeys

- 🔴 **Nothing here touches Blink / go2rtc / HomeKit / the AI scanners.** Separate MQTT namespace,
  separate service. The camera freeze is respected.
- 🔴 **No notifications 10 PM – 6 AM.** Lights still work; that rule is about pushes.
- 🔴 **No light in the lab gets fired to "test it" without telling you first.**

---

## 6. ⚠️ SOMETHING I FOUND — not touching it, flagging it

`docs/incidents/camera_fixes_2026-08-21.md` records that go2rtc **on the Beast** carries a
**`front_yard` stream that is the Kiyo webcam**, set up 08-15, with an explicit *"do not remove
that one"* note.

**The Kiyo is now on the Acer, in the garage.** That Beast stream points at hardware that has
physically moved and may be erroring right now. **It is inside the frozen stack, so I have not
touched it and will not without your word** — but someone is going to trip over it.

---

## 6b. THE THREE CAMERAS — your poster's layout was already decided in the record

Your design poster calls for three angles: **overhead repair view · talking head · detail close-up.**
Searching the record for "microscope" on 11-14 found that exact split already settled in an earlier
studio plan, verbatim:

> *"Overhead 'mat cam': iPhone on the spare boom arm. Wide/face cam: Kiyo Pro at 103°.
> Close-up: magnifier for now; a digital microscope later."*

**So there is no third camera to buy.** The $17 Jiusion IS the "digital microscope later" arriving,
and the overhead was answered with hardware you already carry.

| Poster zone | Camera | Status |
|---|---|---|
| Overhead / repair view | **iPhone on the spare boom arm** | settled in the record; needs Continuity-Camera-or-app proving on the Acer |
| Talking head | **Razer Kiyo Pro at 103°** | ✅ measured working on the Acer 11-13 (`VID_1532`) |
| Detail / component close-up | **Jiusion USB scope** | ✅ USB confirmed 11-14; `Test-Microscope.ps1` ready to prove it |

⚠️ **The one unproven link is the iPhone, and it is unproven for a specific reason:** iPhone-as-webcam
on *Windows* is not Continuity Camera — that is macOS only. On the Acer it needs a helper app over
USB or Wi-Fi, and nothing in the record shows one installed. **Not a blocker, not a purchase — just
the next thing to measure.** Until it is proven, OBS runs two cameras and the overhead is a gap.

🔬 **The scope's own light is outside the grid.** The Jiusion's 8 LEDs are driven by a **mechanical
wheel on the barrel** — no software, no USB command. In MICROSCOPE mode `hcc-studio` dims the key
and fill and raises the bench task light, but the ring stays wherever your hand left it. Stated
plainly so it is not discovered as a bug later.

🖥️ **And the name collision, which would have cost an hour:** the Kiyo already enumerates on the
Acer as the generic DirectShow name `USB Video Device`. A no-name UVC scope will very likely claim
the *same* name, and OBS then binds whichever it finds first — silently, with no error.
`windows-scripts/garage-studio/Test-Microscope.ps1` detects the duplicate explicitly and resolves
identity from the PnP vendor id instead, because the vendor id is permanent and the name is not.

---

⚠️ **This grid is NOT the Kasa lighting plan and must never be merged with it.** Re-read
`docs/lighting/kasa_smart_lighting_project_2026-08-06.md` 11-14 to be sure: that project is
**mains wall switches** (HS220 dimmers / HS200, auto-update deliberately OFF to keep local control,
the HS210 the one device HA cannot protect). The lab grid is **low-voltage strip on its own
controller** — a different circuit, a different protocol, a different failure mode. Nothing here
changes a room switch, and nothing here re-opens a settled switch decision.

---

## 7. THE ONE ANSWER I STILL NEED — everything else proceeds without them

1. **The 25 ft of LED — what is it?** (addressable / 12 V / 24 V / 120 V rope; white or colour)
   A photo of the reel label settles it. **This picks the controller.**
2. ~~The $17 microscope — USB or HDMI?~~ ✅ **ANSWERED 11-14: Jiusion 40-1000x, USB 2.0.**
3. ~~The Dell — model, and does it have a VGA input?~~ ✅ **ANSWERED 11-14: `P2012H`, 20in TN,
   1600x900, VGA present → $0.** See the table in § 1 — the TN finding changes the recess.
4. **Picture 4 never attached.**

---

## 8. BUILD ORDER

| # | Step | Blocked on | Cost |
|---|---|---|---|
| 1 | Dell onto the Acer's VGA, confirm 3 physical pipes | nothing — **#298 already owes this** | $0 |
| 2 | Microscope into the Acer, OBS source, projector onto the Dell | **nothing — Q2 answered, it is USB** | **$0** |
| 3 | `hcc-studio` skeleton: MQTT discovery + live luma into HA | ✅ **DONE 11-14 — running unattended, see § LIVE STATE** | $0 |
| 4 | OBS control (obs-websocket) + the mode machine | step 3 | $0 |
| 5 | Booms built, strip in channel, four zones hung | Jeff's carpentry | lumber |
| 6 | WLED flashed, zones mapped, wired into the driver | Q1 | board + PSU |
| 7 | Motion sensor at the door | priced, not yet named | small |
| 8 | Close the loop: luma target drives the lights | 3 + 6 | $0 |

**Step 3 is buildable right now with zero purchases and zero unknowns** — and it is the keystone,
because once luma is a live number in HA, every later step has something real to aim at.


## ✅ LIVE STATE — 2026-11-14 10:3x (step 3 of the build order is DONE)

**The studio driver is running unattended and the lab is on the house map.**

| What | Where | Proof |
|---|---|---|
| Driver code | `C:\Users\jeffl\HCC-Scripts\hcc-studio\hcc-studio.ps1` (Beast + Acer). **Outside the public repo on purpose** — it reads the HA token from `HCC-secrets`. | deployed by scp, run on the Acer |
| Scheduler | task **HCC Studio Driver** on the Acer (`Install-StudioTask.ps1`): every 5 min + at logon, hidden via `Run-Hidden.vbs`, IgnoreNew, 10-min limit, runs on battery (it is a laptop) | **heartbeat advanced 10:25:08 → 10:30:08 CST with nobody running it** (read from `/api/states` at 10:32) |
| HA entities (MQTT discovery, retained, `expire_after: 900`) | `sensor.hcc_studio_studio_driver_heartbeat` · `sensor.hcc_studio_bench_light_level` (%) · `sensor.hcc_studio_bench_luma_yavg` · `binary_sensor.hcc_studio_bench_lit_for_camera` (YAVG ≥ 100) · `sensor.hcc_studio_bench_meter_status` · `binary_sensor.hcc_studio_obs_control_channel` | all six read back live; bench = 19 % / YAVG 47.8 = DARK, as measured at 07:46 |
| Camera choice | refuses the built-in `HD WebCam` (it lists FIRST); prefers Kiyo/Razer → `USB Video Device` | `Resolve-BenchCamera` |
| OBS holding the Kiyo | heartbeat + `meter_status` still publish with the reason; the luma just pauses | by design — the heartbeat never depends on the camera |
| **House map** (`docs/house-plan`, `?v=20261114a`) | **81 Acer moved to the bench** · **87** Studio Driver · **88** Kiyo + light meter · **89** Dell P2012H · **90** Jiusion scope · **91** 32in onn · **92** bench lights · new category **Lab & Studio**. 87/88 + 81 carry live lamps; 89-92 have no HA entity yet and show none (honest). | Playwright, 7 scenarios at 1536×864 against the real states dump: Acer off → 81/87/88 **black**; OBS recording → 88 grey "meter paused"; heartbeat 20 min → amber, 45 min → **red**; dark bench → 88 black, lit → green; 0 page errors |
| Map fix found on the way | **#37/#40 drew RED on a healthy house** — they watched `switch.ac_relay`, which left HA when the SONOFF retired 10-26. Now 37 = no lamp (unit does not report), **39 = `climate.hcc_thermostat`** (off = black), 40 = retired note. The duct airflow keyed off the same dead switch and could never draw; it now keys off `sensor.hcc_thermostat_cooling`. | same harness: problems list went from 3 to just the stubbed mower |

**Still owed (row #300):** obs-websocket on the Acer + the OBS scenes/projector · the light actuator
(waits on the LED reel label) · bench spots on the map are provisional until the bench is taped.
