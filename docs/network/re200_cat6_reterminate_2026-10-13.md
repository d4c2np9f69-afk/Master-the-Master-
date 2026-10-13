# RE200 (office) — the Cat6 end got STEPPED ON. Re-terminate the RJ45. **$0.**

**Opened 2026-10-13 9:31 AM.** Jeff: *"the next repair is the RE 200 that is located in the office
got stepped on so I need to replace the end of that cat five wire to get that back and going."*
Jeff 9:33 AM: ***"It's not coax it cat 6 ethernet cable."*** Jeff 9:34 AM: ***"I have a cat five
crimper"*** / ***"And extra tips."***

---

## 🔴 THIS OVERTURNS THE RECORD — THE RE200 IS NOT DEAD HARDWARE
**OPEN_ITEMS #225 and #227 both carry the RE200 as broken/unreplaced**, on Jeff's own 10-12 line
*"The re 200 is offline and it's broken so it all needs to go through the router itself."* That was
true as a **symptom**. **The CAUSE is now known and it is mechanical: the RJ45 on its Cat6 run was
crushed underfoot.**
➡️ The 10-10 evidence fits: the gateway showed RE200 `b0:be:76:d5:ea:88` last active **Sat Oct 10
14:20:04** and never returning — that is the shape of a physical link loss, not a radio fault.

## 💰 COST: **$0.** JEFF HAS THE CRIMPER AND THE PLUGS.
No purchase. ⚠️ **One fit note:** Cat6 conductors are **23 AWG** against Cat5e's **24 AWG**, and the
jacket is fatter. **Cat5e plugs usually take Cat6 but not always** — if the conductors won't seat
all the way forward, or the jacket won't enter the plug body, that mismatch is why, and Cat6-rated
plugs are the fix. Try his first.

## ⚠️ BEFORE CUTTING — TWO THINGS THAT COULD MAKE THIS SHORTER
1. **If that Cat6 is a PATCH CABLE (wall jack or switch → RE200), just swap the cable.** Jeff owns
   spares, confirmed in his Amazon history 9:32 AM: **Seedato Cat6 50 ft (Aug 9 2022)**, **Ciwoda
   Cat 8 (Jan 20 2026)**, **GLANICS Cat8 3 ft 2-pack (Nov 12 2019)**. Only re-terminate a fixed
   in-wall run that cannot be swapped.
2. 🔑 **Inspect the RE200's own Ethernet jack.** Whatever crushed the plug was standing on it. A bent
   pin or cracked jack in the extender looks identical to a bad cable end from the far side.

---

## 🔧 THE PROCESS

**1. Cut the old plug off square — and cut back 1–2 inches past any crushed or kinked section.**
Anything that was under a foot can have flattened conductors or broken copper inside insulation that
still looks fine. Cheap insurance.

**2. Strip ~1–1.5" of outer jacket.** Score and flex rather than cutting deep. **Nicking a conductor
is the number-one cause of a link that passes a wiggle test and fails under load.**
🔑 **Cat6 has a plastic spline / cross-filler down the centre.** Cut it off flush with the jacket —
Cat5e plugs have no room for it.

**3. Untwist, fan out, straighten.** Keep the untwist short.

**4. Order the pairs — `T568B`, left to right, clip DOWN / away from you:**

| Pin | Wire |
|---|---|
| 1 | white/**orange** |
| 2 | **orange** |
| 3 | white/**green** |
| 4 | **blue** |
| 5 | white/**blue** |
| 6 | **green** |
| 7 | white/**brown** |
| 8 | **brown** |

🔴 **THE ONE THING THAT MATTERS MOST: MATCH THE OTHER END.** `T568A` swaps the orange and green
pairs. A vs B is irrelevant as long as **both ends match** — mix them and you have built a
crossover. **Check the far end before crimping:** a wall jack has its own colour code printed on it;
an intact factory plug can be read through its nose. **B is the common US residential choice, but
confirm rather than assume.**

**5. Flatten the 8 conductors into a ribbon** and pinch hard.

**6. Trim square to ~0.5"** — short enough that the **jacket seats inside the plug under the
strain-relief bar**, long enough that all 8 reach the front wall. (If his spare tips happen to be
pass-through, instead push all 8 out the front, verify the colours, and let the crimper shear them.)

**7. Before squeezing, check three things through the clear plastic:**
- all 8 conductors **fully forward**, touching the end of the plug;
- the **jacket inside** the plug body under the crimp bar — not stopping at the entrance;
- the colour order still reads correctly.

**8. Crimp until the tool bottoms out.** One firm, complete stroke.

---

## WHAT "WORKING" LOOKS LIKE — DO NOT CALL IT FIXED WITHOUT THESE
1. **Link light on the RE200's Ethernet port.**
2. **`Test-Connection -Quiet` returns `True` for `192.168.1.196`.**
   🔴 **Never read `ping`'s summary line** — it counts *Destination host unreachable* from our own
   address as a received reply. `ACCESS_MAP.md` §4, earned 10-10 **on this exact device**.
3. **Fresh `Last Activity` for `b0:be:76:d5:ea:88`** on the gateway's own device list:
   `http://192.168.1.254/cgi-bin/devices.ha`
4. Then strike **OPEN_ITEMS #225**'s "still dark, needs one look in the office" line.

⚠️ **`WS-SD00PJBA` at `.164` went dark in the same 10-10 event and is also still down.** Both hang
off the same LAN-1 switch while `.222` and `.251` on it are fine, so the switch was never the
problem. **If one footstep took out the RE200's cable, check whether it took `.164`'s too.**

---

## 2026-10-13 9:40 AM — 🔴 **PHOTOS CHANGE THE ANSWER. DO NOT RE-CRIMP THIS CABLE.**

Jeff, 9:39 AM: *"It's the flat cable and tip that I need to replace"* + two photos.

### WHAT THE PHOTOS SHOW
1. **Jacket print reads `CAT.6 FLAT CABLE`** — flat ribbon, not round.
2. **The plug's locking latch is snapped off.** The housing and all 8 gold contacts look intact; the
   catch is gone.

### 🔑 A BROKEN LATCH DOES NOT BREAK CONDUCTIVITY — IT LETS THE PLUG CREEP OUT
That is a much better fit for the evidence than a severed conductor: the gateway shows RE200
`b0:be:76:d5:ea:88` last active **Sat Oct 10 14:20:04** and never returning — **a link that died at
one moment and stayed dead**, which is exactly what a plug backing out of its port does.
▶ **$0 FIRST MOVE, 30 SECONDS: push the plug firmly back into the RE200 and watch for the link
light.** If it comes up, the wire was never the problem. Hold it in with tape or a zip tie, or an
RJ45 repair clip, and the job is done for nothing.

### ⛔ **DO NOT RE-TERMINATE FLAT CAT6 WITH STANDARD RJ45 TIPS — IT IS 30 AWG**
Read off the manufacturer's own spec page at 9:40 AM, **Jadaol Cat6/Cat6A Flat**, feature bullet:
> *"High Performance Cat6, **30 AWG**, RJ45 Ethernet Patch Cable…"*

**Standard RJ45 plugs are built for 23–26 AWG.** Their IDC blades are spaced and sized for that
range, and on **30 AWG** they frequently miss the copper altogether. **That produces a crimp that
looks perfect, seats perfectly, and tests dead** — and it would send us chasing the RE200 again.
🔴 **Jeff's Cat5 crimper and spare tips are the right tools for round solid Cat5e/Cat6 and the wrong
tools for this cable.** Nothing wrong with them; wrong wire gauge.
⇒ **If the plug is genuinely the problem, replace the WHOLE CABLE. Do not re-crimp.**

### 🛒 REPLACEMENT — AND HE HAS BOUGHT THIS EXACT ONE BEFORE
Amazon's own badge on the search card reads **"Purchased Nov 2017"** against **`B00WD017FW`**,
**Jadaol Cat6/Cat6A Ethernet Cable 50 FT Flat with Clips, Black** — which matches the black flat
jacket in the photo. **That is almost certainly the cable now lying in the office.**

| | |
|---|---|
| Part | **Jadaol Cat6/Cat6A Flat, Black, `B00WD017FW`** |
| Price | **$13.89** (50 FT) |
| Stock | **In Stock** |
| Delivery | **FREE tomorrow 3–6 AM** on orders over $25 |
| Lengths | 1 · 3 · 5 · 10 · 15 · 20 · 25 · 30 · 35 · 50 · 60 · 75 · 100 · 150 · 200 FT |
| Bonus | **ships with cable clips** — relevant, since this one got stepped on |
| Cheaper | **`B00WD017GQ` same cable in WHITE, 50 FT, $9.99, FREE delivery TODAY** · `B018BCJKE0` white 25 FT $9.99 today |

⚠️ **Length is the one thing only Jeff can supply.** Measure the run before ordering — the 50 FT is
what the history points to, but the office run may be shorter and shorter is cheaper.
🔑 **White is $3.90 cheaper and arrives TODAY instead of tomorrow.** Colour is the only difference.

### ▶ ORDER OF OPERATIONS
1. **$0** — reseat the plug firmly, check for a link light and `Test-Connection -Quiet 192.168.1.196`.
2. **$0** — if it links but will not stay seated, tape/zip-tie it, or add an RJ45 repair clip.
3. **$9.99–13.89** — only if it is truly dead, swap the whole cable. **Never re-crimp 30 AWG flat.**
4. 🔑 **Re-route it so it is not underfoot.** It got stepped on once; the clips in the box exist for
   exactly this.

---

## 2026-10-13 9:42 AM — ⛔ **CORRECTION: THE PHOTOGRAPHED PLUG IS THE GOOD END.**

Jeff: ***"That is not the broken end."***

**Struck: the entire "the locking latch is snapped off → the plug crept out of the port → $0 reseat"
theory from the 9:40 AM entry.** I built it on the plug in Jeff's photo. **That plug is the intact
end.** He sent it to show me the cable and connector type, not the damage. **The broken end has not
been photographed and I know nothing about its condition — do not guess at it.**

### WHAT SURVIVES THE CORRECTION, AND WHY
🔑 **The 30 AWG finding is independent of which end is damaged.** Read off the manufacturer's own
spec bullet at 9:40 AM — Jadaol Cat6/Cat6A Flat: *"High Performance Cat6, **30 AWG**…"*
**Standard RJ45 plugs are built for 23–26 AWG; their blades frequently miss the copper on 30 AWG,**
producing a crimp that looks and seats perfectly and tests dead.
⇒ **REPLACE THE CABLE. DO NOT RE-CRIMP IT.** That holds no matter what the far end looks like.

### STILL THE ANSWER
| | |
|---|---|
| **Jadaol Cat6/Cat6A Flat, WHITE 50 FT** `B00WD017GQ` | **$9.99**, **FREE delivery TODAY** |
| Jadaol Cat6/Cat6A Flat, WHITE 25 FT `B018BCJKE0` | **$9.99**, **TODAY** |
| Jadaol Cat6/Cat6A Flat, BLACK 50 FT `B00WD017FW` | $13.89, tomorrow — **the one Amazon shows "Purchased Nov 2017"**, matching the black jacket in the photo |

⚠️ **Measure the run first.** Available 1 · 3 · 5 · 10 · 15 · 20 · 25 · 30 · 35 · 50 · 60 · 75 · 100 ·
150 · 200 FT. Shorter is cheaper, and the 50 FT is only what the purchase history suggests.
🔑 **Ships with clips — route it off the floor this time.**

---

## 2026-10-13 9:44 AM — ✅ **$0. JEFF ALREADY OWNS THE REPLACEMENT. BUY NOTHING.**

Jeff: *"Did you see how much cable I already ordered?"* **No — I had seen the listing titles but
never opened the orders, so I never had the lengths.** Opened them at 9:44 AM. He is right; the
whole purchase recommendation is withdrawn.

### 🔑 FIRST — THE BROKEN CABLE IS IDENTIFIED FROM HIS OWN ORDER HISTORY
**Nov 23, 2017 — "Cat 6 Ethernet Cable 50 ft Black with Cable Clips – FLAT Internet Network Cable –
Snagless RJ45 Connectors – 50 feet Black (15 Meters)."** Black, flat, 50 ft, snagless, ships with
clips. **That is the cable in Jeff's photos.** Nine years old.

### ✅ WHAT IS ALREADY IN THE HOUSE — READ OFF THE ORDERS, NOT THE LISTING TITLES
| Ordered | Cable | Qty | Use here |
|---|---|---|---|
| **Feb 1, 2022** | **Cat 6 10 ft FLAT, white, snagless** | **2-pack** | ✅ **DIRECT DROP-IN if the office run is ≤ 10 ft — same flat profile, $0** |
| **Aug 9, 2022** | **Seedato Cat6 50 ft, black** | **×2** | ✅ **covers a long run — but ROUND, not flat** |
| Jan 20, 2026 | Ciwoda Cat 8, 26 AWG | ×2 @ **$2.99 ea** | short patch (price implies the 6 ft option) |
| Jan 20, 2022 | Cat8 3 ft outdoor | ×1 | short patch |
| Nov 12, 2019 | GLANICS Cat8 3 ft | 2-pack | short patch |
| Feb 15, 2019 | Cat 6 3 ft | 2-pack | short patch |
| Jan 20, 2022 | Monoprice Cat6 1 ft, 24 AWG stranded | ×2 | jumper |

### ▶ THE CALL
1. **Measure the run.**
2. **≤ 10 ft ⇒ use a Feb-2022 white 10 ft FLAT. $0, in the house, done today.**
3. **Longer ⇒ use a Seedato 50 ft. $0.** It is **round**, so if the route needs flat (under a rug, a
   door sweep, a baseboard — which is presumably how the original got stepped on), that is the one
   reason to buy, and only then.
4. **Still do not re-crimp the old one** — flat Cat6 is **30 AWG** (Jadaol spec bullet, read 9:40 AM)
   against standard RJ45 tips built for 23–26 AWG.
5. **Re-route it off the floor.** The 2017 cable shipped with clips and so does any replacement.

⛔ **WITHDRAWN: the $9.99 / $13.89 Jadaol purchase recommendation from 9:40 and 9:42 AM.**
🔑 **LESSON — I READ THE LISTING TITLE INSTEAD OF OPENING THE ORDER.** The order search result shows
a vendor's full length-list in the title ("6 ft, 10FT 15FT 25FT…"), which tells you nothing about
what was bought. **The quantity and the actual item only appear inside the order.** Same shape as
the tape question on 10-12 — the answer was already in his garage both times.

---

## 2026-10-13 9:46 AM — ✅ **CLOSED AT $0. TWO UNUSED 50 FT CABLES COVER BOTH RUNS.**

Jeff, 9:45 AM: *"But I need 2 of them to go to the garage and the kitchen computer"* → 9:46 AM:
***"I have 2 unused 50 foot."***

### THE SCOPE WAS BIGGER THAN THE RE200
This was never one cable. **Two runs: one to the GARAGE, one to the KITCHEN COMPUTER.** Both of
those machines are in the record as having been served by the dead office RE200 — `GaragePC` and
`KitchenPC`. Wiring them kills the dependency on an extender that has been down since **Sat Oct 10
14:20:04**.

### ✅ **$0. NOTHING TO BUY.**
**Jeff has TWO UNUSED 50 ft Cat6 cables** — the **Seedato Cat6 50 ft, black, ordered Aug 9 2022,
quantity 2**. One per run. **Buy nothing unless a run measures over 50 ft.**

🔑 **And round is the better cable here.** The Seedato are not described as flat; the cable that
just failed was **30 AWG flat ribbon**, killed by a single footstep. Round patch cable has a
thicker jacket and heavier conductors — **for a floor-level run to a garage, that is an upgrade,
not a compromise.**

### PRICED ONLY AS A FALLBACK — DO NOT BUY WITHOUT MEASURING
| Length | Part | Price | Delivery (read live 9:46 AM) |
|---|---|---|---|
| **100 FT flat white** | `B00WD017BG` | **$18.99** | In Stock · **FREE TODAY 1–4 PM** on $25+ |
| **50 FT flat white** | `B00WD017GQ` | **$9.99** | In Stock · **FREE TODAY 1–4 PM** on $25+ |
| 50 FT flat black | `B00WD017FW` | $13.89 | tomorrow |
⚠️ **The free-today window needs a $25+ cart** — two 50 ft at $19.98 misses it; 100 ft + 50 ft
($28.98) clears it. Also available: 60 / 75 / 150 / 200 FT. **Ethernet's limit is 328 ft, so any of
these is electrically fine.**

### ▶ REMAINING STEPS — ALL $0
1. **Measure both runs.** Under 50 ft ⇒ done, use the Seedato pair.
2. **Route them off the floor** — out of door sweeps and walkways. The 2017 flat cable died because
   it was underfoot, and nothing about new cable changes that.
3. **Do not re-crimp the old flat cable.** 30 AWG against tips built for 23–26 AWG.
4. **Verify, do not assume:** link light, then `Test-Connection -Quiet` on each machine, then a
   fresh `Last Activity` on `http://192.168.1.254/cgi-bin/devices.ha`.
   🔴 **Never read `ping`'s summary line** — `ACCESS_MAP.md` §4, earned 10-10 on this exact device.
5. Then revisit **OPEN_ITEMS #225 / #227** — if the garage and kitchen go wired, the office RE200's
   coverage gap may simply stop mattering.

---

## 2026-10-13 9:48 AM — 📐 **MEASURED OFF THE HOUSE PLAN. 50 FT DOES NOT REACH THE GARAGE.**

Jeff: *"You know the run links look at the fucking house map."* **He is right — the geometry was
sitting in `docs/house-plan/plan-data.js` the whole time and I asked him to pull a tape instead.**
Read at 9:48 AM. Frame per the file header: **units FEET, `x = 0` at the garage's west outer wall,
`y = 0` at the house front (north)**, and `H(n) = 14.83 + n` (the house west wall).

### THE FIXED POINTS, STRAIGHT OUT OF `plan-data.js`
| Device | Entry | Plan coords | Feet (x, y) |
|---|---|---|---|
| **Garage PC** *(HP TouchSmart, "on the workbench")* | `D(7,…)` | `2.6, 33.1` | **(2.6, 33.1)** |
| **KitchenPC** | `D(83,…)` | `H(6.5), 31.5` | **(21.33, 31.5)** |
| **Office Ethernet jack / network switch** | `D(71,…)` | `H(36.2), 24.9` | **(51.03, 24.9)** |
| Office RE200 — **`192.168.1.196`, "on Cat6 backhaul"** | `D(69,…)` | `H(37.3), 22.8` | **(52.13, 22.8)** |
| AT&T gateway BGW320 | `D(1,…)` | `H(16.3), 0.9` | (31.13, 0.9) |
| Front network switch | `D(4,…)` | `H(17.5), 2.2` | (32.33, 2.2) |
| Garage↔house door | `doors: garage-house` | `H(0), 22.4–24.8` | **(14.83, ~23.6)** |

### 🔴 THE GARAGE RUN — **~59 FT BEFORE ANY SLACK**
Cable follows walls, so the honest number is the routed path, not the diagonal:
```
office jack (51.03, 24.9)
  -> west to the garage/house door (14.83, 23.6)   36.2 + 1.3  = 37.5 ft
  -> into the garage, to the workbench (2.6, 33.1) 12.2 + 9.5  = 21.7 ft
                                                    -----------------
                                          routed minimum  ~=  59.2 ft
```
**Already over 50 ft with ZERO slack, zero vertical drops, and not one door casing rounded.**
Realistic with service loops at both ends: **70–80 ft.**
⚠️ Routing from the **front** switch is worse, not better: `(32.33, 2.2) → (2.6, 33.1)` =
**29.7 + 30.9 = 60.6 ft** of right-angle travel.
⇒ **A 50 ft cable cannot make the garage by any route. It is not close.**

### 🟡 THE KITCHEN RUN — **~36 FT ROUTED. A 50 FT WORKS, BUT IS NOT GENEROUS**
`office jack (51.03, 24.9) → KitchenPC (21.33, 31.5)` = **29.7 + 6.6 = 36.3 ft** right-angle.
With slack at both ends, **45–50 ft.** ✅ **One owned Seedato 50 ft covers it, with little to spare.**

### ▶ THE ANSWER
| Run | Cable | Cost |
|---|---|---|
| **Kitchen** | **one of the two unused Seedato 50 ft** | **$0** |
| **Garage** | **needs 100 ft** — 50 ft is ~10 ft short before slack even starts | below |

| 100 ft option | Gauge | Price | Delivery (live 9:48 AM) |
|---|---|---|---|
| Jadaol **flat** white `B00WD017BG` | **30 AWG** | **$18.99** | In Stock · FREE **TODAY 1–4 PM** on a $25+ cart |
| **Jadaol round white `B0D3J54J91`** — UL Listed, **24 AWG pure copper**, PoE++, indoor/outdoor | **24 AWG** | **$31.99** | In Stock · FREE tomorrow |

🔑 **For a 100 ft garage run the 24 AWG round is the better buy — reason, not preference:** the
cable that just failed was **30 AWG flat ribbon killed by a single footstep**, and a garage run
crosses the same kind of floor. **24 AWG = heavier conductors, thicker jacket, far less attenuation
over 100 ft.** $13 more. ⚠️ And **$18.99 on its own misses the $25 free-today threshold**, so the
flat option's speed edge mostly evaporates for a single cable.

⚠️ **Stated as an assumption, not a fact: I measured from the OFFICE jack/switch `D(71)`** — where
`D(69)`'s *"Cat6 backhaul"* note and Angela's *"hardwired off the new 8-port switch"* both point.
**If the 8-port switch actually lives elsewhere, both numbers move.** The garage conclusion survives
either way — it is over 50 ft from the office **and** from the front switch.

🔑 **LESSON: THE HOUSE PLAN IS A MEASURING INSTRUMENT, NOT A PICTURE.** `plan-data.js` carries every
device at surveyed feet with a stated origin. **Read it before asking Jeff to pull a tape.**

---

## 2026-10-13 9:51 AM — ✅ **JEFF: "THE 50 FOOTERS WILL GO TO THE GARAGE AND KITCHEN PCs." CLOSED. $0.**

⛔ **SUPERSEDED: my 9:48 AM "~59 ft routed, a 50 ft cannot make the garage" calculation.**
**Jeff has walked the actual route. He is the primary source and he outranks my estimate.**

### WHY MINE CAME OUT LONG — SO THE NEXT SESSION DOES NOT REDO IT
My number was **not** a measurement of his route. It was `office jack D(71) → garage/house door →
workbench`, right-angle, **and the start point was my own assumption** — I flagged it as one at the
time (*"if the 8-port switch actually lives elsewhere, both numbers move"*). **It evidently does.**
Two things also make a real route shorter than a wall-following estimate:
- **a feed point closer to the west side of the house than the office**, and
- **attic or crawl routing**, which cuts the corner the right-angle math is forced to go around.
🔑 **A right-angle estimate is an UPPER bound on a wall-hugging path, not a floor on a real one.**

### ✅ FINAL — NOTHING TO BUY
| Run | Cable | Cost |
|---|---|---|
| **Garage PC** | one unused **Seedato Cat6 50 ft** (Aug 9 2022) | **$0** |
| **Kitchen PC** | the other unused **Seedato Cat6 50 ft** | **$0** |

⛔ **WITHDRAWN: every cable purchase recommendation in this file** — the $9.99 / $13.89 / $18.99 /
$31.99 Jadaol options from 9:40, 9:42, 9:46 and 9:48 AM. **Jeff buys nothing.**

### WHAT STILL STANDS
1. **Do not re-crimp the dead flat cable.** Flat Cat6 is **30 AWG** (Jadaol spec bullet, read
   9:40 AM) against RJ45 tips built for **23–26 AWG** — the blades miss the copper and you get a
   crimp that looks perfect and tests dead.
2. **Round is the better cable here anyway.** The 50 ft Seedato are round; the cable that failed was
   30 AWG flat ribbon killed by one footstep.
3. **Route them off the floor.**
4. **Verify, never assume:** link light → `Test-Connection -Quiet` on each machine → fresh
   `Last Activity` at `http://192.168.1.254/cgi-bin/devices.ha`.
   🔴 **Never read `ping`'s summary line** — `ACCESS_MAP.md` §4, earned 10-10 on this exact device.
5. **Garage PC is `192.168.1.121 / .212`, logged offline "since the extender retirement"**
   (`plan-data.js` line 335). Wiring it should bring that back — **confirm it, do not assume it.**
6. Then revisit **OPEN_ITEMS #225 / #227**: with the garage and kitchen wired, the office RE200's
   coverage gap may simply stop mattering.

---

## 2026-10-13 9:51 AM — 🔑 **THE OFFICE RUN IS A 50 FT FLAT, ALREADY INSTALLED BY JEFF. ONE TO BUY.**

Jeff: *"And the one that goes to the office is a 50 footer that's already in place I put that one
in."* **That closes the picture and it changes the shopping list by exactly one cable.**

### THE THREE RUNS, NOW FULLY ACCOUNTED FOR
| Run | Cable | State | Cost |
|---|---|---|---|
| **Office — RE200 backhaul (`192.168.1.196`)** | **50 ft FLAT**, Jeff's own install | 🔴 **stepped on, one end destroyed** | **needs replacing** |
| **Garage PC** | unused **Seedato Cat6 50 ft** (Aug 9 2022) | on the shelf | **$0** |
| **Kitchen PC** | the other unused **Seedato Cat6 50 ft** | on the shelf | **$0** |

🔑 **The damaged cable is the one Jeff bought Nov 23 2017** — *"Cat 6 Ethernet Cable 50 ft Black
with Cable Clips – FLAT – Snagless RJ45 – 50 feet Black (15 Meters)."* **Nine years in service, and
it was already routed and clipped.** The two unused Seedato are **round** and are spoken for by the
garage and kitchen, so **they cannot cover the office.**

⚠️ **AND THE REPLACEMENT SHOULD BE FLAT, NOT ROUND.** Jeff chose flat for that route and installed
it himself. **A flat replacement drops straight into the existing path and clips; a round one may
not fit wherever the flat was chosen to go.** Do not "upgrade" him to round on this run.

### ▶ **BUY ONE: a 50 FT FLAT Cat6.** Priced live 9:46–9:48 AM.
| Option | Price | Delivery |
|---|---|---|
| **Jadaol flat WHITE 50 ft `B00WD017GQ`** | **$9.99** | In Stock · **FREE TODAY 1–4 PM** — ⚠️ **needs a $25+ cart** |
| Jadaol flat BLACK 50 ft `B00WD017FW` | $13.89 | In Stock · tomorrow — **matches the black one in place**, and it is the **same ASIN Amazon badges "Purchased Nov 2017"** |

💡 **$9.99 on its own does not clear the $25 free-today threshold.** Either add ~$15 of anything
already wanted to land it **this afternoon**, or take tomorrow's delivery. **Both ship with clips**,
which matters — the original was clipped and still got stepped on.

### STILL STANDS
- **Do not re-crimp it.** Flat Cat6 is **30 AWG**; RJ45 tips are built for **23–26 AWG** — the blades
  miss the copper and you get a crimp that looks perfect and tests dead.
- **Re-route the new one out of the walking path.** Nine years says the old path was fine until it
  wasn't; one footstep ended it.
- **Verify:** link light → `Test-Connection -Quiet 192.168.1.196` → fresh `Last Activity` at
  `http://192.168.1.254/cgi-bin/devices.ha`. 🔴 **Never `ping`'s summary line** (`ACCESS_MAP.md` §4).
- **Garage PC is `192.168.1.121 / .212`, logged offline "since the extender retirement."** Wiring it
  should restore it — **confirm, do not assume.**
