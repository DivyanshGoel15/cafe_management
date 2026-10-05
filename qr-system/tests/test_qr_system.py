import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import db
from app.models.enums import OrderStatus, PaymentStatus, RequestStatus, BillRequestStatus

@pytest.fixture(autouse=True)
def reset_database():
    """Reset database to initial clean seed state before each test."""
    db.reset_and_seed()
    yield

client = TestClient(app)

# ==============================================================================
# TEST 1: QR identifies correct table
# ==============================================================================
def test_01_qr_identifies_correct_table():
    # Direct table_id query
    res = client.get("/tables/table_7")
    assert res.status_code == 200
    data = res.json()
    assert data["table_id"] == "table_7"
    assert data["table_number"] == 7
    assert data["qr_identifier"] == "qr_table_7"
    assert "/table/table_7" in data["qr_url"]

    # Short number query
    res_num = client.get("/tables/7")
    assert res_num.status_code == 200
    assert res_num.json()["table_id"] == "table_7"

# ==============================================================================
# TEST 2: Permanent QR continues working after menu changes
# ==============================================================================
def test_02_permanent_qr_continues_working_after_menu_changes():
    # 1. Check initial QR URL
    res_table = client.get("/tables/table_5")
    assert res_table.status_code == 200
    initial_qr_url = res_table.json()["qr_url"]

    # 2. Modify menu items and change availability
    res_update = client.put(
        "/menu/items/item_paneer_tikka/availability",
        json={"is_available": False}
    )
    assert res_update.status_code == 200
    assert res_update.json()["is_available"] is False

    # 3. Check table QR again - QR identifier and permanent URL remain UNCHANGED
    res_table_after = client.get("/tables/table_5")
    assert res_table_after.status_code == 200
    assert res_table_after.json()["qr_url"] == initial_qr_url

    # 4. Fetch menu through the permanent table endpoint - gets current dynamic menu
    res_menu = client.get("/tables/table_5/menu")
    assert res_menu.status_code == 200
    items = [item for cat in res_menu.json()["categories"] for item in cat["items"]]
    paneer_tikka = next(i for i in items if i["item_id"] == "item_paneer_tikka")
    assert paneer_tikka["is_available"] is False

# ==============================================================================
# TEST 3: Customer session creation
# ==============================================================================
def test_03_customer_session_creation():
    res = client.post(
        "/sessions",
        json={
            "table_id": "table_3",
            "customer_name": "Alice",
            "customer_phone": "+919876543210"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "customer_session" in data
    assert "table_session" in data
    assert data["customer_session"]["name"] == "Alice"
    assert data["customer_session"]["table_id"] == "table_3"
    assert data["table_session"]["status"] == "ACTIVE"
    assert data["customer_session"]["customer_id"] in data["table_session"]["customer_ids"]

# ==============================================================================
# TEST 4: Multiple customers joining same table session
# ==============================================================================
def test_04_multiple_customers_joining_same_table_session():
    # Customer A joins Table 8
    res_a = client.post("/sessions", json={"table_id": "table_8", "customer_name": "Customer A"})
    assert res_a.status_code == 200
    session_id_a = res_a.json()["table_session"]["session_id"]
    cust_id_a = res_a.json()["customer_session"]["customer_id"]

    # Customer B joins Table 8
    res_b = client.post("/sessions", json={"table_id": "table_8", "customer_name": "Customer B"})
    assert res_b.status_code == 200
    session_id_b = res_b.json()["table_session"]["session_id"]
    cust_id_b = res_b.json()["customer_session"]["customer_id"]

    # Customer C joins Table 8
    res_c = client.post("/sessions", json={"table_id": "table_8", "customer_name": "Customer C"})
    assert res_c.status_code == 200
    session_id_c = res_c.json()["table_session"]["session_id"]
    cust_id_c = res_c.json()["customer_session"]["customer_id"]

    # All three customers join the EXACT SAME active table session
    assert session_id_a == session_id_b == session_id_c

    # Check table session contains all 3 customer IDs
    res_session = client.get(f"/sessions/{session_id_a}")
    assert res_session.status_code == 200
    sess_data = res_session.json()
    assert cust_id_a in sess_data["session"]["customer_ids"]
    assert cust_id_b in sess_data["session"]["customer_ids"]
    assert cust_id_c in sess_data["session"]["customer_ids"]
    assert sess_data["customer_count"] == 3

# ==============================================================================
# TEST 5: Menu retrieval
# ==============================================================================
def test_05_menu_retrieval():
    res = client.get("/tables/table_2/menu")
    assert res.status_code == 200
    data = res.json()
    assert data["cafe"]["name"] == "Cafe Aroma"
    assert "categories" in data
    assert len(data["categories"]) >= 4

    cat_names = [c["name"] for c in data["categories"]]
    assert any("Starters" in name for name in cat_names)
    assert any("Main Course" in name for name in cat_names)
    assert any("Beverages" in name for name in cat_names)

    # Check items have descriptions, veg/non-veg flag, and images
    first_item = data["categories"][0]["items"][0]
    assert "name" in first_item
    assert "price" in first_item
    assert "is_veg" in first_item
    assert "image_url" in first_item

# ==============================================================================
# TEST 6: Cart operations
# ==============================================================================
def test_06_cart_operations():
    cust_id = "test_cust_cart_01"
    
    # 1. Add item to cart
    res_add = client.post(
        "/cart",
        json={
            "customer_id": cust_id,
            "table_id": "table_4",
            "item_id": "item_peri_peri_fries",
            "quantity": 2,
            "addon_ids": ["addon_cheese"]
        }
    )
    assert res_add.status_code == 200
    cart = res_add.json()
    assert len(cart["items"]) == 1
    item = cart["items"][0]
    assert item["quantity"] == 2
    # Base: 189 + Cheese: 40 = 229 * 2 = 458
    assert item["item_total"] == 458.0
    assert cart["subtotal"] == 458.0
    # Tax: 458 * 0.05 = 22.9
    assert cart["tax_amount"] == 22.9
    assert cart["final_total"] == 480.9

    cart_item_id = item["cart_item_id"]

    # 2. Update quantity in cart
    res_update = client.put(
        f"/cart/{cart_item_id}",
        json={"customer_id": cust_id, "quantity": 3}
    )
    assert res_update.status_code == 200
    updated_cart = res_update.json()
    assert updated_cart["items"][0]["quantity"] == 3
    # 229 * 3 = 687
    assert updated_cart["items"][0]["item_total"] == 687.0

    # 3. Remove item from cart
    res_del = client.delete(f"/cart/{cart_item_id}?customer_id={cust_id}")
    assert res_del.status_code == 200
    assert len(res_del.json()["items"]) == 0

# ==============================================================================
# TEST 7: Availability checking
# ==============================================================================
def test_07_availability_checking():
    cust_id = "test_cust_avail"
    # item_crispy_corn is seeded with is_available=False
    res = client.post(
        "/cart",
        json={
            "customer_id": cust_id,
            "table_id": "table_1",
            "item_id": "item_crispy_corn",
            "quantity": 1
        }
    )
    assert res.status_code == 400
    assert "currently unavailable" in res.json()["detail"].lower()

# ==============================================================================
# TEST 8: Successful payment
# ==============================================================================
def test_08_successful_payment():
    cust_id = "cust_pay_success"
    # Setup cart
    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_6",
        "item_id": "item_cold_coffee",
        "quantity": 1
    })

    # Create payment with simulation_result="success"
    res_pay = client.post(
        "/payments/create",
        json={
            "customer_id": cust_id,
            "table_id": "table_6",
            "session_id": "sess_table_6_test",
            "simulation_result": "success"
        }
    )
    assert res_pay.status_code == 200
    pay_data = res_pay.json()
    assert pay_data["status"] == "success"
    assert pay_data["amount"] > 0
    assert pay_data["payment_id"].startswith("pay_")

# ==============================================================================
# TEST 9: Failed payment
# ==============================================================================
def test_09_failed_payment():
    cust_id = "cust_pay_fail"
    # Setup cart
    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_6",
        "item_id": "item_cold_coffee",
        "quantity": 1
    })

    # Create payment with simulation_result="failed"
    res_pay = client.post(
        "/payments/create",
        json={
            "customer_id": cust_id,
            "table_id": "table_6",
            "session_id": "sess_table_6_test",
            "simulation_result": "failed"
        }
    )
    assert res_pay.status_code == 200
    pay_data = res_pay.json()
    assert pay_data["status"] == "failed"

# ==============================================================================
# TEST 10: Order creation after successful payment
# ==============================================================================
def test_10_order_creation_after_successful_payment():
    cust_id = "cust_order_success"
    
    # 1. Join session
    sess_res = client.post("/sessions", json={"table_id": "table_7", "customer_id": cust_id})
    sess_id = sess_res.json()["table_session"]["session_id"]

    # 2. Add item to cart
    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "item_id": "item_butter_chicken",
        "quantity": 2
    })

    # 3. Simulate Successful Payment
    pay_res = client.post("/payments/create", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "session_id": sess_id,
        "simulation_result": "success"
    })
    payment_id = pay_res.json()["payment_id"]

    # 4. Submit Order
    order_res = client.post("/orders", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "session_id": sess_id,
        "payment_id": payment_id,
        "customer_name": "Raj"
    })
    assert order_res.status_code == 200
    order = order_res.json()
    assert order["status"] == "Confirmed"
    assert order["order_number"].startswith("ORD-")
    assert order["customer_name"] == "Raj"
    assert len(order["items"]) == 1
    assert order["items"][0]["item_name"] == "Old Delhi Butter Chicken"

    # 5. Customer cart is cleared after successful order
    cart_check = client.get(f"/cart/{cust_id}")
    assert len(cart_check.json()["items"]) == 0

# ==============================================================================
# TEST 11: No order creation after failed payment
# ==============================================================================
def test_11_no_order_creation_after_failed_payment():
    cust_id = "cust_order_failed_pay"
    
    sess_res = client.post("/sessions", json={"table_id": "table_7", "customer_id": cust_id})
    sess_id = sess_res.json()["table_session"]["session_id"]

    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "item_id": "item_butter_chicken",
        "quantity": 1
    })

    # Simulate Failed Payment
    pay_res = client.post("/payments/create", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "session_id": sess_id,
        "simulation_result": "failed"
    })
    payment_id = pay_res.json()["payment_id"]

    # Attempt to submit order with failed payment -> MUST BE REJECTED
    order_res = client.post("/orders", json={
        "customer_id": cust_id,
        "table_id": "table_7",
        "session_id": sess_id,
        "payment_id": payment_id
    })
    assert order_res.status_code == 400
    assert "payment is not successful" in order_res.json()["detail"].lower()

    # Kitchen must NOT receive this order
    kitchen_res = client.get("/kitchen/orders")
    kitchen_orders = kitchen_res.json()
    assert not any(o["payment_id"] == payment_id for o in kitchen_orders)

# ==============================================================================
# TEST 12: Kitchen order creation
# ==============================================================================
def test_12_kitchen_order_creation():
    cust_id = "cust_kds_01"
    sess_res = client.post("/sessions", json={"table_id": "table_10", "customer_id": cust_id})
    sess_id = sess_res.json()["table_session"]["session_id"]

    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_10",
        "item_id": "item_margherita_pizza",
        "quantity": 1
    })

    pay_res = client.post("/payments/create", json={
        "customer_id": cust_id,
        "table_id": "table_10",
        "session_id": sess_id,
        "simulation_result": "success"
    })
    payment_id = pay_res.json()["payment_id"]

    order_res = client.post("/orders", json={
        "customer_id": cust_id,
        "table_id": "table_10",
        "session_id": sess_id,
        "payment_id": payment_id
    })
    order_id = order_res.json()["order_id"]

    # Verify order appears in Kitchen stream
    kitchen_res = client.get("/kitchen/orders")
    assert kitchen_res.status_code == 200
    orders = kitchen_res.json()
    matching = next((o for o in orders if o["order_id"] == order_id), None)
    assert matching is not None
    assert matching["table_number"] == 10
    assert matching["status"] == "Confirmed"

# ==============================================================================
# TEST 13: Kitchen status updates
# ==============================================================================
def test_13_kitchen_status_updates():
    cust_id = "cust_status_test"
    sess_res = client.post("/sessions", json={"table_id": "table_12", "customer_id": cust_id})
    sess_id = sess_res.json()["table_session"]["session_id"]

    client.post("/cart", json={
        "customer_id": cust_id,
        "table_id": "table_12",
        "item_id": "item_walnut_brownie",
        "quantity": 1
    })

    pay_res = client.post("/payments/create", json={
        "customer_id": cust_id,
        "table_id": "table_12",
        "session_id": sess_id,
        "simulation_result": "success"
    })
    payment_id = pay_res.json()["payment_id"]

    order_res = client.post("/orders", json={
        "customer_id": cust_id,
        "table_id": "table_12",
        "session_id": sess_id,
        "payment_id": payment_id
    })
    order_id = order_res.json()["order_id"]

    # 1. Kitchen starts preparing
    prep_res = client.put(f"/kitchen/orders/{order_id}/status", json={"status": "Preparing"})
    assert prep_res.status_code == 200
    assert prep_res.json()["status"] == "Preparing"

    # 2. Kitchen marks ready
    ready_res = client.put(f"/kitchen/orders/{order_id}/status", json={"status": "Ready"})
    assert ready_res.status_code == 200
    assert ready_res.json()["status"] == "Ready"

    # 3. Kitchen marks served
    served_res = client.put(f"/kitchen/orders/{order_id}/status", json={"status": "Served"})
    assert served_res.status_code == 200
    assert served_res.json()["status"] == "Served"

# ==============================================================================
# TEST 14: Item availability changes
# ==============================================================================
def test_14_item_availability_changes():
    item_id = "item_alfredo_pasta"
    
    # 1. Mark unavailable
    res_off = client.put(f"/menu/items/{item_id}/availability", json={"is_available": False})
    assert res_off.status_code == 200
    assert res_off.json()["is_available"] is False

    # 2. Customer attempts to order -> rejected
    res_add_fail = client.post("/cart", json={
        "customer_id": "cust_avail_test",
        "table_id": "table_1",
        "item_id": item_id,
        "quantity": 1
    })
    assert res_add_fail.status_code == 400
    assert "unavailable" in res_add_fail.json()["detail"].lower()

    # 3. Mark back available
    res_on = client.put(f"/menu/items/{item_id}/availability", json={"is_available": True})
    assert res_on.status_code == 200
    assert res_on.json()["is_available"] is True

    # 4. Now addable
    res_add_ok = client.post("/cart", json={
        "customer_id": "cust_avail_test",
        "table_id": "table_1",
        "item_id": item_id,
        "quantity": 1
    })
    assert res_add_ok.status_code == 200

# ==============================================================================
# TEST 15: Waiter request
# ==============================================================================
def test_15_waiter_request():
    res = client.post(
        "/table-requests",
        json={
            "table_id": "table_9",
            "session_id": "sess_table_9_test",
            "customer_id": "cust_waiter_req",
            "request_type": "Call Waiter",
            "notes": "Extra napkins please"
        }
    )
    assert res.status_code == 200
    req = res.json()
    assert req["status"] == "Pending"
    assert req["request_type"] == "Call Waiter"
    assert req["table_number"] == 9
    req_id = req["request_id"]

    # Update to Acknowledged
    res_ack = client.put(f"/table-requests/{req_id}", json={"status": "Acknowledged"})
    assert res_ack.status_code == 200
    assert res_ack.json()["status"] == "Acknowledged"

    # Update to Completed
    res_comp = client.put(f"/table-requests/{req_id}", json={"status": "Completed"})
    assert res_comp.status_code == 200
    assert res_comp.json()["status"] == "Completed"

# ==============================================================================
# TEST 16: Bill request
# ==============================================================================
def test_16_bill_request():
    res = client.post(
        "/bill-requests",
        json={
            "table_id": "table_14",
            "session_id": "sess_table_14_test",
            "customer_id": "cust_bill_req",
            "customer_name": "Priya"
        }
    )
    assert res.status_code == 200
    bill_req = res.json()
    assert bill_req["status"] == "Pending"
    assert bill_req["table_number"] == 14
    assert bill_req["customer_name"] == "Priya"
    bill_req_id = bill_req["bill_request_id"]

    # Update bill request status
    res_prep = client.put(f"/bill-requests/{bill_req_id}", json={"status": "Preparing"})
    assert res_prep.status_code == 200
    assert res_prep.json()["status"] == "Preparing"

    res_deliv = client.put(f"/bill-requests/{bill_req_id}", json={"status": "Delivered"})
    assert res_deliv.status_code == 200
    assert res_deliv.json()["status"] == "Delivered"

# ==============================================================================
# TEST 17: Table session handling & multi-order aggregation
# ==============================================================================
def test_17_table_session_handling():
    # Customer 1 at Table 15 orders Margherita Pizza (379)
    c1 = "cust_agg_1"
    s1 = client.post("/sessions", json={"table_id": "table_15", "customer_id": c1}).json()["table_session"]["session_id"]
    client.post("/cart", json={"customer_id": c1, "table_id": "table_15", "item_id": "item_margherita_pizza", "quantity": 1})
    p1 = client.post("/payments/create", json={"customer_id": c1, "table_id": "table_15", "session_id": s1, "simulation_result": "success"}).json()["payment_id"]
    client.post("/orders", json={"customer_id": c1, "table_id": "table_15", "session_id": s1, "payment_id": p1})

    # Customer 2 at same Table 15 orders Masala Chai (89)
    c2 = "cust_agg_2"
    client.post("/sessions", json={"table_id": "table_15", "customer_id": c2})
    client.post("/cart", json={"customer_id": c2, "table_id": "table_15", "item_id": "item_masala_chai", "quantity": 1})
    p2 = client.post("/payments/create", json={"customer_id": c2, "table_id": "table_15", "session_id": s1, "simulation_result": "success"}).json()["payment_id"]
    client.post("/orders", json={"customer_id": c2, "table_id": "table_15", "session_id": s1, "payment_id": p2})

    # Query Table Session: Aggregated Total should be sum of both orders
    res_session = client.get(f"/sessions/{s1}")
    assert res_session.status_code == 200
    data = res_session.json()
    # Subtotal = 379 + 89 = 468
    assert data["session"]["subtotal"] == 468.0
    # Tax = 468 * 0.05 = 23.4
    assert data["session"]["tax_amount"] == 23.4
    assert data["session"]["total_amount"] == 491.4
    assert len(data["orders"]) == 2

# ==============================================================================
# TEST 18: QR generation
# ==============================================================================
def test_18_qr_generation():
    # 1. Get all table QRs
    res_all = client.get("/qr/tables")
    assert res_all.status_code == 200
    all_qrs = res_all.json()
    assert len(all_qrs) == 20
    assert all_qrs[0]["qr_image_data"].startswith("data:image/png;base64,")

    # 2. Specific table QR
    res_one = client.get("/qr/table_3")
    assert res_one.status_code == 200
    qr_data = res_one.json()
    assert qr_data["table_id"] == "table_3"
    assert "/table/table_3" in qr_data["permanent_url"]

    # 3. Force regeneration
    res_regen = client.post("/qr/generate", json={"table_id": "table_3", "force_regenerate": True})
    assert res_regen.status_code == 200
    assert res_regen.json()["table_id"] == "table_3"

# ==============================================================================
# TEST 19: Price validation (Server-side authoritative pricing)
# ==============================================================================
def test_19_price_validation():
    cust_id = "cust_price_hacker"
    # Even if client tries to construct an arbitrary request, the cart endpoint
    # does NOT accept price parameter from client. It reads directly from database.
    res = client.post(
        "/cart",
        json={
            "customer_id": cust_id,
            "table_id": "table_1",
            "item_id": "item_butter_chicken",
            "quantity": 1,
            # Note: We do NOT provide price in payload; server computes 449.0
        }
    )
    assert res.status_code == 200
    cart = res.json()
    assert cart["items"][0]["unit_price"] == 449.0
    assert cart["subtotal"] == 449.0
    assert cart["tax_amount"] == 22.45
    assert cart["final_total"] == 471.45

# ==============================================================================
# TEST 20: Invalid table / QR handling
# ==============================================================================
def test_20_invalid_table_qr_handling():
    # Non-existent table lookup
    res_table = client.get("/tables/table_999")
    assert res_table.status_code == 404
    assert "not found" in res_table.json()["detail"].lower()

    # Menu for non-existent table
    res_menu = client.get("/tables/table_invalid/menu")
    assert res_menu.status_code == 404

    # QR for non-existent table
    res_qr = client.get("/qr/table_nonexistent")
    assert res_qr.status_code == 404

    # Session for non-existent table
    res_sess = client.post("/sessions", json={"table_id": "table_nonexistent"})
    assert res_sess.status_code == 400
