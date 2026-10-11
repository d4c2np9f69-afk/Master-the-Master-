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

HALLSPLIT = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#f4f8fb" stroke-width="5"/>'
             '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2.0" stroke-dasharray="5 4"/>'
             '<text x="%s" y="%s" font-size="6.9" font-weight="700" text-anchor="middle" fill="%s">OPEN to the living room</text>'
             '<text x="%s" y="%s" font-size="6.9" font-weight="700" text-anchor="middle" fill="%s">not really a hallway yet</text>'
             '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111418" stroke-width="3.0"/>'
             '<text x="%s" y="%s" font-size="6.9" font-weight="700" text-anchor="middle" fill="#111418">REAL CORRIDOR</text>'
             '<text x="%s" y="%s" font-size="6.6" font-weight="700" text-anchor="middle" fill="%s">&#9654; ends in the GUEST BATH</text>') % (
    X(27), Y(17), X(38), Y(17),
    X(27), Y(17), X(38), Y(17), CONF,
    X(32.5), Y(15.1), CONF, X(32.5), Y(16.3), CONF,
    X(38), Y(17), X(45), Y(17),
    X(41.5), Y(15.1), X(41.5), Y(16.4), NEW)

BAY = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#eaf4f8" stroke="%s" stroke-width="2.8"/>'
       '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="6"/>'
       '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">BAY WINDOW</text>') % (
    X(29), Y(32), 5 * PF, 2.4 * PF, NEW,
    X(29.3), Y(32), X(33.7), Y(32),
    X(31.5), Y(35.4), NEW)

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
    room(27, 13, 18, 4, "HALLWAY", "", "#f4f8fb", CONF, 2.6),

    room(27, 17, 18, 15, "LIVING ROOM", "centre block only", "#eaf4f8"),
    room(45, 13, 11, 19, "OFFICE / BED 3", "&#9650; THE WHOLE EAST COLUMN", "#e9f5ec", NEW, 3.4),
    room(12, 24, 15, 8, "KITCHEN + DINING", "", "#eef6ee"),

    room(26, 32, 30, 11, "BACK DECK", "ELEVATED on posts", "#f4f7f4", "#8a5000", 2.2, True),
]

# the projecting front GABLE (arched window), and the porch tucked in the ell beside it
PORCH = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#f2e8da" stroke="%s" stroke-width="3.2"/>'
         '<text x="%s" y="%s" font-size="8.2" font-weight="700" text-anchor="middle" fill="%s">FRONT GABLE</text>'
         '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="%s">projects 4 ft &middot; ARCHED WINDOW</text>'
         '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="#12507e" stroke-width="4.2"/>'
         '<rect x="%s" y="%s" width="%s" height="%s" fill="#faf6ee" stroke="%s" stroke-width="3.2" stroke-dasharray="6 3"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.4"/>'
         '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="%s">FRONT PORCH</text>'
         '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">12 &#215; 6 &middot; covered &middot; in the ell</text>'
         '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">&#9660; front door into the FOYER</text>') % (
    X(21), Y(-4), 6 * PF, 4 * PF, NEW,
    X(24), Y(-2.6), NEW, X(24), Y(-1.4), NEW,
    X(22.4), Y(-4), 1.6 * PF, 1.6 * PF, X(25.6), Y(-4),
    X(27), Y(-6), 12 * PF, 6 * PF, NEW,
    X(27), Y(0), X(39), Y(0), NEW,
    X(33), Y(-4.4), NEW, X(33), Y(-3.2), NEW, X(33), Y(-1.4), CONF)

F = [
    fx(29, -1.2, "outlet"), fx(32, -1.2, "bell"), fx(38.2, -3.4, "FLAG", "#c0392b", 5.0),
    fx(16, 3.5, "bed"), fx(22, 2.2, "gateway", "#12507e"), fx(25.5, 2.2, "TV"),
    fx(25.5, 6.5, "DRESSER", "#6b3fa0", 5.2), fx(19, 10.5, "THE BEAST", "#6b3fa0", 5.4),
    fx(15, 10.5, "J45", "#12507e"),
    fx(14.5, 17, "toilet"), fx(17.5, 17, "tub"), fx(20.5, 17, "sink"),
    fx(24.5, 16, "washer"), fx(24.5, 21, "dryer"),
    fx(14.5, 30.5, "stove"), fx(17.5, 30.5, "fridge"), fx(20.5, 30.5, "sink"),
    fx(24, 29, "bar"), fx(24.5, 26.2, "TABLE", "#6b3fa0", 5.2),
    fx(43.3, 22, "FIREPLACE", "#c0392b", 5.8), fx(33, 19.4, "RETURN", "#c0392b", 5.4),
    fx(29.5, 19.4, "stat", "#c0392b"), fx(36, 22.5, "fan"), fx(36, 31.2, "deck dr"),
    fx(48, 18.5, "RE200", "#6b3fa0", 5.0), fx(48, 24.5, "4-mon", "#6b3fa0", 5.0),
    fx(53, 24.5, "printer"),
    fx(6, 9.5, "MAIN DOOR", "#8a5000", 5.4), fx(1.6, 16, "man dr"), fx(1.6, 21, "panel", "#c0392b"),
    fx(8, 14, "TV"), fx(8, 18, "fan"), fx(5, 24, "bench"), fx(9, 24, "pegbd"),
    fx(5, 28, "saws"), fx(9, 28, "cutter"), fx(7, 26, "GARAGE PC", "#6b3fa0", 5.2),
    fx(52, 37, "outdoor TV", "#12507e", 5.2), fx(28, 41, "STEPS", "#8a5000", 5.0),
]

W = (win(19, 0) + win(40, 0) + win(50, 0)
     + win(17, 32) + win(41, 32) + win(47, 32) + win(52, 32)
     + win(56, 18, False) + win(56, 27, False))

D = (door(27, 11.5, "mbed") + door(45, 15.5, "office") + door(47.5, 13, "gbath")
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
    round(84 * PF), round(64 * PF), DRIVE, "".join(R), HALLSPLIT + BAY + PORCH, "".join(F), W, D, ETH, EAST, CHIM, ext, sc)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>&#128248; Your three shots changed the answer on the porch</h3>
<div class="note"><b>The driveway shot shows a PROJECTING FRONT GABLE with a tall arched window, and
the porch sits beside it.</b> That is the piece I was missing, and it dissolves the square-footage
problem I asked you about.
<p style="margin:6px 0"><b>The porch is not carved out of the house &mdash; it is tucked into the ell
BESIDE a wing that sticks out.</b> The brick on both sides in the doorbell shot is the gable's side
wall on one hand and the porch's own return on the other. So <b>no heated floor area is lost</b>, and
the house stays at <b>1,408 sf</b>.</p>
<p style="margin:6px 0">&#10003; <b>And it means your 12 &times; 8 was right and my 8 &times; 6 was
wrong.</b> The two railing sections either side of the step read as about <b>12 ft across the
opening</b>. Drawn <b>12 wide &times; 6 deep</b>. If it is 8 ft deep rather than 6, say so &mdash;
nothing else on the plan moves, because it sits outside the heated box now.</p></div>

<div class="note"><b>&#10003; 9:01 AM &mdash; &ldquo;it&rsquo;s not really a hallway until the living
room ends, and the hallway ends in the guest bathroom.&rdquo;</b> Drawn that way now: the
<b>west stretch has no south wall at all</b> &mdash; it is simply the open north edge of the living
room &mdash; and it becomes a <b>real walled corridor</b> only where the living room stops, running
east and <b>terminating at the guest bathroom door</b>. That door has moved from the guest bath's west
wall to its <b>south wall, at the end of the corridor</b>. <b>I guessed the changeover at 11 ft along
&mdash; mark where it really is.</b></div>

<h3>What else the photos gave me</h3>
<ul>
<li>&#128375; <b>A BAY WINDOW projecting off the rear</b>, just west of the deck door, with its own
little hipped roof. <b>It was not on the plan at all.</b> Drawn 5 ft wide, projecting 2.5 ft.</li>
<li>&#9873; <b>The FLAG is on the porch's EAST brick pier</b>, hanging out over the lawn
&mdash; I had it sitting on the porch ceiling line. Moved.</li>
<li>&#129003; <b>Rear windows re-placed off the actual elevation:</b> one small one in the blank
brick at the garage end, then the bay, then the deck door, then <b>three window groups running east
&mdash; and those east ones are the OFFICE's.</b> An office that is also Bed 3, with its own windows
and deck frontage, is exactly what the photo shows.</li>
<li>&#128254; <b>Deck trimmed</b> to finish at the east wall instead of running past it, and the
outdoor TV pulled in to where it actually sits.</li>
</ul>

<div class="note"><b>&#9989; Four things the backyard shot confirms were already drawn right</b>
&mdash; steps at the <b>west</b> end of the deck, <b>chimney east of centre</b>, <b>plain brick with
one small window across the whole garage end</b>, and the <b>driveway up the west side</b>. Nothing
to change on any of them.</div>

<div class="warn"><b>&#9888; Two things I am still guessing at, both flagged on the drawing:</b>
<ul style="margin-top:5px">
<li><b>The PANTRY</b> &mdash; 10 &times; 3 off the south end of the master bath, where your arrow
pointed. Position and size are mine, not yours.</li>
<li><b>Where the front gable actually sits.</b> I put it just west of the porch, over the master
bedroom, because that is the order the driveway shot reads in. <b>If the gable is east of the porch
instead, flip the two.</b></li>
</ul></div>

<div class="note"><b>Unchanged and still anchored:</b> garage <b>12 &times; 24</b>, your tape measure.
House <b>44 &times; 32 = 1,408 sf</b>. Office <b>11 &times; 19 = 209 sf</b>, the whole east column,
per your circle. <b>11 pixels to the foot.</b></div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev O</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev O &middot; 22 Sep 2026 8:57 AM &middot; off your three photos<br>anchored on the 12&times;24 garage</div>'
        u'<h1>Floor Plan &mdash; Rev O<span class="draftbadge">the porch is an ELL</span></h1>'
        u'<div class="sub"><b>A projecting front gable with an arched window</b> &mdash; so the porch is tucked '
        u'BESIDE it, not carved out of the house. <b>No floor area is lost, and your 12&times;8 was right.</b> '
        u'Plus a <b>bay window on the rear</b> that was never on the plan, the flag moved to its real pier, and '
        u'the rear windows re-placed off the elevation.</div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_O.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev O built")
