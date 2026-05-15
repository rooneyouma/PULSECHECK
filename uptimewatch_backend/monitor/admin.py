from django.contrib import admin
from .models import Site, Check, Incident

admin.site.register(Site)
admin.site.register(Check)
admin.site.register(Incident)