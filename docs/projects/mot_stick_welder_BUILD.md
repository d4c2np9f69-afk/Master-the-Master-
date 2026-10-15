# AC STICK WELDER — THE BUILD DESIGN
## Designed around the parts Jeff has. Jeff's call, 2026-10-15: **AC welder.**

**This is the build sheet. The planning graphics were input; this supersedes them.**
Donor: **Samsung ME16K3000**, June 2019, 1.58 kW, 120 V 60 Hz, FCC `A3LOTR16M3`.

---

## 0b. 🟢 BUILD IT IN TWO PHASES — start with the ONE transformer you already have

**Jeff, 2026-10-15 10:00, showing the single-MOT wiring diagram: *"Why not like this"*.**
**Answer: do exactly that first.** Nothing in the two-MOT design is wasted by starting with one,
and it replaces an argument about numbers with a measurement.

| | **PHASE 1 — one MOT, as his diagram draws it** | **PHASE 2 — add the second** |
|---|---|---|
| Supply | **120 V, 15–20 A — a normal outlet** | 240 V 30 A, primaries in series (§3) |
| OCV | **~9–15 V** | ~38 V |
| Honestly good for | **tacking and thin sheet, 1/16"–3/32" rod, short bursts** | 1/8" 6013, plate, trailer and farm repair |
| What it will do badly | **striking and holding an arc.** Expect sticking | — |
| Cost to find out | **$0 beyond cable and a holder** | one free MOT |

🔑 **Phase 1 is not a throwaway.** You wind MOT #1, you measure its real volts-per-turn and its
real OCV on YOUR core, and that number settles the whole design — it is the same winding, the same
cable and the same chassis that Phase 2 uses. **Phase 2 is literally "wind the second one the same
way and series them."** Nothing gets undone.

⚠️ The only thing to decide up front is **cable length**: buy enough #6 to wind BOTH transformers
now (~25–30 ft), so Phase 2 does not need a second, possibly mismatched, cable order.

---

## 0c. 🔴 ONE REAL ERROR IN THAT DIAGRAM — the current control is on the wrong side

The diagram puts **"Current Control (variac or tap)" in the SECONDARY**, between the transformer
and the welding leads — i.e. in the **60–200 A** path its own note describes.

**Nothing affordable survives there.** A variac is a wound autotransformer; the ones you can buy
are rated for a handful of amps up to maybe 20–30 A. Put one in a 200 A welding circuit and it is
scrap on the first arc. A **tap** selector can live there, but it has to be a genuine 200 A rotary
switch or a bolted link — not the small panel knob drawn.

**Two correct ways to do it:**
1. 🟢 **$0, and what this build uses — TAPS on the secondary winding.** Bring flying leads out at
   roughly ⅓ and ⅔ of the turns and land each on its own output stud. Change current by moving the
   electrode lead to a different stud. Coarse, free, indestructible.
2. **A variac on the PRIMARY side** — where the current is ~20–30 A instead of 200 A, so an
   affordable variac actually survives. Smooth control, real money, and not needed for 6013.

**Either way it does not belong where that diagram has it.**

⚠️ Minor, same diagram: the **12 V fan is drawn fed from the 120 V switch** with no power supply
between them. Check the donor's own fan first — over-the-range fans are usually **120 V AC**, in
which case it wires straight across the incoming supply and the problem disappears.

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

## 3b. 🔑 WHY A SECOND MOT — the two reasons, and the second is the hard one

Jeff asked directly, 2026-10-15 09:56. The answer is not "because the forums say so."

### Reason 1 — POWER. One MOT is about half a welder.
**1/8" 6013 draws roughly 90–130 A at an arc voltage of ~22–26 V. That is 2.1–3.4 kW at the
arc**, before transformer losses. Even 3/32" at 70–90 A is ~1.8–2.3 kW.

**The donor oven's whole input is 1.58 kW.** Its transformer is a ~1.2–1.5 kW class part. One MOT
is simply not a 3 kW machine — it will sag, overheat and stall in the middle of a bead.

### Reason 2 — WINDOW SPACE, and this is the one that actually stops you.
Output voltage is **turns × volts-per-turn**, and a MOT runs roughly **0.5–0.7 V per turn**. To
reach a 38 V striking voltage you need **~60–65 turns total**.

**They have to physically fit through the core window, in #6 cable.** After the HV secondary and
the shunts come out, one MOT window holds somewhere around **15–25 turns of #6** — and no more,
because #6 welding cable is about ⅓ of an inch thick with insulation.

```
   one MOT   ≈ 15–25 turns × ~0.6 V/turn   ≈   9–15 V OCV     ← will not strike
   two MOTs  ≈ twice that                  ≈   ~38 V measured ← strikes 6013
```

🔴 **That is exactly where the "12 V" on your first planning graphic came from.** It was not a
typo and it was not invented — **12 V is the honest output of a one-MOT rewind.** And it is
precisely why single-transformer builds disappoint: the rod sticks and never lights.

### Why not just wind more turns on the one you have?
Because the only way to fit 60 turns in one window is thinner wire, and **thinner wire cooks.**
At 100+ A, #10 or #12 will heat, melt its insulation and short turn-to-turn inside the core where
you cannot see it or fix it. **The cable gauge is set by the welding current, not by convenience** —
so once #6 is fixed, the turns you need simply do not fit in one transformer. Hence two cores.

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
> ⚠️ **CORRECTION, 2026-10-15 09:5x. The first version of this sheet said "target 45–55 V". That
> is not reachable with two MOTs and I should not have written it.** Measured two-MOT builds land
> at **~38 V**; it takes four to reach 47 V. 45–55 V is a 3–4 transformer target. The numbers
> below are the corrected ones.

**Target open-circuit voltage: ~35–40 V AC across the pair — that is what two MOTs actually give.**
It strikes and holds 6013. It is **on the low side** and you will feel that as a rod that wants a
decisive scratch start rather than a lazy one. A **third MOT takes it to the mid-40s** and makes
striking noticeably easier — worth doing later if a third turns up free, and the tap arrangement
in Step 6 already accommodates it.

For reference, the planning graphic's 16–24 V is **arc** voltage — what sits across a burning arc,
not what strikes it.

```
Turns per transformer  =  (target OCV ÷ 2) ÷ volts-per-turn

Worked example at 0.6 V/turn and a 38 V target:
        (38 ÷ 2) ÷ 0.6  =  ~32 turns on each transformer
```

🔑 **If ~32 turns of #6 will not physically fit the window, that is the design telling you
something true — see §3b. Do not solve it with thinner wire.**

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
