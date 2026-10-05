from workflows.orders.order_workflows import OrderWorkflow
from workflows.events import AutomationEventSchema
from database.repositories.message_repository import MessageRepository
from database.repositories.customer_repository import CustomerRepository


def test_order_lifecycle_workflows(db_session, mock_provider):
    workflow = OrderWorkflow(db_session)
    msg_repo = MessageRepository(db_session)
    cust_repo = CustomerRepository(db_session)

    events_to_test = [
        "order.created",
        "order.confirmed",
        "order.preparing",
        "order.ready",
        "order.completed",
        "order.cancelled",
    ]

    for ev_type in events_to_test:
        event = AutomationEventSchema(
            event_type=ev_type,
            cafe_id="test_cafe_001",
            payload={
                "order_id": "ORD-5501",
                "customer_name": "Bob Miller",
                "customer_phone": "+15552223344",
                "total_amount": "28.50"
            }
        )
        res = workflow.handle_order_event(event, db_session)
        assert res["order_id"] == "ORD-5501"
        assert res["message_id"] is not None

        msg = msg_repo.get_by_id(res["message_id"])
        assert msg is not None
        assert "ORD-5501" in msg.content
        assert msg.category == "ORDERS" or msg.message_type in ("template", "text")

    # Verify that order.completed updated customer metrics
    customer = cust_repo.get_by_phone("test_cafe_001", "+15552223344")
    assert customer.total_spent >= 338.50  # 310 seeded + 28.50
