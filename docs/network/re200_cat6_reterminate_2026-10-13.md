# RE200 (office) — the Cat6 end got STEPPED ON. Re-terminate the RJ45. **$0.**

**Opened 2026-10-13 9:31 AM.** Jeff: *"the next repair is the RE 200 that is located in the office
got stepped on so I need to replace the end of that cat five wire to get that back and going."*
Jeff 9:33 AM: ***"It's not coax it cat 6 ethernet cable."*** Jeff 9:34 AM: ***"I have a cat five
crimper"*** / ***"And extra tips."***

---

## 🔴 THIS OVERTURNS THE RECORD — THE RE200 IS NOT DEAD HARDWARE
**OPEN_ITEMS #225 and #227 both carry the RE200 as broken/unreplaced**, on Jeff's own 10-12 line
*"The re 200 is offline and it's broken so it all needs to go through the router itself."* That was
true as a **symptom**. **The CAUSE is now known and it is mechanical: the RJ45 on its Cat6 run was
crushed underfoot.**
➡️ The 10-10 evidence fits: the gateway showed RE200 `b0:be:76:d5:ea:88` last active **Sat Oct 10
14:20:04** and never returning — that is the shape of a physical link loss, not a radio fault.

## 💰 COST: **$0.** JEFF HAS THE CRIMPER AND THE PLUGS.
No purchase. ⚠️ **One fit note:** Cat6 conductors are **23 AWG** against Cat5e's **24 AWG**, and the
jacket is fatter. **Cat5e plugs usually take Cat6 but not always** — if the conductors won't seat
all the way forward, or the jacket won't enter the plug body, that mismatch is why, and Cat6-rated
plugs are the fix. Try his first.

## ⚠️ BEFORE CUTTING — TWO THINGS THAT COULD MAKE THIS SHORTER
1. **If that Cat6 is a PATCH CABLE (wall jack or switch → RE200), just swap the cable.** Jeff owns
   spares, confirmed in his Amazon history 9:32 AM: **Seedato Cat6 50 ft (Aug 9 2022)**, **Ciwoda
   Cat 8 (Jan 20 2026)**, **GLANICS Cat8 3 ft 2-pack (Nov 12 2019)**. Only re-terminate a fixed
   in-wall run that cannot be swapped.
2. 🔑 **Inspect the RE200's own Ethernet jack.** Whatever crushed the plug was standing on it. A bent
   pin or cracked jack in the extender looks identical to a bad cable end from the far side.

---

## 🔧 THE PROCESS

**1. Cut the old plug off square — and cut back 1–2 inches past any crushed or kinked section.**
Anything that was under a foot can have flattened conductors or broken copper inside insulation that
still looks fine. Cheap insurance.

**2. Strip ~1–1.5" of outer jacket.** Score and flex rather than cutting deep. **Nicking a conductor
is the number-one cause of a link that passes a wiggle test and fails under load.**
🔑 **Cat6 has a plastic spline / cross-filler down the centre.** Cut it off flush with the jacket —
Cat5e plugs have no room for it.

**3. Untwist, fan out, straighten.** Keep the untwist short.

**4. Order the pairs — `T568B`, left to right, clip DOWN / away from you:**

| Pin | Wire |
|---|---|
| 1 | white/**orange** |
| 2 | **orange** |
| 3 | white/**green** |
| 4 | **blue** |
| 5 | white/**blue** |
| 6 | **green** |
| 7 | white/**brown** |
| 8 | **brown** |

🔴 **THE ONE THING THAT MATTERS MOST: MATCH THE OTHER END.** `T568A` swaps the orange and green
pairs. A vs B is irrelevant as long as **both ends match** — mix them and you have built a
crossover. **Check the far end before crimping:** a wall jack has its own colour code printed on it;
an intact factory plug can be read through its nose. **B is the common US residential choice, but
confirm rather than assume.**

**5. Flatten the 8 conductors into a ribbon** and pinch hard.

**6. Trim square to ~0.5"** — short enough that the **jacket seats inside the plug under the
strain-relief bar**, long enough that all 8 reach the front wall. (If his spare tips happen to be
pass-through, instead push all 8 out the front, verify the colours, and let the crimper shear them.)

**7. Before squeezing, check three things through the clear plastic:**
- all 8 conductors **fully forward**, touching the end of the plug;
- the **jacket inside** the plug body under the crimp bar — not stopping at the entrance;
- the colour order still reads correctly.

**8. Crimp until the tool bottoms out.** One firm, complete stroke.

---

## WHAT "WORKING" LOOKS LIKE — DO NOT CALL IT FIXED WITHOUT THESE
1. **Link light on the RE200's Ethernet port.**
2. **`Test-Connection -Quiet` returns `True` for `192.168.1.196`.**
   🔴 **Never read `ping`'s summary line** — it counts *Destination host unreachable* from our own
   address as a received reply. `ACCESS_MAP.md` §4, earned 10-10 **on this exact device**.
3. **Fresh `Last Activity` for `b0:be:76:d5:ea:88`** on the gateway's own device list:
   `http://192.168.1.254/cgi-bin/devices.ha`
4. Then strike **OPEN_ITEMS #225**'s "still dark, needs one look in the office" line.

⚠️ **`WS-SD00PJBA` at `.164` went dark in the same 10-10 event and is also still down.** Both hang
off the same LAN-1 switch while `.222` and `.251` on it are fine, so the switch was never the
problem. **If one footstep took out the RE200's cable, check whether it took `.164`'s too.**
