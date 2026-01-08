import httpx
from ..schemas.models import CryptoResponse

async def get_btc_data(client, address):
    # Blockchain.info rawaddr API (Value in satoshis)
    resp = await client.get(f"https://blockchain.info/rawaddr/{address}")
    data = resp.json()
    
    # Convert Satoshis to BTC
    return CryptoResponse(
        address=data.get("address"),
        currency="BTC",
        balance=data.get("final_balance") / 100000000,
        total_received=data.get("total_received") / 100000000,
        total_sent=data.get("total_sent") / 100000000,
        transactions=data.get("n_tx"),
        found=True
    )

async def get_eth_data(client, address):
    # BlockCypher API for ETH (Value in Wei)
    # Using free tier endpoint
    resp = await client.get(f"https://api.blockcypher.com/v1/eth/main/addrs/{address}")
    data = resp.json()
    
    if "error" in data:
        raise ValueError("Address not found")

    # Convert Wei to ETH (10^18)
    return CryptoResponse(
        address=address,
        currency="ETH",
        balance=data.get("balance") / 10**18,
        total_received=data.get("total_received") / 10**18,
        total_sent=data.get("total_sent") / 10**18,
        transactions=data.get("n_tx"),
        found=True
    )

async def track_crypto(address: str, currency: str = "AUTO") -> CryptoResponse:
    async with httpx.AsyncClient() as client:
        try:
            # Simple Auto-Detection
            if currency == "AUTO":
                if address.startswith("0x"):
                    return await get_eth_data(client, address)
                else:
                    return await get_btc_data(client, address)
            
            # Manual Selection
            elif currency.upper() == "ETH":
                return await get_eth_data(client, address)
            elif currency.upper() == "BTC":
                return await get_btc_data(client, address)
                
        except Exception as e:
            return CryptoResponse(
                address=address,
                currency="Unknown",
                balance=0,
                total_received=0,
                total_sent=0,
                transactions=0,
                found=False
            )
