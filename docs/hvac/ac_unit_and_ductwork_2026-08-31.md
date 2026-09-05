# A/C UNIT + COMPLETE DUCTWORK REPLACEMENT — the live plan (2026-08-31)

**This file exists because the last version of this conversation was lost.** On 2026-08-31 Jeff
asked for the unit/ductwork estimates and what to pay his A/C friend. An exhaustive search found
**nothing**: `Search-HCC.ps1` on 9 term sets, the master record on 13 terms, all 3 archive files on
12 phrases, a raw scan of **all 35 session transcripts** on disk, and a filesystem sweep of
iCloud/Downloads/Documents/Desktop for `*hvac*`, `*quote*`, `*estimate*` and brand names. The only
surviving fact was one line from 08-18. The original discussion almost certainly happened in a
**cloud session on claude.ai**, which this machine cannot read — per the cost audit, *"Everything
before 07-14 lives only in cloud sessions this record cannot read."*

**Do not let that happen again. Every number below gets updated here, in this file.**

---

## 1. The job

Replace the A/C unit **and** run complete new ductwork.

- **Existing system:** package unit — Jeff, 2026-08-18 08:23:54 AM CT: *"I have a package unit Ac
  everything is out side."* Everything outdoors; there is no indoor air handler.
- **Chosen unit:** **Alpine, 2.5–3 ton.** Jeff, 2026-08-31: *"The Alpine unit has free shipping and
  all the components and everything that I will need so that's pretty much set."*
  🔴 **THE UNIT IS SETTLED — do not re-shop it, do not propose alternative brands.**
- **Duct layout, confirmed by Jeff 2026-08-31:** **7 registers total — one per room — and ONE main
  return in the living room.**
- **Labor plan:** Jeff's A/C friend does the install; **Jeff works alongside him on the ductwork to
  cut the labor cost.** Jeff: *"I'm going to try to get my AC friend to let me help him do it but
  the ductwork in and see if that won't save some money."*

### 🔴 KNOWN DEFECT TO FIX ON THE NEW INSTALL — the twist at the unit

Jeff, 2026-08-31: *"both the main register line and the return line run down the center of the house
[and] when they approach the unit they are twisted so that needs to be fixed on the new unit."*

**Existing layout:** main supply trunk and the return both run down the **centre of the house**, and
**both are twisted where they meet the package unit.**

**Why this matters and is not cosmetic:** a twist at the unit is the worst place for a restriction —
every cubic foot of air in the house passes through those two points. Twisted flex raises static
pressure, the blower moves less air, and the system runs longer for the same cooling. That is the
same class of penalty as the duct leak repaired 07-25, which measured **441 kWh / 16.8% / ~$41 a
month** once fixed.

**ORIGIN — it is original construction, not degradation.** Jeff, 2026-08-31: *"it was put in that
way 30 years ago when the house was built, they were too lazy to fix the unit so they just twisted
what they had in the ductwork already to fit the air conditioner... they had already run the
ductwork so in order to make it work they just twisted it to line up with the intake and outtake."*
The builder ran the duct first, then twisted it to meet the unit's collars rather than re-working it.

🔴 **THE MEASUREMENT CONSEQUENCE — this is important and easy to get wrong.** Because the twist is
**original**, **every year of usage data this house has ever produced includes it.** There is no
clean historical period to compare against — not 2025, not any prior summer. So unlike the 07-25
duct-leak repair (which had a clean before/after inside the same season), the gain from fixing the
twist **cannot be predicted from Jeff's own history**. Do not model it from past data and do not
quote him an expected saving derived that way. Measure it after the fact, from the CEMC 15-minute
data, against the post-07-25 / pre-replacement window — that is the only honest baseline available.

**What the new install needs:**
- A proper **sheet-metal transition/plenum** at the package unit on BOTH the supply and return —
  not flex twisted onto the collar. This is an extra BOM line that the flex-duct pricing below does
  NOT cover, and it is part of the "$150-350 not priced" allowance.
- Straight, supported runs into those transitions. Flex should be pulled taut and strapped, not
  compressed or spiralled.
- Worth having the A/C friend measure **static pressure** before and after — that turns "it feels
  better" into a number.

**This is measurable.** Baseline it from the CEMC 15-minute data the same way the 07-25 repair was
measured, so the twist fix gets credited separately from the new unit.

## 1b. THE TWO UNITS — verified specs, 2026-08-31

### OUTGOING — Nordyne R4GD-030K072C (from Jeff's own data plate photo)

**Manufacturer is NORDYNE.** Jeff, 2026-08-31: *"I do not think it is a Maytag. It is a Nordine."*
He is right. The R4GD chassis was built by Nordyne and badged under several brands; the archived
spec sheet that turns up first (`files.rheem.com/LiteratureArchive/a981b.pdf`) is the **Maytag-badged
edition of the same chassis** — same dimensions, different sticker. Parts catalogues list it as
"Nordyne R4GD 030K072". **Do not call this a Maytag or a Teledyne.**

```
Model            R4GD-030K072C      Serial R4F070901754
Capacity         030 = 30,000 BTU = 2.5 TON  |  072 = 72,000 BTU gas heat
Refrigerant      R-22, 93.5 oz factory charge   <- phased out
Efficiency       SEER 13 · EER 11 · AFUE 78 · Therm Eff 0.78
Electrical       208/230V 1ph 60Hz · MCA 25.0 A · MAX OVERCURRENT 40 A
                 compressor RLA 15.7 / LRA 68 · blower 1/2 HP · fan 1/4 HP
Gas              nat max inlet 10.0" WC, min supply 4.5" WC
Age              complies with 2007 ASHRAE 90.1 -> ~2007, about 19 years old
Dimensions       47.5 in (side view)
Entry heights    electric 31.0"  ·  low voltage 24.6"  ·  gas 16.6"
```

🔴 **The unit is NOT original to the house.** It is ~2007; the house and its ductwork are ~1996.
So the twisted duct was carried over by whoever did the last replacement — they had the system
apart and left the defect in. That is the mistake not to repeat.

### INCOMING — Blueridge BPRPGE1430-072EP-2 (Alpine product page + spec sheet, read live)

```
Price            $2,990 - $299 coupon (coupon ENDS SEPT 14)
Capacity         2.5 ton cooling / 72,000 BTU gas heat  -> EXACT MATCH to the old unit
                 => the 2.5 vs 3 ton question is SETTLED. 2.5 ton is correct.
Efficiency       14 SEER · R410A
Dimensions       47.66" W x 47.66" D x 40.89" H · 406 lbs
PAD REQUIRED     50 x 53 in
Electrical       MIN AMPACITY 18.22 A · MAX FUSE/BREAKER 25 A
Gas connection   0.5 in
AHRI#            206903398 · approved North/Southeast/Southwest · not ENERGY STAR

DUCT OPENINGS — ALL RECTANGULAR, multi-positional (side AND bottom):
  Supply   side 13.44w x 14.32h   |  bottom 14.02w x 11.49d
  Return   side 13.44w x 17.07h   |  bottom 16.77w x 11.49d

WARRANTY  10 yr parts · 10 yr compressor · LIFETIME heat exchanger
          🔴 ALL THREE REQUIRE ONLINE REGISTRATION
```

### THE THREE FINDINGS THAT CHANGE THE JOB

**1. The pad is almost certainly fine — no pour needed.** Old unit 47.5 in vs new 47.66 in: a
**0.16 inch** difference. The existing pad already carries a 47.5 in unit. (Caveat: only the side
dimension was readable from the archived sheet; the plan view would not render. The new unit is
square, so the only failure mode is a pad poured tight in the other axis — visible at a glance.)

**2. 🔴 THE BREAKER MUST COME DOWN.** Old unit: MCA 25.0 A, **max overcurrent 40 A**. New unit:
MCA 18.22 A, **max fuse/breaker 25 A**. The existing 40 A breaker **exceeds the new unit's maximum**
— max fuse/breaker is a ceiling, not a suggestion. Conductors sized for the old 25 A MCA are ample
for the new 18.22 A, so **the wire is fine; the breaker changes.** Jeff wires his own house — a $10
part, not a service call.

**3. The duct answer is confirmed: rectangular openings, so a sheet-metal plenum on each.** Jeff
2026-08-31: *"if we're just going to do that with a square box, then there's no reason to buy those
rounded sheet metal adapters."* **Correct.** The plenum IS the square-to-round transition. He still
needs **takeoff/start collars** to land round flex on the flat plenum face — a different item from
an adapter, and already inside the $150-350 allowance. Alpine's own copy: *"flush connector means
easy ducting connection to any type of duct."*

### ACCESSORIES AND LONGEVITY — verified, with the ones to skip

- **Internal Filter kits** — offered by Blueridge as a factory accessory. Better than a downstream
  filter grille on a package unit.
- **UV / air cleaning:** coil-and-drain-pan sterilization is the application with real evidence
  behind it; **in-duct "air sterilization" is the weak claim** (dose = intensity x exposure, and
  air moves past too fast). Note the BPRPGE14 already ships with an **antimicrobial insulated drain
  pan**, which covers part of the same job. Budget **lamp replacement every 12-24 months** — that is
  the real running cost. Verdict: coil lamp yes, whole-air steriliser no.
- 🔴 **HARD START KIT — DO NOT BUY, on a new unit.** Researched 2026-08-31. *"A quality new
  compressor should not need a hard start kit... as a rule, a scroll compressor doesn't need one."*
  *"Not a permanent fix, does not meaningfully raise SEER."* Aftermarket kits can also be
  **prohibited under warranty** on some units. If a NEW compressor struggles to start, that is a
  symptom to diagnose under warranty, not to mask. **This is the $0 recommendation: skip it.**
  Legitimate only for an ageing compressor drawing hard — a year-15 decision, not day one.
- 🔴 **REGISTER THE WARRANTY ONLINE THE DAY IT IS COMMISSIONED.** 10 yr parts, 10 yr compressor,
  lifetime heat exchanger — all conditional on registration. For a 30-year goal this is the single
  highest-value five minutes of the entire project.
- **Ask the friend to read static pressure before and after.** He has the manometer. It turns "it
  breathes better" into a number, and pairs with the CEMC 15-minute data as a second proof.

## 2. Ductwork materials — priced 2026-08-31, real search, not from memory

Home Depot, R8 insulated flexible duct, 25 ft rolls:

| Size | Roll | Per ft |
|---|---|---|
| 4 in | $70.54 | $2.82 |
| **7 in** | **$69.99** | **$2.80** |
| 8 in | $94.55 | $3.78 |
| 10 in | $96.99 | $3.88 |
| 12 in | $129.00 | $5.16 |
| 14 in | $152.10 | $6.08 |

Other line items: register boots (oval-to-round, galvanized) **$13.98–$16.98 ea** · Nashua 324A foil
tape 2.5 in x 60 yd **$27.98/roll** · foil-mastic sealant tape **$29.98/roll** · Master Flow
water-based mastic, 0.91 gal tub (price not returned by search — verify in store).

### Estimate at the confirmed 7 + 1

```
flex branch duct    4 rolls @ $69.99        $279.96
return run          1 roll, 14 in           $152.10
register boots      7 @ ~$15.50             $108.50
foil tape           2 rolls                 $ 55.96
mastic              ~1 tub (estimated)      $ 40.00
                                           --------
                    subtotal                $636.52
NOT PRICED: supply plenum/trunk off the package unit, register grilles,
return grille, strapping/hangers, sheet-metal screws      +$150-350
                    MATERIALS TOTAL         $790 - $990
```

⚠️ **Assumptions that change the number — check these before buying:**
1. **4 rolls of branch duct** assumes ~2 registers per 25 ft roll. If the unit sits far from the
   house, or runs are long, this goes up. Measure the actual runs.
2. **7 in was used for branches.** The 7 in roll is **$69.99** and the 8 in is **$94.55** — a 35%
   jump for one inch. **Ask the friend whether 7 in is adequate before buying**; across several runs
   that is real money. He is sizing it anyway.
3. Register grilles and the return grille are not in the total.

## 3. Still open

- **What to pay the friend** — NOT researched yet, and deliberately not guessed. Two different
  numbers depending on whether Jeff is a helper or a co-worker on the job. Needs real Middle
  Tennessee duct-replacement labor rates before any figure is quoted.
- **Alpine unit price** — Jeff has it; not yet written here. **Add it when he says it.**
- **Current unit tonnage/model** — on the data plate. Would confirm the 2.5 vs 3 ton call.

## 4. Why this matters beyond the money

The old ductwork was **leaking**, and the repair on **2026-07-25** is measurable in the meter:
441 kWh saved over 37 cooling days, **16.8%**, ~$41/month of cooling weather — see
`docs/utilities/electric_disaggregation_2026-08-31.md`. Complete new ductwork plus a new unit should
show up the same way. **Baseline the before/after from the CEMC 15-minute data** so the result is a
measured number, not a hope.

---

## Ductwork design — how it gets built (Jeff's ask, 2026-08-31)

Jeff: *"you didn't put in there about the duct work and how to improve that on the front end."*
This is the half that decides whether the new equipment actually performs.

**At the unit — fabricated rectangular plenums, both sides.** Jeff reached this himself:
*"if we're just going to do that with a square box, then there's no reason to buy those rounded
sheet metal adapters."* Correct, and the spec sheet backs it — the Blueridge openings are
**rectangular**, not round:

```
supply   side 13.44 w x 14.32 h   |  bottom 14.02 w x 11.49 d
return   side 13.44 w x 17.07 h   |  bottom 16.77 w x 11.49 d
```

A box built to those dimensions IS the square-to-round transition. No adapters to buy, and it is
what eliminates the 30-year-old twist (both trunks run down the centre of the house and were
twisted at the unit when the house was built, because the trunk orientation never matched the
equipment).

**Branches — round takeoff collars off the plenum face**, flex pulled taut and strapped. Slack or
spiralled flex is the same mistake as the twist, further downstream.

**Sizing — 7 in vs 8 in is a real cost fork.** $69.99/roll vs $94.55/roll, a 35% jump for one inch.
The A/C friend is sizing the system anyway; ask before buying. 7 registers, 1 central return.

**The return is the tightest point in the whole system** — one central return in the living room for
the entire house. Check the **grille free area**, not just the duct. A starved return makes the
equipment work harder no matter how good the supply side is.

**Measure it.** Static pressure before and after, on the friend's manometer. Turns "it breathes
better" into a number that can sit next to the meter data.

## Labour — what to pay the A/C friend

| Anchor (searched 2026-08-31) | Rate |
|---|---|
| Tennessee HVAC labour, billed | $75 – $150 / hr |
| Full system install, labour only | $1,000 – $3,000 |
| TN HVAC helper, average | $25.65 / hr |
| Nashville area vs state average | +10 – 15% |
| **Fair for this job, Jeff working alongside him** | **$700 – $1,200** |

## Small parts (priced 2026-08-31)

| Item | Cost |
|---|---|
| AC disconnect, 60 A non-fused | $28.98 |
| 25 A 2-pole breaker (Square D) — the existing 40 A is oversized for this unit | $18.24 |
| AC whip, 6 ft liquidtight | $35.00 |
| Gas connector + filter kit | $40 – $150 |
| UV coil light | $60 – $280 |
| **Parts subtotal** | **$182 – $512** |

## All-in

```
unit after coupon      $2,691.00
ductwork materials     $  786.52 - $  986.52
parts + UV             $  182.22 - $  512.22
labour to the friend   $  700.00 - $1,200.00
                       -------------------------
TOTAL                  $4,359.74 - $5,389.74
```

Tennessee full replacement, installed, runs **$5,400 – $13,100**. This lands below the bottom of
that range **and includes complete new ductwork**, which a quote in that range would not.

🔴 **THE CANOPY IS A NO — and it is a safety no, not a preference.** Jeff asked for a cover over the
unit to keep leaves out. The Blueridge install manual: *"Do not permit overhanging structures or
shrubs to obstruct condenser air discharge outlet, combustion air inlet, or vent outlet."* This is a
**top-discharge package unit with a gas flue** — anything above it blocks both the air the condenser
throws and the flue. It voids the warranty and it is a combustion-safety problem. Manual Table 1
clearances: front 0"/24", back 0"/0", left 0"/24", right (from vent hood) 12"/24", plus 4 ft
horizontal from gas meters/regulators.

---

# 🔴 CORRECTION 2026-08-31 14:00 — THE UNIT IN THIS DOC WAS DISCONTINUED

Everything above priced **Blueridge BPRPGE1430-072EP-2 at $2,691**. Verified live in Chrome on
Alpine's own product page, 2026-08-31:

> **"The Blueridge BPRPGE1430-072EP-2 is no longer available for sale."**

No Add to Cart button. Confirmed twice — page text and element search.

🔴 **THE TRAP, AND IT IS THE REASON THIS SLIPPED THROUGH:** that page **still renders the price
`$2,990.00`, still shows "Apply $299.00 Coupon — Ends September 14th", still says Free Shipping.**
Every signal that made the figure look verified is still on the page. Only the buy button is gone.
A price scraped or read from that page looks perfectly valid and is not purchasable.
**A visible price is not proof of availability — check for the Add to Cart control.**

The `BPRPGE1430-054EP` (2.5 ton / 54,000 BTU) is likewise superseded; its page names the successor.

## THE UNIT TO ACTUALLY BUY — verified in stock 2026-08-31

**Blueridge BRP7GE1330E054P-01A** — 2.5 ton cooling / 54,000 BTU heat / 13.4 SEER2
`.../14-16-seer/blueridge/brp7ge1330e054p-01a`

```
list                     $3,470.00
coupon SUMMER2026 (10%)  -$ 347.00     expires 14 Sep 2026
                         ----------
net                      $3,123.00     In Stock · Add to Cart · free shipping
```

Jeff approved the smaller heat 2026-08-31: *"The 54,000 BTU heat will be fine if the price is right."*
2.5 ton keeps the **correct** cooling size — the 3-ton alternatives would oversize a 1,400 sq ft
house and hurt humidity removal.

| | old (dead) BPRPGE1430-072EP-2 | new BRP7GE1330E054P-01A |
|---|---|---|
| net price | $2,691 | **$3,123** (+$432) |
| heat input / output | 72,000 / 58,000 BTU | 54,000 / 44,000 BTU |
| refrigerant | R-410A (phasing down) | **R-454B + onboard leak detection** |
| min ampacity / max breaker | 18.22 A / 25 A | **17.5 A / 25 A** |
| cabinet | 47.66 × 47.66 × 40.89 | **identical** |
| duct openings | supply 13.44×14.32 / btm 14.02×11.49 · return 13.44×17.07 / btm 16.77×11.49 | **identical** |

🟢 **The duct openings are identical, so every plenum/ductwork conclusion in this document stands
unchanged.** The 40 A → 25 A breaker line also stands (it would have become 35 A on a 3-ton).

## Other corrections found in the same pass

- **Alpine's own parts are cheaper than what was priced here and ship free with the unit:**
  disconnect **$21.99** (was $28.98), whip **$24.99** (was $35.00), 50 ft 8-conductor thermostat
  wire **$29.99**. Doc updated.
- **"No pour needed" was overconfident.** Alpine specs a **50×53** pad for this cabinet. The unit is
  within 0.16" of the existing one so the current pad should carry it, but **measure before
  delivery** — a 50×53×3 replacement is $239.99.
- **"1996 builder" was invented.** The year built is not in any record found, and no search returned
  it. Jeff said "30 years ago"; the doc now says only "since the house was built."
- **House is 1,400 sq ft, 3 bed / 2 bath** (public property record, 2026-08-31). Cross-checks: 2.5
  ton is normal for that size, and 7 registers = 3 bed + 2 bath + living + kitchen.
- **Packaged units keep the 13.4 SEER2 NATIONAL minimum.** The Southeast 14.3 SEER2 rule applies to
  **split systems**, not packaged. Do not let anyone claim a higher SEER is required here.

## Revised totals

```
A  equipment                       $3,123.00
B  ductwork materials              $  787 - $  987
C  electrical, gas, accessories    $  195 - $  525
D  labor, complete installation    $  700 - $1,200
                                   -----------------
   Phase 1  A/C installed          $4,805 - $5,835
   Phase 2  crawl space materials  $  600 - $  950
                                   -----------------
   GRAND TOTAL                     $5,405 - $6,785
```

## Crawl space enclosure — priced and sequenced

1,400 sq ft footprint. **DIY materials $600 – $950** (12-mil woven liner, seam tape, fasteners,
sealant; a complete ~2,000 sq ft kit runs $949.99). Contractor barrier-only $3–$7/sq ft =
$4,200–$9,800; full system with dehumidifier and drainage $5–$12/sq ft = $7,000–$16,800.

🔴 **SEQUENCE: DUCTWORK FIRST, ENCAPSULATION LAST.** The vapor barrier is always the final step —
sheet metal, screws and crawling while running new duct will puncture a liner already down. This is
the opposite of the intuitive order and it is what the trade sources say.

## Document status

Artifact republished (est. rev **HCC-2026-002**) at the same URL. **Verified 2026-08-31, not
asserted:** renders to exactly **2 printed pages** (Letter, 0.4in margins — counted `/Type /Page`
objects in a real Playwright PDF render, `pcount.mjs`); **0 px horizontal overflow at 1536 px**;
all 7 subtotals/totals recomputed independently and reconcile to the penny; 87/87 div, 6/6 table,
8/8 section, 8/8 svg; every CSS token defined on bare `:root`. Canopy section and UV air-cleaner
removed at Jeff's direction; UV **coil** light kept.

---

## REVISION 2026-08-31 14:20 — crawl space split out, gas and UV priced properly

**Crawl space removed from the A/C estimate.** Jeff: *"take out the crawlspace stuff for now."* It
does not gate the A/C job — see the sequencing finding above (ductwork first, liner last). The
priced crawl-space figures stay recorded in this file; a standalone sheet was drafted and parked at
`scratchpad/crawlspace.html`, not delivered.

**The LP conversion kit is NOT needed and never was in the estimate.** Jeff, 2026-08-31: *"I don't
need a gasket because I'm not going to propane I'm going natural gas."* Correct — the Blueridge
**22B87 LPG/Propane Conversion Kit ($64.99)** is required only to run LP. The unit ships configured
for **natural gas**. Do not add it.

**The vague "$40–$150 gas connector & filter kit" line is retired.** It was an unpriced guess
carried from earlier in the session. Replaced with real parts (Home Depot, priced 2026-08-31):
1/2 in. coated-stainless flex connector **$11.75–$25.93**, or **$19.57** for the version with an
integral shutoff valve, plus black-iron nipples for a sediment trap. Line is now **$20–$45**.

**UV coil light is now a real priced line, not a range.** 14 in. germicidal coil lamp, **$65.00**.
🔴 **Specify the 24 VAC version, not 120 V.** This is a package unit sitting outside with no
receptacle — a 24 VAC lamp runs off the unit's own control transformer instead of requiring a 120 V
circuit run out to it. Confirm the transformer has ~50 VA spare, or add a small dedicated one.
Running cost ~$36/yr, bulb every 1–2 years.

### Current totals (supersedes every figure above)

```
A  equipment   Blueridge BRP7GE1330E054P-01A   $3,123.00   ($3,470 less $347 coupon)
B  ductwork materials                          $  787 - $  987
C  electrical, gas, accessories                $  180 - $  205
D  labor, complete installation                $  700 - $1,200
                                               -----------------
   TOTAL, installed                            $4,790 - $5,515
```

C breaks down as: UV coil light $65.00 · disconnect $21.99 · 25 A breaker $18.24 · whip $24.99 ·
gas connector/valve/trap $20–$45 · 50 ft 8-conductor thermostat cable $29.99. The disconnect, whip
and thermostat cable are Alpine parts that ship free with the unit.

**Verified 2026-08-31, not asserted:** renders to exactly **2 printed pages** (Letter, 0.4 in
margins, `/Type /Page` count on the delivered PDF); **0 px horizontal overflow at 1536 px**; all
subtotals recomputed independently and reconcile to the penny; 83/83 div, 5/5 table, 7/7 section,
6/6 svg; every CSS token defined on bare `:root`; stale-value sweep clean on 19 retired figures.
