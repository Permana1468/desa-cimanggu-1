import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';
import Modal from '../../components/Shared/Modal';
import { FileText, Image as ImageIcon, Send, Trash2, Calendar, Eye, PenTool } from 'lucide-react';

const KelolaBerita = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [beritaList, setBeritaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        judul: '',
        kategori: 'Pengumuman',
        konten: '',
        gambar_cover: null
    });

    const fetchBerita = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users/api/berita/');
            setBeritaList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data berita", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBerita();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchBerita]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'gambar_cover') {
            setFormData(prev => ({ ...prev, gambar_cover: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('kategori', formData.kategori);
            data.append('konten', formData.konten);
            
            if (formData.gambar_cover) {
                const compressedFile = await compressImage(formData.gambar_cover);
                data.append('gambar_cover', compressedFile);
            }
            await api.post('/users/api/berita/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            setFormData({ judul: '', kategori: 'Pengumuman', konten: '', gambar_cover: null });
            fetchBerita();
        } catch (error) {
            console.error("Gagal mengirim data berita", error);
            alert("Gagal mempublikasikan berita.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus berita ini?")) return;
        try {
            await api.delete(`/users/api/berita/${id}/`);
            fetchBerita();
        } catch (error) {
            console.error("Gagal menghapus berita", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full">
            {/* Header section identical to other dashboards */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Kelola Publikasi
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
                    </h2>
                    <p className="text-white/30 text-[13px] font-medium mt-1">Manajemen berita, pengumuman, and artikel desa.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-2xl font-black text-[14px] 
                                transition-all duration-300 flex items-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:-translate-y-1"
                >
                    <PenTool size={18} className="group-hover:rotate-12 transition-transform" />
                    TULIS BERITA BARU
                </button>
            </div>

            {/* List Table Glassmorphism */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.04] border-b border-white/[0.07] text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="p-6">Informasi Berita</th>
                                <th className="p-6">Kategori</th>
                                <th className="p-6">Publikasi</th>
                                <th className="p-6 text-center w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-12 text-center text-white/20 font-bold uppercase tracking-widest animate-pulse">Sinkronisasi Berita...</td></tr>
                            ) : beritaList.map((berita) => (
                                <tr key={berita.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6 max-w-sm">
                                        <div className="flex items-center gap-4">
                                            {berita.gambar_cover ? (
                                                <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0">
                                                    <img src={berita.gambar_cover} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 shrink-0">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-[14.5px] font-bold text-white leading-tight truncate">{berita.judul}</div>
                                                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/30">
                                                    <span className="flex items-center gap-1"><Eye size={12} /> {berita.views} Views</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(berita.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {berita.kategori}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">PUBLISHED</span>
                                        </div>
                                    </td>
                                    <td className="p-6 pr-8 text-center text-white/20 group-hover:text-red-400">
                                        <button onClick={() => handleDelete(berita.id)} className="p-2.5 rounded-xl hover:bg-red-500/20 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Refactored */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Penerbitan Artikel Desa"
                icon={FileText}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-white/40 hover:text-white transition-colors">Batal</button>
                        <button type="submit" form="beritaForm" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black text-[14px] flex items-center gap-2">
                            {isSaving ? 'MEMPROSES...' : <><Send size={16} /> PUBLIKASIKAN SEKARANG</>}
                        </button>
                    </>
                }
            >
                <form id="beritaForm" onSubmit={handleSubmit} className="space-y-8">
                    {/* Judul */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Judul Artikel Utama</label>
                        <input
                            required type="text" name="judul" value={formData.judul} onChange={handleChange}
                            placeholder="Contoh: Penyaluran BLT Dana Desa Tahap I"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-[15px] font-bold outline-none transition-all duration-300 focus:border-blue-500/50 focus:bg-blue-500/[0.02]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kategori */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Klasifikasi</label>
                            <select
                                name="kategori" value={formData.kategori} onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-[13px] outline-none transition-all appearance-none cursor-pointer focus:border-blue-500/50"
                            >
                                <option value="Kegiatan" className="bg-[#0f172a]">Kegiatan Pembangunan</option>
                                <option value="Pengumuman" className="bg-[#0f172a]">Pengumuman Resmi</option>
                                <option value="Bansos" className="bg-[#0f172a]">Informasi Bantuan Sosial</option>
                            </select>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Media Cover (HighRes)</label>
                            <div className="relative group/file">
                                <input type="file" name="gambar_cover" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                                <div className="w-full px-5 py-4 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl text-white/20 group-hover/file:border-blue-500/30 group-hover/file:bg-blue-500/[0.03] transition-all flex items-center gap-3">
                                    <ImageIcon size={18} className="text-white/10" />
                                    <span className="text-[12px] font-bold truncate">
                                        {formData.gambar_cover ? formData.gambar_cover.name : 'Unggah Banner Berita...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Konten */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Deskripsi Konten Lengkap</label>
                        <textarea
                            required name="konten" value={formData.konten} onChange={handleChange} rows="8"
                            placeholder="Ceritakan detail kegiatan atau isi pengumuman secara deskriptif..."
                            className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-3xl text-white outline-none leading-relaxed transition-all resize-none shadow-inner focus:border-blue-500/50"
                        ></textarea>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default KelolaBerita;
