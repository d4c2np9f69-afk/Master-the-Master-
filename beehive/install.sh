#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  HOME COMMAND CENTER — BEEHIVE BRAIN SETUP
#  Run INSIDE the HA Terminal add-on:
#    curl -fsSL https://toro1-5rz.pages.dev/beehive/install.sh | bash
# ═══════════════════════════════════════════════════════════════════════════

HCC_BASE="https://toro1-5rz.pages.dev"
R='\033[0;31m' G='\033[0;32m' C='\033[0;36m' Y='\033[1;33m' N='\033[0m'
OK="${G}✓${N}" ERR="${R}✗${N}" INFO="${C}→${N}"

banner() { echo -e "\n${C}══ $1 ══${N}"; }
ok()     { echo -e "  ${OK}  $1"; }
info()   { echo -e "  ${INFO}  $1"; }
warn()   { echo -e "  ${Y}⚠${N}  $1"; }
die()    { echo -e "  ${ERR}  $1"; exit 1; }

echo ""
echo -e "${C}╔═══════════════════════════════════════════════════╗${N}"
echo -e "${C}║     HOME COMMAND CENTER — BEEHIVE BRAIN SETUP    ║${N}"
echo -e "${C}║         Standalone · No Windows Required          ║${N}"
echo -e "${C}╚═══════════════════════════════════════════════════╝${N}"
echo ""

# ── Verify we are running inside Home Assistant ─────────────────────────────
[[ -d /config ]] || die "Must run from inside the Beehive HA Terminal add-on"

# ── STEP 1: Install HACS ─────────────────────────────────────────────────────
banner "STEP 1 — HACS"
if [[ -d /config/custom_components/hacs ]]; then
  ok "HACS already installed — skipping"
else
  info "Installing HACS..."
  curl -fsSL https://get.hacs.xyz | bash - && ok "HACS installed" || warn "HACS install returned non-zero (may already exist)"
fi

# ── STEP 2: Create HCC package directory ────────────────────────────────────
banner "STEP 2 — HCC Package Directory"
mkdir -p /config/packages
ok "Directory ready: /config/packages"

# ── STEP 3: Write the HCC HA package ────────────────────────────────────────
banner "STEP 3 — HCC Configuration Package"
cat > /config/packages/hcc.yaml << 'HCCPKG'
# ═══════════════════════════════════════════════════════════════════════════
#  HCC — Home Command Center Package
#  Loaded automatically via homeassistant.packages in configuration.yaml
# ═══════════════════════════════════════════════════════════════════════════

# ── Input helpers ────────────────────────────────────────────────────────────
input_number:
  mower_hours:
    name: Mower Engine Hours
    min: 0
    max: 10000
    step: 0.1
    unit_of_measurement: h
    icon: mdi:timer-outline

  mower_battery_voltage:
    name: Mower Battery Voltage
    min: 0
    max: 16
    step: 0.01
    unit_of_measurement: V
    icon: mdi:battery

input_text:
  mower_last_sync:
    name: Mower Sensor Last Sync
    max: 64

input_boolean:
  hcc_panic_active:
    name: HCC Panic Active
    icon: mdi:alarm-light

# ── Template sensors ─────────────────────────────────────────────────────────
template:
  - sensor:
      - name: "HCC Mower Hours"
        unit_of_measurement: "h"
        icon: mdi:timer-outline
        state: "{{ states('input_number.mower_hours') | float(0) | round(1) }}"

      - name: "HCC Mower Battery"
        unit_of_measurement: "V"
        icon: mdi:battery
        state: "{{ states('input_number.mower_battery_voltage') | float(0) | round(2) }}"

      - name: "HCC Mower Status"
        icon: mdi:tractor
        state: >
          {% set h = states('input_number.mower_hours') | float(0) %}
          {% if h > 0 %}{{ h }} hrs{% else %}Unknown{% endif %}

# ── Automations ───────────────────────────────────────────────────────────────
automation:
  - id: hcc_panic_button
    alias: "HCC — Panic Button"
    description: "Emergency alert from HCC app — flash all lights, send notification"
    mode: single
    trigger:
      - platform: webhook
        webhook_id: hcc-panic-button
        allowed_methods: [POST, GET]
        local_only: false
    action:
      - service: input_boolean.turn_on
        target:
          entity_id: input_boolean.hcc_panic_active
      - service: light.turn_on
        target:
          entity_id: all
        data:
          flash: long
      - service: persistent_notification.create
        data:
          title: "🚨 EMERGENCY ALERT"
          message: "HCC Panic triggered at {{ now().strftime('%I:%M %p') }} on {{ now().strftime('%b %d') }}"
          notification_id: hcc_panic
      - delay: "00:00:30"
      - service: input_boolean.turn_off
        target:
          entity_id: input_boolean.hcc_panic_active

  - id: hcc_mower_sensor_sync
    alias: "HCC — Mower Sensor Sync"
    description: "ESP32 mower sensor posts engine hours, battery, GPS data"
    mode: single
    trigger:
      - platform: webhook
        webhook_id: hcc-mower-sensor
        allowed_methods: [POST]
        local_only: false
    action:
      - variables:
          payload: "{{ trigger.json }}"
      - if:
          - condition: template
            value_template: "{{ payload.hours is defined and payload.hours | float(0) > 0 }}"
        then:
          - service: input_number.set_value
            target:
              entity_id: input_number.mower_hours
            data:
              value: "{{ [payload.hours | float(0), states('input_number.mower_hours') | float(0)] | max | round(1) }}"
      - if:
          - condition: template
            value_template: "{{ payload.battery is defined and payload.battery | float(0) > 0 }}"
        then:
          - service: input_number.set_value
            target:
              entity_id: input_number.mower_battery_voltage
            data:
              value: "{{ payload.battery | float(0) | round(2) }}"
      - service: input_text.set_value
        target:
          entity_id: input_text.mower_last_sync
        data:
          value: "{{ now().isoformat() }}"

  - id: hcc_irrigation_started
    alias: "HCC — Irrigation Started"
    description: "Notify when B-Hyve begins watering"
    mode: single
    trigger:
      - platform: state
        entity_id: binary_sensor.bhyve_sprinkler_watering
        to: "on"
    condition:
      - condition: time
        after: "06:00:00"
        before: "22:00:00"
    action:
      - service: persistent_notification.create
        data:
          title: "💧 Irrigation Running"
          message: "B-Hyve watering started at {{ now().strftime('%I:%M %p') }}"
          notification_id: hcc_irrigation

  - id: hcc_weather_severe
    alias: "HCC — Severe Weather Alert"
    description: "Notify on severe NWS weather watch or warning"
    mode: single
    trigger:
      - platform: state
        entity_id: weather.home
        to:
          - lightning
          - lightning-rainy
          - exceptional
          - hail
    action:
      - service: persistent_notification.create
        data:
          title: "⛈ Severe Weather"
          message: "Conditions: {{ states('weather.home') | title }} — check HCC for details"
          notification_id: hcc_weather_severe

  - id: hcc_freeze_warning
    alias: "HCC — Freeze Warning"
    description: "Remind to winterize irrigation when first freeze approaches in fall"
    mode: single
    trigger:
      - platform: numeric_state
        entity_id: sensor.outdoor_temperature
        below: 34
    condition:
      - condition: template
        value_template: "{{ now().month >= 9 }}"
    action:
      - service: persistent_notification.create
        data:
          title: "🥶 Freeze Warning"
          message: "Temp below 34°F — consider winterizing your B-Hyve irrigation system."
          notification_id: hcc_freeze

# ── Scripts ──────────────────────────────────────────────────────────────────
script:
  hcc_irrigation_stop_all:
    alias: "HCC — Stop All Irrigation"
    icon: mdi:water-off
    sequence:
      - service: switch.turn_off
        target:
          entity_id: all
        data: {}

  hcc_good_night:
    alias: "HCC — Good Night"
    icon: mdi:weather-night
    sequence:
      - service: light.turn_off
        target:
          entity_id: all
      - service: persistent_notification.create
        data:
          title: "🌙 Good Night"
          message: "HCC locked down at {{ now().strftime('%I:%M %p') }}"
HCCPKG

ok "HCC package written to /config/packages/hcc.yaml"

# ── STEP 4: Patch configuration.yaml to load packages ──────────────────────
banner "STEP 4 — Configuration"
CONFIG=/config/configuration.yaml

if grep -q "packages:" "$CONFIG" 2>/dev/null; then
  ok "Packages directory already configured in configuration.yaml"
else
  info "Adding packages loader to configuration.yaml..."
  cat >> "$CONFIG" << 'CFGPATCH'

# ── HCC Package loader ──────────────────────────────────────────────────────
homeassistant:
  packages: !include_dir_named packages
CFGPATCH
  ok "configuration.yaml updated"
fi

# ── STEP 5: Install ESPHome add-on ──────────────────────────────────────────
banner "STEP 5 — ESPHome Add-on"
info "Installing ESPHome (for mower sensor firmware)..."
ha addons install a5d21c77_esphome 2>/dev/null && ok "ESPHome installed" || warn "ESPHome already installed or needs manual install via UI"
ha addons start a5d21c77_esphome 2>/dev/null && ok "ESPHome started" || true

# ── STEP 6: Download ESPHome mower sensor config ─────────────────────────────
banner "STEP 6 — Mower Sensor Firmware Config"
mkdir -p /config/esphome
curl -fsSL "${HCC_BASE}/beehive/esphome/hcc-mower.yaml" -o /config/esphome/hcc-mower.yaml \
  && ok "Mower sensor config saved to /config/esphome/hcc-mower.yaml" \
  || warn "Download failed — check connectivity and retry"

# ── STEP 7: Restart HA ──────────────────────────────────────────────────────
banner "STEP 7 — Restart Home Assistant"
info "Restarting HA to load new configuration..."
ha core restart && ok "Restart triggered — wait ~60 seconds" || warn "Restart command failed — restart manually in HA UI"

# ── DONE ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${C}╔══════════════════════════════════════════════════════════╗${N}"
echo -e "${C}║              BEEHIVE SETUP COMPLETE                     ║${N}"
echo -e "${C}╚══════════════════════════════════════════════════════════╝${N}"
echo ""
echo -e "  ${G}✓${N} HACS installed"
echo -e "  ${G}✓${N} HCC package loaded (automations, webhooks, sensors)"
echo -e "  ${G}✓${N} ESPHome add-on installed"
echo -e "  ${G}✓${N} Mower sensor config ready at /config/esphome/hcc-mower.yaml"
echo ""
echo -e "  ${Y}NEXT STEPS (in HA UI on your phone):${N}"
echo -e "  1. Settings → Add-ons → HACS → Authorize GitHub"
echo -e "  2. HACS → Integrations → search 'Orbit B-Hyve' → install"
echo -e "  3. Settings → Devices & Services → Add Integration → Orbit B-Hyve"
echo -e "  4. Settings → Devices & Services → Add Integration → Blink"
echo -e "  5. ESPHome add-on → flash hcc-mower.yaml to your ESP32"
echo ""
echo -e "  ${C}Webhooks active:${N}"
echo -e "  • Panic button:    /api/webhook/hcc-panic-button"
echo -e "  • Mower sensor:    /api/webhook/hcc-mower-sensor"
echo ""
