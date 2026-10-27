# The cool list — automations with an outcome

**Fri 2026-09-18.** Jeff: *"get crazy and creative I want some cool ideas and automations combined
with cool outcomes."* The first list was all chores. This one is not.

> 🔴 **Sourcing, honestly:** **thespruce.com and reddit.com both hard-block Anthropic's crawler**
> (HTTP 400/403 — not a search failure), and **Pinterest serves a JavaScript shell** that returns
> nothing to a fetch. I got Pinterest idea-page titles from search snippets only. The Chrome
> browser tool *can* reach both properly — say the word and I'll go pull them by hand.
> Everything below is from HA Community, the HA official blog and voice docs, Hackaday,
> HowToGeek, XDA, CCOSTAN's published config, and HACS integration repos.

> 🔴 **PRICES ARE UNVERIFIED.** Nothing here is a buy recommendation until I price it for real.
> Items marked **$0** use hardware already in the house — those are safe to act on.

> 🔴 **THE CONSTRAINT THAT SHAPES EVERYTHING:** you own **zero colour-capable lights**. Kasa
> dimmers and dumb lamps on plugs — all white. Roughly 60% of the internet's "wow" lighting canon
> assumes RGB. Every lighting idea below is written for **white-only first**. Brightness, speed
> and staging carry most of the drama; lightning is white anyway.

---

# THE FIVE I'D BUILD FIRST

## 1. ⚡ THE HOUSE FLINCHES WITH THE LIGHTNING — **$0, one evening**

**The outcome:** You're in the living room. Sky goes green-black. A strike lands six miles out and
**before the thunder reaches the house**, the lamps stutter white — twice, unevenly, because real
lightning never flashes once. Then they settle. Every strike inside your radius, the house flinches
with it.

The Blitzortung integration (free, HACS, community lightning network — **no hardware**) fires an
event per strike carrying **distance and azimuth**. So the flash scales: a near strike blows the
room out, a far one is a wink.

**Why this one is yours specifically:** you are an NWS-trained, verified storm spotter with your own
instrument. This is not a gimmick on your house. It is the house reacting to the thing you actually
watch the sky for.

**Build:** event trigger on `blitzortung_lightning_strike`, distance condition, `mode: restart`,
dimmers to 100% for ~120 ms then back to prior brightness, twice, uneven gap.
**Source:** [roenning.net — Flash your lights when thunderstorms approach](https://roenning.net/2026/06/19/flash-your-lights-when-thunderstorms-approach-with-home-assistant-and-blitzortung/)

---

## 2. 🌩 STORM SPOTTER MODE — **$0, and nobody else has it**

**The outcome:** NWS drops a warning for Robertson County **and** your own station confirms it —
pressure crashing, wind shifting, gust spike. The house changes state. Hall and bath lights go full
so nobody's fumbling if the power drops. Irrigation cancels itself. The TV pauses. Every Echo
announces it once, in plain language, with the expiry time. The wall screen flips to radar. The
station starts logging fast.

**Then the part that matters:** when the warning clears, **it writes your spotter report.** Peak
gust and the minute it happened. Pressure minimum. Rain total and peak rate. Temperature drop.
Your own instrument's record, formatted to file with Spotter Network or mPING.

**And it doubles as insurance documentation** — if a shingle comes off, you have your own
calibrated measurements with timestamps, not a forecast.

Three escalation levels — Watch, Warning, Tornado Warning — give the house three personalities.

⚠️ **Do not double-book the Zigbee siren here.** It is already assigned to the leak alarm and you
judged it too weak. Ask before it gets a second job.

**Build:** `ha-nws-alerts` (HACS, free) exposes TOR/TOA/SVR/SVA event types; everything else is gear
you own.
**Source:** [ha-nws-alerts](https://github.com/tannerprice/ha-nws-alerts) ·
[This Smart House — NWS Alerts setup](https://thissmart.house/2025/09/29/how-to-set-up-nws-alerts-in-home-assistant-v6-guide/)

---

## 3. 🕰 THE GRANDFATHER CLOCK TAKES OVER THE HOUSE — **$0, or ~$8 for the good version**

**The outcome:** The clock strikes the hour in the hallway — and a quarter-second later **every Echo
in the building strikes with it.** Westminster on the quarters, the count on the hour. Guests
cannot work out where the sound is coming from.

**The refinement that makes it art:** an ~$8 Zigbee vibration sensor on the clock case, so the house
is triggered by **the real clock's own hammer** rather than a timer. Your 100-year-old movement
becomes the thing that drives the smart home. That's a story you tell for the rest of your life.

CCOSTAN's published config goes further with **seasonal chime packs** — patriotic in July, spooky in
October, sleigh bells in December.

**Build ($0):** chime audio + `media_player.play_media` to the Echos on a quarter-hour trigger.
**Source:** [HA Community — Grand Father Clock Chime](https://community.home-assistant.io/t/grand-father-clock-chime/9465) ·
[CCOSTAN's config](https://github.com/CCOSTAN/Home-AssistantConfig)

---

## 4. 🎙 THE HOUSE GETS A VOICE — AND IT ROASTS YOU — **$0 hardware**

**The outcome:** You say good morning and the kitchen Echo does not read a weather report. It says:
*"Morning. Pressure's been falling since three — down four millibars. You'll want to be outside by
two."*

Then, twice a week, at a moment you can't predict: *"Garage door's been open fifty minutes. I'm not
judging. I'm describing."* / *"Fourth time the fridge has opened since nine. Impressive."*

This is **officially supported, not a hack** — HA's own docs tell you to write a prompt template to
give the assistant a character (their example is literally *"You are Super Mario. Be funny."*), and
**Anthropic is a listed provider**, so the house can talk in the same voice you already work with.
There's a shipped blueprint for the daily briefing whose suggested tone is *"humorous like Jarvis."*

**Why it works when generic funny-Alexa stuff doesn't:** it's commenting on **your real house, with
your real data.** A joke skill is noise. A house that notices what you actually did is uncanny.

🔴 **Frequency is the entire game.** Daily is annoying and Angela unplugs it. Twice a week at random
is legend.

**Source:** [HA — Create a personality with AI](https://www.home-assistant.io/voice_control/assist_create_open_ai_personality/) ·
[HA — Daily summary by Assist](https://www.home-assistant.io/voice_control/assist_daily_summary/)

---

## 5. 😴 A GOODNIGHT THAT TAKES FOUR MINUTES — **$0, every device already yours**

**The outcome:** You say it once and the house doesn't snap off — it **winds down.** Living room
fades over 90 seconds while the kitchen is still lit. Then the kitchen. Garage door checks itself
and closes. Irrigation confirms off. Recirc pump dies. And the last thing that happens, two minutes
after you're already in bed, is the bed lamps easing down to nothing.

You fall asleep inside a building that is putting itself to bed around you.

**The staging is the whole thing.** A goodnight that fires everything at once is a light switch. One
that moves room to room over four minutes is a **ritual** — you can hear the house going to sleep
behind you.

**Your version:** the grandfather clock chime plays once, softly, as the final beat. And one spoken
line from the voice in #4 — tomorrow's weather, one sentence, in character.

More people call this the best thing in their whole smart home than any other single routine.
**Easy to build, medium to tune** — getting the timing to feel right takes a few nights.
**Source:** [Home Automation Cookbook — Bedtime Routine](https://www.homeautomationcookbook.com/automation/daily-routines/bedtime-routine.html)

---

# THE ONES ONLY YOUR HOUSE CAN DO

## 6. 🧊 "SOMEONE JUST MADE ICE" — **$0, and it is original**

You already characterised your water signatures — the **1.28 gallon toilet fill**, both icemakers.
That means the house can identify **what appliance just ran, from the water flow alone.**

**The outcome:** a guest is standing in your kitchen and the house says, deadpan, *"Someone just
made ice."*

The research agent searched and **found nobody publishing this for entertainment anywhere.** The
hardware is your RTL-SDR, already installed. The research is already done. The cost is zero dollars.
This is the biggest "how did you *do* that" on the page.

## 7. 🌱 THE LAWN TELLS YOU WHEN TO MOW — **$0**

You own a mower that logs hours and GPS track, **and** a station with a solar radiation sensor. Put
them together: growing degree days + real ET₀ + rainfall since the last mow = an actual prediction
rather than a calendar.

*"Grass is up about 1.4 inches since Sunday. Thursday afternoon is your window — 78°F, 6% rain, dew
burned off by ten."*

Nobody sells this. It only exists because you happen to own both halves.

## 8. 🚿 THE RECIRC PUMP THAT LEARNS YOUR SHOWER — **$0**

Your water monitor records every session — volume, duration, hot-water share. Let it learn when
showers actually happen, then run the recirculation pump for fifteen minutes **before**, and not one
minute otherwise. Hot water the second you open the tap, nothing running down the drain while you
wait, and the pump works half an hour a day instead of sitting dead — it has been untouched for
**98 hours**.

## 9. 🚽 THE RUNNING-TOILET DETECTIVE — **$0**

A 1.28-gallon fill with nobody home is a leaking flapper. The house catches it the first day instead
of on the bill.

## 10. 🕯 THE FAMILY HEARTH — **$0 (the screen is already yours)**

That **23-inch touchscreen all-in-one** doing nothing is the best thing in your spare-hardware pile.
On the wall it becomes a slow rotation of family photos — and when one lands, a line fades in
underneath: *"Jeff & Angela, 1989."* On a birthday it switches to that person all day. On an
**ancestor's** birthday it pulls from the genealogy archive: *"Today is George Washington Baker's
birthday. Born 1841."* Touch it and it flips to the house dashboard; leave it and it goes back to
being a hearth.

You built the family archive for your kids. This makes it something they walk past and **see**,
instead of a folder they'd have to go looking for.
**Tools:** [Magic Frame](https://magicframe.dev/) or [Photodash](https://github.com/apop880/photodash),
plus [Anniversaries](https://github.com/pinkywafer/Anniversaries) seeded from the tree.

## 11. 🔌 "THE POWER'S OUT" — **$0**

Your RTL-SDR watches the meter. Meter goes silent while HA is still alive on the UPS = outage. It
logs the minute, starts watching freezer temperature, and when power returns tells you how long you
were down and whether the food stayed cold. In tornado country that earns its keep.

## 12. 🏆 THE MOWER'S YEAR IN REVIEW — **$0**

End of season: total hours, distance, the GPS coverage heat map, first and last mow, against last
year. Wrapped, for your yard.

---

# RITUALS, THEATRE AND MISCHIEF

## 13. 🌅 A SUNRISE THAT IS ACTUALLY THE SUNRISE — **$0**
Bedroom cans ramp 1% → 40% over twenty minutes, triggered not by a clock but by **your own
irradiance sensor** crossing a threshold. On a black stormy morning it waits. The house wakes with
the real sun. One `transition: 1200` and you're done — highest satisfaction per minute of effort on
this page.

## 14. 🎬 MOVIE NIGHT THAT FADES LIKE A THEATRE — **$0**
Press play and the room doesn't switch, it **fades over eight seconds**, lamps last. Pause and the
lights come up to 30% on their own; play and they slide back down.
**The trick nobody bothers with:** the transition time. A 1-second fade reads "smart home." An
8-second fade reads "cinema." Same automation.

## 15. 🚗 A WELCOME HOME THAT GREETS *YOU* — **$0**
Car pulls in: garage opens, path lights up, and the kitchen speaker plays **your** eight-second
arrival sting. Angela gets hers. The grandkids get one that destroys them every single time. The
most-cited "guests can't believe it" automation there is, and trivial with the device trackers you
already have.

## 16. 👻 THE HALLOWEEN JUMP SCARE — **$0 with your Fire TV**
Trick-or-treaters hit the walkway. The TV in the front window, which was showing a quiet looping
candle, **cuts to a full-volume jump scare** and the lights strobe fifteen seconds, then drops back
to the loop like nothing happened. Same source has a lovely bit of defensive engineering: a
**red-light lock** that re-asserts the colour every two minutes so a guest can't ruin the mood with
a light switch.
**Source:** [partofthething — Spooky Halloween automations](https://partofthething.com/thoughts/some-fun-or-spooky-halloween-automations-with-home-assistant/)

## 17. ⚾ THE HOUSE GOES BRAVES — **$0**
Bottom of the 8th, one leaves the yard, and the lamps flash before the crowd noise peaks on the TV.
TeamTracker (HACS) exposes live `team_score`; you trigger on the number changing.
⚠️ Separate from the retired BRAVES HERE chip — that was video playback, which MLB blocks. This is
lights and sound only.
**Source:** [ha-teamtracker](https://github.com/vasqued2/ha-teamtracker)

## 18. 🥁 THE DINNER BELL — **~$10**
Angela taps a button on the counter. Your Echo, wherever you are, says *"Dinner in ten minutes"* —
and the lamps do a two-beat pulse in case you've got ear protection on. No yelling down the hall,
ever again. Beloved far out of proportion to how simple it is.

## 19. 🎂 THE HOUSE THROWS THE PARTY — **$0**
Angela walks into the kitchen on her birthday and the lights do a celebration flutter and the Echo
says something warm, in the house's own voice. The frame switches to her for the day. Nobody set it
up this year — it just knows, every year. Layer the family tree in and it quietly marks a
grandparent's anniversary too.

## 20. ❄️ FIRST FROST, FIRST 90, FIRST SNOW — **$0**
One morning in November the house says, unprompted: *"First frost. 29.6 at 6:14 this morning —
eleven days earlier than last year."* Fifteen seconds a year where the house is a naturalist. And
because it's **your** station, they're your records, not the airport's.
HA 2025.12 also shipped a **Winter mode** that puts falling snow on the dashboard — free whimsy, one
toggle.

---

# NEEDS A PART — and it's one part for five ideas

**~$25–35 for an ESP32 + WLED LED strip** (price unverified) unlocks all of these:

| | |
|---|---|
| **📉 The pressure lamp** | A single glowing object on a shelf. Steady warm amber on a settled day; over an afternoon it drifts toward deep blue — and you look at it, check the radar, and there's a line 40 miles west. Not a display, a **mood**. Map *rate of change*, not absolute pressure — a 3 mb/3 hr fall is what a spotter watches. |
| **🌡 A wind-speed strip** | Lit pixels = wind. Calm evening, two dots. Gust front arrives and it runs half its length in a second — you turn your head before you hear anything. |
| **🎨 Holiday exterior** | Orange and purple all October, red-white-blue for the 4th, red and green in December. No ladder, ever. |
| **⚾ Braves colours** | navy and red on the flash |
| **🌩 The colour half of storm mode** | blue pre-storm ambiance |

**Source:** [Hackaday — Storm Cloud Lamp](https://hackaday.com/2019/10/19/storm-cloud-lamp-brings-the-weather-inside/) ·
[MagWLED — visualising HA data](https://magwled.com/blogs/news/using-wled-to-visualize-home-assistant-data)

**Also worth knowing:** an **e-ink panel** (~$30–50, ESP32 + Waveshare) gives you a paper-white card
on the wall — today's high, wind, next mow, when the Braves play — updating silently four times a
day, no glow, no glare. It looks like **stationery, not electronics.** That's the aesthetic the
Pinterest boards are full of and the engineering forums always miss.

---

# IF YOU ONLY DO THREE

1. **The lightning flash (#1)** — $0, one evening, and it is *yours* in a way no listicle idea will
   ever be.
2. **The house gets a voice (#4)** — $0 hardware, and it changes every automation you already own
   from an alert into a personality.
3. **The staged goodnight (#5)** — $0, gear you have, and more people call it the best thing in
   their smart home than anything else.

**The one purchase worth making:** the ESP32 + LED strip. Five ideas off one part.
