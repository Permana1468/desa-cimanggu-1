from rest_framework import serializers
from .models import CustomUser, LandingPageSetting, Berita, PejabatDesa, Kehadiran, UsulanMusrenbang, RencanaAnggaran, RencanaAnggaranItem, ProgramPembinaan, JadwalGotongRoyong, KegiatanLPM, PengurusLPM, DokumenDED, DokumenPerencanaan, AspirasiWarga, CatatanKeuanganLPM, InventarisLPM, PeminjamanAlat, KaderLPM, PresensiKegiatanLPM, LaporanDigitalLPM, GaleriProyekLPM
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'unit_detail', 'password', 'foto_profil', 'status', 'is_verified', 'last_login')

    def create(self, validated_data):
        password = validated_data.pop('password', 'desa1234') # Password default
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Hanya update password jika diberikan
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

class LandingPageSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageSetting
        fields = '__all__'

class BeritaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Berita
        fields = '__all__'

class PejabatDesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PejabatDesa
        fields = '__all__'

class KehadiranSerializer(serializers.ModelSerializer):
    pejabat_nama = serializers.CharField(source='pejabat.nama', read_only=True)
    class Meta:
        model = Kehadiran
        fields = '__all__'

class AdminUserResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True, min_length=6)

class RencanaAnggaranItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RencanaAnggaranItem
        fields = '__all__'
        read_only_fields = ('rab',)

class RencanaAnggaranSerializer(serializers.ModelSerializer):
    items = RencanaAnggaranItemSerializer(many=True, required=False)
    usulan_id = serializers.CharField(source='usulan.usulan_id', read_only=True)
    usulan_detail = serializers.SerializerMethodField()

    class Meta:
        model = RencanaAnggaran
        fields = '__all__'

    def get_usulan_detail(self, obj):
        if not obj.usulan: return {}
        return {
            "judul": obj.usulan.judul,
            "lokasi": obj.usulan.lokasi,
            "estimasi_biaya": obj.usulan.estimasi_biaya,
            "kategori": obj.usulan.kategori
        }

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        rab = RencanaAnggaran.objects.create(**validated_data)
        for item_data in items_data:
            RencanaAnggaranItem.objects.create(rab=rab, **item_data)
        
        # State Machine Trigger
        if rab.status == 'FINAL' and rab.usulan:
            rab.usulan.status = 'MENUNGGU_PENCAIRAN'
            rab.usulan.save()
            
        return rab

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        instance.grand_total = validated_data.get('grand_total', instance.grand_total)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                RencanaAnggaranItem.objects.create(rab=instance, **item_data)
        
        # State Machine Trigger
        if instance.status == 'FINAL' and instance.usulan:
            instance.usulan.status = 'MENUNGGU_PENCAIRAN'
            instance.usulan.save()
            
        return instance

class ProgramPembinaanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramPembinaan
        fields = '__all__'
        read_only_fields = ('id_program', 'penyelenggara_wilayah', 'created_at')

class JadwalGotongRoyongSerializer(serializers.ModelSerializer):
    class Meta:
        model = JadwalGotongRoyong
        fields = '__all__'
        read_only_fields = ('penyelenggara_wilayah', 'created_at')

class DokumenDEDSerializer(serializers.ModelSerializer):
    class Meta:
        model = DokumenDED
        fields = '__all__'

class DokumenPerencanaanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DokumenPerencanaan
        fields = '__all__'

class AspirasiWargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AspirasiWarga
        fields = '__all__'

class UsulanMusrenbangSerializer(serializers.ModelSerializer):
    pengusul_nama = serializers.CharField(source='pengusul.username', read_only=True)
    rab_detail = RencanaAnggaranSerializer(source='rab', read_only=True)
    
    class Meta:
        model = UsulanMusrenbang
        fields = '__all__'
        read_only_fields = ('usulan_id', 'pengusul', 'lokasi', 'created_at', 'updated_at')

class ProyekMonitoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsulanMusrenbang
        fields = ('id', 'usulan_id', 'judul', 'lokasi', 'alamat_lengkap', 'kategori', 'estimasi_biaya', 'progres_fisik', 'status', 'foto_1', 'foto_2', 'foto_3')
        read_only_fields = fields

class KegiatanLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = KegiatanLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class PengurusLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = PengurusLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'unit_detail', 'nama_lengkap', 'nomor_telepon', 'foto_profil', 'status', 'is_verified')
        read_only_fields = ('id', 'username', 'role', 'unit_detail', 'status', 'is_verified')

class ChangePasswordSerializer(serializers.Serializer):
    password_lama = serializers.CharField(required=True, write_only=True)
    password_baru = serializers.CharField(required=True, write_only=True, min_length=6)
    konfirmasi_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['password_baru'] != data['konfirmasi_password']:
            raise serializers.ValidationError({'konfirmasi_password': 'Password baru dan konfirmasi tidak cocok.'})
        return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['unit_detail'] = user.unit_detail
        token['status'] = user.status
        token['is_verified'] = user.is_verified
        return token

class CatatanKeuanganLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatatanKeuanganLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class InventarisLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarisLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class PeminjamanAlatSerializer(serializers.ModelSerializer):
    alat_nama = serializers.CharField(source='alat.nama_aset', read_only=True)
    class Meta:
        model = PeminjamanAlat
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class KaderLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = KaderLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class PresensiKegiatanLPMSerializer(serializers.ModelSerializer):
    kader_nama = serializers.CharField(source='kader.nama', read_only=True)
    kegiatan_judul = serializers.CharField(source='kegiatan.judul', read_only=True)
    class Meta:
        model = PresensiKegiatanLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm',)

class LaporanDigitalLPMSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaporanDigitalLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class GaleriProyekLPMSerializer(serializers.ModelSerializer):
    proyek_judul = serializers.CharField(source='proyek.judul', read_only=True)
    class Meta:
        model = GaleriProyekLPM
        fields = '__all__'
        read_only_fields = ('unit_lpm', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    konfirmasi_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'konfirmasi_password', 'role', 'unit_detail', 'nama_lengkap', 'nomor_telepon')

    def validate(self, data):
        if data['password'] != data['konfirmasi_password']:
            raise serializers.ValidationError({"konfirmasi_password": "Password dan Konfirmasi Password tidak cocok."})
        return data

    def create(self, validated_data):
        validated_data.pop('konfirmasi_password', None)
        
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')
        role = validated_data.get('role', 'WARGA')
        
        # Logic Verification Status
        is_verified = (role == 'WARGA')
        status = 'ACTIVE' if role == 'WARGA' else 'PENDING'
        
        # Create user explicitly via UserManager
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_verified=is_verified,
            status=status,
            **validated_data
        )
        return user
