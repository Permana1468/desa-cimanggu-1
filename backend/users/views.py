from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from django.http import HttpResponse
from django.core import signing
import random
import openpyxl
import os
from .models import CustomUser, LandingPageSetting, Berita, PejabatDesa, Kehadiran, UsulanMusrenbang, RencanaAnggaran, RencanaAnggaranItem
from .serializers import (UserSerializer, LandingPageSettingSerializer, 
                          AdminUserResetPasswordSerializer, CustomTokenObtainPairSerializer,
                          BeritaSerializer, PejabatDesaSerializer, KehadiranSerializer,
                          UsulanMusrenbangSerializer, RencanaAnggaranSerializer, RencanaAnggaranItemSerializer,
                          UserProfileSerializer, ChangePasswordSerializer, RegisterSerializer)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # CAPTCHA Validation for Login
        captcha_token = request.data.get('captcha_token')
        captcha_answer = request.data.get('captcha_answer')

        if not captcha_token or not captcha_answer:
            return Response({"detail": "CAPTCHA wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the signed token
            expected_answer = signing.loads(captcha_token, max_age=300) # Valid for 5 mins
            if str(expected_answer) != str(captcha_answer):
                return Response({"detail": "Jawaban CAPTCHA salah."}, status=status.HTTP_400_BAD_REQUEST)
        except signing.SignatureExpired:
            return Response({"detail": "CAPTCHA sudah kadaluarsa (5 menit). Silakan coba lagi."}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({"detail": "Token CAPTCHA tidak valid."}, status=status.HTTP_400_BAD_REQUEST)

        return super().post(request, *args, **kwargs)

class CaptchaView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Generate random simple math problem
        a = random.randint(1, 20)
        b = random.randint(1, 20)
        operation = "+" # We can randomize this later if needed
        answer = a + b
        
        # Sign the answer into a token
        token = signing.dumps(answer)
        
        return Response({
            "question": f"{a} {operation} {b} = ?",
            "captcha_token": token
        })

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        # CAPTCHA Validation for Register
        captcha_token = request.data.get('captcha_token')
        captcha_answer = request.data.get('captcha_answer')

        if not captcha_token or not captcha_answer:
            return Response({"detail": "CAPTCHA wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            expected_answer = signing.loads(captcha_token, max_age=300)
            if str(expected_answer) != str(captcha_answer):
                return Response({"detail": "Jawaban CAPTCHA salah."}, status=status.HTTP_400_BAD_REQUEST)
        except signing.SignatureExpired:
            return Response({"detail": "CAPTCHA sudah kadaluarsa. Silakan refresh."}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({"detail": "Token CAPTCHA tidak valid."}, status=status.HTTP_400_BAD_REQUEST)

        return super().post(request, *args, **kwargs)

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow ADMIN roles to access.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

# ----------------------------------------------------
# Landing Page Settings API
# ----------------------------------------------------
class LandingPageSettingViewSet(viewsets.ModelViewSet):
    """
    CRUD API for LandingPageSetting.
    Anyone can GET, but only ADMIN can POST/PUT/PATCH/DELETE.
    """
    serializer_class = LandingPageSettingSerializer

    def get_queryset(self):
        # Selalu pastikan ada 1 record aktif, lalu kembalikan
        obj, created = LandingPageSetting.objects.get_or_create(is_active=True)
        return LandingPageSetting.objects.filter(id=obj.id)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def get_object(self):
        # Memastikan hanya setting aktif yang diakses
        obj, created = LandingPageSetting.objects.get_or_create(is_active=True)
        return obj

# ----------------------------------------------------
# Admin User Management API
# ----------------------------------------------------
from rest_framework.decorators import action

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Admin Master to manage CustomUsers.
    """
    queryset = CustomUser.objects.all().order_by('-id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        user = self.get_object()
        
        # User input (misalnya lewat modal custom reset)
        if request.data and 'new_password' in request.data:
            serializer = AdminUserResetPasswordSerializer(data=request.data)
            if serializer.is_valid():
                new_password = serializer.validated_data['new_password']
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Tolak request jika tidak mengirimkan password baru, untuk menghindari celah keamanan.
            return Response({"new_password": ["Password baru wajib diisi."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": f"Password untuk user '{user.username}' berhasil direset."}, status=status.HTTP_200_OK)


# ----------------------------------------------------
# Berita API
# ----------------------------------------------------
class BeritaViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Berita.
    Public can GET (list, retrieve). Only ADMIN can edit.
    """
    queryset = Berita.objects.all().order_by('-created_at')
    serializer_class = BeritaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

# ----------------------------------------------------
# Pejabat Desa API
# ----------------------------------------------------
class PejabatDesaViewSet(viewsets.ModelViewSet):
    """
    CRUD API for PejabatDesa (Struktur Organisasi).
    Public can GET (list, retrieve). Only ADMIN can edit.
    """
    queryset = PejabatDesa.objects.all().order_by('level', 'id')
    serializer_class = PejabatDesaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]
# ----------------------------------------------------
# Absensi / Kehadiran API
# ----------------------------------------------------
class AbsensiScanView(APIView):
    """
    API for Kiosk Barcode Scanner to record attendance.
    """
    permission_classes = [permissions.AllowAny] # Access controlled via X-API-KEY header

    def post(self, request):
        kiosk_api_key = os.getenv('KIOSK_API_KEY')
        
        # Validasi API Key Kiosk
        if kiosk_api_key:
            provided_key = request.headers.get('X-API-KEY')
            if not provided_key or provided_key != kiosk_api_key:
                return Response({"error": "Unauthorized Kiosk Access. Invalid or missing X-API-KEY header."}, status=status.HTTP_401_UNAUTHORIZED)

        id_unik = request.data.get('id_unik')
        if not id_unik:
            return Response({"error": "ID Unik tidak ditemukan di request."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pejabat = PejabatDesa.objects.get(id_unik=id_unik)
        except PejabatDesa.DoesNotExist:
            return Response({"error": "ID Tidak Dikenali."}, status=status.HTTP_404_NOT_FOUND)

        # Cari attendance record untuk hari ini (beradasarkan tanggal lokal)
        today = timezone.localtime().date()
        kehadiran_hari_ini = Kehadiran.objects.filter(pejabat=pejabat, waktu_masuk__date=today).last()

        if kehadiran_hari_ini:
            # Jika sudah absen masuk, berarti ini absen pulang
            if kehadiran_hari_ini.waktu_pulang:
                return Response({
                    "message": f"Anda sudah melakukan absen pulang hari ini.",
                    "pejabat": pejabat.nama,
                    "status": "ALREADY_DONE"
                }, status=status.HTTP_200_OK)
            else:
                kehadiran_hari_ini.waktu_pulang = timezone.now()
                kehadiran_hari_ini.save()
                return Response({
                    "message": f"Berhasil Absen Pulang: {pejabat.nama}",
                    "pejabat": pejabat.nama,
                    "waktu": kehadiran_hari_ini.waktu_pulang.strftime("%H:%M:%S"),
                    "status": "PULANG"
                }, status=status.HTTP_200_OK)
        else:
            # Belum absen masuk
            baru = Kehadiran.objects.create(pejabat=pejabat)
            return Response({
                "message": f"Berhasil Absen Masuk: {pejabat.nama}",
                "pejabat": pejabat.nama,
                "waktu": baru.waktu_masuk.strftime("%H:%M:%S"),
                "status": "MASUK"
            }, status=status.HTTP_200_OK)

class KehadiranViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for viewing Attendance records (Read Only for Admin).
    """
    serializer_class = KehadiranSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Kehadiran.objects.select_related('pejabat').all().order_by('-waktu_masuk')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        jabatan = self.request.query_params.get('jabatan')

        if start_date:
            queryset = queryset.filter(waktu_masuk__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(waktu_masuk__date__lte=end_date)
        
        if jabatan and jabatan != "Semua Perangkat" and jabatan != "":
            if jabatan == "Kades & Sekdes":
                queryset = queryset.filter(pejabat__level__in=[1, 2])
            elif jabatan == "Kasi / Kaur":
                queryset = queryset.filter(pejabat__level=3)
            elif jabatan == "Kepala Dusun":
                queryset = queryset.filter(pejabat__level=4)
                
        return queryset

class AbsensiExportExcelView(APIView):
    """
    API for exporting attendance records to Excel.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        jabatan = request.query_params.get('jabatan')

        queryset = Kehadiran.objects.select_related('pejabat').all().order_by('-waktu_masuk')

        if start_date:
            queryset = queryset.filter(waktu_masuk__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(waktu_masuk__date__lte=end_date)
        
        if jabatan and jabatan != "Semua Perangkat" and jabatan != "":
            if jabatan == "Kades & Sekdes":
                queryset = queryset.filter(pejabat__level__in=[1, 2])
            elif jabatan == "Kasi / Kaur":
                queryset = queryset.filter(pejabat__level=3)
            elif jabatan == "Kepala Dusun":
                queryset = queryset.filter(pejabat__level=4)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Rekap Absensi"

        headers = ["Tanggal", "Nama Pegawai", "Jabatan", "Jam Masuk", "Jam Pulang", "Status"]
        ws.append(headers)

        for record in queryset:
            # Mengubah UTC timezone ke localtime
            waktu_masuk_local = timezone.localtime(record.waktu_masuk) if record.waktu_masuk else None
            waktu_pulang_local = timezone.localtime(record.waktu_pulang) if record.waktu_pulang else None

            tanggal = waktu_masuk_local.strftime("%Y-%m-%d") if waktu_masuk_local else "-"
            nama = record.pejabat.nama if record.pejabat else "-"
            jab_str = record.pejabat.jabatan if record.pejabat else "-"
            jam_masuk = waktu_masuk_local.strftime("%H:%M:%S") if waktu_masuk_local else "-"
            jam_pulang = waktu_pulang_local.strftime("%H:%M:%S") if waktu_pulang_local else "-"
            
            # Simple status logic: if Masuk > 08:00
            status_absen = "Hadir Tepat Waktu"
            if waktu_masuk_local and waktu_masuk_local.hour >= 8:
                if waktu_masuk_local.hour == 8 and waktu_masuk_local.minute > 0:
                    status_absen = "Terlambat"
                elif waktu_masuk_local.hour > 8:
                    status_absen = "Terlambat"

            ws.append([tanggal, nama, jab_str, jam_masuk, jam_pulang, status_absen])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=Laporan_Absensi_CimangguI.xlsx'
        wb.save(response)
        return response

class UsulanMusrenbangViewSet(viewsets.ModelViewSet):
    """
    API for LPM to manage their Musrenbang proposals and Admin to oversee them.
    """
    serializer_class = UsulanMusrenbangSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'KAUR_PERENCANAAN', 'KAUR_KEUANGAN', 'KASI_KESEJAHTERAAN']:
            return UsulanMusrenbang.objects.all()
        return UsulanMusrenbang.objects.filter(pengusul=user)

    def perform_create(self, serializer):
        # Otomatis ambil lokasi dari unit_detail user (misal: "Dusun II")
        # dan set pengusul ke user yang sedang login
        serializer.save(
            pengusul=self.request.user,
            lokasi=self.request.user.unit_detail or "Lokasi tidak ditentukan"
        )

    @action(detail=True, methods=['patch'])
    def approval(self, request, pk=None):
        """
        Custom action for Admin/Kaur to approve or reject proposals.
        """
        user = request.user
        if user.role not in ['ADMIN', 'KAUR_PERENCANAAN']:
            return Response({"detail": "Only Admin or Kaur Perencanaan can approve proposals."}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        new_status = request.data.get('status')
        kewenangan = request.data.get('kewenangan')
        catatan = request.data.get('catatan_verifikator', '')

        if new_status not in ['DISETUJUI', 'DITOLAK']:
            return Response({"detail": "Invalid status. Must be 'DISETUJUI' or 'DITOLAK'."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Jika status DISETUJUI, maka kewenangan wajib ada
        if new_status == 'DISETUJUI' and not kewenangan:
            return Response({"detail": "Kewenangan wajib dipilih saat menyetujui usulan."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        instance.status = new_status
        instance.kewenangan = kewenangan
        instance.catatan_verifikator = catatan
        instance.save()
        
        return Response({
            "detail": f"Usulan berhasil di-{new_status.lower()}.",
            "status": instance.status,
            "kewenangan": instance.kewenangan
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def update_progres(self, request, pk=None):
        """
        Custom action for Kasi Kesejahteraan to report progress.
        """
        user = request.user
        if user.role not in ['ADMIN', 'KASI_KESEJAHTERAAN']:
            return Response({"detail": "Only Admin or Kasi Kesejahteraan can update progress."}, 
                            status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        # Support both 'progres_persen' (requested by user) and 'progres_fisik'
        progres = request.data.get('progres_persen') or request.data.get('progres_fisik')
        
        if progres is not None:
            instance.progres_fisik = int(progres)
            if instance.progres_fisik >= 100:
                instance.status = 'SELESAI'
        
        # Handle optional photos
        if 'foto_1' in request.FILES: instance.foto_1 = request.FILES['foto_1']
        if 'foto_2' in request.FILES: instance.foto_2 = request.FILES['foto_2']
        if 'foto_3' in request.FILES: instance.foto_3 = request.FILES['foto_3']
        
        instance.save()
        return Response({
            "detail": "Progres fisik berhasil diperbarui.",
            "progres_fisik": instance.progres_fisik,
            "status": instance.status
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def cairkan(self, request, pk=None):
        """
        Custom action for Kaur Keuangan to disburse funds.
        Status: MENUNGGU_PENCAIRAN -> PELAKSANAAN
        """
        user = request.user
        if user.role not in ['ADMIN', 'KAUR_KEUANGAN']:
            return Response({"detail": "Hanya Admin atau Kaur Keuangan yang dapat mencairkan dana."}, 
                            status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        
        if instance.status != 'MENUNGGU_PENCAIRAN':
            return Response({"detail": "Hanya proyek dengan status Menunggu Pencairan yang dapat dicairkan."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        instance.status = 'PELAKSANAAN'
        instance.save()
        
        return Response({
            "detail": f"Dana untuk {instance.usulan_id} berhasil dicairkan. Status proyek kini: PELAKSANAAN.",
            "status": instance.status
        }, status=status.HTTP_200_OK)

class RencanaAnggaranViewSet(viewsets.ModelViewSet):
    """
    API for managing Budget Plans (RAB).
    Supports writable nested items for bulk updates.
    """
    queryset = RencanaAnggaran.objects.all().prefetch_related('items')
    serializer_class = RencanaAnggaranSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtering based on usulan_id if provided in query params
        queryset = super().get_queryset()
        usulan_id = self.request.query_params.get('usulan_id')
        if usulan_id:
            queryset = queryset.filter(usulan__id=usulan_id)
        return queryset

from rest_framework.parsers import MultiPartParser, FormParser
from .models import DokumenDED
from .serializers import DokumenDEDSerializer

class DokumenDEDViewSet(viewsets.ModelViewSet):
    """
    API for managing DED documents (PDF/Images).
    Uses MultiPartParser to accept file uploads via FormData.
    """
    queryset = DokumenDED.objects.all()
    serializer_class = DokumenDEDSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset()
        proyek_id = self.request.query_params.get('proyek_id')
        if proyek_id:
            queryset = queryset.filter(proyek_id=proyek_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

from .models import DokumenPerencanaan, AspirasiWarga, ProgramPembinaan, JadwalGotongRoyong, KegiatanLPM, PengurusLPM
from .serializers import DokumenPerencanaanSerializer, AspirasiWargaSerializer, ProgramPembinaanSerializer, JadwalGotongRoyongSerializer, ProyekMonitoringSerializer, KegiatanLPMSerializer, PengurusLPMSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class DokumenPerencanaanViewSet(viewsets.ModelViewSet):
    """
    API for managing Master Planning Documents (RPJMDes/RKPDes).
    Uses MultiPartParser to accept PDF file uploads.
    """
    queryset = DokumenPerencanaan.objects.all()
    serializer_class = DokumenPerencanaanSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = super().get_queryset()
        jenis = self.request.query_params.get('jenis')
        if jenis:
            queryset = queryset.filter(jenis=jenis)
        return queryset

class AspirasiWargaViewSet(viewsets.ModelViewSet):
    """
    API for Citizen Aspirations.
    - POST /kirim/: Public submission (AllowAny).
    - GET /: Restricted to LPM (filtered by unit_detail).
    """
    queryset = AspirasiWarga.objects.all()
    serializer_class = AspirasiWargaSerializer

    def get_permissions(self):
        if self.action == 'kirim':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return AspirasiWarga.objects.none()
        
        # Admin/Kaur can see all
        if user.role in ['ADMIN', 'KAUR_PERENCANAAN']:
            return AspirasiWarga.objects.all()
        
        # LPM only sees their own territory
        return AspirasiWarga.objects.filter(wilayah_tujuan=user.unit_detail)

    @action(detail=False, methods=['post'])
    def kirim(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProgramPembinaanViewSet(viewsets.ModelViewSet):
    """
    API for LPM Community Development Programs.
    - Multi-tenancy filtering based on LPM unit.
    - Auto-set penyelenggara_wilayah on create.
    """
    queryset = ProgramPembinaan.objects.all()
    serializer_class = ProgramPembinaanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return ProgramPembinaan.objects.all()
        return ProgramPembinaan.objects.filter(penyelenggara_wilayah=user.unit_detail)

    def perform_create(self, serializer):
        serializer.save(penyelenggara_wilayah=self.request.user.unit_detail)

class JadwalGotongRoyongViewSet(viewsets.ModelViewSet):
    """
    API for community service schedules (Gotong Royong).
    - Public access via action 'publik'.
    - Restricted access for LPM management.
    """
    queryset = JadwalGotongRoyong.objects.all()
    serializer_class = JadwalGotongRoyongSerializer

    def get_permissions(self):
        if self.action == 'publik':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'publik':
            # Public only sees upcoming schedules
            return JadwalGotongRoyong.objects.filter(status__in=['Akan Datang', 'Berjalan']).order_by('tanggal')
        
        if not user.is_authenticated:
            return JadwalGotongRoyong.objects.none()

        if user.role == 'ADMIN':
            return JadwalGotongRoyong.objects.all()
            
        return JadwalGotongRoyong.objects.filter(penyelenggara_wilayah=user.unit_detail)

    def perform_create(self, serializer):
        serializer.save(penyelenggara_wilayah=self.request.user.unit_detail)

    @action(detail=False, methods=['get'])
    def publik(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ProyekMonitoringViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API for LPM to monitor project progress.
    Filters only projects in 'PELAKSANAAN' or 'SELESAI' status.
    """
    queryset = UsulanMusrenbang.objects.filter(status__in=['PELAKSANAAN', 'SELESAI']).order_by('-updated_at')
    serializer_class = ProyekMonitoringSerializer
    permission_classes = [permissions.IsAuthenticated]

class KegiatanLPMViewSet(viewsets.ModelViewSet):
    """
    API for LPM to manage their own activity records.
    Multi-tenancy: Each LPM unit can only see and manage their own activities.
    The 'unit_lpm' field is automatically filled from request.user.unit_detail on creation.
    """
    serializer_class = KegiatanLPMSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin can see all, LPM only sees their own unit's data
        if user.role == 'ADMIN':
            return KegiatanLPM.objects.all()
        unit = getattr(user, 'unit_detail', None)
        if unit:
            return KegiatanLPM.objects.filter(unit_lpm=unit)
        return KegiatanLPM.objects.none()

    def perform_create(self, serializer):
        # Auto-fill unit_lpm from backend, never trust data from frontend
        unit = getattr(self.request.user, 'unit_detail', '') or ''
        serializer.save(unit_lpm=unit)

class PengurusLPMViewSet(viewsets.ModelViewSet):
    """
    API for LPM to manage their board member records.
    Multi-tenancy: Each LPM unit can only see and manage their own board members.
    The 'unit_lpm' field is automatically filled from request.user.unit_detail on creation.
    """
    serializer_class = PengurusLPMSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin can see all, LPM only sees their own unit's data
        if user.role == 'ADMIN':
            return PengurusLPM.objects.all()
        unit = getattr(user, 'unit_detail', None)
        if unit:
            return PengurusLPM.objects.filter(unit_lpm=unit)
        return PengurusLPM.objects.none()

    def perform_create(self, serializer):
        # Auto-fill unit_lpm from backend, never trust data from frontend
        unit = getattr(self.request.user, 'unit_detail', '') or ''
        serializer.save(unit_lpm=unit)


class UserMeView(APIView):
    """
    GET  /api/users/me/  -> Return current logged-in user's profile data.
    PATCH /api/users/me/ -> Update nama_lengkap, nomor_telepon, and/or email.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    POST /api/users/change-password/
    Validates password_lama with check_password() before setting the new one.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        password_lama = serializer.validated_data['password_lama']
        password_baru = serializer.validated_data['password_baru']

        # Validate old password first
        if not user.check_password(password_lama):
            return Response(
                {'password_lama': 'Password lama yang Anda masukkan tidak benar.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password_baru)
        user.save()
        return Response({'detail': 'Password berhasil diubah. Silakan login kembali.'}, status=status.HTTP_200_OK)

from .models import CatatanKeuanganLPM, InventarisLPM, PeminjamanAlat, KaderLPM, PresensiKegiatanLPM, LaporanDigitalLPM, GaleriProyekLPM
from .serializers import CatatanKeuanganLPMSerializer, InventarisLPMSerializer, PeminjamanAlatSerializer, KaderLPMSerializer, PresensiKegiatanLPMSerializer, LaporanDigitalLPMSerializer, GaleriProyekLPMSerializer

class BaseLPMViewSet(viewsets.ModelViewSet):
    """
    Base viewset for LPM that handles multi-tenancy based on user.unit_detail.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return self.queryset.all()
        unit = getattr(user, 'unit_detail', None)
        if unit:
            return self.queryset.filter(unit_lpm=unit)
        return self.queryset.none()

    def perform_create(self, serializer):
        unit = getattr(self.request.user, 'unit_detail', '') or ''
        serializer.save(unit_lpm=unit)

class CatatanKeuanganLPMViewSet(BaseLPMViewSet):
    queryset = CatatanKeuanganLPM.objects.all()
    serializer_class = CatatanKeuanganLPMSerializer
    parser_classes = (MultiPartParser, FormParser) # For file_bukti

class InventarisLPMViewSet(BaseLPMViewSet):
    queryset = InventarisLPM.objects.all()
    serializer_class = InventarisLPMSerializer

class PeminjamanAlatViewSet(BaseLPMViewSet):
    queryset = PeminjamanAlat.objects.all()
    serializer_class = PeminjamanAlatSerializer

class KaderLPMViewSet(BaseLPMViewSet):
    queryset = KaderLPM.objects.all()
    serializer_class = KaderLPMSerializer

class PresensiKegiatanLPMViewSet(BaseLPMViewSet):
    queryset = PresensiKegiatanLPM.objects.all()
    serializer_class = PresensiKegiatanLPMSerializer
    parser_classes = (MultiPartParser, FormParser)

class LaporanDigitalLPMViewSet(BaseLPMViewSet):
    queryset = LaporanDigitalLPM.objects.all()
    serializer_class = LaporanDigitalLPMSerializer
    parser_classes = (MultiPartParser, FormParser)

class GaleriProyekLPMViewSet(BaseLPMViewSet):
    queryset = GaleriProyekLPM.objects.all()
    serializer_class = GaleriProyekLPMSerializer
    parser_classes = (MultiPartParser, FormParser)

# --- Dashboard Stats API ---
from django.db.models import Sum, Count

class LPMDashboardStatsView(APIView):
    """
    Returns quick stats for LPM Dashboard.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        unit = getattr(user, 'unit_detail', None)
        
        # Security to ensure only LPM or Admin can access
        if user.role not in ['LPM', 'ADMIN']:
             return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
             
        stats = {}
        
        # 1. Proyek Berjalan (Pelaksanaan)
        if user.role == 'ADMIN':
            usulan_qs = UsulanMusrenbang.objects.all()
            jadwal_qs = JadwalGotongRoyong.objects.all()
            keuangan_qs = CatatanKeuanganLPM.objects.all()
        else:
            usulan_qs = UsulanMusrenbang.objects.filter(pengusul=user)
            jadwal_qs = JadwalGotongRoyong.objects.filter(penyelenggara_wilayah=unit)
            keuangan_qs = CatatanKeuanganLPM.objects.filter(unit_lpm=unit)

        proyek_berjalan = usulan_qs.filter(status='PELAKSANAAN').count()
        
        # 2. Total Dana Terkelola (Based on DISETUJUI, MENUNGGU_PENCAIRAN, PELAKSANAAN, SELESAI status)
        total_dana = usulan_qs.filter(
            status__in=['DISETUJUI', 'MENUNGGU_PENCAIRAN', 'PELAKSANAAN', 'SELESAI']
        ).aggregate(Sum('estimasi_biaya'))['estimasi_biaya__sum'] or 0

        # Pemasukan LPM
        pemasukan_lpm = keuangan_qs.filter(tipe='Pemasukan').aggregate(Sum('nominal'))['nominal__sum'] or 0
        total_dana_gabungan = float(total_dana) + float(pemasukan_lpm)

        # 3. Agenda Terdekat
        from datetime import date
        agenda_terdekat = jadwal_qs.filter(
            status__in=['Akan Datang', 'Berjalan'],
            tanggal__gte=date.today()
        ).order_by('tanggal')[:3]
        
        from .serializers import JadwalGotongRoyongSerializer
        agenda_data = JadwalGotongRoyongSerializer(agenda_terdekat, many=True).data

        stats['proyek_berjalan'] = proyek_berjalan
        stats['total_dana_terkelola'] = total_dana_gabungan
        stats['agenda_terdekat'] = agenda_data

        return Response(stats, status=status.HTTP_200_OK)

