# -*- coding: utf-8 -*-
# HCC FLOOR PLAN - FINAL. Measured shell + rooms + numbered device key.
# GREEN = laser-measured.  ORANGE = fitted by me.
import io
PF = 15.5
def X(f): return round((f + 7) * PF, 1)
def Y(f): return round((f + 6) * PF, 1)
M, F, H = "#0b6b3a", "#c05621", "#c0392b"

HX, HW, ED, KJ, SB, PD, PW = 14.83, 39.42, 29.25, 5.58, 4.5, 3.67, 5.5
OUT = [(0,SB),(HX,SB),(HX,0),(HX+19.67,0),(HX+19.67,PD),(HX+19.67+PW,PD),
       (HX+19.67+PW,0),(HX+HW,0),(HX+HW,ED),(HX+7.7,ED),(HX+7.7,ED+KJ),(0,ED+KJ)]
poly = " ".join("%s,%s"%(X(x),Y(y)) for x,y in OUT)

def rm(x,y,w,h,n,s="",fill="#fff",st=M,sw=2.2,dash=False,fs=9.0):
    d=' stroke-dasharray="6 4"' if dash else ''
    o='<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'%(
        X(x),Y(y),round(w*PF,1),round(h*PF,1),fill,st,sw,d)
    cx,cy=X(x+w/2.0),Y(y+h/2.0)
    o+='<text x="%s" y="%s" font-size="%s" font-weight="700" text-anchor="middle">%s</text>'%(cx,cy-3,fs,n)
    if s: o+='<text x="%s" y="%s" font-size="7" text-anchor="middle" fill="#6b7480">%s</text>'%(cx,cy+7,s)
    return o

G=HX
ROOMS=[
 rm(0.8,SB+.8,13,24,"GARAGE","24&#215;13","#ffffff","#8a5000",2.6,False,10),
 rm(G,0,15,11,"MASTER BED","","#ffffff",M,2.6,False,9.6),
 rm(G,11,3.5,8,"clo","","#ffffff",M,1.6,False,7),
 rm(G+3.5,11,8,8,"MASTER BATH","","#ffffff",M,2.6,False,8.8),
 rm(G+11.5,11,3.5,8,"clo","","#ffffff",M,1.6,False,7),
 rm(G,19,3.5,3,"clo","","#ffffff",M,1.6,False,7),
 rm(G+3.5,19,7.917,3,"LAUNDRY","","#ffffff",M,2.4,False,8),
 rm(G+11.42,19,3.58,3,"linen","","#ffffff",M,1.6,False,7),
 rm(G,22,16,13,"KITCHEN / DINING","","#ffffff",M,2.6,False,9.6),
 rm(G-3,5,3,3,"WC","","#ffffff",M,2.6,False,7.6),
 rm(G+15.4,0,8,6,"FOYER","","#ffffff",M,2.6,False,8.8),
 rm(G+28.4,0,11,10,"GUEST BED","","#ffffff",M,2.6,False,9.6),
 rm(G+18.4,6.6,10,8.5,"GUEST BATH","","#ffffff",F,2.4,True,8.4),
 rm(G+15.4,15.4,14,17,"LIVING ROOM","","#ffffff",M,2.6,False,9.6),
 rm(G+29.4,16.2,10,13,"OFFICE / BED 3","","#ffffff",M,2.6,False,9.0),
]
HALL=('<rect x="%s" y="%s" width="%s" height="%s" fill="#ffffff" stroke="%s" stroke-width="2.2" stroke-dasharray="6 4"/>'
 '<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle">HALLWAY</text>'
 '<text x="%s" y="%s" font-size="6.8" text-anchor="middle" fill="#6b7480">18&#215;4</text>')%(
 X(G+15.4),Y(11.2),round(18*PF,1),round(4*PF,1),F,X(G+24.4),Y(12.9),X(G+24.4),Y(14.1))

def dim(x1,y1,x2,y2,t,c=M,off=-4,hz=True):
    o='<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.8"/>'%(X(x1),Y(y1),X(x2),Y(y2),c)
    for (ax,ay),d in (((x1,y1),1),((x2,y2),-1)):
        o+=('<path d="M %s %s l %s -4 l 0 8 Z" fill="%s"/>' if hz else '<path d="M %s %s l -4 %s l 8 0 Z" fill="%s"/>')%(X(ax),Y(ay),d*7,c)
    mx,my=(x1+x2)/2.0,(y1+y2)/2.0
    r='' if hz else ' transform="rotate(-90 %s %s)"'%(X(mx),Y(my))
    o+='<text x="%s" y="%s" font-size="8.2" font-weight="700" text-anchor="middle" fill="%s"%s>%s</text>'%(X(mx),Y(my)+off,c,r,t)
    return o

D=(dim(G,-2.6,G+HW,-2.6,"39&#8242;5&#8243;")+dim(0,-2.6,G,-2.6,"14&#8242;10&#8243;")
   +dim(G+HW+2.3,0,G+HW+2.3,ED,"29&#8242;3&#8243;",M,-4,False)
   +dim(-5.2,SB,-5.2,ED+KJ,"west 34&#8242;10&#8243;",M,-4,False)
   +dim(G-3.6,0,G-3.6,5,"5&#8242;",M,-4,False)+dim(G-3.6,5,G-3.6,8,"3&#8242;",M,-4,False))
N=('<text x="%s" y="%s" font-size="8.2" font-weight="700" fill="%s">&#9650; KITCHEN BUMPS OUT 5&#8242;7&#8243;</text>'
 '<text x="%s" y="%s" font-size="8.2" font-weight="700" fill="%s">&#9660; GARAGE DOOR IN WEST WALL, 8&#8242; BACK</text>'
 '<text x="%s" y="%s" font-size="7.8" font-weight="700" fill="%s">PORCH 5&#8242;6&#8243;&#215;3&#8242;8&#8243; RECESS</text>')%(
 X(1),Y(ED+KJ+2.0),H,X(1),Y(SB-1.5),H,X(G+21),Y(-0.9),H)

svg=('<svg viewBox="0 0 %d %d"><polygon points="%s" fill="#fcfdfe" stroke="#e8613c" stroke-width="4"/>'
 '%s%s%s%s<g transform="translate(%s,%s)"><path d="M0,-17 L5,8 L0,2.5 L-5,8 Z" fill="#111"/>'
 '<text x="0" y="21" font-size="10" font-weight="700" text-anchor="middle">N</text></g>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.2"/>'
 '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle">10 FEET</text></svg>')%(
 round(76*PF),round(50*PF),poly,"".join(ROOMS),HALL,D,N,X(60),Y(1),
 X(0),Y(42),X(10),Y(42),X(5),Y(43.6))

GROUPS=[("NETWORK &amp; POWER",["AT&amp;T gateway","The Beast (301Server)","J45 Beehive","Network switch",
 "APC BN600 UPS","TP-Link RE200","Garage PC","Zigbee coordinator + antenna","Bluetooth dongle"]),
 ("CAMERAS",["Front Doorbell","Driveway","Front Right","Back Left","Backyard","Garage (mains Mini)"]),
 ("LIGHTING",["Bedroom cans HS220","Kitchen/Dining cans HS220","Living room cans HS220",
 "Master bath cans HS210","Garage light YM2108T"]),
 ("PLUGS &amp; LAMPS",["Jeff&rsquo;s bed lamp","Angela&rsquo;s bed lamp","Garage fan plug","Hot water pump"]),
 ("CONTACTS <span class='m'>SNZB-04</span>",["Front door","Back deck door","Garage man door",
 "Garage door down","Mailbox","Spare contact 1"]),
 ("LEAK <span class='m'>ZG-222Z</span>",["Guest bath","Kitchen sink","Kitchen refrigerator"]),
 ("ZIGBEE <span class='m'>TS0501B</span>",["Garage repeater","Floating repeater","301 Alarm siren"]),
 ("HVAC",["A/C package unit","Return grille 20&#215;25","Thermostat (ecobee, planned)",
 "A/C relay SONOFF MINI-D","Garage opener SONOFF MINI-D"]),
 ("IRRIGATION",["B-hyve timer","Z1 Front right","Z2 Front left","Z3 Back left","Z4 Back right",
 "Z5 Right side drive","Garden zone"]),
 ("MEDIA &amp; VOICE",["Living room TV","Fire TV Stick 4K Max","Apple TV","Master bedroom TV",
 "Garage TV","Living Room Echo Dot","Master Bedroom Echo","Vizio sound bar"]),
 ("APPLIANCES",["Washer","Dryer","Stove / range","Refrigerator","Dishwasher"]),
 ("OTHER",["Sharky dock","Electrical panel","Water meter","Gas meter","Electric meter","Weather station"])]
n=0; cols=[]; col=[]
for t,items in GROUPS:
    b=['<div class="g">%s</div>'%t]
    for it in items:
        n+=1; b.append('<div class="i"><span class="n">%d</span>%s</div>'%(n,it))
    col.append("".join(b))
    if len(col)==4: cols.append("".join(col)); col=[]
if col: cols.append("".join(col))
lst="".join('<div>%s</div>'%c for c in cols)

style=u"""<style>*{box-sizing:border-box}body{margin:0;font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff}
.sheet{padding:14px 18px;max-width:1560px;margin:0 auto}.mast{border-bottom:3px solid #111;padding-bottom:7px;margin-bottom:10px;position:relative}
h1{font-size:23px;margin:0 0 3px;letter-spacing:-.4px}.rev{position:absolute;right:0;top:2px;text-align:right;font-size:9.6px;color:#6b7480;text-transform:uppercase;letter-spacing:.5px;line-height:1.5}
.sub{font-size:11.6px;color:#39424b;max-width:960px}.badge{display:inline-block;background:#0b6b3a;color:#fff;font-size:9.6px;font-weight:700;padding:3px 9px;border-radius:11px;margin-left:8px;vertical-align:3px}
.layout{display:grid;grid-template-columns:1fr;gap:0;align-items:start}svg{height:5.85in;width:auto;max-width:100%;display:block;margin:0 auto}
.lists{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}.page2{page-break-before:always;padding-top:6px}.i{font-size:10px;padding:2.4px 0 2.4px 20px}.n{font-size:11px;width:18px}.g{font-size:8.8px;padding:2.4px 5px;margin:7px 0 4px}
.g{font-size:8.4px;font-weight:700;letter-spacing:.4px;color:#fff;background:#39424b;padding:2.4px 5px;border-radius:3px;margin:7px 0 4px}
.lists>div>.g:first-child{margin-top:0}.m{font-weight:400;opacity:.7}
.i{font-size:9.8px;padding:1.9px 0 1.9px 20px;position:relative;border-bottom:1px dotted #dde3e8;line-height:1.3}
.n{position:absolute;left:0;top:1.9px;width:16px;text-align:right;font-weight:700;color:#c05621;font-size:9.6px}
.note{background:#eaf6ef;border-left:4px solid #0b6b3a;padding:8px 10px;border-radius:0 5px 5px 0;font-size:10.8px;margin-top:9px}
.warn{background:#fdf1ec;border-left:4px solid #c05621;padding:8px 10px;border-radius:0 5px 5px 0;font-size:10.8px;margin-top:9px}
@media print{.sheet{padding:0}}</style>"""

html=(u"<title>HCC Floor Plan — MARK-UP COPY</title>\n"+style+
 u'\n<section class="sheet"><div class="mast">'
 u'<div class="rev">MARK-UP &middot; 22 Sep 2026 11:39 AM<br>measured shell &middot; 15.5 px per foot</div>'
 u'<h1>Device Mark-Up Copy<span class="badge">WRITE ON ME</span></h1>'
 u'<div class="sub"><b>Green = laser-measured. Orange = fitted by me.</b> Outline from your perimeter '
 u'walk &mdash; closes both directions to within inches. <b>The west half is closed and self-verifying.</b></div>'
 u'</div><div class="layout"><div>'+svg+
 u'<div class="note"><b>&#10003; THE WEST HALF IS DONE.</b> Two independent checks, neither forced:<br>'
 u'<b>Depth:</b> bed 11 + bath 8 + laundry 3 + kitchen 13 = <b>35.0</b> vs measured <b>34.83</b> '
 u'&mdash; <b>two inches.</b><br>'
 u'<b>Width:</b> shower run <b>8&#8242;</b>, laundry <b>7&#8242;11&#8243;</b> &mdash; <b>one inch</b>, '
 u'which is what &ldquo;right behind the washing machine&rdquo; has to mean.<br>'
 u'<b>West wall:</b> 5&#8242; master bedroom &rarr; jog at the downspout &rarr; 3&#8242; toilet closet '
 u'&rarr; garage door. Your 8&#8242;, confirmed at the corner.</div>'
 u'</div></div>'u'<div class="page2"><div class="mast" style="margin-bottom:8px">'u'<h1>Device Key<span class="badge">67 ITEMS</span></h1>'u'<div class="sub">Write these numbers onto the map on the previous page. 'u'Cross out anything you cannot place; add anything missing at the bottom and I will number it.</div>'u'</div><div class="lists">'+lst+u'</div>'
 u'<div class="warn"><b>&#9888; Still fitted, not measured &mdash; mark these and I will correct:</b><br>'
 u'<b>GUEST BATH off the hallway.</b> Guest bed 10 + office 13 + bath 8&#189; = 31&#8242;6&#8243; against '
 u'a 29&#8242;3&#8243; east wall, so one of the three <b>cannot</b> be on that wall. I took the bath off '
 u'it because you said the hall <i>ends</i> at the guest bathroom. <b>The HALLWAY position</b> follows '
 u'from that.</div>'
 u'<div class="note"><b>&#10145; Write each number where that device actually is</b>, send it back, and the '
 u'ductwork drawing gets reworked with the runs <b>scaled off this plan</b> instead of estimated.</div>'
 u'</div></section>')
io.open("HCC_Floorplan_MARKUP.html","w",encoding="utf-8").write(html)
print("MARKUP built - %d numbered items"%n)
