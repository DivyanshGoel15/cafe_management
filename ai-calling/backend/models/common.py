from enum import Enum


class CallStatus(str, Enum):
    RINGING = "Ringing"
    CONNECTED = "Connected"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"
    ESCALATED = "Escalated"


class CallDirection(str, Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"


class Speaker(str, Enum):
    CUSTOMER = "customer"
    AI = "ai"
    SYSTEM = "system"


class EscalationStatus(str, Enum):
    NONE = "None"
    REQUESTED = "Requested"
    TRANSFERRED = "Transferred"
    FAILED = "Failed"


class BookingStatus(str, Enum):
    CONFIRMED = "confirmed"
    MODIFIED = "modified"
    CANCELLED = "cancelled"
