"""B-Hyve zone switches — one per irrigation zone."""
import logging

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DEFAULT_RUN_MINUTES, DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
):
    coordinator = hass.data[DOMAIN][entry.entry_id]
    await coordinator.async_config_entry_first_refresh()

    entities = [
        BhyveZoneSwitch(coordinator, zone)
        for zone in (coordinator.data or {}).get("zones", [])
    ]
    async_add_entities(entities, update_before_add=True)


class BhyveZoneSwitch(CoordinatorEntity, SwitchEntity):
    """A single B-Hyve irrigation zone."""

    def __init__(self, coordinator, zone: dict):
        super().__init__(coordinator)
        self._station = zone["station"]
        self._zone_name = zone["name"]
        self._attr_name = zone["name"]
        self._attr_unique_id = f"bhyve_zone_{self._station}"
        self._attr_icon = "mdi:sprinkler"

    @property
    def is_on(self) -> bool:
        data = self.coordinator.data or {}
        return data.get("active_zone") == self._station

    @property
    def extra_state_attributes(self):
        data = self.coordinator.data or {}
        return {
            "station": self._station,
            "zone_name": self._zone_name,
            "run_mode": data.get("run_mode"),
            "rain_delay": data.get("rain_delay"),
            "connected": data.get("connected"),
            "is_watering": self.is_on,
        }

    async def async_turn_on(self, **kwargs):
        data = self.coordinator.data or {}
        timer = data.get("device") or {}
        run_time = DEFAULT_RUN_MINUTES * 60
        await self.coordinator.send_ws_command(
            {
                "event": "change_mode",
                "device_id": timer.get("id"),
                "mode": "manual",
                "stations": [{"station": self._station, "run_time": run_time}],
            }
        )
        await self.coordinator.async_request_refresh()

    async def async_turn_off(self, **kwargs):
        data = self.coordinator.data or {}
        timer = data.get("device") or {}
        await self.coordinator.send_ws_command(
            {
                "event": "change_mode",
                "device_id": timer.get("id"),
                "mode": "auto",
                "stations": [],
            }
        )
        await self.coordinator.async_request_refresh()
