"""Config flow — shows email/password form in HA Settings → Integrations."""
import aiohttp
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant

from .const import CONF_EMAIL, CONF_PASSWORD, DOMAIN
from .coordinator import bhyve_login

STEP_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_EMAIL): str,
        vol.Required(CONF_PASSWORD): str,
    }
)


_last_login_error: str = ""


async def _validate_credentials(hass: HomeAssistant, email: str, password: str) -> str | None:
    """Return None on success, error key string on failure."""
    global _last_login_error
    try:
        async with aiohttp.ClientSession() as session:
            await bhyve_login(session, email, password)
        _last_login_error = ""
        return None
    except Exception as e:
        _last_login_error = str(e)
        return "invalid_auth"


class BhyveConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            error = await _validate_credentials(
                self.hass, user_input[CONF_EMAIL], user_input[CONF_PASSWORD]
            )
            if error is None:
                return self.async_create_entry(
                    title=f"B-Hyve ({user_input[CONF_EMAIL]})",
                    data=user_input,
                )
            errors["base"] = error

        description_placeholders = {
            "error_detail": ("\n\n⚠️ Detail: " + _last_login_error[:300]) if _last_login_error else ""
        }
        return self.async_show_form(
            step_id="user",
            data_schema=STEP_SCHEMA,
            errors=errors,
            description_placeholders=description_placeholders,
        )
