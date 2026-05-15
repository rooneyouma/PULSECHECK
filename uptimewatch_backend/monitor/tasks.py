# monitor/tasks.py
from celery import shared_task
import requests

from .models import Site, Check

@shared_task
def check_site(site_id):
    site = Site.objects.get(id=site_id)
    
    try:
        response = requests.get(site.url, timeout=10)
        status = 'up'
        status_code = response.status_code
        response_time = response.elapsed.total_seconds() * 1000
    except:
        status = 'down'
        status_code = None
        response_time = None
    
    Check.objects.create(
        site=site,
        status=status,
        status_code=status_code,
        response_time=response_time
    )

@shared_task
def check_all_sites():
    sites = Site.objects.filter(is_active=True)
    for site in sites:
        check_site.delay(site.id)