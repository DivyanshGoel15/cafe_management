# AI Calling Service for Cafes

A production-grade, modular, and extensible AI Voice Calling Service built for cafes and restaurants. The system handles inbound and outbound customer phone calls, checks real-time table availability, creates and manages reservations, answers menu and FAQ inquiries, and escalates to human staff when necessary.

Designed as an independent, standalone service that can seamlessly integrate with the Cafe Admin Dashboard via REST APIs and Webhooks.

---

## Architecture Overview

The system strictly follows a decoupled pipeline architecture. Telephony, Speech-to-Text (STT), Large Language Models (LLM), and Text-to-Speech (TTS) are abstracted behind clean provider interfaces and can be swapped with zero changes to core business logic.

```
                    ┌────────────────────────┐
                    │      Phone Call        │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Telephony Provider   │  (Twilio / Mock)
                    └───────────┬────────────┘
                                │ Webhook / Stream
                    ┌───────────▼────────────┐
                    │     Voice Gateway      │
                    └───────────┬────────────┘
                                │ Audio Stream
                    ┌───────────▼────────────┐
                    │  Speech-to-Text (STT)  │  (Whisper / Mock)
                    └───────────┬────────────┘
                                │ Customer Transcript
                    ┌───────────▼────────────┐
                    │    AI Voice Agent      │  (System Prompt + Tone)
                    └───────────┬────────────┘
                                │ Intent & Function Calling
                    ┌───────────▼────────────┐
                    │   Tools & Services     │  (Table Availability, Bookings, Menu,
                    └───────────┬────────────┘   Customer History, Human Escalation)
                                │ Agent Response Text
                    ┌───────────▼────────────┐
                    │  Text-to-Speech (TTS)  │  (OpenAI / ElevenLabs / Mock)
                    └───────────┬────────────┘
                                │ Synthesized Audio
                    ┌───────────▼────────────┐
                    │   Telephony Provider   │
                    └───────────┬────────────┘
                                │ Live Audio Stream
                    ┌───────────▼────────────┐
                    │        Customer        │
                    └────────────────────────┘
```

> **Important**: The AI agent **does not contain direct business logic**. All state changes, availability calculations, and reservations are mediated through the tool execution layer.

---

## Key Features

1. **Inbound & Outbound Calling**:
   - Webhook endpoints for telephony carriers (`/webhooks/telephony`, `/webhooks/call-status`, `/webhooks/audio`).
   - Outbound calling abstraction (`POST /calls/outbound` and `make_call()`).

2. **Strict Availability Verification**:
   - **Never confirms a booking without verified table availability**.
   - Enforces business operating hours and capacity constraints.

3. **Complete Reservation Lifecycle**:
   - Check real-time table availability.
   - Create new bookings with unique confirmation IDs (`BKG-XXXXXX`).
   - Modify existing bookings (date, time, party size, special requests).
   - Cancel bookings with policy verification.

4. **Dynamic FAQ & Dietary Menu Search**:
   - Search menu items with dietary filters (Vegetarian, Vegan, Gluten-Free).
   - Instant answers for hours, directions, parking, and cafe policies.

5. **Human Escalation Engine**:
   - Automatically escalates when a caller explicitly asks for a human.
   - Detects frustration or angry sentiment.
   - Detects payment or billing disputes.
   - Detects repeated conversational misunderstandings.

6. **Full Observability & Structured Transcripts**:
   - Turn-by-turn structured conversation transcripts (`customer`, `ai`).
   - Auto-generated post-call AI summaries.
   - Structured JSON logging with automatic PII sanitization.

7. **Interactive Simulator & Admin Web Console**:
   - Built-in visual dashboard served at `http://localhost:8000/`.
   - Real-time sound wave pulse animation, live dialogue stream, 1-click test scenarios, and agent prompt editor.

---

## Project Structure

```
ai-calling/
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py          # Pydantic Settings & environment loader
│   ├── middleware/
│   │   ├── auth.py              # API key verification with mock/dev bypass
│   │   ├── rate_limit.py        # Token bucket / sliding-window rate limiter
│   │   └── logging.py           # Request ID tracking & sanitized logging
│   ├── models/
│   │   ├── common.py            # Enums (CallStatus, Direction, Speaker, etc.)
│   │   ├── booking.py           # Pydantic models for bookings and availability
│   │   ├── call.py              # Pydantic models for calls, stats, webhooks
│   │   └── agent.py             # Pydantic models for agent configuration
│   ├── routes/
│   │   ├── health.py            # GET /health
│   │   ├── calls.py             # GET /calls, GET /calls/{id}, POST /calls/outbound, stats
│   │   ├── agents.py            # GET /agents, POST /agents, PUT /agents/{id}
│   │   ├── webhooks.py          # Telephony, call status, and audio stream webhooks
│   │   ├── simulation.py        # Local demo simulator endpoints
│   │   └── bookings.py          # Direct booking CRUD endpoints
│   ├── services/
│   │   └── logging_service.py   # Structured logging with sensitive data masking
│   └── main.py                  # FastAPI app factory, CORS, static UI mounting
│
├── agents/
│   ├── cafe_agent/
│   │   ├── agent.py             # CafeVoiceAgent orchestrator
│   │   ├── prompts/
│   │   │   └── system_prompt.py # Dynamic prompt builder with cafe facts
│   │   ├── tools/
│   │   │   ├── base.py          # AgentTool abstraction
│   │   │   └── registry.py      # All 10 tools wired to business services
│   │   └── config/
│   │       └── agent_config.py  # Agent tone, personality, max tokens
│   └── agent_manager/
│       └── manager.py           # Multi-agent registry & prompt updater
│
├── voice/
│   ├── gateway.py               # VoiceGateway orchestrating Telephony-STT-Agent-TTS
│   ├── stt/
│   │   ├── base.py              # SpeechToTextProvider ABC
│   │   ├── mock_stt.py          # Mock STT for local development
│   │   ├── whisper_stt.py       # OpenAI Whisper STT implementation
│   │   └── factory.py           # STT provider factory
│   ├── tts/
│   │   ├── base.py              # TextToSpeechProvider ABC
│   │   ├── mock_tts.py          # Mock TTS generating valid WAV headers
│   │   ├── openai_tts.py        # OpenAI TTS (tts-1)
│   │   ├── elevenlabs_tts.py    # ElevenLabs REST API TTS
│   │   └── factory.py           # TTS provider factory
│   ├── telephony/
│   │   ├── base.py              # TelephonyProvider ABC
│   │   ├── mock_telephony.py    # In-memory simulated carrier
│   │   ├── twilio_telephony.py  # Twilio Voice API & TwiML generator
│   │   └── factory.py           # Telephony provider factory
│   └── audio/
│       └── processor.py         # Audio chunking, WAV/PCM packaging, base64
│
├── services/
│   ├── booking_service/
│   │   └── service.py           # Availability checks & booking lifecycle
│   ├── customer_service/
│   │   └── service.py           # Customer lookup and preferences
│   ├── menu_service/
│   │   └── service.py           # Dietary searches and voice summaries
│   ├── call_service/
│   │   └── service.py           # Call states, transcripts, summaries, stats
│   ├── escalation_service/
│   │   └── service.py           # Frustration, dispute, & escalation rules
│   └── cafe_api_client/
│       └── client.py            # Cafe Admin Dashboard HTTP client with mock fallback
│
├── database/
│   ├── connection.py            # SQLite engine, SessionLocal, get_db
│   ├── models/
│   │   ├── base.py              # SQLAlchemy Base
│   │   ├── customer_entity.py   # CustomerModel
│   │   ├── booking_entity.py    # TableModel, BookingModel
│   │   ├── call_entity.py       # CallModel, CallTranscriptModel
│   │   └── agent_entity.py      # AgentModel
│   ├── repositories/
│   │   ├── base.py              # Generic CRUD repository
│   │   ├── booking_repository.py
│   │   ├── customer_repository.py
│   │   ├── call_repository.py
│   │   └── agent_repository.py
│   └── mock_data/
│       ├── cafe_info.json       # Cafe address, hours, rules, policies
│       ├── menu_items.json      # Dishes, dietary tags, prices
│       ├── initial_tables.json  # Indoor, window, patio, private tables
│       └── seeder.py            # Database seeder
│
├── static/
│   ├── index.html               # Luxury dark-mode Admin Console & Live Simulator
│   ├── style.css                # Visual wave pulse, glassmorphism, responsive
│   └── app.js                   # Live interactive simulation logic
│
├── tests/
│   ├── conftest.py              # Test database engine and client fixtures
│   ├── test_booking_service.py  # Booking unit tests
│   ├── test_customer_service.py # Customer unit tests
│   ├── test_menu_service.py     # Menu & dietary unit tests
│   ├── test_call_service.py     # Call lifecycle and metrics tests
│   ├── test_escalation.py       # Escalation trigger tests
│   ├── test_tools.py            # All 10 tools execution tests
│   ├── test_providers.py       # Provider fallback and mock mode tests
│   ├── test_api_endpoints.py    # REST API endpoints & webhooks tests
│   └── test_conversation_scenarios.py # 10 full end-to-end conversation scenarios
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Quickstart & Installation

### 1. Requirements
- Python 3.10+
- Pip

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
By default, `.env` has `MOCK_MODE=true` enabled. **No paid API keys are required to run locally!**

### 4. Run the Application
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Open your browser to:
- **Interactive Simulator & Admin Console**: [http://localhost:8000](http://localhost:8000)
- **Interactive OpenAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Endpoint**: [http://localhost:8000/health](http://localhost:8000/health)

---

## Mock Mode Explained

When `MOCK_MODE=true`:
- Telephony simulates ringing, connection, and audio transmission.
- Speech-to-Text directly parses simulated audio or decodes user text turns.
- AI Agent uses an intelligent, rule-based LLM engine that parses intent, detects booking details, checks availability, runs tools, and formats spoken responses.
- Text-to-Speech generates valid, compliant WAV headers with simulated PCM audio frames.
- Pre-populated tables, menus, and customer records are used automatically.

To enable real providers:
1. Set `MOCK_MODE=false` in `.env`.
2. Set provider keys (e.g. `PROVIDER_LLM=openai`, `OPENAI_API_KEY=sk-...`).
3. If an API key is ever missing or encounters a timeout, the providers automatically fall back to mock mode gracefully.

---

## 10 Core Conversation Scenarios (Tested & Verified)

All 10 scenarios are automated in `tests/test_conversation_scenarios.py`:

| # | Scenario | Expected Behavior |
|---|---|---|
| 1 | **Successful Booking** | Customer requests date/time/party; agent checks availability, collects name, confirms booking ID (`BKG-XXXXXX`). |
| 2 | **No Availability** | Customer requests party of 25 (exceeds online limit); agent declines and suggests host connection. |
| 3 | **Booking Cancellation** | Customer requests cancellation of `BKG-9901`; booking marked cancelled per policy. |
| 4 | **Booking Modification** | Customer requests time change; agent checks slot and updates reservation to modified. |
| 5 | **Customer Asks FAQ** | Answers opening hours for Friday, vegetarian menu items with prices, and parking instructions. |
| 6 | **Customer Requests Human** | "I want to speak with a human manager"; agent triggers `transfer_to_human()` and marks call Escalated. |
| 7 | **AI Does Not Know Answer** | Questions about Mars weather or stocks are politely redirected with staff assistance offer. |
| 8 | **Invalid Date/Time** | Invalid input rejected gracefully with a request for standard date/time. |
| 9 | **Multiple Attempts** | Customer inquires about multiple slots before picking one; state preserved across turns. |
| 10 | **Call Interruption/Failure** | Carrier disconnects call; status set to `Failed`, session cleaned up cleanly. |

---

## Running the Test Suite

Run all 51 tests:
```bash
pytest -v
```

Run only conversation scenario tests:
```bash
pytest -v tests/test_conversation_scenarios.py
```

Run with coverage report:
```bash
pytest --cov=. -v
```

---

## Admin REST API Reference

### Calls & Transcripts
- `GET /calls`: List all calls with status/direction filtering and pagination.
- `GET /calls/{id}`: Detailed call record including full transcripts.
- `GET /call-transcripts/{id}`: Structured turn-by-turn dialogue transcript with AI summary.
- `GET /call-statistics`: Performance metrics (total calls, completion %, escalation %, avg duration).
- `POST /calls/outbound`: Trigger an outbound call:
  ```json
  {
    "phone_number": "+15559876543",
    "agent_id": "agent-bella-01",
    "purpose": "Reservation Reminder",
    "customer_name": "David Miller"
  }
  ```

### AI Agents
- `GET /agents`: List all configured voice agents.
- `POST /agents`: Create a new voice agent profile.
- `PUT /agents/{id}`: Update agent system prompt, role, or tone.

### Webhooks (Telephony Provider Integration)
- `POST /webhooks/telephony`: Incoming call webhook (supports Twilio form-data and JSON).
- `POST /webhooks/call-status`: Call lifecycle updates (`ringing`, `in-progress`, `completed`, `failed`).
- `POST /webhooks/audio`: Audio stream turn webhook.

### Bookings (Cafe Admin Dashboard Integration)
- `POST /bookings/check-availability`: Query available tables for date, time, and party size.
- `POST /bookings`: Create a confirmed booking.
- `PUT /bookings/{id}`: Modify reservation.
- `DELETE /bookings/{id}`: Cancel reservation.

---

## Extension Guide: Adding New Providers

### 1. Adding an LLM Provider (e.g. Anthropic Claude)
1. Subclass `LLMProvider` in `llm/claude_llm.py`:
   ```python
   from llm.base import LLMProvider, LLMMessage, ToolDefinition, LLMResponse

   class ClaudeLLMProvider(LLMProvider):
       def generate(self, messages, tools=None, temperature=0.3) -> LLMResponse:
           # Call Anthropic API with messages and tools schema
           ...
   ```
2. Register in `llm/factory.py`:
   ```python
   if p_name == "claude":
       return ClaudeLLMProvider()
   ```

### 2. Adding an STT Provider (e.g. Deepgram)
1. Subclass `SpeechToTextProvider` in `voice/stt/deepgram_stt.py`:
   ```python
   from voice.stt.base import SpeechToTextProvider

   class DeepgramSTTProvider(SpeechToTextProvider):
       def transcribe(self, audio_bytes: bytes, audio_format: str = "wav", language: str = "en") -> str:
           # Call Deepgram REST API / WebSocket
           ...
   ```
2. Register in `voice/stt/factory.py`.

### 3. Adding a TTS Provider (e.g. Cartesia)
1. Subclass `TextToSpeechProvider` in `voice/tts/cartesia_tts.py`:
   ```python
   from voice.tts.base import TextToSpeechProvider

   class CartesiaTTSProvider(TextToSpeechProvider):
       def synthesize(self, text: str, voice_id: Optional[str] = None) -> bytes:
           # Call Cartesia API, return audio bytes
           ...
   ```
2. Register in `voice/tts/factory.py`.

### 4. Adding a Telephony Provider (e.g. Telnyx / Vonage)
1. Subclass `TelephonyProvider` in `voice/telephony/telnyx_telephony.py`:
   ```python
   from voice.telephony.base import TelephonyProvider, TelephonyCallInfo

   class TelnyxTelephonyProvider(TelephonyProvider):
       def make_call(self, phone_number, agent_id, purpose, callback_url=None):
           ...
   ```
2. Register in `voice/telephony/factory.py`.

---

## Connecting the Cafe Admin Dashboard

The service is pre-configured for future bidirectional integration with the Cafe Admin Dashboard:
1. **Outbound API Integration**:
   - Set `CAFE_API_BASE_URL=http://your-cafe-dashboard:5000/api` and `USE_MOCK_CAFE_API=false`.
   - `CafeApiClient` will automatically fetch live menu, live table configurations, and dispatch webhook notifications on booking confirmation/cancellation.
2. **Inbound Dashboard Integration**:
   - The Cafe Admin Dashboard can call `GET /calls`, `GET /call-transcripts/{id}`, and `GET /call-statistics` to display live call logs in the dashboard.
   - The Dashboard can trigger automated reservation confirmations by posting to `POST /calls/outbound`.
