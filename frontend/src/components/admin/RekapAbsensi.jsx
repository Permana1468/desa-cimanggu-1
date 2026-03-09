import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RekapAbsensi = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const [dataAbsen, setDataAbsen] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [jabatanFilter, setJabatanFilter] = useState('Semua Perangkat');

    const fetchKehadiran = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/users/api/kehadiran/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    jabatan: jabatanFilter
                }
            });
            setDataAbsen(res.data);
        } catch (error) {
            console.error("Gagal mengambil data kehadiran", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKehadiran();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/users/api/absensi/export-excel/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    jabatan: jabatanFilter
                },
                responseType: 'blob'
            });

            const file = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileURL = URL.createObjectURL(file);

            const a = document.createElement('a');
            a.href = fileURL;
            a.download = 'Laporan_Absensi_CimangguI.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error("Gagal mendownload Excel", error);
            alert("Gagal mengunduh Excel. Pastikan Anda memiliki akses.");
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return "-";
        return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    };

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        return new Date(isoString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatus = (waktu_masuk) => {
        if (!waktu_masuk) return "Tidak Hadir";
        const date = new Date(waktu_masuk);
        if (date.getHours() >= 8 && (date.getHours() > 8 || date.getMinutes() > 0)) {
            return "Terlambat";
        }
        return "Hadir Tepat Waktu";
    };

    return (
        <div className="text-gray-200 animate-fade-in print:text-black print:bg-white">

            {/* HEADER: Sembunyikan saat di-print */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Rekap Kehadiran Perangkat Desa</h2>
                    <p className="text-gray-400 text-sm">Monitor kedisiplinan, cetak laporan, dan unduh rekap bulanan.</p>
                </div>

                {/* Tombol Aksi (Print & Excel) */}
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2"
                    >
                        🖨️ Cetak Laporan
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] flex items-center gap-2"
                    >
                        📗 Export ke Excel
                    </button>
                </div>
            </div>

            {/* FILTER TANGGAL: Sembunyikan saat di-print */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-t-2xl p-6 flex flex-wrap gap-4 items-center shadow-lg print:hidden">
                <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">Dari Tanggal</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-[#0f172a]/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500" />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">Sampai Tanggal</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-[#0f172a]/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500" />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">Filter Jabatan</label>
                    <select value={jabatanFilter} onChange={e => setJabatanFilter(e.target.value)} className="bg-[#0f172a]/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 appearance-none">
                        <option value="Semua Perangkat">Semua Perangkat</option>
                        <option value="Kades & Sekdes">Kades & Sekdes</option>
                        <option value="Kasi / Kaur">Kasi / Kaur</option>
                        <option value="Kepala Dusun">Kepala Dusun</option>
                    </select>
                </div>
                <button onClick={fetchKehadiran} className="mt-5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg text-sm transition">Tampilkan</button>
            </div>

            {/* JUDUL KHUSUS UNTUK KERTAS PRINT */}
            <div className="hidden print:block text-center mb-6">
                <h1 className="text-2xl font-bold uppercase">Laporan Kehadiran Perangkat Desa</h1>
                <h2 className="text-lg">Pemerintah Desa Cimanggu I</h2>
                <p className="text-sm">Periode: 01 Maret 2026 - 31 Maret 2026</p>
                <hr className="mt-4 border-black border-2" />
            </div>

            {/* TABEL REKAP ABSENSI */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border-x border-b border-white/10 rounded-b-2xl overflow-hidden shadow-2xl print:bg-transparent print:border-none print:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse print:border print:border-black">
                        <thead>
                            <tr className="bg-[#0f172a]/80 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider print:bg-gray-200 print:text-black print:border-black">
                                <th className="py-4 px-6 font-semibold print:border print:border-black print:py-2">Tanggal</th>
                                <th className="py-4 px-6 font-semibold print:border print:border-black print:py-2">Nama Pegawai</th>
                                <th className="py-4 px-6 font-semibold print:border print:border-black print:py-2">Jabatan</th>
                                <th className="py-4 px-6 font-semibold text-center print:border print:border-black print:py-2">Jam Masuk</th>
                                <th className="py-4 px-6 font-semibold text-center print:border print:border-black print:py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Memuat data absensi...</td>
                                </tr>
                            ) : dataAbsen.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Tidak ada data absensi yang sesuai filter.</td>
                                </tr>
                            ) : (
                                dataAbsen.map((absen) => {
                                    const statusLabel = getStatus(absen.waktu_masuk);
                                    return (
                                        <tr key={absen.id} className="border-b border-white/5 hover:bg-white/5 transition-colors print:border-black">
                                            <td className="py-4 px-6 text-sm text-gray-300 print:text-black print:border print:border-black print:py-2">{formatDate(absen.waktu_masuk)}</td>
                                            <td className="py-4 px-6 font-bold text-white print:text-black print:border print:border-black print:py-2">{absen.nama_pejabat}</td>
                                            <td className="py-4 px-6 text-sm text-gray-400 print:text-black print:border print:border-black print:py-2">{absen.jabatan_pejabat}</td>
                                            <td className="py-4 px-6 text-center font-medium text-yellow-400 print:text-black print:border print:border-black print:py-2">{formatTime(absen.waktu_masuk)}</td>
                                            <td className="py-4 px-6 text-center print:border print:border-black print:py-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase print:border-none print:p-0 ${statusLabel === 'Hadir Tepat Waktu' ? 'bg-green-500/10 text-green-400 border border-green-500/20 print:text-black' : 'bg-red-500/10 text-red-400 border border-red-500/20 print:text-black'
                                                    }`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default RekapAbsensi;
