import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Users, Clock, Wallet, TrendingUp, FileText, Activity,
    ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Shield,
    BarChart3, Building2
} from 'lucide-react';

// ─── Animated Number ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ target, prefix = '', suffix = '' }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1400;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCurrent(target); clearInterval(timer); }
            else setCurrent(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, prefix = '', suffix = '', trend, trendUp, color, delay = 0 }) => (
    <div
        className="group relative bg-dark-card backdrop-blur-[20px] border border-white/[0.07]
                   rounded-[20px] overflow-hidden cursor-default
                   transition-all duration-300 ease-out
                   hover:-translate-y-1 hover:border-gold-border
                   hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                   animate-[card-in_0.5s_ease_both]"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Glow blob on hover */}
        <div className="absolute -top-1/2 -left-[30%] w-[130%] h-[130%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ background: `radial-gradient(circle at 30% 30%, ${color}12, transparent 65%)` }} />

        <div className="relative z-[1] p-[22px_24px]">
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                     style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon size={20} style={{ color }} />
                </div>
                {trend && (
                    <div className={`inline-flex items-center gap-[3px] text-[11px] font-bold
                                    px-[9px] py-[3px] rounded-full
                                    ${trendUp
                                        ? 'bg-emerald-400/[0.12] text-emerald-500 border border-emerald-400/20'
                                        : 'bg-red-400/[0.12] text-red-500 border border-red-400/20'}`}>
                        {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        <span>{trend}</span>
                    </div>
                )}
            </div>

            <div className="text-[32px] font-extrabold text-text-main tracking-tight mt-4 leading-none">
                <AnimatedNumber target={value} prefix={prefix} suffix={suffix} />
            </div>
            <div className="text-[12.5px] font-medium text-text-muted mt-[5px] uppercase tracking-[0.06em]">
                {label}
            </div>
            {sub && <div className="text-[11.5px] text-text-tertiary mt-1">{sub}</div>}
        </div>
    </div>
);

// ─── Activity Row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ name, role, action, time, status }) => {
    const statusMap = {
        hadir:     { label: 'Hadir',     cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
        terlambat: { label: 'Terlambat', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        izin:      { label: 'Izin',      cls: 'bg-slate-400/10 text-slate-400 border-slate-400/20' },
    };
    const s = statusMap[status] || statusMap.hadir;
    return (
        <tr className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 last:border-b-0">
            <td className="py-3.5 px-6 align-middle">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-gold-dark
                                    text-black font-extrabold text-sm
                                    flex items-center justify-center shrink-0
                                    shadow-gold-glow">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-[13.5px] font-semibold text-text-main">{name}</div>
                        <div className="text-[11px] text-text-tertiary mt-px">{role}</div>
                    </div>
                </div>
            </td>
            <td className="py-3.5 px-6 align-middle text-[12.5px] text-text-muted">{action}</td>
            <td className="py-3.5 px-6 align-middle text-[11.5px] text-text-tertiary whitespace-nowrap">
                <Clock size={12} className="inline mr-1" />{time}
            </td>
            <td className="py-3.5 px-6 align-middle">
                <span className={`inline-block text-[10px] font-bold px-2.5 py-[3px] rounded-full
                                  uppercase tracking-[0.07em] border ${s.cls}`}>
                    {s.label}
                </span>
            </td>
        </tr>
    );
};

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, sub, color }) => (
    <button className="group/qa flex items-center gap-3.5 w-full px-5 py-3.5
                       bg-white/[0.03] border-none border-b border-white/[0.04] last:border-b-0
                       text-left cursor-pointer
                       hover:bg-white/[0.06] transition-colors duration-200">
        <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0"
             style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
            <Icon size={22} style={{ color }} />
        </div>
        <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-text-main">{label}</div>
            <div className="text-[11px] text-text-tertiary mt-[2px]">{sub}</div>
        </div>
        <ChevronRight size={16} className="text-text-quaternary ml-auto transition-all duration-200
                                           group-hover/qa:translate-x-[3px] group-hover/qa:text-gold" />
    </button>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.val));
    return (
        <div className="flex items-end gap-2 h-20 px-5 pb-4">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                    <div
                        className="w-full rounded-t-md bg-gradient-to-b from-gold to-gold-dark
                                   min-h-1 shadow-gold-glow
                                   animate-[bar-grow_0.8s_ease_both]"
                        style={{ height: `${(d.val / max) * 100}%`, animationDelay: `${i * 80}ms` }}
                        title={`${d.label}: ${d.val}`}
                    />
                    <span className="text-[9.5px] text-text-tertiary font-semibold">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

// ─── GlassPanel Wrapper ───────────────────────────────────────────────────────
const GlassPanel = ({ children, className = '' }) => (
    <div className={`bg-dark-card backdrop-blur-[24px] border border-white/[0.07] rounded-[20px] overflow-hidden transition-all duration-500 ${className}`}>
        {children}
    </div>
);

const PanelHeader = ({ icon: Icon, title, badge, actionText, children }) => (
    <div className="flex items-center justify-between px-6 pt-5 mb-[18px]">
        <div className="flex items-center gap-2 text-sm font-bold text-text-main tracking-tight">
            {Icon && <Icon size={15} className="text-gold" />}
            {title}
            {badge && (
                <span className="bg-gold-light border border-gold-border text-gold
                                 text-[10px] font-bold px-2 py-[2px] rounded-full
                                 tracking-[0.05em] uppercase">
                    {badge}
                </span>
            )}
        </div>
        {actionText && (
            <button className="text-xs text-text-muted bg-transparent border-none cursor-pointer
                               flex items-center gap-[3px] hover:text-gold transition-colors duration-200">
                {actionText} <ChevronRight size={12} />
            </button>
        )}
        {children}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardUtamaAdmin = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const stats = [
        { icon: Users, label: 'Total Penduduk', value: 3842, sub: 'Jiwa terdaftar', trend: '+2.4%', trendUp: true, color: '#60a5fa', delay: 0 },
        { icon: Clock, label: 'Kehadiran Hari Ini', value: 12, suffix: '/14', sub: 'Perangkat desa aktif', trend: '+1', trendUp: true, color: '#f59e0b', delay: 100 },
        { icon: Wallet, label: 'Realisasi Anggaran', value: 847, prefix: 'Rp ', suffix: 'Jt', sub: 'Dari Rp 1.2M target', trend: '70.6%', trendUp: true, color: '#34d399', delay: 200 },
        { icon: FileText, label: 'Surat Diproses', value: 48, sub: 'Bulan ini', trend: '-3', trendUp: false, color: '#a78bfa', delay: 300 },
        { icon: TrendingUp, label: 'Proyek Aktif', value: 7, sub: 'Proyek fisik berjalan', trend: '+2', trendUp: true, color: '#f97316', delay: 400 },
        { icon: Shield, label: 'Pengguna Sistem', value: 24, sub: 'Akun terdaftar', color: '#ec4899', delay: 500 },
    ];

    const activities = [
        { name: 'Siti Rahayu', role: 'Kaur Keuangan', action: 'Rekap SPP Bulan April', time: '08:12 WIB', status: 'hadir' },
        { name: 'Ahmad Fauzi', role: 'Kasi Pemerintahan', action: 'Update Data Penduduk', time: '08:30 WIB', status: 'hadir' },
        { name: 'Dian Pertiwi', role: 'Kasi Pelayanan', action: 'Surat Pengantar RT/RW', time: '09:05 WIB', status: 'terlambat' },
        { name: 'Budi Santoso', role: 'Kaur TU', action: 'Buku Surat Masuk', time: '09:15 WIB', status: 'hadir' },
        { name: 'Rina Marlina', role: 'Kaur Perencanaan', action: 'Update DED Proyek Jalan', time: '-', status: 'izin' },
        { name: 'Hendra Wijaya', role: 'Kadus I', action: 'Laporan Dusun I', time: '07:55 WIB', status: 'hadir' },
    ];

    const chartData = [
        { label: 'Jan', val: 62 }, { label: 'Feb', val: 75 }, { label: 'Mar', val: 58 },
        { label: 'Apr', val: 90 }, { label: 'Mei', val: 71 }, { label: 'Jun', val: 84 },
    ];

    const quickActions = [
        { icon: Clock, label: 'E-Absensi', sub: 'Rekap kehadiran perangkat', color: '#f59e0b' },
        { icon: Wallet, label: 'Keuangan Desa', sub: 'Buku kas & realisasi', color: '#34d399' },
        { icon: FileText, label: 'Kelola Surat', sub: 'Surat masuk & keluar', color: '#60a5fa' },
        { icon: Users, label: 'Manajemen User', sub: 'Akses & hak pengguna', color: '#a78bfa' },
    ];

    const villageInfo = [
        { k: 'Kode Desa', v: '3201132007' },
        { k: 'Kecamatan', v: 'Cibungbulang' },
        { k: 'Kabupaten', v: 'Bogor' },
        { k: 'Total KK', v: '1.124 KK' },
        { k: 'Luas Wilayah', v: '312 Ha' },
        { k: 'Jumlah RT/RW', v: '18 RT / 6 RW' },
    ];

    return (
        <div className="min-h-full animate-[fade-in_0.5s_ease]">

            {/* ── Hero Banner ─────────────────────────────────────────── */}
            <div className={`relative border border-white/[0.08] rounded-3xl px-9 py-8 mb-7 overflow-hidden transition-all duration-700
                            shadow-[0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]
                            ${theme === 'dark' 
                                ? 'bg-gradient-to-br from-[rgba(15,23,42,0.95)] via-[rgba(23,37,84,0.9)] to-[rgba(30,58,138,0.7)]' 
                                : 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white'}`}>
                
                {/* Decorative glows */}
                <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px]
                                bg-[radial-gradient(circle,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
                <div className="absolute -bottom-20 left-[30%] w-80 h-[200px]
                                bg-[radial-gradient(ellipse,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

                <div className="relative flex items-start justify-between flex-wrap gap-6">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 border rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase mb-3.5
                                        ${theme === 'dark' ? 'bg-amber-500/[0.12] border-amber-500/25 text-amber-500' : 'bg-white/20 border-white/30 text-white'}`}>
                            <span className={`w-[7px] h-[7px] rounded-full animate-[pulse-dot_1.5s_infinite] ${theme === 'dark' ? 'bg-amber-500' : 'bg-white'}`}  />
                            Sistem Aktif · Panel Admin
                        </div>
                        <h1 className="text-[28px] font-extrabold text-white leading-tight tracking-tight mb-1.5">
                            Selamat Datang, <span className={theme === 'dark' ? 'text-gold' : 'text-amber-200'}>{user?.username || 'Admin'}!</span>
                        </h1>
                        <p className={`text-[13.5px] ${theme === 'dark' ? 'text-white/45' : 'text-white/80'}`}>
                            Dashboard Administrasi &nbsp;·&nbsp;
                            <strong className={theme === 'dark' ? 'text-white/60' : 'text-white'}>Desa Cimanggu I</strong>, Kab. Bogor
                        </p>
                    </div>
                    <div className="text-right">
                        <div className={`text-4xl font-extrabold text-white tabular-nums tracking-tight leading-none
                                        ${theme === 'dark' ? 'drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'drop-shadow-lg'}`}>
                            {timeStr}
                        </div>
                        <div className={`text-xs mt-1 capitalize ${theme === 'dark' ? 'text-white/40' : 'text-white/70'}`}>{dateStr}</div>
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* ── Bottom Grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">

                {/* Activity Table */}
                <GlassPanel>
                    <PanelHeader icon={Activity} title="Aktivitas Perangkat Hari Ini" badge="Live" actionText="Lihat Semua" />
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Pegawai', 'Aktivitas', 'Jam Masuk', 'Status'].map(h => (
                                    <th key={h} className="text-left text-[10.5px] font-bold text-text-tertiary
                                                          uppercase tracking-[0.07em] px-6 py-2 pb-3.5
                                                          border-b border-white/[0.05]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((a, i) => <ActivityRow key={i} {...a} />)}
                        </tbody>
                    </table>
                </GlassPanel>

                {/* Right Column */}
                <div className="flex flex-col gap-5">

                    {/* Quick Actions */}
                    <GlassPanel>
                        <PanelHeader icon={Zap} title="Akses Cepat" />
                        <div className="pb-1">
                            {quickActions.map((qa, i) => <QuickAction key={i} {...qa} />)}
                        </div>
                    </GlassPanel>

                    {/* Mini Chart */}
                    <GlassPanel>
                        <PanelHeader icon={BarChart3} title="Kehadiran Bulanan">
                            <span className="text-[11px] text-text-tertiary">2026</span>
                        </PanelHeader>
                        <MiniBarChart data={chartData} />
                    </GlassPanel>

                    {/* Village Info */}
                    <GlassPanel>
                        <PanelHeader icon={Building2} title="Info Desa" />
                        <div className="px-5 pb-5">
                            {villageInfo.map((r, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5
                                                        border-b border-white/[0.04] last:border-b-0">
                                    <span className="text-xs text-text-tertiary">{r.k}</span>
                                    <span className="text-[12.5px] font-semibold text-gold">{r.v}</span>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default DashboardUtamaAdmin;
