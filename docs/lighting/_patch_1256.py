# -*- coding: utf-8 -*-
# Jeff 12:56: no coat closet in the foyer, no closet in the hallway,
# NE corner is a brick jog (notch in the outline), separate boxes for A/C, B-hyve, irrigation.
import io
s = io.open("_gen_map.py", encoding="utf-8").read()

# 1. coat closet out of the foyer
s = s.replace(" rm(G+19.67,9.0,1.9,2.0,M,1.3),\n", "")
s = s.replace(' + lab(G+20.6,10.1,"coat",5.0)', '')
# 2. closet out of the hallway
s = s.replace(" rm(G+15,11,14.42,4,M,1.2), rm(G+15,11,2.5,3,M,1.3),", " rm(G+15,11,14.42,4,M,1.2),")
s = s.replace(' + lab(G+16.25,12.6,"coat",5.0)', '')
# 3. NE corner is a brick jog: notch the OUTLINE, drop the dashed box
s = s.replace("(HX+19.67+PW,0),(HX+HW,0),(HX+HW,ED),",
              "(HX+19.67+PW,0),(HX+HW-4.25,0),(HX+HW-4.25,3.5),(HX+HW,3.5),(HX+HW,ED),")
s = s.replace(" rm(G+35.17,0,4.25,3.5,M,1.0,True),\n", "")
# 4. three separate boxes on the outside east wall
marker = "NOTES=("
i = s.index(marker)
s = s[:i] + '''def obox(y, h, t1, t2, col):
    return ('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2"/>'
            '<text x="%s" y="%s" font-size="6.6" font-weight="700" text-anchor="middle" fill="%s">%s</text>'
            '<text x="%s" y="%s" font-size="5.6" text-anchor="middle" fill="%s">%s</text>') % (
        X(G+HW+0.7), Y(y), round(2.6*PF,1), round(h*PF,1), col,
        X(G+HW+2.0), Y(y+h/2.0)-1, col, t1, X(G+HW+2.0), Y(y+h/2.0)+6, col, t2)
OUTSIDE = obox(11.5, 3.2, "A/C", "unit", "#6b3fa0") + obox(23.5, 2.4, "B-hyve", "", "#12507e") + obox(26.4, 2.4, "IRRIG", "ctrl", "#12507e")
''' + s[i:]
# strip the old A/C + B-hyve text callouts if present
s = s.replace('''NOTES=('<text x="%s" y="%s" font-size="7" font-weight="700" fill="#6b3fa0">A/C</text>\'\'<text x="%s" y="%s" font-size="6.4" font-weight="700" fill="#12507e">B-hyve / irrigation</text>')%(X(G+40.4),Y(11.6), X(G+40.4),Y(25.6))+(''', "NOTES=(")
s = s.replace("poly,ROOMS,LABELS,DOTS,DIMS,NOTES,", "poly,ROOMS,LABELS,DOTS,DIMS,NOTES+OUTSIDE,")
# dots 37 / 42 into their boxes; NE-corner outside dots clear the notch
s = s.replace("(G+41.6,13.0,37)", "(G+41.3,12.2,37)").replace("(G+41.6,27.0,42)", "(G+41.3,24.0,42)")
s = s.replace("(G+41.6,1.4,12)", "(G+41.6,0.6,12)").replace("(G+41.6,4.2,67)", "(G+41.6,5.4,67)")
io.open("_gen_map.py", "w", encoding="utf-8").write(s)
print("patched; NOTES+OUTSIDE wired:", "NOTES+OUTSIDE" in s)
