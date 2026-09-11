# 🔐 BROWSERS + PASSWORDS — the actual state, measured 2026-09-11 12:35 AM

**Jeff: *"make sure it is set up correctly and works on all passwords on the computer and browsers…
make sure I can use my pin # and not have to put in the long as password ever again"* and
*"Edge is supposed to be my default browser… get rid of Firefox and keep Edge, Tor and Chrome."***

Everything below was read off the machine tonight, not carried from memory.

---

## 1. 🔴 THE REAL DEFAULT-BROWSER BUG — `https` has NO handler

```
http          -> MSEdgeHTM      OK
https         -> (ProgId EMPTY) <-- THE BUG
ftp           -> MSEdgeHTM      OK
.htm / .html  -> MSEdgeHTM      OK
.pdf          -> MSEdgePDF      OK
```

**Edge is already the default for everything except `https`** — which is nearly every link that
gets clicked. The `UserChoice` key exists but its `ProgId` value is blank. **Firefox is NOT the
handler for http or https** — it is not stealing anything.

⚠️ **This cannot be fixed by writing the registry.** Windows protects `UserChoice` with a
per-user validation hash; a hand-written `ProgId` is rejected or silently reverted on next logon.
**It must be set through Settings → Apps → Default apps → Edge → "Set default", or Edge's own
`edge://settings/defaultBrowser` → Make default.**

---

## 2. 🟢 BITWARDEN IS NOT BROKEN — it is installed everywhere it should be

| browser | Bitwarden | note |
|---|---|---|
| **Edge** | ✅ `jbkfoedolllekgbhcbcoahefnbanhhlh` — *Bitwarden Password Manager* | the **Edge Add-ons build**, a different ID from Chrome's |
| **Chrome** | ✅ `nngceckbapebfimnlniiiahkandclblb` | in active use (Preferences written 00:31) |
| **Brave** | — | **Brave is no longer installed at all** (it was, on 08-19) |
| **Desktop app** | ✅ `AppData\Local\Programs\Bitwarden` | |

🔴 **TRAP, and it nearly produced a false alarm tonight: Edge Add-ons and the Chrome Web Store use
DIFFERENT extension IDs for Bitwarden.** Checking Edge for the Chrome ID returns "not installed"
and looks like a regression. **Always resolve the ID to a manifest name before reporting a browser
as missing an extension.**

⚠️ **Do not undo:** the **iCloud Passwords** extension (`mfbcdcnpokpoajjciilocoachedjkima`) is in
Edge and is **disabled on purpose** — two managers on one field made Bitwarden cut its inline menu
off. Edge's own password manager stays ON as backup (`PasswordManagerEnabled = 1`, verified).

---

## 3. 🔴 THE ACTUAL CAUSE OF "it comes up on some things but not all"

**It is not the install. It is duplicates.** Read live from the vault:

| # | site | username |
|---|---|---|
| 1 | `idm.xfinity.com` | *(no username)* |
| 2 | `idm.xfinity.com` | **jeff.lewen@comcast.net** ← typo |
| 3 | `idm.xfinity.com` | jeff.loewen@comcast.net |
| 4 | `idm.xfinity.com` | jeff.loewen@comcast.net |
| 5 | `login.xfinity.com` | angela.loewen@comcast.net |
| 6 | `login.xfinity.com` | **jeff.lewen@comcast.net** ← typo |
| 7 | `login.xfinity.com` | **jeff.lewen@comcast.net** ← typo |
| 8 | `login.xfinity.com` | jeff.loewen@comcast.net |

🔴 **Eight Xfinity entries across two domains, THREE of them under an email missing the "o" in
Loewen.** OPEN_ITEMS #3 recorded *"four idm.xfinity.com, one a typo"* — **it is twice that, and
three typos.** Those three can never authenticate, which is exactly the reported symptom.
**Nothing is changing his passwords; he is being handed a broken entry.**

---

## 4. 🔵 THE PIN — possible, with one checkbox that decides whether it actually works

**Windows Hello is NOT available as the route today:** there is **no NGC container** on this
machine, i.e. no Windows Hello PIN is configured. TPM is ready (2.0), so it *could* be set up, but
creating it is a credential only Jeff can set.

**So the route is Bitwarden's own PIN unlock**, set per client:
> extension / desktop → **Settings → Account security → Unlock with PIN**

🔴 **The deciding detail: the checkbox "Lock with master password on browser restart."**
Leave it **ticked** and the long passphrase is still demanded every browser restart — i.e. the
thing Jeff explicitly never wants again. Untick it and the PIN genuinely replaces it.
⚠️ **Honest trade-off, stated once:** a 4-6 digit PIN is materially weaker than the passphrase.
It is his call, and the vault still holds the passphrase as the recovery path.

---

## 5. 🟢 FIREFOX IS ALREADY SET UP — and Jeff is using it RIGHT NOW

**Jeff, 2026-09-11 00:39: *"I said I would use fox fire if you set it all up like edge and all my
bookmarks and passwords and bitwarden worked properly."* Measured immediately after - it very
nearly already is.**

```
Bitwarden Password Manager  {446900e4-71c2-419f-a6a7-df9c091e268b}  v2026.8.0  active=True userDisabled=False
  extension storage          29 MB, modified 2026-09-11 00:32       <-- synced vault cache = LOGGED IN
uBlock Origin               uBlock0@raymondhill.net  v1.74.0        active=True
bookmarks                   132   (backup 2026-09-11)               <-- Edge has 126
firefox.exe                 16 processes RUNNING at 00:40
```

🟢 **Bookmarks already migrated** - the backup filenames carry the count: **10** on
2026-09-08, **132** on 2026-09-11. They came across in between.
🟢 **Bitwarden is not merely installed, it is logged in** - 29 MB of synced vault cache
touched seven minutes before this was written.

**So only TWO things remain to make Firefox a full replacement:**
1. **The default-browser association** (§1 above - `https` has no handler at all).
2. **The PIN** (§4 above - not set in any client yet).

---

## 6. 🟡 DO NOT DELETE FIREFOX BLIND - it is the ad-blocker

Jeff asked to remove Firefox and keep Edge, Tor and Chrome. **Measured first:**

```
C:\Program Files\Mozilla Firefox\firefox.exe   installed 2026-09-03
profile 4uu4j4dy.default-release               history 5 MB, last written 2026-09-10 21:32
extensions                                      uBlock0@raymondhill.net.xpi   <-- uBlock Origin
```

🔴 **It was installed a week ago on purpose and used last night.** OPEN_ITEMS #160 is why:
**uBlock Origin is dead on Chrome 151**, and Edge is Chromium too, so it has the same limitation.
**Removing Firefox removes working ad-blocking from this machine.**

⚠️ **And the record's old line is now stale:** on 2026-08-21 it read *"there is no regular Firefox
on this PC — the only firefox.exe is TorBrowser."* **That is no longer true.** There are now two:
the standalone at `Program Files\Mozilla Firefox`, and **Tor Browser's own at
`C:\Users\jeffl\TorBrowser\Browser\firefox.exe` — which must survive, because Tor IS Firefox.**
🔴 **Any "uninstall Firefox" step must target the Program Files install ONLY.** Killing
`firefox.exe` broadly, or uninstalling by process name, takes Tor with it.
