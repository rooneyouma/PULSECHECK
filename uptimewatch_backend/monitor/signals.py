from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_celery_beat.models import PeriodicTask, IntervalSchedule

class Site(models.Model):
    name = models.CharField(max_index=100)
    url = models.URLField()
    # Let's say you store check_interval in minutes (e.g., 5)
    check_interval = models.IntegerField(default=1) 

# Production Signal Automation
@receiver(post_save, sender=Site)
def setup_site_periodic_task(sender, instance, created, **kwargs):
    # 1. Get or create a 5-minute interval definition
    schedule, _ = IntervalSchedule.objects.get_or_create(
        every=instance.check_interval,
        period=IntervalSchedule.MINUTES,
    )
    
    # 2. Bind the specific task execution payload to this site's ID
    PeriodicTask.objects.update_or_create(
        name=f"Ping Site ID {instance.id}: {instance.name}",
        defaults={
            'interval': schedule,
            'task': 'monitor.tasks.check_site', # Your single site ping task!
            'args': f"[{instance.id}]", # Passes the site_id as an argument
        }
    )

@receiver(post_delete, sender=Site)
def cleanup_site_periodic_task(sender, instance, **kwargs):
    # Automatically wipe out the scheduler track if a monitor is deleted
    PeriodicTask.objects.filter(name=f"Ping Site ID {instance.id}: {instance.name}").delete()