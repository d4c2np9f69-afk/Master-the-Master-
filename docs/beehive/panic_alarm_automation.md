# Panic button → Beehive alarm automation (sirens + lights + alert the family)

**What the app does:** tapping the red EMERGENCY bar (after a confirm) POSTs to the
Beehive webhook `hcc-panic-button` with:
```json
{ "action":"panic", "siren":true, "lights":true, "notify":["jeff","angela","braxton"],
  "triggered":"<time>", "source":"HCC App" }
```
**What Beehive does with it:** everything below. The app only sends the signal — the
sirens, lights, and alerts are this Home Assistant automation. **Nothing here works until
(a) the J45 is set up, (b) the alarm system is integrated into HA, and (c) the HA Companion
app is installed on Jeff's, Angela's, and Braxton's phones.**

> Jeff will call 911 himself — this automation does **NOT** dial 911.

---

## What we still need before building this (fill in during Beehive setup)
1. **Alarm brand/model** → determines how the siren integrates into HA:
   - Hardwired panel (DSC/Honeywell/etc.) → **Envisalink** or **Konnected** board (Wi-Fi/LAN → HA).
   - Zigbee/Z-Wave siren → via the coordinator stick.
   - Smart-plug/relay-driven siren → Shelly/relay entity.
   → Gives us the real **`siren.*`** (or `switch.*`) entity id for the siren.
2. **Which lights** should strobe → the `light.*` / `switch.*` entity ids (or a group).
3. **Alert method for the 3 phones** — pick one (see below).

## Alerting Jeff / Angela / Braxton — the realistic options
- **✅ Recommended: HA Companion app *Critical* push notifications.** Free, reliable, and on
  iPhone they **override silent mode / Do-Not-Disturb** and play a loud sound. Each phone
  installs the *Home Assistant* app + signs into Beehive once → HA gets a `notify.mobile_app_*`
  service per phone. This is what most home-alarm HA setups use.
- **Optional real phone CALL:** needs a paid add-on — **Twilio** (HA `notify`/call service can
  place a voice call with a spoken message) or an Alexa announce/drop-in. More setup + small
  cost. Can be added later on top of the push notifications.
- **SMS:** also via Twilio if wanted.

---

## The automation (drop into Beehive → Settings → Automations → edit as YAML)
Replace the `siren.house_alarm`, `light.*`, and `notify.mobile_app_*` names with the real
entity ids once they exist. Keeps working even if one piece is missing (uses `continue_on_error`).

```yaml
alias: HCC Panic Button — sirens + lights + alert family
mode: single
trigger:
  - platform: webhook
    webhook_id: hcc-panic-button
    allowed_methods: [POST]
    local_only: false      # set true if the app only fires on home Wi-Fi
action:
  # 1) SIRENS
  - continue_on_error: true
    service: siren.turn_on
    target:
      entity_id: siren.house_alarm        # <-- real siren entity once alarm is in HA

  # 2) STROBE THE LIGHTS (flash on; a second automation/loop can blink them)
  - continue_on_error: true
    service: light.turn_on
    target:
      entity_id:
        - light.living_room               # <-- real light entities / a light group
        - light.exterior
    data:
      brightness_pct: 100
      flash: long

  # 3) ALERT THE FAMILY — Critical push to all three phones
  - continue_on_error: true
    service: notify.mobile_app_jeff_iphone     # <-- real notify targets
    data:
      title: "🚨 PANIC ALARM TRIGGERED"
      message: "Panic activated from the HCC app at {{ trigger.json.triggered }}."
      data:
        push:
          sound:
            name: default
            critical: 1        # iOS: override silent/DND
            volume: 1.0
  - continue_on_error: true
    service: notify.mobile_app_angela_iphone
    data:
      title: "🚨 PANIC ALARM TRIGGERED"
      message: "Panic activated from the HCC app at {{ trigger.json.triggered }}."
      data: { push: { sound: { name: default, critical: 1, volume: 1.0 } } }
  - continue_on_error: true
    service: notify.mobile_app_braxton_iphone
    data:
      title: "🚨 PANIC ALARM TRIGGERED"
      message: "Panic activated from the HCC app at {{ trigger.json.triggered }}."
      data: { push: { sound: { name: default, critical: 1, volume: 1.0 } } }

  # 4) (OPTIONAL) real phone call via Twilio — uncomment once Twilio is set up
  # - continue_on_error: true
  #   service: notify.twilio_call
  #   data:
  #     target: ["+1615XXXXXXX", "+1615YYYYYYY", "+1615ZZZZZZZ"]
  #     message: "twiml: <Response><Say>Panic alarm triggered at the house.</Say></Response>"
```

### A separate "stop / all-clear" is worth adding later
A second webhook (`hcc-panic-clear`) → `siren.turn_off` + lights back to normal, surfaced as a
"Cancel alarm" button in the app. Add once the base automation is confirmed working.

---

## Test plan (once Beehive + alarm are live)
1. Fire the webhook manually first (safe, no app): in HA → Developer Tools, or
   `curl -X POST http://homeassistant.local:8123/api/webhook/hcc-panic-button` → confirm siren +
   lights + all 3 phones buzz.
2. Then tap the app's EMERGENCY bar on home Wi-Fi → same result.
3. Confirm the **off-network** path shows the app's "Could not reach Beehive — call 911" message
   (so you're never falsely reassured the alarm fired when it didn't).
