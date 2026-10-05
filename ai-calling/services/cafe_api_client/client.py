import httpx
import logging
from typing import Dict, Any, Optional, List
from backend.config.settings import get_settings
from database.mock_data.seeder import load_json_file

logger = logging.getLogger("cafe_api_client")


class CafeApiClient:
    """
    Client for interacting with the external Cafe Admin Dashboard / Management API.
    When USE_MOCK_CAFE_API=True or the remote service is unavailable, falls back gracefully to local mock data.
    """

    def __init__(self, base_url: Optional[str] = None, use_mock: Optional[bool] = None):
        settings = get_settings()
        self.base_url = base_url or settings.cafe_api_base_url
        self.use_mock = use_mock if use_mock is not None else settings.use_mock_cafe_api
        self.timeout = 5.0

    async def get_cafe_information(self) -> Dict[str, Any]:
        """Fetch cafe metadata (name, address, hours, policies, phone)."""
        if self.use_mock:
            return load_json_file("cafe_info.json")

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(f"{self.base_url}/cafe-info")
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch cafe info from {self.base_url}, falling back to mock: {e}")

        return load_json_file("cafe_info.json")

    async def get_menu(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch cafe menu items."""
        if self.use_mock:
            items = load_json_file("menu_items.json")
            if category:
                items = [i for i in items if category.lower() in i.get("category", "").lower()]
            return items

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                params = {"category": category} if category else {}
                res = await client.get(f"{self.base_url}/menu", params=params)
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"Failed to fetch menu from {self.base_url}, falling back to mock: {e}")

        items = load_json_file("menu_items.json")
        if category:
            items = [i for i in items if category.lower() in i.get("category", "").lower()]
        return items

    async def notify_booking_event(self, event_type: str, booking_data: Dict[str, Any]) -> bool:
        """Webhook / notification call to cafe management dashboard on booking events."""
        if self.use_mock:
            logger.info(f"[MOCK CAFE API] Webhook notification sent for {event_type}: Booking ID {booking_data.get('id')}")
            return True

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(f"{self.base_url}/webhooks/bookings", json={"event": event_type, "booking": booking_data})
                return res.status_code in (200, 201, 204)
        except Exception as e:
            logger.warning(f"Failed to send booking webhook to {self.base_url}: {e}")
            return False
