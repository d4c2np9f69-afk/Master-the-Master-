# Lucky Mike Smart Stall — Integration Notes & Technical Review

> Claude's engineering review of the ChatGPT-drafted plan, plus how it slots into
> the HCC app. **Status: QUEUED — build AFTER the utilities work and the current
> docket are finished** (Jeff's instruction 2026-06-30). Source docs in this folder.

## Verdict
Good, coherent plan. It uses the **same architecture as everything else in the app**
(ESP32 + ESPHome → Home Assistant → app via `/api/states`), so it integrates with
near-zero new plumbing. The phased Bronze→Platinum structure is sensible. Keep it.

## ChatGPT mistakes to FIX before we build (do not copy the deck blindly)

1. **Architecture diagram is wrong (page 10).** It funnels cameras + Shelly plugs
   *through* the ESP32. They do NOT. Tapo cameras and Shelly plugs are independent
   **Wi-Fi/HA** devices. The ESP32 only handles the **wired** sensors (BME280,
   DS18B20, LD2410, load cell, door, leak, water level). Correct mental model:
   - ESP32 (ESPHome) → wired sensors → HA
   - Tapo cameras → Wi-Fi/RTSP → HA (our existing camera fetch)
   - Shelly plugs → Wi-Fi → HA
   - App reads everything from HA `/api/states` (same as irrigation/cameras/utilities)

2. **microSD on the ESP32 for "history/logs" (Phase 3) — drop it.** Redundant and
   risky. **Home Assistant is already the historian** (its DB stores all sensor
   history; the cameras/NVR store footage). On-ESP32 SD logging adds SPI conflicts
   and FAT-corruption risk for zero benefit. Remove from BOM (saves ~$8).

3. **Li-ion 5200mAh "backup power" (Phase 3) — drop or redesign.** Two problems:
   (a) it's **redundant** with the Phase 2 UPS, and (b) USB power banks commonly
   **auto-shut-off** under the ESP32's tiny current draw — unreliable as backup.
   If on-board battery is wanted, use a proper LiPo + TP4056/charge-management
   board, not a USB power bank. Otherwise the UPS covers backup.

4. **DS18B20 duplicated + misspelled.** It's listed in Phase 1 (correct) and again
   as a temp probe in Phase 3 (duplicate), and the slides spell it "DS1820B/DS1B20".
   Correct part = **DS18B20**. One probe is enough unless we want two zones.

5. **Phase 3 slide total bar is mislabeled "PHASE 2 ESTIMATED TOTAL."** Copy-paste
   error. The math ($53.86) is right; the label is wrong.

6. **Tier-4 name is inconsistent.** Slide deck says **Platinum**; the Bible says
   **Elite**. Pick one (recommend Platinum to match the deck).

7. **Phase 4 GPS halter — set realistic expectations.** ChatGPT glosses the hard
   parts:
   - **Wi-Fi-only (Options A/B) gives NO live location off-property** — it's a
     store-and-forward logger that only uploads when back in barn Wi-Fi range.
     Live tracking in a pasture **requires cellular** (LTE-M/NB-IoT — Options C/D).
   - **Battery life + weight + sky view** are the real engineering challenges:
     continuous GPS drains fast, the pack adds weight to a halter, and GPS needs
     open sky (no fix under a run-in shed). Frame Phase 4 as genuinely "future/R&D."
   - The "+$3–10/mo" cell estimate is plausible with low-data LTE-M (Hologram/
     Soracom) but verify before promising it to customers.

8. **"All data stays on your local network" is overstated.** Tapo and Shelly can
   reach their clouds unless explicitly locked down, and cellular GPS uses the
   carrier network by definition. Fine as a goal, not a guarantee.

9. **Verify a couple of parts/prices.** "Shelly Plug Gen4" — confirm the exact
   current model (Shelly Plug S Gen3 / Plus Plug US). A few prices are optimistic
   (LD2410 @ $1.99; budget the high end of each range).

## How it becomes an app page (when we build)
- New section **"STABLE"** (or "LUCKY MIKE") added to the nav — its own
  `--a-stable` accent token; built entirely from the Section Kit + the graded
  `.sec-hero` (use `lucky-mike-hero.jpg` in this folder). No bespoke markup.
- **Live tiles** (temp/humidity/water/feed/fan/door/UPS/power/activity) pulled
  from HA `/api/states` — same pattern as irrigation/cameras/utilities.
- **Cameras** reuse the existing HA camera fetch already in the app.
- **Phase/BOM tables** → `.spec-list` / simple kit-styled tables; **budget tiers**
  → card kit. Must read clean in BOTH light and dark (run `scratchpad/sweep.js`).
- Branding on the page: **Smart Stall™ — "Because They're Family."**
- It double-purposes as a **customer demo/sales** screen, so keep it presentable.

## Why doing utilities first is the right order (agree with Jeff)
The water/gas/electric utilities work is the *same skill*: ESPHome sensor → HA →
app card. Building that first creates the exact reusable plumbing this page needs.
