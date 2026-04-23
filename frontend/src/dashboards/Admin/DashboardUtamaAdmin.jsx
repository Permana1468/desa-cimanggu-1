import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Users, Clock, Wallet, TrendingUp, FileText, Activity,
    Zap, BarChart3, Building2, ChevronRight, Shield
} from 'lucide-react';

// Sub-komponen
import AdminHero from './AdminComponents/AdminHero';
import StatCard from './AdminComponents/StatCard';
import { ActivityRow, QuickAction, MiniBarChart } from './AdminComponents/DashboardWidgets';
import { GlassPanel, PanelHeader } from './AdminComponents/AdminCoreUI';

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
            <AdminHero theme={theme} user={user} timeStr={timeStr} dateStr={dateStr} />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-7">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
                <GlassPanel>
                    <PanelHeader icon={Activity} title="Aktivitas Perangkat Hari Ini" badge="Live" actionText="Lihat Semua" ChevronRight={ChevronRight} />
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Pegawai', 'Aktivitas', 'Jam Masuk', 'Status'].map(h => (
                                    <th key={h} className="text-left text-[10.5px] font-bold text-text-tertiary uppercase tracking-[0.07em] px-6 py-2 pb-3.5 border-b border-white/[0.05]">
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

                <div className="flex flex-col gap-5">
                    <GlassPanel>
                        <PanelHeader icon={Zap} title="Akses Cepat" />
                        <div className="pb-1">
                            {quickActions.map((qa, i) => <QuickAction key={i} {...qa} />)}
                        </div>
                    </GlassPanel>

                    <GlassPanel>
                        <PanelHeader icon={BarChart3} title="Kehadiran Bulanan">
                            <span className="text-[11px] text-text-tertiary">2026</span>
                        </PanelHeader>
                        <MiniBarChart data={chartData} />
                    </GlassPanel>

                    <GlassPanel>
                        <PanelHeader icon={Building2} title="Info Desa" />
                        <div className="px-5 pb-5">
                            {villageInfo.map((r, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-b-0">
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
