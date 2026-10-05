from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from .base import AgentTool
from llm.base import ToolDefinition
from services.booking_service import BookingService
from services.customer_service import CustomerService
from services.menu_service import MenuService
from services.escalation_service import EscalationService
from database.mock_data.seeder import load_json_file


class ToolRegistry:
    """
    Registry that binds high-level tools to independent business logic services.
    Ensures that the LLM agent contains NO business logic directly.
    """

    def __init__(self, session: Session, call_id: Optional[str] = None):
        self.session = session
        self.call_id = call_id or "call-active"
        self.booking_service = BookingService(session)
        self.customer_service = CustomerService(session)
        self.menu_service = MenuService()
        self.escalation_service = EscalationService(session)
        self.cafe_info = load_json_file("cafe_info.json")

        self.tools: Dict[str, AgentTool] = {}
        self._register_tools()

    def _register_tools(self) -> None:
        # 1. check_table_availability
        self.tools["check_table_availability"] = AgentTool(
            name="check_table_availability",
            description="Check table availability for a specific date, time, and number of guests before confirming.",
            parameters={
                "type": "object",
                "properties": {
                    "booking_date": {
                        "type": "string",
                        "description": "Date in YYYY-MM-DD format (e.g. '2026-09-29').",
                    },
                    "booking_time": {
                        "type": "string",
                        "description": "Time in HH:MM format (e.g. '19:30').",
                    },
                    "party_size": {
                        "type": "integer",
                        "description": "Number of guests in the party.",
                    },
                },
                "required": ["booking_date", "booking_time", "party_size"],
            },
            executor=lambda booking_date, booking_time, party_size: self.booking_service.check_availability(
                booking_date, booking_time, party_size
            ),
        )

        # 2. create_booking
        self.tools["create_booking"] = AgentTool(
            name="create_booking",
            description="Create and confirm a table reservation. Never call this before verifying availability.",
            parameters={
                "type": "object",
                "properties": {
                    "customer_name": {"type": "string", "description": "Full name of the customer."},
                    "customer_phone": {"type": "string", "description": "Contact phone number of the customer."},
                    "booking_date": {"type": "string", "description": "Date in YYYY-MM-DD format."},
                    "booking_time": {"type": "string", "description": "Time in HH:MM format."},
                    "guests_count": {"type": "integer", "description": "Total number of guests."},
                    "special_requests": {"type": "string", "description": "Optional dietary or seating requests."},
                    "table_id": {"type": "string", "description": "Optional specific table ID."},
                },
                "required": ["customer_name", "customer_phone", "booking_date", "booking_time", "guests_count"],
            },
            executor=lambda **kwargs: self.booking_service.create_booking(**kwargs),
        )

        # 3. modify_booking
        self.tools["modify_booking"] = AgentTool(
            name="modify_booking",
            description="Modify an existing table booking with a new date, time, or guest count.",
            parameters={
                "type": "object",
                "properties": {
                    "booking_id": {"type": "string", "description": "Existing booking ID (e.g. 'BKG-9901')."},
                    "new_date": {"type": "string", "description": "Optional new date (YYYY-MM-DD)."},
                    "new_time": {"type": "string", "description": "Optional new time (HH:MM)."},
                    "new_guests_count": {"type": "integer", "description": "Optional new guest count."},
                    "special_requests": {"type": "string", "description": "Optional new special requests."},
                },
                "required": ["booking_id"],
            },
            executor=lambda **kwargs: self.booking_service.modify_booking(**kwargs),
        )

        # 4. cancel_booking
        self.tools["cancel_booking"] = AgentTool(
            name="cancel_booking",
            description="Cancel an existing table reservation per cafe cancellation policy.",
            parameters={
                "type": "object",
                "properties": {
                    "booking_id": {"type": "string", "description": "Booking ID to cancel (e.g. 'BKG-9901')."},
                    "reason": {"type": "string", "description": "Reason for cancellation."},
                },
                "required": ["booking_id"],
            },
            executor=lambda booking_id, reason=None: self.booking_service.cancel_booking(booking_id, reason),
        )

        # 5. get_menu
        self.tools["get_menu"] = AgentTool(
            name="get_menu",
            description="Query the cafe menu, items, prices, and dietary categories (vegetarian, vegan, gluten-free).",
            parameters={
                "type": "object",
                "properties": {
                    "category": {"type": "string", "description": "Optional category (e.g. 'Pasta', 'Pizza', 'Coffee', 'Desserts')."},
                    "query": {"type": "string", "description": "Optional search term (e.g. 'truffle', 'sea bass', 'salad')."},
                    "dietary": {"type": "string", "description": "Optional dietary filter ('vegetarian', 'vegan', 'gluten-free')."},
                },
            },
            executor=lambda category=None, query=None, dietary=None: {
                "menu_summary": self.menu_service.get_concise_menu_summary(query, category, dietary),
                "items": self.menu_service.search_items(query, category)[:5],
            },
        )

        # 6. get_business_hours
        self.tools["get_business_hours"] = AgentTool(
            name="get_business_hours",
            description="Retrieve operating hours for the cafe on any day of the week.",
            parameters={
                "type": "object",
                "properties": {
                    "day": {"type": "string", "description": "Day of the week (e.g. 'Monday', 'Friday', 'today')."},
                },
            },
            executor=self._get_business_hours_executor,
        )

        # 7. get_cafe_information
        self.tools["get_cafe_information"] = AgentTool(
            name="get_cafe_information",
            description="Retrieve cafe address, location, directions, parking, services, or policies.",
            parameters={
                "type": "object",
                "properties": {
                    "topic": {"type": "string", "description": "Topic of inquiry: 'address', 'parking', 'policy', or 'general'."},
                },
            },
            executor=self._get_cafe_information_executor,
        )

        # 8. transfer_to_human
        self.tools["transfer_to_human"] = AgentTool(
            name="transfer_to_human",
            description="Escalate and transfer the live phone call to human staff or manager.",
            parameters={
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "Reason for escalation (e.g. customer request, complaint)."},
                },
                "required": ["reason"],
            },
            executor=lambda reason: self.escalation_service.transfer_to_human(self.call_id, reason),
        )

        # 9. create_customer
        self.tools["create_customer"] = AgentTool(
            name="create_customer",
            description="Create or update customer record with contact info and dining preferences.",
            parameters={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Customer full name."},
                    "phone": {"type": "string", "description": "Customer phone number."},
                    "email": {"type": "string", "description": "Customer email."},
                    "notes": {"type": "string", "description": "Special preferences or notes."},
                },
                "required": ["name", "phone"],
            },
            executor=lambda name, phone, email=None, notes=None: {
                "success": True,
                "customer_id": self.customer_service.create_or_update_customer(name, phone, email, notes).id,
                "message": f"Customer profile updated for {name}.",
            },
        )

        # 10. get_customer_history
        self.tools["get_customer_history"] = AgentTool(
            name="get_customer_history",
            description="Look up past reservations and preferences for a customer by phone number.",
            parameters={
                "type": "object",
                "properties": {
                    "phone": {"type": "string", "description": "Customer phone number to lookup."},
                },
                "required": ["phone"],
            },
            executor=lambda phone: self.customer_service.get_customer_history(phone),
        )

    def _sync_cafe_info(self):
        try:
            import urllib.request, json
            req = urllib.request.Request("http://localhost:4000/api/cafe", headers={"User-Agent": "AI-Calling"})
            with urllib.request.urlopen(req, timeout=0.8) as resp:
                if resp.status == 200:
                    cdata = json.loads(resp.read().decode('utf-8'))
                    if "name" in cdata:
                        self.cafe_info["name"] = cdata["name"]
                    if "phone" in cdata:
                        self.cafe_info["phone"] = cdata["phone"]
                    if "address" in cdata:
                        if isinstance(self.cafe_info.get("address"), dict):
                            self.cafe_info["address"]["street"] = cdata["address"]
                        else:
                            self.cafe_info["address"] = {"street": cdata["address"], "neighborhood": "Indiranagar"}
                    if "hours" in cdata and isinstance(cdata["hours"], list):
                        for h in cdata["hours"]:
                            dname = h.get("day", "").lower()
                            if "open" in h and "close" in h:
                                self.cafe_info["business_hours"][dname] = f"{h['open']} - {h['close']}"
        except Exception:
            pass

    def _get_business_hours_executor(self, day: Optional[str] = None) -> Dict[str, Any]:
        self._sync_cafe_info()
        hours_map = self.cafe_info["business_hours"]
        if day and day.lower() != "today":
            day_clean = day.lower().strip()
            hours = hours_map.get(day_clean)
            if hours:
                return {"hours_summary": f"On {day.capitalize()}, we are open from {hours}."}
        # Summary for the week
        mon_thu = hours_map.get("monday", "08:00 - 22:00")
        fri_sat = hours_map.get("friday", "08:00 - 23:00")
        sun = hours_map.get("sunday", "09:00 - 21:00")
        summary = f"Monday through Thursday {mon_thu}, Friday & Saturday {fri_sat}, and Sunday {sun}."
        return {"hours_summary": summary, "all_hours": hours_map}

    def _get_cafe_information_executor(self, topic: Optional[str] = "general") -> Dict[str, Any]:
        self._sync_cafe_info()
        topic_lower = (topic or "general").lower()
        addr = self.cafe_info.get("address", {})
        street = addr.get("street", "Indiranagar") if isinstance(addr, dict) else str(addr)
        neigh = addr.get("neighborhood", "") if isinstance(addr, dict) else ""
        address_str = f"{street} {neigh}".strip()
        cafe_name = self.cafe_info.get("name", "Brew & Co")

        if "park" in topic_lower:
            return {"info_summary": f"{self.cafe_info.get('parking_info', 'Street and valet parking available.')}"}
        elif "address" in topic_lower or "location" in topic_lower:
            return {"info_summary": f"We are located at {address_str}."}
        elif "policy" in topic_lower or "cancel" in topic_lower:
            return {"info_summary": f"{self.cafe_info.get('cancellation_policy', 'Cancellations accepted up to 2 hours in advance.')}"}
        else:
            return {
                "info_summary": f"{cafe_name} is located at {address_str}. {self.cafe_info.get('parking_info', '')}"
            }

    def get_definitions(self) -> List[ToolDefinition]:
        return [tool.to_tool_definition() for tool in self.tools.values()]

    def execute_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        if name not in self.tools:
            return {"error": f"Tool '{name}' not found."}
        tool = self.tools[name]
        try:
            return tool.execute(**arguments)
        except Exception as e:
            return {"error": f"Tool execution failed: {str(e)}"}
