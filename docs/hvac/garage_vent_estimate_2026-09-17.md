# The 7" garage vent — what it will actually do

Thu 2026-09-17 4:15 PM. Prepared for Jeff Loewen, 301 S Aztec Dr.

## The garage, from the record
- 12 x 24 = **288 sq ft**, 10 ft ceiling = 2,880 cu ft (Jeff, 2026-09-01 + 2026-09-17)
- Uninsulated walls; **garage door IS insulated** (Jeff, 2026-09-17 4:16 PM); unconditioned on the other side
- **Measured by Jeff:** on a hot day it sits at **94 F with no AC**; the LG LP0818WNR portable (5,500 Btu/h SACC) holds it at **about 80 F**

That measurement is the calibration. 5,500 Btu/h buys 14 F, so the garage leaks
heat back in at roughly **390 Btu/h for every degree** it is held below 94 F. No
insulation guessing needed - that is the number the garage itself reports.

## What the 7" run delivers
- A 7" flex branch on a balanced 995 CFM system carries **about 125 CFM** (Manual D range 110-150)
- Supply air off the coil is ~55 F
- Cooling delivered = 1.08 x 125 x (garage temp - 55)

## Equilibrium (heat leaking in = heat the vent takes out)

| Setup | Garage settles at | Vent removes |
|---|---|---|
| Nothing (today, no AC) | **94 F** | - |
| LG portable only (today's habit) | **~80 F** (measured) | - |
| **7" vent only, damper open** | **~84 F** (82-85 depending on actual CFM) | ~3,900 Btu/h |
| **7" vent + the LG together** | **~73-74 F** | ~2,500 Btu/h from the vent, 5,500 from the LG |

So: **the vent alone knocks about 10 F off the garage - a little less than the LG
does by itself. Together they get the garage into the low-to-mid 70s**, which the
LG has never been able to do alone. Humidity drops as well, which is most of what
makes 84 feel better than 94.

## What it costs the house
- ~125 CFM is one-eighth of the unit's air, about **3,500-4,000 Btu/h of the 28,800**
  the unit makes (~13%). The 2.5-ton was sized for the 1,400 sq ft house, not the garage.
- On most days the house will not notice. On the worst afternoons, if the house is
  struggling, **close the damper at the register** and the full 995 CFM goes back
  inside. Winter: same damper, closed.
- The garage has no return, so the 125 CFM pressurises it and leaks out around the
  door - that is the right direction (garage air pushed out, not pulled in).

## If the garage attic gets insulated (asked 4:19 PM)

Where the 390 Btu/h-per-degree comes from on a hot afternoon, sized to match the
94 F / 80 F measurement (attic runs ~120 F+ over an uninsulated ceiling, so the ceiling
sees a 40 F difference while the walls see 14 F):

| Path | Share of the heat coming in |
|---|---|
| **Ceiling from the hot attic (288 sq ft, uninsulated)** | **~2/3** |
| Uninsulated walls | ~1/5 |
| Air leakage | ~1/10 |
| Insulated door | ~1% |

**R-38 over the garage ceiling cuts the ceiling path by about 90%**, so the garage's
overall leak drops from ~390 to **~145 Btu/h per degree**, and the garage without any
AC would sit closer to ~90 F instead of 94.

| Setup, WITH the attic insulated | Garage settles at |
|---|---|
| Nothing | ~90 F |
| **7" vent alone** | **~74-75 F** (was ~84) |
| LG alone | reaches its setpoint and CYCLES for the first time - low-to-mid 70s |
| Vent + LG | wherever you set it; the LG mostly idles |

So attic insulation is worth **about 10 F on top of the vent** - it roughly doubles
what the vent does, and it is the difference between "takes the edge off" and "a
room you can work in all afternoon".

**Cost, DIY blown-in (verified 09-17):** 288 sq ft at R-38 is about **10 bags** of
GreenFiber-type cellulose at $11-15 a bag = **$120-150 in material**; Home Depot /
Lowe's lend the blower free with 20+ bags (10 at some stores), otherwise a day's
rental. Call it **$150-250 all in, an afternoon's work**. Contractor-installed runs
$1.80-3.50/sq ft = $520-1,000 for this ceiling.
Sources: [Angi](https://www.angi.com/articles/blown-in-insulation-cost.htm),
[HomeGuide](https://homeguide.com/costs/blown-in-insulation-cost),
[InsulationRValues.com](https://www.insulationrvalues.com/attic-insulation-cost).
**Jeff, 4:25 PM: it is OPEN RAFTERS - no ceiling.** So blown-in is off the table
unless a ceiling gets built. That changes the options (roof area is bigger than
the floor: ~300-330 sq ft of rafter bay for a 12 ft span at 4/12-6/12):

| Option | Cost (verified 09-17) | Garage with the vent | Notes |
|---|---|---|---|
| **A. Radiant-barrier foil stapled to the UNDERSIDE of the rafters** | **~$50-80** - Reflectix perforated 500 sq ft roll ~$78 at Home Depot ($0.16/sq ft); 1-2 hours | **~80 F** (vent alone was ~84) | Cuts roof heat gain 26-50% (RIMA / ASHRAE research). Summer-only benefit - fine for a garage. MUST be perforated (moisture) and MUST have an air gap to the deck - stapling under the rafters gives it. |
| **B. Batts between the rafters** | **~$490-535** - Owens Corning R-30 kraft $1.62/sq ft x ~300-330 sq ft, plus baffles | **~74-76 F** | Rafter depth decides the R: 2x6 = R-19/21, 2x8 = R-25, 2x10 = R-30. If the roof has soffit/ridge vents, keep a baffle channel under the deck. **Exposed kraft facing is a fire-code problem (IRC R302.10) - use FSK foil-faced batts or cover them.** |
| **C. Build a ceiling, then blow in** | ~$150 insulation + the ceiling material (OSB/drywall - NOT priced) | **~74-75 F** | Only possible if there are ceiling joists / truss bottom chords at ~10 ft to hang it on. Best finished result. |

Sources: [Home Depot R-30 8-bag](https://www.homedepot.com/p/Owens-Corning-R-30-Kraft-Faced-Fiberglass-Insulation-Batt-24-in-x-48-in-8-Bags-E56/202744531)
- [insulationreport.com radiant barrier cost](https://insulationreport.com/cost/radiant-barrier-cost/)
- [Angi radiant barrier](https://www.angi.com/articles/radiant-barrier-cost.htm)
- [RIMA radiant barrier research](https://rimainternational.org/radiant-barriers/).

**Still needed to pick:** rafters straight to the ridge, or joists/chords at 10 ft?
Rafter size (2x6 / 2x8 / 2x10)? Soffit or ridge vents?
Keep any insulation clear of lights and the opener's ceiling bracket.

## If you ever want more than "take the edge off"
The door is already insulated, so the 390 Btu/h-per-degree leak is coming through
the **uninsulated walls and the ceiling/attic** - that is where the heat is getting
in now. The lever would be wall/ceiling insulation, not a bigger duct. Not priced,
not researched - only worth doing if the garage matters more later.

*Numbers: Manual D branch airflow, sensible-heat equation 1.08 x CFM x dT, and Jeff's
own 94 F / 80 F measurement with the LG's SACC rating from the 09-01 record. It is an
estimate to within a few degrees, not a Manual J.*
