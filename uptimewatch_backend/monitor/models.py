from django.db import models

class Site(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()
    slug = models.SlugField(unique=True)
    check_interval = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Check(models.Model):
    STATUS_CHOICES = [('up', 'Up'), ('down', 'Down')]
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    response_time = models.FloatField(null=True)
    status_code = models.IntegerField(null=True)
    checked_at = models.DateTimeField(auto_now_add=True)

class Incident(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    started_at = models.DateTimeField()
    resolved_at = models.DateTimeField(null=True)