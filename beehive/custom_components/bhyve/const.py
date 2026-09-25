DOMAIN = "bhyve"
CONF_EMAIL = "email"
CONF_PASSWORD = "password"

API_BASES = [
    "https://api.orbitbhyve.com/v1",
    "https://api.orbitonline.com/v1",
]

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Orbit-Session-Token": "",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

SCAN_INTERVAL_SECONDS = 60
DEFAULT_RUN_MINUTES = 10
