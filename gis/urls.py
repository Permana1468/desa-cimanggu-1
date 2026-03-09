from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, ResidentLocationViewSet

router = DefaultRouter()
router.register(r'regions', RegionViewSet, basename='regions')
router.register(r'residents', ResidentLocationViewSet, basename='residents')

urlpatterns = [
    path('api/gis/', include(router.urls)),
]
