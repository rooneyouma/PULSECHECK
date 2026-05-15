import os
from celery import shared_task
import requests
from django.conf import settings

from .models import Site, Check

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uptimewatch_backend.settings')

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

@shared_task
def trigger_all_site_checks():
    site_ids = Site.objects.values_list('id', flat=True)
    for site_id in site_ids:
        check_site.delay(site_id)