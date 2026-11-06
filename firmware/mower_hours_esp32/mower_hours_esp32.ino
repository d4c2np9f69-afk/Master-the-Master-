/*
 * ============================================================
 *  Mower Hour Meter + yard GPS -- ESP32 firmware
 * ============================================================
 *  Board: ESP32-WROOM-32 30-pin NodeMCU dev board (Silicon Labs
 *  CP2102 USB, USB-C). Flash with a DATA USB-C cable. Arduino IDE
 *  board: "ESP32 Dev Module". If the COM port doesn't appear, install
 *  the Silicon Labs CP210x driver. Hold BOOT while connecting if the
 *  upload won't start.
 *  NOTE: pins below are mapped for the classic ESP32-WROOM-32.
 *  Do NOT use GPIO6-11 (wired to flash) or ADC2 pins for the battery
 *  (ADC2 can't be read while WiFi is on).
 * ------------------------------------------------------------
 *  What it does:
 *    - PARKED: wakes every SAMPLE_INTERVAL_S (30 s), reads the MPU-6050 with
 *      the radio off, and goes back to sleep if the engine is not running.
 *      Posts to the server every IDLE_INTERVAL_S.
 *    - ENGINE RUNNING: stays awake with the radio off. Reads the MPU about once
 *      a second, credits real elapsed time to the hour meter, and logs a GPS
 *      track point to flash every 3 m of real movement.
 *    - ENGINE OFF for 30 s: closes the mow, brings WiFi up, sends the track file,
 *      then posts the mow's totals.
 *
 *  The decisions (hour meter, GPS parsing, which fixes go on the map) live in
 *  mower_logic.h, which has no hardware in it and is tested on a PC by
 *  scripts/mower-logic-test.cpp. Change them there, and run that test.
 *
 *  RPM is a best-effort estimate from vibration, NOT a true tachometer. Its
 *  clean-peak test is what tells a running engine from someone scrubbing the
 *  deck; the number itself is informational.
 *
 *  No external libraries -- only ones built into the ESP32 core.
 *
 *  FIRST TIME:
 *    1) Fill in secrets.h.
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
#include <LittleFS.h>
#include <math.h>
#include <string.h>
#include <stdlib.h>
#include "esp_sleep.h"
#include <HTTPUpdate.h>
#include "esp_system.h"
#include "esp_task_wdt.h"
#include "esp_ota_ops.h"
#include "esp_partition.h"
#include "mower_logic.h"

// Hardware watchdog. Jeff's words for why this exists: "I would only push it if it
// got hung up." A wedged wake -- a WiFi stack stuck below its own timeout -- used to
// mean the box was silently dead until someone walked to the garage to press EN.
// Fed on every tick of the run loop and between uploads.
const int WDT_TIMEOUT_S = 180;

// Bumped on every flash. Reported in every upload so there is never any doubt
// about which build is actually on the mower.
#define FW_VERSION "1.5.0"

// RPM analysis result type -- declared up here so the Arduino IDE's
// auto-generated function prototypes can see it (fixes 'does not name a type').
struct RpmResult{ float rpm; float stdG; bool valid; };

// ----------------------- CONFIG -----------------------
// Credentials live in secrets.h, which is gitignored -- this repo is PUBLIC.
// Copy secrets.example.h to secrets.h and fill it in on any new machine.
// NOTE: the COMPILED BINARY still contains these as plaintext strings, so a
// firmware .bin must never be served from a public URL either. Verified by
// grepping a real build on 2026-08-11.
#include "secrets.h"
const char* WIFI_SSID     = HCC_WIFI_SSID;
const char* WIFI_PASS     = HCC_WIFI_PASS;
const char* ENDPOINT      = "https://toro1-5rz.pages.dev/api/hours";  // live project + KV
const char* DEVICE_SECRET = HCC_DEVICE_SECRET;       // see secrets.h

// NOT const: live config, restored from NVS at boot and settable from the server over
// the control channel. Values here are only the factory defaults.
//
// 🔴 SENSE AND POST ARE TWO DIFFERENT INTERVALS.
//   SENSE = wake, read the MPU, sleep. Radio off. Every SAMPLE_INTERVAL_S, parked.
//   POST  = bring up WiFi, associate, HTTP. Every IDLE_INTERVAL_S, parked.
// 1.4.0 slept IDLE_INTERVAL_S when parked, so a parked box sensed only as often as it
// posted: every start sat somewhere inside a 15-minute blind window, and a short run could
// fall between two wakes and never be seen. HOW MUCH that cost is NOT established: the
// 15-17 min per-mow gaps in #269 are measured across a window that contains one whole sleep
// by construction, so they are the most a start could lose, not what it lost.
// The 30 s sense is what Jeff built and described; IDLE_INTERVAL_S keeps its server clamp
// [60,900] and now only means how often to post. Sensing every 30 s instead of every
// 15 min costs battery that has NOT been measured -- batt in the log is how to see it.
int         SAMPLE_INTERVAL_S = 30;    // parked: how often to check for the engine
int         IDLE_INTERVAL_S   = 300;   // parked: how often to post

// Bench-test hook, left in place (disabled) because it proved genuinely useful:
// set to 1 and the first SF_TEST_FAILS parked wakes point at a bogus SSID, forcing a
// REAL WiFi timeout so the store-and-forward buffer can be verified end to end.
// Must run inside ONE boot session -- a reflash causes POWERON_RESET, which wipes RTC
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
// NOTE: this REDUCES the race, it does not eliminate it.
const int   FLUSH_GAP_MS      = 2000;
// How often engine seconds get written to flash WHILE RUNNING. This is exactly the
// exposure to a power cut or the EN button: hours already banked always survive, hours
// since the last flush do not. Live config.
int         FLUSH_EVERY_S     = 60;

float       VIB_THRESHOLD     = 0.06;  // g of vibration that means ENGINE ON (calibrate)
bool        CALIBRATION_MODE  = false; // true = print vibration + RPM so you can tune

// How long without vibration before the engine is called off. Jeff, describing what he
// programmed and watched: "It would turn off after 30 seconds."
const uint32_t STOP_HOLD_MS   = 30000;
// How often the run loop reads the MPU. One capture takes 0.512 s of this.
const uint32_t RUN_TICK_MS    = 1000;

// --- Battery voltage (HiLetgo 0-25V voltage-sensor module) ---
// The module is a fixed 5:1 divider (30k/7.5k) on a board with a screw
// terminal for the battery and an S/+/- header.
// MUST be ADC1 on classic ESP32 because the battery is read while WiFi is ON, and ADC2
// pins can't be read with WiFi up. 5:1 keeps ~14.5V at ~2.9V on the pin.
const int   BATTERY_ADC_PIN   = 35;    // GPIO35 = ADC1_CH7, input-only, WiFi-safe (D34 channel damaged)
const float BATTERY_DIVIDER   = 5.0;   // fixed 5:1 ratio of the 0-25V module

// --- GPS (u-blox NEO-6M, GY-NEO6MV2) on a 2nd UART ---
// Wire: GPS VCC->5V, GPS GND->GND, GPS TX -> ESP32 GPIO16 (RX2; we only READ).
// Powered continuously off the 5V buck rail so it holds its fix between deep-sleep
// wakes. Antenna patch must face the SKY, not the deck. Its RX is not wired, so its
// config cannot be changed from here: it sends every sentence once a second at 9600.
#define     GPS_SERIAL         Serial1
const int   GPS_RX_PIN        = 16;
const int   GPS_TX_PIN        = -1;
const long  GPS_BAUD          = 9600;
// A vibration capture blocks for 0.512 s, during which ~490 bytes arrive at 9600 baud.
// The core's default UART buffer is 256 bytes: every capture would lose GPS data.
const int   GPS_RX_BUFFER     = 1024;
const unsigned long GPS_READ_MS = 2500;   // parked: how long to listen for one position
// Live config. See TrackLimits in mower_logic.h for what each one does.
float       TRACK_MIN_STEP_M  = 3.0;
float       TRACK_MIN_MPS     = 0.2;
float       TRACK_MAX_HDOP    = 5.0;

// --- Experimental RPM estimator ---
const int      RPM_SAMPLES   = 512;    // samples per capture
const uint32_t RPM_TARGET_US = 1000;   // ~1 ms/sample -> ~1000 Hz capture
const float    RPM_MIN       = 2300;   // search band low  (assumes near governed speed)
const float    RPM_MAX       = 3800;   // search band high
const float    RPM_STEP      = 30;     // scan resolution (RPM)
const float    RPM_MIN_SNR   = 4.0;    // peak/avg power ratio needed to trust a reading

// MPU6050 I2C -- classic ESP32 default I2C pins (clearly labeled D21/D22).
const int     I2C_SDA = 21;
const int     I2C_SCL = 22;
const uint8_t MPU_ADDR = 0x68;         // 0x69 if the module's AD0 pin is high
const float   ACCEL_LSB_PER_G = 4096.0;// matches the +/-8g range set in mpuInit()
// ------------------------------------------------------

// Changed from 1.4.0's value so this build always takes the cold-boot path once and never
// reads RTC variables laid out by different firmware. Hours are in NVS and are untouched.
const uint32_t RTC_MAGIC = 0xCAFE1500;
RTC_DATA_ATTR uint32_t rtcMagic        = 0;
RTC_DATA_ATTR uint32_t lifetimeSeconds = 0;
RTC_DATA_ATTR uint32_t secsSinceFlush  = 0;
RTC_DATA_ATTR uint32_t msCarry         = 0;  // sub-second remainder of the hour meter
RTC_DATA_ATTR float    rpmPeak  = 0;   // this mowing session
RTC_DATA_ATTR float    rpmSum   = 0;
RTC_DATA_ATTR uint32_t rpmCount = 0;

// --- GPS state (survives deep sleep) ---
RTC_DATA_ATTR float    gpsTotalMeters   = 0; // lifetime distance mowed
RTC_DATA_ATTR float    gpsSessionMeters = 0; // this mow only
RTC_DATA_ATTR float    gpsLat = 0, gpsLon = 0; // last good fix (for display)

// --- This mow. Every one of these is reported: #269 took three wrong theories before
// measurement settled it, so the next question gets answered from data first. ---------
RTC_DATA_ATTR uint32_t curMowId      = 0;  // from NVS; ties the track file to the mow_end post
RTC_DATA_ATTR uint32_t startGapS     = 0;  // the sleep before the start was noticed
RTC_DATA_ATTR uint32_t startCreditS  = 0;  // what was credited for it
RTC_DATA_ATTR uint32_t runSecThisMow = 0;  // engine seconds credited to this mow
RTC_DATA_ATTR uint32_t runTicks      = 0;  // MPU reads during this mow
RTC_DATA_ATTR uint32_t runNoRpm      = 0;  // ...of those, hot with no clean RPM peak
RTC_DATA_ATTR uint32_t runColdTicks  = 0;  // ...of those, below threshold (a dip or the hold)
RTC_DATA_ATTR uint32_t runFixes      = 0;  // GPS positions seen during this mow
RTC_DATA_ATTR uint32_t trkPtsMow     = 0;  // ...of those, kept as track points
RTC_DATA_ATTR uint32_t trkRejSlow    = 0;  // rejected: not moving (Doppler)
RTC_DATA_ATTR uint32_t trkRejHdop    = 0;  // rejected: poor geometry
RTC_DATA_ATTR uint32_t trkRejSpike   = 0;  // rejected: faster than the mower can go
RTC_DATA_ATTR float    battRunMin    = 0;  // battery WHILE RUNNING
RTC_DATA_ATTR float    battRunMax    = 0;
RTC_DATA_ATTR float    battAtStart   = 0;
RTC_DATA_ATTR uint32_t awakeSecLast  = 0;  // seconds awake on the previous wake
RTC_DATA_ATTR uint32_t wakeCount     = 0;  // wakes since cold boot
RTC_DATA_ATTR uint32_t secsSincePost = 0;  // parked seconds since the last upload

// ---- Store-and-forward buffer (survives deep sleep) ---------------------------------
// A reading that can't be sent is held in RTC memory and flushed oldest-first on
// reconnect. Each entry keeps the uptime second it was captured at, so the flush sends a
// real `age_s`. mowEnded + mowId travel WITH the reading (#267): by flush time the engine
// state they describe is long gone, so they can't be re-derived.
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
  uint8_t  hasFix, mpu, engineRunning, mowEnded, mowCut;
  uint32_t mowId, startGapS, startCreditS, runSec, runTicks, runNoRpm, runColdTicks;
  uint32_t runFixes, trkPts, rejSlow, rejHdop, rejSpike;
  float    battRunMin, battRunMax, battAtStart;
};
RTC_DATA_ATTR SfReading sfBuf[SF_MAX];
RTC_DATA_ATTR uint16_t  sfHead  = 0;   // next write slot
RTC_DATA_ATTR uint16_t  sfCount = 0;   // entries currently held
RTC_DATA_ATTR uint32_t  uptimeS = 0;   // monotonic seconds across deep sleeps
#if SF_BENCH_TEST
RTC_DATA_ATTR uint8_t   testWakes = 0; // TEMP: counts forced-failure wakes
#endif

// ---- The yard-map track: in FLASH, not RTC RAM ---------------------------------------
// Measured 11-03 (mow 2): the box cold-booted about 4 minutes before the mow ended. Hours
// survived in NVS; the RTC track did not, and 37 points were gone. A track in RTC RAM is
// lost to any power blip, so it goes to a file, written every 30 s. A cut costs at most
// the last 30 s of points.
//
// A file is a run of 8-byte records: latE6, lonE6, little-endian. A record whose first word
// is TRK_MARKER opens a mow and carries its id in the second. The whole file goes up as ONE
// POST, ahead of the mow_end post, and is deleted on the server's OK. Not chunks: each chunk
// would read-modify-write the same KV keys seconds apart, and that exact race lost readings
// at ~1 s spacing (see FLUSH_GAP_MS). One request has nothing to race and nothing to resume.
// A failed upload simply goes again, and the server skips what it already has.
//
// If the board's partition table has no data partition for it (or it won't mount) the
// track falls back to RTC RAM: shorter, and lost to a power cut, as 1.4.0 was. `trk_store`
// in the payload says which is in use. NOT KNOWN YET which this board has: the record does
// not say which partition scheme it was flashed with.
struct TrkRec { int32_t a, b; };
const int32_t  TRK_MARKER     = INT32_MIN;
const char*    TRK_PATH       = "/track.bin";
const uint32_t TRK_FILE_MAX   = 16000;     // records = 128 KB; ~13 hours of mowing
const int      TRK_BUF_N      = 64;        // RAM buffer between flash writes
const uint32_t TRK_FLUSH_MS   = 30000;
const int      RTC_TRK_MAX    = 400;

enum { FS_UNKNOWN = 0, FS_OK = 1, FS_NO_PARTITION = 2, FS_MOUNT_FAILED = 3 };
RTC_DATA_ATTR uint8_t  fsState    = FS_UNKNOWN;
RTC_DATA_ATTR uint32_t fsPartKb   = 0;
RTC_DATA_ATTR TrkRec   rtcTrk[RTC_TRK_MAX];
RTC_DATA_ATTR uint32_t trkRecs    = 0;   // records stored, waiting to go up
RTC_DATA_ATTR uint32_t trkDropped = 0;   // points lost because storage was full / failed
RTC_DATA_ATTR uint32_t trkFails   = 0;   // uploads the server didn't confirm
bool     fsMounted = false;
TrkRec   trkBuf[TRK_BUF_N];
int      trkBufN = 0;
uint32_t trkLastFlushMs = 0;

// ---- Self-rollback -------------------------------------------------------------------
// The invariant: an image that can POST can be fixed remotely. So a new image is on trial
// until its first successful POST, and goes back to the previous one if it can't get there.
//   Layer 1, the bootloader: core 3.3.11's sdkconfig has CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE
//     (sdkconfig line 286). If this board's bootloader has it too, an OTA image that resets
//     before it is marked valid is rolled back automatically. A deep-sleep wake also goes
//     through the bootloader, so it must be marked valid before the first deep sleep.
//   Layer 2, this firmware: the board's bootloader is whatever flashed it, and which core
//     that was is NOT known, so layer 1 can't be relied on. FW_TRIAL_MAX failures (a cold
//     boot, or a POST that failed) with no successful POST ever and it switches itself back.
// During a trial it posts on every wake, so the trial ends in minutes rather than hours.
const uint32_t FW_TRIAL_MAX = 10;
RTC_DATA_ATTR uint8_t fwConfirmed = 0;
uint32_t fwTrialFails = 0;

// Runs instead of the core's default, which marks every image valid before setup().
extern "C" bool verifyRollbackLater(){ return true; }

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

// ---- GPS ---------------------------------------------------------------------------
ml::NmeaParser nmea;
ml::TrackGate  trkGate;
bool gotFixNow = false;        // a position arrived during THIS wake
uint32_t lastMpuReadMs = 0;    // when the engine was last looked at, for startGapS

void considerTrackPoint(){
  ml::TrackLimits lim;
  lim.minStepM = TRACK_MIN_STEP_M;
  lim.minSpeed = TRACK_MIN_MPS;
  lim.maxHdop  = TRACK_MAX_HDOP;
  float step = 0;
  ml::Verdict v = trkGate.check(nmea.lat, nmea.lon, millis(), nmea.speedMps, nmea.hdop, lim, &step);
  switch(v){
    case ml::ACCEPT:
      trackPut((int32_t)llround(nmea.lat*1e6), (int32_t)llround(nmea.lon*1e6));
      trkPtsMow++;
      // Distance counts accepted steps only. Summing every 1 Hz fix would add up the
      // receiver's noise and report a mower that travels while it sits idling.
      gpsSessionMeters += step; gpsTotalMeters += step;
      break;
    case ml::TOO_SLOW: trkRejSlow++;  break;
    case ml::POOR_FIX: trkRejHdop++;  break;
    case ml::SPIKE:    trkRejSpike++; break;
    default: break;
  }
}

// Drain whatever the UART holds. Never blocks. `recording` = engine confirmed hot.
void pumpGps(bool recording){
  while(GPS_SERIAL.available()){
    if(nmea.feed((char)GPS_SERIAL.read())){
      gotFixNow = true;
      gpsLat = (float)nmea.lat; gpsLon = (float)nmea.lon;
      if(recording){ runFixes++; considerTrackPoint(); }
    }
  }
}

// Parked, about to post: listen long enough to report where the mower is sitting.
void readFixForDisplay(){
  unsigned long start = millis();
  while(!gotFixNow && millis()-start < GPS_READ_MS){ pumpGps(false); delay(5); }
}

// ---- Track store -------------------------------------------------------------------
bool fsMount(){
  if(fsMounted) return true;
  const esp_partition_t* p = esp_partition_find_first(ESP_PARTITION_TYPE_DATA,
                                                      ESP_PARTITION_SUBTYPE_DATA_SPIFFS, NULL);
  if(!p){ fsState = FS_NO_PARTITION; return false; }
  fsPartKb = p->size / 1024;
  // formatOnFail = true: first use on this board formats the partition. Nothing has ever
  // used it, and a mount failure must never stop the hour meter.
  fsMounted = LittleFS.begin(true, "/littlefs", 3, p->label);
  if(!fsMounted){
    // The records counted so far are in a file that can no longer be read. Writing them off
    // keeps the RTC fallback from reading those positions out of its own array.
    fsState = FS_MOUNT_FAILED;
    trkDropped += trkRecs;
    trkRecs = 0; trkBufN = 0;
    return false;
  }
  fsState = FS_OK;
  return true;
}

void trackClear(){
  if(fsState == FS_OK && fsMount() && LittleFS.exists(TRK_PATH)) LittleFS.remove(TRK_PATH);
  trkRecs = 0; trkBufN = 0;
}

// Cold boot only: RTC is gone, so rebuild the count from the file. A mow cut off by a reset
// keeps its track this way, which is the reason it is in a file at all.
void trackRecover(){
  trkRecs = 0; trkDropped = 0; trkFails = 0;
  fsState = FS_UNKNOWN; fsPartKb = 0;
  if(!fsMount()) return;
  if(LittleFS.exists(TRK_PATH)){
    File f = LittleFS.open(TRK_PATH, "r");
    size_t bytes = 0;
    if(f){ bytes = f.size(); f.close(); }
    if(bytes % sizeof(TrkRec)){
      // LittleFS commits on close, so this should not happen. If it ever does, appending
      // after a torn record would shift every later point into nonsense. Hours are not in
      // this file; losing the track is the cheap side of that trade.
      Serial.printf("track file misaligned (%u bytes): discarding\n", (unsigned)bytes);
      trkDropped += bytes / sizeof(TrkRec);
      LittleFS.remove(TRK_PATH);
    } else {
      trkRecs = bytes / sizeof(TrkRec);
    }
  }
  Serial.printf("track file: %lu records, partition %lu KB\n",
                (unsigned long)trkRecs, (unsigned long)fsPartKb);
}

void trackFlush(){
  trkLastFlushMs = millis();
  if(fsState != FS_OK || trkBufN == 0) return;
  size_t want = trkBufN * sizeof(TrkRec), wrote = 0;
  if(fsMount()){
    File f = LittleFS.open(TRK_PATH, "a");
    if(f){ wrote = f.write((const uint8_t*)trkBuf, want); f.close(); }
  }
  trkRecs += wrote / sizeof(TrkRec);
  if(wrote != want){
    trkDropped += (want - wrote) / sizeof(TrkRec);
    Serial.printf("track: flash write short, %u of %u bytes\n", (unsigned)wrote, (unsigned)want);
  }
  trkBufN = 0;
}

void trackPut(int32_t a, int32_t b){
  if(fsState == FS_OK){
    if(trkRecs + trkBufN >= TRK_FILE_MAX){ trkDropped++; return; }
    trkBuf[trkBufN].a = a; trkBuf[trkBufN].b = b; trkBufN++;
    if(trkBufN >= TRK_BUF_N) trackFlush();
  } else {
    if(trkRecs >= (uint32_t)RTC_TRK_MAX){ trkDropped++; return; }
    rtcTrk[trkRecs].a = a; rtcTrk[trkRecs].b = b; trkRecs++;
  }
}

void flushToFlash(){ prefs.begin("mower",false); prefs.putUInt("life",lifetimeSeconds); prefs.putFloat("gpsm",gpsTotalMeters); prefs.end(); secsSinceFlush=0; }
void loadFromFlash(){ prefs.begin("mower",true); lifetimeSeconds=prefs.getUInt("life",0); gpsTotalMeters=prefs.getFloat("gpsm",0); prefs.end(); }

// Live config + level reference, restored at every boot. Anything never pushed
// down keeps the compiled-in default, so a fresh board behaves exactly as before.
uint32_t coldReason = 0;
void loadConfig(){
  prefs.begin("mower", true);
  VIB_THRESHOLD     = prefs.getFloat("vibthr",  VIB_THRESHOLD);
  IDLE_INTERVAL_S   = prefs.getInt  ("idles",   IDLE_INTERVAL_S);
  SAMPLE_INTERVAL_S = prefs.getInt  ("samps",   SAMPLE_INTERVAL_S);
  TRACK_MIN_STEP_M  = prefs.getFloat("trkstep", TRACK_MIN_STEP_M);
  TRACK_MIN_MPS     = prefs.getFloat("trkmps",  TRACK_MIN_MPS);
  TRACK_MAX_HDOP    = prefs.getFloat("trkhdop", TRACK_MAX_HDOP);
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
  bootCount  = prefs.getUInt("boots", 0);
  // Why the last COLD boot happened. esp_reset_reason() on its own is useless for this:
  // it reports the reason for THIS wake, which is "deep sleep" on all but one. 4,998 of
  // the 5,000 logged rows say 8, including the rows around the 11-03 mid-mow reset, whose
  // real cause was never recorded anywhere.
  coldReason = prefs.getUInt("coldrsn", 0);
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

// Pull a new firmware image. Deliberately the rarest path: routine tuning goes through
// the config channel. See "Self-rollback" near the top for what protects a bad image.
// The server's sha256 is not checked here: esp_ota_end() validates the image's own
// checksum, and HTTPUpdate honours an x-MD5 header if the file server sends one.
// A firmware .bin holds the WiFi password in plaintext, so it is only ever served on the LAN.
//
// 🔴 As far as the record shows this path has never been run on real hardware.
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
      if(jsonNum(resp,"track_min_mps",v))     { TRACK_MIN_MPS=v;          prefs.putFloat("trkmps",v); }
      if(jsonNum(resp,"track_max_hdop",v))    { TRACK_MAX_HDOP=v;         prefs.putFloat("trkhdop",v); }
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
    // return, so an ack written afterwards would never be written at all -- and
    // the box would be handed the same command again on the next upload.
    setPendingAck(id);
    lastCmdId = id;
    if(doWhat == "zero_tilt")         lastCmdOk = zeroTilt() ? 1 : 0;
    else if(doWhat == "clear_track")  { trackClear(); lastCmdOk=1; }
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
void captureCurrent(SfReading &r, bool mowEnded, bool mowCut){
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
  r.gpsLines     = nmea.lines;
  r.rpmPeak      = (int16_t)(rpmPeak+0.5f);
  r.rpmAvg       = (rpmCount>0)?(int16_t)(rpmSum/rpmCount+0.5f):0;
  r.rssi         = 0;                       // filled in once WiFi is actually up
  r.shocks       = shockCount;
  r.hasFix       = gotFixNow?1:0;           // THIS wake, not "ever"
  r.mpu          = mpuOK?1:0;
  r.engineRunning= 0;                       // the box only ever posts with the engine off
  r.mowEnded     = mowEnded?1:0;
  r.mowCut       = mowCut?1:0;
  r.mowId        = curMowId;
  r.startGapS    = startGapS;
  r.startCreditS = startCreditS;
  r.runSec       = runSecThisMow;
  r.runTicks     = runTicks;
  r.runNoRpm     = runNoRpm;
  r.runColdTicks = runColdTicks;
  r.runFixes     = runFixes;
  r.trkPts       = trkPtsMow;
  r.rejSlow      = trkRejSlow;
  r.rejHdop      = trkRejHdop;
  r.rejSpike     = trkRejSpike;
  r.battRunMin   = battRunMin;
  r.battRunMax   = battRunMax;
  r.battAtStart  = battAtStart;
}

int otaStateNow(){
  esp_ota_img_states_t st;
  const esp_partition_t* run = esp_ota_get_running_partition();
  if(!run || esp_ota_get_state_partition(run, &st) != ESP_OK) return -1;
  return (int)st;
}

// Build the upload body.
//   src  -- "mow_end" (this upload closes a mow), "heartbeat" (parked report), or
//           "buffered" (a replayed reading that failed to send earlier).
//   ageS -- seconds between when the reading was CAPTURED and now. 0 = live.
String buildJson(const SfReading &r, const char* src, bool mowEnded, uint32_t ageS, bool live){
  String b = String("{\"secret\":\"") + DEVICE_SECRET + "\"";
  b += ",\"source\":\"" + String(src) + "\"";
  b += ",\"engine_running\":" + String(r.engineRunning ? "true" : "false");
  if(mowEnded) b += ",\"mow_ended\":true";
  if(r.mowCut) b += ",\"mow_cut\":true";
  if(ageS > 0) b += ",\"age_s\":" + String((unsigned long)ageS);
  b += ",\"hours_seconds\":" + String((unsigned long)r.hoursSec);
  // Decimal engine hours. The app reads `hours`; it has never read hours_seconds,
  // so without this line the hour meter is fed nothing at all.
  b += ",\"hours\":" + String(r.hoursSec/3600.0f, 4);
  b += ",\"battery\":" + String(r.battery, 2);
  b += ",\"rpm_peak\":" + String((int)r.rpmPeak);
  b += ",\"rpm_avg\":" + String((int)r.rpmAvg);
  // Real JSON boolean, not 0/1 -- the server tests `has_fix !== false`, which a
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
  // These describe the BOX, not this reading, so they ride on every payload.
  b += ",\"fw\":\"" FW_VERSION "\"";
  b += ",\"cfg_rev\":" + String((unsigned long)cfgRev);
  b += ",\"sample_s\":" + String(SAMPLE_INTERVAL_S);
  b += ",\"idle_s\":" + String(IDLE_INTERVAL_S);
  b += ",\"wakes\":" + String((unsigned long)wakeCount);
  b += ",\"wake_s\":" + String((unsigned long)awakeSecLast);
  b += ",\"trk_pending\":" + String((unsigned long)trkRecs);
  if(trkDropped) b += ",\"trk_drop\":" + String((unsigned long)trkDropped);
  if(trkFails)   b += ",\"trk_fails\":" + String((unsigned long)trkFails);
  b += ",\"trk_store\":\"" + String(fsState == FS_OK ? "flash" : "rtc") + "\"";
  b += ",\"fs_state\":" + String((int)fsState);
  b += ",\"fs_part_kb\":" + String((unsigned long)fsPartKb);
  b += ",\"ota_state\":" + String(otaStateNow());
  if(!fwConfirmed) b += ",\"fw_trial_fails\":" + String((unsigned long)fwTrialFails);
  b += ",\"gps_bad\":" + String((unsigned long)nmea.bad);
  if(live && nmea.hdop >= 0) b += ",\"hdop\":" + String(nmea.hdop, 1);
  if(live && nmea.sats >= 0) b += ",\"sats\":" + String(nmea.sats);
  // This mow. Everything needed to judge the hour meter and the track from the log,
  // without anyone walking to the garage.
  // Only on the post that closes a mow: the server's heartbeat merge carries them forward,
  // and sending them every 15 min would add ~250 bytes to all 5,000 rows of the sensor log.
  if(mowEnded && r.mowId){
    b += ",\"mow_id\":"        + String((unsigned long)r.mowId);
    b += ",\"start_gap_s\":"   + String((unsigned long)r.startGapS);
    b += ",\"start_credit_s\":"+ String((unsigned long)r.startCreditS);
    b += ",\"run_s\":"         + String((unsigned long)r.runSec);
    b += ",\"run_ticks\":"     + String((unsigned long)r.runTicks);
    b += ",\"run_no_rpm\":"    + String((unsigned long)r.runNoRpm);
    b += ",\"run_cold\":"      + String((unsigned long)r.runColdTicks);
    b += ",\"run_fixes\":"     + String((unsigned long)r.runFixes);
    b += ",\"trk_pts\":"       + String((unsigned long)r.trkPts);
    b += ",\"rej_slow\":"      + String((unsigned long)r.rejSlow);
    b += ",\"rej_hdop\":"      + String((unsigned long)r.rejHdop);
    b += ",\"rej_spike\":"     + String((unsigned long)r.rejSpike);
  }
  // Battery WHILE THE ENGINE RAN. Nothing in the record has ever measured it.
  if(mowEnded && r.battRunMax > 0.0f){
    b += ",\"batt_run_min\":"  + String(r.battRunMin, 2);
    b += ",\"batt_run_max\":"  + String(r.battRunMax, 2);
    b += ",\"batt_at_start\":" + String(r.battAtStart, 2);
  }
  b += ",\"service_mode\":" + String(serviceMode ? "true" : "false");
  b += ",\"boot_count\":" + String((unsigned long)bootCount);
  b += ",\"reset_reason\":" + String((int)esp_reset_reason());
  b += ",\"cold_reason\":" + String((unsigned long)coldReason);
  b += ",\"i2c_errors\":" + String((unsigned long)i2cErrors);
  b += ",\"mpu_reinits\":" + String((unsigned long)mpuReinits);
  if(otaFails)   b += ",\"ota_fails\":" + String((unsigned long)otaFails);
  if(pendingAck) b += ",\"cmd_ack\":" + String((unsigned long)pendingAck);
  if(lastCmdId){
    b += ",\"last_cmd\":" + String((unsigned long)lastCmdId);
    b += ",\"last_cmd_ok\":" + String(lastCmdOk ? "true" : "false");
  }
  // Vibration across the whole window since the last upload -- this is what makes
  // VIB_THRESHOLD calibratable from one real mow instead of guessed.
  if(vibN){
    b += ",\"vib_max\":" + String(vibMax, 4);
    b += ",\"vib_avg\":" + String(vibSum / vibN, 4);
    b += ",\"vib_n\":" + String((unsigned long)vibN);
  }
  // Raw gravity vector, current reading only (a replayed one would carry today's
  // orientation, not the one it was captured at).
  if(live && r.mpu){
    b += ",\"ax\":" + String(gravX / ACCEL_LSB_PER_G, 4);
    b += ",\"ay\":" + String(gravY / ACCEL_LSB_PER_G, 4);
    b += ",\"az\":" + String(gravZ / ACCEL_LSB_PER_G, 4);
  }
  // Always empty from 1.5.0: the track travels as its own file, see uploadTrack().
  b += ",\"track\":[]}";
  return b;
}

bool postJson(const String &body){
  WiFiClientSecure client; client.setInsecure();
  HTTPClient http;
  if(!http.begin(client, ENDPOINT)) return false;
  http.addHeader("Content-Type","application/json");
  int code = http.POST(body);
  // The response was always being read and thrown away. Keeping it is what turns
  // every upload into a two-way exchange -- no extra connection, no extra radio
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

// Send the whole track file. One request, ahead of the mow_end post, so the server has the
// points in hand when that post arrives and can attach them in the same history write.
bool uploadTrack(){
  trackFlush();
  if(trkRecs == 0) return true;
  esp_task_wdt_reset();
  const size_t bytes = trkRecs * sizeof(TrkRec);
  WiFiClientSecure client; client.setInsecure();
  HTTPClient http;
  if(!http.begin(client, String(ENDPOINT) + "?track_file=1")){ trkFails++; return false; }
  http.setTimeout(20000);
  http.addHeader("Content-Type", "application/octet-stream");
  http.addHeader("X-Mower-Fw", FW_VERSION);
  int code = -1;
  if(fsState == FS_OK){
    File f;
    if(fsMount()) f = LittleFS.open(TRK_PATH, "r");
    if(!f){
      http.end();
      Serial.println("track: file unreadable, discarding");
      trkDropped += trkRecs;
      trackClear();
      return true;
    }
    code = http.sendRequest("POST", &f, bytes);
    f.close();
  } else {
    code = http.sendRequest("POST", (uint8_t*)rtcTrk, bytes);
  }
  String resp = http.getString();
  http.end();
  Serial.printf("  track: %u bytes, POST %d  resp=%s\n", (unsigned)bytes, code, resp.c_str());
  esp_task_wdt_reset();
  // Delete only on the server's own word that it has them. Anything else goes again.
  if(code == 200 && resp.indexOf("\"ok\":true") >= 0){ trackClear(); return true; }
  trkFails++;
  return false;
}

// A POST got through, so this image can be fixed remotely. End the trial.
void fwConfirm(){
  if(fwConfirmed) return;
  esp_ota_mark_app_valid_cancel_rollback();
  prefs.begin("mower", false);
  prefs.putString("fw_ok", FW_VERSION);
  prefs.putUInt("fw_try", 0);
  prefs.end();
  fwConfirmed = 1; fwTrialFails = 0;
  Serial.println("fw " FW_VERSION " confirmed: a POST got through");
}

// Count a failure against an image on trial. Enough of them and it goes back to the other
// slot. If there is no good image there, there is nowhere to go, so end the trial and run.
void fwTrialFail(){
  if(fwConfirmed) return;
  prefs.begin("mower", false);
  fwTrialFails = prefs.getUInt("fw_try", 0) + 1;
  prefs.putUInt("fw_try", fwTrialFails);
  prefs.end();
  Serial.printf("fw trial: failure %lu of %lu\n", (unsigned long)fwTrialFails, (unsigned long)FW_TRIAL_MAX);
  if(fwTrialFails < FW_TRIAL_MAX) return;
  const esp_partition_t* other = esp_ota_get_next_update_partition(NULL);
  prefs.begin("mower", false);
  prefs.putUInt("fw_try", 0);
  prefs.end();
  if(other && esp_ota_set_boot_partition(other) == ESP_OK){
    Serial.printf("fw trial failed: rolling back to %s\n", other->label);
    Serial.flush();
    ESP.restart();
  }
  Serial.println("fw trial failed but the other slot holds no good image: carrying on");
  prefs.begin("mower", false);
  prefs.putString("fw_ok", FW_VERSION);
  prefs.end();
  fwConfirmed = 1;
}

// Top of setup(). Cheap once confirmed: RTC remembers it between wakes.
void fwTrialAtBoot(bool cold){
  if(fwConfirmed) return;
  prefs.begin("mower", true);
  String ok = prefs.getString("fw_ok", "");
  fwTrialFails = prefs.getUInt("fw_try", 0);
  prefs.end();
  if(ok == FW_VERSION){ fwConfirmed = 1; esp_ota_mark_app_valid_cancel_rollback(); return; }
  if(cold) fwTrialFail();
}

bool uploadData(bool mowEnded, bool mowCut){
  SfReading cur; captureCurrent(cur, mowEnded, mowCut);

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
    sfPush(cur);                                  // hold it, don't lose it
    Serial.printf("buffered this reading (%u held)\n", (unsigned)sfCount);
    return false;
  }
  Serial.println("WiFi: connected OK");
  cur.rssi = (int16_t)WiFi.RSSI();

  // Track first: any mow_end below finds its points already on the server.
  if(trkRecs || trkBufN){
    uploadTrack();
    delay(FLUSH_GAP_MS);
  }

  // Flush the backlog OLDEST-FIRST, before the current reading, so the server
  // receives them in the order they actually happened.
  while(sfCount > 0){
    esp_task_wdt_reset();
    uint16_t idx = (sfHead + SF_MAX - sfCount) % SF_MAX;
    uint32_t age = uptimeS - sfBuf[idx].stampS;
    Serial.printf("flushing buffered reading (%lus old, %u left)\n",
                  (unsigned long)age, (unsigned)sfCount);
    // #267: the reading's OWN mow-end flag. A mow whose only upload failed is still a
    // mow when it finally gets through.
    if(!postJson(buildJson(sfBuf[idx], "buffered", sfBuf[idx].mowEnded != 0, age, false))) break;
    sfCount--;
    delay(FLUSH_GAP_MS);                   // see FLUSH_GAP_MS -- KV write-race window
  }

  esp_task_wdt_reset();
  const char* src = mowEnded ? "mow_end" : "heartbeat";
  uint32_t ackSent = pendingAck;
  bool ok = postJson(buildJson(cur, src, mowEnded, 0, true));
  if(!ok){
    sfPush(cur);
    Serial.printf("upload failed -- buffered (%u held)\n", (unsigned)sfCount);
  } else {
    fwConfirm();
    // The ack rode out with this payload, so retire it -- but only the exact id we
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
  const bool coldBoot = (rtcMagic != RTC_MAGIC);
  // First, before anything that could crash: if this image is on trial and keeps resetting,
  // this is what gets the box back to the image before it.
  fwTrialAtBoot(coldBoot);
  // Live config and the level reference come back before anything uses them --
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

  wakeCount++;

  Wire.begin(I2C_SDA,I2C_SCL);
  mpuInit(); delay(20);
  // A sensor that has gone quiet is the normal failure here -- the AD0 line came
  // loose once already and cost weeks of tilt data AND every engine hour, since
  // hour counting keys off vibration. One free retry per wake turns most of those
  // into a self-heal, and the counters make a marginal connection visible in the
  // data long before it fails outright.
  if(!mpuOK){
    i2cErrors++;
    Serial.println("MPU silent -- re-initialising");
    delay(50); mpuInit(); delay(20);
    if(mpuOK){ mpuReinits++; Serial.println("MPU recovered on retry"); }
    else       Serial.println("MPU still silent -- check the AD0/SDA/SCL wiring");
  }
  GPS_SERIAL.setRxBufferSize(GPS_RX_BUFFER);    // must come before begin()
  GPS_SERIAL.begin(GPS_BAUD, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  bool mowWasCut = false;
  if(coldBoot){
    rtcMagic = RTC_MAGIC;
    loadFromFlash();
    // Boot count lives in flash, not RTC, so it survives the power cut that RTC
    // memory does not -- which is exactly the event worth counting.
    coldReason = (uint32_t)esp_reset_reason();
    prefs.begin("mower", false);
    bootCount = prefs.getUInt("boots", 0) + 1;
    prefs.putUInt("boots", bootCount);
    prefs.putUInt("coldrsn", coldReason);
    mowWasCut = prefs.getBool("mowopen", false);
    curMowId  = prefs.getUInt("mowid", 0);
    prefs.end();
    Serial.printf("cold boot #%lu (reset reason %lu)%s\n", (unsigned long)bootCount,
                  (unsigned long)coldReason, mowWasCut ? " -- a mow was open" : "");
    vibMax=0; vibSum=0; vibN=0;
    lastCmdId=0; lastCmdOk=0;
    secsSinceFlush=0; msCarry=0; rpmPeak=0; rpmSum=0; rpmCount=0;
    gpsSessionMeters=0;
    runSecThisMow=0; runTicks=0; runNoRpm=0; runColdTicks=0; runFixes=0;
    trkPtsMow=0; trkRejSlow=0; trkRejHdop=0; trkRejSpike=0;
    battRunMin=0; battRunMax=0; battAtStart=0;
    startGapS=0; startCreditS=0; awakeSecLast=0; secsSincePost=0;
    // RTC RAM is undefined after a power cut -- zero the backlog explicitly so a
    // cold boot can't replay garbage as if it were real readings.
    sfHead=0; sfCount=0; uptimeS=0; wakeCount=1;
    trackRecover();
#if SF_BENCH_TEST
    testWakes=0;
#endif
  }

  if(CALIBRATION_MODE){
    while(true){
      esp_task_wdt_reset();
      float fs=captureSamples();
      RpmResult r=analyze(fs);
      Serial.print("vib(g)="); Serial.print(r.stdG,4);
      Serial.print("  Fs=");   Serial.print(fs,0);
      Serial.print("Hz  RPM=");
      if(r.valid) Serial.println(r.rpm,0); else Serial.println("--");
      delay(300);
    }
  }

  // ===== THE RUN LOOP ==================================================================
  // Parked, this runs exactly once: one MPU reading, no engine, straight on to sleep.
  // Engine running, the box stays in here with the radio off until 30 s after vibration
  // stops. Three things that changes from 1.4.0, which deep-slept 30 s between every read:
  //   Hours are real elapsed time from the crystal, not a flat 30 s per wake counted on the
  //   deep-sleep clock. (#269 measured the surviving rate error at 1.6-4.7%.)
  //   GPS is read every second, so 3 m of movement sets the point spacing instead of the
  //   sleep schedule (1.4.0 got one point per ~12 m, ~100 a mow).
  //   Power: the MPU loop runs off the battery the whole mow. Estimate ~16 mA at 12 V
  //   (~165 mW through the buck); NOT measured. batt_run_min/max in the payload show it.
  ml::RunMeter meter(STOP_HOLD_MS);
  uint32_t loopT0   = millis();
  bool     ranThisWake = false;
  bool     mowEnded    = false;
  bool     mowCut      = false;
  RpmResult r;

  for(;;){
    uint32_t tickT0 = millis();
    esp_task_wdt_reset();

    float fs = captureSamples();
    computeTilt();               // pitch/roll + shock -- before analyze() removes DC
    r = analyze(fs);
    lastMpuReadMs = millis();
    lastVib = r.stdG;
    if(r.stdG > vibMax) vibMax = r.stdG;
    vibSum += r.stdG; vibN++;

    const bool vibHot = (r.stdG >= VIB_THRESHOLD);
    const bool canRun = uprightNow && !serviceMode;
    ml::RunMeter::Event ev = meter.tick(millis(), vibHot, r.valid, canRun);

    if(ev == ml::RunMeter::STARTED){
      // Per-mow stats clear when the next mow STARTS, not when an upload succeeds.
      // Jeff, 2026-08-11: "even if the mower is off and just sitting in the garage
      // the sensors [should] still [be] reporting... showing their last reading."
      ranThisWake = true;
      rpmPeak=0; rpmSum=0; rpmCount=0;
      gpsSessionMeters=0;
      runTicks=0; runNoRpm=0; runColdTicks=0; runFixes=0;
      trkPtsMow=0; trkRejSlow=0; trkRejHdop=0; trkRejSpike=0;
      battAtStart = readBattery();
      battRunMin  = battAtStart;
      battRunMax  = battAtStart;
      // Credit the sleep this start happened inside: see startCreditS() in mower_logic.h.
      startCreditS = ml::startCreditS(startGapS, coldBoot);
      lifetimeSeconds += startCreditS;
      secsSinceFlush  += startCreditS;
      runSecThisMow    = startCreditS;
      // Flash: a new mow id, and the "a mow is open" flag a power cut will leave behind.
      prefs.begin("mower", false);
      curMowId = prefs.getUInt("mowid", 0) + 1;
      prefs.putUInt("mowid", curMowId);
      prefs.putBool("mowopen", true);
      prefs.end();
      trkGate.reset();
      trackPut(TRK_MARKER, (int32_t)curMowId);
      trackFlush();
      Serial.printf("MOW %lu START  slept %lus, credited %lus, batt=%.2fV\n",
                    (unsigned long)curMowId, (unsigned long)startGapS,
                    (unsigned long)startCreditS, battAtStart);
    }

    // The credit: real milliseconds, sub-second remainder carried so nothing rounds away.
    msCarry += meter.takeCreditMs();
    const uint32_t addS = msCarry / 1000;
    msCarry %= 1000;
    lifetimeSeconds += addS;
    secsSinceFlush  += addS;
    runSecThisMow   += addS;

    if(ev == ml::RunMeter::STOPPED){
      mowEnded = true;
      trackFlush();
      flushToFlash();
      prefs.begin("mower", false);
      prefs.putBool("mowopen", false);
      prefs.end();
      Serial.printf("MOW %lu END  %lus, %lu ticks, %lu fixes, %lu track points\n",
                    (unsigned long)curMowId, (unsigned long)runSecThisMow, (unsigned long)runTicks,
                    (unsigned long)runFixes, (unsigned long)trkPtsMow);
    }

    if(!meter.running()) break;       // engine off, or was never on

    runTicks++;
    if(!meter.hot()) runColdTicks++;
    else if(!r.valid) runNoRpm++;
    if(meter.hot() && r.valid){ if(r.rpm>rpmPeak) rpmPeak=r.rpm; rpmSum+=r.rpm; rpmCount++; }
    float bv = readBattery();
    if(bv > 0){
      if(battRunMin <= 0 || bv < battRunMin) battRunMin = bv;
      if(bv > battRunMax) battRunMax = bv;
    }
    if(secsSinceFlush >= (uint32_t)FLUSH_EVERY_S) flushToFlash();
    if(millis() - trkLastFlushMs >= TRK_FLUSH_MS) trackFlush();

    if((runTicks % 30) == 1){
      Serial.printf("vib=%.4f hot=%d Fs=%.0f life=%us mow=%lus fixes=%lu trk=%lu hdop=%.1f sats=%d bad=%lu\n",
                    r.stdG, meter.hot(), fs, lifetimeSeconds, (unsigned long)runSecThisMow,
                    (unsigned long)runFixes, (unsigned long)trkPtsMow, nmea.hdop, nmea.sats,
                    (unsigned long)nmea.bad);
    }

    // Fill the rest of the tick reading GPS. The UART buffer carried it through the capture.
    do { pumpGps(meter.hot()); delay(5); } while(millis() - tickT0 < RUN_TICK_MS);
  }
  // ===== end of the run loop -- from here down, the engine is OFF ========================

  // A mow was open when the power went, and the engine is off now: close it, so the hours
  // it banked don't wait for the next mow to be recorded. If the engine WAS running when
  // the box came back, that stretch closed normally above and the server merges the two.
  if(mowWasCut && !ranThisWake){
    mowEnded = true; mowCut = true;
    prefs.begin("mower", false);
    prefs.putBool("mowopen", false);
    prefs.end();
  }

  uint32_t awakeS = (millis() - loopT0 + 500) / 1000;
  awakeSecLast    = awakeS;
  uptimeS        += awakeS;
  secsSincePost  += awakeS;

  if(secsSinceFlush > 0) flushToFlash();

  // --- POST or stay quiet -------------------------------------------------------
  // The box wakes to SENSE every 30 s; the radio is what Jeff objected to on 10-13
  // ("it's running down my battery"), so posting keeps its slow cadence. Forced:
  //   mowEnded      the mow_end payload, which the app and the server both key on
  //   wakeCount<=1  a reflash or reset shows up immediately instead of in 15 minutes
  //   !fwConfirmed  an image on trial: see Self-rollback
  // A track upload that failed goes again with the next one of these.
  bool postDue = mowEnded || (wakeCount <= 1) || !fwConfirmed ||
                 (secsSincePost >= (uint32_t)IDLE_INTERVAL_S);

  if(postDue){
    readFixForDisplay();
    bool ok = uploadData(mowEnded, mowCut);
    Serial.println(ok ? "uploaded" : "no wifi / buffered");
    // Reset on the ATTEMPT, not on success: a box out of WiFi range must not retry
    // every 30 s -- that is exactly the radio drain this split exists to avoid. The
    // store-and-forward buffer already carries the reading forward with its real age_s.
    secsSincePost = 0;
    if(ok){
      vibMax=0; vibSum=0; vibN=0;           // these describe the window since upload
    } else {
      fwTrialFail();
    }
  }

  // --- Sleep -------------------------------------------------------------------------
  // Jeff's 30 s, always.
  int sleepSeconds = SAMPLE_INTERVAL_S;
  if(sleepSeconds < 10) sleepSeconds = 10;         // floor: never thrash

  // What the next start could have missed: the sleep, plus any upload since the last MPU read.
  startGapS      = (uint32_t)sleepSeconds + (millis() - lastMpuReadMs + 500) / 1000;
  uptimeS       += (uint32_t)sleepSeconds;
  secsSincePost += (uint32_t)sleepSeconds;

  // Layer 1 of Self-rollback: a bootloader with rollback rolls back an image still pending
  // verification at the next boot, and a deep-sleep wake is a boot. A WiFi blip during the
  // trial must not do that; layer 2 (the failure count) carries the trial from here.
  if(!fwConfirmed) esp_ota_mark_app_valid_cancel_rollback();

  esp_sleep_enable_timer_wakeup((uint64_t)sleepSeconds*1000000ULL);
  Serial.printf("sleeping %ds\n", sleepSeconds);
  Serial.flush();
  esp_deep_sleep_start();
}

void loop(){ /* never runs */ }
