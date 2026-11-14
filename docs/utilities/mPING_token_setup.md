# mPING — get reports actually sending (the one missing piece)

The in-app report form + the submit code (`functions/api/mping.js`) are correct and
match the mPING v2 API. Reports POST to `https://mping.nssl.noaa.gov/mping/api/v2/reports/`
with `Authorization: Token <MPING_TOKEN>`. **The only thing missing is the token**,
which NSSL issues on request. Two steps: (1) email NSSL, (2) paste the token into
Cloudflare. Then it just works.

---

## STEP 1 — Email NSSL for a token (send this)
**To:** mping@nssl.noaa.gov
**Subject:** Request for mPING API token — personal spotter app (jlo301)

> Hi mPING team,
>
> I'm a Weather Underground contributor / spotter (handle **jlo301**) in White House, TN.
> I've built a small **personal** Progressive Web App for my household weather station,
> and I'd like to submit mPING precipitation/phenomena reports directly from it to help
> ground-truth the radar in my area.
>
> Could you please issue me an **API token/key** for the mPING v2 report-submission API
> (`POST /mping/api/v2/reports/`)? It's for personal, non-commercial use — a single
> household app submitting my own observations.
>
> - Name: Jeff Loewen
> - Email: jeff.loewen@comcast.net
> - Location: White House, TN (~36.477, -86.66)
> - Spotter/handle: jlo301
> - Use: personal PWA, one user, my own reports
>
> Thank you for mPING and for considering my request.
> Jeff Loewen

---

## STEP 2 — When NSSL replies with a token, add it to Cloudflare
1. Go to **dash.cloudflare.com** → **Workers & Pages** → open the **toro1** Pages project.
2. **Settings → Variables and Secrets** (a.k.a. Environment variables).
3. **Add** a variable:
   - **Name:** `MPING_TOKEN`
   - **Value:** *(the token NSSL gives you)*
   - Type: **Secret / Encrypted**, environment: **Production**
4. **Save**, then redeploy (push any change, or use the "Retry deployment" button) so
   the function picks up the new variable.
5. Open the app → **Weather → Quick Precip Report** → tap a type → **Submit**.
   You should see **"Report submitted! NOAA mPING accepted it."**

That's the whole fix. If NSSL's reply is slow or they ask questions, forward it to
Claude and we'll answer them. If they decline individual tokens, the fallback is the
official mPING phone app — but most personal requests are granted.
