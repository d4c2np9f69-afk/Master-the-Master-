# MICROWAVE-TRANSFORMER STICK WELDER — project file

**Opened 2026-10-15 09:39.** Jeff: *"The microwave I just replaced. I'm going to pull all the
components out of the old one and make a welding machine."* He supplied a reference infographic
(*"DIY Microwave Transformer Stick Welder"*, two enclosure options, ammo can or wooden box).

Before this file existed, `Search-HCC.ps1 "microwave transformer|spot welder|MOT welder|microwave
parts|welding machine"` returned **zero hits** across decisions, the conversation archive, the
reference guides and the repo. The project lived only in conversation. It is written down now.

---

## 0. THE DONOR UNIT — read off its own data plate 2026-10-15

| | |
|---|---|
| **Model** | **Samsung ME16K3000** (over-the-range) |
| **Manufactured** | **JUNE 2019** |
| **Input** | **1.58 kW**, 120 V, 60 Hz |
| **FCC ID** | `A3LOTR16M3` |
| Serial / build | `WTM602671V` · made in Malaysia |

1.58 kW input puts it in the ~1000 W-output class, i.e. **an ordinary full-size MOT** — the right
kind of donor, nothing exotic. It is **one** transformer, which is the whole problem in §1.

---

## 🔴 1. THE ONE THING THAT BLOCKS THE BUILD: ONE TRANSFORMER IS NOT ENOUGH

🔴 **BOTH of Jeff's reference graphics quote the WRONG voltage, and they are wrong the same way.**
Graphic 1 says **"12V – 200A (EST)"**. Graphic 2 says **"Output Voltage: 16–24 VAC (typical for
stick welding)"**.

**16–24 V is the ARC voltage — what sits across the arc once it is already burning. It is NOT the
OPEN-CIRCUIT VOLTAGE the machine needs to STRIKE that arc.** Conflating the two is the single
most common error in these build guides, and it is why a one-MOT machine disappoints: the rod
sticks to the work and never lights.

Stick welding needs enough **open-circuit voltage (OCV)** to strike and then hold an arc. Checked
by real search 2026-10-15, against builds that reported measured numbers:

| Build | Measured OCV | Note |
|---|---|---|
| 2 MOTs, primaries parallel / secondaries series | **38 V** | A forum reply calls 38 V **low**, and puts typical welding OCV nearer **56 V** |
| 4 MOTs | **47 V**, 170 A welding | |
| 2-MOT target quoted elsewhere | **~30 V AC, ~120 A** | |
| Tutorials surveyed | **2–6 transformers**; a *few* succeed with 1 | |

**12 V is not in that range.** At 12 V OCV a 6013 or 7018 rod will stick to the work and refuse to
establish an arc. **The common working configuration is TWO MOTs: both primaries in parallel to
the wall cord, both rewound secondaries in series and PHASED THE SAME WAY** so they add instead of
cancelling.

### ▶ What that means in practice
🔴 **Jeff has ONE old microwave. The build needs a second transformer, and it is free.**
Appliance repair shops, curbside, Facebook Marketplace — dead microwaves are given away. **Do not
scrap or bin the current one, and start watching for a second.** Everything else on the parts list
is cheap or on hand; the transformer count is the real gate.

⚠️ **Output voltage is set by the secondary turns count** — fewer wraps = fewer volts, more amps;
more wraps = more volts, fewer amps. So the rewind is a tuning step, not a fixed recipe:
**measure the OCV after rewinding and before trusting it.**

---

## 1b. 🔴 "DC STICK WELDER" — graphic 2 contradicts itself, and it matters for 7018

The machine in graphic 2 is lettered **"DC STICK WELDER"** on the front panel. But its own spec
block says **"16–24 VAC"**, its note repeats **"low voltage (16–24V AC)"**, and **its wiring
diagram contains no rectifier and no inductor** — 120 V in, transformer, current control, leads
out. **As drawn, that is an AC machine wearing a DC label.**

That difference is not cosmetic:
- **6013 runs acceptably on AC.** It is the forgiving rod and the right one to learn on.
- **7018 strongly prefers DC.** On AC it is harder to strike and prone to arc blow — and 7018 is
  on the graphic's own recommended rod list.

▶ **If DC is actually wanted, the build needs two parts that appear on NEITHER graphic: a bridge
rectifier rated for the real welding current (well over 100 A, on a heatsink) and a smoothing
inductor/choke.** Decide AC-or-DC up front, because it changes the parts list and the budget.
**Starting AC with 6013 is the honest, cheap first version.**

---

## 🔴 2. SAFETY — what each graphic gets right, and what BOTH leave out

✅ **Credit where it is due: graphic 2 gets the capacitor right**, in red: *"The microwave's
original high-voltage secondary and capacitor must be removed and NOT used. The capacitor can hold
a lethal charge even when unplugged."* That is correct and it is the most important line on the
page. Graphic 1 omits it entirely.

### 2a. THE HIGH-VOLTAGE CAPACITOR — confirmed by graphic 2, repeated here because it kills
A microwave's HV capacitor stores enough energy to kill and can stay charged after the unit is
disconnected. **Discharge it deliberately before touching anything inside** — short it across the
terminals, and to the chassis, through an insulated screwdriver or a resistor, and confirm it
reads zero. Treat it as live until **measured** dead. Many units have a bleeder resistor; **do not
assume it worked.**

### 2b. 🔴 THE MAGNETRON — and graphic 2 actively steers into this one
Graphic 2's internal view labels the magnetron **"keep magnets"** and its parts list includes
**"Magnetron magnets (optional)"**. The magnets themselves are fine — but **getting them out means
breaking the magnetron open, which is exactly the scenario the hazard applies to.**

Magnetron insulators can contain **beryllium oxide**. Intact, it is harmless. **Broken, cut, ground
or sanded, the dust is the hazard.** So: if the magnets are not genuinely needed — and they are
worth very little — **leave the magnetron whole and set it aside.** If they are wanted, do it
outdoors, do not grind, do not smash the ceramic, and do not breathe anything it produces.

### 2c. Things graphic 2 lists that are NOT worth keeping
- **"Control board (keep, if useful)"** — mains-connected, model-specific, and of no use in a
  welder. Skip it.
- **"Current control (variac or tap)"** — a variac is the nice version and is **not cheap**;
  **tapping the rewound secondary is the $0 way** to get coarse current steps. Start there.

### 2c. The finished welder is not a toy either
A patent on welding-equipment isolation notes OCV **can reach 100 V, and that level can be fatal
on contact.** A welder built in a metal ammo can with a grounded case, a real fuse and a real
switch is the right shape. The graphic's own advice is sound here: **metal case over wood, ground
the case, fuse and switch, and keep it ventilated.**

---

## 3. WHERE THE FEL-PRO 2499 SHEET FITS (Jeff's idea, 2026-10-15)

The reference parts list calls for **"Metal chassis (or heat shield)"** — so the instinct is
right, and that sheet is high-temperature rated and rigid.

✅ **USE IT AS: a heat and spark shield** — between the transformer core and a wooden enclosure, or
under the work on the bench.

⛔ **NEVER AS ELECTRICAL INSULATION.** Fel-Pro 2499 (Pro-Ramic 101) is fiber bonded to a
**perforated steel core**; it is conductive, and every cut edge and punched hole exposes the
steel even though the fiber faces look like an insulator.

🔴 **AND IF IT IS FITTED AS A HEAT SHIELD, BOND IT TO THE GROUNDED CHASSIS.** The graphic already
says *"always ground the metal case."* A **floating** conductive sheet sitting next to mains wiring
is worse than no sheet at all — it becomes an unearthed surface that can go live on a fault.

▶ **$0 check with the multimeter Jeff already owns: continuity across two cut edges.** If it beeps,
it is conductive — settled by measurement, not by inference from the published construction.

---

## 4. PARTS — from the reference graphic, with status

| Part | Status |
|---|---|
| Microwave transformer | **1 on hand** (the replaced Samsung). 🔴 **A SECOND IS NEEDED — see §1** |
| 12 V cooling fan (computer style) | likely on hand — check the parts bins |
| 120 V power inlet **with fuse** | to source |
| On/off switch | to source |
| Heavy-duty welding output terminals | to source |
| High-current cable for the output | to source — **this is usually the biggest single cost** |
| Metal chassis **or heat shield** | 🟢 **Fel-Pro 2499 sheet ON HAND** for the heat-shield role (§3) |
| Thermal protection | *"optional but recommended"* — **recommended**, MOTs run hot and have no duty cycle rating |
| Grounding / bonding hardware | to source |
| Enclosure | **.50 cal ammo can preferred over the wooden box** — the graphic's own conclusion, and it is right: metal, grounded, and it will not burn |

**Rods:** 6013 or 7018, 1/8"–3/32".
**Realistic capability:** mild steel, tubing, angle iron, sheet up to ~1/8"–3/16", farm and trailer
repair. **Not** aluminium, **not** stainless, **not** steel over 1/4".

---

## 5. OPEN QUESTIONS FOR JEFF

1. **Is there a second dead microwave available, or should the second MOT be sourced?** This gates
   everything else.
2. Does the old unit still have its **HV capacitor and diode**? Some builds use them; either way
   §2a applies before anything comes out.
3. Ammo can or wood? *(Recommendation: the can.)*

---

## 6. SOURCES

Measured OCV figures and transformer counts in §1 are from hobbyist build reports gathered
2026-10-15 — [Instructables: Build a Microwave Transformer Homemade
Welder](https://www.instructables.com/Build-a-Microwave-Transformer-Homemade-Welder/),
[Instructables: Homemade Stick Welder From Microwave
Parts](https://www.instructables.com/Homemade-Stick-Welder-From-Microwave-Parts/),
[HomemadeTools: 170 Amp MOT Stick
Welder](https://www.homemadetools.net/forum/170-amp-mot-stick-welder-18741),
[Welding Tips and Tricks: minimum voltage for an arc
welder](https://forum.weldingtipsandtricks.com/viewtopic.php?t=6213),
[All About Circuits: questions about my homemade arc
welder](https://forum.allaboutcircuits.com/threads/questions-about-my-homemade-arc-welder.109051/).
⚠️ **These are hobbyist reports, not engineering data — treat the numbers as indicative and
MEASURE the real OCV on the bench.** The fatality note on OCV is from
[US Patent 7,193,176, safety isolation of arc welding
equipment](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7193176).

Supplied by Jeff: `mot_stick_welder_reference.jpg` (graphic 1, enclosure options), `mot_stick_welder_plan.jpg` (graphic 2, THE PLAN - wiring diagram + what to save), `mot_stick_welder_donor_dataplate.jpg` (the Samsung ME16K3000 data plate).
