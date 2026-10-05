from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx
import logging

from backend.config.settings import settings

logger = logging.getLogger(__name__)


class CafeClient(ABC):
    """Abstract interface for communicating with the Cafe Admin Dashboard / Backend."""

    @abstractmethod
    def get_customer(self, customer_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_booking(self, booking_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_cafe_information(self, cafe_id: str) -> Optional[Dict[str, Any]]:
        pass


class MockCafeClient(CafeClient):
    """
    Mock implementation for development and testing without requiring a running cafe backend.
    """

    def __init__(self):
        self.mock_customers = {
            "cust_101": {
                "id": "cust_101",
                "name": "Sarah Connor",
                "phone": "+15551234567",
                "email": "sarah@example.com",
                "tags": ["vip", "returning"],
                "total_orders": 8,
                "total_spent": 240.50
            },
            "cust_102": {
                "id": "cust_102",
                "name": "John Doe",
                "phone": "+15559876543",
                "email": "john@example.com",
                "tags": ["new"],
                "total_orders": 1,
                "total_spent": 18.00
            }
        }
        self.mock_bookings = {
            "bkg_901": {
                "id": "bkg_901",
                "cafe_id": settings.DEFAULT_CAFE_ID,
                "customer_name": "Sarah Connor",
                "customer_phone": "+15551234567",
                "date": "2026-10-01",
                "time": "19:00",
                "guests": 4,
                "status": "CONFIRMED"
            }
        }
        self.mock_orders = {
            "ord_301": {
                "id": "ord_301",
                "cafe_id": settings.DEFAULT_CAFE_ID,
                "customer_name": "Sarah Connor",
                "customer_phone": "+15551234567",
                "total_amount": "34.50",
                "status": "PREPARING",
                "items": ["Avocado Toast", "Flat White"]
            }
        }
        self.mock_cafe_info = {
            settings.DEFAULT_CAFE_ID: {
                "cafe_id": settings.DEFAULT_CAFE_ID,
                "name": settings.DEFAULT_CAFE_NAME,
                "address": "123 Coffee Lane, Suite A",
                "phone": "+15559990000",
                "opening_hours": "07:00 - 22:00 Daily"
            }
        }

    def get_customer(self, customer_id: str) -> Optional[Dict[str, Any]]:
        return self.mock_customers.get(customer_id)

    def get_booking(self, booking_id: str) -> Optional[Dict[str, Any]]:
        return self.mock_bookings.get(booking_id)

    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        return self.mock_orders.get(order_id)

    def get_cafe_information(self, cafe_id: str) -> Optional[Dict[str, Any]]:
        return self.mock_cafe_info.get(cafe_id, {
            "cafe_id": cafe_id,
            "name": settings.DEFAULT_CAFE_NAME,
            "phone": "+15559990000"
        })


class HttpCafeClient(CafeClient):
    """
    HTTP implementation calling the actual Cafe Admin Dashboard API endpoints.
    Used in production when MOCK_MODE=false.
    """

    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    def _headers(self) -> Dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["X-Cafe-API-Key"] = self.api_key
        return h

    def get_customer(self, customer_id: str) -> Optional[Dict[str, Any]]:
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(f"{self.base_url}/customers/{customer_id}", headers=self._headers())
                if res.is_success:
                    return res.json()
        except Exception as e:
            logger.error(f"Error fetching customer from Cafe API: {e}")
        return None

    def get_booking(self, booking_id: str) -> Optional[Dict[str, Any]]:
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(f"{self.base_url}/bookings/{booking_id}", headers=self._headers())
                if res.is_success:
                    return res.json()
        except Exception as e:
            logger.error(f"Error fetching booking from Cafe API: {e}")
        return None

    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(f"{self.base_url}/orders/{order_id}", headers=self._headers())
                if res.is_success:
                    return res.json()
        except Exception as e:
            logger.error(f"Error fetching order from Cafe API: {e}")
        return None

    def get_cafe_information(self, cafe_id: str) -> Optional[Dict[str, Any]]:
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(f"{self.base_url}/cafe/{cafe_id}", headers=self._headers())
                if res.is_success:
                    return res.json()
        except Exception as e:
            logger.error(f"Error fetching cafe info from Cafe API: {e}")
        return None


def get_cafe_client() -> CafeClient:
    """Factory returning MockCafeClient or HttpCafeClient based on settings."""
    if settings.MOCK_MODE:
        return MockCafeClient()
    return HttpCafeClient(base_url=settings.CAFE_API_BASE_URL, api_key=settings.CAFE_API_KEY)
