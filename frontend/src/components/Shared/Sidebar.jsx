import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Home, Clock, Wallet, FileText, Users, Settings, Activity,
    LogOut, ChevronDown, Pyramid, X, Menu, BarChart3, Database, Shield, Zap, Search,
    Briefcase, Map, MapPin
} from 'lucide-react';
import useRole from '../../hooks/useRole';

/* ─── TOOLTIP COMPONENT ────────────────────────────────────────────────────── */
const Tooltip = ({ text, show }) => (
    <div className={`fixed left-[90px] px-3 py-1.5 bg-dark-overlay backdrop-blur-md 
                    border border-white/10 rounded-lg text-white text-[11px] font-bold
                    pointer-events-none transition-all duration-300 z-[100] whitespace-nowrap shadow-2xl
                    ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
        {text}
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-dark-overlay border-l border-b border-white/10 rotate-45" />
    </div>
);

/* ─── NAV GROUP LABEL ──────────────────────────────────────────────────────── */
const GroupLabel = ({ label, isCollapsed }) => (
    <div className={`px-5 pt-4 pb-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-text-tertiary select-none transition-opacity duration-300
                    ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        {label}
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

    // Icon handling with multi-color support
    const renderIcon = (active) => {
        if (!item.icon) return null;
        const colorClass = active ? 'text-white' : (item.iconColor || 'text-text-quaternary');
        return React.cloneElement(item.icon, { 
            size: 18, 
            className: `transition-all duration-300 ${colorClass} ${!active && !isCollapsed ? 'opacity-80' : 'opacity-100'}`
        });
    };

    const navClass = (active) => `
        w-full flex items-center gap-3 px-5 py-3 text-[13.5px] font-semibold 
        transition-all duration-300 group relative rounded-xl
        ${active 
            ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-[0_4px_15px_rgba(59,130,246,0.35)]' 
            : 'text-text-muted hover:bg-white/[0.04] hover:text-text-main'}
        ${isCollapsed ? 'justify-center px-0' : ''}
    `;

    if (item.subCategories || item.subMenus) {
        return (
            <div className="w-full px-2">
                <button
                    onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={navClass(isParentActive && level === 0)}
                >
                    <span className={`shrink-0 ${isCollapsed ? 'flex items-center justify-center w-10 h-10' : ''}`}>
                        {renderIcon(isParentActive && level === 0)}
                    </span>
                    
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left truncate">{item.title}</span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-40`}
                            />
                        </>
                    )}

                    {isCollapsed && isHovered && <Tooltip text={item.title} show={true} />}
                </button>

                {/* Sub Menu Panel - Only in Expanded State */}
                {!isCollapsed && (
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out
                            ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <div className="mt-1 ml-4 space-y-1 relative border-l border-white/5">
                            {item.subCategories?.map((sub, i) => (
                                <SidebarItem key={i} item={sub} isCollapsed={isCollapsed} level={level + 1} />
                            ))}

                            {item.subMenus?.map((sub, i) => (
                                <NavLink
                                    key={i}
                                    to={sub.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 py-2.5 pl-8 pr-4 text-[12.5px] font-medium transition-all duration-300 group
                                         ${isActive 
                                            ? 'text-[#60a5fa] bg-white/[0.03]' 
                                            : 'text-text-quaternary hover:text-text-secondary hover:bg-white/[0.02]'
                                         }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className={`w-1.5 h-1.5 rounded-full border border-white/10 transition-all duration-500
                                                ${isActive ? 'bg-[#3b82f6] border-[#60a5fa] shadow-[0_0_8px_rgba(59,130,246,1)] scale-110' : 'bg-white/10'}`} />
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
        <div className="w-full px-2">
            <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={({ isActive }) => navClass(isActive)}
            >
                {({ isActive }) => (
                    <>
                        <span className={`shrink-0 ${isCollapsed ? 'flex items-center justify-center w-10 h-10' : ''}`}>
                            {renderIcon(isActive)}
                        </span>
                        
                        {!isCollapsed && (
                            <span className="flex-1 truncate">{item.title}</span>
                        )}

                        {!isCollapsed && item.badge && !isActive && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded
                                bg-gold-light border border-gold-border text-gold uppercase tracking-tighter">
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
        { group: 'Overview' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home />, iconColor: 'text-blue-400' },
        { title: 'Presensi Kehadiran', path: '/dashboard/rekap-kehadiran', icon: <Clock />, iconColor: 'text-amber-400', badge: 'Live' },
        { group: 'Administrasi Desa' },
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
                }
            ]
        },
        { group: 'Konfigurasi Sistem' },
        {
            title: 'Pengaturan Web', icon: <Settings />, iconColor: 'text-purple-400',
            subMenus: [
                { title: 'Manajemen Pengguna', path: '/dashboard/users' },
                { title: 'Identitas Desa', path: '/dashboard/landing-setting' },
                { title: 'Kelola Berita', path: '/dashboard/berita' },
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
                bg-dark-sidebar backdrop-blur-[28px] border-r border-white/10
                shadow-[20px_0_60px_rgba(0,0,0,0.4)] overflow-hidden
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-[260px]'}
                ${!isSidebarOpen ? '-translate-x-full md:w-0 md:opacity-0 md:border-none' : 'translate-x-0'}`}
        >
            {/* ── Brand Header ────────────────────────────────────── */}
            <div className={`px-4 py-6 border-b border-white/[0.08] flex items-center justify-center shrink-0
                            bg-gradient-to-b from-white/[0.03] to-transparent transition-all duration-300
                            ${scrolled ? 'bg-dark-base shadow-lg' : ''}`}>
                
                <div className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'flex-col' : ''}`}>
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse opacity-0 group-hover:opacity-100"></div>
                        <div className={`transition-all duration-500 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} 
                                        relative z-10 flex items-center justify-center`}>
                            <img 
                                src="/images/logo_kabupaten_bogor.png" 
                                alt="Logo" 
                                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            />
                        </div>
                    </div>
                    
                    {!isCollapsed && (
                        <div className="transition-all duration-500 animate-fade-in">
                            <div className="text-[14px] font-black text-text-main tracking-widest uppercase leading-none">
                                CIMANGGU I
                            </div>
                            <div className="text-[8px] text-gold font-bold uppercase tracking-[0.2em] mt-1.5 opacity-60">
                                Digital Office
                            </div>
                        </div>
                    )}

                    {isCollapsed && (
                         <div className="h-px w-6 bg-white/10 mt-2" />
                    )}
                </div>
            </div>

            {/* ── Navigation ──────────────────────────────────────── */}
            <nav 
                className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1.5 custom-scrollbar scroll-smooth"
                onScroll={(e) => setScrolled(e.target.scrollTop > 10)}
            >
                {menus.map((item, idx) => {
                    if (item.group) {
                        return <GroupLabel key={`g-${idx}`} label={item.group} isCollapsed={isCollapsed} />;
                    }
                    return <SidebarItem key={idx} item={item} isCollapsed={isCollapsed} />;
                })}
            </nav>

            {/* ── Footer ─────────────────────────────────── */}
            <div className={`px-4 py-5 border-t border-white/[0.08] shrink-0 bg-white/[0.02] flex justify-center`}>
                <button
                    onClick={logoutUser}
                    className={`group flex items-center gap-3 w-full p-3 rounded-xl
                               bg-red-500/[0.03] border border-red-500/10 transition-all duration-300
                               hover:bg-red-500/10 hover:border-red-500/30
                               ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                        <LogOut size={16} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start translate-y-[1px] animate-fade-in">
                            <span className="text-[12px] font-black text-red-500">Logout</span>
                            <span className="text-[8px] text-red-500/40 uppercase mt-1 font-bold">End Session</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
