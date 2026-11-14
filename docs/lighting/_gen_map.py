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
       (HX+19.67+PW,0),(HX+HW-4.25,0),(HX+HW-4.25,3.5),(HX+HW,3.5),(HX+HW,ED),(HX+7.7,ED),(HX+7.7,ED+KJ),(0,ED+KJ)]
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
 rm(G,0,19.67,11),
 rm(G+19.67,3.67,5.5,7.33),
 rm(G+25.17,0,10,11),
 rm(G+35.17,3.5,4.25,7.5),
 rm(G,11,15,8), rm(G,11,3,3,M,1.4), rm(G,14,3,5,M,1.4), rm(G+3,11,8,8,M,1.4),
 rm(G,19,15,3), rm(G,19,3.5,3,M,1.4), rm(G+3.5,19,3.5,3,M,1.4), rm(G+7,19,4.42,3,M,1.4),
 rm(G,22,16,12.83),
 rm(G+15,11,14.42,4,M,1.2),
 rm(G+29.42,11,5.75,4), rm(G+29.42,13.5,1.6,1.5,M,1.2), rm(G+35.17,11,4.25,4,M,1.4),
 rm(G+15,15,14.42,14.25),
 rm(G+29.42,15,10,14.25),
 rm(G+29.42,16,1.5,5,M,1.6), rm(G+29.42,22,1.5,7.25,M,1.6),
])
OPEN=('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.4" stroke-dasharray="5 4"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>')%(
      X(G+15.2),Y(15),X(G+29.2),Y(15), X(G+15),Y(15),X(G+29.42),Y(15),M,
      X(G+17.7),Y(11.2),X(G+29.2),Y(11.2),
      X(G+29.42),Y(11.2),X(G+29.42),Y(13.3))
HALF=('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="5"/>'
      '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3" stroke-dasharray="3 3"/>')%(
      X(G+15.9),Y(22.3),X(G+15.9),Y(29.0), X(G+16),Y(22),X(G+16),Y(29.25),M)
def door(x1,y1,x2,y2,sweep):
    return '<path d="M %s %s A %s %s 0 0 %d %s %s" fill="none" stroke="%s" stroke-width="1.6"/>'%(
        X(x1),Y(y1),2.4*PF,2.4*PF,sweep,X(x2),Y(y2),H)
DOORS=(door(G+33,11,G+35.17,11,0)+door(G+31.2,15,G+33.4,15,1)+door(G+35.17,11,G+37.4,11,1)
      +door(G+35.17,13,G+35.17,15,0)+door(G+19.67,8.6,G+19.67,11,1)+door(G,22,G,24.4,0)
      +door(G+19,29.25,G+21.4,29.25,0))
PORCH=('<rect x="%s" y="%s" width="%s" height="%s" fill="#f3efe6" stroke="#8a5000" stroke-width="2.2"/>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="6"/>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="3.2"/>'
 '<path d="M %s %s A %s %s 0 0 1 %s %s" fill="none" stroke="%s" stroke-width="1.6"/>'
 '<text x="%s" y="%s" font-size="7.4" font-weight="700" text-anchor="middle" fill="#8a5000">PORCH</text>'
 '<text x="%s" y="%s" font-size="6.2" font-weight="700" text-anchor="middle" fill="%s">FRONT DOOR</text>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="1.6"/>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8a5000" stroke-width="1.6"/>'
 '<text x="%s" y="%s" font-size="5.8" text-anchor="middle" fill="#8a5000">steps up</text>')%(
 X(G+19.67),Y(0),round(5.5*PF,1),round(3.67*PF,1),
 X(G+19.9),Y(0),X(G+24.9),Y(0),
 X(G+19.67),Y(3.67),X(G+25.17),Y(3.67),H,
 X(G+20.3),Y(3.67),2.2*PF,2.2*PF,X(G+22.5),Y(3.67),H,
 X(G+22.42),Y(2.1), X(G+22.42),Y(5.0),H,
 X(G+20.2),Y(-1.0),X(G+24.6),Y(-1.0), X(G+20.2),Y(-1.9),X(G+24.6),Y(-1.9), X(G+22.42),Y(-2.6))
def win(x,y,hz=True,L=2.6):
    if hz: x1,y1,x2,y2=X(x-L/2),Y(y),X(x+L/2),Y(y)
    else:  x1,y1,x2,y2=X(x),Y(y-L/2),X(x),Y(y+L/2)
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#12507e" stroke-width="4"/>'
            '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#fff" stroke-width="1.4"/>')%(x1,y1,x2,y2,x1,y1,x2,y2)
WINS=(win(G+7,0)+win(G+33,0)+win(G+9,34.83)+win(G+24.5,29.25)+win(G+27.5,29.25)+win(G+34.5,29.25)+win(0,17.5,False))
ROOMS += OPEN + HALF + DOORS + PORCH + WINS

def lab(x,y,t,sz=9.4,c="#111",rot=0):
    r=' transform="rotate(%d %s %s)"'%(rot,X(x),Y(y)) if rot else ''
    return '<text x="%s" y="%s" font-size="%s" font-weight="700" text-anchor="middle" fill="%s"%s>%s</text>'%(
        X(x),Y(y),sz,c,r,t)
LABELS = (lab(7.3,17,"GARAGE",11,"#8a5000") + lab(-1.2,17.5,"man door",5.4,"#8a5000",-90)
 + lab(G+9.8,4.0,"MASTER BED",9.8) + lab(G+9.8,5.3,"15 x 11",6.6,"#6b7480") + lab(G+7,-0.9,"window",5.4,"#12507e")
 + lab(G+22.42,7.0,"FOYER",8.6) + lab(G+22.42,8.2,"8 x 6",6.2,"#6b7480")
 + lab(G+30.17,4.6,"GUEST BED",9.4) + lab(G+30.17,5.9,"11 x 10",6.6,"#6b7480") + lab(G+33,-0.9,"window",5.4,"#12507e")
 + lab(G+37.3,5.2,"GUEST",7.2) + lab(G+37.3,6.3,"BATH",7.2) + lab(G+37.3,7.6,"tub",5.6,"#6b7480") + lab(G+38.9,9.2,"sink",5.0,"#6b7480",-90)
 + lab(G+7.0,13.0,"MASTER BATH",8.8) + lab(G+7.0,12.0,"sinks",5.6,"#6b7480") + lab(G+7.0,17.6,"tub",6.0,"#6b7480")
 + lab(G+1.5,12.7,"WC",6.2) + lab(G+1.5,16.6,"clo",5.6) + lab(G+13.0,15.0,"clo",6.4)
 + lab(G+1.75,20.7,"DRYER",5.6) + lab(G+5.25,20.7,"PANTRY",5.4) + lab(G+9.2,20.7,"WASHER",5.6)
 + lab(G+8,29.0,"KITCHEN / DINING",9.8) + lab(G+8,30.3,"16 x 13",6.6,"#6b7480")
 + lab(G+13.6,23.4,"dining",5.6,"#6b7480") + lab(G+13.6,24.4,"table",5.6,"#6b7480")
 + lab(G+9,35.7,"window",5.4,"#12507e") + lab(G-0.9,23.2,"garage",4.8,"#8a5000",-90)
 + lab(G+16.6,25.6,"half wall",5.4,"#6b7480")
 + lab(G+23,12.4,"HALLWAY",9.0) + lab(G+23,13.7,"open to living room",6.2,"#6b7480")
 + lab(G+33,12.2,"vestibule",5.6,"#6b7480") + lab(G+30.2,14.3,"clo",4.6) + lab(G+37.3,13.2,"clo",6.0)
 + lab(G+22,22.6,"LIVING ROOM",10.2) + lab(G+22,24.0,"14 x 17",6.8,"#6b7480")
 + lab(G+30.17,18.0,"F",5.8) + lab(G+30.17,19.1,"P",5.8) + lab(G+30.17,25.6,"clo",4.8,"#111",-90)
 + lab(G+20.2,30.2,"deck door",5.4,"#6b7480") + lab(G+24.5,30.2,"window",5.4,"#12507e") + lab(G+27.5,31.1,"window",5.4,"#12507e")
 + lab(G+35.5,21.4,"OFFICE",9.4) + lab(G+35.5,22.6,"BED 3",9.4) + lab(G+35.5,23.9,"10 x 13",6.6,"#6b7480")
 + lab(G+34.5,30.2,"window",5.4,"#12507e"))

def dot(x,y,n,c=D):
    return ('<circle cx="%s" cy="%s" r="7.6" fill="#fff" stroke="%s" stroke-width="1.7"/>'
            '<text x="%s" y="%s" font-size="7.6" font-weight="700" text-anchor="middle" fill="%s">%s</text>')%(
        X(x),Y(y),c,X(x),Y(y)+2.7,c,n)

P=[]
for x,y,n in [(G+1.6,7.2,1),(G+1.6,8.6,2),(G+1.6,10.0,3),(G+3.2,8.6,4),(G+3.2,10.0,5),(G+3.2,7.2,8),
  (G+5.0,2.4,21),(G+9.6,2.4,22),(G+9.8,7.0,16),(G+17.6,4.0,52),(G+17.6,5.6,51),(G+17.6,7.2,55),(G+17.6,9.6,30)]:
    P.append(dot(x,y,n))
for x,y,n in [(3.2,8.4,7),(5.6,8.4,9),(7.6,13.5,20),(10.2,13.5,23),(3.2,10.6,15),(5.6,10.6,34),
  (1.7,20.0,27),(7.0,7.4,28),(9.4,7.4,41),(1.7,22.6,63),(11.2,8.4,53)]: P.append(dot(x,y,n))
for x,y,n in [(G+8,24.2,17),(G+2.4,33.4,32),(G+5.4,33.4,33),(G+8.4,33.4,59),(G+11.4,33.4,60),
  (G+14.2,33.4,61),(G+2.4,30.4,24),(G+1.75,21.6,58),(G+9.2,21.6,57)]: P.append(dot(x,y,n))
for x,y,n in [(G+22,19.6,18),(G+25,12.6,38),(G+27.3,12.6,39),(G+28.0,17.6,49),(G+28.0,19.6,50),
  (G+16.8,23.6,54),(G+28.0,21.6,56),(G+20.2,28.2,26),(G+17.6,27.8,62),(G+24.0,20.2,35),(G+26.0,20.2,36)]:
    P.append(dot(x,y,n))
for x,y,n in [(G+7.0,15.2,19),(G+37.3,9.4,31),(G+34.5,17.6,6),(G+22.4,4.6,25),(G+23.9,1.2,10)]: P.append(dot(x,y,n))
for x,y,n in [(-1.8,2.4,11),(G+41.6,0.6,12),(G+34,31.8,13),(G+20,32.8,14),(G+44,-2.4,29),
  (G+41.3,12.2,37),(G+41.3,24.0,42),(G+45.6,21,43),(G+45.6,22.6,44),(G+45.6,24.2,45),
  (G+45.6,25.8,46),(G+45.6,27.4,47),(G+45.6,29.0,48),(-1.8,24,64),(-1.8,26.2,65),
  (-1.8,28.4,66),(G+41.6,5.4,67)]: P.append(dot(x,y,n,H))
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
def obox(y, h, t1, t2, col):
    return ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2"/>'
            '<text x="%s" y="%s" font-size="6.6" font-weight="700" text-anchor="middle" fill="%s">%s</text>'
            '<text x="%s" y="%s" font-size="5.6" text-anchor="middle" fill="%s">%s</text>') % (
        X(G+HW+0.7), Y(y), round(2.6*PF,1), round(h*PF,1), col,
        X(G+HW+2.0), Y(y+h/2.0)-1, col, t1, X(G+HW+2.0), Y(y+h/2.0)+6, col, t2)
OUTSIDE = obox(11.5, 3.2, "A/C", "unit", "#6b3fa0") + obox(23.5, 2.4, "B-hyve", "", "#12507e") + obox(26.4, 2.4, "IRRIG", "ctrl", "#12507e")
NOTES=('<text x="%s" y="%s" font-size="8" font-weight="700" fill="%s">&#9650; KITCHEN BUMPS OUT 5&#8242;7&#8243;</text>'
 '<text x="%s" y="%s" font-size="8" font-weight="700" fill="%s">&#9660; GARAGE DOOR IN WEST WALL, 8&#8242; BACK</text>'
 '<text x="%s" y="%s" font-size="7.6" font-weight="700" fill="%s">PORCH 5&#8242;6&#8243; &#215; 3&#8242;8&#8243; RECESS</text>')%(
 X(1),Y(ED+KJ+2.4),H, X(1),Y(SB-2.4),H, X(G+21),Y(-1.4),H)

svg=('<svg viewBox="0 0 %d %d"><polygon points="%s" fill="#fbfcfd" stroke="#e8613c" stroke-width="4"/>'
 '%s%s%s%s%s<g transform="translate(%s,%s)"><path d="M0,-17 L5,8 L0,2.5 L-5,8 Z" fill="#111"/>'
 '<text x="0" y="21" font-size="10" font-weight="700" text-anchor="middle">N</text></g>'
 '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#111" stroke-width="2.2"/>'
 '<text x="%s" y="%s" font-size="9" font-weight="700" text-anchor="middle">10 FEET</text></svg>')%(
 round(66*PF),round(46*PF),poly,ROOMS,LABELS,DOTS,DIMS,NOTES+OUTSIDE,X(58),Y(0),
 X(0),Y(40),X(10),Y(40),X(5),Y(41.6))
io.open("map_svg.txt","w",encoding="utf-8").write(svg)
print("map svg built")
