# Privacy hardening — beast PC (301SERVER), 2026-08-19

Jeff watched a documentary on web tracking and asked whether "Maximum privacy" means total
invisibility, and whether trackers can "follow you back and hack into your computer."

## Straight answers

**1. Nothing is total invisibility.** Tor is the closest practical thing. The single thing no
tool defeats: **being signed into an account.** Log into Google and Google knows it is Jeff,
through Tor, through a VPN, through anything.

**2. Fingerprinting is exactly the water-signature trick, run against him.** We identified his
toilet not by watching the toilet but by spotting a repeating 1.28-gallon pattern in meter data.
Screen size + fonts + GPU + timezone + language works identically: each value is harmless, the
combination is near-unique. That analogy is the correct mental model and lands well with him.

**3. "They'll hack into your computer" is TV dramatisation.** Ad-tech is commercial surveillance
for selling ads; breaking into a machine is a felony and is not their business model. Knowing a
screen resolution provides no route in. Real intrusions arrive via phishing, reused passwords,
unpatched software, and internet-exposed services — a different threat with different actors.
**Verified his actual posture the same morning:** Defender real-time ON, signatures 0 days old,
tamper protection ON; firewall enabled on all three profiles; every listening port (135, 445,
5040, 5357, 7680, RPC ephemerals, CodeProject.AI on 5000/32168) is LAN-only behind the router's
NAT. Nothing exposed. Told him plainly that nobody walks in from a fingerprint.

## What coverage the three buttons actually give

| Tracking method | FAST | PRIVATE | ANONYMOUS (Tor) |
|---|---|---|---|
| IP address | no | **hidden** | **hidden** |
| AT&T logging sites visited | no | **blocked** | **blocked** |
| Ad/tracker scripts | no | no | **blocked** |
| Browser fingerprint | no | no | **defeated** |
| Cookies persisting | no | no | **wiped per session** |
| Signed-in accounts | no | no | **no — nothing helps** |

The gap that mattered to him: **PRIVATE mode does nothing about fingerprinting.** Tor defeats it
by making all Tor users look identical — blending into a crowd rather than hiding.

## The finding that changed the recommendation

**uBlock Origin no longer works on this machine's Chrome.** Chrome 151 (installed here:
151.0.7922.169) removed the last Manifest V2 code paths in July 2026. Only uBlock Origin *Lite*
runs, which lacks dynamic filtering, cosmetic filtering and element picking. Most online advice
is now stale — do not recommend uBO-for-Chrome again.

So the fix is the browser, not an extension.

## Changes applied

**Brave installed** (`winget install Brave.Brave`, v151.1.93.136, at
`%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe`). Chromium-based so it looks
and behaves like Chrome and imports his data; blocks trackers and randomises fingerprints out of
the box with zero configuration. Policies set under `HKLM\SOFTWARE\Policies\BraveSoftware\Brave`:
`BlockThirdPartyCookies=1`, `MetricsReportingEnabled=0`, `BraveRewardsDisabled=1`,
`BraveVPNDisabled=1` (he already has WARP — a second VPN would repeat the Proton mess),
`BraveAIChatEnabled=0`.

**Edge hardened** (still the system default) — `HKLM\SOFTWARE\Policies\Microsoft\Edge`:
`TrackingPrevention=3` (Strict, per Microsoft's docs), `BlockThirdPartyCookies=1`,
`DiagnosticData=0`.

**Chrome hardened** — `HKLM\SOFTWARE\Policies\Google\Chrome`: `BlockThirdPartyCookies=1`,
`PrivacySandboxAdTopicsEnabled=0`, `PrivacySandboxSiteEnabledAdsEnabled=0`,
`PrivacySandboxAdMeasurementEnabled=0`, `MetricsReportingEnabled=0`.

**Windows** — `AllowTelemetry=1` (Required only). Advertising ID was already 0 from the earlier
debloat. **Caveat: this box is Windows 11 Home, where the AllowTelemetry policy is only partly
honoured** — it is not the full lockdown it would be on Pro.

**New desktop button "4 - Check My Privacy"** — opens EFF's Cover Your Tracks
(coveryourtracks.eff.org) in Brave so he can measure his own fingerprint rather than take
anyone's word for it.

## Still open / deliberately not done

- **Brave is not the default browser.** Windows 11 does not allow setting that programmatically;
  Jeff must do it once via Settings > Apps > Default apps, or Brave's own prompt.
- **System-wide DNS tracker blocking** (NextDNS free tier, ~300k queries/month) would block
  trackers in every browser and app, not just browsers. Needs an account, so it was left for him
  to decide. WARP currently owns DNS on this machine.
- Password hygiene / phishing resistance is the real remaining attack surface, not tracking.

## 7:50 AM — Chrome reclassified as a dedicated tool browser (and one change reversed)

Jeff explained he never had Chrome on this PC until it was needed for the **Claude in Chrome**
extension, and he never uses it for ordinary browsing. That changes what Chrome should be
optimised for, and it means hardening it for *surfing privacy* was optimising the wrong thing.

**His instinct was correct:** Google's revenue is advertising, so Chrome is the least
privacy-aligned mainstream browser. Quarantining it as a single-purpose tool and browsing
elsewhere is proper isolation — better than most people manage.

**REVERSED — `BlockThirdPartyCookies` removed from the Chrome policy.** On a browser nobody
surfs with, blocking third-party cookies buys close to zero privacy, while it can break
logins/SSO on exactly the sites this browser exists to drive (Cloudflare dashboard, Home
Assistant, GitHub). Wrong trade. Do not re-apply it to Chrome; it stays on Edge and Brave, which
Jeff actually browses with.

**Applied instead** (`HKLM\SOFTWARE\Policies\Google\Chrome`):
`SyncDisabled=1` (his browsing/passwords never upload to Google — the biggest real win here),
`BackgroundModeEnabled=0` (no lingering tray process; 11 chrome processes were running),
`DefaultBrowserSettingEnabled=0` (never nags to become default),
`MetricsReportingEnabled=0`, and the three Privacy Sandbox switches off.

**Chrome contents verified:** one profile ("Jeff"), three extensions — `fcoeoab…` = **Claude**
(the automation extension), plus Google Docs Offline and the built-in Web Store component.
Nothing unexpected.

**STILL OPEN — Jeff's call:** Chrome is signed in as **jeff.loewen792@gmail.com**. That is the
last thread tying his identity to the tool browser. With `SyncDisabled=1` the leak is much
smaller, but signing out would close it. Not done unilaterally — it is his account.
(His primary address remains jeff.loewen@comcast.net; the gmail is secondary.)

### CLOSED — the Gmail address is a throwaway, leave it signed in

Jeff (08-19 07:52): `jeff.loewen792@gmail.com` was created **solely to make Chrome work** and he
never uses it. His real address is **jeff.loewen@comcast.net**.

**Recommendation reversed: do NOT sign Chrome out.** A dedicated throwaway account *is* the
isolation, and it is slightly better than signing out — Google profiles a pseudonym that is not
Jeff, whereas a signed-out Chrome would be re-linked by fingerprint and shared household IP
(the same IP Brave and Edge use, where he is himself). The open item from earlier in this doc is
closed as "no action needed."

Only residual point: make sure that throwaway account does not reuse a password from anything
real. Password hygiene remains the top actual risk on this machine, well above tracking.

## 8:05 AM — Brave configured as the main browser

Jeff asked for Brave set up "as invisible as you can" and "as fast as you can", bookmarks moved
over from Edge, and asked whether he should just use Tor instead.

**Told him no on Tor as a daily driver** — slow by design, breaks sites, wrong tool for ordinary
browsing. Brave is the everyday browser; the Tor button stays for when he specifically needs to
be untraceable.

**Bookmarks imported: 123** (83 bookmark-bar + 40 Other), by copying Edge's Chromium-format
`Bookmarks` file into Brave's Default profile while Brave was closed, then verifying the counts
parsed back out of Brave's own copy. Brave had to be launched once first to create the profile.

**Policies applied** (`HKLM\SOFTWARE\Policies\BraveSoftware\Brave`):
search engine forced to **Brave Search** (off Google entirely) via `DefaultSearchProvider*`;
`BlockThirdPartyCookies=1`, `SyncDisabled=1`, `MetricsReportingEnabled=0`,
`BraveP3AEnabled=0`, `BraveStatsPingEnabled=0` (Brave's own analytics + heartbeat),
`BraveRewardsDisabled=1`, `BraveWalletDisabled=1`, `BraveVPNDisabled=1`, `BraveAIChatEnabled=0`,
`BackgroundModeEnabled=0`, `PromotionalTabsEnabled=0`.

### Three deliberate NON-changes — do not "fix" these later

1. **Fingerprinting left at Brave's default randomization.** Brave *removed* its Strict
   fingerprinting mode on purpose: it made users more identifiable, not less, because the strict
   cohort was small and distinctive. Default farbling/randomization is the correct setting.
   Cranking this to "maximum" would be actively counterproductive.
2. **Shields left at default (Standard).** Verified empirically — `brave_shields` in Preferences
   contains only P3A counters, i.e. nothing overridden. Standard already blocks ads, trackers and
   cross-site cookies and randomizes fingerprints. Aggressive mainly adds breakage.
3. **`SafeBrowsingProtectionLevel=1` kept ON.** It costs a little privacy (lookups) but phishing
   is Jeff's genuine attack surface, far above tracking. Security wins this trade.

**Also NOT set: `HttpsOnlyMode`.** Forcing it would break `http://192.168.1.66:8123` — Beehive —
in Brave. Brave's default HTTPS-by-Default already upgrades with fallback.

**Speed note:** blocking ads and trackers makes browsing *faster*, not slower — far fewer
requests per page. Privacy and speed align here; the only real speed cost in this whole setup is
the WARP full tunnel (PRIVATE button), which is opt-in per session.

**Left for Jeff:** `ms-settings:defaultapps` was opened so he can set Brave as default —
Windows 11 does not permit setting that programmatically.

## 8:20 AM — passwords, and Clean Beast taught to spare bookmarked sites

### Passwords did NOT come across with the bookmarks

Only the `Bookmarks` file was copied. Chromium encrypts saved passwords in `Login Data` with a
**per-browser key** (DPAPI-wrapped, stored in each browser's own `Local State`), so the file
cannot simply be copied between browsers — and hand-decrypting 313 credentials in a script would
be both fragile and a bad idea. **Brave's built-in importer is the correct tool**; it decrypts
via Edge's key as the same Windows user and re-encrypts under Brave's.

**Edge holds 313 saved passwords** (verified by row count only — no password values were read).
Recently used included eBay, PayPal, MLB, Sling and the Blink camera OAuth endpoint.

Opened `brave://settings/importData` for him. **He must UNCHECK Favorites/Bookmarks in that
dialog** — the 123 bookmarks are already in place and would otherwise duplicate.

### Clean Beast upgraded (`C:\Users\jeffl\Scripts\Clean-Beast.ps1`)

Two real gaps existed: **it did not know Brave existed** (cleaned only Chrome/Edge/Firefox, and
Brave is now the main browser), and it never touched cookies at all, so tracking data survived
every clean.

**Added Brave's `Cache` and `Code Cache`** to step 4.

**New step 4b — selective cookie purge** via `Clean-BrowserTracking.py`. It builds the keep-list
**from the browsers' own Bookmarks files**, which makes the rule self-maintaining and easy to
state:

> **BOOKMARK IT → YOU STAY LOGGED IN. Not bookmarked → its cookies get wiped.**

Verified by dry run: **91 protected domains** derived from the 123 bookmarks; on Chrome it would
delete **22 of 79** cookies and keep 57. Edge correctly refused while open.

Safety properties, all deliberate:
- **Saved passwords are never touched** by any step. Even a wiped cookie only means the site asks
  him to sign in and the browser fills it.
- Every cookie DB is **backed up to `~\Scripts\cookie-backups\`** before deletion.
- **Dry run reads a throwaway copy**, so previewing never disturbs a live browser
  (`--dry-run`). A real purge **refuses to run while a browser is open** rather than racing it —
  Windows holds an exclusive lock, so this is enforced by the OS, not just by politeness.
- If **no bookmarks are found at all, it aborts** rather than wiping everything.
- Step 4b prompts before closing browsers; answering anything but `y` skips it.

**Honest limit stated to Jeff:** this purges cookies, the main cross-site tracking vector, plus
all caches. It does not selectively prune Local Storage / IndexedDB, which are LevelDB stores
where per-origin surgery is not safely scriptable. Brave's Shields already block most of that
class of storage from third parties in the first place.
