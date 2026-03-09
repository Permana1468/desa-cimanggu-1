import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Plus, Calendar, MapPin, Users, Tag, X, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
    'Direncanakan': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Berjalan': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Selesai': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Dibatalkan': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const INITIAL_FORM = {
    judul: '', kategori: 'Sosial', tanggal: '', lokasi: '',
    deskripsi: '', jumlah_peserta: 0, status: 'Direncanakan'
};

const BukuKegiatanLPM = () => {
    const [kegiatanList, setKegiatanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [filterStatus, setFilterStatus] = useState('Semua');

    useEffect(() => { fetchKegiatan(); }, []);

    const fetchKegiatan = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/kegiatan-lpm/');
            setKegiatanList(response.data);
        } catch (e) {
            console.error('Error fetching kegiatan:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            // unit_lpm will be set automatically by the backend
            await api.post('/users/api/kegiatan-lpm/', formData);
            setIsModalOpen(false);
            setFormData(INITIAL_FORM);
            fetchKegiatan();
        } catch (error) {
            console.error('Error saving kegiatan:', error);
            alert('Gagal menyimpan kegiatan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin menghapus kegiatan ini?')) return;
        try {
            await api.delete(`/users/api/kegiatan-lpm/${id}/`);
            fetchKegiatan();
        } catch (e) {
            alert('Gagal menghapus kegiatan.');
        }
    };

    const filtered = filterStatus === 'Semua' ? kegiatanList : kegiatanList.filter(k => k.status === filterStatus);
    const statuses = ['Semua', 'Direncanakan', 'Berjalan', 'Selesai', 'Dibatalkan'];

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-yellow-500 w-7 h-7" />
                        Buku Kegiatan LPM
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Pencatatan seluruh program dan kegiatan LPM di unit Anda.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] active:scale-95 text-sm">
                    <Plus className="w-4 h-4" /> Catat Kegiatan
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
                {statuses.map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatus === s ? 'bg-yellow-500 text-black border-yellow-500' : 'border-white/10 text-gray-400 hover:text-white'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="py-20 text-center text-gray-500 animate-pulse">Memuat data kegiatan...</div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-[#1e293b]/20 rounded-3xl border border-dashed border-white/10 text-gray-500 italic">
                    Belum ada kegiatan tercatat.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map(k => (
                        <div key={k.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <span className={`text-[10px] font-black border px-2 py-0.5 rounded uppercase tracking-widest ${STATUS_COLORS[k.status]}`}>{k.status}</span>
                                    <h3 className="text-lg font-bold text-white mt-2 leading-tight group-hover:text-yellow-400 transition-colors">{k.judul}</h3>
                                </div>
                                <button onClick={() => handleDelete(k.id)} className="text-gray-600 hover:text-red-400 transition-colors ml-4 p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-purple-400" /> {k.kategori}</div>
                                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-blue-400" /> {k.tanggal}</div>
                                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-400" /> {k.lokasi}</div>
                                <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-green-400" /> {k.jumlah_peserta} peserta</div>
                            </div>
                            {k.deskripsi && <p className="text-xs text-gray-500 mt-4 border-t border-white/5 pt-4 line-clamp-2">{k.deskripsi}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#1e293b]/50">
                            <h3 className="font-bold text-white">Catat Kegiatan Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Judul Kegiatan</label>
                                <input required value={formData.judul} onChange={e => setFormData({ ...formData, judul: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="cth: Musyawarah Tahunan LPM" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Kategori</label>
                                    <select value={formData.kategori} onChange={e => setFormData({ ...formData, kategori: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50">
                                        {['Sosial', 'Pemberdayaan', 'Pengawasan', 'Rapat', 'Lainnya'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50">
                                        {['Direncanakan', 'Berjalan', 'Selesai', 'Dibatalkan'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Tanggal</label>
                                    <input required type="date" value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Jml. Peserta</label>
                                    <input type="number" min="0" value={formData.jumlah_peserta} onChange={e => setFormData({ ...formData, jumlah_peserta: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Lokasi</label>
                                <input required value={formData.lokasi} onChange={e => setFormData({ ...formData, lokasi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="cth: Balai Desa RW 01" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Deskripsi (opsional)</label>
                                <textarea rows="3" value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 resize-none" placeholder="Keterangan singkat kegiatan..." />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-gray-400 text-sm font-bold hover:bg-white/5 transition">Batal</button>
                                <button type="submit" disabled={isSaving} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BukuKegiatanLPM;
