import dns.resolver
import hashlib
import httpx
from ..schemas.models import EmailResponse

# Common disposable domains blacklist (truncated for performance)
DISPOSABLE_DOMAINS = {
    "yopmail.com", "temp-mail.org", "guerrillamail.com", "10minutemail.com",
    "sharklasers.com", "mailinator.com", "throwawaymail.com"
}

# Provider signatures in MX records
PROVIDERS = {
    "google.com": "Google Workspace / Gmail",
    "googlemail.com": "Google Workspace / Gmail",
    "protection.outlook.com": "Microsoft 365 / Outlook",
    "hotmail.com": "Microsoft Personal",
    "pphosted.com": "Proofpoint Security",
    "mimecast.com": "Mimecast Security"
}

def get_gravatar_url(email: str) -> str:
    # Gravatar uses MD5 hash of lowercase trimmed email
    email_hash = hashlib.md5(email.lower().strip().encode('utf-8')).hexdigest()
    return f"https://www.gravatar.com/avatar/{email_hash}?d=404&s=200"

async def check_gravatar(url: str) -> bool:
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"}
    async with httpx.AsyncClient(timeout=3.0) as client:
        try:
            resp = await client.head(url, headers=headers)
            # Gravatar returns 200 if image exists, or direct image data. 404 if 'd=404' is set and no image.
            return resp.status_code == 200
        except:
            return False

async def get_mx_ip_and_country(mx_record: str):
    try:
        # Resolve MX hostname to IP
        answers = dns.resolver.resolve(mx_record, 'A')
        ip = str(answers[0])
        
        # Resolve IP to Country
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"http://ipwho.is/{ip}")
            data = resp.json()
            if data.get("success"):
                return ip, f"{data.get('country')} ({data.get('country_code')})"
            return ip, "Unknown"
    except:
        return None, None

async def track_email(email: str) -> EmailResponse:
    if "@" not in email:
        return EmailResponse(
            email=email, valid_format=False, domain="N/A", provider_type="Invalid", disposable=False
        )

    user, domain = email.split("@")
    domain = domain.lower()
    
    # 1. Simple Disposable Check
    is_disposable = domain in DISPOSABLE_DOMAINS
    
    # 2. DNS MX Check
    mx_record_str = "No MX Records"
    provider_type = "Private / Unknown"
    server_ip = None
    country = "Global / Cloud" # Default
    
    try:
        mx_records = dns.resolver.resolve(domain, 'MX')
        sorted_mx = sorted(mx_records, key=lambda r: r.preference)
        primary_mx = str(sorted_mx[0].exchange).lower().strip('.')
        mx_record_str = primary_mx
        
        # Identify Provider
        for key, value in PROVIDERS.items():
            if key in primary_mx:
                provider_type = value
                break
        
        if provider_type == "Private / Unknown":
            if "secureserver.net" in primary_mx: provider_type = "GoDaddy"
            elif "zoho" in primary_mx: provider_type = "Zoho Mail"
            elif "protonmail" in primary_mx: provider_type = "ProtonMail"
            
            # If it's a private server or unknown provider, check its location
            ip, loc = await get_mx_ip_and_country(primary_mx)
            if ip: server_ip = ip
            if loc: country = loc

    except Exception:
        pass

    if is_disposable:
        provider_type = "Disposable / Temporary"

    # TLD Country Fallback (e.g. .es, .mx)
    tld = domain.split('.')[-1]
    if len(tld) == 2 and country == "Global / Cloud":
        # Simple heuristic, not exhaustive map
        country = f"TLD Inference (. {tld.upper()})"

    # 3. Check Gravatar Existence
    gravatar_url = get_gravatar_url(email)
    has_avatar = await check_gravatar(gravatar_url)

    return EmailResponse(
        email=email,
        valid_format=True,
        domain=domain,
        mx_records=mx_record_str,
        provider_type=provider_type,
        disposable=is_disposable,
        gravatar_url=gravatar_url if has_avatar else None,
        country=country,
        server_ip=server_ip
    )
