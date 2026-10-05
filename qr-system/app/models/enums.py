from enum import Enum

class TableStatus(str, Enum):
    AVAILABLE = "Available"
    OCCUPIED = "Occupied"
    RESERVED = "Reserved"
    CLEANING = "Cleaning"
    INACTIVE = "Inactive"

class TableSessionStatus(str, Enum):
    ACTIVE = "ACTIVE"
    BILLED = "BILLED"
    CLOSED = "CLOSED"

class OrderStatus(str, Enum):
    CART = "Cart"
    PAYMENT_PENDING = "Payment Pending"
    PAID = "Paid"
    RECEIVED = "Received"
    CONFIRMED = "Confirmed"
    PREPARING = "Preparing"
    READY = "Ready"
    SERVED = "Served"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"
    PAYMENT_FAILED = "Payment Failed"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"

class RequestType(str, Enum):
    CALL_WAITER = "Call Waiter"
    REQUEST_WATER = "Request Water"
    REQUEST_ASSISTANCE = "Request Assistance"
    REQUEST_BILL = "Request Bill"

class RequestStatus(str, Enum):
    PENDING = "Pending"
    ACKNOWLEDGED = "Acknowledged"
    COMPLETED = "Completed"

class BillRequestStatus(str, Enum):
    PENDING = "Pending"
    PREPARING = "Preparing"
    DELIVERED = "Delivered"
    COMPLETED = "Completed"
