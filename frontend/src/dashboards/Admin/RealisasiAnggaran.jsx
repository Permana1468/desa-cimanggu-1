import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RealisasiAnggaran = () => {
    const [tagihan, setTagihan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTagihan();
    }, []);

    const fetchTagihan = async () => {
        try {
            setLoading(true);
            // Fetch projects that are waiting for disbursement
            const response = await api.get('/users/api/proyek/');
            const filtered = response.data.filter(item => item.status === 'MENUNGGU_PENCAIRAN');
            setTagihan(filtered);
        } catch (error) {
            console.error('Error fetching tagihan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCairkan = async (id, judul) => {
        if (!window.confirm(`Konfirmasi pencairan dana untuk proyek: ${judul}?`)) return;

        try {
            // Using the new formal endpoint /api/proyek/<id>/cairkan/
            await api.patch(`/users/api/proyek/${id}/cairkan/`);
            alert(`✅ Dana untuk ${judul} berhasil dicairkan. Proyek kini dalam tahap Pelaksanaan!`);
            fetchTagihan();
        } catch (error) {
            console.error('Error cairkan:', error);
            alert('❌ Gagal mencairkan dana. Pastikan Anda memiliki otorisasi Kaur Keuangan.');
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Realisasi Anggaran (SPP)</h2>
                <p className="text-gray-400 text-sm">Verifikasi dan pencairan dana untuk proyek yang RAB-nya sudah disetujui.</p>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 italic">Memuat data pencairan...</div>
                ) : tagihan.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 italic">
                        Tidak ada tagihan yang menunggu pencairan saat ini.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                                <th className="px-6 py-4 font-semibold">ID Proyek</th>
                                <th className="px-6 py-4 font-semibold">Judul Proyek</th>
                                <th className="px-6 py-4 font-semibold">Lokasi</th>
                                <th className="px-6 py-4 font-semibold text-right">Total RAB</th>
                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tagihan.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-yellow-500 font-bold">{item.usulan_id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-white font-medium">{item.judul}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">{item.kategori}</div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-400">{item.lokasi}</td>
                                    <td className="px-6 py-5 text-right font-bold text-white">
                                        {formatRupiah(item.estimasi_biaya)}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => handleCairkan(item.id, item.judul)}
                                            className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-green-500/20 active:scale-95"
                                        >
                                            Cairkan Dana
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RealisasiAnggaran;

