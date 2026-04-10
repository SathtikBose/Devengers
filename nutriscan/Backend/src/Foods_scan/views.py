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
    # food_scan/views.py
    
import base64
from .cloudinary_service import upload_food_image
from .ai_service import analyze_food_image
from .json_db import JSONDatabase

scan_db = JSONDatabase('scans')

class ScanRequestView(APIView):
    def post(self, request):
        scan_data = request.data.get('scan_data') # Base64 string
        
        try:
            # 1. Decode to bytes
            img_bytes = base64.b64decode(scan_data)

            # 2. Upload to Cloudinary for permanent storage
            image_url = upload_food_image(img_bytes)

            # 3. Perform AI Analysis (using the bytes)
            user_allergies = getattr(request.user, 'profile', "None")
            ai_result = analyze_food_image(img_bytes, user_allergies)

            # 4. Save the Cloudinary URL in your JSON history
            scan_entry = {
                "user_id": request.user.id,
                "image_url": image_url, # Now you have a cloud link!
                "product_name": ai_result['product_name'],
                "health_score": ai_result['health_score'],
            }
            scan_db.add(scan_entry)

            return Response({
                "status": "success",
                "image_url": image_url,
                "data": ai_result
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
        # food_scan/views.py
from .json_db import JSONDatabase
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


class ScanHistoryView(APIView):
    # Only authenticated users can see their own history
    # (The token passed from the mobile app identifies the user)
    def get(self, request):
        # 1. Identify the user from the token
        # In your JSON-based auth, we find the user by their saved token
        token = request.headers.get('Authorization').split(' ')[1]
        users = user_db.get_all()
        current_user = next((u for u in users if u['token'] == token), None)

        if not current_user:
            return Response({"error": "Unauthorized"}, status=401)

        # 2. Retrieve all scans for this specific user ID
        user_scans = scan_db.filter_by('user_id', current_user['id'])

        # 3. Sort scans by timestamp (most recent first)
        user_scans.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

        return Response({
            "status": "success",
            "count": len(user_scans),
            "history": user_scans
        }, status=200)