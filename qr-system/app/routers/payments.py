from fastapi import APIRouter, HTTPException
from app.models.schemas import CreatePaymentPayload, PaymentWebhookPayload, Payment
from app.services import cart_service
from app.payments import default_payment_provider

router = APIRouter(tags=["Payments"])

@router.post("/payments/create")
def create_payment(payload: CreatePaymentPayload):
    # Server-side amount validation: must compute amount from server-side cart
    cart = cart_service.get_cart(payload.customer_id)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cannot create payment: Cart is empty")

    if cart.final_total <= 0:
        raise HTTPException(status_code=400, detail="Cannot create payment: Cart total must be greater than zero")

    try:
        payment = default_payment_provider.create_payment(
            table_id=payload.table_id,
            session_id=payload.session_id,
            customer_id=payload.customer_id,
            amount=cart.final_total,
            currency="INR",
            metadata={
                "customer_name": payload.customer_name,
                "customer_phone": payload.customer_phone,
                "notes": payload.notes,
                "items_count": len(cart.items)
            },
            simulation_result=payload.simulation_result
        )
        return payment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payments/webhook")
def handle_payment_webhook(payload: PaymentWebhookPayload):
    try:
        updated_payment = default_payment_provider.handle_payment_webhook(payload.model_dump())
        return {
            "status": "received",
            "payment": updated_payment
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
