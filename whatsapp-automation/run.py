import uvicorn
from backend.config.settings import settings

if __name__ == "__main__":
    print("=" * 60)
    print("Starting Cafe WhatsApp Automation Platform")
    print(f"Mock Mode: {settings.MOCK_MODE}")
    print(f"Server URL: http://{settings.HOST}:{settings.PORT}")
    print(f"Swagger API Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 60)
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
