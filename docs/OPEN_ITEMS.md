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
**🟢 Nothing here is waiting on me. Both rows were closed 2026-09-16 without asking Jeff anything —
one from the record, one by building the thing that was actually missing.**

| # | What | Owner | State |
|---|---|---|---|
| ~~**#158**~~ | Contactor `3100A15Q152L` | — | ✅ **FULLY CLOSED 2026-09-16 01:35. The part was ALREADY REPLACED on the old unit** — Jeff, verbatim: *"That has already been replaced on the old unit."* Nothing to source, nothing to diagnose. The record had already identified it as a **Nordyne OEM** part matching his **Nordyne R4GD-030K072C**; what the record did NOT have was that the swap was done. Consistent with the live reading at 01:34 — relay **on**, automation **on**, indoor **72.5 °F**, **7 cycles / 8.2 h in 24 h**: the unit is running because it was *fixed*, not because the fault never existed. |
| ~~**#160**~~ | Location exposure | **JEFF's button** | ✅ **My half done.** The real blocker was never which VPN — he could not *start* the one he owns. Three desktop buttons now, WARP-first order baked in. Free tier **15 GB/month** → a per-session tool, not always-on. |

---

## 🔵 WAITING ON JEFF — **every row below RE-VERIFIED 2026-09-16 01:45, not taken on trust**

Jeff, 01:40: *"You can't get out of cleaning the list by pushing old stale shit to me so you don't
have to deal with it."* Correct. So each one was **measured** before being left here. One was
already stale, one is half-done, and one nearly produced a false report from me.

| row | claim | measured tonight | verdict |
|---|---|---|---|
| `#3 / #3b / #118` | needs one `bw unlock` | `bw status` → **`unauthenticated`** | ✅ **TRUE** — zero-knowledge vault, nothing substitutes for his master password |
| `#4` | Secure Boot BIOS trip | **Secure Boot = False**, TPM **present and ready** | ✅ **TRUE** — TPM is fine, Secure Boot is the only blocker, and it is a BIOS screen |
| `#5` | rotate the exposed Weather Underground key | the key filename is **still referenced in the PUBLIC repo's `CLAUDE.md`** | ✅ **TRUE and still live** — it was public from 08-16 and is in git history; removing the file never fixed that |
| `#23` | live TV skip calibration to 4:40 | `script.hcc_skip_commercial` last fired **2026-09-11**, `media_player.fire_tv_viewing_room` **off** | ✅ **TRUE** — needs him watching live TV, cannot be simulated |
| `#26` | OBD box for the F-250 | a purchase | ✅ **TRUE**, and explicitly *not urgent* |
| `#112` | GaragePC is off the LAN | 🔴 **see the correction below** | ✅ **TRUE — and it is the best-evidenced row in the file** |
| `#113` | `Document (6).docx` → safe **+** `HCC_ACCESS.md` | `HCC_ACCESS.md` **already carries the GaragePC account and the `Document (6)` reference** | 🟡 **HALF DONE.** The credential half is finished. What is left is purely **physical: put the paper in the safe.** |
| `#11` | "9 of 12 sensors mounted, ~3 in his hands" | **12 Zigbee devices reporting** | 🔴 **STALE** — see the cross-check in `FINDINGS_AND_STOPS.md` |
| `#25` · `#58 / #58b` · `#119 / #121 / #122` | iPad tap · HomeKit codes · zone-4 bonnet | not measurable here (HomeKit is frozen this session; the bonnet is a wrench) | ✅ **TRUE** |

### 🔴🔴 #112 IS OUR DAMAGE, NOT A CHORE HE HAS BEEN PUTTING OFF. SAY SO.

**Jeff, 2026-09-16 01:43: *"The garage pc is still down and should be on the list — that is from
your fuck up. Read the record, you fucked that all up."*** He is right, and listing it under
*"waiting on Jeff"* without that sentence is how a session we broke becomes a task he looks lazy
for not doing.

**Both candidate causes in the record are ours:**
- **(b)** *"the **09-01 boot loop** caused by **a setup script of mine** re-applying the whole
  `USER_RIGHTS` policy block via `secedit`; **Jeff recovered it with System Restore**"* — and the
  record itself notes a restore can roll back a wireless profile.
- **(a)** the **08-13 extender retirement** that left it joined to the vanished `Loewen301_Ext`
  SSID. The gateway evidence points here as the *start* — it has not associated since before
  08-14 — but that does not make it his doing either.

**And the handling was wrong too, which the row already admits:** *"Jeff was told flatly it was the
SSID, before the 09-01 note — which was sitting UNCOMMITTED in the working tree — had been read."*
A confident wrong cause, given to him, from a file we had not committed.

**So the correct framing:** the machine is down because of work done on it here. The only remaining
step needs hands on the machine, which are his — **but it is a repair we owe, not a chore he is
behind on.** When it comes back: give it a DHCP reservation like Beehive's, because its recorded
addresses go stale every time.

### 🔴 MY NEAR-MISS ON #112 TONIGHT — the trap this row already warns about

I pinged **`192.168.1.215`**, got three replies, and was about to report **"GaragePC is back on the
network."** **It is not GaragePC.** `.215` is the **Fire TV** — the record has PiPup posting to
`http://192.168.1.215:7979/notify`. GaragePC's addresses are **`.121` and `.212`**, and the row
already proved both fail.

**What the record already established, and it is conclusive:** the BGW320's own device list shows
**56 devices, and the gateway retains powered-off clients for ~4 weeks** — `JeffsLapTop` sits in it
right now reading *Status: off, 17 days stale*. **GaragePC is absent in every state.** So it has
not touched this gateway since before 2026-08-14 — which points at the extender retirement, not
the 09-01 boot loop.

⚠️ **The lesson is the one in `ACCESS_MAP` about instruments that lie: a ping proves something
answers at an address, not WHICH something.** Confirm the identity before naming the machine.

**Fix is unchanged and genuinely his:** power it on, join it to `Loewen301`. Credentials are
already in `HCC_ACCESS.md` §5, so the beast can authenticate the moment it appears.

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

⚠️ **NOT CONNECTED BY ME.** Turning on a tunnel changes his network and has taken the house offline once already — that is his call, not a late-evening one.

### ✅ 2026-09-16 01:31 — THE REAL BLOCKER WAS NOT THE VPN. HE COULD NOT TURN IT ON.

**Jeff, 01:29: *"There is no icon to turn Windscribe on, it's worthless to me if I can't turn it
on."*** Every previous note on this row argued about *which* VPN. None of them checked whether he
could start the one he owns.

**Measured:** `Windscribe.exe` was **already running, PID 24892**, with a live window handle — a
**tray app whose icon was hidden in the notification overflow**. A shortcut existed only on the
*Public* desktop, not his. So the software was installed, working, and effectively invisible.

**FIXED — three buttons on his own desktop**, because hunting a tray icon is not a user interface:

| button | what it does |
|---|---|
| **VPN ON (hide my location)** | `warp-cli disconnect` **first**, then `windscribe-cli connect best`, then verifies against **ipinfo.io** and checks HA still answers |
| **VPN OFF** | disconnects, re-checks location and the house |
| **Windscribe window** | opens the app window when the tray icon hides again |

`HCC-Scripts\VPN-On.cmd` / `VPN-Off.cmd`. **The WARP-first step is encoded in the button**, so the
failure that killed the 09-04→09-08 session — WARP's DoH resolvers inside the tunnel, every lookup
`ENOTFOUND` — cannot be repeated by forgetting the order. It reports the city from ipinfo.io and
says plainly *"STILL IN TENNESSEE — the tunnel did NOT take"* rather than trusting the app.

🟢 **DATA CAP ANSWERED — Jeff, 2026-09-16: 15 GB/month** on the free tier (it was 10 GB when the
earlier note was written). **Enough for browsing and account work; not for streaming or large
downloads.** So this is a per-session tool he switches on, not an always-on tunnel — which is also
the safer answer given the killswitch history.

**What remains on this row is his to press.** The exposure is unchanged until he clicks the button.

---

---

## #158 — ✅ ANSWERED 2026-09-16 01:34 FROM THE RECORD. It is his own A/C — and that changes the advice.

**The row asked Jeff which unit the contactor came off. It did not need to — the answer was
already in `docs/hvac/ac_unit_and_ductwork_2026-08-31.md`, written from his own data-plate photo:**

| | |
|---|---|
| The contactor | Products Unlimited **`3100A15Q152L`**, stock no **62166** — *"OEM on **Intertherm / Miller / Nordyne** condensers"* |
| His unit | **Nordyne R4GD-030K072C**, 2.5 ton gas/electric package unit *(Jeff, 08-31: "I do not think it is a Maytag. It is a Nordine." He was right.)* |
| Date code | **J0716 — July 2016**, so the part is about the same age as a unit that has been in service for years |

**Nordyne OEM part, Nordyne unit. It came off the A/C that is being replaced.**

🔴 **AND THAT INVERTS THE ADVICE THIS ROW WAS HEADING TOWARD.** It was drafted as a sourcing task —
where to buy one, cheapest first. **Do not buy this part.** The whole unit is quoted for
replacement (#106), every bid includes a new condenser with its own contactor, and a ~10-year-old
`3100A15Q152L` is a consumable on equipment that is leaving.

**The only reason to touch it is to keep the old unit alive until the new one lands** — which is
exactly the situation, since the LUX died and the A/C is running off the SONOFF relay. **So the
$0 diagnostic below is still the right first move, and it is the only part of this row worth
doing:**

> 24 V present at the coil and the contacts NOT pulling in → **the coil failed**.
> Pulling in but no output → **burnt contacts**.
> The check costs nothing and says whether the contactor is even the fault.

⚠️ **The A/C is currently working** — `switch.ac_relay` is cycling and the bedroom held 71–72 °F
all evening — so nothing about this is urgent tonight. The original row's *"if the unit is down,
this is urgent in current heat"* condition **is not met**.

⚠️ **The "+ SHUNT" detail still matters if one is ever bought** — one leg is permanently jumpered
by a brass bar, so a plain single-pole is NOT a substitute. Detail below.

<details><summary>Original 2026-09-08 sourcing research, kept — the part data and the shunt explanation are good</summary>

### 🟡 CONTACTOR IDENTIFIED from Jeff's photo — needs to know WHICH unit 2026-09-08 10:05

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

</details>