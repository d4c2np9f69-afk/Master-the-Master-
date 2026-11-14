# Garage doors open by design — and the 10 PM rule (2026-09-20)

> 📄 **READ `docs/hvac/garage_vent_estimate_2026-09-17.md` FIRST.** The doors are open because the
> garage is a **measured** heat problem, not a preference: **288 sq ft, 10 ft ceiling, uninsulated
> walls, insulated door — Jeff measured 94 °F with no AC, and the LG LP0818WNR portable holds it
> at ~80 °F.** A 7" vent off the new system lands it ~84 °F alone and **~73–74 °F with the LG**;
> **R-38 blown into the garage attic ($120–150 of cellulose, an afternoon) roughly doubles that.**
>
> ⚠️ **That file existed for three days and a session wrote THIS one without opening it.** Jeff,
> 2026-09-20: *"you didn't fully read the file."* He was right, and the mechanism is worth naming:
> the session ran `Search-HCC.ps1`, which printed **`60 hits (showing 8)`**, read those 8 snippets
> and treated that as having read the record. **A search is not a read — the gates say so
> explicitly (*"use the Read tool - grep does NOT count"*), and Search-HCC is a grep.** The 52
> hits it never saw are where the answers were.

**Short version for `CLAUDE.md`:** the garage doors are open on purpose during the heat of the
day and get **secured at 10 PM**. Open in the afternoon = correct. **Still open after 22:00 = a
real finding.**

---

## What Jeff said

> *"I'm not shutting anything it's 100 degrees out there."* — 2026-09-20 7:11 PM

> *"No it will have cooled down by then and I want it secured at 10."* — 7:13 PM

The overhead door is **cracked at the bottom for the fan**; the **man door stands open** for
cross-ventilation. Both deliberate.

## The correct states on a hot afternoon

| entity | reads | verdict |
|---|---|---|
| `binary_sensor.garage_man_door_contact` | `on` | correct, intended |
| `cover.garage_door` | `open` | correct, intended |
| `binary_sensor.garage_secure` | `off` | correct, intended |

**The same three readings after 22:00 are worth raising.** The time qualifier is the whole rule.

## Do NOT "improve" the 10 PM automation

`automation.hcc_garage_secure_at_10_pm_door_fan_man_door` fires at **22:00 with no conditions**
and pushes. A temperature condition and a `garage_work_mode`-style suppression toggle were both
offered on 2026-09-20 and **Jeff declined**: the nightly push is a **wanted reminder**, not alert
fatigue. Leave it alone.

## This closes #53's "door-or-magnet question"

`#53` treated the man door reading `on` since 09-18 as *"a door-or-magnet question for Jeff's
eyes — either it has been standing open since Thursday morning, or the magnet has drifted."*
**The camera answered it and the answer was neither: it is Jeff, on purpose, for the heat.**

## 🔴 The sloppiness that produced this entry — worth keeping

A session pulled a fresh garage still (md5-verified fresh after one `trigger_camera`), looked at
the large dark panel in the centre, declared the overhead door **CLOSED**, and then went on to
call `cover.garage_door` a **false reading** and argue that the SONOFF *"reports a state it cannot
know."*

**Every one of those entities was correct. The session misread the picture** by never checking the
bottom edge, which is exactly where a crack shows. Jeff: *"you are being sloppy."*

**Lesson: when a sensor disagrees with your reading of an image, suspect the reading.** Three
independent entities agreed with each other and against the interpretation; that should have been
the tell.

## ✅ The one good byproduct — Down sensor naming CONFIRMED

`docs/zigbee/zigbee_mesh_routers_2026-08-27.md` has carried this warning since 2026-08-24:

> *"Up vs Down is unverified. I assigned those names purely from the order you told me, not from
> anything I observed... Get that backwards and the garage-door state logic is inverted from day
> one, and it'll look like it works."*

On 2026-09-20 the door was **demonstrably off the down position** (cracked for the fan, confirmed
by Jeff and visible in the still) while `binary_sensor.garage_door_down_contact` read **`on`**.
That is the **first real-world confirmation** that the Down sensor is named correctly —
`on` = not in the down position. A month-old unverified flag, resolved at $0 by observation.

## 🔴 THERE IS NO "GARAGE DOOR UP" SENSOR, AND THAT IS BY DESIGN — NOT A MISSING DEVICE

**Jeff, 2026-09-20 7:17 PM:** *"there is no garage door up sensor because if it's not closed it's
open."*

He is right and the logic is complete with one sensor: **`binary_sensor.garage_door_down_contact`
gives the whole door state — `off` = closed, `on` = open.** A second sensor at the up position
would be redundant.

⚠️ **A session reported `garage_door_up` as "MISSING from Z2M entirely" and counted the roster as
short two devices.** That was wrong. The 2026-08-24 notes list a bench-paired "Garage Door Up",
but it was never deployed, so its absence is expected.

✅ **The Z2M roster of 11 devices is CORRECT.** The **Mailbox is the only genuine absentee** — one
device to re-pair, not two.

**The general trap:** a device named in an old bench/commissioning note is not evidence that the
device is deployed. Check what Jeff actually installed before calling something missing.
