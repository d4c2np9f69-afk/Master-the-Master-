# THE NETWORK PLAN — one house, every machine the same, all of them reachable

**Fri 2026-09-18.** Jeff's two requirements, in his words:

> *"building a seamless network that they all work together on, so when I go to any of them I can do
> the same thing on it that I was doing on the last one"*

> *"on the network it needs to be built so that you can go into all of them as needed to work on
> them"*

Those are two different jobs. **Job A** is you moving between machines without losing your place.
**Job B** is me being able to reach any of them to fix things. This plan does both, and everything
in it uses software that is already free and already on the machines.

---

# 1. WHAT IS ACTUALLY ON THIS NETWORK — measured 2026-09-18, not copied forward

| Machine | Address | What it really is | State right now |
|---|---|---|---|
| **301SERVER** — "the Beast" | **.194** | This machine. 16 GB RAM. Where I run. | 🟢 live |
| **Beehive** | **.66** (fixed) | Home Assistant, Beelink J45 | 🟢 live |
| **GaragePC** | .121 / .212 | HP TouchSmart 520, 23" touchscreen, Pentium G620 | 🔴 **down** — see `GARAGE_PC_REPAIR_KIT.md` |
| **JeffsLapTop** | .176 | **Acer Aspire E5-576**, i3-8130U, 16 GB, MX500 SSD | 🟡 **live, SET UP 09-18** (5 GHz, SSH+keys, cleaner, Bitwarden) but has a **recurring hard freeze** under active diagnosis — see NETWORK_MAP + OPEN_ITEMS |
| **GarageLaptop** | .173 | **Lenovo B570**, Pentium B960, 8 GB, MX500 SSD — **wiped to Ubuntu 26.04 on 09-18** (was "DellMasterBed"/Win10) | 🟢 **live and DONE** — SSH `jeffloewen`, no-password login, never-sleep, Chrome+Bitwarden, Windows-like desktop, auto-updates |
| Fire TV | .215 (fixed) | — | 🟢 |
| HP OfficeJet 4650 | .208 | printer | 🟢 |

**🔴 Two corrections to the record, made here because they were guesses before:**
1. `NETWORK_MAP.md` line 20 lists `.194 | 301Server | (?) house-number name — the beast?` —
   **confirmed today: 301SERVER *is* the Beast**, `$env:COMPUTERNAME` on this machine returns it.
   The question mark comes out.
2. **`DellMasterBed` is the Lenovo B570**, not a Dell. Hostnames are self-reported and this one was
   inherited from Jeff's old retired master-bedroom Dell. **Angela's work Dell is a separate
   corporate machine and is not this entry** — do not touch it, it isn't ours.

---

# 2. JOB B — HOW I GET INTO EACH MACHINE

## What's already true
Checked on the Beast today with `Get-WindowsCapability -Online -Name OpenSSH*`:

```
OpenSSH.Client   Installed
OpenSSH.Server   NotPresent      ← this is the gap
```

**Windows already ships an SSH server. It just isn't switched on.** No download, no purchase, no
third-party software, no subscription. One command per machine.

## The pattern — identical on every Windows box
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service  sshd -StartupType Automatic
```

## And on the garage PC once it's Mint
```bash
sudo apt install openssh-server
sudo systemctl enable --now ssh
```

## Then keys, so nothing needs a typed password
Generate one key pair **on the Beast**, put the public half on each machine. After that I connect as
`ssh jeffl@192.168.1.176` and I'm in — no password prompt, nothing stored in plain text, and you
are never in the loop typing anything.

## 🛑 STANDING DECISION — THE ROUTER IS THE SECURITY BOUNDARY, NOT THE MACHINES

**Jeff, 2026-09-18 12:07 PM, verbatim:**
> *"I don't need a bunch of security on any of this it needs to be open I want the network and
> router to be my safety point"*

Consistent with what he said before: *"I don't care if it's wide open as long as it's behind the
network who cares it's just Angela and I here."*

**What that means in practice, and it is binding on every future session:**
- **Inside the house: open.** Do not add logins, prompts, passphrases or approval steps between
  machines Jeff owns. Friction inside the LAN is not security here, it is just friction.
- **The gateway is the wall.** Nothing gets a port forwarded, nothing is published to the internet.
  The single firewall rule this plan adds is `-RemoteAddress 192.168.1.0/24` — that *is* the
  router-is-the-boundary model, not an exception to it.
- 🔴 **Do not "harden" any of this later without asking him.** A future session tightening these
  machines because it looks loose would be undoing a decision he made deliberately, twice.

**The SSH key is not a security measure — it is the opposite.** Without it every connection prompts
for a password. With it, nobody types one, ever. Keys have no passphrase for the same reason.

---

# 3. ADDRESSES THAT STOP MOVING

**Every machine gets a DHCP reservation on the BGW320.** This is not housekeeping — it is the fix
for a failure that has already cost real time twice:

- GaragePC has **two different addresses** recorded in the files (`.121` and `.212`) and neither is
  dependable. `OPEN_ITEMS` #112 asks for exactly this: *"give it a DHCP reservation like Beehive's,
  because its recorded addresses go stale every time."*
- A session once pinged **`.215`**, got replies, and nearly reported *"GaragePC is back on the
  network."* **`.215` is the Fire TV.** A ping proves something answers at an address, not which
  something.

Beehive and the Fire TV already have fixed addresses. The rest get the same treatment, and the
address list in `NETWORK_MAP.md` becomes true permanently instead of true-for-now.

---

# 4. JOB A — THE SAME EXPERIENCE ON EVERY MACHINE

Four layers, and three of them already exist and just need pointing at each other.

## Layer 1 — Files: one place, every machine
`\\301SERVER\OneDrive` is already shared and already working. **Mint mounts it natively** — better
than Windows did. Every machine maps the same share to the same drive letter / mount point, so a
path that works on one works on all of them. Nothing lives *only* on a laptop.

## Layer 2 — The house app: already solved, and you may not realise it
`loewenhome.com` is a **PWA**. It runs in any browser on any machine and on your phone, with the
same login, showing the same live data. **There is nothing to install and nothing to sync** — walk
to a different computer, open it, and you are exactly where you were. Same for Home Assistant at
`.66` — it's a web app.

## Layer 3 — The browser carries your place
Sign the same browser profile in on each machine and bookmarks, passwords and open tabs follow you.
Combined with Layer 2, that is most of *"do the same thing on it that I was doing on the last one"*
already delivered.

## Layer 4 — The same tools on each
A short standard list — browser, the file share mapped, the app pinned, SSH on — so that a machine
you haven't touched in a month behaves like the one you just left. Written down so it's repeatable
rather than remembered.

---

# 5. THE ORDER OF WORK

**🟢 PROGRESS 2026-09-18:** Both laptops are done. The Lenovo (.173) is now Ubuntu
`GarageLaptop` — key-based SSH login, file share reachable, standard toolset, auto-updates.
The Acer (.176) has key-based SSH login, cleaner, Bitwarden, updates — but is fighting a
recurring hard freeze (RAM test + graphics driver, see NETWORK_MAP/OPEN_ITEMS). **Steps 4, 5
and most of 6 are DONE for the two laptops.** Still open: the garage HP TouchSmart (step 1,
still a physical job), and step 3 DHCP reservations (gateway, with Jeff).

| # | Step | Status |
|---|---|---|
| 1 | **Garage PC (HP TouchSmart) → Ubuntu** | ⏳ still Jeff's hands — the USB kit is ready |
| 2 | **SSH reachability** — the Beast is the client, both laptops now run sshd | ✅ done for the laptops |
| 3 | **DHCP reservations** on the BGW320 | ⏳ gateway change, do with Jeff watching |
| 4 | **Key-based login** on both laptops | ✅ done, keys installed, passwordless |
| 5 | **File share + standard toolset** | ✅ Lenovo done; Acer parity pending its freeze fix |
| 6 | **Update `NETWORK_MAP.md`** with what's actually true | ✅ done 09-18 |

🔴 **I am not doing any of it without you saying so**, and step 3 touches the gateway, which is the
one piece that can take the whole house off the internet if it goes wrong. That one we do together,
with you watching.

---

# 6. HOW WE'LL KNOW IT WORKED

Not "it looks right." A script that **proves** it, in the style of the gates that already run here:

- Every machine answers on its **reserved** address
- Every machine accepts an **SSH key login** from the Beast
- Every machine can read the **shared drive**
- Each check names what proved it

A component check is not a feature check — so the test is *"I opened a shell on that machine and
listed the share,"* not *"the port is open."*

---

## THE HONEST LIMITS

- **JeffsLapTop and DellMasterBed have to be powered on** for anything to be done to them. I can't
  wake them. *(Wake-on-LAN might change that later — I'd have to check whether those two support it
  before promising anything, and I haven't.)*
- **Angela's work Dell is not in scope.** It's a corporate machine.
- **The garage PC is step one** and it is the only step that needs a screwdriver's worth of your
  time rather than a yes.
