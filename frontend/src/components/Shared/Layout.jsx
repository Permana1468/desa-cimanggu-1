import React, { useContext, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import api from '../../services/api';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const location = useLocation();
    
    // Sidebar States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile overlay state
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

    return (
        <div className="relative flex h-screen overflow-hidden font-[Inter,system-ui,sans-serif] bg-dark-base transition-colors duration-500">

            {/* ── Background Layers ────────────────────────────── */}
            {bgImages.map((src, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center blur-[12px] scale-[1.06] z-0 transition-opacity duration-[2000ms] ease-in-out"
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

            {/* ── Mobile Burger Menu (Floating) ───────────────── */}
            <button
                className={`fixed top-6 left-6 z-[100] md:hidden w-11 h-11 flex items-center justify-center rounded-xl
                           bg-dark-overlay backdrop-blur-xl border border-white/10 text-white shadow-2xl
                           transition-all duration-300 hover:scale-110 active:scale-95
                           ${!isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu size={20} />
            </button>

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
                    {/* Inner wrapper for padding/spacing - Reduced to ensure edge-to-edge aesthetics */}
                    <div className="min-h-full p-2 md:p-6 lg:p-8">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
