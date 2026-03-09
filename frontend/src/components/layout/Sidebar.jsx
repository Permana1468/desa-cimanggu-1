import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
    Home, Settings, Users, FileText,
    Map as MapIcon, HeartPulse, Activity, LogOut, ChevronDown,
    FolderOpen, Briefcase, MapPin, Network, Hotel,
    Lightbulb, Hammer, ClipboardList, Construction
} from 'lucide-react';

const menuConfig = {
    ADMIN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Activity className="w-5 h-5" /> },

        // --- MANAJEMEN SISTEM ---
        {
            title: 'Pengaturan Website',
            icon: <Settings className="w-5 h-5" />,
            subMenus: [
                { title: 'Identitas & Profil', path: '/dashboard/landing-setting' },
                { title: 'Hero & Carousel', path: '/dashboard/hero-carousel' },
                { title: 'Kelola Berita', path: '/dashboard/berita' },
                { title: 'Struktur Organisasi', path: '/dashboard/organisasi' },
            ]
        },
        { title: 'Manajemen Pengguna', path: '/dashboard/users', icon: <Users className="w-5 h-5" /> },

        // --- AREA SEKRETARIAT (SEKDES & KAUR) ---
        {
            title: 'Sekretaris Desa',
            icon: <Briefcase className="w-5 h-5" />,
            subMenus: [
                { title: 'Rekap Kehadiran (Absensi)', path: '/dashboard/rekap-kehadiran' },
                { title: 'Evaluasi & Laporan Desa', path: '/dashboard/laporan-desa' },
            ]
        },
        {
            title: 'Kaur TU & Umum',
            icon: <FolderOpen className="w-5 h-5" />,
            subMenus: [
                { title: 'Buku Surat Masuk & Keluar', path: '/dashboard/buku-surat' },
                { title: 'Inventaris & Aset Desa', path: '/dashboard/inventaris-aset' },
            ]
        },
        {
            title: 'Kaur Keuangan',
            icon: <Briefcase className="w-5 h-5" />, // Or another relevant icon
            subMenus: [
                { title: 'Buku Kas Umum', path: '/dashboard/buku-kas' },
                { title: 'Realisasi Anggaran (SPP)', path: '/dashboard/realisasi-anggaran' },
            ]
        },
        {
            title: 'Kaur Perencanaan',
            icon: <Network className="w-5 h-5" />,
            subMenus: [
                { title: 'DED & RAB Proyek', path: '/dashboard/perencanaan' },
                { title: 'Dokumen RPJMDes & RKPDes', path: '/dashboard/rpjmdes' },
            ]
        },

        // --- AREA PELAKSANA TEKNIS (KASI) ---
        {
            title: 'Kasi Pemerintahan',
            icon: <Hotel className="w-5 h-5" />, // Placeholder, ensure imported
            subMenus: [
                { title: 'Data Kependudukan', path: '/dashboard/pemerintahan' },
                { title: 'Buku Mutasi Warga', path: '/dashboard/mutasi-warga' },
                { title: 'Buku Peraturan Desa', path: '/dashboard/peraturan-desa' },
            ]
        },
        {
            title: 'Kasi Kesejahteraan',
            icon: <Activity className="w-5 h-5" />,
            subMenus: [
                { title: 'Manajemen Proyek Fisik', path: '/dashboard/kesejahteraan' },
                { title: 'Penyaluran Sos', path: '/dashboard/bansos' },
            ]
        },
        {
            title: 'Kasi Pelayanan',
            icon: <FileText className="w-5 h-5" />,
            subMenus: [
                { title: 'Layanan Pengantar RT/RW', path: '/dashboard/pelayanan' },
                { title: 'E-KMS Posyandu', path: '/dashboard/e-kms' },
            ]
        },

        // --- AREA PELAKSANA KEWILAYAHAN (KADUS) ---
        {
            title: 'Kepala Dusun I',
            icon: <MapPin className="w-5 h-5" />,
            subMenus: [
                { title: 'Data Warga Dusun I', path: '/dashboard/data-dusun-1' },
                { title: 'Laporan Dusun I', path: '/dashboard/laporan-dusun-1' },
            ]
        },
        {
            title: 'Kepala Dusun II',
            icon: <MapPin className="w-5 h-5" />,
            subMenus: [
                { title: 'Data Warga Dusun II', path: '/dashboard/data-dusun-2' },
                { title: 'Laporan Dusun II', path: '/dashboard/laporan-dusun-2' },
            ]
        },
        {
            title: 'Kepala Dusun III',
            icon: <MapPin className="w-5 h-5" />,
            subMenus: [
                { title: 'Data Warga Dusun III', path: '/dashboard/data-dusun-3' },
                { title: 'Laporan Dusun III', path: '/dashboard/laporan-dusun-3' },
            ]
        },
        {
            title: 'Kepala Dusun IV',
            icon: <MapPin className="w-5 h-5" />,
            subMenus: [
                { title: 'Data Warga Dusun IV', path: '/dashboard/data-dusun-4' },
                { title: 'Laporan Dusun IV', path: '/dashboard/laporan-dusun-4' },
            ]
        },
    ],
    KAUR_PERENCANAAN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Activity className="w-5 h-5" /> },
        {
            title: 'Perencanaan Desa',
            icon: <Hammer className="w-5 h-5" />,
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
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'Peta Wilayah', path: '/dashboard/maps', icon: <MapIcon className="w-5 h-5" /> },
    ],
    KAUR_KEUANGAN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Activity className="w-5 h-5" /> },
        {
            title: 'Keuangan Desa',
            icon: <Briefcase className="w-5 h-5" />,
            subMenus: [
                { title: 'Buku Kas Umum', path: '/dashboard/buku-kas' },
                { title: 'Realisasi Anggaran (SPP)', path: '/dashboard/realisasi-anggaran' },
            ]
        },
    ],
    SEKDES: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'E-Absensi', path: '/dashboard/rekap-kehadiran', icon: <Activity className="w-5 h-5" /> },
        { title: 'Evaluasi & Laporan', path: '/dashboard/laporan-desa', icon: <Briefcase className="w-5 h-5" /> },
    ],
    KAUR_TU: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        {
            title: 'TU & Umum',
            icon: <FolderOpen className="w-5 h-5" />,
            subMenus: [
                { title: 'Buku Surat', path: '/dashboard/buku-surat' },
                { title: 'Inventaris & Aset', path: '/dashboard/inventaris-aset' },
            ]
        },
    ],
    KASI_KESEJAHTERAAN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        {
            title: 'Kesejahteraan Sos',
            icon: <Activity className="w-5 h-5" />,
            subMenus: [
                { title: 'Proyek Fisik', path: '/dashboard/kesejahteraan' },
                { title: 'Bansos', path: '/dashboard/bansos' },
            ]
        },
    ],
    KASI_PELAYANAN: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        {
            title: 'Pelayanan Umum',
            icon: <FileText className="w-5 h-5" />,
            subMenus: [
                { title: 'Pengantar RT/RW', path: '/dashboard/pelayanan' },
                { title: 'E-KMS Posyandu', path: '/dashboard/e-kms' },
            ]
        },
    ],
    KADUS: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'Data Warga Dusun', path: '/dashboard/data-dusun-1', icon: <MapPin className="w-5 h-5" /> },
        { title: 'Laporan Dusun', path: '/dashboard/laporan-dusun-1', icon: <Activity className="w-5 h-5" /> },
    ],
    POSYANDU: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        { title: 'E-KMS', path: '/dashboard/e-kms', icon: <HeartPulse className="w-5 h-5" /> },
        { title: 'Deteksi Stunting', path: '/dashboard/stunting', icon: <Activity className="w-5 h-5" /> },
    ],
    LPM: [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
        {
            title: 'Perencanaan (Musrenbang)',
            icon: <Lightbulb className="w-5 h-5" />,
            subMenus: [
                { title: 'Usulan Pembangunan', path: '/dashboard/usulan-pembangunan' },
                { title: 'Rekap Aspirasi Warga', path: '/dashboard/aspirasi-warga' },
            ]
        },
        {
            title: 'Pemberdayaan Warga',
            icon: <Users className="w-5 h-5" />,
            subMenus: [
                { title: 'Data Program Pembinaan', path: '/dashboard/program-pembinaan' },
                { title: 'Jadwal Gotong Royong', path: '/dashboard/gotong-royong' },
            ]
        },
        {
            title: 'Pengawasan Proyek',
            icon: <Construction className="w-5 h-5" />,
            subMenus: [
                { title: 'Pantau Proyek Desa', path: '/dashboard/pantau-proyek' },
            ]
        },
        {
            title: 'Administrasi Kelembagaan',
            icon: <ClipboardList className="w-5 h-5" />,
            subMenus: [
                { title: 'Buku Kegiatan LPM', path: '/dashboard/kegiatan-lpm' },
                { title: 'Data Pengurus LPM', path: '/dashboard/pengurus-lpm' },
            ]
        },
        {
            title: 'Pengaturan Akun',
            icon: <Settings className="w-5 h-5" />,
            subMenus: [
                { title: 'Profil Saya', path: '/dashboard/profil-saya' },
            ]
        },
    ]
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const [openDropdown, setOpenDropdown] = useState(null);

    if (!user) return null;

    // Fallback based on role (Case Insensitive)
    const roleKey = (user.role || '').toUpperCase();
    const menus = menuConfig[roleKey] || [
        { title: 'Dashboard Utama', path: '/dashboard', icon: <Home className="w-5 h-5" /> }
    ];

    return (
        <aside
            className={`absolute md:relative z-40 h-full w-72 bg-[#0b1120]/60 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-none md:overflow-hidden md:opacity-0'
                }`}
        >
            <div className="p-6 border-b border-white/10 flex justify-between items-center whitespace-nowrap">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wide mb-1">CIMANGGU I</h1>
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-semibold text-yellow-400 uppercase">
                        {user.role}
                    </div>
                </div>
                {/* Tombol Tutup Sidebar (Mobile) */}
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                    ✕
                </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                {menus.map((item, index) => {
                    if (item.subMenus) {
                        const isOpen = openDropdown === item.title;
                        return (
                            <div key={index} className="flex flex-col">
                                <button
                                    onClick={() => setOpenDropdown(isOpen ? null : item.title)}
                                    className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-all duration-200 whitespace-nowrap text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-500' : ''}`} />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="flex flex-col py-1 mt-1 space-y-1 border-l-[3px] border-white/5 mx-6">
                                        {item.subMenus.map((subItem, subIndex) => (
                                            <NavLink
                                                key={subIndex}
                                                to={subItem.path}
                                                className={({ isActive }) =>
                                                    `w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 whitespace-nowrap ${isActive
                                                        ? 'text-yellow-400 font-semibold bg-white/5'
                                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                    }`
                                                }
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                                <span>{subItem.title}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={index}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-6 py-3.5 text-sm transition-all duration-200 whitespace-nowrap ${isActive
                                    ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500 text-yellow-400 font-semibold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 whitespace-nowrap">
                <button
                    onClick={logoutUser}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-medium text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar Sistem</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
