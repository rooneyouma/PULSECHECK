from django.contrib import admin
from .models import Site, Check, Incident, Configuration

admin.site.register(Site)
admin.site.register(Check)
admin.site.register(Incident)
admin.site.register(Configuration)