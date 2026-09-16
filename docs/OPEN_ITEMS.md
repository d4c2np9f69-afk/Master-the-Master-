# ✅ HCC — THE TODO LIST

**Only things somebody is going to DO.** Findings, lessons, stop signs and finished work do not
live here — see the pointers at the bottom. Jeff, 2026-09-16: *"If it's not a direct action item
move it where it needs to go to be referenced if needed, but not in the damn todo list."*

**RULE: strike an item in the same commit that finishes it, with the command or observation that
proved it.** A list that disagrees with reality makes the next session confidently wrong.

---

## 🔨 ACTION ITEMS

| # | What | Owner | Unblocked by |
|---|---|---|---|
| **#160** | His location is still exposed — fingerprinting is not IP geolocation | **CLAUDE** | nothing. This one is mine. |
| **#158** | Contactor `3100A15Q152L` sourced — **which unit did it come off?** | **JEFF** | one sentence from him |

---

## 🔵 WAITING ON JEFF — do not work these, do not nag

**His hands** (physical, or a credential only he can enter):
`#3 / #3b / #118` one `bw unlock` · `#4` Secure Boot BIOS · `#5` password rotation ·
`#11` mount the last ~3 sensors · `#23` live TV skip test · `#25` wall iPad · `#26` OBD box ·
`#58 / #58b` two HomeKit codes (in `HCC_ACCESS.md`) · `#112` GaragePC · `#113` `Document (6).docx`
→ safe · `#119 / #121 / #122` zone-4 bonnet swap — ⚠️ **do NOT energise zone 4 until repaired**

**His go / his decision** (one word each):
`#10` arm panic **and** disable the old one · `#39` + the alarm subsystem · `#28` URL rotation ·
`#84 / #85 / #127` **one Z2M restart**, held for the repeater still in shipping · `#106` the A/C job ·
`#131` after the proof run · `#27` Smart Stall *("do not start until Jeff says go")* ·
**`#183`** the utility-card half of the Cloudflare fix — written, tested, **shipped switched off**

---

## 🚨 THE ONE BIG THING GENUINELY NOT BUILT — THE ALARM SUBSYSTEM

**Jeff, 2026-09-10: *"Alarms not built !!!"*** He is right. It is one system, not four half-tasks:

| piece | row | state |
|---|---|---|
| Door / window alerting | `#39` | nothing alerts on any door opening — 43 automations, not one triggers on a contact |
| Panic button | `#10` | v2 built and disabled; the OLD one that reaches nobody is still armed |
| Sirens | — | not built; the TS0224 was judged too weak and reassigned to the leak alarm |
| Fire detection | — | not built at all — no smoke/CO sensors exist |
| Sensors it runs on | `#11` | 9 of 12 mounted |

🔴 **Build it as ONE subsystem, not as orphans — Jeff's own instruction.** It needs his go, and it
is the largest real piece of work left anywhere in this project.

---

## ⛔ FROZEN FOR THIS SESSION

Enforced by `windows-scripts/hooks/Hook-RequireRead.ps1`, listed in `.claude\session-freeze.txt` —
the gate blocks these, so it is not a matter of remembering.

- **Cameras** — Jeff, 2026-09-16: *"We said no cameras tonight."* Also `#181`'s remaining half.
- **Genealogy** — *"Genealogy is not the main priority here, the project is!"* → `docs/genealogy/OPEN_GENEALOGY.md`

---

## 📚 WHERE EVERYTHING ELSE WENT

| what | where |
|---|---|
| Findings, records and stop signs (`#99` `#129` `#136` `#141` `#181`) | `docs/FINDINGS_AND_STOPS.md` |
| Genealogy backlog (`#150` `#153` `#155` `#156` `#157`) | `docs/genealogy/OPEN_GENEALOGY.md` |
| **Everything ever closed, in full** | `docs/OPEN_ITEMS_CLOSED.md` |
| What an error cost and the rule it broke | `docs/COST_LEDGER.md` |
| How to reach any live system | `docs/ACCESS_MAP.md` |

**2026-09-16: this file went from 3,601 lines to this.** 24 rows closed against live evidence, the
reference material filed where it belongs, and the remainder is two action items. Nothing was
deleted — every moved section is in the files above, in full.

---

### 🔬 #160 TESTED 2026-09-08 12:45 — full-tunnel WARP does NOT fix the Tennessee block
Predicted it would fail, then tested it rather than asserting. **It failed:**

    BEFORE  ip=208.188.36.113  AT&T        warp=off  colo=MEM
    AFTER   ip=104.28.220.4    Cloudflare  warp=on   colo=ATL
            ipinfo geo -> Nashville, TENNESSEE

WARP hides the ISP and real IP but **still geolocates to Tennessee**, so state-level geo-blocks
still bite. **Reverted to `Mode: DnsOverHttps`; verified `warp=off`, IP back to AT&T, Beehive
reachable at 2 ms** (Sling/AirTV path intact).

🔴 **DO NOT buy Cloudflare WARP+ for this.** Same egress-near-user behaviour — $4.99/mo that would
not fix it.

### The only thing that works: a VPN with SERVER SELECTION (paid). Priced 2026-09-08:
| option | cost | notes |
|---|---|---|
| **Mullvad** | **€5/mo flat** | no account/email, **no subscription so it cannot auto-renew** — a €5 one-month test is the cheapest real proof. 91 cities. WireGuard |
| NordVPN | $3.49/mo **on a 2-year plan** (~$84 up front); $12.99+ monthly | fastest measured (NordLynx), but a 2-year lock |
| IVPN | $6-10/mo | fine, no advantage over Mullvad here |
| ~~Cloudflare WARP+~~ | ~~$4.99/mo~~ | ❌ **does not fix it** — tested above |
| Tor | $0 | already installed, but Jeff wants FAST and Tor cannot be sped up |

**Recommendation: Mullvad, one month, €5.** No subscription to cancel, and it proves whether a
non-Tennessee exit actually unblocks his sites before committing to anything longer.

### 🟢 2026-09-10 20:30 — THAT RECOMMENDATION IS SUPERSEDED. THE FIX IS ALREADY ON THE BOX, AT $0.

**Re-measured tonight, exposure unchanged:**

```
warp-cli settings  ->  Mode: DnsOverHttps   Always On: false
ipinfo.io          ->  White House, Tennessee, AS7018 AT&T
windscribe-cli     ->  Login state: Logging in   Connect state: DISCONNECTED
                       Public IP: 208.188.36.113   Firewall: Off
```

🔴 **Windscribe was installed on this PC on 2026-09-08 — two days before the Mullvad table above was written — and it was PROVEN to exit in Atlanta with the house still reachable** (killswitch ON, HA answering HTTP 200, router reachable). **Free tier. €0.** He is still in Tennessee tonight for one reason only: **the tunnel is not connected.** Do not price a VPN for this again — he owns one that works.

**The sequence, from the verified 09-08 record — order matters:**
1. `warp-cli --accept-tos disconnect` **FIRST.** 🔴 WARP's DoH resolvers routed into a Windscribe tunnel = every lookup times out (`ENOTFOUND`). **That is what killed the 09-04→09-08 session.** Fully reproducible.
2. `windscribe-cli connect best` — `locations` returns empty on the free tier; `best` picked Atlanta.
3. **Verify against `ipinfo.io`, never the app's own claim.**

✅ *Allow LAN Traffic* is already ON (Jeff, 09-08 5:08 PM) so the killswitch no longer blocks HA — **do not turn the firewall off to 'fix' LAN issues.** ⛔ **Never set firewall mode 'Always On' / 'Always On+'** — those kill all internet whenever the VPN is down, stranding the PC that runs the house.

⚠️ **NOT CONNECTED BY ME.** Turning on a tunnel changes his network and has taken the house offline once already — that is his call, not a late-evening one. ⚠️ **The free tier's data cap was NOT verified this session** — it decides whether this can stay on permanently or is a per-site tool. Check before advising always-on.

---

---

## #158 — 🟡 CONTACTOR IDENTIFIED from Jeff's photo — needs to know WHICH unit 2026-09-08 10:05

Jeff photographed a contactor label and asked me to source it. **Not yet confirmed what equipment
it came off** — if it is the AC condenser and the unit is down, this is urgent in current heat.

### The part
**Products Unlimited `3100A15Q152L`** — **single-pole + SHUNT** definite-purpose contactor.

    25 FLA / 150 LRA @ 240-277 VAC     600 VAC max
    COIL 24 VAC, 50/60 Hz
    torque: screws 22 in-lb, lugs 40 in-lb, Cu 75 C
    62166  (Nordyne/Products Unlimited stock no; also listed as 621661)
    J0716  = July 2016 date code -> the part is ~10 years old

OEM on **Intertherm / Miller / Nordyne** condensers.

### ⚠️ THE "+ SHUNT" IS THE WHOLE QUESTION
The shunt is a **solid brass bar permanently connecting the second leg** — only ONE leg is
switched. Used where something needs constant power (typically a crankcase heater). **Eaton
catalogs "single-pole" and "single-pole with shunt" as DIFFERENT parts**, so a plain 1-pole is not
automatically a drop-in. Confirm against the unit before ordering.

### Sourcing, cheapest first (checked 2026-09-08)
| source | part | price | notes |
|---|---|---|---|
| North America HVAC (Amazon seller) | ClimaTek cross | **$13.99** free ship | in stock |
| SupplyHouse | **Packard C125A** | **$14.10** | in stock, 1-pole 24V 25A — verify shunt |
| Amazon | ClimaTek, listed as replacing 3100A15Q152L | $17.95 | uprated to 30A |
| local HVAC supply | "1-pole w/ shunt, 24V coil, 25-30A" | ~$15-25 | **same day** |

Going up to 30 A is fine and common. Any supply house stocks these.

### $0 first step
24 V present at the coil and contacts NOT pulling in -> coil failed. Pulling in but no output ->
burnt contacts. The check costs nothing and says whether the contactor is even the fault.

---
