from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Region, ResidentLocation

class RegionSerializer(GeoFeatureModelSerializer):
    """ A class to serialize locations as GeoJSON compatible data """
    
    class Meta:
        model = Region
        geo_field = "boundary" # This field will be converted to GeoJSON geometry
        
        # fields to include in 'properties' of GeoJSON
        fields = ('id', 'name', 'region_type', 'created_at', 'updated_at')

class ResidentLocationSerializer(GeoFeatureModelSerializer):
    """ A class to serialize points as GeoJSON compatible data """
    
    # Nested representation if needed, or just ID
    region_name = serializers.CharField(source='region.name', read_only=True)

    class Meta:
        model = ResidentLocation
        geo_field = "location"

        fields = ('id', 'name', 'nik', 'region', 'region_name', 'created_at', 'updated_at')
