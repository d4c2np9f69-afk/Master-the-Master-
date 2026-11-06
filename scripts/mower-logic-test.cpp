// mower-logic-test.cpp -- runs the mower box's decisions on a PC, before anything is flashed.
//
//   zig c++ -std=gnu++17 -Ifirmware/mower_hours_esp32 scripts/mower-logic-test.cpp -o t.exe && t.exe
//   t.exe real.csv     also replays real tracks: lines of "mow,lat,lon" at 30 s spacing.
//                      That file stays OUT of this repo: it is the yard's coordinates, and
//                      the repo is public. Everything below in this file is synthetic.
//
// What this does NOT cover: the real MPU, the real GPS, flash, WiFi, OTA. It proves the
// decisions, not the box. Only a real mow proves the box.
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string>
#include <vector>
#include <random>
#include "mower_logic.h"

using namespace ml;

static int passed = 0, failed = 0;
static void check(bool ok, const char* what) {
  if (ok) passed++; else { failed++; printf("  FAIL: %s\n", what); }
}
static void section(const char* s) { printf("--- %s\n", s); }

// Builds a sentence with a correct checksum, so a test can't pass on a typo in one.
static std::string sentence(const std::string& body) {
  uint8_t sum = 0;
  for (char c : body) sum ^= (uint8_t)c;
  char tail[8];
  snprintf(tail, sizeof(tail), "*%02X\r\n", sum);
  return "$" + body + tail;
}
static bool feedAll(NmeaParser& p, const std::string& s) {
  bool got = false;
  for (char c : s) if (p.feed(c)) got = true;
  return got;
}
static std::string dm(double deg, bool isLat) {
  const double a = fabs(deg);
  const int d = (int)a;
  char b[32];
  snprintf(b, sizeof(b), isLat ? "%02d%09.6f" : "%03d%09.6f", d, (a - d) * 60.0);
  return b;
}
static std::string rmc(double lat, double lon, double knots) {
  char k[16]; snprintf(k, sizeof(k), "%.3f", knots);
  return sentence("GPRMC,120000.00,A," + dm(lat, true) + (lat < 0 ? ",S," : ",N,") + dm(lon, false) +
                  (lon < 0 ? ",W," : ",E,") + k + ",,010126,,,A");
}

static void testNmea() {
  section("NMEA");
  {
    // The textbook sentences, with their published checksums: independent of my helper.
    NmeaParser p;
    check(feedAll(p, "$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A\r\n"), "published RMC gives a fix");
    check(fabs(p.lat - 48.1173) < 1e-6, "published RMC latitude");
    check(fabs(p.lon - 11.516666) < 1e-5, "published RMC longitude");
    check(fabs(p.speedMps - 22.4f * 0.514444f) < 0.01f, "published RMC speed is knots converted");
    check(!feedAll(p, "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47\r\n"), "GGA is not a position event");
    check(fabs(p.hdop - 0.9f) < 0.001f && p.sats == 8, "published GGA hdop + sats");
    check(p.bad == 0, "no bad sentences so far");
  }
  {
    NmeaParser p;
    check(!feedAll(p, "$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6B\r\n"), "wrong checksum gives no fix");
    check(p.bad == 1 && p.fixes == 0, "wrong checksum is counted");
    check(!feedAll(p, "$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W\r\n"), "no checksum at all gives no fix");
    check(p.bad == 2, "missing checksum is counted");
  }
  {
    // What a lost byte looks like: a digit gone from the latitude. It must not be a position.
    NmeaParser p;
    check(!feedAll(p, "$GPRMC,123519,A,407.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A\r\n"), "a dropped digit is rejected");
    check(p.lat == 0.0, "a dropped digit moved nothing");
  }
  {
    // UART overflow: a sentence cut off mid-way with the next one starting straight after.
    NmeaParser p;
    std::string s = "$GPRMC,1235" + rmc(36.1, -86.7, 1.0);
    check(feedAll(p, s), "a cut sentence does not poison the one after it");
    check(fabs(p.lat - 36.1) < 1e-6 && fabs(p.lon + 86.7) < 1e-6, "S/W hemisphere sign + position");
  }
  {
    NmeaParser p;
    check(!feedAll(p, sentence("GPRMC,120000,V,,,,,,,010126,,,N")), "status V gives no fix");
    check(p.bad == 0, "no fix is not a bad sentence");
    std::string junk(300, 'x');
    feedAll(p, "$" + junk);
    check(p.bad == 1, "an overlong line is counted, and did not overrun");
    check(feedAll(p, rmc(36.1, -86.7, 0.5)), "parser recovers after an overlong line");
  }
  {
    NmeaParser p;
    feedAll(p, sentence("GPGGA,120000,,,,,0,00,99.99,,,,,,"));
    check(p.hdop < 0, "GGA with fix quality 0 leaves hdop unknown");
    feedAll(p, sentence("GPRMC,120000,A,3606.000,N,08642.000,W,,,010126,,,A"));
    check(p.speedMps < 0, "empty speed field is unknown, not zero");
    check(feedAll(p, sentence("GNRMC,120000,A,3606.000,N,08642.000,W,0.5,,010126,,,A")), "GN talker works too");
  }
}

static const double LAT0 = 36.0, LON0 = -86.0;   // nowhere in particular
static const double MPD_LAT = 111320.0;
static double mpdLon() { return 111320.0 * cos(LAT0 * M_PI / 180.0); }

static void testGate() {
  section("track gate");
  TrackLimits lim;
  {
    // PARKED, ENGINE IDLING: position noise of metres, Doppler near zero. Measured noise on
    // the real unit: median 13.9 ft, p90 27.3 ft. The whole point of the Doppler test.
    std::mt19937 g(1);
    std::normal_distribution<double> n(0, 4.0), v(0.05, 0.03);
    TrackGate t;
    int acc = 0;
    double total = 0;
    for (int s = 0; s < 3600; s++) {
      float step = 0;
      float speed = (float)fabs(v(g));
      if (t.check(LAT0 + n(g) / MPD_LAT, LON0 + n(g) / mpdLon(), s * 1000, speed, 1.2f, lim, &step) == ACCEPT) acc++;
      total += step;
    }
    printf("    idling an hour: %d point(s), %.1f m of false distance\n", acc, total);
    check(acc <= 2, "an hour idling in one spot draws nothing");
    check(total < 25, "an hour idling adds no distance");
  }
  {
    // Show the test above has teeth: same noise, Doppler test off.
    std::mt19937 g(1);
    std::normal_distribution<double> n(0, 4.0);
    TrackLimits off = lim; off.minSpeed = 0;
    TrackGate t;
    int acc = 0;
    for (int s = 0; s < 3600; s++)
      if (t.check(LAT0 + n(g) / MPD_LAT, LON0 + n(g) / mpdLon(), s * 1000, 0.05f, 1.2f, off) == ACCEPT) acc++;
    printf("    same hour with the Doppler test off: %d points\n", acc);
    check(acc > 500, "without Doppler that same hour would scribble hundreds of points");
  }
  {
    // WALKING a straight line at 1.2 m/s with realistic short-term noise.
    std::mt19937 g(2);
    std::normal_distribution<double> n(0, 0.3);
    TrackGate t;
    int acc = 0;
    double total = 0;
    for (int s = 0; s <= 100; s++) {
      float step = 0;
      if (t.check(LAT0 + (1.2 * s + n(g)) / MPD_LAT, LON0, s * 1000, 1.2f, 1.2f, lim, &step) == ACCEPT) acc++;
      total += step;
    }
    printf("    walked 120 m: %d points, %.1f m measured\n", acc, total);
    check(acc >= 30 && acc <= 45, "120 m walked gives about one point every 3 m");
    check(fabs(total - 120.0) < 12.0, "distance from accepted steps matches the walk");
  }
  {
    // A SLOW real mow. The 11-03 mows average ~0.43 m/s measured over 30 s chords, so a slow
    // stretch sits well under that. Losing real mowing is the worse failure here, which is
    // why the limit is 0.2 and not 0.3: at 0.3 this whole stretch would draw nothing.
    TrackGate t;
    int acc = 0;
    for (int s = 0; s <= 240; s++) {
      if (t.check(LAT0 + (0.25 * s) / MPD_LAT, LON0, s * 1000, 0.25f, 1.2f, lim) == ACCEPT) acc++;
    }
    printf("    60 m at a crawl, 0.25 m/s: %d points\n", acc);
    check(acc >= 15, "a slow mow at 0.25 m/s still draws");
  }
  {
    // SPIKE: one wild fix mid-walk must not move the line, or the reference.
    TrackGate t;
    double la = LAT0;
    check(t.check(la, LON0, 0, 1.2f, 1.2f, lim) == ACCEPT, "first fix accepted");
    check(t.check(la + 500 / MPD_LAT, LON0, 1000, 1.2f, 1.2f, lim) == SPIKE, "500 m in one second rejected");
    float step = 0;
    check(t.check(la + 6 / MPD_LAT, LON0, 5000, 1.2f, 1.2f, lim, &step) == ACCEPT, "next real fix accepted");
    check(fabs(step - 6.0f) < 0.1f, "measured from the last GOOD point, not the spike");
  }
  {
    // A FIXED JUMP LIMIT LOCKS OUT FOREVER if the reference is wrong. This one must recover.
    TrackGate t;
    t.check(LAT0 + 400 / MPD_LAT, LON0, 0, 1.2f, 1.2f, lim);   // a bad first fix
    int waited = -1;
    for (int s = 1; s < 300; s++)
      if (t.check(LAT0, LON0, s * 1000, 1.2f, 1.2f, lim) == ACCEPT) { waited = s; break; }
    printf("    wrong reference 400 m out: recovered after %d s\n", waited);
    check(waited > 0 && waited < 120, "a wrong reference recovers on its own");
  }
  {
    TrackGate t;
    check(t.check(LAT0, LON0, 0, 1.2f, 9.0f, lim) == POOR_FIX, "first fix with hdop 9 rejected");
    check(!t.have(), "...and it did not become the reference");
    check(t.check(LAT0, LON0, 1000, 1.2f, 1.2f, lim) == ACCEPT, "good fix accepted");
    check(t.check(LAT0 + 6 / MPD_LAT, LON0, 3000, 1.2f, 9.0f, lim) == POOR_FIX, "poor fix mid-track rejected");
    check(t.check(LAT0 + 6 / MPD_LAT, LON0, 3000, 1.2f, -1.0f, lim) == ACCEPT, "hdop unknown does not reject");
    check(t.check(LAT0 + 12 / MPD_LAT, LON0, 6000, -1.0f, 1.2f, lim) == ACCEPT, "speed unknown does not reject");
    check(t.check(LAT0 + 13 / MPD_LAT, LON0, 7000, 1.2f, 1.2f, lim) == TOO_CLOSE, "under 3 m is not new ground");
  }
  {
    // Slow creep under the speed gate must not walk the reference along.
    TrackGate t;
    t.check(LAT0, LON0, 0, 1.2f, 1.2f, lim);
    int acc = 0;
    for (int s = 1; s <= 60; s++)
      if (t.check(LAT0 + (0.1 * s) / MPD_LAT, LON0, s * 1000, 0.1f, 1.2f, lim) == ACCEPT) acc++;
    check(acc == 0, "creep below the speed limit draws nothing");
    TrackLimits off = lim; off.maxHdop = 99; off.minSpeed = 0;
    TrackGate t2;
    check(t2.check(LAT0, LON0, 0, 0.0f, 50.0f, off) == ACCEPT, "the live-config off switches work");
    check(t2.check(LAT0 + 5 / MPD_LAT, LON0, 2000, 0.0f, 50.0f, off) == ACCEPT, "the live-config off switches work (2)");
  }
}

// Runs the meter over one mow the way the sketch does: an engine that runs for runMs with
// the start falling at phaseMs into a 30 s sleep, 1 s ticks, returns seconds credited.
static double simulateMow(uint32_t runMs, uint32_t phaseMs, uint32_t sleepS, std::mt19937& g,
                          double dipEvery, uint32_t* ticksOut = nullptr) {
  RunMeter m(30000);
  std::uniform_real_distribution<double> u(0, 1);
  std::uniform_int_distribution<int> jitter(-40, 40);
  const uint32_t wakeAt = sleepS * 1000 - phaseMs;     // first look, after engine start
  double credited = 0;
  uint32_t now = wakeAt;
  bool started = false, stopped = false;
  uint32_t ticks = 0;
  for (; now < runMs + 120000 && !stopped; now += 1000 + jitter(g)) {
    const bool engine = now < runMs;
    const bool hot = engine && !(dipEvery > 0 && u(g) < dipEvery);
    RunMeter::Event ev = m.tick(now, hot, hot, true);
    if (ev == RunMeter::STARTED) { started = true; credited += startCreditS(sleepS, false); }
    if (ev == RunMeter::STOPPED) stopped = true;
    credited += m.takeCreditMs() / 1000.0;
    ticks++;
  }
  if (ticksOut) *ticksOut = ticks;
  if (!started) return 0;
  check(stopped, "the simulated mow closed");
  return credited;
}

static void testMeter() {
  section("hour meter");
  {
    RunMeter m(30000);
    check(m.tick(0, true, false, true) == RunMeter::NONE, "vibration with no clean RPM peak does not start");
    check(m.tick(1000, true, true, false) == RunMeter::NONE, "tipped / service mode does not start");
    check(m.tick(2000, false, true, true) == RunMeter::NONE, "no vibration does not start");
    check(!m.running(), "not running");
    check(m.tick(3000, true, true, true) == RunMeter::STARTED, "hot + clean peak + upright starts");
    check(m.takeCreditMs() == 0, "the start tick itself credits nothing");
    check(m.tick(4000, true, false, true) == RunMeter::NONE && m.running(), "an RPM dip does not stop the clock");
    check(m.takeCreditMs() == 1000, "and that second counts");
    m.tick(5000, false, true, true);
    check(m.running() && !m.hot(), "a vibration dip: still running, not hot");
    check(m.takeCreditMs() == 0, "a dip is not credited yet");
    m.tick(15000, true, true, true);
    check(m.takeCreditMs() == 11000, "a dip that recovers inside the hold is credited, all of it");
    check(m.tick(44000, false, true, true) == RunMeter::NONE, "29 s quiet: still holding");
    check(m.tick(45000, false, true, true) == RunMeter::STOPPED, "30 s quiet: stopped");
    check(m.takeCreditMs() == 0, "the expired hold is NOT credited");
    check(!m.running(), "stopped means stopped");
    check(m.tick(46000, true, false, true) == RunMeter::NONE, "a restart needs the clean peak again");
    check(m.tick(47000, true, true, true) == RunMeter::STARTED, "and then starts");
  }
  {
    RunMeter m(30000);
    m.tick(0, true, true, true);
    m.tick(1000, true, true, false);                   // tipped over while running
    check(!m.hot(), "tipped mid-run is not hot");
    m.takeCreditMs();
    check(m.tick(29000, true, true, false) == RunMeter::NONE, "tipped: 29 s since the last hot tick, holding");
    check(m.tick(30000, true, true, false) == RunMeter::STOPPED, "tipped: 30 s since the last hot tick, stopped however hard it shakes");
  }
  {
    // millis() wraps at 49.7 days. The box deep-sleeps so it never gets there, but the
    // arithmetic must still not credit four billion milliseconds if it ever did.
    RunMeter m(30000);
    m.tick(0xFFFFF000u, true, true, true);
    m.tick(0x00000400u, true, true, true);
    check(m.takeCreditMs() == 0x1400, "credit is right across a millis() wrap");
  }
  check(startCreditS(30, false) == 15 && startCreditS(900, false) == 450, "start credit is half the sleep");
  check(startCreditS(30, true) == 0, "no start credit after a cold boot");
  {
    // THE NUMBER THAT MATTERS. Six real mows' lengths are not needed for this: the error is
    // about the edges, not the length. Thousands of mows at random phase, 30 min to 3 h.
    std::mt19937 g(7);
    std::uniform_int_distribution<uint32_t> len(30 * 60000u, 180 * 60000u), ph(0, 29999);
    double sumErr = 0, worst = 0, sumRun = 0;
    const int N = 300;
    for (int i = 0; i < N; i++) {
      const uint32_t runMs = len(g);
      const double got = simulateMow(runMs, ph(g), 30, g, 0.0);
      const double err = got - runMs / 1000.0;
      sumErr += err; sumRun += runMs / 1000.0;
      if (fabs(err) > fabs(worst)) worst = err;
    }
    printf("    %d mows, clean signal: mean error %+.2f s/mow, worst %+.1f s, total %+.3f%%\n",
           N, sumErr / N, worst, 100.0 * sumErr / sumRun);
    check(fabs(worst) <= 17.0, "no single mow off by more than half a sleep plus a tick");
    check(fabs(sumErr / N) < 2.0, "no bias: errors cancel over many mows");
  }
  {
    // A marginal signal: 20% of ticks read below threshold. It must not cost time, because
    // the dips recover inside the hold.
    std::mt19937 g(8);
    std::uniform_int_distribution<uint32_t> len(30 * 60000u, 120 * 60000u), ph(0, 29999);
    double sumErr = 0, sumRun = 0, worst = 0;
    const int N = 100;
    for (int i = 0; i < N; i++) {
      const uint32_t runMs = len(g);
      const double got = simulateMow(runMs, ph(g), 30, g, 0.20);
      const double err = got - runMs / 1000.0;
      sumErr += err; sumRun += runMs / 1000.0;
      if (fabs(err) > fabs(worst)) worst = err;
    }
    printf("    %d mows, 20%% of ticks dipping: mean %+.2f s/mow, worst %+.1f s, total %+.3f%%\n",
           N, sumErr / N, worst, 100.0 * sumErr / sumRun);
    check(fabs(worst) <= 20.0, "a marginal signal does not lose the mow");
  }
  {
    // The same simulation given 1.4.0's 900 s parked sleep and no credit, to show it isn't
    // rigged: the engine starts at a random point in the sleep, so the loss is 0..15 min and
    // averages 7.5. NOT the 15-17 min per mow in #269: those windows ran from the last parked
    // row to the mow's end, so they contain the whole sleep by construction. 15 is the most a
    // start could lose, not what it did.
    std::mt19937 g(9);
    std::uniform_int_distribution<uint32_t> ph(0, 899999);
    double sum = 0;
    const int N = 200;
    for (int i = 0; i < N; i++) {
      const uint32_t run = 60 * 60000u;
      const uint32_t phase = ph(g);
      double got = simulateMow(run, phase, 900, g, 0.0) - startCreditS(900, false);
      sum += got - run / 1000.0;
    }
    printf("    same sim with 1.4.0's 900 s parked sleep and no credit: mean %+.0f s/mow\n", sum / N);
    check(sum / N < -300, "the sim shows the old loss when given the old sleep");
  }
}

static void replayReal(const char* path) {
  section("replay of real tracks (not in repo)");
  FILE* f = fopen(path, "r");
  if (!f) { check(false, "could not open the real-track file"); return; }
  struct P { int mow; double la, lo; };
  std::vector<P> pts;
  int mow; double la, lo;
  while (fscanf(f, "%d,%lf,%lf", &mow, &la, &lo) == 3) pts.push_back({mow, la, lo});
  fclose(f);
  TrackLimits lim;
  std::mt19937 g(3);
  std::normal_distribution<double> n(0, 0.5);
  for (size_t i = 0; i < pts.size();) {
    size_t j = i;
    while (j < pts.size() && pts[j].mow == pts[i].mow) j++;
    // Rebuild 1 Hz from the 30 s points: walk straight between them, with noise. The real
    // path between those points is not known, so this tests the rate and the gate, not shape.
    TrackGate t;
    int acc = 0, spike = 0, sent = 0;
    double dist = 0, lineDist = 0;
    uint32_t ms = 0;
    for (size_t k = i; k + 1 < j; k++) {
      const double leg = metres(pts[k].la, pts[k].lo, pts[k + 1].la, pts[k + 1].lo);
      lineDist += leg;
      const float speed = (float)(leg / 30.0);
      for (int s = 0; s < 30; s++, ms += 1000) {
        const double fr = s / 30.0;
        const double a = pts[k].la + (pts[k + 1].la - pts[k].la) * fr + n(g) / MPD_LAT;
        const double b = pts[k].lo + (pts[k + 1].lo - pts[k].lo) * fr + n(g) / mpdLon();
        float step = 0;
        Verdict v = t.check(a, b, ms, speed, 1.2f, lim, &step);
        if (v == ACCEPT) { acc++; dist += step; }
        if (v == SPIKE) spike++;
        sent++;
      }
    }
    printf("    mow %-3d %4zu pts at 30 s -> %5d fixes -> %5d points  spikes %d  dist %.0f m vs line %.0f m\n",
           pts[i].mow, j - i, sent, acc, spike, dist, lineDist);
    // Under about 50 m is the mower barely moving (one of these is 10 m in 90 s). The speed
    // here is the 30 s chord average, which understates real speed: this is the harsh case.
    if (lineDist >= 50.0) {
      check(acc >= (int)(j - i), "1 Hz keeps at least as many points as 30 s did");
      check(dist >= 0.8 * lineDist, "the gate keeps at least 80% of the distance");
    }
    i = j;
  }
}

int main(int argc, char** argv) {
  testNmea();
  testGate();
  testMeter();
  if (argc > 1) replayReal(argv[1]);
  printf("\n%d passed, %d failed\n", passed, failed);
  return failed ? 1 : 0;
}
