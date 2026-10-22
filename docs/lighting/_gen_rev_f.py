# -*- coding: utf-8 -*-
import io
PF = 11.0
def X(f): return round((f + 14) * PF, 1)
def Y(f): return round((f + 12) * PF, 1)

def room(x, y, w, h, name, sub="", fill="#eef3f8", stroke="#111418", sw=2.2, dash=False):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    s += '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy - 3, name)
    s += '<text x="%s" y="%s" font-size="7.8" text-anchor="middle" fill="#5a636d">%g&#215;%g = %d sf</text>' % (cx, cy + 8, w, h, int(w * h))
    if sub:
        s += '<text x="%s" y="%s" font-size="7.4" text-anchor="middle" fill="#0b6b3a">%s</text>' % (cx, cy + 18, sub)
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

R = [
    room(0, 0, 12, 24, "GARAGE", "12&#215;24 KNOWN", "#fdf7ec", "#8a5000", 2.6),
    room(12, 0, 15, 13, "MASTER BED", "vaulted &middot; THE BEAST", "#e8eef8"),
    room(27, 0, 8, 13, "FOYER", "", "#eef7f3"),
    room(35, 0, 10, 13, "GUEST BED", "ethernet drop", "#e9f5ec"),
    room(45, 0, 11, 13, "GUEST BATH", "", "#f9eef1"),
    room(12, 13, 10, 11, "MASTER BATH", "", "#f7f5ea"),
    room(22, 13, 5, 11, "LAUNDRY", "", "#f7f5ea"),
    room(27, 13, 18, 11, "HALL / BATH", "", "#f9eef1"),
    room(45, 13, 11, 11, "OFFICE / BED 3", "RE200 &middot; eth &middot; 4 monitors", "#e9f5ec"),
    room(12, 24, 18, 8, "KITCHEN + DINING", "", "#eef6ee"),
    room(30, 24, 26, 8, "LIVING ROOM", "tray ceiling", "#eaf4f8"),
    room(27, -8, 12, 8, "FRONT PORCH", "COVERED", "#faf6ee", "#8a5000", 2.2, True),
    room(12, 32, 40, 11, "BACK DECK", "ELEVATED on posts &middot; open", "#f4f7f4", "#8a5000", 2.2, True),
]

F = [
    # front porch
    fx(29.8, -4, "outlet"), fx(33, -4, "bell"), fx(36.3, -4, "flag"),
    # master bed
    fx(15, 8, "BEAST", "#6b3fa0"), fx(18.5, 11.6, "gateway", "#12507e"), fx(22, 11.6, "TV"), fx(25, 8, "fan"),
    # laundry
    fx(23.8, 16, "wash"), fx(23.8, 21, "dry"),
    # kitchen
    fx(14, 31, "sink"), fx(17.5, 31, "range"), fx(20.5, 31, "micro"), fx(24, 31, "fridge"), fx(28, 27.5, "bar"),
    # living room
    fx(33, 25.5, "fplc+TV"), fx(37.5, 25.5, "RETURN", "#c0392b", 5.2), fx(41.5, 25.5, "stat", "#c0392b"),
    fx(45, 27.5, "fan"), fx(50, 31.2, "deck dr"),
    # office
    fx(48, 20.5, "4-mon", "#6b3fa0"), fx(53, 20.5, "print"),
    # garage
    fx(3, 3, "main dr"), fx(3, 8, "panel", "#c0392b"), fx(3, 13, "man dr"),
    fx(8, 6, "TV"), fx(8, 10.5, "fan"), fx(6, 17, "bench"), fx(9.5, 17, "pegbd"),
    fx(6, 21, "saws"), fx(9.5, 21, "mower"),
    # deck
    fx(19, 37, "HOT TUB", "#12507e", 5.6), fx(30, 36, "outdoor TV", "#12507e"), fx(14, 41, "stairs"),
]
marks = eth(40, 6.5, "guest bed") + eth(50.5, 16.5, "office / RE200") + "".join(F)

ext = ('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5" opacity="0.85"/>'
       '<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5" opacity="0.85"/>') % (
    X(12), Y(0), round(44 * PF, 1), round(32 * PF, 1), X(0), Y(0), round(12 * PF, 1), round(24 * PF, 1))

outs = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2"/>'
        '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>'
        '<circle cx="%s" cy="%s" r="7.5" fill="#fff" stroke="#12507e" stroke-width="2"/>'
        '<text x="%s" y="%s" font-size="8" font-weight="700" text-anchor="middle" fill="#12507e">B</text>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">B-hyve +</text>'
        '<text x="%s" y="%s" font-size="7.2" font-weight="700" text-anchor="middle" fill="#12507e">irrigation</text>') % (
    X(57.5), Y(12), round(4 * PF, 1), round(4 * PF, 1), X(59.5), Y(14.2),
    X(57.5), Y(19), X(57.5), Y(19) + 3, X(57.5), Y(22), X(57.5), Y(23.8))

sc = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
      '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text>'
      '<g transform="translate(%s,%s)"><path d="M0,-20 L6,9 L0,3 L-6,9 Z" fill="#111"/>'
      '<text x="0" y="24" font-size="10" font-weight="700" text-anchor="middle">N</text></g>') % (
    X(0), Y(47), X(10), Y(47), X(0), Y(46), X(0), Y(48), X(10), Y(46), X(10), Y(48),
    X(5), Y(50), X(66), Y(-6))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Scaled floor plan Rev F">%s%s%s%s%s</svg>' % (
    round(76 * PF), round(60 * PF), "".join(R), marks, ext, outs, sc)

css = io.open("HCC_Floorplan_STAGE1_ROOMS.html", encoding="utf-8").read()
style = css[css.index("<style>"):css.index("</style>") + 8].replace(
    "grid-template-columns:1fr 232px", "grid-template-columns:1fr 228px")

panel = u"""</div><div>
<h3>From the photos</h3>
<ul>
<li>&#128308; <b>RETURN AIR GRILLE located &mdash; LIVING ROOM</b>, on the wall by the front-door end.
That is the <b>20&times;25 filter grille your duct scope says STAYS</b>, and every bid is priced
around keeping it. First time its position has been pinned down.</li>
<li><b>Living room:</b> fireplace with TV above, thermostat, tray ceiling, fan, back deck door</li>
<li><b>Kitchen:</b> sink under the window, range + microwave, fridge, granite bar with 2 stools</li>
<li><b>Master bed:</b> vaulted ceiling, fan, TV, and the <b>gateway + streaming box on the dresser</b></li>
<li><b>Office / Bed 3:</b> 4-monitor workstation, printer, fan</li>
<li><b>Garage:</b> TV, fan, workbench + pegboard, wall cabinets, miter + table saw, mower, shop fan</li>
<li>&#128308; <b>BACK DECK is ELEVATED on posts with a stair run</b> &mdash; not at grade as drawn
before &mdash; and it carries a <b>HOT TUB</b> and an <b>outdoor TV</b>. Both are new to the record.</li>
</ul>

<div class="warn"><b>Two assumptions I made, because you said it and I only inferred otherwise:</b>
<ul style="margin-top:5px">
<li><b>A/C on the EAST wall</b> &mdash; your markup put it there. The front photo shows condensers at
the far left of that elevation, which I could not reconcile without knowing which way the front
faces. <b>Your drawing wins.</b></li>
<li><b>The BEAST in the MASTER BEDROOM</b> &mdash; you said so. The office has the 4-monitor rig,
which is what made me ask. <b>Your word wins.</b></li>
</ul>
Correct either and I will move it.</div>

<h3>Totals</h3>
<ul>
<li>House <b>44 &times; 32 = 1,408 sf</b> against the recorded 1,400</li>
<li>Garage <b>12 &times; 24 = 288 sf</b> &mdash; your measurement, the ruler</li>
<li>Deck drawn <b>40 &times; 11</b> &mdash; a guess from the photo, it looks bigger than the old block</li>
</ul>
<div class="note"><b>Next:</b> the 38-number device key, once the shell is signed off.</div>
</div></div></section>"""

head = (u"<title>HCC Floor Plan — Rev F</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Rev F &middot; 22 Sep 2026 &middot; TO SCALE<br>anchored on the 12&times;24 garage</div>'
        u'<h1>Floor Plan &mdash; Rev F<span class="draftbadge">photos folded in</span></h1>'
        u'<div class="sub">Everything from the ten photos. Headline: <b>the 20&times;25 return air grille is in '
        u'the LIVING ROOM</b>, the back deck is <b>elevated with a hot tub and an outdoor TV</b>, and the garage '
        u'workshop is now populated.</div>'
        u'</div><div class="layout"><div>')

io.open("HCC_Floorplan_REV_F.html", "w", encoding="utf-8").write(head + svg + panel)
print("Rev F built")
