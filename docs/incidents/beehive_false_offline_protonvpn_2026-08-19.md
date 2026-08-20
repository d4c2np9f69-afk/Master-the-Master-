# INCIDENT: "Beehive is offline" — 2026-08-19 ~3:00 AM CT

**VERDICT: Beehive was never offline. Home Assistant ran continuously through the entire
window. The fault was 100% on the beast PC (301SERVER): Proton VPN was blocking LAN and
relay traffic. This is the THIRD occurrence of the same false alarm.**

## Proof that Beehive stayed up (collected 2026-08-19 03:25–03:40 AM CT)

| Evidence | Result |
|---|---|
| HA logbook, 07:50–08:35 UTC (the exact outage window) | **352 entries logged**, automations firing on a 10 s cadence |
| HA "Home Assistant started" events, last 3 h | **0** — HA never restarted |
| `/api/config` state | `RUNNING`, version 2026.8.2 |
| `sensor.water_meter_reading` | updated 08:00:33 UTC, mid-outage |
| ARP table on the beast *during* the outage | `192.168.1.66 → 84-39-be-20-0d-ad` present — the J45 was answering ARP on the LAN the whole time |

## What actually happened — timeline (local CT)

- **~3:00** Jeff sees Beehive offline; Nabu Casa also unreachable **from this PC**.
- **3:03** First checks: Nabu Casa `HTTP:000`, general internet `HTTP:301` (working).
- **3:04** Local `TCP 192.168.1.66:8123 = False`, **router `192.168.1.254` ping = False**.
  *A dead router ping is the tell — that is never Beehive, it is always this PC.*
- **3:04** `ProtonVPN.Client`, `ProtonVPNService`, `ProtonVPN.NrptWatchdog` all running;
  adapter `ProTUN` (Proton VPN Windows Tunnel) **Up**, connected to `149.102.254.89`.
- **3:05** `Disable-NetAdapter ProTUN` → the **NRPT watchdog silently re-enabled it**.
- **3:06** `Stop-Service ProtonVPNService` + killed the processes.
- **3:12** The beast lost all internet (Claude API `ENOTFOUND`) — session died mid-diagnosis.
  Consistent with Proton's kill switch holding a block after the tunnel was torn down.
- **3:22:02** Jeff restarted the PC from the Start menu (clean restart, event 1074 —
  **not** a crash; no Kernel-Power 41).
- **3:22:30** Boot. Proton services came up `Stopped` / `Manual` → no tunnel → no block.
- **3:25–3:40** Everything green, verified end to end (below).

## Post-reboot verification (all passing)

- HA local `http://192.168.1.66:8123/api/` → **200** (9 ms)
- HA remote `https://…ui.nabu.casa/api/` → **200** (250 ms)
- App proxy `https://toro1-5rz.pages.dev/api/ha?path=/api/` → **200**, `{"message":"API running."}`
- App proxy → `sensor.water_gallons` → **200**, `20936.9 gal`
- Beast: Ethernet `192.168.1.194`, router ping **True**, no Proton process, no `ProTUN` adapter

## ROOT CAUSE — CONFIRMED with a live reproduction, 3:40 AM

At 3:38 AM Proton VPN relaunched on its own and reconnected (server 89.187.180.55), and the
fault **reproduced live while under observation**: `Beehive TCP 8123 = False`,
`router 192.168.1.254 ping = False`, Ethernet otherwise fine.

**Proton's client and its service disagree about the LAN setting:**

| File | Key | Value |
|---|---|---|
| `%LOCALAPPDATA%\Proton\Proton VPN\Storage\UserSettings.<id>.json` (the UI) | `IsLocalAreaNetworkAccessEnabled` | **true** |
| `C:\Program Files\Proton\VPN\v5.1.5\ServiceData\ServiceSettings.json` (the enforcer) | `IsLocalAreaNetworkAccessEnabled` | **false** |

The app shows "Allow LAN connections = On" while the privileged service that actually
installs the WFP filters has it **off**, so it blocks all 192.168.1.x traffic. Same false
value in the leftover `v4.4.1` folder. (Running version confirmed as **v5.1.5** by process
path.) Likely a v4 to v5 upgrade migration miss — `IsUserSettingsMigrationDone = true`.

**Two earlier theories are now DISPROVEN — do not repeat them:**
- *Kill switch:* `KillSwitchMode = 0`. It is **off**. Not the cause.
- *Routing:* not the cause either. `192.168.1.0/24` correctly routes via Ethernet
  (metric 256, ifIndex 10) and `Find-NetRoute 192.168.1.66` selects Ethernet. Packets are
  routed correctly and then **dropped by Proton's filter layer**.

Also set: `ShouldDisableWeakHostSetting = true`, `SplitTunnel.Mode = 0`, `NetShieldMode = 0`.

Nothing here touches the house — the app's `/api/ha` proxy is server-to-server from
Cloudflare, so Jeff's phone and the live app were unaffected throughout.

## The fix

Because the client already believes the setting is On, simply "turning it on" is a no-op.
It must be **forced to re-push** to the service:

> Proton VPN -> Settings -> Connection -> Advanced settings -> **Allow LAN connections** ->
> toggle **Off**, Apply -> toggle **On**, Apply -> reconnect.

Then verify `ServiceSettings.json` flips to `true` and `Test-NetConnection 192.168.1.66 -Port 8123`
returns True with the tunnel still up.

Fallback if the toggle does not sync: edit `IsLocalAreaNetworkAccessEnabled` to `true` in
`C:\Program Files\Proton\VPN\v5.1.5\ServiceData\ServiceSettings.json` and reconnect from
the app. Backups of both service settings files are saved at
`C:\Users\jeffl\HCC-secrets\ProtonServiceSettings.v5.1.5.bak.json` (and `.v4.4.1.`).

**Do NOT stop `ProtonVPNService` or disable the `ProTUN` adapter as a workaround.** The NRPT
watchdog re-enables the adapter, and killing the service leaves orphaned NRPT DNS rules that
black out the whole machine — that is what ended the 3:12 AM session with `ENOTFOUND`.

## STANDING DIAGNOSTIC RULE (added 2026-08-19)

> When the app or this PC says "Beehive offline", **ping the router `192.168.1.254` first.**
> If the router does not answer, the problem is this PC (VPN/firewall), not Beehive — do not
> touch the HA stack. Confirm with the HA logbook: if entries are still being written during
> the reported outage, Beehive was up.

Do **not** disable the `ProTUN` adapter as the fix — the NRPT watchdog re-enables it and the
kill switch can black out the machine entirely. Change the setting in the app instead.

## ATTEMPTED FIX 3:44–3:51 AM — the file edit is blocked by design (DO NOT RETRY)

Jeff authorised editing the service settings file directly. It was attempted twice, with
backups taken first and Proton's own `ProtonVPN.RestoreInternet.exe` wired in as a safety net.
**Internet never dropped and nothing was damaged** — but the fix did not take:

1. **Pass 1 — edit while the service runs.** Both `v5.1.5` and `v4.4.1` files were rewritten to
   `true` and verified true on disk. Within ~2 minutes the **running service overwrote
   `v5.1.5` back to `false`** from its in-memory value. `v4.4.1` (not running) stayed `true`.
2. **`Restart-Service` failed** in 2 s — but `sc.exe stop` returned `STOP_PENDING` with exit 0,
   so the stop *is* accepted; Restart-Service simply is not patient enough.
3. **Pass 2 — stop, edit, start.** Polled the service for 60 s and re-issued `sc.exe stop`.
   It reported `STOP_PENDING` and then **stayed `Running` the entire time** — the client
   watchdog brings it straight back. The script aborted itself by design rather than escalate.

**Conclusion: the service owns this value in memory, rewrites the file from memory, and cannot
be stopped while `ProtonVPN.Client` is running.** The only way to stop it is to kill the client
and service together — which is precisely the sequence that orphaned the NRPT DNS rules and
blacked out the machine at 3:12 AM. **Not an acceptable workaround.**

**The setting must be changed through the client UI**, which is the only thing that pushes a
new value into the service:
> Proton VPN -> Settings -> Connection -> Advanced settings -> Allow LAN connections ->
> Off + Apply -> On + Apply

Left in place deliberately: `v4.4.1\ServiceData\ServiceSettings.json` is now `true` (harmless —
that version is not running, and true is the value we want if Proton ever rolls back).
Originals: `C:\Users\jeffl\HCC-secrets\ProtonServiceSettings.*.bak.json`.
Full run log: `C:\Users\jeffl\HCC-secrets\proton_lan_fix_2026-08-19.log`.

## RESOLVED 5:40 AM — Proton removed, Cloudflare WARP in DNS-only mode

"Allow LAN connections" is a **paid-only** Proton feature (protonvpn.com/support/lan-connections),
so the free plan can never stop blocking the LAN. Jeff's priority was stated plainly: *whatever
will not slow the internet connection down*. Measurements decided it.

### Measured, interleaved (100 MB samples from Hetzner Ashburn)

| Configuration | Throughput | Ping 8.8.8.8 | Beehive on LAN |
|---|---|---|---|
| Proton VPN connected | (noisy sample) | 19.8 ms | **NO** |
| No VPN at all | ~447 Mbit/s | 11.6 ms | yes |
| WARP **full tunnel** | ~276 Mbit/s | 10.9 ms | yes |
| **WARP DNS-only (chosen)** | **428 Mbit/s (-4.2%, noise)** | 11.2 ms | **yes** |

**Methodology warning for future sessions:** 50 MB samples finish in 1-2 s and measure TCP
ramp-up, not bandwidth — they produced a bogus "Proton is faster" result. Non-interleaved runs
also drift badly (the same "no VPN" config measured 594 and 447 Mbit/s twenty minutes apart).
**Only interleaved 100 MB samples were trustworthy.** Do not repeat the short-sample mistake.

### Why DNS-only, not a tunnel

Jeff's real reason for running a VPN: months ago his internet failed with "cannot find DNS
server" and connecting Proton fixed it. That was **AT&T's DNS failing** — the VPN cured it only
because it moved DNS off the ISP's resolvers. DNS-only WARP gives that protection permanently
with no tunnel and therefore no throughput cost, and it leaves the LAN completely alone.

### Final state

- Proton VPN **uninstalled** (0 residual processes/services/adapters/NRPT rules; autostart entry
  and the NRPT watchdog task removed first). Its `RestoreInternet.exe` was rescued beforehand to
  `C:\Users\jeffl\HCC-secrets\proton-restore-tool\`. Internet never dropped during removal.
- **Cloudflare WARP** installed (`winget install Cloudflare.Warp`), `mode doh`, connected.
  Service `CloudflareWARP` = **Automatic**, so it survives reboot. DNS now resolves via
  `127.0.2.2/.3` (WARP's local DoH resolver) instead of AT&T's.
- No tunnel adapter exists; the public IP stays Jeff's own (`208.188.36.113`).
- Restore point "Before VPN swap: Proton out, Windscribe in" created before any of it.

### Trade-offs Jeff should know

- **No country switching.** WARP cannot make him appear elsewhere. If that is ever needed,
  **Windscribe Free** allows LAN traffic on its free plan (11 locations incl. UK/Canada) but
  caps at 10 GB/month — install it for those sessions only.
- **IP masking is off** in DNS-only mode. `warp-cli mode warp` turns the full tunnel on at the
  cost of ~40% throughput; `warp-cli mode doh` returns to the fast setting.

## Sync-HABackup.ps1 hardened (same session)

The nightly 6:30 AM backup used `ws://homeassistant.local:8123` only, so **every night the VPN
was up it would have silently failed**. Now tries three endpoints in order and logs which one
served: `LAN-IP` (no mDNS, instant) -> `LAN-mDNS` (if the IP ever changes; measured 5.8 s to
resolve) -> `NabuCasa` (works with a VPN up or off-site, but relays ~400 MB).

**Download timeout raised 300 s -> 1800 s.** Verified end-to-end 05:37: pulled the real
2026-08-19 backup (420,638,720 bytes) via `LAN-IP` — and it took **259 s against the old 300 s
limit**. HA's download endpoint is slow and backups have grown 236 MB -> 401 MB in five days,
so the original timeout would have started failing within roughly two weeks. Original script
saved at `C:\Users\jeffl\HCC-secrets\Sync-HABackup.ps1.bak-2026-08-19`.

Logs: `HCC-secrets\vpn_speed_comparison.log`, `HCC-secrets\vpn_swap_2026-08-19.log`,
`HCC-secrets\proton_lan_fix_2026-08-19.log`.

## Follow-up 7:15 AM — "can I just use the Windows VPN?"

**No.** Windows' built-in VPN is a *dialer only*. Microsoft's own docs list the tunnel types
(IKEv2 / L2TP / PPTP / SSTP) and the setup step "enter your server name or address" — Microsoft
supplies **no servers**. It exists to reach a work network or a server you rent. By itself it
hides nothing and provides no privacy. Do not re-suggest it as a privacy option.
Ref: https://learn.microsoft.com/windows/security/operating-system-security/network-security/vpn/vpn-connection-type

**WARP's full tunnel already does what Jeff wanted, and unlike Proton it does NOT break the LAN.**
Verified 2026-08-19 07:12 with `mode warp` active:

| Check | Result |
|---|---|
| Public IP | **104.28.252.4** (Cloudflare) instead of 208.188.36.113 |
| Cloudflare trace | `warp=on`, `loc=US` |
| **Beehive on LAN (192.168.1.66:8123)** | **reachable** |

Cost of the full tunnel is throughput only: ~276 vs ~447 Mbit/s. For context 4K streaming needs
about 25 Mbit/s, so the loss is not perceptible in normal use.

**Toggle built:** `windows-scripts/Toggle-VPN.ps1` (live copy at `C:\Users\jeffl\HCC-Scripts\`),
with a desktop shortcut "VPN Fast-Private Toggle" at `C:\Users\jeffl\OneDrive\Desktop`
(note: the Desktop is OneDrive-redirected, so `C:\Users\jeffl\Desktop` does not exist).
It flips `mode warp` <-> `mode doh`, prints the before/after public IP, and confirms Beehive is
still reachable afterwards. Left in **FAST (doh)** mode per Jeff's stated priority of speed.

**What a VPN does and does not do** (so expectations stay honest): it hides the destination IP
from AT&T and shows sites a Cloudflare IP. It does **not** make him anonymous — accounts he is
logged into, cookies, and browser fingerprinting still identify him — and it moves trust from
AT&T to Cloudflare rather than removing it.

## 7:25 AM — three-button privacy setup (supersedes the single toggle)

Jeff asked for a "private button" and a "fast button", then reported Tor was slow. The single
toggle was replaced with **three** desktop buttons, because "fast", "private" and "anonymous"
are three different needs and collapsing them forced a false choice.

| Desktop button | Script | What it does | Speed | IP hidden | Anonymous |
|---|---|---|---|---|---|
| **1 - FAST Mode** | `Go-Fast.ps1` | WARP `mode doh`, no tunnel | ~447 Mbit/s | no | no |
| **2 - PRIVATE Mode** | `Go-Private.ps1` | WARP `mode warp`, full tunnel | ~276 Mbit/s | **yes** | no |
| **3 - ANONYMOUS (Tor)** | `Go-Anonymous.ps1` | tunnel OFF + launches Tor Browser | slow by design | yes | **yes** |

All three verified working 2026-08-19 07:20-07:26: PRIVATE flipped the public IP
208.188.36.113 -> 104.28.252.2, FAST returned it, and every mode confirmed Beehive still
reachable on the LAN. Tor Browser confirmed launching (`firefox.exe` + `tor.exe` running).

### Why "make Tor faster" cannot be granted

Tor relays every request through three volunteer-run nodes worldwide; that indirection *is* the
anonymity. No setting makes it fast. The one real error to avoid was mine: the first draft ran
Tor **inside** the WARP tunnel, stacking a fourth hop under Tor's three. `Go-Anonymous.ps1` now
drops the tunnel first (keeping encrypted DNS). Trade-off: AT&T can see Tor is in use, but not
what for. In-window tips printed for the user: Ctrl+Shift+L for a new circuit, keep security on
Standard, never stream over Tor, and do not maximise the window (size is a fingerprint).

### Tor Browser install note

`winget install TorProject.TorBrowser` (v15.0.20, portable) unpacked itself onto the **Desktop**,
which is OneDrive-redirected on this machine — so 314 MB of Tor Browser would have been synced
to Microsoft's cloud, wasteful and self-defeating for an anonymity tool. **Moved to
`C:\Users\jeffl\TorBrowser\`** and verified it still launches from there. If Tor is ever
reinstalled, move it out of OneDrive again.
