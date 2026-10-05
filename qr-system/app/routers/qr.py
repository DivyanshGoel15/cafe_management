from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import QRGeneratePayload, QRCode
from app.services import qr_service

router = APIRouter(tags=["QR Management"])

@router.get("/qr/tables")
def get_all_tables_qr():
    return qr_service.get_all_table_qrs()

@router.post("/qr/generate", response_model=QRCode)
def generate_table_qr(payload: QRGeneratePayload):
    try:
        qr = qr_service.get_or_generate_qr_for_table(
            table_id=payload.table_id,
            force_regenerate=payload.force_regenerate
        )
        return qr
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/qr/{table_id}", response_model=QRCode)
def get_table_qr(table_id: str = Path(..., description="Table ID")):
    try:
        qr = qr_service.get_or_generate_qr_for_table(table_id=table_id)
        return qr
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
