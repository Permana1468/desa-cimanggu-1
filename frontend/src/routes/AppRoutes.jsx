import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Shared/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import MapPage from '../pages/MapPage';
import LandingPage from '../pages/LandingPage';

// Admin Dashboards
import IdentitasProfilForm from '../dashboards/Admin/IdentitasProfilForm';
import HeroCarouselForm from '../dashboards/Admin/HeroCarouselForm';
import KelolaBerita from '../dashboards/Admin/KelolaBerita';
import StrukturOrganisasi from '../dashboards/Admin/StrukturOrganisasi';
import ManajemenPengguna from '../dashboards/Admin/ManajemenPengguna';
import RekapAbsensi from '../dashboards/Admin/RekapAbsensi';
import VerifikasiUsulan from '../dashboards/Admin/VerifikasiUsulan';
import RencanaAnggaran from '../dashboards/Admin/RencanaAnggaran';
import RealisasiAnggaran from '../dashboards/Admin/RealisasiAnggaran';
import ManajemenProyekFisik from '../dashboards/Admin/ManajemenProyekFisik';
import RekapMusrenbang from '../dashboards/Admin/RekapMusrenbang';
import DetailEngineering from '../dashboards/Admin/DetailEngineering';
import DokumenPerencanaan from '../dashboards/Admin/DokumenPerencanaan';
import DataKependudukan from '../dashboards/Admin/DataKependudukan';
import InventarisAset from '../dashboards/Admin/InventarisAset';
import BukuKasUmum from '../dashboards/Admin/BukuKasUmum';
import DusunModule from '../dashboards/Admin/DusunModule';

// LPM Dashboards
import UsulanPembangunan from '../dashboards/LPM/UsulanPembangunan';
import AspirasiWargaLPM from '../dashboards/LPM/AspirasiWargaLPM';
import ProgramPembinaanLPM from '../dashboards/LPM/ProgramPembinaanLPM';
import JadwalGotongRoyongLPM from '../dashboards/LPM/JadwalGotongRoyongLPM';
import PantauProyekDesa from '../dashboards/LPM/PantauProyekDesa';
import BukuKegiatanLPM from '../dashboards/LPM/BukuKegiatanLPM';
import DataPengurusLPM from '../dashboards/LPM/DataPengurusLPM';
// Shared Dashboards
import UserProfile from '../dashboards/Shared/UserProfile';
import UserSettings from '../dashboards/Shared/UserSettings';

// LPM Dashboards (Restored)
import KeuanganLPM from '../dashboards/LPM/KeuanganLPM';
import InventarisLPM from '../dashboards/LPM/InventarisLPM';
import KaderLPM from '../dashboards/LPM/KaderLPM';

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Kiosk
import LayarAbsensi from '../pages/LayarAbsensi';

// Dummy section for development
const DummyPage = ({ title, icon = '📉' }) => (
    <div className="relative bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 min-h-[60vh] flex flex-col items-center justify-center shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="w-20 h-20 mb-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 flex items-center justify-center shadow-lg text-blue-400 text-4xl relative z-10">
            {icon}
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10 text-center">
            {title}
        </h3>

        <p className="text-gray-400 text-center max-w-md leading-relaxed text-sm relative z-10">
            Modul halaman ini sedang dalam tahap pengembangan aktif dan akan segera tersedia pada versi rilis berikutnya.
        </p>
    </div>
);

const Unauthorized = () => (
    <div className="relative bg-[#1e293b]/40 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 md:p-12 min-h-[60vh] flex flex-col items-center justify-center shadow-[0_15px_40px_-10px_rgba(239,68,68,0.2)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="w-20 h-20 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg text-red-500 relative z-10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>

        <h1 className="text-3xl font-extrabold text-red-400 mb-4 relative z-10">403 - Akses Ditolak</h1>
        <p className="text-gray-400 text-lg relative z-10">Maaf, hak akses Anda (Role) tidak diizinkan untuk membuka halaman ini.</p>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rute Kiosk Penuh (Tanpa Layout Admin) */}
            <Route path="/absensi" element={<LayarAbsensi />} />

            {/* Rute Dashboard terproteksi (menggunakan layout sidebar/navbar) */}
            <Route path="/unauthorized" element={<Layout children={<Unauthorized />} />} />

            <Route element={<Layout />}>
                {/* Rute Dasar untuk semua role yang login */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KAUR_PERENCANAAN', 'KAUR_KEUANGAN', 'KASI_PEMERINTAHAN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN', 'POSYANDU', 'SEKDES', 'KAUR_TU', 'LPM', 'KADUS']} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/profile" element={<UserProfile />} />
                    <Route path="/dashboard/settings" element={<UserSettings />} />
                </Route>

                {/* Grup Rute ADMIN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/dashboard/landing-setting" element={<IdentitasProfilForm />} />
                    <Route path="/dashboard/hero-carousel" element={<HeroCarouselForm />} />
                    <Route path="/dashboard/berita" element={<KelolaBerita />} />
                    <Route path="/dashboard/users" element={<ManajemenPengguna />} />
                    <Route path="/dashboard/organisasi" element={<StrukturOrganisasi />} />
                </Route>

                {/* Grup Rute SEKDES */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SEKDES']} />}>
                    <Route path="/dashboard/rekap-kehadiran" element={<RekapAbsensi />} />
                    <Route path="/dashboard/laporan-desa" element={<DummyPage title="Evaluasi & Laporan Desa" />} />
                </Route>

                {/* Grup Rute KAUR TU & UMUM */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KAUR_TU']} />}>
                    <Route path="/dashboard/buku-surat" element={<DummyPage title="Buku Surat Masuk & Keluar" />} />
                    <Route path="/dashboard/inventaris-aset" element={<InventarisAset />} />
                </Route>

                {/* Grup Rute KAUR KEUANGAN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KAUR_KEUANGAN']} />}>
                    <Route path="/dashboard/buku-kas" element={<BukuKasUmum />} />
                    <Route path="/dashboard/realisasi-anggaran" element={<RealisasiAnggaran />} />
                </Route>

                {/* Grup Rute KAUR PERENCANAAN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KAUR_PERENCANAAN']} />}>
                    <Route path="/dashboard/rab" element={<RencanaAnggaran />} />
                    <Route path="/dashboard/rekap-musrenbang" element={<RekapMusrenbang />} />
                    <Route path="/dashboard/perencanaan" element={<DetailEngineering />} />
                    <Route path="/dashboard/verifikasi-usulan" element={<VerifikasiUsulan />} />
                    <Route path="/dashboard/rpjmdes" element={<DokumenPerencanaan />} />
                </Route>

                {/* Grup Rute KASI PEMERINTAHAN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KASI_PEMERINTAHAN']} />}>
                    <Route path="/dashboard/pemerintahan" element={<DataKependudukan />} />
                    <Route path="/dashboard/mutasi-warga" element={<DummyPage title="Buku Mutasi Warga" />} />
                    <Route path="/dashboard/peraturan-desa" element={<DummyPage title="Buku Peraturan Desa" />} />
                    <Route path="/dashboard/maps" element={<MapPage />} />
                </Route>

                {/* Grup Rute KASI KESEJAHTERAAN & PELAYANAN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN']} />}>
                    <Route path="/dashboard/kesejahteraan" element={<ManajemenProyekFisik />} />
                    <Route path="/dashboard/bansos" element={<DummyPage title="Penyaluran Bantuan Sosial" />} />
                    <Route path="/dashboard/pelayanan" element={<DummyPage title="Layanan Pengantar RT/RW" />} />
                </Route>

                {/* Grup Rute POSYANDU */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'POSYANDU']} />}>
                    <Route path="/dashboard/e-kms" element={<DummyPage title="E-KMS Posyandu" />} />
                    <Route path="/dashboard/stunting" element={<DummyPage title="Deteksi Stunting" />} />
                </Route>

                {/* Grup Rute LPM */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'LPM']} />}>
                    <Route path="/dashboard/usulan-pembangunan" element={<UsulanPembangunan />} />
                    <Route path="/dashboard/aspirasi-warga" element={<AspirasiWargaLPM />} />
                    <Route path="/dashboard/program-pembinaan" element={<ProgramPembinaanLPM />} />
                    <Route path="/dashboard/gotong-royong" element={<JadwalGotongRoyongLPM />} />
                    <Route path="/dashboard/pantau-proyek" element={<PantauProyekDesa />} />
                    <Route path="/dashboard/kegiatan-lpm" element={<BukuKegiatanLPM />} />
                    <Route path="/dashboard/pengurus-lpm" element={<DataPengurusLPM />} />

                    {/* New LPM Routes Using DummyPage scaffold */}
                    <Route path="/dashboard/lpm/keuangan" element={<KeuanganLPM />} />
                    <Route path="/dashboard/lpm/swadaya" element={<DummyPage title="Swadaya Masyarakat" icon="🤝" />} />
                    <Route path="/dashboard/lpm/inventaris" element={<InventarisLPM />} />
                    <Route path="/dashboard/lpm/peminjaman" element={<DummyPage title="Peminjaman Alat" icon="🔧" />} />
                    <Route path="/dashboard/lpm/kader" element={<KaderLPM />} />
                    <Route path="/dashboard/lpm/laporan" element={<DummyPage title="E-Reporting Digital" icon="📄" />} />
                    <Route path="/dashboard/lpm/galeri" element={<DummyPage title="Galeri Proyek" icon="🖼️" />} />
                </Route>

                {/* Grup Rute KADUS (Kewilayahan) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'KADUS']} />}>
                    <Route path="/dashboard/data-dusun-1" element={<DusunModule dusunName="Dusun I" rwRange="RW 01 - RW 02" />} />
                    <Route path="/dashboard/laporan-dusun-1" element={<DusunModule dusunName="Dusun I" rwRange="RW 01 - RW 02" />} />
                    <Route path="/dashboard/data-dusun-2" element={<DusunModule dusunName="Dusun II" rwRange="RW 03 - RW 04" />} />
                    <Route path="/dashboard/laporan-dusun-2" element={<DusunModule dusunName="Dusun II" rwRange="RW 03 - RW 04" />} />
                    <Route path="/dashboard/data-dusun-3" element={<DusunModule dusunName="Dusun III" rwRange="RW 05 - RW 06" />} />
                    <Route path="/dashboard/laporan-dusun-3" element={<DusunModule dusunName="Dusun III" rwRange="RW 05 - RW 06" />} />
                    <Route path="/dashboard/data-dusun-4" element={<DusunModule dusunName="Dusun IV" rwRange="RW 07 - RW 09" />} />
                    <Route path="/dashboard/laporan-dusun-4" element={<DusunModule dusunName="Dusun IV" rwRange="RW 07 - RW 09" />} />
                </Route>

            </Route>

            {/* Rute fallback untuk 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
