import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MessageSquare, MapPin, Calendar, ArrowRight, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const AspirasiWargaLPM = () => {
    const [aspirasiList, setAspirasiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAspirasi = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/aspirasi/');
            setAspirasiList(response.data);
        } catch (error) {
            console.error('Gagal mengambil data aspirasi:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAspirasi();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchAspirasi]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/users/api/aspirasi/${id}/`, { status });
            fetchAspirasi();
        } catch (error) {
            console.error('Gagal memperbarui status:', error);
        }
    };

    const deleteAspirasi = async (id) => {
        if (!window.confirm('Hapus aspirasi ini dari daftar?')) return;
        try {
            await api.delete(`/users/api/aspirasi/${id}/`);
            fetchAspirasi();
        } catch (error) {
            console.error('Gagal menghapus aspirasi:', error);
        }
    };

    const jadikanUsulan = (aspirasi) => {
        // Redirect ke form Usulan Pembangunan dengan data pre-filled
        navigate('/dashboard/musrenbang', {
            state: {
                prefill: {
                    judul: `[DARI ASPIRASI] ${aspirasi.kategori}: ${aspirasi.nama_warga}`,
                    deskripsi: `Aspirasi dari: ${aspirasi.nama_warga} (RT/RW: ${aspirasi.rt_rw})\n\nPesan: ${aspirasi.isi_pesan}`,
                    kategori: aspirasi.kategori === 'Infrastruktur' ? 'Infrastruktur & Fisik' : 'Pemberdayaan Ekonomi'
                }
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Ditindaklanjuti': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Aspirasi & Keluhan Warga</h2>
                    <p className="text-gray-400 text-sm">Kelola suara masyarakat di wilayah Anda dan tindak lanjuti menjadi program pembangunan.</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400 italic">Memuat data aspirasi...</div>
            ) : aspirasiList.length === 0 ? (
                <div className="py-20 text-center bg-[#0f172a]/30 rounded-3xl border border-white/5 border-dashed">
                    <span className="text-5xl block mb-4 opacity-50">📭</span>
                    <p className="text-gray-400 font-medium">Belum ada aspirasi dari warga di wilayah Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aspirasiList.map((item) => (
                        <div key={item.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white leading-tight">{item.nama_warga}</h4>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <MapPin size={10} /> RT/RW: {item.rt_rw}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="bg-[#0f172a]/40 rounded-2xl p-4 mb-6 border border-white/5">
                                <p className="text-sm text-gray-300 italic leading-relaxed">"{item.isi_pesan}"</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => updateStatus(item.id, 'Ditindaklanjuti')}
                                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                    >
                                        <Clock size={12} /> Proses
                                    </button>
                                    <button
                                        onClick={() => updateStatus(item.id, 'Selesai')}
                                        className="text-[10px] font-bold text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle2 size={12} /> Selesai
                                    </button>
                                    <button
                                        onClick={() => deleteAspirasi(item.id)}
                                        className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Hapus
                                    </button>
                                </div>

                                <button
                                    onClick={() => jadikanUsulan(item)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 px-4 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    Jadikan Usulan <ArrowRight size={12} />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600 font-mono">
                                <span>Kategori: {item.kategori}</span>
                                <span className="flex items-center gap-1 italic"><Calendar size={10} /> {new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AspirasiWargaLPM;
