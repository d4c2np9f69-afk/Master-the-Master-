# -*- coding: utf-8 -*-
# STAGE 2 - clean room sheet + numbered component list for Jeff to mark up.
# Rooms are Rev Q. Everything else stripped: no fixture dots, no callouts, no commentary.
# Component list built from the LIVE Home Assistant inventory + the Zigbee roster doc,
# not from memory. Models per docs/zigbee/zigbee_mesh_routers_2026-08-27.md.
import io
PF = 13.0                      # bigger scale - he is writing on this
def X(f): return round((f + 2) * PF, 1)
def Y(f): return round((f + 6) * PF, 1)

def room(x, y, w, h, name, fill="#ffffff", stroke="#111418", sw=2.6, dash=False):
    d = ' stroke-dasharray="8 5"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w * PF, 1), round(h * PF, 1), fill, stroke, sw, d)
    cx, cy = X(x + w / 2.0), Y(y + h / 2.0)
    if name:
        s += '<text x="%s" y="%s" font-size="11" font-weight="700" text-anchor="middle" fill="#111">%s</text>' % (cx, cy - 4, name)
        s += '<text x="%s" y="%s" font-size="8.4" text-anchor="middle" fill="#7a838c">%g&#215;%g</text>' % (cx, cy + 9, w, h)
    return s

R = [
    room(0, 8, 12, 24, "GARAGE", "#fdfaf4", "#8a5000", 3.0),
    room(12, 0, 15, 13, "MASTER BED"),
    room(27, 6, 8, 7, "FOYER"),
    room(35, 0, 10, 13, "GUEST BED"),
    room(45, 0, 11, 6, "CLOSETS", "#fbfbfb", "#111418", 2.0, True),
    room(45, 6, 11, 11, "GUEST BATH"),
    room(12, 13, 8, 9, "MASTER BATH"),
    room(12, 22, 8, 2, "PANTRY", "#fbfbfb", "#111418", 2.0, True),
    room(20, 13, 7, 4, "LAUNDRY"),
    room(20, 17, 7, 7, "DINING"),
    room(27, 13, 18, 4, ""),
    room(27, 17, 14, 15, "LIVING ROOM"),
    room(41, 17, 15, 15, "OFFICE / BED 3"),
    room(12, 24, 15, 8, "KITCHEN"),
    room(26, 32, 30, 11, "BACK DECK", "#fbfbfb", "#8a5000", 2.2, True),
]

# RECESSED front porch - a notch cut INTO the north wall, opening to the foyer
PORCH = ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fbfbfb" stroke="#8a5000" stroke-width="2.6"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="7"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="2.6"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="2.6"/>'
         '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle" fill="#8a5000">FRONT PORCH</text>'
         '<text x="%s" y="%s" font-size="8" text-anchor="middle" fill="#8a5000">recessed &middot; 8&#215;6</text>'
         '<text x="%s" y="%s" font-size="8.6" font-weight="700" text-anchor="middle" fill="#8a5000">ARCHED WINDOW - flush, does not protrude</text>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="1.8"/>'
         '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="1.8"/>'
         '<text x="%s" y="%s" font-size="8.2" font-weight="700" text-anchor="middle" fill="#8a5000">STEPS UP + rails</text>') % (
    X(27), Y(0), 8 * PF, 6 * PF,
    X(27.4), Y(0), X(34.6), Y(0),
    X(27), Y(0), X(27), Y(6),
    X(35), Y(0), X(35), Y(6),
    X(31), Y(2.6), X(31), Y(4.1),
    X(19.5), Y(-1.4),
    X(28.4), Y(-1.2), X(33.6), Y(-1.2),
    X(28.4), Y(-2.2), X(33.6), Y(-2.2),
    X(31), Y(-3.2))

HALL = ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="6"/>'
        '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111418" stroke-width="1.6" stroke-dasharray="6 5"/>'
        '<text x="%s" y="%s" font-size="11" font-weight="700" text-anchor="middle" fill="#111">HALLWAY</text>'
        '<text x="%s" y="%s" font-size="8" text-anchor="middle" fill="#7a838c">open west &middot; corridor east</text>') % (
    X(27), Y(17), X(41), Y(17),
    X(27), Y(17), X(41), Y(17),
    X(34), Y(14.6), X(34), Y(16.2))

OUT = ('<rect x="%s" y="%s" width="%s" height="%s" fill="none" stroke="#e8613c" stroke-width="5"/>'
       '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="#6b3fa0" stroke-width="2.2"/>'
       '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="#6b3fa0">A/C</text>'
       '<g transform="translate(%s,%s)"><path d="M0,-20 L6,9 L0,3 L-6,9 Z" fill="#111"/>'
       '<text x="0" y="24" font-size="11" font-weight="700" text-anchor="middle">N</text></g>'
       '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
       '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text>') % (
    X(12), Y(0), 44 * PF, 32 * PF,
    X(58), Y(12), 4 * PF, 4 * PF, X(60), Y(14.4),
    X(63), Y(-3),
    X(12), Y(46), X(22), Y(46), X(17), Y(48.2))

svg = '<svg viewBox="0 0 %d %d" role="img" aria-label="Stage 2 blank room sheet">%s%s%s%s</svg>' % (
    round(69 * PF), round(56 * PF), "".join(R), PORCH, HALL, OUT)

# ------------------------------------------------------------------ the list
GROUPS = [
 ("NETWORK &amp; POWER", [
  "AT&amp;T gateway", "The Beast (301Server PC)", "J45 Beehive (Home Assistant)",
  "Network switch", "APC BN600 UPS", "TP-Link RE200 extender", "Garage PC",
  "Zigbee coordinator + antenna", "Bluetooth dongle (garage audio)"]),
 ("CAMERAS", [
  "Front Doorbell", "Driveway", "Front Right", "Back Left", "Backyard",
  "Garage (mains Mini, no battery)"]),
 ("LIGHTING", [
  "Bedroom cans &mdash; Kasa HS220", "Kitchen/Dining cans &mdash; HS220",
  "Living room cans &mdash; HS220", "Master bath cans &mdash; HS210",
  "Garage light &mdash; Ecoeler YM2108T"]),
 ("PLUGS &amp; LAMPS", [
  "Jeff&rsquo;s bed lamp", "Angela&rsquo;s bed lamp", "Garage fan plug",
  "Hot water circulation pump"]),
 ("CONTACT SENSORS <span class='mdl'>SONOFF SNZB-04</span>", [
  "Front door", "Back deck door", "Garage man door", "Garage door down",
  "Mailbox", "Spare contact 1"]),
 ("LEAK SENSORS <span class='mdl'>HOBEIAN ZG-222Z</span>", [
  "Guest bath", "Kitchen sink", "Kitchen refrigerator"]),
 ("ZIGBEE MESH <span class='mdl'>Tuya TS0501B</span>", [
  "Garage repeater", "Floating repeater", "301 Alarm siren <span class='mdl'>TS0224</span>"]),
 ("HVAC", [
  "A/C package unit", "Return air filter grille 20&#215;25", "Thermostat",
  "A/C relay (SONOFF MINI-D)", "Garage door opener (SONOFF MINI-D)"]),
 ("IRRIGATION", [
  "B-hyve timer", "Z1 Front right", "Z2 Front left", "Z3 Back left",
  "Z4 Back right", "Z5 Right side drive", "Garden zone"]),
 ("MEDIA &amp; VOICE", [
  "Living room TV", "Fire TV Stick 4K Max", "Apple TV", "Master bedroom TV",
  "Garage TV", "Living Room Echo Dot", "Master Bedroom Echo",
  "Vizio sound bar <span class='mdl'>NOT on the UPS</span>"]),
 ("APPLIANCES", ["Washer", "Dryer", "Stove / range", "Refrigerator", "Dishwasher"]),
 ("OTHER", [
  "Sharky dock", "Electrical panel", "Water meter", "Gas meter", "Electric meter",
  "Weather station KTNWHITE21"]),
]

n, col, cols = 0, [], []
for title, items in GROUPS:
    blk = ['<div class="grp">%s</div>' % title]
    for it in items:
        n += 1
        blk.append('<div class="itm"><span class="num">%d</span>%s</div>' % (n, it))
    col.append("".join(blk))
    if len(col) == 6:
        cols.append("".join(col)); col = []
if col: cols.append("".join(col))
listhtml = "".join('<div class="lcol">%s</div>' % c for c in cols)

style = u"""<style>
*{box-sizing:border-box}
body{margin:0;font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
     color:#111;background:#fff}
.sheet{padding:16px 20px;max-width:1520px;margin:0 auto}
.mast{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:12px;position:relative}
h1{font-size:25px;margin:0 0 3px;letter-spacing:-.4px}
.rev{position:absolute;right:0;top:2px;text-align:right;font-size:10.5px;color:#6b7480;
     text-transform:uppercase;letter-spacing:.5px;line-height:1.5}
.sub{font-size:12.5px;color:#39424b;max-width:830px}
.badge{display:inline-block;background:#111;color:#fff;font-size:10.5px;font-weight:700;
       padding:3px 9px;border-radius:11px;margin-left:9px;vertical-align:3px;letter-spacing:.4px}
.layout{display:grid;grid-template-columns:1fr 455px;gap:18px;align-items:start}
svg{width:100%;height:auto;display:block}
.lists{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.grp{font-size:9.6px;font-weight:700;letter-spacing:.7px;color:#fff;background:#39424b;
     padding:3px 7px;border-radius:3px;margin:9px 0 5px}
.lcol .grp:first-child{margin-top:0}
.mdl{font-weight:400;opacity:.72;letter-spacing:0}
.itm{font-size:11.2px;padding:2.6px 0 2.6px 26px;position:relative;
     border-bottom:1px dotted #d8dde2;line-height:1.35}
.num{position:absolute;left:0;top:2.4px;width:20px;text-align:right;font-weight:700;
     color:#c05621;font-size:11px}
.itm .mdl{color:#6b7480;font-size:10px}
.note{background:#eef4fa;border-left:4px solid #2b6cb0;padding:9px 11px;border-radius:0 5px 5px 0;
      font-size:11.6px;margin-top:14px}
@media print{.sheet{padding:0}body{font-size:11px}}
</style>"""

head = (u"<title>HCC Floor Plan — Stage 2 Device Key</title>\n" + style +
        u'\n<section class="sheet"><div class="mast">'
        u'<div class="rev">Stage 2 &middot; 22 Sep 2026 9:29 AM<br>rooms per Rev Q &middot; 13 px per foot</div>'
        u'<h1>Rooms &amp; Device Key<span class="badge">MARK IT UP</span></h1>'
        u'<div class="sub">Clean plan, nothing on it. <b>Write each number where that thing actually is</b> '
        u'&mdash; send it back and I will draw them all in. Cross out anything you cannot place; '
        u'write anything missing at the bottom and I will give it a number.</div>'
        u'</div><div class="layout"><div>')

tail = (u'</div><div><div class="lists">%s</div>'
        u'<div class="note"><b>%d items, and the list is not a guess.</b> It is the live Home Assistant '
        u'inventory pulled this morning, cross-checked against the Zigbee roster for the real model '
        u'numbers &mdash; the contacts are <b>SONOFF SNZB-04</b> and the leak sensors <b>HOBEIAN '
        u'ZG-222Z</b>, both of which the old buildout doc had wrong.<br><br>'
        u'<b>Front corrected 9:32</b> &mdash; the porch is a true <b>recess cut into the north wall</b>, not a notch beside a projecting wing, and the <b>master bedroom’s arched window is FLUSH</b>. That drops the heated area to <b>1,360 sf</b>, because a recessed porch is carved out of the house rather than added to it.<br><br><b>Two rooms on the plan are still mine, not yours:</b> <b>PANTRY</b> and <b>CLOSETS</b> are '
        u'drawn dashed because nothing you have said places them. Fix those two while you are on here.'
        u'</div></div></div></section>') % (listhtml, n)

io.open("HCC_Floorplan_STAGE2_DEVICE_KEY.html", "w", encoding="utf-8").write(head + svg + tail)
print("Stage 2 sheet built - %d numbered items" % n)
