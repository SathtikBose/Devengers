# food_scan/cloudinary_service.py
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration automatically pulls from the CLOUDINARY_URL in .env
cloudinary.config(secure=True)

def upload_food_image(image_bytes):
    """
    Uploads raw image bytes to Cloudinary and returns the public URL.
    """
    try:
        upload_result = cloudinary.uploader.upload(
            image_bytes,
            folder="nutriscan/scans/",
            resource_type="image"
        )
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None