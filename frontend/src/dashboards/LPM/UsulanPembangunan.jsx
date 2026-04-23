import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Komponen Visualisasi Perjalanan Usulan (Stepper)
const GrafikTracking = ({ status }) => {
    // Definisi urutan langkah pembangunan
    const steps = [
        { title: 'Pengajuan', desc: 'Usulan Masuk', icon: '📝' },
        { title: 'Verifikasi', desc: 'Kaur Perencanaan', icon: '🔍' },
        { title: 'Perencanaan', desc: 'Pembuatan RAB & DED', icon: '📐' },
        { title: 'Anggaran', desc: 'Pencairan Dana', icon: '💰' },
        { title: 'Pelaksanaan', desc: 'Proyek Berjalan', icon: '🏗️' }
    ];

    // Map Backend Status to Stepper Status
    let displayStatus = status;
    if (status === 'MENUNGGU') displayStatus = 'Menunggu Review';
    if (status === 'DISETUJUI') displayStatus = 'Disetujui Kaur';
    if (status === 'DITOLAK') displayStatus = 'Ditolak';

    // Logika penentuan langkah mana yang aktif berdasarkan status text
    let activeStepIndex = 0;
    let isRejected = displayStatus === 'Ditolak';

    if (displayStatus === 'Menunggu Review') activeStepIndex = 1;
    if (displayStatus === 'Disetujui Kaur') activeStepIndex = 2; // Berarti sedang di tahap Perencanaan
    if (displayStatus === 'Pencairan') activeStepIndex = 3;
    if (displayStatus === 'Pelaksanaan') activeStepIndex = 4;
    if (displayStatus === 'Selesai') activeStepIndex = 5;

    return (
        <div className="w-full py-6 md:py-8 px-4 md:px-12 bg-[#0f172a]/30 rounded-2xl border border-white/5 my-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Garis Latar Belakang (Abu-abu) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700/50 rounded-full z-0"></div>

                {/* Garis Progres (Warna menyala) */}
                <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-1000 ${isRejected ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        }`}
                    style={{ width: `${isRejected ? (activeStepIndex / (steps.length - 1)) * 100 : (Math.min(activeStepIndex, steps.length - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Lingkaran Titik (Steps) */}
                {steps.map((step, index) => {
                    let stepStatus = 'pending'; // pending, active, completed, rejected
                    if (isRejected && index === activeStepIndex) stepStatus = 'rejected';
                    else if (index < activeStepIndex) stepStatus = 'completed';
                    else if (index === activeStepIndex && !isRejected) stepStatus = 'active';

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center group">
                            {/* Lingkaran Ikon */}
                            <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base border-4 transition-all duration-500 ${stepStatus === 'completed' ? 'bg-green-500 border-[#0f172a] text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]' :
                                stepStatus === 'active' ? 'bg-yellow-500 border-[#0f172a] text-[#0f172a] shadow-[0_0_20px_rgba(234,179,8,0.8)] animate-pulse' :
                                    stepStatus === 'rejected' ? 'bg-red-500 border-[#0f172a] text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]' :
                                        'bg-gray-800 border-gray-600 text-gray-500' // Pending
                                }`}>
                                {stepStatus === 'completed' ? '✓' : stepStatus === 'rejected' ? '✕' : step.icon}
                            </div>

                            {/* Teks Keterangan */}
                            <div className="absolute top-12 w-20 md:w-24 text-center">
                                <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 ${stepStatus === 'active' ? 'text-yellow-400' :
                                    stepStatus === 'rejected' ? 'text-red-400' :
                                        stepStatus === 'completed' ? 'text-green-400' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </p>
                                <p className="text-[8px] text-gray-400 hidden lg:block leading-tight font-medium">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const UsulanPembangunan = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usulanList, setUsulanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailUsulan, setDetailUsulan] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        judul: '',
        kategori: 'Infrastruktur & Fisik',
        deskripsi: '',
        estimasi_biaya: '',
        volume: '',
        titik_koordinat: '',
        alamat_lengkap: '',
        foto_1: null,
        foto_2: null,
        foto_3: null
    });

    const fetchUsulan = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/musrenbang/');
            setUsulanList(response.data);
        } catch (error) {
            console.error('Error fetching usulan:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsulan();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsulan]);

    useEffect(() => {
        // Handle Pre-fill from Aspirasi
        const timer = setTimeout(() => {
            if (location.state?.prefill) {
                setFormData(prev => ({
                    ...prev,
                    ...location.state.prefill
                }));
                setIsModalOpen(true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('kategori', formData.kategori);
        data.append('deskripsi', formData.deskripsi);
        data.append('estimasi_biaya', formData.estimasi_biaya);
        data.append('volume', formData.volume);
        data.append('titik_koordinat', formData.titik_koordinat);
        data.append('alamat_lengkap', formData.alamat_lengkap);

        if (formData.foto_1) data.append('foto_1', formData.foto_1);
        if (formData.foto_2) data.append('foto_2', formData.foto_2);
        if (formData.foto_3) data.append('foto_3', formData.foto_3);

        try {
            await api.post('/users/api/musrenbang/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ Usulan berhasil dikirim!');
            setIsModalOpen(false);
            setFormData({
                judul: '', kategori: 'Infrastruktur & Fisik', deskripsi: '', estimasi_biaya: '',
                volume: '', titik_koordinat: '', alamat_lengkap: '', foto_1: null, foto_2: null, foto_3: null
            });
            fetchUsulan();
        } catch (error) {
            console.error('Error submitting usulan:', error);
            alert('❌ Gagal mengirim usulan. Pastikan semua field terisi.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DISETUJUI': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'DITOLAK': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'; // MENUNGGU
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Usulan Pembangunan (Musrenbang)</h2>
                    <p className="text-gray-400 text-sm">Ajukan rancangan program dan pantau status persetujuan dari Kaur Perencanaan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
                >
                    <span>+</span> Buat Usulan Baru
                </button>
            </div>

            {/* TABEL USULAN LPM */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/80 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">ID Usulan</th>
                                <th className="py-4 px-6 font-semibold">Judul Program & Lokasi</th>
                                <th className="py-4 px-6 font-semibold">Kategori</th>
                                <th className="py-4 px-6 font-semibold">Status Persetujuan</th>
                                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400 italic">Memuat data...</td>
                                </tr>
                            ) : usulanList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400 italic">Belum ada usulan yang Anda buat.</td>
                                </tr>
                            ) : usulanList.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setDetailUsulan(item)}>
                                    <td className="py-4 px-6 font-mono text-xs text-gray-400 uppercase">
                                        {item.usulan_id}
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-white text-sm mb-1">{item.judul}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">📍 {item.lokasi}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 w-max border ${getStatusColor(item.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'MENUNGGU' ? 'bg-yellow-400 animate-pulse' : (item.status === 'DISETUJUI' ? 'bg-green-400' : 'bg-red-400')}`}></span>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 mx-auto bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 group-hover:bg-blue-500/10 transition-all font-bold">
                                            Lacak ➜
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DETAIL & TRACKING USULAN */}
            {
                detailUsulan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">

                            {/* Header Modal */}
                            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-tight">Detail & Pelacakan Usulan</h3>
                                    <p className="text-sm text-yellow-400 mt-1 font-mono uppercase">{detailUsulan.usulan_id}</p>
                                </div>
                                <button onClick={() => setDetailUsulan(null)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">

                                {/* BAGIAN 1: GRAFIK TRACKING */}
                                <div className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-6 md:px-10 mb-8 mt-2 pb-16">
                                    <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-6 text-center">Status Perjalanan Pembangunan</h4>

                                    <GrafikTracking status={detailUsulan.status} />

                                    {/* Info Khusus Jika Ditolak */}
                                    {detailUsulan.status === 'DITOLAK' && (
                                        <div className="mt-12 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                            <span className="text-red-400 font-bold text-sm block mb-1">Usulan Ditolak / Perlu Revisi</span>
                                            <span className="text-gray-300 text-xs italic">
                                                "{detailUsulan.catatan_verifikator || 'Harap hubungi kaur perencanaan untuk detail revisi.'}"
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* BAGIAN 2: DETAIL INFORMASI PROGRAM */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Judul Program</h4>
                                            <p className="text-lg font-bold text-white">{detailUsulan.judul}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                                <span className="text-xs text-gray-500 block mb-1">Kategori</span>
                                                <span className="text-sm text-blue-400 font-medium">{detailUsulan.kategori}</span>
                                            </div>
                                            <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                                <span className="text-xs text-gray-500 block mb-1">Estimasi Biaya</span>
                                                <span className="text-sm text-yellow-400 font-bold">
                                                    Rp {parseFloat(detailUsulan.estimasi_biaya || 0).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                                <span className="text-xs text-gray-500 block mb-1">Volume</span>
                                                <span className="text-sm text-white font-semibold">{detailUsulan.volume || '-'}</span>
                                            </div>
                                            <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                                <span className="text-xs text-gray-500 block mb-1">📍 Lokasi / Titik</span>
                                                <span className="text-[10px] text-gray-300 font-mono truncate block" title={detailUsulan.titik_koordinat}>
                                                    {detailUsulan.titik_koordinat || 'Data tidak tersedia'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 mt-4">Alamat Lokasi Lengkap</h4>
                                            <p className="text-sm text-white bg-[#1e293b]/40 p-4 rounded-xl border border-white/5 mb-4">
                                                {detailUsulan.alamat_lengkap || 'Tidak ada alamat lengkap'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Urgensi / Latar Belakang</h4>
                                            <p className="text-sm text-gray-300 leading-relaxed bg-[#1e293b]/20 p-4 rounded-xl border border-white/5 italic">
                                                {detailUsulan.deskripsi}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kolom Kanan: Foto Dokumentasi */}
                                    <div>
                                        <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Dokumentasi Awal</h4>
                                        <div className="space-y-3">
                                            {[detailUsulan.foto_1, detailUsulan.foto_2, detailUsulan.foto_3].map((foto, idx) => (
                                                <div key={idx} className="aspect-video bg-[#1e293b]/60 border border-white/10 rounded-xl overflow-hidden group relative">
                                                    {foto ? (
                                                        <img
                                                            src={typeof foto === 'string' && foto.startsWith('http') ? foto : `http://127.0.0.1:8000${foto}`}
                                                            alt="Dokumentasi"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-pointer"
                                                            onClick={() => window.open(typeof foto === 'string' && foto.startsWith('http') ? foto : `http://127.0.0.1:8000${foto}`, '_blank')}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                                            <span className="text-xl opacity-20">📸</span>
                                                            <span className="text-[10px] italic">No File</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                                <h3 className="text-lg font-bold text-white">Formulir Usulan Musrenbang</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Judul Program / Kegiatan</label>
                                    <input
                                        type="text"
                                        name="judul"
                                        required
                                        value={formData.judul}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Cth: Pembuatan Sumur Bor Air Bersih..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Kategori Pembangunan</label>
                                        <select
                                            name="kategori"
                                            value={formData.kategori}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition appearance-none cursor-pointer"
                                        >
                                            <option>Infrastruktur & Fisik</option>
                                            <option>Fasilitas Kesehatan</option>
                                            <option>Pemberdayaan Ekonomi</option>
                                            <option>Pendidikan & Sosial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Lokasi Wilayah (Otomatis)</label>
                                        <div className="w-full px-4 py-3 bg-[#0f172a] border border-white/5 rounded-xl text-gray-400 cursor-not-allowed flex items-center gap-2">
                                            <span>🔒</span> {user?.unit_detail || 'Wilayah LPM'}
                                        </div>
                                        <p className="text-xs text-yellow-500/70 mt-1">Lokasi dikunci sesuai wewenang akun Anda.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Alamat Lokasi Lengkap</label>
                                    <textarea
                                        name="alamat_lengkap"
                                        required
                                        value={formData.alamat_lengkap}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-gray-300 focus:border-yellow-500 outline-none leading-relaxed"
                                        placeholder="Cth: Jl. Raya Cimanggu No. 123, RT 01/RW 05..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Latar Belakang / Urgensi Usulan</label>
                                    <textarea
                                        name="deskripsi"
                                        required
                                        value={formData.deskripsi}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-gray-300 focus:border-yellow-500 outline-none leading-relaxed"
                                        placeholder="Jelaskan mengapa program ini sangat dibutuhkan warga..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Volume (Cth: 75 Meter / 1 Unit)</label>
                                        <input
                                            type="text"
                                            name="volume"
                                            required
                                            value={formData.volume}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                            placeholder="Contoh: 200 x 1.2 x 0.10 M"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Titik Koordinat (Opsional)</label>
                                        <input
                                            type="text"
                                            name="titik_koordinat"
                                            value={formData.titik_koordinat}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                            placeholder="Contoh: -7.123, 108.456"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Estimasi Kasar Biaya (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                        <input
                                            type="number"
                                            name="estimasi_biaya"
                                            required
                                            value={formData.estimasi_biaya}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                            placeholder="15000000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300">Foto Kondisi Lapangan (Maks. 3 Foto)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                            <label className="block text-[10px] text-gray-500 uppercase mb-2">Foto Utama</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'foto_1')}
                                                className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                            />
                                        </div>
                                        <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                            <label className="block text-[10px] text-gray-500 uppercase mb-2">Detail 1</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'foto_2')}
                                                className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                            />
                                        </div>
                                        <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                            <label className="block text-[10px] text-gray-500 uppercase mb-2">Detail 2</label>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'foto_3')}
                                                className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 transition">Batal</button>
                                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(234,179,8,0.3)]">Kirim Usulan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default UsulanPembangunan;
