from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteViewSet, StatusPageViewSet

router = DefaultRouter()
router.register(r"sites", SiteViewSet, basename="site")
router.register(r"status", StatusPageViewSet, basename="status")

urlpatterns = [
    path("", include(router.urls)),
]