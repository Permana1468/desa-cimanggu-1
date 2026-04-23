from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, LandingPageSetting, Berita, PejabatDesa, Kehadiran,
    UsulanMusrenbang, RencanaAnggaran, DokumenDED, DokumenPerencanaan,
    AspirasiWarga, ProgramPembinaan, JadwalGotongRoyong, KegiatanLPM, PengurusLPM
)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'unit_detail', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Informasi Tambahan', {'fields': ('role', 'unit_detail', 'nama_lengkap', 'nomor_telepon')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informasi Tambahan', {'fields': ('role', 'unit_detail', 'nama_lengkap', 'nomor_telepon')}),
    )

@admin.register(LandingPageSetting)
class LandingPageSettingAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'contact_email')
    list_filter = ('is_active',)

@admin.register(Berita)
class BeritaAdmin(admin.ModelAdmin):
    list_display = ('judul', 'kategori', 'created_at', 'views')
    list_filter = ('kategori',)
    search_fields = ('judul', 'konten')

@admin.register(PejabatDesa)
class PejabatDesaAdmin(admin.ModelAdmin):
    list_display = ('nama', 'jabatan', 'level', 'id_unik')
    list_filter = ('level',)
    search_fields = ('nama', 'jabatan')

@admin.register(Kehadiran)
class KehadiranAdmin(admin.ModelAdmin):
    list_display = ('pejabat', 'waktu_masuk', 'waktu_pulang', 'status')
    list_filter = ('status', 'waktu_masuk')

@admin.register(UsulanMusrenbang)
class UsulanMusrenbangAdmin(admin.ModelAdmin):
    list_display = ('usulan_id', 'judul', 'pengusul', 'status', 'created_at')
    list_filter = ('status', 'kewenangan')
    search_fields = ('judul', 'deskripsi', 'usulan_id')

@admin.register(RencanaAnggaran)
class RencanaAnggaranAdmin(admin.ModelAdmin):
    list_display = ('usulan', 'grand_total', 'status', 'updated_at')
    list_filter = ('status',)

@admin.register(AspirasiWarga)
class AspirasiWargaAdmin(admin.ModelAdmin):
    list_display = ('nama_warga', 'kategori', 'status', 'tanggal')
    list_filter = ('status', 'kategori')

@admin.register(ProgramPembinaan)
class ProgramPembinaanAdmin(admin.ModelAdmin):
    list_display = ('judul', 'kategori', 'tanggal_pelaksanaan', 'status')
    list_filter = ('status', 'kategori')

@admin.register(JadwalGotongRoyong)
class JadwalGotongRoyongAdmin(admin.ModelAdmin):
    list_display = ('judul', 'tanggal', 'waktu', 'status')
    list_filter = ('status',)

@admin.register(KegiatanLPM)
class KegiatanLPMAdmin(admin.ModelAdmin):
    list_display = ('judul', 'kategori', 'tanggal', 'status', 'unit_lpm')
    list_filter = ('status', 'kategori')

@admin.register(PengurusLPM)
class PengurusLPMAdmin(admin.ModelAdmin):
    list_display = ('nama', 'jabatan', 'unit_lpm', 'is_active')
    list_filter = ('is_active', 'jabatan')

@admin.register(DokumenPerencanaan)
class DokumenPerencanaanAdmin(admin.ModelAdmin):
    list_display = ('judul', 'jenis', 'periode', 'status')
    list_filter = ('jenis', 'status')

@admin.register(DokumenDED)
class DokumenDEDAdmin(admin.ModelAdmin):
    list_display = ('nama_file', 'proyek', 'uploaded_at')

admin.site.register(CustomUser, CustomUserAdmin)
