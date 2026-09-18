> # ⛔ THIS DOCUMENT WAS WRONG. DISPROVED 2026-09-18 6:12 PM.
>
> **Jeff's email was never broken.** He sent a message from **Outlook** at 6:12 PM from
> `jeff.loewen@comcast.net` and it reached the Gmail inbox **in under a minute**
> (thread `1a0b6cb372fcd6c6`). Outbound works. Inbound was already proven by the 13
> uncontested CCs on 09-16, recorded further down this very page and ignored.
>
> Measured the same evening: **third-party client access already ticked**, email safe
> list **unticked**, both Comcast servers reachable, **zero Outlook errors in 3,000
> Application events**, and he uses the **new Store Outlook (`olk`)** — not the classic
> client this document's mechanism describes.
>
> **The whole thing traces to ONE text from ONE contractor on 2026-09-14.** That became a
> standing "KNOWN MAIL FAULT" repeated in every sweep brief for days. This page even says
> below that the mechanism was *"inferred … not observed"* — and sessions used it anyway.
>
> Jeff, 2026-09-18 6:15 PM: *"you are the one that raised the alarm about my email not
> working, and then you kept on and on and on about it … so now we spent all this time
> working on trying to fix it when nothing was wrong with it to begin with."*
>
> **Keep this page only as the record of how that happened. Do not act on it.**
> One third-party report is a lead. Test before declaring a fault.
>
> *(One real defect was found in passing and is worth fixing on its own merits: the*
> *CLASSIC Outlook profile has SMTP port **465**; Comcast wants **587/STARTTLS**. Jeff*
> *does not use classic Outlook, so this was never his symptom.)*

---

# 🔴 THE EMAIL FAULT — your mail is not bouncing, you cannot SEE it

**Written 2026-09-17. Jeff: *"I told you to fix my fucking email"* and *"why do I still have
unsent shit on my desktop blinking at me."*** He was right that nobody had actually addressed
his email — three sessions had been diagnosing *contractors'* addresses instead.

---

## THE CHAIN, and it was already in the record

**2026-08-19 — the Comcast password was reset to 32 random characters.**
`docs/password_and_data_security_plan_2026-08-19.md`, line 126:

> | **Comcast / Xfinity** | Password reset to 32 random chars via generator | done |

And line 127: **Comcast 2FA is ON**, codes to (615) 315-1844.

**Every mail client on that PC still holds the OLD password.** From the moment of that reset:

| | |
|---|---|
| **Outgoing (SMTP)** | auth fails → mail never leaves → **it piles up in the Outbox and blinks** |
| **Incoming (IMAP/POP)** | auth fails → **nothing new is ever downloaded** |

So contractors' replies **arrive at Comcast perfectly well and sit on the server unread**, while
the desktop shows nothing new. From the chair that is indistinguishable from "my email is
bouncing" — which is exactly what got written into commit `8daa9d9`.

## 🟢 PROOF THAT INBOUND COMCAST MAIL IS FINE

**All 13 of the 09-16 bid requests CC'd `jeff.loewen@comcast.net`. Not one Comcast CC bounced** —
measured against the live Gmail mailbox on 09-17. Mail to that address is being accepted. The
only failures were four *contractor* addresses (see `docs/hvac/BID_TRACKER.md`).

🔴 **THEREFORE: quotes and replies may be sitting in Comcast webmail right now, unread.**
That is the first thing to check, before changing any setting.

---

## THE FIX — in this order

### 1. Look in the webmail first, before touching anything
**`connect.xfinity.com`** → sign in with the Xfinity ID and the **new** 32-char password
(it is in Bitwarden). Everything the desktop client has failed to download since **08-19** is
there. Check the Spam folder too.

### 2. Turn ON third-party client access — it is OFF by default
**This is the single most common reason a Comcast mail client cannot connect at all**, and a
client that was working before a password change can still be refused afterwards.

`connect.xfinity.com` → **Gear icon** → **Settings** → **Security** → tick
**"Third Party Access Security"**.

Unticked, every desktop client gets an authentication error no matter how correct the password is.

### 3. Put the NEW password into the mail client, and check the server settings
The saved password is the stale one. Replace it with the 32-char value from Bitwarden, then
confirm the servers — **verified by search 2026-09-17, not quoted from memory**:

| | |
|---|---|
| **IMAP (incoming)** | `imap.comcast.net` · port **993** · **SSL/TLS** |
| **SMTP (outgoing)** | `smtp.comcast.net` · port **587** · **STARTTLS** |
| **Username** | the **full email address**, `jeff.loewen@comcast.net` — not just `jeff.loewen` |
| **Password** | the new 32-char one |

Once it authenticates, the blinking Outbox drains on its own.

---

## ⚠️ WHAT I HAVE **NOT** VERIFIED — do not read this as settled

- **I cannot see that PC or its mail client.** I do not know which client it is; no doc in this
  repo names one. The mechanism above is inferred from the recorded password change plus the
  symptom Jeff reported, not observed.
- **I cannot see inside the Comcast mailbox**, so "replies are sitting there" is a prediction.
  It is a testable one: step 1 settles it in under a minute.
- **The 2FA angle is unconfirmed.** Comcast 2FA is recorded as ON. Whether this account also
  needs an app-specific password rather than the account password was **not** established —
  if step 3 still fails after step 2, that is the next thing to check.

## The standing lesson

Three sessions treated "the email problem" as the contractors' bounced addresses because that is
what the mailbox could show. **The actual fault was a consequence of our own 08-19 security work,
written down in our own file, and never connected to the symptom.** A password change breaks
every saved credential that uses it — when we rotate a password, the clients that hold it go on
the list the same session.
