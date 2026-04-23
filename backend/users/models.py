from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('SEKDES', 'Sekretaris Desa'),
        ('KAUR_PERENCANAAN', 'Kaur Perencanaan'),
        ('KAUR_TU', 'Kaur Tata Usaha'),
        ('KAUR_KEUANGAN', 'Kaur Keuangan'),
        ('KASI_PEMERINTAHAN', 'Kasi Pemerintahan'),
        ('KASI_KESEJAHTERAAN', 'Kasi Kesejahteraan'),
        ('KASI_PELAYANAN', 'Kasi Pelayanan'),
        ('KADUS', 'Kepala Dusun'),
        ('POSYANDU', 'Posyandu'),
        ('LPM', 'LPM'),
        ('RW', 'Rukun Warga'),
        ('RT', 'Rukun Tetangga (RT)'),
        ('KARANG_TARUNA', 'Karang Taruna'),
        ('BUMDES', 'Bumdes'),
        ('TP_PKK', 'TP-PKK'),
        ('PUSKESOS', 'Puskesos (Sosial)'),
        ('OWNER_TOKO', 'Pemilik Toko (UMKM)'),
        ('WARGA', 'Warga'),
    )

    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='ADMIN')
    is_verified = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, 
        choices=(
            ('PENDING', 'Pending'),
            ('ACTIVE', 'Active'),
            ('BLOCKED', 'Blocked'),
        ), 
        default='PENDING'
    )
    unit_detail = models.CharField(max_length=255, blank=True, null=True, help_text="Misal: 'Mawar 1' atau 'RW 009'")
    nama_lengkap = models.CharField(max_length=255, blank=True, null=True, help_text="Nama lengkap operator/pengurus")
    nomor_telepon = models.CharField(max_length=20, blank=True, null=True, help_text="Nomor HP/WhatsApp aktif")
    foto_profil = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class LandingPageSetting(models.Model):
    title = models.CharField(max_length=255, default='Website Desa')
    description = models.TextField(blank=True, null=True)
    hero_title = models.CharField(max_length=255, blank=True, null=True)
    hero_subtitle = models.CharField(max_length=255, blank=True, null=True)
    
    # Profil Desa (Tentang Kami)
    about_title = models.CharField(max_length=255, default='Sekilas Pandang')
    about_text = models.TextField(blank=True, null=True)
    about_image = models.ImageField(upload_to='about/', blank=True, null=True)

    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)

    # Images
    logo = models.ImageField(upload_to='logo/', blank=True, null=True)

    # Carousel Images
    carousel_image_1 = models.ImageField(upload_to='carousel/', blank=True, null=True)
    carousel_image_2 = models.ImageField(upload_to='carousel/', blank=True, null=True)
    carousel_image_3 = models.ImageField(upload_to='carousel/', blank=True, null=True)

    # Hanya boleh ada 1 record aktif (Singleton pattern sederhana)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Pengaturan Landing Page'
        verbose_name_plural = 'Pengaturan Landing Page'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_active:
            LandingPageSetting.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)

class Berita(models.Model):
    KATEGORI_CHOICES = (
        ('Pengumuman', 'Pengumuman'),
        ('Kegiatan', 'Kegiatan'),
        ('Bansos', 'Bansos'),
    )
    judul = models.CharField(max_length=255)
    kategori = models.CharField(max_length=50, choices=KATEGORI_CHOICES, default='Pengumuman')
    gambar_cover = models.ImageField(upload_to='berita/', blank=True, null=True)
    konten = models.TextField()
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Berita"

    def __str__(self):
        return self.judul

class PejabatDesa(models.Model):
    LEVEL_CHOICES = (
        (1, 'Level 1 (Kades)'),
        (2, 'Level 2 (Sekdes)'),
        (3, 'Level 3 (Kaur/Kasi)'),
        (4, 'Level 4 (Kadus)'),
    )
    nama = models.CharField(max_length=255)
    jabatan = models.CharField(max_length=255)
    level = models.IntegerField(choices=LEVEL_CHOICES, default=3)
    foto = models.ImageField(upload_to='pejabat/', blank=True, null=True)
    id_unik = models.CharField(max_length=20, unique=True, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Pejabat Desa"
        ordering = ['level', 'id']

    def __str__(self):
        return self.nama

    def save(self, *args, **kwargs):
        if not self.id_unik:
            # Generate ID Unik: CIM-XXX based on ID or count
            super().save(*args, **kwargs) # Save first to get ID
            self.id_unik = f"CIM-{self.id:03d}"
            # Re-save with id_unik
            kwargs['force_insert'] = False
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

class Kehadiran(models.Model):
    STATUS_CHOICES = (
        ('Hadir', 'Hadir'),
    )
    pejabat = models.ForeignKey(PejabatDesa, on_delete=models.CASCADE, related_name='kehadiran')
    waktu_masuk = models.DateTimeField(auto_now_add=True)
    waktu_pulang = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Hadir')

    class Meta:
        verbose_name_plural = "Kehadiran"
        ordering = ['-waktu_masuk']

    def __str__(self):
        return f"{self.pejabat.nama} - {self.waktu_masuk.strftime('%Y-%m-%d')}"

class UsulanMusrenbang(models.Model):
    STATUS_CHOICES = (
        ('MENUNGGU', 'Menunggu Review'),
        ('DISETUJUI', 'Disetujui Kaur (RAB)'),
        ('DITOLAK', 'Ditolak'),
        ('MENUNGGU_PENCAIRAN', 'Menunggu Pencairan'),
        ('PELAKSANAAN', 'Pelaksanaan'),
        ('SELESAI', 'Selesai'),
    )
    KEWENANGAN_CHOICES = (
        ('Desa', 'Desa'),
        ('Kabupaten', 'Kabupaten'),
    )
    
    usulan_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    kewenangan = models.CharField(max_length=20, choices=KEWENANGAN_CHOICES, blank=True, null=True)
    judul = models.CharField(max_length=255)
    kategori = models.CharField(max_length=100)
    lokasi = models.CharField(max_length=255)
    alamat_lengkap = models.TextField(blank=True, null=True)
    deskripsi = models.TextField()
    estimasi_biaya = models.DecimalField(max_digits=15, decimal_places=2)
    volume = models.CharField(max_length=100, blank=True, null=True)
    titik_koordinat = models.CharField(max_length=100, blank=True, null=True)
    foto_1 = models.ImageField(upload_to='musrenbang/', blank=True, null=True)
    foto_2 = models.ImageField(upload_to='musrenbang/', blank=True, null=True)
    foto_3 = models.ImageField(upload_to='musrenbang/', blank=True, null=True)
    progres_fisik = models.IntegerField(default=0)
    pengusul = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='usulan_musrenbang')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='MENUNGGU')
    catatan_verifikator = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Usulan Musrenbang"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.usulan_id} - {self.judul}"

    def save(self, *args, **kwargs):
        if not self.usulan_id:
            # Generate ID Unik: MUS-XXX
            super().save(*args, **kwargs) # Save first to get ID
            self.usulan_id = f"MUS-{self.id:03d}"
            kwargs['force_insert'] = False
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

class RencanaAnggaran(models.Model):
    STATUS_RAB_CHOICES = [
        ('DRAFT', 'DRAFT'),
        ('FINAL', 'FINAL'),
        ('CAIR', 'CAIR'),
    ]
    
    usulan = models.OneToOneField(UsulanMusrenbang, on_delete=models.CASCADE, related_name='rab')
    grand_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_RAB_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Rencana Anggaran (RAB)"

    def __str__(self):
        return f"RAB: {self.usulan.judul}"

class RencanaAnggaranItem(models.Model):
    rab = models.ForeignKey(RencanaAnggaran, on_delete=models.CASCADE, related_name='items')
    kategori = models.CharField(max_length=100)
    uraian = models.CharField(max_length=255)
    volume = models.DecimalField(max_digits=15, decimal_places=2)
    satuan = models.CharField(max_length=50)
    harga_satuan = models.DecimalField(max_digits=15, decimal_places=2)
    total_harga = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"{self.uraian} ({self.rab.usulan.usulan_id})"

class DokumenDED(models.Model):
    proyek = models.ForeignKey(UsulanMusrenbang, on_delete=models.CASCADE, related_name='dokumen_ded')
    file_dokumen = models.FileField(upload_to='dokumen_ded/')
    nama_file = models.CharField(max_length=255)
    ukuran_file = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nama_file} - {self.proyek.judul}"
class DokumenPerencanaan(models.Model):
    JENIS_CHOICES = (
        ('RPJMDes', 'RPJMDes'),
        ('RKPDes', 'RKPDes'),
    )
    STATUS_CHOICES = (
        ('Drafting', 'Drafting'),
        ('Disahkan', 'Disahkan'),
    )

    jenis = models.CharField(max_length=20, choices=JENIS_CHOICES)
    judul = models.CharField(max_length=255)
    periode = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    file_dokumen = models.FileField(upload_to='dokumen_perencanaan/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.jenis} - {self.judul}"
class AspirasiWarga(models.Model):
    STATUS_CHOICES = (
        ('Belum Dibaca', 'Belum Dibaca'),
        ('Ditindaklanjuti', 'Ditindaklanjuti'),
        ('Selesai', 'Selesai'),
    )
    KATEGORI_CHOICES = (
        ('Infrastruktur', 'Infrastruktur'),
        ('Sosial', 'Sosial'),
        ('Keamanan', 'Keamanan'),
        ('Layanan Publik', 'Layanan Publik'),
    )

    nama_warga = models.CharField(max_length=255)
    rt_rw = models.CharField(max_length=100)
    kategori = models.CharField(max_length=100, choices=KATEGORI_CHOICES)
    isi_pesan = models.TextField()
    wilayah_tujuan = models.CharField(max_length=255, help_text="Unit Detail LPM, misal: '001'")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Belum Dibaca')
    tanggal = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nama_warga} - {self.kategori}"

class ProgramPembinaan(models.Model):
    STATUS_CHOICES = (
        ('Direncanakan', 'Direncanakan'),
        ('Berjalan', 'Berjalan'),
        ('Selesai', 'Selesai'),
    )
    
    id_program = models.CharField(max_length=20, unique=True, blank=True, null=True)
    judul = models.CharField(max_length=255)
    kategori = models.CharField(max_length=100)
    sasaran = models.CharField(max_length=255)
    tanggal_pelaksanaan = models.DateField()
    jumlah_peserta = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Direncanakan')
    mentor = models.CharField(max_length=255)
    penyelenggara_wilayah = models.CharField(max_length=255, help_text="Unit Detail LPM penyelenggara")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Program Pembinaan"
        ordering = ['-tanggal_pelaksanaan']

    def __str__(self):
        return f"{self.id_program or 'PRG'} - {self.judul}"

    def save(self, *args, **kwargs):
        if not self.id_program:
            # Save first to get ID
            super().save(*args, **kwargs)
            self.id_program = f"PRG-{self.id:03d}"
            # Re-save with id_program
            kwargs['force_insert'] = False
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

class JadwalGotongRoyong(models.Model):
    STATUS_CHOICES = (
        ('Akan Datang', 'Akan Datang'),
        ('Berjalan', 'Berjalan'),
        ('Selesai', 'Selesai'),
        ('Dibatalkan', 'Dibatalkan'),
    )
    
    judul = models.CharField(max_length=255)
    tanggal = models.DateField()
    waktu = models.TimeField()
    lokasi = models.CharField(max_length=255)
    koordinator = models.CharField(max_length=255)
    alat_dibawa = models.TextField(help_text="Daftar alat yang perlu dibawa warga")
    peserta_target = models.CharField(max_length=255, help_text="Misal: Warga RW 01, Pemuda Karang Taruna")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Akan Datang')
    penyelenggara_wilayah = models.CharField(max_length=255, help_text="Unit Detail LPM penyelenggara")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Jadwal Gotong Royong"
        ordering = ['tanggal', 'waktu']

    def __str__(self):
        return f"{self.judul} ({self.tanggal})"

class KegiatanLPM(models.Model):
    KATEGORI_CHOICES = (
        ('Sosial', 'Sosial'),
        ('Pemberdayaan', 'Pemberdayaan'),
        ('Pengawasan', 'Pengawasan'),
        ('Rapat', 'Rapat Pleno'),
        ('Lainnya', 'Lainnya'),
    )
    STATUS_CHOICES = (
        ('Direncanakan', 'Direncanakan'),
        ('Berjalan', 'Berjalan'),
        ('Selesai', 'Selesai'),
        ('Dibatalkan', 'Dibatalkan'),
    )

    judul = models.CharField(max_length=255)
    kategori = models.CharField(max_length=100, choices=KATEGORI_CHOICES)
    tanggal = models.DateField()
    lokasi = models.CharField(max_length=255)
    deskripsi = models.TextField(blank=True, null=True)
    jumlah_peserta = models.IntegerField(default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Direncanakan')
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM penyelenggara, diisi otomatis dari backend")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kegiatan LPM"
        verbose_name_plural = "Kegiatan LPM"
        ordering = ['-tanggal']

    def __str__(self):
        return f"{self.judul} ({self.unit_lpm})"


class PengurusLPM(models.Model):
    JABATAN_CHOICES = (
        ('Ketua', 'Ketua'),
        ('Wakil Ketua', 'Wakil Ketua'),
        ('Sekretaris', 'Sekretaris'),
        ('Bendahara', 'Bendahara'),
        ('Koordinator Bidang', 'Koordinator Bidang'),
        ('Anggota', 'Anggota'),
    )

    nama = models.CharField(max_length=255)
    jabatan = models.CharField(max_length=100, choices=JABATAN_CHOICES)
    bidang = models.CharField(max_length=255, blank=True, null=True, help_text="Misal: Pemberdayaan, Sosial")
    no_hp = models.CharField(max_length=20, blank=True, null=True)
    alamat = models.TextField(blank=True, null=True)
    periode = models.CharField(max_length=50, help_text="Misal: 2023 - 2026")
    is_active = models.BooleanField(default=True)
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM, diisi otomatis dari backend")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Pengurus LPM"
        verbose_name_plural = "Pengurus LPM"
        ordering = ['jabatan', 'nama']

    def __str__(self):
        return f"{self.nama} - {self.jabatan} (Unit {self.unit_lpm})"

# --- MODUL KEUANGAN & SWADAYA ---
class CatatanKeuanganLPM(models.Model):
    TIPE_CHOICES = (
        ('Pemasukan', 'Pemasukan'),
        ('Pengeluaran', 'Pengeluaran'),
    )
    SUMBER_CHOICES = (
        ('Dana Desa', 'Dana Desa'),
        ('Bantuan / Donasi', 'Bantuan / Donasi'),
        ('Swadaya Warga', 'Swadaya Warga'),
        ('Lainnya', 'Lainnya'),
    )

    judul = models.CharField(max_length=255)
    tipe = models.CharField(max_length=50, choices=TIPE_CHOICES)
    sumber_dana = models.CharField(max_length=100, choices=SUMBER_CHOICES)
    nominal = models.DecimalField(max_digits=15, decimal_places=2)
    tanggal = models.DateField()
    keterangan = models.TextField(blank=True, null=True)
    file_bukti = models.FileField(upload_to='keuangan_lpm/', blank=True, null=True)
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catatan Keuangan LPM"
        verbose_name_plural = "Catatan Keuangan LPM"
        ordering = ['-tanggal']

    def __str__(self):
        return f"{self.judul} ({self.tipe} - {self.nominal})"

# --- MODUL INVENTARIS & ALAT ---
class InventarisLPM(models.Model):
    KONDISI_CHOICES = (
        ('Baik', 'Baik'),
        ('Rusak Ringan', 'Rusak Ringan'),
        ('Rusak Berat', 'Rusak Berat'),
    )
    nama_aset = models.CharField(max_length=255)
    kode_aset = models.CharField(max_length=50, blank=True, null=True)
    kategori = models.CharField(max_length=100)
    jumlah = models.IntegerField(default=1)
    kondisi = models.CharField(max_length=50, choices=KONDISI_CHOICES, default='Baik')
    sumber_perolehan = models.CharField(max_length=100)
    tahun_perolehan = models.IntegerField()
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Inventaris LPM"
        verbose_name_plural = "Inventaris LPM"
        ordering = ['nama_aset']

    def __str__(self):
        return f"{self.nama_aset} (Unit: {self.unit_lpm})"

class PeminjamanAlat(models.Model):
    STATUS_CHOICES = (
        ('Dipinjam', 'Dipinjam'),
        ('Dikembalikan', 'Dikembalikan'),
        ('Terlambat', 'Terlambat'),
    )
    alat = models.ForeignKey(InventarisLPM, on_delete=models.CASCADE, related_name='riwayat_peminjaman')
    peminjam = models.CharField(max_length=255)
    rt_rw = models.CharField(max_length=50, blank=True, null=True)
    tanggal_pinjam = models.DateField()
    rencana_kembali = models.DateField()
    tanggal_kembali_aktual = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Dipinjam')
    keterangan = models.TextField(blank=True, null=True)
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Peminjaman Alat"
        verbose_name_plural = "Peminjaman Alat"
        ordering = ['-tanggal_pinjam']

    def __str__(self):
        return f"{self.peminjam} pinjam {self.alat.nama_aset}"

# --- MODUL KADER & RELAWAN ---
class KaderLPM(models.Model):
    STATUS_CHOICES = (
        ('Aktif', 'Aktif'),
        ('Non Aktif', 'Non Aktif'),
    )
    nama = models.CharField(max_length=255)
    rt_rw = models.CharField(max_length=50)
    jabatan = models.CharField(max_length=100, default='Anggota Biasa')
    no_hp = models.CharField(max_length=20, blank=True, null=True)
    keahlian = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Aktif')
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kader/Relawan LPM"
        verbose_name_plural = "Kader/Relawan LPM"
        ordering = ['nama']

    def __str__(self):
        return f"{self.nama} ({self.rt_rw})"

class PresensiKegiatanLPM(models.Model):
    kegiatan = models.ForeignKey(JadwalGotongRoyong, on_delete=models.CASCADE, related_name='presensi')
    kader = models.ForeignKey(KaderLPM, on_delete=models.CASCADE, related_name='history_presensi')
    waktu_hadir = models.DateTimeField(auto_now_add=True)
    foto_bukti = models.ImageField(upload_to='presensi_lpm/', blank=True, null=True)
    keterangan = models.TextField(blank=True, null=True)
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")

    class Meta:
        verbose_name = "Presensi Kegiatan LPM"
        verbose_name_plural = "Presensi Kegiatan LPM"
        ordering = ['-waktu_hadir']
        unique_together = ('kegiatan', 'kader')

    def __str__(self):
        return f"{self.kader.nama} - {self.kegiatan.judul}"

# --- MODUL E-REPORTING & GALERI ---
class LaporanDigitalLPM(models.Model):
    KATEGORI_CHOICES = (
        ('Laporan Keuangan', 'Laporan Keuangan'),
        ('Laporan Kegiatan', 'Laporan Kegiatan'),
        ('Laporan Inventaris', 'Laporan Inventaris'),
        ('Laporan Akhir Tahun', 'Laporan Akhir Tahun'),
        ('Lainnya', 'Lainnya'),
    )
    judul_laporan = models.CharField(max_length=255)
    kategori = models.CharField(max_length=100, choices=KATEGORI_CHOICES)
    file_laporan = models.FileField(upload_to='laporan_lpm/')
    deskripsi = models.TextField(blank=True, null=True)
    tanggal_laporan = models.DateField()
    is_public = models.BooleanField(default=False, help_text="Apakah laporan ini bisa dilihat oleh publik/warga")
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Laporan Digital LPM"
        verbose_name_plural = "Laporan Digital LPM"
        ordering = ['-tanggal_laporan']

    def __str__(self):
        return f"{self.judul_laporan} ({self.unit_lpm})"

class GaleriProyekLPM(models.Model):
    proyek = models.ForeignKey(UsulanMusrenbang, on_delete=models.CASCADE, related_name='galeri_tambahan')
    judul_foto = models.CharField(max_length=255)
    file_foto = models.ImageField(upload_to='galeri_proyek_lpm/')
    deskripsi = models.TextField(blank=True, null=True)
    unit_lpm = models.CharField(max_length=255, help_text="Unit Detail LPM")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Galeri Proyek LPM"
        verbose_name_plural = "Galeri Proyek LPM"
        ordering = ['-created_at']

    def __str__(self):
        return f"Foto: {self.judul_foto} - {self.proyek.judul}"

# --- MODUL UMKM & PASAR DESA ---
class UMKMShop(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='shops')
    shop_name = models.CharField("Nama Toko", max_length=255)
    description = models.TextField("Deskripsi Toko", blank=True, null=True)
    phone_number = models.CharField("WhatsApp / No HP", max_length=20, blank=True, null=True, help_text="Format: 08123...")
    address = models.TextField("Alamat Toko", blank=True, null=True)
    logo = models.ImageField("Logo Toko", upload_to='umkm_logos/', blank=True, null=True)
    is_verified = models.BooleanField("Terverifikasi", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Toko UMKM"
        verbose_name_plural = "Toko UMKM"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.shop_name} ({self.owner.username})"

class Product(models.Model):
    shop = models.ForeignKey(UMKMShop, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='umkm_products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Produk UMKM"
        verbose_name_plural = "Produk UMKM"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.shop.shop_name}"
