import React from 'react';
import RealisasiAnggaran from './RealisasiAnggaran';
import ManajemenProyekFisik from './ManajemenProyekFisik';
import RekapMusrenbang from './RekapMusrenbang';
import DetailEngineering from './DetailEngineering';
import DokumenPerencanaan from './DokumenPerencanaan';
import VerifikasiUsulan from './VerifikasiUsulan';
import RencanaAnggaran from './RencanaAnggaran';

const AdminLayout = ({ activeMenu }) => {
    return (
        <div className="w-full h-full">
            {activeMenu === 'Realisasi Anggaran (SPP)' && <RealisasiAnggaran />}
            {activeMenu === 'Manajemen Proyek Fisik' && <ManajemenProyekFisik />}
            {activeMenu === 'Rekap Usulan Musrenbang' && <RekapMusrenbang />}
            {activeMenu === 'Detail Engineering (DED)' && <DetailEngineering />}
            {activeMenu === 'Verifikasi Usulan' && <VerifikasiUsulan />}
            {activeMenu === 'Rencana Anggaran (RAB)' && <RencanaAnggaran />}
            {activeMenu === 'Dokumen Perencanaan' && <DokumenPerencanaan />}

            {/* Fallback for unknown menus */}
            {!['Realisasi Anggaran (SPP)', 'Manajemen Proyek Fisik', 'Rekap Usulan Musrenbang',
                'Detail Engineering (DED)', 'Verifikasi Usulan', 'Rencana Anggaran (RAB)',
                'Dokumen Perencanaan'].includes(activeMenu) && (
                    <div className="p-10 text-center text-gray-500 italic">
                        Silakan pilih menu dari sidebar untuk memulainya.
                    </div>
                )}
        </div>
    );
};

export default AdminLayout;

