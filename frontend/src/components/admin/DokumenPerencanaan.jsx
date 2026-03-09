import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DokumenPerencanaan = () => {
    const [activeTab, setActiveTab] = useState('RPJMDes');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Data Dokumen dari API
    const [dokumenList, setDokumenList] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        jenis: 'RPJMDes',
        judul: '',
        periode: '',
        status: 'Drafting',
        file: null
    });

    useEffect(() => {
        fetchDokumen();
    }, []);

    const fetchDokumen = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/dokumen-perencanaan/');
            setDokumenList(response.data);
        } catch (error) {
            console.error('Gagal mengambil dokumen:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file || !formData.judul || !formData.periode) {
            alert('Harap isi semua field dan pilih file PDF.');
            return;
        }

        const data = new FormData();
        data.append('jenis', formData.jenis);
        data.append('judul', formData.judul);
        data.append('periode', formData.periode);
        data.append('status', formData.status);
        data.append('file_dokumen', formData.file);

        try {
            setUploading(true);
            await api.post('/users/api/dokumen-perencanaan/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ Dokumen berhasil diarsipkan!');
            setIsModalOpen(false);
            setFormData({ jenis: 'RPJMDes', judul: '', periode: '', status: 'Drafting', file: null });
            fetchDokumen();
        } catch (error) {
            console.error('Gagal mengunggah dokumen:', error);
            alert('❌ Gagal mengunggah dokumen. Pastikan file adalah PDF.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus dokumen ini dari arsip?')) return;
        try {
            await api.delete(`/users/api/dokumen-perencanaan/${id}/`);
            fetchDokumen();
        } catch (error) {
            console.error('Gagal menghapus dokumen:', error);
        }
    };

    const filteredDokumen = dokumenList.filter(doc => doc.jenis === activeTab);

    // Helper: Format Ukuran File (Jika tersedia di metadata aslinya atau kita hitung sederhana)
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">

            {/* HEADER PAGE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Dokumen Induk Perencanaan</h2>
                    <p className="text-gray-400 text-sm">Arsip digital RPJMDes (Jangka Menengah 6 Tahun) dan RKPDes (Rencana Kerja Tahunan).</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
                >
                    <span>📤</span> Unggah Dokumen
                </button>
            </div>

            {/* SISTEM TAB INTERAKTIF */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('RPJMDes')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'RPJMDes'
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                        : 'bg-[#1e293b]/50 text-gray-400 hover:text-white hover:bg-[#1e293b]'
                        }`}
                >
                    📘 RPJMDes (6 Tahun)
                </button>
                <button
                    onClick={() => setActiveTab('RKPDes')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'RKPDes'
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                        : 'bg-[#1e293b]/50 text-gray-400 hover:text-white hover:bg-[#1e293b]'
                        }`}
                >
                    📗 RKPDes (Tahunan)
                </button>
            </div>

            {/* GRID KARTU DOKUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 italic">Memuat arsip dokumen...</div>
                ) : filteredDokumen.length > 0 ? (
                    filteredDokumen.map((doc) => (
                        <div key={doc.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/30">

                            {/* Efek Garis Glow Berdasarkan Status */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${doc.status === 'Disahkan' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]'}`}></div>

                            <div className="flex justify-between items-start mb-4 mt-2">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${activeTab === 'RPJMDes' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                    📄
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${doc.status === 'Disahkan' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        {doc.status}
                                    </span>
                                    <button onClick={() => handleDelete(doc.id)} className="p-1 text-gray-500 hover:text-red-500 transition-colors">🗑️</button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{doc.judul}</h3>

                            <div className="space-y-1.5 mb-6">
                                <p className="text-xs text-gray-400 flex justify-between">
                                    <span>Periode Berlaku:</span> <span className="text-gray-200 font-bold">{doc.periode}</span>
                                </p>
                                <p className="text-xs text-gray-400 flex justify-between">
                                    <span>Tanggal Unggah:</span> <span className="text-gray-200">{new Date(doc.uploaded_at).toLocaleDateString('id-ID')}</span>
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <a
                                    href={doc.file_dokumen}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    👁️ Lihat File
                                </a>
                                <a
                                    href={doc.file_dokumen}
                                    download
                                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    ⬇️ Unduh PDF
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-[#0f172a]/30 rounded-3xl border border-white/5 border-dashed">
                        <span className="text-5xl block mb-4 opacity-50">📭</span>
                        <p className="text-gray-400 font-medium">Belum ada dokumen {activeTab} yang diunggah.</p>
                    </div>
                )}
            </div>

            {/* MODAL UNGGAH DOKUMEN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">

                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <h3 className="text-lg font-bold text-white">Unggah Dokumen Perencanaan</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Jenis Dokumen</label>
                                <select
                                    name="jenis"
                                    value={formData.jenis}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition appearance-none cursor-pointer"
                                >
                                    <option value="RPJMDes">RPJMDes (Jangka Menengah)</option>
                                    <option value="RKPDes">RKPDes (Tahunan)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Dokumen</label>
                                <input
                                    type="text"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                    placeholder="Cth: RKPDes Desa Cimanggu I Tahun 2026..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tahun / Periode</label>
                                    <input
                                        type="text"
                                        name="periode"
                                        value={formData.periode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Cth: 2026"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status Penetapan</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition appearance-none cursor-pointer"
                                    >
                                        <option value="Drafting">Drafting (Penyusunan)</option>
                                        <option value="Disahkan">Telah Disahkan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">File Dokumen (PDF)</label>
                                <div className="relative border-2 border-dashed border-white/20 hover:border-blue-500/50 rounded-xl p-6 text-center bg-[#1e293b]/30 transition-colors cursor-pointer group">
                                    <span className="text-2xl mb-2 block">📄</span>
                                    <span className="text-xs text-gray-400 block mb-2">
                                        {formData.file ? formData.file.name : 'Klik atau tarik file PDF ke sini (Max 20MB)'}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 transition">Batal</button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={`bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(234,179,8,0.3)] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? 'Sedang Menyimpan...' : 'Simpan Arsip'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default DokumenPerencanaan;
