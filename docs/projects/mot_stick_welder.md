# MICROWAVE-TRANSFORMER STICK WELDER — project file

**Opened 2026-10-15 09:39.** Jeff: *"The microwave I just replaced. I'm going to pull all the
components out of the old one and make a welding machine."* He supplied a reference infographic
(*"DIY Microwave Transformer Stick Welder"*, two enclosure options, ammo can or wooden box).

Before this file existed, `Search-HCC.ps1 "microwave transformer|spot welder|MOT welder|microwave
parts|welding machine"` returned **zero hits** across decisions, the conversation archive, the
reference guides and the repo. The project lived only in conversation. It is written down now.

---

## 🔴 1. THE ONE THING THAT BLOCKS THE BUILD: ONE TRANSFORMER IS NOT ENOUGH

**The reference graphic says "12V – 200A (EST)". That figure does not work for stick welding, and
it is the number the whole project rests on.**

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

## 🔴 2. SAFETY — the two hazards the reference graphic does NOT mention

The graphic covers grounding, fusing and ventilation. It leaves out the two that actually hurt
people during **teardown**, which is the step Jeff is about to do.

### 2a. THE HIGH-VOLTAGE CAPACITOR CAN HOLD A LETHAL CHARGE WITH THE OVEN UNPLUGGED
A microwave's HV capacitor stores enough energy to kill and can stay charged after the unit is
disconnected. **Discharge it deliberately before touching anything inside** — short it across the
terminals, and to the chassis, through an insulated screwdriver or a resistor, and confirm it
reads zero. Treat it as live until measured dead. Many units have a bleeder resistor; **do not
assume it worked.**

### 2b. DO NOT BREAK OR GRIND THE MAGNETRON'S CERAMIC
Magnetron insulators can contain **beryllium oxide**, which is hazardous if the dust is inhaled.
Intact it is harmless. **Do not cut, grind, smash or sand it** — if the magnetron is not being
used, set it aside whole and dispose of it intact.

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

Reference infographic supplied by Jeff: `docs/projects/mot_stick_welder_reference.jpg`.
