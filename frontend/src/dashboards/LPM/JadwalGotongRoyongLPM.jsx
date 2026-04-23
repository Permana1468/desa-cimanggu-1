import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, User, Users, Plus, AlertCircle } from 'lucide-react';

const JadwalGotongRoyongLPM = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        tanggal: '',
        waktu: '',
        lokasi: '',
        koordinator: '',
        alat_dibawa: '',
        peserta_target: '',
        status: 'Akan Datang'
    });

    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/gotong-royong/');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSchedules();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchSchedules]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/api/gotong-royong/', formData);
            alert('✅ Jadwal Gotong Royong berhasil dipublikasikan!');
            setIsModalOpen(false);
            setFormData({
                judul: '', tanggal: '', waktu: '', lokasi: '',
                koordinator: '', alat_dibawa: '', peserta_target: '', status: 'Akan Datang'
            });
            fetchSchedules();
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('❌ Gagal membuat jadwal. Periksa kembali inputan Anda.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Berjalan': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Dibatalkan': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        <Users className="text-yellow-500 w-8 h-8" />
                        Jadwal Gotong Royong
                    </h2>
                    <p className="text-gray-400 text-sm">Kelola agenda kerja bakti dan gotong royong warga di wilayah {user?.unit_detail}.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Buat Jadwal Baru
                </button>
            </div>

            {/* List Schedule */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-gray-500">Memuat jadwal...</div>
                ) : schedules.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-[#1e293b]/20 rounded-3xl border border-dashed border-white/10 text-gray-500 italic">
                        Belum ada jadwal gotong royong yang direncanakan.
                    </div>
                ) : (
                    schedules.map((item) => (
                        <div key={item.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-yellow-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl pointer-events-none group-hover:bg-yellow-500/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mt-3 group-hover:text-yellow-400 transition-colors">{item.judul}</h3>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-400 group-hover:border-yellow-500/20 group-hover:text-yellow-500 transition-all cursor-pointer">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 relative z-10">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span>{(item.waktu || '').substring(0, 5)} WIB</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400 col-span-2">
                                    <MapPin className="w-4 h-4 text-red-400" />
                                    <span className="line-clamp-1">{item.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <User className="w-4 h-4 text-green-400" />
                                    <span className="line-clamp-1">{item.koordinator}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Users className="w-4 h-4 text-yellow-400" />
                                    <span className="line-clamp-1">{item.peserta_target}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Alat yang Harus Dibawa:
                                </p>
                                <p className="text-sm text-gray-300 italic">{item.alat_dibawa}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <div>
                                <h3 className="text-lg font-bold text-white">Buat Jadwal Gotong Royong</h3>
                                <p className="text-xs text-gray-400">Publikasikan agenda kerja bakti wilayah LPM {user?.unit_detail}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Judul / Nama Kegiatan</label>
                                    <input type="text" name="judul" required value={formData.judul} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Misal: Kerja Bakti Bersihkan Saluran Air" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tanggal</label>
                                    <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Waktu (Jam Mulai)</label>
                                    <input type="time" name="waktu" required value={formData.waktu} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Lokasi / Titik Kumpul</label>
                                    <input type="text" name="lokasi" required value={formData.lokasi} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Misal: Area Lapangan RW 02" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Koordinator Lapangan</label>
                                    <input type="text" name="koordinator" required value={formData.koordinator} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Nama Koordinator" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Target Peserta</label>
                                    <input type="text" name="peserta_target" required value={formData.peserta_target} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Misal: Seluruh Warga RT 01" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Alat yang Harus Dibawa</label>
                                    <textarea name="alat_dibawa" required value={formData.alat_dibawa} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 resize-none shadow-inner" placeholder="Peralatan apa saja yang perlu dibawa warga (misal: Cangkul, Sabit, Sapu Lidi)..."></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 transition font-semibold">Batal</button>
                                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.4)]">Publikasikan Jadwal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JadwalGotongRoyongLPM;
