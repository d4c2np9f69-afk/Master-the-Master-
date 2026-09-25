# -*- coding: utf-8 -*-
# Rev N - Jeff's pen markup of 2026-09-22 8:45 AM, read off and drawn.
# Headline: the OFFICE is the WHOLE EAST COLUMN (11x19 = 209 sf). He circled the
# 11x8 previously labelled "LIVING ROOM (east end)" and wrote OFFICE across both,
# with a line out to the B-hyve. Office is EAST, which clears the conflict.
import io
PF = 11.0
def X(f): return round((f + 16) * PF, 1)
def Y(f): return round((f + 13) * PF, 1)

NEW = "#c05621"
CONF = "#0b6b3a"

def room(x, y, w, h, name, sub="", fill="#eef3f8", stroke="#111418", sw=2.2, dash=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    if name:
        s += '<text x="%s" y="%s" font-size="10.4" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy - 3, name)
        s += '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">%g&#215;%g = %d sf</text>' % (cx, cy + 8, w, h, int(w * h))
    if sub:
        s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">%s</text>' % (cx, cy + 18, NEW, sub)
    return s

def fx(x, y, label, col="#8a5000", r=4.0):
    return ('<circle cx="%s" cy="%s" r="%s" fill="#fff" stroke="%s" stroke-width="1.7"/>'
            '<text x="%s" y="%s" font-size="6.8" font-weight="700" text-anchor="middle" fill="%s">%s</text>') % (
        X(x), Y(y), r, col, X(x), Y(y) - 6.5, col, label)

def win(x, y, horiz=True, L=3.0):
    if horiz:
        return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="4.4"/>'
                '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="1.5"/>') % (
            X(x - L / 2), Y(y), X(x + L / 2), Y(y), X(x - L / 2), Y(y), X(x + L / 2), Y(y))
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="4.4"/>'
            '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="1.5"/>') % (
        X(x), Y(y - L / 2), X(x), Y(y + L / 2), X(x), Y(y - L / 2), X(x), Y(y + L / 2))

def door(x, y, label=""):
    s = '<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.8" stroke-dasharray="3 2"/>' % (
        X(x), Y(y), 2.6 * PF, NEW)
    s += '<text x="%s" y="%s" font-size="6.8" font-weight="700" text-anchor="middle" fill="%s">%s</text>' % (
        X(x), Y(y) + 2, NEW, label)
    return s

R = [
    room(0, 8, 12, 24, "GARAGE", "", "#fdf7ec", "#8a5000", 2.8),
    room(0, 0, 12, 8, "", "moved here", "#fdeee6", NEW, 2.4, True),

    room(12, 0, 15, 13, "MASTER BED", "", "#e8eef8"),
    room(27, 0, 8, 13, "FOYER", "", "#eef7f3"),
    room(35, 0, 10, 13, "GUEST BED", "", "#e9f5ec"),
    room(45, 0, 11, 13, "GUEST BATH", "TUB + SINK", "#f9eef1"),

    room(12, 13, 10, 8, "MASTER BATH", "toilet &middot; tub &middot; sink", "#f7f5ea"),
    room(12, 21, 10, 3, "PANTRY", "NEW", "#f2efe0", NEW, 2.6),
    room(22, 13, 5, 11, "LAUNDRY", "", "#f7f5ea"),
    room(27, 13, 18, 4, "HALLWAY", "18&#215;4, back to E-W", "#f4f8fb", CONF, 2.6),

    room(27, 17, 18, 15, "LIVING ROOM", "centre block only", "#eaf4f8"),
    room(45, 13, 11, 19, "OFFICE / BED 3", "&#9650; THE WHOLE EAST COLUMN", "#e9f5ec", NEW, 3.4),
    room(12, 24, 15, 8, "KITCHEN + DINING", "", "#eef6ee"),

    room(26, 32, 32, 11, "BACK DECK", "ELEVATED on posts", "#f4f7f4", "#8a5000", 2.2, True),
]

PORCH = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#faf6ee" stroke="%s" stroke-width="3.2"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="7"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.2"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.2"/>'
         '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="%s">FRONT PORCH</text>'
         '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">RECESSED &middot; covered</text>'
         '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">&#9660; into the FOYER</text>') % (
    X(27), Y(0), 8 * PF, 6 * PF, NEW,
    X(27.4), Y(0), X(34.6), Y(0),
    X(27), Y(0), X(27), Y(6), NEW,
    X(35), Y(0), X(35), Y(6), NEW,
    X(31), Y(2.2), NEW, X(31), Y(3.5), NEW, X(31), Y(4.8), CONF)

F = [
    fx(28.2, 1.0, "outlet"), fx(31, 1.0, "bell"), fx(33.8, 1.0, "flag"),
    fx(16, 3.5, "bed"), fx(22, 2.2, "gateway", "#12507e"), fx(25.5, 2.2, "TV"),
    fx(25.5, 6.5, "DRESSER", "#6b3fa0", 5.2), fx(19, 10.5, "THE BEAST", "#6b3fa0", 5.4),
    fx(15, 10.5, "J45", "#12507e"),
    fx(14.5, 17, "toilet"), fx(17.5, 17, "tub"), fx(20.5, 17, "sink"),
    fx(24.5, 16, "washer"), fx(24.5, 21, "dryer"),
    fx(14.5, 30.5, "stove"), fx(17.5, 30.5, "fridge"), fx(20.5, 30.5, "sink"),
    fx(24, 29, "bar"), fx(24.5, 26.2, "TABLE", "#6b3fa0", 5.2),
    fx(43.3, 22, "FIREPLACE", "#c0392b", 5.8), fx(33, 19.4, "RETURN", "#c0392b", 5.4),
    fx(29.5, 19.4, "stat", "#c0392b"), fx(36, 22.5, "fan"), fx(34, 31.2, "deck dr"),
    fx(48, 18.5, "RE200", "#6b3fa0", 5.0), fx(48, 24.5, "4-mon", "#6b3fa0", 5.0),
    fx(53, 24.5, "printer"),
    fx(6, 9.5, "MAIN DOOR", "#8a5000", 5.4), fx(1.6, 16, "man dr"), fx(1.6, 21, "panel", "#c0392b"),
    fx(8, 14, "TV"), fx(8, 18, "fan"), fx(5, 24, "bench"), fx(9, 24, "pegbd"),
    fx(5, 28, "saws"), fx(9, 28, "cutter"), fx(7, 26, "GARAGE PC", "#6b3fa0", 5.2),
    fx(54, 36, "outdoor TV", "#12507e", 5.2), fx(28, 40, "STEPS", "#8a5000", 5.0),
]

W = (win(19, 0) + win(40, 0) + win(50, 0)
     + win(16, 32) + win(21, 32) + win(31, 32) + win(40, 32)
     + win(56, 18, False) + win(56, 27, False))

D = (door(27, 11.5, "mbed") + door(45, 15.5, "office") + door(45, 6.5, "gbath")
     + door(38.5, 13, "gbed"))

ETH = ''
for ex, ey in ((40, 6.5), (53, 18.5)):
    ETH += '<rect x="%s" y="%s" width="20" height="12" rx="2" fill="#0b6b3a"/>' % (X(ex) - 10, Y(ey) - 6)
    ETH += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#fff">ETH</text>' % (X(ex), Y(ey) + 3)

DRIVE = ('<path d="M %s %s L %s %s L %s %s L %s %s" fill="none" stroke="#9aa4ae" stroke-width="9" opacity="0.5"/>'
         '<text x="%s" y="%s" font-size="8.6" font-weight="700" text-anchor="middle" fill="#6b7480" '
         'transform="rotate(-90 %s %s)">DRIVEWAY</text>'
         '<path d="M %s %s L %s %s L %s %s" fill="none" stroke="#9aa4ae" stroke-width="5" opacity="0.6"/>'
         '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#6b7480">SIDEWALK</text>') % (
    X(-9), Y(44), X(-9), Y(14), X(-4), Y(14), X(-4), Y(9),
    X(-11.5), Y(30), X(-11.5), Y(30),
    X(-4), Y(12), X(-4), Y(-5), X(31), Y(-5),
    X(14), Y(-6.3))

EAST = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2.4"/>'
        '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>'
        '<circle cx="%s" cy="%s" r="8" fill="#fff" stroke="#12507e" stroke-width="2.2"/>'
        '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#12507e">B</text>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="2.2" stroke-dasharray="4 3"/>'
        '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve</text>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">through the office brick</text>') % (
    X(58), Y(6), 4 * PF, 4 * PF, X(60), Y(8.3),
    X(59.5), Y(22), X(59.5), Y(22.3),
    X(56), Y(22), X(59.5) - 8, Y(22),
    X(59.5), Y(24.4), X(60.5), Y(25.9))

CHIM = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#8a5000" stroke="#5a3400" stroke-width="1.6"/>'
        '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#8a5000">CHIMNEY</text>') % (
    X(44.6), Y(24.4), 2.0 * PF, 2.0 * PF, X(45.6), Y(27.3))

ext = '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5.5"/>' % (
    X(12), Y(0), 44 * PF, 32 * PF)

sc = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text>'
      '<g transform="translate(%s,%s)"><path d="M0,-19 L6,8 L0,2.5 L-6,8 Z" fill="#111"/>'
      '<text x="0" y="23" font-size="10" font-weight="700" text-anchor="middle">N</text></g>') % (
    X(12), Y(46.5), X(22), Y(46.5), X(17), Y(48.6), X(63), Y(-3))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Floor plan Rev N">%s%s%s%s%s%s%s%s%s%s%s</svg>' % (
    round(84 * PF), round(64 * PF), DRIVE, "".join(R), PORCH, "".join(F), W, D, ETH, EAST, CHIM, ext, sc)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>&#128077; Your circle settled it &mdash; and it settled it the other way</h3>
<div class="note"><b>You drew OFFICE across BOTH the 11&times;11 and the 11&times;8 below it</b>, with
a line running out to the B-hyve. So the office is <b>the entire east column, 11 &times; 19 = 209
sf</b>, on the <b>EAST</b> wall &mdash; the brick the B-hyve is mounted through.
<p style="margin:6px 0"><b>That clears the contradiction I could not resolve.</b> When you said
&ldquo;the living room southwest corner is really the office&rdquo;, the corner your pen actually
circled is the <b>southEAST</b> piece. The office never moved west. Your pen says east, the B-hyve
says east, and the chimney in the roof shot says the fireplace is east. <b>All three agree now.</b></p>
<p style="margin:6px 0">So the <b>living room is the centre block only, 18 &times; 15 = 270 sf</b>,
and the doors work: from the hallway, <b>guest bed on the north side, office straight off the east
end</b>. The hallway stays <b>18 &times; 4 east&ndash;west</b> &mdash; I turned it 90&deg; in Rev M
and <b>that was wrong. It is turned back.</b></p></div>

<h3>Everything else off your pen</h3>
<ul>
<li>&#127859; <b>PANTRY &mdash; a room that has never been on this plan.</b> Drawn 10 &times; 3 off
the south end of the master bath, where your arrow pointed toward the kitchen. <b>The size and the
exact spot are my guess.</b> Correct it.</li>
<li>&#128293; <b>FIREPLACE moved to the LIVING ROOM'S EAST WALL</b>, where your arrow put it &mdash;
and it lines up with the chimney on the east half of the roof.</li>
<li>&#128704; <b>Master bath: toilet &middot; tub &middot; sink. Guest bath: tub + sink.</b> Neither
room had a single fixture on it before today.</li>
<li>&#128716; <b>DRESSER and TV on the master bedroom's east wall</b>, bed to the west, <b>door at the
southeast</b>.</li>
<li>&#127869; <b>Dining TABLE</b> at the east end of the kitchen, by the bar.</li>
<li>&#129003; <b>Nine windows placed</b> &mdash; three north, four south (two kitchen, two living
room), two east in the office.</li>
<li>&#128682; <b>Four door swings</b> &mdash; master bed, office, guest bath, guest bed.</li>
<li>&#128739; <b>DRIVEWAY down the west side and a SIDEWALK up to the porch.</b> First time either
has been on the drawing at all.</li>
<li>&#128254; <b>Deck:</b> steps at the <b>west</b> end, outdoor TV at the <b>east</b> end where you
moved it, and the deck carried further east.</li>
</ul>

<div class="warn"><b>&#9888; One number I need you to settle, because it changes the square footage.</b>
<p style="margin:6px 0">A <b>recessed</b> porch is <b>carved out of</b> the heated floor area, not
added to it. Drawn at <b>8 &times; 6 that removes 48 sf</b>, so the house reads <b>1,360 sf</b>
instead of 1,408.</p>
<p style="margin:6px 0">Your sheet had the porch at <b>12 &times; 8 = 96 sf</b>. Recessed at that
size the house drops to <b>1,312</b> and the foyer behind it gets very shallow. <b>So either the
porch is smaller than 12 &times; 8, or the house is deeper than 32 ft.</b> I drew the smaller one.
Which is right?</p></div>

<div class="note"><b>Still anchored on the garage</b> &mdash; 12 &times; 24, your tape measure, at the
south end of the west side as you told me, with the 12 &times; 8 now on the north. <b>11 pixels to
the foot throughout.</b></div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev N</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev N &middot; 22 Sep 2026 8:45 AM &middot; your markup read off<br>anchored on the 12&times;24 garage</div>'
        u'<h1>Floor Plan &mdash; Rev N<span class="draftbadge">the office is EAST</span></h1>'
        u'<div class="sub"><b>The OFFICE is the whole east column, 11&times;19 = 209 sf</b> &mdash; your circle, '
        u'and the line you drew out to the B-hyve. Living room is the centre block only. Hallway turned back to '
        u'east&ndash;west. <b>Pantry, fireplace on the east wall, bath fixtures, nine windows, four doors, '
        u'driveway and sidewalk all added.</b></div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_N.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev N built")
