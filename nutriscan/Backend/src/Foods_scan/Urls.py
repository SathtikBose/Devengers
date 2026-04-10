# food_scan/urls.py
from django.urls import path
from .views import RegisterView, LoginView, ScanRequestView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='api_login'),
    # ... your scan path ...
    path('scan/', ScanRequestView.as_view(), name='scan_request'),
]

# food_scan/urls.py
from django.urls import path
from .views import RegisterView, LoginView, ScanRequestView, ScanHistoryView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='json_register'),
    path('history/', ScanHistoryView.as_view(), name='scan_history'), # NEW
]