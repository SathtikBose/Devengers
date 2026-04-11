import google.generativeai as genai
import json

# Replace with your actual API Key from Google AI Studio
genai.configure(api_key=AIzaSyCg3i7VgOj_J-EQvQmkOgNdl1ALwztciYc)

def analyze_food_image(image_bytes, allergies="None"):
    """
    Sends raw image bytes to Gemini to get structured nutritional data.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # The prompt is designed to populate your UI components exactly
    prompt = f"""
    Analyze this food product label. 
    User Allergies/Restrictions: {allergies}.

    Return ONLY a JSON object with this exact structure:
    {{
        "product_name": "string",
        "brand": "string",
        "health_score": int (0-100),
        "status": "SAFE" or "LIMIT",
        "macros": {{
            "calories": int,
            "sugar": "string",
            "fat": "string",
            "protein": "string"
        }},
        "ingredients": [
            {{"name": "string", "description": "usage/source", "rating": "SAFE" or "LIMIT"}}
        ],
        "verdict": "2-3 sentence final recommendation for the green NutriAI Verdict box."
    }}

    RULES:
    - If it contains user allergies, health_score MUST be < 50.
    - If high in processed additives or sugar, status should be 'LIMIT'.
    """
    
    # Prepare the image part for the model
    image_part = [{"mime_type": "image/jpeg", "data": image_bytes}]
    
    # Generate the response
    response = model.generate_content([prompt, image_part[0]])
    
    # Clean and parse the JSON
    clean_json = response.text.replace('```json', '').replace('```', '').strip()
    return json.loads(clean_json)

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")