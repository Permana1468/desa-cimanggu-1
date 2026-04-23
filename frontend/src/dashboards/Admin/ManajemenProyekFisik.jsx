import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManajemenProyekFisik = () => {
    const [selectedProyek, setSelectedProyek] = useState(null);
    const [progresValue, setProgresValue] = useState(0);
    const [proyekAktif, setProyekAktif] = useState([]);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState({ foto_1: null, foto_2: null, foto_3: null });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProyek();
    }, []);

    const fetchProyek = async () => {
        try {
            setLoading(true);
            // Fetch all projects using the new endpoint
            const response = await api.get('/users/api/proyek/');
            // Filter only for projects in PELAKSANAAN phase
            const filtered = response.data.filter(p => p.status === 'PELAKSANAAN');
            setProyekAktif(filtered);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const bukaModalUpdate = (proyek) => {
        setSelectedProyek(proyek);
        setProgresValue(proyek.progres_fisik || 0);
        setFiles({ foto_1: null, foto_2: null, foto_3: null });
    };

    const handleFileChange = (e, field) => {
        setFiles({ ...files, [field]: e.target.files[0] });
    };

    const simpanProgres = async () => {
        try {
            setIsSaving(true);
            const formData = new FormData();
            // Sending as 'progres_persen' per user requirement
            formData.append('progres_persen', progresValue);
            if (files.foto_1) formData.append('foto_1', files.foto_1);
            if (files.foto_2) formData.append('foto_2', files.foto_2);
            if (files.foto_3) formData.append('foto_3', files.foto_3);

            // Using the formal endpoint /api/proyek/<id>/update_progres/
            await api.patch(`/users/api/proyek/${selectedProyek.id}/update_progres/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('✅ Progres proyek fisik berhasil dilaporkan ke sistem!');
            setSelectedProyek(null);
            fetchProyek();
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('❌ Gagal mengupdate progres. Pastikan Anda memiliki otorisasi Kasi Kesejahteraan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Manajemen Proyek Fisik Lapangan</h2>
                <p className="text-gray-400 text-sm">Update persentase pengerjaan dan unggah foto dokumentasi harian.</p>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-500 italic text-lg text-white">Memuat data pengerjaan fisik...</div>
            ) : proyekAktif.length === 0 ? (
                <div className="py-20 text-center bg-[#1e293b]/20 border border-white/5 rounded-3xl backdrop-blur-sm">
                    <p className="text-gray-500 mb-4 italic">Belum ada proyek dalam tahap pengerjaan fisik.</p>
                    <p className="text-xs text-gray-600 uppercase tracking-widest">Menunggu pencairan dari Bendahara Desa</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proyekAktif.map((proyek) => (
                        <div key={proyek.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                            {/* Indikator Progres Bar */}
                            <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.8)]" style={{ width: `${proyek.progres_fisik}%` }}></div>

                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">{proyek.usulan_id}</span>
                                <span className="text-2xl font-black text-white">{proyek.progres_fisik}%</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{proyek.judul}</h3>
                            <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                                <span className="text-yellow-500">📍</span> {proyek.lokasi}
                            </p>

                            <button
                                onClick={() => bukaModalUpdate(proyek)}
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] active:scale-95"
                            >
                                UPDATE PROGRES
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL UPDATE PROGRES & FOTO */}
            {selectedProyek && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">

                        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">Laporan Lapangan</h3>
                                <p className="text-xs text-yellow-500 mt-1 font-mono font-bold tracking-widest">{selectedProyek.usulan_id}</p>
                            </div>
                            <button onClick={() => setSelectedProyek(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Slider Persentase Interaktif */}
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-4">
                                    <span className="text-gray-400 uppercase tracking-tighter">Persentase Fisik</span>
                                    <span className="text-yellow-400 text-xl font-black">{progresValue}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100" step="5"
                                    value={progresValue}
                                    onChange={(e) => setProgresValue(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 ring-4 ring-yellow-500/5"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold">
                                    <span>MULAI</span>
                                    <span>TENGAH</span>
                                    <span>SELESAI</span>
                                </div>
                            </div>

                            {/* Upload 3 Foto Progres */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Dokumentasi Progres (3 Sisi)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['foto_1', 'foto_2', 'foto_3'].map((field, idx) => (
                                        <div key={field} className="relative group overflow-hidden">
                                            <div className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all bg-[#1e293b]/30 ${files[field] ? 'border-green-500 bg-green-500/5' : 'border-white/10 hover:border-yellow-500/50'}`}>
                                                <span className="text-2xl mb-1">{files[field] ? '✅' : '📸'}</span>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    {idx === 0 ? 'Kiri' : idx === 1 ? 'Tengah' : 'Kanan'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, field)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            {files[field] && (
                                                <div className="mt-1 text-[8px] text-green-400 font-bold truncate text-center">
                                                    {files[field].name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                                <button onClick={() => setSelectedProyek(null)} className="px-6 py-2.5 rounded-xl text-gray-400 font-bold hover:bg-white/5 transition uppercase text-xs">Batal</button>
                                <button
                                    onClick={simpanProgres}
                                    disabled={isSaving}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 uppercase text-xs"
                                >
                                    {isSaving ? '⌛ Mengirim...' : 'Simpan Laporan'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ManajemenProyekFisik;

