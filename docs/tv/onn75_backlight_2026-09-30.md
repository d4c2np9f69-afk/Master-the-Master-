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
