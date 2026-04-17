from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    CaptchaView,
    RegisterView,
    LandingPageSettingViewSet,
    AdminUserViewSet,
    BeritaViewSet,
    PejabatDesaViewSet,
    AbsensiScanView,
    KehadiranViewSet,
    AbsensiExportExcelView,
    UsulanMusrenbangViewSet,
    RencanaAnggaranViewSet,
    DokumenDEDViewSet,
    DokumenPerencanaanViewSet,
    AspirasiWargaViewSet,
    ProgramPembinaanViewSet,
    JadwalGotongRoyongViewSet,
    ProyekMonitoringViewSet,
    KegiatanLPMViewSet,
    PengurusLPMViewSet,
    UserMeView,
    ChangePasswordView,
    CatatanKeuanganLPMViewSet,
    InventarisLPMViewSet,
    PeminjamanAlatViewSet,
    KaderLPMViewSet,
    PresensiKegiatanLPMViewSet,
    LaporanDigitalLPMViewSet,
    GaleriProyekLPMViewSet,
    LPMDashboardStatsView,
    HealthCheckView
)

router = DefaultRouter()
router.register(r'landing-page', LandingPageSettingViewSet, basename='landing-page')
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'berita', BeritaViewSet, basename='berita')
router.register(r'pejabat-desa', PejabatDesaViewSet, basename='pejabat-desa')
router.register(r'kehadiran', KehadiranViewSet, basename='kehadiran')
router.register(r'musrenbang', UsulanMusrenbangViewSet, basename='musrenbang')
router.register(r'proyek', UsulanMusrenbangViewSet, basename='proyek')
router.register(r'monitoring-proyek', ProyekMonitoringViewSet, basename='monitoring-proyek')
router.register(r'kegiatan-lpm', KegiatanLPMViewSet, basename='kegiatan-lpm')
router.register(r'pengurus-lpm', PengurusLPMViewSet, basename='pengurus-lpm')
router.register(r'dokumen-ded', DokumenDEDViewSet, basename='dokumen-ded')
router.register(r'dokumen-perencanaan', DokumenPerencanaanViewSet, basename='dokumen-perencanaan')
router.register(r'aspirasi', AspirasiWargaViewSet, basename='aspirasi')
router.register(r'program-pembinaan', ProgramPembinaanViewSet, basename='program-pembinaan')
router.register(r'gotong-royong', JadwalGotongRoyongViewSet, basename='gotong-royong')
router.register(r'rab', RencanaAnggaranViewSet, basename='rab')

# LPM Extended Modules
router.register(r'lpm/keuangan', CatatanKeuanganLPMViewSet, basename='lpm-keuangan')
router.register(r'lpm/inventaris', InventarisLPMViewSet, basename='lpm-inventaris')
router.register(r'lpm/peminjaman', PeminjamanAlatViewSet, basename='lpm-peminjaman')
router.register(r'lpm/kader', KaderLPMViewSet, basename='lpm-kader')
router.register(r'lpm/presensi', PresensiKegiatanLPMViewSet, basename='lpm-presensi')
router.register(r'lpm/laporan', LaporanDigitalLPMViewSet, basename='lpm-laporan')
router.register(r'lpm/galeri', GaleriProyekLPMViewSet, basename='lpm-galeri')

urlpatterns = [
    # Auth
    re_path(r'^api/captcha/?$', CaptchaView.as_view(), name='captcha'),
    re_path(r'^api/register/?$', RegisterView.as_view(), name='register'),
    path('api/health/', HealthCheckView.as_view(), name='health'),
    
    # JWT Auth
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Landing Page Settings (includes CRUD based on viewset router)
    path('api/', include(router.urls)),

    # Admin Master User Management
    # endpoint user = /api/admin/users/ dan /api/admin/users/<id>/reset-password/

    # Kiosk Absensi Endpoint
    re_path(r'^api/absensi/scan/?$', AbsensiScanView.as_view(), name='absensi_scan'),
    re_path(r'^api/absensi/export-excel/?$', AbsensiExportExcelView.as_view(), name='absensi_export_excel'),

    # User Profile Endpoints
    path('api/users/me/', UserMeView.as_view(), name='user_me'),
    path('api/users/change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Dashboard Stats
    path('api/lpm/stats/', LPMDashboardStatsView.as_view(), name='lpm_stats'),
]
