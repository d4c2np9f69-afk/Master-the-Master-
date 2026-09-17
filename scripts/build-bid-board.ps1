$ErrorActionPreference = 'Stop'
$dir  = 'C:\Users\jeffl\iCloudDrive\HCC AC Quotes'
$xlsx = Join-Path $dir 'AC BIDDERS.xlsx'
$pdf  = Join-Path $dir 'AC BIDDERS - wall sheet.pdf'
if (Test-Path $xlsx) { New-Item -ItemType Directory -Force (Join-Path $dir '_old') | Out-Null; Copy-Item $xlsx (Join-Path $dir ('_old\AC BIDDERS.bak-' + (Get-Date -Format 'MMdd-HHmm') + '.xlsx')) -Force }

function RGB($r,$g,$b) { return $r + ($g * 256) + ($b * 65536) }
$NAVY = (RGB 31 56 100); $WHITE = (RGB 255 255 255); $GRIDC = (RGB 191 191 191); $INK = (RGB 30 30 30); $MUTED = (RGB 90 90 90)
$STAGE = [ordered]@{
  'QUOTE IN HAND' = @{ fill=(RGB 198 239 206); band=(RGB 0 128 0);   order=1 }
  'ON SITE'       = @{ fill=(RGB 189 215 238); band=(RGB 31 78 121); order=2 }
  'QUOTING'       = @{ fill=(RGB 255 235 156); band=(RGB 191 143 0); order=3 }
  'SENT - SILENT' = @{ fill=(RGB 237 237 237); band=(RGB 128 128 128); order=4 }
  'ON HOLD'       = @{ fill=(RGB 226 217 243); band=(RGB 112 48 160); order=5 }
  'OUT'           = @{ fill=(RGB 255 199 206); band=(RGB 192 0 0);   order=6 }
}
# company | contact | phone | email | stage | price | 10yr | next step (short) | where it stands (long) | licence
$rows = @(
 @('Peters Heating & Air','Tyler O''Berry, Manager/Sales','629-292-1310 cell / 615-757-5497','toberry@petershvac.net','QUOTE IN HAND','$11,270 = $8,520 unit + $2,750 duct, less $300 TVA rebate','$11,770 w/ 10-yr labour (+$500); $11,470 after TVA','GOLD STANDARD. Nothing owed. Can start Tue 22 Sept.','Revised proposal 09-17 09:13. ALL FOUR GATES PASS: stainless HX in writing, twist out BOTH sides, 3x 6"->8", 7" garage run, 16" return w/ sheet-metal 90s, static pressure recorded on the invoice. UV light + ecobee installed free. 5-yr labour standard. 2-stage 15.2 SEER2 would add $1,200-1,500; 18" return +$160.','TN #81099 Mechanical'),
 @('Covenant Heating & Cooling','Nathan Pagel, Project Advisor','615-388-9102 cell / 615-829-9699 office','NPagel@covenantheatingandcooling.com','QUOTING','','','Quote promised FRI 18 SEPT. Chase Fri afternoon.','Visited 09-17 ~12:45 PM. Has both PDFs (attached, Outlook 1:01 PM) and the Rev C drawing. 176-A Molly Walton Dr, Hendersonville.',''),
 @('Goodlettsville Heating & Cooling','Bill / Candy Faulkner (office)','615-479-0886','Bill.ghandc@gmail.com','QUOTE IN HAND','$9,760 = $7,960 unit + $1,800 duct. Permit not included (says city requires none for like-for-like). 18" return +$400. Valid 15 days.','$11,354 w/ 10-yr labour (+$1,594, excludes refrigerant). ~$116 UNDER Peters over 10 yrs if no permit; ~$20 under if permit ($95).','Revised quote #1820 in 09-17 3:14 PM. ALL FOUR GATES PASS on paper. One question left: are the "T" (taxable) lines taxed on top on the invoice? Peters says tax included.','Tempstar PGB430060K000B = the 48NL with a Tempstar badge (see comparison PDF 09-17): same coils, blower, HX, sound, weight; Tempstar adds 3-yr No Hassle unit replacement. Revised quote: new square-to-rounds on supply AND return; 16" return re-routed to remove the twist w/ (2) sheet-metal 90s; upsize runs per drawing; garage run; static pressure + airflow recorded on invoice; t-stat wire, ecobee + UV install included. Warranty 3-yr no-hassle, lifetime HX, 10-yr parts registered, 1-yr labour; 2-yr +$550, 5-yr +$864, 10-yr +$1,594. Candy: AHRI airflow is 950 CFM not 995 (true - 995 is the Med-High cooling tap at ~0.5 in ESP on the same blower table, so settable).','TN #72333 (on quote)'),
 @('Butler Heat & Air','Terry Butler (owner) / Aaron Lee','615-451-0178','butleracservice@yahoo.com','QUOTING','','','Quote TONIGHT (Thu) - without the garage duct.','Owner emailing personally from out of town (no copier/scanner till Thu evening). Will not include the garage run.',''),
 @('Hunter Heating & Air','Mark Wilburn / Daniel Hunter','615-714-6200','info@huntertn.com','QUOTING','','','Numbers due today. No reply since Wed.','Acknowledged 09-16 07:41 (landed in Comcast spam). Nudged 09-16 6:02 PM from Gmail.',''),
 @('Brown and Son (Portland)','Corey','615-325-2624','Corey@hbrownhvac.com','SENT - SILENT','','','Waiting. Call if nothing by Fri.','Sent 09-16, re-sent 09-17 10:10 AM after the phone call. Cory@ (one e) bounces - use Corey@.',''),
 @('Star Heat & Air','office','','office@starheatandair.com','SENT - SILENT','','','Waiting.','Sent 09-16 11:10 AM, delivered, no reply.',''),
 @('Chilly Ben''s (White House)','Ben','270-776-3691','ben@chillybens.com','SENT - SILENT','','','Waiting.','Sent 09-15, chased 09-16 3:31 PM. Silent.','HM04997 (home improvement)'),
 @('KB''s HVAC (Portland)','','615-300-5283','gallatinheatingandcooling@gmail.com','SENT - SILENT','','','Waiting.','Sent 09-15, chased 09-16 3:31 PM. Silent.',''),
 @('Callon Mechanical','Willy Callon','615-953-9788','service@callonmechanical.com','SENT - SILENT','','','Waiting.','Sent 09-15, chased 09-16 3:31 PM. Silent.','CMC #81530'),
 @('Daniels Heating & Air (Greenbrier)','Ryan','615-804-1078','','ON HOLD','$9,000 Carrier 48NL - OLD scope, no duct work','$9,800 w/ +$800 labour - NOT the same job','No contact until they reach out (Jeff, 09-15).','Silent since 09-11. Old-scope number is not comparable to Peters.',''),
 @('Derryberry''s (Gallatin)','Charles Brady','','Charles.b@derryberryac.com','OUT','$8,558 unit; $9,500 all-in counter (withdrawn)','~$9,098 (withdrawn)','Out.','09-16: will not do the job without a complete duct replacement.',''),
 @('Petitt (White House)','Logan','','','OUT','$13,000 Ruud','>= $14,296 (freon excluded)','Out.','Withdrew after being refused Daniels'' quote.',''),
 @('Haskins Heating & Cooling','','615-346-8178','','OUT','','','Out.','09-16: cannot quote at this time.','')
)
$rows = $rows | Sort-Object { $STAGE[[string]$_[4]].order }, { $_[0] }

$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false; $xl.DisplayAlerts = $false
$wb = $xl.Workbooks.Add()
while ($wb.Worksheets.Count -gt 1) { $wb.Worksheets.Item($wb.Worksheets.Count).Delete() }

function Title($ws, $title, $sub, $lastCol) {
  $ws.Cells.Item(1,1).Value2 = $title; $ws.Range("A1:$lastCol" + "1").Merge() | Out-Null
  $ws.Cells.Item(1,1).Font.Bold = $true; $ws.Cells.Item(1,1).Font.Size = 20; $ws.Cells.Item(1,1).Font.Color = $NAVY
  $ws.Cells.Item(2,1).Value2 = $sub; $ws.Range("A2:$lastCol" + "2").Merge() | Out-Null
  $ws.Cells.Item(2,1).Font.Size = 10; $ws.Cells.Item(2,1).Font.Color = $MUTED
  $ws.Rows.Item(1).RowHeight = 30; $ws.Rows.Item(2).RowHeight = 16; $ws.Rows.Item(3).RowHeight = 6
}
function Header($ws, $names, $row) {
  for ($c=1; $c -le $names.Count; $c++) { $ws.Cells.Item($row,$c).Value2 = $names[$c-1] }
  $h = $ws.Range($ws.Cells.Item($row,1), $ws.Cells.Item($row,$names.Count))
  $h.Font.Bold = $true; $h.Font.Size = 12; $h.Font.Color = $WHITE; $h.Interior.Color = $NAVY
  $h.VerticalAlignment = -4108; $ws.Rows.Item($row).RowHeight = 26
}
function Legend($ws, $row, $lastColIdx) {
  $c = 1
  foreach ($k in $STAGE.Keys) {
    $cell = $ws.Cells.Item($row,$c); $cell.Value2 = $k; $cell.Interior.Color = $STAGE[$k].fill; $cell.Font.Bold = $true; $cell.Font.Size = 9
    $cell.HorizontalAlignment = -4108; $cell.Borders.LineStyle = 1; $cell.Borders.Color = $GRIDC
    $c++
  }
  $ws.Rows.Item($row).RowHeight = 18
}
function Finish($ws, $firstRow, $lastRow, $lastColIdx, $widths, $fontSize, $footer, $fitTall) {
  for ($c=1; $c -le $widths.Count; $c++) { $ws.Columns.Item($c).ColumnWidth = $widths[$c-1] }
  $body = $ws.Range($ws.Cells.Item($firstRow,1), $ws.Cells.Item($lastRow,$lastColIdx))
  $body.Font.Size = $fontSize; $body.WrapText = $true; $body.VerticalAlignment = -4160
  $body.Borders.LineStyle = 1; $body.Borders.Weight = 2; $body.Borders.Color = $GRIDC
  $body.Rows.AutoFit() | Out-Null
  foreach ($r in $firstRow..$lastRow) { if ($ws.Rows.Item($r).RowHeight -lt 22) { $ws.Rows.Item($r).RowHeight = 22 } }
  $ps = $ws.PageSetup
  $ps.Orientation = 2; $ps.Zoom = $false; $ps.FitToPagesWide = [int]1
  if ([int]$fitTall -eq 0) { $ps.FitToPagesTall = $false } else { $ps.FitToPagesTall = [int]$fitTall }
  $ps.PrintTitleRows = ('$' + ($firstRow-1) + ':$' + ($firstRow-1))
  $ps.LeftMargin = 28; $ps.RightMargin = 28; $ps.TopMargin = 32; $ps.BottomMargin = 32; $ps.HeaderMargin = 14; $ps.FooterMargin = 14
  $ps.CenterHorizontally = $true; $ps.CenterFooter = $footer
  $ws.Activate(); $ws.Range('A' + $firstRow).Select() | Out-Null; $xl.ActiveWindow.FreezePanes = $true
}

# ================= SHEET 1: BOARD =================
$ws = $wb.Worksheets.Item(1); $ws.Name = 'BOARD'
Title $ws 'A/C REPLACEMENT - BID BOARD' ('301 S Aztec Dr, White House - printed ' + (Get-Date -Format 'ddd d MMM yyyy h:mm tt') + ' - judge on the 10-YEAR COST, never the sticker - Peters is the benchmark') 'F'
Legend $ws 4 6
Header $ws @('Company','Contact / phone','Stage','Price (sticker)','10-YEAR COST','Next step') 6
$r = 7
foreach ($row in $rows) {
  $st = [string]$row[4]
  $ws.Cells.Item($r,1).Value2 = $row[0]; $ws.Cells.Item($r,1).Font.Bold = $true
  $ws.Cells.Item($r,2).Value2 = (($row[1], $row[2]) | Where-Object { $_ }) -join "`n"
  $ws.Cells.Item($r,3).Value2 = $st; $ws.Cells.Item($r,3).Font.Bold = $true; $ws.Cells.Item($r,3).HorizontalAlignment = -4108
  $ws.Cells.Item($r,4).Value2 = $row[5]
  $ws.Cells.Item($r,5).Value2 = $row[6]; $ws.Cells.Item($r,5).Font.Bold = $true
  $ws.Cells.Item($r,6).Value2 = $row[7]
  $ws.Range(("A{0}:F{0}" -f $r)).Interior.Color = $STAGE[$st].fill
  $ws.Cells.Item($r,3).Interior.Color = $STAGE[$st].band; $ws.Cells.Item($r,3).Font.Color = $WHITE
  $r++
}
$last = $r - 1
Finish $ws 7 $last 6 @(30, 34, 15, 30, 30, 34) 12 'BID BOARD - &D &T - page &P of &N' 1

# ================= SHEET 2: DETAIL =================
$s2 = $wb.Worksheets.Add([Type]::Missing, $ws); $s2.Name = 'DETAIL'
Title $s2 'BIDDER DETAIL  (tapes to the right of the BOARD - same rows, same order)' ('what each one has said, in their own words - working document, add to it as things land - ' + (Get-Date -Format 'ddd d MMM yyyy h:mm tt')) 'D'
# row 4 on the BOARD is the legend; keep a matching row here so the header lands on the same line
$s2.Cells.Item(4,1).Value2 = 'Row order and heights match the BOARD sheet exactly - tape this page to the right edge of the BOARD.'
$s2.Cells.Item(4,1).Font.Italic = $true; $s2.Cells.Item(4,1).Font.Size = 9; $s2.Cells.Item(4,1).Font.Color = $MUTED
$s2.Range('A4:D4').Merge() | Out-Null; $s2.Rows.Item(4).RowHeight = 18; $s2.Rows.Item(5).RowHeight = 6
Header $s2 @('Company','Email','Where it stands','Licence') 6
$r = 7
foreach ($row in $rows) {
  $st = [string]$row[4]
  $s2.Cells.Item($r,1).Value2 = ($row[0] + "`n" + $st); $s2.Cells.Item($r,1).Font.Bold = $true
  $s2.Cells.Item($r,2).Value2 = $row[3]
  $s2.Cells.Item($r,3).Value2 = $row[8]
  $s2.Cells.Item($r,4).Value2 = $row[9]
  $s2.Range(("A{0}:D{0}" -f $r)).Interior.Color = $STAGE[$st].fill
  $r++
}
$last2 = $r - 1
Finish $s2 7 $last2 4 @(28, 34, 91, 20) 11 'BIDDER DETAIL - &D &T - tape to the right of the BOARD' 1
# ---- make BOARD and DETAIL line up row-for-row: same height on every row (max of the two), same top block
$ws.Rows.Item(5).RowHeight = 6   # BOARD row 5 is the spacer under the legend, DETAIL row 5 is its spacer too
foreach ($rr in 1..$last) {
  $hA = $ws.Rows.Item($rr).RowHeight; $hB = $s2.Rows.Item($rr).RowHeight
  $h = [Math]::Max($hA, $hB); $ws.Rows.Item($rr).RowHeight = $h; $s2.Rows.Item($rr).RowHeight = $h
}
$ws.PageSetup.FitToPagesTall = 1; $s2.PageSetup.FitToPagesTall = 1
# identical margins + no vertical centering so the top edges match; same zoom on both so the scale matches
foreach ($sh in @($ws, $s2)) { $sh.PageSetup.CenterHorizontally = $false; $sh.PageSetup.CenterVertically = $false; $sh.PageSetup.LeftMargin = 28; $sh.PageSetup.RightMargin = 28; $sh.PageSetup.TopMargin = 32; $sh.PageSetup.BottomMargin = 32 }

# ================= SHEET 3: SCOPE + GATES =================
$s3 = $wb.Worksheets.Add([Type]::Missing, $s2); $s3.Name = 'SCOPE + GATES'
Title $s3 'THE JOB - same scope for every bidder' 'read this to each one; a bid that misses a gate is not cheap, it is a different job' 'B'
$lines = @(
 @('Unit','2.5-ton gas/electric PACKAGE unit, R-454B, 995 CFM design airflow. Benchmark: Carrier 48NL-B300603. Quote that or equal/better - exact model number, gas input AND output, heat exchanger material.'),
 @('GATE 1 - STAINLESS','Heat exchanger MUST be STAINLESS STEEL. Deal breaker - the unit sits outside. If stainless is a factory option, quote it WITH the option code in the model number (a Ruud/Rheem must end in AJA).'),
 @('GATE 2 - THE TWIST','Remove the twist at the unit and install new square-to-round transitions on BOTH the supply AND the return. This is the main thing to fix.'),
 @('GATE 3 - THE DUCT','Dining, master bedroom and living branches 6" -> 8" (saddle tap, balancing damper, boot). New 7" garage run: saddle tap on the SIDE of the 12" trunk (never off the trunk end), through the brick, up the garage wall, DAMPER AT THE REGISTER so it shuts off from inside the garage in winter. New 16" return with sheet-metal 90s (price 18" separately). 20x25 filter grille stays. Existing duct STAYS - inspect, re-strap, seal what leaks. Nobody is asked to replace duct for damp insulation.'),
 @('GATE 4 - ON THE INVOICE','Start-up readings recorded on the invoice: supply and return static pressure, airflow at 995 CFM.'),
 @('Base closure','Close the bottom of the unit at the pad - base and duct openings - so rodents, snakes and weather cannot get up inside.'),
 @('Owner supplied','REKO R2000 twin-lamp UVC light - install and wire when the unit is set, no extra labour, lamps facing the coil.  ecobee Smart Thermostat Premium (EB-STATE6P-01) - run new 18 AWG with a C wire, install it, start it up. No power-stealing.'),
 @('PUT ON THE QUOTE','Model number + gas BTU in/out + HX material + HX warranty term.  Labour warranty: what it covers, how long, what it costs to 10 years.  Ductwork itemised, price per linear foot.  The permit + your TENNESSEE LICENCE NUMBER.  How soon you can start.'),
 @('How it is judged','10-YEAR COST, never the sticker: price + labour cover to 10 yr + refrigerant + any required maintenance plan.'),
 @('Reply to','jeff.loewen792@gmail.com - email everything so it can be tracked.')
)
$r = 4
foreach ($ln in $lines) {
  $s3.Cells.Item($r,1).Value2 = $ln[0]; $s3.Cells.Item($r,2).Value2 = $ln[1]; $s3.Cells.Item($r,1).Font.Bold = $true
  if ($ln[0] -like 'GATE*') { $s3.Range(("A{0}:B{0}" -f $r)).Interior.Color = (RGB 255 242 204) }
  $r++
}
$last3 = $r - 1
Finish $s3 4 $last3 2 @(24, 120) 12 'SCOPE + THE FOUR GATES - &D &T' 1

$ws.Activate()
$wb.SaveAs($xlsx, 51)
# Jeff 09-17 2:11 PM: the SCOPE sheet stays in the workbook but is NOT part of the printable file - "I know the job".
$wb.Worksheets.Item('BOARD').Select(); $wb.Worksheets.Item('DETAIL').Select($false)
$xl.ActiveSheet.ExportAsFixedFormat(0, $pdf) | Out-Null
Write-Output ("saved: " + $xlsx); Write-Output ("pdf (BOARD + DETAIL only): " + $pdf)
if ($env:NOPRINT -eq '1') { Write-Output "NOPRINT set - not printed" }
else { $printer=(Get-CimInstance Win32_Printer | Where-Object Default).Name; Write-Output ("printing BOARD + DETAIL to: " + $printer); $xl.ActiveSheet.PrintOut() | Out-Null; Write-Output "sent to printer" }
$ws.Select()
$wb.Close($false); $xl.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) | Out-Null
