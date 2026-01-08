from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from fastapi import UploadFile
from typing import Dict, Any, Optional

def get_exif_data(image: Image.Image) -> Dict[str, Any]:
    exif_data = {}
    info = image._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]
                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = str(value) # Convert to string to avoid serialization issues
    return exif_data

def get_decimal_from_dms(dms, ref):
    degrees = dms[0]
    minutes = dms[1]
    seconds = dms[2]
    
    decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
    
    if ref in ['S', 'W']:
        decimal = -decimal
        
    return decimal

def get_coordinates(exif_data):
    gps_info = exif_data.get("GPSInfo")
    if not gps_info:
        return None, None
        
    lat = None
    lon = None
    
    if "GPSLatitude" in gps_info and "GPSLatitudeRef" in gps_info:
        lat = get_decimal_from_dms(gps_info["GPSLatitude"], gps_info["GPSLatitudeRef"])
        
    if "GPSLongitude" in gps_info and "GPSLongitudeRef" in gps_info:
        lon = get_decimal_from_dms(gps_info["GPSLongitude"], gps_info["GPSLongitudeRef"])
        
    return lat, lon

async def analyze_image(file: UploadFile) -> Dict[str, Any]:
    try:
        image = Image.open(file.file)
        exif = get_exif_data(image)
        lat, lon = get_coordinates(exif)
        
        # Clean up result
        result = {
            "filename": file.filename,
            "format": image.format,
            "size": image.size,
            "mode": image.mode,
            "device": exif.get("Model", "Unknown"),
            "make": exif.get("Make", "Unknown"),
            "date": exif.get("DateTimeOriginal", exif.get("DateTime", "Unknown")),
            "software": exif.get("Software", "Unknown"),
            "has_gps": lat is not None,
            "latitude": lat,
            "longitude": lon,
            "map_url": f"https://www.google.com/maps?q={lat},{lon}" if lat else None
        }
        return result
    except Exception as e:
        return {"error": str(e)}
