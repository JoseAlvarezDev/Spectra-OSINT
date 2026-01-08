from pydantic import BaseModel
from typing import Optional, Dict

class IPResponse(BaseModel):
    ip: str
    type: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    asn: Optional[str] = None
    isp: Optional[str] = None
    map_url: Optional[str] = None
    flag: Optional[str] = None

class PhoneResponse(BaseModel):
    number: str
    valid: bool
    location: Optional[str] = None
    carrier: Optional[str] = None
    timezone: Optional[str] = None
    country_code: Optional[int] = None
    type: Optional[str] = None
    spam_score: Optional[int] = 0
    spam_reports: Optional[int] = 0

class UsernameResult(BaseModel):
    site: str
    url: str
    found: bool
    status: str

class CryptoResponse(BaseModel):
    address: str
    currency: str
    balance: float
    total_received: float
    total_sent: float
    transactions: int
    found: bool

class EmailResponse(BaseModel):
    email: str
    valid_format: bool
    domain: str
    mx_records: Optional[str] = None
    provider_type: str # 'Personal', 'Business', 'Disposable'
    disposable: bool
    gravatar_url: Optional[str] = None
    country: Optional[str] = None
    server_ip: Optional[str] = None

class UrlResponse(BaseModel):
    url: str
    final_url: str
    redirects: List[str]
    domain: str
    virustotal_score: Optional[int] = None # Malicious count
    virustotal_total: Optional[int] = None
    tags: List[str] = []
    scanned: bool

class MacResponse(BaseModel):
    mac: str
    vendor: str
    found: bool
