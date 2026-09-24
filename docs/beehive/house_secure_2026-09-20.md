# HOUSE SECURE — the captured reference state (2026-09-20 22:05)

**Jeff, 2026-09-20 21:13:** *"Once that automation runs at 2200 and is complete the house should read
100% secure. That state needs to be captured and saved so we can create a check for the secure
state so Alexa can check it and report it and it shows in the app as house secure."*

**This is that captured state.** Taken at **22:05:10**, five minutes after
`automation.hcc_garage_secure_2200` completed, with the house verified secure.

⚠️ **It was first written to the session scratchpad, which is temporary.** Jeff asked *"did you
capture that state for future reference"* — it had not been made durable. It is now. Machine copy:
`docs/beehive/house_secure_baseline.json`.

---

## THE VERIFIED SECURE STATE

| entity | state | counts toward SECURE? |
|---|---|---|
| `binary_sensor.front_door_contact` | `off` | ✅ yes |
| `binary_sensor.back_deck_door_contact` | `off` | ✅ yes |
| `binary_sensor.garage_man_door_contact` | `off` | ✅ yes |
| `binary_sensor.garage_door_down_contact` | `off` | ✅ yes — `off` = door IS down |
| `cover.garage_door` | `closed` | reference |
| `binary_sensor.garage_secure` | `on` | reference (garage-only composite) |
| `switch.mini_smart_socket11_2_socket_1` (garage fan) | `off` | reference |
| all three `*_water_leak` | `off` | reference |
| `lock.gle_350_lock` | `unlocked` | ❌ **EXCLUDED** |
| `binary_sensor.spare_contact_1_contact` | `on` | ❌ **EXCLUDED** |

### 🔴 THE TWO EXCLUSIONS ARE LOAD-BEARING — without them the house can NEVER read secure

- **`lock.gle_350_lock`** — the Mercedes is left unlocked **on purpose** (thieves break a $1,000
  window looking for valuables that are never in it). It is a permanent `unlocked`. Including it in
  a secure check guarantees the check never goes green, which trains everyone to ignore it.
- **`binary_sensor.spare_contact_1_contact`** — an unmounted spare with no magnet near it, so it
  reads `on` forever. *(It is the sensor once labelled "Garage Door Up", IEEE `0xa4c13864378427d2`,
  renamed and repurposed — there is no up sensor by design.)*
- **The mailbox sensor is absent from Z2M** and is not counted.
- **Camera / alarm arm state is deliberately OUT OF SCOPE** — that subsystem is frozen, and it is a
  different question from doors and locks.

---

## 🔑 THE RULE THE CHECK MUST IMPLEMENT

**Jeff, stated twice on 2026-09-20:** *"there is no garage door up sensor because if it's not closed
it's open"* and *"If it doesn't say closed then it's open."*

So every test is **`not is_state(<entity>,'off')`**, never `== 'on'`.

**This is not pedantry — it was a live defect the same evening.** `automation.hcc_garage_secure_2200`
tested `state == 'on'` in all four of its gates, so when those Zigbee entities read `unavailable`
during the Z2M 2.14 update and the hard power cycle, it **(a)** never pulsed the door and **(b)**
computed `door_open = false` and logged **"Secure — overhead door closed"** over a door standing
open. A false SECURE is the worst output this house can produce. Fixed 20:58; see
`FINDINGS_AND_STOPS.md`.

**General form, worth more than this one check:** a state test written as `== 'on'` is a two-state
assumption on a three-state entity. Ask *"is it in the SAFE state?"* and treat everything else —
including `unavailable` and `unknown` — as unsafe.

---

## THE WORKING TEMPLATE (proven live 2026-09-20)

Renders **"The house is secure. All doors are closed."** when secure, and names the offender when
not (verified at 21:25 rendering *"The house is not secure. The garage door is open."* while the
overhead was genuinely cracked):

```jinja
{% set checks = [
  ('the front door','binary_sensor.front_door_contact'),
  ('the back deck door','binary_sensor.back_deck_door_contact'),
  ('the garage man door','binary_sensor.garage_man_door_contact'),
  ('the garage door','binary_sensor.garage_door_down_contact')] %}
{% set ns = namespace(bad=[]) %}
{% for label, ent in checks %}
  {% if not is_state(ent,'off') %}{% set ns.bad = ns.bad + [label] %}{% endif %}
{% endfor %}
{% if ns.bad | length == 0 %}The house is secure. All doors are closed.
{% else %}The house is not secure. {{ (ns.bad | join(' and ')) | capitalize }} {{ 'is' if ns.bad | length == 1 else 'are' }} open.{% endif %}
```

### 🔴 WHEN BUILDING `binary_sensor.house_secure`: **NO `device_class`**

`binary_sensor.garage_secure` is a **UI template helper (config entry `01M23PX13JRPCX9MHEEN4AAK76`)**,
not YAML — which matters because writes to the box are permission-gated. Build the house-wide one the
same way. **Setting `device_class: safety` INVERTED `garage_secure`** — it read *"Safe"* while the
garage was open, and the entry had to be deleted and rebuilt with `device_class: None`. Do not repeat it.

---

## EVIDENCE — the 22:00 run that produced this state

Captured live by a state watcher armed at 20:55:

```
22:00:00  switch.garage_garage_door_opener        off -> on     (pulse)
22:00:01  switch.garage_garage_door_opener        on -> off
22:00:04  binary_sensor.garage_door_down_contact  on -> off     <- CLOSED IN 4 SECONDS
22:00:04  cover.garage_door                       open -> closed
22:00:05  switch.mini_smart_socket11_2_socket_1   on -> off     (fan)
22:00:05  binary_sensor.garage_secure             off -> on
```

🟢 **It closed on the FIRST pulse — the retry was never needed.** The door had been deliberately
cracked for the fan all evening, which made this a real test of the toggle case Jeff raised
(*"if it goes open and doesn't close make sure it fires again"*). **Jeff's 2026-09-09 photo-eye
repair is holding** — the record's "refused to close on 8 of 10 nights" era is over.

---

## ⚠️ STILL OPEN: ALEXA SAID NOTHING

`automation.hcc_house_secure_announce_2205` **fired correctly** at 22:05:00 — all three actions ran,
no error, and the `persistent_notification` it wrote reads **"The house is secure. All doors are
closed."** The template, the logic and the timing are all proven.

**But nothing came out of the speakers.** `notify.alexa_media` returned success and produced no
sound. Three formats were fired at 22:30 to isolate it — per-device `announce`, generic with
`target`, and plain TTS — **all returned HTTP 200, which proves nothing**, because the 22:05 call
returned success too.

**HTTP 200 from a notify service is not evidence it spoke.** Next session: find out which variant
Jeff actually hears, and check the `*_do_not_disturb` switches before touching the message format.
