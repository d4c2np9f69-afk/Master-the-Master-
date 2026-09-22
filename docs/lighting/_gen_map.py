# -*- coding: utf-8 -*-
# HCC MAP - Rev G arrangement (Jeff: "revision G is the closest"),
# redrawn with LASER-MEASURED room sizes inside the MEASURED shell,
# and the 67 device numbers placed from the record.
import io
PF = 16.0
def X(f): return round((f + 3) * PF, 1)
def Y(f): return round((f + 5) * PF, 1)
M, F, H, D = "#0b6b3a", "#c05621", "#c0392b", "#1a4f7a"

HX, HW, ED, KJ, SB, PD, PW = 14.83, 39.42, 29.25, 5.58, 4.5, 3.67, 5.5
G = HX
OUT = [(0,SB),(HX,SB),(HX,0),(HX+19.67,0),(HX+19.67,PD),(HX+19.67+PW,PD),
       (HX+19.67+PW,0),(HX+HW,0),(HX+HW,ED),(HX+7.7,ED),(HX+7.7,ED+KJ),(0,ED+KJ)]
poly = " ".join("%s,%s"%(X(x),Y(y)) for x,y in OUT)

def rm(x,y,w,h,st=M,sw=2.2,dash=False):
    d=' stroke-dasharray="6 4"' if dash else ''
    return '<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="%s"%s/>'%(
        X(x),Y(y),round(w*PF,1),round(h*PF,1),st,sw,d)

# ---- TILED like Rev G: every room shares walls, no gaps, no floating boxes.
#      Column lines: 0 | 15 | 23 | 33 | 39.42     Row lines: 0 | 11 | 15 | 19 | 22 | 29.25 | 34.83
# ---- REV G MARKUP, exactly (Jeff 12:16 "use this one"), on the measured shell.
#  Row 1: MASTER BED | FOYER | GUEST BED | GUEST BATH
#  Row 2: MASTER BATH (+WC, closets) | HALLWAY open to the living room | GREEN VESTIBULE
#  Row 3: LAUNDRY / pantry | LIVING ROOM (fireplace on its EAST wall) | 3ft strip | OFFICE = east column
#  Row 4: KITCHEN + DINING (table by the half-wall)
ROOMS = "".join([
 rm(0.8,SB+.8,13,24,"#8a5000",2.6),
 rm(G,0,15,11), rm(G+15,0,8,11), rm(G+23,0,10,11), rm(G+33,0,6.42,11),
 rm(G,11,15,8), rm(G,11,3,8,M,1.4), rm(G+3,11,8,8,M,1.4),
 rm(G,19,15,3), rm(G+3.5,19,7.917,3,M,1.4),
 rm(G,22,16,12.83),
 rm(G+15,11,14.42,4,M,1.2),
 rm(G+29.42,11,4.08,4),
 rm(G+33.5,11,5.92,4,M,1.4),
 rm(G+15,15,14.42,14.25),
 rm(G+29.42,15,10,14.25),
 rm(G+29.42,17,1.5,5,M,1.6),
])
# hall is OPEN to the living room: erase that wall, dash it
OPEN=('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.4" stroke-dasharray="5 4"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>')%(
      X(G+15.2),Y(15),X(G+29.2),Y(15), X(G+15),Y(15),X(G+29.42),Y(15),M,
      X(G+15),Y(11.2),X(G+15),Y(14.8))
# half wall between dining and living room
HALF=('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3" stroke-dasharray="3 3"/>')%(
      X(G+15.9),Y(22.3),X(G+15.9),Y(29.0), X(G+16),Y(22),X(G+16),Y(29.25),M)
# the three doors on the vestibule + master bed door at its SE corner
DOORS=('<path d="M %s %s A %s %s 0 0 0 %s %s" fill="none" stroke="%s" stroke-width="1.6"/>'
       '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="%s" stroke-width="1.6"/>'
       '<path d="M %s %s A %s %s 0 0 0 %s %s" fill="none" stroke="%s" stroke-width="1.6"/>'
       '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="%s" stroke-width="1.6"/>')%(
       X(G+30),Y(11),2.5*PF,2.5*PF,X(G+32.5),Y(11),H,
       X(G+30),Y(15),2.5*PF,2.5*PF,X(G+32.5),Y(15),H,
       X(G+33.5),Y(11),2.5*PF,2.5*PF,X(G+33.5),Y(13.5),H,
       X(G+15),Y(8.5),2.5*PF,2.5*PF,X(G+15),Y(11),H)
ROOMS += OPEN + HALF + DOORS

def lab(x,y,t,sz=9.4,c="#111"):
    return '<text x="%s" y="%s" font-size="%s" font-weight="700" text-anchor="middle" fill="%s">%s</text>'%(
        X(x),Y(y),sz,c,t)
LABELS = (lab(7.3,17,"GARAGE",11,"#8a5000")
 + lab(G+7.5,4.0,"MASTER BED",9.8) + lab(G+7.5,5.3,"15 x 11",6.6,"#6b7480")
 + lab(G+19,4.4,"FOYER",9.2) + lab(G+19,5.7,"8 x 6",6.6,"#6b7480")
 + lab(G+28,4.4,"GUEST BED",9.4) + lab(G+28,5.7,"11 x 10",6.6,"#6b7480")
 + lab(G+36.2,3.6,"GUEST",8.6) + lab(G+36.2,4.8,"BATH",8.6) + lab(G+36.2,6.4,"tub N, sink E",5.8,"#6b7480")
 + lab(G+7.0,13.2,"MASTER BATH",9.0) + lab(G+7.0,14.4,"8 ft to shower end",6.4,"#6b7480")
 + lab(G+1.5,15.0,"WC",6.6) + lab(G+13.0,15.0,"clo",6.4)
 + lab(G+7.5,21.0,"LAUNDRY",8.4) + lab(G+13.2,21.0,"pantry",6.0) + lab(G+1.75,21.0,"clo",6.0)
 + lab(G+8,29.0,"KITCHEN / DINING",9.8) + lab(G+8,30.3,"16 x 13",6.6,"#6b7480") + lab(G+13.5,24.0,"table",6.0,"#6b7480")
 + lab(G+16.6,25.6,"half wall",5.4,"#6b7480")
 + lab(G+22,12.4,"HALLWAY",9.0) + lab(G+22,13.7,"open to living room",6.2,"#6b7480")
 + lab(G+31.46,12.4,"vest",5.8,"#6b7480") + lab(G+36.46,13.4,"clo",6.0)
 + lab(G+22,22.6,"LIVING ROOM",10.2) + lab(G+22,24.0,"14 x 17",6.8,"#6b7480")
 + lab(G+30.17,19.2,"F",6.0) + lab(G+30.17,20.3,"P",6.0)
 + lab(G+35.5,21.4,"OFFICE",9.4) + lab(G+35.5,22.6,"BED 3",9.4) + lab(G+35.5,23.9,"10 x 13",6.6,"#6b7480")
 + lab(G+35.5,28.4,"window S",5.8,"#6b7480"))

def dot(x,y,n,c=D):
    return ('<circle cx="%s" cy="%s" r="7.6" fill="#fff" stroke="%s" stroke-width="1.7"/>'
            '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="%s">%s</text>')%(
        X(x),Y(y),c,X(x),Y(y)+2.7,c,n)

P=[]
for x,y,n in [(G+1.6,7.2,1),(G+1.6,8.6,2),(G+1.6,10.0,3),(G+3.2,8.6,4),(G+3.2,10.0,5),
  (G+3.2,7.2,8),(G+5.0,2.4,21),(G+9.0,2.4,22),(G+7.5,5.4,16),(G+13.6,4.0,52),
  (G+13.6,5.6,51),(G+13.6,7.2,55)]: P.append(dot(x,y,n))
P.append(dot(G+34.5,17.6,6))
for x,y,n in [(3.2,8.4,7),(5.6,8.4,9),(7.6,13.5,20),(10.2,13.5,23),(3.2,10.6,15),
  (5.6,10.6,34),(1.7,20.0,27),(7.0,7.4,28),(9.4,7.4,41),(1.7,22.6,63),(11.2,8.4,53)]:
    P.append(dot(x,y,n))
for x,y,n in [(G+8,23.4,17),(G+2.4,33.4,32),(G+5.4,33.4,33),(G+8.4,33.4,59),
  (G+11.4,33.4,60),(G+14.2,33.4,61),(G+2.4,30.4,24)]: P.append(dot(x,y,n))
for x,y,n in [(G+22,19.6,18),(G+25,12.6,38),(G+27.3,12.6,39),(G+28.0,18.0,49),
  (G+28.0,20.0,50),(G+16.8,23.6,54),(G+28.0,22.0,56),(G+22.0,28.2,26),
  (G+17.6,27.8,62),(G+24.0,20.2,35),(G+26.0,20.2,36)]: P.append(dot(x,y,n))
for x,y,n in [(G+7.5,15.0,19),(G+5.4,20.4,57),(G+9.6,20.4,58),(G+36.2,8.6,31)]: P.append(dot(x,y,n))
for x,y,n in [(G+19,4.8,25),(G+19,-1.4,10)]: P.append(dot(x,y,n))
for x,y,n in [(-1.8,2.4,11),(G+41.6,1.4,12),(G+34,31.8,13),(G+20,32.8,14),(G+44,-2.4,29),
  (G+42.6,14.0,37),(G+41.6,18.8,42),(G+45.6,21,43),(G+45.6,22.6,44),(G+45.6,24.2,45),
  (G+45.6,25.8,46),(G+45.6,27.4,47),(G+45.6,29.0,48),(-1.8,24,64),(-1.8,26.2,65),
  (-1.8,28.4,66),(G+41.6,4.2,67),(G+13.0,10.2,30)]: P.append(dot(x,y,n,H))
DOTS="".join(P)

def dim(x1,y1,x2,y2,t,c=M,off=-5,hz=True):
    o='<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.8"/>'%(X(x1),Y(y1),X(x2),Y(y2),c)
    for (ax,ay),d in (((x1,y1),1),((x2,y2),-1)):
        o+=('<path d="M %s %s l %s -4 l 0 8 Z" fill="%s"/>' if hz else '<path d="M %s %s l -4 %s l 8 0 Z" fill="%s"/>')%(X(ax),Y(ay),d*7,c)
    mx,my=(x1+x2)/2.0,(y1+y2)/2.0
    r='' if hz else ' transform="rotate(-90 %s %s)"'%(X(mx),Y(my))
    o+='<text x="%s" y="%s" font-size="8.4" font-weight="700" text-anchor="middle" fill="%s"%s>%s</text>'%(X(mx),Y(my)+off,c,r,t)
    return o
DIMS=(dim(G,-3.6,G+HW,-3.6,"39&#8242;5&#8243;")+dim(0,-3.6,G,-3.6,"14&#8242;10&#8243;")
 +dim(G+HW+3.0,0,G+HW+3.0,ED,"29&#8242;3&#8243;",M,-5,False)
 +dim(-3.2,SB,-3.2,ED+KJ,"34&#8242;10&#8243;",M,-5,False))
NOTES=('<text x="%s" y="%s" font-size="8" font-weight="700" fill="%s">&#9650; KITCHEN BUMPS OUT 5&#8242;7&#8243;</text>'
 '<text x="%s" y="%s" font-size="8" font-weight="700" fill="%s">&#9660; GARAGE DOOR IN WEST WALL, 8&#8242; BACK</text>'
 '<text x="%s" y="%s" font-size="7.6" font-weight="700" fill="%s">PORCH 5&#8242;6&#8243; &#215; 3&#8242;8&#8243; RECESS</text>')%(
 X(1),Y(ED+KJ+2.4),H, X(1),Y(SB-2.4),H, X(G+21),Y(-1.4),H)

svg=('<svg viewBox="0 0 %d %d"><polygon points="%s" fill="#fbfcfd" stroke="#e8613c" stroke-width="4"/>'
 '%s%s%s%s%s<g transform="translate(%s,%s)"><path d="M0,-17 L5,8 L0,2.5 L-5,8 Z" fill="#111"/>'
 '<text x="0" y="21" font-size="10" font-weight="700" text-anchor="middle">N</text></g>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.2"/>'
 '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle">10 FEET</text></svg>')%(
 round(66*PF),round(46*PF),poly,ROOMS,LABELS,DOTS,DIMS,NOTES,X(58),Y(0),
 X(0),Y(40),X(10),Y(40),X(5),Y(41.6))
io.open("map_svg.txt","w",encoding="utf-8").write(svg)
print("map svg built")
