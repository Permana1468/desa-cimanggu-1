import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import * as XLSX from 'xlsx';

const RekapMusrenbang = () => {
    // State untuk Tab Aktif ('Desa' atau 'Kabupaten')
    const [activeTab, setActiveTab] = useState('Desa');
    const [dataRekap, setDataRekap] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Mengambil data usulan musrenbang yang sudah disetujui (memiliki kewenangan)
            const response = await api.get('/users/api/musrenbang/');
            // Filter hanya yang sudah disetujui (biasanya DISETUJUI, atau status lain yang sudah diproses kaur)
            // Namun untuk rekap, kita tampilkan semua yang memiliki field kewenangan terisi
            const filtered = response.data.filter(item => item.kewenangan);
            setDataRekap(filtered);
        } catch (error) {
            console.error('Error fetching rekap data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

    // Filter data berdasarkan tab yang sedang aktif
    const filteredData = dataRekap.filter(item => item.kewenangan === activeTab);

    // Menghitung total estimasi anggaran per tab
    const totalAnggaran = filteredData.reduce((total, item) => {
        const angka = parseFloat(item.estimasi_biaya);
        return total + (isNaN(angka) ? 0 : angka);
    }, 0);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data untuk diexport!");
            return;
        }

        // 1. Siapkan data (Map array agar nama kolom di Excel rapi)
        const dataToExport = filteredData.map((item, index) => ({
            'No': index + 1,
            'Kode Usulan': item.usulan_id,
            'Pengusul': item.pengusul_nama || 'LPM',
            'Judul Program / Kegiatan': item.judul,
            'Lokasi Target': item.lokasi,
            'Estimasi Anggaran': formatRupiah(item.estimasi_biaya),
            'Kewenangan': item.kewenangan,
            'Status Lanjutan': item.status === 'DISETUJUI' && item.kewenangan === 'Kabupaten' ? 'Diteruskan ke Musrenbangcam' : item.status.replace('_', ' ')
        }));

        // 2. Buat Worksheet dari data JSON
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // 3. Atur lebar kolom (Column Widths) agar tidak menumpuk saat dibuka di Excel
        const wscols = [
            { wch: 5 },  // No
            { wch: 15 }, // Kode
            { wch: 20 }, // Pengusul
            { wch: 45 }, // Judul Program
            { wch: 30 }, // Lokasi Target
            { wch: 20 }, // Estimasi
            { wch: 15 }, // Kewenangan
            { wch: 35 }  // Status
        ];
        worksheet['!cols'] = wscols;

        // 4. Buat Workbook baru dan masukkan Worksheet-nya
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Usulan_${activeTab}`);

        // 5. Trigger Download otomatis
        XLSX.writeFile(workbook, `Rekap_Musrenbang_${activeTab}_Cimanggu_I.xlsx`);
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">

            {/* HEADER & TOMBOL EXPORT */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Rekapitulasi Usulan Musrenbang</h2>
                    <p className="text-gray-400 text-sm">Pemilahan daftar usulan pembangunan berdasarkan kewenangan pendanaan.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2 px-4 rounded-xl transition flex items-center gap-2">
                        🖨️ Cetak PDF
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-xl transition shadow-[0_0_15px_rgba(22,163,74,0.4)] flex items-center gap-2"
                    >
                        📗 Export Excel
                    </button>
                </div>
            </div>

            {/* SISTEM TAB INTERAKTIF */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('Desa')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'Desa'
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                        : 'bg-[#1e293b]/50 text-gray-400 hover:text-white hover:bg-[#1e293b]'
                        }`}
                >
                    🏡 Kewenangan Desa (APBDes)
                </button>
                <button
                    onClick={() => setActiveTab('Kabupaten')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'Kabupaten'
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                        : 'bg-[#1e293b]/50 text-gray-400 hover:text-white hover:bg-[#1e293b]'
                        }`}
                >
                    🏢 Kewenangan Kabupaten/Provinsi
                </button>
            </div>

            {/* KARTU RINGKASAN */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 flex justify-between items-center shadow-lg">
                <div>
                    <h3 className="text-sm text-gray-400 mb-1">Total Usulan {activeTab}</h3>
                    <p className="text-2xl font-bold text-white">{filteredData.length} <span className="text-sm font-normal text-gray-500">Program / Kegiatan</span></p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm text-gray-400 mb-1">Proyeksi Anggaran Dibutuhkan</h3>
                    <p className="text-2xl font-bold text-yellow-400 font-mono tracking-wider">{formatRupiah(totalAnggaran)}</p>
                </div>
            </div>

            {/* TABEL DATA */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/80 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Kode & Pengusul</th>
                                <th className="py-4 px-6 font-semibold">Judul Program & Lokasi</th>
                                <th className="py-4 px-6 font-semibold text-right">Estimasi Biaya</th>
                                <th className="py-4 px-6 font-semibold text-center">Status Lanjutan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 italic">
                                        Memuat data rekapan...
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-mono font-bold text-yellow-400 text-sm mb-1">{item.usulan_id}</p>
                                            <p className="text-xs text-gray-400">Oleh: {item.pengusul_nama || 'LPM'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-white text-sm mb-1">{item.judul}</p>
                                            <p className="text-xs text-blue-400">📍 {item.lokasi}</p>
                                        </td>
                                        <td className="py-4 px-6 text-right font-mono text-gray-200">
                                            {formatRupiah(item.estimasi_biaya)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${item.status === 'DISETUJUI'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : item.status === 'MENUNGGU'
                                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {item.status === 'DISETUJUI' && item.kewenangan === 'Kabupaten' ? 'Diteruskan ke Musrenbangcam' : item.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500">
                                        Tidak ada data usulan untuk kewenangan {activeTab} saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default RekapMusrenbang;
