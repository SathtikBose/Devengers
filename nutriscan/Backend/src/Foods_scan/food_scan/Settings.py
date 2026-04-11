import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv() # Loads your .env file

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'rest_framework',
    'rest_framework.authtoken',
    'food_scan', # Your app
]

MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
]

ROOT_URLCONF = 'food_scanner_backend.urls'

# Since you are using JSON storage, you can leave DATABASES empty 
# or use the default SQLite one just to keep Django happy.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


class JSONDatabase:
    # ... existing __init__, get_all, save_all methods ...

    def filter_by(self, key, value):
        """Returns all entries where entry[key] == value"""
        data = self.get_all()
        return [entry for entry in data if entry.get(key) == value]