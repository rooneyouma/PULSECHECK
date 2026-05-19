import os
import django

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pulsecheck.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Success: Superuser '{username}' was automatically created.")
    else:
        print(f"Info: Superuser '{username}' already exists. Skipping creation.")
else:
    print("Warning: DJANGO_SUPERUSER_PASSWORD is not set. Skipping superuser creation.")
