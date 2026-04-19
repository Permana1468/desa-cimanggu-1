import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar, { menuConfig } from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Home, Settings, X, User, Bell, ChevronRight, LayoutGrid, LogOut } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Layout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Sidebar States
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu state (Closed by default)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop narrow state
    
    // Background States
    const [bgImages, setBgImages] = useState(['/bg-cimanggu.jpg']);
    const [currentBg, setCurrentBg] = useState(0);

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    if (!user) return null;

    const role = user.role || 'ADMIN';
    const isStaffRole = ['KAUR_PERENCANAAN', 'KAUR_TU', 'KAUR_KEUANGAN', 'KASI_PEMERINTAHAN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN'].includes(role);
    const menus = menuConfig[role] || (isStaffRole ? menuConfig.STAF : menuConfig.ADMIN);

    return (
        <div className="relative flex h-screen overflow-hidden font-[Inter,system-ui,sans-serif] bg-dark-base transition-colors duration-500">

            {/* ── Background Layers ────────────────────────────── */}
            {bgImages.map((src, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center blur-[8px] scale-[1.04] z-0 transition-opacity duration-[2000ms] ease-in-out"
                    style={{
                        backgroundImage: `url('${src}')`,
                        opacity: (i === currentBg) ? (theme === 'dark' ? 1 : 0.65) : 0,
                    }}
                />
            ))}
            
            {/* Theme-aware overlay */}
            <div className={`absolute inset-0 z-[1] pointer-events-none transition-all duration-700
                            ${theme === 'dark' 
                                ? 'bg-gradient-to-br from-[rgba(6,10,24,0.96)] via-[rgba(8,14,35,0.92)] to-[rgba(6,10,24,0.95)]' 
                                : 'bg-gradient-to-br from-[rgba(248,250,252,0.88)] via-[rgba(241,245,249,0.84)] to-[rgba(248,250,252,0.9)]'}`} 
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-grid-pattern opacity-[0.03] transition-opacity" />

            {/* ── Mobile UI Elements ────────────────────────────── */}
            
            {/* 1. Mobile Bottom Navigation Bar (App Style) */}
            <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-white/5 h-20 px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 active:scale-95 transition-all"
                >
                    <Menu size={24} />
                    <span className="text-[10px] font-bold">Menu</span>
                </button>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className={`flex flex-col items-center justify-center w-14 h-14 -mt-10 rounded-full shadow-lg transition-all active:scale-90
                                ${location.pathname === '/dashboard' ? 'bg-[#10b981] text-white shadow-[#10b981]/40' : 'bg-[#10b981] text-white shadow-[#10b981]/40'}`}
                >
                    <LayoutGrid size={28} />
                    <div className="absolute -bottom-6 text-[10px] font-bold text-gray-600 dark:text-gray-300">Dashboard</div>
                </button>

                <button 
                    onClick={() => navigate('/dashboard/settings')}
                    className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 active:scale-95 transition-all"
                >
                    <Settings size={24} />
                    <span className="text-[10px] font-bold">Pengaturan</span>
                </button>
            </nav>

            {/* 2. Mobile Menu Sheet (Bottom Sheet) */}
            <div 
                className={`fixed inset-0 z-[1000] md:hidden transition-all duration-500 flex flex-col justify-end
                           ${isSidebarOpen ? 'visible' : 'invisible pointer-events-none'}`}
            >
                {/* Backdrop overlay */}
                <div 
                    className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500
                               ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsSidebarOpen(false)}
                />
                
                {/* Rolling Content Panel */}
                <div 
                    className={`relative w-full max-h-[85vh] bg-white dark:bg-[#1e293b] rounded-t-[2.5rem] flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                               ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full shadow-none'}`}
                >
                    {/* Drag handle */}
                    <div className="w-12 h-1 bg-gray-300 dark:bg-white/10 rounded-full mx-auto mt-4 shrink-0" />

                    {/* Header: Profile Info */}
                    <div className="p-8 pb-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-black shadow-lg overflow-hidden shrink-0 border-2 border-white dark:border-white/5">
                            {user?.foto_profil ? (
                                <img src={user.foto_profil} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span>{user?.nama_lengkap?.[0] || user?.username?.[0]}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate leading-tight">Admin Desa Cimanggu I</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">desa.cimanggu-i.cibungbulang@dpmd.bogorkab.go.id</p>
                            <span className="inline-block px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black rounded-lg mt-2 uppercase tracking-wide">
                                Desa Cimanggu I
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-white/5 mx-8" />

                    {/* Body: Grid Menu Items */}
                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-3 custom-scrollbar h-full">
                        {menus.map((item, idx) => {
                             // Color variations based on title or index to match screenshot vibrancy
                             const bgColors = [
                                'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 
                                'bg-purple-500', 'bg-teal-500', 'bg-rose-500', 
                                'bg-indigo-500', 'bg-[#475569]'
                             ];
                             const bgColor = bgColors[idx % bgColors.length];

                             return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (item.path) navigate(item.path);
                                        else if (item.subMenus?.[0]?.path) navigate(item.subMenus[0].path);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`flex items-center gap-5 p-3 rounded-2xl transition-all active:scale-95 group
                                               ${location.pathname === item.path ? 'bg-[#10b981]/5 border border-[#10b981]/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${bgColor} shrink-0`}>
                                        {React.cloneElement(item.icon, { size: 24, strokeWidth: 2 })}
                                    </div>
                                    <span className={`text-[15px] font-bold ${location.pathname === item.path ? 'text-[#10b981]' : 'text-gray-700 dark:text-white/80'}`}>
                                        {item.title}
                                    </span>
                                </button>
                             );
                        })}
                    </div>

                    {/* Footer: Tutup Button */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e293b] shrink-0">
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full py-4 text-[16px] font-bold text-gray-500 dark:text-gray-400 active:text-[#10b981] transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────── */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* ── Main Content Area ─────────────────────────── */}
            <main className={`flex-1 flex flex-col relative z-10 min-w-0 h-screen overflow-hidden transition-all duration-500`}>
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent h-full">
                    {/* Inner wrapper for padding/spacing - Adjusted for bottom nav on mobile */}
                    <div className="min-h-full p-2 pb-28 md:p-6 lg:p-8">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
