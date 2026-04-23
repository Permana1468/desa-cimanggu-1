import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Users, Plus, Phone, MapPin, Briefcase, CheckCircle, XCircle, X, Loader2, Star } from 'lucide-react';

const JABATAN_ORDER = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Koordinator Bidang', 'Anggota'];

const INITIAL_FORM = {
    nama: '', jabatan: 'Anggota', bidang: '', no_hp: '',
    alamat: '', periode: '', is_active: true
};

const DataPengurusLPM = () => {
    const [pengurusList, setPengurusList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [showActiveOnly, setShowActiveOnly] = useState(true);

    const fetchPengurus = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/pengurus-lpm/');
            setPengurusList(response.data);
        } catch (e) {
            console.error('Error fetching pengurus:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        const timer = setTimeout(() => {
            fetchPengurus();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchPengurus]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await api.post('/users/api/pengurus-lpm/', formData);
            setIsModalOpen(false);
            setFormData(INITIAL_FORM);
            fetchPengurus();
        } catch (error) {
            console.error('Error saving pengurus:', error);
            alert('Gagal menyimpan data pengurus.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin menghapus data pengurus ini?')) return;
        try {
            await api.delete(`/users/api/pengurus-lpm/${id}/`);
            fetchPengurus();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Gagal menghapus data.');
        }
    };

    const filtered = showActiveOnly ? pengurusList.filter(p => p.is_active) : pengurusList;

    // Compute stats
    const totalActive = pengurusList.filter(p => p.is_active).length;
    const totalAll = pengurusList.length;

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="text-yellow-500 w-7 h-7" />
                        Data Pengurus LPM
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Struktur kelembagaan pengurus aktif di unit Anda.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] active:scale-95 text-sm">
                    <Plus className="w-4 h-4" /> Tambah Pengurus
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#1e293b]/40 border border-white/10 rounded-2xl p-5">
                    <p className="text-3xl font-black text-white">{totalActive}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Pengurus Aktif</p>
                </div>
                <div className="bg-[#1e293b]/40 border border-white/10 rounded-2xl p-5">
                    <p className="text-3xl font-black text-white">{totalAll}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Total Terdaftar</p>
                </div>
                <div className="bg-[#1e293b]/40 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={showActiveOnly} onChange={e => setShowActiveOnly(e.target.checked)} />
                            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-yellow-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                        </label>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Tampilkan aktif saja</p>
                    </div>
                </div>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="py-20 text-center text-gray-500 animate-pulse">Memuat data pengurus...</div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-[#1e293b]/20 rounded-3xl border border-dashed border-white/10 text-gray-500 italic">
                    Belum ada data pengurus tersimpan.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.sort((a, b) => JABATAN_ORDER.indexOf(a.jabatan) - JABATAN_ORDER.indexOf(b.jabatan)).map(p => (
                        <div key={p.id} className={`bg-[#1e293b]/40 backdrop-blur-xl border rounded-2xl p-6 transition-all group relative ${p.is_active ? 'border-white/10 hover:border-yellow-500/30' : 'border-white/5 opacity-60'}`}>
                            {p.jabatan === 'Ketua' && (
                                <Star className="absolute top-4 right-4 w-4 h-4 text-yellow-500 fill-yellow-500/30" />
                            )}
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center font-black text-yellow-400 text-lg flex-shrink-0">
                                    {p.nama.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{p.nama}</p>
                                    <p className="text-xs text-yellow-400 font-semibold">{p.jabatan}</p>
                                    {p.bidang && <p className="text-[11px] text-gray-500 mt-0.5">Bid. {p.bidang}</p>}
                                </div>
                            </div>
                            <div className="space-y-2 text-xs text-gray-400">
                                {p.no_hp && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-blue-400" /> {p.no_hp}</div>}
                                {p.alamat && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-400" /> <span className="truncate">{p.alamat}</span></div>}
                                <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-purple-400" /> Periode {p.periode}</div>
                                <div className="flex items-center gap-2">
                                    {p.is_active ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                                    <span>{p.is_active ? 'Aktif' : 'Tidak Aktif'}</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(p.id)} className="absolute top-3 right-3 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#1e293b]/50">
                            <h3 className="font-bold text-white">Tambah Data Pengurus</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                                <input required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="Nama lengkap pengurus" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Jabatan</label>
                                    <select value={formData.jabatan} onChange={e => setFormData({ ...formData, jabatan: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50">
                                        {JABATAN_ORDER.map(j => <option key={j}>{j}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Bidang</label>
                                    <input value={formData.bidang} onChange={e => setFormData({ ...formData, bidang: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="opsional" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">No. HP</label>
                                    <input value={formData.no_hp} onChange={e => setFormData({ ...formData, no_hp: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="08xx-xxxx-xxxx" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Periode</label>
                                    <input required value={formData.periode} onChange={e => setFormData({ ...formData, periode: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="2023 - 2026" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Alamat</label>
                                <input value={formData.alamat} onChange={e => setFormData({ ...formData, alamat: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50" placeholder="opsional" />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                                    <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-yellow-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                                </label>
                                <span className="text-sm text-gray-400">Pengurus aktif</span>
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

export default DataPengurusLPM;
