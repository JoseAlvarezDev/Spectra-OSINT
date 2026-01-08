import httpx
import ipaddress
import logging
from ..schemas.models import IPResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def fetch_ipwhois(client, ip):
    resp = await client.get(f"https://ipwho.is/{ip}")
    data = resp.json()
    if not data.get("success", False):
        raise ValueError("API Error")
    return IPResponse(
        ip=data.get("ip"),
        type=data.get("type"),
        country=data.get("country"),
        city=data.get("city"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        asn=data.get("connection", {}).get("asn"),
        isp=data.get("connection", {}).get("isp"),
        map_url=f"https://www.google.com/maps/@{data.get('latitude')},{data.get('longitude')},12z",
        flag=data.get("flag", {}).get("emoji")
    )

async def fetch_ipapi(client, ip):
    # Fallback: ip-api.com (Free tier is HTTP only, use as last resort)
    resp = await client.get(f"http://ip-api.com/json/{ip}?fields=status,message,country,city,lat,lon,isp,as,query")
    data = resp.json()
    if data.get("status") != "success":
        raise ValueError("API Error")
    
    return IPResponse(
        ip=data.get("query"),
        type="IPv4", # Guessing as ip-api doesn't provide type in free tier easily
        country=data.get("country"),
        city=data.get("city"),
        latitude=data.get("lat"),
        longitude=data.get("lon"),
        asn=data.get("as"),
        isp=data.get("isp"),
        map_url=f"https://www.google.com/maps/@{data.get('lat')},{data.get('lon')},12z",
        flag="🏳️" # No flag in lite version
    )

async def track_ip(ip_address: str) -> IPResponse:
    # 1. Private IP Check
    try:
        ip = ipaddress.ip_address(ip_address)
        if ip.is_private:
            return IPResponse(ip=ip_address, type="Private", country="Local Network", city="Local Device", latitude=0, longitude=0, asn="N/A", isp="Local", flag="🏠")
        if ip.is_loopback:
            return IPResponse(ip=ip_address, type="Loopback", country="Localhost", city="Your Device", latitude=0, longitude=0, flag="💻")
    except ValueError:
        pass

    # 2. External API Check with Fallback
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            logger.info(f"Trying Primary Provider for {ip_address}")
            return await fetch_ipwhois(client, ip_address)
        except Exception as e:
            logger.warning(f"Primary failed: {e}. Trying Fallback.")
            try:
                return await fetch_ipapi(client, ip_address)
            except Exception as e2:
                logger.error(f"All providers failed: {e2}")
                return IPResponse(ip=ip_address, type="Error", country="Lookup Failed", city=str(e))
