import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Users, FileText, Activity, MessageSquare, TrendingUp, Calendar, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardUtamaKelembagaan = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();

    // Map roles to specific titles/descriptions
    const roleConfig = {
        RT: { title: "Dashboard Ketua RT", subtitle: "Manajemen data warga dan kewilayahan RT", accent: "text-blue-400" },
        RW: { title: "Dashboard Ketua RW", subtitle: "Monitoring wilayah dan koordinasi antar RT", accent: "text-amber-400" },
        KARANG_TARUNA: { title: "Dashboard Karang Taruna", subtitle: "Pusat koordinasi pemuda dan kegiatan desa", accent: "text-red-400" },
        BUMDES: { title: "Dashboard BUMDes", subtitle: "Manajemen aset dan profitabilitas usaha desa", accent: "text-emerald-400" },
        TP_PKK: { title: "Dashboard TP-PKK", subtitle: "Pusat data pemberdayaan kesejahteraan keluarga", accent: "text-pink-400" },
        POSYANDU: { title: "Dashboard Posyandu", subtitle: "Monitoring kesehatan ibu, anak, dan balita", accent: "text-rose-400" },
        PUSKESOS: { title: "Dashboard Puskesos", subtitle: "Pelayanan kesejahteraan sosial dan bantuan", accent: "text-indigo-400" },
    };

    const currentRole = roleConfig[user?.role] || { title: "Dashboard Kelembagaan", subtitle: "Pusat kendali unit kerja desa", accent: "text-gold" };
    
    // Personalized Title for RT/RW
    const getPersonalizedTitle = () => {
        if (user?.role === 'RT' && user?.unit_detail) {
            return `Dashboard Unit ${user.unit_detail}`;
        }
        if (user?.role === 'RW' && user?.unit_detail) {
            return `Dashboard Wilayah ${user.unit_detail}`;
        }
        return currentRole.title;
    };

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                        {getPersonalizedTitle()}
                        <span className={`w-2 h-2 rounded-full bg-gold shadow-gold-glow animate-pulse`} />
                    </h2>
                    <p className="text-text-muted text-[13px] font-medium mt-1 uppercase tracking-wider">
                        {currentRole.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest block mb-0.5">Unit Kerja</span>
                        <span className="text-sm font-bold text-text-main">{user?.unit_detail || 'Pusat Desa'}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users />} label="Target Layanan" value="1.240" subValue="+12 bln ini" color="blue" />
                <StatCard icon={<FileText />} label="Agenda Aktif" value="8" subValue="3 Minggu ini" color="amber" />
                <StatCard icon={<Activity />} label="Kinerja Unit" value="94%" subValue="Sangat Baik" color="emerald" />
                <StatCard icon={<MessageSquare />} label="Aspirasi Masuk" value="12" subValue="4 Belum dibaca" color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Welcome Card */}
                    <div className="relative group bg-dark-card backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-text-main leading-tight mb-4">
                                Selamat Datang Kembali,<br />
                                <span className="text-gold">{user?.nama_lengkap || user?.username}</span>
                            </h3>
                            <p className="text-text-muted text-sm leading-relaxed max-w-xl mb-6">
                                Dashboard ini dirancang khusus untuk memfasilitasi peran Anda sebagai <span className="text-text-main font-bold">{user?.role?.replace('_', ' ')}</span>. 
                                Gunakan menu sidebar untuk mengelola data warga, mengunggah laporan, atau berkomunikasi langsung dengan Admin Desa.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-gold text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-gold-glow hover:-translate-y-1 transition-all">
                                    Lihat Agenda Unit
                                </button>
                                <button className="px-6 py-3 bg-white/5 border border-white/10 text-text-main font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                    Panduan Sistem
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for Dynamic Table/List */}
                    <div className="bg-dark-card backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-black text-text-main uppercase tracking-tighter">Aktivitas Terkini</h4>
                            <button className="text-gold text-[10px] font-black uppercase tracking-widest hover:underline">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                            <ActivityItem icon={<Calendar className="text-blue-400" />} title="Rapat Koordinasi Bulanan" time="Besok, 09:00 WIB" status="Mendatang" />
                            <ActivityItem icon={<FileText className="text-amber-400" />} title="Laporan Kinerja Triwulan" time="2 Hari Lalu" status="Selesai" />
                            <ActivityItem icon={<ShieldCheck className="text-emerald-400" />} title="Verifikasi Data Warga Baru" time="5 Hari Lalu" status="Selesai" />
                        </div>
                    </div>
                </div>

                {/* Sidebar of Dashboard */}
                <div className="space-y-8">
                    {/* Quick Access */}
                    <div className="bg-dark-card backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Akses Cepat</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <QuickButton icon={<Zap size={18} />} label="Input Laporan" detail="Form standar unit" />
                            <QuickButton icon={<MapPin size={18} />} label="Peta Wilayah" detail="Visualisasi data" />
                            <QuickButton icon={<MessageSquare size={18} />} label="Chat Admin" detail="Konsultasi cepat" />
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <ShieldCheck className="text-white/80 mb-4" size={32} />
                            <h4 className="text-xl font-bold text-white leading-tight mb-2">Pusat Bantuan Digital</h4>
                            <p className="text-white/70 text-xs leading-relaxed mb-6">Butuh bantuan teknis atau ada kendala dalam penginputan data?</p>
                            <button className="w-full py-3 bg-white text-indigo-700 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:shadow-white/20 transition-all">
                                Hubungi Helpdesk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subValue, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
    };
    return (
        <div className="bg-dark-card backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
                {React.cloneElement(icon, { size: 22 })}
            </div>
            <div>
                <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-text-main">{value}</span>
                    <span className="text-[10px] text-text-muted font-bold">{subValue}</span>
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ icon, title, time, status }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <div className="flex-1">
            <h5 className="text-[13px] font-bold text-text-main">{title}</h5>
            <p className="text-[11px] text-text-tertiary mt-0.5">{time}</p>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${status === 'Mendatang' ? 'bg-amber-400/10 text-amber-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
            {status}
        </span>
    </div>
);

const QuickButton = ({ icon, label, detail }) => (
    <button className="flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.08] lg:p-3 border border-white/5 rounded-2xl transition-all group w-full text-left">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <div className="text-[12px] font-black text-text-main group-hover:text-gold transition-colors">{label}</div>
            <div className="text-[10px] text-text-tertiary mt-0.5">{detail}</div>
        </div>
    </button>
);

export default DashboardUtamaKelembagaan;
