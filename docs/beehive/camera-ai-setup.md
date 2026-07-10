# Smart Camera Detection — CodeProject.AI on the beast (free, local, no subscription)

Goal: turn Blink "motion" alerts into **"Person / Car / Animal at [camera]"** using local AI
on the beast's **GTX 1050 Ti**. No Blink fee, no cloud. Blink is snapshot-based, so we run
detection on the **snapshot** (no RTSP/Frigate needed).

**Architecture:** Blink motion → Beehive (HA) grabs a fresh snapshot → sends it to
**CodeProject.AI** running on the beast (`192.168.1.194`, GPU) → it returns the objects it
sees → HA sends you a smart notification. Beehive stays light; the beast does the AI.

**Do this in STAGES and verify each one before the next** (Jeff hates big-bangs that break).
Entity names below are placeholders — Clyde: pull the real ones from HA (`camera.*` and the
Blink `binary_sensor.*_motion*`) and substitute.

---

## Stage 0 — Prereqs
- Beast tune-up done + **latest NVIDIA driver installed & restarted** (needed for CUDA).
- Beast on `192.168.1.194` (fixed on the AT&T side is nice-to-have, not required).

## Stage 1 — Install CodeProject.AI on the beast (Windows)
1. Download the Windows installer from **codeproject.com/ai** (or its GitHub releases). Install it — it runs as a Windows service.
2. Open the dashboard: **http://localhost:32168**
3. Under **Modules**, install/enable **Object Detection (YOLO)**. Open its settings and set it to **GPU / CUDA** mode.
4. **Verify GPU is actually used:** on the dashboard's Object Detection "Try it" tab, drop in a photo with a person → it should return `person` with a confidence. While it runs, `nvidia-smi` on the beast should show a CodeProject.AI/python process using the GPU.
   - If the newest YOLO module refuses the GPU on this Pascal card, switch to a slightly older YOLO module or CPU mode — still fine for occasional motion snapshots.

**✅ Stage 1 done when:** the dashboard detects a person in a test image (ideally on GPU).

## Stage 2 — Let Beehive reach it over the LAN
1. On the beast, allow **inbound TCP 32168** through Windows Firewall (or allow the CodeProject.AI app).
2. From HA (or Clyde) test reachability:
   ```
   curl http://192.168.1.194:32168/v1/status/ping
   ```
   Expect a success/JSON response.

**✅ Stage 2 done when:** the ping from the Beehive side succeeds.

## Stage 3 — Wire ONE camera into HA
1. In HA, install the **CodeProject.AI Object Detection** integration via **HACS** (custom repo if needed). Match its README for exact config keys — versions differ.
2. Add to `configuration.yaml` (start with the doorbell only):
   ```yaml
   image_processing:
     - platform: codeproject_ai_object      # match the installed integration's platform name
       ip_address: 192.168.1.194
       port: 32168
       scan_interval: 604800                # effectively "never auto-scan"; we scan on demand
       targets:
         - target: person
         - target: car
         - target: truck
         - target: dog
         - target: cat
       source:
         - entity_id: camera.301_front_doorbell   # <-- real doorbell entity
           name: doorbell_ai
   ```
3. Restart HA. Confirm `image_processing.doorbell_ai` exists.
4. **Manual test:** Developer Tools → Actions → `image_processing.scan` on `image_processing.doorbell_ai` → then check its **state** (object count) and **attributes** (`summary`) show what the camera sees.

**✅ Stage 3 done when:** a manual scan returns detected objects for the doorbell.

## Stage 4 — The smart-alert automation (one camera)
```yaml
alias: Camera AI - Front Doorbell
trigger:
  - platform: state
    entity_id: binary_sensor.301_front_doorbell_motion_detected   # <-- real motion sensor
    to: "on"
action:
  - service: blink.trigger_camera                 # grab a fresh shot
    target:
      entity_id: camera.301_front_doorbell
  - delay: "00:00:07"                             # Blink upload lag
  - service: image_processing.scan
    target:
      entity_id: image_processing.doorbell_ai
  - delay: "00:00:03"
  - variables:
      objs: "{{ state_attr('image_processing.doorbell_ai','summary') }}"
  - service: notify.mobile_app_jeff              # <-- Jeff's phone / family group
    data:
      title: "🎥 Front Doorbell"
      message: >
        {% if objs %}{{ objs.keys() | map('title') | join(', ') }} at the Front Doorbell.
        {% else %}Motion at the Front Doorbell.{% endif %}
```
Walk in front of the camera → you should get **"Person at the Front Doorbell."**

**✅ Stage 4 done when:** real motion produces a labeled notification.

## Stage 5 — Expand
Once one camera works end-to-end, duplicate the `source:` entries and automations for the
other cameras (Driveway, Front Right, Back Left, Backyard, Garage).

---

## Notes / honest caveats
- **Package detection:** the default YOLO model knows person/vehicles/animals but **not
  "package."** For packages either add a community **package model** to CodeProject.AI, or
  layer in **LLM Vision** (HACS) — a vision *language* model (small local model on the 1050 Ti,
  or the free Gemini tier) reasons about the scene and is actually better at "there's a
  package / a delivery driver." Do this after person/car/animal works.
- **Exact config keys** depend on the installed integration version — Clyde: verify against
  its README and adjust; don't assume. Verify at each stage.
- **Battery:** the automation triggers a fresh Blink snapshot per motion event — fine, but
  don't add aggressive periodic scanning (drains camera batteries).

## Division of labor
- **Clyde + Jeff:** Stages 1–5 (beast install + HA integration/automation). Clyde treats app
  code as READ-ONLY.
- **Claude (cloud):** once alerts carry the detected object, surface **"last seen: Person at
  Front Doorbell"** on the camera tiles / full-control panel in the app (app-side, next).
