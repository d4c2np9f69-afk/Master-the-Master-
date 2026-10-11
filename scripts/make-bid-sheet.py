#!/usr/bin/env python3
"""Build bid/BID_COMPARISON.xlsx - the printable HVAC bid comparison.

Jeff, 2026-09-17: "I need that excell file formatted to print on one page and fit landscape,"
then: "The excell sheet can have more then one sheet as long as I can tape them together."

So: LANDSCAPE, fitToWidth=1 (never splits sideways - the columns always stay together), and
fitToHeight=0 so it runs onto as many pages DOWN as it needs at a readable 10pt. The header row
repeats on every page, so the taped-together sheets each carry their own column titles.

Long explanatory notes live on a second tab, out of the printed grid.
Full wording of every finding is in docs/hvac/BID_TRACKER.md.

Rows are Jeff's OWN spec from the bid request he sent on 2026-09-16. Columns are the bidders.
Blue = taken from a written quote or email. Yellow = fill in at the table. Red = deal breaker.

Regenerate:  python3 scripts/make-bid-sheet.py
NOTE: soffice cannot convert ANY xlsx in this sandbox (a one-cell test file fails the
same way), so page count is NOT verified by render here - only the page-setup flags are.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

F = "Arial"
wb = Workbook()
ws = wb.active
ws.title = "Bid Comparison"

hdr_f  = Font(name=F, size=11, bold=True, color="FFFFFF")
sec_f  = Font(name=F, size=10, bold=True, color="FFFFFF")
bod_f  = Font(name=F, size=10)
red_f  = Font(name=F, size=10, bold=True, color="C00000")
blue_f = Font(name=F, size=10, color="0000FF")

navy   = PatternFill("solid", fgColor="1F3864")
secfil = PatternFill("solid", fgColor="4472C4")
yellow = PatternFill("solid", fgColor="FFFF00")
pink   = PatternFill("solid", fgColor="FFD9D9")

thin = Side(style="thin", color="BFBFBF")
box  = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")
ctr  = Alignment(horizontal="center", vertical="center", wrap_text=True)

BIDDERS = ["Daniels\n(benchmark)", "Peters H&A\n(Tyler O'Berry)", "Goodlettsville\n(Bill)",
           "Butler A/C\n(Aaron)", "Hunter\n(Mark/Daniel)", "____________"]
N = 1 + len(BIDDERS)
r = 1

# ---- title + legend, two rows only -------------------------------------------------
c = ws.cell(r, 1, "HVAC BID COMPARISON  -  301 S Aztec Dr, White House TN 37188   |   "
                  "2.5-ton gas/electric package, R-454B, 995 CFM   |   quotes due Thu 2026-09-17")
c.font = Font(name=F, size=11, bold=True)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=N); r += 1

c = ws.cell(r, 1, "BLUE = confirmed in writing    YELLOW = fill in at the table    RED = deal breaker"
                  "        Full detail + every caveat: docs/hvac/BID_TRACKER.md")
c.font = Font(name=F, size=8, italic=True)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=N); r += 1

hrow = r
c = ws.cell(r, 1, "REQUIREMENT"); c.font = hdr_f; c.fill = navy; c.alignment = ctr; c.border = box
for i, b in enumerate(BIDDERS):
    c = ws.cell(r, 2 + i, b); c.font = hdr_f; c.fill = navy; c.alignment = ctr; c.border = box
ws.row_dimensions[r].height = 34
r += 1


def section(t):
    global r
    c = ws.cell(r, 1, t); c.font = sec_f; c.fill = secfil; c.alignment = wrap; c.border = box
    for i in range(1, N):
        cc = ws.cell(r, 1 + i); cc.fill = secfil; cc.border = box
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=N)
    ws.row_dimensions[r].height = 18
    r += 1


def row(label, vals=None, hard=False, h=None):
    global r
    c = ws.cell(r, 1, label); c.font = red_f if hard else bod_f; c.alignment = wrap; c.border = box
    if hard: c.fill = pink
    vals = vals or {}
    for i in range(len(BIDDERS)):
        cell = ws.cell(r, 2 + i, vals.get(i, "")); cell.border = box; cell.alignment = wrap
        if vals.get(i): cell.font = blue_f
        else: cell.font = bod_f; cell.fill = yellow
    ws.row_dimensions[r].height = h or 30
    r += 1


section("WHO THEY ARE")
row("Contact", {1: "Tyler O'Berry, Mgr/Sales", 2: "Bill (ofc: Candy Faulkner)", 3: "Aaron Lee", 4: "Mark / Daniel"})
row("Phone", {1: "615-757-5497 / c 629-292-1310", 2: "615-479-0886"})
row("Email", {1: "TOberry@petershvac.net", 2: "bill.ghandc@gmail.com", 3: "butleracservice@yahoo.com", 4: "info@huntertn.com"}, h=36)
row("TN LICENCE NUMBER", {1: "#81099 MECHANICAL"}, hard=True)

section("THE UNIT")
row("Model number", {0: "Carrier 48NL-B300603", 1: "Carrier 48NL-B300603"})
row("Tonnage / gas BTU", {0: "2.5 ton / 60,000", 1: "2.5 ton / 60,000 - in vs out NOT split"}, h=33)
row("SEER2 / stages", {0: "13.4 single", 1: "13.4 single, ECM - 15.2 2-stage question UNANSWERED"}, h=36)
row("Refrigerant", {0: "R-454B"})
row("HEAT EXCHANGER = STAINLESS STEEL", {0: "lifetime stainless", 1: "STAINLESS - in writing TWICE"}, hard=True, h=33)
row("HX / parts / compressor warranty", {0: "lifetime HX (register in 90 days)", 1: "LIFETIME HX + 10yr parts + 10yr compr"}, h=36)
row("Labour warranty term", {0: "10 yr", 1: "5 yr incl (was 2 yr)"})
row("Labour cost to reach 10 yr", {0: "$800", 1: "+$500"})
row("Labour covers", {0: "all labour + freon", 1: "warranty-parts labour, priority svc, disc. maint"}, h=36)

section("DUCTWORK - all of it IN the price")
row("1. Twist REMOVED, sq-to-round BOTH supply + return", {0: "included", 1: "YES - 'eliminate the existing cross over/twist', take-offs both sides"}, hard=True, h=42)
row("2. Dining / master / living  6\" -> 8\"", {1: "YES - all 3, dampers on each"}, h=30)
row("3. New 7\" garage run, cored + sealed", {1: "YES - 7\" + 12\" hard pipe, crawlspace critter guard", 3: "REFUSES - says garage branch violates code"}, h=42)
row("4. New 16\" return, BOTH sheet-metal 90s", {1: "PARTIAL - 90s ARE sheet metal, TRUNK still FLEX"}, h=33)
row("4b. 18\" return as separate option", {1: "+$160"})
row("5. 20x25 filter grille stays", {0: "stays", 1: "stays + 6 mo of filters free"})
row("6. Existing duct sealed / re-strapped, NOT replaced", {1: "YES - mastic seal, new return panning, microbial"}, h=36)
row("7. Unit base closed off at pad", {1: "YES - shroud, critter guards, sealed, P-trap"}, h=33)
row("8. UVC REKO R2000 installed (Jeff supplies)", {1: "YES - facing coil, no charge"}, h=30)
row("9. ecobee installed, new 18AWG + C wire", {1: "YES - install+setup free; wire pull $295"}, h=30)

section("COMMERCIAL")
row("Ductwork itemised", {1: "YES - full line-item breakdown"})
row("Price per linear foot")
row("Permit included", {1: "$95"})
row("Static pressure + 995 CFM on invoice", {1: "static pressure YES - '995 CFM' NOT in document"}, h=33)
row("How soon could you start")

section("PRICE")
row("Equipment + install", {0: "$8,200", 1: "$8,520"})
row("Ductwork", {0: "incl in $9,000", 1: "$2,750"})
row("Options", {0: "+$800 = 10yr labour+freon", 1: "+$500 10yr | +$160 18\" | -$300 TVA"}, h=33)
tot = r
row("TOTAL DELIVERED", {0: "$9,000", 1: "$11,270"}, h=25)
for i in range(N):
    ws.cell(tot, 1 + i).font = Font(name=F, size=10, bold=True)

# ---- the one caveat that must never be separated from the totals -------------------
c = ws.cell(r, 1, "NOT THE SAME JOB: Daniels $9,000 = unit + twist + flex, 10-yr labour already in.  "
                  "Peters $11,270 ALSO has 3 branch upsizes, the garage run, a new 16\" return, full mastic duct seal, "
                  "new return panning, microbial, the permit and 6 mo of filters.  Like-for-like on labour Peters = $11,770 less the $300 TVA rebate.  "
                  "COMPARE SCOPE BEFORE PRICE.")
c.font = Font(name=F, size=8, bold=True); c.alignment = wrap; c.fill = PatternFill("solid", fgColor="FFF2CC"); c.border = box
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=N)
ws.row_dimensions[r].height = 30
last = r

ws.column_dimensions['A'].width = 44
for i in range(len(BIDDERS)):
    ws.column_dimensions[get_column_letter(2 + i)].width = 27

ws.freeze_panes = "B%d" % (hrow + 1)
ws.print_area = "A1:%s%d" % (get_column_letter(N), last)
ws.print_title_rows = "%d:%d" % (hrow, hrow)   # header repeats on every taped-on page
ws.page_setup.orientation = "landscape"
ws.page_setup.paperSize = ws.PAPERSIZE_LETTER
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0          # multi-page down is fine - Jeff tapes them together
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.page_margins.left = ws.page_margins.right = 0.2
ws.page_margins.top = ws.page_margins.bottom = 0.25

# ---- tab 2: the notes, kept OFF the printed page -----------------------------------
n = wb.create_sheet("Notes")
n.column_dimensions['A'].width = 120
notes = [
    ("PETERS - $11,270 is ARITHMETIC. The PDF has no printed grand total.", True),
    ("   It checks two ways: 8,520 + 2,750 = 11,270, AND the page-3 breakdown", False),
    ("   (unit w/pad 6,260 + labour 2,470 + ducting materials 1,475 + duct seal 325", False),
    ("   + misc 350 + permit 95 + t-stat wire 295) = exactly 11,270. Both sections", False),
    ("   state the total includes all sales tax.", False),
    ("", False),
    ("STILL OWED BY PETERS - three gaps:", True),
    ("   1. The 15.2 SEER2 two-stage price AND his recommendation. Jeff asked both.", False),
    ("      '15.2' and 'two stage' appear ZERO times in the proposal.", False),
    ("   2. Gas BTU input vs output - only one 60,000 figure; no input/output/AFUE.", False),
    ("   3. The 16\" return TRUNK is still FLEX. Only the (2) 90s are sheet metal.", False),
    ("", False),
    ("STILL OWED BY DANIELS - logged 2026-09-10, still open 7 days later:", True),
    ("   The flex diameters IN WRITING. The revised proposal deleted the 16\" flex", False),
    ("   supply/return, the 16\"-14\" reducer and the 875 CFM line. That connection", False),
    ("   work is the entire reason $9,000 counts as turnkey. DO NOT SIGN WITHOUT IT.", False),
    ("", False),
    ("CONTRACT ODDITY - Peters' 'Notice to Owner' boilerplate cites MISSOURI lien law", True),
    ("   (Chapter 429, RSMO) inside a Tennessee contract. Likely a template leftover,", False),
    ("   but it is in the document Jeff would sign. Worth one question.", False),
    ("", False),
    ("Peters proposal dated 9/17/2026, valid 90 days, prepared by Tyler O'Berry.", False),
    ("Payment due 30 days after completion; 2% surcharge on card payments >= $1,000.", False),
    ("Carrier lifetime stainless HX must be REGISTERED WITHIN 90 DAYS of install or it", False),
    ("   drops to 20 years.", False),
    ("", False),
    ("NEVER REACHED BY EMAIL until 09-17: Covenant - use office@covenantheatingand", False),
    ("   cooling.com ONLY (ntagel@, facebook@ and info@ all bounce 550). (615) 829-9699.", False),
    ("Brown & Son - Corey@hbrownhvac.com (Cory@ with one 'e' bounces). (615) 325-2624.", False),
]
for i, (txt, bold) in enumerate(notes, start=1):
    c = n.cell(i, 1, txt)
    c.font = Font(name=F, size=10, bold=bold)
n.page_setup.orientation = "landscape"

wb.save("bid/BID_COMPARISON.xlsx")
print("WROTE bid/BID_COMPARISON.xlsx   grid rows 1-%d" % last)
