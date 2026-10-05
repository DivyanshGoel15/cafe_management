"""Default WhatsApp message templates seeded into the database."""

DEFAULT_TEMPLATES = [
    # Booking Automations
    {
        "name": "booking_confirmation",
        "category": "BOOKING",
        "description": "Sent immediately upon reservation creation",
        "content": (
            "Hi {{customer_name}}, your table at {{cafe_name}} is confirmed for "
            "{{date}} at {{time}} for {{guests}} guests! We look forward to hosting you. "
            "Reply CANCEL to cancel your reservation."
        ),
        "variables": ["customer_name", "cafe_name", "date", "time", "guests"],
    },
    {
        "name": "booking_reminder_24h",
        "category": "BOOKING",
        "description": "Scheduled reminder sent 24 hours prior to reservation",
        "content": (
            "Hi {{customer_name}}, friendly reminder of your reservation tomorrow at {{cafe_name}} "
            "at {{time}} for {{guests}} guests. Reply CANCEL if your plans have changed."
        ),
        "variables": ["customer_name", "cafe_name", "time", "guests"],
    },
    {
        "name": "booking_reminder_2h",
        "category": "BOOKING",
        "description": "Scheduled reminder sent 2 hours prior to reservation",
        "content": (
            "Hi {{customer_name}}, your table at {{cafe_name}} will be ready in 2 hours ({{time}})! "
            "We are preparing your table. See you soon!"
        ),
        "variables": ["customer_name", "cafe_name", "time"],
    },
    {
        "name": "booking_cancellation",
        "category": "BOOKING",
        "description": "Sent when a booking is cancelled",
        "content": (
            "Hi {{customer_name}}, your reservation at {{cafe_name}} for {{date}} at {{time}} "
            "has been cancelled as requested. We hope to see you another time!"
        ),
        "variables": ["customer_name", "cafe_name", "date", "time"],
    },
    {
        "name": "booking_modification",
        "category": "BOOKING",
        "description": "Sent when booking details are updated",
        "content": (
            "Hi {{customer_name}}, your reservation at {{cafe_name}} has been updated! "
            "New details: Date: {{date}}, Time: {{time}}, Guests: {{guests}}. See you then!"
        ),
        "variables": ["customer_name", "cafe_name", "date", "time", "guests"],
    },
    {
        "name": "booking_noshow_followup",
        "category": "BOOKING",
        "description": "Sent when a customer misses their reservation",
        "content": (
            "Hi {{customer_name}}, we missed you today at {{cafe_name}}! "
            "Would you like to reschedule your reservation? Reply YES to book a new table or visit our website."
        ),
        "variables": ["customer_name", "cafe_name"],
    },

    # Order Automations
    {
        "name": "order_received",
        "category": "ORDERS",
        "description": "Sent when a customer places an order",
        "content": (
            "Hi {{customer_name}}, we have received your order #{{order_id}} at {{cafe_name}}. "
            "Total: ${{total_amount}}. We will notify you once it's confirmed!"
        ),
        "variables": ["customer_name", "order_id", "cafe_name", "total_amount"],
    },
    {
        "name": "order_confirmed",
        "category": "ORDERS",
        "description": "Sent when the kitchen confirms the order",
        "content": (
            "Good news {{customer_name}}! Your order #{{order_id}} has been confirmed "
            "at {{cafe_name}} and sent to our kitchen."
        ),
        "variables": ["customer_name", "order_id", "cafe_name"],
    },
    {
        "name": "order_preparing",
        "category": "ORDERS",
        "description": "Sent when kitchen starts preparing the order",
        "content": (
            "Your delicious order #{{order_id}} is now being prepared by our baristas and chefs at {{cafe_name}}."
        ),
        "variables": ["order_id", "cafe_name"],
    },
    {
        "name": "order_ready",
        "category": "ORDERS",
        "description": "Sent when the order is ready for pickup or service",
        "content": (
            "Hi {{customer_name}}, your order #{{order_id}} is READY! "
            "Please collect it from the counter at {{cafe_name}}."
        ),
        "variables": ["customer_name", "order_id", "cafe_name"],
    },
    {
        "name": "order_completed",
        "category": "ORDERS",
        "description": "Sent when the order is finalized/closed",
        "content": (
            "Thank you for dining with {{cafe_name}}! We hope you enjoyed order #{{order_id}}. "
            "Have a wonderful day!"
        ),
        "variables": ["cafe_name", "order_id"],
    },
    {
        "name": "order_cancelled",
        "category": "ORDERS",
        "description": "Sent when an order is cancelled",
        "content": (
            "Hi {{customer_name}}, your order #{{order_id}} at {{cafe_name}} has been cancelled. "
            "If you have questions, please speak to our team."
        ),
        "variables": ["customer_name", "order_id", "cafe_name"],
    },

    # Marketing & Customer Engagement
    {
        "name": "marketing_weekend_special",
        "category": "MARKETING",
        "description": "Promotional weekend discount campaign",
        "content": (
            "Hi {{customer_name}}, treat yourself this weekend at {{cafe_name}}! "
            "Use promo code {{promo_code}} to enjoy {{discount}} off your favorite treats. "
            "Reply STOP to unsubscribe."
        ),
        "variables": ["customer_name", "cafe_name", "promo_code", "discount"],
    },
    {
        "name": "customer_welcome",
        "category": "CUSTOMER",
        "description": "Welcome message for first-time customers",
        "content": (
            "Welcome to {{cafe_name}}, {{customer_name}}! We are thrilled to have you. "
            "Stay tuned for member specials and updates. Reply STOP to opt out anytime."
        ),
        "variables": ["customer_name", "cafe_name"],
    },
    {
        "name": "opt_out_confirmation",
        "category": "CUSTOMER",
        "description": "Compliance message when customer opts out",
        "content": (
            "You have been successfully unsubscribed from {{cafe_name}} marketing messages. "
            "You will only receive vital booking and order updates. Reply START at any time to opt back in."
        ),
        "variables": ["cafe_name"],
    },
    {
        "name": "opt_in_confirmation",
        "category": "CUSTOMER",
        "description": "Compliance message when customer opts back in",
        "content": (
            "Welcome back! You are now subscribed to receive promotions and updates from {{cafe_name}}."
        ),
        "variables": ["cafe_name"],
    },
]
