import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Users, UserPlus, PhoneCall, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

const KaderLPM = () => {
    const { user } = useContext(AuthContext);
    const [kader, setKader] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchKader();
    }, []);

    const fetchKader = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/lpm/kader/');
            setKader(response.data);
        } catch (error) {
            console.error("Error fetching Kader LPM:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalKader = kader.length;
    const kaderAktif = kader.filter(k => k.status === 'Aktif').length;
    const kaderNonAktif = kader.filter(k => k.status === 'Non Aktif').length;

    const filteredData = kader.filter(k => 
        k.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        k.keahlian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.rt_rw.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Database Kader & Relawan</h2>
                    <p className="text-gray-400 text-sm">Kelola daftar anggota pokja, relawan gotong royong, dan keahlian warga.</p>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all group">
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Tambah Anggota
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Relawan</p>
                            <h3 className="text-3xl font-black text-blue-400">{totalKader} <span className="text-sm font-normal text-gray-500">Orang</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status Aktif</p>
                            <h3 className="text-3xl font-black text-green-400">{kaderAktif} <span className="text-sm font-normal text-gray-500">Orang</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Non-Aktif / Pindah</p>
                            <h3 className="text-3xl font-black text-red-400">{kaderNonAktif} <span className="text-sm font-normal text-gray-500">Orang</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Kader List */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>👥</span> Direktori Anggota Wilayah Anda
                    </h3>
                    <div className="flex gap-3 w-full md:w-1/2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari nama, RT/RW, atau keahlian..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                        </div>
                        <button className="bg-[#0f172a]/80 border border-white/10 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                            <Filter className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="p-10 text-center col-span-full text-gray-400 animate-pulse">Memuat anggota kader...</div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-10 text-center col-span-full text-gray-500">Tidak ada anggota yang ditemukan.</div>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item.id} className="bg-[#0f172a]/60 border border-white/5 hover:border-yellow-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-inner relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 blur-xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity ${item.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                                <div className="flex items-start gap-4 mb-4 relative z-10">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xl uppercase shrink-0">
                                        {item.nama.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-bold text-white truncate group-hover:text-yellow-400 transition-colors">{item.nama}</h4>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{item.jabatan}</p>
                                    </div>
                                    <div className={`shrink-0 w-2.5 h-2.5 rounded-full mt-2 ${item.status === 'Aktif' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-red-400'}`} title={item.status}></div>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-white/5 relative z-10">
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Domisili (RT/RW)</span>
                                        <span className="text-sm font-bold text-gray-200">{item.rt_rw}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Keahlian Khusus</span>
                                        <span className="text-sm font-bold text-gray-300 truncate max-w-[120px] text-right">{item.keahlian || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5"><PhoneCall className="w-3 h-3 text-gray-400" /> {item.no_hp || 'Tidak ada HP'}</span>
                                        <button className="text-[10px] bg-white/5 hover:bg-yellow-500 hover:text-black border border-white/10 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all text-gray-300">
                                            Profil Lengkap
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default KaderLPM;

