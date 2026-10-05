from typing import List
from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import ItemAvailabilityPayload, MenuItem, MenuCategory
from app.services import menu_service

router = APIRouter(tags=["Menu"])

@router.get("/api/menu", response_model=List[MenuCategory])
@router.get("/api/v1/menu", response_model=List[MenuCategory])
@router.get("/menu/items", response_model=List[MenuCategory])
def get_menu_categories():
    return menu_service.get_menu()

@router.put("/menu/items/{id}/availability", response_model=MenuItem)
def update_item_availability(
    id: str = Path(..., description="Menu item ID"),
    payload: ItemAvailabilityPayload = ...
):
    updated_item = menu_service.update_item_availability(id, payload.is_available)
    if not updated_item:
        raise HTTPException(status_code=404, detail=f"Menu item '{id}' not found")
    return updated_item
