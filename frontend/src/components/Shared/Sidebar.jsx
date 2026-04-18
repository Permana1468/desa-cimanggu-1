import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Home, Clock, Wallet, FileText, Users, Settings, Activity,
    LogOut, ChevronDown, Pyramid, X
} from 'lucide-react';
import useRole from '../../hooks/useRole';

/* ─── NAV GROUP LABEL ──────────────────────────────────────────────────────── */
const GroupLabel = ({ label }) => (
    <div className="px-5 pt-4 pb-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-text-tertiary select-none">
        {label}
    </div>
);

/* ─── NESTED ITEM COMPONENT ────────────────────────────────────────────────── */
const SidebarItem = ({ item, level = 0 }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    // Check if any child is active
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

    // Auto-open if child is active
    useEffect(() => {
        if (isParentActive) setIsOpen(true);
    }, [isParentActive]);

    // Recursive rendering for sub-categories
    if (item.subCategories || item.subMenus) {
        return (
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium 
                        transition-all duration-300 group relative
                        ${level > 0 ? 'pl-10 text-text-muted hover:text-text-main' : 'text-text-muted hover:text-text-main'}
                        ${(isParentActive || isActiveLink) && level === 0 ? 'bg-gradient-to-r from-gold-light to-transparent' : ''}
                    `}
                >
                    {/* Active Indicator Bar (L1 only) */}
                    {level === 0 && (isParentActive || isActiveLink) && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gold rounded-r-full shadow-gold-glow" />
                    )}

                    {/* Icon */}
                    {item.icon && (
                        <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-500
                            ${isParentActive || isActiveLink ? 'bg-gold-light text-gold shadow-gold-glow' : 'bg-white/[0.03] text-text-quaternary group-hover:bg-white/10 group-hover:text-text-secondary'}
                        `}>
                            {React.cloneElement(item.icon, { size: 15 })}
                        </span>
                    )}

                    <span className={`flex-1 text-left ${isParentActive || isActiveLink ? 'text-text-main font-bold' : ''}`}>
                        {item.title}
                    </span>

                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} 
                            ${isParentActive || isActiveLink ? 'text-gold' : 'text-text-quaternary'}`}
                    />
                </button>

                {/* Sub Menu Panel */}
                <div 
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="mt-0.5 ml-0 space-y-0.5 relative">
                        {/* Recursive Line */}
                        <div className={`absolute left-[33px] top-0 bottom-4 w-px bg-white/10 ${level > 0 ? 'ml-4' : ''}`} />

                        {item.subCategories?.map((sub, i) => (
                            <SidebarItem key={i} item={sub} level={level + 1} />
                        ))}

                        {item.subMenus?.map((sub, i) => (
                            <NavLink
                                key={i}
                                to={sub.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-2 pr-5 text-[12.5px] transition-all duration-300 group relative
                                     ${level === 0 ? 'pl-11' : (level === 1 ? 'pl-16' : 'pl-20')}
                                     ${isActive 
                                        ? 'text-gold font-black bg-white/[0.04] shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' 
                                        : 'text-text-quaternary hover:text-text-secondary hover:bg-white/[0.02]'
                                     }
                                    `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`absolute left-[31px] ${level > 0 ? 'ml-4' : ''} w-1.5 h-1.5 rounded-full border border-white/10 transition-all duration-500
                                            ${isActive ? 'bg-gold border-gold scale-110 shadow-gold-glow' : 'bg-white/10 group-hover:bg-white/30'}
                                        `} />
                                        <span className="truncate">{sub.title}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1 h-1 rounded-full bg-gold animate-pulse" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Direct Link
    return (
        <NavLink
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium
                 transition-all duration-500 group relative
                 ${isActive
                    ? 'text-text-main font-black bg-gradient-to-r from-gold-light to-transparent'
                    : 'text-text-muted hover:text-text-main hover:bg-white/[0.03]'
                 }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gold rounded-r-full shadow-gold-glow" />
                    )}

                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-500
                        ${isActive ? 'bg-gold-light text-gold shadow-gold-glow' : 'bg-white/[0.04] text-text-quaternary group-hover:bg-white/10 group-hover:text-text-secondary'}`}>
                        {item.icon}
                    </span>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded
                            bg-gold-light border border-gold-border text-gold uppercase tracking-tighter">
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
};

/* ─── MENU CONFIGS ──────────────────────────────────────────────────────────── */
const menuConfig = {
    ADMIN: [
        { group: 'Overview' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home /> },
        { title: 'Presensi Kehadiran', path: '/dashboard/rekap-kehadiran', icon: <Clock />, badge: 'Live' },
        { group: 'Administrasi Desa' },
        {
            title: 'Aparatur Desa', 
            icon: <Pyramid />,
            subCategories: [
                {
                    title: 'Sekretariat',
                    subCategories: [
                        {
                            title: 'TU & Umum',
                            subMenus: [
                                { title: 'Buku Surat Masuk/Keluar', path: '/dashboard/buku-surat' },
                                { title: 'Inventaris & Aset Desa', path: '/dashboard/inventaris-aset' },
                            ]
                        },
                        {
                            title: 'Keuangan Desa',
                            subMenus: [
                                { title: 'Buku Kas Umum (BKU)', path: '/dashboard/buku-kas' },
                                { title: 'Realisasi Anggaran', path: '/dashboard/realisasi-anggaran' },
                            ]
                        },
                        {
                            title: 'Perencanaan',
                            subMenus: [
                                { title: 'DED & Manajemen Proyek', path: '/dashboard/perencanaan' },
                                { title: 'Penyusunan RAB', path: '/dashboard/rab' },
                                { title: 'RPJMDes & RKPDes', path: '/dashboard/rpjmdes' },
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
                                { title: 'Data Kependudukan', path: '/dashboard/pemerintahan' },
                                { title: 'Maps Spasial', path: '/dashboard/maps' },
                            ]
                        },
                        {
                            title: 'Kesejahteraan',
                            subMenus: [{ title: 'Proyek Fisik', path: '/dashboard/kesejahteraan' }]
                        },
                        {
                            title: 'Pelayanan Umum',
                            subMenus: [
                                { title: 'Layanan Pengantar RT/RW', path: '/dashboard/pelayanan' },
                                { title: 'E-KMS Posyandu', path: '/dashboard/e-kms' },
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
                                { title: 'Laporan Dusun I', path: '/dashboard/laporan-dusun-1' },
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
        { group: 'Konfigurasi Sistem' },
        {
            title: 'Pengaturan Web', icon: <Settings />,
            subMenus: [
                { title: 'Manajemen Pengguna', path: '/dashboard/users' },
                { title: 'Identitas & Profil Desa', path: '/dashboard/landing-setting' },
                { title: 'Banner & Hero Carousel', path: '/dashboard/hero-carousel' },
                { title: 'Kelola Berita & Publikasi', path: '/dashboard/berita' },
                { title: 'Struktur Organisasi', path: '/dashboard/organisasi' },
            ]
        },
    ],
    // ... roles can be simplified or maintained
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { theme } = useTheme();
    const { role } = useRole();
    const [scrolled, setScrolled] = useState(false);

    if (!user) return null;
    const menus = menuConfig[role] || menuConfig.ADMIN;

    return (
        <aside
            className={`fixed md:relative top-0 left-0 z-[60] h-full w-[280px] flex flex-col
                bg-dark-sidebar backdrop-blur-[24px] border-r border-white/10
                shadow-[20px_0_60px_rgba(0,0,0,0.4)] overflow-hidden
                transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${!isSidebarOpen ? '-translate-x-full md:w-0 md:opacity-0 md:border-none' : 'translate-x-0'}`}
        >
            {/* ── Brand Header ────────────────────────────────────── */}
            <div className={`px-6 py-6 border-b border-white/[0.08] flex items-center justify-between shrink-0
                            bg-gradient-to-b from-white/[0.03] to-transparent transition-all duration-300
                            ${scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-dark-base' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="w-14 h-14 relative z-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <img 
                                src="/images/logo_kabupaten_bogor.png" 
                                alt="Logo Bogor" 
                                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="text-[15px] font-black text-text-main tracking-[0.15em] uppercase leading-none drop-shadow-lg">
                            CIMANGGU I
                        </div>
                        <div className="text-[9px] text-gold font-black uppercase tracking-[0.2em] mt-2 opacity-70 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                            Digital Office
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:text-text-main transition-all"
                >
                    <X size={18} />
                </button>
            </div>

            {/* ── Navigation ──────────────────────────────────────── */}
            <nav 
                className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1 custom-scrollbar scroll-smooth"
                onScroll={(e) => setScrolled(e.target.scrollTop > 10)}
            >
                {menus.map((item, idx) => {
                    if (item.group) {
                        return <GroupLabel key={`g-${idx}`} label={item.group} />;
                    }
                    return <SidebarItem key={idx} item={item} />;
                })}
            </nav>

            {/* ── Footer / Logout ─────────────────────────────────── */}
            <div className="px-5 py-5 border-t border-white/[0.08] shrink-0 bg-white/[0.02]">
                <button
                    onClick={logoutUser}
                    className="group flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl
                               bg-red-500/[0.03] border border-red-500/10 transition-all duration-500
                               hover:bg-red-500/10 hover:border-red-500/30"
                >
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                        <LogOut size={16} />
                    </div>
                    <div className="flex flex-col items-start translate-y-[1px]">
                        <span className="text-[13px] font-black text-red-500 group-hover:text-red-400 leading-none">Logout</span>
                        <span className="text-[9px] text-red-500/30 uppercase mt-1 font-bold tracking-widest">Sesi Selesai</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
