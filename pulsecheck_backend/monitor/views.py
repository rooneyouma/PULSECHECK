from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from .models import Site, Check, Incident, Configuration
from .serializers import SiteSerializer, CheckSerializer, IncidentSerializer, StatusSummarySerializer


class SiteViewSet(ModelViewSet):
    queryset = Site.objects.all().order_by('-created_at')
    serializer_class = SiteSerializer

    @action(detail=True, methods=['get'])
    def checks(self, request, pk=None):
        site = self.get_object_or_404(pk)
        checks = Check.objects.filter(site=site)
        serializer = CheckSerializer(checks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def incidents(self, request, pk=None):
        site = self.get_object_or_404(pk)
        incidents = Incident.objects.filter(site=site)
        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data)
    
class IncidentViewSet(ModelViewSet):
    queryset = Incident.objects.all().order_by('-started_at')
    serializer_class = IncidentSerializer

class StatusPageViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]

    queryset = Site.objects.filter(is_active=True)
    serializer_class = SiteSerializer
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return StatusSummarySerializer
        return SiteSerializer

    def retrieve(self, request, *args, **kwargs):
        site = self.get_object()
        
        # Handle cases where there are no checks for this site yet gracefully
        try:
            latest_check = Check.objects.filter(site=site).latest('checked_at')
            is_up = latest_check.status == 'up'
            last_checked = latest_check.checked_at
        except Check.DoesNotExist:
            is_up = False
            last_checked = None

        data = {
            "site_name": site.name,
            "is_up": is_up,
            "last_checked": last_checked,
            "uptime_history": CheckSerializer(
                Check.objects.filter(site=site).order_by('-checked_at')[:20], 
                many=True
            ).data
        }
        return Response(data)

class AlertEmailView(APIView):
    def get(self, request):
        config = Configuration.load()
        return Response({
            "alert_email": config.alert_email,
            "check_interval": config.check_interval
        })

    def post(self, request):
        email = request.data.get("alert_email", "")
        config = Configuration.load()
        if email:
            config.alert_email = email
            
        config.save()
        return Response({
            "alert_email": config.alert_email
        })