# -*- coding: utf-8 -*-
# Rev L - the OUTSIDE PERIMETER only, plus every room as a to-scale tile Jeff can line up.
# Nothing removed. Every fixture is carried on its tile so it cannot get lost.
import io
PF = 11.0
def X(f): return round((f + 14) * PF, 1)
def Y(f): return round((f + 12) * PF, 1)

def esc(s): return s

# ---------------------------------------------------------------- the shell
def shell():
    s = ''
    # 2 ft grid inside the heated envelope, so Jeff can count squares
    for gx in range(12, 57, 2):
        s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#d7dee6" stroke-width="%s"/>' % (
            X(gx), Y(0), X(gx), Y(32), 1.6 if gx % 10 == 2 else 0.7)
    for gy in range(0, 33, 2):
        s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#d7dee6" stroke-width="%s"/>' % (
            X(12), Y(gy), X(56), Y(gy), 1.6 if gy % 10 == 0 else 0.7)
    # garage - measured, stays put
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fdf7ec" stroke="#8a5000" stroke-width="3.2"/>' % (
        X(0), Y(0), 12 * PF, 24 * PF)
    s += '<text x="%s" y="%s" font-size="12" font-weight="700" text-anchor="middle" fill="#8a5000">GARAGE</text>' % (X(6), Y(11))
    s += '<text x="%s" y="%s" font-size="8.4" text-anchor="middle" fill="#8a5000">12 &#215; 24 = 288 sf</text>' % (X(6), Y(12.5))
    s += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#0b6b3a">YOUR TAPE MEASURE</text>' % (X(6), Y(13.8))
    s += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#0b6b3a">this is the anchor - do not move</text>' % (X(6), Y(15))
    # heated envelope
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5.5"/>' % (
        X(12), Y(0), 44 * PF, 32 * PF)
    # porch + deck, dashed (outside the heated envelope)
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#faf6ee" stroke="#8a5000" stroke-width="2.2" stroke-dasharray="7 4"/>' % (
        X(27), Y(-8), 12 * PF, 8 * PF)
    s += '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="#8a5000">COVERED FRONT PORCH</text>' % (X(33), Y(-4.4))
    s += '<text x="%s" y="%s" font-size="7.4" text-anchor="middle" fill="#8a5000">outlet &middot; doorbell &middot; flag</text>' % (X(33), Y(-3))
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#f4f7f4" stroke="#8a5000" stroke-width="2.2" stroke-dasharray="7 4"/>' % (
        X(12), Y(32), 40 * PF, 11 * PF)
    s += '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="#8a5000">BACK DECK &mdash; ELEVATED ON POSTS</text>' % (X(32), Y(36.5))
    s += '<text x="%s" y="%s" font-size="7.4" text-anchor="middle" fill="#8a5000">outdoor TV &middot; steps &middot; NO hot tub</text>' % (X(32), Y(38))
    # east wall equipment - Jeff confirmed this is correct
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2.4"/>' % (
        X(57.5), Y(12), 4 * PF, 4 * PF)
    s += '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>' % (X(59.5), Y(14.3))
    s += '<circle cx="%s" cy="%s" r="8" fill="#fff" stroke="#12507e" stroke-width="2.2"/>' % (X(57.5), Y(19))
    s += '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#12507e">B</text>' % (X(57.5), Y(19.3))
    s += '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve</text>' % (X(57.5), Y(21.4))
    s += '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b3fa0">EAST WALL - you confirmed this</text>' % (X(60), Y(24.5))
    # the duct spine, from the ductwork drawing
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#c0392b" stroke-width="7" opacity="0.30"/>' % (
        X(56), Y(16), X(13), Y(16))
    for lx, lbl in ((50, '16"'), (36, '14"'), (20, '12"')):
        s += '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#c0392b">%s</text>' % (X(lx), Y(15.2), lbl)
    s += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#c0392b">SUPPLY TRUNK, from the ductwork drawing: 16&quot; at the unit, reducing to 12&quot; at the garage end</text>' % (X(34), Y(17.4))
    # dimensions
    s += ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2"/>'
          '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">44 ft</text>') % (
        X(12), Y(-1.6), X(56), Y(-1.6), X(34), Y(-2.2))
    s += ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2"/>'
          '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle" transform="rotate(-90 %s %s)">32 ft</text>') % (
        X(57.2), Y(0), X(57.2), Y(32), X(57.2) + 13, Y(16), X(57.2) + 13, Y(16))
    s += '<g transform="translate(%s,%s)"><path d="M0,-18 L5.5,8 L0,2.5 L-5.5,8 Z" fill="#111"/><text x="0" y="22" font-size="10" font-weight="700" text-anchor="middle">N</text></g>' % (X(66), Y(-4))
    return s

# ---------------------------------------------------------------- the tiles
# (w, h, name, sf, what is in it)  -- every fixture carried, nothing dropped
TILES = [
    (18, 15, "LIVING ROOM", "L-shape, 318 sf total",
     "fireplace + TV &middot; RETURN GRILLE 20&#215;25 &middot; thermostat &middot; fan &middot; deck door", "#eaf4f8", True),
    (15, 13, "MASTER BED", "195 sf",
     "THE BEAST &middot; J45 Beehive &middot; gateway &middot; TV &middot; bed &middot; window &middot; vaulted", "#e8eef8", False),
    (11, 16, "OFFICE / BED 3", "176 sf",
     "RE200 &middot; ethernet drop &middot; 4 monitors &middot; printer", "#e9f5ec", False),
    (20, 8, "KITCHEN + DINING", "160 sf",
     "stove &middot; fridge &middot; sink &middot; bar + 2 stools", "#eef6ee", False),
    (10, 13, "GUEST BED", "130 sf",
     "ethernet drop", "#e9f5ec", False),
    (10, 11, "MASTER BATH", "110 sf", "", "#f7f5ea", False),
    (8, 13, "FOYER", "104 sf", "front door, under the porch", "#eef7f3", False),
    (11, 8, "GUEST BATH", "88 sf", "you said shrink it", "#f9eef1", False),
    (18, 4, "HALLWAY", "72 sf", "18&#215;4 CONFIRMED &middot; ALL OPEN, not a corridor", "#f4f8fb", False),
    (5, 11, "LAUNDRY", "55 sf", "washer + dryer facing each other", "#f7f5ea", False),
]

def tray():
    s = ''
    # lay tiles left to right in rows, in the strip below the plan
    ox, oy, rowh = 0.0, 50.0, 0.0
    for (w, h, name, sf, items, fill, isL) in TILES:
        if ox + w > 72:
            oy += rowh + 3.5
            ox, rowh = 0.0, 0.0
        x, y = ox, oy
        if isL:
            # draw the living room as the actual L: 18x7 across the top, 13x8 below-right
            s += '<path d="M %s %s H %s V %s H %s V %s H %s Z" fill="%s" stroke="#0b6b3a" stroke-width="2.8"/>' % (
                X(x), Y(y), X(x + 18), Y(y + 15), X(x + 5), Y(y + 7), X(x), fill)
        else:
            s += '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="#111418" stroke-width="2.2"/>' % (
                X(x), Y(y), w * PF, h * PF, fill)
        cx = X(x + w / 2.0)
        s += '<text x="%s" y="%s" font-size="9.4" font-weight="700" text-anchor="middle">%s</text>' % (cx, Y(y + 1.5), name)
        s += '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">%g &#215; %g &middot; %s</text>' % (
            cx, Y(y + 2.6), w, h, sf)
        if items:
            # wrap the fixture list
            words, line, ly = items.split(" &middot; "), [], y + 4.0
            for wd in words:
                line.append(wd)
                if len(" ".join(line)) > int(w * 1.5):
                    s += '<text x="%s" y="%s" font-size="6.8" text-anchor="middle" fill="#0b6b3a">%s</text>' % (
                        cx, Y(ly), " &middot; ".join(line))
                    line, ly = [], ly + 1.05
            if line:
                s += '<text x="%s" y="%s" font-size="6.8" text-anchor="middle" fill="#0b6b3a">%s</text>' % (
                    cx, Y(ly), " &middot; ".join(line))
        ox += w + 2.5
        rowh = max(rowh, h)
    return s, oy + rowh

body, bottom = tray()

svg = ('<svg viewBox="0 0 %d %d" role="img" aria-label="Rev L perimeter and room tiles">'
       '%s'
       '<text x="%s" y="%s" font-size="13" font-weight="700" fill="#111">THE ROOMS &mdash; every one, to the same scale. Slide them in.</text>'
       '<text x="%s" y="%s" font-size="8.6" fill="#5a636d">Nothing has been taken out. Each tile carries its own fixtures so none get lost in the shuffle. They total 1,408 sf and the shell holds 1,408 sf.</text>'
       '%s</svg>') % (
    round(90 * PF), round((bottom + 16) * PF), shell(), X(0), Y(46.5), X(0), Y(48.2), body)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>What is fixed, and what is yours to move</h3>
<ul>
<li>&#128274; <b>The garage, 12 &times; 24.</b> You measured it. Everything on the sheet is scaled off
it &mdash; 11 pixels to the foot &mdash; so it cannot move without the whole drawing moving.</li>
<li>&#128274; <b>The A/C and the B-hyve on the east wall.</b> Your words: <i>&ldquo;the Ac and
everything you have on that east outside wall is correct.&rdquo;</i></li>
<li>&#128274; <b>The covered front porch</b> (north) and the <b>elevated back deck</b> (south).</li>
<li>&#9999; <b>Everything inside the orange line is yours to rearrange.</b></li>
</ul>

<div class="note"><b>&#128295; The ductwork drawing is now on the plan, and it is real evidence.</b>
The scope of work says the supply trunk runs <b>16&quot; &rarr; 14&quot; &rarr; 12&quot; with
reducers</b>, and that the new garage run taps <b>the side of the 12&quot; section</b>. A trunk only
reduces as it sheds branches, so <b>the 16&quot; end is at the unit and the 12&quot; end is at the
garage</b> &mdash; which independently confirms the unit is <b>east</b> and the garage is <b>west</b>.
That is the first time the floor plan and the HVAC bid have agreed on anything, and they were drawn
from completely separate evidence.</div>

<h3>What the duct scope says is in each room</h3>
<p style="margin:4px 0">Straight off the scope of work, and it is a second independent room list:</p>
<ul>
<li><b>Getting upgraded 6&quot; &rarr; 8&quot;:</b> dining room, master bedroom, living room &mdash;
the three biggest spaces, which matches the tiles.</li>
<li><b>Staying as-is:</b> master bath 6&quot;, <b>guest bedroom 7&quot;</b>, <b>office 6&quot;</b>,
guest bath 6&quot;.</li>
<li>&#128161; <b>Guest bedroom gets a 7&quot; and the office a 6&quot;</b> &mdash; so the contractor
who sized that duct treated the <b>guest bedroom as the larger room of the two</b>. My tiles have the
office bigger. One of us is wrong, and it is probably me.</li>
</ul>

<div class="warn"><b>&#9888; The one thing still unresolved &mdash; the two doors.</b>
<p style="margin:6px 0">You said the <b>guest bedroom and office doors are straight across from each
other</b>. With the hallway running <b>east&ndash;west</b> they cannot be &mdash; the guest bed is on
its north side and the office is off its east end, so those doors are around a corner from each
other.</p>
<p style="margin:6px 0">They face each other if the hallway&rsquo;s <b>18 ft runs
north&ndash;south</b> instead: a <b>4 ft wide, 18 ft long</b> spine with the guest bed on one side and
the office on the other. <b>Same two numbers, turned 90&deg;.</b> Slide the hallway tile either way on
this sheet and it will tell you immediately.</p></div>

<h3>&#9888; Something I found in the duct document while I was in there</h3>
<div class="warn">The scope still calculates the return at <b>995 CFM</b> in two places
(<i>&ldquo;16&quot; runs about 713 ft/min at 995 CFM&rdquo;</i>), but the <b>AHRI rating is
950</b>. I removed the standalone &ldquo;airflow set to 995 CFM&rdquo; line in Rev D and <b>missed
these two</b>. It does not change the recommendation &mdash; 16&quot; passes at either number &mdash;
but it is a wrong figure in a document going to contractors. <b>Say the word and I will correct it to
950 and re-issue the PDF.</b></div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev L, perimeter + tiles</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev L &middot; 22 Sep 2026 8:21 AM &middot; TO SCALE, 11 px per foot<br>anchored on the 12&times;24 garage</div>'
        u'<h1>The Shell &mdash; Rev L<span class="draftbadge">line the rooms up yourself</span></h1>'
        u'<div class="sub">Outside walls only, on a <b>2-foot grid</b>, with <b>every room as a '
        u'to-scale tile</b> underneath. <b>Nothing taken out</b> &mdash; each tile carries its own '
        u'fixtures. The tiles total <b>1,408 sf</b> and the shell holds <b>1,408 sf</b>, so they fit '
        u'exactly; it is only the arrangement that is in question.</div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_L.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev L built, tray bottom at %.1f ft" % bottom)
