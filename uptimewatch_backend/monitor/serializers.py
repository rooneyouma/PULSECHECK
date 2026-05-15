from rest_framework import serializers
from  .models import Site, Check, Incident


# class SiteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Site
#         fields = ['id', 'name', 'url', 'created_at', 'slug', 'check_interval']
#         read_only_fields = ['slug']

class CheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Check
        fields = ['status', 'response_time', 'checked_at']

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['site', 'started_at', 'resolved_at']

class SiteSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    responseTime = serializers.SerializerMethodField()
    lastChecked = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()
    uptime = serializers.SerializerMethodField()
    incidents = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = [
            'id', 'name', 'url', 'created_at', 'slug', 'check_interval',
            'status', 'responseTime', 'lastChecked', 'history', 'uptime', 'incidents'
        ]
        read_only_fields = ['slug']

    def get_status(self, obj):
        latest_check = Check.objects.filter(site=obj).order_by('-checked_at').first()
        return latest_check.status if latest_check else "pending"

    def get_responseTime(self, obj):
        latest_check = Check.objects.filter(site=obj).order_by('-checked_at').first()
        
        if latest_check and latest_check.response_time is not None:
            return int(latest_check.response_time)
        
        return None

    def get_lastChecked(self, obj):
        latest_check = Check.objects.filter(site=obj).order_by('-checked_at').first()
        if latest_check:
            return latest_check.checked_at.strftime("%H:%M:%S")
        return "never"

    def get_history(self, obj):
        recent_checks = Check.objects.filter(site=obj).order_by('-checked_at')[:36]
        return [1 if c.status == "up" else 0 for c in reversed(recent_checks)]

    def get_uptime(self, obj):
        all_checks = Check.objects.filter(site=obj)
        if not all_checks.exists():
            return 100.0
        up_count = all_checks.filter(status="up").count()
        return round((up_count / all_checks.count()) * 100, 2)

    def get_incidents(self, obj):
        return Incident.objects.filter(site=obj, resolved_at__isnull=True).count()