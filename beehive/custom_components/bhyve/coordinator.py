"""B-Hyve data coordinator — handles login and polling from HA's home IP."""
import asyncio
import json
import logging
from datetime import timedelta

import aiohttp

from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import API_BASES, DOMAIN, HEADERS, SCAN_INTERVAL_SECONDS

_LOGGER = logging.getLogger(__name__)

# Try additional app IDs in case the primary one is rejected
_APP_IDS = [
    "Orbit Support Dashboard",
    "com.orbitbhyve.ios",
    "com.orbit.orbitbhyve",
]


async def bhyve_login(session: aiohttp.ClientSession, email: str, password: str):
    """Try each known B-Hyve API base + app ID until login succeeds."""
    attempts = []
    for base in API_BASES:
        for app_id in _APP_IDS:
            hdrs = {**HEADERS, "orbit-app-id": app_id}
            try:
                async with session.post(
                    f"{base}/session",
                    headers=hdrs,
                    json={"session": {"email": email, "password": password}},
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as r:
                    body = await r.text()
                    if r.status == 200:
                        _LOGGER.info("B-Hyve login attempt %s [%s]: HTTP 200 — %s", base, app_id, body[:300])
                    else:
                        _LOGGER.warning("B-Hyve login attempt %s [%s]: HTTP %s — %s", base, app_id, r.status, body[:300])
                    if r.status == 200:
                        try:
                            data = json.loads(body)
                        except Exception:
                            attempts.append(f"{base}: 200 but not JSON")
                            continue
                        # Accept any field name for the session token
                        token = (
                            data.get("orbit_session_token")
                            or data.get("token")
                            or data.get("session_token")
                            or data.get("access_token")
                        )
                        user_id = (
                            data.get("user_id")
                            or data.get("id")
                            or data.get("userId")
                        )
                        if token and user_id:
                            _LOGGER.info("B-Hyve login OK via %s", base)
                            return token, user_id, base
                        attempts.append(f"{base}: 200 but missing token/user_id — keys: {list(data.keys())}")
                    else:
                        attempts.append(f"{base}: HTTP {r.status} — {body[:80]}")
            except Exception as e:
                attempts.append(f"{base}: network error — {e}")

    detail = " | ".join(attempts)
    _LOGGER.error("B-Hyve login failed — %s", detail)
    raise UpdateFailed(f"B-Hyve login failed — {detail}")



class BhyveCoordinator(DataUpdateCoordinator):
    """Polls B-Hyve every 60 seconds and stores device + zone data."""

    def __init__(self, hass, email: str, password: str):
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=SCAN_INTERVAL_SECONDS),
        )
        self.email = email
        self.password = password
        self._token = None
        self._base = None

    async def _async_update_data(self):
        async with aiohttp.ClientSession() as session:
            # Re-login if no token yet
            if not self._token:
                self._token, self._user_id, self._base = await bhyve_login(
                    session, self.email, self.password
                )

            dev_headers = {**HEADERS, "orbit-session-token": self._token}
            dev_headers.pop("Content-Type", None)

            try:
                async with session.get(
                    f"{self._base}/devices?user_id={self._user_id}",
                    headers=dev_headers,
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as r:
                    if r.status == 401:
                        # Token expired — re-login next cycle
                        self._token = None
                        raise UpdateFailed("Session expired — will re-login next cycle")
                    if not r.status == 200:
                        raise UpdateFailed(f"Devices fetch failed: HTTP {r.status}")
                    devices = await r.json()
            except UpdateFailed:
                raise
            except Exception as e:
                self._token = None
                raise UpdateFailed(f"B-Hyve fetch error: {e}")

            timer = next(
                (
                    d
                    for d in (devices or [])
                    if d.get("type") in ("bhyve_timer", "sprinkler_timer")
                    or (isinstance(d.get("zones"), list) and len(d["zones"]) > 0)
                ),
                None,
            )
            if not timer:
                raise UpdateFailed("No B-Hyve timer device found in account")

            status = timer.get("status") or {}
            watering = status.get("watering_status") or {}
            active_stations = watering.get("stations") or []
            active_zone = active_stations[0]["station"] if active_stations else None

            return {
                "device": timer,
                "token": self._token,
                "base": self._base,
                "active_zone": active_zone,
                "zones": [
                    {
                        "station": z["station"],
                        "name": z.get("name") or f"Zone {z['station']}",
                        "smart": bool(z.get("smart_watering_enabled")),
                    }
                    for z in (timer.get("zones") or [])
                ],
                "run_mode": status.get("run_mode", "auto"),
                "rain_delay": status.get("rain_delay", 0),
                "connected": bool(
                    timer.get("is_connected")
                    or timer.get("connected")
                    or status.get("is_connected")
                    or status.get("connected")
                    or timer.get("hardware_version")
                ),
            }

    async def send_ws_command(self, message: dict):
        """Send a command to the B-Hyve controller over WebSocket."""
        if not self._token or not self._base:
            raise Exception("Not authenticated")

        ws_headers = {
            "orbit-session-token": self._token,
            "orbit-app-id": HEADERS["orbit-app-id"],
            "orbit-api-key": HEADERS["orbit-api-key"],
        }
        ws_url = self._base.replace("https://", "wss://").replace("http://", "ws://") + "/events"

        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(
                ws_url, headers=ws_headers, timeout=aiohttp.ClientTimeout(total=12)
            ) as ws:
                # Authenticate first
                await ws.send_json({"event": "app_connection", "orbit_session_token": self._token})
                async for msg in ws:
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        if data.get("event") in ("app_connection", "connected"):
                            await ws.send_json(message)
                        elif data.get("event") in (
                            "watering_in_progress", "change_mode",
                            "program_changed", "rain_delay",
                        ):
                            return True
                        elif data.get("event") == "error":
                            raise Exception(data.get("message", "ws_error"))
                    elif msg.type in (aiohttp.WSMsgType.ERROR, aiohttp.WSMsgType.CLOSED):
                        break
        return False
