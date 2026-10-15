# AC STICK WELDER — THE BUILD DESIGN
## Designed around the parts Jeff has. Jeff's call, 2026-10-15: **AC welder.**

**This is the build sheet. The planning graphics were input; this supersedes them.**
Donor: **Samsung ME16K3000**, June 2019, 1.58 kW, 120 V 60 Hz, FCC `A3LOTR16M3`.

---

## 1. THE DESIGN IN ONE PARAGRAPH

Two microwave transformers, **shunts removed**, **primaries in SERIES across 240 V**, secondaries
stripped and **rewound with #6 welding cable, in series and phased to add**, brought out to **three
tapped terminals** for coarse current control. Everything lives in the microwave's own steel
chassis, bonded to ground, cooled by the microwave's own fan, protected by the microwave's own
thermal cutouts. **AC output, 6013 rod.**

🔑 **The 240 V primary wiring is the design decision that makes this build work in your shop**, and
it is available to you specifically because you wired your own house — see §3.

---

## 2. BILL OF MATERIALS — what you have vs what you need

### ✅ FROM THE MICROWAVE (free)
| Part | Role in the welder |
|---|---|
| **MOT** | Transformer #1 — rewound |
| **Steel chassis / case** | The enclosure. Already steel, already has mounting points, already vented |
| **Cooling fan** | Transformer cooling. ⚠️ **Check its voltage before designing it in** — OTR fans are commonly **120 V AC**, not 12 V. If 120 V, it runs straight off one leg of the incoming supply and you need no 12 V supply at all, which is simpler than the graphic's plan |
| **Thermal cutouts / thermostats** | 🔴 **Use these. Bolt one to each transformer core** and put them in series with the primary contactor/switch. MOTs have no duty-cycle rating and this is the free thermal protection |
| **Power cord** | Only if you stay 120 V. For the 240 V design you need a new cord and plug — see §3 |
| Door interlock switches | Optional interlock on the lid |

### ✅ ALREADY ON HAND (elsewhere in inventory)
| Part | Role |
|---|---|
| **Fel-Pro 2499 sheet** | Heat shield between the cores and anything that can scorch. 🔴 **Bond it to the grounded chassis** — it has a steel core, and a floating conductive sheet near mains is worse than none |
| **Multimeter** | The volts-per-turn test in §4 — this is the instrument the whole design is tuned with |

### 🔴 MUST ACQUIRE
| Part | Spec | Note |
|---|---|---|
| **2nd microwave transformer** | any full-size MOT | **FREE.** Appliance repair shop, Marketplace, curbside. **This gates the build** |
| **Secondary cable** | **#6 AWG** welding cable, ~25–30 ft | The main cost. Flexible welding cable, not THHN — it must bend around the window |
| **Welding leads** | **#4 AWG**, 10 ft electrode + 10 ft ground | |
| **Electrode holder + ground clamp** | 200 A class | |
| **Output terminals** | heavy-duty brass studs or Dinse | 3 of them for the taps, + 1 common |
| **2-pole switch/contactor** | 240 V, 30 A | |
| **2-pole breaker** | 240 V, 30 A | In the panel — your dedicated circuit |
| **Cord + plug** | 10/3, NEMA 6-30 or 6-50 | |

---

## 3. 🔑 WHY 240 V, PRIMARIES IN SERIES — the key decision

A rewound MOT pulls hard. **Two of them with primaries in PARALLEL on a 120 V circuit will trip a
15 A or 20 A breaker**, which is why so many of these builds are described as "works for about
four seconds."

**Put the two primaries in SERIES across 240 V instead.** Each transformer then sees its design
voltage of 120 V, exactly as intended — but the supply current is **halved** for the same power,
because the two windings share the 240 V. One dedicated 2-pole 30 A circuit and it runs properly
instead of fighting the breaker.

```
        L1 ──┬── [2-pole 30A breaker] ── [switch] ── [thermal cutout T1] ── MOT1 primary ─┐
             │                                                                            │
        L2 ──┴────────────────────────── [thermal cutout T2] ── MOT2 primary ─────────────┘
                                          (the two primaries in SERIES across 240 V)
```

⚠️ **Both primaries must be the same model/turns count for the 240 V to split evenly.** If the
second MOT is a different size, the mismatch puts more than 120 V across the smaller one.
**Measure both primaries' DC resistance and compare before committing** — if they differ by more
than a few percent, wire primaries in PARALLEL on a dedicated **120 V 30 A** circuit instead.

---

## 4. 🔬 THE REWIND — how to get the turns right, by measurement

**Do not take a turns count off the internet.** MOT cores differ. Yours is measurable in five
minutes, and you have the meter.

### Step 1 — strip the transformers
1. Discharge the HV capacitor first, confirm 0 V, then set it aside unused.
2. Cut out the **HV secondary** (the many-turns fine-wire winding). Hacksaw/chisel/press it out.
3. 🔴 **Remove the magnetic shunts** — the thin steel laminations wedged between primary and
   secondary. They exist to current-limit the magnetron and they throttle welding output.
   **Leave the PRIMARY untouched.**

### Step 2 — find volts per turn (this is the whole tuning method)
1. Wind **exactly 10 turns** of ordinary insulated wire through the window of **one** stripped
   transformer.
2. Fused and clear of everything, apply **120 V** to that transformer's primary.
3. Measure the 10-turn winding, **AC volts**. Call it `V10`.
4. **Volts per turn = V10 ÷ 10.** *(Expect roughly 0.5–0.7 V/turn — but use YOUR number.)*

### Step 3 — calculate the turns you need
**Target open-circuit voltage: 45–55 V AC across the pair.** That is the band that strikes and
holds a 6013 arc; the 16–24 V in the planning graphic is arc voltage, not OCV.

```
Turns per transformer  =  (target OCV ÷ 2) ÷ volts-per-turn

Worked example at 0.6 V/turn and a 50 V target:
        (50 ÷ 2) ÷ 0.6  =  ~42 turns on each transformer
```

### Step 4 — wind it
- **#6 welding cable**, wound through the window, as many turns as §3 says — **and if the full
  count will not physically fit, that is your answer that you need the second transformer to
  share the load, not thinner cable.** Never drop below #6; the current will cook it.
- Wind **both transformers identically and in the same direction.** Mark start and finish.
- Pull each turn tight to the core. Loose turns buzz and lose coupling.

### Step 5 — phase them, then verify
1. Connect the two secondaries **in series**: MOT1-finish to MOT2-start.
2. Power up and **measure OCV across the free ends.**
   - **~45–55 V → correct, they are adding.**
   - **~0 V → they are cancelling. Swap the connections on ONE transformer and re-measure.**
3. **Do not proceed until the meter shows the voltage you designed for.** This is the acceptance
   test for the whole machine.

### Step 6 — the taps (your current control, for $0)
While winding transformer #2, **bring out a flying lead at roughly ⅓ and ⅔ of the way through**
and land all of them on separate terminals. That gives three coarse current settings off the one
winding — a variac does it smoothly, but costs real money and is not needed for 6013.

---

## 5. ASSEMBLY

```
 [240V 30A 2-pole breaker] ─► [cord] ─► [2-pole switch] ─► [T1]─[MOT1 pri]─[T2]─[MOT2 pri]
                                                 │
                                                 └─► [fan, wired per its own voltage]

 [MOT1 sec] ──series, phased──► [MOT2 sec] ──► [TAP 1] [TAP 2] [TAP 3]  +  [COMMON]
                                                      │                        │
                                                 electrode holder          ground clamp
```

**Mechanical:**
- Both transformers **bolted down hard** to the chassis floor — they buzz and they are heavy.
- **Fel-Pro sheet between the cores and any surface that can scorch, bolted to the chassis so it
  is grounded.**
- **Fan blowing across both cores**, intake and exhaust on opposite ends of the case.
- **Chassis bonded to the supply ground. Non-negotiable** — it is a steel box containing mains.
- Thermal cutouts **physically touching the cores**, wired in series with the primary.

---

## 6. OPERATING IT

| | |
|---|---|
| **Rod** | **6013, 1/8"** to start. 3/32" for thinner stock |
| **Polarity** | N/A — it is AC, which is exactly why 6013 |
| **Duty cycle** | **~10–20%.** Weld a minute, rest four. The cutouts are the backstop, not the plan |
| **Good for** | Mild steel, tube, angle, 1/8"–3/16" plate, trailer and farm repair |
| **Not for** | Aluminium, stainless, anything over ~1/4" |

---

## 7. BUILD ORDER

1. **Get the second MOT.** Nothing below happens without it.
2. Discharge and remove the capacitor. Set the magnetron aside **whole**.
3. Strip both transformers: secondary out, **shunts out**, primaries untouched.
4. **Volts-per-turn test** (§4 step 2) → calculate turns.
5. Compare the two primaries' resistance → confirms 240 V series is safe (§3).
6. Wind both secondaries, with taps.
7. **Phase and measure OCV. Do not continue until it reads 45–55 V.**
8. Mount in the chassis, bond everything, fit the heat shield, fan and cutouts.
9. Run the dedicated 240 V circuit.
10. First arc on scrap plate.

---

## 8. THE ONE OPEN ITEM

🔴 **A second full-size microwave transformer.** Free, but it is the gate on every other step.
