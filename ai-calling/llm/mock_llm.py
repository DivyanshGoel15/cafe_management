import re
import uuid
import json
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from .base import LLMProvider, LLMMessage, ToolDefinition, LLMResponse, ToolCall


class MockLLMProvider(LLMProvider):
    """
    Intelligent rule-based Mock LLM provider that emulates function-calling
    and natural conversation without requiring external paid API keys.
    """

    KNOWN_DISH_KEYWORDS = [
        "pasta", "fettuccine", "pizza", "margherita", "diavola", "burrata",
        "calamari", "salad", "quinoa", "lamb", "chops", "sea bass", "fish",
        "tiramisu", "panna cotta", "dessert", "coffee", "latte", "espresso"
    ]

    def generate(
        self,
        messages: List[LLMMessage],
        tools: Optional[List[ToolDefinition]] = None,
        temperature: float = 0.3,
    ) -> LLMResponse:
        if not messages:
            return LLMResponse(content="Hello! Welcome to Bella Vista Bistro. How may I assist you today?")

        last_message = messages[-1]

        # 1. If previous message was a TOOL result, summarize/report tool outcome
        if last_message.role == "tool":
            return self._handle_tool_result_response(last_message)

        user_text = last_message.content or ""
        text_lower = user_text.lower().strip()

        # Check conversation history to aggregate context (date, time, party_size, name, phone)
        history_text = " ".join([m.content or "" for m in messages if m.role in ("user", "assistant")])

        # 2. Check for human escalation trigger
        if any(h in text_lower for h in ["human", "representative", "operator", "manager", "supervisor", "speak to a person", "agent"]):
            if self._has_tool("transfer_to_human", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="transfer_to_human",
                            arguments={"reason": "Customer requested human manager"},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 3. Check for cancellation intent
        if "cancel" in text_lower:
            bkg_match = re.search(r"BKG-[A-Z0-9]+", user_text, re.IGNORECASE)
            bkg_id = bkg_match.group(0).upper() if bkg_match else "BKG-9901"
            if self._has_tool("cancel_booking", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="cancel_booking",
                            arguments={"booking_id": bkg_id, "reason": "Customer called to cancel reservation"},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 4. Check for modification intent
        if "modify" in text_lower or "reschedule" in text_lower or "change my booking" in text_lower:
            bkg_match = re.search(r"BKG-[A-Z0-9]+", user_text, re.IGNORECASE)
            bkg_id = bkg_match.group(0).upper() if bkg_match else "BKG-9901"
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            time_match = self._extract_time(user_text) or "20:00"
            if self._has_tool("modify_booking", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="modify_booking",
                            arguments={"booking_id": bkg_id, "new_date": tomorrow, "new_time": time_match},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 5. Check for customer history lookup
        if "my history" in text_lower or "my past bookings" in text_lower or "my reservations" in text_lower:
            phone_match = re.search(r"\+?\d[\d\s-]{7,}\d", user_text)
            phone = phone_match.group(0) if phone_match else "+15551234567"
            if self._has_tool("get_customer_history", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="get_customer_history",
                            arguments={"phone": phone},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 6. Check for hours
        if any(w in text_lower for w in ["hours", "opening hours", "when are you open", "closing time"]):
            day = None
            for d in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
                if d in text_lower:
                    day = d
                    break
            if self._has_tool("get_business_hours", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="get_business_hours",
                            arguments={"day": day} if day else {},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 7. Check for cafe info / address / parking
        if any(w in text_lower for w in ["where are you", "location", "address", "parking", "park", "directions", "policy"]):
            topic = "parking" if "park" in text_lower else "address" if "address" in text_lower or "location" in text_lower or "where" in text_lower else "general"
            if self._has_tool("get_cafe_information", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="get_cafe_information",
                            arguments={"topic": topic},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 8. Check for menu / dietary items
        if any(w in text_lower for w in ["menu", "food", "dish", "dishes", "vegetarian", "vegan", "gluten", "pasta", "pizza", "coffee", "dessert", "price"]):
            dietary = None
            if "vegetarian" in text_lower or "veg" in text_lower:
                dietary = "vegetarian"
            if "vegan" in text_lower:
                dietary = "vegan"
            if "gluten" in text_lower or "gf" in text_lower:
                dietary = "gluten-free"

            # Check if specific dish keyword is present
            specific_dish = None
            for dish in self.KNOWN_DISH_KEYWORDS:
                if dish in text_lower:
                    specific_dish = dish
                    break

            if self._has_tool("get_menu", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="get_menu",
                            arguments={"dietary": dietary, "query": specific_dish},
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 9. Check if customer is confirming a previously discussed booking
        is_confirmation = any(w in text_lower for w in [
            "confirm", "please confirm", "that works", "sounds good", "perfect",
            "yes", "sure", "book it", "go ahead"
        ])

        if is_confirmation and any(w in history_text.lower() for w in ["book", "reserve", "available", "table", "pm", "am", "guests"]):
            date_val = self._extract_date(history_text) or self._extract_date(user_text) or (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            time_val = self._extract_time(history_text) or self._extract_time(user_text) or "19:00"
            party_val = self._extract_party_size(history_text) or self._extract_party_size(user_text) or 2
            name = self._extract_name(user_text) or self._extract_name(history_text) or "Sarah Connor"
            phone = self._extract_phone(user_text) or self._extract_phone(history_text) or "+15551234567"

            if self._has_tool("create_booking", tools):
                return LLMResponse(
                    tool_calls=[
                        ToolCall(
                            id=f"call_{uuid.uuid4().hex[:8]}",
                            name="create_booking",
                            arguments={
                                "customer_name": name,
                                "customer_phone": phone,
                                "booking_date": date_val,
                                "booking_time": time_val,
                                "guests_count": party_val,
                            },
                        )
                    ],
                    finish_reason="tool_calls",
                )

        # 10. Booking creation / availability checking flow
        if any(w in text_lower for w in ["book", "reserve", "table", "reservation"]):
            date_val = self._extract_date(user_text) or self._extract_date(history_text)
            time_val = self._extract_time(user_text) or self._extract_time(history_text)
            party_size = self._extract_party_size(user_text) or self._extract_party_size(history_text)

            # If date and time and party size exist -> Check availability first!
            if date_val and time_val and party_size:
                if self._has_tool("check_table_availability", tools):
                    return LLMResponse(
                        tool_calls=[
                            ToolCall(
                                id=f"call_{uuid.uuid4().hex[:8]}",
                                name="check_table_availability",
                                arguments={
                                    "booking_date": date_val,
                                    "booking_time": time_val,
                                    "party_size": party_size,
                                },
                            )
                        ],
                        finish_reason="tool_calls",
                    )

            # Missing some booking details -> ask concisely
            if not date_val and not time_val:
                return LLMResponse(content="I would be happy to book a table for you! What date, time, and how many guests?")
            elif not time_val:
                return LLMResponse(content="Understood. What time would you like to arrive, and for how many people?")
            elif not party_size:
                return LLMResponse(content="Great. How many guests will be joining your party?")

        # 11. Handle questions outside scope or unknown
        if any(w in text_lower for w in ["weather", "mars", "stock", "quantum", "flying car", "crypto"]):
            return LLMResponse(
                content="I don't have that information, as I am dedicated to cafe reservations and dining questions. Would you like me to connect you with our staff?",
            )

        # Default conversational reply
        return LLMResponse(
            content="Thank you for calling Bella Vista Bistro. How can I assist you with reservations, our menu, or dining information today?"
        )

    def _has_tool(self, tool_name: str, tools: Optional[List[ToolDefinition]]) -> bool:
        if not tools:
            return False
        return any(t.name == tool_name for t in tools)

    def _handle_tool_result_response(self, tool_message: LLMMessage) -> LLMResponse:
        try:
            data = json.loads(tool_message.content or "{}")
        except Exception:
            return LLMResponse(content="Thank you for your patience. I have processed that request.")

        # Availability response
        if "is_available" in data:
            if data["is_available"]:
                return LLMResponse(
                    content=f"{data['message']} Shall I confirm this reservation for you under your name?"
                )
            else:
                return LLMResponse(
                    content=f"{data['message']} Would you like to check a different time or date?"
                )

        # Booking creation response
        if "booking_id" in data and data.get("status") == "confirmed":
            return LLMResponse(
                content=f"Your reservation is confirmed! Reference ID is {data['booking_id']} for {data.get('customer_name', 'you')} on {data.get('booking_date')} at {data.get('booking_time')}. We look forward to seeing you!"
            )

        # Booking modification response
        if "booking_id" in data and data.get("status") == "modified":
            return LLMResponse(
                content=f"Your booking has been updated! Your new reservation is set for {data.get('booking_date')} at {data.get('booking_time')}."
            )

        # Booking cancellation response
        if "booking_id" in data and data.get("status") == "cancelled":
            return LLMResponse(
                content=f"Your reservation {data['booking_id']} has been successfully cancelled. We hope to see you another time!"
            )

        # Menu response
        if "menu_summary" in data:
            return LLMResponse(content=data["menu_summary"])

        # Business hours response
        if "hours_summary" in data:
            return LLMResponse(content=f"We are open {data['hours_summary']} Is there a specific day you plan to visit?")

        # Cafe info response
        if "info_summary" in data:
            return LLMResponse(content=data["info_summary"])

        # Human transfer response
        if data.get("escalated"):
            return LLMResponse(
                content=data.get("message", "I am transferring you to a human manager right away. Please hold on.")
            )

        # Customer history response
        if "total_bookings" in data:
            count = data["total_bookings"]
            name = data.get("name") or "Valued Guest"
            return LLMResponse(
                content=f"Welcome back {name}! You have {count} previous reservation(s) with us. How can I help you today?"
            )

        return LLMResponse(content=data.get("message", "I have updated that information for you."))

    def _extract_date(self, text: str) -> Optional[str]:
        t_low = text.lower()
        now = datetime.now()
        if "tomorrow" in t_low:
            return (now + timedelta(days=1)).strftime("%Y-%m-%d")
        if "today" in t_low or "tonight" in t_low:
            return now.strftime("%Y-%m-%d")
        m = re.search(r"\b(20\d{2}-\d{2}-\d{2})\b", text)
        if m:
            return m.group(1)
        months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        for idx, month in enumerate(months, 1):
            if month in t_low:
                day_m = re.search(rf"{month}\s+(\d{{1,2}})", t_low)
                if day_m:
                    day = int(day_m.group(1))
                    return f"{now.year:04d}-{idx:02d}-{day:02d}"
        return None

    def _extract_time(self, text: str) -> Optional[str]:
        m_ampm = re.search(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", text, re.IGNORECASE)
        if m_ampm:
            hour = int(m_ampm.group(1))
            minute = m_ampm.group(2) or "00"
            ampm = m_ampm.group(3).lower()
            if ampm == "pm" and hour != 12:
                hour += 12
            elif ampm == "am" and hour == 12:
                hour = 0
            return f"{hour:02d}:{minute}"

        m_24 = re.search(r"\b([01]?\d|2[0-3]):([0-5]\d)\b", text)
        if m_24:
            return f"{int(m_24.group(1)):02d}:{m_24.group(2)}"

        if "evening" in text.lower() or "dinner" in text.lower():
            return "19:00"
        if "lunch" in text.lower() or "noon" in text.lower():
            return "12:30"
        return None

    def _extract_party_size(self, text: str) -> Optional[int]:
        m = re.search(r"(?:party\s+of|table\s+for|for)\s+(\d{1,2})", text, re.IGNORECASE)
        if m:
            return int(m.group(1))
        m2 = re.search(r"\b(\d{1,2})\s*(?:people|guests|persons)\b", text, re.IGNORECASE)
        if m2:
            return int(m2.group(1))
        words = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10}
        for word, val in words.items():
            if f"for {word}" in text.lower() or f"{word} people" in text.lower() or f"{word} guests" in text.lower():
                return val
        return None

    def _extract_name(self, text: str) -> Optional[str]:
        m = re.search(r"(?:name\s+is|under|I'm|I\s+am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", text)
        if m:
            return m.group(1)
        return None

    def _extract_phone(self, text: str) -> Optional[str]:
        m = re.search(r"(\+?\d[\d\s-]{7,}\d)", text)
        if m:
            return m.group(1).replace(" ", "").replace("-", "")
        return None
