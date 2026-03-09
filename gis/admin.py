from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import Region, ResidentLocation

@admin.register(Region)
class RegionAdmin(GISModelAdmin):
    list_display = ('name', 'region_type', 'created_at')
    list_filter = ('region_type',)
    search_fields = ('name',)

@admin.register(ResidentLocation)
class ResidentLocationAdmin(GISModelAdmin):
    list_display = ('name', 'nik', 'region', 'created_at')
    list_filter = ('region',)
    search_fields = ('name', 'nik')
