# A/C INSTALL — OVERSIGHT PACK
## Goodlettsville Heating & Cooling · Wednesday 2026-10-21 + Thursday 2026-10-22

**Jeff, 2026-10-13 11:13 PM:** *"the new Tempstar and duct work is going in Wednesday and
Thursday of next week Goodletville heating and cooling is doing the job… pull all the
information on the unit with the ductwork so we can manage the whole installation to make sure
it is done correctly."*

🔴 **SUPERSEDES the old note that Jeff's pick was the Carrier 48NL.** The chosen bid is
**Goodlettsville quote #1820**, a **Tempstar**. Anything citing the Carrier as "the unit I am
getting" is out of date.

---

## 1. THE CONTRACT — what was actually bought

**Goodlettsville Heating & Cooling** · 601 Lucien Dr, Goodlettsville TN 37072
**(615) 479-0886** · bill.ghandc@gmail.com · **TN State Lic. #72333**
**Quote #1820, dated 2026-09-17** · job site 301 S Aztec Dr, White House TN 37188

| Line | Amount |
|---|---|
| Install **Tempstar PGB430060K000B**, 2.5 ton, 14 SEER gas package unit, 60K BTU. Labour, **new square-to-rounds on supply AND return**, all small parts. Includes **new thermostat wire**, installing **customer-supplied thermostat** and **customer-supplied UV light**. | **$7,960.00** |
| Replace **16" return duct** to run down the other side of the supply duct to remove the twist, **(2) sheet-metal 90s**, **upsize existing runs per the drawing**, **add a run to the garage**. | **$1,800.00** |
| Permit — not required, like-for-like gas-to-gas per City of White House codes | $0.00 |
| **TOTAL** | **$9,760.00** |

**Priced options NOT in that total:** 18" return **+$400** · 2-yr labour warranty +$550 ·
5-yr +$864 · 10-yr +$1,594 (extended labour excludes refrigeration).

**Warranty as sold:** 3-year no-hassle limited · **lifetime heat exchanger** ·
**10-year parts ONLY IF REGISTERED ONLINE** · 1 year labour included.

**Payment:** over $2,500 by credit card adds **3%** — that is **≈$293 on $9,760**. Pay by
check/ACH unless the card earns more than that.

---

## 2. 🔴 DECIDE BEFORE WEDNESDAY — four things, and only Jeff can call them

### 2a. 16" return or 18" (+$400) — the one that affects every running hour
Rev D did the arithmetic: at the 995 CFM design airflow a **16" return runs ≈713 ft/min, which
the drawing itself calls "the ACCA Manual D maximum for flex."** **18" runs ≈563 ft/min.**

Buying the 16" means running **at** the published ceiling with **zero margin** — and the things
that eat margin all happen later: a loaded filter, a sag, a kink, a crushed bend behind a box.
High return velocity shows up as blower noise, higher static, and less capacity than the 2.5 tons
on the invoice. **$400 is 4% of the job, paid once, on the one part nobody opens up again.**
**Recommendation: take the 18".** It is Jeff's money and his call — but this is the upgrade worth
buying, and the extended *labour* warranties are not.

### 2b. Extended labour warranty — probably no
1 year labour is included and parts are 10 years **if registered**. $864 for 5-year labour on a
$9,760 job is 9% for years 2-5 only, and it **excludes refrigeration costs**, which is where the
expensive labour actually is. Skip unless Jeff wants the peace of mind.

### 2c. The quote has EXPIRED — get the price reconfirmed in writing
It reads **"Valid for 15 Days"** and is dated **2026-09-17**, so it lapsed **2026-10-02**.
The job is going ahead at that number by agreement, but **get one line in writing** (text or
email) confirming **$9,760 holds, plus the 18" if taken.** This is the single cheapest piece of
protection in this document.

### 2d. Customer-supplied items must be ON SITE Wednesday morning
The quote makes both of these **Jeff's** to provide:
- 🔴 **The thermostat.** The existing one is the **LUX CS1-DD-FB**. If it is being reused, say
  so; if a new one is going in, it has to be in hand Wednesday.
- 🔴 **The UV light.** Does Jeff have it? Nothing in the record says it was bought. **If it is not
  on site, that line of the contract cannot be performed.**

---

## 3. 🏠 HOUSE-SIDE ACTIONS — these are mine, and they bite if missed

### 3a. The SONOFF relay is wired into the OLD unit's control circuit
`switch.ac_relay` is a **SONOFF MINI-D** commissioned into the A/C control wiring. The installer
is **running brand-new thermostat wire**, so that rig is in the demolition path.

🔴 **Decide before they arrive: remove it beforehand and re-install after, or retire it.** Left in
place it gets cut out, binned, or reconnected wrong by someone who has no idea it is there.
Jeff wired it and knows exactly where it sits — this is a five-minute job on Tuesday night, and a
lost device plus a confused installer if it is skipped.

### 3b. Three automations will fight the install and storm alerts
All currently **ON**, all pointed at hardware that is about to be disconnected:

| automation | what it will do on install day |
|---|---|
| `automation.hcc_ac_relay_thermostat` | keeps switching `switch.ac_relay` off the indoor temperature |
| `automation.hcc_a_c_relay_offline_watchdog_ha_cannot_control_the_a_c` | **fires the moment the relay loses power** — then keeps firing |
| `automation.hcc_ac_master_switch` | master on/off, same dead hardware |

**Turn all three OFF Wednesday morning and back ON only after the new unit is running and the
relay's fate is decided.** Otherwise Jeff's phone alarms all day about a fault that is just the
installer doing his job — and that is exactly the alert fatigue that already cost this house 48
hours of dead cameras.

✅ **Already done 2026-10-13:** deleted `automation.hcc_ac_bid_deadline`, a leftover from the
bidding whose own name said *"delete after"* — and whose trigger was a **daily** 16:00, not the
one-off it claimed to be.

### 3c. After the swap
- `switch.ac_relay`, `input_boolean.air_conditioner` and the A/C card in the app all need
  re-pointing or retiring depending on 3a.
- The new unit is **gas/electric**, same as the old — so the gas-meter side of the utility
  tracking is unchanged.

---

## 4. ✅ SCOPE CHECKLIST — tick each one on site (from Rev D, 2026-09-21)

Design airflow **995 CFM**. Print this page and walk it.

| # | Required work | Done | Notes |
|---|---|---|---|
| 1 | **New square-to-round transitions on BOTH supply and return** at the unit. **The existing twisted connections REMOVED.** | ☐ | this is the twist the whole return re-route exists to kill |
| 2 | **New return**: insulated flex straight back from the unit, **sheet-metal 90 across the supply trunk**, **second sheet-metal 90 into the filter grille** | ☐ | 16" or 18" per §2a |
| 3 | **Existing 20×25 return filter grille STAYS** — 287 ft/min, already under the 300 target. **Nothing to price here.** | ☐ | refuse any charge to change it |
| 4 | **6" → 8" upgrades: Dining room, Master bedroom, Living room** — each with a NEW saddle tap, balancing damper and boot | ☐ | 3 rooms, 3 dampers |
| 5 | **New 7" garage run**: saddle tap **on the SIDE of the 12" trunk, not off the trunk end**; core through brick and **seal**; up the garage wall to a boot + **brown register**; **balancing damper AT THE REGISTER, inside the garage** | ☐ | damper placement is deliberate — so it can be shut in winter without entering the crawl space |
| 6 | **Existing duct STAYS**: trunk 16"→14"→12", Master bath 6", Guest bedroom 7", Office 6", Guest bath 6". Inspect, re-seal, re-strap | ☐ | see the trap in §5 |
| 7 | **All flex fully extended** — no kinks, sags or compression; supported per manufacturer; **every joint mastic or UL 181 tape**; **insulation R-value stated** | ☐ | ask for the R-value |
| 8 | **New 18 AWG thermostat wire WITH C-wire** from unit to thermostat; owner's thermostat installed | ☐ | no power-stealing thermostat |
| 9 | **Start-up readings RECORDED ON THE INVOICE** (see §6) | ☐ | the quote already promises this |
| 10 | **Old equipment and all debris removed** | ☐ | |

---

## 5. ⚠️ THE TWO TRAPS TO WATCH FOR ON THE DAY

**1. "Your ductwork is wet, it all needs replacing."** Rev D pre-empts this in writing:
> *"Replace a run only if it is physically damaged — **not** for damp insulation. In a Tennessee
> summer every one of them is damp from condensation; once it is sealed it dries out. Do not
> quote duct replacement on that basis."*

Damp ≠ damaged. **Physical damage only.** Anything else is a change order Jeff has already
declined in advance.

**2. The permit.** The quote says no permit is needed because it is like-for-like gas-to-gas, per
White House codes — **and it also says "If permit required there will be an additional charge."**
Both sentences are in the same document. It is in writing that they believe none is needed, so
any permit charge appearing later is theirs to justify.

---

## 6. 🔬 ACCEPTANCE TEST — how we prove it was done right

**The contract already obliges them:** *"Will record startup supply and return static pressure
and airflow reading on invoice."* **Do not let the truck leave without those numbers written
down.** This is the entire reason the duct scope exists — a 2.5 ton unit on a strangled duct
system delivers less than 2.5 tons, and static pressure is the only thing that shows it.

| Measurement | What to get | Judge it against |
|---|---|---|
| **Supply static** | in. w.c. | — |
| **Return static** | in. w.c. | — |
| **Total external static (TESP)** | supply + return | 🔴 **the max on the unit's OWN installation manual / data plate — read it on day one.** This class of equipment is commonly rated **0.5" w.c.**, but take it off the paperwork in the box, not from memory |
| **Blower airflow** | CFM, measured | **995 CFM design**; 2.5 tons ≈ 1,000 CFM at 400 CFM/ton. Within ~10% is fine |
| **Temperature split (ΔT)** | return air °F − supply air °F, cooling | **18–22 °F** typical. A good cross-check that costs nothing |
| **Dampers balanced** | all 4 new dampers set | the 3 room upgrades + the garage |
| **Refrigerant leak-detection system tested** | where equipped | Rev D item 9 |

🔴 **If TESP comes in over the unit's rated maximum, the job is NOT finished** — that is the
measurement the whole $1,800 duct line was bought to fix, and it is far cheaper to resolve while
the crew and their tools are still in the yard.

---

## 7. 📋 AFTER THEY LEAVE — do not skip these

- 🔴 **REGISTER THE UNIT ONLINE.** The 10-year parts warranty **exists only if registered**.
  Unregistered it drops to the base term. Needs the **model + serial off the data plate** — so
  **photograph the data plate before they close anything up.** This is worth thousands and takes
  ten minutes.
- **Photograph everything before it is buried:** the new square-to-rounds, both sheet-metal 90s,
  the garage saddle tap, the brick penetration seal, every new damper.
- **Keep the invoice with the static/airflow numbers on it** — file it next to this document.
- **Re-enable the three HA automations** (§3b) once the relay question is settled.
- Record the actual final price paid, and whether the 18" was taken.

---

## 8. SOURCES — every number above came from one of these

| Document | Location |
|---|---|
| **Quote #1820 — THE CHOSEN BID** | `iCloudDrive\HCC AC Quotes\Quote - Goodlettsville #1820 09-17 - THE CHOSEN BID.pdf` |
| **Duct layout + scope of work, Rev D** | `iCloudDrive\HCC AC Quotes\Duct layout + scope of work - Rev D 09-21.pdf` |
| Duct drawing, 995 CFM | `iCloudDrive\HCC AC Quotes\AC duct drawing 995cfm.jpg` |
| Tempstar PGB4 vs Carrier 48NL | `iCloudDrive\HCC AC Quotes\Tempstar PGB4 vs Carrier 48NL - comparison.pdf` |
| Garage vent — what it will do | `iCloudDrive\HCC AC Quotes\Garage vent - what it will do.md` |
| Duct materials pricing | `docs/hvac/duct_materials_pricing_2026-09-23.md` |
| Full bid history (75 dated rows) | `docs/hvac/BID_TRACKER.md` |

⚠️ **The PGB430060K000B blower performance table is NOT reproduced here.** A web search on
2026-10-13 did not return the manufacturer's data for that exact model, and **a made-up static
pressure limit is worse than none** — it would be used to sign off a job. **Take the rated
maximum external static off the installation manual in the box on Wednesday** and write it into
§6 then.
