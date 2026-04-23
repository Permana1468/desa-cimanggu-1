import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Construction, MapPin, Camera, Maximize2, ShieldCheck, Search, Info, Activity } from 'lucide-react';

const PantauProyekDesa = () => {
    const [proyekList, setProyekList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchMonitoringData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/monitoring-proyek/');
            setProyekList(response.data);
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMonitoringData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchMonitoringData]);

    const filteredProyek = proyekList.filter(p =>
        (p.judul || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.usulan_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        <Construction className="text-yellow-500 w-8 h-8" />
                        Pantau Proyek Desa
                    </h2>
                    <p className="text-gray-400 text-sm">Monitoring real-time progres pengerjaan fisik proyek pembangunan desa.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari ID atau Judul Proyek..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-500">Menghubungkan ke pusat data proyek...</div>
            ) : filteredProyek.length === 0 ? (
                <div className="py-20 text-center bg-[#1e293b]/20 rounded-3xl border border-dashed border-white/10 text-gray-500 italic">
                    {searchTerm ? `Tidak ditemukan proyek dengan kata kunci "${searchTerm}"` : 'Belum ada proyek dalam tahap pelaksanaan fisik.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredProyek.map((proyek) => (
                        <div key={proyek.id} className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:border-yellow-500/30 transition-all group relative flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 blur-[100px] pointer-events-none group-hover:bg-yellow-500/10 transition-colors"></div>

                            {/* Card Top */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-widest">
                                            {proyek.usulan_id}
                                        </span>
                                        <span className={`text-[10px] font-black border px-2 py-0.5 rounded uppercase tracking-widest ${proyek.status === 'SELESAI' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {proyek.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight mt-2">{proyek.judul}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Anggaran Terpagu</p>
                                    <p className="text-lg font-black text-white">Rp {parseFloat(proyek.estimasi_biaya || 0).toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* Info Rows */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <span className="font-bold text-gray-300">{proyek.lokasi}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 ml-7 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                                        {proyek.alamat_lengkap || 'Alamat lengkap tidak tersedia'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span className="truncate">{proyek.kategori}</span>
                                </div>
                            </div>

                            {/* Progress Visual */}
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-3.5 h-3.5 text-yellow-500" />
                                        Realisasi Fisik
                                    </p>
                                    <p className="text-3xl font-black text-white tracking-tighter">
                                        {proyek.progres_fisik}<span className="text-sm text-gray-500 ml-1">%</span>
                                    </p>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.3)] ${proyek.progres_fisik >= 100 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                        style={{ width: `${proyek.progres_fisik}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Photos Section */}
                            <div className="mt-auto">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Camera className="w-3 h-3" />
                                    Dokumentasi Lapangan
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[proyek.foto_1, proyek.foto_2, proyek.foto_3].map((foto, idx) => (
                                        <div key={idx} className="aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden group/img relative">
                                            {foto ? (
                                                <>
                                                    <img
                                                        src={foto}
                                                        alt={`Progres ${idx + 1}`}
                                                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                                                        onClick={() => setSelectedImage(foto)}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                        <Maximize2 className="text-white w-5 h-5" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                                    <Info className="w-4 h-4 mb-1 opacity-20" />
                                                    <span className="text-[8px] font-bold uppercase tracking-tight opacity-30">N/A</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen Image Overlay */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="max-w-5xl w-full h-[80vh] relative animate-scale-up" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage} alt="Fullscreen View" className="w-full h-full object-contain rounded-3xl" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all shadow-2xl"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-gray-500 mt-6 font-mono text-xs uppercase tracking-[0.3em]">Klik di area mana saja untuk menutup</p>
                </div>
            )}
        </div>
    );
};

export default PantauProyekDesa;
