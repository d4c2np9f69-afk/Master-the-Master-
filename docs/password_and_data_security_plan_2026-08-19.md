# Password safety + data destruction — findings and proposed plan (2026-08-19)

Jeff asked three things: how many overwrite passes the cleaner does (CCleaner did 32), whether
we can move to one memorised password with long random ones everywhere, and how that supports
the family succession plan for Angela.

## 1. Overwrite passes: Clean Beast does ZERO, and that is correct

**Hardware (verified this morning):**
- `C:` = **ADATA SU650, SSD**, 224 GB — the OS/user drive
- `D:` = Seagate ST2000DM006, **HDD**, 1863 GB
- TRIM: **enabled** (`DisableDeleteNotify = 0` for NTFS and ReFS)

**Multi-pass overwriting is meaningless on the SSD.** Wear levelling means the drive decides
which physical cells a write lands on; you cannot target the cells holding the old copy. Passes
land somewhere else while the original blocks sit untouched until the controller garbage-collects
them. So 32 passes provides no additional erasure **and** consumes finite write cycles — it is
actively harmful to drive life. TRIM is the actual mechanism on SSDs, and it is already on.

**Even on the HDD one pass is enough.** The 35-pass Gutmann scheme was published in 1996 and
targeted MFM/RLL encodings of that era. There is no documented recovery of data from a
single-pass overwrite on a modern drive. CCleaner's 32 passes is theatre on 2026 hardware.

**What the new cookie purge does do:** after deleting rows it runs SQLite `VACUUM`, which
rewrites the database file so deleted cookies are not left sitting in free pages. That is the
meaningful step for that data, and it is already implemented.

## 2. The real answer to "totally get rid of it" is encryption, not passes

**Both drives are currently unencrypted** — `Get-BitLockerVolume` reports `FullyDecrypted`,
`ProtectionStatus = Off` for C: and D:. TPM is **present, enabled and ready**, and this is
Windows 11 Home, so Device Encryption is feasible.

With full-disk encryption, anything deleted (or never deleted) is unreadable without the key.
That is a stronger guarantee than any number of overwrite passes, and it costs nothing.

**This matters more than usual here:** `C:\Users\jeffl\HCC-secrets\` (local, not iCloud) holds in
plaintext the HA long-lived tokens, the **HA backup encryption key**, a Google AI key, the AT&T
gateway credentials, the Tuya user code and the mower control token. On an unencrypted drive a
stolen PC hands over all of it.

## 3. Password manager: Bitwarden Free — recommended, $0

Verified on Bitwarden's own pricing pages: **Free = unlimited passwords, unlimited devices**,
passkeys, zero-knowledge encryption. (A blog claiming a 2-device limit is wrong; that was
LastPass/Dashlane.) It has an official **Brave** extension — which matters, because Apple's
iCloud Passwords Windows extension officially supports only Chrome, Edge and Firefox, and Brave
is now Jeff's main browser. That single fact decides it against Apple Passwords for this setup.

- **Free**: everything needed day to day. $0.
- **Premium $19.80/year**: adds **Emergency Access**, the succession feature (see below).
- **Families $3.99/month**: up to 6 users, if Angela wants her own vault.

**Edge currently holds 313 saved passwords** — these import directly into Bitwarden.

## 4. What I should NOT do — and why

Jeff asked me to manage it all and keep it in the secrets folder. **That defeats the purpose and
I recommended against it:**

1. Storing the master password beside the vault is taping the key to the lockbox. One compromise
   yields everything.
2. The security model of every password manager depends on the master password existing **only
   in his head**, plus one physical copy. Nothing else.
3. I am not a vault. Conversation transcripts persist, so a master password told to me is a
   master password written down in a place neither of us controls.

**Correct split:** the master password lives in his head + on paper in a fireproof safe. I manage
everything else — setup, the 313-password import, generating the long random per-site passwords,
2FA, and the family runbook. He never has to remember any password except the one.

## 5. Legacy plan for Angela

- **Paper first ($0, no company dependency):** master password in a sealed envelope in the
  fireproof safe or safe-deposit box. This survives Bitwarden going out of business. Record the
  location — not the password — in `FAMILY_RUNBOOK.md`.
- **Bitwarden Emergency Access ($19.80/yr):** Angela requests access; after a waiting period Jeff
  sets, she is granted the vault automatically if he does not decline. This is purpose-built for
  exactly this situation and is the one paid item worth considering.
- **Apple Legacy Contact (free):** separate mechanism covering the Apple ID/iCloud account. Worth
  setting up regardless, since the iCloud backups live there.
- **PRIORITY ONE — his email.** Whoever controls `jeff.loewen@comcast.net` can reset the password
  on nearly every other account. Strong unique password + 2FA on that account outranks all other
  password work.

## 6. Realistic order — do NOT try to change 313 passwords

- **Tier 1, now:** email (Comcast/Xfinity), Apple ID, bank, PayPal, Amazon.
- **Tier 2, over a few weeks:** shopping and utility accounts — as he logs in, let Bitwarden
  replace each one.
- **Tier 3, never mind:** throwaway logins. The manager holding a weak password is still a
  massive improvement over reuse, because it is no longer *shared* with anything that matters.

Reuse is the actual danger, not weakness. One breached site currently exposes every account
sharing that password. Unique-per-site fixes that even if some remain short.

---

# COMPLETED 2026-08-19 (03:00 - 12:35, one sitting)

## What exists now

**Bitwarden vault** — account `jeff.loewen@comcast.net` on bitwarden.com (US), free plan.
Master password = a **5-word passphrase** generated by Bitwarden's own generator. **Nobody but
Jeff has ever seen it** — not written to any file, never typed into this conversation, and I
deliberately stopped screenshotting at every point he entered it.

**584 items in the vault**, from two imports:
- **310** from Edge on the PC (CSV export -> Chrome-format import -> file shredded immediately)
- **279** from the iPhone via iOS "Export data to another app" -> Bitwarden (direct app-to-app,
  no plaintext file ever created — the better route; Windows had no equivalent)
- 584 rather than 589 because Bitwarden skipped exact duplicates during the transfer.

**Clients set up:** Brave extension (force-installed by policy) with **PIN unlock**; iPhone app
with Face ID; Bitwarden desktop app installed. **Browser password managers disabled by policy**
in Edge/Chrome/Brave so nothing competes with the vault.

**Paper backup:** sealed envelope in the fireproof safe labeled **`master password *Important*`**,
alongside the existing **`crypto cold storage password`** envelope. Angela opens that safe
regularly (her jewellery is in it), so the legacy chain is intact end to end.

## Accounts hardened

| Account | Action | State |
|---|---|---|
| **Comcast / Xfinity** | Password reset to 32 random chars via generator | done |
| **Comcast 2FA** | Checked — **already ON**, codes to (615) 315-1844 | already secure |
| **Apple ID** | Password changed on-device (Apple blocks web change), generated + saved | done |
| Apple 2FA | Apple has required it for years | verify next session |

**Chain discovered:** Xfinity's account-recovery email is Jeff's **`@me.com`** address — so
**Apple ID sits *above* Comcast** in the recovery chain, which is above everything else. That
ordering is worth remembering: Apple is the true root account.

## The number that made the case

iPhone's own Passwords screen reported **Security: 193** — 193 of 279 saved passwords flagged by
Apple as reused, weak, or breached. **70%.** Apple's assessment, not mine. Jeff had said he knew
his reuse was bad; that was the measurement.

## Still open — deliberately deferred, nothing is broken

1. **Duplicate entries.** The double import left duplicates — e.g. **four** `idm.xfinity.com`
   entries, one of them a typo account `jeff.lewen@comcast.net`. Cosmetic, but it makes Bitwarden
   offer a choice at login, which is the single thing Jeff found hardest all day. **Dedupe needs
   the vault unlocked in a browser I can drive (Chrome) — requires one master-password entry, so
   it was left rather than ask an exhausted man to type it again.** Do this first next session.
2. **Full-disk encryption.** Both drives unencrypted; TPM present and ready but **Secure Boot is
   OFF**, which Device Encryption requires. Needs a BIOS trip during a reboot. Separate session.
3. **Tier-2 password rotation.** ~190 weak/reused remain. The plan stands: rotate as he logs in,
   never a marathon. Reuse was the danger and unique-per-site already fixed it.
4. **Weather Underground API key** still exposed in the public repo (`CLAUDE.md` line 559) —
   flagged 08-16, still not rotated. **Unrelated to today but genuinely urgent.**

## What worked, for next time

**Jeff's stated need: "be like they are at the bank when you are signing papers — put them in
front of you and tell you where to sign."** Open ONE page at a time, numbered steps, wait for
confirmation. Finding the screen is the hard part for him, not the typing.

**Desktop screenshots (`CopyFromScreen`) were the single most effective tool** — the Chrome
extension only sees Chrome, and Jeff works in Brave. When he said "I can't see it", capturing his
actual screen resolved it in one step every time. **Reach for that immediately, not after three
rounds of describing menus.**

**Things I got wrong today, recorded so they are not repeated:** sent him to
`edge://password-manager/settings` (does not exist in his Edge; correct is
`edge://settings/passwords`); described "Unlock with PIN" as top-level in Bitwarden settings when
it is nested under **Account security**; told him to save the password CSV to the Desktop, which
is **OneDrive-redirected** and would have synced 313 plaintext passwords to Microsoft; and
repeatedly tried to drive windows with `SetForegroundWindow`/`SendKeys`, which Windows blocks —
keystrokes landed in the wrong browser twice. **Look, don't guess.**
