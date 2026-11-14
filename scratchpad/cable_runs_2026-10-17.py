"""Cable run lengths for the structured wiring job, rebuilt 2026-10-17.
Pure geometry off docs/house-plan/plan-data.js. Separates CRAWL runs (wall plates)
from ATTIC runs (ceiling APs), lands each run at the DEVICE rather than at a
register, and gives a range instead of one falsely precise number."""
import math

G = 14.83
def H(x): return G + x

HEAD = (H(17.5), 2.2)   # network switch, master-bedroom east wall (dresser cluster)

CRAWL_V, ATTIC_V = 4 + 4, 10 + 3   # down-and-up vs up-and-down
TERM = 12                           # service loop both ends + panel dressing
BEND = 1.20                         # real routing vs straight line


def plan(name, pt, route, note, confident=True):
    dx, dy = abs(pt[0] - HEAD[0]), abs(pt[1] - HEAD[1])
    straight, manh = math.hypot(dx, dy), dx + dy
    vert = CRAWL_V if route == 'crawl' else ATTIC_V
    low = math.ceil((straight * BEND + vert + TERM) / 5) * 5
    high = math.ceil((manh + vert + TERM) / 5) * 5
    return dict(name=name, route=route, straight=round(straight), manh=round(manh),
                low=low, high=high, note=note, conf=confident)


T = [
    # APs are CEILING devices -> attic runs, not crawl runs. This was wrong in rev 1.
    plan('AP 1  hallway centre (ceiling)',   (39.9, 13.0),    'attic', 'dead centre of the house'),
    plan('AP 2  kitchen/living (ceiling)',   (H(16.0), 24.0), 'attic', 'at the half wall, covers both rooms'),
    plan('AP 3  garage',                     (6.5, 20.0),     'attic', 'garage floor is SLAB'),
    # Data jacks: crawl runs, landing at the DEVICE, not at a duct register.
    plan('Living room TV (fireplace wall)',  (H(28.0), 17.6), 'crawl', 'TV + Fire TV above the fireplace'),
    plan('Grandfather clock corner',         (43.5, 27.0),    'crawl', 'clock + QFX', False),
    plan('Kitchen / dining (KitchenPC)',     (H(6.5), 31.5),  'crawl', 'ONE run for this room', False),
    plan('Master bedroom, west end',         (H(2.0), 5.5),   'crawl', 'bed-wall side'),
    plan('Garage workbench',                 (2.6, 33.1),     'crawl', 'through the brick by the water heater'),
    plan('Back deck TV / Roku',              (H(27.5), 30.9), 'crawl', 'EXTERIOR penetration'),
    plan('Laundry / pantry alcove',          (H(7.7), 21.0),  'crawl', '3 ft deep, an alcove'),
    plan('Foyer',                            (H(22.0), 7.0),  'crawl', 'next door to the core'),
    plan('Guest bedroom',                    (H(27.2), 1.0),  'crawl', 'JACK ALREADY THERE'),
    plan('Office / Bed 3',                   (H(36.2), 24.9), 'crawl', 'JACK ALREADY THERE'),
]

print(f"{'RUN':38} {'route':6} {'line':>5} {'manh':>5} {'BUY':>12}")
for r in T:
    flag = '' if r['conf'] else '  ~position unmeasured'
    print(f"{r['name']:38} {r['route']:6} {r['straight']:5} {r['manh']:5} "
          f"{r['low']:4}-{r['high']:<4}ft{flag}")

new = [r for r in T if 'ALREADY' not in r['note']]
old = [r for r in T if 'ALREADY' in r['note']]
print(f"\nNEW RUNS: {len(new)}")
print(f"  low  (diagonal, x1.2):             {sum(r['low'] for r in new)} ft")
print(f"  high (strict right-angle routing): {sum(r['high'] for r in new)} ft")
print(f"  the 2 existing jacks, if re-pulled: {sum(r['high'] for r in old)} ft")
print(f"  ALL 13 at the high figure:          {sum(r['high'] for r in T)} ft")
