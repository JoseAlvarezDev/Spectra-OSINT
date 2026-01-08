import httpx
import asyncio
from ..schemas.models import UsernameResult

# Logic improved: Check for 404 AND specific text patterns for some sites
async def check_site(client, site_name, url_template, username):
    url = url_template.format(username)
    try:
        response = await client.get(url, timeout=5.0, follow_redirects=True)
        
        found = False
        
        # Site specific logic (simplified for reliability in this demo)
        if response.status_code == 200:
            found = True
            # Eliminate False Positives for sites that return 200 but say "Not Found"
            if site_name == "GitHub" and "Not Found" in response.text:
                found = False
            elif site_name == "Instagram" and "Page Not Found" in response.text:
                found = False
            # Add more specific checks here as the tool grows
        
        return UsernameResult(
            site=site_name,
            url=url,
            found=found,
            status="Found" if found else "Not Found"
        )
    except Exception:
        return UsernameResult(site=site_name, url=url, found=False, status="Error")

async def track_username(username: str):
    sites = [
        {"name": "GitHub", "url": "https://www.github.com/{}"},
        {"name": "Facebook", "url": "https://www.facebook.com/{}"},
        {"name": "Twitter", "url": "https://twitter.com/{}"},
        {"name": "Instagram", "url": "https://www.instagram.com/{}"},
        {"name": "Reddit", "url": "https://www.reddit.com/user/{}"},
        {"name": "Twitch", "url": "https://www.twitch.tv/{}"},
        {"name": "Medium", "url": "https://medium.com/@{}"},
        {"name": "Patreon", "url": "https://www.patreon.com/{}"},
        {"name": "SoundCloud", "url": "https://soundcloud.com/{}"},
        {"name": "Dev.to", "url": "https://dev.to/{}"},
    ]

    async with httpx.AsyncClient(headers={"User-Agent": "Mozilla/5.0"}) as client:
        tasks = [check_site(client, site["name"], site["url"], username) for site in sites]
        results = await asyncio.gather(*tasks)
    
    # Filter only found results for cleaner output or return all? 
    # Let's return only found ones to be useful, or all if none found.
    return results
