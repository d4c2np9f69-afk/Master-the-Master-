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

---

## ✅ RE-VERIFIED LIVE 2026-09-09 13:55 — price, coupon AND availability all still good

Checked in Chrome on Alpine's own product page (WebFetch gets **HTTP 403** from alpinehomeair.com —
use the browser, not the fetcher). Re-checked because the 08-31 pricing was 9 days old and this doc's
own hard lesson is that **a visible price is not proof of availability**.

```
model            BRP7GE1330E054P-01A   2.5 ton / 54,000 BTU heat / 13.4 SEER2   CONFIRMED
list             $3,470.00                                    unchanged from 08-31
coupon           "Apply $347.00 Coupon - Ends September 14th"  STILL LIVE
net              $3,123.00                                    unchanged
AVAILABILITY     *** Add to Cart PRESENT *** (twice on the page)  <- the real signal
shipping         "Ships FREE Thursday"
```

**Spec cross-check against the page, all matching this doc:** min ampacity 17.5 A · max fuse/breaker
25 A · pad 50×53 · supply side 13.44×14.32, btm 14.02×11.49 · return side 13.44×17.07, btm
16.77×11.49 · R-454B with on-board RDS · AHRI# **217109080** · warranty 10 yr parts / 10 yr
compressor / lifetime heat exchanger, all *with online registration*.

**Two small things the live page adds:**
- **Weight is 400 lb, not 406.** The 406 figure came off the discontinued BPRPGE1430 and is still in
  the artifact's freight line. Affects nothing; fix on the next republish.
- **AFUE is 81%** on this unit (the old Nordyne was 78%). Not previously recorded here.
- ⚠️ Alpine lists the **21J92 square-to-round adapter ($279.99) under "REQUIRED COMPONENTS"**. It is
  not required for this job — the **fabricated plenum does that exact job**, which is the decision
  already made in this document. Do not let the word "required" reverse it. Same for the
  **Kickstart hard-start device ($79.99)** and the **22B87 LP kit ($64.99)**: both offered in the
  install-kit upsell, both already ruled out here (new compressor; natural gas).


---

# 🔄 DIRECTION CHANGE 2026-09-09 14:11 — GOING OUT FOR CONTRACTOR QUOTES

Jeff: *"We are changing directions with the air conditioner plan because I don't think my guy is
gonna be able to get to me for a while so I need to start the quote process."* **The friend-labor
plan ($700–$1,200) is on hold, not cancelled.**

## 🔴 THE FORK THAT CHANGES EVERYTHING — ASK IT ON THE FIRST CALL

**Most full-service HVAC companies will not install owner-supplied equipment.** The entire plan in
this document is built on Jeff buying the Blueridge from Alpine himself at **$3,123**. Two outcomes:

| Path | What happens |
|---|---|
| **Labor-only** (they install *his* Alpine unit) | Keeps the $3,123 buy and the warranty in Jeff's name. Fewer companies will do it, and some void their own labor warranty on customer equipment. |
| **Turnkey** (they supply the unit) | The Alpine purchase goes away. Expect a different brand and a markup; TN full replacement runs **$5,400–$13,100** installed. Get the model number so it can be spec-matched against BRP7GE1330E054P-01A. |

## THE THREE, RESEARCHED 2026-09-09 — ranked by FIT FOR THIS JOB, not by ad spend

### 1. Daniels Heating & Air — BEST CAPABILITY MATCH
`2880 Gideon Rd, Greenbrier TN 37073` · **(615) 804-1078** / (615) 643-3143 · `danielshvacinc.com`
- **Est. 1988, third generation.** BBB file open since 2004.
- **Reviews: 4.9 / 749** · Porch 4.97 / 128.
- **Serves White House BY NAME** (Robertson, Sumner, Davidson).
- 🟢 **THE DIFFERENTIATOR: "Custom Ductwork" and "Sheet Metal Fabrication" are listed services.**
  That is literally this job — the fabricated supply and return plenums that kill the 30-year twist.
  No other candidate advertises in-house sheet metal.
- York Comfort Certified · Daikin. ~12 miles out.
- ⚠️ Package units not named on the site. Gas piping not named. **Ask both.**

### 2. Petitt Heating & Cooling — BEST REPUTATION + MOST LOCAL + GAS LICENSED
`127 Raymond Hirsch Pkwy, White House TN 37188` (also Springfield + Hendersonville) · **615-654-0814**
- **Est. 2010.** License cited as **TN-64284** — TN **Mechanical, Plumbing and gas** licenses, EPA certified.
- **Reviews: 5.0 / 499 (Birdeye); site claims 800–1,000+ five-star.** Not BBB-accredited (a paid
  membership, not a quality signal — do not read it as a mark against them).
- **10-Year Parts & Labor warranty on new installs** · $500 on-time guarantee · financing.
- 🟢 **They also do crawl-space encapsulation** — that is Jeff's Phase 2 ($600–$950 DIY materials).
  One contractor could carry both, and the sequencing rule still applies: **ductwork first, liner last.**
- ⚠️ **Site names NO ductwork, sheet metal, package units, static pressure or load calcs.**
  Strongest reputation, least-proven fit for THIS scope. **Ask hard.**

### 3. Derryberry's Heat & Air — DEEPEST PEDIGREE, SERVICE AREA UNCONFIRMED
`212 N Water Ave, Gallatin TN 37066` · **615-452-8121** · `derryberryac.com`
- **Est. 1986 — 40 years.** **NATE-certified technicians** · **TVA Quality Contractor, 10+ years.**
  Those are real third-party credentials, not self-claimed.
- ⚠️ **Site says "Gallatin, Hendersonville and surrounding Middle Tennessee" — White House and
  Robertson County are NOT named. Confirm they come this far before spending a call on scope.**
- ⚠️ No ductwork fabrication, package units or gas piping advertised.

**Backup if one drops out:** Evolution Home Services, `105 Flex Ave, Portland TN 37148`,
**615-477-1081** — 10+ yrs, and **lists 37188 explicitly** in its service zips. Thinner credentials,
no duct-fab or package-unit mention.

🔴 **SCREENED OUT — do not call these, they are lead-generation farms, not local companies:**
`furnacecontractorsnearme.com`, `ac-repair.netlify.app`, `emergency-hvac.bitbucket.io`,
`duct-repair-white-house-tn.harrisheatingcooling.com`. They rank well and sell the lead on.
Also skipped: **T.A. Kaiser** (Nashville/commercial, 11 Yelp reviews) and the Murfreesboro package-unit
specialists (Reliable Comfort, Airstream) — real companies, ~50 miles away.

## 📞 THE CALL SCRIPT — same ten questions to all three, so the quotes are comparable

1. **Do you install PACKAGE units?** Gas/electric, everything outside on a slab. *(Many residential
   shops mostly do split systems — this is the single best disqualifier and it is question one.)*
2. **Will you install an owner-supplied unit** (Blueridge BRP7GE1330E054P-01A from Alpine), or must
   you supply it? **If you supply it — what model, and what is the installed price?**
3. **Will you fabricate new sheet-metal supply AND return plenums at the unit?** Both trunks are
   twisted onto the equipment and have been since the house was built. *(This is the whole job.)*
4. **Complete duct replacement — 7 supply branches, 1 central return.** Included or extra?
5. **Manual J load calculation** to confirm 2.5 ton before ordering?
6. **Static pressure reading before and after** — will you record and give me the numbers?
7. **Gas connection and the electrical** — the breaker must come DOWN from 40 A to 25 A. Included?
   Who pulls permits?
8. **Labor warranty — how long?** (Petitt advertises 10-year parts AND labor; use it as the anchor.)
9. **Lead time — how soon can you start?** *(This is the entire reason for switching. Ask early.)*
10. **Is the existing pad reusable?** 47.5 in old vs 47.66 in new; Alpine specs 50×53.

## Verifying them yourself

**`verify.tn.gov`** — the Board for Licensing Contractors' official lookup: status, classification,
**monetary limit**, and disciplinary history. Board: **800-544-7693**.

⚠️ **Know what the license does and does not prove here:** Tennessee requires a state contractor
license only at **$25,000 and above**. This job is $5–6k, so a company can legally do it without one.
**"Licensed" is therefore a weak filter for this project** — reviews, in-house sheet metal, and
package-unit experience are the real discriminators. The exception is **gas**: that work wants a
proper gas/mechanical license, which is where Petitt's TN-64284 counts.

🔴 **NOT VERIFIED — no company has been contacted.** Everything above is public-record research:
company sites, BBB, Birdeye/Yelp/Porch review counts. **Whether any of the three will take this
exact scope is unknown until Jeff calls.** Nothing here is a quote.

---

# 🔴🔴 DEEP RESEARCH 2026-09-09 14:25 - FOUR FINDINGS THAT CHANGE THE PLAN

Jeff: *"Dig deeper and think harder"*, then *"That was weak search forums."* Both fair - the first
pass read marketing pages. This pass pulled apart **the manufacturer's own warranty PDF** locally
with zlib (WebFetch could not decode it) and went to trade/cost sources.

## 1. 🔴 THE WARRANTY - VERBATIM, Blue Summit LLC rev 07/2024

> **Limitation 4:** *"The Equipment must be installed **(or certified)** by a qualified installer and
> the installation must adhere to the **Quality Installation protocols of the Air Conditioning
> Contractors of America (ACCA)**, and these products must be **registered with the manufacturer
> within 60 days of installation** for the warranty to be in place."*
>
> **Limitation 3:** *"The Owner is responsible for all costs associated with **diagnostics and labor**."*
>
> **Limitation 5:** *"All repairs ... must be made by a **Licensed HVAC contractor** using
> manufacturer-specified service components."*

**(a) 🟢 "(or certified)" IS AN ESCAPE HATCH - the most valuable thing found today.** The
friend-labor path is NOT dead. The warranty accepts equipment *certified* by a qualified installer,
not only *installed* by one - and the claim procedure asks for **"Installing or certifying contractor
information"**, confirming certification is a recognised route. A paid commissioning visit can
preserve the 10-yr/lifetime coverage on an owner-installed unit.

**(b) 🔴 ACCA QUALITY INSTALLATION IS A CONDITION OF COVERAGE, not a nice-to-have.**
ANSI/ACCA 5 QI requires **Manual J** load calc, **Manual S** selection, **Manual D** duct design,
verified airflow, verified charge and **static pressure measurement**. Those were on the old
"questions to ask" list as optional. They are warranty conditions. Get them in writing.

**(c) 🔴 THE MANUFACTURER COVERS NO LABOUR, EVER.** Parts only. Corroborated by owner
complaints: *"Blue Ridge will not cover labor or refrigerant costs."* **This re-values Petitt
sharply** - their **10-year parts AND LABOUR** warranty is contractor-backed cover the manufacturer
will never give.

**(d) 🔴 REAL COVERAGE NUMBERS + A CLOCK TRAP NOBODY RECORDED**

| | Unregistered | Registered within 60 days |
|---|---|---|
| Parts | **5 years** | 10 years |
| Compressor | **5 years** | 10 years |
| Heat exchanger | **20 years** | **Lifetime** |
| Warranty STARTS | **7 days after DATE OF SHIPMENT** | date of actual installation |

The Extended warranty is **NONTRANSFERABLE** - sell the house and it reverts to 5/5/20 dated from
shipment. Relevant to a 30-year-hold house and to resale.

## 2. 🔴 R-454B / A2L - a 2026 qualifier missed entirely on the first pass

- From **1 Jan 2026** the EPA AIM Act Technology Transitions Rule **bans installing new residential
  R-410A systems.** R-454B is the only road - the old $2,691 R-410A unit vanishing was the market.
- 🔴 **A cheap R-410A Goodman package unit online is a TRAP - it is no longer legally installable.**
- R-454B is **A2L, mildly flammable.** Federally nothing beyond **EPA 608** is required, but several
  states have added rules - verify for TN.
- 🔴 **Tooling runs roughly $5,000-$10,000 PER TRUCK** (A2L gauges, recovery machines, leak
  detectors); R-410A tools are not all compatible. **A shop that has not tooled up cannot service
  this unit.** "Are you A2L / R-454B trained and tooled?" is now question #2 on every call - and it
  is a quality filter, because it costs real money to answer yes.

## 3. 🔴 PRICE EXPECTATION RESET - the DIY number will not survive a contractor

| Benchmark (2026) | Figure |
|---|---|
| Duct replacement, national | **$25-$55 per linear foot** |
| Duct replacement, Nashville | **$35-$55/lf**, Nashville **10-15% over TN average** |
| Typical single-family duct job | 30-90 lf -> **$1,000-$5,000** |
| HVAC replacement, Nashville | **$3,677-$11,765** |
| Full system + new ductwork | **can approach $13,000** |

🔴 **Line B, "ductwork materials $787-$987", is MATERIALS ONLY.** A contractor doing that same
ductwork charges **$1,000-$5,000 for that scope alone.** The $4,790-$5,515 all-in assumed a friend at
$700-$1,200. **Contractor quotes will land far above it and that is not gouging** - it is the labour
line finding its market price. Expect **$8,000-$13,000** turnkey.

## 4. 🔴 MARKUP - Jeff: *"I'm not paying a bunch of mark up"*

**Industry norms, researched not guessed:** residential install equipment/materials are marked
**2.5x-3.5x wholesale** (some sources put it as **25-100%**); **install gross margin runs 35-45%,
national average ~40%**; repair parts 3x-4x. Markup and margin differ - a 50% markup is a 33% margin.

**How to see the markup instead of arguing about it - three moves:**
1. **Demand an itemised quote: equipment line separate from labour line.** A lump sum exists to hide
   the split. This single request does more than any negotiation.
2. **Ask the same contractor for a labour-only price if Jeff supplies the unit.** The gap between
   turnkey and labour-only **IS** the equipment markup, revealed by their own two numbers.
3. **Benchmark against the direct price:** Blueridge BRP7GE1330E054P-01A is **$3,123 delivered** to
   the door. A comparable **Goodman SEER2 gas package unit retails ~$3,885-$4,334**. If a quote's
   equipment line is far above that, ask what it buys.

⚠️ **Be fair about it too:** margin funds the labour warranty, the callback, the A2L tooling and
the permit. The goal is a quote that is *itemised and explainable*, not the lowest number.

## Revised call script - the questions that actually discriminate

1. **Do you install PACKAGE units?** (gas/electric, all outside on a slab)
2. 🔴 **Are you A2L / R-454B trained and tooled?**
3. **Will you install an owner-supplied unit - or CERTIFY one to ACCA QI so the warranty stands?**
4. **Will you fabricate sheet-metal supply AND return plenums at the unit?**
5. **Manual J / S / D in writing?** (warranty condition, not a favour)
6. **Static pressure before and after, recorded and handed over.**
7. **Complete duct replacement, 7 supplies + 1 central return** - in or out?
8. **Gas connection + breaker 40 A -> 25 A + permits.** White House enforces 2021 ICC Mechanical
   since 1 Jan 2025. Codes: **615-672-4350 ext 2120**, Ceagus Clark, 105-D College St.
9. **Labour warranty - how many years?** (Petitt advertises 10 yr parts AND labour; use as anchor.)
10. **Lead time.** The whole reason for the switch.
11. **Itemise equipment vs labour**, and quote labour-only as an alternate.

## The deadline collision - decide before Monday

**The $347 coupon expires Mon 14 Sep; quotes started Wed 9 Sep.** Three contractors will not have
quoted and been compared in five days. Buying Monday saves $347 but commits to owner-supplied before
knowing who will install or certify it (mitigated by the "(or certified)" clause). Letting it lapse
costs $347 and keeps every door open - **ask Alpine (800) 865-5931 whether a successor code follows.**

**Sources:** Blue Summit/Blueridge Limited Warranty rev 07/2024 (documents.alpinehomeair.com,
extracted locally) - EPA AIM Act Technology Transitions Rule - ANSI/ACCA 5 QI - Angi / HomeGuide /
RealCostIQ / Contractor+ 2026 cost data - Jobber / Sera / Simpro markup data - City of White House
Planning & Codes - owner complaints via PissedConsumer and GreenBuildingAdvisor.
⚠️ **HVAC-Talk is paywalled (HTTP 402 via tollbit); its threads could NOT be read - do not cite
them as if they were.**

---

# 🔴 GOODMAN vs BLUERIDGE - HEAD TO HEAD, READ LIVE IN CHROME 2026-09-09 14:30

Jeff: *"I am not opposed to going with Goodman but I'm not paying a bunch of mark up."* Read off
**Alpine's own category page**, so it is the same retailer, same day, same margin structure - the
cleanest possible comparison. (WebFetch gets HTTP 403 from alpinehomeair.com and acdirect.com; the
browser works. Alpine's page even greets with *"Your Location: White House, TN"*.)

| | **Blueridge BRP7GE1330E054P-01A** | **Goodman GPGM33004031** | Goodman GPGM33006031 |
|---|---|---|---|
| Cooling | 2.5 ton (30,000 BTU) | 2.5 ton (29,000 BTU) | 2.5 ton |
| **Heat in / out** | **54,000 / 44,000** | **40,000 / 32,000** | 60,000 / — |
| List price | **$3,470** | **$4,645** | **$4,715** |
| After SUMMER2026 | **$3,123** | ~$4,180 (see caveat) | ~$4,244 |
| Stock | **In Stock** | In Stock | ❌ **OUT OF STOCK** |
| Refrigerant | R-454B | **R-32** | R-32 |
| **Heat exchanger warranty** | **LIFETIME** (registered) | **20 YEARS** (registered) | 20 years |
| Parts / compressor | 10 / 10 yr registered | 10 / 10 yr registered | same |
| Min ampacity / max breaker | **17.5 A / 25 A** | **21.2 A / 30 A** | — |
| Cabinet W x D x H | 47.66 x **47.66** x 40.89 | 47 x **51** x 34.5 | — |
| Weight | 400 lb | 380 lb | — |
| **Duct openings** | supply 13.44x14.32 / return 13.44x17.07 | **16 x 16 SQUARE both** | — |
| Altitude range | 0-4,500 ft | 0-2,000 ft | — |

## 🔴 SIX FINDINGS, and they mostly run against Goodman FOR THIS HOUSE

**1. Goodman costs roughly $1,000-$1,500 MORE and delivers LESS HEAT.** $4,645 vs $3,470 list, while
dropping from 54,000 to 40,000 BTU input (44,000 -> 32,000 output). The Goodman that actually matches
the heat is the **60,000 BTU GPGM33006031 at $4,715 - and it is OUT OF STOCK.**
⚠️ **Caveat, not verified:** the Goodman page says *"View Discounted Price In Cart"* rather than
naming a coupon, so its net may also fall ~10%. **Not confirmed - would require adding to cart.**
Even at the friendlier reading, Goodman is ~$1,058 more.

**2. 🔴 THE WARRANTY RUNS BACKWARDS FROM THE ASSUMPTION.** Goodman heat exchanger =
**20 years**. Blueridge = **LIFETIME**. The budget house brand carries the better long-term cover,
and for a house Jeff intends to hold 30 years that is the single most valuable line in the table.

**3. 🔴 GOODMAN'S WARRANTY HAS NO "(or certified)" ESCAPE HATCH.** Goodman requires installation
**by a licensed HVAC professional** - full stop. Blueridge accepts *installed **or certified*** by a
qualified installer. **Choosing Goodman therefore KILLS the friend-labour path outright.** That is
not a small print difference; it removes an option Jeff still has.

**4. 🔴 THE PAD QUESTION RE-OPENS ON GOODMAN.** Old Nordyne is 47.5 in; Blueridge 47.66 in -
a 0.16 in difference, which is why "no pour needed" held. **Goodman is 51 in deep - 3.5 in bigger
than what the existing pad carries.** Expect to need the **50x53x3 pad, $239.99**, which erases
more of any saving.

**5. 🔴 EVERY PLENUM DIMENSION IN THIS DOCUMENT IS BLUERIDGE-SPECIFIC.** Goodman's openings are
**16 x 16 square, both supply and return**. The note above that says *"duct openings identical, so
every plenum/ductwork conclusion stands unchanged"* is true **only for the Blueridge**. Switch to
Goodman and the plenums get re-measured. Not fatal - they are fabricated anyway - but the numbers
in this file would be wrong.

**6. Different refrigerants: Blueridge R-454B, Goodman R-32.** Both A2L, both AIM-Act compliant
(Goodman is Daikin-owned and Daikin went R-32). **Ask the contractor which A2L they are tooled for**
- being ready for one does not guarantee the other.

## 🟢 THE ANSWER TO THE MARKUP QUESTION

**If a contractor proposes Goodman, that is NOT automatically markup - Goodman genuinely costs more
at retail, by about $1,200 at list on the same website.** So the brand choice and the markup are two
separate arguments. Judge markup by asking for the **equipment line itemised separately** and
comparing it to these public numbers:

- Blueridge 2.5 ton / 54k: **$3,470 list, $3,123 couponed, in stock, ships free**
- Goodman 2.5 ton / 40k: **$4,645 list**  ·  Goodman 2.5 ton / 60k: **$4,715 list, out of stock**

An equipment line materially above those, on top of a labour line, is markup worth questioning.
Industry norm is 2.5x-3.5x wholesale on materials and a 35-45% install gross margin.

**Bottom line for this house: Goodman is the more expensive unit, with less heat, a 20-year rather
than lifetime heat exchanger, a probable new pad, and it forfeits the owner-install option.** Worth
taking only if a contractor Jeff otherwise wants will not touch Blueridge - which is a legitimate
reason, and a fair thing to pay for.

## 🔴 REFRIGERANT - Jeff 2026-09-09: *"Yes I want the most recent refrigerant"*

**Neither is newer. R-32 and R-454B are the SAME generation** - the two parallel A2L answers to the
AIM Act, chosen by different manufacturers. Daikin/Goodman went R-32; Carrier, Lennox and Blueridge
went R-454B. Both clear the 700-GWP limit in force since 1 Jan 2025. **There is no third, newer
option to wait for.**

| | **R-454B** (Blueridge) | **R-32** (Goodman) |
|---|---|---|
| **GWP** | **466** | 675 |
| Type | zeotropic blend (R-32 + R-1234yf) | single component |
| Refrigerant cost | ~$12.89 / lb | ~$4.11 / lb |
| Efficiency vs R-410A | 102% | **107%**, and needs up to 40% less charge |
| Pressures | near-identical to R-410A | different |
| Typical use | US central/residential | ductless & mini-split, heavy international use |

🟢 **THE DECIDING FACT: the AIM Act phases down total GWP quotas through 2036.** A lower-GWP
refrigerant is less exposed to the supply restrictions and price spikes that phase-down creates.
**At 466 vs 675, R-454B sits further from the next threshold and is the more future-proof of the
two.** For a house Jeff intends to hold 30 years, that is the answer to his question.

⚠️ **The honest counterweight:** R-454B costs roughly **3x more per pound** to buy, so any future
recharge is dearer, and R-32 is slightly more efficient. Neither should matter on a sealed system -
a system that needs topping up has a leak, which is a repair, not a running cost.

🟢 **Convergence worth noting: the refrigerant preference points at the SAME unit as everything
else.** The Blueridge BRP7GE1330E054P-01A is the lower-GWP refrigerant **and** ~$1,200-$1,500
cheaper **and** lifetime rather than 20-year heat exchanger **and** fits the existing pad (47.66 in
vs Goodman's 51 in) **and** is the only one of the two whose warranty survives an owner/friend
install via the "(or certified)" clause. **Four independent reasons landing on one unit.**

---

# 🟢 ALPINE **DOES** REFER INSTALLERS - `alpinehomeair.com/pro-installation`, read 2026-09-09 14:36

Jeff asked whether Alpine recommends installers. **They do, and it directly addresses the two things
this project was stuck on.** The page title is explicit: **"Contractor Referral Assistance (Not
Installation Service)"** - Alpine does not install, it brokers introductions.

## 🟢 THE HEADLINE: they will find a contractor to do ANY of three levels

Verbatim from the page - *"We'll locate a professional contractor to:"*

1. *"Do a full and complete home product installation."*
2. *"Assist with **part or all** of your equipment installation."*
3. 🟢 ***"Inspect and start up equipment AFTER YOU'VE INSTALLED IT."***

**Item 3 is Alpine's productised version of the warranty's "(or certified)" clause.** The
friend-labour path plus a paid commissioning visit is not a workaround Jeff has to invent and talk a
contractor into - **it is a service Alpine already sells and staffs for.** That is the single most
useful thing found today.

At cart he picks the level *"ranging from **None (DIY) to Full Installation by Contractor**."*

## How it works, and the ONE catch

1. Add to cart. **Confirm the item shows "Contractor Referral Assistance" in its Services section**
   (stated eligibility requirement - ⚠️ NOT yet verified on the BRP7GE1330E054P-01A page).
2. Click **"Get Free Installation Quotes"** at the cart, choose the level of help per item.
3. Check out normally.
4. Alpine **mails a description of the project to multiple local contractors** and asks them to bid.
5. Alpine **emails a list of recommended contractors with their customer ratings**.
6. *"You will typically be contacted by **2-3 interested contractors**"* - free, no-obligation quotes.
7. Jeff picks; scheduling and payment are strictly between him and the contractor.

🔴 **THE CATCH - IT FIRES ONLY AFTER THE ORDER IS PLACED.** *"Once your order is placed, we will
mail out a description of your project."* **He cannot use it to shop quotes before deciding to buy**,
and it goes out by MAIL, so it is not fast.

🟢 **But this cuts the coupon knot.** The reason to hesitate before Monday was "what if nobody
will install an owner-supplied unit." **Alpine's entire referral programme exists to answer exactly
that**, and it includes the inspect-and-start-up option. Buying by the 14th to keep the $347 is now
materially less risky than it looked an hour ago.

## Alpine's Yelp-powered lookup ALREADY RAN FOR 37188 - 50 results, top 10

| # | Company | Yelp reviews | Phone |
|---|---|---|---|
| 1 | Blocker Heating and Cooling | 9 | (629) 333-6833 |
| 2 | Honest Dave's HVAC | 23 | (615) 480-8343 |
| 3 | Mike's Heating & AC | 7 | (615) 822-0280 |
| 4 | **Mike Cross Heating & Cooling** | **48** | (615) 423-7177 |
| 5 | Hiller Plumbing, Heating, Cooling & Electrical | 12 | (615) 851-4066 |
| 6 | Cumberland Cooling | 26 | (615) 576-0742 |
| 7 | Honest Air Heating And Cooling | 4 | (615) 517-2045 |
| 8 | Roger Denton Heating & Cooling | 4 | (615) 672-3335 |
| 9 | GPS Heating and Air Conditioning | 8 | (615) 859-0330 |
| 10 | Star Heating & Air | 8 | (615) 824-3533 |

🔴 **DO NOT READ THIS AS A QUALITY RANKING. It is a YELP-PRESENCE ranking.** Proof: **Daniels
(4.9 / 749 Google reviews) and Petitt (5.0 / 499) do not appear at all** - Yelp is thin in rural
Middle Tennessee, so the strongest local firms are invisible to it while shops with 4 Yelp reviews
rank top-10. **Use it as a source of NAMES to research, never as a shortlist.**

Worth noting: **Roger Denton (1726 Hwy 31 W)** and **Hiller (1617 Hwy 31 W)** are both on the
highway through White House. **Hiller** is a large, well-known Middle-TN chain - deep resources and
certain to be A2L-tooled, but chain pricing. **Mike Cross** carries the most Yelp reviews by 2x.

## Where this leaves the plan

- **Best case:** buy the Blueridge by Mon 14 Sep with the coupon, tick **"inspect and start up after
  I've installed it"** (or "assist with part of the installation"), let Alpine bring 2-3 bidders,
  and keep the friend-labour saving AND the lifetime-heat-exchanger warranty.
- **Run the three researched companies in parallel** (Daniels / Petitt / Derryberry's) - Alpine's
  referral is by mail and slow, and its own list misses the best local firms entirely.

---

# 🟢 QUOTE VISIT 1 — DANIELS, 2026-09-10 AM. Jeff: *"I liked them."* No number yet.

**First of the three. Jeff met them in person; Petitt and Derryberry's follow the same morning.
Everything below is what Daniels said on site, recorded the same session per the standing rule.**

## 1. 🟢 HIS FIX FOR THE 30-YEAR TWIST — no plenum box, and it is sound

Jeff, relaying it: *"coming straight out with the supply line and about 5 ft out from the unit the
return line goes on top of the supply line, therefore the cross is eliminated."*

**Why this is a real fix and not a shortcut:**
- **The cross was never the problem — the DEFORMATION was.** Two ducts crossing in *space* costs
  nothing. Two ducts wrung around each other to *fit* costs static pressure, and doing it at the
  equipment costs the most, because every cubic foot in the house passes through those two collars.
  He converts the second into the first.
- **The SUPPLY is left dead straight off the unit** — full opening area, clean developed run. That
  is the correct duct to protect: it feeds all 7 registers.
- **He gave the geometry problem to the RETURN instead**, which is the right choice *if* the return
  can afford it — see the caution below.
- The unit's openings are **multi-positional, side AND bottom**, so this freedom is real and
  documented: supply side 13.44 × 14.32 / bottom 14.02 × 11.49; return side 13.44 × 17.07 /
  bottom 16.77 × 11.49.

🔴 **THE ONE THING TO WATCH — how the return CLIMBS.** The return is the tightest point in this
whole system (one central return for 1,400 sq ft). Two shallow offsets cost almost nothing; a hard
90 up and a hard 90 back over adds two sharp elbows to the one duct that can least afford them —
that moves the restriction rather than removing it. **Ask him to describe the rise.**

⚠️ **Three smaller checks on the stack:** (a) the return duct is physically LARGER than the supply,
so confirm the vertical room is really there — **a flattened return is a twist by another name**;
(b) both ducts get their own hangers, the return must not rest its weight on the supply over a
5-ft run; (c) insulated both, no metal-to-metal contact — that is an outdoor sweat point.

🟢 **This is consistent with why Daniels ranked #1 on capability before Jeff ever met them** — the
only one of the three advertising in-house sheet-metal fabrication. He is thinking about airflow,
not about selling a box.

## 2. 🔴 SCOPE CHANGE — HE SAYS THE DUCTS ARE GOOD. ONLY THE SUPPLY NEEDS REPLACING.

Jeff: *"He thinks the ducts are good he said the supply line is the only one that could use
replacing the insulation is damp in that one from condensation."*

**This supersedes the "complete new ductwork" assumption that every number in this file was built
on.** Line B (`ductwork materials $787–$987`) and the $1,000–$5,000 contractor-ductwork benchmark
both assumed **7 new branches + a new return**. If the job is now "replace the supply trunk," it is
a materially smaller and cheaper job.

🟢 **JEFF'S CALL, 2026-09-10, AND IT IS THE BETTER METHOD — THIS NOTE REPLACES MINE.**
I wrote that two scopes "break the comparison." **Wrong.** Jeff, verbatim: *"It breaks nothing we
will just look at it and see what they are proposing and adjust based on the proposal. I'm giving
them the option to replace the ductwork that needs it — all we have to do is see how much each one
is charging per foot and go from there."*

**He is right and the method is standard procurement:** let each contractor propose the scope they
actually believe in, then normalise on **$ per linear foot**. That compares the UNIT RATE, so
differing scopes stop mattering — and it also surfaces the contractor who inflates footage.
Forcing all three into one fixed scope would have thrown away the useful information in the
differences. **Do not re-raise "make them all quote the same scope."**

⚠️ **Jeff has 30 years in sales and does his own work. Give him figures and findings, not
procurement coaching.** This entry exists because a session gave him the latter.

### The yardstick his method needs — already researched, in this file

| benchmark (2026) | figure |
|---|---|
| Duct replacement, national | **$25–$55 per linear foot** |
| Duct replacement, Nashville | **$35–$55/lf** (Nashville 10–15% over TN average) |
| Typical single-family duct job | 30–90 lf → **$1,000–$5,000** |
| **R8 flex MATERIALS, 7 in** | **$2.80/ft** ($69.99 per 25 ft roll) |
| R8 flex materials, 8 in | $3.78/ft ($94.55/roll) — **35% jump for one inch** |
| Register boots | $13.98–$16.98 each |

**So the labour + overhead spread is roughly $22–$52 per foot on top of ~$3 of material.** That is
the number a per-foot quote is really quoting.

⚠️ **One thing to confirm per bidder, because it moves $/ft a lot:** does the per-foot price
INCLUDE the takeoff collar, the boot and the register, or are those adders? Same rate with
different inclusions is not the same price.

## 3. 🔴 DAMP INSULATION IS A DEW-POINT PROBLEM. THE DUCT IS THE VICTIM, NOT THE CAUSE.

Insulation is damp because humid air is reaching a surface below the dew point. Replacing the duct
without addressing *why* means **the new duct sweats too.** Causes, most likely first:

1. **Failed vapor jacket** — a torn outer barrier or unsealed seams let humid air inside the
   insulation to the cold core. This genuinely does ruin the duct, and replacement IS the right call.
2. 🔴 **A HUMID CRAWL SPACE — and this collides with the sequencing rule already in this file.**
   Phase 2 is crawl-space encapsulation ($600–$950 DIY materials). This document already says
   **"SEQUENCE: DUCTWORK FIRST, ENCAPSULATION LAST"** because sheet metal and crawling puncture a
   liner already down. **That order still holds — but the humidity is now a REASON, not just a
   nice-to-have.** Encapsulation moved from "Phase 2, someday" to "the thing that protects the duct
   you are about to pay for."
3. **Air leakage** — the 07-25 duct-leak repair measured **441 kWh / 16.8% / ~$41 a month**. Escaping
   cold supply air drives local condensation as well as costing money.
4. **Low airflow / overcooling** — a restricted coil makes supply air colder than design, pushing
   duct surfaces further below dew point. **The twist he is about to remove may itself be feeding
   this**, which would make the two findings the same finding.

🟢 **A FREE DIAGNOSTIC THAT SEPARATES THEM: is the damp LOCALISED or along the whole run?**
Damp only near the unit points at leakage at the collar/transition. Damp along the entire run points
at ambient crawl-space humidity. That one observation decides whether encapsulation is required or
merely sensible — and it costs nothing but a look.

⚠️ **Look at whether it is wet-and-clean or wet-and-growing.** Insulation damp long enough grows
mould, and that changes both the urgency and whether that material should stay in the crawl space at
all. Jeff's own eyes on it, his call.

## 4. What this does to the rest of the plan

- **The RETURN is now staying.** So the return's own limits stop being theoretical: this file's
  warning still stands — *"the return is the tightest point in the whole system… check the GRILLE
  FREE AREA, not just the duct. A starved return makes the equipment work harder no matter how good
  the supply side is."*
- **Static pressure before and after matters MORE now, not less** — it is the only thing that will
  show whether keeping the old return was the right call. It is also an **ACCA Quality Installation
  requirement and therefore a CONDITION of the Blueridge warranty**, not a favour.
- **Nothing here changes the unit choice.** 2.5 ton / 54,000 BTU Blueridge BRP7GE1330E054P-01A,
  $3,123 net, coupon dies **Mon 14 Sep**.

## 5. 🔵 THE QUESTION TO PUT TO PETITT AND DERRYBERRY'S

> *"Daniels says he can eliminate the cross by running the supply straight out of the unit and
> crossing the return over the top of it about 5 ft out, with no plenum box. He also says the
> ductwork is sound apart from the supply, which has damp insulation. How would you do it, and what
> duct scope is in your number?"*

**That single question makes all three quotes comparable and reveals how each one thinks.**

---

# 💵 QUOTE #1 IN — DANIELS, received 2026-09-10 10:54 AM. THE FIRST REAL NUMBERS.

**Source:** email from `deliveries@payzer.com`, attachment `PC-1211-1.pdf`, and the live Payzer
proposal pages behind "Review Proposal Options". Job **#1211**, technician **Ryan Mlckovsky**,
issue date 09/10/2026. Read in full; **nothing was accepted, declined or signed.**

## The numbers

| | Goodman (prop 1211-1) | Carrier (prop 1211-2) |
|---|---|---|
| **Price** | **$7,800.00** | **$8,200.00** |
| Extended warranty (optional) | **+$800.00** | **+$800.00** |
| **All-in with labour cover** | **$8,600** | **$9,000** |

**Extended warranty = "all labor and freon for 10 years."**

## Scope — IDENTICAL wording on both proposals, verbatim

```
2.5-ton gas package unit
Includes all material needed to complete install with labor and hauling away all trash
New thermostat
New portable concrete pad (if needed)
New square to rounds
New Flashing
New 16" flex for return
New 16" flex for supply
New 16"-14" reducer for supply pipe
Unit comes with a 10-year manufacture parts warranty
CFM for 2.5 tons is around 875
```

## 🟢 What this confirms

- **The twist fix IS priced in.** "New square to rounds" + new 16" flex on **both** supply and
  return is the connection work Ryan described on site — supply straight out, return crossing over
  ~5 ft out. It is not an extra.
- **The damp supply line is covered** by the new 16" supply flex.
- **The pad question is handled** — "new portable concrete pad (if needed)", which matters because
  a Goodman cabinet is **51" deep** against the old Nordyne's 47.5".
- **$7,800–$8,200 lands at the BOTTOM of the $8,000–$13,000 turnkey benchmark** in this file, and
  that benchmark assumed complete duct replacement. Good number.

## 🔴 What is NOT in it — ask before comparing to anyone else

1. **It is FLEX, not fabricated sheet metal.** This document's plan specified **fabricated
   rectangular plenums**; the quote is square-to-round adapters plus 16" flex. Cheaper and faster,
   and legitimate — but **flex carries more friction than metal at the same diameter**, so it is a
   real difference in method, not just wording.
2. 🔴 **THE 16"→14" REDUCER IS THE TIGHTEST POINT IN THE QUOTE.** Using the proposal's own
   **875 CFM**:

   | duct | area | velocity at 875 CFM |
   |---|---|---|
   | 16" round | 1.396 sq ft | **627 FPM** — comfortable |
   | **14" round** | 1.069 sq ft | **818 FPM** — inside the normal 700–900 band, upper-middle |

   818 FPM is acceptable, not generous — and it is **flex**, which runs higher friction than metal
   at the same velocity. The reducer exists to meet the existing supply pipe. **Ask why 14" rather
   than carrying 16" further.**
3. **No Manual J, Manual S or Manual D. No static pressure before/after. No mention of the return
   grille free area.** Those are **ANSI/ACCA 5 QI items and therefore CONDITIONS of the
   manufacturer warranty** — not optional extras. Not in this quote.
4. **NO MODEL NUMBERS on either option.** This matters more than it looks — see below.
5. **Electrical and gas are not itemised.** The breaker must come DOWN from the existing **40 A**
   (Goodman 2.5 T max breaker is 30 A; the Blueridge is 25 A). "All material needed" may cover it;
   confirm. Permits not mentioned.

## 🔴 THE MISSING MODEL NUMBERS — the one thing to get before comparing

Everything already researched in this file turns on which model:

- **HEAT OUTPUT.** The old Nordyne is **72,000 BTU** heat. Jeff approved dropping to **54,000**
  (*"The 54,000 BTU heat will be fine if the price is right"*). The Goodman 2.5-ton this file
  priced carries **40,000 BTU** input / 32,000 output — **a bigger drop than he agreed to**. The
  60,000 BTU Goodman was **out of stock** on 08-31. **Ask which one.**
- **REFRIGERANT.** Goodman is **R-32 (GWP 675)**; Carrier went **R-454B (GWP 466)**. Jeff,
  2026-09-09: *"Yes I want the most recent refrigerant."* Neither is newer — same A2L generation —
  but **R-454B sits further from the next AIM Act threshold**, so on Jeff's own stated preference
  the **Carrier** is the answer, and the $400 buys it.
- **HEAT EXCHANGER WARRANTY.** Goodman = **20 years**. Carrier's needs checking. The Blueridge
  owner-supply path was **LIFETIME**.

## The apples-to-apples number for Petitt and Derryberry's

**Petitt advertises 10-year parts AND LABOUR included.** The manufacturer covers **parts only,
never labour** — which is exactly what Daniels' $800 add-on is selling. So the comparable figures
are **$8,600 (Goodman) / $9,000 (Carrier)**, not $7,800 / $8,200.

## Per-foot — Jeff's comparison method

This quote is a **lump sum with no linear footage stated**, so it yields no $/ft on its own. The
duct content is the **connection at the unit** (square-to-rounds, 16" flex both ways, one reducer),
not house ductwork. **To get a rate out of Daniels, ask what he would charge per linear foot to
replace branch runs** — that is the number that compares against the other two.

⚠️ **Live proposal system.** The Payzer pages carry **Accept Proposal / Decline Proposal** with an
electronic signature block. **Nothing was clicked.** Accepting is Jeff's, in his own hands.

---

# 💵 QUOTE #2 IN — DERRYBERRY'S, 2026-09-10. Written sheet, Comfort Specialist **Charlie**.

`212 N. Water Ave, Gallatin TN 37066 · (615) 452-8121` · dated **9-10-26** · Tonnage **2.5**,
**Gas**, **Change Out**, **Pkg**. So the White-House service-area doubt from the 09-09 research is
answered — they came.

## The two tiers offered (GOLD/multi-stage and MINI SPLITS left blank)

| | **BRONZE — Standard** | **SILVER — High Efficiency** |
|---|---|---|
| Equipment | **American Standard** | **American Standard** |
| Retail | **$8,958** | **$12,100** |
| Efficiency | **13.4 SEER** | **15.2 SEER**, ENERGY STAR ✓ |
| Staging | single | **2-stage compressor + 2-stage gas** |
| TVA rebate | — | **−$250** |
| C.O.D. discount | −$200 | −$200 |
| Senior Citizen | −$200 | −$200 |
| **NET** | **$8,558** | **$11,450** |
| Parts | 10 yr | 10 yr |
| **Labor** | **1 yr** | **3 yr** |
| **Heat exchanger** | **10 yr** | **20 yr** |
| Compressor | 10 yr | **12 yr** |

**Extra labour warranty:** *"to max at 10 yrs + $60/yr"* — and Charlie did the arithmetic on the
sheet himself: **`13 — 9 × 60 = 540`** (Bronze, 1 yr → 10 yr) and **`15 — 7 × 60 = 420`**
(Silver, 3 yr → 10 yr).

| with labour taken to 10 years | |
|---|---|
| Bronze | **$9,098** |
| Silver | **$11,870** |

## 🔴 THE DUCT NUMBER — the one Daniels never gave

| | |
|---|---|
| **Duct REPLACEMENT** | **$7,800** — *"Replace Main Supply · Return · Leads · Boots · Registers, using R8 flex duct"* |
| TVA rebate on ducts | **−$300** → **net $7,500** |
| Duct REPAIR (separate) | **$350** — *"add a lead to garage"* |

🔴 **DERRYBERRY AND DANIELS DISAGREE ABOUT THE DUCTWORK, AND IT IS WORTH $7,500.**
Daniels: *"the ducts are good, the supply is the only one that could use replacing."*
Derryberry: a complete change-out of supply, return, leads, boots and registers.
**Both cannot be right.** This is exactly the fork Jeff's per-foot method exists to resolve.

⚠️ **NO LINEAR FOOTAGE ON THE SHEET, so no $/ft can be computed.** Against this file's benchmark
($25–55/lf national, $35–55/lf Nashville) $7,500 implies **~135–215 linear feet** to land in range.
**Ask Charlie for the footage** — that single number decides whether $7,800 is fair or fat.

## What IS and IS NOT in the base price — read off the checkboxes

**Included (ticked):** remove old system and haul away · **level ground and install a NEW PAD**
(not "if needed") · install new system to local code · owners manuals · site left clean ·
**reconnect electrical to new unit** · **reconnect existing gas service** · reconnect to existing
ductwork · add new duct runs · **install NEW thermostat**

🔴 **NOT ticked — and these cost money:**
- **"Provide NEW electrical for new unit" is UNCHECKED.** Only *reconnect* is included. The
  **40 A breaker has to come DOWN** for any of these units — that is not in this price.
- **VENTING: neither box ticked.** Not "reconnect flue to existing" nor "install new venting."
  On a gas package unit that is not a detail to leave blank. **Ask.**
- No Manual J / S / D, no static pressure, no return-grille assessment — same gap as Daniels.
- **No model numbers, and no refrigerant named.** Same gap as Daniels.

## ⚠️ A COMMERCIAL TERM DANIELS DOES NOT HAVE

Printed at the foot of the sheet: **"Derryberry's reserves the right to charge a $300 Re-Stock
Permit fee on all cancelled orders."** Signing this is not a free option. Daniels' Payzer proposal
carries an Accept/Decline with no stated cancellation fee.

## Where the three now stand — equal terms (unit only, 10-yr labour, existing ducts)

| | net | heat exchanger |
|---|---|---|
| Daniels **Goodman** | **$8,600** | 20 yr, **aluminized** |
| Daniels **Carrier** | **$9,000** | **LIFETIME, stainless** |
| Derryberry **Bronze** (Am. Std) | **$9,098** | **10 yr** |
| Derryberry **Silver** (Am. Std) | **$11,870** | 20 yr |

**Three of the four are within $500 of each other, so price is not the decision — warranty and
machine are.** On that basis the Bronze is the weakest of the group: same money as the Daniels
Carrier for a **10-year** heat exchanger instead of a lifetime one.

**The Silver is the only genuinely different machine on offer** — 15.2 SEER2, **two-stage
compressor and two-stage gas**, 20-yr HX, 12-yr compressor, Energy Star (which is what earns the
$250 TVA rebate). It is **$2,870 over the Daniels Carrier**.

ℹ️ **American Standard and Trane are the same manufacturer** — same equipment, different badge.
Not a mark against it; worth knowing when comparing brands.

## Still open

1. **Linear footage** on the $7,800 duct replacement.
2. **Model numbers + refrigerant** on both tiers (American Standard/Trane went **R-454B**).
3. **Who is right about the ducts** — Daniels' "supply only" vs Derryberry's full change-out.
4. **Petitt has not quoted yet.**

---

# 🔄 DANIELS REVISED PROPOSAL — 2026-09-10 PM. **THE MODEL NUMBERS ARE IN.**

Same job #1211, same PC-1211-1, same prices. Two lines changed and one spec went missing.

## 🟢 THE MODELS — and they settle both open questions

| | Goodman **P-1211-1** | Carrier **P-1211-2** |
|---|---|---|
| **Model** | **GPGM33006031** *(sheet prints `GGPGM33006031` — extra G, confirm before ordering)* | **48NL-B300603** |
| Price | $7,800 | $8,200 |
| Cooling | 2.5 ton | 2.5 ton |
| **Gas heat** | **60,000 BTU** | **60,000 BTU** |
| **Efficiency** | **13.4 SEER2** (GPGM3 line) | **13.4 SEER2**, 81% AFUE |
| Refrigerant | **R-32**, GWP **675** | **R-454B** ("Puron Advance"), GWP **466** |
| **Heat exchanger** | **aluminized steel — 20 yr** | **stainless steel — LIFETIME** |
| Registration window | 60 days | 90 days |
| Parts | 10 yr | 10 yr, **or** 5 yr parts + 3 yr labour |

### ✅ Both worries from this morning are cleared

1. **HEAT OUTPUT IS RIGHT.** I flagged that the Goodman 2.5-ton priced in this file was the
   **40,000 BTU** `GPGM33004031`, a bigger drop than Jeff approved. **It is not that unit** — it is
   the **60,000 BTU** `…006031`, against the old Nordyne's 72,000 and the 54,000 Jeff said was fine.
   ⚠️ *That model read **OUT OF STOCK** at Alpine on 08-31. Daniels sources through a distributor,
   not Alpine, so that is not necessarily a problem — but ask about lead time.*
2. **THE EFFICIENCY TIE-BREAK IS SETTLED.** I said the call would flip if Daniels were quoting a
   15.2 SEER2 Goodman against a 13.4 Carrier. **He is not.** `GPGM3` is the 13.4 line (`GPGM5` is
   the 15.2). **Both units are 13.4 SEER2, both 60,000 BTU, both 2.5 ton, same installer, same
   scope, same $800 warranty option.**

🟢 **So the $400 is now a clean, like-for-like premium and it buys exactly three things:**
**a lifetime stainless heat exchanger instead of a 20-year aluminized one**, **R-454B instead of
R-32**, and **30 extra days to register the warranty.** Nothing is traded away for it.

## What changed in the revision

**ADDED:** *"New electrical whip for high voltage wires."* Good — that is the whip line item, now
explicitly included.

🔴 **REMOVED — and this is a spec that got LESS precise:**

| first version | revised version |
|---|---|
| "New **16"** flex for return" | "New flex for return" |
| "New **16"** flex for supply" | "New flex for supply" |
| "New **16"-14" reducer** for supply pipe" | **gone entirely** |
| "CFM for 2.5 tons is around 875" | **gone** |

**Get the sizes put back in writing.** The 16→14 reducer was the tightest point in the whole quote
(818 FPM against 627 FPM at 16"), and a quote that no longer names a diameter cannot be held to one.

⚠️ **Still not in either version: the BREAKER.** The Goodman GPGM3 max fuse/breaker is **30 A** and
the existing is **40 A** — it has to come down for either unit. The whip is now included; the
breaker is not mentioned. Also still absent: Manual J / S / D and static pressure, which are ACCA
QI items and therefore warranty conditions.

## Where all five options stand — equal terms, unit only, 10-yr labour, existing ducts

| | net | SEER2 | heat | heat exchanger |
|---|---|---|---|---|
| Daniels **Goodman** GPGM33006031 | **$8,600** | 13.4 | 60k | 20 yr aluminized |
| 🟢 Daniels **Carrier** 48NL-B300603 | **$9,000** | 13.4 | 60k | **LIFETIME stainless** |
| Derryberry **Bronze** (Am. Std) | **$9,098** | 13.4 | ? | **10 yr** |
| Derryberry **Silver** (Am. Std) | **$11,870** | **15.2** | ? | 20 yr, **2-stage** |

🟢 **Of the three 13.4 SEER2 options the Daniels Carrier is the cheapest AND the only one with a
lifetime heat exchanger.** The Derryberry Bronze is $98 more for a 10-year heat exchanger.

**The Silver remains the only genuinely different machine** — 15.2 SEER2, two-stage compressor and
two-stage gas — at **$2,870 over the Carrier**.

**Unchanged and still the fork worth the most money:** Daniels says the ducts are sound apart from
the supply; Derryberry quotes **$7,800** to replace the lot. Nobody has given a linear footage yet.

---

# ⚖️ HEAD TO HEAD — FINISHED JOB, NOT UNIT LINE. Jeff's framing, 2026-09-10 4:02 PM

Jeff: *"Daniels' quote includes fixing the twist in the ductwork so that is basically a turnkey
finish with a Carrier unit — cause that's the one I'll go with — versus the complete ductwork
change out that Derryberry was insistent on doing plus the unit. That's the way I want you to
look at it."*

**🟢 CARRIER IS JEFF'S PICK. Compare total delivered cost.**

## The two finished jobs

| | **DANIELS + Carrier** | **DERRYBERRY Bronze** | **DERRYBERRY Silver** |
|---|---|---|---|
| Unit, net of discounts | $8,200 | $8,558 | $11,450 |
| Labour to 10 years | +$800 | +$540 | +$420 |
| Ductwork | **included** | +$7,500 *(after −$300 TVA)* | +$7,500 |
| **TOTAL DELIVERED** | **$9,000** | **$16,598** | **$19,370** |
| | | **+$7,598** | **+$10,370** |

**Derryberry is $7,600 to $10,400 more for the finished job — 1.8× to 2.2× the Daniels price.**

## What is actually in Daniels' "turnkey"

New square-to-rounds · new flashing · **new flex for supply AND return** · new electrical whip ·
new thermostat · new pad if needed · haul-away · all material and labour. **That is the twist fix**
— supply straight out of the unit, return crossing over it ~5 ft out, which is what Ryan described
on site. Existing branch runs, boots and registers stay.

## What Derryberry's extra money buys — and the Bronze answer is uncomfortable

**Bronze, +$7,598:** buys a complete duct change-out (main supply, return, leads, boots, registers,
R8 flex) — **and a WORSE unit.** Same 13.4 SEER2, but a **10-year heat exchanger against the
Carrier's LIFETIME**. So on the Bronze, the extra $7,598 buys ductwork *and takes warranty away.*

**Silver, +$10,370:** buys the ductwork **plus a genuinely better machine** — 15.2 SEER2, two-stage
compressor, two-stage gas, 20-yr HX, 12-yr compressor. That is a real upgrade, honestly priced.
It is not a rip-off; it is simply a different, larger job.

## 🔴 So the whole decision reduces to ONE question

**Is a complete duct change-out worth $7,500 on this house?**

**Against it:**
- **Daniels put eyes on the ducts and said no** — sound apart from the supply, whose insulation is
  damp. His new supply flex addresses exactly that.
- The measurable precedent cuts the other way on value: the **07-25 duct-leak repair** saved
  **441 kWh / 16.8% / ~$41 a month** of cooling. At $41/month, **$7,500 is a 15-year payback** —
  and that $41 came from sealing a *leak*, not from replacing duct that was already sound.
  **Replacing healthy duct saves nothing.**
- The connection work at the unit is the hard-to-retrofit part, and **that is the part Daniels is
  doing.** Branch runs can be replaced later, one at a time, if they ever prove to be the problem.
- **$7,598 saved covers the crawl-space encapsulation ($600–950 in DIY materials) with ~$6,600
  left over** — and encapsulation attacks the *cause* of the damp insulation, which neither
  contractor's ductwork does.

**For it:**
- The branch runs are as old as the house. If they are leaking too, a new unit feeds tired duct.
- Derryberry would be doing it once, with the unit out, which is the cheapest time to do it.

## 🟢 THE TEST THAT SETTLES IT WITHOUT GUESSING

**Static pressure, measured before and after.** If Daniels reads it and the numbers come back
healthy, the ducts were fine and Derryberry's $7,500 would have been spent on nothing. If they come
back bad, Jeff spends the money *then*, knowing why. It is also an **ACCA Quality Installation item
and therefore a warranty condition** — so it is owed, not a favour.

⚠️ **NO LINEAR FOOTAGE from Derryberry**, so $7,800 still cannot be checked against the
**$35–55/lf Nashville** benchmark. It implies roughly **135–215 ft** to land in range.

## 🔴 THE ONE THING TO NAIL DOWN BEFORE SIGNING DANIELS

**The revised proposal DELETED the duct sizes.** The first version said *"New **16"** flex for
supply / return"* and *"**16"–14" reducer**"* and *"CFM around 875."* The revision says only
*"new flex."* **All three specs are gone.**

The twist fix is the entire reason this counts as turnkey. **Get the diameters back in writing** —
a quote that names no diameter cannot be held to one, and the 16→14 reducer was already the
tightest point in the job (818 FPM against 627 FPM at 16").

**Also still missing from Daniels:** the **40 A → 30 A breaker** change (the whip is now included,
the breaker is not) and Manual J / S / D.

## Verdict on Jeff's framing

**Daniels + Carrier at $9,000 delivered is the strongest value on the table** — the only lifetime
heat exchanger, the lower-GWP refrigerant, and $7,598 cheaper than the nearest complete-duct
alternative, which happens to carry the worst warranty of the four.

**The Derryberry Silver is the only proposal that is better rather than merely different**, and it
costs $10,370 more. Whether two-stage comfort plus new ductwork is worth that is Jeff's call, not a
technical one.
