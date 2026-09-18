# What we can automate with what you already own

**Thu 2026-09-17, 10:45 PM.** Jeff: *"look at all my inventory and research ways I can use things I
already have... little to no cost... also look into things that we already have that can be used
better like all the sensors we found by using the ambient weather that had sensors we were not
even using."*

Two halves. **Part 1 is an audit of your own house** — measured live tonight off Home Assistant,
not guessed. **Part 2 is the outside research** — HA forums, NAWCC (the clock collectors' board),
Hackaday, ESPHome docs, hearth trade forums, Reddit.

> 🔴 **PRICES ARE UNVERIFIED.** Every dollar figure below came back without a confirmed live
> listing. Nothing here is a recommendation to buy until I price it for real. The $0 items are
> $0 because they use hardware you already own — those are safe to act on.

---

# PART 1 — WHAT YOU ALREADY HAVE AND AREN'T USING

Pulled from the live HA instance tonight: **552 entities, 183 of which nothing in the app or any
automation references.** The ones worth acting on:

## 🔴 The one that stings

**Your printer ink has been in Home Assistant the whole time.**

| entity | value | last updated |
|---|---|---|
| `sensor.hp_officejet_4650_series_black_ink` | **80 %** | 27 h ago |
| `sensor.hp_officejet_4650_series_tri_color_ink` | **40 %** | 27 h ago |
| `sensor.hp_officejet_4650_series` | idle | 8.6 h ago |

You asked this afternoon why I couldn't see ink levels and I went and scraped the HP web server.
HA already had it. **Colour is at 40 %** — worth knowing before the next colour-coded bid sheet.
→ Put both on the app's HOME card; alert under 20 %.

## Free hardware sitting completely idle

| What | State | Note |
|---|---|---|
| **`Spare Contact 1`** | paired, **battery 100 %**, LQI 102, live | A Zigbee contact sensor **already on the mesh**, attached to nothing. Free, tonight. |
| **`switch.hot_water_heater_socket_1`** — "Hot Water Circulation Pump" | off, **untouched 98 h** | Smart socket on the recirc pump. Nothing schedules it. |
| **`switch.mini_smart_socket11_2_socket_1`** — "Garage fan" | off, 24 h | We spent this afternoon on garage cooling and this was sitting right here. |
| **`switch.bed_lamp_socket_1`** / **`switch.smart_socket_2_socket_1`** | off | Your bed lamp and Angela's, both on smart sockets, zero automation. |
| **`light.floating_repeater`** / **`light.garage_repeater`** | on | The Zigbee repeaters expose light entities too. |

## Data being collected and thrown away

- **Water monitor** — last session **105.3 gal**, current session **35.5 gal**, updating this
  minute. Plus `leak_alert_sensitivity` and `expected_low_flow_baseline` dials nobody has turned.
- **The Mercedes** — tire pressures **34 / 33 / 34 / 33 psi**, all four windows + sunroof, brake
  fluid, coolant, washer fluid, theft-armed, engine state, eco scores.
  🔴 *Not lock, not fuel — both settled, leaving them alone.*
- **Zigbee battery voltages on every sensor** — and **Back Deck Door reads 2,900 mV against 3,000
  for all the rest.** First cell heading down and nothing is watching.
- **Every Zigbee link-quality sensor** — mesh health, unwatched.
- **Beehive health** — CPU **109.4 °F**, disk **92.6 % free**, last backup succeeded 17 h ago,
  next scheduled tomorrow 09:54.
- **Speedtest** — **476 ↓ / 104 ↑ / 32 ms**, refreshed 18 min ago, surfaced nowhere.
- **`todo.shopping_list`** — untouched 8 days. Alexa can write to it by voice.
- **iPhone sensors** — steps, floors climbed, battery, activity, barometric pressure, for both phones.

*(Caveat: that list came from a grep pass, so a few may be referenced somewhere I didn't catch.
I'll confirm each before anything gets built on it.)*

---

# PART 2 — THE RESEARCH

## 🕰 THE GRANDFATHER CLOCK

**Reality check first: almost nobody instruments a real one.** Everything on the HA forums under
"grandfather clock" is people *simulating* Westminster chimes through a speaker. Actual mechanical
clock instrumentation lives on the horology boards, not the smart-home ones.

### ✅ Do this one — winding log + "you forgot to wind it" — **$0, Easy**
Spare Zigbee contact sensor on the case door. Every open = "clock was serviced." A template sensor
gives days-since-wound; nag at 6–7 days on an Echo.

```jinja
{{ ((now() - states.binary_sensor.clock_door.last_changed).total_seconds() / 86400) | round(1) }}
```

An 8-day movement running down is the #1 real failure mode. Zero parts, zero risk to the movement,
and it doubles as a service history (last oiled, last regulated).

### ⚠️ "The clock has stopped" — **do it the right way**
🔴 **NEVER put a Zigbee contact sensor on the pendulum.** It beats ~1×/second and the sensor
reports every change — **~86,400 Zigbee messages a day.** It would flatten a CR2032 in hours and
visibly degrade your 12-device mesh.

**Right way:** spare ESP32 + ESPHome `pulse_counter` reading a photointerrupter or a reed+magnet on
the bob. Reports **pulses per minute once a minute** instead of 86,400 times a day. Under 5 BPM for
two minutes → "clock stopped."
Reference build (ESP32 + OPB703 + GPS time reference, measures drift and beat asymmetry to
microseconds): [raynerd.co.uk](https://raynerd.co.uk/diy-clock-beat-analyser-pendulum-timer-with-gps/) ·
[NAWCC thread](https://mb.nawcc.org/threads/diy-pendulum-timer-%E2%80%93-gps-synced-beat-analyzer-using-esp32.216201/)
Needs one photointerrupter (~$3, unverified) — or a reed switch from the junk drawer.

**The genuinely interesting bit:** plot pendulum BPM against room temperature. A brass pendulum
lengthens when warm and loses time — you'd see exactly how much of the clock's drift is your HVAC
versus the regulation.

### 🛑 Silencing the chime at night — **don't automate it**
1. **Go look at the dial first.** Most quality movements (Howard Miller, Hermle, Kieninger,
   Ridgeway) already have **automatic night shutoff** ~10:15 PM–7:15 AM *and* a manual silence
   lever on the right of the dial.
2. The DIY "stop the pendulum overnight" build exists
   ([Hackaday](https://hackaday.com/2012/04/01/quieting-a-pendulum-clock-every-night/)) and the
   clock people in the comments panned it — stopping the clock hurts accuracy and repeated
   stop/start gums the oil. On the [NAWCC thread](https://mb.nawcc.org/threads/any-device-to-silence-grandfather-clock-chime-from-10-p-m-to-5-a-m.187298/)
   nobody endorsed a solenoid, and one member points out blocking the governor is self-defeating
   because **the movement auto-corrects the missed strikes within a couple of hours anyway.**

**Verdict: use the silence lever like a human.**

---

## 🧺 WASHER AND DRYER

**Structural fact: these are two different problems.** Washer is 120 V. **The electric dryer is
240 V on a 30 A circuit — no 120 V smart plug can ever be used on it**, physically or electrically.

### Ranked by real-world reliability (from forum reports, not vendor claims)

| # | Method | For | Verdict |
|---|---|---|---|
| 1 | Power / current monitoring | washer (plug), dryer (CT clamp) | **Best.** Sees actual machine state. |
| 2 | Dryer exhaust temperature + trend | dryer | Very good, no electrical work, 2–5 min lag |
| 3 | LDR taped over the "done" LED | either, if it has one | Near-perfect when applicable |
| 4 | Real accelerometer (MPU-6050) | either | Works **if** tuned from logged data |
| 5 | Cheap vibration switch (SW-420) | either | **Documented to fail** — see below |
| 6 | Door contact sensor | either | Not a cycle sensor — a *"you left it in there"* sensor |
| 7 | Acoustic buzzer detection | either | Abandoned by the person who wrote HA's own blog post |

### 🥇 TRY THIS FIRST — **$0, 5 minutes, zero hardware**
**Alexa Routines support Sound Detection → "Beeping Appliance"** as a trigger. You already have
Echo Dots. Have the routine flip a virtual switch that HA reads, and you're done.
[TechHive](https://www.techhive.com/article/829164/alexa-washing-machine-alert.html) ·
[Reviewed](https://www.reviewed.com/smarthome/features/sound-detection-for-alexa-routines)
**Honest:** results are mixed — a tester's 4th-gen Dot missed a washer's end chime across a long
room, and it fires on *any* beeping appliance in earshot. But it costs nothing and if it works,
everything below becomes optional.

### The false-positive trap that ruins every naive version
Washers pause. Soak cycles, tumble-and-settle, and the dryer's **wrinkle-prevent tumble** all drop
power to near zero mid-cycle, and the automation announces "done" three times a load. The fix
everyone converges on:

```yaml
binary_sensor:
  - platform: template
    sensors:
      washer_running:
        value_template: "{{ states('sensor.washer_power')|float > 10 }}"
        delay_on:  "00:10:00"   # ignore blips
        delay_off: "00:03:00"   # ride through mid-cycle pauses
```
Real numbers from [the canonical thread](https://community.home-assistant.io/t/detecting-washer-dryer-status-with-energy-monitor/81061):
washer 400–600 W running; a gas dryer ~2,100 W spike then ~800 W. One implementer admits he still
gets an occasional miss *"when the two pauses are exactly 5 minutes apart"* — about one wrong
notification a month is the honest ceiling.

### The washer — check your Tuya plug first
You own **one Tuya WiFi smart plug, US 10 A.** Two things to check before counting on it:
1. **Does it report watts at all?** Most cheap Tuya 10 A plugs are on/off only. Look at its
   entities in HA — no power entity means it can't do this job.
2. **10 A = 1,200 W.** Fine for most top-loaders; tight if yours has an internal water heater.

### 🔧 The dryer — the electrician's answer
**Option A — exhaust vent temperature. ~$3–5, no electrical work.**
DS18B20 or DHT22 taped to the metal exhaust duct + your spare ESP32. Temp climbs with the heater,
**falls sharply at cycle end**; HA's `trend` platform turns that into a binary sensor.
[Trend sensor thread](https://community.home-assistant.io/t/setting-up-a-trend-sensor-with-conditions-clothes-dryer-automation-from-vent-temperature/475636) ·
[Making a Dumb Dryer Smart](https://www.bauerpower.tech/making-a-dumb-dryer-smart/)
**Bonus you'd actually care about: abnormally high vent temp = restricted duct = lint fire warning.**
**Limits:** air-fluff / timed-low never gets hot enough to register; 2–5 min lag.

**Option B — CT clamp on L1. ~$10–15. This is your wheelhouse.**
SCT-013-030 split-core CT clamped on **L1 inside the dryer j-box or at the breaker**, into your
spare ESP32 running ESPHome's [`ct_clamp`](https://esphome.io/components/sensor/ct_clamp.html).

🔴 **Why L1 specifically:** on a US split-phase dryer the **heating element runs L1–L2 while the
drum motor runs L1–neutral**, so only L1 sees both. Clamp L2 alone and you'd read "stopped" every
time the element cycles off. Documented in the best US-specific writeup:
[Kyle Niewiada's dryer CT build](https://www.kyleniewiada.org/blog/2020/09/dryer-notification-addendum/)
— running ≥ 10 W, readings < 2 W filtered to zero, 10-second delay so opening the door mid-cycle
doesn't fire.
**He switched to CT *because a vibration sensor was giving him ~1 false alert per week*** — the
most direct head-to-head I found, and it favours current sensing decisively.
The **-030 variant has an internal burden resistor** and outputs 0–1 V, so you only need a 1.65 V
bias divider. CT is galvanically isolated — never touches a conductor. **Standard rule: never open
a CT secondary while current flows in the primary.**

### ❌ The cheap vibration sensor trap
The SW-420 is the $2 part everyone reaches for. The HA forum is full of its failures:
*"it can change from off to on or the opposite and then stay there until the next vibration"* —
i.e. **it latches ON forever after the cycle ends**
([thread](https://community.home-assistant.io/t/vibration-sensor-sw-420-detection/190225)) ·
*"about half the time it just doesn't clear"*
([thread](https://community.home-assistant.io/t/vibration-sensor-doesnt-clear-sometimes/870610)).
False-triggers just from closing the door. A **real accelerometer** (MPU-6050) tuned against logged
data does work — that's what [HA's own blog post](https://www.home-assistant.io/blog/2016/08/03/laundry-automation-update/)
used, after trying sound sensors first and finding them unreliable. **If your washer and dryer sit
side by side, cross-talk between them is near-certain.**

**The layer most people skip:** that same blog author added **reed switches on both machine doors**
so the system knows when the laundry was actually *removed*. That's what enables *"the laundry is
still sitting in the washer"* — the notification that actually changes behaviour. You have spare
contact sensors for exactly this.

---

## 🔥 GAS LOGS — read all of this before touching anything

### The electrical half is easy and normal
A millivolt gas valve is self-powered: a **thermopile** in the pilot flame makes **325–750 mV DC**,
and that holds the main valve open. The **TH / TH-TP terminals are just a switch input** — your
wall switch does nothing but close a bare contact across them. A dry-contact relay there is
*exactly* what the factory switch does. This is standard practice:
[Fireplaces Direct](https://fireplacesdirect.com/blogs/learning-center/how-to-automate-a-fireplace) ·
[HomeTechHacker](https://hometechhacker.com/creating-a-smart-fireplace-switch-with-a-shelly-relay/) ·
[ChrisHansenTech](https://chrishansen.tech/posts/gas-fireplace-home-assistant/) ·
[Hearth.com](https://www.hearth.com/talk/threads/installing-24-volt-wifi-thermostats-on-millivolt-stoves.114018/page-4)

🔴 **"Sending 120 V AC into a millivolt valve will instantly destroy the solenoids."**

### 🔴 THE PART NUMBER TRAP — YOUR SPARE RELAY IS THE WRONG ONE
Your spare **"16 A/20 A Tuya WiFi mini switch module, 2-way"** is almost certainly a
**mains-switching** module: its relay output is internally fed from the L terminal, so the "output"
carries 120 V — **the exact thing that destroys a millivolt valve.**
**Read its terminals. If it says L / N / L-out, it is NOT usable here.** Don't improvise this one.

Your **SONOFF MINI-D** *is* a true dry-contact device (NO/COM/NC, contacts isolated from its own
supply) — but both of yours are in use (garage door, A/C relay), so this would be a third unit.

**Two other electrical gotchas:**
1. **Contact material.** Millivolt is low voltage *and* low current, so there's no wetting current
   to burn through an oxide film. Purpose-built millivolt switches use **silver or gold** contacts
   for this reason. A cheap relay may work a year then intermittently fail to light. Failure mode
   is benign (won't ignite, not won't-shut-off) but annoying. Keep the run short and heavy.
2. **Power loss = no control.** Keep a manual path that bypasses the relay entirely.

### The safety half — and this is where I'd push back
**Step zero: which kind of logs do you have?** The whole risk profile forks here.

| | **Vented decorative** (ANSI Z21.60) | **Vent-free** (ANSI Z21.11.2) |
|---|---|---|
| Exhaust | up the chimney | **into the room** |
| Damper | **permanently blocked open** | n/a |
| Safety device | safety pilot / flame safeguard | **ODS pilot** |
| Heat value | almost none, decorative | it's a heater |
| Legal everywhere? | yes | **no** |

**If they're vent-free I would not automate ignition at all.** The ODS **does not detect carbon
monoxide** — it detects oxygen depletion, and it sits low in cool fresh air while hot combustion
products rise and pool at the ceiling
([InterNACHI](https://www.nachi.org/ventless-fireplace-inspection.htm),
[CO2Meter](https://www.co2meter.com/blogs/news/oxygen-depletion-sensor-vs-carbon-monoxide-detector)).
Vent-free is fully banned in California and restricted in parts of NY, MN and CO, and prohibited in
HUD housing nationwide. Tennessee allows them — but the reason other states don't is the reason to
be careful. Manuals also say *"if heater shuts off, do not relight until you provide fresh air"* —
an automation that relights on a schedule after an ODS trip does the exact opposite.

**Under IFGC/NFPA 54 the manufacturer's instructions are enforceable code.** Read the sticker
inside your firebox; that's the governing document, not a forum.

### ✅ What I'd actually build: **let HA turn it OFF, never ON**
**Wire the relay's NC contacts in SERIES with the existing wall switch — not in parallel.**

- Relay de-energized (HA down, WiFi down, power out) → **contacts closed → the wall switch works
  exactly as always.** Fail-safe.
- HA energizes → contacts open → **fire goes out and cannot be relit until HA releases it.**
- **A human must physically flip the switch to light it.** No remote ignition exists. Nobody can
  accidentally light a fireplace with a blanket, a stack of Christmas presents or a sleeping dog in
  front of it — the most realistic way this hurts someone, and no sensor in HA can see it.

Then the automations that are pure upside:
1. **Auto-off after 60–90 min** (factory controls use 30–120 min timers)
2. **Room-temp ceiling** — off above ~76 °F. You already have the sensors.
3. **Away / geofence off** — Fireplaces Direct explicitly recommends this
4. **Bedtime lockout** — 11 PM–6 AM
5. **CO / smoke interlock** — any alarm trips → relay opens → announce on every Echo
6. **Inline manual toggle** ahead of the relay for service

**The honest case against, stated fairly:** nothing in the chain can verify the hearth is clear or
that the glass doors are open. The thermopile is the only flame-proving device — no purge, no
pressure switch, nothing like a furnace has. A misfire in the *lighting* path is a non-event; a
misfire in the *off* path is not. And automating a listed gas appliance beyond its listed
accessories is a real insurance question.
**In fairness:** millivolt valves are *designed* to be thermostat-driven, and ANSI-listed RF
receivers do exactly what a relay does. The difference is listing and liability, not physics.

**🟢 Zero-risk version if you want to start small: don't control it — MONITOR it.** A temperature
sensor near the firebox gives HA a reliable "fireplace is ON" sensor, which enables *"it's been on
3 hours"* and *"you left with the fireplace lit"* — **with no relay in the gas circuit at all.**

---

## 🔌 USE WHAT YOU HAVE — the broad list

### Your ~4 spare Zigbee contact sensors — $0 each
The key trick: **you can solder two wires to the reed-switch pads** and turn any contact sensor
into a wireless input for *any* dry contact —
[the definitive thread](https://community.home-assistant.io/t/a-list-of-door-sensor-reed-sensor-hacks-aqara-xiaomi-others/443598).
Your SNZB-04s are named there as hackable. Builds people have done: float switches, bed-occupancy
FSRs, mechanical doorbell strikers, meter pulse outputs, smoke-alarm relay modules, power-loss
detection, tilt switches.

**No-soldering placements, best value first:**

| Placement | Why |
|---|---|
| **Garage fridge / chest freezer** | *"Door ajar 5 minutes"* — **highest dollar value of any contact sensor.** Mount the body outside the cold zone, magnet only on the door; CR2032s lose capacity below freezing. |
| **Grandfather clock case door** | winding log + reminder (above) |
| **Gun safe / medicine cabinet / liquor cabinet** | instant notify. Steel kills Zigbee — mount on the outside face. |
| **Attic hatch / crawlspace door** | security + *"did the HVAC guy actually go up there"* |
| **Washer + dryer doors** | *"laundry is still sitting in there"* |
| **Breaker panel door** | log every open — useful with contractors in the house |
| **Dog food bin lid** | *"was the dog fed?"* — settles a real household argument |
| **Trash bin lid** | bin-day confirmation |

**Soldered ideas:** sump/tank float switch, well pump pressure switch, irrigation valve
confirmation — and **the garage door photo-eye circuit**, which would have caught that hanging leg
(#168) the moment it happened.

### Your 2+ leak sensors — $0, and the probe-cable one has a job waiting
Best placements by damage prevented:
1. **🔴 The new Carrier's condensate pan.** A clogged condensate line is the #1 cause of ceiling
   damage. The probe-cable sensor is made for this — probe in the pan, body dry above. **Do this
   the day the unit goes in.**
2. Water heater drip pan · 3. behind the washer · 4. under kitchen sink / dishwasher ·
5. both icemaker lines · 6. **dehumidifier bucket** (probe at the full line) · 7. crawlspace low point

**Repurpose trick:** the two probes are just a normally-open contact — extend them and it's a
generic wireless dry-contact input, same as the reed hack
([vdBrink build](https://vdbrink.github.io/zigbee/zigbee_water_leak_sensor.html)).

⚠️ **The trap:** used as a *level* sensor it sits **wet** for long periods and the device wakes and
re-reports constantly — **heavy battery drain.** For anything normally wet, use a **float switch
into a contact sensor** instead; a float is only closed at one level.

🟢 Your Tuya Zigbee siren is already on the leak alarm — every new placement gets it for free.

### Your existing hardwired smoke/CO alarms → HA — the best safety spend on this page
If they're 3-wire interconnected (black/white/red), a **Kidde SM120X relay module** wires into the
interconnect and gives a **dry-contact output when ANY alarm in the house trips**. Feed that into a
spare contact sensor (reed hack) and **every hardwired alarm becomes an HA sensor** — which drives
the fireplace kill above, an all-Echo announcement, and HVAC shutdown.
[Kidde](https://www.kidde.com/products/safety-accessories/smoke-alarm-relay-module) ·
[Konnected](https://konnected.io/products/kidde-sm120x-hardwired-smoke-alarm-relay-module)
**~$25–30 unverified. Verify your alarms are Kidde-compatible interconnect first.** It's a
junction-box wiring job — squarely your wheelhouse.

### The old hardware
- **🥇 HP TouchSmart 520 → wall-mounted HA dashboard.** It's a **23-inch touchscreen all-in-one**.
  That's the single best thing in the old-hardware pile. Kiosk browser, full screen, motion-wake. **$0.**
- **Lenovo B570 → rtl_433 / rtlamr host**, so the SDR stops competing for the Beast's USB and stops
  going dark whenever the Beast reboots.
- **B570 + the KESU 500 GB drive → HA backup target**, off the Beast. Cheap insurance.
- ❌ **Not Frigate** — a Pentium B960 has no usable QuickSync. And the camera stack is frozen.
- ❌ **Not a Bluetooth proxy** — Linux BT adapter support is fragile. Use the ESP32 instead.

### RTL-SDR beyond the meters
⚠️ **One dongle = one job at a time.** rtlamr and rtl_433 both want exclusive tuner control.
**$0 workaround: time-slice it** — run rtlamr in a cron window, rtl_433 the rest. Meter reads once
an hour are plenty.
- **rtl_433 decodes 200+ device types** on 315/433/868/915 MHz. Cheap $12 433 MHz temp sensors
  become HA sensors with **no hub and no Zigbee battery budget** — ideal for crawlspace, attic,
  freezer. [Hackaday](https://hackaday.com/2025/12/06/bridging-rtl-433-to-home-assistant/)
- **TPMS on the F-250** — tire pressure without plugging anything in, *and* a free
  "the truck is home" presence sensor from its own sensor IDs. (Decoders are off by default so
  passing cars don't flood you — enable and filter to his IDs.)
- ❌ **NOAA weather satellites are DEAD — do not start this.** NOAA-18 decommissioned 6 Jun 2025,
  POES suspended 16 Jun, **NOAA-19 decommissioned 13 Aug 2025, NOAA-15 on 19 Aug.** Every tutorial
  online is now stale. [NOAA OSPO](https://www.ospo.noaa.gov/data/messages/2025/08/MSG_20250820_1410.html)

### 🌦 The WS-2902's underused sensors — **$0, and the best find in the whole pass**
You have **solar radiation and UV**, which most people don't, and which unlock the good stuff.

**[`ws_core` — Weather Station Core](https://github.com/kmich/ha_ws_core)** — a HACS integration
that takes a basic station and derives **170+ sensors**, **fully local, no API keys**, and
**explicitly supports Ambient Weather**. You map seven entities and it gives:

- **`sensor.ws_minutes_until_rain`** — a precipitation nowcast **from your own rain gauge**, not a
  forecast API.
- **Real ET₀ evapotranspiration** — proper **FAO-56 Penman-Monteith** *because you have a solar
  sensor*. This is the correct way to run irrigation: water what the lawn actually lost, not a
  timer. Given the leak history and the new Orbit valve, this is the natural next step.
- **Fire danger indices** → a real "good day to burn / do NOT burn" advisory (you already have a
  brush-burn card).
- Frost point, wet-bulb, UTCI heat stress, Zambretti offline barometric forecast, snow-phase.
- **10 ready-made blueprints** — rain alerts, freeze warnings, irrigation skip, wind/awning.

**Automations to build on it, all $0:**
- **Lux-driven lighting instead of sun elevation.** Sun elevation says "it's 4 PM in June";
  irradiance says "a thunderstorm just went dark." Your porch lights will finally behave on
  overcast days.
- **Barometric pressure *trend*** (HA `trend` platform) — a fast drop warns of a storm 30–90 min
  ahead of any app. Pair with "close the windows."
- **Windows-open + rain coming** — the Mercedes reports all four windows and the sunroof, and you
  have a rain-rate sensor. This one writes itself.
- **Wind gust alerts** — trampoline, patio umbrella, trash cans before pickup.
- **Dew point comfort control** — dew point, not RH, is what "muggy" is; above ~65 °F run the fan.
  The right control variable for the new Carrier.
- **Frost warning** → cover plants, drip the outside spigot, confirm irrigation is winterized.
- **"Good day to paint / mow / stain the deck"** — temp band + dew point + wind + rain-last-24h +
  hours-until-next-rain. Only works with a *local* station.

### The spare ESP32 — what to do with it first
1. **🥇 ESPHome Bluetooth Proxy. 10 minutes, $0.** HA instantly gains BLE reach for temperature
   tags, plant sensors and presence beacons.
   [docs](https://esphome.io/components/bluetooth_proxy/)
2. Dryer CT clamp (above)
3. Pendulum pulse counter (above)
4. **DS18B20 multi-probe node** — one ESP32 carries several probes on one 1-Wire bus at ~$1/probe:
   dryer vent, freezer, crawlspace, attic.

⚠️ **Your Delam XLR mic is the wrong tool** — it needs 48 V phantom power and an audio interface.
Don't let "we own a microphone" suggest a free path; there isn't one.

### ❌ The ELM327 / F-250 — skip it
No first-party HA integration exists; every path is hand-rolled per-vehicle PID work. The dongle
only talks while the truck runs *and* is in Bluetooth range — for a truck parked outside, basically
never. Leaving an ELM327 permanently plugged in is also a known **parasitic battery drain** on some
vehicles. **Get the truck's useful signals from TPMS via rtl_433 instead.**

---

# THE SHORTLIST

## Do these first — genuinely $0, hardware you already own
1. **Alexa Sound Detection → "Beeping Appliance"** for the laundry. 5 minutes. May solve it entirely.
2. **Printer ink onto the app** — the data is already there.
3. **Put `Spare Contact 1` on the chest freezer or garage fridge** — it's paired and idle right now.
4. **Contact sensor on the grandfather clock door** → winding log.
5. **Leak sensor into the new A/C condensate pan** the day it's installed.
6. **Flash the spare ESP32 as a Bluetooth proxy.**
7. **Install `ws_core` from HACS** — ET₀ irrigation, rain nowcast, frost, fire danger.
8. **Barometric-trend, lux-driven lighting, windows-open-before-rain.**
9. **Schedule the hot water recirc pump** — it's been off 98 hours with nothing driving it.
10. **Battery-voltage watch on the Zigbee fleet** — Back Deck Door is already at 2,900 mV.

## Small spends — ALL PRICES UNVERIFIED, I price them before you buy
11. DS18B20/DHT22 on the dryer vent (~$3–5) → dryer-done **+ blocked-vent fire warning**
12. SCT-013-030 CT clamp (~$10–15) on the dryer's L1 → the most reliable detection there is
13. Kidde SM120X (~$25–30) → every hardwired smoke/CO alarm becomes an HA sensor
14. Energy-monitoring plug for the washer — **only if** your Tuya plug has no power reporting
15. Photointerrupter (~$3) → pendulum rate and "clock stopped"

## Do NOT do
- ❌ Zigbee contact sensor on the pendulum — 86,400 messages/day, dead battery, degraded mesh
- ❌ SW-420 cheap vibration sensors for laundry — documented to latch on and false-trigger
- ❌ NOAA APT satellite reception — all four satellites decommissioned in 2025
- ❌ Frigate on the B570 — and the camera stack is frozen regardless
- ❌ Stopping the pendulum or blocking the chime governor — use the silence lever
- ❌ **Wiring the Tuya 16 A mains module to a millivolt gas valve — it will destroy the valve**
- ❌ Remote *ignition* of the fireplace — wire NC in series so HA can only turn it **off**
- ❌ ELM327 permanently in the F-250 — parasitic drain, near-zero payoff
