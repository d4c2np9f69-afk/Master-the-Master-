# onn 75" Roku TV — backlight repair: worth it? (2026-09-30)

**TV (from Jeff's label photo 09-30):** onn. Roku TV, **model 100044717**, 100-240 V, 260 W, S/N HA211230C75005153 (≈ Dec 2021), VESA 400×300, M6×16 mm. Fault per Jeff: **backlights**.
No earlier file existed anywhere (record, iCloud, HCC-secrets, Gmail, Acer) — this is the first.

## Parts (looked up 09-30)
- 12-strip kit (10×A + 2×B), part families LED75D07A/B-ZC66AG / 30375007007 / 30375007008.
  - ShopJimmy 261501013121 — **$64.99, OUT OF STOCK** (substitutes listed) — https://www.shopjimmy.com/onn-261501013121-led-backlight-strips-12-100044717-see-note/
  - Amazon XIMAIACC kit (B0G2XPMHRT) — fits 100044717; price not shown to fetch — https://www.amazon.com/dp/B0G2XPMHRT
  - eBay kits — https://www.ebay.com/itm/276436622188 · https://www.ebay.com/itm/394976725095
- ⚠️ **This model shipped with 3+ strip versions — read the part number printed on the OLD strips and match it before ordering.**

## New TV (same model) — not verified live (Walmart CAPTCHA)
- Search summary: **$384** at Walmart; TechRadar Prime-Day deal **$498**; Slickdeals post **$578**.

## Verdict
Worth fixing **as a DIY job** (~$65–90 in strips vs ~$384–578 new). Replace **all 12** strips (they fail as a set). Two-person job — a 75" panel is large and thin; cracking it ends the repair. **Not worth paying a shop** — labour would eat most of the gap.
Confirm it really is the backlight first: TV on, shine a flashlight at the screen — a faint picture = backlight (strips); nothing at all = power/main board instead.

## Confirmed 09-30 9:55 (Jeff)
TV on, room dark, eye 1–2" from screen → Roku logo faintly visible. **Main board + panel alive; backlight not lit.** Remaining split (optional, Jeff has a meter): backlight output on the power board — voltage appears then drops out = driver OK, protecting against an OPEN strip → strips are the fix; never any voltage = power board. Strips are the common case (series string: one dead LED darks the whole set).

## LIVE PRICES — read in Chrome 2026-09-30 9:57 AM (supersede the estimates above)
| Where | Kit | Price | Ship | Proof of sales |
|---|---|---|---|---|
| **eBay 394976725095** (fits 30375007007 / WR75UT4210 / LED75D07A/B-ZC66AG) | 12 strips | **$49.28** | $4.98 → **$54.26** | 51 sold, seller 99.8 % |
| eBay 276436622188 (LED75D07A-ZC66AG / 30375007007 / 30375007008) | 12 strips | $52.53 | FREE → $52.53 | 14 sold, seller 99.5 % |
| Amazon B0G2XPMHRT (XIMAIACC) | 12 strips (10A+2B) | $58.99 | — | in stock, 3.5★ / 3 reviews |
| ShopJimmy 261501013121 | 12 strips | $64.99 | — | OUT OF STOCK |
| **New TV:** Walmart — model 100044717 **out of stock**; current onn 75" 4K Roku TV **$398** | | | | |
**Pick:** match the old strips' printed part number first, then the cheapest listing that names it (eBay $52–54, most sales on the $54.26 one). Repair ≈ $53 vs $398 new.

## CORRECTION 10:05 — strip COUNT (Jeff: "Is the 12 strip")
Full set for 100044717 = **12 strips (10 A + 2 B)**. ❌ The $54.26 eBay 394976725095 listing recommended at 9:57 **never states a count and its main photo shows 8 strips — dropped.** eBay search (Buy It Now, price+ship lowest, read in Chrome 10:03) — listings that SAY 12 in the title:
- **"LED Strips(12) For ELEMENT E4FAA75R WR75UT4210 ONN 100044717 LED75D07A-ZC66AG-06"** — **$36.55, free delivery**, US, seller ledbacklight2022 99.4 % (3.6K) → the **-06 / 30375007005/6** strip version.
- **"New 12pcs LED Strips 30375007007 30375007008 For 100044717 WR75UT4210 E4FAA75R"** — **$42.06, free delivery, free returns**, US, seller famfutr 100 % (6.3K) → the **30375007007/8** strip version.
- Two strip families exist: **30375007005/006 (LED75D07A/B-ZC66AG-06)** vs **30375007007/008 (LED75D07A/B-ZC66AG)**. Read the number on an old strip, then buy the matching 12-strip kit. Either is ≈ $37–42 delivered vs $398 new.

## Soldering? (Jeff 10:02 — "last time the repair man had to solder the strips together in one place")
Checked the Amazon GUANGMING kit (B0FFZRBDFG) product photos in Chrome 10:06: the new strips end in **two bare round SOLDER PADS — no plug connectors visible**. Listing text: "1 Set is 12 strips … 10 A (30375007007) + 2 B (30375007008) … 826 mm, 7 LEDs each, 3 V per bead"; nothing about connectors. ⇒ **Plan on soldering the jumper wires between strips** (2 per joint), which matches the earlier repair. Reuse the old jumper wires/harness. Not verified: how many joints — count them when the back is off.

## 🔑 10:12 — STOP: the strips may NOT be the fault (Jeff: 3rd strip set; repair man charged $250 for ~1 h last time)
Badcaps, read in Chrome:
- **"Onn 100044717 Black screen 75 *Solved"** (EazyBone, 2025-03-31) — THIS model, Jeff's exact symptom (black, faint picture with a light, sound OK): *"The defect is the power board capacitor near the backlight connection … Look for a bulged cap."* ~10 min job: board out, swap the cap. https://www.badcaps.net/forum/troubleshooting-hardware-devices-and-electronics-theory/troubleshooting-tvs-and-video-sources/3605096-onn-100044717-black-screen-75-solved
- Linked 70" onn thread: the part is the **450 V 10 µF electrolytic next to the backlight connector (only one on this TV)**; *"Ive had 15 of them where it was that capacitor … one was the capacitor AND the backlights"*; *"The backlights test fine"*; caps may look flat and still be bad. Healthy strands read **~96 V on an LED tester** (one read 93 V = one LED out). Use a quality 105 °C cap (Nichicon/Rubycon/Panasonic named in thread). https://www.badcaps.net/forum/troubleshooting-hardware-devices-and-electronics-theory/troubleshooting-tvs-and-video-sources/110606-onn-100012588-backlight-issue-solved-70-inch
- Why strips die repeatedly: TVs run LEDs near max current; techs extend life by raising the current-sense resistance (removing one parallel Rs resistor). Generic — NOT a verified procedure for this board; do not do blind.
**New order:** (1) back off, look at / replace the 450 V 10 µF cap by the backlight connector; (2) test strips with an LED tester (~96 V per strand) before buying any; (3) only then the 12-strip kit; (4) run the backlight lower in settings afterwards.

## 10:33 — parts on hand (Jeff)
Jeff has **a whole box of NEW capacitors, incl. 450 V** → the cap swap is **$0**. Pick by the old cap's printing: same µF (forum: 10 µF), ≥ same voltage, 105 °C if available, similar diameter. If no exact 10 µF, check with Claude before substituting. Walkthrough given in chat 10:27 (discharge through a resistor + confirm 0 V; polarity stripe = negative, match the board's shaded half; test before closing).

## 10:38 — Current-reduction mod while it's open? (Jeff)
Read in Chrome: Badcaps "LED Backlight current mod." https://www.badcaps.net/forum/showthread.php?t=61722
- "Overdriven on purpose to limit life" = ONE member's opinion (dskall: *"Max for these leds is 350ma as opposed to 400ma which in my opinion is deliberate"*), not established fact.
- Method that WORKED there: identify the LED driver IC, read its datasheet, and **raise the ISENSE resistor** (between the constant-current PWM MOSFET's source and GND) → 420 mA → ~300 mA, "plenty bright".
- 🔴 **Trap in the same thread:** he first pulled a resistor on the boost converter's **CS** pin — that **INCREASED** LED current. Wrong resistor = the opposite of the goal. **Never do it blind.**
- Alt route: TV service-mode backlight setting (no hardware).
**Plan:** YES, worth doing while it's open — but only after identifying this board's LED driver IC from photos + its datasheet. Jeff photographs both sides of the power board around the backlight connector / MOSFET / small SMD resistors + the driver IC's part number. Claude finds the datasheet and the exact ISENSE resistor + new value. Aim for a modest cut (~15–25 %).

## 11:00 — PARTS LIST (Jeff: "not doing it today but I wanted to get all the parts") — prices read in Chrome
| Part | Status / price |
|---|---|
| 450 V 10 µF 105 °C electrolytic | **ON HAND** (Jeff's box of new caps) — $0 |
| LED backlight tester | **BUY:** TKDMR "LED Lamp Bead TV Backlight Tester … 0-300V 30mA" — **$18.99**, 4.7★ / 766 ratings (Amazon search 10:59). Alt: 0-300V adaptive tester $17.39, 4.5★/380. Tests each strand FROM THE BACKLIGHT CONNECTOR (~96 V healthy) — no need to dig to the strips first. |
| 12-strip kit | **WAIT** — only if the tester fails a strand; read the strip part number then (005/006 vs 007/008). $36.55–42.06 (see 10:05). |
| Current-sense resistor (mod) | **WAIT for board photos** — value + package unknown. If wanted as a hedge: Chanzon 1206 SMD kit, 60 values, 1/4 W — **$9.99**, 236 ratings (may not fit if the board uses 0805 / through-hole). |
| Discharge resistor (few kΩ, ≥5 W), braid/sucker, flux, solder | Jeff's shop stock (assumed — confirm) |
**Buy now: tester $18.99. Everything else is on hand or waits on what the tester/photos show.**
**4K "upgrade" (Jeff 11:00):** nothing inside is upgradeable — the panel's resolution/refresh and the Roku main board are fixed; software updates come automatically. The only real upgrade is running the backlight cooler (the mod above).

## 11:10 — If replacing: biggest picture upgrade (Jeff 11:03). Source: RTINGS "Best Mini LED TVs", **updated Sep 18, 2026**; prices read live in Chrome 09-30
| Tier | 75" model | Price (live) | Why |
|---|---|---|---|
| Budget local-dimming | TCL QM6K 75" | **$848** (Walmart, 09:56; was $999.99) | RTINGS' budget pick until 09-18, 7.8/10 |
| Budget (current RTINGS pick) | Hisense U6SF Pro 75" (Best Buy "U6 … Fire TV 2026") | **Unavailable** at Best Buy 11:08 | deep blacks, anti-glare |
| **Best value jump** | **Hisense U7SG 75" (U7 2026, Google TV)** | **$1,299.99** (Best Buy, was $1,999.99) | very bright, matte anti-glare, 165 Hz |
| Premium | Sony BRAVIA 7 II 75" | **$3,099.99** (Best Buy) | best processing/accuracy |
| Top | Sony BRAVIA 9 II 75" | not shown | RTINGS #1 |
Not an RTINGS pick (unverified quality): Hisense M7 MiniLED Roku 75" — $599.99. Current onn 75" — $398 (no local dimming = the same class as Jeff's set).

## 2026-10-11 1:45 PM — 🔑 BACKLIGHT SPEC READ OFF THE BOARD (Jeff's photos, TV open on the bench)
Silkscreen on the power board beside the backlight connector, photographed by Jeff:
**`LED:100-126V  710MA--790MA`** · connector **`CON302`** · cap **`EC210`** · ground point `GP5` · `C334` nearby.

**Derived topology (arithmetic, from this spec + the kit listing's "7 LEDs each, 3 V per bead"):**
- 126 V ÷ 3 V = **42 LEDs in series per strand**; 42 ÷ 7 = **6 strips in series per strand**
- 12 strips ÷ 6 = **2 strands** — matches the **two connectors** (CON301 + CON302) on the board
- Backlight power ≈ 2 × 126 V × 0.75 A = **~189 W** of the TV's 260 W rating. Consistent.

⚠️ **CORRECTION, same day 2:10 PM — the above was OVERSTATED and the LED-per-strip count is NOT
settled by the board spec.** 6 LEDs × 3 V × 6 strips = **108 V also falls inside 100–126 V**, so the
silkscreen cannot tell a 7-LED strip from a 6-LED one. And the "~96 V healthy strand" figure is from
the Badcaps thread on the **70" onn 100012588 — a DIFFERENT TV** — so claiming "three independent
sources agree" was wrong. What IS solid: **12 strips across 2 connectors = 6 strips per strand**.
🔑 **Use the tester by COMPARING THE TWO STRANDS AGAINST EACH OTHER, not against an absolute number.**
Whatever a healthy strand reads on this set, the bad one reads lower or nothing. That is independent
of which strip variant is installed.

🔑 **And this is why multiple strip versions exist for one TV:** the driver is a CONSTANT-CURRENT
source with a **100–126 V compliance window**. It pushes ~750 mA and the voltage lands wherever the
string needs it. Any variant whose total string voltage falls in that window works electrically.
**So the risk in picking the wrong kit is MECHANICAL, not electrical** — strip length, LED spacing,
and where the solder pads and mounting clips land against the diffuser and reflector.

**Meter expectation corrected:** normal running output at CON301/CON302 = **100–126 V**. A reading
of a few hundred volts only occurs on an OPEN, unloaded output just before protection trips — that
is the symptom, not the target. (An earlier in-chat figure of ~340 V was quoted as if it were the
spec; the board silkscreen supersedes it.)

**Diagnostic consequence:** one dead LED opens a 6-strip strand = **half the screen**, and the
driver shuts BOTH channels. Reinforces the 09-30 verdict: replace all 12, not one.

## 2026-10-11 — FB202 is NOT the mod target (second photo)
Jeff photographed a purple axial part silkscreened **`FB202`**, with **`Q301`** and `M6` adjacent.
**FB = ferrite bead** — a wire at DC with HF loss. It sets no current, has nothing to tune, and
removing it just opens that rail. **Do not touch it.**

🔑 But `Q301` is the useful find: the 300-series is the backlight section, and the Badcaps method
puts the ISENSE resistor **between the constant-current MOSFET's source and GND**. **Q301 is the
likely MOSFET; the sense resistors are the small SMD parts at its source pin.**

**STILL NEEDED to unblock the current-reduction mod (Jeff, while the TV is open):**
1. The small IC near CON301/CON302 — 8–16 pins — **close enough to read the top marking.**
2. **Around Q301** — the small SMD resistors at its pins, close enough to read the codes
   (`R100` = 0.1 Ω, `1R0` = 1 Ω, `0R5`, `R200`…). Often 2–3 in parallel, which is what makes the
   mod a simple "remove one".
🔴 Nothing gets removed before the IC datasheet is in hand — the Badcaps member pulled the boost
converter's CS resistor first and **INCREASED** LED current.

## 2026-10-11 2:10 PM — RESEARCH: how to AVOID the strips, and how to pick them (Jeff's ask)

### A. There are THREE strip variants for this model, not two
| Family | Model marking | Notes |
|---|---|---|
| `30375007005` / `006` | LED75D07A/B-ZC66AG-**06** | eBay ledbacklight2022 $36.55 free ship |
| `30375007007` / `008` | LED75D07A/B-ZC66AG (and **-05** per some sellers) | eBay famfutr $42.06; Newegg $67.64 |
| `261501013121` | visible no. `06-1-75FZ-OD35-12X6-824.6X12-220913` | ShopJimmy $64.99, **OUT OF STOCK** |

🔑 **The third one can probably be ELIMINATED on its date code:** `...-220913` = **2022-09-13**
production. Jeff's set is **S/N HA211230C75005153 (~Dec 2021)**, with board date codes 2021-05-27
(power) and 2021-08-13 (main). That variant post-dates his TV by ~9 months. Note it is also
**824.6 mm / "12X6"**, not 826 mm — a different length AND a different LED count.

⚠️ **Sellers contradict each other on the -05/-06 suffixes.** One Amazon kit (XIMAIACC B0G2XPMHRT)
is sold as fitting **both** `-06` and `-05`; a JOPHANN listing pairs `30375007007` with `-05`; an
AliExpress listing pairs `30375007007` with `-06`. **No manufacturer source resolves it** — these are
reseller cross-references, not documentation. Do not order on a suffix.

⚠️ **Newegg's listing adds a second discriminator:** "there are two versions of this set… this
version uses **12 strips labeled A**" — i.e. one version is **12 × A**, the other is **10 A + 2 B**.
Count the A/B split on the old strips, not just the number.

### B. ShopJimmy's "Version" kits DO partly fingerprint this TV — but not the strips
Version 8 kit lists T-con **`ZBZZ`** and power supply **`514C7001M17`** — **both match Jeff's TV**
(T-con `ZBZZ`, power board label `M17`) — and that kit carries strips `30375007007/008`.
🔴 **But it is NOT proof:** the Version 8 main-board list (M21144/M21153/M22056/M22223/M22189/
515C90100M13/M22233/M22222-MT) does **not** include Jeff's **`M21123-MT`**, and the Element
E4FAA75R "Version 1" kit also uses the **same `514C7001M17`** power board while its matching eBay
strips are the **-06 / 005-006** family. **The boards do not discriminate the strips.** ShopJimmy's
own instruction is just "match the strips shown to the originals in your TV before ordering."

### C. 🔑 WHAT KEEPS JEFF OUT OF THE STRIPS — ranked, cheapest first
1. **`EC210`, the 450 V 10 µF 105 °C cap — $0, already on hand.** The documented fix for this exact
   symptom; the Badcaps member had **15** of them where that cap was the whole repair, and said
   *"the backlights test fine."* Do this first.
2. 🔑 **THE HAND-SOLDERED JUMPER FROM THE LAST REPAIR — $0, and a prime suspect here.** Jeff 09-30:
   *"last time the repair man had to solder the strips together in one place."* The strands are
   **series** circuits, so a cracked or cold joint at that jumper is an **OPEN** — which on a tester
   looks **exactly** like a dead LED, and would send him to buy strips he does not need. The joint is
   several years old and has been heat-cycled every day since. **Inspect and reflow that joint before
   buying anything.** (Reasoning from the series topology, not a cited repair report.)
3. **Reseat CON301 / CON302** and check for browned or burnt pins — $0.
4. **Power board**, if the tester shows BOTH strands healthy: ShopJimmy `514C7001M17` **$59.99 new**;
   Discount Merchant sells a pulled/tested one (TV7001-ZC02-01 / 514C7001M17 / E021M509-**D1**) with a
   30-day warranty, cheaper. `M17` and `M27` are interchangeable; Jeff's board is the **-B2** revision
   of the same `E021M509`.
5. **Single LED bead swap** — only if exactly one bead is dead. ⚠️ **Check the bead rating:** this set
   runs **~750 mA per strand**, so each bead dissipates ~2.25 W. The common generic replacement beads
   sold for TV repair are **3 V 350 mA** — roughly HALF the current this TV needs. Under-rated beads
   will cook. Not priced here; correct-rating beads not yet identified.
   **And this does not save the teardown** — the panel still has to come off.

### D. The honest bottom line on "which strips"
**Nothing on the power board, the main board, the T-con, or the serial number identifies the strip
variant.** It is read off an old strip, or off a panel-assembly sticker if one is visible with the
back cover off. Everything else is a reseller's guess. Since the cap is $0 and the tester works
**from the connector**, the strip question may never need answering.

## 2026-10-11 2:35 PM — ALL FIVE LABELS LOOKED UP (Jeff's photos). Confirmed 75" 4K.

| Label on the TV | What it is | Result |
|---|---|---|
| `JR745R3HA2Y` / `16TH1903MF` | **LCD OPEN-CELL PANEL** | 75" 4K open cell. Also used in **Vizio M75Q7-J03, M75Q6-J03, V756X-J03, V755M-K03**. `16TH1903MF` returns nothing. |
| `ZBZZ` / `K0042HVZZ` / `PTH16A017S` | **T-con** | Confirmed for onn 100044717 **and Vizio M75Q6-J03 / V756-J03 / V756X-J03**. **$15.95–17.99**, in stock several sellers. Alternates: `ZAZZ`, `BG000N700/701`, `338Z054-1`, `PTH6403YF`. ⚠️ **Record correction: this doc previously said `K004HVZZ`. It is `K0042HVZZ`.** |
| `M17/2010088806/13` · `20210527` | **Power board** | = **`514C7001M17`**, built **2021-05-27**. ShopJimmy **$59.99** new; pulled/tested cheaper. M17↔M27 interchangeable. |
| `WC0HR2601` · Huizhou Gaoshengda · Cust. P/N `1196330` · FCC `2AC23-WC0HR2601` | **Wi-Fi/BT module** | Dual band **2.4 GHz (2412–2462)** + **5 GHz (5180–5240, 5745–5825)**. FCC granted 2017-02-21, Class II change 2020-05-29. Sold on eBay as a spare; same module appears in Hisense Roku sets. **Nothing to do with the backlight** — but it is the part to buy if WiFi ever dies. |
| `2227570Q A03` / `LT20210820B` (embossed metal) | internal casting / mould number | **No match anywhere.** `LT20210820B` is a **date: 2021-08-20**, which slots neatly between the power board (05-27), main board (08-13) and final assembly (~Dec 2021). Not an orderable part. |

### 🔴 THE ANSWER ON STRIPS — a definitive NEGATIVE, proven three independent ways
**The open cell and the T-con are shared across brands. The BACKLIGHT TRAY IS NOT.** Same panel
`JR745R3HA2Y`, three different backlight assemblies:
- **Sharp** 75EQ7EA / 75EQ3KA → strips **`LED75D09-ZC46AG-02` / `30375009003`**
- **Vizio** V756-J03 → strips **`LB7502K`**, set of 12, **$79.99** (TvPartsGuy)
- **onn** 100044717 → strips **`30375007007/008`** or **`005/006`**, $36.55–42.06

And the third proof: the **same `514C7001M17` power board** ships in onn kits paired with the
`007/008` strips AND in the Element E4FAA75R kit paired with the `-06` strips.

⇒ **NOTHING on the panel, the T-con, the power board, the main board or the serial number
identifies the strip variant. It can only be read off a strip.** Stop looking for a shortcut —
this is now evidence, not an assumption. Which is exactly why the order of work stands:
**cap (`EC210`, $0, on hand) → reflow the old hand-soldered jumper ($0) → $18.99 tester from the
connector → strips only if a strand actually fails.**

🔑 Incidental: Jeff's set uses **12** strips, which matches the **V756-J03** lineage; the
**M75Q6-J03 uses 16**. And the Vizio-numbered 12-set is **$79.99** against **$36.55–42.06** for the
onn-numbered ones — so the onn part numbers are the cheap path regardless.
