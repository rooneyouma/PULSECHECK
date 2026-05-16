from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, StatusPageViewSet, IncidentViewSet

router = DefaultRouter()
router.register(r"sites", SiteViewSet, basename="site")
router.register(r"status", StatusPageViewSet, basename="status")
router.register(r"incidents", IncidentViewSet, basename="incident")

urlpatterns = [
    path("", include(router.urls)),
]