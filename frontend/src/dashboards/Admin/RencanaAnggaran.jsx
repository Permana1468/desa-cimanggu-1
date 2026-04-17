import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const RencanaAnggaran = () => {
    const [searchParams] = useSearchParams();
    const usulan_id = searchParams.get('usulan_id');

    // State untuk Data Proyek
    const [proyekAktif, setProyekAktif] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [rabId, setRabId] = useState(null); // Menyimpan ID RAB jika sudah ada (untuk update)

    // State untuk Baris Item RAB
    const [rabItems, setRabItems] = useState([]);

    useEffect(() => {
        if (usulan_id) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [usulan_id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Ambil Detail Usulan
            const resUsulan = await api.get(`/users/api/musrenbang/${usulan_id}/`);
            setProyekAktif(resUsulan.data);

            // 2. Cek apakah sudah ada RAB untuk usulan ini
            const resRab = await api.get(`/users/api/rab/?usulan_id=${usulan_id}`);
            if (resRab.data.length > 0) {
                const existingRab = resRab.data[0];
                setRabId(existingRab.id);
                setRabItems(existingRab.items.map(item => ({
                    ...item,
                    id: item.id || Date.now() + Math.random() // Ensure local ID for React keys
                })));
            } else {
                // Default items jika baru
                setRabItems([
                    { id: 1, kategori: 'Bahan Material', uraian: '', volume: 0, satuan: '', harga_satuan: 0 },
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal memuat data usulan.');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Fungsi Menghitung Total Harga Per Baris
    const hitungTotalBaris = (volume, harga) => (volume || 0) * (harga || 0);

    // Fungsi Menghitung Grand Total Keseluruhan
    const grandTotal = rabItems.reduce((total, item) => total + hitungTotalBaris(item.volume, item.harga_satuan), 0);

    // Fungsi Mengubah Nilai Input di Tabel
    const handleItemChange = (id, field, value) => {
        setRabItems(rabItems.map(item =>
            item.id === id ? {
                ...item,
                [field]: (field === 'volume' || field === 'harga_satuan') ? Number(value) : value
            } : item
        ));
    };

    // Fungsi Menambah Baris Baru
    const tambahBarisBaru = () => {
        const newItem = { id: Date.now(), kategori: 'Bahan Material', uraian: '', volume: 0, satuan: '', harga_satuan: 0 };
        setRabItems([...rabItems, newItem]);
    };

    // Fungsi Menghapus Baris
    const hapusBaris = (id) => {
        setRabItems(rabItems.filter(item => item.id !== id));
    };

    // FUNGSI SIMPAN KE BACKEND
    const handleSave = async (isFinal = false) => {
        if (!proyekAktif) return;

        try {
            setIsSaving(true);
            const payload = {
                usulan: proyekAktif.id,
                grand_total: grandTotal,
                status: isFinal ? 'FINAL' : 'DRAFT',
                items: rabItems.map(item => ({
                    kategori: item.kategori,
                    uraian: item.uraian,
                    volume: item.volume,
                    satuan: item.satuan,
                    harga_satuan: item.harga_satuan,
                    total_harga: hitungTotalBaris(item.volume, item.harga_satuan)
                }))
            };

            if (rabId) {
                // Update existing
                await api.put(`/users/api/rab/${rabId}/`, payload);
            } else {
                // Create new
                const res = await api.post('/users/api/rab/', payload);
                setRabId(res.data.id);
            }

            alert(`✅ RAB Berhasil Disimpan sebagai ${isFinal ? 'FINAL' : 'DRAFT'}!`);
            if (isFinal) window.location.href = '/dashboard/verifikasi-usulan';
        } catch (error) {
            console.error('Error saving RAB:', error);
            alert('❌ Gagal menyimpan RAB. Pastikan semua data valid.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 italic">
                <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
                Memuat data usulan...
            </div>
        );
    }

    if (!proyekAktif) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#1e293b]/20 border border-white/5 rounded-3xl backdrop-blur-sm">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-4xl mb-6 border border-yellow-500/20">
                    📐
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pilih Usulan Terlebih Dahulu</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                    Halaman ini digunakan untuk menyusun RAB dari usulan yang telah disetujui.
                    Silakan pilih usulan pembangunan melalui Panel Verifikasi.
                </p>
                <button
                    onClick={() => window.location.href = '/dashboard/verifikasi-usulan'}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
                >
                    Ke Halaman Verifikasi
                </button>
            </div>
        );
    }

    return (
        <div className="text-gray-200 animate-fade-in pb-10">

            {/* HEADER PAGE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Penyusunan RAB Proyek</h2>
                    <p className="text-gray-400 text-sm">Rincian Anggaran Biaya (Bahan, Alat, Upah) untuk pelaksanaan proyek desa.</p>
                </div>
                <div className="bg-[#1e293b]/60 border border-white/10 px-5 py-2.5 rounded-xl shadow-inner text-right">
                    <span className="text-xs text-gray-400 block mb-0.5">Total Rancangan Anggaran</span>
                    <span className="text-xl font-bold text-yellow-400 font-mono tracking-wider">{formatRupiah(grandTotal)}</span>
                </div>
            </div>

            {/* KARTU INFO PROYEK */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>

                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold tracking-wider mb-3">
                            KODE USULAN: {proyekAktif.usulan_id}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-1">{proyekAktif.judul}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">📍 {proyekAktif.lokasi || proyekAktif.unit_detail}</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500 mb-1">Estimasi Pengajuan LPM</p>
                        <p className="text-sm text-gray-300 font-mono">Rp {parseFloat(proyekAktif.estimasi_biaya).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* AREA SPREADSHEET RAB */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border-x border-t border-white/10 rounded-t-2xl p-5 flex justify-between items-center shadow-lg">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>🧾</span> Rincian Item Pekerjaan
                </h3>
                <button onClick={tambahBarisBaru} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
                    <span>+</span> Tambah Baris
                </button>
            </div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-b-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1e293b]/80 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-4 font-semibold w-12 text-center">No</th>
                                <th className="py-4 px-4 font-semibold w-48">Kategori</th>
                                <th className="py-4 px-4 font-semibold">Uraian / Nama Barang</th>
                                <th className="py-4 px-4 font-semibold w-24 text-center">Vol</th>
                                <th className="py-4 px-4 font-semibold w-24 text-center">Satuan</th>
                                <th className="py-4 px-4 font-semibold w-40 text-right">Harga Satuan</th>
                                <th className="py-4 px-4 font-semibold w-40 text-right">Total Harga</th>
                                <th className="py-4 px-4 font-semibold w-16 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rabItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-2 px-4 text-center text-sm text-gray-500">{index + 1}</td>
                                    <td className="py-2 px-4">
                                        <select
                                            value={item.kategori}
                                            onChange={(e) => handleItemChange(item.id, 'kategori', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-gray-300 outline-none transition appearance-none cursor-pointer"
                                        >
                                            <option className="bg-gray-800">Bahan Material</option>
                                            <option className="bg-gray-800">Upah Tenaga Kerja</option>
                                            <option className="bg-gray-800">Sewa Alat</option>
                                            <option className="bg-gray-800">Operasional</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="text"
                                            value={item.uraian}
                                            onChange={(e) => handleItemChange(item.id, 'uraian', e.target.value)}
                                            placeholder="Masukkan nama barang..."
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-white outline-none transition placeholder-gray-600"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="number"
                                            value={item.volume === 0 ? '' : item.volume}
                                            onChange={(e) => handleItemChange(item.id, 'volume', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-center text-white outline-none transition"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="text"
                                            value={item.satuan}
                                            onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                                            placeholder="Zak, M3, HOK"
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-center text-gray-300 outline-none transition uppercase"
                                        />
                                    </td>
                                    <td className="py-2 px-4 relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                        <input
                                            type="number"
                                            value={item.harga_satuan === 0 ? '' : item.harga_satuan}
                                            onChange={(e) => handleItemChange(item.id, 'harga_satuan', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded pl-8 pr-2 py-1.5 text-sm text-right text-white outline-none transition font-mono"
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-right font-mono font-bold text-yellow-400 text-sm bg-black/20">
                                        {formatRupiah(hitungTotalBaris(item.volume, item.harga_satuan))}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <button onClick={() => hapusBaris(item.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition opacity-0 group-hover:opacity-100">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#1e293b]/60 border-t border-white/10 p-5 flex justify-end items-center gap-6">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Grand Total RAB :</span>
                    <span className="text-2xl font-bold text-yellow-400 font-mono bg-[#0f172a] px-6 py-2 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        {formatRupiah(grandTotal)}
                    </span>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition flex items-center gap-2 disabled:opacity-50"
                >
                    🖨️ Cetak Draft PDF
                </button>
                <button
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? '⌛ Menyimpan...' : '💾 Simpan Draft RAB'}
                </button>
                <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? '⌛ Memproses...' : '📌 Kunci & Finalisasi'}
                </button>
            </div>
        </div>
    );
};

export default RencanaAnggaran;

