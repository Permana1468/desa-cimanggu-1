from rest_framework import viewsets, permissions
from .models import Region, ResidentLocation
from .serializers import RegionSerializer, ResidentLocationSerializer
from users.views import IsAdminUser

class RegionViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Regions (Dusun, RW, RT).
    Output format: GeoJSON points/polygons.
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

    def get_permissions(self):
        # Anyone can view map boundaries -> AllowAny
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # Only ADMIN or specific roles can modify boundaries -> IsAdminUser
        return [IsAdminUser()]

class ResidentLocationViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Resident Locations (Houses, Kepala Keluarga).
    Output format: GeoJSON points.
    """
    queryset = ResidentLocation.objects.all()
    serializer_class = ResidentLocationSerializer

    def get_permissions(self):
        # For privacy, only authorized users (Admin, Sekdes, RT, etc) should view/edit residents
        # Here we restrict access entirely to Admin for now, but could be customized
        return [IsAdminUser()]
