from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, users, merchants, transactions, paybacks, reports

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A Pay-Later Service — Buy now, pay later with credit limits and merchant fee tracking.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(merchants.router)
app.include_router(transactions.router)
app.include_router(paybacks.router)
app.include_router(reports.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
