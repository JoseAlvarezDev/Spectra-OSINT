import httpx
import logging
from ..schemas.models import MacResponse

logger = logging.getLogger(__name__)

async def track_mac(mac: str) -> MacResponse:
    # Basic cleaning
    clean_mac = mac.strip().replace("-", ":").upper()
    
    url = f"https://api.macvendors.com/{clean_mac}"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return MacResponse(
                    mac=clean_mac,
                    vendor=resp.text,
                    found=True
                )
            else:
                return MacResponse(
                    mac=clean_mac,
                    vendor="Vendor Not Found",
                    found=False
                )
    except Exception as e:
        logger.error(f"MAC lookup failed: {e}")
        return MacResponse(
            mac=clean_mac,
            vendor="Lookup Error",
            found=False
        )
