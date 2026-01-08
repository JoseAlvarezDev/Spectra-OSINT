from fastapi import APIRouter, UploadFile, File, Request
from ..services import ip_service, phone_service, username_service, image_service, crypto_service, email_service, url_service, mac_service
from ..schemas.models import IPResponse, PhoneResponse, UsernameResult, CryptoResponse, EmailResponse, UrlResponse, MacResponse
from ..core.rate_limit import limiter
from typing import List, Dict, Any

router = APIRouter()

@router.get("/track/ip/{ip_address}", response_model=IPResponse)
@limiter.limit("20/minute")
async def get_ip_info(request: Request, ip_address: str):
    return await ip_service.track_ip(ip_address)

@router.get("/track/phone/{number}", response_model=PhoneResponse)
@limiter.limit("10/minute")
async def get_phone_info(request: Request, number: str):
    return await phone_service.track_phone(number)

@router.get("/track/username/{username}", response_model=List[UsernameResult])
@limiter.limit("5/minute")
async def get_username_info(request: Request, username: str):
    return await username_service.track_username(username)

@router.get("/track/crypto/{address}", response_model=CryptoResponse)
@limiter.limit("20/minute")
async def get_crypto_info(request: Request, address: str):
    return await crypto_service.track_crypto(address)

@router.get("/track/email/{email}", response_model=EmailResponse)
@limiter.limit("5/minute")
async def get_email_info(request: Request, email: str):
    return await email_service.track_email(email)

@router.get("/track/url", response_model=UrlResponse)
@limiter.limit("10/minute")
async def get_url_info(request: Request, target: str):
    return await url_service.analyze_url(target)

@router.get("/track/mac/{mac}", response_model=MacResponse)
@limiter.limit("20/minute")
async def get_mac_info(request: Request, mac: str):
    return await mac_service.track_mac(mac)

@router.post("/track/image")
@limiter.limit("5/minute")
async def analyze_image_route(request: Request, file: UploadFile = File(...)):
    return await image_service.analyze_image(file)
