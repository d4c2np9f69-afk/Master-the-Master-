# RTSP camera purchase — front + back yard, decided 2026-08-22

🔴 **STATUS 2026-08-22 11:37 — DEFERRED. DO NOT BUY, DO NOT RE-PITCH.**
Jeff: *"I can't get those right now because they're expensive so we've got to make do with what
we've got until I can get the other ones."* **No spend.** This file is the plan for WHEN he
chooses to buy, not a recommendation to act on. Do not raise it again unprompted.

🔴 **WHY THE BLINKS STAY, AND WHY THEY ARE VALUABLE — corrected 2026-08-22.**
Jeff: *"I don't have power to the locations where those cameras are with the exception of the back
deck, so they serve a purpose."* **The Blink cameras exist because those spots have NO MAINS
POWER.** That is not a workaround, it is the reason. Every wired RTSP camera in this document
needs mains power and therefore **cannot** replace a Blink at a spot without it. The RTSP cameras
go where power already exists; the Blinks stay where it does not, and become the backup.

---

**Jeff's call:** buy 2 RTSP cameras for front and back yard, demote Blink to backup.
Constraints he gave: **mains power available at both spots, NO ethernet run — must be Wi-Fi.**
Prices below were verified in-session on 2026-08-22, not quoted from memory.

## THE PICK: 2 x TP-Link Tapo C320WS — ~$34 each, ~$68 the pair

| Spec | C320WS |
|---|---|
| Price | **$33.99** current US street (has hit $25 on promo) |
| RTSP / ONVIF | **Yes / Yes** — confirmed on TP-Link's own spec page |
| Resolution | 2K QHD, 4MP |
| Night vision | **Starlight sensor + 2 spotlights = FULL COLOUR at night**, 98 ft |
| Weather | IP66 |
| Wi-Fi | **2.4 GHz only** |
| Power | 9 V 0.6 A adapter (mains) |
| Onboard AI | person / vehicle / pet |

**Why the cheap one wins here, and it is not a compromise:** the whole point of this purchase is
detecting *a person in the back yard at night*. The C320WS has a starlight sensor **plus
spotlights, so it produces a colour image in the dark.** The Reolink RLC-510WA costs nearly
double and is **infrared only — black and white at night.** For this specific job the $34 camera
is the better camera.

**2.4 GHz-only is not a problem here** — 2.4 GHz has *longer* range than 5 GHz, which is what a
back-yard camera needs. The existing Blink back yard sits at −61 dBm, so range is the constraint,
not bandwidth. One 2K stream is comfortable on 2.4 GHz.

## The step-up, if he ever wants it

**Reolink RLC-510WA — $62.99.** 5 MP, IP67, **dual-band 2.4/5 GHz**, RTSP + RTMP + ONVIF,
12 V 1 A. Better sensor and dual-band, but **IR-only night vision.** Worth it only if 2.4 GHz
congestion turns out to be a real problem. **RLC-511WA** is the same thing with 5x optical zoom
and spotlights, at a higher price — not needed for fixed yard coverage.

**The $0 option** is staying on Blink alone. Jeff has already rejected it, and the 08-22
measurements justify that: Blink gives one still per event, the back yard PIR is aimed wrong, and
the doorbell has been offline since ~04:40 with a reload failing to recover it.

## Install notes for when they arrive

1. **RTSP will not work until a Camera Account exists.** Tapo app → device → **Advanced Settings
   → Camera Account** → set a username/password. This is separate from the TP-Link cloud login.
2. Stream URLs: `rtsp://USER:PASS@<ip>:554/stream1` (full quality) or `/stream2` (lower).
3. Give each camera a **DHCP reservation on the BGW320-500** (`192.168.1.254`) before wiring it
   into go2rtc, or the RTSP URL breaks on the next lease.
4. Add to `windows-config/go2rtc.yaml` as normal `rtsp://` sources — these are **real continuous
   streams**, unlike the Blink entries, which are ffmpeg loops over a still.
5. Because they stream continuously, the AI can scan them on a timer **with no battery cost and
   no Blink cloud** — this is what finally closes the night gap.
6. SSID is `Loewen301`. If the BGW's band-steering hides 2.4 GHz during pairing, pair the camera
   first and it will hold the association afterwards.

## Blink, now that it is backup only

Working within its limits: driveway and back left produce motion; the 20-min back-yard night
sweep is live. **Not recoverable from software:** the front doorbell and garage have no telemetry
since ~04:40 on 08-22, and a full Blink config-entry reload on 08-22 did **not** bring them back —
so it is physical (battery, sync module, or Wi-Fi), and it needs Jeff's hands. Do not build more
Blink workarounds; the RTSP cameras are the fix.

Sources checked 2026-08-22: TP-Link C320WS spec page, TP-Link RTSP/ONVIF FAQ 2680/4465,
Reolink RLC-510WA product page, e-catalog/idealo/slickdeals price listings.

---

# 🔴 REOPENED BY JEFF 2026-08-26 — corrections that invalidate parts of the plan above

**Jeff, 08-26:** *"The real fix is to get 2 rtsp cameras, one for the back and one for the front.
I have power at each spot... the power cable is the power cable that fits the zmodo cameras."*
He reopened this himself, so the DO-NOT-RE-PITCH freeze above no longer applies to this section.

## 1. PRICE IS STALE ABOVE — verified 2026-08-26

**Tapo C320WS is now $41.99**, not $33.99. Amazon Overall Pick, 4.5★/7.5K, in stock, next-day.
Also $39.89 under "more buying choices". **2 x $41.99 = $83.98.**

## 2. THE POWER CONSTRAINT THE PLAN ABOVE NEVER KNEW ABOUT

Jeff wants to reuse a cable **run inside the wall when the new windows went in** — it must not be
re-pulled. Identified from his photos:

| | |
|---|---|
| Adapter | **Zmodo `ZM-PS0001US`** |
| Output | **5 V ⎓ 1 A** (NOT 12 V) |
| Camera-end connector | **micro-USB male** — confirmed from an end-on photo; the trapezoid with angled corners. **NOT USB-C**, despite the initial impression |
| Cable jacket | `80°C 300V CSA AWM 1/11 A LL213732 FTI` |

🔴 **Two research errors of mine, corrected here so nobody repeats them:**
- I first researched *Zmodo* generally and got **12 V / 5.5x2.1 barrel** — that is their **DVR/CCTV**
  line. **Jeff's camera is the USB-powered style.** Do not cite the 12 V figure.
- I asserted the Tapo barrel was 5.5x2.1 before checking. It **is** 5.5x2.1 — verified 08-26 from a
  C320WS Q&A and replacement-adapter listings — but it was an assumption when I said it.

✅ **THE JACKET IS RATED 300 V.** Running 9 V or 12 V on that cable is a ~30x insulation margin.
And the Tapo pulls **9 V x 0.6 A = 5.4 W vs Zmodo's 5 V x 1 A = 5.0 W** — same power, **40% LESS
current**, therefore **less** voltage drop than it has carried for years. The cable is not the problem.
⚠️ Wire gauge is not printed on the jacket and is still unknown; Jeff will see it when he strips it.

## 3. CAMERAS RULED OUT ON POWER — do not re-propose these for THIS run

- **Reolink Lumus** — 5 V, so it fits the cable, **but Reolink's own support doc excludes it from
  HTTP/HTTPS/RTMP/RTSP/ONVIF entirely.** No stream, no use. Dead end.
- **Wyze Cam v3** — micro-USB, IP65, colour night: would plug straight in with zero adapters.
  **But Wyze REMOVED the RTSP firmware files** and will not commit to maintaining it. Building
  security on withdrawn beta firmware is the same trap as the custom Blink component. Rejected.
- **Reolink RLC-510WA** — 12 V, and IR-only night vision. Still the step-up, still second choice.
- ✅ **There is no such thing as a mainstream 5 V outdoor RTSP camera.** They are 12 V barrel or PoE.

## 4. THE CAMERA-END ADAPTER — Jeff: "I don't want to cut if I don't have to"

Needed: **micro-USB FEMALE → 5.5x2.1 mm barrel MALE.** ⚠️ **Almost every search result is the
OPPOSITE direction** (barrel female → micro-USB male, for charging a phone off a barrel supply).
Read the gender carefully or the wrong part arrives.

- **RocksolIT `B01AE1P4H8`** — exactly right, **Currently unavailable** on Amazon 08-26.
- **eBay** has the right direction in **3.5x1.35 mm** ($2.49) — **wrong barrel size** for the Tapo.
- **AliExpress** adapter sets show 5.5x2.1 paired with micro-USB, ~$1-3, but the exact gender could
  not be confirmed from the listing, and it is 1-2 weeks from China.

⚠️ **THE POINT NOBODY RAISED UNTIL NOW: that junction lives OUTDOORS.** The Zmodo plugged into a
sealed port on the camera body; an adapter chain hanging in the weather is a water-ingress and
corrosion point, and micro-USB is a small fragile connector. **A single soldered barrel plug with
heat-shrink is arguably MORE weatherproof than a two-part adapter chain, not less.** Jeff's call.

## 5. CURRENT RECOMMENDATION

**2 x Tapo C320WS, $83.98.** Colour night vision (starlight + spotlights) is the whole reason it
beats Reolink for "is there a person in the back yard at night". Reuse the in-wall cable: cut the
captive Zmodo brick off at the **inside** end (it cannot be unplugged), land the Tapo's own 9 V
adapter on those conductors, and at the camera end either fit a barrel plug or source the adapter
above. Red = +, black = ground; barrel is centre-positive.
