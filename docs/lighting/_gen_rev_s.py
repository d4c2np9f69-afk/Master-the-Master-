# -*- coding: utf-8 -*-
# REV S - WEST HALF SOLVED on measurements. East half still open.
# West column verified: 11 + 8 + 3 + 13 = 35.0 vs measured 34.83 -> 2 inches.
import io
PF = 15.0
def X(f): return round((f + 3) * PF, 1)
def Y(f): return round((f + 4) * PF, 1)
MEAS, INF, HOT = "#0b6b3a", "#c05621", "#c0392b"

HX, HOUSE_W, E_DEPTH, KIT_JOG = 14.83, 39.42, 29.25, 5.58
SETBACK, PORCH_D, PORCH_W = 4.5, 3.67, 5.5
OUTLINE = [(0, SETBACK), (HX, SETBACK), (HX, 0), (HX+19.67, 0), (HX+19.67, PORCH_D),
           (HX+19.67+PORCH_W, PORCH_D), (HX+19.67+PORCH_W, 0), (HX+HOUSE_W, 0),
           (HX+HOUSE_W, E_DEPTH), (HX+7.7, E_DEPTH), (HX+7.7, E_DEPTH+KIT_JOG), (0, E_DEPTH+KIT_JOG)]
poly = " ".join("%s,%s" % (X(x), Y(y)) for x, y in OUTLINE)

def rm(x, y, w, h, name, sub="", fill="#fff", st="#111418", sw=2.2, dash=False, fs=9.6):
    d = ' stroke-dasharray="7 4"' if dash else ''
    s = '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>' % (
        X(x), Y(y), round(w*PF,1), round(h*PF,1), fill, st, sw, d)
    cx, cy = X(x+w/2.0), Y(y+h/2.0)
    s += '<text x="%s" y="%s" font-size="%s" font-weight="700" text-anchor="middle">%s</text>' % (cx, cy-3, fs, name)
    if sub: s += '<text x="%s" y="%s" font-size="7.6" text-anchor="middle" fill="#5a636d">%s</text>' % (cx, cy+8, sub)
    return s

G = HX  # house west wall in global x
W = [
  rm(0.9, SETBACK+.9, 13, 24, "GARAGE", "24 &#215; 13", "#fdf7ec", "#8a5000", 2.4),
  rm(G, 0, 15, 11, "MASTER BED", "15 &#215; 11", "#e8eef8", MEAS, 2.6),
  rm(G, 11, 3.5, 8, "clo", "", "#f4f1e8", MEAS, 1.8, False, 7.6),
  rm(G+3.5, 11, 8, 8, "MASTER BATH", "8 ft wall &rarr; end of shower", "#f7f5ea", MEAS, 2.6, False, 9.2),
  rm(G+11.5, 11, 3.5, 8, "clo", "", "#f4f1e8", MEAS, 1.8, False, 7.6),
  rm(G+3.5, 19, 7.917, 3, "LAUNDRY", "7&#8242;11&#8243; &#215; 3&#8242;", "#f7f5ea", MEAS, 2.6, False, 8.6),
  rm(G, 19, 3.5, 3, "clo", "", "#f4f1e8", MEAS, 1.8, False, 7.6),
  rm(G+11.42, 19, 3.58, 3, "linen", "", "#f4f1e8", MEAS, 1.8, False, 7.6),
  rm(G, 22, 16, 13, "KITCHEN / DINING", "16 &#215; 13", "#eef6ee", MEAS, 2.6),
  rm(G+15.4, 0, 8, 6, "FOYER", "8 &#215; 6 &middot; linen + coat", "#eef7f3", MEAS, 2.6, False, 9.2),
  rm(G+23.8, 0, 11, 10, "GUEST BED", "11 &#215; 10", "#e9f5ec", MEAS, 2.6),
  rm(G+15.4, 10.6, 24, 18.6, "EAST HALF", "arrangement still open", "#fdf3ee", INF, 3.0, True, 11),
]
EASTLIST = ''.join(
  '<text x="%s" y="%s" font-size="8.6" font-weight="700" text-anchor="middle" fill="%s">%s</text>'
  % (X(G+27.4), Y(22.2+i*1.5), INF, t) for i, t in enumerate(
    ["LIVING ROOM 14 &#215; 17", "OFFICE / BED 3 10 &#215; 13", "GUEST BATH ~10 &#215; 8&#189;", "HALLWAY"]))

def dim(x1,y1,x2,y2,t,c=MEAS,off=-5,h=True):
    s='<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2"/>'%(X(x1),Y(y1),X(x2),Y(y2),c)
    for (ax,ay),d in (((x1,y1),1),((x2,y2),-1)):
        s+=('<path d="M %s %s l %s -4 l 0 8 Z" fill="%s"/>' if h else '<path d="M %s %s l -4 %s l 8 0 Z" fill="%s"/>')%(X(ax),Y(ay),d*8,c)
    mx,my=(x1+x2)/2.0,(y1+y2)/2.0
    rot='' if h else ' transform="rotate(-90 %s %s)"'%(X(mx),Y(my))
    s+='<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle" fill="%s"%s>%s</text>'%(X(mx),Y(my)+off,c,rot,t)
    return s

D = (dim(G,-2.4,G+HOUSE_W,-2.4,"39&#8242;5&#8243;") + dim(0,-2.4,G,-2.4,"garage 14&#8242;10&#8243;")
     + dim(G+HOUSE_W+2.6,0,G+HOUSE_W+2.6,E_DEPTH,"29&#8242;3&#8243;",MEAS,-5,False)
     + dim(-2.6,SETBACK,-2.6,E_DEPTH+KIT_JOG,"west 34&#8242;10&#8243;",MEAS,-5,False))

NOTE = ('<text x="%s" y="%s" font-size="9.2" font-weight="700" fill="%s">&#9650; KITCHEN BUMPS OUT 5&#8242;7&#8243;</text>'
        '<text x="%s" y="%s" font-size="9.2" font-weight="700" fill="%s">&#9660; GARAGE SET BACK 4&#8242;6&#8243; &middot; door in the WEST wall</text>'
        '<text x="%s" y="%s" font-size="8.8" font-weight="700" fill="%s">LAUNDRY BACKS ONTO THE SHOWER &mdash; 7&#8242;11&#8243; vs 8&#8242;</text>') % (
   X(1), Y(E_DEPTH+KIT_JOG+2.2), HOT, X(1), Y(SETBACK-1.6), HOT, X(G+3.5), Y(24.0), MEAS)

svg = ('<svg viewBox="0 0 %d %d"><polygon points="%s" fill="#fbfcfd" stroke="#e8613c" stroke-width="4.5"/>'
       '%s%s%s%s<g transform="translate(%s,%s)"><path d="M0,-20 L6,9 L0,3 L-6,9 Z" fill="#111"/>'
       '<text x="0" y="24" font-size="11" font-weight="700" text-anchor="middle">N</text></g>'
       '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.5"/>'
       '<text x="%s" y="%s" font-size="10" font-weight="700" text-anchor="middle">10 FEET</text></svg>') % (
    round(70*PF), round(46*PF), poly, "".join(W), EASTLIST, D, NOTE, X(60), Y(2),
    X(1), Y(41), X(11), Y(41), X(6), Y(42.8))

style = u"""<style>*{box-sizing:border-box}body{margin:0;font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff}
.sheet{padding:16px 22px;max-width:1500px;margin:0 auto}.mast{border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:12px;position:relative}
h1{font-size:25px;margin:0 0 3px;letter-spacing:-.4px}.rev{position:absolute;right:0;top:2px;text-align:right;font-size:10.5px;color:#6b7480;text-transform:uppercase;letter-spacing:.5px;line-height:1.5}
.sub{font-size:12.5px;color:#39424b;max-width:900px}.badge{display:inline-block;background:#0b6b3a;color:#fff;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:11px;margin-left:9px;vertical-align:3px}
.layout{display:grid;grid-template-columns:1fr 420px;gap:20px;align-items:start}svg{width:100%;height:auto;display:block}
.note{background:#eaf6ef;border-left:4px solid #0b6b3a;padding:10px 12px;border-radius:0 5px 5px 0;font-size:11.8px;margin-bottom:11px}
.warn{background:#fdf1ec;border-left:4px solid #c05621;padding:10px 12px;border-radius:0 5px 5px 0;font-size:11.8px;margin-bottom:11px}
pre{background:#f6f8fa;border-radius:5px;padding:8px 10px;font-size:11px;margin:6px 0;overflow-x:auto}
@media print{.sheet{padding:0}}</style>"""

html = (u"<title>HCC Floor Plan — Rev S</title>\n" + style +
 u'\n<section class="sheet"><div class="mast">'
 u'<div class="rev">Rev S &middot; 22 Sep 2026 10:55 AM<br>west half SOLVED on measurements</div>'
 u'<h1>Floor Plan &mdash; Rev S<span class="badge">WEST SOLVED</span></h1>'
 u'<div class="sub"><b>The west half is done and it verifies itself.</b> Your &ldquo;shower behind the '
 u'washing machine&rdquo; was the key &mdash; it squares the whole master suite and the column closes '
 u'to <b>two inches</b> against the measured west wall.</div>'
 u'</div><div class="layout"><div>' + svg + u'</div><div>'
 u'<div class="note"><b>&#10003; THE WEST COLUMN CLOSES TO 2 INCHES.</b> Stack what you described and '
 u'it lands on the measured wall by itself &mdash; I did not force it:'
 u'<pre>master bed                        11.0\nmaster bath, wall &rarr; end of shower  8.0\n'
 u'laundry alcove                     3.0\nkitchen / dining                  13.0\n'
 u'                                  ----\nTOTAL                             35.0\n'
 u'MEASURED west side                34.83   &larr; 2 in apart</pre>'
 u'<b>That is an independent check, not an assumption.</b> Four numbers you measured separately, '
 u'stacked in the order you described, hitting a fifth number you measured separately.</div>'
 u'<div class="note"><b>&#128273; And the widths lock too.</b> The shower run is <b>8 ft</b>; the '
 u'laundry is <b>7&#8242;11&#8243;</b> &mdash; <b>one inch apart</b>, which is what &ldquo;right behind '
 u'the washing machine&rdquo; has to mean. Closets take the remaining <b>7 ft of the 15</b>, '
 u'<b>one on each end of the shower</b> as you said, with the <b>linen</b> closet beside the laundry '
 u'and a <b>coat closet in the foyer</b>.</div>'
 u'<div class="warn"><b>&#9888; The east half is the whole remaining job</b>, and it is hatched on the '
 u'plan rather than guessed. Four things go in there — <b>living room 14&#215;17, office 10&#215;13, '
 u'guest bath ~10&#215;8&#189;, and the hallway</b> — and they do not fit the way I had them:'
 u'<pre>guest bed 10 + office 13 + bath 8&#189; = 31&#8242;6&#8243;\neast side measures              29&#8242;3&#8243;\n'
 u'                                ------\nover by                          2&#8242;3&#8243;</pre>'
 u'<b>So all three cannot sit against the east wall.</b> One of them opens off the hallway instead. '
 u'<b>Which one?</b></div>'
 u'<div class="note"><b>No more tape needed.</b> Just walk the east half and tell me the order &mdash; '
 u'what you pass coming out of the hallway. Then the device key and the reworked duct drawing both '
 u'fall straight out of this.</div>'
 u'</div></div></section>')
io.open("HCC_Floorplan_REV_S.html", "w", encoding="utf-8").write(html)
print("Rev S built")
