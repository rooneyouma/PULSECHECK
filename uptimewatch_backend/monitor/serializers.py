from rest_framework import serializers
from  .models import Site, Check, Incident


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'name', 'url', 'created_at', 'slug', 'check_interval']

class CheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Check
        fields = ['status', 'response_time', 'checked_at']

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['site', 'started_at', 'resolved_at']
