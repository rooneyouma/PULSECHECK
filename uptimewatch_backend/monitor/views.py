from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from .models import Site, Check, Incident 
from .serializers import SiteSerializer, CheckSerializer, IncidentSerializer

class SiteViewSet(ModelViewSet):
    queryset = Site.objects.all()
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
    

class StatusPageViewSet(ReadOnlyModelViewSet):
    queryset = Site.objects.filter(is_active=True)
    serializer_class = SiteSerializer
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        site = self.get_object()
        latest_checks = Check.objects.filter(site=site).latest('checked_at')

        data = {
        "site_name": site.name,
        "is_up": latest_check.status == 'up',
        "last_checked": latest_check.checked_at,
        "uptime_history": CheckSerializer(
            Check.objects.filter(site=site).order_by('-checked_at')[:30], 
            many=True
        ).data
    }

        return Response(data)