from fastapi import Depends
from sqlalchemy.orm import Session
from database.session import get_db
from services.notification_service import NotificationService
from services.template_service import TemplateService
from services.campaign_service import CampaignService
from services.customer_service import CustomerService
from messaging.receiver import MessageReceiver
from workflows.engine import get_automation_engine


def get_notification_svc(db: Session = Depends(get_db)) -> NotificationService:
    return NotificationService(db)


def get_template_svc(db: Session = Depends(get_db)) -> TemplateService:
    return TemplateService(db)


def get_campaign_svc(db: Session = Depends(get_db)) -> CampaignService:
    return CampaignService(db)


def get_customer_svc(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(db)


def get_receiver_svc(db: Session = Depends(get_db)) -> MessageReceiver:
    return MessageReceiver(db, event_engine=get_automation_engine())
