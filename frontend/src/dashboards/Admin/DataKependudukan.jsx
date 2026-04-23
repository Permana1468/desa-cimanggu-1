import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { 
    Users, Search, Filter, UserPlus, Download, 
    MoreHorizontal, Mail, Phone, MapPin, 
    ChevronLeft, ChevronRight, Loader2, UserCheck,
    TrendingUp, Activity
} from 'lucide-react';

const StatCard = (props) => {
    const { icon: Icon, label, value, color } = props;
    return (
        <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.15] transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{label}</p>
                <h3 className="text-2xl font-black text-white">{value}</h3>
            </div>
        </div>
    );
};

const DataKependudukan = () => {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDusun, setFilterDusun] = useState('Semua Dusun');

    const fetchCitizens = useCallback(async () => {
        try {
            const response = await api.get('/users/api/admin/users/');
            // Filter users with role 'WARGA' or any user if empty
            const warga = response.data.filter(u => u.role === 'WARGA' || u.role === 'ADMIN');
            setCitizens(warga);
        } catch (error) {
            console.error("Error fetching citizens:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCitizens();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchCitizens]);

    const filteredData = citizens.filter(c => {
        const name = c.nama_lengkap || c.username || "";
        const unit = c.unit_detail || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDusun = filterDusun === 'Semua Dusun' || unit.includes(filterDusun);
        return matchesSearch && matchesDusun;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 animate-pulse">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium tracking-widest uppercase text-center">Sinkronisasi Database Kependudukan...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-7 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1.5 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Users className="text-blue-500" size={28} />
                        </div>
                        Data Kependudukan
                    </h2>
                    <p className="text-white/45 text-sm font-medium">Manajemen identitas digital dan profil warga Desa Cimanggu I.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <Download size={16} /> Export Excel
                    </button>
                    <button className="flex-1 md:flex-none justify-center bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2">
                        <UserPlus size={16} /> Tambah Data
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={UserCheck} label="Sudah UHC" value="2,142" color="blue" />
                <StatCard icon={TrendingUp} label="Pertumbuhan" value="+12%" color="emerald" />
                <StatCard icon={Activity} label="Wajib KTP" value="1,840" color="amber" />
                <StatCard icon={Users} label="Total KK" value="942" color="purple" />
            </div>

            {/* Controls */}
            <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md text-white">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau NIK..." 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest shrink-0">
                        <Filter size={14} /> Filter:
                    </div>
                    <select 
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer min-w-[160px]"
                        value={filterDusun}
                        onChange={(e) => setFilterDusun(e.target.value)}
                    >
                        <option value="Semua Dusun" className="bg-[#0f172a]">Semua Wilayah</option>
                        <option value="Dusun I" className="bg-[#0f172a]">Dusun I (RW 01-02)</option>
                        <option value="Dusun II" className="bg-[#0f172a]">Dusun II (RW 03-04)</option>
                        <option value="Dusun III" className="bg-[#0f172a]">Dusun III (RW 05-06)</option>
                        <option value="Dusun IV" className="bg-[#0f172a]">Dusun IV (RW 07-09)</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.07] rounded-[24px] shadow-2xl overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            {['Informasi Warga', 'Kontak / Alamat', 'Unit Wilayah', 'Status Verifikasi', 'Aksi'].map(h => (
                                <th key={h} className="px-6 py-4.5 text-[10.5px] font-black text-white/30 uppercase tracking-[0.1em]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-white/20 italic">
                                    Data tidak ditemukan dalam database kependudukan.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((c) => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/10">
                                                {(c.nama_lengkap || c.username)?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">
                                                    {c.nama_lengkap || c.username}
                                                </div>
                                                <div className="text-[11px] font-mono text-white/25">NIK: 320113**********</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-white">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[12px] text-white/50">
                                                <Mail size={12} className="text-white/20" /> {c.email || '-'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-white/50">
                                                <Phone size={12} className="text-white/20" /> {c.nomor_telepon || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[13px] font-semibold text-white/70">
                                            <MapPin size={14} className="text-blue-500/50" />
                                            {c.unit_detail || 'Wilayah Pusat'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                                            Terverifikasi
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-white/[0.01] border-t border-white/[0.06] gap-4">
                    <p className="text-xs text-white/20 font-medium whitespace-nowrap">
                        Menampilkan <span className="text-white/50">1 - {filteredData.length}</span> dari <span className="text-white/50">{citizens.length}</span> Warga
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataKependudukan;
