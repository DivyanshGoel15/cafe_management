from typing import List
from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import Order, OrderStatusUpdatePayload
from app.services import order_service

router = APIRouter(tags=["Kitchen"])

@router.get("/kitchen/orders", response_model=List[Order])
def get_kitchen_orders():
    return order_service.get_kitchen_orders()

@router.put("/kitchen/orders/{id}/status", response_model=Order)
def update_kitchen_order_status(
    id: str = Path(..., description="Order ID"),
    payload: OrderStatusUpdatePayload = ...
):
    updated = order_service.update_order_status(id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Order '{id}' not found")
    return updated
