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
| **Peters HVAC** — Tyler Oberry | `TOberry@petershvac.net` | ✅ **Proposal in.** Replied 09-16 23:20: *"let me get this all fixed in the AM!"* **UV light at no additional cost**, being added to scope. 2-stage option would add **$1,200–1,500**. | **THEM** — revised sheet this morning |
| **Goodlettsville H&C** — Bill | `Bill.ghandc@gmail.com` · **615-479-0886** (Candy Faulkner) | 🔵 **ONSITE 09-17, 9:00–10:00 AM.** Jeff confirmed quote expected **this afternoon**. | **THEM** — quote this afternoon |
| **Butler A/C** — Aaron | `butleracservice@yahoo.com` · `Alee772b@yahoo.com` | ⚠️ Out of town until **evening 09-17**, no copier/scanner. Will quote **without the garage duct**. Says branching a duct into the garage is a **code violation** (fume backfeed) and *"we will not be able to do the job"* with it included. | **THEM** — tonight |
| **Hunter** — Mark / Daniel | `info@huntertn.com` | 🟡 Acknowledged 09-16 AM. Numbers due today. | **THEM** |
| **Callon Mechanical** | `service@callonmechanical.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Gallatin H&C** | `gallatinheatingandcooling@gmail.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Chilly Ben's** — Ben | `ben@chillybens.com` | ⚪ Chased 09-16 20:32. Silent. | **THEM** |
| **Star Heat & Air** | `office@starheatandair.com` | ⚪ Sent 09-16 16:10. Silent, no bounce. | **THEM** |
| **Covenant H&C** | ❌ email dead — **CALL (615) 829-9699** | ❌ Both addresses bounced. Never received the request. | **US — phone them** |
| **H Brown / Brown & Son** — Cory/Corey | ❌ `Cory@` bounced — **CALL (615) 325-2624** | ❌ `Cory@hbrownhvac.com` blocked. `Corey@hbrownhvac.com` sent 17:04 with **no bounce** — may have landed, unconfirmed. | **US — phone them** |

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

🔴 **The fix for a 550 is a phone call, not another email.** Sending again to an address a
Barracuda already rejected produces another bounce. Verified numbers are in the board above.

---

## VERIFICATION NOTE

Phone numbers above were looked up **2026-09-17 by web search this session**, per the standing
rule never to state a number from memory:
- **Covenant Heating & Cooling** — (615) 829-9699, 176-A Molly Walton Dr, Hendersonville TN 37075, open 24 h
- **Brown & Son Company** (`hbrownhvac.com`) — (615) 325-2624, 109 S Broadway, Portland TN 37148, Mon–Fri 7:30–4:00 + 24 h emergency

Neither has been dialled. They are verified as *published*, not as *reached*.

---

## STILL OWED FROM THE 09-10 ROUND — do not lose this

🔴 **The flex diameters in writing, from Daniels.** The revised proposal **deleted** the
*16" flex supply / return*, the *16"–14" reducer* and the *875 CFM* line. That connection work is
the entire reason the $9,000 counts as turnkey. Recorded 09-10 as
*"THE ONLY THING STILL OWED BEFORE SIGNING"*, and it is still owed.

⏳ **Registration clock:** the Carrier lifetime stainless heat exchanger must be registered within
**90 days** of install or it drops to 20 years.
