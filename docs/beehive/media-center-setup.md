# Beast Media Center Setup — Kodi + HA TV Alerts

**Goal:** The beast (`192.168.1.194`, GTX 1050 Ti, viewing room) drives the TV as a media
center. HA sends camera/AI alerts that pop up **over** whatever's playing — Angela sees
"Person at Front Doorbell" on the TV, glances, it fades, show continues.

**Architecture:** Beast runs Kodi (free media center) → HDMI → TV. Beehive (HA) talks to
Kodi over the LAN. When a camera detects motion, HA fires the AI detection on the beast
(CodeProject.AI) AND pops the alert on the TV (Kodi notification). Phone notifications fire
in parallel. The Fire TV Stick stays as a backup HDMI input for 4K DRM streaming.

---

## Stage 1 — Physical: HDMI from beast to TV

If the beast's HDMI isn't already plugged into the Vizio:
1. Run an HDMI cable from the beast's GPU (GTX 1050 Ti) HDMI out → an available HDMI input
   on the Vizio TV.
2. Switch the TV to that input. You should see the beast's Windows desktop.
3. Set the TV as the primary display (or extend/duplicate — Jeff's preference).

**If the beast is ALREADY the Vizio's monitor (the plan doc says it is), skip this step.**

---

## Stage 2 — Install Kodi on the beast (Windows)

Clyde does this on the beast:

1. **Download Kodi** from `kodi.tv/download` — pick the **Windows 64-bit installer**.
2. Run the installer, accept defaults.
3. Launch Kodi.
4. Go to **Settings** (gear icon) → **Services** → **Control**:
   - **Allow remote control via HTTP** → ON
   - **Port:** `8080`
   - **Username:** `kodi`
   - **Password:** pick something (e.g., `hcc2026`) — write it down for the HA step
   - **Allow remote control from applications on other systems** → ON
5. Verify: open `http://localhost:8080` in a browser on the beast — should show the Kodi web
   interface (Chorus).

**Done when:** Kodi runs on the beast, the web interface is accessible, and
`http://192.168.1.194:8080` loads from another device on the network (may need to allow TCP
8080 through Windows Firewall — "Allow an app through Windows Firewall" → Kodi, or New Rule
→ Port → TCP 8080 → Allow).

---

## Stage 3 — Add Kodi to Home Assistant

Jeff (or Clyde via HA):

1. In HA: **Settings → Devices & Services → Add Integration** → search **"Kodi"**
2. Enter:
   - **Host:** `192.168.1.194`
   - **Port:** `8080`
   - **Username:** `kodi`
   - **Password:** (whatever you set in Stage 2)
3. HA creates `media_player.kodi`.

**Test:** Developer Tools → Actions → pick `kodi.call_method`:
```yaml
service: kodi.call_method
target:
  entity_id: media_player.kodi
data:
  method: GUI.ShowNotification
  title: "Test Alert"
  message: "If you see this on the TV, it works!"
  displaytime: 5000
```
Run it — a toast notification should appear on the TV screen (over whatever Kodi is showing).

**Done when:** "Test Alert" pops up on the TV.

---

## Stage 4 — Wire camera AI alerts to the TV

This goes AFTER CodeProject.AI is installed and working (see `camera-ai-setup.md` Stages 1-4).

Full automation (one per camera, starting with the doorbell):

```yaml
alias: "TV + Phone Alert - Front Doorbell"
description: "Motion → AI detect → TV overlay + phone push"
trigger:
  - platform: state
    entity_id: binary_sensor.301_front_doorbell_motion_detected
    to: "on"
condition:
  # Debounce: don't fire if it fired in the last 60s
  - condition: template
    value_template: >
      {{ (now() - state_attr('automation.tv_phone_alert_front_doorbell','last_triggered')
         | default(now() - timedelta(hours=1))).total_seconds() > 60 }}
action:
  # 1. Grab a fresh Blink snapshot
  - service: blink.trigger_camera
    target:
      entity_id: camera.301_front_doorbell
  - delay: "00:00:07"

  # 2. Run AI detection
  - service: image_processing.scan
    target:
      entity_id: image_processing.doorbell_ai
  - delay: "00:00:03"

  # 3. Read what was detected
  - variables:
      objs: "{{ state_attr('image_processing.doorbell_ai','summary') }}"
      label: >
        {% if objs %}{{ objs.keys() | map('title') | join(', ') }}
        {% else %}Motion{% endif %}

  # 4. Pop on the TV (Kodi overlay — appears over playback, fades after 8s)
  - service: kodi.call_method
    target:
      entity_id: media_player.kodi
    data:
      method: GUI.ShowNotification
      title: "🎥 Front Doorbell"
      message: "{{ label }} detected"
      displaytime: 8000

  # 5. Push to Jeff's phone (parallel)
  - service: notify.mobile_app_jeffs_iphone
    data:
      title: "🎥 Front Doorbell"
      message: "{{ label }} at the Front Doorbell."
mode: single
```

Duplicate for each camera, changing the entity_ids and names.

---

## Stage 5 — Make it a real media center (optional polish)

Once alerts work, Kodi can do more:

- **Idle screen:** set Kodi's screensaver to cycle through camera snapshots or family photos
- **HCC dashboard on the TV:** install the Kodi **Web Browser** add-on → point it at
  `https://loewenhome.com` → full app on the big screen
- **Local media:** point Kodi at a shared folder on the beast → browse/play movies, music,
  photos from the couch
- **HA scenes:** build a "Movie Night" scene that dims lights (via Tuya plugs), sets Kodi to
  fullscreen, adjusts volume → one button in the app or "Alexa, movie night"
- **TTS announcements:** `tts.google_translate_say` → `media_player.kodi` → the TV speaks
  ("Washer is done", "Front door opened")

---

## DRM streaming note (honest)

Premium apps (Netflix, Prime, HBO) cap at **720p** on a PC browser (Widevine L3). For **4K
HDR** streaming, the Fire TV Stick is better (hardware DRM). Practical answer: **beast =
media center + AI + alerts + local content + HCC dashboard**; Fire TV Stick = second HDMI
input for when you want pristine 4K streaming. Most of the time the beast is plenty.

---

## Division of labor

- **Clyde (on the beast):** Stages 1-2 (HDMI + Kodi install + firewall)
- **Jeff:** Stage 3 (add Kodi to HA — quick)
- **Claude (cloud):** wrote this plan; owns the app-side alert UI
- **Both:** Stage 4 automation (Clyde creates in HA, Jeff tests by walking in front of camera)
