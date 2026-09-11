# Lucky Mike Smart Stall — Pricing & Business Plan (planning doc)

> Saved so we can pick it up when the page is built. Numbers are **illustrative
> estimates** — Jeff plugs in his real hourly rate and confirmed part prices.
> Companion docs: `BOM_OPTIMIZED.md`, `INTEGRATION_NOTES.md`.

## The core correction (carry this everywhere)
ChatGPT's deck prices ($175–225 "Bronze," etc.) are **parts + a small buffer with
ZERO labor**. Selling at those numbers = donating 6–15 hrs of skilled work per
install. Always price the **installed job**:

> **Installed price = Parts (+10% spares) + (hours × rate) + margin/contingency**

---

## Go-to-market models (3 ways to sell it)

### Model A — Boarder pays (B2C) — one owner, one horse
Jeff sells/installs to an individual horse owner. Simple, but small jobs and Jeff
chases each customer. Fine for the first few / word-of-mouth.

### Model B — Barn owner as a paid amenity (B2B2C) — **RECOMMENDED**
The barn owner buys the systems (her CapEx) and offers **"Smart Stall monitoring"**
as a paid add-on to boarders for a monthly fee. She fronts the cost and recoups it
through fees; Jeff sells her a **multi-stall installed job** (bigger, repeatable)
plus an optional support retainer.
- **Why it's best:** one decision-maker, many stalls at once; she carries billing
  + the customer relationship; recurring revenue exists; Lucky Mike is the on-site
  demo; differentiates her barn / can justify higher board.
- **Barn-owner payback math (illustrative, 6-stall barn):**
  - Installed cost to her ≈ **~$440/stall** for a 6-stall job (see pricing below).
  - She charges boarders **~$20–30/stall/mo** as a Smart Stall amenity.
  - At $25/mo × 6 = $150/mo → **payback ≈ 16–18 months**, then ~$1,800/yr recurring
    at **~$0/mo running cost** (all local). Strong amenity ROI, and a marketing
    differentiator on top.

### Model C — Managed service / revenue-share
Jeff supplies hardware at a discount and takes a small **per-stall/month** platform
+ support fee (he shares the recurring). More income long-term, but Jeff carries
support load + some CapEx risk. Consider once there are several barns.

---

## Labor-loaded pricing (cost-plus → tiered fixed price)

**Cost basis (per stall, essential + 1 camera):** ~$130–170 parts (see BOM).

**Labor (the part ChatGPT ignored):** design/firmware template is built **once** and
reused. Per-install is assembly + mounting + smart-plug setup + ESPHome config
(copy template, set unique IDs) + add to HA dashboard + test.
- **First stall in a barn:** ~6–8 hr (network setup, dashboard, first-time).
- **Each additional stall (same barn):** ~2–3 hr (copy-paste config, same Wi-Fi).
- **Rate:** pick one — suggest **$60–85/hr** for skilled install. Examples use **$65/hr**.

**Worked example — single-stall job:**
~$150 parts + 8 hr × $65 = $520 labor → ~$670 + 15% = **~$770 installed.**

**Worked example — 6-stall barn (Model B):**
- Parts: 6 × $150 = $900 + barn UPS $65 = $965
- Labor: 8 hr (first) + 5 × 2.5 hr = 20.5 hr × $65 = $1,333
- Subtotal $2,298 + ~15% margin/contingency ≈ **$2,640 (~$440/stall)**

**Tiers (computed from cost-plus, sold as fixed prices):**
| Tier | Adds | Indicative installed/stall (multi-stall) |
|---|---|---|
| Bronze | Essential monitoring (temp/humidity/presence/door/leak/cam) | ~$400–500 |
| Silver | + fan smart-plug automation, water level, network UPS | ~$550–700 |
| Gold | + feed weight + history/reports | ~$750–950 |
| Platinum | + GPS halter (cellular hardware; SIM billed pass-through) | $1,000+ /horse |

> Single-stall jobs cost more **per stall** (fixed setup); multi-stall jobs get
> cheaper per stall — bake a multi-stall discount in. Recurring to the customer is
> **$0/mo** (local) except optional GPS cellular (pass-through).

---

## Selling the CFO (Angela) — lead with risk, not gadgets
- **Avoided-loss ROI:** one colic caught early vs. late ≈ **$5,000–10,000 surgery**
  (or losing the horse). Early alerts on a cast/down horse, empty water, heat
  spike = cheap insurance against a five-figure event. CFOs buy insurance.
- **Total transparency:** itemize parts at cost + labor as a real line + **~$0/mo**.
  Don't pad; a CFO trusts the honest sheet over a round number.
- **TCO + payback, not sticker:** ≈$770 once, ~$0/mo vs. commercial equine systems
  ($1,000–3,000+ upfront **and** monthly fees). Undercut + no forced subscription.
- **For the barn owner specifically:** show the payback table above — she evaluates
  it as CapEx vs. recurring amenity revenue + occupancy differentiation.

---

## Business / legal checklist (do BEFORE selling outside the family)
A CFO and a barn owner will both ask about these — and they protect Jeff:
- [ ] **LLC** — walls off personal assets (incl. the house Jeff wired himself).
- [ ] **General liability insurance** (small business policy).
- [ ] **Disclaimer/waiver on every proposal:** "Supplemental monitoring aid, NOT a
      replacement for in-person checks; no guarantee against loss or injury." Live
      animal — non-negotiable.
- [ ] **Boarding-contract addendum (Model B):** the barn's liability flows to
      boarders via her contract; spell out the amenity terms + same disclaimer.
- [ ] **Warranty terms** — e.g., 1 yr parts / 90 days labor; define who eats the
      truck roll on a dead sensor.
- [ ] **Support policy / retainer** — Jeff's post-sale time is a real cost. Cap it
      or sell an annual support plan (also recurring income).
- [ ] **Sales tax / business license** — register; a CFO asks day one.
- [ ] **Who owns the hardware** (Model B/C) — barn owner vs. Jeff; what happens when
      a boarder leaves (unit stays with the stall, not the horse).
- [ ] **Camera data/privacy** — local storage, who can view, no internet exposure.
- [ ] **Cellular SIM (Phase 4)** — billed pass-through; don't absorb recurring.

---

## First move (agreed)
Build **Lucky Mike's stall at parts cost** as the reference install + demo. Get it
running and bulletproof, then use it to pitch Angela (CFO) and the barn owner. Don't
try to profit on unit #1 — it's the showroom.
