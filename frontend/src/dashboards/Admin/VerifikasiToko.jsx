import React, { useState, useEffect, useCallback } from 'react';
import { Store, CheckCircle, XCircle, Search, ShieldCheck, Phone, MapPin, Loader2 } from 'lucide-react';
import api from '../../services/api';

const VerifikasiToko = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, VERIFIED

    const fetchShops = useCallback(async () => {
        try {
            const response = await api.get('/users/api/umkm/shops/');
            setShops(response.data);
        } catch (error) {
            console.error("Gagal memuat data toko:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchShops();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchShops]);

    const handleToggleVerification = async (shop) => {
        const action = shop.is_verified ? 'batalkan verifikasi' : 'setujui verifikasi';
        if (!window.confirm(`Apakah Anda yakin ingin ${action} untuk toko "${shop.shop_name}"?`)) return;
        
        setIsProcessing(true);
        try {
            await api.patch(`/users/api/umkm/shops/${shop.id}/`, {
                is_verified: !shop.is_verified
            });
            // Update local state
            setShops(prev => prev.map(s => s.id === shop.id ? { ...s, is_verified: !s.is_verified } : s));
        } catch (error) {
            console.error("Gagal mengubah status verifikasi:", error);
            alert("Terjadi kesalahan saat memproses data.");
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredShops = shops.filter(shop => {
        const name = shop.shop_name || '';
        const owner = shop.owner_name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             owner.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || 
                             (filterStatus === 'PENDING' && !shop.is_verified) || 
                             (filterStatus === 'VERIFIED' && shop.is_verified);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        Verifikasi Toko UMKM
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse" />
                    </h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">Tinjau identitas & kelayakan usaha warga sebelum dipublikasi ke Pasar Desa Digital.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0">
                    <button 
                        onClick={() => setFilterStatus('ALL')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === 'ALL' ? 'bg-emerald-400 text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => setFilterStatus('PENDING')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === 'PENDING' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setFilterStatus('VERIFIED')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === 'VERIFIED' ? 'bg-blue-400 text-slate-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Terverifikasi
                    </button>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center">
                    <div className="relative w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama toko atau nama pemilik..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-5 py-3 text-white outline-none focus:border-emerald-500/30 transition-all placeholder:text-gray-600 font-bold"
                        />
                    </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 flex items-center justify-between px-8">
                     <div>
                         <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest">Total Usaha</p>
                         <h4 className="text-2xl font-black text-white">{shops.length}</h4>
                     </div>
                     <Store className="text-emerald-400 opacity-20" size={40} />
                </div>
            </div>

            {/* Content List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2.5rem] border border-white/10">
                    <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                    <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">Menyelaraskan Data Toko...</p>
                </div>
            ) : filteredShops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-[2.5rem] border border-white/10 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 text-gray-700">
                        <Store size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Tidak Ada Pengajuan</h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs font-medium italic opacity-50">Antrian pendaftaran toko saat ini kosong atau tidak sesuai filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredShops.map((shop) => (
                        <div key={shop.id} className="group bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl hover:border-emerald-500/20 transition-all duration-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="flex flex-col items-center gap-3 shrink-0">
                                    <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 p-1">
                                        <div className="w-full h-full rounded-[20px] bg-slate-800 flex items-center justify-center overflow-hidden">
                                            {shop.logo ? (
                                                <img src={shop.logo} className="w-full h-full object-cover" alt="Logo" />
                                            ) : (
                                                <Store size={32} className="text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                                        shop.is_verified ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    }`}>
                                        {shop.is_verified ? 'AKTIF' : 'PENDING'}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xl font-black text-white leading-tight uppercase group-hover:text-emerald-400 transition-colors">{shop.shop_name}</h4>
                                            <p className="text-gray-500 text-xs mt-1.5 font-bold flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-emerald-400" /> Pemilik: <span className="text-gray-300">{shop.owner_name}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 py-3 border-y border-white/5">
                                        <p className="text-[11px] text-gray-300 line-clamp-2 italic font-medium leading-relaxed">
                                            "{shop.description || 'Tidak ada deskripsi profil usaha.'}"
                                        </p>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Phone size={12} className="text-emerald-400" />
                                                <span className="text-[11px] font-bold">{shop.phone_number || '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <MapPin size={12} className="text-emerald-400" />
                                                <span className="text-[11px] font-bold">{shop.address || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => handleToggleVerification(shop)}
                                            disabled={isProcessing}
                                            className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                                                shop.is_verified 
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' 
                                                : 'bg-emerald-500 text-white shadow-[0_10px_20px_rgb(16,185,129,0.3)] hover:bg-emerald-600 hover:-translate-y-1'
                                            }`}
                                        >
                                            {shop.is_verified ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                            {shop.is_verified ? 'BATALKAN VERIFIKASI' : 'SETUJUI PENDAFTARAN'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerifikasiToko;
