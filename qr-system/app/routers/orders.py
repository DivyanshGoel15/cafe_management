from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import OrderCreatePayload, OrderStatusUpdatePayload, Order
from app.services import order_service

router = APIRouter(tags=["Orders"])

@router.get("/orders/{id}")
def get_order(id: str = Path(..., description="Order ID")):
    order = order_service.get_order(id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{id}' not found")
    return order

@router.post("/orders")
def create_order(payload: OrderCreatePayload):
    try:
        order = order_service.create_order_from_cart(
            customer_id=payload.customer_id,
            table_id=payload.table_id,
            session_id=payload.session_id,
            payment_id=payload.payment_id,
            customer_name=payload.customer_name,
            customer_phone=payload.customer_phone,
            notes=payload.notes
        )
        return order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{id}/status")
def update_order_status(
    id: str = Path(..., description="Order ID"),
    payload: OrderStatusUpdatePayload = ...
):
    updated = order_service.update_order_status(id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Order '{id}' not found")
    return updated
