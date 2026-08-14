# Zigbee dimmer selection — researched 2026-08-13

## Rejected: Enbrighten Z-Wave 800 toggle dimmer ($39)
**Wrong radio.** Z-Wave (908 MHz) cannot talk to the Haozee CC2652P1 Zigbee dongle.
Would need a second ~$40 Z-Wave stick + a second ecosystem. Real cost for 2 switches:
~$118 vs $92 Zigbee. Rejected.

## Rejected: Enbrighten 43080 (Zigbee paddle dimmer)
Officially Zigbee2MQTT-supported, same QuickFit/SimpleWire body, neutral required — looked
like the value pick. **BUT Zigbee2MQTT's own device page carries two explicit warnings:**
- "Some Enbrighten devices may cause issues with larger networks. In particular, they may
  stop relaying messages for child devices."
- "Some Enbrighten devices will not respond to route update requests after a while."
Jeff's stated requirement is that switches EXTEND the mesh (garage needs range help). A switch
with documented routing defects fails that requirement outright. **Rejected — this is the whole
reason to check before buying.** Also: Zigbee line is paddle-only (toggles are Z-Wave), and
3-way support on the Zigbee model could not be verified.

## SELECTED: Inovelli Blue 2-1 VZM31-SN (~$46-60)
- Zigbee 3.0, mains-powered router, **no routing warnings on its Z2M page** (direct contrast)
- **Dumb-3-way CONFIRMED supported** via configuration — solves the garage 2-location problem
  (closes the old HS200/HS210 open question). Caveat: scene parameters 1-2/5-6 don't fire when
  the dumb switch is pressed manually — expected, not a defect.
- Neutral required for 3-way dumb setups — Jeff has neutrals in every box ✓
- Load: on/off variant rated 1800W general purpose; dimmer LED rating not re-verified this
  session, but Jeff's loads are ~108W — far below any dimmer's limit.
- Costs more, but it is the only option that satisfies "must extend the mesh."

**Lesson: "Zigbee2MQTT supported" ≠ "good Zigbee citizen." Check the device page's warnings.**
