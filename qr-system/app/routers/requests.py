from typing import List, Optional
from fastapi import APIRouter, HTTPException, Path, Query
from app.models.schemas import (
    TableRequest, TableRequestPayload, TableRequestUpdatePayload,
    BillRequest, BillRequestPayload, BillRequestUpdatePayload
)
from app.services import request_service

router = APIRouter(tags=["Requests"])

@router.get("/table-requests", response_model=List[TableRequest])
def list_table_requests(table_id: Optional[str] = Query(None, description="Optional table filter")):
    return request_service.get_table_requests(table_id)

@router.post("/table-requests", response_model=TableRequest)
def create_table_request(payload: TableRequestPayload):
    try:
        req = request_service.create_table_request(
            table_id=payload.table_id,
            session_id=payload.session_id,
            customer_id=payload.customer_id,
            request_type=payload.request_type,
            notes=payload.notes
        )
        return req
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/table-requests/{id}", response_model=TableRequest)
def update_table_request(
    id: str = Path(..., description="Table request ID"),
    payload: TableRequestUpdatePayload = ...
):
    updated = request_service.update_table_request_status(id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Table request '{id}' not found")
    return updated

@router.get("/bill-requests", response_model=List[BillRequest])
def list_bill_requests(table_id: Optional[str] = Query(None, description="Optional table filter")):
    return request_service.get_bill_requests(table_id)

@router.post("/bill-requests", response_model=BillRequest)
def create_bill_request(payload: BillRequestPayload):
    try:
        req = request_service.create_bill_request(
            table_id=payload.table_id,
            session_id=payload.session_id,
            customer_id=payload.customer_id,
            customer_name=payload.customer_name
        )
        return req
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/bill-requests/{id}", response_model=BillRequest)
def update_bill_request(
    id: str = Path(..., description="Bill request ID"),
    payload: BillRequestUpdatePayload = ...
):
    updated = request_service.update_bill_request_status(id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Bill request '{id}' not found")
    return updated
