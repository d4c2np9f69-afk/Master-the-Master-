# Irrigation Pit Leak Sensor — settled design (Jeff + Claude, 2026-08-18)

One Zigbee probe-style leak sensor watches ALL 6 pit valves + the new master/anti-siphon
valve, for $0 beyond parts on hand. Designed conversationally 08-18; Jeff's refinements
beat every earlier version.

## Topology
```
[Control box: B-Hyve + USB repeater (open outlet) + SENSOR BODY]   <- all dry, radio trivial
      |-- splice #1 (dry box, regular connections)
      |-- two SPARE CONDUCTORS in the existing buried irrigation bundle
      |-- splice #2 at pit (SEALED - heat shrink/waterproof nuts; in-ground boxes
      |   run near 100% humidity in summer, corrosion is the enemy, not leak day)
      |-- FACTORY PROBE TIP, pins down, at the LOW end of:
[3" PVC pipe cut in half lengthwise = 3 ft trough, ends capped, no holes,
 bedded into the pit gravel under the valve row, pitched toward the probe]
```
- Second detection point IN PARALLEL at the control box: 6-8" offcut of the same
  half-pipe, ends dammed, under the new master/anti-siphon valve. Two stainless
  screws through the side wall ~1/4" up, spaced to match the factory probe pins,
  wires under heads, heat shrink at the wall, silicone over the outside.
- Gravity is the multiplexer: any drip anywhere over either trough migrates to the
  electrodes. Pooling = trigger; humidity/splash alone can't bridge.
- Entity name: **Irrigation Pit Leak** -> added to automation.hcc_water_leak_alarm.
- Can't tell WHICH point fired (accepted): they're 20 ft apart, eyes solve it; B-Hyve
  zone timing + meter signatures fingerprint the culprit valve.

## Physics notes (why this works)
- Conductivity sensing = DC resistance; splices/extensions add ~nothing vs the
  wet/dry threshold. 20 ga thermostat wire fine to 50+ ft. Not coax; nothing degrades.
- Parallel detection points: analog leakage budget, ~5-6 points OK; we use 2.
- Verify spare conductors before use: end-to-end continuity; pair-to-pair OPEN when
  dry; cut back to fresh copper; tape off unused spares individually.

## Verification protocol (on build day)
1. Pair sensor (body at control box) -> name -> add to leak alarm.
2. Wet-finger the PIT probe -> confirm alarm push. Dry, clear.
3. Wet-finger the MASTER tray screws -> confirm again. Both points proven independently.

Related: mailbox/pit RF lesson (metal/below grade kills radio -> keep bodies in clean
air, run copper); repeater #2 lives in the control-box outlet, also serving yard mesh.
