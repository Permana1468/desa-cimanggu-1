import React, { useState, useEffect, useContext } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

const DashboardUtamaLPM = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        proyek_berjalan: 0,
        total_dana_terkelola: 0,
        agenda_terdekat: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/users/api/lpm/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching LPM stats:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(() => {
            fetchStats();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    // ==========================================
    // DUMMY DATA KHUSUS STATISTIK LOKAL
    // ==========================================

    const dataUsulanLPM = [
        { kategori: 'Infrastruktur', Disetujui: 4, Ditolak: 1, Menunggu: 2 },
        { kategori: 'Kesehatan', Disetujui: 2, Ditolak: 0, Menunggu: 1 },
        { kategori: 'Ekonomi', Disetujui: 3, Ditolak: 2, Menunggu: 0 },
        { kategori: 'Sosial', Disetujui: 1, Ditolak: 0, Menunggu: 1 },
    ];

    const dataAspirasi = [
        { name: 'Jalan & PJU', value: 35 },
        { name: 'Bansos', value: 25 },
        { name: 'Posyandu', value: 20 },
        { name: 'Keamanan', value: 20 },
    ];
    const COLORS = ['#eab308', '#3b82f6', '#22c55e', '#ef4444'];

    if (loading) {
        return <div className="p-10 text-center text-gray-400 animate-pulse">Memuat statistik dashboard...</div>;
    }

    return (
        <div className="text-gray-200 animate-fade-in pb-10">

            {/* HEADER */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Ringkasan Kepengurusan</h2>
                    <p className="text-gray-400 text-sm">Dashboard Pusat Manajemen Pembangunan, Keuangan, dan Evaluasi LPM.</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                        <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Unit Aktif</p>
                        <p className="text-sm font-bold text-white">Wilayah {user?.unit_detail || 'Pusat'}</p>
                    </div>
                </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Proyek Berjalan</p>
                            <h3 className="text-3xl font-black text-white">{stats.proyek_berjalan} <span className="text-sm font-normal text-gray-500">Titik</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl border border-blue-500/30">🏗️</div>
                    </div>
                    <p className="text-[10px] text-blue-400 mt-4 font-medium relative z-10">
                        Proyek fisik tahap konstruksi
                    </p>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Dana Terkelola</p>
                            <h3 className="text-xl font-black text-white mt-2">{formatRupiah(stats.total_dana_terkelola)}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 text-2xl border border-green-500/30">💰</div>
                    </div>
                    <p className="text-[10px] text-green-400 mt-4 font-medium relative z-10">
                        Dana Desa & Swadaya Masyarakat
                    </p>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Aspirasi Warga</p>
                            <h3 className="text-3xl font-black text-white">4 <span className="text-sm font-normal text-gray-500">Pesan</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl border border-yellow-500/30">📢</div>
                    </div>
                    <p className="text-[10px] text-yellow-400 mt-4 font-medium relative z-10 animate-pulse">
                        Cek aspirasi warga yang masuk
                    </p>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Jadwal Terdekat</p>
                            <h3 className="text-xl font-black text-white mt-1">Agenda LPM</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-2xl border border-purple-500/30">📅</div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-medium relative z-10 truncate">
                        {stats.agenda_terdekat.length > 0 ? stats.agenda_terdekat[0].judul : 'Tidak ada agenda'}
                    </p>
                </div>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span>📈</span> Kinerja Usulan Musrenbang
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataUsulanLPM} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="kategori" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar dataKey="Disetujui" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="Menunggu" fill="#eab308" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="Ditolak" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <span>🗣️</span> Topik Aspirasi Warga
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">Fokus keluhan saat ini.</p>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataAspirasi}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {dataAspirasi.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                />
                                <Legend iconType="circle" layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AGENDA & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>📅</span> Agenda Mendatang
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {stats.agenda_terdekat.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 border border-white/5 rounded-xl border-dashed">
                                Tidak ada agenda terdekat.
                            </div>
                        ) : (
                            stats.agenda_terdekat.map((item, idx) => {
                                const tgl = new Date(item.tanggal);
                                const month = tgl.toLocaleString('id-ID', { month: 'short' });
                                const day = tgl.getDate();

                                return (
                                    <div key={idx} className="bg-[#0f172a]/60 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:border-yellow-500/30 transition-colors">
                                        <div className="bg-yellow-500/20 text-yellow-400 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold">
                                            <span className="text-[10px] uppercase">{month}</span>
                                            <span className="text-lg">{day}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm line-clamp-1">{item.judul}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{item.lokasi} • {item.waktu.substring(0,5)} WIB</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span>⚡</span> Akses Cepat
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-[#0f172a]/80 hover:bg-yellow-500 hover:text-black border border-white/10 p-4 rounded-xl text-center transition-all group shadow-inner">
                            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">💡</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-black">Buat Usulan Proyek</span>
                        </button>
                        <button className="bg-[#0f172a]/80 hover:bg-blue-500 hover:text-white border border-white/10 p-4 rounded-xl text-center transition-all group shadow-inner">
                            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">💰</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">Pencatatan Finansial</span>
                        </button>
                        <button className="bg-[#0f172a]/80 hover:bg-green-500 hover:text-white border border-white/10 p-4 rounded-xl text-center transition-all group shadow-inner">
                            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📦</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">Daftarkan Aset Desa</span>
                        </button>
                        <button className="bg-[#0f172a]/80 hover:bg-purple-500 hover:text-white border border-white/10 p-4 rounded-xl text-center transition-all group shadow-inner">
                            <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📄</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">Buat Laporan / BAP</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardUtamaLPM;

