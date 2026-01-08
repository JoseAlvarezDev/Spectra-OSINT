import phonenumbers
import os
import httpx
import logging
from dotenv import load_dotenv
from phonenumbers import carrier, geocoder, timezone
from ..schemas.models import PhoneResponse

load_dotenv()
logger = logging.getLogger(__name__)

NUMVERIFY_KEY = os.getenv("NUMVERIFY_KEY")
ABSTRACT_KEY = os.getenv("ABSTRACT_API_KEY")

async def fetch_numverify(client, number, key):
    resp = await client.get(f"https://apilayer.net/api/validate?access_key={key}&number={number}")
    data = resp.json()
    if not data.get("valid"):
        return None
    return PhoneResponse(
        number=data.get("international_format"),
        valid=data.get("valid"),
        location=data.get("location"),
        carrier=data.get("carrier") + " (Live HLR)",
        timezone="Determined by Location",
        country_code=None, # Extract if needed
        type=data.get("line_type")
    )

async def fetch_abstract(client, number, key):
    resp = await client.get(f"https://phonevalidation.abstractapi.com/v1/?api_key={key}&phone={number}")
    data = resp.json()
    if not data.get("valid"):
        return None
    
    return PhoneResponse(
        number=data.get("format", {}).get("international"),
        valid=data.get("valid"),
        location=f"{data.get('location')} ({data.get('country', {}).get('name')})",
        carrier=data.get("carrier") + " (Live HLR)",
        timezone="Determined by Location",
        country_code=int(data.get("country", {}).get("prefix").replace("+","")) if data.get("country") else 0,
        type=data.get("type")
    )

async def check_spam(client, number_clean):
    try:
        # StopForumSpam format usually digits only
        url = f"http://api.stopforumspam.org/api?f=json&phone={number_clean}"
        resp = await client.get(url)
        data = resp.json()
        if data.get("success"):
            phone_data = data.get("phone", {})
            return phone_data.get("frequency", 0), phone_data.get("appears", 0)
        return 0, 0
    except:
        return 0, 0

async def track_phone(number: str) -> PhoneResponse:
    # 1. Base Offline Parsing (Always run this for validation first)
    try:
        parsed = phonenumbers.parse(number, None)
        if not phonenumbers.is_valid_number(parsed):
            return PhoneResponse(number=number, valid=False, location="Invalid Number")
        
        # Prepare Offline Data
        offline_response = PhoneResponse(
            number=phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL),
            valid=True,
            location=geocoder.description_for_number(parsed, "en"),
            carrier=carrier.name_for_number(parsed, "en"),
            timezone=', '.join(timezone.time_zones_for_number(parsed)),
            country_code=parsed.country_code,
            type="Mobile" if phonenumbers.number_type(parsed) == phonenumbers.PhoneNumberType.MOBILE else "Fixed/Other"
        )
    except Exception as e:
        return PhoneResponse(number=number, valid=False, location=str(e))

    # 2. Check Spam & Try Online APIs if Keys Exist
    async with httpx.AsyncClient(timeout=5.0) as client:
        # SPAM CHECK (Free, always run)
        try:
            # Clean number for API (remove +)
            clean_num = offline_response.number.replace("+", "").replace(" ", "").replace("-", "")
            spam_score, reports = await check_spam(client, clean_num)
            offline_response.spam_score = spam_score
            offline_response.spam_reports = reports
        except Exception:
            pass

        # Priority 1: Abstract API
        if ABSTRACT_KEY:
            try:
                res = await fetch_abstract(client, number, ABSTRACT_KEY)
                if res: return res
            except Exception as e:
                 logger.error(f"Abstract API failed: {e}")

        # Priority 2: NumVerify
        if NUMVERIFY_KEY:
            try:
                res = await fetch_numverify(client, number, NUMVERIFY_KEY)
                if res: return res
            except Exception as e:
                logger.error(f"NumVerify API failed: {e}")

    # 3. Fallback to Offline Data (Now enriched with Spam Data)
    return offline_response
