# -*- coding: utf-8 -*-
# Rev M - shell corrected from the exterior stills Jeff told me to look at, 2026-09-22 8:28 AM.
#   1. front porch is RECESSED into the footprint, opening into the foyer  (front doorbell view)
#   2. the 12x8 space south of the garage moves to the NORTH side          (Jeff, + rear elevation)
#   3. the back deck does NOT span the full rear                           (rear elevation)
#   4. the chimney is on the EAST half of the rear roof                    (rear elevation)
# Stills were read-only image fetches of the existing AI still entities. No trigger calls were
# made and nothing in that stack was changed.
import io
PF = 11.0
def X(f): return round((f + 14) * PF, 1)
def Y(f): return round((f + 12) * PF, 1)

def shell():
    s = ''
    for gx in range(12, 57, 2):
        s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#d7dee6" stroke-width="%s"/>' % (
            X(gx), Y(0), X(gx), Y(32), 1.6 if gx % 10 == 2 else 0.7)
    for gy in range(0, 33, 2):
        s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#d7dee6" stroke-width="%s"/>' % (
            X(12), Y(gy), X(56), Y(gy), 1.6 if gy % 10 == 0 else 0.7)

    # GARAGE, MOVED SOUTH: was y0-24, now y8-32. Still exactly 12 x 24.
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fdf7ec" stroke="#8a5000" stroke-width="3.2"/>' % (
        X(0), Y(8), 12 * PF, 24 * PF)
    s += '<text x="%s" y="%s" font-size="12" font-weight="700" text-anchor="middle" fill="#8a5000">GARAGE</text>' % (X(6), Y(19))
    s += '<text x="%s" y="%s" font-size="8.4" text-anchor="middle" fill="#8a5000">12 &#215; 24 = 288 sf</text>' % (X(6), Y(20.5))
    s += '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="#0b6b3a">still your tape measure</text>' % (X(6), Y(21.9))
    # the moved space, now NORTH of the garage
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fdeee6" stroke="#c05621" stroke-width="2.6" stroke-dasharray="6 4"/>' % (
        X(0), Y(0), 12 * PF, 8 * PF)
    s += '<text x="%s" y="%s" font-size="8.6" font-weight="700" text-anchor="middle" fill="#c05621">MOVED &#9650;</text>' % (X(6), Y(3.0))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">this 12&#215;8 was on the SOUTH</text>' % (X(6), Y(4.3))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">side &mdash; now on the NORTH</text>' % (X(6), Y(5.4))
    s += '<text x="%s" y="%s" font-size="7.2" text-anchor="middle" fill="#8a5000">driveway runs down this side</text>' % (X(6), Y(6.8))

    # heated envelope
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5.5"/>' % (
        X(12), Y(0), 44 * PF, 32 * PF)

    # RECESSED FRONT PORCH: a notch cut OUT of the north wall
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#faf6ee" stroke="#c05621" stroke-width="3.4"/>' % (
        X(28), Y(0), 10 * PF, 6 * PF)
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="7"/>' % (X(28.4), Y(0), X(37.6), Y(0))
    for px in (28, 38):
        s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#c05621" stroke-width="3.4"/>' % (X(px), Y(0), X(px), Y(6))
    s += '<text x="%s" y="%s" font-size="8.6" font-weight="700" text-anchor="middle" fill="#c05621">COVERED PORCH</text>' % (X(33), Y(2.2))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">RECESSED &mdash; tucked inside</text>' % (X(33), Y(3.4))
    s += '<text x="%s" y="%s" font-size="7.2" text-anchor="middle" fill="#8a5000">brick both sides &middot; rails at the step</text>' % (X(33), Y(4.6))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#0b6b3a">&#9650; opens straight into the FOYER</text>' % (X(33), Y(7.3))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">front door &middot; doorbell &middot; outlet &middot; flag</text>' % (X(33), Y(-1.3))

    # BACK DECK: middle/east only
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#f4f7f4" stroke="#8a5000" stroke-width="2.2" stroke-dasharray="7 4"/>' % (
        X(26), Y(32), 26 * PF, 11 * PF)
    s += '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="#8a5000">BACK DECK &mdash; ELEVATED ON POSTS</text>' % (X(39), Y(36))
    s += '<text x="%s" y="%s" font-size="7.4" text-anchor="middle" fill="#8a5000">grill &middot; bar &middot; outdoor TV &middot; NO hot tub</text>' % (X(39), Y(37.4))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">&#9664; steps down at this end</text>' % (X(30), Y(38.9))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">SHORTENED &mdash; the photo shows plain</text>' % (X(18), Y(34.4))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c05621">brick across the garage end, no deck</text>' % (X(18), Y(35.6))

    # chimney, east half of the rear roof
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#8a5000" stroke="#5a3400" stroke-width="1.6"/>' % (
        X(48.5), Y(30.4), 2.4 * PF, 2.4 * PF)
    s += '<text x="%s" y="%s" font-size="7.8" font-weight="700" text-anchor="middle" fill="#8a5000">CHIMNEY</text>' % (X(49.7), Y(29.6))
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c0392b">&#9658; so the FIREPLACE is at the EAST end</text>' % (X(48), Y(28.4))

    # east wall equipment
    s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2.4"/>' % (
        X(57.5), Y(12), 4 * PF, 4 * PF)
    s += '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>' % (X(59.5), Y(14.3))
    s += '<circle cx="%s" cy="%s" r="8" fill="#fff" stroke="#12507e" stroke-width="2.2"/>' % (X(57.5), Y(19))
    s += '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#12507e">B</text>' % (X(57.5), Y(19.3))
    s += '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve</text>' % (X(57.5), Y(21.4))
    s += '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#6b3fa0">EAST WALL</text>' % (X(60.5), Y(24.2))

    # duct trunk
    s += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#c0392b" stroke-width="7" opacity="0.28"/>' % (
        X(56), Y(16), X(13), Y(16))
    for lx, lbl in ((50, '16"'), (36, '14"'), (20, '12"')):
        s += '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="#c0392b">%s</text>' % (X(lx), Y(15.3), lbl)
    s += '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#c0392b">supply trunk, off the duct drawing &mdash; 16&quot; at the unit, 12&quot; at the garage end</text>' % (X(34), Y(17.3))

    s += ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2"/>'
          '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">44 ft</text>') % (
        X(12), Y(-3.6), X(56), Y(-3.6), X(46), Y(-4.2))
    s += '<g transform="translate(%s,%s)"><path d="M0,-18 L5.5,8 L0,2.5 L-5.5,8 Z" fill="#111"/><text x="0" y="22" font-size="10" font-weight="700" text-anchor="middle">N</text></g>' % (X(66), Y(-2))
    return s

TILES = [
    (18, 15, "LIVING ROOM", "318 sf", "fireplace + TV &middot; RETURN GRILLE 20&#215;25 &middot; thermostat &middot; fan &middot; deck door", "#eaf4f8"),
    (15, 13, "MASTER BED", "195 sf", "THE BEAST &middot; J45 Beehive &middot; gateway &middot; TV &middot; bed &middot; vaulted", "#e8eef8"),
    (11, 16, "OFFICE / BED 3", "176 sf", "RE200 &middot; ethernet &middot; 4 monitors &middot; printer", "#e9f5ec"),
    (20, 8, "KITCHEN + DINING", "160 sf", "stove &middot; fridge &middot; sink &middot; bar", "#eef6ee"),
    (10, 13, "GUEST BED", "130 sf", "ethernet drop", "#e9f5ec"),
    (10, 11, "MASTER BATH", "110 sf", "", "#f7f5ea"),
    (8, 13, "FOYER", "104 sf", "behind the recessed porch", "#eef7f3"),
    (11, 8, "GUEST BATH", "88 sf", "", "#f9eef1"),
    (4, 18, "HALLWAY", "72 sf", "TURNED 90&#176; &mdash; 4 wide, 18 long", "#f4f8fb"),
    (5, 11, "LAUNDRY", "55 sf", "washer + dryer facing", "#f7f5ea"),
]

def tray():
    s, ox, oy, rowh = '', 0.0, 50.0, 0.0
    for (w, h, name, sf, items, fill) in TILES:
        if ox + w > 72:
            oy += rowh + 3.5; ox, rowh = 0.0, 0.0
        stroke = "#c05621" if name == "HALLWAY" else "#111418"
        sw = 3.2 if name == "HALLWAY" else 2.2
        s += '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"/>' % (
            X(ox), Y(oy), w * PF, h * PF, fill, stroke, sw)
        cx = X(ox + w / 2.0)
        s += '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle">%s</text>' % (cx, Y(oy + 1.4), name)
        s += '<text x="%s" y="%s" font-size="7.6" text-anchor="middle" fill="#5a636d">%g &#215; %g &middot; %s</text>' % (
            cx, Y(oy + 2.5), w, h, sf)
        if items:
            parts, line, ly = items.split(" &middot; "), [], oy + 3.8
            for p in parts:
                line.append(p)
                if len(" ".join(line)) > int(w * 1.6):
                    s += '<text x="%s" y="%s" font-size="6.6" text-anchor="middle" fill="#0b6b3a">%s</text>' % (cx, Y(ly), " &middot; ".join(line))
                    line, ly = [], ly + 1.0
            if line:
                s += '<text x="%s" y="%s" font-size="6.6" text-anchor="middle" fill="#0b6b3a">%s</text>' % (cx, Y(ly), " &middot; ".join(line))
        ox += w + 2.5; rowh = max(rowh, h)
    return s, oy + rowh

body, bottom = tray()
svg = ('<svg viewBox="0 0 %d %d" role="img" aria-label="Rev M corrected shell and room tiles">%s'
       '<text x="%s" y="%s" font-size="13" font-weight="700" fill="#111">THE ROOMS &mdash; same scale. The hallway tile is now TURNED 90&#176;.</text>'
       '<text x="%s" y="%s" font-size="8.6" fill="#5a636d">Nothing taken out. You said the guest bedroom and office doors ARE straight across &mdash; that only works with the hallway as a 4 ft &#215; 18 ft spine and those two rooms flanking it.</text>'
       '%s</svg>') % (round(90 * PF), round((bottom + 16) * PF), shell(), X(0), Y(46.5), X(0), Y(48.2), body)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8]

panel = u"""</div><div>
<h3>I looked at the outside shots. Three things changed.</h3>
<ul>
<li>&#10003; <b>THE PORCH IS RECESSED &mdash; you were right, and the front-door view proves it.</b>
Looking out from the front door there is <b>brick wall on BOTH sides</b> with the porch ceiling
running over them, and railings only at the step opening. That is a porch <b>cut into</b> the
footprint, not one hung off the front of it. Redrawn as a <b>10 &times; 6 notch in the north wall
opening straight into the foyer</b> &mdash; <i>&ldquo;it tucks inside to where it comes into the
foyer.&rdquo;</i></li>
<li>&#10003; <b>The 12 &times; 8 moved from the south side of the garage to the north.</b> Garage is
still exactly <b>12 &times; 24</b>. <b>The rear-elevation shot independently backs you up:</b> the
back wall is <b>continuous brick right across the garage end</b> &mdash; no notch, no step-back. Had
that space still been on the south side there would be a visible jog in the back wall, and there is
not one.</li>
<li>&#10003; <b>The back deck is SHORTER than I drew it.</b> Same photo: the deck starts about a third
of the way along the rear and runs east. The whole garage end of the back wall is <b>plain brick with
one small window and no deck</b>. Was 40 ft, now <b>26 ft</b>, with the step-down at its west end
where the photo shows it.</li>
</ul>

<div class="note"><b>&#128269; One more thing that shot settles: THE CHIMNEY IS ON THE EAST HALF OF
THE ROOF.</b> So the <b>fireplace &mdash; and the living room with it &mdash; sits at the EAST
end</b>, not in the middle where I had been drawing it. Marked on the plan. This is what you meant by
pulling it all together: the picture knows where the fireplace is.</div>

<div class="warn"><b>&#9888; Your last two corrections do not fit together, and I want you to place
one tile rather than have me guess.</b>
<p style="margin:6px 0">&#10003; <b>&ldquo;the doors in the guest bedroom and the office are straight
across from each other&rdquo;</b> &mdash; taken. That is only possible with the hallway as a <b>4 ft
wide, 18 ft long spine</b> and those two rooms on either side of it, so <b>the hallway tile is turned
90&deg;</b> on this sheet.</p>
<p style="margin:6px 0">&#10003; <b>&ldquo;the living room southwest corner is really the office &mdash;
I told you wrong&rdquo;</b> &mdash; also taken. But that puts the <b>office in the SOUTHWEST</b>.</p>
<p style="margin:6px 0">&#128681; <b>The conflict:</b> you also told me the <b>RE200 is in the office,
and the B-hyve is on the outside wall of the office, through the brick</b> &mdash; and the B-hyve is
on the <b>EAST</b> wall, which you confirmed separately. <b>The office cannot sit in the southwest and
share a brick wall with the B-hyve on the east.</b> One of the two is off, and I am not picking for
you.</p>
<p style="margin:6px 0"><b>Put the OFFICE tile where it really goes and everything else falls in
behind it</b> &mdash; guest bed goes across the spine from it, and the living room takes what is left
around the fireplace at the east end.</p></div>

<div class="note"><b>Unchanged:</b> shell <b>44 &times; 32 = 1,408 sf</b>, garage <b>12 &times; 24 =
288 sf</b>, tiles total 1,408 sf. Supply trunk drawn off the duct scope &mdash; <b>16&quot; at the
unit on the east, 12&quot; at the garage end on the west</b>.</div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev M</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev M &middot; 22 Sep 2026 8:28 AM &middot; corrected from the exterior shots<br>anchored on the 12&times;24 garage</div>'
        u'<h1>The Shell &mdash; Rev M<span class="draftbadge">photos read</span></h1>'
        u'<div class="sub"><b>Porch redrawn RECESSED into the foyer</b> &mdash; the front-door view proves it. '
        u'<b>The 12&times;8 moved from south of the garage to north</b>, and the rear elevation backs you up. '
        u'<b>Deck shortened</b>, <b>chimney found on the east</b>, <b>hallway turned 90&deg;</b> so those two doors can face.</div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_M.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev M built")
