DOMAIN = "bhyve"
CONF_EMAIL = "email"
CONF_PASSWORD = "password"

API_BASES = [
    "https://api.orbitbhyve.com/v1",
    "https://api.orbitonline.com/v1",
]

HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "orbit-app-id": "Orbit Support Dashboard",
    "orbit-api-key": "1",
    "User-Agent": "bhyve/2.67 (iPhone; iOS 17; Scale/3.00)",
}

SCAN_INTERVAL_SECONDS = 60
DEFAULT_RUN_MINUTES = 10
