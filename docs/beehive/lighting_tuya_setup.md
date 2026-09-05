> # ⚠️ STALE — CORRECTED 2026-08-19. DO NOT FOLLOW AS WRITTEN.
>
> This guide is from **2026-07-04** and was overtaken by events three days later.
>
> - It says *"use the Tuya app he already has; no Smart Life install needed."* **Wrong.**
>   The working link was made **2026-07-07 with the SMART LIFE app** and a generic JH-G01U
>   "Mini Smart Socket" (Shenzhen Jiuheng).
> - It was written for the **SYLVANIA plugs**, which turned out to be **vendor-locked and
>   can never enter Home Assistant** (proven 07-07 and again 08-13 — Smart Life rejects them,
>   and the Sylvania app can scan HA's QR but Tuya blocks the confirm with *"use the
>   designated APP"*). **Settled — do not re-attempt.** See `docs/inventory/HCC_INVENTORY.md`.
> - The example entities (`switch.giraffe_plug`, `switch.lamp_couch`, `switch.lamp_chair`,
>   `switch.lamp_foyer`) **never existed.** What is actually on the Tuya link: Sharky
>   (BL20 Pro vacuum), Jeff's + Angela's bed lamps, hot water circulation pump, garage fan.
> - **The QR is ONE-TIME-USE and expires** — that warning is missing below. Fresh QR, scan
>   once with **Smart Life's in-app scanner**, hit the blue **Confirm login** fast.
>
> Current procedure: `HCC-secrets/tuya_ha_usercode.txt` and
> `docs/incidents/blink_reauth_code_storm_2026-08-19.md`.
> Part B (the sunset/9pm automations) is still fine.

# HCC — Tuya Plugs into Beehive + HA-controlled lighting

Goal: get Jeff's smart **plugs** into Home Assistant (Beehive) so the
**HCC app -> GUARDIAN -> Lights & Plugs** card controls them, then let **HA run the
schedule** (on at sunset, off at 9pm) instead of the Tuya app / Alexa.

Key facts:
- Jeff's "SYLVANIA Smart WiFi" plugs are **Tuya** devices. **Confirmed 07-04
  (Jeff's screenshot IMG_0852): his plugs already live in the Tuya app directly**
  (home "301"; plugs: Giraffe plug, Lamp Couch, Lamp chair, Lamp foyer, + more rooms).
  -> **Use the Tuya app he already has; no Smart Life install / account-crossover needed.**
- The HCC app already reads `switch.*` (plugs) in the Lights & Plugs card, irrigation excluded.
- The official HA **Tuya** integration no longer needs a developer/cloud project — it's a
  **User Code + QR scan** with the Tuya (or Smart Life) app.

---

## Part A — Get the plugs into Beehive (using the Tuya app Jeff already has)

1. In the **Tuya app**, tap **Settings** (bottom-right, the person icon).
2. Find your **User Code**: tap your account / **Account and Security** -> **User Code**
   (near the bottom of the list). Note it down.
3. On **Beehive** (browser): **Settings -> Devices & Services -> Add Integration** ->
   search **"Tuya"** -> select it.
4. Enter the **User Code** from step 2 -> **Submit**. Beehive shows a **QR code**.
5. Back in the **Tuya app**: tap the **scan icon** (top of the Settings/Me screen) -> scan
   the QR code on the Beehive screen -> **Confirm / Authorize** on your phone.
6. Beehive imports **all** the plugs at once -> they appear as **`switch.*`** entities
   (e.g. `switch.giraffe_plug`, `switch.lamp_couch`, `switch.lamp_chair`, `switch.lamp_foyer`).
7. Open the HCC app -> **GUARDIAN -> Lights & Plugs** -> the plugs are all there.
   (Card auto-lists them; no app change needed.)

If step 2's User Code / step 5's scan icon are in a slightly different spot on Jeff's app
version, he tells us what he sees and we adjust — that's the one thing only he can see.

---

## Part B — Let HA run the lights (on at sunset, off at 9pm)

Two small automations. Easiest is the visual UI (no typing entity IDs — pick the plugs
from a list).

**Automation 1 — ON at sunset**
- Settings -> **Automations & Scenes -> Create Automation -> Start with an empty automation**.
- **When (trigger):** Sun -> **Sunset**. (Optional offset `-00:15:00` = 15 min before dark.)
- **Then do (action):** Switch -> Turn on -> **Targets:** pick the plug(s).
- Rename **"Lights ON at sunset" -> Save**.

**Automation 2 — OFF at 9pm**
- Create Automation -> empty.
- **When:** Time -> **21:00:00**.
- **Then do:** Switch -> Turn off -> the plug(s).
- Rename **"Lights OFF at 9pm" -> Save**.

**YAML alternative** (three-dots -> *Edit in YAML*, paste, adjust the entity_ids to the
plugs Jeff wants on this schedule):

```yaml
alias: Lights ON at sunset
triggers:
  - trigger: sun
    event: sunset
    offset: "-00:15:00"
actions:
  - action: switch.turn_on
    target:
      entity_id:
        - switch.giraffe_plug
        - switch.lamp_couch
        - switch.lamp_chair
        - switch.lamp_foyer
mode: single
```

```yaml
alias: Lights OFF at 9pm
triggers:
  - trigger: time
    at: "21:00:00"
actions:
  - action: switch.turn_off
    target:
      entity_id:
        - switch.giraffe_plug
        - switch.lamp_couch
        - switch.lamp_chair
        - switch.lamp_foyer
mode: single
```

Sunset auto-adjusts year-round — no seasonal editing.

---

## Part C — Make HA the sole brain

- **Retire the old 9pm-off:** Jeff's current schedule lives in the **Tuya app -> Automation
  tab** (bottom center) — open it and delete/disable the old "off at 9pm" rule so only
  Beehive runs it. (Two things turning the lights off at 9 is harmless, just confusing —
  kill the old one once HA's is confirmed working.)
- **Keep Alexa voice control:** HA -> **Settings -> Voice assistants -> Amazon Alexa ->
  Expose** -> add the plug `switch.*`. Now "Alexa, turn on the couch lamp" still works, but
  **Beehive is the scheduler/brain.** (Same expose flow Jeff used for the weather sensors.)

## Payoff (why HA, not just Tuya/Alexa)
Once the plugs are HA entities they also tie into: **Away Mode** (all-off when you leave),
the future **alarm** (flash-on if it trips), and any cross-device automation — none of which
the Tuya app or Alexa can do alone. They show and control live in the HCC **Lights & Plugs** card.
