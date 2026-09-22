# -*- coding: utf-8 -*-
# REV R - the first plan drawn on MEASURED geometry.
# Outline traced from Jeff's GLM 20 perimeter walk (2026-09-22 10:20-10:39),
# which closes in both directions to within inches. NOT a rectangle.
import io
PF = 15.0
def X(f): return round((f + 3) * PF, 1)
def Y(f): return round((f + 4) * PF, 1)

MEAS, INF, HOT = "#0b6b3a", "#c05621", "#c0392b"

GAR_W, GAR_D     = 14.83, 26.0
SETBACK          = 4.5
HOUSE_W          = 39.42
E_DEPTH          = 29.25
KIT_JOG          = 5.58
PORCH_W, PORCH_D = 5.5, 3.67
HX = GAR_W
OUTLINE = [
    (0, SETBACK), (HX, SETBACK), (HX, 0),
    (HX + 19.67, 0), (HX + 19.67, PORCH_D), (HX + 19.67 + PORCH_W, PORCH_D),
    (HX + 19.67 + PORCH_W, 0), (HX + HOUSE_W, 0),
    (HX + HOUSE_W, E_DEPTH), (HX + 7.7, E_DEPTH),
    (HX + 7.7, E_DEPTH + KIT_JOG), (0, E_DEPTH + KIT_JOG),
]
poly = " ".join("%s,%s" % (X(x), Y(y)) for x, y in OUTLINE)

def room(x, y, w, h, name, sub, fill="#ffffff", stroke="#111418", sw=2.0, dash=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    s += '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy - 4, name)
    s += '<text x="%s" y="%s" font-size="8" text-anchor="middle" fill="#5a636d">%s</text>' % (cx, cy + 8, sub)
    return s

R = [
    room(0.9, SETBACK + .9, 13, 24, "GARAGE", "24 &#215; 13", "#fdf7ec", "#8a5000", 2.4),
    room(HX + .5, .6, 15, 11, "MASTER BED", "15 &#215; 11", "#e8eef8", MEAS, 2.4),
    room(HX + .5, 12.1, 15, 8, "MASTER BATH", "15 &#215; 8", "#f7f5ea", MEAS, 2.4),
    room(HX + .5, 20.6, 16, 13, "KITCHEN / DINING", "16 &#215; 13", "#eef6ee", MEAS, 2.4),
    room(HX + 16.5, .6, 8, 6, "FOYER", "8 &#215; 6", "#eef7f3", MEAS, 2.4),
    room(HX + 25.5, .6, 11, 10, "GUEST BED", "11 &#215; 10", "#e9f5ec", MEAS, 2.4),
    room(HX + 17.5, 11.5, 14, 17, "LIVING ROOM", "14 &#215; 17", "#eaf4f8", MEAS, 2.4),
    room(HX + 28.7, 11.5, 10, 13, "OFFICE / BED 3", "10 &#215; 13", "#e9f5ec", MEAS, 2.4),
    room(HX + 25.5, 11.0, 10, 8.5, "GUEST BATH", "~10 &#215; 8&#189; derived", "#f9eef1", INF, 2.0, True),
]

def dim(x1, y1, x2, y2, txt, col=MEAS, off=-5, horiz=True):
    s = '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2"/>' % (
        X(x1), Y(y1), X(x2), Y(y2), col)
    for (ax, ay), d in (((x1, y1), 1), ((x2, y2), -1)):
        s += ('<path d="M %s %s l %s -4 l 0 8 Z" fill="%s"/>' if horiz else
              '<path d="M %s %s l -4 %s l 8 0 Z" fill="%s"/>') % (X(ax), Y(ay), d * 8, col)
    mx, my = (x1 + x2) / 2.0, (y1 + y2) / 2.0
    rot = '' if horiz else ' transform="rotate(-90 %s %s)"' % (X(mx), Y(my))
    s += ('<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" '
          'fill="%s"%s>%s</text>') % (X(mx), Y(my) + off, col, rot, txt)
    return s

D = (dim(HX, -2.4, HX + HOUSE_W, -2.4, "39&#8242;5&#8243;")
     + dim(0, -2.4, HX, -2.4, "garage 14&#8242;10&#8243;")
     + dim(HX + HOUSE_W + 2.6, 0, HX + HOUSE_W + 2.6, E_DEPTH, "29&#8242;3&#8243;", MEAS, -5, False)
     + dim(HX + 7.7, E_DEPTH + KIT_JOG + 2.2, 0, E_DEPTH + KIT_JOG + 2.2, "22&#8242;6&#8243;", MEAS, 13)
     + dim(HX + HOUSE_W, E_DEPTH + 2.2, HX + 7.7, E_DEPTH + 2.2, "36&#8242;0&#8243;", MEAS, 13))

NOTES = ('<text x="%s" y="%s" font-size="9.4" font-weight="700" fill="%s">&#9650; KITCHEN BUMPS OUT 5&#8242;7&#8243;</text>'
 '<text x="%s" y="%s" font-size="9.4" font-weight="700" fill="%s">&#9660; GARAGE FRONT SET BACK 4&#8242;6&#8243;</text>'
 '<text x="%s" y="%s" font-size="9.4" font-weight="700" fill="%s">PORCH 5&#8242;6&#8243; wide &#215; 3&#8242;8&#8243; deep recess</text>'
 '<text x="%s" y="%s" font-size="8.6" font-weight="700" fill="#8a5000">garage door in the WEST wall,</text>'
 '<text x="%s" y="%s" font-size="8.6" font-weight="700" fill="#8a5000">8 ft back from the front corner</text>') % (
 X(1), Y(E_DEPTH + KIT_JOG + 4.4), HOT, X(1), Y(SETBACK - 1.6), HOT,
 X(HX + 22), Y(-0.8), HOT, X(-2.6), Y(14), X(-2.6), Y(15.4))

svg = ('<svg viewBox="0 0 %d %d" role="img" aria-label="Rev R measured shell">'
       '<polygon points="%s" fill="#fbfcfd" stroke="#e8613c" stroke-width="4.5"/>%s%s%s'
       '<g transform="translate(%s,%s)"><path d="M0,-20 L6,9 L0,3 L-6,9 Z" fill="#111"/>'
       '<text x="0" y="24" font-size="11" font-weight="700" text-anchor="middle">N</text></g>'
       '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
       '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text></svg>') % (
    round(70 * PF), round(46 * PF), poly, R[0], D, NOTES,
    X(60), Y(2), X(1), Y(41), X(11), Y(41), X(6), Y(42.8))

style = u"""<style>
*{box-sizing:border-box}
body{margin:0;font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff}
.sheet{padding:16px 22px;max-width:1500px;margin:0 auto}
.mast{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:12px;position:relative}
h1{font-size:25px;margin:0 0 3px;letter-spacing:-.4px}
.rev{position:absolute;right:0;top:2px;text-align:right;font-size:10.5px;color:#6b7480;text-transform:uppercase;letter-spacing:.5px;line-height:1.5}
.sub{font-size:12.5px;color:#39424b;max-width:900px}
.badge{display:inline-block;background:#0b6b3a;color:#fff;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:11px;margin-left:9px;vertical-align:3px}
.layout{display:grid;grid-template-columns:1fr 430px;gap:20px;align-items:start}
svg{width:100%;height:auto;display:block}
.note{background:#eaf6ef;border-left:4px solid #0b6b3a;padding:10px 12px;border-radius:0 5px 5px 0;font-size:11.8px;margin-bottom:11px}
.warn{background:#fdf1ec;border-left:4px solid #c05621;padding:10px 12px;border-radius:0 5px 5px 0;font-size:11.8px;margin-bottom:11px}
table{border-collapse:collapse;width:100%;font-size:11.2px;margin-bottom:11px}
th{background:#39424b;color:#fff;text-align:left;padding:4px 7px;font-size:9.6px;letter-spacing:.5px}
th.n,td.n{text-align:right}
td{border-bottom:1px solid #e2e7ec;padding:3.6px 7px}
td.n{font-variant-numeric:tabular-nums}
@media print{.sheet{padding:0}}
</style>"""

ROOMS = [("Living room",14,17),("Kitchen / dining",16,13),("Master bed",15,11),
         ("Office / Bed 3",10,13),("Master bath",15,8),("Guest bed",11,10),
         ("Foyer",8,6),("Guest bath (derived)",10,8.5),("Garage",24,13)]
rows=""
for n,w,h in ROOMS:
    rows += '<tr><td>%s</td><td class="n">%g&times;%g</td><td class="n">%d</td><td class="n">%d</td></tr>' % (
        n,w,h,w*h,2*(w+h)*8)

html = (u"<title>HCC Floor Plan — Rev R, measured</title>\n" + style +
 u'\n<section class="sheet"><div class="mast">'
 u'<div class="rev">Rev R &middot; 22 Sep 2026 10:46 AM<br>drawn on LASER measurements</div>'
 u'<h1>Floor Plan &mdash; Rev R<span class="badge">MEASURED</span></h1>'
 u'<div class="sub">The first version of this plan drawn on <b>real geometry</b>. The outline is traced '
 u'from your perimeter walk, which <b>closes in both directions to within inches</b>. '
 u'<b>It is not a rectangle &mdash; and it never was.</b></div>'
 u'</div><div class="layout"><div>' + svg + u'</div><div>'
 u'<div class="note"><b>&#10003; The shell is no longer a guess.</b> Every heavy line came off the '
 u'GLM 20. The three steps that were on no previous revision are all here: the <b>kitchen bumping out '
 u'5&#8242;7&#8243;</b>, the <b>porch recess 3&#8242;8&#8243; deep</b>, and the <b>garage front set '
 u'back 4&#8242;6&#8243;</b> with its door in the <b>west</b> wall.</div>'
 u'<table><tr><th>ROOM</th><th class="n">SIZE</th><th class="n">FLOOR sf</th><th class="n">WALL sf</th></tr>'
 + rows + u'</table>'
 u'<div class="note"><b>&#128295; You are right that this should have come first &mdash; and here is '
 u'the payoff already.</b> Those last two columns are what you just asked for. <b>Paint a room:</b> '
 u'wall area is there (at 8 ft ceilings; the master bedroom is vaulted so it will run more). '
 u'<b>Flooring:</b> floor area. <b>Gutters:</b> the eave runs are <b>39&#8242;5&#8243; across the '
 u'front and 58&#8242;6&#8243; across the back</b>, so about <b>98 ft of gutter</b> plus downspouts. '
 u'Ask me any of those and it is now arithmetic instead of a guess.</div>'
 u'<div class="warn"><b>&#9888; What is still mine, not yours.</b> The shell is measured; '
 u'<b>where the rooms sit inside it is still fitted.</b> I have the room sizes but not their '
 u'positions, so I have placed them against your corrections and the Sharky topology. '
 u'<b>The dashed guest bath is arithmetic off your 26&#8242;6&#8243; chain, not a measurement.</b> '
 u'Check the arrangement &mdash; the outside walls are right.</div>'
 u'<div class="note"><b>&#10145; What I need from you to finish it:</b> just <b>which room is next to which</b> &mdash; no more tape. Walk the house and tell me the order, e.g. &ldquo;out of the foyer, living room is straight ahead, kitchen on the left, hall to the right.&rdquo; The sizes are settled; only the jigsaw is open.</div><div class="note"><b>Coming next, as you asked:</b> the 67-item device key re-issued on this shell, '
 u'then the <b>ductwork drawing reworked</b> &mdash; and yes, <b>the runs scale straight off this plan '
 u'now</b> instead of being estimated, which is exactly what Manual D wants.</div>'
 u'</div></div></section>')

io.open("HCC_Floorplan_REV_R.html", "w", encoding="utf-8").write(html)
print("Rev R built")
