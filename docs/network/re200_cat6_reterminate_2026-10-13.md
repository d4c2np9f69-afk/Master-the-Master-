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
