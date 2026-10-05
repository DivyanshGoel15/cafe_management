from fastapi import APIRouter, HTTPException, Path
from app.models.schemas import SessionCreatePayload
from app.services import session_service

router = APIRouter(tags=["Sessions"])

@router.post("/sessions")
def create_or_join_session(payload: SessionCreatePayload):
    try:
        session_info = session_service.join_customer_session(
            table_id=payload.table_id,
            customer_name=payload.customer_name,
            customer_phone=payload.customer_phone,
            customer_id=payload.customer_id
        )
        return session_info
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/sessions/{session_id}")
def get_session_details(session_id: str = Path(..., description="Table session ID")):
    details = session_service.get_table_session_details(session_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"Table session '{session_id}' not found")
    return details
