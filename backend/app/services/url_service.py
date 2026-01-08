import httpx
import os
import base64
import logging
from typing import List
from urllib.parse import urlparse
from dotenv import load_dotenv
from ..schemas.models import UrlResponse

load_dotenv()
logger = logging.getLogger(__name__)

VT_KEY = os.getenv("VIRUSTOTAL_API_KEY")
VT_API_URL = "https://www.virustotal.com/api/v3/urls"

def get_url_id(url):
    return base64.urlsafe_b64encode(url.encode()).decode().strip("=")

async def unshorten_url(url: str) -> (str, List[str]):
    redirects = []
    current_url = url
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            resp = await client.head(url)
            # Access internal history if available, or just map response
            if hasattr(resp, 'history'):
                 for r in resp.history:
                     redirects.append(str(r.url))
            current_url = str(resp.url)
    except Exception as e:
        logger.error(f"Unshorten failed: {e}")
        # If head fails (some block it), try GET with stream to avoid downloading full body
        pass

    return current_url, redirects

async def check_virustotal(url: str):
    if not VT_KEY:
        return None, None, []
    
    url_id = get_url_id(url)
    headers = {
        "x-apikey": VT_KEY
    }
    
    async with httpx.AsyncClient() as client:
        try:
             # 1. Try to get analysis report directly
            resp = await client.get(f"{VT_API_URL}/{url_id}", headers=headers)
            
            # If 404, we might need to submit it first, but for free API limit 
            # we focus on already scanned URLs to save quota and time.
            if resp.status_code == 200:
                data = resp.json()
                attr = data.get("data", {}).get("attributes", {})
                stats = attr.get("last_analysis_stats", {})
                
                malicious = stats.get("malicious", 0)
                total = sum(stats.values())
                
                categories = []
                # Collect positive flags
                results = attr.get("last_analysis_results", {})
                for engine, result in results.items():
                    if result.get("category") == "malicious":
                        categories.append(f"{engine}: {result.get('result')}")
                        
                return malicious, total, categories[:5] # Limit tags
            
        except Exception as e:
            logger.error(f"VT Scan failed: {e}")
            
    return None, None, []

async def analyze_url(url: str) -> UrlResponse:
    # Ensure protocol
    if not url.startswith("http"):
        url = "http://" + url
        
    # 1. Expand URL (Unshorten)
    final_url, cascade = await unshorten_url(url)
    
    parsed = urlparse(final_url)
    domain = parsed.netloc
    
    # 2. VirusTotal Check (on FINAL URL)
    score, total, tags = await check_virustotal(final_url)
    
    return UrlResponse(
        url=url,
        final_url=final_url,
        redirects=cascade,
        domain=domain,
        virustotal_score=score,
        virustotal_total=total,
        tags=tags if tags else [],
        scanned=score is not None
    )
