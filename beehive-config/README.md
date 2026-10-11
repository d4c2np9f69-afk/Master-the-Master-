# beehive-config — snapshot of Beehive's live `/config`

**Synced 2026-08-19 from that morning's 05:37 encrypted backup. Previously frozen at 2026-08-01
(18 days stale).**

| file | was | now |
|---|---|---|
| `configuration.yaml` | 3,170 | **7,007** |
| `automations.yaml` | 10,533 | **24,096** |
| `hcc.yaml` | 22,608 | **23,263** |
| `scenes.yaml` / `scripts.yaml` | 0 | 3 (genuinely empty — the 5 live scripts are inside `hcc.yaml`) |

`codeproject_ai_object` references: **0 → 20**. `roi_x_min` (the backyard AI fix): **present**.

Cross-checked: the `configuration.yaml` extracted from the backup is **byte-identical** to the
one fetched live from code-server. Two independent sources agreed.

## Why this mattered

On 2026-08-19 a session grepped `beehive-config/hcc.yaml` for the CodeProject.AI scanner, got
nothing, and read that as *"the scanner block is missing / unreachable from here."* It was
neither — **the scanners live in `configuration.yaml`**, and this snapshot predated them.
Cost about an hour.

§19 Pattern 2: *an empty grep is not evidence of absence — it is evidence that your search term
is absent.* Here it was evidence the **file was 18 days old.**

---

# HOW TO RE-SYNC — pure Python, no browser

```
pip install securetar
```

`securetar` is **the library Home Assistant itself uses to write these backups.** Then:

1. Take the newest `*.tar` from the iCloud `HCC-Beehive-Backups` folder.
2. `tarfile.open(bk).extractfile("homeassistant.tar.gz")` — that inner member is encrypted.
3. `SecureTarFile(fileobj=inner, gzip=True, password=<key>).open()` returns a normal
   `tarfile.TarFile`. The password is the backup encryption key kept in the secrets folder
   outside this repo — **reference it, never copy it here.**
4. Every config file is under `data/` inside that tar — e.g. `data/configuration.yaml`,
   `data/packages/hcc.yaml`.

⚠️ API note: `SecureTarFile` takes **no `mode` argument**; call `.open()` to get the TarFile.

The nightly `Sync-HABackup.ps1` already drops a fresh encrypted `.tar` into that iCloud folder at
06:30, so the **entire** `/config` tree — config, `custom_components`, `.storage` — is available
offline every morning.

⚠️ A backup is that morning's state. For anything changed since, read live (below).

## Reading the LIVE config

- `GET /api/config/automation/config/<id>` on the HA REST API returns any automation from
  `automations.yaml`. It does **not** reach package files.
- For package files live, use **code-server's** `/vscode-remote-resource?path=/config/<file>`
  endpoint. Its ingress iframe is same-origin but sits inside HA's **shadow DOM**, so
  `querySelectorAll('iframe')` will not find it — walk `shadowRoot` recursively, then
  `contentWindow.fetch(...)`.

⚠️ **`packages/hcc.yaml` may only be EDITED via the Terminal add-on** — §17 PART K. Reading by
any method above is fine.

## Dead ends — do not re-walk these

- ❌ **Hand-implementing securetar.** The backup is **v3** (magic `SecureTar`, version byte 3):
  Argon2id + XChaCha20-Poly1305 secretstream. A session started reasoning about implementing
  that at midnight before asking whether a library existed. It took one `pip install`.
  Jeff, the same night: *"why don't you search the web for more tools, better tools… there is
  tons of shit out there and you could easily be using it."*
- ❌ **`GET /core_configurator/api/file?filename=…`** returns **HTTP 200 with HA's SPA HTML**,
  not the file. Checking the status code alone makes it look like it worked. **Check the body.**
- ❌ **Bulk `<a download>` from the browser.** Chrome allows only ONE automatic download at a
  time; the first lands as `Unconfirmed NNNNN.crdownload` and the rest are silently dropped.
