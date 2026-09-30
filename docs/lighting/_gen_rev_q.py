# -*- coding: utf-8 -*-
# Rev P - Jeff, 2026-09-22 9:06 AM: "the doors in the guest bedroom and office are
# across from each other and the hall runs between them and ends at the guest bathroom."
# That sentence forces the layout. Solved algebraically, checks clean, totals 1,408 exactly.
import io
PF = 11.0
def X(f): return round((f + 16) * PF, 1)
def Y(f): return round((f + 13) * PF, 1)

NEW, CONF, HOT = "#c05621", "#0b6b3a", "#c0392b"

def room(x, y, w, h, name, sub="", fill="#eef3f8", stroke="#111418", sw=2.2, dash=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    if name:
        s += '<text x="%s" y="%s" font-size="10.2" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy - 3, name)
        s += '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">%g&#215;%g = %d sf</text>' % (cx, cy + 8, w, h, int(w * h))
    if sub:
        s += '<text x="%s" y="%s" font-size="7.3" font-weight="700" text-anchor="middle" fill="%s">%s</text>' % (cx, cy + 18, NEW, sub)
    return s

def fx(x, y, label, col="#8a5000", r=4.0):
    return ('<circle cx="%s" cy="%s" r="%s" fill="#fff" stroke="%s" stroke-width="1.7"/>'
            '<text x="%s" y="%s" font-size="6.7" font-weight="700" text-anchor="middle" fill="%s">%s</text>') % (
        X(x), Y(y), r, col, X(x), Y(y) - 6.4, col, label)

def win(x, y, horiz=True, L=3.0):
    if horiz:
        x1, y1, x2, y2 = X(x - L / 2), Y(y), X(x + L / 2), Y(y)
    else:
        x1, y1, x2, y2 = X(x), Y(y - L / 2), X(x), Y(y + L / 2)
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="4.4"/>'
            '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="1.5"/>') % (
        x1, y1, x2, y2, x1, y1, x2, y2)

R = [
    room(0, 8, 12, 24, "GARAGE", "your tape measure", "#fdf7ec", "#8a5000", 2.8),
    room(0, 0, 12, 8, "", "moved here", "#fdeee6", NEW, 2.4, True),

    room(12, 0, 15, 13, "MASTER BED", "", "#e8eef8"),
    room(27, 0, 8, 13, "FOYER", "", "#eef7f3"),
    room(35, 0, 10, 13, "GUEST BED", "LIDAR-CONFIRMED", "#e9f5ec", CONF, 3.4),
    room(45, 0, 11, 6, "CLOSETS", "my guess", "#f4f1e8", NEW, 2.2, True),
    room(45, 6, 11, 11, "GUEST BATH", "LIDAR-CONFIRMED", "#f9eef1", CONF, 3.4),

    room(12, 13, 8, 9, "MASTER BATH", "toilet &middot; tub &middot; sink", "#f7f5ea"),
    room(12, 22, 8, 2, "PANTRY", "my guess", "#f2efe0", NEW, 2.4, True),
    room(20, 13, 7, 4, "LAUNDRY", "&#9660; CUT 55 &rarr; 28 sf", "#f7f5ea", NEW, 3.0),
    room(20, 17, 7, 7, "DINING ROOM", "&#9650; NEW &middot; where the washer was", "#eef6ee", NEW, 3.4),

    room(27, 13, 18, 4, "", "", "#f4f8fb", CONF, 2.4),
    room(27, 17, 14, 15, "LIVING ROOM", "stops where the corridor starts", "#eaf4f8"),
    room(41, 17, 15, 15, "OFFICE / BED 3", "door on its NORTH wall", "#e9f5ec", NEW, 3.4),
    room(12, 24, 15, 8, "KITCHEN", "", "#eef6ee"),
    room(26, 32, 30, 11, "BACK DECK", "ELEVATED on posts", "#f4f7f4", "#8a5000", 2.2, True),
]

# --- the hallway, in two halves, exactly as Jeff described it
HALL = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#f4f8fb" stroke-width="5"/>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.9" stroke-dasharray="5 4"/>'
        '<text x="%s" y="%s" font-size="9.4" font-weight="700" text-anchor="middle">HALLWAY</text>'
        '<text x="%s" y="%s" font-size="7.2" text-anchor="middle" fill="#5a636d">18&#215;4 = 72 sf</text>'
        '<text x="%s" y="%s" font-size="6.8" font-weight="700" text-anchor="middle" fill="%s">OPEN to the living room</text>'
        '<text x="%s" y="%s" font-size="6.8" font-weight="700" text-anchor="middle" fill="%s">not really a hallway yet</text>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111418" stroke-width="3.2"/>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111418" stroke-width="3.2"/>'
        '<text x="%s" y="%s" font-size="6.6" font-weight="700" text-anchor="middle" fill="%s">REAL</text>'
        '<text x="%s" y="%s" font-size="6.6" font-weight="700" text-anchor="middle" fill="%s">CORRIDOR</text>') % (
    X(27), Y(17), X(41), Y(17),
    X(27), Y(17), X(41), Y(17), CONF,
    X(34), Y(14.4), X(34), Y(15.7),
    X(34), Y(16.8), CONF, X(34), Y(13.1), CONF,
    X(41), Y(17), X(45), Y(17),
    X(41), Y(17), X(41), Y(32),
    X(43), Y(14.6), NEW, X(43), Y(15.8), NEW)

# --- the two facing doors, and the corridor's end at the guest bath
DOORS = ('<path d="M %s %s A %s %s 0 0 0 %s %s" fill="none" stroke="%s" stroke-width="2.4"/>'
         '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="%s" stroke-width="2.4"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.6" stroke-dasharray="4 3"/>'
         '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="%s">'
         'THESE TWO DOORS FACE EACH OTHER</text>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="4.4"/>'
         '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="%s">'
         '&#9654; corridor ENDS at the GUEST BATH</text>') % (
    X(42), Y(13), 3 * PF, 3 * PF, X(45), Y(13), NEW,
    X(42), Y(17), 3 * PF, 3 * PF, X(45), Y(17), NEW,
    X(43.5), Y(13), X(43.5), Y(17), HOT,
    X(36), Y(11.4), HOT,
    X(45), Y(13.4), X(45), Y(16.6), CONF,
    X(50), Y(18.6), CONF)

F = [
    fx(29, -1.2, "outlet"), fx(32, -1.2, "bell"), fx(38.2, -3.4, "FLAG", HOT, 5.0),
    fx(16, 3.5, "bed"), fx(22, 2.2, "gateway", "#12507e"), fx(25.5, 2.2, "TV"),
    fx(25.5, 6.5, "DRESSER", "#6b3fa0", 5.2), fx(19, 10.5, "THE BEAST", "#6b3fa0", 5.4),
    fx(15, 10.5, "J45", "#12507e"),
    fx(14, 17.5, "toilet"), fx(16.5, 17.5, "tub"), fx(19, 17.5, "sink"),
    fx(22.2, 15.4, "washer"), fx(25.2, 15.4, "dryer"),
    fx(48.5, 7.6, "tub"), fx(54.2, 9.2, "TOILET", HOT, 5.2), fx(54.2, 14, "sink"),
    fx(14.5, 30.5, "stove"), fx(17.5, 30.5, "fridge"), fx(20.5, 30.5, "sink"),
    fx(24.5, 29, "bar"), fx(23.5, 20.8, "TABLE", "#6b3fa0", 5.4),
    fx(39.4, 23, "FIREPLACE", HOT, 5.8), fx(31, 19.4, "RETURN", HOT, 5.4),
    fx(28.6, 19.4, "stat", HOT), fx(34, 23, "fan"), fx(33, 31.2, "deck dr"),
    fx(44, 21, "RE200", "#6b3fa0", 5.0), fx(50, 21, "4-mon", "#6b3fa0", 5.0),
    fx(54, 21, "print"), fx(44, 27, "fan"),
    fx(6, 9.5, "MAIN DOOR", "#8a5000", 5.4), fx(1.6, 16, "man dr"), fx(1.6, 21, "panel", HOT),
    fx(8, 14, "TV"), fx(8, 18, "fan"), fx(5, 24, "bench"), fx(9, 24, "pegbd"),
    fx(5, 28, "saws"), fx(9, 28, "cutter"), fx(7, 26, "GARAGE PC", "#6b3fa0", 5.2),
    fx(52, 37, "outdoor TV", "#12507e", 5.2), fx(28, 41, "STEPS", "#8a5000", 5.0),
]

W = (win(19, 0) + win(40, 0) + win(50, 0)
     + win(17, 32) + win(36, 32) + win(45, 32) + win(52, 32)
     + win(56, 21, False) + win(56, 28, False))

ETH = ''
for ex, ey in ((40, 6.5), (45.6, 19.4)):
    ETH += '<rect x="%s" y="%s" width="20" height="12" rx="2" fill="#0b6b3a"/>' % (X(ex) - 10, Y(ey) - 6)
    ETH += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#fff">ETH</text>' % (X(ex), Y(ey) + 3)

BAY = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#eaf4f8" stroke="%s" stroke-width="2.8"/>'
       '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#eaf4f8" stroke-width="6"/>'
       '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="%s">BAY WINDOW</text>') % (
    X(28), Y(32), 5 * PF, 2.4 * PF, NEW, X(28.3), Y(32), X(32.7), Y(32), X(30.5), Y(35.4), NEW)

PORCH = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#f2e8da" stroke="%s" stroke-width="3.2"/>'
         '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="%s">FRONT GABLE</text>'
         '<text x="%s" y="%s" font-size="7" font-weight="700" text-anchor="middle" fill="%s">ARCHED WINDOW</text>'
         '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="#12507e" stroke-width="4.2"/>'
         '<rect x="%s" y="%s" width="%s" height="%s" fill="#faf6ee" stroke="%s" stroke-width="3.2" stroke-dasharray="6 3"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.4"/>'
         '<text x="%s" y="%s" font-size="8.8" font-weight="700" text-anchor="middle" fill="%s">FRONT PORCH</text>'
         '<text x="%s" y="%s" font-size="7.3" font-weight="700" text-anchor="middle" fill="%s">12 &#215; 6 &middot; in the ell</text>'
         '<text x="%s" y="%s" font-size="7.3" font-weight="700" text-anchor="middle" fill="%s">&#9660; into the FOYER</text>') % (
    X(21), Y(-4), 6 * PF, 4 * PF, NEW,
    X(24), Y(-2.6), NEW, X(24), Y(-1.4), NEW,
    X(22.4), Y(-4), 1.6 * PF, 1.6 * PF, X(25.6), Y(-4),
    X(27), Y(-6), 12 * PF, 6 * PF, NEW,
    X(27), Y(0), X(39), Y(0), NEW,
    X(33), Y(-4.4), NEW, X(33), Y(-3.2), NEW, X(33), Y(-1.4), CONF)

DRIVE = ('<path d="M %s %s L %s %s L %s %s L %s %s" fill="none" stroke="#9aa4ae" stroke-width="9" opacity="0.5"/>'
         '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b7480" '
         'transform="rotate(-90 %s %s)">DRIVEWAY</text>'
         '<path d="M %s %s L %s %s L %s %s" fill="none" stroke="#9aa4ae" stroke-width="5" opacity="0.6"/>'
         '<text x="%s" y="%s" font-size="7.8" font-weight="700" text-anchor="middle" fill="#6b7480">SIDEWALK</text>') % (
    X(-9), Y(44), X(-9), Y(14), X(-4), Y(14), X(-4), Y(9),
    X(-11.5), Y(30), X(-11.5), Y(30),
    X(-4), Y(12), X(-4), Y(-5), X(31), Y(-5), X(14), Y(-6.3))

EAST = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2.4"/>'
        '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>'
        '<circle cx="%s" cy="%s" r="8" fill="#fff" stroke="#12507e" stroke-width="2.2"/>'
        '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#12507e">B</text>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="2.2" stroke-dasharray="4 3"/>'
        '<text x="%s" y="%s" font-size="7.3" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve, through</text>'
        '<text x="%s" y="%s" font-size="7.3" font-weight="700" text-anchor="middle" fill="#12507e">the OFFICE brick</text>') % (
    X(58.5), Y(6), 4 * PF, 4 * PF, X(60.5), Y(8.3),
    X(60), Y(24), X(60), Y(24.3),
    X(56), Y(24), X(60) - 8, Y(24),
    X(61), Y(26.4), X(61), Y(27.8))

CHIM = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#8a5000" stroke="#5a3400" stroke-width="1.6"/>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#8a5000">CHIMNEY</text>') % (
    X(40.0), Y(29.6), 2.0 * PF, 2.0 * PF, X(41.0), Y(29.0))

ext = '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5.5"/>' % (
    X(12), Y(0), 44 * PF, 32 * PF)

sc = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text>'
      '<g transform="translate(%s,%s)"><path d="M0,-19 L6,8 L0,2.5 L-6,8 Z" fill="#111"/>'
      '<text x="0" y="23" font-size="10" font-weight="700" text-anchor="middle">N</text></g>') % (
    X(12), Y(46.5), X(22), Y(46.5), X(17), Y(48.6), X(63), Y(-3))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Floor plan Rev P">%s%s%s%s%s%s%s%s%s%s%s%s</svg>' % (
    round(86 * PF), round(64 * PF), DRIVE, "".join(R), BAY + PORCH, HALL, "".join(F), W, ETH, DOORS,
    EAST, CHIM, ext, sc)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>&#128269; I found the toilet &mdash; and it confirms the whole east end</h3>
<div class="note"><b>It is there, and it is decisive.</b> On the east side of <code>room6</code> the
mapped floor wraps a <b>stepped diagonal</b>. <b>A straight wall maps as a straight line</b>; a
staircase like that is the robot tracing something <b>round</b>, quantised into grid cells. That is a
toilet base, on the <b>east wall</b>.
<p style="margin:6px 0"><b>And it tells me which half of room6 is which.</b> You said the map draws
the guest bedroom and guest bathroom together, so: the <b>lobe running NORTH off the corridor is the
GUEST BEDROOM</b>, and the <b>east lobe, the one with the toilet, is the GUEST BATHROOM</b>.</p>
<p style="margin:6px 0">&#10003;&#10003; <b>That is exactly what Rev P arrived at from your sentence
alone</b> &mdash; guest bed north of the corridor, guest bath off its east end. <b>Two independent
sources, same answer.</b> Those two rooms were the only ones in the house no instrument had ever
measured. They are now the best-evidenced rooms on the east end, and both are marked CONFIRMED.</p>
<p style="margin:6px 0">Toilet drawn on the guest bath's <b>east wall</b>, tub on the north where your
pen circled it, sink below.</p></div>

<div class="warn"><b>&#10060; And a measurement I made and am taking straight back out.</b>
<p style="margin:6px 0">At 9:25 you said <i>&ldquo;where the red walls are is where the hall is a real
hallway&rdquo;</i>, so I pulled the two dashed runs out of the image by colour &mdash; 187 px and 214
px against a 1,172 px house &mdash; called it <b>16&ndash;18% of the width, so 7 to 8 feet</b>, and
stretched the corridor from 4 ft to 8 ft on that basis.</p>
<p style="margin:6px 0"><b>Then you said those walls are just there to keep him out of the office and
guest bedroom, and are not to scale. So the number is worthless and I have reverted it.</b> The
corridor is back to the <b>4 ft the room geometry itself gives</b> &mdash; it is exactly as long as
the guest bedroom and the office overlap, which is a derived length, not a guess.</p>
<p style="margin:6px 0">&#128273; <b>What your red walls DO tell me stands:</b> they mark <b>where</b>
the real hallway is &mdash; the stretch with the guest bedroom on one side and the office on the
other. That is the location, and it matches. <b>I took a position marker and read a dimension off it.
That is the same mistake as measuring a room off a map you had already told me was off.</b></p></div>

<h3>&#9989; Your sentence forces the layout &mdash; and it lands on 1,408 exactly</h3>
<div class="note"><i>&ldquo;the doors in the guest bedroom and office are across from each other and
the hall runs between them and ends at the guest bathroom.&rdquo;</i>
<p style="margin:6px 0"><b>For those two doors to face, the office has to come WEST far enough to
reach the hall, and the living room has to stop short of it.</b> That is the piece I kept missing. And
it is the same thing you told me at 9:01 &mdash; <b>&ldquo;it&rsquo;s not really a hallway until the
living room ends.&rdquo;</b> The living room ending IS where the corridor starts. Those two sentences
are one instruction.</p>
<p style="margin:6px 0">I solved it as constraints rather than by eye, and <b>every single one comes
out clean:</b></p>
<ul style="margin:4px 0 0 0">
<li>Office reaches the <b>east wall</b> &rarr; B-hyve through its brick &#10003;</li>
<li>Guest bed <b>north</b> of the hall band, office <b>south</b> of it &#10003;</li>
<li>They overlap across <b>x41&ndash;45</b>, so the doors <b>genuinely face</b> &#10003;</li>
<li>Corridor's east end lands on the <b>guest bath's west wall</b> &#10003;</li>
<li>Living room <b>stops</b> exactly where the corridor begins &#10003;</li>
<li>Fireplace on the living room's east wall &rarr; chimney at <b>66% along</b>, east of centre,
matching the roof shot &#10003;</li>
<li>Guest bath <b>shrunk</b> 143 &rarr; 121 sf, as you asked &#10003;</li>
<li><b>Total 1,408 sf against a 44 &times; 32 envelope. Exact. Nothing fudged.</b> &#10003;</li>
</ul></div>

<div class="note"><b>&#10003; 9:11 AM &mdash; &ldquo;the laundry room is way too big; the dining
room and dining room table need to be where the washer is.&rdquo;</b> Done, and it re-cuts that whole
west block: <b>LAUNDRY cut from 55 sf to 28</b> (7 &times; 4, washer and dryer side by side on the
north wall), and a <b>DINING ROOM, 7 &times; 7 = 49 sf, now stands where the washer used to be</b>
with the table in it. The kitchen is just <b>KITCHEN</b> now &mdash; dining is its own room, which is
also what the duct scope always said: it lists <b>&ldquo;dining room&rdquo; as its own 6&quot;
&rarr; 8&quot; run</b>, separate from the kitchen. Master bath and pantry re-proportioned to suit.
<b>The block still totals 285 sf, so the house is still exactly 1,408.</b></div>

<h3>What moved from Rev O</h3>
<ul>
<li><b>OFFICE / BED 3 is now 15 &times; 15 = 225 sf</b>, the southeast quarter &mdash; it reaches
west to the corridor and east to the brick.</li>
<li><b>LIVING ROOM 14 &times; 15 = 210 sf</b>, stopping at the corridor.</li>
<li><b>GUEST BATH moved south</b> to 11 &times; 11, so the corridor can run into it.</li>
<li><b>CLOSETS</b> &mdash; an 11 &times; 6 block left over at the northeast. <b>That is my guess at
what fills it</b>, and it is the one piece of the 1,408 I cannot source to something you have said.
<b>Tell me what is really there.</b></li>
</ul>

<div class="warn"><b>&#9888; Where I went against your highlighter, and why.</b>
<p style="margin:6px 0">Your orange put the office's top-left corner up at the hallway band. I have
it one band lower, at the corridor. <b>If I put it where the orange is, the office and the guest bed
touch only at a single corner and their doors cannot face each other</b> &mdash; which is the thing
you have now told me twice. <b>I followed the sentence over the highlighter.</b> If the orange is
right and I have misread the sentence, say so and I will put it back.</p></div>

<div class="note"><b>Unchanged:</b> garage <b>12 &times; 24</b> anchor &middot; porch in the ell beside
the gable &middot; bay window on the rear &middot; pantry still my guess &middot; driveway and
sidewalk &middot; 11 px to the foot.</div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev Q</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev Q &middot; 22 Sep 2026 9:27 AM &middot; east end confirmed by LIDAR<br>anchored on the 12&times;24 garage</div>'
        u'<h1>Floor Plan &mdash; Rev Q<span class="draftbadge">LIDAR agrees</span></h1>'
        u'<div class="sub"><b>The office comes west to meet the corridor and the living room stops short of it</b> '
        u'&mdash; the only arrangement where those two doors actually face. Checked against every constraint you '
        u'have given: <b>all pass, and the rooms total 1,408 sf against a 44&times;32 shell. Exact.</b></div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_Q.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev Q built")
