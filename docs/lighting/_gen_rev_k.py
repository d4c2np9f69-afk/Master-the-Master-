# -*- coding: utf-8 -*-
# Rev K - Jeff's 2026-09-22 8:18 AM answers folded in.
import io
PF = 11.0
def X(f): return round((f + 14) * PF, 1)
def Y(f): return round((f + 12) * PF, 1)

def room(x, y, w, h, name, sub="", fill="#eef3f8", stroke="#111418", sw=2.2, dash=False, nosf=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    s += '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy - 3, name)
    if not nosf:
        s += '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">%g&#215;%g = %d sf</text>' % (cx, cy + 8, w, h, int(w * h))
    if sub:
        s += '<text x="%s" y="%s" font-size="7.4" text-anchor="middle" fill="#0b6b3a">%s</text>' % (cx, cy + (18 if not nosf else 8), sub)
    return s

def fx(x, y, label, col="#8a5000", r=4.2):
    return ('<circle cx="%s" cy="%s" r="%s" fill="#fff" stroke="%s" stroke-width="1.7"/>'
            '<text x="%s" y="%s" font-size="6.9" font-weight="700" text-anchor="middle" fill="%s">%s</text>') % (
        X(x), Y(y), r, col, X(x), Y(y) - 7, col, label)

def eth(x, y, label):
    s = '<rect x="%s" y="%s" width="20" height="12" rx="2" fill="#0b6b3a" stroke="#fff" stroke-width="1.4"/>' % (X(x) - 10, Y(y) - 6)
    s += '<text x="%s" y="%s" font-size="7.8" font-weight="700" text-anchor="middle" fill="#fff">ETH</text>' % (X(x), Y(y) + 3)
    s += '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#0b6b3a">%s</text>' % (X(x), Y(y) + 16, label)
    return s

CONF = "#0b6b3a"   # confirmed by Jeff
CHG  = "#c05621"   # changed this revision

R = [
    room(0, 0, 12, 24, "GARAGE", "12&#215;24 MEASURED", "#fdf7ec", "#8a5000", 2.6),
    room(12, 0, 15, 13, "MASTER BED", "vaulted &middot; THE BEAST + J45", "#e8eef8"),
    room(27, 0, 8, 13, "FOYER", "", "#eef7f3"),
    room(35, 0, 10, 13, "GUEST BED", "ethernet drop", "#e9f5ec"),

    # CHANGED: guest bath shrunk 11x13 -> 11x8, the 11x5 goes to the office
    room(45, 0, 11, 8, "GUEST BATH", "&#9660; SHRUNK 13ft &rarr; 8ft", "#f9eef1", CHG, 3.0),

    room(12, 13, 10, 11, "MASTER BATH", "", "#f7f5ea"),
    room(22, 13, 5, 11, "LAUNDRY ROOM", "washer/dryer facing", "#f7f5ea"),

    # CONFIRMED 18x4, and it is NOT a walled corridor - dashed = open
    room(27, 13, 18, 4, "HALLWAY", "18&#215;4 CONFIRMED &middot; ALL OPEN", "#f4f8fb", CONF, 2.6, True),

    # CHANGED: office takes the 11x5 the bathroom gave up
    room(45, 8, 11, 16, "OFFICE / BED 3", "&#9650; GREW &middot; RE200 &middot; eth &middot; 4 monitors", "#e9f5ec", CHG, 3.0),

    # CHANGED: kitchen grown east 15ft -> 20ft
    room(12, 24, 20, 8, "KITCHEN + DINING", "&#9654; GREW 15ft &rarr; 20ft", "#eef6ee", CHG, 3.0),

    # CONFIRMED: living room = the centre block AND the southeast corner (one L)
    room(27, 17, 18, 7, "", "", "#eaf4f8", CONF, 2.6),
    room(32, 24, 13, 8, "", "", "#eaf4f8", CONF, 2.6),
    room(45, 24, 11, 8, "", "", "#eaf4f8", CONF, 2.6),

    room(27, -8, 12, 8, "COVERED FRONT PORCH", "", "#faf6ee", "#8a5000", 2.2, True),
    room(12, 32, 40, 11, "BACK DECK", "ELEVATED on posts &middot; open &middot; NO hot tub", "#f4f7f4", "#8a5000", 2.2, True),
]

# one label for the L-shaped living room, plus erase the two internal seams
LR = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#eaf4f8" stroke-width="4"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#eaf4f8" stroke-width="4"/>'
      '<text x="%s" y="%s" font-size="11" font-weight="700" text-anchor="middle">LIVING ROOM</text>'
      '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">centre block + SE corner = 318 sf</text>'
      '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">&#10003; CONFIRMED - takes both</text>') % (
    X(32), Y(24), X(45), Y(24),
    X(45), Y(24), X(45), Y(24) + 0.1,
    X(38), Y(20.4), X(38), Y(21.9), X(38), Y(23.2), CONF)

F = [
    fx(29.8, -4, "outlet"), fx(33, -4, "bell"), fx(36.3, -4, "flag"),
    fx(15, 4, "window"), fx(20, 10.5, "bed"), fx(21, 1.4, "TV"), fx(23.6, 2.6, "gateway", "#12507e"),
    fx(24.5, 16, "washer"), fx(24.5, 21, "dryer"),
    fx(14.5, 31, "stove"), fx(17.5, 31, "fridge"), fx(21, 31, "sink"), fx(25, 29, "bar"),
    fx(30, 19, "fplc+TV"), fx(34, 19, "RETURN", "#c0392b", 5.4), fx(38.5, 19, "stat", "#c0392b"),
    fx(36, 22.5, "fan"), fx(36, 31.2, "deck dr"),
    fx(48, 20, "4-mon", "#6b3fa0"), fx(53, 20, "print"),
    fx(6, 1.5, "MAIN DOOR"), fx(1.5, 8, "man dr"), fx(3, 13, "panel", "#c0392b"),
    fx(8, 6, "TV"), fx(8, 10.5, "fan"), fx(5, 17, "bench"), fx(9, 17, "pegbd"),
    fx(5, 21, "saws"), fx(9, 21, "mower"), fx(7, 18.6, "GARAGE PC", "#6b3fa0", 5.4),
    fx(32, 36, "outdoor TV", "#12507e"), fx(14, 41, "STEPS"),
    fx(57.5, 19, "B", "#12507e", 7.5),
]

# the doors that are straight across - the one thing still unresolved
DOORS = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#c0392b" stroke-width="3.4" stroke-dasharray="5 3"/>'
         '<circle cx="%s" cy="%s" r="10" fill="none" stroke="#c0392b" stroke-width="2.4"/>'
         '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="#c0392b">?</text>'
         '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#c0392b">'
         'you said these two doors face each other</text>'
         '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#c0392b">'
         '- they cannot, drawn this way. See the question.</text>') % (
    X(40), Y(13), X(48), Y(13), X(44), Y(13), X(44), Y(13) + 3.2, X(44), Y(10.2), X(44), Y(11.6))

marks = eth(40, 6.5, "guest bed") + eth(50.5, 12.5, "office / RE200") + "".join(F) + LR + DOORS

ext = ('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5" opacity="0.85"/>'
       '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5" opacity="0.85"/>') % (
    X(12), Y(0), round(44 * PF, 1), round(32 * PF, 1), X(0), Y(0), round(12 * PF, 1), round(24 * PF, 1))

outs = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2"/>'
        '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve +</text>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">irrigation</text>') % (
    X(57.5), Y(12), round(4 * PF, 1), round(4 * PF, 1), X(59.5), Y(14.2),
    X(57.5), Y(22), X(57.5), Y(23.8))

sc = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text>'
      '<g transform="translate(%s,%s)"><path d="M0,-20 L6,9 L0,3 L-6,9 Z" fill="#111"/>'
      '<text x="0" y="24" font-size="10" font-weight="700" text-anchor="middle">N</text></g>') % (
    X(0), Y(47), X(10), Y(47), X(0), Y(46), X(0), Y(48), X(10), Y(46), X(10), Y(48),
    X(5), Y(50), X(66), Y(-6))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Scaled floor plan Rev K">%s%s%s%s%s</svg>' % (
    round(76 * PF), round(60 * PF), "".join(R), marks, ext, outs, sc)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>Your four answers, 22 Sep 8:18 AM</h3>
<ul>
<li>&#10003; <b>&ldquo;the living room takes both the center block and the south east corner&rdquo;</b>
&mdash; <b>already drawn that way and now locked.</b> It is one L-shaped room, <b>318 sf</b>, wrapping
the kitchen. That was the biggest open question and it is closed.</li>
<li>&#10003; <b>&ldquo;the hallway is right at 18 x 4 but it&rsquo;s all open&rdquo;</b> &mdash; the
<b>numbers were right</b>, the walls were not. It is now drawn <b>dashed</b>: a named circulation
space, not a corridor.</li>
<li>&#9660; <b>&ldquo;the guest bathroom can be shrunk down a little&rdquo;</b> &mdash; cut from
<b>11&times;13 to 11&times;8</b> (143 &rarr; 88 sf). The 55 sf went next door to the office.</li>
<li>&#9654; <b>&ldquo;the kitchen, of course is much bigger&rdquo;</b> &mdash; grown east,
<b>15&times;8 to 20&times;8</b> (120 &rarr; 160 sf).</li>
</ul>

<div class="warn"><b>&#9888; ONE THING YOU SAID THAT I CANNOT DRAW &mdash; and I would rather ask than
guess it wrong again.</b>
<p style="margin:6px 0">You said the <b>guest bedroom and office doors are straight across from each
other.</b> On this plan they <b>cannot be</b>: the guest bed is on the <b>north</b> side of the
hallway and the office is off its <b>east end</b>. Those two doors are around a corner from each
other, not facing.</p>
<p style="margin:6px 0">For them to face, the hallway&rsquo;s <b>18 ft has to run north&ndash;south,
not east&ndash;west</b> &mdash; a <b>4 ft wide by 18 ft long</b> spine with the guest bed on one side
and the office on the other. Same two numbers, turned 90&deg;.</p>
<p style="margin:6px 0"><b>Which is it?</b> If it is the north&ndash;south spine, say so and I will
re-cut the whole east half around it &mdash; that also changes where the guest bath and the ethernet
drops land. <b>I am not going to redraw the house off my own inference.</b></p></div>

<div class="note"><b>Why the kitchen grew east and not south:</b> the envelope is still
<b>44 &times; 32</b> and the total is still <b>1,408 sf</b> against your recorded 1,400 &mdash; so the
kitchen had to take its extra 40 sf from somewhere inside, and the only side it touches is the living
room. <b>If the kitchen is bigger than that, the outside wall has to move</b> and the 1,408 goes with
it. Tell me and I will move it.</div>

<h3>Totals &mdash; Rev K</h3>
<ul>
<li>House <b>44 &times; 32 = 1,408 sf</b> (recorded: 1,400)</li>
<li>Garage <b>12 &times; 24 = 288 sf</b> &mdash; your tape measure, still the anchor for the whole drawing</li>
<li>Living room <b>318</b> &middot; Master bed <b>195</b> &middot; Office <b>176</b> &middot;
Kitchen <b>160</b> &middot; Guest bed <b>130</b> &middot; Master bath <b>110</b> &middot;
Foyer <b>104</b> &middot; Guest bath <b>88</b> &middot; Hallway <b>72</b> &middot; Laundry <b>55</b></li>
</ul>
<div class="note"><b>Next, once the shell is signed off:</b> Stage 2, the 38-number device key.</div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev K</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev K &middot; 22 Sep 2026 8:18 AM &middot; TO SCALE<br>anchored on the 12&times;24 garage</div>'
        u'<h1>Floor Plan &mdash; Rev K<span class="draftbadge">your 4 answers folded in</span></h1>'
        u'<div class="sub"><b>Living room confirmed as one L</b> (centre + SE corner). '
        u'<b>Hallway confirmed 18&times;4 and redrawn OPEN.</b> Guest bath shrunk, kitchen grown. '
        u'<b>One question left</b> &mdash; the two doors you said face each other cannot, drawn this way.</div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_K.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev K built")
