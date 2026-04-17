import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

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


    const fetchBerita = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users/api/berita/');
            setBeritaList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data berita", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBerita();
    }, []);

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
                // Kompresi otomatis
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
            
            let errorMsg = "Gagal mempublikasikan berita. Periksa koneksi atau console log.";
            if (error.response) {
                const detail = error.response.data?.detail || error.response.data?.error || JSON.stringify(error.response.data);
                errorMsg += `\n\nDetail: ${error.response.status} - ${detail}`;
            }
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

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
        <div className="text-gray-200 animate-fade-in">
            {/* Header Bagian */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Kelola Berita & Informasi</h2>
                    <p className="text-gray-400 text-sm">Manajemen artikel, pengumuman, dan kegiatan desa.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
                >
                    <span>+</span> Tambah Berita Baru
                </button>
            </div>

            {/* Tabel Data Glassmorphism */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/60 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Judul Berita</th>
                                <th className="py-4 px-6 font-semibold">Kategori</th>
                                <th className="py-4 px-6 font-semibold">Tanggal</th>
                                <th className="py-4 px-6 font-semibold text-center">Views</th>
                                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Memuat data berita...</td>
                                </tr>
                            ) : beritaList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Belum ada berita.</td>
                                </tr>
                            ) : (
                                beritaList.map((berita) => (
                                    <tr key={berita.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 font-medium text-white max-w-xs truncate" title={berita.judul}>{berita.judul}</td>
                                        <td className="py-4 px-6">
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs">
                                                {berita.kategori}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300">{formatDate(berita.created_at)}</td>
                                        <td className="py-4 px-6 text-sm text-center text-yellow-400">{berita.views}</td>
                                        <td className="py-4 px-6 flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete(berita.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM TAMBAH BERITA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
                    <div className="bg-[#0f172a]/95 border-0 md:border md:border-white/10 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-up flex flex-col overflow-hidden">
                        
                        {/* Header Modal */}
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl shrink-0">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em]">Tulis Berita Baru</h3>
                                <p className="text-xs text-yellow-400/70 font-bold mt-1 tracking-widest uppercase">Publikasikan informasi terkini desa</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl p-3 hover:bg-white/10 rounded-full transition-all transform hover:rotate-90">✕</button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                
                                {/* Judul Section */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Judul Artikel</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="judul" 
                                        value={formData.judul} 
                                        onChange={handleChange} 
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg font-bold focus:border-yellow-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" 
                                        placeholder="Masukkan judul berita yang menarik..." 
                                    />
                                </div>

                                {/* Responsive Grid for Category & Image */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Kategori</label>
                                        <div className="relative">
                                            <select 
                                                name="kategori" 
                                                value={formData.kategori} 
                                                onChange={handleChange} 
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Kegiatan">Kegiatan Desa</option>
                                                <option value="Pengumuman">Pengumuman Resmi</option>
                                                <option value="Bansos">Bantuan Sosial</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500">▼</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Gambar Cover (HD)</label>
                                        <div className="relative group">
                                            <input 
                                                required 
                                                type="file" 
                                                name="gambar_cover" 
                                                onChange={handleChange} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                accept="image/*" 
                                            />
                                            <div className="w-full px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all flex items-center gap-4">
                                                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">📸</div>
                                                <span className="text-sm font-medium truncate">
                                                    {formData.gambar_cover ? formData.gambar_cover.name : 'Pilih Gambar...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Konten Textarea */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Konten Berita</label>
                                    <textarea 
                                        required 
                                        name="konten" 
                                        value={formData.konten} 
                                        onChange={handleChange} 
                                        rows="8" 
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-200 focus:border-yellow-500 focus:bg-white/10 outline-none leading-relaxed transition-all resize-none placeholder:text-gray-600" 
                                        placeholder="Tuliskan isi berita secara lengkap di sini..."
                                    ></textarea>
                                </div>

                                {/* Form Actions */}
                                <div className="pt-6 flex flex-col md:flex-row justify-end gap-4 border-t border-white/5">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="order-2 md:order-1 px-8 py-4 rounded-2xl text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving} 
                                        className="order-1 md:order-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:opacity-50 text-[#0f172a] font-black px-12 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>Publikasikan Berita 🚀</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaBerita;
