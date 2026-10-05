# Cafe WhatsApp Automation Platform

A standalone, event-driven WhatsApp messaging, scheduling, customer reply, and marketing automation service built for modern cafes.

This platform operates as an independent microservice that manages customer interactions across the lifecycle—from table reservations and order status updates to scheduled broadcast campaigns and automated conversational replies—with strict compliance safeguards (opt-outs, rate limits, and transactional/marketing message isolation).

Designed for production reliability, it includes full **Mock Mode (`MOCK_MODE=true`)** for zero-cost local development, and an extensible provider abstraction ready to plug into Meta's WhatsApp Business Cloud API.

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Folder Structure](#folder-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Operational Modes (Mock vs. Production)](#operational-modes-mock-vs-production)
7. [Running Locally](#running-locally)
8. [Automation Engine & Events](#automation-engine--events)
9. [Booking Automations](#booking-automations)
10. [Order Automations](#order-automations)
11. [Marketing Campaigns & Audience Segmentation](#marketing-campaigns--audience-segmentation)
12. [In-Process Scheduling Service](#in-process-scheduling-service)
13. [Customer Replies & AI Hook](#customer-replies--ai-hook)
14. [Compliance & Opt-Out Safeguards](#compliance--opt-out-safeguards)
15. [Message Templates & Variable Validation](#message-templates--variable-validation)
16. [Provider Abstraction & Adding Real Providers](#provider-abstraction--adding-real-providers)
17. [Cafe Admin Dashboard Integration Layer](#cafe-admin-dashboard-integration-layer)
18. [API Reference](#api-reference)
19. [Running Tests](#running-tests)

---

## Features

- **Event-Driven Architecture**: Decoupled automation engine connecting cafe business events (`booking.created`, `order.ready`, etc.) to templates and outbound WhatsApp messages.
- **Table Reservation Automations**:
  - Immediate booking confirmation message with reservation details and cancellation prompt.
  - Automated reminder scheduling (24 hours and 2 hours prior to reservation).
  - Booking modification with automatic reminder recalculation.
  - Booking cancellation with immediate automatic cancellation of pending reminders.
  - No-show follow-up to re-engage absent guests.
- **Order Lifecycle Automations**: Real-time notifications on `order.created`, `order.confirmed`, `order.preparing`, `order.ready` (counter/pickup alert), `order.completed`, and `order.cancelled`.
- **Marketing Campaign Engine**:
  - Broadcast campaigns targeted by customer segment (`ALL`, `NEW`, `RETURNING`, `INACTIVE`, `HIGH_VALUE`, `CUSTOM`).
  - Scheduling and draft/paused/active state management.
  - Performance tracking (Total target count, Sent, Delivered, Failed, Opt-outs, Delivery Rate %).
- **Customer Opt-Out & Compliance**:
  - Unsubscribe keyword handling (`STOP`, `UNSUBSCRIBE`, `CANCEL PROMO`, `QUIT`).
  - Resubscribe keyword handling (`START`, `UNSTOP`, `OPTIN`).
  - Strict isolation between marketing messages (blocked for opted-out users) and transactional messages (bookings/orders permitted).
- **In-Process Scheduler**: Background thread with database persistence. No Redis/Celery required for local development. Supports scheduled messages, reminders, campaign runs, and failure retries.
- **Inbound Message & Reply Handling**: Webhook receiver that identifies customers, records conversation history, handles compliance keywords, and provides contextual automated replies with clean hooks for AI agents.
- **WhatsApp Provider Abstraction**: Switch seamlessly between `MockWhatsAppProvider` (simulated deliveries, reads, failures, and replies) and `CloudAPIWhatsAppProvider` (Meta Graph API).
- **Cafe Integration Layer**: Clean webhook endpoints and `CafeClient` service interface for connecting to the Cafe Admin Dashboard / POS without circular dependencies.

---

## Architecture Overview

```
                               ┌──────────────────────────────────────────────┐
                               │             Cafe POS / Dashboard             │
                               └──────────────────────┬───────────────────────┘
                                                      │ Webhooks / API
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 WhatsApp Automation Service                                 │
│                                                                                             │
│  ┌───────────────────────┐   ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │     FastAPI Layer     │──▶│  Automation Engine (Bus) │──▶│   Booking/Order Workflows  │  │
│  │  REST APIs & Webhooks │   │   Event Dispatch & Audit │   │ Confirmation, Status, Etc. │  │
│  └───────────────────────┘   └─────────────┬────────────┘   └─────────────┬──────────────┘  │
│              ▲                             │                              │                 │
│              │                             ▼                              ▼                 │
│  ┌───────────┴───────────┐   ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │   Message Receiver    │   │  Campaign & Segment Svc  │   │     Message Scheduler      │  │
│  │ Keyword & Intent Hook │   │ Filter, Broadcast Engine │   │ Background Poller & Jobs   │  │
│  └───────────────────────┘   └─────────────┬────────────┘   └─────────────┬──────────────┘  │
│                                            │                              │                 │
│                                            ▼                              ▼                 │
│                              ┌──────────────────────────┐   ┌────────────────────────────┐  │
│                              │   Message Sender Core    │   │      Template Engine       │  │
│                              │ Opt-Out & Policy Guard   │   │  Validation & Substitution │  │
│                              └─────────────┬────────────┘   └────────────────────────────┘  │
│                                            │                                                │
│                                            ▼                                                │
│                              ┌──────────────────────────┐                                   │
│                              │ WhatsApp Provider Layer  │                                   │
│                              │   (Mock or Cloud API)    │                                   │
│                              └─────────────┬────────────┘                                   │
│                                            │                                                │
└────────────────────────────────────────────┼────────────────────────────────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
          [Mock Mode: Local Simulation]            [Live: Meta WhatsApp Cloud API]
```

---

## Folder Structure

```
whatsapp-automation/
│
├── backend/
│   ├── api/
│   │   ├── dependencies.py          # FastAPI dependency injection
│   │   └── __init__.py
│   ├── config/
│   │   ├── settings.py              # Environment configuration & defaults
│   │   └── __init__.py
│   ├── middleware/
│   │   ├── auth.py                  # API Key verification dependency
│   │   ├── logging_mw.py            # Sanitized request logging
│   │   ├── rate_limit.py            # Sliding window request rate limiter
│   │   └── __init__.py
│   ├── models/                      # Pydantic API schemas
│   │   ├── campaign.py
│   │   ├── customer.py
│   │   ├── message.py
│   │   ├── statistics.py
│   │   ├── template.py
│   │   ├── webhook.py
│   │   └── __init__.py
│   ├── routes/                      # API endpoint routers
│   │   ├── campaigns.py
│   │   ├── customers.py
│   │   ├── health.py
│   │   ├── messages.py
│   │   ├── statistics.py
│   │   ├── templates.py
│   │   ├── webhooks.py
│   │   ├── workflows.py
│   │   └── __init__.py
│   ├── main.py                      # FastAPI application entry & lifecycles
│   └── __init__.py
│
├── workflows/
│   ├── booking/
│   │   ├── booking_workflows.py     # Confirmations, reminders, cancels, updates
│   │   └── __init__.py
│   ├── orders/
│   │   ├── order_workflows.py       # Order lifecycle state handlers
│   │   └── __init__.py
│   ├── marketing/
│   │   ├── campaign_workflows.py    # Broadcast execution & audience filtering
│   │   └── __init__.py
│   ├── customer/
│   │   ├── reply_workflows.py       # Inbound reply router & AI hooks
│   │   └── __init__.py
│   ├── system/
│   │   ├── retry_workflows.py       # Automatic & manual failure retries
│   │   └── __init__.py
│   ├── engine.py                    # Reusable event-driven automation engine
│   ├── events.py                    # Standard event schemas & event constants
│   └── __init__.py
│
├── messaging/
│   ├── providers/
│   │   ├── base.py                  # WhatsAppProvider interface & schemas
│   │   ├── mock_provider.py         # MockWhatsAppProvider with full simulation
│   │   ├── cloud_api_provider.py    # Meta WhatsApp Business Cloud API provider
│   │   └── __init__.py              # Provider factory
│   ├── templates/
│   │   ├── renderer.py              # {{var}} extraction, validation, rendering
│   │   ├── defaults.py              # Seeded templates (bookings, orders, promos)
│   │   └── __init__.py
│   ├── sender/
│   │   ├── message_sender.py        # Core sender orchestrator & policy guard
│   │   └── __init__.py
│   └── receiver/
│       ├── message_receiver.py      # Webhook parser, keyword compliance (STOP/START)
│       └── __init__.py
│
├── scheduler/
│   ├── scheduler_service.py         # Thread-safe in-process background scheduler
│   ├── job_handlers.py              # Execution handlers for background jobs
│   └── __init__.py
│
├── services/
│   ├── booking_service/             # High-level booking triggers
│   ├── cafe_service/                # Mock and HTTP Cafe Admin Dashboard client
│   ├── campaign_service/            # Marketing campaign management
│   ├── customer_service/            # Customer segmentation and opt-outs
│   ├── notification_service/        # Message sending, scheduling, and history
│   └── template_service/            # Template CRUD and preview operations
│
├── database/
│   ├── models/                      # SQLAlchemy ORM models
│   │   ├── base.py
│   │   ├── campaign.py
│   │   ├── customer.py
│   │   ├── message.py
│   │   ├── opt_out.py
│   │   ├── scheduled_job.py
│   │   ├── template.py
│   │   ├── workflow.py
│   │   └── __init__.py
│   ├── repositories/                # Repository pattern database access
│   │   ├── base.py
│   │   ├── campaign_repository.py
│   │   ├── customer_repository.py
│   │   ├── job_repository.py
│   │   ├── message_repository.py
│   │   ├── opt_out_repository.py
│   │   ├── template_repository.py
│   │   └── __init__.py
│   ├── mock_data/
│   │   ├── seeder.py                # Database seeder for templates and mock customers
│   │   └── __init__.py
│   ├── session.py                   # Engine, sessionmaker, and session context
│   └── __init__.py
│
├── tests/                           # Comprehensive test suite (33 test cases)
│   ├── conftest.py
│   ├── test_booking_workflows.py
│   ├── test_campaigns.py
│   ├── test_customer_opt_out.py
│   ├── test_e2e_scenarios.py
│   ├── test_incoming_replies.py
│   ├── test_messages.py
│   ├── test_order_workflows.py
│   ├── test_provider.py
│   ├── test_scheduler.py
│   ├── test_system_retries.py
│   ├── test_templates.py
│   ├── test_webhooks.py
│   └── __init__.py
│
├── .env                             # Local environment variables
├── .env.example                     # Environment template
├── requirements.txt                 # Dependencies
├── run.py                           # CLI entry point
└── README.md
```

---

## Installation & Setup

### 1. Requirements
- Python 3.10+ (tested with Python 3.11.9)
- SQLite (built-in) or PostgreSQL / Supabase

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
By default, `MOCK_MODE=true` is enabled, allowing all features to run locally with zero paid third-party dependencies.

---

## Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `MOCK_MODE` | `true` | When `true`, WhatsApp messages & external APIs are simulated locally. |
| `ENVIRONMENT` | `development` | `development` or `production`. |
| `HOST` | `0.0.0.0` | Bind host address. |
| `PORT` | `8000` | Port for the API server. |
| `DATABASE_URL` | `sqlite:///./whatsapp_automation.db` | SQLAlchemy database connection string (SQLite, PostgreSQL, Supabase). |
| `DEFAULT_CAFE_ID` | `cafe_central_001` | Default cafe identifier for single-tenant operations. |
| `DEFAULT_CAFE_NAME` | `"The Roasted Bean Cafe"` | Default cafe brand name used in templates. |
| `WHATSAPP_PHONE_NUMBER_ID` | `""` | Meta WhatsApp Cloud API Phone Number ID. |
| `WHATSAPP_ACCESS_TOKEN` | `""` | Meta WhatsApp Cloud API permanent System User Access Token. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | `cafe_whatsapp_webhook_secret_token` | Token used for Meta webhook handshake challenge. |
| `CAFE_API_BASE_URL` | `http://localhost:3000/api` | Base URL of Cafe Admin Dashboard for external lookups. |
| `CAFE_API_KEY` | `""` | API key sent in `X-Cafe-API-Key` to the cafe backend. |
| `MARKETING_HOURLY_RATE_LIMIT` | `100` | Maximum marketing messages per hour. |
| `BOOKING_REMINDER_FIRST_HOURS` | `24` | Hours before reservation to send the first reminder. |
| `BOOKING_REMINDER_SECOND_HOURS` | `2` | Hours before reservation to send the second reminder. |
| `API_KEY_SECRET` | `cafe_automation_secret_key` | Secret key for securing API endpoints (`X-API-Key`). |
| `WEBHOOK_SECRET` | `cafe_webhook_secret_key` | Verification token for incoming webhook payloads. |

---

## Operational Modes (Mock vs. Production)

### Mock Mode (`MOCK_MODE=true`)
- Uses `MockWhatsAppProvider`.
- All outgoing messages are simulated, assigned synthetic provider IDs (`mock_msg_...`), and tracked in-memory and in the SQLite database.
- Messages automatically advance from `QUEUED` -> `SENT` -> `DELIVERED` -> `READ`.
- Failure simulation can be toggled via `mock_provider.set_force_fail(True)` to test retry logic.
- Incoming messages can be simulated by posting simple JSON to `/webhooks/incoming`.

### Production Mode (`MOCK_MODE=false`)
- Uses `CloudAPIWhatsAppProvider`.
- Calls Meta's WhatsApp Business Cloud API (`https://graph.facebook.com/v18.0/{phone_number_id}/messages`).
- Connects to the live Cafe Admin Dashboard via `HttpCafeClient`.

---

## Running Locally

Run the platform with the included launcher:
```bash
python run.py
```
Or with Uvicorn:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running:
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

---

## Automation Engine & Events

The platform includes a decoupled event dispatcher in `workflows/engine.py`. New events can be added without modifying the core system.

### Standard Events:
- `booking.created`
- `booking.updated`
- `booking.cancelled`
- `booking.reminder`
- `booking.no_show`
- `order.created`
- `order.confirmed`
- `order.preparing`
- `order.ready`
- `order.completed`
- `order.cancelled`
- `campaign.execute`
- `customer.reply`
- `message.retry`

Events can be dispatched via API:
```bash
POST /workflows/events/publish
{
  "event_type": "booking.created",
  "payload": {
    "booking_id": "bkg_901",
    "customer_name": "Sarah Connor",
    "customer_phone": "+15551234567",
    "date": "2026-10-15",
    "time": "19:00",
    "guests": 2
  }
}
```

---

## Booking Automations

Managed by `workflows/booking/booking_workflows.py`:

1. **Booking Confirmation**:
   - Immediate message using template `booking_confirmation`.
   - Mentions date, time, party size, and informs the customer they can reply `CANCEL`.
2. **Automated Reminders**:
   - Calculates 24-hour and 2-hour offsets before reservation time.
   - Registers scheduled jobs in `ScheduledJob` table.
   - When the scheduler fires, sends `booking_reminder_24h` and `booking_reminder_2h`.
3. **Booking Cancellation**:
   - Triggered by `booking.cancelled` or customer reply `CANCEL`.
   - Sends `booking_cancellation` message.
   - Automatically queries and cancels all pending reminder jobs for that reservation.
4. **Booking Modification**:
   - Triggered by `booking.updated`.
   - Cancels previous pending reminder jobs.
   - Sends updated details message (`booking_modification`).
   - Re-schedules reminders based on the new date and time.
5. **No-Show Follow-Up**:
   - Triggered by `booking.no_show`.
   - Sends a polite message (`booking_noshow_followup`) encouraging the customer to re-book.

---

## Order Automations

Managed by `workflows/orders/order_workflows.py`:

- **Order Received (`order.created`)**: Confirms receipt with total order value.
- **Order Confirmed (`order.confirmed`)**: Notifies customer that order is confirmed and sent to kitchen.
- **Order Preparing (`order.preparing`)**: Informs customer that items are being handcrafted.
- **Order Ready (`order.ready`)**: Directs customer to collect order at the pickup counter.
- **Order Completed (`order.completed`)**: Sends appreciation message and automatically increments customer order and spending metrics.
- **Order Cancelled (`order.cancelled`)**: Confirms cancellation.

---

## Marketing Campaigns & Audience Segmentation

Managed by `workflows/marketing/campaign_workflows.py` and `services/campaign_service/`:

### Audience Filters:
- `ALL`: Every customer in database.
- `NEW`: Customers with $\le 1$ order.
- `RETURNING`: Customers with $> 1$ order.
- `INACTIVE`: Customers whose last visit was $\ge X$ days ago (default 30).
- `HIGH_VALUE`: Customers who have spent $\ge \$X$ (default 100.0).
- `CUSTOM`: Filter by customer tags (e.g. `vip`, `coffee_club`).

### Safeguards:
- Customers with `is_opted_out = True` or in `OptOutRecord` are automatically bypassed.
- Customers with `do_not_contact = True` are strictly blocked.
- Opted-out recipients are tracked in `opt_out_count` without raising unhandled errors.

---

## In-Process Scheduling Service

Implemented in `scheduler/scheduler_service.py`:
- Dedicated daemon thread periodically checks for jobs where `run_at <= utcnow()`.
- Thread-safe and persistent in SQLite.
- Synchronous test execution supported via `scheduler.run_pending(db=session)`.
- Job states: `PENDING` $\to$ `PROCESSING` $\to$ `COMPLETED` / `FAILED` / `CANCELLED`.
- Exponential or step retry on failure up to `max_retries`.

---

## Customer Replies & AI Hook

Implemented in `messaging/receiver/message_receiver.py`:
- Parses incoming WhatsApp webhooks (Meta Cloud API format or Mock format).
- Identifies or creates customer in the database.
- Records all inbound messages with `direction = INCOMING`.
- **Keyword Evaluation**:
  - `STOP` / `UNSUBSCRIBE` $\to$ Marks customer opted out, records audit, and sends confirmation.
  - `START` / `UNSTOP` $\to$ Marks customer opted in and sends confirmation.
  - `CANCEL` $\to$ Triggers booking cancellation event if active reservation exists.
- **Automated Conversational Replies**:
  - Responds to inquiries about menu, hours, locations, and reservations.
  - Architecture includes clean hooks to connect an LLM / AI Calling agent.

---

## Compliance & Opt-Out Safeguards

- Outbound messages are categorized as `MARKETING`, `BOOKING`, `ORDERS`, `CUSTOMER`, or `GENERAL`.
- `MessageSender` verifies recipient status before dispatch:
  - If category is `MARKETING` and customer is opted out, raises `OptOutRestrictedError` and logs cancellation.
  - Transactional messages (`BOOKING`, `ORDERS`) are permitted even if marketing is opted out.
  - If customer has `do_not_contact = True`, all communication is blocked.

---

## Message Templates & Variable Validation

Implemented in `messaging/templates/`:
- Double-curly-brace variable replacement: `{{customer_name}}`, `{{cafe_name}}`, `{{time}}`.
- `TemplateRenderer.extract_variables(content)`: Discovers required parameters.
- `TemplateRenderer.validate_variables(content, vars)`: Flags missing variables prior to transmission.
- Preview endpoint: `POST /templates/preview` returns rendered text and variable checklist.

---

## Provider Abstraction & Adding Real Providers

The platform uses an abstract contract in `messaging/providers/base.py`:
```python
class WhatsAppProvider(ABC):
    @abstractmethod
    def send_message(self, phone_number: str, content: str, ...) -> ProviderResponse:
        pass

    @abstractmethod
    def send_template(self, phone_number: str, template_name: str, variables: dict, ...) -> ProviderResponse:
        pass

    @abstractmethod
    def get_message_status(self, provider_message_id: str) -> str:
        pass

    @abstractmethod
    def parse_incoming_webhook(self, raw_payload: dict) -> Optional[IncomingMessagePayload]:
        pass
```

### To connect a new WhatsApp provider (e.g. Twilio, Gupshup, 360dialog):
1. Create a new file in `messaging/providers/your_provider.py`.
2. Inherit from `WhatsAppProvider` and implement the 4 methods.
3. Update `get_whatsapp_provider()` in `messaging/providers/__init__.py` to return your provider when configured in `.env`.
4. The core automation engine, workflows, scheduler, and database require zero code changes.

---

## Cafe Admin Dashboard Integration Layer

Located in `services/cafe_service/cafe_client.py`:
- `MockCafeClient`: Provides sample customers, bookings, and orders for offline testing.
- `HttpCafeClient`: Communicates with external cafe backend via HTTP using `CAFE_API_BASE_URL` and `X-Cafe-API-Key`.
- Inbound webhooks from the Cafe Dashboard:
  - `POST /webhooks/cafe/booking-created`
  - `POST /webhooks/cafe/booking-updated`
  - `POST /webhooks/cafe/booking-cancelled`
  - `POST /webhooks/cafe/order-created`
  - `POST /webhooks/cafe/order-updated`

---

## API Reference

### Health & Analytics
- `GET /health`: Service health and active operational mode.
- `GET /statistics`: Aggregated metrics (sent, delivered, read, failed, scheduled, replies, opt-outs, delivery rate %).

### Messages
- `GET /messages`: Query message history with filters (`status`, `phone`, `customer_id`, `direction`).
- `GET /messages/{id}`: Retrieve message by ID.
- `POST /messages/send`: Send immediate text or template message.
- `POST /messages/schedule`: Schedule message for future dispatch.
- `DELETE /messages/{id}`: Cancel a pending or scheduled message.
- `POST /messages/{id}/retry`: Manually retry a failed message.

### Templates
- `GET /templates`: List available templates (filter by `category` and `is_enabled`).
- `POST /templates`: Create a new message template.
- `GET /templates/{id}`: Retrieve template details.
- `PUT /templates/{id}`: Update template content, category, or status.
- `DELETE /templates/{id}`: Delete template.
- `POST /templates/preview`: Validate variables and preview rendered output.

### Marketing Campaigns
- `GET /campaigns`: List campaigns (filter by `status`).
- `POST /campaigns`: Create and optionally schedule a campaign.
- `GET /campaigns/{id}`: View campaign details.
- `PUT /campaigns/{id}`: Update campaign settings.
- `DELETE /campaigns/{id}`: Delete campaign and cancel pending runs.
- `POST /campaigns/{id}/execute`: Trigger campaign broadcast immediately.
- `POST /campaigns/{id}/pause`: Pause scheduled campaign.
- `GET /campaigns/{id}/statistics`: Detailed delivery and opt-out stats for a campaign.

### Customers & Opt-Outs
- `GET /customers`: List customers.
- `POST /customers`: Create or update customer record.
- `POST /customers/{id}/opt-out`: Manually mark customer as opted out.
- `POST /customers/{id}/opt-in`: Manually opt customer back in.
- `GET /customers/audience/preview`: Preview audience matching segment filters.

### Webhooks & Workflows
- `GET /webhooks/incoming`: Meta Cloud API verification challenge.
- `POST /webhooks/incoming`: Inbound WhatsApp message receiver (Meta and Mock formats).
- `POST /webhooks/cafe/booking-created`: Webhook for new bookings.
- `POST /webhooks/cafe/booking-updated`: Webhook for booking modifications.
- `POST /webhooks/cafe/booking-cancelled`: Webhook for booking cancellations.
- `POST /webhooks/cafe/order-created`: Webhook for new orders.
- `POST /webhooks/cafe/order-updated`: Webhook for order status transitions.
- `POST /workflows/events/publish`: Publish events directly to the automation bus.
- `GET /workflows/events`: View event dispatch audit log.

---

## Running Tests

Run the comprehensive pytest suite:
```bash
pytest -v
```

### Test Coverage Highlights (33 Tests):
- Message sending, future scheduling, and cancellation.
- Template rendering, strict mode, and variable validation.
- Provider abstraction, mock delivery simulation, failure modes, and webhook parsing.
- Booking confirmation, 24h & 2h reminder scheduling, update rescheduling, and cancellation.
- Order lifecycle states (received $\to$ confirmed $\to$ preparing $\to$ ready $\to$ completed $\to$ cancelled).
- Marketing campaign creation, audience segmentation, and opt-out safeguard enforcement.
- Opt-out & opt-in lifecycle (`STOP` / `START`), verifying marketing blocking while transactional messages continue.
- Conversational customer replies and intent routing.
- Incoming WhatsApp webhooks and Cafe backend event webhooks.
- Scheduled job execution and failed message retries.
- Full 11-step end-to-end customer lifecycle scenario.
