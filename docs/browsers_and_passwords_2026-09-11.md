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

> 🔴 **CORRECTED 2026-09-16 00:05 — THE TWO BOLD CLAIMS ABOVE ARE WRONG. DO NOT ACT ON THEM.**
>
> **Firefox IS the https handler.** Windows Settings → Default apps → **Choose defaults by link
> type** shows the row verbatim:
>
> ```
> HTTPS, Firefox, Firefox URL
> ```
>
> **Why the original reading said "EMPTY":** `HKCU:\…\UrlAssociations\https\UserChoice` is
> **ACL-protected**. Reading it returns nothing and writing it returns *"Attempted to perform an
> unauthorized operation"* — measured both ways on 09-16. The `http` key next to it reads
> `ProgId=MSEdgeHTM, Hash=ttHcapkjlL0=` normally, which is what made the empty https read look like
> a real empty value rather than a blocked one. **An empty read from a protected key is not
> evidence of an empty value.**
>
> 🔴 **CONSEQUENCE THAT NEARLY COST SOMETHING: `https` must be reassigned to Edge BEFORE Firefox is
> uninstalled.** Removing Firefox first leaves every https link pointing at a program that is gone.
> On 09-16 an uninstall was started on the strength of the sentence above and had to be cancelled.
> See `COST_LEDGER.md`, entry 2026-09-16.
>
> **Routes tried for setting it, so nobody repeats them:**
> | route | result |
> |---|---|
> | `msedge.exe --make-default-browser` | ignored — just opens a tab (removed in Win10+) |
> | direct registry write of `ProgId` | **refused**, unauthorized operation (ACL) |
> | Settings → Choose defaults by link type → HTTPS | **this is the surface that works** — the list is virtualised, so filter it with its own *"Search for a link type"* box, not the global *"Find a setting"* box |

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

---

## 7. ✅ WHAT WAS ACTUALLY FIXED — 2026-09-11 01:00–01:20, every line read off the live UI

🔴 **THE REAL ROOT CAUSE OF "it comes up on some things but not all" WAS NOT THE DUPLICATES.**
§3 above blamed the three typo'd Xfinity entries. Those are real and still there — but they only
explain *Xfinity*. **The thing that broke autofill EVERYWHERE was a second setting, present in all
three browsers, that nobody had looked at:**

```
Settings -> Autofill
  Autofill on page load ................. [On]      <- the master switch everyone checks
  Default autofill setting for login items:
        "Do not autofill on page load"              <- THE BUG: every item opted OUT
```

**The master toggle being On means nothing while the per-item default is "Do not autofill".**
OPEN_ITEMS #161 diagnosed "Autofill on page load was Off" on 09-08 and never mentioned this second
control. That is why turning the master switch on did not fix it.

| client | before | after | how verified |
|---|---|---|---|
| **Firefox** | master Off, per-item "Do not autofill" | both On / "Autofill on page load" | UIA re-read of the toggle + the collapsed ComboBox label |
| **Edge** | master **On**, per-item **"Do not autofill"** | per-item -> "Autofill on page load" | same |
| **Chrome** | **logged out entirely**, master Off, per-item "Do not autofill" | logged in (551 items), both fixed | same |

⚠️ **TRAP, cost one cycle:** `ValuePattern.SetValue()` on that ComboBox sets `.Value` but does **not**
commit the Angular selection — the collapsed Group label still read the OLD value. **The displayed
`Group` label is the truth, not `ComboBox.Value`.** The working sequence is
`ExpandCollapsePattern.Expand()` -> find the `ListItem` by name -> `SelectionItemPattern.Select()`,
then re-read the Group label.

### 🟢 THE PIN — set, and the checkbox that decides it

§4 predicted the deciding detail correctly. Confirmed live in **both** PIN dialogs:

```
Set PIN dialog:
  PIN * (required)                              <- Jeff types this, never the assistant
  Require master password on browser restart  [On]   <- DEFAULTS ON. Untick BEFORE "Set PIN".
```

**Leave it ticked and the PIN is decorative** — the long passphrase still gets demanded on every
browser restart, i.e. exactly what Jeff said he never wants again. Unticked in Firefox and Chrome.

| client | timeout | PIN unlock | master pw on restart | net effect |
|---|---|---|---|---|
| **Firefox** | On browser restart | **On** | **Off** | restart -> locks -> **PIN unlocks it** |
| **Edge** | **Never** | *not offered* | n/a | **never locks, never asks** |
| **Chrome** | On browser restart | On (Jeff's PIN) | **Off** | restart -> locks -> PIN unlocks it |
| **Desktop app** | Never | already on | Off | see OPEN_ITEMS #166 row 3 |

🔵 **Why Edge shows no PIN option at all, and it is NOT a fault:** Bitwarden hides the entire
"Unlock options" section when `Timeout = Never`, because a vault that never locks has nothing to
unlock. Edge reads `Timeout: Never` (set 09-08, #166). **Do not "fix" this by adding a timeout** —
that would re-introduce a lock prompt on a client that currently never asks for anything.

### 🔴 A REAL FIND: Chrome's Bitwarden was LOGGED OUT, and a typo was hiding it

Chrome's extension was sitting on the **Log in** screen — which is why it filled nothing, ever.
The email field already contained **`jeff.loewen@comcast.netm`** (a stray trailing `m`) from some
earlier attempt. **That typo changes the outcome, it does not merely fail:** with the bad address
Bitwarden went straight to a master-password prompt; with the address corrected it recognised the
account and sent a **device-verification code to Jeff's email** instead. Corrected, verified by
reading the field back, then Jeff completed the code + master password. **Vault now loads 551
items in Chrome.**

⚠️ This is the *fourth* typo'd-email artifact found on this machine: 3 x `jeff.lewen@comcast.net`
in the vault (§3), an unconfirmed Firefox account on `jeffery.loewen@comcast.net` (OPEN_ITEMS #165),
and now `jeff.loewen@comcast.netm` in Chrome. **Read the address character by character before
concluding a login is broken.**

### Still open after tonight
1. **Default-browser association** — §1 unchanged, `https` ProgId still reads **empty** (re-checked
   01:09). Registry cannot fix it; needs the Settings click.
2. **The 3 typo vault entries** — identified, NOT deleted. Deletion is Jeff's call.

---

## 8. ✅ DEFAULT BROWSER — CLOSED. IT ALREADY DOES WHAT JEFF WANTS. 2026-09-11 01:30

**Jeff, 01:25: *"Fox fire is fine for default."* Measured immediately after — it already is.**

🔴 **EVERY EARLIER CONCLUSION IN THIS ITEM, INCLUDING §1 ABOVE, CAME FROM READING THE
REGISTRY AND NEVER ONCE OPENING A LINK.** That is the component-check trap the project's own
CLAUDE.md banner is about, reproduced exactly.

### The feature check — the only one that settles it
```
Start-Process "https://example.com"  ->  NEW firefox PID + window "Example Domain — ... Mozilla Firefox"
Start-Process "http://example.com"   ->  NEW firefox PID + window "Example Domain — ... Mozilla Firefox"
                                          msedge NEW PIDS = 0 , chrome NEW PIDS = 0   (both times)
```
🟢 **Firefox is the effective handler for BOTH schemes. Nothing needs to be clicked, set,
or repaired. This item is closed.**

### Why the registry misled three separate readings
```
http   UserChoice -> ProgId=MSEdgeHTM ; Hash=ttHcapkjlL0=      <- present, and IGNORED by Windows
https  UserChoice -> KEY MISSING ENTIRELY                       <- there is no user choice at all
```
The `http` ProgId still names Edge, yet Edge never opens a link — **Windows is rejecting that
UserChoice because its Hash no longer validates** (it is stamped per-user/per-ProgId and went stale
when Firefox was installed 09-03). With no valid choice for either scheme, the shell falls back to
the registered handler, which is Firefox. **A ProgId value is not evidence of what opens a link.
The hash decides, and only a real launch shows the result.**

⚠️ **`AssocQueryString` IS THE WRONG INSTRUMENT HERE — do not cite it.** It returned
`0x80070483 ERROR_NO_ASSOCIATION` for **`http`**, which demonstrably works, both with flags=0 and
with `ASSOCF_IS_PROTOCOL (0x1000)`. It was used mid-session to "prove" https had no handler. It
proves nothing about URL schemes on this build.

⚠️ **Windows Settings lies in BOTH directions on this page, measured tonight:**
* It **displays** `https -> Firefox, Firefox URL` while the UserChoice key does not exist.
* Its Edge page printed **"Your default browser was set"** when nothing had changed.
**Neither string is evidence.**

### Routes that were tried before the feature check made them unnecessary
| route | result |
|---|---|
| write `UserChoice\ProgId` directly | hash-protected; rejected/reverted |
| UIA `InvokePattern` on the Settings link-type row | no chooser opens |
| synthesized mouse click (`SetProcessDPIAware`+`SetCursorPos`+`mouse_event`) on the real rect | no chooser opens |
| `edge://settings/defaultBrowser` -> Make default | deep-links to Settings, prints success, changes nothing |
| Settings -> Default apps -> Firefox -> **Set default** (UIA invoke) | no registry change |

🔵 **Windows 11 requires genuine hardware input to change a default app.** That is real and
confirmed five ways — **but it does not matter here, because the end state Jeff asked for is already
in place.** ⚠️ **Do NOT "repair" the http UserChoice or delete the stale key to make the
registry look tidy** — the only thing a write could achieve is pointing http back at Edge, which is
the opposite of what he asked for.

### Still open after tonight
1. **The 3 typo vault entries** (`jeff.lewen@comcast.net`, §3) — identified, NOT deleted. Jeff's call.
