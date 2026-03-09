from django.contrib.gis.db import models

class Region(models.Model):
    REGION_TYPES = (
        ('KADUS', 'Dusun'),
        ('RW', 'Rukun Warga'),
        ('RT', 'Rukun Tetangga'),
    )
    
    name = models.CharField(max_length=100, help_text="Contoh: 'RW 01' atau 'Kadus Mawar'")
    region_type = models.CharField(max_length=10, choices=REGION_TYPES)
    
    # Polygon or MultiPolygon for boundary
    # srid=4326 is standard for WGS84 (GPS coordinates)
    boundary = models.PolygonField(srid=4326, blank=True, null=True, help_text="Batas koordinat wilayah (Polygon)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_region_type_display()} - {self.name}"

class ResidentLocation(models.Model):
    name = models.CharField(max_length=255, help_text="Nama Kepala Keluarga atau Bangunan")
    nik = models.CharField(max_length=16, blank=True, null=True, help_text="Opsional, NIK Kepala Keluarga")
    
    # Point for specific location
    location = models.PointField(srid=4326, help_text="Titik koordinat rumah/lokasi (Point)")
    
    # Optional relation to region
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, related_name='residents')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
