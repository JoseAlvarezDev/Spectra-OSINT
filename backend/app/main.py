from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from .api import routes
from .core.rate_limit import limiter
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize App
app = FastAPI(title="GhostTrack Professional", version="3.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security: Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "your-production-domain.com"] # Update this for prod
)

# Security: CORS Configuration
origins = [
    "http://localhost:5173", # Vite dev server
    "http://127.0.0.1:5173",
    # Add production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Security: Custom Middleware for Security Headers
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "GhostTrack API Operational", "version": "3.0.0", "security": "Active"}
