import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Bell, ChevronDown, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
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
            <main className={`flex-1 flex flex-col relative z-10 min-w-0 transition-all duration-300 ease-in-out`}>

                {/* ── Header ──────────────────────────────────── */}
                <header className="h-16 bg-dark-header backdrop-blur-[24px]
                                   border-b border-white/[0.06] flex items-center justify-between
                                   px-6 gap-4 shrink-0 relative z-20">

                    {/* Left: Mobile Toggle + Breadcrumb */}
                    <div className="flex items-center gap-3.5 min-w-0">
                        {/* Show toggle ONLY on mobile */}
                        <button
                            className="w-9 h-9 md:hidden flex items-center justify-center rounded-[10px] shrink-0
                                       bg-white/[0.04] border border-white/[0.07] text-white/50
                                       hover:bg-white/[0.08] hover:text-white hover:border-white/[0.14]
                                       cursor-pointer transition-all duration-300 ease-in-out"
                            onClick={() => setIsSidebarOpen(v => !v)}
                        >
                            <Menu size={17} />
                        </button>
                        
                        <div className="flex items-center min-w-0">
                            <span className="text-[15px] font-black text-white tracking-widest whitespace-nowrap drop-shadow-sm">
                                CIMANGGU I
                            </span>
                            <span className="text-text-subtle mx-2 font-light opacity-50">/</span>
                            <span className="text-[13px] font-semibold text-text-muted whitespace-nowrap
                                             overflow-hidden text-ellipsis tracking-tight">
                                {pageTitle}
                            </span>
                        </div>
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-4 shrink-0" ref={userMenuRef}>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                className="relative w-10 h-10 flex items-center justify-center rounded-xl
                                           bg-white/[0.04] border border-white/[0.07] text-amber-500
                                           hover:bg-amber-500/10 hover:border-amber-500/30 cursor-pointer transition-all duration-300 shadow-sm"
                                onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
                            >
                                <Bell size={18} />
                                <span className={`absolute top-[9px] right-[9px] w-2.5 h-2.5 rounded-full
                                                 bg-amber-500 border-2 border-dark-base
                                                 animate-[pulse-dot_1.8s_infinite] shadow-lg`} />
                            </button>

                            {notifOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-[320px]
                                                bg-dark-overlay backdrop-blur-[24px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[999]
                                                animate-[drop-in_0.3s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                        <span className="text-xs font-black text-text-main tracking-widest uppercase">Pemberitahuan</span>
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Baru</span>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {notifications.map((n, i) => (
                                            <div key={i} className="flex items-start gap-3.5 px-5 py-4
                                                                    border-b border-white/[0.04] last:border-b-0
                                                                    hover:bg-white/[0.04] cursor-pointer transition-colors duration-150">
                                                <span className="text-lg mt-0.5 shrink-0">{n.icon}</span>
                                                <div>
                                                    <div className="text-[12.5px] text-text-main leading-relaxed font-medium">{n.msg}</div>
                                                    <div className="text-[10px] text-text-muted mt-1.5 font-semibold opacity-60 tracking-wider font-mono">{n.time} WIB</div>
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
                                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07]
                                           rounded-xl py-1.5 pl-1.5 pr-4 cursor-pointer
                                           hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-300 shadow-sm"
                                onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
                            >
                                {/* Avatar */}
                                <div className="relative w-9 h-9 rounded-[10px] bg-gradient-to-br from-amber-400 to-amber-600
                                                flex items-center justify-center font-black text-[14px] text-black
                                                shadow-[0_4px_12px_rgba(245,158,11,0.3)] shrink-0 overflow-hidden">
                                    {user?.foto_profil ? (
                                        <img src={user.foto_profil} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.username?.charAt(0)?.toUpperCase() || 'A'
                                    )}
                                    <span className="absolute -bottom-[0.5px] -right-[0.5px] w-[10px] h-[10px] rounded-full
                                                     bg-green-500 border-2 border-dark-base shadow-[0_0_4px_rgba(34,197,94,1)]" />
                                </div>
                                {/* Info */}
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-[13px] font-black text-white leading-none tracking-tight">
                                        {user?.nama_lengkap || user?.username || 'Admin'}
                                    </span>
                                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.1em] mt-1.5 opacity-80">
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>
                                <ChevronDown size={14}
                                    className={`text-text-faint transition-transform duration-300
                                                ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-[240px]
                                                bg-dark-overlay backdrop-blur-[24px]
                                                border border-white/[0.08] rounded-2xl
                                                shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[999]
                                                animate-[drop-in_0.3s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                                    
                                    {/* Theme Toggler (Power-style toggle switch) inside Dropdown */}
                                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tema Visual</span>
                                        <button 
                                            onClick={toggleTheme}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
                                        >
                                            {theme === 'dark' ? <Moon size={14} className="text-amber-500" /> : <Sun size={14} className="text-amber-500" />}
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => { navigate('/dashboard/profile'); setUserMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full px-5 py-[14px]
                                                       text-[13.5px] text-text-muted border-none bg-transparent
                                                       cursor-pointer text-left font-semibold
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.06] hover:text-white transition-all duration-200">
                                        <User size={15} className="text-blue-400" /> Profil Saya
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/dashboard/settings'); setUserMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full px-5 py-[14px]
                                                       text-[13.5px] text-text-muted border-none bg-transparent
                                                       cursor-pointer text-left font-semibold
                                                       border-b border-white/[0.04]
                                                       hover:bg-white/[0.06] hover:text-white transition-all duration-200">
                                        <Settings size={15} className="text-purple-400" /> Pengaturan
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-5 py-[14px]
                                                       text-[13.5px] text-text-muted border-none bg-transparent
                                                       cursor-pointer text-left font-black
                                                       hover:bg-red-500/[0.08] hover:text-red-400 transition-all duration-200"
                                            onClick={handleLogout}>
                                        <LogOut size={15} className="text-red-500" /> Log Out Sistem
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
