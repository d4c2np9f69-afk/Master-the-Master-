// mower_logic.h -- the decisions the mower box makes, with no hardware in them.
//
// Separate from the .ino for one reason: this file compiles on a PC, so the hour-meter
// and track rules can be run against recorded data BEFORE anything is flashed.
//   scripts/mower-logic-test.cpp  is the test.  Nothing in here may include Arduino.h.
#ifndef MOWER_LOGIC_H
#define MOWER_LOGIC_H

#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

namespace ml {

// Same flat-earth formula as metresBetween() in functions/api/hours.js, so the box and
// the server agree on what "3 m" means.
inline double metres(double la1, double lo1, double la2, double lo2) {
  const double cosL = cos(la1 * M_PI / 180.0);
  const double dx = (lo2 - lo1) * 111320.0 * (cosL != 0.0 ? cosL : 1.0);
  const double dy = (la2 - la1) * 111320.0;
  return sqrt(dx * dx + dy * dy);
}

// ---- NMEA --------------------------------------------------------------------------
// Fed one byte at a time, so it can run between vibration captures and never block.
// Every sentence must pass its checksum. The old reader took any line that looked like
// an RMC, which was tolerable when it read an idle UART for 2.5 s; a run loop that
// drains a buffer after a 0.5 s capture can lose bytes, and a sentence with bytes
// missing can still parse into a position that is simply wrong.
class NmeaParser {
 public:
  double   lat = 0, lon = 0;   // last checksummed, status-A position
  float    speedMps = -1;      // from that same RMC. -1 = the field was empty
  float    hdop = -1;          // from the latest GGA. -1 = none seen
  int      sats = -1;
  uint32_t lines = 0;          // sentences that passed their checksum
  uint32_t bad = 0;            // sentences that failed it (or overflowed)
  uint32_t fixes = 0;          // good positions

  // True on the byte that completes a good position.
  bool feed(char c) {
    if (c == '$') { n_ = 0; buf_[n_++] = c; open_ = true; return false; }
    if (!open_) return false;
    if (c == '\r' || c == '\n') { open_ = false; buf_[n_] = 0; return process_(); }
    if (n_ >= sizeof(buf_) - 1) { open_ = false; bad++; return false; }
    buf_[n_++] = c;
    return false;
  }

 private:
  char   buf_[100];
  size_t n_ = 0;
  bool   open_ = false;

  static int hex_(char c) {
    if (c >= '0' && c <= '9') return c - '0';
    if (c >= 'A' && c <= 'F') return c - 'A' + 10;
    if (c >= 'a' && c <= 'f') return c - 'a' + 10;
    return -1;
  }
  static bool toDeg_(const char* dm, char hemi, double maxDeg, double& out) {
    if (!dm[0]) return false;
    const double v = atof(dm);
    if (v <= 0.0) return false;
    const double deg = floor(v / 100.0);
    const double mins = v - deg * 100.0;
    if (mins >= 60.0) return false;
    double d = deg + mins / 60.0;
    if (d > maxDeg) return false;
    if (hemi == 'S' || hemi == 'W') d = -d;
    else if (hemi != 'N' && hemi != 'E') return false;
    out = d;
    return true;
  }
  bool process_() {
    if (n_ < 8) return false;
    char* star = strchr(buf_, '*');
    if (!star || (size_t)(star - buf_) + 3 > n_) { bad++; return false; }
    uint8_t sum = 0;
    for (char* p = buf_ + 1; p < star; p++) sum ^= (uint8_t)*p;
    const int hi = hex_(star[1]), lo = hex_(star[2]);
    if (hi < 0 || lo < 0 || ((hi << 4) | lo) != sum) { bad++; return false; }
    lines++;
    *star = 0;

    char* f[16]; int nf = 0; f[nf++] = buf_;
    for (char* q = buf_; *q && nf < 16; q++) if (*q == ',') { *q = 0; f[nf++] = q + 1; }

    const char* type = f[0] + 3;   // skip "$GP" / "$GN"
    if (!strcmp(type, "GGA")) {
      if (nf > 8) {
        sats = f[7][0] ? atoi(f[7]) : -1;
        hdop = (f[6][0] && f[6][0] != '0' && f[8][0]) ? (float)atof(f[8]) : -1.0f;
      }
      return false;
    }
    if (strcmp(type, "RMC") != 0 || nf < 8) return false;
    if (f[2][0] != 'A') return false;
    double la, lo2;
    if (!toDeg_(f[3], f[4][0], 90.0, la) || !toDeg_(f[5], f[6][0], 180.0, lo2)) return false;
    lat = la; lon = lo2;
    speedMps = f[7][0] ? (float)(atof(f[7]) * 0.514444) : -1.0f;
    fixes++;
    return true;
  }
};

// ---- Which fixes become points on the map -------------------------------------------
// A rejected fix never moves the reference, so slow drift cannot creep along one small
// step at a time. A reference that turns out to be wrong cannot lock the track out
// either: the allowance grows with time, so the real position is always reachable again
// (a fixed "reject anything over 100 m" had no such way back).
struct TrackLimits {
  float minStepM   = 3.0f;   // closer than this to the last point: not new ground
  float minSpeed   = 0.2f;   // m/s. Doppler speed, independent of position noise. A mower
                             // idling in the garage drifts by metres at ~0 m/s. Set low on
                             // purpose: real mows average ~0.43 m/s over 30 s, and losing real
                             // mowing is worse than a stray point at idle. 0 turns it off.
  float maxHdop    = 5.0f;   // geometry too poor to trust. >=99 turns it off.
  float maxSpeed   = 4.0f;   // m/s. Faster than this mower moves.
  float spikeSlack = 5.0f;   // m. Allowance on top of maxSpeed * dt.
};

enum Verdict { ACCEPT, TOO_CLOSE, TOO_SLOW, POOR_FIX, SPIKE };

class TrackGate {
 public:
  void reset() { have_ = false; }
  bool have() const { return have_; }

  // speedMps / hdop: pass <0 for "not known", which never rejects.
  Verdict check(double lat, double lon, uint32_t nowMs, float speedMps, float hdop,
                const TrackLimits& lim, float* stepOut = nullptr) {
    if (stepOut) *stepOut = 0;
    if (hdop >= 0 && hdop > lim.maxHdop) return POOR_FIX;
    if (!have_) { take_(lat, lon, nowMs); return ACCEPT; }
    const double step = metres(lat_, lon_, lat, lon);
    if (step < lim.minStepM) return TOO_CLOSE;
    if (speedMps >= 0 && speedMps < lim.minSpeed) return TOO_SLOW;
    const double dt = (uint32_t)(nowMs - atMs_) / 1000.0;
    if (step > dt * lim.maxSpeed + lim.spikeSlack) return SPIKE;
    if (stepOut) *stepOut = (float)step;
    take_(lat, lon, nowMs);
    return ACCEPT;
  }

 private:
  bool     have_ = false;
  double   lat_ = 0, lon_ = 0;
  uint32_t atMs_ = 0;
  void take_(double lat, double lon, uint32_t nowMs) { lat_ = lat; lon_ = lon; atMs_ = nowMs; have_ = true; }
};

// ---- The hour meter -----------------------------------------------------------------
// Jeff's description of what he built (2026-11-05): it sleeps 30 s if there is no motion,
// "if I start the mower it immediately detects the motion and starts recording and
// doesn't stop until it stops sensing motion", and "it would turn off after 30 seconds".
//
//   START needs vibration AND a clean RPM peak AND upright AND not service mode. Scrubbing
//         under a tipped deck vibrates plenty; a running engine is what is periodic.
//   KEEP  needs vibration, upright, not service mode. An SNR dip must not stop the clock.
//   STOP  only after holdMs with no vibration. A dip that recovers inside the hold was the
//         engine running the whole time, so the gap IS credited. A hold that expires is
//         not: that time is the engine being off.
class RunMeter {
 public:
  enum Event { NONE, STARTED, STOPPED };

  explicit RunMeter(uint32_t holdMs = 30000) : holdMs_(holdMs) {}

  Event tick(uint32_t nowMs, bool vibHot, bool rpmValid, bool canRun) {
    const bool hot = vibHot && canRun;
    if (!running_) {
      if (hot && rpmValid) { running_ = true; hot_ = true; lastHotMs_ = nowMs; return STARTED; }
      return NONE;
    }
    if (hot) {
      creditMs_ += (uint32_t)(nowMs - lastHotMs_);
      lastHotMs_ = nowMs;
      hot_ = true;
      return NONE;
    }
    hot_ = false;
    if ((uint32_t)(nowMs - lastHotMs_) >= holdMs_) { running_ = false; return STOPPED; }
    return NONE;
  }

  bool running() const { return running_; }   // true through a hold
  bool hot() const { return running_ && hot_; }
  uint32_t takeCreditMs() { const uint32_t c = creditMs_; creditMs_ = 0; return c; }

 private:
  uint32_t holdMs_;
  bool     running_ = false, hot_ = false;
  uint32_t lastHotMs_ = 0, creditMs_ = 0;
};

// The engine started at an unknown moment during the sleep before it was noticed, so half
// the sleep is the estimate with the smallest possible error (+/- half, instead of 0 to a
// full sleep always short). Zero when the box had no sleep to account for.
inline uint32_t startCreditS(uint32_t sleptS, bool coldBoot) { return coldBoot ? 0 : sleptS / 2; }

}  // namespace ml

#endif
