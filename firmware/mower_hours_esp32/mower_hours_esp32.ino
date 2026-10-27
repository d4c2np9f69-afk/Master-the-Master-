/*
 * ============================================================
 *  Mower Hour Meter — ESP32-C3 firmware (+ experimental RPM)
 * ============================================================
 *  Board: ESP32-WROOM-32 30-pin NodeMCU dev board (Silicon Labs
 *  CP2102 USB, USB-C). Flash with a DATA USB-C cable. Arduino IDE
 *  board: "ESP32 Dev Module". If the COM port doesn't appear, install
 *  the Silicon Labs CP210x driver. Hold BOOT while connecting if the
 *  upload won't start.
 *  NOTE: pins below are remapped for the classic ESP32-WROOM-32.
 *  Do NOT use GPIO6-11 (wired to flash) or ADC2 pins for the battery
 *  (ADC2 can't be read while WiFi is on).
 * ------------------------------------------------------------
 *  What it does:
 *    - Wakes periodically, reads the MPU6050, decides engine
 *      on/off from vibration, and counts lifetime engine hours.
 *    - EXPERIMENTAL: while running it also estimates RPM from the
 *      vibration spectrum (a Goertzel scan of the expected band)
 *      and tracks this mow's peak & average RPM.
 *    - When parked (engine off, WiFi in range) it uploads hours +
 *      RPM stats to your Cloudflare Pages endpoint.
 *
 *  About the RPM number: it is a best-effort estimate from
 *  vibration, NOT a true tachometer. It may land on your real
 *  speed (~3000), or get fooled by a deck/chassis resonance, or
 *  report "--" when the signal is too noisy. If it's junk, ignore
 *  the RPM panel — hours are unaffected. Use CALIBRATION_MODE to
 *  watch the detected RPM with the engine running and tune the band.
 *
 *  No external libraries — only built-in ESP32 ones.
 *
 *  FIRST TIME:
 *    1) Fill in the CONFIG block.
 *    2) CALIBRATION_MODE = true, upload, open Serial Monitor (115200).
 *       Engine OFF: note the vibration (g) number. Engine ON: note
 *       vibration + detected RPM. Set VIB_THRESHOLD about halfway
 *       between the off/on vibration values. If RPM reads about half,
 *       or way off, shift/widen RPM_MIN and RPM_MAX.
 *    3) CALIBRATION_MODE = false, re-upload.
 * ============================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Preferences.h>
#include <math.h>
#include <string.h>
#include <stdlib.h>
#include "esp_sleep.h"
#include <HTTPUpdate.h>
#include "esp_system.h"
#include "esp_task_wdt.h"

// Hardware watchdog. Jeff's words for why this exists: "I would only push it if it
// got hung up." A wedged wake — GPS never returning, a WiFi stack stuck below its
// own timeout — used to mean the box was silently dead until someone noticed and
// walked to the garage to press EN. With this, the chip resets itself.
//
// 180 s against a normal wake of roughly 25 s (2.5 s GPS + up to 15 s WiFi +
// posts), so it can only fire on a genuine hang, never on a slow-but-working one.
// A trip shows up as reset_reason in the next payload, so a self-heal is visible
// rather than invisible — "it hung and recovered" is worth knowing about.
const int WDT_TIMEOUT_S = 180;

// Bumped on every flash. Reported in every upload so there is never any doubt
// about which build is actually on the mower — the single most useful field
// when something starts behaving differently and nobody remembers what changed.
#define FW_VERSION "1.4.0"

// RPM analysis result type — declared up here so the Arduino IDE's
// auto-generated function prototypes can see it (fixes 'does not name a type').
struct RpmResult{ float rpm; float stdG; bool valid; };

// ----------------------- CONFIG -----------------------
// ###########################################################
// #  GPS-FIXED BUILD (2026-06-19): now reads the GPS on EVERY wake, so
// #  the app's GPS status is truthful and it works on the bench. See setup().
// #  >>> BEFORE FLASHING, fill in the 3 lines below. DEVICE_SECRET must
// #      EXACTLY match Cloudflare Pages > Settings > Variables, or uploads
// #      will return 401. (This file ships with placeholders.)
// ###########################################################
// Credentials live in secrets.h, which is gitignored — this repo is PUBLIC.
// Copy secrets.example.h to secrets.h and fill it in on any new machine.
// NOTE: the COMPILED BINARY still contains these as plaintext strings, so a
// firmware .bin must never be served from a public URL either. Verified by
// grepping a real build on 2026-08-11.
#include "secrets.h"
const char* WIFI_SSID     = HCC_WIFI_SSID;
const char* WIFI_PASS     = HCC_WIFI_PASS;
const char* ENDPOINT      = "https://toro1-5rz.pages.dev/api/hours";  // live project + KV
const char* DEVICE_SECRET = HCC_DEVICE_SECRET;       // see secrets.h

// NOT const any more: these are live config, restored from NVS at boot and
// settable from the server over the control channel. Values here are only the
// factory defaults used before anything has ever been pushed down.
int         SAMPLE_INTERVAL_S = 30;    // check interval while running (granularity)
int         IDLE_INTERVAL_S   = 300;   // wake interval when parked (and try upload)

// Bench-test hook, left in place (disabled) because it proved genuinely useful:
// set to 1 and the first SF_TEST_FAILS parked wakes point at a bogus SSID, forcing a
// REAL WiFi timeout so the store-and-forward buffer can be verified end to end.
// Must run inside ONE boot session — a reflash causes POWERON_RESET, which wipes RTC
// memory and would destroy the buffer under test.
// Verified working 2026-08-11: 3 readings buffered across 3 deep sleeps, then flushed
// oldest-first with ages 90s / 60s / 30s.
#define SF_BENCH_TEST  0
#define SF_TEST_FAILS  3

// Gap between flushed readings. Cloudflare KV is eventually consistent and
// `hours.js` appends to the sensor log / coverage map with a read-modify-write, so
// POSTs landing within ~1s of each other can read the same state and clobber one
// another. Measured live 2026-08-11: three buffered readings all returned HTTP 200
// but only two survived in the log. Spacing the flush cuts that window.
// NOTE: this REDUCES the race, it does not eliminate it — the real fix is server-side
// (accept a batched array in one write, or serialise via a Durable Object).
const int   FLUSH_GAP_MS      = 2000;
// How often engine seconds get written to flash WHILE RUNNING. This is exactly
// the exposure window for the EN reset button on the outside of the box: hours
// already banked to flash always survive, hours since the last flush do not.
// Dropped 300 -> 60 so a mid-mow reset can cost at most a minute instead of five.
// Writes only happen while the engine runs (~1800/year at Jeff's usage), which is
// nowhere near NVS wear limits. Live config, so it can be tuned without a flash.
int         FLUSH_EVERY_S     = 60;    // save to flash at least this often while running

float       VIB_THRESHOLD     = 0.06;  // g of vibration that means ENGINE ON (calibrate)
bool        CALIBRATION_MODE  = false; // true = print vibration + RPM so you can tune

// --- Battery voltage (HiLetgo 0-25V voltage-sensor module) ---
// The module is a fixed 5:1 divider (30k/7.5k) on a board with a screw
// terminal for the battery and an S/+/- header. Wire:
//   screw terminal:  VCC <- battery +,   GND <- battery -
//   header:  S -> ESP32 GPIO34 (ADC),  (-) -> ESP32 GND,  (+) -> leave unconnected
// GPIO34 is ADC1 (input-only). MUST be ADC1 on classic ESP32 because the
// battery is read while WiFi is ON, and ADC2 pins can't be read with WiFi up.
// 5:1 keeps a charging ~14.5V battery at ~2.9V on the pin, under the 3.3V ceiling.
const int   BATTERY_ADC_PIN   = 35;    // GPIO35 = ADC1_CH7, input-only, WiFi-safe (D34 channel damaged)
const float BATTERY_DIVIDER   = 5.0;   // fixed 5:1 ratio of the 0-25V module

// --- GPS (u-blox NEO-6M, e.g. HiLetgo GY-NEO6MV2) on a 2nd UART ---
// Wire: GPS VCC->5V, GPS GND->GND, GPS TX -> ESP32 GPIO16 (RX2; we only READ).
// GPIO16 is free on WROOM-32 (no PSRAM). Do NOT use GPIO6-11 (flash) for this.
// The module's onboard regulator makes its TX 3.3V, so no level shifter needed.
// Keep the GPS powered continuously (off the 5V buck rail) so it holds its fix
// between deep-sleep wakes. Antenna patch must face the SKY, not the deck.
#define     GPS_SERIAL         Serial1
const int   GPS_RX_PIN        = 16;    // GPIO16 (RX2) receives GPS TX
const int   GPS_TX_PIN        = -1;    // not used (read-only); leaves the pin free
const long  GPS_BAUD          = 9600;  // NEO-6M default
const unsigned long GPS_READ_MS = 2500;// how long to listen each wake (widened for cold-start re-locks)
const float GPS_STEP_MIN_M    = 0.5;   // ignore sub-half-metre jitter (parked)
float       GPS_STEP_MAX_M    = 100.0; // reject teleport glitches between fixes (live config)
const int   GPS_TRACK_MAX     = 150;   // max points buffered per mow (yard map track)
// Minimum movement between two RECORDED track points. The track is now logged
// whenever there's a fix (not just while the engine runs — see setup()), so this
// gate is what stops a parked mower's GPS drift from being logged as if it were
// mowing. Consumer GPS wanders a few metres while stationary; a mower at walking
// pace covers 3 m in about 2 seconds, so 3 m drops the drift and keeps every real
// pass. Without this the yard map fills with a dense blob at the parking spot.
float       TRACK_MIN_STEP_M  = 3.0;   // live config

// --- Experimental RPM estimator ---
const int      RPM_SAMPLES   = 512;    // samples per capture
const uint32_t RPM_TARGET_US = 1000;   // ~1 ms/sample -> ~1000 Hz capture
const float    RPM_MIN       = 2300;   // search band low  (assumes near governed speed)
const float    RPM_MAX       = 3800;   // search band high
const float    RPM_STEP      = 30;     // scan resolution (RPM)
const float    RPM_MIN_SNR   = 4.0;    // peak/avg power ratio needed to trust a reading

// MPU6050 I2C — classic ESP32 default I2C pins (clearly labeled D21/D22).
const int     I2C_SDA = 21;
const int     I2C_SCL = 22;
const uint8_t MPU_ADDR = 0x68;         // 0x69 if the module's AD0 pin is high
const float   ACCEL_LSB_PER_G = 4096.0;// matches the +/-8g range set in mpuInit()
// ------------------------------------------------------

RTC_DATA_ATTR uint32_t rtcMagic        = 0;
RTC_DATA_ATTR uint32_t lifetimeSeconds = 0;
RTC_DATA_ATTR uint32_t secsSinceFlush  = 0;
RTC_DATA_ATTR float    rpmPeak  = 0;   // this mowing session
RTC_DATA_ATTR float    rpmSum   = 0;
RTC_DATA_ATTR uint32_t rpmCount = 0;

// --- GPS state (survives deep sleep) ---
RTC_DATA_ATTR float    gpsTotalMeters   = 0; // lifetime distance mowed
RTC_DATA_ATTR float    gpsSessionMeters = 0; // this mow only
RTC_DATA_ATTR float    gpsPrevLat = 0, gpsPrevLon = 0; // last fix used for stepping
RTC_DATA_ATTR float    gpsLat = 0, gpsLon = 0;          // last good fix (for display)
RTC_DATA_ATTR uint8_t  gpsHaveLast = 0;                 // have a prev fix this session
RTC_DATA_ATTR uint8_t  gpsHaveFix  = 0;                 // ever got a fix (report flag)
// Track buffer for the yard map (microdegrees, survives deep sleep)
RTC_DATA_ATTR int32_t  gpsTrackLat[GPS_TRACK_MAX];
RTC_DATA_ATTR int32_t  gpsTrackLon[GPS_TRACK_MAX];
RTC_DATA_ATTR uint16_t gpsTrackN = 0;
// Last point actually WRITTEN to the track (not just the last fix seen) — the
// TRACK_MIN_STEP_M gate measures against this, so slow drift can't creep the
// track along one sub-threshold step at a time.
RTC_DATA_ATTR float    trkPrevLat = 0, trkPrevLon = 0;
RTC_DATA_ATTR uint8_t  trkHavePrev = 0;

// --- Engine state across wakes (for mow-end detection) ---
// The box only uploads while PARKED, so the server can't see a mow happen live.
// It needs to be told which upload is the one carrying a finished mow's totals.
RTC_DATA_ATTR uint8_t  wasRunning = 0;

// ---- TASK 2: store-and-forward buffer (survives deep sleep) ------------------
// Previously a failed POST simply threw the reading away — weak WiFi at the far
// end of the yard meant those readings were lost forever. Now every reading that
// can't be sent is held in RTC memory and flushed oldest-first on reconnect.
//
// Stored as a packed struct, NOT as the JSON string: ~64 bytes each instead of
// ~450, which is what makes a useful backlog fit in the ESP32's small RTC RAM
// alongside the 1.2 KB GPS track buffer.
//
// Each entry keeps the uptime second it was captured at, so the flush sends a real
// `age_s` and the server can stamp it with when it actually happened rather than
// with the flush time.
#define SF_MAX 20
struct SfReading {
  uint32_t stampS;                 // uptimeS at capture
  uint32_t hoursSec;
  float    battery, battRaw, vib, pitch, roll, espTemp;
  float    lat, lon;
  int32_t  distTotal, distSession;
  uint32_t gpsLines;
  int16_t  rpmPeak, rpmAvg, rssi;
  uint16_t shocks;
  uint8_t  hasFix, mpu, engineRunning;
};
RTC_DATA_ATTR SfReading sfBuf[SF_MAX];
RTC_DATA_ATTR uint16_t  sfHead  = 0;   // next write slot
RTC_DATA_ATTR uint16_t  sfCount = 0;   // entries currently held
RTC_DATA_ATTR uint32_t  uptimeS = 0;   // monotonic seconds across deep sleeps
#if SF_BENCH_TEST
RTC_DATA_ATTR uint8_t   testWakes = 0; // TEMP: counts forced-failure wakes
#endif

Preferences prefs;

// ---- LEVEL REFERENCE (true deck tilt) -----------------------------------------
// The MPU measures the gravity vector in the BOX's own frame. The box is bolted
// in at an angle, so raw pitch/roll describe the enclosure, not the deck — which
// is why a level mower reported -12.4 / 28.5 instead of 0 / 0.
//
// Zeroing captures the gravity vector once while the mower is known level and
// stores it. Everything afterwards is measured RELATIVE to that vector, which is
// exact at any attitude — unlike subtracting a fixed offset from each axis, which
// only works near level and cross-couples badly on a real slope.
//
// Honest limit: one captured vector fixes "which way is down" but not "which way
// is forward". Total tilt is therefore exact, while the split between fore/aft
// and side-to-side is relative to however the box happens to be rotated in its
// mount. If that labelling ever matters, it needs a second one-time capture.
float    refGx = 0, refGy = 0, refGz = 0;   // unit gravity vector when level
bool     refOK = false;
float    gravX = 0, gravY = 0, gravZ = 0;    // mean accel this wake (LSB) = gravity
float    tiltTotal = 0.0f;                   // deg from level — always meaningful
bool     uprightNow = true;

// A mower on its side is being serviced, not mowed. Scrubbing under the deck and
// wrenching on blade bolts both produce real vibration, and amplitude alone can't
// tell that from a running engine — so without this, an oil change quietly banks
// 20 minutes of engine hours. Needs refOK to mean anything; before the first zero
// we assume upright rather than block hour counting on an uncalibrated box.
const float UPRIGHT_MAX_DEG = 45.0f;

// ---- LIVE CONFIG + HEALTH ------------------------------------------------------
uint32_t cfgRev      = 0;      // which config revision this box is running
bool     serviceMode = false;  // manual override: never count hours while set

uint32_t      pendingAck  = 0;   // command id to ack next upload (NVS — see loadConfig)
RTC_DATA_ATTR uint32_t lastCmdId   = 0;   // last command attempted, and how it went
RTC_DATA_ATTR uint8_t  lastCmdOk   = 0;
RTC_DATA_ATTR uint32_t i2cErrors   = 0;   // MPU failed to answer on I2C
RTC_DATA_ATTR uint32_t mpuReinits  = 0;   // times we re-initialised a silent MPU
RTC_DATA_ATTR uint32_t otaFails    = 0;
uint32_t bootCount = 0;                   // NVS — survives power loss, unlike RTC
String   lastResp;                        // body of the most recent POST response

// Vibration seen since the last successful upload. The box is asleep or silent
// during a mow, so a single instantaneous sample at upload time tells us nothing
// about what running vibration actually looks like — and VIB_THRESHOLD has been a
// guess marked "(calibrate)" this whole time. These two fields make one real mow
// enough to set it correctly, over the air, without touching the hardware.
RTC_DATA_ATTR float    vibMax = 0;
RTC_DATA_ATTR float    vibSum = 0;
RTC_DATA_ATTR uint32_t vibN   = 0;

// sample buffers (recaptured every wake; fine in normal RAM)
float bx[RPM_SAMPLES], by[RPM_SAMPLES], bz[RPM_SAMPLES];

// ---- sensor health (reported in every upload) ----
bool     mpuOK        = false;  // true if MPU6050 answered on I2C
uint32_t gpsLineCount = 0;      // NMEA sentences received this wake (proves GPS wiring)
float    lastVib      = -1.0f;  // most recent vibration stdG
float    tiltPitch    = 0.0f;   // deg, deck pitch (fore/aft) from gravity vector
float    tiltRoll     = 0.0f;   // deg, deck roll (side slope) from gravity vector
uint16_t shockCount   = 0;      // impact spikes this wake (samples > ~1.5g off gravity)

void mpuInit(){
  Wire.beginTransmission(MPU_ADDR);
  mpuOK = (Wire.endTransmission() == 0);   // device ACKed its address = wired & alive
  Wire.beginTransmission(MPU_ADDR); Wire.write(0x6B); Wire.write(0x00); Wire.endTransmission(); // wake
  Wire.beginTransmission(MPU_ADDR); Wire.write(0x1A); Wire.write(0x02); Wire.endTransmission(); // DLPF ~94 Hz
  Wire.beginTransmission(MPU_ADDR); Wire.write(0x1C); Wire.write(0x10); Wire.endTransmission(); // accel +/-8g
}

inline void readAccelRaw(int16_t &ax, int16_t &ay, int16_t &az){
  Wire.beginTransmission(MPU_ADDR); Wire.write(0x3B); Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)MPU_ADDR,(uint8_t)6,(uint8_t)true);
  uint8_t b[6]; for(int i=0;i<6;i++) b[i]=Wire.read();
  ax=(int16_t)((b[0]<<8)|b[1]);
  ay=(int16_t)((b[2]<<8)|b[3]);
  az=(int16_t)((b[4]<<8)|b[5]);
}

// capture RPM_SAMPLES at ~RPM_TARGET_US spacing; return the measured sample rate (Hz)
float captureSamples(){
  uint32_t t0=micros();
  for(int i=0;i<RPM_SAMPLES;i++){
    uint32_t target=t0+(uint32_t)i*RPM_TARGET_US;
    while((int32_t)(micros()-target)<0){ }   // pace to the target rate
    int16_t ax,ay,az; readAccelRaw(ax,ay,az);
    bx[i]=ax; by[i]=ay; bz[i]=az;
  }
  uint32_t t1=micros();
  float secs=(t1-t0)/1000000.0f;
  if(secs<=0) secs=RPM_SAMPLES*RPM_TARGET_US/1000000.0f;
  return RPM_SAMPLES/secs;
}

// Goertzel power of frequency f (Hz) in a mean-removed signal sampled at fs
float goertzelPower(const float* x,int n,float f,float fs){
  float w=2.0f*(float)M_PI*f/fs;
  float coeff=2.0f*cosf(w);
  float s1=0,s2=0,s0;
  for(int i=0;i<n;i++){ s0=x[i]+coeff*s1-s2; s2=s1; s1=s0; }
  return s1*s1+s2*s2-coeff*s1*s2;
}

RpmResult analyze(float fs){
  // pick the axis with the most vibration energy (orientation-independent)
  float* axes[3]={bx,by,bz};
  int best=0; float bestVar=-1; float bestMean=0;
  for(int a=0;a<3;a++){
    double sum=0,sumsq=0;
    for(int i=0;i<RPM_SAMPLES;i++){ sum+=axes[a][i]; sumsq+=(double)axes[a][i]*axes[a][i]; }
    double mean=sum/RPM_SAMPLES;
    double var=sumsq/RPM_SAMPLES-mean*mean; if(var<0)var=0;
    if(var>bestVar){ bestVar=var; best=a; bestMean=(float)mean; }
  }
  float* x=axes[best];
  for(int i=0;i<RPM_SAMPLES;i++) x[i]-=bestMean;   // remove DC

  RpmResult r;
  r.stdG=sqrtf(bestVar)/ACCEL_LSB_PER_G;

  float peakPow=0,peakRpm=0; double powSum=0; int cnt=0;
  for(float rpm=RPM_MIN; rpm<=RPM_MAX; rpm+=RPM_STEP){
    float p=goertzelPower(x,RPM_SAMPLES,rpm/60.0f,fs);
    powSum+=p; cnt++;
    if(p>peakPow){ peakPow=p; peakRpm=rpm; }
  }
  float meanPow=(cnt>0)?(float)(powSum/cnt):0;
  float snr=(meanPow>1e-6f)?(peakPow/meanPow):0;
  r.valid=(snr>=RPM_MIN_SNR);
  r.rpm=r.valid?peakRpm:0;
  return r;
}

// Deck tilt (pitch/roll, deg) + shock count from the captured accel buffers.
// MUST run BEFORE analyze(), which removes the DC (gravity) from the best axis.
void computeTilt(){
  double sx=0, sy=0, sz=0;
  for(int i=0;i<RPM_SAMPLES;i++){ sx+=bx[i]; sy+=by[i]; sz+=bz[i]; }
  float mx=(float)(sx/RPM_SAMPLES), my=(float)(sy/RPM_SAMPLES), mz=(float)(sz/RPM_SAMPLES); // gravity vector (LSB)
  gravX=mx; gravY=my; gravZ=mz;           // kept so zeroTilt() can capture it

  // Raw box-frame angles. These are what shipped before, and they stay as the
  // fallback until the box has been zeroed — a mower that has never been
  // calibrated should report something honest rather than a confident zero.
  tiltPitch = atan2f(mx, sqrtf(my*my+mz*mz)) * 57.29578f;
  tiltRoll  = atan2f(my, sqrtf(mx*mx+mz*mz)) * 57.29578f;
  tiltTotal  = 0.0f;
  uprightNow = true;

  if(refOK){
    float n = sqrtf(mx*mx+my*my+mz*mz);
    if(n > 1e-3f){
      float cx=mx/n, cy=my/n, cz=mz/n;
      // Angle between "down now" and "down when level" — exact at any attitude,
      // with no small-angle assumption and no axis cross-coupling.
      float c3 = cx*refGx + cy*refGy + cz*refGz;
      if(c3 >  1.0f) c3 =  1.0f;
      if(c3 < -1.0f) c3 = -1.0f;
      tiltTotal  = acosf(c3) * 57.29578f;
      uprightNow = (tiltTotal <= UPRIGHT_MAX_DEG);

      // Build a stable frame perpendicular to the reference so a level mower
      // reads 0/0. The helper axis is whichever box axis is LEAST aligned with
      // down, so the cross product can never collapse toward zero length.
      float hx=0,hy=0,hz=0;
      float ax=fabsf(refGx), ay=fabsf(refGy), az=fabsf(refGz);
      if(ax<=ay && ax<=az) hx=1; else if(ay<=az) hy=1; else hz=1;
      float d = hx*refGx + hy*refGy + hz*refGz;
      float e1x=hx-d*refGx, e1y=hy-d*refGy, e1z=hz-d*refGz;
      float e1n=sqrtf(e1x*e1x+e1y*e1y+e1z*e1z);
      if(e1n > 1e-6f){
        e1x/=e1n; e1y/=e1n; e1z/=e1n;
        float e2x=refGy*e1z-refGz*e1y;
        float e2y=refGz*e1x-refGx*e1z;
        float e2z=refGx*e1y-refGy*e1x;
        tiltPitch = atan2f(cx*e1x+cy*e1y+cz*e1z, c3) * 57.29578f;
        tiltRoll  = atan2f(cx*e2x+cy*e2y+cz*e2z, c3) * 57.29578f;
      }
    }
  }

  // Impact counting. Tipping the mower up to change the oil or sharpen a blade is
  // not a mowing impact — without this gate, every service session would show up
  // as a burst of shocks and make the real ones harder to spot.
  float thr = 1.5f * ACCEL_LSB_PER_G;     // impact = >1.5g deviation from gravity
  uint16_t cnt=0;
  if(uprightNow){
    for(int i=0;i<RPM_SAMPLES;i++){
      float dx=bx[i]-mx, dy=by[i]-my, dz=bz[i]-mz;
      if(sqrtf(dx*dx+dy*dy+dz*dz) > thr) cnt++;
    }
  }
  shockCount = cnt;
}

// Capture the current gravity vector as "level". Refuses if the MPU is silent or
// the measured vector isn't about 1g — which also means it refuses while the
// mower is being moved or vibrating, so a bad reference can't be frozen into
// flash by zeroing at the wrong moment.
bool zeroTilt(){
  float n = sqrtf(gravX*gravX + gravY*gravY + gravZ*gravZ);
  float g = n / ACCEL_LSB_PER_G;
  if(!mpuOK || g < 0.85f || g > 1.15f){
    Serial.printf("zero_tilt REFUSED (mpu=%d, |g|=%.3f)\n", mpuOK?1:0, g);
    return false;
  }
  refGx = gravX/n; refGy = gravY/n; refGz = gravZ/n; refOK = true;
  prefs.begin("mower", false);
  prefs.putFloat("refgx", refGx);
  prefs.putFloat("refgy", refGy);
  prefs.putFloat("refgz", refGz);
  prefs.putBool ("refok", true);
  prefs.end();
  Serial.printf("zero_tilt OK  ref=(%.4f, %.4f, %.4f)\n", refGx, refGy, refGz);
  return true;
}

// ESP32 on-chip temperature sensor, in degrees F (rough — reads the chip, runs warm).
float espTempF(){ return temperatureRead() * 9.0f / 5.0f + 32.0f; }

float readBattery(){
  if(BATTERY_ADC_PIN<0) return -1.0f;
  analogReadResolution(12);
  int raw=analogRead(BATTERY_ADC_PIN);
  return (raw/4095.0f)*3.3f*BATTERY_DIVIDER;
}

// ---- GPS: minimal inline NMEA parser (no external library) ----
// Convert NMEA "ddmm.mmmm" + hemisphere to decimal degrees.
static double gpsToDeg(const char* dm, char hemi){
  double v = atof(dm);
  int    deg = (int)(v / 100.0);
  double minutes = v - deg * 100.0;
  double dec = deg + minutes / 60.0;
  if(hemi=='S' || hemi=='W') dec = -dec;
  return dec;
}

// Great-circle distance in metres.
static double haversineM(double la1,double lo1,double la2,double lo2){
  const double R=6371000.0, D=M_PI/180.0;
  double dLat=(la2-la1)*D, dLon=(lo2-lo1)*D;
  double a=sin(dLat/2)*sin(dLat/2)
          +cos(la1*D)*cos(la2*D)*sin(dLon/2)*sin(dLon/2);
  return 2.0*R*atan2(sqrt(a),sqrt(1.0-a));
}

// Listen on GPS_SERIAL up to GPS_READ_MS for a *valid* RMC fix.
// Returns true and sets lat/lon (decimal degrees) on success.
bool readGPS(double &lat,double &lon){
  char line[100]; int idx=0;
  unsigned long start=millis();
  while(millis()-start < GPS_READ_MS){
    while(GPS_SERIAL.available()){
      char c=GPS_SERIAL.read();
      if(c=='\n' || c=='\r'){
        line[idx]=0;
        if(idx>0 && line[0]=='$') gpsLineCount++;   // any NMEA sentence = GPS wired & talking
        if(idx>6 && (!strncmp(line,"$GPRMC",6) || !strncmp(line,"$GNRMC",6))){
          // split on ',' keeping empty fields: f[2]=status f[3]=lat f[4]=N/S f[5]=lon f[6]=E/W
          char* f[13]; int nf=0; f[nf++]=line;
          for(char* q=line; *q && nf<13; q++){ if(*q==','){ *q=0; f[nf++]=q+1; } }
          if(nf>=7 && f[2][0]=='A' && f[3][0] && f[5][0]){
            double la=gpsToDeg(f[3],f[4][0]);
            double lo=gpsToDeg(f[5],f[6][0]);
            if(la!=0.0 || lo!=0.0){ lat=la; lon=lo; return true; }
          }
        }
        idx=0;
      } else if(idx<99){ line[idx++]=c; } else { idx=0; }
    }
  }
  return false;
}

void flushToFlash(){ prefs.begin("mower",false); prefs.putUInt("life",lifetimeSeconds); prefs.putFloat("gpsm",gpsTotalMeters); prefs.end(); secsSinceFlush=0; }
void loadFromFlash(){ prefs.begin("mower",true); lifetimeSeconds=prefs.getUInt("life",0); gpsTotalMeters=prefs.getFloat("gpsm",0); prefs.end(); }

// Live config + level reference, restored at every boot. Anything never pushed
// down keeps the compiled-in default, so a fresh board behaves exactly as before.
void loadConfig(){
  prefs.begin("mower", true);
  VIB_THRESHOLD     = prefs.getFloat("vibthr",  VIB_THRESHOLD);
  IDLE_INTERVAL_S   = prefs.getInt  ("idles",   IDLE_INTERVAL_S);
  SAMPLE_INTERVAL_S = prefs.getInt  ("samps",   SAMPLE_INTERVAL_S);
  TRACK_MIN_STEP_M  = prefs.getFloat("trkstep", TRACK_MIN_STEP_M);
  GPS_STEP_MAX_M    = prefs.getFloat("gpsmax",  GPS_STEP_MAX_M);
  FLUSH_EVERY_S     = prefs.getInt  ("flushs",  FLUSH_EVERY_S);
  serviceMode       = prefs.getBool ("svcmode", false);
  cfgRev            = prefs.getUInt ("cfgrev",  0);
  refGx = prefs.getFloat("refgx", 0);
  refGy = prefs.getFloat("refgy", 0);
  refGz = prefs.getFloat("refgz", 0);
  refOK = prefs.getBool ("refok", false);
  // pendingAck lives in flash rather than RTC memory on purpose: a `reboot`
  // command must survive the reboot it causes, or the box would come back up,
  // fail to acknowledge, be handed the same command again, and reboot forever.
  pendingAck = prefs.getUInt("ack", 0);
  // Read here too, not just on cold boot: this is a plain global, so it would
  // otherwise report 0 on every deep-sleep wake and look like the box had never
  // booted at all.
  bootCount  = prefs.getUInt("boots", 0);
  prefs.end();
}

void setPendingAck(uint32_t id){
  pendingAck = id;
  prefs.begin("mower", false); prefs.putUInt("ack", id); prefs.end();
}

// ---- Minimal JSON field readers ------------------------------------------------
// The downlink is small and produced by our own server, so a full JSON parser
// would be a lot of flash for no benefit. Keys are matched WITH their closing
// quote, so "cfg" can never accidentally match "cfg_rev".
bool jsonNum(const String &s, const char* key, float &out){
  String k = String("\"") + key + "\":";
  int i = s.indexOf(k);
  if(i < 0) return false;
  out = s.substring(i + k.length()).toFloat();
  return true;
}
bool jsonStr(const String &s, const char* key, String &out){
  String k = String("\"") + key + "\":\"";
  int i = s.indexOf(k);
  if(i < 0) return false;
  i += k.length();
  int j = s.indexOf('"', i);
  if(j < 0) return false;
  out = s.substring(i, j);
  return true;
}

// Pull a new firmware image. Deliberately the rarest path: routine tuning goes
// through the config channel and needs no new image at all.
//
// Known limit, stated plainly: the Arduino ESP32 core does not enable bootloader
// rollback, so an image that boots but is logically broken (never joins WiFi,
// crashes early) cannot be recovered over the air — that means pulling the box.
// The sha256 the server pins protects against a corrupt or truncated download,
// not against bad code. Every image goes on the bench over USB first.
bool doOta(const String &url){
  Serial.printf("OTA: fetching %s\n", url.c_str());
  // A firmware download legitimately runs longer than the watchdog window, so
  // step out from under it here and re-arm if the update fails and we carry on.
  esp_task_wdt_delete(NULL);
  WiFiClientSecure client; client.setInsecure();
  httpUpdate.rebootOnUpdate(true);
  t_httpUpdate_return r = httpUpdate.update(client, url);
  if(r == HTTP_UPDATE_FAILED){
    otaFails++;
    esp_task_wdt_add(NULL);            // back under the watchdog for the rest of the wake
    Serial.printf("OTA FAILED (%d) %s\n", httpUpdate.getLastError(),
                  httpUpdate.getLastErrorString().c_str());
    return false;
  }
  return true;   // on success the device has already rebooted
}

// Apply whatever the server sent back on this upload's own response.
void handleDownlink(const String &resp){
  if(resp.length() < 2) return;

  float rev;
  if(jsonNum(resp, "cfg_rev", rev)){
    uint32_t serverRev = (uint32_t)rev;
    if(serverRev != cfgRev && resp.indexOf("\"cfg\":") >= 0){
      float v;
      prefs.begin("mower", false);
      if(jsonNum(resp,"vib_threshold",v))     { VIB_THRESHOLD=v;          prefs.putFloat("vibthr",v); }
      if(jsonNum(resp,"idle_interval_s",v))   { IDLE_INTERVAL_S=(int)v;   prefs.putInt("idles",(int)v); }
      if(jsonNum(resp,"sample_interval_s",v)) { SAMPLE_INTERVAL_S=(int)v; prefs.putInt("samps",(int)v); }
      if(jsonNum(resp,"track_min_step_m",v))  { TRACK_MIN_STEP_M=v;       prefs.putFloat("trkstep",v); }
      if(jsonNum(resp,"gps_step_max_m",v))    { GPS_STEP_MAX_M=v;         prefs.putFloat("gpsmax",v); }
      if(jsonNum(resp,"flush_every_s",v))     { FLUSH_EVERY_S=(int)v;     prefs.putInt("flushs",(int)v); }
      if(jsonNum(resp,"service_mode",v))      { serviceMode=(v>=0.5f);    prefs.putBool("svcmode",serviceMode); }
      cfgRev = serverRev;
      prefs.putUInt("cfgrev", cfgRev);
      prefs.end();
      Serial.printf("config applied, rev=%lu vib=%.4f idle=%d svc=%d\n",
                    (unsigned long)cfgRev, VIB_THRESHOLD, IDLE_INTERVAL_S, serviceMode?1:0);
    }
  }

  float idf; String doWhat;
  if(jsonNum(resp,"id",idf) && jsonStr(resp,"do",doWhat)){
    uint32_t id = (uint32_t)idf;
    Serial.printf("command %lu: %s\n", (unsigned long)id, doWhat.c_str());
    // Acknowledge BEFORE acting. Both `reboot` and a successful `ota` never
    // return, so an ack written afterwards would never be written at all — and
    // the box would be handed the same command again on the next upload.
    setPendingAck(id);
    lastCmdId = id;
    if(doWhat == "zero_tilt")         lastCmdOk = zeroTilt() ? 1 : 0;
    else if(doWhat == "clear_track")  { gpsTrackN=0; trkHavePrev=0; lastCmdOk=1; }
    else if(doWhat == "flush_buffer") { sfCount=0; lastCmdOk=1; }
    else if(doWhat == "reboot")       { Serial.println("rebooting"); delay(200); ESP.restart(); }
    else if(doWhat == "ota")          { String u; lastCmdOk = (jsonStr(resp,"url",u) && doOta(u)) ? 1 : 0; }
    else                              lastCmdOk = 0;
    // A failed command stays failed rather than retrying forever. The outcome
    // rides in the next payload as last_cmd/last_cmd_ok, so it is visible from
    // the endpoint and can simply be re-queued.
  }
}

// Snapshot everything this wake measured into a packed reading.
void captureCurrent(SfReading &r, bool running){
  r.stampS       = uptimeS;
  r.hoursSec     = lifetimeSeconds;
  r.battery      = readBattery();
  r.battRaw      = (analogRead(BATTERY_ADC_PIN)/4095.0f)*3.3f;
  r.vib          = lastVib;
  r.pitch        = tiltPitch;
  r.roll         = tiltRoll;
  r.espTemp      = espTempF();
  r.lat          = gpsLat;
  r.lon          = gpsLon;
  r.distTotal    = (int32_t)(gpsTotalMeters+0.5f);
  r.distSession  = (int32_t)(gpsSessionMeters+0.5f);
  r.gpsLines     = gpsLineCount;
  r.rpmPeak      = (int16_t)(rpmPeak+0.5f);
  r.rpmAvg       = (rpmCount>0)?(int16_t)(rpmSum/rpmCount+0.5f):0;
  r.rssi         = 0;                       // filled in once WiFi is actually up
  r.shocks       = shockCount;
  r.hasFix       = gpsHaveFix;
  r.mpu          = mpuOK?1:0;
  r.engineRunning= running?1:0;
}

// Build the upload body.
//   src       — "mow_end" (this upload carries a finished mow's totals),
//               "heartbeat" (parked idle report), or "buffered" (a replayed
//               reading that failed to send earlier).
//   ageS      — seconds between when the reading was CAPTURED and now. 0 = live.
//   withTrack — only the current reading carries the GPS breadcrumb array;
//               replayed ones don't (the track lives in its own RTC buffer and is
//               only cleared once it has actually been delivered).
String buildJson(const SfReading &r, const char* src, bool mowEnded, uint32_t ageS, bool withTrack){
  String b = String("{\"secret\":\"") + DEVICE_SECRET + "\"";
  b += ",\"source\":\"" + String(src) + "\"";
  b += ",\"engine_running\":" + String(r.engineRunning ? "true" : "false");
  if(mowEnded) b += ",\"mow_ended\":true";
  if(ageS > 0) b += ",\"age_s\":" + String((unsigned long)ageS);
  b += ",\"hours_seconds\":" + String((unsigned long)r.hoursSec);
  // Decimal engine hours. The app reads `hours`; it has never read hours_seconds,
  // so without this line the hour meter is fed nothing at all.
  b += ",\"hours\":" + String(r.hoursSec/3600.0f, 4);
  b += ",\"battery\":" + String(r.battery, 2);
  b += ",\"rpm_peak\":" + String((int)r.rpmPeak);
  b += ",\"rpm_avg\":" + String((int)r.rpmAvg);
  // Real JSON boolean, not 0/1 — the server tests `has_fix !== false`, which a
  // numeric 0 would silently pass, letting a no-fix 0,0 reach the yard map.
  b += ",\"has_fix\":" + String(r.hasFix ? "true" : "false");
  if(r.hasFix) b += ",\"lat\":" + String(r.lat,6) + ",\"lon\":" + String(r.lon,6);
  b += ",\"dist_session_m\":" + String((long)r.distSession);
  b += ",\"dist_total_m\":" + String((long)r.distTotal);
  b += ",\"mpu_ok\":" + String((int)r.mpu);
  b += ",\"gps_rx\":" + String((unsigned long)r.gpsLines);
  b += ",\"vibration\":" + String(r.vib, 4);
  b += ",\"wifi_rssi\":" + String((int)r.rssi);
  b += ",\"batt_raw\":" + String(r.battRaw, 3);
  // Omit tilt entirely when the MPU didn't answer, rather than shipping the last
  // stale value. A silent sensor reported pitch and roll BOTH frozen at -35.3 for
  // weeks and it read as data. Absent is honest; stale is a lie that looks fine.
  if(r.mpu){
    b += ",\"pitch\":" + String(r.pitch, 1);
    b += ",\"roll\":"  + String(r.roll, 1);
    b += ",\"tilt_deg\":" + String(tiltTotal, 1);
    b += ",\"upright\":" + String(uprightNow ? "true" : "false");
    b += ",\"tilt_ref\":" + String(refOK ? "true" : "false");
  }
  b += ",\"shock_events\":" + String((unsigned long)r.shocks);
  b += ",\"esp_temp_f\":" + String(r.espTemp, 1);
  // ---- Identity, config state and health --------------------------------------
  // These describe the BOX, not this reading, so they ride on every payload —
  // including replayed ones. The point is that "which build is on the mower, what
  // config is it running, and is anything degrading" is answerable from the
  // endpoint at any moment, without anyone walking to the garage.
  b += ",\"fw\":\"" FW_VERSION "\"";
  b += ",\"cfg_rev\":" + String((unsigned long)cfgRev);
  b += ",\"service_mode\":" + String(serviceMode ? "true" : "false");
  b += ",\"boot_count\":" + String((unsigned long)bootCount);
  b += ",\"reset_reason\":" + String((int)esp_reset_reason());
  b += ",\"i2c_errors\":" + String((unsigned long)i2cErrors);
  b += ",\"mpu_reinits\":" + String((unsigned long)mpuReinits);
  if(otaFails)   b += ",\"ota_fails\":" + String((unsigned long)otaFails);
  if(pendingAck) b += ",\"cmd_ack\":" + String((unsigned long)pendingAck);
  if(lastCmdId){
    b += ",\"last_cmd\":" + String((unsigned long)lastCmdId);
    b += ",\"last_cmd_ok\":" + String(lastCmdOk ? "true" : "false");
  }
  // Vibration across the whole window since the last upload — this is what makes
  // VIB_THRESHOLD calibratable from one real mow instead of guessed.
  if(vibN){
    b += ",\"vib_max\":" + String(vibMax, 4);
    b += ",\"vib_avg\":" + String(vibSum / vibN, 4);
    b += ",\"vib_n\":" + String((unsigned long)vibN);
  }
  // Raw gravity vector, current reading only (a replayed one would carry today's
  // orientation, not the one it was captured at). Lets the tilt maths be checked
  // server-side instead of taken on trust.
  if(withTrack && r.mpu){
    b += ",\"ax\":" + String(gravX / ACCEL_LSB_PER_G, 4);
    b += ",\"ay\":" + String(gravY / ACCEL_LSB_PER_G, 4);
    b += ",\"az\":" + String(gravZ / ACCEL_LSB_PER_G, 4);
  }
  b += ",\"track\":[";
  if(withTrack){
    for(uint16_t i=0;i<gpsTrackN;i++){
      if(i) b += ",";
      b += "[" + String(gpsTrackLat[i]/1e6,6) + "," + String(gpsTrackLon[i]/1e6,6) + "]";
    }
  }
  b += "]}";
  return b;
}

bool postJson(const String &body){
  WiFiClientSecure client; client.setInsecure();
  HTTPClient http;
  if(!http.begin(client, ENDPOINT)) return false;
  http.addHeader("Content-Type","application/json");
  int code = http.POST(body);
  // The response was always being read and thrown away. Keeping it is what turns
  // every upload into a two-way exchange — no extra connection, no extra radio
  // time, no extra battery.
  lastResp = http.getString();
  Serial.printf("  POST %d  resp=%s\n", code, lastResp.c_str());
  http.end();
  return (code == 200);
}

void sfPush(const SfReading &r){
  sfBuf[sfHead] = r;
  sfHead = (sfHead + 1) % SF_MAX;
  if(sfCount < SF_MAX) sfCount++;    // full buffer drops the OLDEST reading
}

bool uploadData(bool running, bool mowEnded){
  SfReading cur; captureCurrent(cur, running);

  const char* ssid = WIFI_SSID;
#if SF_BENCH_TEST
  if(testWakes < SF_TEST_FAILS){
    ssid = "HCC_OFFLINE_BENCH_TEST";   // deliberately does not exist
    testWakes++;
    Serial.printf("[BENCH TEST] forcing WiFi failure %u/%u\n",
                  (unsigned)testWakes, (unsigned)SF_TEST_FAILS);
  }
#endif
  WiFi.mode(WIFI_STA);
  Serial.printf("WiFi: connecting to \"%s\"...\n", ssid);
  WiFi.begin(ssid,WIFI_PASS);
  unsigned long start=millis();
  while(WiFi.status()!=WL_CONNECTED && millis()-start<15000) delay(200);
  if(WiFi.status()!=WL_CONNECTED){
    int st=WiFi.status();
    const char* why = (st==1) ? "SSID NOT found (wrong name, on 5GHz, or out of range)"
                    : (st==4) ? "connect FAILED (usually a wrong password)"
                    : (st==6) ? "disconnected / timed out"
                    : "not connected";
    Serial.printf("WiFi: FAILED  status=%d -> %s\n", st, why);
    WiFi.disconnect(true); WiFi.mode(WIFI_OFF);
    sfPush(cur);                                  // TASK 2: hold it, don't lose it
    Serial.printf("buffered this reading (%u held)\n", (unsigned)sfCount);
    return false;
  }
  Serial.println("WiFi: connected OK");
  cur.rssi = (int16_t)WiFi.RSSI();

  // Flush the backlog OLDEST-FIRST, before the current reading, so the server
  // receives them in the order they actually happened.
  // The delay sits INSIDE the loop, after each successful send — so it also provides
  // the gap before the current reading's own POST, while a normal upload with an
  // empty backlog (the common case) is never slowed down at all.
  while(sfCount > 0){
    uint16_t idx = (sfHead + SF_MAX - sfCount) % SF_MAX;
    uint32_t age = uptimeS - sfBuf[idx].stampS;
    Serial.printf("flushing buffered reading (%lus old, %u left)\n",
                  (unsigned long)age, (unsigned)sfCount);
    if(!postJson(buildJson(sfBuf[idx], "buffered", false, age, false))) break;
    sfCount--;
    delay(FLUSH_GAP_MS);                   // see FLUSH_GAP_MS — KV write-race window
  }

  const char* src = mowEnded ? "mow_end" : (running ? "live" : "heartbeat");
  uint32_t ackSent = pendingAck;
  bool ok = postJson(buildJson(cur, src, mowEnded, 0, true));
  if(!ok){
    sfPush(cur);
    Serial.printf("upload failed — buffered (%u held)\n", (unsigned)sfCount);
  } else {
    // The ack rode out with this payload, so retire it — but only the exact id we
    // sent, and before handleDownlink runs, since that may queue a NEW ack.
    if(ackSent && pendingAck == ackSent) setPendingAck(0);
    // Act on the reply while the radio is still up: an OTA needs the connection,
    // and a reboot should happen here rather than after we've torn WiFi down.
    handleDownlink(lastResp);
  }
  WiFi.disconnect(true); WiFi.mode(WIFI_OFF);
  return ok;
}

void setup(){
  Serial.begin(115200); delay(50);
  // Live config and the level reference come back before anything uses them —
  // intervals, thresholds and tilt all depend on this having run first.
  loadConfig();

  // Arm the watchdog before any of the work that could hang. The Arduino core may
  // have already started the TWDT, so reconfigure rather than fail in that case.
  esp_task_wdt_config_t wdtCfg = {
    .timeout_ms = (uint32_t)WDT_TIMEOUT_S * 1000,
    .idle_core_mask = 0,
    .trigger_panic = true,
  };
  if(esp_task_wdt_init(&wdtCfg) == ESP_ERR_INVALID_STATE) esp_task_wdt_reconfigure(&wdtCfg);
  esp_task_wdt_add(NULL);

  Serial.printf("\n=== HCC mower box fw " FW_VERSION " ===\n");
  Serial.printf("cfg_rev=%lu vib=%.4f idle=%ds sample=%ds trk=%.1fm svc=%d tiltRef=%d\n",
                (unsigned long)cfgRev, VIB_THRESHOLD, IDLE_INTERVAL_S,
                SAMPLE_INTERVAL_S, TRACK_MIN_STEP_M, serviceMode?1:0, refOK?1:0);

  Wire.begin(I2C_SDA,I2C_SCL);
  mpuInit(); delay(20);
  // A sensor that has gone quiet is the normal failure here — the AD0 line came
  // loose once already and cost weeks of tilt data AND every engine hour, since
  // hour counting keys off vibration. One free retry per wake turns most of those
  // into a self-heal, and the counters make a marginal connection visible in the
  // data long before it fails outright.
  if(!mpuOK){
    i2cErrors++;
    Serial.println("MPU silent — re-initialising");
    delay(50); mpuInit(); delay(20);
    if(mpuOK){ mpuReinits++; Serial.println("MPU recovered on retry"); }
    else       Serial.println("MPU still silent — check the AD0/SDA/SCL wiring");
  }
  GPS_SERIAL.begin(GPS_BAUD, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  if(rtcMagic!=0xCAFEBABE){            // cold boot: reload total, fresh RPM session
    rtcMagic=0xCAFEBABE;
    loadFromFlash();
    // Boot count lives in flash, not RTC, so it survives the power cut that RTC
    // memory does not — which is exactly the event worth counting.
    prefs.begin("mower", false);
    bootCount = prefs.getUInt("boots", 0) + 1;
    prefs.putUInt("boots", bootCount);
    prefs.end();
    Serial.printf("cold boot #%lu (reset reason %d)\n",
                  (unsigned long)bootCount, (int)esp_reset_reason());
    vibMax=0; vibSum=0; vibN=0;
    lastCmdId=0; lastCmdOk=0;
    secsSinceFlush=0; rpmPeak=0; rpmSum=0; rpmCount=0;
    gpsSessionMeters=0; gpsHaveLast=0; // fresh distance session; lifetime kept
    gpsTrackN=0;                        // fresh yard-map track
    trkHavePrev=0;
    wasRunning=0;
    // RTC RAM is undefined after a power cut — zero the backlog explicitly so a
    // cold boot can't replay garbage as if it were real readings.
    sfHead=0; sfCount=0; uptimeS=0;
#if SF_BENCH_TEST
    testWakes=0;
#endif
  }

  if(CALIBRATION_MODE){
    while(true){
      float fs=captureSamples();
      RpmResult r=analyze(fs);
      Serial.print("vib(g)="); Serial.print(r.stdG,4);
      Serial.print("  Fs=");   Serial.print(fs,0);
      Serial.print("Hz  RPM=");
      if(r.valid) Serial.println(r.rpm,0); else Serial.println("--");
      delay(300);
    }
  }

  float fs=captureSamples();
  computeTilt();                 // pitch/roll + shock — must run before analyze() removes DC
  RpmResult r=analyze(fs);
  lastVib = r.stdG;
  // Track what vibration actually looks like between uploads. A single sample at
  // upload time says nothing about a mow the box slept through, and VIB_THRESHOLD
  // has been a guess marked "(calibrate)" since day one. With max and average
  // reported, one real mow is enough to set it correctly over the air.
  if(r.stdG > vibMax) vibMax = r.stdG;
  vibSum += r.stdG; vibN++;

  // Engine detection. STARTING the clock is strict; KEEPING it running is lenient.
  // The asymmetry is deliberate: a false start banks hours that were never worked,
  // a false stop loses hours that were — and losing real hours is the failure that
  // already cost months here, so the hold condition stays forgiving.
  //
  // Strict entry needs all of:
  //   - vibration above threshold
  //   - a plausible RPM actually detected. A running engine is a strong periodic
  //     signal; scrubbing under the deck or wrenching a blade bolt is broadband
  //     noise with no clean spectral peak, so amplitude alone can't tell them
  //     apart and a 20-minute oil change would otherwise bank 20 minutes of hours.
  //   - the mower upright (you don't run one on its side)
  //   - service mode off
  // Lenient hold: vibration alone, so an SNR dip mid-mow never stops the clock.
  bool vibHot = (r.stdG >= VIB_THRESHOLD);
  bool canRun = uprightNow && !serviceMode;
  bool running = wasRunning ? (vibHot && canRun)
                            : (vibHot && r.valid && canRun);
  String rpmStr = r.valid ? String((int)r.rpm) : String("--");
  Serial.printf("vib=%.4f running=%d Fs=%.0f rpm=%s life=%us\n",
                r.stdG, running, fs, rpmStr.c_str(), lifetimeSeconds);

  // --- GPS: read on EVERY wake (bench + parked + mowing) ----------------
  // Old behavior read the GPS only while the engine vibrated, so it could
  // never lock on a bench and the upload (a parked wake) always reported
  // gps_rx=0 -> "GPS silent". Reading here, before the branch, makes the
  // health count (gpsLineCount, set inside readGPS) and the fix current on
  // the very wake that uploads. gps_rx is finally truthful.
  double clat, clon;
  bool gotFix = readGPS(clat, clon);
  if(gotFix){ gpsLat=(float)clat; gpsLon=(float)clon; gpsHaveFix=1; }
  Serial.printf("GPS: nmea_lines=%lu fix=%d lat=%.6f lon=%.6f\n",
                (unsigned long)gpsLineCount, gpsHaveFix, gpsLat, gpsLon);

  // --- TASK 1: log the yard-map track on ANY fix, not just while the engine runs.
  // Jeff: "it needs to start recording from when it gets its first signal to its
  // last." The old code buffered points inside the `running` branch only, so if the
  // vibration threshold dipped below VIB_THRESHOLD mid-mow — or the mower was moved
  // under low throttle — those points were never recorded at all.
  // TRACK_MIN_STEP_M is what keeps this honest: without a movement gate, logging on
  // every fix would record a parked mower's GPS drift as if it were mowing.
  if(gotFix){
    double stepFromTrack = trkHavePrev ? haversineM(trkPrevLat, trkPrevLon, clat, clon)
                                       : (double)TRACK_MIN_STEP_M;
    if(stepFromTrack >= TRACK_MIN_STEP_M && stepFromTrack <= GPS_STEP_MAX_M){
      if(gpsTrackN < GPS_TRACK_MAX){
        gpsTrackLat[gpsTrackN] = (int32_t)(clat*1e6);
        gpsTrackLon[gpsTrackN] = (int32_t)(clon*1e6);
        gpsTrackN++;
      }
      trkPrevLat=(float)clat; trkPrevLon=(float)clon; trkHavePrev=1;
    }
  }

  // Did a mow just finish? (was running on the previous wake, isn't now.) The box
  // only uploads while parked, so this flag is the only way the server can tell
  // WHICH upload carries a completed mow's totals rather than an idle report.
  bool mowEnded   = (wasRunning && !running);
  bool mowStarted = (running && !wasRunning);
  wasRunning = running ? 1 : 0;

  // Per-mow stats are cleared when the NEXT mow actually STARTS — not when the
  // upload succeeds. Jeff, 2026-08-11: "even if the mower is off and just sitting in
  // the garage the sensors [should] still [be] reporting... showing their last
  // reading." Zeroing on upload meant RPM, this-mow distance and speed all dropped to
  // "—" in the app about five minutes after every mow, which reads as a dead sensor.
  // Holding them until a new mow begins means the parked box keeps reporting the last
  // real mow's numbers, so the card always shows live, meaningful values.
  if(mowStarted){
    rpmPeak=0; rpmSum=0; rpmCount=0;
    gpsSessionMeters=0; gpsHaveLast=0;
  }

  int sleepSeconds;
  if(running){
    lifetimeSeconds+=SAMPLE_INTERVAL_S;
    secsSinceFlush +=SAMPLE_INTERVAL_S;
    if(r.valid){ if(r.rpm>rpmPeak) rpmPeak=r.rpm; rpmSum+=r.rpm; rpmCount++; }
    // Distance still accumulates only while mowing — "this mow" distance would be
    // inflated by parked drift otherwise. (The track above is drift-gated instead.)
    if(gotFix){
      if(gpsHaveLast){
        double step=haversineM(gpsPrevLat, gpsPrevLon, clat, clon);
        if(step>=GPS_STEP_MIN_M && step<=GPS_STEP_MAX_M){
          gpsSessionMeters+=(float)step; gpsTotalMeters+=(float)step;
        }
      }
      gpsPrevLat=(float)clat; gpsPrevLon=(float)clon; gpsHaveLast=1;
    }
    if(secsSinceFlush>=FLUSH_EVERY_S) flushToFlash();
    sleepSeconds=SAMPLE_INTERVAL_S;          // no WiFi while mowing
  } else {
    if(secsSinceFlush>0) flushToFlash();
    bool ok=uploadData(running, mowEnded);
    Serial.println(ok?"uploaded":"no wifi / upload skipped");
    if(ok){
      // NOTE: rpmPeak/rpmAvg/gpsSessionMeters are deliberately NOT cleared here any
      // more — they're cleared when the next mow starts (see mowStarted above), so a
      // parked box keeps reporting the last real mow's numbers instead of zeros.
      // Only the track buffer clears on delivery, so its points can't be sent twice.
      //
      // FIXED 2026-08-11: this used to also clear trkHavePrev, which threw away the
      // movement gate's reference point. With nothing to compare against, the very
      // next fix ALWAYS passed the >=3 m test — so every parked heartbeat recorded
      // and shipped one track point sitting on the parking spot, and the server
      // merged it into the yard map. Measured live: the garage cell gaining a visit
      // every five minutes while real grass sat at one or two. Carrying the last
      // delivered point across uploads makes the 3 m gate mean what it says.
      if(gpsTrackN > 0){
        trkPrevLat  = gpsTrackLat[gpsTrackN-1]/1e6f;
        trkPrevLon  = gpsTrackLon[gpsTrackN-1]/1e6f;
        trkHavePrev = 1;
      }
      gpsTrackN=0;                           // track delivered; clear for next mow
      // Vibration stats describe the window since the last upload, so they reset
      // with it.
      vibMax=0; vibSum=0; vibN=0;
    }
    sleepSeconds=IDLE_INTERVAL_S;
  }

  // Monotonic clock across deep sleeps — this is what gives every buffered
  // reading a real `age_s` instead of all of them arriving stamped "now".
  uptimeS += (uint32_t)sleepSeconds;

  esp_sleep_enable_timer_wakeup((uint64_t)sleepSeconds*1000000ULL);
  Serial.printf("sleeping %ds\n", sleepSeconds);
  Serial.flush();
  esp_deep_sleep_start();
}

void loop(){ /* never runs */ }
