# Structured wiring + PoE + the clock speaker — what each choice actually buys
**Opened 2026-10-17 9:0x AM**, four days before the duct crew (Wed 10-21 / Thu 10-22).

Jeff: *"I made a mistake with my choice in cat6 I'm going to go to cat8 and a PoE switch 8 port
so I can power things off of it… I need a report on what I will gain… use the home map to see how
many runs I need and how long each run needs to be… send the runs down the same duct and come out
of the register… could have ethernet in each room which could enable a great mesh network"*
Plus 9:13 AM: *"I want a cheap mesh extenders in every room even if we have to reprogram them like
you did with the RE200 in the office."*

---

## 🔴 THE ONE THING TO CHANGE BEFORE WEDNESDAY: NOT *INSIDE* THE DUCT — *BESIDE* IT

**The timing instinct is exactly right. The route is the one part that has to change.**

### Why not inside
1. **Code.** NEC **300.22(B)** limits what may be installed inside a duct fabricated to carry
   environmental air to a short list of metal wiring methods (MC, MI, EMT, RMC/IMC) — and equipment
   only when it acts on or senses the air itself. **Plenum-rated cable is for plenum SPACES
   (300.22(C)), not for the inside of a duct.** A data cable pulled through a supply duct for
   convenience is not a permitted method in any reading I found, and the AHJ has final say.
2. 🔴 **It collides with your own acceptance test.** You took the **16" return**, which the Rev D
   drawing itself puts at **≈713 ft/min — the ACCA Manual D maximum for flex.** There is no spare
   static-pressure margin, and the contract obliges them to **record supply/return static pressure
   and airflow on the invoice.** Cable in the airstream adds resistance and turbulence to the one
   number that proves the $1,800 duct line worked. Do not hand the system a self-inflicted
   handicap on the morning it gets measured.
3. **Mechanically it does not work anyway.** Insulated flex is a corrugated plastic liner on a wire
   helix — you cannot pull 8 runs through it without tearing the liner, and every register
   penetration becomes a permanent conditioned-air leak at the one joint nobody opens again.
4. **Nobody will warrant it.** The crew will refuse, and they should.

### What to do instead — same crawl, same trip, zero downside
🔑 **Your trunk and every branch already run in the CRAWL SPACE under the hallway line**
(`plan-data.js` duct block: *"Trunk + return run in the crawl space under the hallway line"*; the
new garage branch is explicitly *"south in the crawl space · through the brick by the water
heater"*). **That is a free, open, legal pathway to every room in the house.**

- Run the cable **in the crawl, alongside the new flex — stapled to the joists, 12" off any
  Romex, crossing power at 90°.**
- Come up **next to the register boot** into a low-voltage ring / old-work box and a wall plate.
  Floor registers mean the boot is already coming through the floor there — the hole is a drill
  and a plate, not a renovation.
- **The real timing win is the crawl being clear and the floor open while they work**, not the duct
  interior. You keep 100% of the advantage you were after.

---

## 1. CAT8 vs CAT6 — the honest answer: **Cat6 was not a mistake, and Cat8 buys you nothing here**

> ## 🔒 SETTLED 2026-10-19 11:09 — **JEFF WENT CAT8. IT IS BOUGHT AND IN HAND. DO NOT RE-PITCH CAT6.**
>
> Jeff: *"I have all cat8 now."* The cost analysis below is kept as the record of *why* the question
> was asked, **not as a live recommendation.** Re-opening it now costs him money he has already spent
> and reads as second-guessing a decision he made with the numbers in front of him.
>
> ✅ **And functionally there is nothing to fix: Cat8 is fully backward compatible and carries
> gigabit and PoE without issue.**
>
> 🔴🔴 **CORRECTED 2026-10-19 11:16 — JEFF IS RUNNING PRE-TERMINATED PATCH CABLE. HE IS NOT
> CRIMPING ANYTHING. AN EARLIER VERSION OF THIS NOTE WARNED HIM ABOUT CRIMPERS AND SHIELDED
> KEYSTONES. THAT WAS WRONG AND IT IS DELETED.** Jeff: *"If you look at the Amazon purchases you will
> see the cat 8 wire I'm running I'm not crimping anything and you should have known that."* He was
> right — the evidence was already in this session: the record named *"Jovmoxz Cat 8 flat 50 ft"* and
> his own browser history showed a 75 ft flat Cat 8 search. **Read the actual orders before writing a
> caution about tools.**
>
> 📦 **WHAT HE ACTUALLY OWNS, read from Amazon order history 2026-10-19:**
>
> | Ordered | Item |
> |---|---|
> | 2026-10-17 | **Sokqovt Cat 8 Slim 75 ft**, pure copper, **waterproof / direct burial** rated, white |
> | 2026-10-17 | **Smolink Cat 8 50 ft**, nylon braided, **shielded U/FTP**, RJ45 |
> | 2026-10-17 | 8-Port Gigabit PoE Switch + 2 uplink, 802.3af/at, 120 W — the SG10P |
> | 2026-01-20 | **Ciwoda Cat 8** assorted lengths to 200 ft, **26 AWG**, S/FTP |
>
> **Every one is a finished patch cable with moulded RJ45 ends.** The **VCE Cat6 pass-through
> connectors (25 pcs, 2026-10-13) are Cat6 and are NOT part of these runs** — do not tie them together
> again.
>
> 🔴 **AND A SECOND CORRECTION, which actually matters for PoE: I said Cat8 is 22 AWG and therefore
> drops LESS voltage than Cat6 on a long PoE run. THAT IS BACKWARDS FOR WHAT HE BOUGHT.** 22 AWG is
> bulk Cat8. These are **slim / flexible patch cables**, and the one that states its gauge is **26 AWG
> — THINNER than the ~23 AWG solid in bulk Cat6, so it drops MORE voltage, not less.** PoE standards
> assume 24 AWG or better for a full 100 m; 26 AWG patch cord is permitted but carries a length
> derating. ⚠️ **Consequence, only if an access point is later powered over the 75 ft run: check the
> AP still gets its class power at that distance.** At gigabit data it is a non-issue.
>
> ✅ **The one real practical consequence of pre-terminated cable, and it is a pulling problem, not a
> tooling one: the moulded RJ45 head has to physically fit through whatever it is pulled through.**
> Bulk cable is terminated after the pull; these cannot be. Size the holes and the register openings
> for the connector plus its boot before Wednesday.
>
> 🔑 **The hardware ceiling, measured on the Beast 2026-10-19 11:09:** its NIC is a **Realtek PCIe
> GbE Family Controller**, linked at **1 Gbps** on 192.168.1.194 (gw 192.168.1.254), auto-negotiate.
> **GbE means 1 Gb is the card's hardware maximum** — no cable exceeds it. So Cat8 here is not slower,
> not a problem and not faster: gigabit, with headroom nobody will use. **Verify any run by its link
> rate, never by what the jacket is printed with.**


### What your network actually runs at — measured, not assumed
| Measurement | Value | Source |
|---|---|---|
| **WAN right now** | **144.9 ↓ / 44.24 ↑ Mbit/s, 154 ms** | `sensor.speedtest_*`, live read 2026-10-17 08:36 CT |
| **WAN over 24 h** | **min 24.8 · max 528.7 · avg 243.7 Mbit/s** (25 samples) | HA history, same read |
| Recorded 2026-09-17 | 476 ↓ / 104 ↑ / 32 ms | `IDEAS_FROM_WHAT_WE_OWN_2026-09-17.md` |
| LAN links at the gateway | **1 G** on every wired port | gateway census, `NETWORK_MAP.md` |

🔴 **Your internet never touches 1 Gb, and it swings by a factor of 20 across a single day.** No
cable category anywhere in that chain changes a single one of those numbers.

### The cable facts that decide it
| | Cat6 | Cat6A | **Cat8** |
|---|---|---|---|
| 1 Gb | **328 ft** | 328 ft | 328 ft |
| 10 Gb | ~165–180 ft | **328 ft** | 328 ft |
| 25 / 40 Gb | — | — | **98 ft only** |
| Conductor | 23 AWG | 23 AWG | **22 AWG, fully shielded S/FTP — stiff, big bend radius** ⚠️ **BULK figure. The patch cable Jeff actually bought is 26 AWG — THINNER, so it drops MORE voltage on a PoE run, not less.** |
| Terminates with | your crimper + standard tips | same | 🔴 **shielded plugs/keystones + a bonded shield** — ⚠️ **BULK ONLY. Jeff bought PRE-TERMINATED patch cable, so this row does not apply to his job. See the SETTLED block at the top of section 1.** |
| **1000 ft bulk, US** | **$160–$185** | — | **$428 (Newegg) · $558 (Home Depot) · $699 (Monoprice)** |

**The decider: every 8-port PoE switch in this price class is a GIGABIT switch.** It caps every
port at 1 Gb no matter what cable is behind it. To use even 2.5 Gb you would have to buy a 2.5 Gb
switch *and* 2.5 Gb network cards in the Beast and whatever it talks to; 25/40 Gb gear costs more
than this entire house network. **Cat8 at 1 Gb is just an expensive, stiff, harder-to-terminate
Cat6.**

### The call
- **Run Cat6 (or Cat6A if you want the 10 Gb headroom).** On ~420 ft of runs that is roughly
  **$70–$80 of Cat6** against **$180–$295 of Cat8** — for zero measurable difference.
- **If you have already bought the Cat8, run it** — it works perfectly well at 1 Gb. Buy
  **shielded** keystones and plugs to match (your existing tips are for unshielded 23–26 AWG; the
  10-13 fit note is the same trap in a new size), and expect no speed change.
- ⚠️ **Cat8 is also the wrong cable to want for PoE heat** in a tight bundle — the 22 AWG copper
  helps, the foil does not. Not a problem at 4 APs; worth knowing if the bundle ever grows.

---

## 2. THE 8-PORT PoE SWITCH — right idea, **and it is half the switch you need**

### What PoE actually gains you *in this house*
| Candidate | PoE gain | Verdict |
|---|---|---|
| **Wired access points** | **One cable carries data + power. No outlet needed at ceiling height, no wall wart, and on a managed switch you can power-cycle a hung AP from your chair.** | 🟢 **This is the whole payoff** |
| Blink cameras | **None — battery/cloud, no Ethernet at all.** The port scan of `192.168.1.214` found every port closed. | ⛔ Cameras are FROZEN; not re-opening it |
| Beehive (J45) | Needs a ~$10 PoE splitter, and it is **already on the APC BN600** | 🟡 no real gain |
| Future doorbell / sensors | Real, but nothing bought | 🔵 later |

### 🔴 PORT COUNT — count it before you buy
| At the core today | | New runs | |
|---|---|---|---|
| Uplink to the BGW320 | 1 | Living room TV wall | 1 |
| The Beast | 1 | Clock corner | 1 |
| Beehive | 1 | Kitchen / dining | 1 |
| | | KitchenPC | 1 |
| | | Garage | 1 |
| | | Hallway AP | 1 |
| | | Deck TV | 1 |
| | | Master bedroom west | 1 |
| **subtotal 3** | | **subtotal 8** | |

**= 11 ports minimum, before Angela's jack, the soundbar, the NTV300 or anything in the office.**
An 8-port is not enough **as your only switch**.

**Two ways out, cheapest first:**
1. ✅ **$0 — AND HE ALREADY OWNS THE SECOND SWITCH.** Verified in his orders 2026-10-17:
   **Hgcorenet 8-Port Gigabit Ethernet Switch, unmanaged 10/100/1000, ordered 2026-09-24.**
   So: **the new 8-port PoE switch carries the APs and PoE loads only, and the dumb devices hang
   off the Hgcorenet plus the LAN-1 fan-out and the office switch already in service.** Nothing
   extra to buy for the port count.
2. Buy **16 ports with ≥8 PoE+** instead and collapse it all into one box — unnecessary now.

### 🔴 Watch the PoE *budget*, not the port count
- Wi-Fi 5 APs (802.3af, ~13 W each): a **64 W** budget switch runs 4. Fine.
- Wi-Fi 6 APs (802.3at, up to ~20 W each): 4 of those is ~80 W — **over a 64 W budget.** You need a
  ~120 W model.
- 🔴 **Cheap extenders are NOT PoE-powered.** If you go the RE200-conversion route, every one still
  needs a wall wart, and **the PoE switch buys you nothing at all.** *The AP decision and the
  switch decision are the same decision — make them together.*

Prices found this session were mostly CAD/EUR/GBP listings (TL-SG1008P ≈ $57–60 CAD; TL-SG108PE
≈ $70 CAD). **US prices need one click in your Chrome — say the word and I will price it there
before you buy, the same way we did the TV strips.**

---

## 3. "CHEAP MESH EXTENDERS IN EVERY ROOM" — run the wire everywhere, hang 3–4 APs

**Start with $0: you already own two RE200s** (one at the core, one in the office) and both are
already proven convertible to wired APs — you did it on 08-13.

### 🔴 But more APs is not more coverage, and your own house already proved the failure mode
- **The house is ~1,200 sq ft on one floor** (39.42 × 29.25 plus the kitchen bump-out). **Three
  well-placed wired APs blanket that. Eight would fight each other** — 2.4 GHz has only **three**
  non-overlapping channels, so AP five onward is pure co-channel interference, and the gateway
  radio was already measured at **44% channel utilisation** on 09-03.
- **Cheap extenders-as-APs have no roaming assist (no 802.11k/v/r).** The client decides, and it
  has no obligation to move. **This is exactly the B-Hyve story:** it held the gateway at
  **256 ms / 5% loss** across the whole house while the RE200 sat **one brick wall away at 1 ms**,
  and a reset made it *worse*. **Eight identical cheap APs multiplies that hazard, it does not
  solve it.**

### The plan that gets you what you want
1. 🔑 **Run the cable to every room now.** The wire is the cheap part today and the expensive part
   forever after. A jack in a room with no AP costs you a $2 keystone.
2. **Hang APs in 3 places to start — hallway centre (dead centre of the house), kitchen/living,
   and the garage.** The office already has one.
3. **Use the two RE200s you own first. $0.** If roaming misbehaves, the fix order is free before
   it is paid: **turn their TX power down** so clients have a reason to leave, and keep the
   **separate `Loewen301-IoT` SSID for the sticky fixed devices** — the decision you already made
   for the B-Hyve on 09-22.
4. **Only if that is not good enough**, replace one at a time with real PoE APs that do 802.11k/v
   under one controller (TP-Link Omada EAPs are the cheap end; the controller software is free and
   runs on the Beast or Beehive). Listed abroad at ≈ €62–75 / £65 — **US price needs the click.**

⚠️ **Not convertible, already settled:** the **D-Link DAP-1520 has no Ethernet port** — it cannot
become a wired AP, established 08-13.

---

## 4. HOW MANY RUNS, AND HOW LONG — computed from the plan, not estimated

**Head end = the network switch in the master-bedroom NE corner** — gateway, Beast, Beehive and the
UPS are all in that one corner by design (`NETWORK_MAP.md`, Jeff 09-22).

**Model:** 5 ft down into the crawl + service slack · Manhattan run in the crawl · 5 ft up the wall
+ service loop · ×1.15 routing slack · rounded up to 5 ft. Coordinates straight out of
`docs/house-plan/plan-data.js`.

### 🔴 REV 2, 10-17 10:1x — JEFF: *"the runs are not correct."* HE WAS RIGHT. FIVE REAL ERRORS.

| # | What rev 1 got wrong | Effect |
|---|---|---|
| 1 | **Ceiling APs were costed as CRAWL runs.** An AP in a ceiling is an **attic** run — up ~10 ft, across, down 3 — not down into the crawl and back up | hallway AP 35 → **45 ft** |
| 2 | **The living-room run landed on the back-wall register, ~11 ft from the TV it is for.** A data jack goes to the device, not to a duct boot | re-aimed at the fireplace wall |
| 3 | **The kitchen was counted twice** — once at its register, once at KitchenPC, 5 ft apart, as two separate pulls | one run |
| 4 | **Rooms were missing** against *"ethernet in each room"* — no laundry/pantry, no foyer | 8 runs → **11** |
| 5 | **Terminations under-counted** at 10 ft for both ends. A patch-panel dressing plus a far-end service loop is **12 ft** | every run +2 |
| | **TOTAL WAS 420 ft. IT IS 580–605 ft — rev 1 was ~30% short** | a 500 ft box would NOT have done it |

**Model:** straight-line distance from the core × **1.20** for real routing (joists, piers, pulling
round corners) as the LOW figure; strict right-angle routing as the HIGH. Plus the vertical leg
(crawl 4+4, attic 10+3) and 12 ft of terminations. Re-run it any time:
`python -I scratchpad/cable_runs_2026-10-17.py`.

| Run | Route | Buy |
|---|---|---|
| **AP 1 — hallway centre (ceiling)** | attic | **45 ft** |
| **AP 2 — kitchen/living (ceiling, at the half wall)** | attic | **50–55 ft** |
| **AP 3 — garage** | attic | **65–70 ft** |
| Living room TV — **fireplace wall**, not the register | crawl | **45–50 ft** |
| Grandfather clock corner | crawl | **55–60 ft** ⚠️ position unmeasured |
| Kitchen / dining — one run, at KitchenPC | crawl | **60–65 ft** ⚠️ position unmeasured |
| Master bedroom, west end | crawl | **40 ft** |
| Garage workbench (GaragePC + garage TV) | crawl | **75–85 ft** |
| Back deck TV / Roku | crawl | **60 ft** — exterior penetration, different cable |
| Laundry / pantry alcove | crawl | **50 ft** |
| Foyer | crawl | **30 ft** |
| **11 NEW RUNS** | | **580–605 ft** |
| *Guest bedroom* | *jack already there* | 🔑 **TEST FIRST** (35 ft if re-pulled) |
| *Office / Bed 3* | *jack + 2nd switch already there* | 🔑 **TEST FIRST** (65 ft if re-pulled) |

🟢 **One 1000 ft box still covers it — but the spare is ~395 ft, not the 580 rev 1 claimed**, and
**705 ft if the two existing jacks get re-pulled too.** ⚠️ Both baths are deliberately **not** on
this list. ⚠️ **The clock and KitchenPC positions are the two soft numbers** — `plan-data.js` marks
KitchenPC *"position provisional"* and the clock speaker *"PORTABLE — confirm its real spot."*

🔴 **AND A CONTRACT DISCREPANCY FOUND WHILE CHECKING THIS:** `plan-data.js` has the Dining, Master
bedroom and Living room branches going to **7"** (`size: 7, was: 6`). **The install pack §4 item 4
says `6"→8" upgrades: Dining room, Master bedroom, Living room`.** The contract is the authority —
**the plan data is wrong, and it is the file every session reads.**

### Also buy (the small stuff that stops the job)
Keystone jacks (**shielded if you run Cat8**) · a wall plate per room · a punch-down tool · old-work
low-voltage rings · a cheap cable tester · J-hooks or staples rated for data cable.
**Do not reuse flat 30 AWG cable for anything in-wall** — that is what the 10-13 note was about.

✅ **ALREADY BOUGHT, verified in his orders 2026-10-17: `VCE Cat6 RJ45 Pass Through Connectors,
gold-plated 8P8C, UL listed, 25 pcs` × 2 = 50 ends, ordered 2026-10-13.**
⚠️ 🔴 **BUT PASS-THROUGH ENDS NEED A PASS-THROUGH CRIMPER** — the tool has a blade that shears the
8 conductors flush with the plug nose as it crimps. The record describes his tool only as *"a cat
five crimper"* (Jeff, 10-13 9:34 AM). **If it is a plain crimper, these 50 connectors will leave
the wires standing proud of the plug and the ends will not seat.** Workable with flush cutters,
properly fixed with a pass-through tool. **Check the crimper before the pull, not during it.**

> 🔴 **MOOT AS OF 2026-10-19 — DO NOT ACT ON THE PARAGRAPH ABOVE FOR THE WEDNESDAY RUN.** Jeff is
> running **pre-terminated Cat8 patch cable** (Sokqovt 75 ft, Smolink 50 ft, Ciwoda assorted — all
> with moulded RJ45 ends). **He is not terminating anything, so the crimper question does not arise.**
> Jeff, 11:16 AM: *"I'm not crimping anything and you should have known that."* The 50 VCE Cat6
> pass-through ends are still in a drawer for some future Cat6 job; they are **not** part of these
> runs. Leaving the paragraph above intact because the crimper fact is true and will matter if bulk
> cable is ever pulled — but it is **not a Wednesday action item.**

🔑 **NO BULK SPOOL HAS BEEN BOUGHT YET** — his whole Ethernet order history is patch cables
(Seedato Cat6 50 ft ×2, flat Cat6 10 ft 2-pack, Monoprice 1 ft, Ciwoda Cat8 short ×2, GLANICS Cat8
3 ft 2-pack, Cat8 3 ft outdoor, Cat6 3 ft 2-pack). **So the Cat6-vs-Cat8 decision in §1 is still
live and the $180–295 is still on the table — it is not a sunk cost.**

---

## 5. THE CLOCK SPEAKER AUDIO RUN — **already designed on 2026-09-28. Do not re-derive it.**

🔴 **CORRECTION TO MY OWN FIRST DRAFT OF THIS SECTION (written 10-17 9:4x, fixed 9:5x).** I wrote
this as *"a line-level run from the Beast to the QFX"* and described the change as one line in
`chime_config.json`. **That is the wrong source and it understates the gain.** The design was
settled three weeks ago in `docs/automation/HOUSE_COMMUNICATION_CENTER_2026-09-28.md` §"RE-STUDY
14:00–14:21", after Jeff asked *"do you have tunnel vision… make sure we are not buying a bunch of
shit that could be run just as well with something we already have"*:

> **CHOSEN DIRECTION = A: HA box 3.5 mm out → long aux cable → QFX AUX IN.** Removes the Beast,
> Bluetooth, the ESP32 and the DAC from the chain. HA plays chimes/voice/alarms directly.

**Source is the Beehive J45, not the Beast** (Jeff 09-28 14:21: *"The j45 had a audio jack."*).
✅ **Still true today, checked live 2026-10-17 09:4x: `media_player.vlc_telnet` = `idle`** — the
VLC add-on is installed and running on Beehive, and the Supervisor audio card has an analog stereo
output profile.

🔑 **AND THAT CHANGES THE VERDICT AT THE BOTTOM OF THIS SECTION.** With the Beast out of the audio
chain, **a Beast crash or an unattended reboot no longer silences the clock at all** — which is the
*whole* of #239 and the clock half of #238. The Beast-sourced version I first described would not
have done that. **This is the strongest argument for the run and I had it backwards.**

*(Reading "auto wire" as **audio** wire.)*

### What you gain — every one of these is in our own record
| Gain | The evidence it fixes |
|---|---|
| 🔴 **The Bluetooth dropout class disappears** | the clock was silent **Sep 29 → Oct 6** and the cause was the speaker/BT link |
| **The keepalive hack becomes unnecessary** | the listener holds a **−80 dBFS stream open 24/7** for one reason: to stop the BT link going idle |
| **No more eaten first words** | the code carries a deliberate pause + `speech_lead_s 0.8` because *"the Bluetooth link / QFX waking after the 1.5 s pause eats the first words"* |
| **No re-pairing after a reboot** | a wired output is just there |
| **Better sound** | no A2DP/SBC compression on the chimes |

### What it costs
- 🔴 **The speaker stops being portable.** The plan already flags it: *"Speaker is PORTABLE —
  confirm its real spot before trusting the distance."* **Pick its permanent home first.**
- **Hum risk.** ~55 ft of unbalanced line level sharing a crawl with Romex is the classic buzz
  setup. Mitigate: shielded cable, 12" away from power, cross at 90°, and a **ground-loop isolator
  (~$10)** if it hums — the Beast is on the UPS in the master bedroom and the speaker is on a
  different circuit across the house, which is precisely the ground-loop recipe.
- **Confirm the input.** The QFX PBX family lists a **1/8" (3.5 mm) stereo aux in**; I could not
  find a spec sheet for the **PBX-BF120** exactly. **Read the back of the unit before buying a
  cable.**

### 🔌 THE CABLE — what the record says, and the one number that decides it
**In the 09-28 cart: Monoprice 100647, 50 ft 3.5 mm stereo male/male, ASIN `B0015V5KPI`, $4.99**
(4.6★/1.8K, sold by Amazon), chosen after **Jeff 14:22: *"The run is under the floor in the crawl
space to the clock"*** — ~37 ft on the plan + 2 drops ≈ 45 ft → a 50 ft cable.

✅✅ **SETTLED 2026-10-17 10:2x — HE HAS IT, AND I READ IT OFF HIS OWN ORDER, NOT OFF A GUESS.**

> **Monoprice 100647 50' 3.5mm Stereo Plug/Plug M/M Cable, Black — $4.99, sold by Amazon.com**
> **Order `113-9229160-3734636`, placed September 29 2026, DELIVERED September 30**
> *"Your package was left near the front door or porch."* Returnable through 2026-10-30.

🔴 **THE RECORD WAS WRONG AND THIS CORRECTS IT.** `HOUSE_COMMUNICATION_CENTER_2026-09-28.md` and
OPEN_ITEMS #214 both say the 50 ft aux was *"NOT needed — never ordered"*, written when Jeff kept
Bluetooth at 17:10 on 09-28. **He ordered it the next morning anyway.** It has been in the house
for 17 days while two separate documents said it did not exist. **Jeff 10-17: *"I already have the
audio aux cable"* — he was right, and the files were wrong.**

Also in the house, same search: **KabelDirekt 20 ft 3.5 mm aux** (Sept 2019) — too short for this
run, fine for anything local.

### ✅ AND IT REACHES
**For a MOLDED patch cable the 12 ft termination allowance does not apply** — there are no keystones
to dress and no service loop to leave, so the number that matters is the routed path alone:

| | |
|---|---|
| Straight line, core → clock corner | **27 ft** |
| Strict right-angle routing | **36 ft** |
| Plus the vertical legs (down 4, up 4) | **35–44 ft routed** |
| **Cable in hand** | **50 ft → 6–15 ft of slack** |

🟢 **It fits.** ⚠️ Still run a string along the real crawl path first — **a molded cable cannot be
lengthened**, so if the route wanders it is a new purchase, not a re-crimp.

### What changes in software — **not one line; this is the real work**
A wired QFX fed by the **Beast** would be one line (`"speaker"` in `chime_config.json`, which
matches a WASAPI output by name substring — and ⚠️ **leave `auto_convert` alone**, without it every
play fails with `Invalid sample rate`, found 09-24).

**Direction A is bigger than that:** the chimes, voice, preludes and levels all live in the Beast's
Python listener — the approved chime set, `ceiling` 0.355 (the clean −9 dBFS point Jeff set by ear),
the `levels` map, the bass blend, `alarm_preludes`. Moving them to HA means rebuilding that as HA
automations playing through VLC, with the Supervisor audio output switched to analog and the files
in `/media`. **09-28's own instruction: keep the Beast listener as the fallback until HA is
proven.** 🔴 **Do not change the chime sound without Jeff's ears** — that set is frozen in
`chimes-thunder-APPROVED\`.

---

## 6. WHAT I WOULD DO, IN ORDER

1. **Today/Monday:** decide cable, get it on site. **Cat6 or Cat6A unless you have already bought
   the Cat8 — in which case run the Cat8 and buy shielded keystones.**
2. **Tell the crew: cable goes in the crawl BESIDE the duct, never inside it**, and ask them not to
   block crawl access when they are done.
3. **Test the guest-bedroom and office jacks.** Two runs you may not need.
4. **Pull 8 runs, ~420 ft, off one 1000 ft box** while the crawl is clear and the floor is open.
5. **Switch:** 8-port PoE **for the APs**, with the dumb devices staying on the unmanaged switches
   you already own. Size the PoE **budget** to the APs you actually pick.
6. **APs: the two RE200s you own, wired, $0.** Add a third only if there is a dead spot you can
   measure. Upgrade to 802.11k/v APs one at a time only if roaming annoys you.
7. **Audio run to the clock last** — it is the easiest one and it is pure gain.

---

## Sources checked this session
Live: `sensor.speedtest_download/upload/ping` + 24 h history off Beehive · `chime_config.json` ·
`chime_listener.py`. Repo: `docs/house-plan/plan-data.js` (geometry, devices, duct block) ·
`docs/inventory/NETWORK_MAP.md` · `docs/network/re200_cat6_reterminate_2026-10-13.md` ·
`docs/hvac/INSTALL_OVERSIGHT_2026-10-21.md` + OPEN_ITEMS #233. Web: NEC 300.22(B) discussion ·
bulk Cat6/Cat8 spool pricing · TL-SG1008P / TL-SG108PE and Omada EAP listings (non-US currencies —
**US prices still need one click**) · QFX PBX aux-input listings.
