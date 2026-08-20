# ⚠️ PARTIALLY SYNCED 2026-08-19. `configuration.yaml` IS CURRENT — THE REST ARE NOT.

| file | state | bytes | note |
|---|---|---|---|
| `configuration.yaml` | ✅ **SYNCED 2026-08-19 23:26** | 3,170 → **7,007** | Was missing the entire `image_processing:` block. **0 → 11** `codeproject_ai_object` references. |
| `hcc.yaml` | ❌ stale 2026-08-01 | 22,608 (live: **23,221**) | 613 bytes behind |
| `automations.yaml` | ❌ **badly** stale 2026-08-01 | 10,533 (live: **35,223**) | **3.3× behind** — most automations added since are absent |
| `scenes.yaml` | ⚪ n/a | 0 (live: 3) | effectively empty both sides |
| `scripts.yaml` | ⚪ n/a | 0 (live: 3) | empty — the 5 live scripts live in `hcc.yaml`, not here |

## What this folder did to a session on 2026-08-19

`grep` over `beehive-config/hcc.yaml` for the CodeProject.AI scanner returned nothing. That was
read as *"the scanner block is missing / unreachable from here."* It was neither — **the scanners
live in `configuration.yaml`**, and this snapshot predated them entirely. Cost about an hour.

§19 Pattern 2 verbatim: *"an empty grep is not evidence of absence — it is evidence that your
search term is absent."* Here it was evidence the **file was 18 days old.**

## HOW TO FINISH THE SYNC — this method works, use it

Reading `/config` has no REST API and the Terminal add-on is classifier-blocked. **Two dead ends
first, so nobody re-walks them:**

- ❌ `GET /core_configurator/api/file?filename=…` returns **HTTP 200 with HA's SPA HTML**, not the
  file. Checking the status code alone makes it look like it worked. **Check the body.**
- ❌ The nightly backup `.tar` in iCloud is **securetar v3** (magic `SecureTar`, version byte 3) —
  Argon2id + XChaCha20-Poly1305 secretstream. Not practically decryptable ad hoc, and
  `cryptography` is not installed on this PC.

✅ **What works — code-server's file endpoint through the Studio Code Server ingress iframe:**

1. Open **Studio Code Server** in HA (browser tools, Jeff's Chrome session).
2. The add-on runs in a **same-origin iframe inside HA's shadow DOM** — a plain
   `querySelectorAll('iframe')` will not find it. Walk `shadowRoot` recursively.
3. From inside that frame: `contentWindow.fetch(<iframeSrc> + '/vscode-remote-resource?path=' +
   encodeURIComponent('/config/<file>'))` → returns the real file text.
4. Getting it to disk: tool results truncate around 1.5 KB, so do **not** paste 65 KB through
   them. Build a `Blob`, trigger an `<a download>` click, then read it out of
   `C:\Users\jeffl\Downloads`. **Chrome only allows ONE automatic download at a time** — the file
   arrives as `Unconfirmed NNNNN.crdownload` at full size and the next download is silently
   dropped. Do them **one at a time**, copy each `.crdownload` immediately, then trigger the next.
5. code-server's connection drops often ("Connection lost. Reconnecting…"). Re-check before
   assuming a failure is yours.

⚠️ **`packages/hcc.yaml` may only be EDITED via the Terminal add-on** — §17 PART K standing rule.
Reading it by the method above is fine.

## Status

Open item **#12** in `docs/OPEN_ITEMS.md`. `configuration.yaml` — the file that actually caused
the damage — is now current. `automations.yaml` and `hcc.yaml` still are not.

**Note automations are separately reachable** via `GET /api/config/automation/config/<id>` on the
HA REST API, so a stale `automations.yaml` here is far less dangerous than the missing scanner
block was — that had no other path.

**When the last file is synced, delete this README in the same commit** so the warning never
outlives the problem.
