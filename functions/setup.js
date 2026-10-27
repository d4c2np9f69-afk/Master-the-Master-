// Serves the Beehive install script at /setup
// Usage from HA Terminal: curl -fsSL https://toro1-5rz.pages.dev/setup | bash

const SCRIPT = `#!/usr/bin/env bash
HCC_BASE="https://toro1-5rz.pages.dev"
R='\\033[0;31m' G='\\033[0;32m' C='\\033[0;36m' Y='\\033[1;33m' N='\\033[0m'
OK="\${G}✓\${N}" ERR="\${R}✗\${N}" INFO="\${C}→\${N}"
banner() { echo -e "\\n\${C}══ $1 ══\${N}"; }
ok()     { echo -e "  \${OK}  $1"; }
info()   { echo -e "  \${INFO}  $1"; }
warn()   { echo -e "  \${Y}⚠\${N}  $1"; }
die()    { echo -e "  \${ERR}  $1"; exit 1; }

echo ""
echo -e "\${C}╔═══════════════════════════════════════════════════╗\${N}"
echo -e "\${C}║     HOME COMMAND CENTER — BEEHIVE BRAIN SETUP    ║\${N}"
echo -e "\${C}║         Standalone · No Windows Required          ║\${N}"
echo -e "\${C}╚═══════════════════════════════════════════════════╝\${N}"
echo ""

[[ -d /config ]] || die "Must run from inside the Beehive HA Terminal add-on"

banner "STEP 1 — HACS"
if [[ -d /config/custom_components/hacs ]]; then
  ok "HACS already installed — skipping"
else
  info "Installing HACS..."
  curl -fsSL https://get.hacs.xyz | bash - && ok "HACS installed" || warn "HACS install returned non-zero"
fi

banner "STEP 2 — HCC Package Directory"
mkdir -p /config/packages
ok "Directory ready: /config/packages"

banner "STEP 3 — HCC Configuration Package"
cat > /config/packages/hcc.yaml << 'HCCPKG'
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
automation:
  - id: hcc_panic_button
    alias: "HCC — Panic Button"
    mode: single
    trigger:
      - platform: webhook
        webhook_id: hcc-panic-button
        allowed_methods: [POST, GET]
        local_only: false
    action:
      - service: input_boolean.turn_on
        target: {entity_id: input_boolean.hcc_panic_active}
      - service: light.turn_on
        target: {entity_id: all}
        data: {flash: long}
      - service: persistent_notification.create
        data:
          title: "🚨 EMERGENCY ALERT"
          message: "HCC Panic triggered at {{ now().strftime('%I:%M %p') }}"
          notification_id: hcc_panic
      - delay: "00:00:30"
      - service: input_boolean.turn_off
        target: {entity_id: input_boolean.hcc_panic_active}
  - id: hcc_mower_sensor_sync
    alias: "HCC — Mower Sensor Sync"
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
            target: {entity_id: input_number.mower_hours}
            data:
              value: "{{ [payload.hours | float(0), states('input_number.mower_hours') | float(0)] | max | round(1) }}"
      - if:
          - condition: template
            value_template: "{{ payload.battery is defined and payload.battery | float(0) > 0 }}"
        then:
          - service: input_number.set_value
            target: {entity_id: input_number.mower_battery_voltage}
            data:
              value: "{{ payload.battery | float(0) | round(2) }}"
      - service: input_text.set_value
        target: {entity_id: input_text.mower_last_sync}
        data:
          value: "{{ now().isoformat() }}"
  - id: hcc_freeze_warning
    alias: "HCC — Freeze Warning"
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
          message: "Temp below 34°F — consider winterizing your B-Hyve irrigation."
          notification_id: hcc_freeze
  - id: hcc_weather_severe
    alias: "HCC — Severe Weather Alert"
    mode: single
    trigger:
      - platform: state
        entity_id: weather.home
        to: [lightning, lightning-rainy, exceptional, hail]
    action:
      - service: persistent_notification.create
        data:
          title: "⛈ Severe Weather"
          message: "Conditions: {{ states('weather.home') | title }}"
          notification_id: hcc_weather_severe
script:
  hcc_good_night:
    alias: "HCC — Good Night"
    icon: mdi:weather-night
    sequence:
      - service: light.turn_off
        target: {entity_id: all}
      - service: persistent_notification.create
        data:
          title: "🌙 Good Night"
          message: "HCC locked down at {{ now().strftime('%I:%M %p') }}"
HCCPKG
ok "HCC package written to /config/packages/hcc.yaml"

banner "STEP 4 — Configuration"
CONFIG=/config/configuration.yaml
if grep -q "packages:" "\$CONFIG" 2>/dev/null; then
  ok "Packages already configured in configuration.yaml"
else
  info "Adding packages loader..."
  cat >> "\$CONFIG" << 'CFGPATCH'

homeassistant:
  packages: !include_dir_named packages
CFGPATCH
  ok "configuration.yaml updated"
fi

banner "STEP 5 — ESPHome Add-on"
ha addons install a5d21c77_esphome 2>/dev/null && ok "ESPHome installed" || warn "Already installed or check UI"
ha addons start a5d21c77_esphome 2>/dev/null && ok "ESPHome started" || true

banner "STEP 6 — Mower Sensor Config"
mkdir -p /config/esphome
curl -fsSL "\${HCC_BASE}/beehive/esphome/hcc-mower.yaml" -o /config/esphome/hcc-mower.yaml \\
  && ok "Mower config saved to /config/esphome/hcc-mower.yaml" \\
  || warn "Download failed — retry after setup"

banner "STEP 7 — Restart Home Assistant"
ha core restart && ok "Restart triggered — wait ~60 seconds" || warn "Restart manually in HA UI"

echo ""
echo -e "\${C}╔══════════════════════════════════════════════════════════╗\${N}"
echo -e "\${C}║              BEEHIVE SETUP COMPLETE                     ║\${N}"
echo -e "\${C}╚══════════════════════════════════════════════════════════╝\${N}"
echo ""
echo -e "  \${G}✓\${N} HACS installed"
echo -e "  \${G}✓\${N} HCC automations + sensors loaded"
echo -e "  \${G}✓\${N} ESPHome add-on installed"
echo -e "  \${G}✓\${N} Mower sensor config ready"
echo ""
echo -e "  \${Y}NEXT STEPS:\${N}"
echo -e "  1. HACS → Authorize GitHub"
echo -e "  2. HACS → install Orbit B-Hyve integration"
echo -e "  3. Settings → Add Integration → Orbit B-Hyve"
echo -e "  4. Settings → Add Integration → Blink"
echo -e "  5. ESPHome → flash hcc-mower.yaml to your ESP32"
echo ""
echo -e "  \${C}Webhooks ready:\${N}"
echo -e "  • Panic:         /api/webhook/hcc-panic-button"
echo -e "  • Mower sensor:  /api/webhook/hcc-mower-sensor"
echo ""
`;

export async function onRequest() {
  return new Response(SCRIPT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
