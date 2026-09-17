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
| **Peters H&A** — Tyler O'Berry, Manager/Sales | `TOberry@petershvac.net` · Office **(615) 757-5497** · Cell **(629) 292-1310** · 208 Louise Ave, Hendersonville TN 37075 | ✅✅ **REVISED PROPOSAL RECEIVED 2026-09-17 09:13 AM CDT** — attachment `JEFF LOEWEN REPLACEMENT CARRIER WITH DUCTING 2.pdf`. First proposal was 13.4 SEER2 single stage, 2-yr workmanship, 16" **FLEX** return with two 16" 90s (Jeff asked for **sheet metal**), "lifetime heat exchanger" with **material not stated**, 18/8 wire pull $295. UV light confirmed **no additional cost**; 2-stage would add **$1,200–1,500**. | **JEFF — open the PDF.** The revised numbers are not in this tracker because the attachment is ~700 KB of base64 and cannot be pulled inline. |
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
