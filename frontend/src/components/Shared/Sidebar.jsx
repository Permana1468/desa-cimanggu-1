import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Home, Clock, Wallet, FileText, Users, Settings, Activity,
    LogOut, ChevronDown, Pyramid, X, Menu, BarChart3, Database, Shield, Zap, Search,
    Briefcase, Map, MapPin, ChevronLeft, ChevronRight, LayoutGrid, Layers
} from 'lucide-react';
import useRole from '../../hooks/useRole';

/* ─── TOOLTIP COMPONENT ────────────────────────────────────────────────────── */
const Tooltip = ({ text, show }) => (
    <div className={`fixed left-[85px] px-3 py-1.5 bg-dark-overlay backdrop-blur-xl 
                    border border-white/15 rounded-lg text-white text-[11px] font-bold
                    pointer-events-none transition-all duration-300 z-[100] whitespace-nowrap shadow-2xl
                    ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
        {text}
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-dark-overlay border-l border-b border-white/15 rotate-45" />
    </div>
);

/* ─── NESTED ITEM COMPONENT ────────────────────────────────────────────────── */
const SidebarItem = ({ item, isCollapsed, level = 0 }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const isActiveLink = item.path && (
        item.path === '/dashboard' 
            ? location.pathname === '/dashboard' 
            : location.pathname.startsWith(item.path)
    );

    const hasActiveChild = (menu) => {
        if (menu.subMenus?.some(s => location.pathname === s.path)) return true;
        if (menu.subCategories?.some(c => hasActiveChild(c))) return true;
        return false;
    };

    const isParentActive = hasActiveChild(item);

    useEffect(() => {
        if (isParentActive && !isCollapsed) setIsOpen(true);
        if (isCollapsed) setIsOpen(false);
    }, [isParentActive, isCollapsed]);

    const renderIcon = (active) => {
        if (!item.icon) return null;
        const colorClass = active ? 'text-white' : (item.iconColor || 'text-text-muted');
        return React.cloneElement(item.icon, { 
            size: 19, 
            className: `transition-all duration-300 ${colorClass} ${!active && !isCollapsed ? 'opacity-90' : 'opacity-100'}`
        });
    };

    const navClass = (active) => `
        w-full flex items-center gap-3 px-5 py-3.5 text-[13.5px] font-bold 
        transition-all duration-300 group relative rounded-xl
        ${active 
            ? 'sidebar-active-gradient text-white scale-[1.02]' 
            : `text-text-muted hover:bg-white/[0.05] hover:text-text-main`}
        ${isCollapsed ? 'justify-center px-0' : ''}
    `;

    if (item.subCategories || item.subMenus) {
        return (
            <div className="w-full px-2.5">
                <button
                    onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={navClass(isParentActive && level === 0)}
                >
                    <span className={`shrink-0 ${isCollapsed ? 'flex items-center justify-center w-11 h-11' : ''}`}>
                        {renderIcon(isParentActive && level === 0)}
                    </span>
                    
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left truncate tracking-tight">{item.title}</span>
                            <ChevronDown
                                size={15}
                                className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} opacity-30 group-hover:opacity-60`}
                            />
                        </>
                    )}

                    {isCollapsed && isHovered && <Tooltip text={item.title} show={true} />}
                </button>

                {!isCollapsed && (
                    <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                                    ${isOpen ? 'max-h-[1200px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-5 space-y-1 relative border-l-2 border-white/[0.05] py-1">
                            {item.subCategories?.map((sub, i) => (
                                <SidebarItem key={i} item={sub} isCollapsed={isCollapsed} level={level + 1} />
                            ))}

                            {item.subMenus?.map((sub, i) => (
                                <NavLink
                                    key={i}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 py-2.5 pl-8 pr-4 text-[12.5px] font-bold transition-all duration-300 group rounded-lg mx-2
                                         ${isActive 
                                            ? 'text-[#3b82f6] bg-white/[0.04] shadow-[inset_0_0_12px_rgba(59,130,246,0.05)]' 
                                            : 'text-text-subtle hover:text-text-main hover:bg-white/[0.02]'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className={`w-1.5 h-1.5 rounded-full border-2 transition-all duration-500
                                                ${isActive ? 'bg-[#3b82f6] border-[#3b82f6] scale-125 shadow-[0_0_8px_rgba(59,130,246,1)]' : 'bg-white/10 border-white/5'}`} />
                                            <span className="truncate">{sub.title}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full px-2.5">
            <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={({ isActive }) => navClass(isActive)}
            >
                {({ isActive }) => (
                    <>
                        <span className={`shrink-0 ${isCollapsed ? 'flex items-center justify-center w-11 h-11' : ''}`}>
                            {renderIcon(isActive)}
                        </span>
                        
                        {!isCollapsed && (
                            <span className="flex-1 truncate tracking-tight">{item.title}</span>
                        )}

                        {!isCollapsed && item.badge && !isActive && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm
                                bg-gold-light border border-gold-border text-gold uppercase tracking-tighter animate-pulse">
                                {item.badge}
                            </span>
                        )}

                        {isCollapsed && isHovered && <Tooltip text={item.title} show={true} />}
                    </>
                )}
            </NavLink>
        </div>
    );
};

/* ─── MENU CONFIGS ──────────────────────────────────────────────────────────── */
const menuConfig = {
    ADMIN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home />, iconColor: 'text-blue-400' },
        { title: 'Presensi Kehadiran', path: '/dashboard/rekap-kehadiran', icon: <Clock />, iconColor: 'text-amber-400', badge: 'Live' },
        {
            title: 'Aparatur Desa', 
            icon: <Pyramid />,
            iconColor: 'text-orange-400',
            subCategories: [
                {
                    title: 'Sekretariat',
                    subCategories: [
                        {
                            title: 'TU & Umum',
                            subMenus: [
                                { title: 'Buku Surat Masuk', path: '/dashboard/buku-surat' },
                                { title: 'Inventaris Desa', path: '/dashboard/inventaris-aset' },
                            ]
                        },
                        {
                            title: 'Keuangan Desa',
                            subMenus: [
                                { title: 'Buku Kas Umum', path: '/dashboard/buku-kas' },
                                { title: 'Realisasi Anggaran', path: '/dashboard/realisasi-anggaran' },
                            ]
                        }
                    ]
                },
                {
                    title: 'Pelaksana Teknis',
                    subCategories: [
                        {
                            title: 'Pemerintahan',
                            subMenus: [
                                { title: 'Kependudukan', path: '/dashboard/pemerintahan' },
                                { title: 'Maps Spasial', path: '/dashboard/maps' },
                            ]
                        }
                    ]
                },
                {
                    title: 'Wilayah Dusun',
                    subCategories: [
                        {
                            title: 'Dusun I & II',
                            subMenus: [
                                { title: 'Monitoring Dusun I', path: '/dashboard/data-dusun-1' },
                                { title: 'Monitoring Dusun II', path: '/dashboard/data-dusun-2' },
                            ]
                        },
                        {
                            title: 'Dusun III & IV',
                            subMenus: [
                                { title: 'Monitoring Dusun III', path: '/dashboard/data-dusun-3' },
                                { title: 'Monitoring Dusun IV', path: '/dashboard/data-dusun-4' },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: 'Pengaturan Web', icon: <Settings />, iconColor: 'text-purple-400',
            subMenus: [
                { title: 'Manajemen Pengguna', path: '/dashboard/users' },
                { title: 'Identitas Desa', path: '/dashboard/landing-setting' },
                { title: 'Kelola Berita', path: '/dashboard/berita' },
                { title: 'Struktur Organisasi', path: '/dashboard/organisasi' },
            ]
        },
    ]
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isCollapsed, setIsCollapsed }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { role } = useRole();
    const [scrolled, setScrolled] = useState(false);

    if (!user) return null;
    const menus = menuConfig[role] || menuConfig.ADMIN;

    return (
        <aside
            className={`fixed md:relative top-0 left-0 z-[60] h-full flex flex-col
                bg-dark-sidebar backdrop-blur-[32px] border-r border-white/10
                shadow-[25px_0_70px_rgba(0,0,0,0.5)] overflow-visible
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isCollapsed ? 'w-20' : 'w-[280px]'}
                ${!isSidebarOpen ? '-translate-x-full md:w-0 md:opacity-0 md:border-none' : 'translate-x-0'}`}
        >
            {/* ── Internal Sidebar Toggle Handle ── */}
            <div className={`hidden md:flex absolute top-10 right-[-14px] z-[100] transition-transform duration-500 ${isCollapsed ? 'translate-x-[2px]' : ''}`}>
                 <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-7 h-7 flex items-center justify-center
                               bg-[#3b82f6] text-white rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.6)] 
                               border border-white/30 cursor-pointer 
                               hover:scale-115 hover:shadow-[0_4px_20px_rgba(59,130,246,0.8)] transition-all"
                    aria-label="Toggle Sidebar"
                >
                    {isCollapsed ? <ChevronRight size={15} strokeWidth={3} /> : <ChevronLeft size={15} strokeWidth={3} />}
                </button>
            </div>

            {/* ── Brand Header (Complex) ────────────────────────────────────── */}
            <div className={`px-4 py-8 flex flex-col items-center justify-center shrink-0 relative
                            transition-all duration-500 overflow-hidden
                            ${scrolled ? 'bg-dark-base shadow-lg animate-fade-in' : ''}`}>
                
                <div className={`flex items-center gap-4 transition-all duration-500 ${isCollapsed ? 'flex-col gap-5' : ''}`}>
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-gold/15 rounded-full blur-2xl animate-pulse opacity-0 group-hover:opacity-100"></div>
                        <div className={`transition-all duration-500 ${isCollapsed ? 'w-11 h-11' : 'w-14 h-14'} 
                                        relative z-10 flex items-center justify-center`}>
                            <img 
                                src="/images/logo_kabupaten_bogor.png" 
                                alt="Logo" 
                                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                            />
                        </div>
                    </div>
                    
                    {!isCollapsed && (
                        <div className="transition-all duration-500 animate-fade-in">
                            <div className="text-[17px] font-black text-text-main tracking-[0.08em] uppercase leading-none text-shadow-sm">
                                CIMANGGU I
                            </div>
                            <div className="text-[9px] text-gold font-black uppercase tracking-[0.25em] mt-2 opacity-80 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-gold animate-pulse shadow-gold-glow" />
                                Digital Office
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Border Complex */}
                <div className="absolute bottom-0 left-0 right-0 px-6">
                    <div className="complex-divider opacity-40"></div>
                </div>
            </div>

            {/* ── Navigation ──────────────────────────────────────── */}
            <nav 
                className="flex-1 overflow-y-auto overflow-x-hidden py-8 space-y-2.5 custom-scrollbar scroll-smooth"
                onScroll={(e) => setScrolled(e.target.scrollTop > 10)}
            >
                {menus.map((item, idx) => (
                    <SidebarItem key={idx} item={item} isCollapsed={isCollapsed} />
                ))}
            </nav>

            {/* ── Footer / Logout (Complex) ─────────────────────────────────── */}
            <div className={`px-5 py-8 flex items-center justify-center shrink-0 relative bg-white/[0.01]`}>
                {/* Top Border Complex */}
                <div className="absolute top-0 left-0 right-0 px-6">
                    <div className="complex-divider opacity-40"></div>
                </div>

                <button
                    onClick={logoutUser}
                    className={`group flex items-center gap-4 w-full p-4 rounded-2xl
                               bg-red-500/[0.04] border border-red-500/10 transition-all duration-500
                               hover:bg-red-500/15 hover:border-red-500/30 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]
                               ${isCollapsed ? 'justify-center border-none p-0 bg-transparent' : ''}`}
                >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-sm">
                        <LogOut size={18} strokeWidth={2.5} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start translate-y-[1px] animate-fade-in">
                            <span className="text-[13px] font-black text-red-500 tracking-tight">Logout</span>
                            <span className="text-[9px] text-red-500/40 uppercase mt-1 font-extrabold tracking-widest">End Session</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
