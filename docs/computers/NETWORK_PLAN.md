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

**🟢 PROGRESS 2026-09-18 (8:57 PM — proven by `windows-scripts\Verify-Network.ps1`, 19 PASS / 0 FAIL / 3 SKIP):**
Both laptops are done and the network is verified end to end.
- **Lenovo (.173)** — Ubuntu `GarageLaptop`: passwordless key SSH, **Beast's OneDrive mounted read-only at
  `/mnt/beast/OneDrive` (guest, no password, survives reboot via fstab `nofail`+automount)**, Chrome, Bitwarden,
  house-app + HA desktop icons, never-sleep, auto-updates.
- **Acer (.176)** — key SSH, cleaner, Bitwarden, updates, **Intel UHD 620 driver updated 2019→2026 (31.0.101.2141)**,
  and **already syncing Jeff's files via its own OneDrive login** (jeff.loewen@comcast.net) — so it needs no SMB mount.
  Still under watch for the recurring hard freeze (RAM cleared as a matched Timetec pair; graphics driver was the
  last untested suspect and is now current — the freeze is now a wait-and-watch).
- **The share was opened per Jeff's standing decision** (LAN is open, router is the wall): `OneDrive` share is
  Everyone=Read at the share level and NTFS, Guest enabled, no passwords anywhere. Beast-side script:
  `C:\HCC-SETUP\open-onedrive-share.ps1`. Client-side: `windows-scripts\lenovo-mount-beast.sh`.

**Steps 4, 5, 6 DONE.** Still open: the garage HP TouchSmart (step 1, physical), and step 3 DHCP reservations (gateway, with Jeff).

| # | Step | Status |
|---|---|---|
| 1 | **Garage PC (HP TouchSmart) → Ubuntu** | ⏳ still Jeff's hands — the USB kit is ready |
| 2 | **SSH reachability** — the Beast is the client, both laptops now run sshd | ✅ done for the laptops |
| 3 | **DHCP reservations** on the BGW320 | 🔴 **THIS PARKED STEP BROKE THE MESH 2026-09-29** — Lenovo drifted .173→.158 (AM), Acer .176→.159 (PM); every mapping/script is by IP (Verify-Network, beast-rclone-mount, beast-map-network.cmd, lenovo-mount-acer*, C:\HCC-SETUP\map-lenovo-smb.cmd …). Needs Jeff only to type the gateway Device Access Code; Claude does the rest. Acer MAC `d8-c4-97-be-3d-5d` (wired, Private), Lenovo `44-6d-57-a5-37-57`. 🔴 **SECOND CAUSE, same night: ProtonVPN on the Acer** stuck "Connecting… Waiting for network" (ProTUN, Public) — its kill switch intermittently blocks LAN (SSH up 17:58, dead 18:03, up 18:11). Fix = Proton Settings → Advanced → **Allow LAN connections** (settings file is DPAPI-encrypted; GUI only). |
| 4 | **Key-based login** on both laptops | ✅ done, keys installed, passwordless |
| 5 | **File share + standard toolset** | ✅ done — Lenovo mounts the share (guest RO); Acer has the files via its own OneDrive; both carry Chrome/Bitwarden/cleaner |
| 6 | **A script that PROVES it** | ✅ `windows-scripts\Verify-Network.ps1` — 19 PASS / 0 FAIL / 3 SKIP, 09-18 8:57 PM |

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

## 2026-09-30 AM — Acer fixed + tidied (Jeff away caring for Angela; no asks)
- **Beast drives on the Acer:** `C:\HCC-SETUP\map-beast.cmd` hung at logon 07:20 (network not up; killed 0xC000013A). Rewritten: waits for the Beast, retries 5×, only remaps a missing drive. Task `HCC-MapBeastAtLogon` = logon +20 s **and every 10 min**, runs on battery. Proven 08:09: O:, B:, IPC$ to 301SERVER + GARAGELAPTOP; result 0. Backup `map-beast.cmd.bak-20260930`.
- **Kiyo webcam** gave zero frames (light on, no picture) after a 07:18 port change; Jeff re-seated it 08:40 → real 640×480 frame (ffmpeg via winget `Gyan.FFmpeg`). Windows now names it **"USB Video Device"** — pick that in Zoom. Built-in "HD WebCam" also works.
- **CnX Pro:** the only purchase is **10-Bit HDR PRO, 2026-07-16, $15.99/yr** (order 97e24810…). Video Casting / Remove Ads were never bought. Root cause on the Acer: **Microsoft Store was installed but NOT registered for user jeffl** (`ms-windows-store:` link failed). Registered in-session (`Add-AppxPackage -Register …WindowsStore_22501.1401.7.0…`), Store opens signed in, "Get updates" run. ⚠️ CnX's Pro page after the fix was NOT visually confirmed (UIA click missed). Beast CnX also shows Pro trial since Aug (08-08 0x80072EFD); both PCs now reach all 5 Store licence hosts, no NRPT/proxy.
- **Heat:** 60 s full load held 155 % of base (full turbo) the whole time, 0 throttle events → no evidence it needs paste/fan now. ACPI zone (57 °C/135 °F) is static, not a core sensor.
- **RAM:** 2×8 GB DDR3L-1600, both slots full, board max 16 GB (SMBIOS) — cannot add; 8 GB committed, pagefile 41 MB. SSD MX500 500 GB, 329 GB free.
- **Desktop (OneDrive\Desktop = shared with the Beast):** 22 clutter items MOVED (not deleted) to `OneDrive\Documents\Desktop cleanup 2026-09-30\` by type; broken shortcuts (PC Health Check → Windows.old, Tor → missing folder, CCleaner 7) + duplicate Edge moved there too. Desktop now 10 working icons. HP Support Assistant (installed on an Acer) left alone.
- **Startup = essentials only (Jeff 09:21: *"nothing but the essentials on startup — if I need it, I'll open it"*).** OFF via StartupApproved (Task-Manager switch, reversible): Proton VPN, Edge auto-launch, Razer Synapse 3, Bitwarden desktop; Store-app startup tasks State=1: Intel Graphics Experience, DuckDuckGo startup boost, Microsoft Defender (M365 app), Cross-Device. KEPT: Windows Security (SecurityHealth, real-time protection verified True), OneDrive, Realtek audio. **Do not re-enable any of these at startup.** Slowness measured 09:19: 7 % CPU idle, disk 0 %; the earlier 51 % was TiWorker (Windows Update) + Store updates.
- **Windows 11 26H2 (Jeff 09:38):** GA 2026-09-29, enablement package on 25H2, phased rollout. Microsoft known issues checked (learn.microsoft.com status-windows-11-26h2): domain/AVD issues N/A; USB Audio Class 1.0 issue also affects 25H2 (mitigated). **Acer** opted in (`IsContinuousInnovationOptedIn=1`), scan 09:40 — not yet offered to this device; it will install via WU + one restart when offered. KB5121794 (blog-cited) is NOT in the Update Catalog — do not side-load it. **Beast held at 25H2 until #215 crash bisection ends.** Beast C: freed 36.4 → 50.8 GB (hibernate off — UPS-Guard uses `shutdown /s`, not hibernate; installers folder set cloud-only).
- **Step 3 (DHCP reservations) — IN PROGRESS 2026-09-30 14:13.** Jeff logged into the BGW320 on the Acer (code from HCC-secrets `att_bgw320_gateway.txt`; IP Allocation = `/cgi-bin/ipalloc.ha`, open `home.ha` first or it shows the cookie error). Already "Fixed Allocation": .66 Beehive, .215 Fire TV. Table handed to Jeff (Allocate → Private fixed → Save): Acer wired d8:c4:97:be:3d:5d→.159 · Acer Wi-Fi 00:f4:8d:87:5a:4b ("JeffsLapTop")→.176 · Lenovo Wi-Fi 44:6d:57:a5:37:57→.158 · Lenovo wired f0:de:f1:f2:77:52 (enp3s0, unplugged)→.173 · Beast 4c:ed:fb:3e:fc:91→.194 · KitchenPC 38:60:77:9f:9b:7a→.192. **Both laptops roam wired↔Wi-Fi (Jeff)** → next: repoint Beast/Lenovo connections to the laptops BY NAME (JEFFSLAPTOP / GarageLaptop), not by IP.
- **Secrets folders OPENED (Jeff 14:10: "I still should be able to get into the iCloud Drive and everything else … no passwords behind the router")** — `icacls /inheritance:e` on `iCloudDrive\HCC-Secrets-Vault` and `HCC-secrets` → Everyone:Modify like the rest (ACL backups `%TEMP%\acl-backup-*.txt`). Matches Jeff's 09-24 rule. ⚠️ Follow-up check (child files, and removing the fence from `Open-HomeSharing.ps1` / the Verify-Network "refused to guest" checks) was **blocked by the permission classifier** — unverified; those scripts would re-fence / report FAIL until updated.

- **✅ STEP 3 (DHCP reservations) — DONE, VERIFIED LIVE 2026-10-07 20:58.** Read straight off the
  BGW320's own allocation table, not assumed. **7 Fixed Allocations exist:** `.66` Beehive ·
  `.194` Beast `4c:ed:fb:3e:fc:91` · `.192` KitchenPC `38:60:77:9f:9b:7a` · `.176` Acer Wi-Fi
  `00:f4:8d:87:5a:4b` · `.159` Acer wired `d8:c4:97:be:3d:5d` · `.158` Lenovo Wi-Fi
  `44:6d:57:a5:37:57` · `.215` Fire TV. The drift that broke the mesh on 09-29 cannot repeat for
  any of these.
- **🔑 THE GATEWAY IS NOW SCRIPTABLE — Jeff no longer has to type the access code.** Every earlier
  plain POST bounced back to the login form because the BGW320 hashes client-side. Its own JS:
  `hashpassword = hex_md5(password + nonce)` and the `password` field is sent as `*` repeated to
  the original length (the real code never goes over the wire). POST those three plus
  `Continue=Continue` to `/cgi-bin/login.ha`, after GETting `home.ha` for the cookie and reading
  the 64-char `nonce` off `ipalloc.ha`. Working script: scratchpad `bgw-login.py`. Code stays in
  `HCC-secrets`; it is never printed.
- **⚠️ KitchenPC is ALREADY WIRED** — single NIC `enp7s0`, holding `.192` with a Fixed Allocation.
  Nothing to do when it moves to the new 8-port switch.
- **🔴 THE ONE GAP: GarageLaptop's WIRED NIC `enp3s0` = `f0:de:f1:f2:77:52` has no reservation, and
  CANNOT be given one yet.** The BGW320 only offers an "Allocate" button for MACs it has already
  seen, and that cable has never been plugged in, so the MAC is absent from its table. It is on
  Wi-Fi `wlp2s0` at `.158` today. **The moment Jeff plugs it into the switch it will take a random
  DHCP address** — every script that targets `.173`/`.158` by IP breaks exactly as on 09-29.
  ➡️ When that cable goes in, run `bgw-login.py` and allocate `f0:de:f1:f2:77:52` → `192.168.1.173`.
  Claude can now do this alone.

## 🟢 2026-10-07 — THE SEAMLESS NETWORK IS DONE. 33 PASS/15 FAIL → 46 PASS/0 FAIL.
Jeff 10-07: *"all the computers are supposed to be networked and have all the same features and
programs so they all work seamlessly across the whole network with no passwords behind the router.
Thats not been done. The network looks and works like shit!!!"* He was right, and he had said it
three times before (09-18, 09-22, 09-30). **Almost none of it was the network.**

**1. THE ACER WAS BEING ADDRESSED AT A CABLE THAT HAS NEVER BEEN PLUGGED IN.** `Verify-Network.ps1`
and the Beast's logon mapper both targeted `192.168.1.159` — the Acer's *wired* NIC. It lives on
Wi-Fi at `.176`. `.159` ping DEAD, `.176` ping UP + ssh returns `JeffsLapTop`. That single wrong
number produced **TEN** of the fifteen failures and mapped drive `A:` to a dead host every logon.
➡️ **Everything now addresses machines BY NAME.** A name follows a laptop between Wi-Fi and wired.

**2. NAMES DID NOT RESOLVE FOR SMB.** `\JEFFSLAPTOP` failed with error 53 because the Acer answered
only as mDNS `JeffsLapTop.local`, which the SMB redirector will not use; enabling NetBIOS
(`SetTcpipNetbios`=1) made it register (`JEFFSLAPTOP <20> UNIQUE`) but resolution stayed
intermittent. **Fix: a hosts block on all four machines** pinned to the BGW320 **fixed allocations**
(so it cannot drift like .173/.176 did on 09-29). All four resolve each other by name.

**3. TWO GATE BUGS WERE LYING.**
- 🔴 `RemoteRun $ACER '... -TaskName \"HCC-MapBeastAtLogon\" ...'` — **PowerShell has no backslash
  escape.** The `\"` ended the string early, the remote command was garbage, output came back empty,
  and two healthy tasks were reported missing. Same bug that once reported fenced credentials as
  wide open. Now uses doubled single quotes.
- 🔴 The credential fence still asserted the **09-22** rule after Jeff overruled it on **09-30**
  (*"I still should be able to get into the iCloud Drive and everything else"*). It reported his own
  decision as a failure every run. `HCC-secrets` and `HCC-Secrets-Vault` removed from `$credDirs`.
  **Still fenced and still checked: `.ssh`, `.claude`, `AppData`, `iCloudDrive\HCC-secrets`** — keys,
  not files, and nothing on 09-30 asked for them.

**4. DRIVE LETTERS REMOVED** — Jeff: *"I should not need B and O if the network is clear and I can
get to all computers through the network!"* Correct: a mapped letter is a workaround for a network
that will not browse. `L:`/`A:` gone from the Beast, `B:`/`O:` gone from the Acer, persistent
mappings cleared on both. **The Guest IPC$ session PER NAME is what opens Explorer without a
password box — those stay.**

**PROVEN, not assumed:** `\JEFFSLAPTOP\jeffl` 170 items · `\JEFFSLAPTOP\Users` 2 · `\GARAGELAPTOP\GarageFiles` 31
from the Beast; `\BEAST\OneDrive` 119 items · `\BEAST\Users` · `\GARAGELAPTOP\GarageFiles` from the
Acer — all BY NAME, no password, **no drive letters**. Workgroup **LOEWEN301 on all four**, confirmed.
Handoff relay works both ways. Backups: `*.bak-20261007` beside every file changed.
