# HCC System Audit & Roadmap (2026-07-02)

Full-system review + the plan to make Beehive robust, fully-featured, and reliably
**online in the app.** Read this before the "HA bells & whistles" build.

---

## 1. The architecture (3 layers)
1. **The App (HCC)** — a single `index.html` PWA on **Cloudflare Pages** (`toro1-5rz.pages.dev`),
   served over **HTTPS**. Plus **Cloudflare Functions** (`functions/api/*`) that run server-side.
2. **Beehive** — Home Assistant OS 18.1 on the Beelink **J45** (internal SSD), IP **192.168.1.66**.
   Runs Mosquitto (MQTT), rtlamr2mqtt (meters), and the B-Hyve/LUX/Blink integrations.
3. **Devices** — RTL-SDR (water+gas meters), B-Hyve (irrigation), LUX (thermostat), Blink (cameras),
   + future Zigbee alarm layer and DIY electric monitor.

## 2. What's LIVE ✅
- Beehive standalone on the internal drive (reliable).
- **Water + gas meters** reading into HA (`sensor.water_meter`, `sensor.gas_meter`) every 60s.
- Cloud integrations that work **through Cloudflare Functions**: irrigation (B-Hyve), climate (LUX),
  weather, drought. These work because the *Function* (server-side) calls the vendor **cloud**, not
  the local HA.

## 3. THE BLOCKER — "Beehive Offline" in the app (root cause + fix)
**Why it's offline:** the app is a **secure `https://` page**, but it tries to reach Beehive at a
**local `http://192.168.1.66:8123`** address. Browsers **block** an https page from fetching http
(mixed content), and a LAN IP is only reachable on home WiFi anyway. So `checkBeehive()` and
`loadUtilities()` (which read the *local* HA directly from the browser) fail → **Offline**, meters
**Waiting**. The meters themselves are fine — this is purely the app↔HA link.

**The fix — give HA a secure PUBLIC https address, then point the app at it.** Two options:

| Option | Cost | Setup | Notes |
|---|---|---|---|
| **A. Nabu Casa (HA Cloud)** | ~$6.50/mo | One toggle in HA → Settings → HA Cloud → get `https://xxxxx.ui.nabu.casa` | Official, easiest, also unlocks easy **Alexa/Google** voice + **secure remote access** (app works away from home). Supports the project. |
| **B. Cloudflare Tunnel** | Free | `cloudflared` add-on in HA + a Cloudflare-managed domain → e.g. `https://beehive.<yourdomain>` | Free (Jeff already uses Cloudflare), but needs a **custom domain** on Cloudflare and more steps. |

Then in the app: set `ha_base` to that https URL (the app already stores `ha_base` in localStorage;
we add a field or hardcode it). `checkBeehive` + `loadUtilities` fetch the https URL with the token →
**Beehive shows online, meters go live, and it works even off home WiFi.**
→ **DECISION: Option A — Nabu Casa. DONE (07-03).** URL `https://kmtpozwheqwww9t5uxhhvzzso1tvagro.ui.nabu.casa`;
app's `HA_NABU` default points at it and `checkBeehive` tries it first with the bearer token.

### 3b. TWO more requirements for the browser to actually read HA (both needed)
Pointing at the https URL is necessary but **not sufficient** — the app is a *cross-origin* browser
page (`https://toro1-5rz.pages.dev`) calling HA. Two things must also be true:
1. **Token** — HA's `/api/` requires auth. The app must send `Authorization: Bearer <long-lived token>`.
   Jeff enters the token once in the app (HOME → Beehive card, or Account → Home Assistant); it's
   stored only in his browser's localStorage. ✅ app now sends it in `checkBeehive` + all HA fetches.
2. **CORS allow-list (the usual silent blocker)** — a browser will not let one origin read another
   unless the target says it's allowed. HA only sends CORS headers for origins in
   `http.cors_allowed_origins`. **Jeff must add the app's origin to HA's `configuration.yaml`:**
   ```yaml
   http:
     cors_allowed_origins:
       - https://toro1-5rz.pages.dev
   ```
   then **restart HA**. Without this the fetch fails with a network/CORS error that looks
   identical to "offline," even with a valid token + the https URL. This is almost certainly why
   the app stayed "Beehive Offline" even after Nabu Casa. (Editing config: File editor / Studio
   Code Server add-on, or SSH `nano /config/configuration.yaml`. Note: if an `http:` block already
   exists, add `cors_allowed_origins:` under it — don't create a second `http:`.)

## 4. HA build-out — the "bells & whistles" (after connectivity)
Once the app is talking to HA reliably:
- **Helpers (Settings → Devices & Services → Helpers → Create):**
  - **Template sensors** → convert raw to real units: water `sensor.water_meter / 10` = gallons;
    gas `sensor.gas_meter / 100` = CCF. (Then the app doesn't need to divide.)
  - **Utility Meter** helpers on those → **daily + monthly** usage (fills the Today / This-Month tiles).
  - **Derivative** helper on water → **current flow (gpm)** (fills the Flow tile).
- **Cost tracking:** template sensors: water $ (WHUD rate), gas $ (Piedmont therm rate), + the
  **City-of-White-House sewer** figure (feeds the refund case).
- **Energy Dashboard:** add water + gas (+ electric later) to HA's built-in Energy dashboard.
- **Automations:** leak alert (water flow with no schedule → notify + optional main-valve shutoff),
  "gas usage spike," appliance-done (later w/ electric), + the **panic** automation (siren/lights/alerts).
- **Recorder/History tuning** so long-term meter history is kept for the sewer case.

## 5. Beast ↔ Beehive fix
The beast throws `ERR_NETWORK_ACCESS_DENIED` reaching `192.168.1.66:8123` → almost always a **VPN or
antivirus** on the beast blocking local IPs. Fix: disconnect VPN / add an AV exception. (Once HA has a
public https URL from §3, the beast can just use that instead.)

## 6. Roadmap / sequence
1. **Connectivity** (§3) — pick Nabu Casa or Cloudflare Tunnel → app shows Beehive **online** + meters live.
2. **Helpers** (§4) — template + utility_meter + derivative → Today/Month/Flow tiles fill; cost tracking.
3. **Automations + Energy dashboard** — leak/spike alerts, panic automation.
4. **Sewer claim** — with live + logged water data, quantify the City-of-White-House overcharge.
5. **Zigbee alarm layer + SECURITY section** — coordinator stick + siren + sensors.
6. **Electric monitor** — DIY ATM90E32 → water 💧 + gas 🔥 + electric ⚡ complete.
7. **Ongoing:** Blink fix watch, mPING token, Lucky Mike (queued).
