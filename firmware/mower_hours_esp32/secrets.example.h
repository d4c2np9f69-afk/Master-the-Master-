// Template for secrets.h — copy this to secrets.h and fill in real values.
// secrets.h is gitignored because THIS REPO IS PUBLIC.
//
// Also worth knowing: these strings end up in the compiled .bin as plaintext
// (verified by grepping a real build, 2026-08-11). So a firmware image must
// never be served from a public URL either — OTA delivery has to be
// authenticated. Splitting the source does not solve that; it is a separate
// hosting problem.
#pragma once

#define HCC_WIFI_SSID     "your-wifi-ssid"
#define HCC_WIFI_PASS     "your-wifi-password"
#define HCC_DEVICE_SECRET "your-device-secret"
