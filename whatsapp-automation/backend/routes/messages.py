from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.config.settings import settings
from backend.models.message import SendMessageRequest, ScheduleMessageRequest, MessageResponse
from backend.api.dependencies import get_notification_svc
from services.notification_service import NotificationService
from messaging.sender import OptOutRestrictedError, DoNotContactError

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("", response_model=List[MessageResponse])
def list_messages(
    cafe_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    phone: Optional[str] = Query(None),
    customer_id: Optional[str] = Query(None),
    direction: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: NotificationService = Depends(get_notification_svc)
):
    """Retrieve message history with optional filters."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    messages = service.list_messages(
        cafe_id=target_cafe,
        status=status,
        phone=phone,
        customer_id=customer_id,
        direction=direction,
        limit=limit,
        offset=offset
    )
    return [msg.to_dict() for msg in messages]


@router.get("/{id}", response_model=MessageResponse)
def get_message(id: str, service: NotificationService = Depends(get_notification_svc)):
    """Retrieve a specific message by its ID."""
    msg = service.get_message(id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return msg.to_dict()


@router.post("/send", response_model=MessageResponse)
def send_message(req: SendMessageRequest, service: NotificationService = Depends(get_notification_svc)):
    """Send an immediate WhatsApp text or template message."""
    target_cafe = req.cafe_id or settings.DEFAULT_CAFE_ID
    try:
        if req.template_name:
            msg = service.send_template(
                cafe_id=target_cafe,
                phone_number=req.phone_number,
                template_name=req.template_name,
                variables=req.variables or {},
                customer_id=req.customer_id,
                category=req.category
            )
        else:
            if not req.content:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Either 'content' or 'template_name' must be provided"
                )
            msg = service.send_message(
                cafe_id=target_cafe,
                phone_number=req.phone_number,
                content=req.content,
                customer_id=req.customer_id,
                category=req.category
            )
        return msg.to_dict()
    except OptOutRestrictedError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except DoNotContactError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/schedule", response_model=MessageResponse)
def schedule_message(req: ScheduleMessageRequest, service: NotificationService = Depends(get_notification_svc)):
    """Schedule a message to be dispatched at a future time."""
    target_cafe = req.cafe_id or settings.DEFAULT_CAFE_ID
    content = req.content or ""
    msg = service.schedule_message(
        cafe_id=target_cafe,
        phone_number=req.phone_number,
        content=content,
        scheduled_time=req.scheduled_time,
        template_name=req.template_name,
        variables=req.variables,
        customer_id=req.customer_id,
        category=req.category
    )
    return msg.to_dict()


@router.delete("/{id}")
def cancel_message(id: str, service: NotificationService = Depends(get_notification_svc)):
    """Cancel a scheduled or pending message."""
    success = service.cancel_message(id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message could not be cancelled (either not found or already sent/failed)"
        )
    return {"status": "success", "message_id": id, "cancelled": True}


@router.post("/{id}/retry")
def retry_message(id: str, service: NotificationService = Depends(get_notification_svc)):
    """Manually trigger a retry for a failed message."""
    result = service.retry_message(id)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result
