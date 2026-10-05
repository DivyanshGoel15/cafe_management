import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status, Response

from backend.config.settings import settings
from backend.models.webhook import WebhookBookingPayload, WebhookOrderPayload, WebhookIncomingPayload
from backend.api.dependencies import get_receiver_svc
from messaging.receiver import MessageReceiver
from workflows.engine import get_automation_engine
from workflows.events import (
    EVENT_BOOKING_CREATED,
    EVENT_BOOKING_UPDATED,
    EVENT_BOOKING_CANCELLED,
    EVENT_ORDER_CREATED,
    EVENT_ORDER_CONFIRMED,
    EVENT_ORDER_PREPARING,
    EVENT_ORDER_READY,
    EVENT_ORDER_COMPLETED,
    EVENT_ORDER_CANCELLED,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


# 1. WhatsApp Inbound Webhook (Cloud API & Mock Simulator)

@router.get("/incoming")
def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge")
):
    """Handles Meta WhatsApp Webhook verification handshake."""
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN:
        logger.info("WhatsApp webhook challenge verified successfully.")
        return Response(content=hub_challenge, media_type="text/plain")
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification token mismatch")


@router.post("/incoming")
async def handle_whatsapp_incoming(
    request: Request,
    receiver: MessageReceiver = Depends(get_receiver_svc)
):
    """
    Receives incoming WhatsApp messages from either:
    1. Local mock test payload: {"phone_number": "+15551234", "message": "Hi"}
    2. Meta WhatsApp Business Cloud API JSON payload
    """
    try:
        raw_body = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON body")

    result = receiver.process_incoming_payload(raw_body)
    return {"status": "success", "result": result}


# 2. Cafe Backend Webhook Endpoints

@router.post("/cafe/booking-created")
def cafe_booking_created(payload: WebhookBookingPayload):
    """Triggered by Cafe Admin Dashboard when a table reservation is booked."""
    engine = get_automation_engine()
    res = engine.publish_event(
        event_type=EVENT_BOOKING_CREATED,
        payload=payload.model_dump(by_alias=True),
        cafe_id=payload.cafe_id or settings.DEFAULT_CAFE_ID
    )
    return {"status": "received", "event_id": res["event_id"], "execution": res}


@router.post("/cafe/booking-updated")
def cafe_booking_updated(payload: WebhookBookingPayload):
    """Triggered by Cafe Admin Dashboard when reservation date/time/party is modified."""
    engine = get_automation_engine()
    res = engine.publish_event(
        event_type=EVENT_BOOKING_UPDATED,
        payload=payload.model_dump(by_alias=True),
        cafe_id=payload.cafe_id or settings.DEFAULT_CAFE_ID
    )
    return {"status": "received", "event_id": res["event_id"], "execution": res}


@router.post("/cafe/booking-cancelled")
def cafe_booking_cancelled(payload: WebhookBookingPayload):
    """Triggered by Cafe Admin Dashboard when reservation is cancelled."""
    engine = get_automation_engine()
    res = engine.publish_event(
        event_type=EVENT_BOOKING_CANCELLED,
        payload=payload.model_dump(by_alias=True),
        cafe_id=payload.cafe_id or settings.DEFAULT_CAFE_ID
    )
    return {"status": "received", "event_id": res["event_id"], "execution": res}


@router.post("/cafe/order-created")
def cafe_order_created(payload: WebhookOrderPayload):
    """Triggered by Cafe Admin Dashboard / POS when customer submits an order."""
    engine = get_automation_engine()
    res = engine.publish_event(
        event_type=EVENT_ORDER_CREATED,
        payload=payload.model_dump(by_alias=True),
        cafe_id=payload.cafe_id or settings.DEFAULT_CAFE_ID
    )
    return {"status": "received", "event_id": res["event_id"], "execution": res}


@router.post("/cafe/order-updated")
def cafe_order_updated(payload: WebhookOrderPayload):
    """Triggered when order status changes in POS (CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED)."""
    status_str = (payload.status or "CONFIRMED").upper()
    event_map = {
        "CONFIRMED": EVENT_ORDER_CONFIRMED,
        "PREPARING": EVENT_ORDER_PREPARING,
        "READY": EVENT_ORDER_READY,
        "COMPLETED": EVENT_ORDER_COMPLETED,
        "CANCELLED": EVENT_ORDER_CANCELLED
    }
    target_event = event_map.get(status_str, EVENT_ORDER_CONFIRMED)

    engine = get_automation_engine()
    res = engine.publish_event(
        event_type=target_event,
        payload=payload.model_dump(by_alias=True),
        cafe_id=payload.cafe_id or settings.DEFAULT_CAFE_ID
    )
    return {"status": "received", "event_id": res["event_id"], "event_type": target_event, "execution": res}
