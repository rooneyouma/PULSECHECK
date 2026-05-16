import os
from celery import shared_task
import requests
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail

from .models import Site, Check, Incident, Configuration

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pulsecheck.settings')

@shared_task
def check_site(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return
    
    last_check = Check.objects.filter(site=site).order_by('-checked_at').first()
    old_status = last_check.status if last_check else 'up' # default up mapping

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

    # Incident Processing
    if old_status == 'up' and status == 'down':
        Incident.objects.create(site=site, started_at=timezone.now())
        
        config = Configuration.load()
        alert_email = config.alert_email if config.alert_email else settings.ALERT_EMAIL
        
        subject = f"🚨 UPTIME ALERT: {site.name} is DOWN"
        message = f"PulseCheck monitoring has detected that {site.name} ({site.url}) is unreachable.\n\nPlease check your server immediately."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [alert_email], fail_silently=True)
        except Exception:
            pass

    elif old_status == 'down' and status == 'up':
        active_incident = Incident.objects.filter(site=site, resolved_at__isnull=True).order_by('-started_at').first()
        if active_incident:
            active_incident.resolved_at = timezone.now()
            active_incident.save()
            
            config = Configuration.load()
            alert_email = config.alert_email if config.alert_email else settings.ALERT_EMAIL

            duration = active_incident.resolved_at - active_incident.started_at
            subject = f"✅ RECOVERY: {site.name} is UP"
            message = f"PulseCheck monitoring confirms that {site.name} ({site.url}) is back online.\n\nTotal Downtime Duration: {duration}"
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [alert_email], fail_silently=True)
            except Exception:
                pass

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