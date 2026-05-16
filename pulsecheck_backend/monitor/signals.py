from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_celery_beat.models import PeriodicTask, IntervalSchedule

class Site(models.Model):
    name = models.CharField(max_index=100)
    url = models.URLField()
    check_interval = models.IntegerField(default=1) 


@receiver(post_save, sender=Site)
def setup_site_periodic_task(sender, instance, created, **kwargs):
    
    schedule, _ = IntervalSchedule.objects.get_or_create(
        every=instance.check_interval,
        period=IntervalSchedule.MINUTES,
    )
    
   
    PeriodicTask.objects.update_or_create(
        name=f"Ping Site ID {instance.id}: {instance.name}",
        defaults={
            'interval': schedule,
            'task': 'monitor.tasks.check_site', 
            'args': f"[{instance.id}]", 
        }
    )

@receiver(post_delete, sender=Site)
def cleanup_site_periodic_task(sender, instance, **kwargs):
    PeriodicTask.objects.filter(name=f"Ping Site ID {instance.id}: {instance.name}").delete()