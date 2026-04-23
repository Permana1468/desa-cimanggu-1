import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { 
    PackageOpen, Wrench, PackageCheck, AlertTriangle, 
    Search, Filter, Plus, Boxes, 
    History, ShieldCheck, MoreVertical, Loader2
} from 'lucide-react';

const StatCard = (props) => {
    const { icon: IconComponent, label, value, subtext, color } = props;
    return (
        <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.15] transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 blur-3xl rounded-full`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</p>
                    <h3 className={`text-3xl font-black text-${color}-400`}>{value}</h3>
                    <p className="text-[10px] text-white/20 mt-2 font-medium">{subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={24} />
                </div>
            </div>
        </div>
    );
};

const InventarisAset = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKategori, setFilterKategori] = useState('Semua Kategori');

    const fetchInventaris = useCallback(async () => {
        try {
            setLoading(true);
            // Reusing the LPM inventaris endpoint for general village assets if shared, 
            // otherwise using a dedicated one if it exists.
            const response = await api.get('/users/api/lpm/inventaris/');
            setAssets(response.data);
        } catch (error) {
            console.error("Error fetching Inventaris:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInventaris();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchInventaris]);

    const stats = {
        total: assets.reduce((acc, curr) => acc + curr.jumlah, 0),
        baik: assets.filter(i => i.kondisi === 'Baik').reduce((acc, curr) => acc + curr.jumlah, 0),
        rusak: assets.filter(i => i.kondisi.includes('Rusak')).reduce((acc, curr) => acc + curr.jumlah, 0),
        val: "Rp 1.2M" // Mock valuation
    };

    const filteredData = assets.filter(k => 
        (k.nama_aset.toLowerCase().includes(searchTerm.toLowerCase()) || 
         k.kode_aset?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterKategori === 'Semua Kategori' || k.kategori === filterKategori)
    );

    const categories = ['Semua Kategori', ...new Set(assets.map(a => a.kategori))];

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 animate-pulse">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium tracking-widest uppercase">Memuat Database Inventaris Desa...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-7 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1.5 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Boxes className="text-amber-500" size={28} />
                        </div>
                        Inventaris & Aset Desa
                    </h2>
                    <p className="text-white/45 text-sm font-medium">Manajemen aset bergerak dan tidak bergerak Desa Cimanggu I.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <History size={16} /> Riwayat
                    </button>
                    <button className="flex-1 md:flex-none justify-center bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={16} /> Aset Baru
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={PackageOpen} label="Total Unit Aset" value={stats.total} subtext="Kumulatif seluruh kategori" color="blue" />
                <StatCard icon={PackageCheck} label="Kondisi Baik" value={stats.baik} subtext="Siap digunakan kapanpun" color="emerald" />
                <StatCard icon={AlertTriangle} label="Butuh Maintenance" value={stats.rusak} subtext="Perlu perbaikan segera" color="rose" />
                <StatCard icon={ShieldCheck} label="Estimasi Valuasi" value={stats.val} subtext="Total nilai aset desa" color="amber" />
            </div>

            {/* Controls */}
            <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau kode aset..." 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-white/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-widest shrink-0">
                        <Filter size={14} /> Kategori:
                    </div>
                    <select 
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer min-w-[160px]"
                        value={filterKategori}
                        onChange={(e) => setFilterKategori(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Aset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-white/20 italic bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                        Tidak ada aset yang ditemukan dalam database.
                    </div>
                ) : (
                    filteredData.map((item) => (
                        <div key={item.id} className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-5 hover:border-amber-500/30 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                    <Wrench size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border flex items-center gap-1.5 uppercase tracking-wider ${
                                        item.kondisi === 'Baik' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.kondisi === 'Baik' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`}></span>
                                        {item.kondisi}
                                    </span>
                                    <button className="text-white/20 hover:text-white transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>

                            <h4 className="text-[17px] font-black text-white mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">{item.nama_aset}</h4>
                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-[10px] text-white/25 font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">{item.kode_aset || 'TANPA KODE'}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{item.kategori}</p>
                            </div>
                            
                            <div className="space-y-3.5 pt-4 border-t border-white/[0.06]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest">Ketersediaan</span>
                                    <span className="text-sm font-black text-white">{item.jumlah} <span className="text-[10px] text-white/40 font-normal">Unit</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest">Tahun Perolehan</span>
                                    <span className="text-sm font-black text-white/70">{item.tahun_perolehan}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest">Sumber Dana</span>
                                    <span className="text-[11px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">{item.sumber_perolehan}</span>
                                </div>
                            </div>

                            <button className="w-full mt-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-black text-white/40 uppercase tracking-[0.1em] hover:bg-white/[0.08] hover:text-white transition-all">
                                Detail Aset & Maintenance
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InventarisAset;
