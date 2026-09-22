# -*- coding: utf-8 -*-
# MEASUREMENT CARD - the minimum set of tape pulls that tightens the plan the most.
# Ranked so Jeff can stop anywhere and still have gained something.
import io
PF = 13.0
def X(f): return round((f + 2) * PF, 1)
def Y(f): return round((f + 7) * PF, 1)

DIM = "#c0392b"

def room(x, y, w, h, name, fill="#ffffff", stroke="#c5ccd3", sw=1.8, dash=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    if name:
        s += '<text x="%s" y="%s" font-size="8.6" font-weight="600" text-anchor="middle" fill="#8c959d">%s</text>' % (
            X(x + w / 2.0), Y(y + h / 2.0) + 3, name)
    return s

R = [
    room(0, 8, 12, 24, "GARAGE", "#fdfaf4", "#c8a97a", 2.0),
    room(12, 0, 15, 13, "MASTER BED"), room(27, 6, 8, 7, "FOYER"),
    room(35, 0, 10, 13, "GUEST BED"), room(45, 0, 11, 6, "", "#fbfbfb", "#c5ccd3", 1.4, True),
    room(45, 6, 11, 11, "GUEST BATH"), room(12, 13, 8, 9, "MASTER BATH"),
    room(12, 22, 8, 2, "", "#fbfbfb", "#c5ccd3", 1.4, True), room(20, 13, 7, 4, "LAUNDRY"),
    room(20, 17, 7, 7, "DINING"), room(27, 13, 18, 4, ""), room(27, 17, 14, 15, "LIVING ROOM"),
    room(41, 17, 15, 15, "OFFICE"), room(12, 24, 15, 8, "KITCHEN"),
    room(26, 32, 30, 11, "BACK DECK", "#fbfbfb", "#c8a97a", 1.6, True),
]
PORCH = room(27, 0, 8, 6, "PORCH", "#fbfbfb", "#c8a97a", 1.8)
SHELL = '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#39424b" stroke-width="3.4"/>' % (
    X(12), Y(0), 44 * PF, 32 * PF)

def dim(x1, y1, x2, y2, letter, lx, ly, horiz=True):
    s = '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2.4"/>' % (
        X(x1), Y(y1), X(x2), Y(y2), DIM)
    for (ax, ay), d in (((x1, y1), 1), ((x2, y2), -1)):
        if horiz:
            s += '<path d="M %s %s l %s -5 l 0 10 Z" fill="%s"/>' % (X(ax), Y(ay), d * 9, DIM)
        else:
            s += '<path d="M %s %s l -5 %s l 10 0 Z" fill="%s"/>' % (X(ax), Y(ay), d * 9, DIM)
    s += '<circle cx="%s" cy="%s" r="10.5" fill="%s"/>' % (X(lx), Y(ly), DIM)
    s += '<text x="%s" y="%s" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">%s</text>' % (
        X(lx), Y(ly) + 4.2, letter)
    return s

D = (dim(12, -3.4, 56, -3.4, "A", 34, -3.4)
     + dim(59, 0, 59, 32, "B", 59, 16, False)
     + dim(41, 34.8, 56, 34.8, "C", 48.5, 34.8)
     + dim(12, 15, 27, 15, "D", 19.5, 15)
     + dim(9.2, 0, 9.2, 13, "E", 9.2, 6.5, False)
     + dim(27, -1.5, 35, -1.5, "F", 31, -1.5)
     + dim(12, -1.5, 27, -1.5, "G", 19.5, -1.5)
     + dim(47, 13, 47, 17, "H", 47, 15, False))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Measurement card">%s%s%s%s</svg>' % (
    round(66 * PF), round(52 * PF), "".join(R), PORCH, SHELL, D)

ROWS = [
 ("A", "HOUSE WIDTH", "Outside, along the back wall. House only &mdash; do NOT include the garage.",
  "&#9733;&#9733;&#9733;",
  "The whole drawing is fitted inside 44 ft. If that is wrong, <b>every room in the house is wrong.</b>"),
 ("B", "HOUSE DEPTH", "Outside, down the east side, front wall to back wall.",
  "&#9733;&#9733;&#9733;",
  "32 ft is my number, not yours. <b>A and B together fix the box everything else is squeezed into.</b>"),
 ("C", "EAST WALL &rarr; the wall between the OFFICE and the LIVING ROOM",
  "Inside, along the back wall.", "&#9733;&#9733;&#9733;",
  "<b>The wall I have moved more than any other today.</b> It sets the office size, the living room size, "
  "AND how long the real corridor is."),
 ("D", "MASTER BEDROOM WIDTH", "Inside, west wall to east wall.", "&#9733;&#9733;",
  "Biggest room in the house and the anchor for the whole west half."),
 ("E", "MASTER BEDROOM DEPTH", "Inside, front wall to back wall.", "&#9733;&#9733;",
  "With D, pins the master bath, laundry and dining sitting below it."),
 ("F", "PORCH OPENING WIDTH", "Outside, across the front of the cubby, brick to brick.", "&#9733;&#9733;",
  "You said 12 ft, I drew 8. One of us is wrong, and it moves the foyer."),
 ("G", "WEST CORNER OF THE HOUSE &rarr; near edge of the PORCH", "Outside, along the front wall.",
  "&#9733;&#9733;", "Fixes where the porch actually sits, and with it the master bed / foyer split."),
 ("H", "HALLWAY WIDTH", "Inside the walled part of the corridor, wall to wall.", "&#9733;",
  "I have 4 ft. Small, but it is load-bearing for the two doors facing each other."),
]

rows = "".join(
 '<tr><td class="ltr">%s</td><td><b>%s</b><div class="how">%s</div><div class="why">%s</div></td>'
 '<td class="pri">%s</td><td class="blank"><span>ft</span></td><td class="blank"><span>in</span></td></tr>'
 % (l, w, h, y, p) for (l, w, h, p, y) in ROWS)

style = u"""<style>
*{box-sizing:border-box}
body{margin:0;font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff}
.sheet{padding:16px 22px;max-width:1500px;margin:0 auto}
.mast{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:12px;position:relative}
h1{font-size:25px;margin:0 0 3px;letter-spacing:-.4px}
.rev{position:absolute;right:0;top:2px;text-align:right;font-size:10.5px;color:#6b7480;text-transform:uppercase;letter-spacing:.5px;line-height:1.5}
.sub{font-size:12.5px;color:#39424b;max-width:900px}
.badge{display:inline-block;background:#c0392b;color:#fff;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:11px;margin-left:9px;vertical-align:3px}
.layout{display:grid;grid-template-columns:1fr 660px;gap:20px;align-items:start}
svg{width:100%;height:auto;display:block}
table{border-collapse:collapse;width:100%}
td{border-bottom:1px solid #dfe4e9;padding:7px 6px;vertical-align:top}
.ltr{width:30px;font-weight:700;color:#fff;background:#c0392b;text-align:center;font-size:14px;border-radius:4px;padding:5px 0;border-bottom:3px solid #fff}
.how{font-size:11px;color:#5a636d;margin-top:2px}
.why{font-size:11px;color:#2b6cb0;margin-top:3px}
.pri{width:44px;color:#c0392b;font-size:11px;text-align:center;letter-spacing:-1px}
.blank{width:64px}
.blank span{display:block;border-bottom:1.6px solid #111;height:26px;font-size:9px;color:#9aa4ae;text-align:right;padding-right:2px}
.note{background:#fdf1ec;border-left:4px solid #c0392b;padding:10px 12px;border-radius:0 5px 5px 0;font-size:12px;margin-top:14px}
.note2{background:#eef4fa;border-left:4px solid #2b6cb0;padding:10px 12px;border-radius:0 5px 5px 0;font-size:12px;margin-top:10px}
@media print{.sheet{padding:0}}
</style>"""

html = (u"<title>HCC — Measurement Card</title>\n" + style +
 u'\n<section class="sheet"><div class="mast">'
 u'<div class="rev">22 Sep 2026 9:38 AM<br>8 numbers &middot; about 15 minutes</div>'
 u'<h1>Eight Measurements<span class="badge">TAPE ONLY</span></h1>'
 u'<div class="sub"><b>Not the whole house.</b> These are the tape pulls with the most leverage, ranked '
 u'&mdash; <b>if you only do three, do A, B and C.</b> Six of the eight are from outside or along a '
 u'single wall, so nothing has to be moved to reach them.</div>'
 u'</div><div class="layout"><div>' + svg +
 u'<div class="note"><b>Why so few?</b> The plan is already internally consistent &mdash; every room is '
 u'a real rectangle and the schedule totals exactly to the outline. <b>What it lacks is one true '
 u'dimension to hang on besides the garage.</b> A and B give it the outside box; C fixes the wall I '
 u'have moved more than any other. Everything else is squeezed between those three.</div>'
 u'</div><div><table>' + rows + u'</table>'
 u'<div class="note2"><b>How to read them back to me:</b> just the letter and the number &mdash; '
 u'&ldquo;A is 46 4&rdquo;. Feet and inches is fine, I will do the arithmetic.<br><br>'
 u'<b>And if a number comes back and the rooms stop adding up, that is the point.</b> It means '
 u'something I inferred was wrong, and I would far rather find it now than leave it on the drawing '
 u'looking measured.</div>'
 u'<div class="note2"><b>Deliberately NOT on this list:</b> the <b>garage</b> (already taped at '
 u'12&times;24 &mdash; it is the anchor and it stays), the <b>closets</b> (you said you do not need '
 u'them), and the <b>back deck</b> (outside the heated box, nothing depends on it).</div>'
 u'</div></div></section>')

io.open("HCC_Measurement_Card.html", "w", encoding="utf-8").write(html)
print("measurement card built")
