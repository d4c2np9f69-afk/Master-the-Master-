## The Other Papers — lighting, Lucky Mike, inventory, heroes, config trees

This section documents everything at the branch tip (2026-08-16, `origin/claude/time-master-project-liq1jw`) that is *not* the app itself: the lighting/Zigbee planning documents, the queued Lucky Mike "Smart Stall" business, the hardware-inventory and network-map registers, the hero-image style system, and the config trees (`beehive-config/`, `beehive/`, `firmware/`, `_headers`, the disabled GitHub Actions workflow, and `dev.html`). These files are where most of the project's *decisions* — prices, rejections, arguments, and settled questions — actually live. Anything inferred rather than evidenced is marked **INFERRED:**.

---

### 1. Lighting — `docs/lighting/`

Five files (three markdown, two HTML + matching PDFs). Together they record the whole-house smart-lighting project from the 2026-08-06 planning session through the 2026-08-14 living-room install and the 2026-08-16 Inovelli scrap notice.

#### 1.1 `HCC_Lighting_Plan.html` (+ `.pdf`) — THE authoritative plan, "Rev. Aug 13 2026"

Committed `6c90202` 2026-08-13 ("Lighting: printable build plan + wiring/mesh diagrams (HTML + PDF); remove temp fix.txt"). A three-page printable letter-format document, masthead "**Smart Lighting & Zigbee Mesh** — Build plan · wiring · device map — Home Assistant 'Beehive'", "Rev. Aug 13 2026 · Loewen · White House TN".

**Page 1 — "The Strategy — Two Jobs, Two Budgets."** The core architectural decision, verbatim from the doc:

> **Job 1 · Light Switches → Wi-Fi (Kasa)** — Kasa HS220/HS200 run **fully local** in Home Assistant through the `python-kasa` integration — no cloud, no hub, no account needed for on/off/dim. At ~$15 they do the lighting job for a fifth the price of a mesh-grade switch.
>
> **Job 2 · Mesh Range → Zigbee Plugs** — Mesh repeaters do **not** have to be switches. Every mains-powered Zigbee plug is a router. At $8–12 each they extend the mesh *and* replace the four vendor-locked Sylvania plugs that can never enter HA.
>
> **Why not a $46 mesh dimmer:** the switch was only being asked to repeat the mesh — a job a $10 plug does better. Buying them separately costs half as much and solves the Sylvania problem at the same time.

**Shopping list (page 1, with prices):** Kasa HS220 dimmer ×3 for bedroom/kitchen-dining/living room ($15 ea, "2 on hand", $0); optional 4th HS220 $15; Kasa HS200 garage switch $15; Zigbee plug 4-pack (~$10 ea, $40) to replace the 4 Sylvania plugs; 1 more Zigbee plug for the garage mesh relay ($10); 2 Zigbee contact sensors for the garage door (~$12 ea, $24); Haozee CC2652P1 coordinator dongle + USB extension ($0, "ordered"). **Estimated total ~$104**, with the caveat: "Prices are estimates — verify each Zigbee model against its Zigbee2MQTT device page before ordering."

**Room schedule:** Bedroom 9×12 W ProGreen LED (108 W, Kasa HS220, door box only, 2 toggles repurposed) · Kitchen+Dining 9×12 W combined (108 W, HS220, 1 of 3 existing positions; 2 come out) · Living Room 8×12 W (96 W, HS220) · Garage 8× LED not dimmed (96 W, HS200, **2 switch locations**).

**Open decision recorded in a warning box** (still open at tip):

> **Open decision — garage two-location switching.** A single HS200 cannot serve two switch positions; the second position goes dead. Choose one: **(a)** HS210 matched kit so both positions stay live, or **(b)** single HS200 at the garage door and repurpose the kitchen position for something else — the same trick already used on the bedroom toggles. *Decide before ordering.*

**Firmware trap (page 1 note):**

> **Before first power-up:** install the Kasa app and **turn OFF automatic firmware updates before adding any switch.** TP-Link firmware has previously broken local control — and local control is the entire reason these are being used.

**Page 2 — Wiring diagrams** (inline SVGs, print-grade). The bedroom "Reversed Feed, Door Box Is the Origin" three-box chain: panel → DOOR BOX (origin, Kasa HS220, splices for line hot + chain BLACK and all neutrals, load out to 9 LEDs / 108 W) → MIDDLE BOX (old 4-way removed, existing toggle repurposed to switch only its own receptacle) → BEDSIDE (end of run, old dimmer removed, toggle repurposed to its own receptacle, "swap 20 A → 15 A recept.", old feed tap fully removed). Caption: "Bedside was originally the power origin — the feed is reversed so the door box originates. The two old toggles are not blanked off: each now controls only its own box's receptacle." Also kitchen "3 boxes become 1" (two dimmers consolidated to one HS220 for all 9 LEDs, "2 openings freed"), and the garage two-location question diagram ("One HS200 kills the other position. HS210 kit keeps both live — decide first."). Safety warning: breaker OFF, verify dead at *all three* bedroom boxes, confirm neutral at kitchen/living boxes ("assumed, not yet photo-verified" — note this was later closed, see §1.4), grounds never used as circuit conductors.

**Page 3 — Zigbee mesh + device map.** Mesh topology: Haozee CC2652P1 coordinator on Beehive, **channel 25** ("clear of Wi-Fi ch 1") → living-room Zigbee plugs (4× routers, replace Sylvania) → garage plug (router "pushes signal past the wall") → two battery door sensors + future sensors. Teaching caption: "**Mains-powered = router** … **Battery-powered = end device** … This is why adding plugs strengthens the network and adding sensors does not." The two-sensor garage-door design:

> **The garage door gets two sensors, not one.** One reads CLOSED, the other reads FULLY OPEN. With both, Home Assistant can tell the three real states apart: **closed**, **fully open**, and **partially open** — the cracked-for-ventilation position, which a single sensor can never distinguish from wide open.

The page also carries a compact device map (Beehive .66, the beast .194, RE200 AP .196, GaragePC .121, Fire TV .215, B-Hyve .198, mower ESP32 .232; SSIDs `Loewen301` 2.4 ch 1 / `Loewen301-5G` / `LoewenGuest`) and the Tuya table including the settled Sylvania verdict:

> **Settled — do not retry.** The Sylvania plugs are Tuya hardware locked to Sylvania's own app. Smart Life detects them and refuses; HA cannot reach them. Replacement is the fix.

**"Buying Rules — Learned the Hard Way"** (verbatim list): "'Zigbee compatible' is not enough" (Z-Wave ≠ Zigbee); "Check the Zigbee2MQTT device page before buying" (one "supported" dimmer *stops relaying messages for other devices*); "Let cheap plugs carry the mesh, not expensive switches"; "Disable vendor auto-firmware-update before first pairing." Ends with a three-column install checklist (Prep / Per switch / Home Assistant, last item "Logged in inventory").

**Trap for future sessions:** the plan is Rev. Aug 13 — one day *before* the living-room HS220 was actually installed and the SHIP-2.0 firmware discovery (§1.4), and three days before the Inovelli scrap notice (§1.5). The doc's strategy holds, but the shopping list's "2 on hand" HS220 count became 3 on 08-14 (inventory §3.1) and the Zigbee-plug pick was later made specific (THIRDREALITY 4-pack, §3.1).

#### 1.2 `HCC_Floorplan_DRAFT.html` (+ `.pdf`) — the floor plan traced from the robot vacuum

Committed `29c7a1a` 2026-08-13 ("Lighting: first-draft floor plan with device overlay (traced from Sharky LIDAR; guest bed + office unmapped, awaiting Jeff's markup)"). Landscape sheet, masthead "**Floor Plan — Device Overlay**" with a red **"Draft — check me"** badge and rev line "Draft 1 · Aug 13 2026 · traced from Sharky LIDAR". Subtitle: "Base geometry traced from the robot vacuum's map · device positions are my best guess and need your red pen."

It draws the house (bedroom, bathroom, foyer, hall/bath, living room, kitchen+dining, garage) as an SVG with device markers — S = Kasa switch (HS220 door box, kitchen, living, HS200 garage), R = Zigbee plug routers (4 living-room + garage relay + bed lamp), D = the two garage door sensors, H = Beehive + dongle. Guest bedroom and office are cross-hatched: "not mapped — door was closed" ("The vacuum maps only where it can drive… those rooms are guesses, not survey. The garage it has never seen at all."). Footnote: "Not to scale · geometry approximated from the vacuum's LIDAR map."

The sidebar asks Jeff directly: "**Please correct me.** Mark this up and hand it back — I'll redraw it properly," listing what's needed (room positions/sizes, where the garage really sits, guest bedroom/office, which wall each switch is on, missing rooms). And the ambition note: "**Next version can be live.** Once the geometry is right, this same plan can drive the wall iPad — lamps lighting up when they're on, the garage door showing open or closed, and a tap to control anything on it."

**Status at tip:** still Draft 1. The record contains no marked-up return from Jeff — **INFERRED:** the red-pen round trip has not happened yet.

#### 1.3 `bedroom_wiring_plan_2026-08-06.md`

Committed `ac38933` 2026-08-08 ("Log Jeff's smart lighting plan, flag one real issue before ordering"). The box-by-box text version of the bedroom reversed-feed design: door box = origin with the HS220 ("Single-pole, replaces old switch — No S1/S2, no separate module"), splice list, middle and bedside boxes each with "**Existing toggle — repurposed** … Switch OUTPUT → this box's receptacle hot only … No WiFi — dumb mechanical switch," the 15 A receptacle swap at bedside, "Old receptacle-feed tap fully removed." Order line: "Kasa HS220P3 (3-pack: bedroom + kitchen/dining + living room) + Kasa HS200 (garage)." Safety: "Breaker off · verify dead at all three boxes before starting."

#### 1.4 `kasa_smart_lighting_project_2026-08-06.md` — the project summary, kept alive through 08-14

Created in the same `ac38933` commit; updated repeatedly (last touched `09de34b` 2026-08-14). This is the richest lighting record:

- **Final decision line:** "Kasa HS220 (dimmer) / HS200 (non-dim), local HA integration via `python-kasa`."
- **Why Kasa over MOES/Shelly (rejected options with prices):**
  - **MOES WM-105B-M** (already owned): 100 W/gang limit — doesn't fit any single-channel group above 100 W once rooms were combined; "Requires momentary/reset switches — confirmed via GitHub issues and HA community threads that standard toggles cause continuous ramp behavior, not clean toggle."
  - **Shelly Dimmer Gen3:** "works, local HA, keeps existing switches, but ~$35/unit vs Kasa ~$14-16/unit, and needs input-mode config per unit."
  - **Kasa HS220:** replaces the switch entirely, mature local integration, single-pole only — "which matches every room now that they're consolidated to one switch each."
- **The HS200/HS210 flag** (added by the 08-06 cloud session): the garage's two-location circuit "needs the **HS210 kit** (matched pair, WiFi-coordinated) to keep BOTH the kitchen and garage switch positions live; a lone HS200 in a 3-way/2-way circuit makes the other physical switch position non-functional."
- **Ceiling fans closed (Jeff, 2026-08-13):** "**Every ceiling fan is wired independently of the LED circuits.**" Bedroom/office fans are pull-chain; the living-room fan is on its own RF remote. "**a dimmer is safe on all four LED circuits** — the one real hazard in this project (dimming a fan motor damages it and is a fire risk) does not apply anywhere here. Closed." (Future option noted, not planned: RF bridge to bring the living-room fan into HA.)
- **Boxes & wire pulls — done by Jeff (confirmed 2026-08-13):** "**Jeff pulled dedicated LED circuits himself through the attic and installed 2- and 3-gang boxes in every room.**" This *closed* two open items (neutrals confirmed present; box fill fine — "new multi-gang boxes, ample room for the deeper Kasa bodies") and noted spare gang positions exist "so future smart devices drop in WITHOUT another attic trip."
- **✅ Living room installed 2026-08-14:** `light.livingroom_cans` — HS220 at **192.168.1.178**, "wired by Jeff, dimming verified from HA. **Setup took ~2 hours and the network was NEVER the problem.**" Gateway verified clean (DHCP 190 free, MAC filtering off, WPA-2, ch 1, band steering off); 2.4 GHz Mode changed G/N → **B/G/N** during troubleshooting (kept).
- **The SHIP 2.0 firmware discovery — a real trap, written to never be re-litigated:** "**These HS220s ship on NEW firmware** using an encrypted onboarding protocol (server identifies as 'SHIP 2.0', port 80, NOT the legacy port 9999)." Consequences: HA needs **TP-Link account credentials** to add them ("Control is still LOCAL — the account only authenticates the local session; it keeps working without internet"); and "Direct provisioning over the setup AP is NOT possible: all payloads return `error_code 1003` (JSON decode fail) and the handshake is undocumented. **Do not waste time on this again.**"
- **Tool discovered:** the beast has an ASUS USB-AC53 Nano Wi-Fi adapter, radio software-off by default, that "can be turned on via the WinRT Radio API and used to join an IoT device's private setup AP for diagnostics, without disturbing its wired LAN connection."
- **Bonus:** "**HA exposes `switch.<device>_auto_update_enabled`** — the firmware auto-update toggle the Kasa app does NOT show. **Turned OFF for this switch. Do the same for every future Kasa device.**" (HA also exposes overheat sensor, signal level, fade, presets, status LED.)

#### 1.5 `zigbee_dimmer_selection_2026-08-13.md` — the scrap notice. The single most important process failure in this folder

Original research committed `a5c67a8` 2026-08-13 ("Enbrighten 43080 rejected for documented mesh-routing defects, Inovelli Blue selected (dumb-3-way confirmed)"). Then on **2026-08-16** commit `1572b4a` ("Record that Inovelli was SCRAPPED on price - it was never written down") prepended a red banner that must be quoted in full because it is the project's canonical lesson about lost decisions:

> ## 🔴 SCRAPPED BY JEFF — DO NOT PROPOSE INOVELLI AGAIN
> **Jeff rejected the Inovelli Blue on price and says he did so early on:** *"those were scrapped at the freaking beginning — told you I was not paying $120 for a freaking dimmer switch."* ~$60 each / ~$120 for the pair is over his line, full stop.
>
> **This was never recorded until 2026-08-16**, so the inventory and CLAUDE.md both still said "TO BUY: 2" a day later, and a session planned the whole Zigbee mesh around them and pitched them back to him. That is exactly how a settled decision gets re-litigated. **If a decision is made in conversation, it goes in the doc the same session.**
>
> The research below is kept ONLY as the record of why Enbrighten was rejected (documented mesh-routing defects — still valid and still worth avoiding). **The selection at the bottom is dead.**
>
> **Open:** the mesh still needs mains-powered routers, and a budget alternative has NOT been chosen. Do not name one from memory — research real current products and prices in-session, cheapest-first, and include the $0 option (Kasa HS220 ×2 and the MOES module are already ON HAND).

The commit message adds: "Standing lesson: a decision made in conversation goes into the doc the SAME session."

The preserved research beneath the banner:
- **Rejected: Enbrighten Z-Wave 800 toggle dimmer ($39)** — "**Wrong radio.** Z-Wave (908 MHz) cannot talk to the Haozee CC2652P1 Zigbee dongle. Would need a second ~$40 Z-Wave stick + a second ecosystem. Real cost for 2 switches: ~$118 vs $92 Zigbee. Rejected."
- **Rejected: Enbrighten 43080 (Zigbee paddle dimmer)** — officially Zigbee2MQTT-supported, "looked like the value pick. **BUT Zigbee2MQTT's own device page carries two explicit warnings:**" ("may stop relaying messages for child devices"; "will not respond to route update requests after a while"). "Jeff's stated requirement is that switches EXTEND the mesh (garage needs range help). A switch with documented routing defects fails that requirement outright."
- **(Dead) selection: Inovelli Blue 2-1 VZM31-SN (~$46-60)** — Zigbee 3.0 router, clean Z2M page, dumb-3-way confirmed (which would have closed the HS200/HS210 garage question), neutral required (Jeff has neutrals everywhere). "Costs more, but it is the only option that satisfies 'must extend the mesh.'" — **this is what Jeff killed on price.**
- Closing line: "**Lesson: 'Zigbee2MQTT supported' ≠ 'good Zigbee citizen.' Check the device page's warnings.**"

**Trap for future sessions:** as of the tip, the mains-powered mesh-router choice for the *switch* positions is **UNRESOLVED**. Do not propose Inovelli. Do not re-open the Enbrighten. Do not name a product from memory — research live prices, cheapest first, starting from the $0 on-hand option. (Note the THIRDREALITY *plugs* selection in §3.1 covers plug routers, not the wall-switch question.)

---

### 2. Lucky Mike — `docs/lucky-mike/` (the queued Smart Stall business)

Lucky Mike is a horse. The folder is a fully-worked plan for a monitoring product ("Smart Stall™ — Because They're Family.") for his stall, plus the business model to sell it to other barns. **Status: QUEUED — never built.** Per `INTEGRATION_NOTES.md`: "**Status: QUEUED — build AFTER the utilities work and the current docket are finished** (Jeff's instruction 2026-06-30)." All files date to 2026-06-30 commits (`c8ca302`, `e50c9a4`, `857d825`, `fa282f1`, `6c2d8c3`, `4d78cad`) and have not changed since — a month-and-a-half-old parked project at tip.

#### 2.1 The ChatGPT-origin documents (archived, not authoritative)

`Lucky_Mike_Smart_Stall_Project_Master.md` and `Lucky_Mike_Smart_Stall_Project_Bible_v1.0.md` (commit `c8ca302` "Archive Lucky Mike Smart Stall plan + technical review (queued, not built)") are the original plan — 4 phases: Phase 1 Essential Monitoring "$175–225" (2× Tapo C120 cameras, ESP32, BME280, DS18B20, LD2410, HA dashboard); Phase 2 Smart Stall "+$125–175" (fan control, water level, door, leak, UPS); Phase 3 Feed & Analytics "+$75–125" (load cell + HX711, reports); Phase 4 Smart Halter GPS (4 options, Wi-Fi-only through full LTE). Branding: "**Smart Stall™**", tagline "**Because they're family.**", packages Bronze/Silver/Gold/Platinum (the Bible inconsistently says "Elite" — flagged as mistake #6). "Lucky Mike will serve as the demonstration installation for future customers." `README_Project_Files.txt` is just the archive manifest and a suggested folder layout. `design-budget-guide-12page.png` and `lucky-mike-hero.jpg` are the ChatGPT deck image and the hero photo for the eventual app page.

#### 2.2 `INTEGRATION_NOTES.md` — Claude's engineering review of the ChatGPT plan

Verdict: "Good, coherent plan… same architecture as everything else in the app (ESP32 + ESPHome → Home Assistant → app via `/api/states`)… The phased Bronze→Platinum structure is sensible. Keep it." Then **nine numbered ChatGPT mistakes to fix before building** ("do not copy the deck blindly"):

1. **Architecture diagram wrong (page 10)** — it funnels cameras and Shelly plugs *through* the ESP32; they are independent Wi-Fi/HA devices. The ESP32 handles only the wired sensors.
2. **microSD on the ESP32 — drop it.** "Home Assistant is already the historian… SPI conflicts and FAT-corruption risk for zero benefit. Remove from BOM (saves ~$8)."
3. **Li-ion 5200 mAh power bank — drop or redesign.** Redundant with the UPS, and "USB power banks commonly **auto-shut-off** under the ESP32's tiny current draw."
4. **DS18B20 duplicated + misspelled** ("DS1820B/DS1B20" in slides). One probe is enough.
5. **Phase 3 slide's total bar mislabeled "PHASE 2 ESTIMATED TOTAL"** — copy-paste error; the math ($53.86) is right.
6. **Tier-4 name inconsistent** — deck says Platinum, Bible says Elite; "recommend Platinum."
7. **Phase 4 GPS halter — set realistic expectations:** "Wi-Fi-only (Options A/B) gives NO live location off-property"; live tracking requires cellular; "Battery life + weight + sky view are the real engineering challenges"; frame as "genuinely 'future/R&D.'"
8. **"All data stays on your local network" is overstated** — Tapo/Shelly reach their clouds unless locked down. "Fine as a goal, not a guarantee."
9. **Verify parts/prices** — "Shelly Plug Gen4" naming, LD2410 @ $1.99 optimistic; "budget the high end."

**Site facts (confirmed by Jeff 2026-06-30):** "Barn Wi-Fi is strong" and "each stall has a 120V wired receptacle" → plain Wi-Fi ESP32 powered from a $5 USB adapter, fan controlled by a plug-in power-monitoring smart plug (Sonoff S31 / Shelly Plus Plug US) "NOT a hard-wired relay (reverses my earlier note…)". "**Every stall = one identical repeatable module** … an N-stall barn is the same recipe × N — great for productizing."

**App integration plan (when built):** a new nav section "STABLE" (or "LUCKY MIKE") with its own `--a-stable` accent token, built from the Section Kit + graded `.sec-hero` using `lucky-mike-hero.jpg`, live tiles from HA `/api/states`, must pass the light/dark sweep — "It double-purposes as a **customer demo/sales** screen, so keep it presentable."

Closing agreement with Jeff on sequencing: "**Why doing utilities first is the right order (agree with Jeff):** The water/gas/electric utilities work is the *same skill*: ESPHome sensor → HA → app card. Building that first creates the exact reusable plumbing this page needs."

#### 2.3 `BOM_OPTIMIZED.md` — Claude's cost-optimized bill of materials

Guiding rule: "hang cheap sensors off the ESP32's GPIO and use a plug-in smart plug for the fan — don't buy a branded $15–25 gadget per function." Per-stall essential parts table (ESP32 $6, USB power $5, BME280/SHT31 $5–6, DS18B20 $3, LD2410 $5, ultrasonic water $6 or float $2, leak probe $2, reed door switch $1, Sonoff S31 $15 / Shelly $20, camera $35–50, IP65 box $12, misc $8 → "**~$100–125** + 1 camera").

**The "REAL minimum" recalculation (confirmed 2026-06-30):** Bronze essentials only ≈ **$87 single-buy / $69 barn-qty**, +10% spares → "**Use ~$90/stall single-buy, ~$75/stall in barn quantity as the real parts cost.**" Key correction to the deal docs: "the deal-economics docs originally used a padded $150/stall — real floor is ~$90, which *improves* every option's margin (Option 1 take ≈ $410/stall, not $350). Re-lock deal numbers at $90 when Jeff confirms." *(Still un-relocked at tip.)*

**Bulk / on-hand ladder (commit `4d78cad`):** "~$90 one-off retail → **~$63 bulk** → **~$50 bulk + your on-hand boards/wire**" — "The **camera is the floor** (~$33) — it's the one thing that doesn't shrink and you won't have spares of." Barn-level shared buy: one CyberPower 425–600 VA UPS on the router ($55–70), "one blip-proof point beats a battery in every stall." Phase 4 GPS: store-and-forward ESP32+NEO-M8N+LiPo ≈ $25–30 ("No live location off-property"); LTE-M (LilyGO T-SIM7080G) ≈ $35–45 + SIM $1.5–5/mo pass-through. Explicit DROP list from ChatGPT's BOM (microSD, power bank, per-stall UPS, branded single-function sensors). "Why this is the CFO story: … Everything is **local to Home Assistant → $0/month** … a clean 'no subscription' pitch."

#### 2.4 `DEAL_OPTIONS.md` — the money (locked to Jeff's numbers, commit `fa282f1` 2026-06-30)

Locked inputs: parts **$90 single-buy / $75 barn-qty**; **$50 flat trip charge**; build/install labor **$300/stall recommended** ("Claude's recommendation — Jeff's to adjust", ~6 hr; ~$200 each additional stall); **$40/mo** boarder fee. Single-stall economics: "**No single-stall scenario loses money.** Question is just: ~$350 now, or ~$40/mo rolling."

The fork the whole document turns on:

> ⭐ **THE KEY DECISION: who keeps the $40/mo?** The same $40 can't be kept twice.

- **Option 1 — demand-triggered install** (barn keeps $40): ~$440/stall installed (round $450); Jeff's take ~$350 over parts for ~6 hr (~$58/hr); additional stalls ~$275 (take ~$200); 6-stall barn ~$1,815 revenue → ~$1,335 take (~$67/hr); 5-yr/stall ~$350; risk ~none.
- **Option 2 — financed** same $440 over ~12 mo, Jeff holds title.
- **Option 3 — Jeff keeps the $40/mo:** charge ~$140 at install (parts + trip), payback ~10 weeks, 5-yr/stall ≈ **~$2,060 net** — but "highest [risk] — CapEx, churn/vacancy, collection, and you **own ongoing support**."
- **Split $25 Jeff / $15 barn:** Jeff ~$1,160 net / 5 yr; barn $900 pure amenity profit.

Recommendation: "1. **Lucky Mike (unit #1): build at parts cost** (~$90) — it's the demo, not a sale. 2. First real installs: Option 1 … 3. Once proven: the Split." And the human line at the bottom:

> Solo, almost-60 reality: recurring = a support obligation that never sleeps. Option 1 keeps it simple and fun; grow into recurring on purpose, not by accident.

#### 2.5 `PRICING_AND_BUSINESS.md` — labor-loaded pricing and the legal checklist

"The core correction (carry this everywhere): ChatGPT's deck prices ($175–225 'Bronze,' etc.) are **parts + a small buffer with ZERO labor**. Selling at those numbers = donating 6–15 hrs of skilled work per install. Always price the **installed job**: Installed price = Parts (+10% spares) + (hours × rate) + margin/contingency." *(Note: this doc still uses the older ~$150 parts basis — the $90 re-lock from the BOM was never propagated; treat DEAL_OPTIONS as the newer numbers.)*

Three go-to-market models: A (boarder pays, B2C), **B (barn owner sells "Smart Stall" as a paid amenity, B2B2C — RECOMMENDED**, ~$440/stall installed for a 6-stall job, she charges boarders ~$20–30/mo, payback ≈ 16–18 months, then ~$1,800/yr recurring at ~$0/mo cost), C (managed service/revenue-share). Labor: first stall 6–8 hr, each additional 2–3 hr, suggested rate $60–85/hr (examples use $65). Worked examples: single stall ~**$770 installed**; 6-stall barn **$2,640 (~$440/stall)**. Tier table: Bronze ~$400–500/stall, Silver ~$550–700, Gold ~$750–950, Platinum $1,000+/horse.

**"Selling the CFO (Angela) — lead with risk, not gadgets":** "one colic caught early vs. late ≈ **$5,000–10,000 surgery** (or losing the horse)… CFOs buy insurance." Itemize honestly, TCO vs commercial equine systems ($1,000–3,000+ upfront **and** monthly fees).

**Business/legal checklist "do BEFORE selling outside the family"** (all unchecked at tip): LLC ("walls off personal assets (incl. the house Jeff wired himself)"), general liability insurance, mandatory disclaimer ("Supplemental monitoring aid, NOT a replacement for in-person checks… Live animal — non-negotiable"), boarding-contract addendum, warranty terms ("who eats the truck roll on a dead sensor"), support policy/retainer, sales tax/business license, hardware ownership ("unit stays with the stall, not the horse"), camera privacy, SIM pass-through.

First move (agreed): "Build **Lucky Mike's stall at parts cost** as the reference install + demo… Don't try to profit on unit #1 — it's the showroom."

**Traps for future sessions:** (a) the whole thing is queued behind utilities — do not start building it unprompted; (b) three docs carry three parts-cost bases ($150 padded / $90 confirmed / $50 marginal) — DEAL_OPTIONS + BOM ladder is the current truth, and the "$90 re-lock" of deal numbers is still pending Jeff's confirm; (c) fix the nine ChatGPT errors before reusing any of the original deck.

---

### 3. Inventory — `docs/inventory/`

#### 3.1 `HCC_INVENTORY.md` — the master hardware register

Created `880addb` 2026-08-13; last touched `1572b4a` 2026-08-16. Opens with Jeff's standing order, verbatim:

> **Standing job (Jeff, 2026-08-13):** *"make sure we stay on top of the inventory that's coming in, what we buy from now on... really make sure that we're adding to the system rather than taking away from it. It's all got to be tracked meticulously."*

Header rules: every session that buys/receives/installs/retires/repurposes hardware updates this file; a phone-readable copy lives at `iCloudDrive/HCC Inventory.md` and must be kept in sync. Status legend ORDERED → ON HAND → INSTALLED, plus RETIRED/RESALE. Maintenance rules at the bottom: "**Log at order time**, not arrival"; "**Nothing gets bought twice** because nobody checked this file. Check here first."; "**Retired ≠ deleted**"; "**Wrong-variant purchases get flagged loudly** … *verify the protocol variant in the listing before ordering*"; "Sync the iCloud copy after every edit."

**Zigbee layer (all photo-confirmed arrived 2026-08-15, with exact prices):** Haozee CC2652P1 dongle **$8.92** (coordinator, Z2M not ZHA, USB extension on hand); Tuya/Excellux door-window sensors ($9.58 ×2 packs, $6.39 Coolo 2-pack, $2.79 single); leak sensors (Haozee $5.09 ea ×2, Gleco probe-cable $4.40, Gleco **Z2M-only** TZ-SJ-SD_E $4.62 — "⚠️ no ZHA — this locked the Z2M decision", Excellux $6.19); and one mistake kept as a warning: "⚠️ Tuya **WiFi** water sensor (Qianhong 'WiFi-Shuijin-1') $5.68 — NOT Zigbee — wrong variant. Smart Life or shelf." Standing constraint in bold: "**NOT UNBOXED — Jeff's order: nothing gets set up until the camera/alert pipeline is verified.** Setup day, first moves: disable any auto-firmware-update BEFORE first pairing (the Kasa rule); pick the Zigbee channel deliberately…; dongle on its USB extension cable, away from USB3 ports." Also: "**Mesh status: zero routers.**" — every device on hand is battery-powered; the CC2652P's ~50 direct children is "the reason not to swap to a ZBDongle-E, decided 2026-08-13."

**Lighting rows:** Kasa HS220 ×2 confirmed on hand (living room assigned; #2 bedroom or spare); the struck-through **Inovelli row** — "**🔴 SCRAPPED — DO NOT BUY (Jeff, on price)** … *'I was not paying $120 for a freaking dimmer switch.'* Recorded 2026-08-16 after a session re-proposed them. A budget router/dimmer alternative is still UNCHOSEN" (old kitchen/garage assignment plan kept only for wiring context); Leviton Decora E5603-SW 3-way dumb (companion/spare); GE UltraPro paddle (bedroom repurposed-receptacle position); **MOES module ("the beige box")** assigned to the single ~12 W LED over the kitchen sink ("finally a load it fits", needs a MOMENTARY push-button); Lepro 14 W downlights "**SPARES ONLY** — replacements… NOT expansion (Jeff 08-13)". Mesh geometry correction from Jeff: "kitchen is the FARTHEST point needing mesh; living room is ~12 ft from the dongle. Router priority is therefore kitchen first — not living room as originally assumed."

**Other sections:** wiring consumables from bin photos ("no purchases needed for install work" — 12/2 NM, Wago kits, boxes, multimeter, etc.); irrigation valves (zone-1 Orbit replacement for the diaphragm leak "~3.8 gal/hr, confirmed by meter"); mower ESP32 (fw 1.4.0, "OTA-ready pending private hosting"; spare ESP32 "TO ORDER (~$9) — Jeff committed 08-11"); garage door (SONOFF MINI-D on hand; the 2-contact-sensor CLOSED/OPEN/**PARTIAL** plan; "MyQ hub + sensor — RESALE — eBay when Jeff gets to it"); MoCA adapter pair shelved because garage WiFi measured adequate ("mean −71.5 dBm, worst −76, zero buffered uploads ever"), with a deploy trigger ("if the Matter garage relay feels laggy → MoCA backhaul + AP"); ISP confirmed by photo 08-13 (AT&T Fiber BGW320-500 — "The old Xfinity notes refer to Jeff's *email/mail*, not current internet service").

**The Sylvania saga (2026-08-13 section):** 4 living-room lamp plugs, "ON HAND, working, but VENDOR LOCKED — cannot enter Home Assistant." Tuya hardware (port 6668 confirmed) at .199/.200/.202/.205, but "Sylvania locked the product ID so ONLY the 'SYLVANIA Smart WiFi' app accepts them. Proven 08-13: Smart Life DETECTS a reset plug then rejects it… Only remaining route = LocalTuya with hand-extracted local keys. NOT attempted, not worth it. **DECISION: replace with Zigbee plugs when the dongle arrives.** … DO NOT re-attempt the Smart Life path — this is settled."

**Zigbee mesh plugs — SELECTED 2026-08-14:** "**BUY: THIRDREALITY Zigbee Smart Plug 4-Pack — ASIN B09KNHWF7L (~$50).**" Z2M page 3RSP019BZ verified clean; "Tested better range than SONOFF S40 Lite (+5 ft through 2 walls) and zero dropouts over 14 days." Two loud traps: "**⚠️ SHIPS IN BLE MODE — must be manually switched to Zigbee mode before it will pair.** Out of the box it looks dead to the coordinator." And the lookalike warnings (THIRDREALITY "M3" B0FJRNW7YS is Matter-over-WiFi; SONOFF S40 Lite exists in both Zigbee B09XMH3X3G and WiFi B09LV7K4DH under the same name) with the rule: "**'Requires a hub' = the Zigbee one. 'No hub required' = WiFi, useless for the mesh.**" Quantity needed: 5. *(No ORDERED row exists for these plugs at tip — **INFERRED:** they were selected but not yet purchased.)*

**Order 2026-08-14 (~$33.83, arrived 8/15):** Orbit 57280 3/4" FPT valve $13.58 (intended master valve); **Kasa HS220, Amazon Resale "USED - Mint," $13.86** (3rd dimmer — "bedroom, kitchen/dining, living room now all covered"); Leviton 3-gang plate $1.82; Leviton F-connector insert $4.57. With the used-switch trap: "**⚠️ The HS220 is USED/refurb.** Before install: FACTORY RESET it (hold the button ~10 s…) so it is not still bound to the previous owner's TP-Link account, THEN disable auto-firmware-update, THEN pair. A used smart switch that is still claimed will silently refuse to pair."

**Backflow / irrigation connection — 2026-08-15:** the wall-stub valve turned out to be "a plain Orbit valve with a **solid jar-top bonnet — no vent openings**… NOT a backflow device. The system has been running with **no backflow protection at the point of connection.**" Decision 8/15: buy an **Orbit 3/4" electric anti-siphon valve ($18.34)** — master valve + backflow in one body; the 57280 becomes the spare zone valve ("not wasted… a failed zone-1 diaphragm is exactly what caused the ~88 gal/day leak found 2026-08-13"); the T&S B-969 1/2" AVB on hand is "too small — 1/2" chokes the 3/4" line"; **Orbit 51059 ($18.49) was looked at and NOT bought**. Install rules recorded (vent dome up, critical level 6" above highest head, ≤12 h continuous pressure). And two brutally honest paragraphs: "**Honest limit, unchanged by any option considered:** the six zone valves are shutoff valves DOWNSTREAM of an atmospheric breaker, which the standard does not strictly permit. The by-the-book fix is a pressure vacuum breaker (ASSE 1020, ~$80-150) **plus annual testing by a licensed tester** — which is exactly the utility attention Jeff is avoiding. **Decision made knowingly.**" And the replacement strategy: "an AVB fails SILENTLY… So swap the cheap valve on a schedule rather than pay ~9x for bronze. Target: spring startup, every 1-2 years. **TODO: add a yearly HA reminder**." *(TODO still open at tip.)*

#### 3.2 `NETWORK_MAP.md` — the LAN census and rename layer

Created `4dc9336` 2026-08-13 ("full device census from the BGW320 + tonight's gateway changes"); last touched `f735771` 2026-08-14. Premise: "The BGW320 cannot rename devices — … **this file is the rename layer**" and the authoritative label for every live device.

**Gateway config (Jeff-approved changes 08-13):** 2.4 GHz `Loewen301` channel **pinned to 1**; 5 GHz renamed **`Loewen301-5G`**; band steering disabled (intended); Zigbee planned on **channel 25** (max separation from ch 1); fixed allocations .66 Beehive and .215 Fire TV. Standing note: "The 2.4 channel is PINNED (1). If WiFi congestion ever appears, re-evaluate here **and** check the Zigbee channel before moving it."

**The clean census** (after "Clear and Rescan," 80+ stale entries purged) maps every IP: .66 Beehive (HA on Beelink J45), .196 RE200 wired AP, .194 **THE BEAST** ("CodeProject.AI host, Claude coworker machine"), .215 Fire TV, .164 Angela's work computer (with the standing warning: "Both of Angela's work machines run corporate VPN + firewall — they take a LAN address but tunnel all traffic and won't answer local probes; **silence is NORMAL, never troubleshoot it**"), .197 MyQ hub ("⚠️ UNPLUG + reset for eBay" — still online at census time), .232 the mower box ("confirmed 08-13 by 5-min heartbeat timing"), .176 JeffsLapTop (Acer Aspire E5-576, i3-8130U — "AVX-capable — could host AI workloads unlike B570/GaragePC"), .173 the Lenovo B570 wearing the hostname "DellMasterBed" inherited from a retired Dell, etc. Remaining unknowns are explicitly marked: "**Every (?) row is a question only Jeff can answer.**"

**Detective work worth remembering:**
- "**.171 'Nest Protect'** — ❌ NOT a smoke alarm… **Angela's bed-lamp Tuya socket with a fake hostname** — proven by unplug test (down, held 60s+, at 14:50). Cheap Tuya firmware self-reporting a fake hostname. **There is NO Nest hardware in this house.**"
- "**Tuya endgame — FULLY SOLVED 2026-08-13**": .171 Angela's lamp (unplug test), .231 **Sharky** the vacuum ("off-switch test, 15:03 — the 'Linux' unknown all along"), .209 hot-water pump socket, .195 remaining Tuya socket, .224 Jeff's bed lamp, .170 garage fan, .199/.200/.202/.205 the 4 Sylvania plugs (Tuya port-scan; the earlier Echo Dots guess was wrong — "a monitor watching the wrong IPs"). "Every fake-hostname mystery on the network is now identified."
- Zmodo cameras: "ALL DARK 08-13… the live .207 was found ON THE BACK DECK plugged in with the covered TV — unplugged by Jeff, factory-reset pending, eBay pile… Privacy issue closed."

**Extender fleet (08-13 late):** RE200 converted to wired AP ("Login lesson: its 2018 login page fails SILENTLY when the request rides a flapping wireless link — every 'wrong password' was really a dropped link. Wired access worked first try."). Generic no-name "Wireless-N Repeater": "**RETIRE.** … pure airtime pollution next to the new wired AP." D-Link DAP-1520: "**RETIRE — no Ethernet port, conversion impossible** (Jeff spotted the disqualifier himself). eBay-able." (commit `a43adc4`).

**Gateway changes 2026-08-14** (the Kasa-join saga's network side): 2.4 GHz Mode G/N → **B/G/N** ("purely permissive"; everything reconnected fine); **Guest SSID `LoewenGuest` DISABLED** ("Jeff confirmed nobody uses it. One less broadcasting network and one less entry point."); confirmed-good-and-left-alone list (WPA-2 not WPA3 "would break older IoT", ch 1 fixed, 20 MHz, WPS off, band steering off). Final suspect note for the then-unjoined Kasa: "Prime remaining suspect is the Kasa app offering **Loewen301-5G** in its network picker — the switch cannot see 5 GHz, so it accepts credentials and then hunts forever. Must be Loewen301." *(The lighting doc confirms it did join by 08-14 at .178.)*

**Trap:** the lighting plan's page-3 device map (Rev. Aug 13) and NETWORK_MAP disagree in small ways (e.g., .194 labeled "The beast — main PC" in one, "301Server (?)" then "✅ THE BEAST" in the other); NETWORK_MAP's clean census is the authority.

---

### 4. Heroes — the visual identity system

#### 4.1 `HERO-STYLE-GUIDE.json` (repo root)

Committed `278a78e` 2026-06-24 ("Add HERO-STYLE-GUIDE.json — complete image spec for all 4 hero sections"). A machine-readable art-direction bible: `"style_name": "Premium Estate Command Center"`, `"visual_identity": "luxury residential cinematic realism"`. Codifies the golden-hour rule ("time_of_day: golden hour (primary rule)"; mood "calm, expensive, cinematic, aspirational"), composition (rule of thirds, "one dominant subject per hero image", negative space "reserved for UI overlays or app text"), environment ("grass: deep emerald, striped, high density, no patchiness"; Leland pines as a "dense living wall… zero visible gaps… ~20ft visual impression"), palette ("deep green, warm gold, charcoal shadows, brick red accents"), and the avoid list ("cartoon styling, over-HDR look, over-saturated neon greens, inconsistent lighting between assets"). Final rule: "Every generated hero image must look like it belongs to the same premium smart-home / landscaping command center application suite."

It also embeds the four full generation prompts (yard / home / weather / irrigation). The yard prompt is notable as a self-portrait of the project: "a confident middle-aged homeowner in a dark LawnCareHive t-shirt kneeling beside a red Toro TimeMaster 21200 30\" walk-behind mower… Title: 'YARD COMMAND CENTER APP' | Subtitle: 'MOW SMARTER. TRACK EVERY CUT.'" The home prompt: "brick ranch-style house exterior at golden hour… Title: 'HOME COMMAND CENTER APP' | Subtitle: 'MANAGE · MAINTAIN · MONITOR' | Tagline: 'Everything. In One Place.'"

#### 4.2 `docs/hero-master-grade.md`

Committed `ebedb85` 2026-06-28 ("docs: add hero master-grade reference (matches shipped module)"). Documents the shipped uniform color grade: "Apply ONE cinematic golden-hour color grade to every hero image so the whole app looks like one film stock. Do **not** replace image assets or change overlays/typography." Mechanism: `applyHeroGrades()` runs on init, adds `.hcc-hero-grade` (`filter: brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg)`) to every hero `<img>` inside `.house-hero`/`.sec-hero`/`.hcc-hero`, and `.hcc-hero-vignette` to the container. New sections inherit automatically — "no per-hero CSS."

A genuinely useful CSS gotcha is preserved: "the vignette is on the **container** (`::before`), not the `<img>`. An `<img>` is a replaced element and does not render `::before`/`::after`, so an image-level vignette would silently do nothing." Art-direction rules: "Weather hero was the calibration reference"; "Do not swap or regenerate hero images to fix tone — the grade handles tone"; "To shift the look, change the shared `.hcc-hero-grade` values once… Never add a per-hero `filter:`."

#### 4.3 `dev.html` — the Hero Consistency Audit page

Committed `3509c74` 2026-06-28 ("Heroes: stronger unified grade + add /dev.html consistency audit"). A standalone diagnostic page ("🎬 Hero Consistency Audit") that renders the five hero images (Home/Weather/Irrigation/Yard/Climate) with a mirrored copy of the live grade, then reads the *computed* CSS filter and overlay via `getComputedStyle` and emits a copyable JSON block: "If cssFilter is identical across all heroes, the grade is uniform." Its purpose is to let a session verify grade uniformity from a phone screenshot/JSON paste.

**Trap:** `dev.html` hard-codes its own `--hcc-hero-filter` value (`brightness(.80) contrast(1.20) saturate(.82) sepia(.22) hue-rotate(-6deg)`) with the comment "Keep these in sync if the app grade changes" — and that value does **not** match `hero-master-grade.md`'s documented `brightness(.92) contrast(1.14)…` values. It also references `images/hero-home.jpg` and `images/hero-climate.jpg`, which do not exist in `images/` at tip (the dir has `hero-home-dusk.jpg` and no climate hero). **INFERRED:** dev.html reflects a later, stronger grade iteration and/or has drifted from the shipped module — treat `index.html`'s actual CSS as the truth, `dev.html` as a possibly-stale audit tool, and reconcile before trusting either doc's numbers.

#### 4.4 `docs/home-theater-ai-plan.md` — camera AI + home theater (living doc)

Created `dfaa88f` 2026-07-10; GPU confirmed `71a8cae` 2026-07-10; last updated `c13f101` 2026-07-14. Opens with Jeff's goals (2026-07-09), "**with a hard NO on subscriptions** (no Blink fee, no Zmodo fee, no per-month anything — he already pays for Claude/Clyde, Nabu Casa, and the domain)": premium camera tiles (done), Blink clip review in-app, alerts that say **what** triggered (person/car/animal/package), alert pop-up on the TV, and "top-of-the-line home theater with HA driving it all — seamless, no 'cluster of shit,' no constant resets."

Hardware division: Beehive (Beelink J45, .66) — "weak Pentium, no GPU… **Keep it PURE HA.** Do NOT put media/AI on it." The beast (.194) — "**the designated AI + media brain**": 6-core CPU, ~2 TB storage, **GTX 1050 Ti 4 GB VRAM (confirmed via `nvidia-smi` 07-09)**, Windows, runs 24/7, also runs Clyde. Settled detection plan: **CodeProject.AI Server on Windows** (snapshot object detection — "no RTSP needed, fits Blink") + optionally LLM Vision / free Gemini tier; "Frigate/blinkbridge NOT needed for this path."

**Phase 2 history — a decision reversal documented honestly:** "**Phase 2 — SUPERSEDED (07-14, Jeff's call): Fire TV + `alexa_media_player` kept as the real TV pop-up path, not Kodi.**" The original 07-10 plan routed TV alerts through Kodi on the beast; in practice the 07-11 session built the ADB-paired Fire TV route, which went silent for 3 days (root cause: "CodeProject.AI silently not restarting after a reboot, now fixed with delayed-start + failure-recovery"). Jeff chose 07-14 to keep the Fire TV path. "**Kodi was installed on the beast but never finished** (web remote-control never enabled, never added to HA, launched once for 3 minutes total) — leave it installed/unused… `docs/beehive/media-center-setup.md` describes the Kodi route that was NOT taken; treat it as reference/superseded, not a live setup guide."

Honest limits recorded: DRM apps may be resolution-capped on a PC; "Apple TV = no clean pop-up overlay"; Blink is snapshot/event with inherent delay. Division of labor: "Claude (cloud): app-side… Owns all app code. Clyde (beast) + Jeff: beast-side… Clyde treats app code as READ-ONLY."

---

### 5. The config trees

#### 5.1 `beehive-config/` — snapshot of the live HA configuration

Committed `39c1194` 2026-08-01: "Add live HA config snapshot (beehive-config/) as disaster-recovery backup." Five files; `scenes.yaml` and `scripts.yaml` are **0 bytes** (empty on the live instance too — scripts live inside the package file instead).

- **`configuration.yaml`** — minimal core: `default_config:`, packages loader (`!include_dir_named packages`), the Barn zone (lat 36.716949, lon −86.65295, 150 m, `mdi:barn`) and Work zone (Nashville, 100 m), the **PiPup** `rest_command.pipup_notify` (POSTs to the Fire TV at `http://192.168.1.215:7979/notify` with a 480-px image — the TV picture-in-picture alert path), six `codeproject_ai_object` image-processing entries (one per Blink camera: 301_backyard, 301_driveway, 301_front_doorbell, front_right, back_left, garage; server 192.168.1.194:32168, confidence 60, targets person/vehicle/animal, annotated frames saved to `/config/www/ai_snapshots/`), and CORS allowing `https://loewenhome.com`, `www.loewenhome.com`, `toro1-5rz.pages.dev`.
- **`automations.yaml`** — the UI-managed automations, each with a self-documenting description: **HCC Watchdog** (Blink/Fire TV/Mercedes unavailable 5+ min → phone alert "instead of it failing silently for hours"); **Auto Launch Sling on Fire TV Wake**; **Recorder Down Watchdog** ("the exact failure that silently broke utility bill tracking 07-02 to 07-28"); **Blink Auto-Heal** (reloads the Blink config entry seconds after the known upstream `blinkpy` LoginError crash, "tracked in home-assistant/core#176836"); **AI Camera Popup on Fire TV** via PiPup ("pushes the actual annotated frame that triggered the detection (not a fresh/later snapshot)… instead of taking over the whole TV. Replaces the old full-screen-switch approach per Jeff's request"); **Blink Periodic Health Reload** (every 15 min, because the error-triggered heal "only fires on the FIRST occurrence of a given error message per HA session"); **Angela Arrived at Barn** ("Zone real coordinates captured live 08-01 as she actually arrived") and **Arrived at Work** (both keyed off the Mercedes GLE's GPS "since her phone doesn't reliably report location"; work address recorded: 150 4th Avenue North Suite 1700, Nashville, TN 37219); **Possible Water Leak (Idle Flow)** (flow >0.05 gal/min for 30 min while away or 1–5 am with all irrigation zones off — "built 08-01 after confirming the water meter/pit radio are healthy, not faulty"); **Morning Digest** (7 am summary of weather, Sharky, GLE fuel/lock/odometer, water/gas reporting health, and a note if Blink self-healed in the last 24 h — with the honest removal of the notification count because `states.persistent_notification` "has been unreadable from templates since HA 2023.6… it was silently always reporting zero, which is worse than not reporting it").
- **`hcc.yaml`** — the HCC package (`/config/packages/hcc.yaml` on Beehive): mower `input_number`/`input_text` helpers and the `hcc-mower-sensor` webhook (hours only ratchet **upward** — `max` of payload and current, so a rebooted box can never wind the meter back); the `hcc-panic-button` webhook (flash all lights, 30-s panic flag); severe-weather automation; the whole camera-AI chain — "AI Camera Scan on Motion" (maps the six Blink motion sensors to their image_processing entities), "AI Object Detected Notify" (person = critical iOS push with the annotated snapshot, tap-URL into the app's camera page, and a "🔇 Mute 15 min" action button; vehicle/animal = time-sensitive), "AI Notify Mute Action", "AI Show Camera on Fire TV" (ADB pause → show snapshot → home → play; note `initial_state: false` — **shipped disabled**, superseded by the PiPup popup), "AI Arrival Suppression" (mutes all six cameras 10 min when Jeff or Angela arrives "so walking in the door doesn't trigger camera alerts"), "Angela Almost Home", and "Blink Fast Motion Poll" (updates the six motion sensors every 10 s "so AI alerts aren't delayed by the default 5min poll" — alias says 30s, trigger says /10, a small internal inconsistency); Fire TV scripts (Good Night, Resume, **Skip Commercial Break** — 3× keyevent 90 then play, Open Sling, Check Current App); per-camera `input_datetime` mute helpers; the Weather Underground PWS REST sensors (resource URL in `!secret`); `utility_meter` monthly cycles for water/gas; the water-flow derivative sensor; and the **Gas Cost** template embedding the actual tariff math: `((13.44 + therms * 1.235) * 1.05)` with CCF→therms ×1.068.
- **Trap:** this is a *snapshot*, last committed 2026-08-01 for most content. The live Beehive is the source of truth; sessions must not assume this tree is current (e.g., later Alexa/HomeKit work documented in `docs/beehive/*_2026-08-14.md` post-dates it).

#### 5.2 `beehive/` — installers, ESPHome config, custom-component snapshots

- **`install.sh`** (committed `75a7afd` 2026-06-23, "Add complete Beehive brain setup — no Windows required") — the one-command bootstrap run inside the HA Terminal add-on (`curl -fsSL https://toro1-5rz.pages.dev/beehive/install.sh | bash`): installs HACS, writes `/config/packages/hcc.yaml` (an early version of the package with additional irrigation-started, freeze-warning automations and a `hcc_irrigation_stop_all` script that dangerously targets `entity_id: all` switches), patches `configuration.yaml` for packages, installs the ESPHome add-on, downloads `hcc-mower.yaml`, restarts HA. Documents the two webhooks (`/api/webhook/hcc-panic-button`, `/api/webhook/hcc-mower-sensor`).
- **`esphome/hcc-mower.yaml`** (committed `fe1edb8` 2026-06-23) — the ESPHome-based mower firmware **as originally designed**: full sensor suite on an ESP32 DevKit (hall-effect ignition on GPIO27, battery ADC on GPIO34 via 100k/10k divider, NEO-6M GPS on UART, MPU-6050 pitch/roll/vibration, WiFi RSSI, internal temp), Haversine GPS distance integration with a 20 m jump filter, POST to `https://toro1-5rz.pages.dev/api/hours` every 90 s while running plus a 5-minute parked heartbeat. `secrets.yaml.template` shows the expected secrets (WiFi, API key, OTA password), "This file is NEVER committed to git."
- **⚠️ Historical trap:** this ESPHome design was **superseded** by the Arduino firmware in `firmware/mower_hours_esp32/` (§5.3), which explicitly states "**Running: posts nothing**" — the exact opposite of this file's 90-second live posting. The ESPHome yaml also expects different hardware (hall sensor + GPS + RPM pulse counter vs. the shipped vibration-based hour meter). Do not treat `beehive/esphome/hcc-mower.yaml` as the current mower contract.
- **`blink/`** (committed `e830083` 2026-06-25 "bundle all 12 integration files in repo — no GitHub API needed"; patched `f3ae126` and `1f2cdec` 2026-07-03) — a full vendored copy of HA's Blink integration, version string `2026.7.0-hcc-blinkpy257`. The two 07-03 patches record the Blink login fight: a dedicated cookie session to fix the `empty_cookies` login failure, and the blinkpy 0.25.2 → **0.25.7** bump ("the actual fix for 'Login failed'"). **INFERRED:** this folder exists so the patched integration could be installed on Beehive from the Pages site without GitHub access; whether Beehive still runs this exact snapshot is not evidenced at tip.
- **`custom_components/bhyve/`** + **`INSTALL.md`** + **`install-bhyve.sh`** (committed `768cb6a` 2026-06-24, "Build Orbit B-Hyve custom HA integration + fix Cloudflare IP block") — a from-scratch Orbit B-Hyve custom integration, written because, per INSTALL.md: "This custom integration runs on YOUR Home Assistant (Beehive) so it calls the B-Hyve API from your home IP — not from Cloudflare." (The commit title records the origin problem: Orbit blocked Cloudflare's IPs.) Zones surface as `switch.bhyve_zone_N`; "The irrigation section automatically picks up the new zones. No further setup needed in the app." `install-bhyve.sh` wgets the seven files from `raw.githubusercontent.com/d4c2np9f69-afk/master-the-master-/claude/time-master-project-liq1jw/...`.

#### 5.3 `firmware/mower_hours_esp32/` — the canonical mower firmware (at tip)

Committed `a1cfa53` 2026-08-11 ("Put the mower firmware in the repo, credentials extracted"). Three files: `README.md`, `mower_hours_esp32.ino` (51 KB), `secrets.example.h`. The README's opening is the project's most expensive lesson, verbatim:

> **This is the canonical copy.** It lives in the repo deliberately.
>
> For months the hour meter didn't work. The box sent `hours_seconds`, the app read `d.hours`, and nothing converted between them — 5.5 hours of real runtime and 6.3 km of real mowing went unrecorded across five mows. **Jeff was told the sensors were faulty and bought replacement hardware to fix what was a field-name mismatch.**
>
> The reason it went unnoticed so long is structural, not carelessness: the cloud session that owned the server code has **no outbound network** and **could not see this file**. It was writing `functions/api/hours.js` against `CLAUDE.md`'s prose *description* of the firmware, and that description was wrong. Nobody could diff the two halves of the contract because only one half was in the repo. Now both halves are here.

Other hard-won facts recorded there: **the repo is public**, so secrets live in gitignored `secrets.h` — and "**Splitting the source does NOT make the binary safe.** Those strings are compiled into the `.bin` as plaintext. Verified on 2026-08-11 by grepping a real build" (with the extra trap that `strings` isn't installed on Jeff's PC and "returns a silent false 'clean'" — use `grep -a`). Therefore "a firmware image **must never be served from a public URL**, including this project's own Pages site… it is why OTA is written but not yet enabled." Flashing: "**Auto-reset does not work on this board.** Jeff must hold the BOOT button down through the *entire* upload or it fails with `Wrong boot mode detected (0x13)`." Behavior contract: "**Running: posts nothing** … 'A heartbeat followed a live reading' is a state that cannot occur — the server was once built on the assumption it could, and mow history silently never recorded a single mow because of it." Two-way control channel (1.4.0+): commands `zero_tilt`, `clear_track`, `flush_buffer`, `reboot`, `ota`, acked by id; "The box sleeps between uploads and cannot be woken, so a command lands on its next post — up to 5 minutes while parked. That is the hardware, not a bug." Tilt zeroing exists because the enclosure is bolted at an angle ("a level mower read −12.4° / 28.5° and the app's tip-risk warning read CRITICAL in a garage"). Board-swap rules (hours/distance/tilt live only in that chip's flash). The `.ino` header preserves Jeff's own words on the watchdog: "Jeff's words for why this exists: *'I would only push it if it got hung up.'*" Final rule: "This subsystem is the local coworker session's, end to end — see `CLAUDE.md` Rule 13."

#### 5.4 `_headers` — Cloudflare Pages cache headers

Three commits, all during the July stale-cache fight: `173270a` 2026-07-20 ("Fix root cause of recurring stale-cache bug: no-cache service-worker.js"), `70dba84` and `e37a193` 2026-07-21 ("Fix SW cache permanently: registration + CDN-Cache-Control + no-store"); last touched `186025f` 2026-08-15. Content: `/service-worker.js` gets `Cache-Control: no-cache, no-store, must-revalidate` **and** `CDN-Cache-Control: no-store` (so Cloudflare's edge can't serve a stale worker); `/` and `/index.html` get `Cache-Control: no-cache` plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`. **Trap:** this file is the permanent fix for the recurring "Jeff sees an old version on his phone" class of bug — do not remove or weaken it.

#### 5.5 `.github/workflows/deploy.yml` — the disabled workflow that spammed Jeff's inbox

Created `8fdae39`/`1d7cacc` 2026-06-22; **disabled** `ac99b33` 2026-08-06 ("Stop the GitHub Actions failure-email flood: disable the dead deploy workflow"). The in-file comment tells the story:

> DISABLED 2026-08-06. This workflow has never worked — the CLOUDFLARE_API_TOKEN secret does not exist, so every push failed and emailed Jeff (**124 failure notices in one week**). Deploys do NOT go through Actions: Cloudflare Pages' native Git integration watches claude/time-master-project-liq1jw and deploys on push, independently of this file. See CLAUDE.md "Deployment Pipeline". Trigger reduced to manual-only so it can never fire automatically again.

The commit message adds it "was the single largest source of mail in his inbox," and that the file was kept (trigger `workflow_dispatch` only) rather than deleted "so the job definition stays available if the secret is ever added." **Trap:** never re-enable `on: push` here; deploys are Cloudflare-native.

#### 5.6 Other tip-level items in scope

`ls` of the tip also shows: `backups/` (seven `*.2026-06-24.bak` files — pre-refactor copies of index.html, service-worker.js and the API functions from 06-24; historical, not live code), `Toro_TimeMaster_PWA_Package.zip` (the original 2026-05-19 ChatGPT-era PWA package, kept at root), `install-hacs.ps1` / `setup-hcc.ps1` / `windows-scripts/` (Windows-side setup scripts, covered elsewhere in this record), `icons/`, `images/` (the hero set: hero-home-dusk, hero-weather, hero-irr, hero-yard, hero-cameras, hero-car, hero-truck, hero-guardian, hero-lux, util-electric/gas/water, splash-portrait/landscape, mower-marker), `functions/` (the Cloudflare Pages API — another section's subject), and `manifest.json`/`service-worker.js` (the PWA shell). The mower documentation trio in `docs/mower/` (`gps_firmware_handoff_2026-08-10.md`, `gps_firmware_coworker_findings_2026-08-11.md`, `CLOUD_SESSION_TASKS_2026-08-11.md`) pairs with §5.3's firmware and is covered in the mower section of this record.

---

### Cross-cutting traps distilled from these files (for any future session)

1. **Inovelli is dead. Kasa auto-update off, always. Sylvania is settled. SHIP 2.0 needs TP-Link creds.** These four are the "do not re-litigate" list of the lighting project (`zigbee_dimmer_selection_2026-08-13.md`, `kasa_smart_lighting_project_2026-08-06.md`, `HCC_INVENTORY.md`).
2. **A decision made in conversation goes into the doc the SAME session** — commit `1572b4a`'s standing lesson, written after the $120 Inovelli decision was lost and re-pitched to Jeff.
3. **Check `HCC_INVENTORY.md` before buying anything** ("Nothing gets bought twice because nobody checked this file") and log at order time; sync the iCloud copy.
4. **Zigbee purchases: verify the exact protocol variant and the Z2M device page** — the project owns one wrong-variant WiFi sensor ($5.68) and dodged a mesh-breaking dimmer because of this rule. "Requires a hub" = Zigbee; "No hub required" = WiFi.
5. **Nothing Zigbee gets unboxed until the camera/alert pipeline is verified** — Jeff's explicit sequencing order, 2026-08-15.
6. **Lucky Mike is queued behind utilities** (Jeff, 2026-06-30) — plans are complete, nothing is built, unit #1 is a demo at parts cost, and the ChatGPT deck has nine documented errors to fix first.
7. **`beehive-config/` is a snapshot, not the live HA; `beehive/esphome/hcc-mower.yaml` is superseded firmware; `firmware/mower_hours_esp32/` is canonical.** The hour-meter disaster (replacement hardware bought for a field-name mismatch) happened precisely because only one half of a contract was in the repo.
8. **Deploys are Cloudflare-native; the Actions workflow stays manual-only; `_headers` no-cache rules stay.** Both were expensive to learn (124 failure emails; weeks of stale-cache bugs).
9. **Hero look is governed centrally** — one grade in `index.html`, spec in `HERO-STYLE-GUIDE.json`, doc in `hero-master-grade.md`; never per-hero filters, never regenerate images to fix tone. And note `dev.html`'s mirrored filter values have drifted from the doc — reconcile against `index.html` before trusting either.
