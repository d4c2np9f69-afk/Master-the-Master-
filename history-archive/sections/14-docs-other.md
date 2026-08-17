## The Other Papers — lighting, Lucky Mike, inventory, heroes, config trees

This section covers everything in the repo that is *not* the app itself and not the
utilities/mower/beehive-operations papers: the lighting and mesh plan, the Lucky Mike Smart
Stall business file, the hardware inventory and network census, the hero-image style
apparatus, the Home Assistant configuration snapshot, the ESPHome/custom-component
snapshots under `beehive/`, the mower firmware directory, the Cloudflare `_headers` file,
the dead GitHub Actions workflow, and `dev.html`.

These are the papers that record what Jeff *bought*, what he *decided*, and what he
*rejected* — which is why several of them carry the most expensive lessons in the project.
The single most costly documentation failure in the whole record lives in this section
(the Inovelli scrap notice), and so does the single largest wasted-money near-miss (buying
$120 of dimmers to do a job a $10 plug does better).

---

### 14.1 `docs/lighting/` — the smart-lighting and Zigbee-mesh file

Five files at tip, plus two PDFs:

| File | Bytes | Last touched | Commit |
|---|---|---|---|
| `HCC_Lighting_Plan.html` | 28,114 | 2026-08-13 | `6c90202` |
| `HCC_Lighting_Plan.pdf` | 134,066 | 2026-08-13 | `6c90202` |
| `HCC_Floorplan_DRAFT.html` | 13,307 | 2026-08-13 | `29c7a1a` |
| `HCC_Floorplan_DRAFT.pdf` | 109,037 | 2026-08-13 | `29c7a1a` |
| `bedroom_wiring_plan_2026-08-06.md` | 2,009 | 2026-08-08 | `ac38933` |
| `kasa_smart_lighting_project_2026-08-06.md` | 7,534 | 2026-08-14 | `09de34b` |
| `zigbee_dimmer_selection_2026-08-13.md` | 3,093 | 2026-08-16 | `1572b4a` |

Full commit history of the directory (`git log -- docs/lighting`):

```
1572b4a 2026-08-16  Record that Inovelli was SCRAPPED on price - it was never written down
09de34b 2026-08-14  Lighting: living room HS220 installed and in HA (192.168.1.178); new-firmware
                    onboarding notes; auto-update disabled via HA toggle the app hides
8b7a69a 2026-08-13  Lighting: Jeff pulled dedicated LED circuits + multi-gang boxes - closes
                    neutral and box-fill open items
c722076 2026-08-13  Lighting: fans confirmed separate from all LED circuits - dimmers safe
                    everywhere (Jeff confirmed)
29c7a1a 2026-08-13  Lighting: first-draft floor plan with device overlay (traced from Sharky
                    LIDAR; guest bed + office unmapped, awaiting Jeff's markup)
6c90202 2026-08-13  Lighting: printable build plan + wiring/mesh diagrams (HTML + PDF);
                    remove temp fix.txt
a5c67a8 2026-08-13  Lighting: Zigbee dimmer selection research - Enbrighten 43080 rejected for
                    documented mesh-routing defects, Inovelli Blue selected (dumb-3-way confirmed)
ac38933 2026-08-08  Log Jeff's smart lighting plan, flag one real issue before ordering
```

#### 14.1.1 `HCC_Lighting_Plan.html` — THE authoritative plan, Rev. Aug 13 2026

This is the document `CLAUDE.md` names as authoritative:

> **📄 THE AUTHORITATIVE DOCUMENT IS `docs/lighting/HCC_Lighting_Plan.html` (+ PDF), Rev. Aug 13 2026.**
> Printable, with wiring diagrams and the device map — Jeff asked for it specifically to hang in the
> workshop. **Read it before proposing anything about lighting or mesh.**
> — `CLAUDE.md`, "SETTLED DECISIONS — DO NOT RE-PROPOSE THESE (PROTECTED)"

It is a single self-contained HTML file with print CSS (`@page { size: letter portrait; margin: 0.5in; }`),
inline SVG diagrams, and three page-break sections. The masthead reads:

> Rev. Aug 13 2026 · Loewen · White House TN
> **SMART LIGHTING & ZIGBEE MESH**
> Build plan · wiring · device map — Home Assistant "Beehive"

**Page 1 — the strategy.** The thesis of the whole plan is a two-job / two-budget split, quoted
verbatim from the file:

> **Job 1 · Light Switches → Wi-Fi (Kasa)** — Kasa HS220/HS200 run **fully local** in Home Assistant
> through the `python-kasa` integration — no cloud, no hub, no account needed for on/off/dim. At ~$15
> they do the lighting job for a fifth the price of a mesh-grade switch.
>
> **Job 2 · Mesh Range → Zigbee Plugs** — Mesh repeaters do **not** have to be switches. Every
> mains-powered Zigbee plug is a router. At $8–12 each they extend the mesh *and* replace the four
> vendor-locked Sylvania plugs that can never enter HA.
>
> **Why not a $46 mesh dimmer:** the switch was only being asked to repeat the mesh — a job a $10 plug
> does better. Buying them separately costs half as much and solves the Sylvania problem at the same time.

**The shopping list, verbatim from the table (~$104 total):**

| Item | For | Qty | Each | Total | Status |
|---|---|---|---|---|---|
| **Kasa HS220** dimmer | Bedroom · Kitchen/Dining · Living room | 3 | $15 | $0 | 2 on hand |
| **Kasa HS220** dimmer | 3rd room (only if a 3rd is wanted) | 1 | $15 | $15 | buy |
| **Kasa HS200** switch | Garage lights (non-dim) | 1 | $15 | $15 | buy |
| **Zigbee plug** (4-pack) | Replace 4 Sylvania · mesh routers | 4 | ~$10 | $40 | buy |
| **Zigbee plug** — garage | Mesh relay through the garage wall | 1 | ~$10 | $10 | buy |
| **Zigbee contact sensors** | Garage door: CLOSED + FULLY-OPEN | 2 | ~$12 | $24 | buy |
| Zigbee coordinator dongle | Haozee CC2652P1 + USB extension | 1 | — | $0 | ordered |
| **Estimated total** | | | | **~$104** | |

Caption under the table, verbatim:

> Prices are estimates — verify each Zigbee model against its Zigbee2MQTT device page before ordering
> (see Rules, page 3).

**Room schedule, verbatim:**

| Room | Fixtures | Load | Switch positions | Device |
|---|---|---|---|---|
| **Bedroom** | 9 × 12 W ProGreen LED | 108 W | Door box only (2 toggles repurposed) | Kasa HS220 |
| **Kitchen + Dining** | 9 × 12 W (3-group + 6-group combined) | 108 W | 1 of 3 existing; 2 come out | Kasa HS220 |
| **Living Room** | 8 × 12 W LED | 96 W | 1 existing | Kasa HS220 |
| **Garage** | 8 × LED, not dimmed | 96 W | **2 locations** — kitchen + garage | Kasa HS200 (see note) |

**The one open decision on page 1, verbatim in its warning box:**

> **Open decision — garage two-location switching.** A single HS200 cannot serve two switch positions;
> the second position goes dead. Choose one: **(a)** HS210 matched kit so both positions stay live, or
> **(b)** single HS200 at the garage door and repurpose the kitchen position for something else — the
> same trick already used on the bedroom toggles. *Decide before ordering.*

And the standing pre-power-up rule, verbatim:

> **Before first power-up:** install the Kasa app and **turn OFF automatic firmware updates before
> adding any switch.** TP-Link firmware has previously broken local control — and local control is the
> entire reason these are being used.

**Page 2 — wiring diagrams.** Legend, verbatim:

> BLACK — constant hot · WHITE — neutral (unswitched, full length) · SWITCHED LEG — load out ·
> GROUND — bonded, never a circuit conductor

The bedroom SVG draws a three-box chain: PANEL (15 A ckt) → **DOOR BOX — ORIGIN** (Kasa HS220; splice
line hot + chain BLK; splice all neutrals + LED WHT; LOAD OUT → 9 LEDs · 108 W; "single-pole · no S1/S2 ·
no module") → **MIDDLE BOX** (old 4-way REMOVED; EXISTING TOGGLE, "dumb · no WiFi · no HA"; OUT → this
box's RECEPTACLE hot only; "BLK passes through to bedside, unaffected by this switch") → **BEDSIDE —
END OF RUN** (old dimmer REMOVED; EXISTING TOGGLE dumb; OUT → this box's RECEPTACLE hot only; "swap
20 A → 15 A recept."; "old feed tap fully removed"). Caption, verbatim:

> Bedside was originally the power origin — the feed is reversed so the door box originates. The two old
> toggles are not blanked off: each now controls only its own box's receptacle, entirely independent of
> the lights and of each other.

The kitchen SVG is a BEFORE/AFTER: before = `dimmer → 3 LEDs`, `dimmer → 6 LEDs`, `garage 2-way leg`;
after = one KASA HS220 driving `all 9 LEDs · 108 W` plus a retained `garage position` ("stays — see
decision"), with **"2 openings freed"** annotated in red and "blank or repurpose as switched receptacle,
same as bedroom" beneath.

The garage SVG shows KITCHEN position and GARAGE position ("by the man door") both feeding 8 GARAGE LEDs
(96 W · not dimmed), with the caption in warning colour: **"One HS200 kills the other position."** /
"HS210 kit keeps both live — decide first."

Page 2 closes with the safety box, verbatim:

> **Before any box is opened:** breaker OFF · verify dead at *all three* bedroom boxes · confirm a
> neutral is present at the kitchen and living-room boxes (assumed, not yet photo-verified) · confirm the
> switched conductor reaches the fixture junction before final connection. Grounds bond throughout and
> are never used as circuit conductors.

**Page 3 — mesh + device map.** The mesh SVG runs COORDINATOR (Haozee CC2652P1, "on Beehive · ch 25") →
LIVING RM PLUGS (4 × Zigbee · ROUTERS, "replace Sylvania") and HALLWAY / MID-HOUSE (optional relay hop) →
GARAGE PLUG (ROUTER — "pushes signal past the wall") → DOOR SENSOR — CLOSED, DOOR SENSOR — FULLY OPEN,
and a dashed FUTURE SENSORS box (leak · smoke · motion · freeze). Caption, verbatim:

> **Mains-powered = router** — relays messages for everything else. **Battery-powered = end device** —
> talks only to its nearest router, never relays. This is why adding plugs strengthens the network and
> adding sensors does not.

And the two-sensor rationale, verbatim:

> **The garage door gets two sensors, not one.** One reads CLOSED, the other reads FULLY OPEN. With both,
> Home Assistant can tell the three real states apart: **closed**, **fully open**, and **partially open**
> — the cracked-for-ventilation position, which a single sensor can never distinguish from wide open.

The page-3 device map is the compact version of the network census (full version in
`docs/inventory/NETWORK_MAP.md`, §14.3.2):

Infrastructure — `.254` AT&T BGW320-500 gateway · `.66` **Beehive** — Home Assistant (fixed) ·
`.194` **The beast** — main PC / CodeProject.AI · `.196` RE200 — wired access point · `.121` GaragePC —
HP TouchSmart · `.215` Fire TV (fixed) · `.198` B-Hyve irrigation controller · `.232` Mower sensor box (ESP32).

Wi-Fi — `Loewen301` (2.4 · ch 1) all IoT + Kasa switches · `Loewen301-5G` (5 GHz) phones · laptops · TVs ·
`LoewenGuest` (2.4) guests only. Caption: *"Zigbee runs channel 25 — clear of Wi-Fi ch 1."*

Tuya / smart plugs (all identified Aug 13) — `.170` Garage fan socket · `.224` Jeff's bed lamp socket ·
`.171` Angela's bed lamp socket · `.209` Hot-water pump socket · `.195` Smart socket (spare) · `.231`
Sharky — robot vacuum · `.199 .200 .202 .205` **4 × Sylvania plugs** — vendor-locked, cannot enter HA ·
**replace with Zigbee**. Warning box, verbatim:

> **Settled — do not retry.** The Sylvania plugs are Tuya hardware locked to Sylvania's own app. Smart
> Life detects them and refuses; HA cannot reach them. Replacement is the fix.

**"Buying Rules — Learned the Hard Way", verbatim in full** — this is the most reusable paragraph in the
whole lighting file:

> - **"Zigbee compatible" is not enough.** Z-Wave and Zigbee are different radios — a Z-Wave switch will
>   never talk to the Zigbee dongle, no matter what the box says.
> - **Check the Zigbee2MQTT device page before buying.** One rejected dimmer was fully "supported" yet
>   carried a warning that it *stops relaying messages for other devices* — useless for building a mesh.
> - **Let cheap plugs carry the mesh**, not expensive switches. Same result, half the money.
> - **Disable vendor auto-firmware-update** before first pairing on anything whose local control matters.

The install checklist (three columns of checkbox lists): **Prep** — Kasa app installed · Auto-update
disabled · Breaker OFF · Verified dead at box · Neutral confirmed. **Per switch** — Photo before removing ·
Line vs load identified · Kasa wired + mounted · Power on · test manual · Join Loewen301 (2.4). **Home
Assistant** — Appears in HA · Named by room · Dim range checked · Added to HCC app · Logged in inventory.

**Traps in this file for future sessions:**

1. **It is authoritative but frozen at 2026-08-13.** It has not been edited since `6c90202`, while the
   inventory kept moving. Concretely stale as of tip: the shopping list says "2 on hand" for HS220 but a
   3rd was ordered 2026-08-14 (`b524553`, $13.86, Amazon Resale USED-Mint); the dongle row says "ordered"
   but it arrived 2026-08-15 (`5de10eb`); the Zigbee plug row says "~$10 × 4 = $40" but the actual
   selection made 2026-08-14 was the ThirdReality 4-pack at ~$50 (`9dad6a5`). **The plan is the
   *strategy* of record; `docs/inventory/HCC_INVENTORY.md` is the *state* of record.** Reconcile before
   quoting a price to Jeff.
2. **Channel 25 is written into this doc as settled**, but the inventory's setup-day instruction says
   *"pick the Zigbee channel deliberately around the crowded 2.4 GHz WiFi (census 08-13)"*. Two documents,
   two postures. Treat 25 as the plan of record and re-verify against the 08-13 census before pairing.
3. **The `LoewenGuest` row is stale** — the guest SSID was **DISABLED** on 2026-08-14 (`f735771`,
   NETWORK_MAP: *"Jeff confirmed nobody uses it"*).
4. **The garage two-location decision in this doc is still the live one.** `CLAUDE.md` contradicts itself
   about it — see §14.1.4.

#### 14.1.2 `HCC_Floorplan_DRAFT.html` — the LIDAR-traced floor plan (Draft 1, Aug 13 2026)

Landscape letter, one page, drawn as inline SVG, badged **"Draft — check me"** in the masthead.
Sub-headline, verbatim:

> Base geometry traced from the robot vacuum's map · device positions are my best guess and need your red pen

Rev block: *"Draft 1 · Aug 13 2026 — traced from Sharky LIDAR"*.

This is one of the more inventive artifacts in the project: **the house geometry was reverse-engineered
from Sharky the robot vacuum's LIDAR map**, because no floor plan existed. Rooms drawn solid: BEDROOM
(9 LED · 108 W), BATHROOM, FOYER, HALL / BATH, LIVING ROOM (8 LED · 96 W), KITCHEN + DINING (9 LED · 108 W).
Rooms drawn hatched with a dashed amber border because they are guesses: **GUEST BEDROOM** ("not mapped —
door was closed"), **OFFICE** ("not mapped — door was closed"), and **GARAGE** ("8 LED · 96 W · position
approximate"). The explanation, verbatim:

> **Why rooms are hatched** — The vacuum maps only where it can drive. With the guest bedroom and office
> doors shut, it read those doorways as solid wall — so those rooms are guesses, not survey. The garage it
> has never seen at all.

Device overlay key: **S** = Kasa smart switch (gold) · **R** = Zigbee plug / mesh router (blue) ·
**D** = Zigbee door sensor (green) · **H** = Beehive hub + coordinator (purple) · red bar = doorway ·
hatch = not mapped / approximate. Placed: HS220 door box (bedroom), HS220 (kitchen), HS220 (living room),
HS200 garage; four R plugs in the living room labelled *"4 × Zigbee plugs (replace Sylvania)"*, a
`garage relay plug`, a `bed lamp` plug; `door sensors ×2` at the garage; `Beehive + dongle` at the
kitchen/living junction. A north arrow sits top-right. Footer, verbatim:

> Not to scale · geometry approximated from the vacuum's LIDAR map · rooms it could not enter are hatched

The ask to Jeff, verbatim from the warning box:

> **Please correct me.** Mark this up and hand it back — I'll redraw it properly. I need:
> Room positions & rough sizes · Where the garage really sits · Guest bedroom & office locations ·
> Which wall each switch is on · Any rooms missing entirely

And the forward-looking note, verbatim:

> **Next version can be live.** Once the geometry is right, this same plan can drive the wall iPad —
> lamps lighting up when they're on, the garage door showing open or closed, and a tap to control
> anything on it.

**Status: STILL A DRAFT. The record is silent on whether Jeff ever marked it up.** No commit after
`29c7a1a` (2026-08-13) touches either floorplan file, and no other doc references a corrected version.
**INFERRED:** the markup never came back, or came back and was never recorded — either way, do not treat
any room position, room size, or the garage location in this file as fact.

**Trap:** the "next version can be live" idea (a tappable live floor plan on the iPad Air 2 wall display)
is a real, attractive, unbuilt feature. It is **not** on the CLAUDE.md docket. Anyone proposing it should
say plainly that it is new scope, not a resumed task.

#### 14.1.3 `bedroom_wiring_plan_2026-08-06.md` — the box-by-box wiring detail

2,009 bytes; the diagram-bearing companion the summary doc points to. Title:
**"Bedroom — Final Wiring Plan (Reversed Feed + Switched Outlets)"**. Opening line, verbatim:

> Door = origin. Kasa HS220 drives lights. Middle + bedside toggles now switch their own local receptacle.

**DOOR BOX — origination:** Kasa HS220 (lights) — Line hot in / neutral in; Load out → 9 bedroom LEDs;
Single-pole, replaces old switch; *"No S1/S2, no separate module"*. Splices in this box: line hot + chain
BLACK (feeds middle/bedside); neutrals: incoming + chain WHITE + LED neutral. **9 BEDROOM LEDs** — off
Kasa load · 108W total.

**MIDDLE BOX:** old 4-way removed. Existing toggle repurposed — Black IN from door (constant hot); Switch
OUTPUT → this box's receptacle hot only; *"No WiFi — dumb mechanical switch"*. Receptacle switched, dies
when toggle off. White + ground pass through unswitched. Black continues on to bedside, unaffected.

**BEDSIDE BOX — end of run:** old dimmer removed. Existing toggle repurposed the same way. *"15A
receptacle swap happens here. Old receptacle-feed tap fully removed."*

Legend, verbatim:

> BLACK = constant hot, feeds both switches in series down the chain · WHITE = neutral, unswitched, runs
> full length · Load to LEDs (from Kasa only — not part of the outlet circuit) · Middle + bedside switches
> are 100% independent of lighting — each controls only its own box's receptacle, nothing else. · Grounds
> bond throughout, never used as circuit conductors.

Order line, verbatim: *"Kasa HS220P3 (3-pack: bedroom + kitchen/dining + living room) + Kasa HS200 (garage)"*.

Before starting, verbatim:

> Breaker off · verify dead at all three boxes before starting · old bedside receptacle tap removed
> entirely · Verify RED/repurposed conductor reaches the fixture junction before final connection

**Trap:** this file still says the order is an **HS220P3 3-pack**. That is not what happened — Jeff had
2 on hand and bought a single used HS220 on 2026-08-14 for $13.86. The 3-pack line is a plan, not a
purchase. Also note the "RED/repurposed conductor" language here is a leftover from the *original*
reversed-feed design where red was a switched leg to 3 bed LEDs; the final design in
`kasa_smart_lighting_project_2026-08-06.md` and in the Rev. Aug 13 plan has no red switched leg at the
bedside at all. **If these two files disagree, the Rev. Aug 13 HTML plan wins.**

#### 14.1.4 `kasa_smart_lighting_project_2026-08-06.md` — the running project log

7,534 bytes and the most-amended file in the directory (three separate later sessions appended to it).
It opens with the decision, verbatim:

> **Final decision:** Kasa HS220 (dimmer) / HS200 (non-dim), local HA integration via `python-kasa`.

**The rejected options and exactly why — verbatim, in full:**

> **Why Kasa over MOES/Shelly**
> - **MOES WM-105B-M** (already owned): 100W/gang limit, doesn't fit any single-channel group above 100W
>   once rooms were combined to one switch each. Requires momentary/reset switches — confirmed via GitHub
>   issues and HA community threads that standard toggles cause continuous ramp behavior, not clean toggle.
> - **Shelly Dimmer Gen3**: works, local HA, keeps existing switches, but ~$35/unit vs Kasa ~$14-16/unit,
>   and needs input-mode config per unit.
> - **Kasa HS220**: replaces switch entirely, no separate module/switch pairing, mature local HA
>   integration (python-kasa), single-pole only — which matches every room now that they're consolidated
>   to one switch each.

The bedroom section records the design *change* explicitly rather than silently overwriting — an example
of the project's better documentation habit:

> **UPDATED — bedside + middle switches NOT removed.** Instead, each existing toggle is repurposed as a
> dumb (non-smart) switch controlling ONLY its own box's receptacle […] No blank plates needed anywhere —
> every existing switch keeps a real job.

The original "Open items / not yet fully field-verified" list, verbatim:

> - Kitchen and living room box fill/depth not yet inspected via photo (bedroom boxes were — combo
>   switch+receptacle, already crowded, confirmed OK once devices reduced).
> - Confirm neutral present at kitchen and living room switch boxes (assumed yes per house pattern, not
>   individually confirmed via photo).
> - Kasa app/local discovery should be tested on Jeff's network before buying all 4 units.
> - **Added by cloud session (08-06):** the garage's "2 (kitchen + garage, 2-way)" control point is listed
>   against a single Kasa HS200 — verified via research this needs the **HS210 kit** (matched pair,
>   WiFi-coordinated) to keep BOTH the kitchen and garage switch positions live; a lone HS200 in a
>   3-way/2-way circuit makes the other physical switch position non-functional.

That last bullet is the origin of **CLAUDE.md Pending Item 19**, and the commit that filed it
(`ac38933`, 2026-08-08) is a good example of the review-not-file habit:

> Saved the Kasa HS220/HS200 lighting project (bedroom reversed-feed redesign, kitchen/living
> room/garage switch consolidation) into docs/lighting/ and summarized it in CLAUDE.md. Reviewed rather
> than just filed it: verified the HS220's 150W-LED rating covers the 108W bedroom/kitchen loads, and
> found the garage's 2-location switch setup only has a single HS200 on the shopping list - confirmed via
> research that leaves the other switch location non-functional. Logged as Pending Item 19 for Jeff to
> decide (HS210 kit vs. repurposing the extra position) before ordering.
> — commit `ac38933`, 2026-08-08 01:09:45 +0000

**The 2026-08-13 appendices** (commits `c722076` 20:41 and `8b7a69a` 20:48), verbatim:

> ## CEILING FANS — CONFIRMED SEPARATE (Jeff, 2026-08-13)
> **Every ceiling fan is wired independently of the LED circuits.** Bedroom and office fans are
> pull-chain; the living room fan runs on its own RF remote. No wall switch in the plan controls a
> fan motor, so **a dimmer is safe on all four LED circuits** — the one real hazard in this project
> (dimming a fan motor damages it and is a fire risk) does not apply anywhere here. Closed.
>
> Future option, not planned: the living-room fan is RF-remote controlled, so it could be brought
> into HA later with an RF bridge that learns the remote. Separate purchase, separate project.

> ## BOXES & WIRE PULLS — DONE BY JEFF (confirmed 2026-08-13)
> **Jeff pulled dedicated LED circuits himself through the attic and installed 2- and 3-gang boxes in
> every room.** Originally each room had ONE switch serving both the fan and the light; the LEDs now
> have their own switch on their own home run.
>
> This CLOSES two previously-open items:
> - "Confirm neutral present at kitchen and living room boxes" — he pulled the wire, neutrals confirmed present.
> - "Box fill/depth not inspected" — new multi-gang boxes, ample room for the deeper Kasa bodies.
>
> Also worth knowing: spare gang positions exist in these boxes, so future smart devices drop in
> WITHOUT another attic trip. Ganged-dimmer heat derating is a real rule but a non-issue here
> (96-108 W on a 150 W-rated switch).

**The 2026-08-14 install record** (commit `09de34b`) — the first switch actually in service, and the
single densest paragraph of hard-won operational detail in the lighting file. Verbatim in full:

> ## ✅ LIVING ROOM INSTALLED 2026-08-14
> `light.livingroom_cans` — HS220 at **192.168.1.178**, wired by Jeff, dimming verified from HA.
>
> **Setup took ~2 hours and the network was NEVER the problem.** Verified from inside the gateway:
> DHCP fine (190 free), MAC filtering off, WPA-2, channel 1, SSID visible, band steering off.
> 2.4 GHz Mode was changed G/N -> **B/G/N** during troubleshooting (kept — harmless and more permissive).
>
> **These HS220s ship on NEW firmware** using an encrypted onboarding protocol (server identifies as
> "SHIP 2.0", port 80, NOT the legacy port 9999). Consequences:
> - HA needs **TP-Link account credentials** to add them. Control is still LOCAL — the account only
>   authenticates the local session; it keeps working without internet.
> - Direct provisioning over the setup AP is NOT possible: all payloads return `error_code 1003`
>   (JSON decode fail) and the handshake is undocumented. Do not waste time on this again.
>
> **USEFUL TOOL DISCOVERED:** the beast has a working Wi-Fi adapter (ASUS USB-AC53 Nano) whose radio
> sits software-off by default. It can be turned on via the WinRT Radio API and used to join an IoT
> devices private setup AP for diagnostics, without disturbing its wired LAN connection.
>
> **BONUS: HA exposes `switch.<device>_auto_update_enabled`** — the firmware auto-update toggle the
> Kasa app does NOT show. **Turned OFF for this switch. Do the same for every future Kasa device.**
> HA also exposes an overheat sensor, signal level, smooth on/off fade, presets and the status LED.

**Traps from this file:**

- **"Do not waste time on this again"** — direct provisioning over the Kasa setup AP is a dead end
  (`error_code 1003`, undocumented handshake). Two hours were burned learning it.
- **The TP-Link account is required and that is not a cloud dependency.** The plan's own page-1 copy says
  "no account needed for on/off/dim" — that was true of the *old* firmware and is now wrong for
  new-firmware HS220s. **The plan HTML has not been corrected.** Flag this contradiction rather than
  re-discovering it.
- **`switch.<device>_auto_update_enabled` must be turned OFF on every future Kasa device.** It is not
  visible in the Kasa app at all.
- The gateway's 2.4 GHz mode is now **B/G/N** because of this install (see also `NETWORK_MAP.md`,
  `f735771`). Do not "tidy" it back to G/N.

#### 14.1.5 `zigbee_dimmer_selection_2026-08-13.md` — the scrapped selection, and the project's worst documentation failure

3,093 bytes. Created 2026-08-13 19:40 (`a5c67a8`) as a *selection*; overwritten at the top on
2026-08-16 08:08 (`1572b4a`) with a scrap notice that inverts its conclusion. The scrap notice is quoted
here **in full**, verbatim, because it is the single most important paragraph in this section:

> ## 🔴 SCRAPPED BY JEFF — DO NOT PROPOSE INOVELLI AGAIN
> **Jeff rejected the Inovelli Blue on price and says he did so early on:** *"those were scrapped at
> the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."*
> ~$60 each / ~$120 for the pair is over his line, full stop.
>
> **This was never recorded until 2026-08-16**, so the inventory and CLAUDE.md both still said
> "TO BUY: 2" a day later, and a session planned the whole Zigbee mesh around them and pitched them
> back to him. That is exactly how a settled decision gets re-litigated. **If a decision is made in
> conversation, it goes in the doc the same session.**
>
> The research below is kept ONLY as the record of why Enbrighten was rejected (documented
> mesh-routing defects — still valid and still worth avoiding). **The selection at the bottom is dead.**
>
> **Open:** the mesh still needs mains-powered routers, and a budget alternative has NOT been chosen.
> Do not name one from memory — research real current products and prices in-session, cheapest-first,
> and include the $0 option (Kasa HS220 ×2 and the MOES module are already ON HAND).

The commit that wrote it (`1572b4a`, 2026-08-16 08:08:09 -0500) is equally explicit:

> Jeff rejected the Inovelli Blue early on (~$60 ea / ~$120 the pair) and the decision never made it into
> any document. Yesterday's inventory update still said TO BUY: 2, so this session planned the entire
> Zigbee mesh around them and pitched them back to him. That is a settled decision being re-litigated
> because the docs disagreed with reality.
>
> Both sources now carry the scrap notice. The Enbrighten rejection research is kept - the documented
> mesh-routing defects are still valid - but the selection is dead.
>
> Still open and deliberately NOT guessed: the mesh needs mains-powered routers and no budget alternative
> has been chosen. Next session researches real current products and prices in-session, cheapest-first,
> leading with the zero-cost option (Kasa HS220 x2 and the MOES module are already on hand).
>
> Standing lesson: a decision made in conversation goes into the doc the SAME session.

`CLAUDE.md` carries the fuller quotation of Jeff, which is also the budget philosophy of the entire
project:

> **❌ Inovelli Blue 2-1 VZM31-SN — SCRAPPED ON PRICE. Never propose again.** Jeff, verbatim:
> *"I was not paying $120 for a freaking dimmer switch... I spend $125 for Claude Max and I would
> rather spend the money on that and have your help than buy $120 worth of dimmers."* **That is the
> budget philosophy for this whole project — his money goes to the tools that help him build, not
> to premium hardware where a cheap part does the job.**

And the rule the whole SETTLED DECISIONS section exists to enforce, with Jeff verbatim:

> **A decision Jeff makes in conversation goes into a file THE SAME SESSION.** Jeff, verbatim:
> *"you tell me it is all documented and it is not, then the session closes and you come back with
> some plan that was two weeks ago — this is infuriating."* Writing it down is not optional
> housekeeping; it is the difference between a project that moves forward and one that loops.

**The research that is still valid — the rejections, verbatim:**

> ## Rejected: Enbrighten Z-Wave 800 toggle dimmer ($39)
> **Wrong radio.** Z-Wave (908 MHz) cannot talk to the Haozee CC2652P1 Zigbee dongle.
> Would need a second ~$40 Z-Wave stick + a second ecosystem. Real cost for 2 switches:
> ~$118 vs $92 Zigbee. Rejected.
>
> ## Rejected: Enbrighten 43080 (Zigbee paddle dimmer)
> Officially Zigbee2MQTT-supported, same QuickFit/SimpleWire body, neutral required — looked
> like the value pick. **BUT Zigbee2MQTT's own device page carries two explicit warnings:**
> - "Some Enbrighten devices may cause issues with larger networks. In particular, they may
>   stop relaying messages for child devices."
> - "Some Enbrighten devices will not respond to route update requests after a while."
> Jeff's stated requirement is that switches EXTEND the mesh (garage needs range help). A switch
> with documented routing defects fails that requirement outright. **Rejected — this is the whole
> reason to check before buying.** Also: Zigbee line is paddle-only (toggles are Z-Wave), and
> 3-way support on the Zigbee model could not be verified.

**The dead selection, preserved verbatim so nobody re-derives it:**

> ## SELECTED: Inovelli Blue 2-1 VZM31-SN (~$46-60)
> - Zigbee 3.0, mains-powered router, **no routing warnings on its Z2M page** (direct contrast)
> - **Dumb-3-way CONFIRMED supported** via configuration — solves the garage 2-location problem
>   (closes the old HS200/HS210 open question). Caveat: scene parameters 1-2/5-6 don't fire when
>   the dumb switch is pressed manually — expected, not a defect.
> - Neutral required for 3-way dumb setups — Jeff has neutrals in every box ✓
> - Load: on/off variant rated 1800W general purpose; dimmer LED rating not re-verified this
>   session, but Jeff's loads are ~108W — far below any dimmer's limit.
> - Costs more, but it is the only option that satisfies "must extend the mesh."
>
> **Lesson: "Zigbee2MQTT supported" ≠ "good Zigbee citizen." Check the device page's warnings.**

**Timeline detail worth preserving:** the Inovelli selection was written at **19:40 on 2026-08-13**
(`a5c67a8`); the authoritative plan HTML — whose page-1 note argues *"Why not a $46 mesh dimmer"* —
was committed **43 minutes later at 20:23** (`6c90202`). So the plan of record had already reversed the
selection on the same evening, while the selection doc kept the "SELECTED" heading for three more days.
**Two docs in the same directory said opposite things from 2026-08-13 20:23 until 2026-08-16 08:08.**
That gap is precisely what let a later session re-pitch Inovelli.

**Trap of traps — the search trap, verbatim from `CLAUDE.md`:**

> ⚠️ **A trap that already cost a whole session:** searching the docs for "Inovelli" and finding
> nothing does NOT mean the plan is undocumented — the *absence* of that word is what marks the
> CURRENT plan. Search for **Kasa / plug / mesh**, and check `docs/lighting/` by date.

**A live contradiction inside `CLAUDE.md` itself, unresolved at tip.** Under SETTLED DECISIONS:

> **Garage 2-location switch:** the old HS200-vs-HS210 question is dead; solved by config, not by
> buying a premium switch.

But Pending Item 19 says the opposite:

> **19. Garage two-location switching — STILL OPEN, Jeff's call before ordering.** ⚠️ *I briefly wrote
> that Inovelli's "3-Way Dumb" closed this. It does not — **Inovelli is scrapped on price**, so that
> answer went with it.* Per `docs/lighting/HCC_Lighting_Plan.html`, a single **Kasa HS200 cannot serve
> two switch positions** — the second position goes dead.

**Resolution for the record:** Pending Item 19 is correct and the SETTLED-DECISIONS line is a leftover
from the Inovelli era. The garage two-location question is **OPEN** at tip (2026-08-16). Do not tell Jeff
it is solved.

---

### 14.2 `docs/lucky-mike/` — the Smart Stall business, queued and never started

Nine files. This is a **complete, costed, legally-checklisted small-business plan** for a product Jeff
has not built, gated behind an explicit "do not start" from him. It was archived in a single burst on
**2026-06-30** across six commits between 13:09 and 14:11 UTC — roughly one hour of work — and has not
been touched since. Two months of project time have passed at tip with zero further edits.

| File | Bytes | Purpose |
|---|---|---|
| `Lucky_Mike_Smart_Stall_Project_Master.md` | 1,960 | Jeff's/ChatGPT's original vision doc |
| `Lucky_Mike_Smart_Stall_Project_Bible_v1.0.md` | 2,339 | Jeff's/ChatGPT's structured "Bible" v1.0 |
| `INTEGRATION_NOTES.md` | 5,836 | Claude's engineering review + app-integration plan |
| `BOM_OPTIMIZED.md` | 6,432 | Claude's cost-optimized bill of materials |
| `PRICING_AND_BUSINESS.md` | 6,174 | Labor-loaded pricing + go-to-market + legal checklist |
| `DEAL_OPTIONS.md` | 5,138 | Four deal structures modeled with 5-year economics |
| `README_Project_Files.txt` | 409 | Folder-structure suggestion for the archive |
| `lucky-mike-hero.jpg` | 634,861 | Hero photo for the future app section |
| `design-budget-guide-12page.png` | 2,109,086 | The 12-page ChatGPT design/budget deck, as an image |

Commit history:

```
4d78cad 2026-06-30  Lucky Mike: factor multi-pack pricing + parts-on-hand into per-stall cash risk
6c2d8c3 2026-06-30  Lucky Mike: add real minimum per-stall parts cost (~$90 single / ~$75 barn-qty)
fa282f1 2026-06-30  Lucky Mike: lock deal economics to Jeff's numbers ($50 trip, $40/mo)
857d825 2026-06-30  Lucky Mike: add DEAL_OPTIONS.md — 3 deal structures modeled with economics
e50c9a4 2026-06-30  Lucky Mike: save optimized BOM + pricing/business plan (planning docs)
c8ca302 2026-06-30  Archive Lucky Mike Smart Stall plan + technical review (queued, not built)
```

Status line in `CLAUDE.md` Pending Items, verbatim:

> **6. Lucky Mike "Smart Stall"** — queued, plans in `docs/lucky-mike/` (read `INTEGRATION_NOTES.md`
> first). New "STABLE" section, `--a-stable` accent. **Do not start until Jeff says go.**

And in `INTEGRATION_NOTES.md` itself, verbatim:

> **Status: QUEUED — build AFTER the utilities work and the current docket are finished** (Jeff's
> instruction 2026-06-30).

#### 14.2.1 The source documents (Jeff's / ChatGPT's)

`Lucky_Mike_Smart_Stall_Project_Master.md` (v1.0). Vision, verbatim:

> Create an affordable, expandable Smart Stall monitoring system for Lucky Mike that integrates with the
> existing Home Assistant Command Center.

Goals: *"Protect Lucky Mike with remote monitoring. Minimize monthly costs. Modular design. Easy future
expansion. Professional appearance suitable for future customers."*

Phases and the original (parts-only) budget:

- **Phase 1 – Essential Monitoring** — Estimated Hardware: **$175–225** — 2 × TP-Link Tapo C120 cameras,
  ESP32 controller, BME280 temp/humidity, DS18B20 waterproof temp probe, LD2410 presence sensor, HA dashboard.
- **Phase 2 – Smart Stall** — Additional: **$125–175** — automatic fan control, water level monitoring,
  door sensor, water leak sensor, UPS battery backup.
- **Phase 3 – Feed & Analytics** — Additional: **$75–125** — feed bucket load cell, HX711 amplifier, feed
  history, water history, daily reports.
- **Phase 4 – Smart Halter** — options: 1. Wi-Fi only · 2. Wi-Fi sync (preferred) · 3. Hybrid Wi-Fi + LTE
  emergency alerts · 4. Full LTE live tracking.

Business concept: **Brand: Smart Stall™**; packages **Bronze / Silver / Gold / Platinum**; marketing
tagline, verbatim: **"Because they're family."** And: *"Lucky Mike will serve as the demonstration
installation for future customers."*

`Lucky_Mike_Smart_Stall_Project_Bible_v1.0.md` carries YAML front-matter (`title`, `version: 1.0`,
`status: Active`, `owner: Jeff Loewen`), a 21-item table of contents, a hardware baseline, and the
budget philosophy, verbatim:

> Start with the lowest-cost system that solves the customer's problem, then add optional upgrades only
> when they provide meaningful value.

Its customer packages are **Bronze / Silver / Gold / Elite** — note **Elite**, not Platinum. That clash
is one of the review findings below.

`README_Project_Files.txt` proposes a folder structure (`Project Bible/`, `Budget/`, `Photos/`,
`Electronics/`, `Home Assistant/`, `Customer Proposal/`, `Documentation/`) and states, verbatim:
*"Use the Markdown (.md) files as the editable master documents. Use the HTML files for
viewing/printing."* **Trap:** the referenced `Project_Master.html` and `Project_Bible_v1.0.html` are
**not in the repo** — only the `.md` versions were archived. The README describes a superset of what
survives.

#### 14.2.2 `INTEGRATION_NOTES.md` — the engineering review that corrects ChatGPT

Verdict, verbatim:

> Good, coherent plan. It uses the **same architecture as everything else in the app**
> (ESP32 + ESPHome → Home Assistant → app via `/api/states`), so it integrates with near-zero new
> plumbing. The phased Bronze→Platinum structure is sensible. Keep it.

**The nine corrections, verbatim and complete** — these are the "do not copy the deck blindly" list:

> 1. **Architecture diagram is wrong (page 10).** It funnels cameras + Shelly plugs *through* the ESP32.
>    They do NOT. Tapo cameras and Shelly plugs are independent **Wi-Fi/HA** devices. The ESP32 only
>    handles the **wired** sensors (BME280, DS18B20, LD2410, load cell, door, leak, water level).
> 2. **microSD on the ESP32 for "history/logs" (Phase 3) — drop it.** Redundant and risky. **Home
>    Assistant is already the historian** […] On-ESP32 SD logging adds SPI conflicts and FAT-corruption
>    risk for zero benefit. Remove from BOM (saves ~$8).
> 3. **Li-ion 5200mAh "backup power" (Phase 3) — drop or redesign.** Two problems: (a) it's **redundant**
>    with the Phase 2 UPS, and (b) USB power banks commonly **auto-shut-off** under the ESP32's tiny
>    current draw — unreliable as backup. If on-board battery is wanted, use a proper LiPo + TP4056/charge-
>    management board, not a USB power bank.
> 4. **DS18B20 duplicated + misspelled.** It's listed in Phase 1 (correct) and again as a temp probe in
>    Phase 3 (duplicate), and the slides spell it "DS1820B/DS1B20". Correct part = **DS18B20**.
> 5. **Phase 3 slide total bar is mislabeled "PHASE 2 ESTIMATED TOTAL."** Copy-paste error. The math
>    ($53.86) is right; the label is wrong.
> 6. **Tier-4 name is inconsistent.** Slide deck says **Platinum**; the Bible says **Elite**. Pick one
>    (recommend Platinum to match the deck).
> 7. **Phase 4 GPS halter — set realistic expectations.** […] **Wi-Fi-only (Options A/B) gives NO live
>    location off-property** — it's a store-and-forward logger that only uploads when back in barn Wi-Fi
>    range. Live tracking in a pasture **requires cellular** (LTE-M/NB-IoT — Options C/D). **Battery life
>    + weight + sky view** are the real engineering challenges […] The "+$3–10/mo" cell estimate is
>    plausible with low-data LTE-M (Hologram/Soracom) but verify before promising it to customers.
> 8. **"All data stays on your local network" is overstated.** Tapo and Shelly can reach their clouds
>    unless explicitly locked down, and cellular GPS uses the carrier network by definition. Fine as a
>    goal, not a guarantee.
> 9. **Verify a couple of parts/prices.** "Shelly Plug Gen4" — confirm the exact current model (Shelly
>    Plug S Gen3 / Plus Plug US). A few prices are optimistic (LD2410 @ $1.99; budget the high end of
>    each range).

**Site facts confirmed by Jeff 2026-06-30, verbatim** — and note the explicitly reversed earlier advice:

> - **Barn Wi-Fi is strong** and **each stall has a 120V receptacle.** So: power the ESP32 from a USB
>   adapter at the outlet (no battery), use plain Wi-Fi (no PoE for range), and **control the fan with a
>   plug-in power-monitoring smart plug** (Sonoff S31 / Shelly Plus Plug US) — NOT a hard-wired relay
>   (reverses my earlier note; with a finished receptacle, plug-in is safer, customer-installable, and
>   the power reading confirms the fan is actually running).
> - **Every stall = one identical repeatable module** […] Price/install **per stall**; an N-stall barn is
>   the same recipe × N — great for productizing.

**How it becomes an app page, verbatim** (this is the build spec if Jeff ever says go):

> - New section **"STABLE"** (or "LUCKY MIKE") added to the nav — its own `--a-stable` accent token;
>   built entirely from the Section Kit + the graded `.sec-hero` (use `lucky-mike-hero.jpg` in this
>   folder). No bespoke markup.
> - **Live tiles** (temp/humidity/water/feed/fan/door/UPS/power/activity) pulled from HA `/api/states` —
>   same pattern as irrigation/cameras/utilities.
> - **Cameras** reuse the existing HA camera fetch already in the app.
> - **Phase/BOM tables** → `.spec-list` / simple kit-styled tables; **budget tiers** → card kit. Must read
>   clean in BOTH light and dark (run `scratchpad/sweep.js`).
> - Branding on the page: **Smart Stall™ — "Because They're Family."**
> - It double-purposes as a **customer demo/sales** screen, so keep it presentable.

And the sequencing agreement, verbatim:

> **Why doing utilities first is the right order (agree with Jeff)** — The water/gas/electric utilities
> work is the *same skill*: ESPHome sensor → HA → app card. Building that first creates the exact
> reusable plumbing this page needs.

#### 14.2.3 `BOM_OPTIMIZED.md` — every part, every price

Header, verbatim:

> My cost-optimized, Home-Assistant-LOCAL parts list. Replaces ChatGPT's over-specced picks.
> **Guiding rule:** the stall already has a capable ESP32 + good Wi-Fi + a 120V outlet, so hang cheap
> sensors off the ESP32's GPIO and use a plug-in smart plug for the fan — don't buy a branded $15–25
> gadget per function. Prices are rough 2026 estimates; budget the high end.

**Per-stall ESSENTIAL (Bronze) module — verbatim table:**

| Part | Pick | ~$ | Notes |
|---|---|---|---|
| Controller | ESP32 WROOM DevKit | 6 | ESPHome; USB-powered from stall outlet |
| Power | 5V USB adapter + cable | 5 | No battery needed (outlet present) |
| Temp/Humidity | BME280 (genuine) **or** SHT31 | 5–6 | SHT31 = better humidity; avoid fake BMP280 |
| Stall temp probe | DS18B20 waterproof ×1 | 3 | one is enough (drop ChatGPT's duplicate) |
| Presence/"down" | LD2410 mmWave | 5 | native ESPHome `ld2410`; in-stall occupancy/motion |
| Water level | JSN-SR04T ultrasonic (continuous) **or** float switch (low-alert) | 6 / 2 | contactless ultrasonic over trough = best cheap option |
| Water leak | leak probe/rope to GPIO | 2 | not a $13 branded unit |
| Door | reed switch to GPIO | 1 | not a $8 branded unit |
| **Fan control** | **Sonoff S31** (flash ESPHome/Tasmota, local) **or Shelly Plus Plug US** | 15 / 20 | **with power monitoring** → confirms fan actually drawing current |
| Camera | Reolink Wi-Fi (HA-local via RTSP/ONVIF) **or** Tapo C120 | 35–50 | Reolink integrates cleaner/local than Tapo |
| Enclosure | IP65 box + glands | 12 | barn dust/moisture; essential |
| Misc | dupont, terminal blocks, mounts | 8 | |
| **Per-stall essential subtotal** | | **~$100–125** | + 1 camera |

**The REAL minimum, confirmed 2026-06-30 — verbatim table:**

| Part | Single-buy | Barn qty (6+) |
|---|---|---|
| ESP32 WROOM dev board | $8 | $5 |
| 5V USB adapter + cable | $6 | $4 |
| BME280 (genuine) | $7 | $5 |
| LD2410 mmWave presence | $6 | $5 |
| Door reed switch | $2 | $1.50 |
| Wi-Fi camera ×1 (Tapo C120 / Reolink) | $40 | $35 |
| IP enclosure + glands | $10 | $8 |
| Wiring / mounts / misc | $8 | $6 |
| **Subtotal** | **~$87** | **~$69** |
| **+10% spares** | **~$96** | **~$76** |

Verbatim conclusion, and the self-correction it contains:

> **→ Use ~$90/stall single-buy, ~$75/stall in barn quantity as the real parts cost.**
> (Camera is the swing factor, ~$30–55.) NOTE: the deal-economics docs originally used a padded
> $150/stall — real floor is ~$90, which *improves* every option's margin (Option 1 take ≈ $410/stall,
> not $350). Re-lock deal numbers at $90 when Jeff confirms.

**Bulk / parts-on-hand table, verbatim:**

| Part | Multi-pack source | per-unit | Likely on-hand? |
|---|---|---|---|
| ESP32 WROOM | 3-pack ~$20 | ~$6.50 | **YES (you stock these)** |
| USB adapter + cable | 4-pack / spares | ~$4 | **likely** |
| BME280 | 3-pack ~$14 | ~$4.50 | maybe |
| LD2410 | single/2-pk | ~$5 | maybe not |
| Reed switch | 10-pack ~$8 | ~$0.80 | maybe |
| Jumpers/wire/resistors | bulk kits (amortized) | ~$2 | **YES** |
| IP enclosure | multipack | ~$7 | no |
| Wi-Fi camera ×1 | 2-pack Tapo ~$65 | ~$33 | **no — the floor** |
| **Bulk total** | | **~$63/stall** | |
| **Bulk MINUS common on-hand** (ESP32, USB, jumpers/wire ≈ $12) | | **~$50/stall** | camera $33 + BME280 $4.5 + LD2410 $5 + reed $1 + box $7 |

> **→ True marginal cash per added stall, once you're stocked: ~$50** (≈ camera + the few sensors you
> don't keep + a box). Camera ≈ two-thirds of that.
>
> **Cash-risk ladder per stall:** ~$90 buying one-off retail → **~$63 bulk** → **~$50 bulk + your
> on-hand boards/wire.** (Confirm what you actually have stocked and we'll nail the exact number.)

Barn-level shared cost (buy ONCE, not per stall): *"small UPS on router/switch (CyberPower 425–600VA)
— $55–70 — one blip-proof point beats a battery in every stall."*

Phase add-ons per stall: Feed weight (HX711 + load cell + mounting frame) ~$12 + frame; extra camera
angle (2nd Reolink/Tapo) $35–50.

**Phase 4 — GPS halter, verbatim:**

> - **Store-and-forward (Wi-Fi only):** ESP32 + NEO-M8N GPS + LiPo ≈ **$25–30**. Logs in pasture, uploads
>   at barn. **No live location off-property.**
> - **Live tracking (cellular):** LTE-M board (e.g., LilyGO T-SIM7080G) ≈ **$35–45** + low-data SIM
>   (Hologram/Soracom) **$1.5–5/mo** (pass-through to customer).
> - Real constraints: battery life, halter weight, needs open sky (no fix under a shed). Frame as
>   future/R&D, not a v1 promise.

**DROP from ChatGPT's list (and why), verbatim:** microSD on the ESP32 (HA is the historian; redundant +
FAT-corruption risk) · Li-ion 5200mAh power bank (redundant, and power banks auto-shut off under the
ESP32's tiny draw) · per-stall UPS (back the barn network once instead) · branded single-function sensors
($13–25) where a $1–6 GPIO part is better.

Closing, verbatim:

> **Why this is the CFO story** — Fewer separate devices = fewer failure points and fewer clouds.
> Everything is **local to Home Assistant → $0/month** (except optional GPS SIM). Cheaper parts, more
> reliable, and a clean "no subscription" pitch.

#### 14.2.4 `PRICING_AND_BUSINESS.md` — the labor correction, the models, the legal checklist

**The core correction, verbatim** — this is the doc's whole reason for existing:

> ChatGPT's deck prices ($175–225 "Bronze," etc.) are **parts + a small buffer with ZERO labor**.
> Selling at those numbers = donating 6–15 hrs of skilled work per install. Always price the
> **installed job**:
>
> > **Installed price = Parts (+10% spares) + (hours × rate) + margin/contingency**

**Three go-to-market models, verbatim in summary:**

- **Model A — Boarder pays (B2C)** — one owner, one horse. *"Simple, but small jobs and Jeff chases each
  customer. Fine for the first few / word-of-mouth."*
- **Model B — Barn owner as a paid amenity (B2B2C) — RECOMMENDED.** *"one decision-maker, many stalls at
  once; she carries billing + the customer relationship; recurring revenue exists; Lucky Mike is the
  on-site demo; differentiates her barn / can justify higher board."* Payback math, verbatim:
  *"Installed cost to her ≈ **~$440/stall** for a 6-stall job […] She charges boarders **~$20–30/stall/mo**
  […] At $25/mo × 6 = $150/mo → **payback ≈ 16–18 months**, then ~$1,800/yr recurring at **~$0/mo running
  cost** (all local)."*
- **Model C — Managed service / revenue-share** — *"More income long-term, but Jeff carries support load
  + some CapEx risk. Consider once there are several barns."*

**Labor-loaded pricing, verbatim:**

> **Cost basis (per stall, essential + 1 camera):** ~$130–170 parts (see BOM).
> **Labor (the part ChatGPT ignored):** […] **First stall in a barn:** ~6–8 hr […] **Each additional
> stall (same barn):** ~2–3 hr […] **Rate:** pick one — suggest **$60–85/hr** for skilled install.
> Examples use **$65/hr**.
>
> **Worked example — single-stall job:** ~$150 parts + 8 hr × $65 = $520 labor → ~$670 + 15% =
> **~$770 installed.**
>
> **Worked example — 6-stall barn (Model B):** Parts: 6 × $150 = $900 + barn UPS $65 = $965 · Labor:
> 8 hr (first) + 5 × 2.5 hr = 20.5 hr × $65 = $1,333 · Subtotal $2,298 + ~15% margin/contingency ≈
> **$2,640 (~$440/stall)**

**Tiers, verbatim:**

| Tier | Adds | Indicative installed/stall (multi-stall) |
|---|---|---|
| Bronze | Essential monitoring (temp/humidity/presence/door/leak/cam) | ~$400–500 |
| Silver | + fan smart-plug automation, water level, network UPS | ~$550–700 |
| Gold | + feed weight + history/reports | ~$750–950 |
| Platinum | + GPS halter (cellular hardware; SIM billed pass-through) | $1,000+ /horse |

**Selling the CFO (Angela) — lead with risk, not gadgets, verbatim:**

> - **Avoided-loss ROI:** one colic caught early vs. late ≈ **$5,000–10,000 surgery** (or losing the
>   horse). Early alerts on a cast/down horse, empty water, heat spike = cheap insurance against a
>   five-figure event. CFOs buy insurance.
> - **Total transparency:** itemize parts at cost + labor as a real line + **~$0/mo**. Don't pad; a CFO
>   trusts the honest sheet over a round number.
> - **TCO + payback, not sticker:** ≈$770 once, ~$0/mo vs. commercial equine systems ($1,000–3,000+
>   upfront **and** monthly fees). Undercut + no forced subscription.

**Business / legal checklist — verbatim, in full** (an unchecked checklist at tip; none of these items
has any recorded progress anywhere in the repo):

> A CFO and a barn owner will both ask about these — and they protect Jeff:
> - [ ] **LLC** — walls off personal assets (incl. the house Jeff wired himself).
> - [ ] **General liability insurance** (small business policy).
> - [ ] **Disclaimer/waiver on every proposal:** "Supplemental monitoring aid, NOT a replacement for
>       in-person checks; no guarantee against loss or injury." Live animal — non-negotiable.
> - [ ] **Boarding-contract addendum (Model B):** the barn's liability flows to boarders via her
>       contract; spell out the amenity terms + same disclaimer.
> - [ ] **Warranty terms** — e.g., 1 yr parts / 90 days labor; define who eats the truck roll on a dead sensor.
> - [ ] **Support policy / retainer** — Jeff's post-sale time is a real cost. Cap it or sell an annual
>       support plan (also recurring income).
> - [ ] **Sales tax / business license** — register; a CFO asks day one.
> - [ ] **Who owns the hardware** (Model B/C) — barn owner vs. Jeff; what happens when a boarder leaves
>       (unit stays with the stall, not the horse).
> - [ ] **Camera data/privacy** — local storage, who can view, no internet exposure.
> - [ ] **Cellular SIM (Phase 4)** — billed pass-through; don't absorb recurring.

**First move (agreed), verbatim:**

> Build **Lucky Mike's stall at parts cost** as the reference install + demo. Get it running and
> bulletproof, then use it to pitch Angela (CFO) and the barn owner. Don't try to profit on unit #1 —
> it's the showroom.

#### 14.2.5 `DEAL_OPTIONS.md` — four deal structures, five-year economics

Header, verbatim:

> What Jeff charges and makes under each structure, using **confirmed inputs** (2026-06-30): real parts
> **~$90/stall single-buy (~$75 barn qty)**, **$50 flat trip charge**, **$40/mo** boarder fee.
> Build/install labor fee ($300/stall) is Claude's recommendation — Jeff's to adjust.

**Locked inputs, verbatim:**

| Input | Value |
|---|---|
| Parts / stall | **$90 single-buy · $75 barn qty** (your cash risk) |
| Trip charge | **$50 flat / visit** (show-up; not build labor) |
| Build/install fee (labor) | **$300 / stall** *(recommended; ~6 hr)* · ~$200 each additional stall |
| Monthly fee (boarder pays) | **$40 / mo** |

**"Your cash at risk (the number Jeff asked for)", verbatim:**

> Cash-risk ladder per stall: **~$90 one-off retail → ~$63 buying multi-packs → ~$50 multi-pack + your
> on-hand boards/wire** […] The **camera (~$33) is the floor** […] So realistically your **true marginal
> cash per added stall is ~$50**, and most of it is redeployable. Your ~6 hr of time is sweat, not cash.

**Smallest scale works: ONE stall at a time still profits — verbatim table:**

| If you… | Upfront to you | Your cash at risk | You make |
|---|---|---|---|
| **Sell the install (Opt 1)** | charge ~$440 | $0 (paid on completion) | **~$350 over parts**, that day |
| **Keep the $40/mo, charge parts+trip (~$140)** | $140 covers parts | **$0** (parts covered) | **$40/mo, pure, from month 1** |
| **Keep the $40/mo, eat the parts to seed it** | nothing | ~$90 | back in **~10 weeks**, then $40/mo |

> **No single-stall scenario loses money.** Question is just: ~$350 now, or ~$40/mo rolling.

**The key decision, verbatim:**

> ## ⭐ THE KEY DECISION: who keeps the $40/mo?
> The same $40 can't be kept twice:
> - **Barn owner keeps it** → her money-maker; you earn on the one-time install. → Opt 1/2.
> - **Jeff keeps it** → managed service; install near-cost, earn on $40/mo; you own support. → Opt 3.
> - **Split ($25 Jeff / $15 barn)** → both win; her amenity income at zero cost, your recurring.
>
> At $40/mo the recurring is **3–6× the one-time over 5 yrs**.

**The four options, verbatim in the essentials:**

> **OPTION 1 — Demand-triggered install** *(barn keeps $40; lowest risk, recommended start)*
> **Installed price (1 stall):** $90 parts + $50 trip + $300 build = **~$440** (round $450) · **Your take
> over parts:** **~$350** for ~6 hr (~$58/hr) + you keep the trip charge · **Each additional stall, same
> visit:** ~$275 ($75 parts + $200 build) → take ~$200 · **6-stall barn:** ~$1,815 revenue; parts ~$480 →
> **~$1,335 take** for ~20 hr (~$67/hr) · **Service plan:** $50 trip + parts per call (or ~$99/yr/stall) ·
> **Risk:** ~none (paid on install). **5-yr/stall to Jeff: ~$350.**
>
> **OPTION 2 — Financed purchase** *(same as Opt 1, paid over time)* — Same **~$440/stall**, paid over
> ~12 mo. You front ~$90 parts, hold title till paid. Best for a whole-barn order she can't pay at once.
> **5-yr/stall: ~$350.**
>
> **OPTION 3 — Jeff keeps the $40/mo** *(managed service; most money, most obligation)* — **At install:**
> charge **~$140** (parts $90 + trip $50) so you're not out of pocket. **Recurring:** keep **$40/mo** (or
> $35 if you give the barn $5 for billing). **Cash payback** (on $90 parts): **~10 weeks.** **5-yr/stall:**
> $40×60 = $2,400 − $90 − ~$250 support ≈ **~$2,060 net** […] **Risk:** highest — CapEx, churn/vacancy,
> collection, and you **own ongoing support**.
>
> **SPLIT — $25 Jeff / $15 barn** *(both win; scale model)* — **Jeff 5-yr/stall:** $25×60 = $1,500 − $90 −
> ~$250 ≈ **~$1,160 net** (+ install at parts+trip). **Barn 5-yr/stall:** $15×60 = **$900**, zero CapEx →
> pure amenity profit for her.

**Side-by-side, verbatim:**

| | Opt 1 install | Opt 2 financed | Opt 3 Jeff keeps $40 | Split 25/15 |
|---|---|---|---|---|
| Who keeps $40/mo | barn | barn | **Jeff** | shared |
| Your cash at risk | $0 (paid on install) | ~$90 till paid | ~$90 (10-wk payback) | ~$90 |
| You paid | **now** | over ~12 mo | monthly | monthly |
| Your 5-yr net | ~$350 | ~$350 | **~$2,060** | ~$1,160 |
| Your risk/effort | low | low–mod | **high (owns support)** | moderate |
| Best for | clean, money-now | whole barn, terms | recurring biz | everybody-wins scale |

**Recommendation, verbatim** — including the line that reads Jeff's life circumstances back to him:

> 1. **Lucky Mike (unit #1): build at parts cost** (~$90) — it's the demo, not a sale.
> 2. **First real installs: Option 1** (~$440/stall, barn keeps $40). Money now, no support pager,
>    ~$350/stall even one-at-a-time. Proves demand at ~$90 risk.
> 3. **Once proven: the Split** for scale — recurring without killing the barn owner's incentive. Go full
>    Option 3 only if you truly want a recurring business + support load.
>
> > Solo, almost-60 reality: recurring = a support obligation that never sleeps. Option 1 keeps it simple
> > and fun; grow into recurring on purpose, not by accident.

**Traps in the Lucky Mike file:**

1. **DO NOT START THIS WITHOUT JEFF SAYING GO.** It is written into `CLAUDE.md` Pending Item 6 and into
   `INTEGRATION_NOTES.md` twice. It is an eager-looking, fully-specced project sitting in the repo — the
   exact shape of thing a session starts by accident.
2. **Two unreconciled parts-cost bases coexist.** `PRICING_AND_BUSINESS.md` computes its worked examples
   on **~$150/stall parts**; `BOM_OPTIMIZED.md` and `DEAL_OPTIONS.md` establish the real floor at **~$90**.
   `BOM_OPTIMIZED.md` says explicitly: *"Re-lock deal numbers at $90 when Jeff confirms."* **That
   re-lock never happened** — the pricing doc still runs on $150. Any quote generated from
   `PRICING_AND_BUSINESS.md` alone is high by ~$60/stall of assumed cost.
3. **The Platinum-vs-Elite tier name clash was flagged but never fixed** in the source Bible.
4. **Prices are June-2026 estimates and were never re-verified.** The doc says so itself ("Prices are
   rough 2026 estimates; budget the high end"). Two months of drift at tip. Re-price in-session.
5. **The legal checklist is entirely unchecked.** Selling outside the family before the LLC + liability
   insurance + waiver exist is real personal exposure — for a live-animal product. Say so plainly.
6. **`README_Project_Files.txt` promises HTML companions that were never committed.**
7. **`design-budget-guide-12page.png` (2.1 MB) is the ChatGPT deck as an image** — the source of the nine
   corrected errors. Do not treat pixels in it as fact; read `INTEGRATION_NOTES.md` first, which is
   exactly what `CLAUDE.md` instructs.

---

### 14.3 `docs/inventory/` — what Jeff owns, and what the LAN actually is

Two files, and together they are the project's memory of **money spent**. Both were created during the
2026-08-13 hardware push and updated through 2026-08-16.

#### 14.3.1 `HCC_INVENTORY.md` — the master hardware register

14,753 bytes. Created 2026-08-13 (`880addb`, "Add master hardware inventory register (Jeff's standing
job 2026-08-13)"). The standing job, quoting Jeff verbatim at the very top of the file:

> **Standing job (Jeff, 2026-08-13):** *"make sure we stay on top of the inventory that's coming in, what
> we buy from now on... really make sure that we're adding to the system rather than taking away from it.
> It's all got to be tracked meticulously."*

And the operating instruction, verbatim:

> Every session that buys, receives, installs, retires or repurposes hardware updates this file. A
> phone-readable copy lives at `iCloudDrive/HCC Inventory.md` — keep the two in sync whenever this changes.
>
> Status legend: **ORDERED** → **ON HAND** → **INSTALLED** · plus **RETIRED** / **RESALE**

**Zigbee layer — every item and every price, verbatim:**

| Item | Qty | Status | Cost | Location / Notes |
|---|---|---|---|---|
| Haozee Zigbee 3.0 dongle (CC2652P1, +20dBm) | 1 | **ON HAND 08-15** (photo) | $8.92 | Coordinator. USB extension cable ON HAND. Z2M, not ZHA. SMA antenna in box. |
| Tuya Zigbee door/window sensor (Excellux 2-pc) | 2 pks | **ON HAND 08-15** (photo) | $9.58 ×2 | battery end devices |
| Zigbee door/window sensor (Coolo 2-pc) | 1 pk | **ON HAND 08-15** (photo) | $6.39 | battery |
| Zigbee door/window sensor (Excellux 1-pc) | 1 | **ON HAND 08-15** (photo) | $2.79 | battery |
| Zigbee water leak sensor (Haozee) | 2 | **ON HAND 08-15** (photo) | $5.09 ea | battery |
| Zigbee water leak sensor (Gleco, probe cable) | 1 | **ON HAND 08-15** (photo) | $4.40 | battery — probe-cable unit visible in photo |
| Zigbee water leak sensor (Gleco **Z2M-only**) | 1 | **ON HAND 08-15** (photo, TZ-SJ-SD_E) | $4.62 | ⚠️ no ZHA — this locked the Z2M decision |
| Zigbee water detector (Excellux) | 1 | **ON HAND 08-15** (photo) | $6.19 | battery |
| ⚠️ Tuya **WiFi** water sensor (Qianhong "WiFi-Shuijin-1") | 1 | **ON HAND 08-15** (photo) | $5.68 | NOT Zigbee — wrong variant. Smart Life or shelf. |

The standing order attached to that table, verbatim — note it is Jeff's instruction, not a suggestion:

> **All 7 door/window + all 5 leak sensors + dongle photo-confirmed arrived 2026-08-15.
> NOT UNBOXED — Jeff's order: nothing gets set up until the camera/alert pipeline is verified.
> Setup day, first moves: disable any auto-firmware-update BEFORE first pairing (the Kasa rule);
> pick the Zigbee channel deliberately around the crowded 2.4 GHz WiFi (census 08-13); dongle on
> its USB extension cable, away from USB3 ports.**

> **Mesh status: zero routers.** Every device above is battery = end device. First routers will be the
> mains-powered light switches. Until then all devices connect directly to the dongle (CC2652P handles
> ~50 direct children — the reason not to swap to a ZBDongle-E, decided 2026-08-13).

**Lighting project table, verbatim (including the scrapped row, struck through in the source):**

- **Kasa HS220 dimmer, single-pole (WiFi, 150 W LED)** — **2 (confirmed)** — ON HAND —
  *"**ASSIGNED: living room** (12 ft from dongle — mesh contribution redundant there, WiFi is fine).
  #2 = bedroom or spare, pending Inovelli test"*
- ~~**Inovelli Blue 2-1 VZM31-SN (Zigbee)**~~ — 0 — **🔴 SCRAPPED — DO NOT BUY (Jeff, on price)** —
  ~~~$60 ea~~ — verbatim: *"**Jeff rejected these early on and it was never written down: "I was not
  paying $120 for a freaking dimmer switch." Recorded 2026-08-16 after a session re-proposed them. A
  budget router/dimmer alternative is still UNCHOSEN — research real prices in-session, cheapest-first,
  and lead with the $0 option (Kasa HS220 ×2 + MOES module already on hand).** Old plan kept below only
  for the wiring context:"* — with the dead assignment preserved: *"**#1 = KITCHEN, dimmer mode** —
  far-point router + the dimming test. **#2 = GARAGE man-door, On/Off mode + "3-Way Dumb" type** — the
  existing kitchen 3-way toggle KEEPS WORKING, no dummy switch needed. Mesh chain: dongle → kitchen →
  garage […] (Corrected 08-13: the 2-1 manual is titled "On-Off or Dimmer" — it does both modes.)"*
- **Leviton Decora E5603-SW 3-way (dumb)** — 1 — ON HAND — companion/spare — *"Reassigned 08-13: garage
  goes smart (Inovelli #2). Use this as a fresh dumb companion in the kitchen 3-way position if the
  existing toggle is worn; else shelf"*
- **GE UltraPro paddle, single-pole (dumb)** — 1 — ON HAND — *"bedroom repurposed-receptacle position"*
- **MOES single-gang dimmer module (the beige box)** — 1 — ON HAND — *"**ASSIGNED: single LED over
  kitchen sink (~12 W** vs 100 W/gang limit — finally a load it fits). ⚠️ needs a MOMENTARY push-button
  at the wall, not a standard toggle (toggles cause continuous-ramp misbehavior, researched 08-06).
  Confirm protocol from label: WM- prefix = WiFi/Tuya, ZM- = Zigbee"*
- **Lepro 14 W LED downlights w/ j-boxes** — several — ON HAND — **SPARES ONLY** — *"replacements for
  existing fixtures, NOT expansion (Jeff 08-13)"*

> **Mesh geometry (Jeff 08-13):** kitchen is the FARTHEST point needing mesh; living room is ~12 ft from
> the dongle. Router priority is therefore kitchen first — not living room as originally assumed.

**Wiring consumables & tools (from bin photos — no purchases needed for install work), verbatim:**

> 12/2 NM cable (yellow, good length) · Wago-style lever connectors (45-pc kit + loose) · old-work boxes,
> single-gang boxes, misc plates · NM staples · structured-wiring plates · multimeter · wire
> strippers/cutters · headlamp · screwdrivers · Energetic recessed fixture

**Irrigation:** 3/4" Orbit valve (zone-1 replacement) ×1 ON HAND — *"install tomorrow — zone 1 diaphragm
leak (~3.8 gal/hr, confirmed by meter)"* · 3/4" spare valves, several, ON HAND — *"one becomes the
**master valve** → PUMP + COM"* · spare wire runs manifold→controller, plenty, IN PLACE.

**Mower / sensor:** ESP32-D on screw-terminal breakout ×1 INSTALLED — *"fw 1.4.0, OTA-ready pending
private hosting"* · Spare ESP32 ×1 **TO ORDER (~$9)** — *"Jeff committed 08-11 — flash + bench-soak on
arrival; unblocks OTA proof + watchdog test"*.

**Garage door:** SONOFF MINI-D (Matter, dry contact) ×1 ON HAND — *"wire + eWeLink Inching +
Matter-commission (Pending Item 1)"* · Garage door position **2× contact sensors** (from inbound stock) —
*"**#1 at CLOSED position** (bottom of track/frame), **#2 at FULLY-OPEN position** (overhead track where
the door rests when up). Template sensor derives 3 states: CLOSED / OPEN / **PARTIAL** — covers Jeff's
hot-day "cracked open" venting. Possible later automation: pulse-wait-pulse for a repeatable vent stop"* ·
MyQ hub + sensor, 1 set, **RESALE** — *"eBay when Jeff gets to it"*.

**Network:** MoCA adapter set, 1 pr, **ON HAND — SHELF** — verbatim: *"Garage WiFi measured ADEQUATE
08-13 (mower box, last 50 uploads: mean −71.5 dBm, worst −76, zero buffered uploads ever; GaragePC + Tuya
plug also clean). **Trigger to deploy:** if the Matter garage relay feels laggy once installed → MoCA
backhaul + AP in garage. Needs coax at garage — unverified."*

**ISP block, verbatim:**

> **ISP (confirmed by photo 08-13):** AT&T Fiber, gateway **BGW320-500** (integrated ONT, WiFi 6). Admin
> UI at `http://192.168.1.254` — login uses the Device Access Code printed on the unit's label. LAN is
> 192.168.1.x (matches Beehive at .66). Household WiFi SSID in use is `Loewen301`, NOT the factory SSID
> on the label. The old Xfinity notes refer to Jeff's *email/mail*, not current internet service.

**Other on-hand (from CLAUDE.md spare inventory), verbatim:** KESU 500GB USB drive (AirTV DVR) · Lenovo
B570 (kiosk candidate) · Delam XLR mic (GaragePC voice) · WD 320GB bare HDD (Mint test drive) · HDMI-005
Miracast stick · HDMI→USB capture stick (kitchen TV chain) · AirTV 2 (inbound) · GaragePC HP TouchSmart 520.

**The five maintenance rules, verbatim — these are the file's contract:**

> 1. **Log at order time**, not arrival — ORDERED with ETA, promote to ON HAND when Jeff confirms the box.
> 2. **Nothing gets bought twice** because nobody checked this file. Check here first.
> 3. **Retired ≠ deleted** — mark RETIRED/RESALE with a reason, keep the row.
> 4. **Wrong-variant purchases get flagged loudly** (see the Qianhong WiFi sensor) so the lesson survives:
>    *verify the protocol variant in the listing before ordering.*
> 5. Sync the iCloud copy after every edit.

**The Sylvania entry (2026-08-13, commit `2caaebf`), verbatim in full:**

> **STATUS: ON HAND, working, but VENDOR LOCKED — cannot enter Home Assistant.**
> - Tuya hardware (port 6668 confirmed) at .199/.200/.202/.205, but Sylvania locked the product ID so
>   ONLY the "SYLVANIA Smart WiFi" app accepts them. Proven 08-13: Smart Life DETECTS a reset plug then
>   rejects it — "This device is not supported by this app."
> - Sylvania app CAN scan HA's Tuya QR but Tuya blocks the confirm step ("use the designated APP").
> - Only remaining route = LocalTuya with hand-extracted local keys. NOT attempted, not worth it.
> - **DECISION: replace with Zigbee plugs when the dongle arrives.** Keep these on Sylvania+Alexa meanwhile.
> - DO NOT re-attempt the Smart Life path — this is settled.

**The Zigbee mesh plug selection (2026-08-14, commit `9dad6a5`), verbatim in full** — one of the best
buying-traps documents in the repo:

> **BUY: THIRDREALITY Zigbee Smart Plug 4-Pack — ASIN B09KNHWF7L (~$50).** Listing MUST say
> "Zigbee Repeater" and "Requires ZigBee Hub". Z2M page 3RSP019BZ verified CLEAN — no routing warnings
> (contrast: Enbrighten 43080 warns it stops relaying for child devices). Tested better range than
> SONOFF S40 Lite (+5 ft through 2 walls) and zero dropouts over 14 days.
>
> **⚠️ SHIPS IN BLE MODE — must be manually switched to Zigbee mode before it will pair.** Out of the box
> it looks dead to the coordinator. Find the exact button sequence at pairing time.
>
> **⚠️ DO NOT BUY the lookalikes:**
> - THIRDREALITY "Smart Plug M3" B0FJRNW7YS = Matter over **WiFi**, not Zigbee.
> - SONOFF "S40 Lite" exists in BOTH Zigbee (B09XMH3X3G, currently OOS) and WiFi (B09LV7K4DH) versions,
>   same product name. Zigbee one says "Hub Needed"; WiFi one says "No Hub Required".
> **RULE: "Requires a hub" = the Zigbee one. "No hub required" = WiFi, useless for the mesh.**
>
> Quantity needed: 5 — four to replace the vendor-locked Sylvania living-room plugs, one for the garage as
> the relay to the door sensors.

**The 2026-08-14 order, verbatim (commit `b524553`) — total ~$33.83:**

| Item | For | Cost | Status |
|---|---|---|---|
| **Orbit 57280 3/4" FPT L-Series** auto valve | **MASTER VALVE** — the reason today's valve work slipped | $13.58 | ORDERED |
| **Kasa HS220** dimmer (Amazon Resale, **USED - Mint**) | 3rd dimmer — bedroom/kitchen/living room now all covered | $13.86 | ORDERED |
| Leviton 3-Gang Decora/GFCI wall plate | one of the new multi-gang boxes | $1.82 | ORDERED |
| Leviton F-Connector Decora insert | coax feed into a Decora plate | $4.57 | ORDERED |

With the used-hardware warning, verbatim:

> **⚠️ The HS220 is USED/refurb.** Before install: FACTORY RESET it (hold the button ~10 s until the LED
> blinks amber/green) so it is not still bound to the previous owner's TP-Link account, THEN disable
> auto-firmware-update, THEN pair. A used smart switch that is still claimed will silently refuse to pair.

**The backflow / irrigation-connection block (2026-08-15)** — belongs to the utilities story but the
*purchasing* record lives here, verbatim:

> **Finding:** the valve on the wall stub (old spigot penetration, 3/4" PEX from the main) is a plain
> Orbit valve with a **solid jar-top bonnet — no vent openings**. It is NOT a backflow device. The system
> has been running with **no backflow protection at the point of connection.**

| Item | Role | Cost | Status |
|---|---|---|---|
| **Orbit 3/4" electric anti-siphon valve** | **DECIDED 8/15** — master valve **+** backflow in one body, on the wall stub | $18.34 | to order |
| *old plain Orbit wall valve (jar-top, no vent)* | **BEING REMOVED ENTIRELY** — was never a backflow device | — | remove |
| **Orbit 57280** 3/4" FPT L-Series valve | bought 8/14 as the master — **redundant now.** Becomes the **SPARE ZONE VALVE.** | $13.58 | HAVE |
| **T&S B-969** 1/2" AVB (ASSE 1001, bronze) | too small — 1/2" chokes the 3/4" line. Not for this job. | — | have, unusable here |
| 3/4" check valve | in the pit with the zone valves | — | installed |

> **Orbit 51059** (3/4" FTP brass AVB, $18.49) was looked at and NOT bought — the combined anti-siphon
> valve does the same job plus the master-valve function for the same money and fewer fittings.
>
> **The 57280 is not wasted.** Once the anti-siphon valve is the master, the 57280 becomes the spare zone
> valve — genuinely worth having, since a failed zone-1 diaphragm is exactly what caused the ~88 gal/day
> leak found 2026-08-13. Only ONE valve needs to be wired as the master; don't wire both in series.

> **Honest limit, unchanged by any option considered:** the six zone valves are shutoff valves DOWNSTREAM
> of an atmospheric breaker, which the standard does not strictly permit. The by-the-book fix is a
> pressure vacuum breaker (ASSE 1020, ~$80-150) **plus annual testing by a licensed tester** — which is
> exactly the utility attention Jeff is avoiding. Decision made knowingly.
>
> **Replacement strategy (Jeff's call, and it is the right one):** an AVB fails SILENTLY — a stiff poppet
> looks fine and simply doesn't open when needed. So swap the cheap valve on a schedule rather than pay
> ~9x for bronze. Target: spring startup, every 1-2 years. **TODO: add a yearly HA reminder** in the
> alert batch.

**Traps in the inventory:**

- **This file is the state of record; the lighting plan is the strategy of record.** They disagree on
  quantities and prices. Inventory wins on "what do we own."
- **The Qianhong WiFi water sensor is the wrong-variant purchase** and is kept in the table deliberately
  as the standing lesson. Do not clean it up.
- **The Zigbee kit is ON HAND but NOT UNBOXED by Jeff's explicit order.** Do not propose starting Zigbee
  pairing without checking whether the camera/alert pipeline verification gate has been cleared.
- **"A budget router/dimmer alternative is still UNCHOSEN."** That is the live open question in this file
  at tip. It comes with an instruction: research real current products in-session, cheapest-first, lead
  with the $0 option.
- **The yearly AVB-replacement HA reminder is an unclosed TODO.**
- **The iCloud mirror (`iCloudDrive/HCC Inventory.md`) is not in the repo.** Nobody in a cloud session can
  verify it is in sync. Assume it may be stale.

#### 14.3.2 `NETWORK_MAP.md` — the LAN census and the label layer

11,226 bytes. Header, verbatim:

> Captured from the gateway's IP Allocation table. The BGW320 cannot rename devices — names below are
> self-reported hostnames; identifications are from MAC vendor prefixes plus project knowledge.
> **(?) = needs Jeff to confirm.**

This file exists because **the AT&T gateway has no device-rename feature** — so the repo *is* the rename
layer. It was built over roughly one evening on 2026-08-13 through ~20 commits (`4dc9336` through
`0277477` and beyond), several of which are corrections of earlier commits from the same evening. That
self-correcting trail is worth preserving as-is: `902d0dc` ("DellMasterBed is Jeff's Acer laptop, not the
B570") → `8aeacf0` ("laptops finally straight — JeffsLapTop IS the Acer") → `7f38015` ("DellMasterBed is
literally a Dell — Angela's 2nd office computer (per Angela)") → `793b949` ("**.173 is the B570 after
all** — Windows name inherited from Jeff's old Dell"). Four commits, one IP address, three reversals.

**Gateway config as of 2026-08-13, verbatim:**

> - 2.4 GHz: `Loewen301`, **channel pinned to 1**, password unchanged — all IoT untouched (mower posted at
>   −66 dBm post-change)
> - 5 GHz: renamed **`Loewen301-5G`**, same password — phones/TVs/laptops rejoin this for speed
> - Band steering: disabled (consequence of the split — intended)
> - Zigbee plan: **channel 25** on the dongle (max separation from WiFi ch 1)
> - Fixed allocations: **.66 Beehive** (Jeff, earlier) · **.215 Fire TV** (added tonight)

**Infrastructure, verbatim:** `.254` gateway AT&T BGW320-500 · `.66` **Beehive** (HA, Beelink J45) —
FIXED · `.196` RE200 — *"✅ CONVERTED 08-13: **wired Access Point** (Cat6 backhaul). Broadcasts Loewen301
(2.4, ch 6) + Loewen301-5G (WPA2, house password). Admin: http://192.168.1.196, password in HCC-secrets.
The volatile wireless-repeater hop is GONE"* · `.194` 301Server · `.121` GaragePC — *"HP TouchSmart […]
Account "Jeff Loewen Office 2" (NOT jeffl) needs its own password to browse — creds in
HCC-secretsgaragepc.txt […] Win10 Pro, SMB2 on"*.

**The CLEAN CENSUS section** ("after 'Clear and Rescan,' 2026-08-13 late — the label layer"), verbatim
preamble:

> Gateway cannot rename devices; THIS table is the authoritative label for every live device. 80+ stale
> entries purged; only live devices below. Sleepers (watches, mower ESP32, off Blink cams) will
> re-register as they wake — that's correct behavior.

Selected rows, verbatim, including the identifications that took real detective work:

- `.194` 301Server → *"✅ **THE BEAST** — confirmed 08-13 (its own Ethernet reports .194). CodeProject.AI
  host, Claude coworker machine"*
- `.171` "Nest Protect" → *"✅ **UNMASKED 08-13: Angela's bed-lamp Tuya socket** — proven by unplug test
  (down, held 60s+, at 14:50). Cheap Tuya firmware self-reporting a fake hostname. **There is NO Nest
  hardware in this house**"*
- `.231` Linux → *"✅ **SHARKY** (robot vacuum) — proven 08-13 15:03: died the moment Jeff switched it off"*
- `.209` TY_WR → *"✅ **Hot-water recirculating pump socket** (garage) […] Switched OFF but plugged in, so
  radio stays up. Flap = weak garage signal"*
- `.199/.200/.202/.205` → *"✅ **The 4 Sylvania SMART+ WiFi lamp plugs, living room** — Tuya port 6668
  confirmed on all four 08-13 evening. **NOT Echo Dots, NOT Bluetooth**: earlier "pull test showed
  nothing" was a monitor watching the wrong IPs."*
- `.170 / .224` → *"✅ **Garage-fan socket / Jeff's bed-lamp socket** — Tuya IDs embed their MACs; the
  "mystery ESP8266s" were store-bought Tuya sockets all along."*
- `.232` esp32-6BFCA4 → *"✅ **THE MOWER BOX** — confirmed 08-13 by 5-min heartbeat timing after the purge.
  The dormant esp32-21206C is a DIFFERENT board (?)"*
- `.164` WS-SD00PJBA → *"✅ **Angela's work computer** […] ⚠️ Both of Angela's work machines run corporate
  VPN + firewall — they take a LAN address but tunnel all traffic and won't answer local probes;
  **silence is NORMAL, never troubleshoot it.**"*
- `.176` JeffsLapTop → *"✅ **Acer Aspire E5-576** — i3-8130U (8th gen, AVX-capable — could host AI
  workloads unlike B570/GaragePC), 16 GB, 466 GB."*
- `.197` MyQ-E31 → *"⚠️ **MyQ hub still online — being sold on eBay. Unplug + factory-reset before listing**"*

**Cameras / privacy, verbatim:**

> **Zmodo fleet** — ✅ ALL DARK 08-13: .104 was a stale lease (already dead); the live .207 was found ON
> THE BACK DECK plugged in with the covered TV — unplugged by Jeff, factory-reset pending, eBay pile.
> Braxton-room units long gone. **Privacy issue closed**

**Extender fleet, verbatim** — with a login lesson worth its own line:

> - **RE200 → wired AP, done.** Login lesson: its 2018 login page fails SILENTLY when the request rides a
>   flapping wireless link — every "wrong password" was really a dropped link. Wired access worked first try.
> - **Generic "Wireless-N Repeater"** (no-name, 2.4-only, MAC 00:E0:20:84:30:FB, broadcasts
>   `Loewen301_Ext`, default 192.168.10.1 admin/admin): **RETIRE.** Cheap wireless-only repeat, pure
>   airtime pollution next to the new wired AP.
> - **D-Link DAP-1520** (dual-band, MAC 1C:5F:2B:B9:08:62): the `Loewen301-EXT`/`-EXT5G` broadcaster.
>   **RETIRE — no Ethernet port, conversion impossible** (**Jeff spotted the disqualifier himself**). eBay-able.

**Gateway changes 2026-08-14, verbatim (commit `f735771`):**

> - **2.4 GHz Mode: G/N -> B/G/N.** Done while troubleshooting a Kasa HS220 that would connect to its own
>   setup AP but never join the WiFi. G/N excludes 802.11b; the HS220 is a b/g/n device. Change is purely
>   permissive. Verified afterwards: all four Tuya sockets, B-Hyve, garage fan, RE200 and the mower box
>   reconnected normally.
> - **Guest SSID (LoewenGuest): DISABLED.** Jeff confirmed nobody uses it. One less broadcasting network
>   and one less entry point. Reversible in the same Wi-Fi page.
> - **Confirmed good and left alone:** WPA-2 (NOT WPA3 - would break older IoT), channel 1 fixed, 20 MHz,
>   SSID not hidden, WPS off, max clients 80, band steering off.
> - Kasa still had not joined as of this change. Prime remaining suspect is the Kasa app offering
>   **Loewen301-5G** in its network picker - the switch cannot see 5 GHz, so it accepts credentials and
>   then hunts forever. **Must be Loewen301.**

**Standing notes, verbatim:**

> - Names are device-reported; this file is the rename layer. Update it when devices are added/retired.
> - The 2.4 channel is PINNED (1). If WiFi congestion ever appears, re-evaluate here **and** check the
>   Zigbee channel before moving it.

**Traps in the network map:**

- **Every `(?)` row is unanswered and is explicitly Jeff's to answer**: *"Every (?) row is a question only
  Jeff can answer — fill them in as identified."* Still open at tip: `.82 none-6`, `.161 none-5`,
  `.166` possible AirTV 2, `.198` likely B-Hyve, `.222` NETGEAR NTV300 ("still used?"), `.227` iOS-style
  private address, the dormant `esp32-21206C`, and SHENZHEN RF-LINK (possibly the Weather Underground
  console KTNWHITE21).
- **Angela's work machines must never be troubleshot.** Their LAN silence is by corporate design.
- **Do not "fix" WPA-2 to WPA3** and do not un-pin channel 1 without checking the Zigbee channel first.
- **Do not undo the B/G/N mode change** — it exists because of the HS220.
- **The MyQ hub is still online and still needs an unplug + factory reset before eBay listing.**
- **Kasa switches must be given `Loewen301`, never `Loewen301-5G`.**

---

### 14.4 The hero-image apparatus — `HERO-STYLE-GUIDE.json`, `docs/hero-master-grade.md`, `dev.html`

Three files that together define "one film stock" for the whole app.

#### 14.4.1 `HERO-STYLE-GUIDE.json` (2026-06-24, `278a78e`)

7,158 bytes at the repo root. Commit message:

> Contains visual identity rules, lighting signature, composition rules, landscaping spec, brand
> consistency, typography spec, and ready-to-paste ChatGPT prompts for all 4 heroes (home, yard, weather,
> irrigation).

Top-level identity, verbatim: `"style_name": "Premium Estate Command Center"`,
`"visual_identity": "luxury residential cinematic realism"`.

**Grading:** contrast `medium-high` · saturation `natural + enhanced greens` · warmth `golden-hour bias` ·
shadow_detail `preserved` · highlight_rolloff `soft cinematic`.

**Lighting signature, verbatim:** time_of_day `"golden hour (primary rule)"` · key_light
`"warm directional sunlight"` · rim_light `"subtle glow outlining main subject"` · practical_lights
`"low garden path uplights (soft warm tone)"` · mood `"calm, expensive, cinematic, aspirational"` ·
avoid `"flat midday lighting, harsh overexposure"`.

**Composition:** camera_style `"low to mid eye-level cinematic"` · foreground_rule `"one dominant subject
per hero image"` · framing `"rule of thirds with slight center bias for hero subject"` · negative_space
`"reserved for UI overlays or app text"`.

**Environment / landscaping rules, verbatim** — this is where the guide stops being generic and starts
describing Jeff's actual property as it *should* look: grass `"deep emerald, striped, high density, no
patchiness"` · trees `"full, mature, dense canopies, no gaps"` · the Leyland pines spec —
`"structure": "dense living wall"`, `"spacing": "zero visible gaps"`, `"shape": "full bottom-to-top
taper"`, `"height": "tall privacy screen (~20ft visual impression)"` · beds: allowed elements
`["boxwoods", "roses", "ornamental grasses"]`, density `"clean luxury spacing, not cluttered"`.

**Brand consistency:** palette `["deep green", "warm gold", "charcoal shadows", "brick red accents"]`;
avoid `["cartoon styling", "over-HDR look", "over-saturated neon greens", "inconsistent lighting between
assets"]`.

**Typography:** style `"elegant serif + modern sans mix"` · placement `"lower third safe zone"` · color
`"soft gold or warm white"` · effects `"subtle glow, no harsh outlines"`.

**The final rule, verbatim:**

> Every generated hero image must look like it belongs to the same premium smart-home / landscaping
> command center application suite, with identical lighting logic, grading, and composition structure.

**The four ready-to-paste generation prompts** are stored in full in the JSON (`prompts.yard`,
`prompts.home`, `prompts.weather`, `prompts.irrigation`). The yard prompt names the actual mower and the
actual man, verbatim in part:

> Dominant subject: a confident middle-aged homeowner in a dark LawnCareHive t-shirt kneeling beside a red
> Toro TimeMaster 21200 30" walk-behind mower, slight smile, one hand resting on the handle. […] Bottom
> section text in elegant serif + modern sans mix, soft warm gold color, subtle glow: Title: 'YARD COMMAND
> CENTER APP' | Subtitle: 'MOW SMARTER. TRACK EVERY CUT.' | Small icons row: Mow Log · Service · GPS ·
> Hours · Diagnostics.

The home prompt: *"brick ranch-style house exterior at golden hour / twilight […] Title: 'HOME COMMAND
CENTER APP' | Subtitle: 'MANAGE · MAINTAIN · MONITOR' | Tagline: 'Everything. In One Place.'"*
The weather prompt: *"Ambient Weather professional weather station on a pole in the foreground […]
Title: 'WEATHER COMMAND CENTER APP' | Subtitle: 'REAL-TIME WEATHER. SMARTER DECISIONS.'"*
The irrigation prompt: *"active sprinkler heads arcing water over a deep emerald striped lawn at golden
hour […] Title: 'IRRIGATION COMMAND CENTER APP' | Subtitle: 'SMART WATER. HEALTHIER LAWN.'"*

**Traps:** the guide covers **4 heroes** (home, yard, weather, irrigation). The app at tip ships **9**
(`hero-cameras`, `hero-car`, `hero-guardian`, `hero-home-dusk`, `hero-irr`, `hero-lux`, `hero-truck`,
`hero-weather`, `hero-yard`). **Five heroes have no prompt of record.** If a hero ever needs regenerating,
only four can be reproduced faithfully; the rest must be re-derived from the style rules. Note also that
the prompts are written for **ChatGPT** image generation, and that the cloud sandbox has no image
generation tool — this is a coworker-PC job (see `CLAUDE.md` Pending Item 20, the zone-photo overlay
cleanup, which is blocked for exactly that reason).

#### 14.4.2 `docs/hero-master-grade.md` (2026-06-28, `ebedb85`)

2,516 bytes. Commit message:

> Save the hero color-grade spec as a repo reference doc, updated to reflect the actual implementation
> (container-level vignette, applyHeroGrades(), real CSS values) so it's accurate for future sections.

Purpose, verbatim:

> Apply ONE cinematic golden-hour color grade to every hero image so the whole app looks like one film
> stock. Do **not** replace image assets or change overlays/typography. New sections inherit the grade
> automatically.

How it works as shipped, verbatim:

> - **`applyHeroGrades()`** runs on init, finds every hero container (`.house-hero`, `.sec-hero`,
>   `.hcc-hero`), and: adds **`.hcc-hero-grade`** to the hero `<img>` (the color grade); adds
>   **`.hcc-hero-vignette`** to the container (the vignette)
> - To cover a NEW section's hero: just put its `<img>` inside a `.sec-hero` (or `.house-hero` /
>   `.hcc-hero`) container with a descriptive `alt`. Done — no per-hero CSS.

**The single most reusable technical note in the file, verbatim** — a real CSS trap, learned once:

> Note: the vignette is on the **container** (`::before`), not the `<img>`. An `<img>` is a replaced
> element and does not render `::before`/`::after`, so an image-level vignette would silently do nothing.

Art direction, verbatim:

> - Weather hero was the calibration reference; the grade is intentionally mild and now applies uniformly
>   to ALL heroes so the set looks like one evening, one camera, one color profile.
> - **Do not swap or regenerate hero images to fix tone — the grade handles tone.**
> - Keep all existing overlays and typography. Preserve composition and cropping.
> - To shift the look, change the shared `.hcc-hero-grade` values once (affects every hero together).
>   **Never add a per-hero `filter:`.**

**⚠️ MAJOR TRAP — this document's CSS is stale.** The doc records:

```css
.hcc-hero-grade{
  filter: brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg);
}
```

The **live** value in `index.html` at tip (line 463) is:

```css
.hcc-hero-grade{
  filter:brightness(1.06) saturate(1.02);
}
```

with an inline comment explaining why, verbatim from `index.html`:

> /* BAKED-IN HERO IMAGES — grade is baked into the .jpgs, but they came in dark, so lift brightness
>    (a correction, NOT a re-grade) and keep the vignette very light. */
> /* Images are already graded by the creator — keep this near-neutral, just a hair of lift so they
>    don't read dim on a phone. */

The vignette also changed: the doc records a two-gradient overlay at full opacity; the live rule is a
single `radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.5) 100%)` at `opacity:.15`,
commented *"barely-there edge darkening so it doesn't add to the image's own grade."*

**The regime changed** — heroes went from *ungraded photos graded by CSS* to *pre-graded JPEGs lightly
corrected by CSS* — and `hero-master-grade.md` was never updated. **The doc's *rules* (one shared grade,
container-level vignette, never a per-hero filter) are still correct and still enforced. Its *values* are
not. Read the values out of `index.html`.**

#### 14.4.3 `dev.html` — the hero consistency audit page (2026-06-28, `3509c74`)

5,439 bytes at the repo root, served at `/dev.html` on the live site. Commit message:

> Strengthen the shared hero grade (warmer sepia, more desaturation, deeper vignette + uniform warm wash)
> so five different photos read as one film stock. Add dev.html — a standalone audit page that applies the
> live grade to every hero and outputs real computed cssFilter/overlay + natural dimensions as JSON
> (served at /dev.html) for objective consistency checks.

**What it is for:** it is a developer-only measurement tool, not a user-facing page. It renders every hero
in a grid with the grade applied, then reads `getComputedStyle` on each `<img>` and on each container's
`::before`, and dumps the **real browser-computed** `cssFilter`, `overlay`, and natural `width`/`height`
as copyable JSON. Its own explanatory note, verbatim:

> cssFilter & overlay are read live via getComputedStyle (truth from the browser). width/height are each
> image's natural pixel dimensions. **If cssFilter is identical across all heroes, the grade is uniform.**

The header comment states the maintenance contract, verbatim:

> /* Mirror the LIVE hero-grade module from index.html so this page reflects exactly what the app renders.
>    Keep these in sync if the app grade changes. */

**⚠️ THE PAGE IS BROKEN AT TIP — two separate rots, both verified against the checkout:**

1. **Its grade constant is out of sync with the app, three ways.** `dev.html` declares
   `--hcc-hero-filter: brightness(.80) contrast(1.20) saturate(.82) sepia(.22) hue-rotate(-6deg);` —
   which matches neither the live `index.html` value (`brightness(1.06) saturate(1.02)`) nor the value in
   `docs/hero-master-grade.md` (`brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg)`).
   **Three files, three different grades.** The page's stated purpose — verifying grade uniformity — is
   therefore actively misleading: it audits a grade the app does not use.
2. **Two of its five hero images no longer exist.** Its `HEROES` array references
   `images/hero-home.jpg` and `images/hero-climate.jpg`; neither is in `images/` at tip (the home hero is
   now `hero-home-dusk.jpg`, and there is no climate hero at all). The page handles this gracefully — it
   renders a red `⚠ images/hero-home.jpg not found` tile and emits `"error": "image not found"` in the
   JSON — but two of five audit rows are dead.

**Traps:** do not treat `dev.html` output as authoritative about the app's grade; fix the constant and
the image list first, or read the grade straight out of `index.html`. Also note it is publicly reachable
on the deployed site (it is not gitignored, not excluded from the deploy) — harmless, but it is a dev tool
shipped to production.

---

### 14.5 `docs/home-theater-ai-plan.md` — the camera-AI / theater living doc

6,294 bytes. Four commits: `dfaa88f` (2026-07-10, "capture camera-AI + home-theater plan (beast as
AI/media brain, no subscriptions)"), `71a8cae` (2026-07-10, "confirm beast GPU (GTX 1050 Ti 4GB); settle
on CodeProject.AI snapshot detection path"), `05dc1db` (2026-07-12), `c13f101` (2026-07-14, "Audit:
root-cause camera/Fire TV alert outage (CodeProject.AI service down 3 days), resolve TV-alert plan conflict").

**Jeff's five goals (2026-07-09), verbatim, with the hard constraint stated first:**

> Jeff's goals (2026-07-09), **with a hard NO on subscriptions** (no Blink fee, no Zmodo fee, no
> per-month anything — he already pays for Claude/Clyde, Nabu Casa, and the domain):
>
> 1. Cameras look premium in the app (mockup-style big tiles) — ✅ DONE.
> 2. Review saved Blink clips **inside the app**.
> 3. Alerts tell you **what** triggered them — person / car / animal / package.
> 4. Alert can **pop up on the TV**, glance, return to the show.
> 5. Whole thing feels like a **top-of-the-line home theater with HA driving it all** — seamless, no
>    "cluster of shit," no constant resets.

That "no subscriptions" line is the same budget philosophy as the Inovelli rejection, stated three weeks
earlier and about a different category of spend. It is worth reading the two together.

**Hardware division, verbatim:**

> - **Beehive (Beelink J45, `192.168.1.66`)** — weak Pentium, no GPU, runs the whole house. **Keep it PURE
>   HA. Do NOT put media/AI on it.**
> - **The beast (`301Server`, `192.168.1.194`)** — **the designated AI + media brain.** 6-core CPU, ~2 TB
>   storage + a 500 GB external SSD, **Nvidia GeForce GTX 1050 Ti, 4 GB VRAM (confirmed via `nvidia-smi`
>   07-09)**, **runs 24/7**, sits in the viewing room, has unused partitions, **OS = Windows**. Also runs
>   Clyde (Claude Code). → Detection plan settled: **CodeProject.AI Server on Windows (uses the 1050 Ti
>   CUDA)** does snapshot object-detection (person/car/animal — no RTSP needed, fits Blink); add **LLM
>   Vision** […] Frigate/blinkbridge NOT needed for this path.
> - **Blink cameras** — snapshot/event only (no live RTSP), motion clips stored free on the Sync Module 2 USB.
> - **Screens/AV:** Vizio TV + sound (hardwired, is the beast's monitor); Apple TV (bedroom); Fire TV Max
>   (owned but "very slow").

**Honest limits — told, not papered over, verbatim:**

> - Premium DRM apps (HBO/Prime/Netflix) can be **resolution-capped on a PC** — a certified stick/Shield
>   may still edge out the beast for pure 4K DRM streaming. Likely answer: beast = AI + media + local
>   playback; add ONE small certified streamer only if a quality drop shows.
> - **Apple TV = no clean pop-up overlay.** (tvOS has no third-party overlay; Blink isn't proper HomeKit.)
> - Blink = snapshot/event, not continuous; a small delay is inherent.

**The Phase 2 reversal (2026-07-14, commit `c13f101`) — verbatim, in full**, because it is a decision that
overturned a four-day-old decision and the file records both:

> **Phase 2 — SUPERSEDED (07-14, Jeff's call): Fire TV + `alexa_media_player` kept as the real TV pop-up
> path, not Kodi.** The original 07-10 decision below was to route TV alerts through Kodi on the beast; in
> practice, the 07-11 session built (and got working) the ADB-paired Fire TV + `alexa_media_player` HACS
> route instead — a `media_player.play_media` call that mimics the spoken "show me the [camera] camera"
> command, wired into `AI Object Detected Notify`/`AI Show Camera on Fire TV` in `packages/hcc.yaml`.
> That's what's live today; a 07-14 audit found it had gone quiet for 3 days (see `CLAUDE.md` 07-14
> changelog entry — **root cause was CodeProject.AI silently not restarting after a reboot**, now fixed
> with delayed-start + failure-recovery). Jeff chose (07-14) to keep this path rather than switch to Kodi.
> **Kodi was installed on the beast but never finished** (web remote-control never enabled, never added to
> HA, launched once for 3 minutes total) — leave it installed/unused rather than build it out further
> unless priorities change. `docs/beehive/media-center-setup.md` describes the Kodi route that was NOT
> taken; **treat it as reference/superseded, not a live setup guide.**
> ~~Original 07-10 plan (not what got built): beast runs Kodi → HDMI → Vizio TV, HA sends alerts via
> `kodi.call_method` → `GUI.ShowNotification`, Fire TV stays secondary-only.~~

**Division of labor, verbatim:**

> - **Claude (cloud):** app-side — the in-app clip player + AI detection badge display on camera tiles
>   (✅ DONE 07-10). Owns all app code.
> - **Clyde (beast) + Jeff:** beast-side — install Kodi + CodeProject.AI, wire HA automations. **Clyde
>   treats app code as READ-ONLY.**

**Traps:** (a) `docs/beehive/media-center-setup.md` is a **superseded** document and this file is the only
place that says so — anyone reading it standalone will build the wrong thing; (b) the Fire TV popup path
described here as `AI Show Camera on Fire TV` was itself later *replaced* by a PiPup picture-in-picture
popup (see §14.6.2 — `automations.yaml` at tip carries `HCC — AI Camera Popup on Fire TV`, described as
*"Replaces the old full-screen-switch approach per Jeff's request"*, and the `hcc.yaml` version of
`AI Show Camera on Fire TV` is disabled with `initial_state: false`). **So this living doc is one
generation behind the live config.** (c) Kodi is installed-but-unused on the beast by decision — do not
"finish" it.

---

### 14.6 The configuration trees

#### 14.6.1 `beehive-config/` — the live HA configuration snapshot (disaster recovery)

Added in a single commit, `39c1194`, 2026-08-01 22:25:17 -0500: *"Add live HA config snapshot
(beehive-config/) as disaster-recovery backup"*. Five files:

| File | Bytes |
|---|---|
| `configuration.yaml` | 3,170 |
| `automations.yaml` | 10,533 |
| `hcc.yaml` | 22,608 |
| `scenes.yaml` | **0** |
| `scripts.yaml` | **0** |

**Critical framing:** this is a **snapshot of what runs on Beehive**, not a source of truth that Beehive
reads. Home Assistant runs its own copies under `/config/`. Editing a file here changes nothing on the
house until someone deploys it — the same trap that `a13df25` documents for the B-Hyve component (§14.6.3).

**`configuration.yaml`** — the whole file is small and worth recording in structure:

- `default_config:` — **load-bearing.** Its absence is what silently killed the recorder and with it
  utility bill tracking from 07-02 to 07-28 (see the `HCC — Recorder Down Watchdog` automation below,
  which exists solely because of that outage).
- `homeassistant: packages: !include_dir_named packages` — this is how `hcc.yaml` gets loaded.
- `automation: !include automations.yaml`, `mobile_app:`
- **`zone:`** — two hand-entered zones with real coordinates: `Barn` (36.716949, -86.65295, radius 150,
  `mdi:barn`) and `Work` (36.1624877, -86.7776215, radius 100, `mdi:parking`). The Work coordinates are
  the ones fixed on 2026-08-01 per `CLAUDE.md` Pending Item 9 (310 Commerce St parking garage, not the office).
- **`rest_command: pipup_notify`** — POSTs to `http://192.168.1.215:7979/notify` (the Fire TV), payload
  `{"title": …, "message": …, "duration": {{ duration | default(15) }}, "media": {"image": {"uri": …,
  "width": 480}}}`. This is the picture-in-picture alert transport.
- **`image_processing:`** — six near-identical `codeproject_ai_object` blocks, one per camera
  (`camera.301_backyard`, `camera.301_driveway`, `camera.301_front_doorbell`, `camera.front_right`,
  `camera.back_left`, `camera.garage`), all pointed at `192.168.1.194:32168`, `timeout: 60`,
  **`confidence: 60`**, `save_file_folder: /config/www/ai_snapshots/`, `show_boxes: true`, targets
  `person` / `vehicle` / `animal`.
- **`http: cors_allowed_origins:`** — `https://loewenhome.com`, `https://www.loewenhome.com`,
  `https://toro1-5rz.pages.dev`. **This is what lets the HCC web app talk to HA from the browser.** Any
  new domain for the app must be added here or the app silently fails cross-origin.

**`hcc.yaml`** — the HCC package, 22.6 KB, the largest config file. Contents:

*Helpers:* `input_number.mower_hours` (0–10000, step 0.1, `h`), `input_number.mower_battery_voltage`
(0–16, step 0.01, `V`), `input_text.mower_last_sync` (max 64), `input_boolean.hcc_panic_active`.

*Template sensors:* `HCC Mower Hours`, `HCC Mower Battery`, `HCC Mower Status`, and the three utility
sensors — `Water Gallons` (`sensor.water_meter_reading | float / 10`, `state_class: total_increasing`),
`Gas CCF` (`sensor.gas_meter_reading | float / 100`), and `Gas Cost`, whose formula is the actual
tariff, verbatim:

```
{% set ccf = states('sensor.gas_month') | float(0) %}
{% set therms = (ccf * 1.068) | round(0) %}
{{ ((13.44 + therms * 1.235) * 1.05) | round(2) }}
```

(i.e. $13.44 base + $1.235/therm, × 1.05 tax, with a 1.068 CCF→therm factor.)

*Automations in the package:* `hcc_panic_button` (webhook `hcc-panic-button`, `local_only: false`,
flashes `light.turn_on` on `entity_id: all` with `flash: long`, notification, auto-clears after 30 s);
`hcc_mower_sensor_sync` (webhook `hcc-mower-sensor`; note the hours guard is
`[payload.hours, states(input_number.mower_hours)] | max` — **hours can only ever move forward**, which is
exactly why a board swap makes the meter look frozen, per `firmware/mower_hours_esp32/README.md`);
`hcc_weather_severe`; `AI Camera Scan on Motion` (parallel, max 10, maps each motion binary_sensor to its
image_processing entity via an inline Jinja dict); **`AI Object Detected Notify`** (queued, max 20 —
branches person/vehicle/animal with distinct titles 🚨/🚗/🐾, person gets
`interruption-level: critical` + `critical: 1, volume: 1.0`, others `time-sensitive`; every push carries
the annotated snapshot, a deep link `tap_url: /home/areas-<camera>`, and a **"🔇 Mute 15 min"** action);
`AI Notify Mute Action` (writes `input_datetime.hcc_ai_mute_<cam>` 15 minutes out);
**`AI Show Camera on Fire TV` — `initial_state: false`, i.e. shipped DISABLED** (the ADB full-screen
takeover superseded by PiPup); `AI Arrival Suppression` (mutes all six cameras for 10 min when
`person.jeff_loewen` or `person.angela_loewen` goes `not_home → home` — verbatim description:
*"so walking in the door doesn't trigger camera alerts"*); `Angela Almost Home` (three triggers: zone
enter, a `numeric_state` on distance below 10, and the Mercedes `device_tracker.gle_350_device_tracker`);
`Blink Fast Motion Poll` — **note the mismatch: the alias and description say "every 30s" but the trigger
is `time_pattern: seconds: "/10"`, i.e. every 10 seconds.** Description verbatim: *"Forces a Blink refresh
every 30s so AI alerts aren't delayed by the default 5min poll."* **Trap: the description is wrong, or the
interval is; either way one of them needs correcting, and a 10-second forced refresh across six cameras is
six times the intended API load.**

*Scripts:* `hcc_good_night` (all lights off + notification); `hcc_resume_fire_tv`;
**`hcc_skip_commercial`** — at tip this file has `repeat: count: 3` of `input keyevent 90` at 1200 ms plus
a final `keyevent 126`, **which contradicts `CLAUDE.md` Pending Item 16**, which states the 3× press
"skipped way too far" in Sling and was *"Reduced live to a single `keyevent 90` press as a starting point
(`packages/hcc.yaml`)"*. **The snapshot is therefore older than the live config on this script** — a
concrete demonstration that `beehive-config/` is a point-in-time backup, not a mirror; `hcc_open_sling`;
`hcc_check_current_app` (`dumpsys activity activities | grep mResumedActivity`).

*Six `input_datetime.hcc_ai_mute_*` helpers* (one per camera), all initialised to `2020-01-01 00:00:00`
so the "muted?" template reads false by default.

*`rest:`* — the Weather Underground PWS pull, `resource: !secret weather_pws_resource_url`,
`scan_interval: 300`, four sensors (Backyard Temperature / Feels Like / Humidity / Wind).

*`utility_meter:`* `water_month` and `gas_month`, monthly cycle. *`sensor:`* a `derivative` platform
`Water Flow` off `sensor.water_gallons`, `unit_time: min`, `time_window: "00:05:00"` — the input to the
idle-flow leak alarm.

**`automations.yaml`** — the UI-created automations, ten of them, and the descriptions are where the
history is. Verbatim highlights:

- `HCC Watchdog - Integration Down Alert` — *"Notifies Jeff's phone the moment a key HCC integration
  (Blink, Fire TV, Mercedes) goes unavailable for 5+ minutes, instead of it failing silently for hours."*
- `HCC — Recorder Down Watchdog` — *"Alerts immediately if HA's recorder component logs an error (the
  exact failure that silently broke utility bill tracking 07-02 to 07-28)."* Message body, verbatim:
  *"Recorder logged an error — utility bill tracking (water/gas/electric) depends on recorder and will
  silently stop working. Check configuration.yaml for default_config: and restart HA."*
- `HCC — Blink Auto-Heal` — *"Blink's blinkpy library has a recurring, currently-unresolved upstream
  LoginError token-refresh crash (tracked in home-assistant/core#176836) that leaves camera/motion
  entities stuck at stale values instead of going 'unavailable' — silent for 10-15+ minutes or longer
  until someone notices. This reloads just the Blink integration within seconds of the crash instead of
  waiting for a manual full HA restart."* Reloads config entry `01KY0MYHR8VN4646FQDSXA7VDC`.
- `HCC — Blink Periodic Health Reload` — the backstop, and its description is a genuinely subtle HA
  finding, verbatim: *"The error-triggered auto-heal only fires on the FIRST occurrence of a given error
  message per HA session — repeats of the same message don't re-fire system_log_event, so a crash-loop
  can slip past it. This runs unconditionally every 15 minutes regardless of any detected error […]
  Cheap and safe — reload_config_entry was live-tested with zero disruption."*
- `HCC — AI Camera Popup on Fire TV` — *"On real CodeProject.AI object detection, pushes the actual
  annotated frame that triggered the detection (not a fresh/later snapshot) as a small
  picture-in-picture popup via PiPup, instead of taking over the whole TV. **Replaces the old
  full-screen-switch approach per Jeff's request.**"*
- `HCC — Angela Arrived at Barn` / `HCC — Angela Arrived at Work` — both use the Mercedes GLE's GPS,
  verbatim: *"using the Mercedes GLE's GPS since her phone doesn't reliably report location. Zone real
  coordinates captured live 08-01 as she actually arrived."* The work automation records the address in
  its own description: *"Work address: 150 4th Avenue North Suite 1700, Nashville, TN 37219."*
  **Trap: that address is in the automation description, while `configuration.yaml`'s `zone.work`
  coordinates are the 310 Commerce St parking garage — two different places, ~90 m apart per
  `CLAUDE.md` Pending Item 9, and never reconciled.**
- `HCC — Possible Water Leak (Idle Flow)` — flow > 0.05 for 30 min, gated on (everyone `not_home`) OR
  (01:00–05:00), AND all five named zone switches off (`switch.z2_front_left`, `z3_back_left`,
  `z4_back_right`, `z5_right_side_drive`, `switch.garden`). Description verbatim: *"built 08-01 after
  confirming the water meter/pit radio are healthy, not faulty."* **Trap: only five zone switches are
  checked; the system has six zones. `switch.z1_*` is absent from the condition list — plausibly because
  zone 1 was the leaking valve, but nothing in the file says so. Verify before trusting the alarm's
  false-positive rate.**
- `HCC — Morning Digest` — 7am push + persistent notification; description records the removed metric
  verbatim: *"Dropped the active-notification count 08-02: confirmed via live test that
  states.persistent_notification has been unreadable from templates since HA 2023.6 (notifications were
  removed from the state machine) -- it was silently always reporting zero, which is worse than not
  reporting it."*

**`scenes.yaml` and `scripts.yaml` are both 0 bytes.** **INFERRED:** these were captured empty because
HA's UI scene/script editors had never been used (all scripts live in the `hcc.yaml` package instead) —
the repo carries no note explaining them. Do not read the empty files as "scenes were deleted."

#### 14.6.2 `beehive/esphome/hcc-mower.yaml` — the ESPHome mower firmware (NOT the one in service)

14,367 bytes, committed 2026-06-23 in `75a7afd` ("Add complete Beehive brain setup — no Windows
required"). Header block, verbatim:

> ```
> HCC Mower Sensor — ESPHome Firmware
> ESP32 DevKit mounted on the Toro TimeMaster 21200
> Measures:  Engine hours (hall effect on ignition wire) / Battery voltage (ADC divider) /
>            Engine RPM (pulse counter on ignition wire) / GPS position + distance (u-blox NEO-6M) /
>            Pitch / Roll (MPU-6050) / Vibration + shock events (MPU-6050) / WiFi signal strength /
>            ESP32 internal temperature
> Reports:   → Home Assistant (ESPHome native API) → Cloudflare /api/hours (HTTP POST every 90s while running)
> Hardware:  GPIO27 — Hall effect sensor (ignition / engine running)
>            GPIO34 — Battery voltage ADC (through 100k/10k divider → 0-3.3V = 0-16.5V)
>            GPIO16 — GPS TX (UART1 RX on ESP32) / GPIO17 — GPS RX (UART1 TX on ESP32)
>            GPIO21 — SDA (MPU-6050) / GPIO22 — SCL (MPU-6050)
> ```

Substitutions: `name: hcc-mower`, `api_url: https://toro1-5rz.pages.dev/api/hours` (comment: *"Your
Cloudflare Pages site — update if domain changes"*). Secrets referenced: `esphome_api_key`,
`esphome_ota_password`, `wifi_ssid`, `wifi_password`. Fallback AP SSID `HCC-Mower-Fallback`.
`http_request: verify_ssl: false`.

Notable implementation details: haversine distance accumulation every 5 s with a **20 m jump filter**
(*"ignore GPS jumps > 20m in 5s"*); `total_dist_m` is `restore_value: true` (survives reboot) while
`session_dist_m` is not; battery ADC uses `multiply: 5.0` with the comment *"divider ratio:
(100k+10k)/10k = 11 → calibrate to match multimeter"* — **the code and the comment disagree (5.0 vs 11);
the header says the divider maps 0–3.3 V to 0–16.5 V, which is ×5. Flagged, unresolved in the file**;
RPM `multiply: 0.5` with *"2 pulses per rev on most small engines → adjust per your ignition"*; engine
considered running above 200 RPM; `integration` platform for engine hours with
`multiply: 0.0000277778` and the frank comment *"RPM·h → hours (1/60/60 ... simplified for
integration)"*; two POST intervals — a 90 s full payload while `engine_on`, and a 5-minute heartbeat
while off (*"so the dashboard can confirm the sensor box is alive while parked"*), with `rpm_peak` and
`shock_count` reset on HTTP 200.

**⚠️ THE BIGGEST TRAP IN THE CONFIG TREES: this is not the firmware on the mower.** The mower runs the
**Arduino/C++** firmware in `firmware/mower_hours_esp32/` at `FW_VERSION "1.4.0"` (see §14.7). The two
have *opposite* reporting behaviour:

| | `beehive/esphome/hcc-mower.yaml` | `firmware/mower_hours_esp32/` (in service) |
|---|---|---|
| While running | POSTs full payload every 90 s | **posts nothing** — samples with WiFi off |
| While parked | 5-min heartbeat | full payload every `IDLE_INTERVAL_S` |
| Language | ESPHome YAML | Arduino C++ |
| Engine detect | hall effect / pulse counter on GPIO27 | MPU6050 vibration threshold |

The firmware README states the running-posts-nothing behaviour as the load-bearing invariant, verbatim:

> **Running: posts nothing.** […] "A heartbeat followed a live reading" is a state that cannot occur —
> the server was once built on the assumption it could, and mow history silently never recorded a single
> mow because of it.

**Anyone who reads `hcc-mower.yaml` and writes server code against it will reintroduce the exact bug that
cost five mows of history.** `hcc-mower.yaml` should be read as a June-2026 design that was superseded,
not as documentation of the device. It carries no such warning in the file itself — that gap is worth
closing.

`beehive/esphome/secrets.yaml.template` (411 bytes) is the companion, verbatim in part:

> ESPHome secrets — copy this to /config/esphome/secrets.yaml on Beehive. Fill in your values.
> **This file is NEVER committed to git.** […] Generate a random 32-byte base64 key: `openssl rand -base64 32`

#### 14.6.3 `beehive/custom_components/bhyve/` — the hand-built Orbit B-Hyve integration

Seven files (`__init__.py`, `manifest.json`, `config_flow.py`, `coordinator.py`, `switch.py`, `const.py`,
`strings.json`) plus `INSTALL.md`, and a one-command installer `beehive/install-bhyve.sh`.

**Why it exists** — the root cause is recorded in commit `768cb6a` (2026-06-24), verbatim:

> Root cause: Cloudflare Workers blocked from B-Hyve API (error 530/1018) because B-Hyve's API rejects
> Cloudflare edge IPs.
>
> Fix: custom HA integration calls B-Hyve from home IP (192.168.1.66) where there's no block. Creates real
> switch entities per zone.

`INSTALL.md` says the same in Jeff-facing language, verbatim:

> This custom integration runs on YOUR Home Assistant (Beehive) so it calls the B-Hyve API from your home
> IP — not from Cloudflare.

`const.py` records the API archaeology: `API_BASES = ["https://api.orbitbhyve.com/v1",
"https://api.orbitonline.com/v1"]`, a browser-spoofing `User-Agent` (Chrome/120 on X11 Linux), an
`Orbit-Session-Token` header slot, `SCAN_INTERVAL_SECONDS = 60`, `DEFAULT_RUN_MINUTES = 10`. Three
successive fix commits in a single day tell the auth story: `d56d92b` "*Fix B-Hyve API URL — moved to
api.orbitbhyve.com*" → `c203988` "*Fix B-Hyve login body — API requires session wrapper object*" →
`77c70e7` "*Fix B-Hyve auth — use browser headers, correct API URL, drop orbit-api-key*" (all 2026-06-25).

**The last commit to this component, `a13df25` (2026-08-13), is one of the best debugging lessons in the
repo — verbatim in full:**

> `asyncio.TimeoutError` stringifies to an empty string, so `f"B-Hyve fetch error: {e}"` produced literally
> "B-Hyve fetch error: " with nothing after it. That dead end sent today's investigation down three wrong
> paths - changed password, missing orbit-app-id header, datacenter IP block - before the emptiness itself
> became the clue. Now always includes `type(e).__name__`.
>
> Also raised the devices-fetch timeout 10s -> 30s. One slow response from a third-party cloud API dropped
> every zone entity out of HA until the next successful poll, which reads as a broken integration rather
> than a slow request.
>
> ⚠️ **NOT DEPLOYED.** Beehive runs its own copy under `/config/custom_components/bhyve/`. This machine has
> no Python, so `python3 -m py_compile` cannot run here - deploy via Studio Code Server's terminal and
> compile-check there BEFORE restarting HA, per CLAUDE.md. The integration is currently healthy (6 zone
> entities), so there is no reason to rush an unvalidated Python change onto it.

**Trap: `a13df25` is still NOT DEPLOYED as of tip (2026-08-16).** No later commit touches
`beehive/custom_components/bhyve/`. **The repo copy is AHEAD of the house.** Anyone reading the improved
error message in the repo and then reading an HA log that lacks the exception type is looking at two
different builds. Also note the generalizable lesson: **never log an exception without its type** —
several exception classes stringify to nothing.

`install-bhyve.sh` downloads the seven files with `wget` from the **raw GitHub URL of this very branch**:
`https://raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/beehive/custom_components/bhyve`.
**Trap: that hardcodes both the repo and the branch name into a script Jeff runs on the house.** If the
branch is ever renamed or the repo made private, the installer breaks silently. It also means the
installer would happily deploy the **undeployed, unvalidated** `a13df25` change.

#### 14.6.4 `beehive/blink/` — the vendored Blink integration

Twelve files (`__init__.py`, `alarm_control_panel.py`, `binary_sensor.py`, `camera.py`, `config_flow.py`,
`const.py`, `coordinator.py`, `diagnostics.py`, `manifest.json`, `sensor.py`, `services.py`,
`strings.json`, `switch.py`). This is a **fork of Home Assistant core's `blink` integration, vendored into
the repo and patched**, with a custom version string in `manifest.json`:

```json
"requirements": ["blinkpy==0.25.7"],
"version": "2026.7.0-hcc-blinkpy257"
```

The commit trail is the whole 2FA saga:

```
b86a37e 2026-06-25  Add Blink 2FA fix installer — /blink endpoint + patched config_flow.py
c7ad70d 2026-06-25  Blink config_flow: defensive imports for BlinkTwoFARequiredError and HARDWARE_ID
e830083 2026-06-25  Blink: bundle all 12 integration files in repo — no GitHub API needed
b89ba28 2026-06-25  Blink 2FA: fix validate_input swallowing BlinkTwoFARequiredError
dbc8fbe 2026-06-25  Blink coordinator: surface auth failure as ConfigEntryAuthFailed
f3ae126 2026-07-03  Blink 2FA: dedicated cookie session to fix 'empty_cookies' login failure
1f2cdec 2026-07-03  Blink: bump blinkpy 0.25.2 -> 0.25.7 — the actual fix for 'Login failed'
```

**`1f2cdec` is the one that mattered — verbatim:**

> Found the real root cause by diffing blinkpy in the harness: Blink changed their OAuth signin to signal
> 2FA-required with HTTP 202 + tsv_state/tsv_methods fields. blinkpy 0.25.2's oauth_signin only recognizes
> the OLD 412 code, so it returns None -> _oauth_login_flow logs 'Login failed' -> ConfigEntryNotReady.
> That's exactly Jeff's log. blinkpy 0.25.7 added 202/tsv handling (confirmed in api.py:oauth_signin).
> auth.py is unchanged 0.25.2->0.25.7 so the custom component imports stay valid.
>
> Fix: pin blinkpy==0.25.7 in manifest. **Kept the dedicated-session tweak as belt-and-suspenders but
> corrected its comment (the cookie theory was the wrong diagnosis; the 202 handling is the fix).**

That last sentence is the model behaviour worth preserving: a wrong diagnosis (`f3ae126`, "empty_cookies")
was left in place as harmless belt-and-braces but its **comment was corrected** so nobody later believes
the wrong story.

`coordinator.py` at tip carries the `dbc8fbe` patch — `BlinkTwoFARequiredError`/`UnauthorizedError` →
`ConfigEntryAuthFailed`, `ClientError`/`TimeoutError` → `ConfigEntryNotReady`, everything else →
`ConfigEntryError`, plus an explicit `if not self.api.available: raise ConfigEntryAuthFailed`.
`SCAN_INTERVAL = 300`.

**Traps:** (a) this is a **fork of a core integration** — a Home Assistant upgrade that ships a newer
core `blink` will not overwrite a copy in `custom_components/`, so the fork silently wins and can drift
behind upstream indefinitely; the version string `2026.7.0-hcc-blinkpy257` is the only marker of what it
was forked from. (b) The known upstream crash is **not fixed here** — it is *worked around* at the
automation layer by the two auto-heal automations in `automations.yaml`, which reload config entry
`01KY0MYHR8VN4646FQDSXA7VDC` on error and unconditionally every 15 minutes. **That entry ID is a magic
constant in two automations; if the Blink integration is ever removed and re-added, both automations
break silently.** (c) `blinkpy` is pinned; do not unpin without re-checking the 202/tsv handling.

#### 14.6.5 `beehive/install.sh` and the PowerShell installers

`beehive/install.sh` (13,421 bytes, `75a7afd` 2026-06-23, corrected by `1f3ce1a` "*Fix Beehive setup —
correct commands for the `ha >` CLI, curl not wget*"). Header, verbatim:

> ```
> HOME COMMAND CENTER — BEEHIVE BRAIN SETUP
> Run INSIDE the HA Terminal add-on:
>   curl -fsSL https://toro1-5rz.pages.dev/beehive/install.sh | bash
> ```

It guards with `[[ -d /config ]] || die "Must run from inside the Beehive HA Terminal add-on"`, installs
HACS (`curl -fsSL https://get.hacs.xyz | bash -`, skipped if present), creates `/config/packages`, and
**heredocs the entire `hcc.yaml` package inline**, then patches `configuration.yaml`, installs/starts the
ESPHome add-on via the `ha` CLI, and copies the mower ESPHome config.

**Trap: `install.sh` contains its own embedded copy of `hcc.yaml`, which is now a third version** — the
heredoc in `install.sh` (June), the snapshot in `beehive-config/hcc.yaml` (August 1), and whatever is
actually live on Beehive. The `install.sh` copy still contains an `hcc_irrigation_started` automation and
a "Fall freeze warning (winterize reminder)" that do **not** appear in the August snapshot. **Re-running
`install.sh` on a live Beehive would overwrite `/config/packages/hcc.yaml` with the June version and
silently delete every AI-camera automation, every mute helper, the PiPup rest_command wiring, and the
utility sensors.** It is a bootstrap script, not a repair script. **Do not re-run it on a configured
system.**

Root-level PowerShell companions, both "run on the Beast": `install-hacs.ps1` (4,527 bytes —
*"HCC - HACS + B-Hyve Auto Installer / Run this on the Beast to install HACS on the Beehive"*,
`$HA_IP = "192.168.1.66"`) and `setup-hcc.ps1` (6,644 bytes — *"HCC BEEHIVE SETUP SCRIPT / Run this on
the Beast to configure Home Assistant"*, step 1 is obtaining an HA long-lived token). These are the
Windows-side siblings of the bash installer and carry the same "bootstrap only" caveat.

---

### 14.7 `firmware/mower_hours_esp32/` — the canonical mower firmware

Three files: `README.md`, `mower_hours_esp32.ino`, `secrets.example.h`. Added in one commit, `a1cfa53`,
2026-08-11 19:31:14 -0500. The README's first line, verbatim:

> **This is the canonical copy.** It lives in the repo deliberately.

**Why it's here — verbatim, and this is one of the most important paragraphs in the entire project record:**

> For months the hour meter didn't work. The box sent `hours_seconds`, the app read `d.hours`, and nothing
> converted between them — 5.5 hours of real runtime and 6.3 km of real mowing went unrecorded across five
> mows. **Jeff was told the sensors were faulty and bought replacement hardware to fix what was a
> field-name mismatch.**
>
> The reason it went unnoticed so long is structural, not carelessness: the cloud session that owned the
> server code has **no outbound network** and **could not see this file**. It was writing
> `functions/api/hours.js` against `CLAUDE.md`'s prose *description* of the firmware, and that description
> was wrong. Nobody could diff the two halves of the contract because only one half was in the repo.
>
> Now both halves are here.

That is the "cost him real money" event, stated in the repo's own words. The commit message repeats it and
adds the verification detail:

> WiFi SSID, WiFi password and device secret move to secrets.h, which is gitignored because this repo is
> public. secrets.example.h is the committed template. **Compiles byte-identical (1111016 bytes)**, so this
> is purely a source reorganisation.
>
> Documented plainly in the README that this does NOT make the compiled binary safe - those strings are
> plaintext inside the .bin, so firmware images still cannot be served from a public URL and OTA needs an
> authenticated delivery path. **Also recorded that `strings` is absent on this machine and returns a
> silent false "clean"; `grep -a` is the check that actually works.**

**The credentials section, verbatim:**

> **This repo is public.** WiFi SSID, WiFi password and the device secret live in `secrets.h`, which is
> gitignored. […]
>
> **Splitting the source does NOT make the binary safe.** Those strings are compiled into the `.bin` as
> plaintext. Verified on 2026-08-11 by grepping a real build for each value from `secrets.h` — the SSID,
> the WiFi password and the device secret were all present, in the clear, in the compiled image.
>
> Reproduce it yourself before trusting any hosting decision (and note `strings` is not installed on
> Jeff's PC — `grep -a` on the binary is the check that actually works; using `strings` returns a silent
> false "clean"):
>
> ```
> grep -qaF "$(sed -n 's/.*HCC_WIFI_PASS *"\(.*\)"/\1/p' secrets.h)" build/*.bin && echo LEAKS
> ```
>
> So a firmware image **must never be served from a public URL**, including this project's own Pages site.
> OTA delivery has to be authenticated. That is a hosting problem, separate from source layout, and it is
> why OTA is written but not yet enabled.

**Building and flashing, verbatim** — including two hardware quirks that will otherwise cost an hour each:

> ```
> arduino-cli compile --fqbn esp32:esp32:esp32 .
> arduino-cli upload -p COM<n> --fqbn esp32:esp32:esp32 .
> ```
> `arduino-cli` on Jeff's PC:
> `%LOCALAPPDATA%\Programs\arduino-ide\resources\app\lib\backend\resources\arduino-cli.exe`
>
> **Auto-reset does not work on this board.** Jeff must hold the BOOT button down through the *entire*
> upload or it fails with `Wrong boot mode detected (0x13)`. Kill the Arduino IDE's `serial-monitor`
> helper process first if it holds the port — just that process, not the IDE, which may have unsaved work.
>
> **Engine hours survive a reflash** (NVS via `Preferences`) as long as nothing does an erase-all.
> Verified across five flashes. They do NOT survive swapping to a different physical board.

**What the box actually does, verbatim** (the invariant that the ESPHome YAML contradicts — see §14.6.2):

> - **Running: posts nothing.** Samples every `SAMPLE_INTERVAL_S` with WiFi off. "A heartbeat followed a
>   live reading" is a state that cannot occur — the server was once built on the assumption it could, and
>   mow history silently never recorded a single mow because of it.
> - **Parked: full payload every `IDLE_INTERVAL_S`.**
> - The first parked post after a mow carries that mow's totals, flagged `source:"mow_end"` +
>   `mow_ended:true`. Later ones are `heartbeat`.
> - Failed posts buffer in RTC memory and replay later as `source:"buffered"`.

**Two-way control channel (1.4.0+), verbatim:**

> `postJson()` keeps the POST response, so every upload is an exchange. The reply carries desired config
> and at most one command, acked by id so a box that dies mid-command retries and never applies one twice.
>
> Commands: `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`.
> Config: `vib_threshold`, `idle_interval_s`, `sample_interval_s`, `track_min_step_m`, `gps_step_max_m`,
> `flush_every_s`, `service_mode` — all clamped server-side in `functions/api/hours.js`.
>
> Issuing anything requires the family password or the maintenance token. The box's own uploads stay
> unauthenticated because it has nowhere safe to keep a secret.
>
> **The box sleeps between uploads and cannot be woken**, so a command lands on its next post — up to 5
> minutes while parked. That is the hardware, not a bug.

**Tilt, verbatim** — with the honest limit stated rather than hidden:

> Raw pitch/roll describe the *enclosure*, which is bolted in at an angle — a level mower read −12.4° /
> 28.5° and the app's tip-risk warning read CRITICAL in a garage. `zero_tilt` captures the gravity vector
> once while level; everything after is measured relative to it […]
>
> Honest limit: one captured vector fixes which way is *down*, not which way is *forward*. Total tilt is
> exact; the fore/aft vs side-to-side split is relative to how the box sits in its mount.

**Board swap, verbatim:**

> Config restores itself — a fresh board reports `cfg_rev: 0`, the server sees it's behind and pushes
> everything on the first upload.
>
> **Engine hours, lifetime distance and the tilt reference do not.** They live only in that chip's flash.
> After a swap: re-run SET HOURS from the physical meter (or the hour meter appears frozen for hours of
> real mowing, since the app only ever lets it move forward), and send `zero_tilt`.

**Ownership, verbatim:** *"This subsystem is the local coworker session's, end to end — see `CLAUDE.md`
Rule 13."* And the pre-change gate: *"`node scripts/mower-hours-test.mjs` covers the server half. The
invariants that must not regress are listed in `docs/mower/`."*

**From the `.ino` itself** — two comment blocks worth preserving verbatim. The watchdog, quoting Jeff:

> Hardware watchdog. Jeff's words for why this exists: **"I would only push it if it got hung up."** A
> wedged wake — GPS never returning, a WiFi stack stuck below its own timeout — used to mean the box was
> silently dead until someone noticed and walked to the garage to press EN. With this, the chip resets
> itself. 180 s against a normal wake of roughly 25 s […] so it can only fire on a genuine hang, never on
> a slow-but-working one. A trip shows up as `reset_reason` in the next payload, so a self-heal is visible
> rather than invisible — "it hung and recovered" is worth knowing about.

And the version discipline:

> Bumped on every flash. Reported in every upload so there is never any doubt about which build is
> actually on the mower — the single most useful field when something starts behaving differently and
> nobody remembers what changed.
> `#define FW_VERSION "1.4.0"`

The board header also records hard-won pin rules, verbatim: *"Board: ESP32-WROOM-32 30-pin NodeMCU dev
board (Silicon Labs CP2102 USB, USB-C). Flash with a DATA USB-C cable. […] **Do NOT use GPIO6-11 (wired to
flash) or ADC2 pins for the battery (ADC2 can't be read while WiFi is on).**"* And, honestly, about RPM:

> About the RPM number: it is a best-effort estimate from vibration, **NOT a true tachometer**. It may land
> on your real speed (~3000), or get fooled by a deck/chassis resonance, or report "--" when the signal is
> too noisy. If it's junk, ignore the RPM panel — hours are unaffected.

**`.gitignore` protection, verbatim:**

```
# Firmware credentials — this repo is PUBLIC
secrets.h
firmware/**/secrets.h
```

**Traps:** (a) **never serve a firmware `.bin` from the Pages site** — the OTA command exists in 1.4.0
but OTA is deliberately not enabled for exactly this reason; (b) `strings` gives a false clean — use
`grep -a`; (c) hold BOOT for the whole upload; (d) after a board swap the hour meter *looks broken* and
isn't — re-run SET HOURS; (e) this subsystem belongs to the local coworker session, not the cloud session
(CLAUDE.md Rule 13).

---

### 14.8 `_headers` — Cloudflare Pages headers, and the wildcard that silently didn't work

400 bytes at tip. Six commits, and the last three (all 2026-08-15) are a debugging sequence worth keeping
in full because the lesson is Cloudflare-specific and expensive to re-learn.

Contents at tip, verbatim:

```
/service-worker.js
  Cache-Control: no-cache, no-store, must-revalidate
  CDN-Cache-Control: no-store

/
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

/index.html
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
```

History:

```
186025f 2026-08-15  _headers: attach security headers to exact paths, drop the /* wildcard
37fac0c 2026-08-15  _headers: move /* wildcard last, drop leading comment block
7a1d250 2026-08-15  Audit 2026-08-15: security headers, backyard AI threshold finding, doc corrections
e37a193 2026-07-21  Fix SW cache permanently: registration + CDN-Cache-Control + no-store
70dba84 2026-07-21  Fix stale HTML: no-cache headers + SW cache bypass for index.html
173270a 2026-07-20  Fix root cause of recurring stale-cache bug: no-cache service-worker.js
```

**Attempt 2 (`37fac0c`), verbatim:**

> The first attempt put the `/*` security-header block at the top of the file with a four-line `#` comment
> above it, and Cloudflare Pages never applied it - verified live for 5+ minutes after the deploy landed
> (CLAUDE.md from the same commit was serving, so the deploy itself was fine). **The pre-existing
> exact-path rule for `/service-worker.js` WAS being applied, so `_headers` works on this project; only the
> new wildcard block was ignored.** Retrying with the wildcard placed after the exact-path rules and no
> comments above it, which matches the shape Cloudflare documents.

**Attempt 3 — the resolution (`186025f`), verbatim:**

> **Two deploys proved the `/*` wildcard is silently ignored on this Pages project** - no
> X-Content-Type-Options / X-Frame-Options / Referrer-Policy on either the app shell or a static asset,
> 6 minutes after each deploy landed. Exact-path rules DO work here (the `/service-worker.js` rule returns
> its non-default Cache-Control), so the headers now hang off `/` and `/index.html` instead.
>
> That covers the app shell, which is where X-Frame-Options and Referrer-Policy actually matter; static
> images are not meaningfully exposed by their absence.

**Traps:** (a) **`/*` wildcards do not work on this Pages project** — two deploys proved it, don't try a
third; use exact paths. (b) The `service-worker.js` `no-cache, no-store` + `CDN-Cache-Control: no-store`
rules are the *permanent* fix for a recurring stale-cache bug (three commits over 2026-07-20/21) — do not
"optimize" caching back on for that file. (c) Static assets (images, `functions/`, `/dev.html`) carry no
security headers by design and by acceptance, not by oversight.

---

### 14.9 `.github/workflows/deploy.yml` — the workflow that never worked and mailed Jeff 124 times

The file at tip is a monument with a comment block on top, verbatim:

```yaml
name: Deploy HCC to Cloudflare Pages

# DISABLED 2026-08-06. This workflow has never worked — the CLOUDFLARE_API_TOKEN
# secret does not exist, so every push failed and emailed Jeff (124 failure
# notices in one week). Deploys do NOT go through Actions: Cloudflare Pages'
# native Git integration watches claude/time-master-project-liq1jw and deploys
# on push, independently of this file. See CLAUDE.md "Deployment Pipeline".
# Trigger reduced to manual-only so it can never fire automatically again.
on:
  workflow_dispatch:
```

The job itself is unchanged: `runs-on: ubuntu-latest`, name *"Deploy to toro1-5rz.pages.dev"*,
`actions/checkout@v4` then `cloudflare/pages-action@v1` with
`apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`, `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`,
`projectName: toro1`, `directory: .`.

History: `8fdae39` (2026-06-22, "Add auto-deploy GitHub Action to Cloudflare Pages"), `1d7cacc`
(2026-06-22, "Fix Cloudflare Pages project name to toro1"), `ac99b33` (2026-08-06, the disable).

**The disabling commit, `ac99b33`, verbatim:**

> This workflow has never worked. It calls `cloudflare/pages-action@v1` with `secrets.CLOUDFLARE_API_TOKEN`,
> which does not exist on this repo, so every push to the branch failed instantly and sent Jeff a failure
> email -- **124 of them in the past week alone, dozens on 08-06 by itself. It was the single largest
> source of mail in his inbox.**
>
> Deploys are unaffected. Per the CLAUDE.md Deployment Pipeline section, the app is deployed by the native
> Cloudflare Pages Git integration watching `claude/time-master-project-liq1jw`, entirely independently of
> Actions.
>
> Trigger changed from push to `workflow_dispatch` (manual-only) rather than deleting the file, so the job
> definition stays available if the secret is ever added, but it can never fire automatically again.

**This is the record's clearest example of a failure that was invisible to every session and highly
visible to Jeff.** It ran from 2026-06-22 to 2026-08-06 — about six weeks — failing on literally every
push, and nothing in the repo noticed until someone looked at Jeff's inbox.

**Traps:** (a) **Deploys do NOT go through GitHub Actions.** Cloudflare Pages' native Git integration
watches the branch. Do not debug a deploy by looking at Actions. (b) Do not re-enable `on: push` unless
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` have actually been added as repo secrets — otherwise
the email flood restarts. (c) The Pages project name is `toro1`, the site is `toro1-5rz.pages.dev`, with
custom domains `loewenhome.com` / `www.loewenhome.com` (per the CORS list in `configuration.yaml`).

---

### 14.10 Cross-cutting traps for future sessions — the short list

Everything below is evidenced above; this is the extract a future session should read first.

1. **Inovelli is dead. Do not propose it. Do not propose any ~$46–60 mesh dimmer.** The absence of the
   word "Inovelli" in a doc is what marks the *current* plan. Search Kasa / plug / mesh.
   (`docs/lighting/zigbee_dimmer_selection_2026-08-13.md`, `1572b4a`)
2. **A budget mains-powered Zigbee router is the live open lighting question**, and the instruction is
   explicit: research real current products in-session, cheapest-first, and lead with the $0 option
   (2 × Kasa HS220 + the MOES module, already on hand).
3. **Garage two-location switching is OPEN**, despite one line in `CLAUDE.md` claiming it is settled.
   HS210 kit vs. single HS200 + repurposed kitchen position. Jeff decides before ordering.
4. **`docs/lighting/HCC_Lighting_Plan.html` is the strategy of record but frozen at 2026-08-13.**
   `docs/inventory/HCC_INVENTORY.md` is the state of record. Reconcile before quoting prices.
5. **Kasa new-firmware HS220s need TP-Link account credentials in HA** (control still local), the setup-AP
   provisioning path is a proven dead end (`error_code 1003`), and
   `switch.<device>_auto_update_enabled` must be turned OFF on every unit.
6. **Kasa switches join `Loewen301` (2.4), never `Loewen301-5G`.** The gateway is on B/G/N because of them.
7. **Lucky Mike is queued. Do not start it.** And if it is ever quoted, use ~$90/stall parts, not the
   ~$150 still baked into `PRICING_AND_BUSINESS.md`'s worked examples.
8. **The Zigbee hardware is on hand and deliberately NOT unboxed** pending camera/alert pipeline
   verification. Disable auto-firmware-update before first pairing.
9. **Do not troubleshoot Angela's work machines.** Their LAN silence is corporate VPN behaviour.
10. **`beehive/esphome/hcc-mower.yaml` is NOT the mower's firmware.** The Arduino build in
    `firmware/mower_hours_esp32/` is, and it *posts nothing while running*. Writing server code against
    the ESPHome YAML reintroduces the bug that lost five mows of history and made Jeff buy replacement
    hardware he didn't need.
11. **Never serve a firmware `.bin` from a public URL.** Credentials are plaintext in the binary; `strings`
    lies, `grep -a` tells the truth.
12. **`beehive/install.sh` is a bootstrap, not a repair tool.** Re-running it overwrites
    `/config/packages/hcc.yaml` with a June-2026 version and deletes the entire AI-camera stack.
13. **`beehive/custom_components/bhyve/` in the repo is AHEAD of the house** — `a13df25` is still
    NOT DEPLOYED. And never log an exception without `type(e).__name__`.
14. **`_headers` `/*` wildcards are silently ignored on this Pages project.** Use exact paths.
15. **Deploys do not go through GitHub Actions.** The workflow is dead by design; re-enabling `on: push`
    without the secrets restarts a 124-email-per-week flood.
16. **`docs/hero-master-grade.md` and `dev.html` both record stale grade values** and `dev.html`
    references two images that no longer exist. Read the live grade from `index.html`.
17. **Blink config entry `01KY0MYHR8VN4646FQDSXA7VDC` is a magic constant in two auto-heal automations.**
    Removing and re-adding the Blink integration breaks both silently.
18. **`beehive-config/` is a 2026-08-01 snapshot, not a mirror.** Proven divergence at tip:
    `hcc_skip_commercial` (3 presses here, 1 press live per CLAUDE.md Pending Item 16).
19. **The standing rule that makes all of the above cheaper next time**, Jeff verbatim:
    *"you tell me it is all documented and it is not, then the session closes and you come back with some
    plan that was two weeks ago — this is infuriating."* **A decision made in conversation goes into a
    file the same session.**
