import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"================================================================")
    print(f" Starting {settings.app_name}")
    print(f" Customer Dine-In Menu:   http://localhost:{settings.port}/table/table_7")
    print(f" Kitchen Display (KDS):   http://localhost:{settings.port}/kitchen")
    print(f" Table & QR Admin Console:http://localhost:{settings.port}/admin/qr")
    print(f" API Documentation:       http://localhost:{settings.port}/docs")
    print(f"================================================================")
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
