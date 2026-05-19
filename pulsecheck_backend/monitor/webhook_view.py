from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import os
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import Site, Check, Incident, Configuration

class ProcessIncidentsWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        auth_header = request.headers.get('Authorization')
        expected_secret = os.getenv('PULSECHECK_WEBHOOK_SECRET')
        
        if expected_secret and auth_header != f"Bearer {expected_secret}":
            return Response({"error": "Unauthorized"}, status=401)
            
        sites = Site.objects.filter(is_active=True)
        config = Configuration.load()
        alert_email = config.alert_email if config.alert_email else settings.ALERT_EMAIL
        
        processed_count = 0
        new_incidents = 0
        resolved_incidents = 0

        for site in sites:
            latest_check = Check.objects.filter(site=site).order_by('-checked_at').first()
            if not latest_check:
                continue

            processed_count += 1
            active_incident = Incident.objects.filter(site=site, resolved_at__isnull=True).order_by('-started_at').first()

            # If current state is DOWN and no active incident exists -> Create one
            if latest_check.status == 'down' and not active_incident:
                Incident.objects.create(site=site, started_at=timezone.now())
                new_incidents += 1
                
                # Send Alert
                subject = f"🚨 UPTIME ALERT: {site.name} is DOWN"
                message = f"PulseCheck monitoring has detected that {site.name} ({site.url}) is unreachable.\n\nPlease check your server immediately."
                try:
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [alert_email], fail_silently=True)
                except Exception:
                    pass

            # If current state is UP and an active incident exists -> Resolve it
            elif latest_check.status == 'up' and active_incident:
                active_incident.resolved_at = timezone.now()
                active_incident.save()
                resolved_incidents += 1
                
                # Send Recovery Alert
                duration = active_incident.resolved_at - active_incident.started_at
                subject = f"✅ RECOVERY: {site.name} is UP"
                message = f"PulseCheck monitoring confirms that {site.name} ({site.url}) is back online.\n\nTotal Downtime Duration: {duration}"
                try:
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [alert_email], fail_silently=True)
                except Exception:
                    pass

        return Response({
            "status": "success",
            "processed": processed_count,
            "new_incidents": new_incidents,
            "resolved_incidents": resolved_incidents
        })
