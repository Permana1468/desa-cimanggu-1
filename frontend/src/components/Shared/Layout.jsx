import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Layout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bgImages, setBgImages] = useState(['/bg-cimanggu.jpg']);
    const [currentBg, setCurrentBg] = useState(0);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const userMenuRef = useRef(null);

    /* ── Page title from path ─────────────────────────────── */
    const pageTitleMap = {
        '/dashboard': 'Dashboard Utama',
        '/dashboard/rekap-kehadiran': 'E-Absensi · Rekap Kehadiran',
        '/dashboard/users': 'Manajemen Pengguna',
        '/dashboard/landing-setting': 'Identitas & Profil',
        '/dashboard/hero-carousel': 'Hero & Carousel',
        '/dashboard/berita': 'Kelola Berita',
        '/dashboard/organisasi': 'Struktur Organisasi',
        '/dashboard/buku-surat': 'Buku Surat Masuk & Keluar',
        '/dashboard/inventaris-aset': 'Inventaris & Aset Desa',
        '/dashboard/buku-kas': 'Buku Kas Umum',
        '/dashboard/realisasi-anggaran': 'Realisasi Anggaran (SPP)',
        '/dashboard/perencanaan': 'DED & RAB Proyek',
        '/dashboard/rab': 'Rencana Anggaran Biaya',
        '/dashboard/rpjmdes': 'Dokumen RPJMDes & RKPDes',
        '/dashboard/pemerintahan': 'Data Kependudukan',
        '/dashboard/kesejahteraan': 'Manajemen Proyek Fisik',
        '/dashboard/pelayanan': 'Layanan Pengantar RT/RW',
        '/dashboard/e-kms': 'E-KMS Posyandu',
        '/dashboard/data-dusun-1': 'Dusun I · Data Wilayah',
        '/dashboard/laporan-dusun-1': 'Dusun I · Laporan Keamanan',
        '/dashboard/data-dusun-2': 'Dusun II · Data Wilayah',
        '/dashboard/laporan-dusun-2': 'Dusun II · Laporan Keamanan',
        '/dashboard/data-dusun-3': 'Dusun III · Data Wilayah',
        '/dashboard/laporan-dusun-3': 'Dusun III · Laporan Keamanan',
        '/dashboard/data-dusun-4': 'Dusun IV · Data Wilayah',
        '/dashboard/laporan-dusun-4': 'Dusun IV · Laporan Keamanan',
    };
    const pageTitle = pageTitleMap[location.pathname] || 'Panel Administrasi';

    /* ── Fetch background images ──────────────────────────── */
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/users/api/landing-page/');
                if (response.data?.length > 0) {
                    const s = response.data[0];
                    const imgs = [s.carousel_image_1, s.carousel_image_2, s.carousel_image_3].filter(Boolean);
                    if (imgs.length > 0) setBgImages(imgs);
                }
            } catch (e) { /* fallback */ }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const t = setInterval(() => {
            setCurrentBg(p => (p === bgImages.length - 1 ? 0 : p + 1));
        }, 8000);
        return () => clearInterval(t);
    }, [bgImages.length]);

    /* ── Close dropdowns on outside click ────────────────── */
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const notifications = [
        { msg: 'Siti Rahayu melakukan absensi masuk', time: '08:12', icon: '🟢' },
        { msg: 'Realisasi anggaran Q1 siap direview', time: '09:00', icon: '📊' },
        { msg: 'Usulan Musrenbang baru dari Dusun III', time: '09:30', icon: '📋' },
    ];

    return (
        <div className="relative flex h-screen overflow-hidden font-[Inter,system-ui,sans-serif] bg-dark-base">

            {/* ── Background Layers ────────────────────────────── */}
            {bgImages.map((src, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center blur-[10px] scale-[1.06] z-0 transition-opacity duration-[2000ms] ease-in-out"
                    style={{
                        backgroundImage: `url('${src}')`,
                        opacity: i === currentBg ? 1 : 0,
                    }}
                />
            ))}
            {/* Dark overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none
                            bg-gradient-to-br from-[rgba(8,14,30,0.92)] via-[rgba(10,18,40,0.88)] to-[rgba(8,14,30,0.94)]" />
            {/* Grid pattern */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-grid-pattern" />

            {/* ── Sidebar ───────────────────────────────────── */}
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* ── Main ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col relative z-10 min-w-0 transition-all duration-300">

                {/* ── Header ──────────────────────────────────── */}
                <header className="h-16 bg-[rgba(8,14,30,0.55)] backdrop-blur-[24px]
                                   border-b border-white/[0.06] flex items-center justify-between
                                   px-6 gap-4 shrink-0 relative z-20
                                   after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
                                   after:h-px after:bg-gradient-to-r after:from-transparent after:via-amber-500/15 after:to-transparent">

                    {/* Left: Toggle + Breadcrumb */}
                    <div className="flex items-center gap-3.5 min-w-0">
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0
                                       bg-white/[0.04] border border-white/[0.07] text-white/50
                                       hover:bg-white/[0.08] hover:text-white hover:border-white/[0.14]
                                       cursor-pointer transition-all duration-200"
                            onClick={() => setIsSidebarOpen(v => !v)}
                            id="sidebar-toggle-btn"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={17} />
                        </button>
                        <div className="flex items-center min-w-0">
                            <span className="text-[15px] font-bold text-white/85 tracking-tight whitespace-nowrap">
                                CIMANGGU I
                            </span>
                            <span className="text-white/20 mx-2">›</span>
                            <span className="text-[13.5px] font-medium text-white/45 whitespace-nowrap
                                             overflow-hidden text-ellipsis">
                                {pageTitle}
                            </span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07]
                                    rounded-[10px] px-3 h-9 flex-1 max-w-[300px]
                                    focus-within:border-amber-500/30 focus-within:bg-amber-500/[0.04]
                                    focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.06)]
                                    transition-all duration-200">
                        <Search size={14} className="text-white/25 shrink-0" />
                        <input
                            className="bg-transparent border-none outline-none text-[13px] text-white/65
                                       placeholder:text-white/[0.22] w-full font-[Inter,system-ui,sans-serif]"
                            placeholder="Cari menu atau data..."
                            aria-label="Pencarian"
                        />
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-2.5 shrink-0" ref={userMenuRef}>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className="relative w-9 h-9 flex items-center justify-center rounded-[10px]
                                           bg-white/[0.04] border border-white/[0.07] text-white/50
                                           hover:bg-white/[0.08] hover:text-white cursor-pointer transition-all duration-200"
                                onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
                                id="notif-btn"
                                aria-label="Notifikasi"
                            >
                                <Bell size={16} />
                                <span className="absolute top-[7px] right-[7px] w-2 h-2 rounded-full
                                                 bg-amber-500 border-2 border-dark-base
                                                 animate-[pulse-dot_2s_infinite]" />
                            </button>

                            {notifOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-[300px]
                                                bg-[rgba(12,20,40,0.95)] backdrop-blur-[20px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[999]
                                                animate-[drop-in_0.2s_ease_both] overflow-hidden">
                                    <div className="px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]
                                                    text-xs font-bold text-white tracking-wide">
                                        Notifikasi Terbaru
                                    </div>
                                    {notifications.map((n, i) => (
                                        <div key={i} className="flex items-start gap-2.5 px-4 py-3
                                                                border-b border-white/[0.04] last:border-b-0
                                                                hover:bg-white/[0.04] cursor-pointer transition-colors duration-150">
                                            <span className="text-base mt-0.5 shrink-0">{n.icon}</span>
                                            <div>
                                                <div className="text-xs text-white/65 leading-relaxed">{n.msg}</div>
                                                <div className="text-[10.5px] text-white/[0.28] mt-[3px]">{n.time} WIB</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07]
                                           rounded-xl py-[5px] pl-[5px] pr-3 cursor-pointer
                                           hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-200"
                                onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
                                id="user-menu-btn"
                            >
                                {/* Avatar */}
                                <div className="relative w-8 h-8 rounded-[9px] bg-gradient-to-br from-amber-500 to-amber-600
                                                flex items-center justify-center font-extrabold text-[13px] text-black
                                                shadow-[0_0_12px_rgba(245,158,11,0.35)] shrink-0">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                                    <span className="absolute -bottom-[1px] -right-[1px] w-[9px] h-[9px] rounded-full
                                                     bg-green-500 border-2 border-dark-base" />
                                </div>
                                {/* Info */}
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-[12.5px] font-bold text-white leading-tight">
                                        {user?.username || 'Admin'}
                                    </span>
                                    <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-[0.05em]">
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>
                                <ChevronDown size={13}
                                    className={`text-white/30 transition-transform duration-200
                                                ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-[220px]
                                                bg-[rgba(12,20,40,0.95)] backdrop-blur-[20px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[999]
                                                animate-[drop-in_0.2s_ease_both] overflow-hidden">
                                    <button className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-white/60 border-none bg-transparent
                                                       cursor-pointer text-left font-[Inter,system-ui,sans-serif]
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.05] hover:text-white transition-all duration-150">
                                        <User size={14} /> Profil Saya
                                    </button>
                                    <button className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-white/60 border-none bg-transparent
                                                       cursor-pointer text-left font-[Inter,system-ui,sans-serif]
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.05] hover:text-white transition-all duration-150">
                                        <Settings size={14} /> Pengaturan
                                    </button>
                                    <button className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-white/60 border-none bg-transparent
                                                       cursor-pointer text-left font-[Inter,system-ui,sans-serif]
                                                       hover:bg-red-500/[0.08] hover:text-red-400 transition-all duration-150"
                                            onClick={handleLogout}>
                                        <LogOut size={14} /> Keluar Sistem
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Content ──────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-7 custom-scrollbar">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};

export default Layout;
