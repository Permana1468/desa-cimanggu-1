import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './layout/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Layout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bgImages, setBgImages] = useState(['/bg-cimanggu.jpg']); // Default fallback
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/users/api/landing-page/');
                if (response.data && response.data.length > 0) {
                    const settings = response.data[0];
                    const fetchedImages = [settings.carousel_image_1, settings.carousel_image_2, settings.carousel_image_3].filter(Boolean);
                    if (fetchedImages.length > 0) {
                        setBgImages(fetchedImages);
                    }
                }
            } catch (error) {
                console.error("Gagal memuat pengaturan landing page:", error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBg((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
        }, 8000); // Sinkronisasi dgn 8 detik per slide
        return () => clearInterval(timer);
    }, [bgImages.length]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="relative flex h-screen overflow-hidden font-sans bg-[#0b1120]">

            {/* LAPISAN BACKGROUND UTAMA (Dengan Blur dan Scale) */}
            {bgImages.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center filter blur-[8px] transition-opacity duration-[2000ms] ease-in-out z-0 ${index === currentBg ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                    style={{ backgroundImage: `url('${src}')`, willChange: 'transform, opacity' }}
                ></div>
            ))}

            {/* OVERLAY GELAP (Di Atas Background) */}
            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-0 pointer-events-none"></div>

            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* MAIN CONTENT Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full transition-all duration-300">
                <header className="h-20 bg-[#0f172a]/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h2 className="text-lg md:text-xl font-semibold text-white">Panel Administrasi</h2>
                    </div>

                    <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 md:px-4 py-2 rounded-full transition-all shadow-lg">
                        <div className="flex flex-col items-end mr-1">
                            <span className="hidden md:block text-[10px] font-bold text-yellow-500 uppercase tracking-tighter leading-none mb-0.5">{user?.role}</span>
                            <span className="hidden md:block text-sm font-medium text-gray-200 leading-none">{user?.username}</span>
                        </div>
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(234,179,8,0.5)] uppercase">
                                {user?.username?.charAt(0) || 'U'}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e293b] rounded-full animate-pulse"></span>
                        </div>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};

export default Layout;
