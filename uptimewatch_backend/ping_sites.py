import os
import django
import requests
import time
from django.utils import timezone

# 1. Setup Django environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uptimewatch.settings') # <-- Update with your actual settings folder name
django.setup()

from monitor.models import Site, Check # <-- Update with your actual app name

def run_manual_pings():
    print("🚀 Initializing UptimeWatch tracking sweep...")
    sites = Site.objects.all()
    
    if not sites.exists():
        print("❌ No sites found in the engine database.")
        return

    for site in sites:
        print(f"📡 Pinging {site.name} ({site.url})...")
        start_time = time.time()
        
        try:
            # Execute the actual live network request
            response = requests.get(site.url, timeout=10)
            latency = int((time.time() - start_time) * 1000)
            status_result = "up" if response.status_code < 400 else "down"
            print(f"✅ Success! Status: {status_result} | Latency: {latency}ms")
            
        except requests.RequestException as e:
            latency = 0
            status_result = "down"
            print(f"💥 Failed to reach target: {e}")

        # 2. Commit the fresh data record directly to the database
        Check.objects.create(
            site=site,
            status=status_result,
            response_time=latency,
            checked_at=timezone.now()
        )
    print("🏁 Sweep complete. Database synchronized.")

if __name__ == "__main__":
    run_manual_pings()