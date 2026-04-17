import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
    Home, Clock, Wallet, FileText, Users, Settings, Activity,
    LogOut, ChevronDown, FolderOpen, Briefcase, MapPin, Network,
    Hotel, HeartPulse, Construction, ClipboardList, Hammer,
    Map as MapIcon, Shield, Lightbulb, Building2, X
} from 'lucide-react';
import useRole from '../../hooks/useRole';

/* ─── NAV GROUP LABEL ──────────────────────────────────────────────────────── */
const GroupLabel = ({ label }) => (
    <div className="px-5 pt-[18px] pb-1.5 text-[9.5px] font-bold tracking-[0.12em] uppercase text-white/20 select-none">
        {label}
    </div>
);

/* ─── DROPDOWN ITEM ────────────────────────────────────────────────────────── */
const DropdownItem = ({ item, isOpen, onToggle }) => {
    const location = useLocation();
    const hasActive = item.subMenus?.some(s => location.pathname === s.path);

    return (
        <div>
            <button
                onClick={onToggle}
                className={`w-full flex items-center gap-[11px] px-5 py-2.5 text-[13px] font-medium 
                    border-l-[3px] cursor-pointer text-left transition-all duration-200 whitespace-nowrap
                    ${hasActive
                        ? 'text-amber-500/80 border-l-amber-500/40'
                        : 'text-white/45 border-l-transparent hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                aria-expanded={isOpen}
            >
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-200
                    ${hasActive ? 'bg-amber-500/15' : 'bg-white/[0.04]'}`}>
                    {item.icon}
                </span>
                <span className="flex-1">{item.title}</span>
                <ChevronDown
                    size={13}
                    className={`ml-auto shrink-0 transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isOpen ? 'rotate-180 text-amber-500' : 'text-white/20'}
                        ${hasActive ? 'text-amber-500' : ''}`}
                />
            </button>

            <div className={`overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isOpen ? 'max-h-[360px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {item.subMenus.map((sub, i) => (
                    <NavLink
                        key={i}
                        to={sub.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 py-2 pl-[46px] pr-5 text-[12.5px] whitespace-nowrap
                             relative transition-all duration-200
                             before:content-[''] before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-white/[0.06]
                             ${isActive
                                ? 'text-amber-500 font-semibold'
                                : 'text-white/35 hover:text-white/75 hover:bg-white/[0.03]'
                             }`
                        }
                    >
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 transition-colors duration-200`}
                              style={{ background: 'currentColor', opacity: 0.7 }} />
                        <span>{sub.title}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

/* ─── DIRECT LINK ───────────────────────────────────────────────────────────── */
const DirectLink = ({ item }) => (
    <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        className={({ isActive }) =>
            `flex items-center gap-[11px] px-5 py-2.5 text-[13px] font-medium
             border-l-[3px] transition-all duration-200 whitespace-nowrap relative
             ${isActive
                ? 'border-l-amber-500 text-amber-500 font-bold bg-gradient-to-r from-amber-500/10 to-transparent'
                : 'border-l-transparent text-white/45 hover:text-white/85 hover:bg-white/[0.04]'
             }`
        }
    >
        {({ isActive }) => (
            <>
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors duration-200
                    ${isActive ? 'bg-amber-500/15' : 'bg-white/[0.04]'}`}>
                    {item.icon}
                </span>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                    <span className="text-[9px] font-extrabold px-[7px] py-[2px] rounded-full
                        bg-amber-500/15 border border-amber-500/25 text-amber-500
                        tracking-[0.07em] uppercase animate-[badge-pulse_2.5s_infinite]">
                        {item.badge}
                    </span>
                )}
            </>
        )}
    </NavLink>
);

/* ─── MENU CONFIGS ──────────────────────────────────────────────────────────── */
const menuConfig = {
    ADMIN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Clock size={16} />, badge: 'Live' },
        { title: 'Manajemen Pengguna', path: '/dashboard/users', icon: <Users size={16} /> },

        { group: 'Sekretariat' },
        {
            title: 'Kaur TU & Umum', icon: <FolderOpen size={16} />,
            subMenus: [
                { title: 'Buku Surat Masuk & Keluar', path: '/dashboard/buku-surat' },
                { title: 'Inventaris & Aset Desa', path: '/dashboard/inventaris-aset' },
            ]
        },
        {
            title: 'Keuangan', icon: <Wallet size={16} />,
            subMenus: [
                { title: 'Buku Kas Umum', path: '/dashboard/buku-kas' },
                { title: 'Realisasi Anggaran (SPP)', path: '/dashboard/realisasi-anggaran' },
            ]
        },
        {
            title: 'Perencanaan', icon: <Network size={16} />,
            subMenus: [
                { title: 'DED & RAB Proyek', path: '/dashboard/perencanaan' },
                { title: 'Rencana Anggaran (RAB)', path: '/dashboard/rab' },
                { title: 'Verifikasi Usulan LPM', path: '/dashboard/verifikasi-usulan' },
                { title: 'Rekap Musrenbang', path: '/dashboard/rekap-musrenbang' },
                { title: 'Dokumen RPJMDes & RKPDes', path: '/dashboard/rpjmdes' },
            ]
        },

        { group: 'Pelaksana Teknis' },
        {
            title: 'Kasi Pemerintahan', icon: <Hotel size={16} />,
            subMenus: [
                { title: 'Data Kependudukan', path: '/dashboard/pemerintahan' },
                { title: 'Buku Mutasi Warga', path: '/dashboard/mutasi-warga' },
                { title: 'Buku Peraturan Desa', path: '/dashboard/peraturan-desa' },
            ]
        },
        {
            title: 'Kesejahteraan', icon: <HeartPulse size={16} />,
            subMenus: [
                { title: 'Manajemen Proyek Fisik', path: '/dashboard/kesejahteraan' },
                { title: 'Penyaluran Bansos', path: '/dashboard/bansos' },
            ]
        },
        {
            title: 'Pelayanan', icon: <FileText size={16} />,
            subMenus: [
                { title: 'Layanan Pengantar RT/RW', path: '/dashboard/pelayanan' },
                { title: 'E-KMS Posyandu', path: '/dashboard/e-kms' },
            ]
        },

        { group: 'Wilayah Dusun' },
        {
            title: 'Dusun I', icon: <MapPin size={16} />,
            subMenus: [
                { title: 'Data Warga Dusun I', path: '/dashboard/data-dusun-1' },
                { title: 'Laporan Dusun I', path: '/dashboard/laporan-dusun-1' },
            ]
        },
        {
            title: 'Dusun II', icon: <MapPin size={16} />,
            subMenus: [
                { title: 'Data Warga Dusun II', path: '/dashboard/data-dusun-2' },
                { title: 'Laporan Dusun II', path: '/dashboard/laporan-dusun-2' },
            ]
        },
        {
            title: 'Dusun III', icon: <MapPin size={16} />,
            subMenus: [
                { title: 'Data Warga Dusun III', path: '/dashboard/data-dusun-3' },
                { title: 'Laporan Dusun III', path: '/dashboard/laporan-dusun-3' },
            ]
        },
        {
            title: 'Dusun IV', icon: <MapPin size={16} />,
            subMenus: [
                { title: 'Data Warga Dusun IV', path: '/dashboard/data-dusun-4' },
                { title: 'Laporan Dusun IV', path: '/dashboard/laporan-dusun-4' },
            ]
        },

        { group: 'Pengaturan' },
        {
            title: 'Pengaturan Website', icon: <Settings size={16} />,
            subMenus: [
                { title: 'Identitas & Profil', path: '/dashboard/landing-setting' },
                { title: 'Hero & Carousel', path: '/dashboard/hero-carousel' },
                { title: 'Kelola Berita', path: '/dashboard/berita' },
                { title: 'Struktur Organisasi', path: '/dashboard/organisasi' },
            ]
        },
    ],

    KAUR_PERENCANAAN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Clock size={16} /> },
        { group: 'Perencanaan Desa' },
        {
            title: 'Perencanaan Desa', icon: <Hammer size={16} />,
            subMenus: [
                { title: 'Verifikasi Usulan LPM', path: '/dashboard/verifikasi-usulan' },
                { title: 'Rekap Usulan Musrenbang', path: '/dashboard/rekap-musrenbang' },
                { title: 'Detail Engineering (DED)', path: '/dashboard/perencanaan' },
                { title: 'Rencana Anggaran (RAB)', path: '/dashboard/rab' },
                { title: 'Dokumen RPJMDes & RKPDes', path: '/dashboard/rpjmdes' },
            ]
        },
    ],

    KASI_PEMERINTAHAN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'Peta Wilayah', path: '/dashboard/maps', icon: <MapIcon size={16} /> },
    ],

    KAUR_KEUANGAN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Clock size={16} /> },
        { group: 'Keuangan Desa' },
        {
            title: 'Keuangan Desa', icon: <Wallet size={16} />,
            subMenus: [
                { title: 'Buku Kas Umum', path: '/dashboard/buku-kas' },
                { title: 'Realisasi Anggaran (SPP)', path: '/dashboard/realisasi-anggaran' },
            ]
        },
    ],

    SEKDES: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Clock size={16} /> },
        { title: 'Evaluasi & Laporan', path: '/dashboard/laporan-desa', icon: <Briefcase size={16} /> },
    ],

    KAUR_TU: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { group: 'TU & Umum' },
        {
            title: 'TU & Umum', icon: <FolderOpen size={16} />,
            subMenus: [
                { title: 'Buku Surat', path: '/dashboard/buku-surat' },
                { title: 'Inventaris & Aset', path: '/dashboard/inventaris-aset' },
            ]
        },
    ],

    KASI_KESEJAHTERAAN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { group: 'Kesejahteraan' },
        {
            title: 'Kesejahteraan Sosial', icon: <HeartPulse size={16} />,
            subMenus: [
                { title: 'Proyek Fisik', path: '/dashboard/kesejahteraan' },
                { title: 'Bansos', path: '/dashboard/bansos' },
            ]
        },
    ],

    KASI_PELAYANAN: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { group: 'Pelayanan' },
        {
            title: 'Pelayanan Umum', icon: <FileText size={16} />,
            subMenus: [
                { title: 'Pengantar RT/RW', path: '/dashboard/pelayanan' },
                { title: 'E-KMS Posyandu', path: '/dashboard/e-kms' },
            ]
        },
    ],

    KADUS: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'Data Warga Dusun', path: '/dashboard/data-dusun-1', icon: <MapPin size={16} /> },
        { title: 'Laporan Dusun', path: '/dashboard/laporan-dusun-1', icon: <Activity size={16} /> },
    ],

    POSYANDU: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { title: 'E-KMS', path: '/dashboard/e-kms', icon: <HeartPulse size={16} /> },
        { title: 'Deteksi Stunting', path: '/dashboard/stunting', icon: <Activity size={16} /> },
    ],

    LPM: [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
        { group: 'Manajemen LPM' },
        {
            title: 'Manajemen Pembangunan', icon: <Construction size={16} />,
            subMenus: [
                { title: 'Usulan Musrenbang', path: '/dashboard/usulan-pembangunan' },
                { title: 'Pantau Proyek Desa', path: '/dashboard/pantau-proyek' },
            ]
        },
        {
            title: 'Keuangan & Swadaya', icon: <Wallet size={16} />,
            subMenus: [
                { title: 'Dana Desa & Bantuan', path: '/dashboard/lpm/keuangan' },
                { title: 'Swadaya Masyarakat', path: '/dashboard/lpm/swadaya' },
            ]
        },
        {
            title: 'Sarana & Inventaris', icon: <FolderOpen size={16} />,
            subMenus: [
                { title: 'Daftar Aset Hasil', path: '/dashboard/lpm/inventaris' },
                { title: 'Peminjaman Alat', path: '/dashboard/lpm/peminjaman' },
            ]
        },
        {
            title: 'Kader & Relawan', icon: <Users size={16} />,
            subMenus: [
                { title: 'Database Anggota', path: '/dashboard/lpm/kader' },
                { title: 'Kerja Bakti & Presensi', path: '/dashboard/gotong-royong' },
            ]
        },
        {
            title: 'Layanan & Laporan', icon: <ClipboardList size={16} />,
            subMenus: [
                { title: 'Aspirasi / Saran', path: '/dashboard/aspirasi-warga' },
                { title: 'Program Pembinaan', path: '/dashboard/program-pembinaan' },
                { title: 'Buku Kegiatan LPM', path: '/dashboard/kegiatan-lpm' },
                { title: 'E-Reporting', path: '/dashboard/lpm/laporan' },
                { title: 'Galeri Proyek', path: '/dashboard/lpm/galeri' },
            ]
        },
        {
            title: 'Pengaturan', icon: <Settings size={16} />,
            subMenus: [
                { title: 'Data Pengurus', path: '/dashboard/pengurus-lpm' },
                { title: 'Profil Saya', path: '/dashboard/profil-saya' },
            ]
        },
    ],
};

/* ─── SIDEBAR COMPONENT ─────────────────────────────────────────────────────── */
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { role } = useRole();
    const [openDropdown, setOpenDropdown] = useState(null);
    const location = useLocation();

    // Auto-open dropdown that contains active route
    useEffect(() => {
        const menus = menuConfig[role] || [];
        for (const item of menus) {
            if (item.subMenus?.some(s => location.pathname === s.path)) {
                setOpenDropdown(item.title);
                break;
            }
        }
    }, [location.pathname, role]);

    if (!user) return null;

    const menus = menuConfig[role] || [
        { group: 'Umum' },
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home size={16} /> },
    ];

    const toggle = (title) => setOpenDropdown(prev => prev === title ? null : title);

    return (
        <aside
            className={`absolute md:relative top-0 left-0 z-40 h-full w-[268px] flex flex-col
                bg-[rgba(8,14,30,0.72)] backdrop-blur-[28px] border-r border-white/[0.07]
                shadow-[4px_0_40px_rgba(0,0,0,0.4)] overflow-hidden
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${!isSidebarOpen ? 'translate-x-[-100%] opacity-0 pointer-events-none md:translate-x-0 md:w-0 md:border-none md:opacity-0 md:pointer-events-none' : ''}`}
        >
            {/* ── Brand Header ────────────────────────────────────── */}
            <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between shrink-0
                            bg-gradient-to-b from-amber-500/[0.04] to-transparent">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600
                                    flex items-center justify-center shrink-0
                                    shadow-[0_0_20px_rgba(245,158,11,0.35),0_4px_12px_rgba(0,0,0,0.3)]
                                    text-lg">
                        🏛️
                    </div>
                    <div>
                        <div className="text-[15px] font-extrabold text-white tracking-tight leading-tight">
                            CIMANGGU I
                        </div>
                        <div className="text-[10px] text-white/35 mt-0.5 font-medium">
                            Sistem Pemerintahan Desa
                        </div>
                        <div className="inline-flex items-center gap-[5px] mt-2
                                        bg-amber-500/10 border border-amber-500/[0.22] rounded-full
                                        px-2.5 py-[3px] text-[9.5px] font-bold tracking-[0.06em] uppercase text-amber-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-[pulse-dot_1.8s_infinite]" />
                            {user?.role || 'Admin'}
                        </div>
                    </div>
                </div>
                {/* Close button (mobile) */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden flex items-center justify-center p-1.5 rounded-lg
                               bg-white/[0.05] border border-white/[0.08]
                               text-white/40 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-200"
                    aria-label="Tutup sidebar"
                >
                    <X size={16} />
                </button>
            </div>

            {/* ── Navigation ──────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1.5 pb-4 custom-scrollbar"
                 aria-label="Navigasi Utama">
                {menus.map((item, idx) => {
                    if (item.group !== undefined) {
                        return <GroupLabel key={`g-${idx}`} label={item.group} />;
                    }
                    if (item.subMenus) {
                        return (
                            <DropdownItem
                                key={item.title}
                                item={item}
                                isOpen={openDropdown === item.title}
                                onToggle={() => toggle(item.title)}
                            />
                        );
                    }
                    return <DirectLink key={item.title} item={item} />;
                })}
            </nav>

            {/* ── Footer / Logout ─────────────────────────────────── */}
            <div className="px-4 py-3.5 border-t border-white/[0.06] shrink-0 bg-black/15">
                <button
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl
                               border border-red-500/20 bg-red-500/[0.06]
                               text-red-500/75 text-[13px] font-semibold cursor-pointer
                               hover:bg-red-500/[0.14] hover:text-red-400 hover:border-red-500/[0.35]
                               hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]
                               transition-all duration-200"
                    onClick={logoutUser}
                    id="sidebar-logout-btn"
                >
                    <LogOut size={15} />
                    <span>Keluar Sistem</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
