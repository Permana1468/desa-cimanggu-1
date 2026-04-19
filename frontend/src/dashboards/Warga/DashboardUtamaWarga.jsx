import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Home, MessageSquare, FileText, Map, Settings, Bell, Calendar, HelpCircle, Activity, Layout } from 'lucide-react';

const DashboardUtamaWarga = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3 lowercase first-letter:uppercase">
                        Halo, {user?.nama_lengkap || user?.username}!
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-blue-glow animate-pulse" />
                    </h2>
                    <p className="text-text-muted text-[13px] font-medium mt-1 uppercase tracking-wider">
                        Selamat datang di Ruang Digital Warga Desa Cimanggu I
                    </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <Activity size={18} className="text-blue-400" />
                    <span className="text-blue-400 font-extrabold text-[10px] uppercase tracking-widest">Warga Terverifikasi</span>
                </div>
            </div>

            {/* Quick Actions Grid for Citizens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <ActionCard icon={<MessageSquare />} label="Kirim Aspirasi" color="blue" />
                 <ActionCard icon={<FileText />} label="Layanan Surat" color="amber" />
                 <ActionCard icon={<Map />} label="Peta Desa" color="emerald" />
                 <ActionCard icon={<Layout />} label="Struktur Desa" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* News / Updates area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative group bg-dark-card backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl min-h-[300px] flex flex-col justify-end">
                        <div className="absolute inset-0 z-0">
                            <img src="/images/slide_1.png" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent"></div>
                        </div>
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">BERITA DESA</span>
                            <h3 className="text-2xl font-black text-text-main leading-tight mb-2">Desa Cimanggu I Raih Penghargaan Desa Digital Terbaik 2025</h3>
                            <p className="text-text-muted text-sm line-clamp-2 mb-6">Inovasi pelayanan publik berbasis digital yang dikembangkan membuahkan hasil membanggakan bagi seluruh warga...</p>
                            <button className="text-blue-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                Baca Selengkapnya ➔
                            </button>
                        </div>
                    </div>

                    {/* Timeline placeholder */}
                    <div className="bg-dark-card backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-8">Informasi & Kegiatan Desa</h4>
                        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            <TimelineItem title="Penyaluran BLT-DD Tahap II" date="12 Mei 2026" type="Info" color="blue" />
                            <TimelineItem title="Kerja Bakti Massal RW 02" date="15 Mei 2026" type="Agenda" color="amber" />
                            <TimelineItem title="Imunisasi Balita Posyandu Mawar" date="18 Mei 2026" type="Agenda" color="emerald" />
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-8">
                    <div className="bg-dark-card backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Butuh Bantuan?</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                <HelpCircle size={20} className="text-blue-400 mb-2" />
                                <div className="text-[13px] font-bold text-text-main">Panduan Aplikasi</div>
                                <div className="text-[11px] text-text-tertiary mt-1">Cara menggunakan fitur SDD</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                <Settings size={20} className="text-amber-400 mb-2" />
                                <div className="text-[13px] font-bold text-text-main">Pengaturan Profil</div>
                                <div className="text-[11px] text-text-tertiary mt-1">Update data dan keamanan</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={28} className="text-blue-500 animate-bounce" />
                        </div>
                        <h5 className="text-[15px] font-black text-text-main">Pusat Notifikasi</h5>
                        <p className="text-[11px] text-text-muted mt-2">Belum ada pemberitahuan baru untuk Anda saat ini.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ icon, label, color }) => {
    const colors = {
        blue: "text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
        amber: "text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
        emerald: "text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
        purple: "text-purple-400 group-hover:bg-purple-500 group-hover:text-white"
    };
    return (
        <button className="group bg-dark-card backdrop-blur-md border border-white/5 rounded-[2rem] p-7 transition-all hover:-translate-y-2 hover:border-white/20 shadow-xl w-full text-center flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-all duration-500 ${colors[color]}`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <span className="text-[13px] font-black text-text-main uppercase tracking-tight group-hover:text-white transition-colors">{label}</span>
        </button>
    );
};

const TimelineItem = ({ title, date, type, color }) => {
    const dotColors = {
        blue: "bg-blue-500 shadow-blue-glow",
        amber: "bg-amber-500 shadow-amber-glow",
        emerald: "bg-emerald-500 shadow-emerald-glow"
    };
    return (
        <div className="flex gap-6 relative">
            <div className={`w-10 h-10 rounded-full ${dotColors[color]} shrink-0 flex items-center justify-center z-10 p-2.5`}>
                <div className="w-full h-full bg-white/20 rounded-full"></div>
            </div>
            <div>
                <span className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em]">{type} • {date}</span>
                <h5 className="text-[14px] font-extrabold text-text-main mt-1">{title}</h5>
            </div>
        </div>
    );
};

export default DashboardUtamaWarga;
