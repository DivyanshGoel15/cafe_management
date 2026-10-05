from app.repositories.base import (
    BaseCafeRepository, BaseTableRepository, BaseMenuRepository,
    BaseSessionRepository, BaseCartRepository, BaseOrderRepository,
    BasePaymentRepository, BaseRequestRepository
)
from app.repositories.memory_repos import (
    MemoryCafeRepository, MemoryTableRepository, MemoryMenuRepository,
    MemorySessionRepository, MemoryCartRepository, MemoryOrderRepository,
    MemoryPaymentRepository, MemoryRequestRepository
)

# Instantiate default memory repositories
cafe_repo = MemoryCafeRepository()
table_repo = MemoryTableRepository()
menu_repo = MemoryMenuRepository()
session_repo = MemorySessionRepository()
cart_repo = MemoryCartRepository()
order_repo = MemoryOrderRepository()
payment_repo = MemoryPaymentRepository()
request_repo = MemoryRequestRepository()

__all__ = [
    "BaseCafeRepository", "BaseTableRepository", "BaseMenuRepository",
    "BaseSessionRepository", "BaseCartRepository", "BaseOrderRepository",
    "BasePaymentRepository", "BaseRequestRepository",
    "MemoryCafeRepository", "MemoryTableRepository", "MemoryMenuRepository",
    "MemorySessionRepository", "MemoryCartRepository", "MemoryOrderRepository",
    "MemoryPaymentRepository", "MemoryRequestRepository",
    "cafe_repo", "table_repo", "menu_repo", "session_repo",
    "cart_repo", "order_repo", "payment_repo", "request_repo"
]
