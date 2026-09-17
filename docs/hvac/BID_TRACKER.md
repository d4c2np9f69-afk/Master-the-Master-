# HVAC BID TRACKER — live board

**Last updated: 2026-09-17 09:2x CDT.** Rebuild this from Gmail before trusting it; the state
below is what the mailbox said at that minute, not a guess.

🔴 **JEFF'S STATED DEADLINE IS TODAY, THURSDAY 2026-09-17.** His own request line, verbatim:
*"Please get your number to me by Thursday, September 17."*

**The benchmark every quote is being measured against:** Carrier **48NL-B300603**, 2.5-ton
gas/electric package, R-454B, 995 CFM, **$9,000 delivered** through Daniels (unit $8,200 + $800
extended labour/freon warranty), twist fix and new supply/return flex included. That number is
from the 09-10 round and it is the bar, not a decision to stop shopping.

**Hard requirement on every bid: STAINLESS STEEL heat exchanger.** Deal breaker — the unit sits
outside. If stainless is a factory option, the quote must carry the full model number *including*
the option code (a Ruud RGEAYB must end in **AJA**).

---

## THE BOARD

| Contractor | Contact | State as of 09-17 09:2x | Owed by whom |
|---|---|---|---|
| **Peters H&A** — Tyler O'Berry | `TOberry@petershvac.net` · Office **(615) 757-5497** · Cell **(629) 292-1310** · TN LIC **#81099 MECHANICAL** | ✅ **REVISED PROPOSAL IN, 09-17 09:13 AM — $8,520 unit + $2,750 ducting = $11,270.00** (no printed grand total; arithmetic checks two ways). **STAINLESS in writing twice.** LIFETIME HX + 10 yr parts + 10 yr compressor + **5 yr labour included** (+$500 → 10 yr). Adders: 18" return +$160, TVA rebate −$300. | **THEM** — 3 gaps, below |
| **Goodlettsville H&C** — Bill | `Bill.ghandc@gmail.com` · **615-479-0886** (Candy Faulkner) | 🔵 **ONSITE 09-17, 9:00–10:00 AM.** Jeff confirmed quote expected **this afternoon**. | **THEM** — quote this afternoon |
| **Butler A/C** — Aaron | `butleracservice@yahoo.com` · `Alee772b@yahoo.com` | ⚠️ Out of town until **evening 09-17**, no copier/scanner. Will quote **without the garage duct**. Says branching a duct into the garage is a **code violation** (fume backfeed) and *"we will not be able to do the job"* with it included. | **THEM** — tonight |
| **Hunter** — Mark / Daniel | `info@huntertn.com` | 🟡 Acknowledged 09-16 AM. Numbers due today. | **THEM** |
| **Callon Mechanical** | `service@callonmechanical.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Gallatin H&C** | `gallatinheatingandcooling@gmail.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Chilly Ben's** — Ben | `ben@chillybens.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Star Heat & Air** | `office@starheatandair.com` | ⚪ Sent 09-16 16:10. Silent, no bounce. | **THEM** |
| **Covenant H&C** | ✅ **`office@covenantheatingandcooling.com`** · (615) 829-9699 | ☎️ Jeff called 09-16 (content not recorded). **REACHED BY EMAIL 09-17 15:10** — sent to `info@` + `office@`; the bounce named **`info@` ONLY**, so `office@` was accepted by their Barracuda. **Dead addresses: `ntagel@`, `facebook@`, `info@`. Use `office@`.** | **THEM** — quote |
| **Brown & Son** — Corey | `Corey@hbrownhvac.com` · (615) 325-2624 · 109 S Broadway, Portland TN 37148 | ☎️ **Jeff called 09-16** (content not recorded). `Cory@` (one e) is blocked; **`Corey@` has never bounced**, so it almost certainly landed — silent, not unreached. Follow-up sent 09-17 15:1x. | **THEM** |

---

## 🔴 THE EMAIL PROBLEM — the record was wrong about what is broken

Commit `8daa9d9` (09-16 11:07) says *"Contractor email TO jeff.loewen@comcast.net is bouncing."*
That claim lives **only in that commit message** — grepped 09-17, it is not in `CLAUDE.md` or any
doc, so there is nothing stale to strike out, only this correction to record.
**Measured 2026-09-17 against the actual mailbox, that is not what is failing.**

**All 13 outgoing requests CC'd `jeff.loewen@comcast.net`. Not one Comcast CC bounced.**
What bounced was **outbound Gmail → contractor**, four addresses, three distinct causes:

| Address | SMTP result | Cause |
|---|---|---|
| `ntagel@covenantheatingandcooling.com` | `550 5.4.1 Recipient address rejected: Access denied` | Rejected by their **Barracuda** filter (`d317049a.ess.barracudanetworks.com`) — wrong address or unknown-sender block |
| `facebook@covenantheatingandcooling.com` | same 550 | same |
| `contact@goodlettsvillehandc.com` | Address not found | **Address does not exist.** `Bill.ghandc@gmail.com` works — they replied |
| `Cory@hbrownhvac.com` | 550 blocked | Spelling. `Corey@` did not bounce |

**So this is four bad contractor addresses, not a Comcast fault.**

⚠️ **NOT closed:** the older claim that contractors mailing Jeff's Comcast address bounced weeks
ago is a *separate* event and has **not** been verified — nobody can see inside the Comcast
inbox from here. Do not write it off; do not restate it as fact either.

🔴 **Never re-send to an address that already 550'd — guaranteed to bounce again. A DIFFERENT
address at the same company is always worth one attempt.**

✅ **PROVEN 2026-09-17 15:10, and it corrected my own theory.** I reasoned that two identical
`550`s across two different local parts pointed at a **sender-level block** — meaning nothing
from that Gmail would ever reach Covenant. **Wrong.** The retry to `info@` + `office@` produced
a bounce naming **`info@` only**; `office@` was accepted. So Covenant's filter rejects
**per address**, and three of their four published addresses are simply dead.

**The lesson is the cheap test, not the clever theory:** one send to two candidate addresses
settled in 44 seconds what an argument from the bounce pattern got backwards.

---

## VERIFICATION NOTE

Phone numbers above were looked up **2026-09-17 by web search this session**, per the standing
rule never to state a number from memory:
- **Covenant Heating & Cooling** — (615) 829-9699, 176-A Molly Walton Dr, Hendersonville TN 37075, open 24 h
- **Brown & Son Company** (`hbrownhvac.com`) — (615) 325-2624, 109 S Broadway, Portland TN 37148, Mon–Fri 7:30–4:00 + 24 h emergency

**Jeff dialled BOTH on 2026-09-16.** What was said is not recorded anywhere readable — see the
09-17 note at the foot of this file. The numbers are verified as *published* and **confirmed as
dialled by Jeff**; what they produced is the one thing still missing from this board.

---

## STILL OWED FROM THE 09-10 ROUND — do not lose this

🔴 **The flex diameters in writing, from Daniels.** The revised proposal **deleted** the
*16" flex supply / return*, the *16"–14" reducer* and the *875 CFM* line. That connection work is
the entire reason the $9,000 counts as turnkey. Recorded 09-10 as
*"THE ONLY THING STILL OWED BEFORE SIGNING"*, and it is still owed.

⏳ **Registration clock:** the Carrier lifetime stainless heat exchanger must be registered within
**90 days** of install or it drops to 20 years.

---

## 2026-09-17 — WHAT I GOT WRONG, AND THE GAP THAT CAUSED IT

I put *"call Covenant and Brown & Son"* on the list as owed work. **Jeff had already called both
on 09-16.** I could not see that because **a phone call leaves no trace anywhere I can read** —
nothing has been committed to the repo since `8daa9d9` (09-16 11:07), and Gmail only holds email.

That is the *"a decision Jeff makes in conversation goes into a file THE SAME SESSION"* rule
failing, and the cost landed on the one person who should never have to repeat himself.

🔴 **STANDING FIX: when Jeff phones a contractor, one line goes in this file — who, when, and what
came of it.** A bid process tracked only in email is blind to half of how bids actually get made.

**Emails sent 09-17 15:10** (from `jeff.loewen792@gmail.com`, CC Comcast, both referencing his call):
- Covenant → `info@` + `office@covenantheatingandcooling.com` — ✅ **`office@` ACCEPTED**, `info@` bounced
- Brown & Son → `Corey@hbrownhvac.com` — ✅ **no bounce**

Both carry the full scope and the two PDF links. **Both companies now have the request in
writing.** Absence of a bounce is strong evidence of acceptance at the SMTP layer, not proof a
human read it — chase by phone if nothing comes back.

## The printable sheet

**`bid/BID_COMPARISON.xlsx`** — landscape, fits one page wide, header row repeats on every page.
Rows are Jeff's own spec from the bid letter, columns are the bidders. Yellow = fill in at the
table · blue = already confirmed in writing · red = the stainless heat exchanger, the deal breaker.


---

# 2026-09-17 — PETERS PROPOSAL READ IN FULL (all 3 pages, real text layer)

Extracted from the emailed PDF (`messageFormat: RAW` → decode MIME → pypdf), **in an isolated
subagent so 479 KB of base64 never entered the main session's context.** Word 2016, author
"Gabe Peters", created 2026-09-17 09:11:29 −05:00.

## The money

| | |
|---|---|
| Replacement (Carrier) | **$8,520.00** |
| Ducting modification | **$2,750.00** |
| **Combined** | **$11,270.00** |

🔴 **There is NO printed grand total in the document.** $11,270 is arithmetic, confirmed two
independent ways: `8,520 + 2,750`, **and** the page-3 breakdown — unit w/ pad $6,260 · labour
$2,470 · ducting materials $1,475 · duct seal $325 · misc $350 · permit $95 · t-stat wire $295 —
sums to exactly $11,270. Both sections state the total includes all sales tax.

**Adders, not in that figure:** 10-yr workmanship **+$500** · 18" return **+$160** · TVA rebate **−$300**.

## 🔴 THE TWO TOTALS ARE NOT THE SAME JOB — do not compare them straight

Daniels' **$9,000** = unit + twist fix + new supply/return flex, with 10-yr labour & freon already in.
Peters' **$11,270** ALSO carries three 6"→8" branch upgrades, the 7" garage run, a new 16" return
trunk with sheet-metal 90s, a full mastic duct seal, new sheet metal return panning, microbial
treatment, the **permit**, and six months of filters.

**Like for like on labour term:** Peters needs +$500 to match Daniels' 10 years → **$11,770**,
less the $300 TVA rebate. **Compare scope before price.**

## ✅ What Peters now satisfies that was open

- **STAINLESS STEEL, in writing, twice** — *"HEAT EXCHANGER WILL BE STAINLESS STEEL PER CUSTOMER REQUEST"* and *"LIFETIME HEAT EXCHANGER (STAINLESS STEEL)"*. Jeff's one deal breaker, closed.
- **TN licence #81099, MECHANICAL** — was missing from the first proposal.
- **Labour 2 yr → 5 yr included.**
- **The twist:** *"run the new R/A trunk line directly on one side of the pillars in a strait shot to eliminate the existing cross over/twist"* + square-to-round take-offs **on both return and supply**.
- **UV light and ecobee both installed at no charge**, lamps facing the coil, set-up and programming included.
- **Static pressure recorded at completion.**

## ⚠️ Still owed BY PETERS — three gaps

1. **The 15.2 SEER2 two-stage question is unanswered.** `"15.2"` and `"two stage"` appear **zero** times. Jeff asked for the price difference *and* which Tyler would put in his own house. Neither is in the document.
2. **Gas BTU input vs output not split** — only a single "60,000 BTU" figure. The words *input*, *output* and *AFUE* appear nowhere.
3. **The 16" return TRUNK is still FLEX.** The **90s are** galvanized sheet metal as asked, but the trunk is not. That is the remaining miss against item 4 of the request.

## ⚠️ One contract oddity worth a single question

The *"Notice to Owner"* / *"Consent of Owner"* boilerplate cites **Missouri** lien law —
*"Chapter 429, RSMO"* and *"RSMO 429.013(2)"* — in a **Tennessee** contract. Almost certainly a
template leftover, but it is in the document Jeff would sign.

Proposal dated 9/17/2026, **valid 90 days**, prepared by Tyler O'Berry. Payment due 30 days after
completion; 2% surcharge on card payments of $1,000 or more.
