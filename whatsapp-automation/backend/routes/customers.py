from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.config.settings import settings
from backend.models.customer import CustomerCreateRequest, OptOutRequest, CustomerResponse
from backend.api.dependencies import get_customer_svc
from services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=List[CustomerResponse])
def list_customers(
    cafe_id: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    service: CustomerService = Depends(get_customer_svc)
):
    """List customer records."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    customers = service.list_customers(target_cafe, limit, offset)
    return [c.to_dict() for c in customers]


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_customer(
    req: CustomerCreateRequest,
    service: CustomerService = Depends(get_customer_svc)
):
    """Create or update customer contact record."""
    target_cafe = req.cafe_id or settings.DEFAULT_CAFE_ID
    customer = service.create_or_update_customer(
        cafe_id=target_cafe,
        phone=req.phone,
        name=req.name,
        email=req.email
    )
    if req.tags:
        customer.tags = ",".join(req.tags)
        service.customer_repo.update(customer)
    return customer.to_dict()


@router.post("/{id}/opt-out")
def opt_out_customer(
    id: str,
    req: OptOutRequest = None,
    service: CustomerService = Depends(get_customer_svc)
):
    """Mark a customer as opted out from marketing communications."""
    customer = service.get_customer(id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    reason = req.reason if req and req.reason else "ADMIN_MANUAL_OPT_OUT"
    res = service.opt_out_customer(customer.cafe_id, customer.phone, reason=reason)
    return {"status": "success", "customer_id": id, "opted_out": True, "detail": res}


@router.post("/{id}/opt-in")
def opt_in_customer(
    id: str,
    service: CustomerService = Depends(get_customer_svc)
):
    """Opt a customer back in to receive marketing broadcasts."""
    customer = service.get_customer(id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    res = service.opt_in_customer(customer.cafe_id, customer.phone)
    return {"status": "success", "customer_id": id, "opted_out": False, "detail": res}


@router.get("/audience/preview", response_model=List[CustomerResponse])
def preview_audience(
    filter_type: str = Query("ALL", description="ALL, NEW, RETURNING, INACTIVE, HIGH_VALUE, CUSTOM"),
    days_inactive: Optional[int] = Query(30),
    min_spent: Optional[float] = Query(100.0),
    tag: Optional[str] = Query(None),
    cafe_id: Optional[str] = Query(None),
    service: CustomerService = Depends(get_customer_svc)
):
    """Preview customers who match a specific campaign audience filter."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    criteria = {
        "days_inactive": days_inactive,
        "min_spent": min_spent,
        "tag": tag
    }
    customers = service.get_segmented_audience(target_cafe, filter_type, criteria)
    return [c.to_dict() for c in customers]
