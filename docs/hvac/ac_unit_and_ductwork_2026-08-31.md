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
