import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    MapPin, Users, Shield, AlertCircle, 
    TrendingUp, Activity, MessageSquare, 
    Calendar, CheckCircle2, Search, Filter,
    ChevronRight, Loader2, ArrowRight
} from 'lucide-react';

const QuickStats = ({ icon: Icon, label, value, color }) => (
    <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.15] transition-all group shrink-0 w-full sm:w-[280px]">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:rotate-12 transition-transform`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-0.5">{label}</p>
                <h3 className="text-xl font-black text-white">{value}</h3>
            </div>
        </div>
    </div>
);

const DusunModule = ({ dusunName = "Dusun I", rwRange = "RW 01 - RW 02" }) => {
    const [aspirasi, setAspirasi] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDusunData = async () => {
            try {
                setLoading(true);
                // Fetch aspirations filtered by this dusun's unit_detail
                // Note: In a real scenario, we'd have a specific endpoint or filter param
                const response = await api.get('/users/api/aspirasi/');
                const filtered = response.data.filter(a => a.wilayah_tujuan?.includes(dusunName.split(' ')[1]));
                setAspirasi(filtered);
            } catch (error) {
                console.error("Error fetching Dusun data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDusunData();
    }, [dusunName]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 animate-pulse">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium tracking-widest uppercase">Sinkronisasi Data Wilayah {dusunName}...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 pb-10">
            {/* Header / Hero Section */}
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent border border-white/[0.08] p-8 md:p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Wilayah Kewilayahan
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{rwRange}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-4">
                        <MapPin className="text-blue-500" size={40} />
                        Kawasan {dusunName}
                    </h1>
                    <p className="text-white/50 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
                        Pusat kendali operasional wilayah {dusunName}. Pantau kependudukan, keamanan, transporasi, dan aspirasi warga secara real-time.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex overflow-x-auto gap-5 no-scrollbar pb-2">
                <QuickStats icon={Users} label="Total Populasi" value="542 Jiwa" color="blue" />
                <QuickStats icon={Shield} label="Pos Keamanan" value="3 Titik Aktif" color="emerald" />
                <QuickStats icon={Activity} label="Status Wilayah" value="Kondusif" color="amber" />
                <QuickStats icon={TrendingUp} label="Ekonomi" value="Sektor Agribisnis" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Aspirasi & Reports */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <MessageSquare className="text-blue-500/60" size={18} />
                                Aspirasi Warga {dusunName}
                            </h3>
                            <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">Lihat Semua</button>
                        </div>

                        <div className="space-y-4">
                            {aspirasi.length === 0 ? (
                                <div className="py-12 text-center text-white/20 italic text-sm">Belum ada aspirasi masuk untuk wilayah ini.</div>
                            ) : (
                                aspirasi.slice(0, 4).map((item) => (
                                    <div key={item.id} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex gap-4 group hover:border-blue-500/30 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            <Users size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-[14px] group-hover:text-blue-400 transition-colors">{item.nama_warga}</h4>
                                                <span className="text-[10px] text-white/20 font-bold">{new Date(item.tanggal).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[12px] text-white/40 line-clamp-2 leading-relaxed">"{item.isi_pesan}"</p>
                                        </div>
                                        <div className="shrink-0 flex items-center">
                                            <ChevronRight className="text-white/10 group-hover:text-white/40 transition-all" size={20} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <Shield className="text-emerald-500/60" size={18} />
                                Log Keamanan & Peristiwa
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4 items-start pl-2">
                                    <div className="relative pt-1.5 shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        {i === 1 && <div className="absolute top-2.5 left-1.5 w-[1px] h-12 bg-white/10"></div>}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-white">Patroli Keamanan RW 02 Selesai</div>
                                        <p className="text-[11px] text-white/30 uppercase font-black tracking-widest mt-0.5">Hari ini, 02:40 WIB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Information & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600/10 to-blue-600/20 backdrop-blur-xl border border-blue-500/20 rounded-[28px] p-7">
                        <h3 className="text-lg font-black text-white mb-4">Akses Cepat Kadus</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-blue-600 hover:border-blue-500 group transition-all">
                                <div className="flex items-center gap-3">
                                    <Users className="text-blue-400 group-hover:text-white" size={20} />
                                    <span className="text-sm font-bold text-white">Input Data Warga Baru</span>
                                </div>
                                <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={16} />
                            </button>
                            <button className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-emerald-600 hover:border-emerald-500 group transition-all">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-emerald-400 group-hover:text-white" size={20} />
                                    <span className="text-sm font-bold text-white">Lapor Kejadian Penting</span>
                                </div>
                                <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={16} />
                            </button>
                            <button className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-amber-600 hover:border-amber-500 group transition-all">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-amber-400 group-hover:text-white" size={20} />
                                    <span className="text-sm font-bold text-white">Status Bansos Wilayah</span>
                                </div>
                                <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6">
                        <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Agenda Wilayah</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 shrink-0">
                                    <span className="text-[10px] font-black text-white/40 uppercase">APR</span>
                                    <span className="text-base font-black text-blue-400">24</span>
                                </div>
                                <div>
                                    <div className="text-[13px] font-bold text-white">Rapat Koordinasi RW</div>
                                    <p className="text-[11px] text-white/40">Balai Dusun • 19:30 WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DusunModule;
