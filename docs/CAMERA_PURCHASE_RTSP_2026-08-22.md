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
