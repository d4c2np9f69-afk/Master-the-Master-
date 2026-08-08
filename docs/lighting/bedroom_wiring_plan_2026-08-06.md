# Bedroom — Final Wiring Plan (Reversed Feed + Switched Outlets)

Door = origin. Kasa HS220 drives lights. Middle + bedside toggles now switch their own local receptacle.

## DOOR BOX — origination

**Kasa HS220 (lights)**
- Line hot in / neutral in
- Load out → 9 bedroom LEDs
- Single-pole, replaces old switch
- No S1/S2, no separate module

**Splices in this box**
- line hot + chain BLACK (feeds middle/bedside)
- neutrals: incoming + chain WHITE + LED neutral

**9 BEDROOM LEDs** — off Kasa load · 108W total

- BLACK — constant hot (feeds middle + bedside switch legs)
- WHITE — neutral, runs full length

## MIDDLE BOX

- old 4-way removed
- **Existing toggle — repurposed**
  - Black IN from door (constant hot)
  - Switch OUTPUT → this box's receptacle hot only
  - No WiFi — dumb mechanical switch
- **Receptacle** — switched, dies when toggle off
- White + ground pass through unswitched
- Black continues on to bedside, unaffected

## BEDSIDE BOX — end of run

- old dimmer removed
- **Existing toggle — repurposed**
  - Black IN from middle (constant hot)
  - Switch OUTPUT → this box's receptacle hot only
  - No WiFi — dumb mechanical switch
- **Receptacle** — switched, dies when toggle off
- 15A receptacle swap happens here
- Old receptacle-feed tap fully removed

## Legend

- BLACK = constant hot, feeds both switches in series down the chain
- WHITE = neutral, unswitched, runs full length
- Load to LEDs (from Kasa only — not part of the outlet circuit)
- Middle + bedside switches are 100% independent of lighting — each controls only its own box's receptacle, nothing else.
- Grounds bond throughout, never used as circuit conductors.

## Order

Kasa HS220P3 (3-pack: bedroom + kitchen/dining + living room) + Kasa HS200 (garage)

## Before starting

- Breaker off · verify dead at all three boxes before starting · old bedside receptacle tap removed entirely
- Verify RED/repurposed conductor reaches the fixture junction before final connection
