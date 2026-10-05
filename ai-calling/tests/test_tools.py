from agents.cafe_agent.tools.registry import ToolRegistry


def test_tool_registry_contains_all_required_tools(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    tool_names = set(registry.tools.keys())

    required = {
        "check_table_availability",
        "create_booking",
        "modify_booking",
        "cancel_booking",
        "get_menu",
        "get_business_hours",
        "get_cafe_information",
        "transfer_to_human",
        "create_customer",
        "get_customer_history",
    }
    assert required.issubset(tool_names), f"Missing tools: {required - tool_names}"


def test_execute_check_availability_tool(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    res = registry.execute_tool(
        "check_table_availability",
        {"booking_date": "2026-10-15", "booking_time": "19:00", "party_size": 2},
    )
    assert res["is_available"] is True


def test_execute_get_menu_tool(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    res = registry.execute_tool("get_menu", {"dietary": "vegetarian"})
    assert "menu_summary" in res
    assert "vegetarian" in res["menu_summary"].lower()


def test_execute_get_business_hours_tool(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    res = registry.execute_tool("get_business_hours", {"day": "Friday"})
    assert "hours_summary" in res
    assert "Friday" in res["hours_summary"]


def test_execute_get_cafe_info_tool(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    res = registry.execute_tool("get_cafe_information", {"topic": "parking"})
    assert "info_summary" in res
    assert "parking" in res["info_summary"].lower()


def test_execute_transfer_to_human_tool(db_session):
    registry = ToolRegistry(session=db_session, call_id="test-call-001")
    res = registry.execute_tool("transfer_to_human", {"reason": "Customer requested manager"})
    assert res["escalated"] is True
    assert "transferring" in res["message"].lower()
