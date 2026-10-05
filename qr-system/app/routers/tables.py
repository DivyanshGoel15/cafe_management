from fastapi import APIRouter, HTTPException, Path
from app.services import table_service, menu_service
from app.models.schemas import Table

router = APIRouter(tags=["Tables"])

@router.get("/tables/{table_id}")
def get_table(table_id: str = Path(..., description="Table ID or number, e.g. table_7 or 7")):
    table = table_service.get_table(table_id)
    if not table:
        raise HTTPException(status_code=404, detail=f"Table '{table_id}' not found")
    return table

@router.get("/tables/{table_id}/menu")
def get_table_menu(table_id: str = Path(..., description="Table ID or number")):
    table = table_service.get_table(table_id)
    if not table:
        raise HTTPException(status_code=404, detail=f"Table '{table_id}' not found")

    menu_data = menu_service.get_menu_for_table(table.table_id)
    menu_data["table"] = table
    return menu_data
