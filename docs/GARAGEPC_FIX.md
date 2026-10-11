# 🖥️ GARAGE PC — HOW TO GET IT BACK. Three routes, easiest first.

**Written 2026-09-16 02:00 because Jeff asked *"Do you have a fix for the garage computer?"* and
the answer in the list was only "power it on and join it to Loewen301" — which is one route, and
not the easiest one.**

🔴 **First, the honest framing: this machine is down because of work done here, not because Jeff
neglected it.** Two candidate causes, both ours — the **09-01 boot loop** from a setup script
re-applying the `USER_RIGHTS` policy block via `secedit` (he recovered it with System Restore),
and the **08-13 extender retirement** that orphaned it on the vanished `Loewen301_Ext` SSID. The
gateway evidence points at the second: the BGW320 keeps powered-off clients ~4 weeks and
**GaragePC is absent from all 56 entries in any state**, so it has not associated since before
08-14 — *before* the boot loop.

---

## ✅ ROUTE 1 — PLUG IN AN ETHERNET CABLE. No passwords, no WiFi, no config.

**This is the one to try first and it is barely a repair.**

**Why it works:** the HP TouchSmart 520 has **gigabit Ethernet on board** (recorded 08-05 from its
own spec). A wired port does not care that `Loewen301_Ext` no longer exists — it takes a DHCP
lease the moment it is plugged in, and the beast can reach it immediately.

**Why it is plausible here:** the house is wired with **Cat6** and has a **central fan-out switch
on the gateway's LAN-1**. Angela's work computer is wired at her office jack; the RE200 access
point is wired; the beast is wired. **If there is any live jack within cable reach of the garage
machine, this is a 30-second fix.**

> **Do:** plug it in, power on, and tell me. I will find it by MAC on the gateway and confirm.
> **Its MAC is not recorded** — so I will identify the new arrival by elimination against the
> 56 devices already known.

⚠️ If the garage has no jack, do not run one for this. Go to Route 2.

---

## ✅ ROUTE 2 — JOIN IT TO `Loewen301`. One password, typed once.

The SSID it is looking for was retired on 08-13. The replacement is **better than what it lost**:
the **RE200 at `192.168.1.196` is now a WIRED access point** (Cat6 backhaul, not a wireless
repeater) broadcasting **`Loewen301`** on 2.4 GHz ch 6 and **`Loewen301-5G`**. The flaky
repeat-hop that used to serve that end of the house is gone.

> **Do:** power it on, open WiFi settings, pick **`Loewen301`** (2.4 GHz — better reach through a
> garage wall than 5G), enter the house password. Done.

**Its account is "Jeff Loewen Office 2", not `jeffl`** — the password is in `HCC_ACCESS.md` §5, so
**I can authenticate to it the moment it appears.** Nothing else is needed from you afterwards.

---

## ✅ ROUTE 3 — SKIP THE REPAIR. Boot the Ubuntu stick and do the upgrade that was already planned.

**If Windows fights at all, stop fixing it.** That install is end-of-life in October, it is the
install that boot-looped, and **the machine was always going to be wiped for the kiosk build.**

**Everything needed is already in hand:**
- The USB stick is **already written with Ubuntu 26.04 "Resolute Raccoon"** (label `UBUNTU 26_0` —
  it is the same stick used for the BIOS flash, the `.CAP` file just rides along on it).
- The touchscreen driver source **and a one-command installer** are on it at
  `GARAGE-SETUP/touchscreen/` — `glorang/nwfermi` 0.7.0.1, which targets Ubuntu 24.04+.
- WiFi should work out of the box: the Techkey dongle is RTL88x1AU and that landed in the mainline
  kernel at 6.13/6.14.

⚠️ **Two gotchas already paid for, do not rediscover them:** the touchscreen driver is an **Xorg**
input module so **Wayland must be disabled** (`WaylandEnable=false` in `/etc/gdm3/custom.conf`),
and the user plus `gdm` must be in the **`input`** group.

**Universal network fallback during install:** **USB-tether a phone.** Needs no driver at all.

---

## 🔌 WHEN IT COMES BACK — one thing to do immediately

**Give it a DHCP reservation on the BGW320, the way Beehive has one.** Its recorded addresses
(`.121`, then `.212`) have gone stale every single time it moved, and a stale address is what made
it look present when it was not — the hostname kept resolving to `.121` from a cached DNS entry
long after the machine was gone.

⚠️ **And the trap that nearly caught me tonight:** I pinged `192.168.1.215`, got three replies, and
was one sentence from reporting *"GaragePC is back."* **`.215` is the Fire TV.** GaragePC is
`.121`/`.212`. **A ping proves something answers at an address — never which something.** Confirm
by MAC or by hostname before naming a machine.

---

## What I can do the moment it is on the network

Nothing here needs Jeff again after the cable or the password:

1. Confirm identity by MAC against the gateway's device list, not by ping.
2. Authenticate with the stored `HCC_ACCESS.md` §5 credentials.
3. Re-point `media_player.garagepc` and confirm it leaves `unavailable`.
4. Set the DHCP reservation so this cannot recur.
5. Write the kiosk walkthrough (app fullscreen, TTS speaker, Glances health sensors) — the plan is
   already researched in `BEEHIVE_REFERENCE.md`; it just needs a live machine.
