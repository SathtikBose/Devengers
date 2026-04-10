import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ai_service import analyze_food_image

class ScanRequestView(APIView):
    """
    Endpoint that receives images or barcodes and returns AI insights.
    """
    def post(self, request, *args, **kwargs):
        scan_type = request.data.get('scan_type')
        scan_data = request.data.get('scan_data') # Base64 encoded string

        if not scan_data:
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        response_payload = {
            "status": "processing",
            "scan_type": scan_type
        }

        try:
            if scan_type == 'image':
                # 1. Decode base64 to bytes
                img_bytes = base64.b64decode(scan_data)
                
                # 2. Extract user context (allergies) from profile if it exists
                # This makes the "SAFE" or "LIMIT" labels personalized
                user_allergies = getattr(request.user, 'profile', "None")
                
                # 3. Call our AI Service
                ai_result = analyze_food_image(img_bytes, user_allergies)
                
                # 4. Success Response
                response_payload.update({
                    "status": "success",
                    "result_summary": "NutriAI Analysis Complete",
                    "data": ai_result
                })
                
            elif scan_type == 'barcode':
                # Future logic: Query a barcode DB or pass the ID to AI to lookup
                response_payload.update({
                    "status": "success",
                    "result_summary": f"Barcode {scan_data} received",
                    "data": {"barcode": scan_data}
                })

            return Response(response_payload, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "message": f"AI Processing Failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        # food_scan/views.py

# food_scan/views.py
import uuid
import secrets
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password, check_password
from .json_db import JSONDatabase

# Initialize our JSON "Tables"
user_db = JSONDatabase('users')

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        allergies = request.data.get('allergies', "")

        if not all([username, email, password]):
            return Response({"error": "Missing required fields"}, status=400)

        users = user_db.get_all()

        # Check for existing users
        if any(u['email'] == email or u['username'] == username for u in users):
            return Response({"error": "User with this email or username already exists"}, status=400)

        # Create new user entry
        new_user = {
            "id": str(uuid.uuid4()),
            "username": username,
            "email": email,
            "password": make_password(password), # Securely hash the password
            "allergies": allergies,
            "token": secrets.token_hex(20) # Simple token for authentication
        }

        user_db.add(new_user)

        return Response({
            "token": new_user['token'],
            "user": {
                "username": new_user['username'],
                "email": new_user['email'],
                "allergies": new_user['allergies']
            },
            "message": "User registered successfully (JSON Storage)"
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier') # username or email
        password = request.data.get('password')

        users = user_db.get_all()
        
        # Search for user by email or username
        user = next((u for u in users if u['email'] == identifier or u['username'] == identifier), None)

        if user and check_password(password, user['password']):
            # Update token on login for better security
            user['token'] = secrets.token_hex(20)
            user_db.save_all(users)

            return Response({
                "token": user['token'],
                "username": user['username'],
                "allergies": user['allergies'],
                "message": "Login successful"
            }, status=200)

        return Response({"error": "Invalid credentials"}, status=401)