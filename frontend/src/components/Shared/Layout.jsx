import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Layout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile overlay state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop narrow state
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
        '/dashboard/profile': 'Profil Saya',
        '/dashboard/settings': 'Pengaturan Akun',
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
        <div className="relative flex h-screen overflow-hidden font-[Inter,system-ui,sans-serif] bg-dark-base transition-colors duration-500">

            {/* ── Background Layers ────────────────────────────── */}
            {bgImages.map((src, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center blur-[10px] scale-[1.06] z-0 transition-opacity duration-[2000ms] ease-in-out"
                    style={{
                        backgroundImage: `url('${src}')`,
                        opacity: (i === currentBg) ? (theme === 'dark' ? 1 : 0.6) : 0,
                    }}
                />
            ))}
            
            {/* Theme-aware overlay */}
            <div className={`absolute inset-0 z-[1] pointer-events-none transition-all duration-700
                            ${theme === 'dark' 
                                ? 'bg-gradient-to-br from-[rgba(8,14,30,0.92)] via-[rgba(10,18,40,0.88)] to-[rgba(8,14,30,0.94)]' 
                                : 'bg-gradient-to-br from-[rgba(241,245,249,0.85)] via-[rgba(248,250,252,0.8)] to-[rgba(241,245,249,0.9)]'}`} 
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-grid-pattern opacity-40 transition-opacity" />

            {/* ── Sidebar ───────────────────────────────────── */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* ── Main ──────────────────────────────────────── */}
            <main className={`flex-1 flex flex-col relative z-10 min-w-0 transition-all duration-300 ease-in-out
                             ${isSidebarOpen ? (isSidebarCollapsed ? 'md:ml-0' : 'md:ml-0') : ''}`}>

                {/* ── Header ──────────────────────────────────── */}
                <header className="h-16 bg-dark-header backdrop-blur-[24px]
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
                                       cursor-pointer transition-all duration-300 ease-in-out"
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setIsSidebarOpen(v => !v);
                                } else {
                                    setIsSidebarCollapsed(v => !v);
                                }
                            }}
                            id="sidebar-toggle-btn"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={17} className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-90' : ''}`} />
                        </button>
                        <div className="flex items-center min-w-0">
                            <span className="text-[15px] font-bold text-text-main tracking-tight whitespace-nowrap">
                                CIMANGGU I
                            </span>
                            <span className="text-text-subtle mx-2">›</span>
                            <span className="text-[13.5px] font-medium text-text-muted whitespace-nowrap
                                             overflow-hidden text-ellipsis">
                                {pageTitle}
                            </span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07]
                                    rounded-[10px] px-3 h-9 flex-1 max-w-[300px]
                                    focus-within:border-gold-border focus-within:bg-white/[0.08]
                                    focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.06)]
                                    transition-all duration-200">
                        <Search size={14} className="text-text-faint shrink-0" />
                        <input
                            className="bg-transparent border-none outline-none text-[13px] text-text-main
                                       placeholder:text-text-faint w-full font-[Inter,system-ui,sans-serif]"
                            placeholder="Cari menu atau data..."
                            aria-label="Pencarian"
                        />
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-2.5 shrink-0" ref={userMenuRef}>

                        {/* Theme Toggle (Mini) */}
                        <div className="hidden sm:block">
                             <button
                                onClick={toggleTheme}
                                className="w-9 h-9 flex items-center justify-center rounded-[10px]
                                           bg-white/[0.04] border border-white/[0.07] text-white/50
                                           hover:bg-white/[0.08] hover:text-amber-500 cursor-pointer transition-all duration-200"
                                title={theme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
                             >
                                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                             </button>
                        </div>

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
                                <span className={`absolute top-[7px] right-[7px] w-2 h-2 rounded-full
                                                 bg-amber-500 border-2 border-dark-base
                                                 animate-[pulse-dot_2s_infinite]`} />
                            </button>

                            {notifOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-[300px]
                                                bg-dark-overlay backdrop-blur-[20px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[999]
                                                animate-[drop-in_0.2s_ease_both] overflow-hidden">
                                    <div className="px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]
                                                    text-xs font-bold text-text-main tracking-wide">
                                        Notifikasi Terbaru
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.map((n, i) => (
                                            <div key={i} className="flex items-start gap-2.5 px-4 py-3
                                                                    border-b border-white/[0.04] last:border-b-0
                                                                    hover:bg-white/[0.04] cursor-pointer transition-colors duration-150">
                                                <span className="text-base mt-0.5 shrink-0">{n.icon}</span>
                                                <div>
                                                    <div className="text-xs text-text-main leading-relaxed">{n.msg}</div>
                                                    <div className="text-[10.5px] text-text-muted mt-[3px]">{n.time} WIB</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                                shadow-[0_0_12px_rgba(245,158,11,0.35)] shrink-0 overflow-hidden">
                                    {user?.foto_profil ? (
                                        <img src={user.foto_profil} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.username?.charAt(0)?.toUpperCase() || 'A'
                                    )}
                                    <span className="absolute -bottom-[1px] -right-[1px] w-[9px] h-[9px] rounded-full
                                                     bg-green-500 border-2 border-dark-base" />
                                </div>
                                {/* Info */}
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-[12.5px] font-bold text-text-main leading-tight">
                                        {user?.nama_lengkap || user?.username || 'Admin'}
                                    </span>
                                    <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-[0.05em]">
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>
                                <ChevronDown size={13}
                                    className={`text-text-faint transition-transform duration-200
                                                ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-[220px]
                                                bg-dark-overlay backdrop-blur-[20px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[999]
                                                animate-[drop-in_0.2s_ease_both] overflow-hidden">
                                    
                                    {/* Theme Toggler inside Dropdown */}
                                    <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Tema Visual</span>
                                        <button 
                                            onClick={toggleTheme}
                                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition-all"
                                        >
                                            {theme === 'dark' ? <Moon size={12} className="text-amber-500" /> : <Sun size={12} className="text-amber-500" />}
                                            <span className="text-[10px] font-black text-white uppercase">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => { navigate('/dashboard/profile'); setUserMenuOpen(false); }}
                                        className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-text-muted border-none bg-transparent
                                                       cursor-pointer text-left font-[Inter,system-ui,sans-serif]
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.05] hover:text-text-main transition-all duration-150">
                                        <User size={14} /> Profil Saya
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/dashboard/settings'); setUserMenuOpen(false); }}
                                        className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-text-muted border-none bg-transparent
                                                       cursor-pointer text-left font-[Inter,system-ui,sans-serif]
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.05] hover:text-text-main transition-all duration-150">
                                        <Settings size={14} /> Pengaturan
                                    </button>
                                    <button className="flex items-center gap-2.5 w-full px-4 py-[11px]
                                                       text-[13px] text-text-muted border-none bg-transparent
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-7 custom-scrollbar bg-transparent">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};

export default Layout;
