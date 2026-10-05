from typing import Optional
from fastapi import APIRouter, HTTPException, Path, Query
from app.models.schemas import AddCartItemPayload, UpdateCartItemPayload, Cart
from app.services import cart_service

router = APIRouter(tags=["Cart"])

@router.get("/cart/{customer_id}")
def get_cart(customer_id: str = Path(..., description="Customer ID")):
    cart = cart_service.get_cart(customer_id)
    if not cart:
        # Return an empty cart structure
        return {
            "customer_id": customer_id,
            "items": [],
            "subtotal": 0.0,
            "tax_amount": 0.0,
            "service_charge": 0.0,
            "final_total": 0.0
        }
    return cart

@router.post("/cart")
def add_to_cart(payload: AddCartItemPayload):
    try:
        updated_cart = cart_service.add_item_to_cart(
            customer_id=payload.customer_id,
            table_id=payload.table_id,
            item_id=payload.item_id,
            quantity=payload.quantity,
            addon_ids=payload.addon_ids,
            notes=payload.notes
        )
        return updated_cart
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/cart/{id}")
def update_cart_item(
    id: str = Path(..., description="Cart item ID"),
    payload: UpdateCartItemPayload = ...
):
    try:
        updated_cart = cart_service.update_cart_item(
            customer_id=payload.customer_id,
            cart_item_id=id,
            quantity=payload.quantity,
            addon_ids=payload.addon_ids,
            notes=payload.notes
        )
        return updated_cart
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/cart/{id}")
def remove_cart_item_or_clear(
    id: str = Path(..., description="Cart item ID or 'all' to clear"),
    customer_id: str = Query(..., description="Customer ID")
):
    try:
        if id.lower() in ["all", "clear"]:
            cart_service.clear_cart(customer_id)
            return {"status": "cleared", "customer_id": customer_id}
        else:
            updated_cart = cart_service.remove_cart_item(customer_id=customer_id, cart_item_id=id)
            return updated_cart
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
