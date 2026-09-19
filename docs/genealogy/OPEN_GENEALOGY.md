# 🌳 GENEALOGY — the open rows for a SEPARATE project

Moved out of `docs/OPEN_ITEMS.md` on 2026-09-16. Jeff, 00:50: *"Genealogy is not the main
priority here, the project is! No working on genealogy with any open unfinished or
incomplete project items."*

**This is not house work and it does not belong on the house todo list.** It has its own
tooling in `HCC-Scripts/genealogy/` and its own notes there.

⛔ **Frozen for the 2026-09-15/16 session** — see `.claude\session-freeze.txt`, which the
read gate enforces. Do not start these while house items are open.

---

## #150 — 🔴 BLOCKED ON PERMISSION: 12 tree detaches are staged and cannot be written 2026-09-07 22:20

⚠️ UPDATED 2026-09-08 01:40 — was 14. TWO were REMOVED by the DNA veto (#156): Louella Lockhart
Walker and Emma L Lockhart are real children of James M K Lockhart; his DEATH DATE is the error.

**Not a bug. A permission gate.** `detach_parent.js --write` was refused by the auto-mode
permission classifier. Nothing has been written to Jeff's Ancestry tree.

### What is staged
`genealogy/TREE_ERRORS.md` holds a ready-to-run command per child. The dry run prints the full
before-state, the exact POST body, and the ids needed to undo. Example, verified working:

```
node detach_parent.js 412274503263 -599572656 -599571141          # dry run  (drop nothing)
node detach_parent.js 412274503263 -599572656 -599571141 --write  # execute
```

    CHILD: Emmiziah Luther Carr   31 Mar 1854 - 30 Sep 1952   [412274503263]
        FATHER  -599571141   James B. Quarles    1 Jan 1759 - 2 Aug 1838   pcb
        MOTHER  -599572656   Elizabeth Pelfry    1 Jan 1767 - 1 May 1848   pcb

### To unblock
Jeff either runs the commands himself from `HCC-Scripts/genealogy/`, or adds a Bash permission
rule allowing `node detach_parent.js`. **Chrome must be running with CDP on port 9222 and signed
in to Ancestry.**

### Why it is safe to run
* Dry-run by default; `--write` is explicit.
* Reads the person first, prints the whole before-state.
* **Re-reads after the write and prints 🟢 VERIFIED or 🔴 NOT REMOVED** — the change is proven,
  not assumed. (This matters: the older `attachedChildren` method returned HTTP 200 and silently
  did nothing.)
* Refuses any link that is not `pcb` (biological).
* Every detach is reversible by re-attaching the ids the tool prints.

---


## #153 — 🟡 GW Baker research is written up but NOT yet in Ancestry notes 2026-09-07 22:20

Jeff asked for the Baker brick-wall research to go into the person's Ancestry notes so it is not
re-derived. The note is written and ready at `genealogy/BAKER_ANCESTRY_NOTE.txt` (~140 lines:
what is proven, what is disproven and must not be re-searched, the Elisha Baker candidate, the
single highest-value document left, and the method notes).

**Still to do:** find the notes write endpoint and post it, or paste it in by hand. The person-
notes endpoint has not been captured yet — `factsglue` is the likely place to look for it.

---


## #155 — 🔴 279 DUPLICATE PEOPLE in the tree. This is the root cause. 2026-09-08 01:15

**Duplicates are why wrong attachments happen** — the family splits across two copies of one
person and children land on whichever copy was open. Several "impossible parentage" findings are
really this, and detaching them would have been the wrong fix.

`duplicates.js` -> **`genealogy/TREE_DUPLICATES.md`** (279 candidate pairs from 5,997 people).
Verified live against the API, not just the crawl:

    Rosanna Martin  -599573507 / -599573508   both b.1 Jan 1769 d.1 Jan 1869
        both married to the SAME Moses Seaton -599570353;  1 child vs 11 children
    Martha Martin   412268703449 / 412268705241   both b.1 Jan 1772
        both married to the SAME Joseph Snow 412268703446;  6 children vs 1
    Susan E. (Eskew) b.1829 — split 10 children / 9 children across two copies
    Jacob Walter Probst b.1892 and Neihmer Jackson Miller b.1901 — THREE copies each

🔴 A woman cannot be married to the same man as two separate people. Same spouse *record*, same
dates. These are the same person entered twice.

### Which repair buys the most — `crossref.js`
    101 impossible links; 24 sit next to a duplicate (24%)
    TWO merges retire 17 of those 24:
        11 links  Moses Seaton b.1767 d.27 Apr 1787   (his WIFE is duplicated)
         6 links  Martha Ann Qualls b.1829 d.1845     (she AND her husband are duplicated)
    77 links have no duplicate nearby -> genuine bad links or bad dates

🔴 **The spouse test is what caught Seaton.** He is not duplicated himself — he is the worst
single finding in the tree (11 children born 1790-1811 against a death of 27 Apr 1787) and the
duplication is one step away, on his wife. Testing only parent and child would have missed it.

### ⚠️ Action needed from Jeff — merges are UI-only
**Merging is NOT reachable through the API** (confirmed in `ANCESTRY_API.md`). These have to be
merged in the Ancestry interface. Start with Rosanna Martin and Martha Ann Qualls.

### ⚠️ Do NOT bulk-accept this list
Siblings were routinely given the same name after an earlier child died young. Same name + same
parents is a CANDIDATE, not a certainty — check whether both appear alive in the same census.
`Moses Anderson Seaton b.1804` vs `Moses Bennett Seaton b.1811` scored only 4 and are very likely
two real brothers.

### ⚠️ And do NOT detach Moses Seaton's 11 children
They are a real family with normal spacing. His death date is what fails — probably a conflation
with a different Moses Seaton. That stays FIX-PARENT-DATE until a record settles it.

---


## #156 — 🔴 DNA VETO: only ONE of the four "verified" tree errors is actually a wrong link 2026-09-08 01:40

Jeff asked twice whether DNA could verify tree errors. It can — and the first thing it did was
overturn a fix that was already queued to run.

### 🔴 THE FOUR HAND-FOUND "VERIFIED FINDINGS", RE-JUDGED

| # | finding | verdict now | why |
|---|---|---|---|
| 2 | Wilhelmina Loewen Shirey | ❌ **NEVER AN ERROR** | the two children are `mod=pcst` (parent-child STEP), not `pcb` biological |
| 3 | Mary E. Keishner Stevenson | ⚫ **UNRESOLVED** | her 1 match is CIRCULAR — mother has 0 independent matches. Decide on records |
| 4 | **Louella Lockhart Walker** | ❌ **NOT AN ERROR — the DATE is wrong** | 5 matches descend through her; her father has **14 INDEPENDENT** matches via 4 other children |

**Of four findings previously called verified, ONE is a confirmed wrong link.** Two were never
errors and one is undecidable from DNA. This supersedes the "three of four re-found" line in #151.

### The Lockhart case in detail
    James M K Lockhart  (recorded d.1873)   19 matches / 65 known, via 5 of 5 children
        7  Della Fulk                b.1875
        5  Louella Lockhart Walker   b.1877   <- Jeff descends here
        4  Lee Ann Lockhart          b.1868
        2  James C (Jimmie) Lockhart b.1872
        1  Leanna "Lettie" Brown     b.1872

14 of the 19 matches arrive through children who are **not** Jeff's line, so the man is
independently established as his ancestor — and Jeff's own path runs through Louella. She IS his
daughter; **the 1873 death date is what fails.** Emma L Lockhart b.1880 is held for the same
reason — one date fix resolves both sisters.

### ⚠️ My own test was wrong twice before it was right. Both caught before acting.
1. **Too coarse** — it asked "is the PARENT DNA-supported?". William Larkin scores 89 matches via
   8/8 children, but all 8 are his real family; that says nothing about the disputed six.
   **The test is PER CHILD, not per parent.**
2. **It walked into the circularity trap documented in my own `thrulines_children.js`** — matches
   under Jeff's own line descend from the CHILD and are projected upward through whatever parent
   the tree claims. Fixed: a child's matches only count when the parent has **>= 2 INDEPENDENT**
   matches through other children.

### 🔒 The veto is structural
`dna_crosscheck.js` writes **`dna_hold.json`**; `classify.js` reads it and refuses to queue those
children. Without it the next pipeline run would silently re-queue Louella.
**Detach queue: 12 children (was 14).**

### ⚠️ THE ASYMMETRY — do not misread a silence
DNA support is **evidence FOR** a line. **Absence is NOT evidence against one** — it usually means
few descendants of that branch have tested, and nobody shares measurable DNA with a 16th-century
ancestor at all. **86 of the 101 impossible links involve a parent not on Jeff's ThruLines line;
DNA is simply silent about them.** ThruLines is built from member trees, not records — a research
instrument, never proof, and not admissible for SAR/SCV.

---


## #157 — 🔴 THE SWEEP ONLY SEES 58% OF THE TREE, and 26% of dates are fake-precise 2026-09-08 04:20

`sanity.js` -> `genealogy/TREE_SANITY.md`, over 5,997 people. **Read this before quoting any
number from #151 or #155.**

### The coverage limit
**2,495 people (42%) have NO dates at all** but do have family links. Every check in this toolkit
is date-driven, so they are invisible to all of it. **"101 impossible links" is a FLOOR, not a
total.** The tree has not been "checked" — 58% of it has.

Not fixable by better code. The data is not there.

### 26% of birth dates are the placeholder "1 January"
    1,535 births (26%) and 773 deaths (13%) fall on exactly 1 Jan.

The signature of a **year-only fact stored as Jan 1** by an importer. Looks precise, is not.
A death of "1 Jan 1845" would read as hard evidence against a child born later in 1845 when the
record only ever said *1845*.

✅ **The impossible-parentage sweep compares YEARS only, so it is unaffected** — but never let a
future version start using the month or day of these dates.

### Actionable
* **Died before born (2):** `-599568272` Jacksine Isabel J. West b.1985 d.1978;
  `412270678782` Thomas Whitaker b.2001 d.1786.
* **Lifespan >110 (3):** `412267440870` Lynde McCurry b.1655 d.2001 (346 yrs);
  `-2491679` Judith Quarles b.1561 d.1804 (243 yrs); `412612444704` Prudence Smith 118 yrs.
* **Siblings <9 months apart, same mother (8)** — twins and placeholder dates excluded.

🔗 **The Seaton/Martin family is now flagged by THREE independent checks** — Rosanna Martin is
entered twice (#155), her husband Moses Seaton has 11 children born after his recorded 1787 death
(#151), and two of those children are 156 days apart. Strongest signal in the tree; start there.

### ⚠️ A false positive of mine, caught and fixed
The first run flagged 5 "birth year out of range" — Charles the Bald b.823, Carloman b.845 and
three more. **None are errors.** They are 9th-century Carolingians with historically correct
dates; my floor was set at 1000. Corrected to 500, the check now returns 0. What is dubious about
those medieval royal lines is the **genealogy**, not the **years** — do not conflate them, and do
not "fix" a date that is right.

---

