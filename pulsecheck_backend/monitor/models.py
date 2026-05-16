from django.db import models
from django.utils.text import slugify

class Site(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    check_interval = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 2
            # Keep incrementing until we find a slug that isn't taken
            while Site.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


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

class Configuration(models.Model):
    alert_email = models.EmailField(default="admin@pulsecheck.com")

    def save(self, *args, **kwargs):
        self.pk = 1 
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Alert Email ({self.alert_email})"