import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Map as MapIcon, HeartPulse, Activity, ShieldCheck, Users, Search, ChevronLeft, ChevronRight, Calendar, Loader, Download, Clock } from 'lucide-react';
import api from '../services/api';
import ScrollReveal from '../components/ScrollReveal';

const LandingPage = () => {
    const [siteData, setSiteData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroImages, setHeroImages] = useState(['/images/slide_1.png']); // Fallback Default

    const [isScrolled, setIsScrolled] = useState(false);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [orgData, setOrgData] = useState({
        kades: { name: 'Hernawan M. Sodik', role: 'Kepala Desa' },
        sekdes: { name: 'Fajar Tri Apriana', role: 'Sekretaris Desa' },
        staff: [
            { name: 'Angga Harjadipura', role: 'Kasi Pemerintahan' },
            { name: 'Muhamad Aldiansyah', role: 'Kasi Kesejahteraan' },
            { name: 'Nurjanah', role: 'Kasi Pelayanan' },
            { name: 'Enjen Nurdin', role: 'Kaur Keuangan' },
            { name: 'Iyan Suryani', role: 'Kaur TU & Umum' },
            { name: 'Abdul Aziz', role: 'Kaur Perencanaan' },
        ],
        kadus: [
            { name: 'Suhendri', role: 'Kadus I' },
            { name: 'Hasanudin', role: 'Kadus II' },
            { name: 'Engkus Kusmana', role: 'Kadus III' },
            { name: 'Rudi', role: 'Kadus IV' },
        ]
    });

    const [aspirationForm, setAspirationForm] = useState({
        nama_warga: '',
        rt_rw: '',
        kategori: 'Infrastruktur',
        wilayah_tujuan: '001',
        isi_pesan: ''
    });
    const [isSubmittingAspiration, setIsSubmittingAspiration] = useState(false);
    const [gotongRoyongData, setGotongRoyongData] = useState([]);

    const handleAspirationChange = (e) => {
        const { name, value } = e.target;
        setAspirationForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAspirationSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmittingAspiration(true);
            await api.post('/users/api/aspirasi/kirim/', aspirationForm);
            alert('✅ Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasi Anda.');
            setAspirationForm({
                nama_warga: '',
                rt_rw: '',
                kategori: 'Infrastruktur',
                wilayah_tujuan: '001',
                isi_pesan: ''
            });
        } catch (error) {
            console.error("Gagal mengirim aspirasi:", error);
            alert('❌ Gagal mengirim aspirasi. Silakan lengkapi formulir dan coba lagi.');
        } finally {
            setIsSubmittingAspiration(false);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch Settings
                const resSettings = await api.get('/users/api/landing-page/');
                if (resSettings.data && resSettings.data.length > 0) {
                    const data = resSettings.data[0];
                    setSiteData(data);
                    const fetchedImages = [data.carousel_image_1, data.carousel_image_2, data.carousel_image_3].filter(img => img);
                    if (fetchedImages.length > 0) {
                        setHeroImages(fetchedImages);
                    }
                }

                // Fetch Berita
                const resBerita = await api.get('/users/api/berita/');
                if (resBerita.data) {
                    const mappedNews = resBerita.data.map(item => ({
                        id: item.id,
                        title: item.judul,
                        date: new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        image: item.gambar_cover || "https://images.unsplash.com/photo-1593113544338-9cb52bce56bc?q=80&w=800&auto=format&fit=crop"
                    }));
                    setNewsData(mappedNews);
                }

                // Fetch Pejabat
                const resPejabat = await api.get('/users/api/pejabat-desa/');
                if (resPejabat.data) {
                    const p = resPejabat.data;
                    const mapPejabat = (obj) => ({ name: obj.nama, role: obj.jabatan, foto: obj.foto });

                    const kadesData = p.find(x => x.level === 1);
                    const sekdesData = p.find(x => x.level === 2);

                    setOrgData({
                        kades: kadesData ? mapPejabat(kadesData) : { name: "Belum Diisi", role: "Kepala Desa" },
                        sekdes: sekdesData ? mapPejabat(sekdesData) : { name: "Belum Diisi", role: "Sekretaris Desa" },
                        staff: p.filter(x => x.level === 3).map(mapPejabat),
                        kadus: p.filter(x => x.level === 4).map(mapPejabat)
                    });
                }

                // Fetch Gotong Royong Publik
                const resGR = await api.get('/users/api/gotong-royong/publik/');
                if (resGR.data) {
                    setGotongRoyongData(resGR.data);
                }
            } catch (error) {
                console.error("Gagal mendapatkan data Landing Page:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // Navbar Animation States
    const [pillStyle, setPillStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
    const [activeIndex, setActiveIndex] = React.useState(0);
    const itemRefs = React.useRef([]);

    // Set initial position of the sliding pill
    React.useEffect(() => {
        const activeEl = itemRefs.current[activeIndex];
        if (activeEl) {
            setPillStyle({
                left: activeEl.offsetLeft,
                width: activeEl.offsetWidth,
                opacity: 1
            });
        }
    }, [activeIndex]);

    const handleMouseEnter = (index) => {
        const el = itemRefs.current[index];
        if (el) {
            setPillStyle({
                left: el.offsetLeft,
                width: el.offsetWidth,
                opacity: 1
            });
        }
    };

    const handleMouseLeave = () => {
        const activeEl = itemRefs.current[activeIndex];
        if (activeEl) {
            setPillStyle({
                left: activeEl.offsetLeft,
                width: activeEl.offsetWidth,
                opacity: 1
            });
        }
    };

    const navMenuItems = [
        { name: 'Beranda', id: 'beranda' },
        { name: 'Profil', id: 'profil' },
        { name: 'Wilayah', id: 'wilayah' },
        { name: 'Layanan', id: 'layanan' },
        { name: 'Peta', id: 'peta-interaktif' },
        { name: 'Berita', id: 'berita' },
        { name: 'Organisasi', id: 'organisasi' },
    ];
    // newsData and orgData are now state variables

    // Efek Auto-Slide setiap 8 detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
        }, 8000); // Diubah ke 8 detik

        return () => clearInterval(timer);
    }, [heroImages.length]);

    // Handle Navbar Scroll
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const nextNews = () => {
        setCurrentNewsIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
    };

    const prevNews = () => {
        setCurrentNewsIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
    };

    const OrgCard = ({ role, name, foto, isMain = false }) => (
        <div className={`group relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-500 ${isMain ? 'bg-gradient-to-b from-yellow-500/10 to-[#0f172a] border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'bg-[#1e293b]/60 border-white/10 backdrop-blur-md'} w-44 md:w-52 text-center z-10 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400/30 hover:bg-[#1e293b]/80`}>
            {/* Background Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 ${isMain ? 'bg-yellow-500/5 blur-xl' : 'bg-blue-500/5 blur-xl'}`}></div>

            {/* Light Sweep Animation */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-20"></div>

            <div className="relative z-10 flex flex-col items-center">
                {foto ? (
                    <img
                        src={foto}
                        alt={name}
                        loading="lazy"
                        className={`w-14 h-14 rounded-full mb-3 object-cover border-2 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${isMain ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-slate-700 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}
                    />
                ) : (
                    <div className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 shadow-inner ${isMain ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-blue-500/20 text-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'} `}>
                        👤
                    </div>
                )}
                <h4 className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1.5 transition-colors ${isMain ? 'text-yellow-400' : 'text-blue-400 group-hover:text-blue-300'}`}>
                    {role}
                </h4>
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                    {name}
                </h3>
            </div>
        </div>
    );

    // Render loading skeleton jika data sedang diambil
    if (isLoading) {
        return (
            <div className="bg-[#0b1120] min-h-screen text-white font-sans flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 flex justify-center items-center opacity-30">
                    <div className="w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px]"></div>
                    <div className="w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] absolute translate-x-32"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center animate-pulse">
                    <Loader size={48} className="text-yellow-400 mb-6 animate-spin" />
                    <div className="h-8 w-64 bg-slate-800 rounded-lg mb-4"></div>
                    <div className="h-4 w-48 bg-slate-800 rounded-lg mb-2"></div>
                    <div className="h-4 w-56 bg-slate-800 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b1120] min-h-screen text-white font-sans overflow-x-hidden relative">

            {/* --- NAVBAR --- */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f172a]/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
                } `}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

                    {/* === BAGIAN KIRI: Logo & Branding (Terpisah dari Kapsul Menu) === */}
                    <div className="flex items-center gap-3">
                        <img src={siteData?.logo || "/images/logo-bogor.png"} alt="Logo Desa" className="w-10 h-10 object-contain drop-shadow-md" />
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-bold text-[16px] tracking-wide leading-none mb-1 uppercase">
                                {siteData?.title || "DESA CIMANGGU I"}
                            </span>
                            <span className="text-yellow-400 font-semibold text-[11px] leading-none">
                                Kecamatan Cibungbulang
                            </span>
                        </div>
                    </div>

                    {/* === BAGIAN KANAN: Kapsul Menu Utama === */}
                    <nav
                        className="hidden md:flex relative items-center bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-xl"
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Elemen Kapsul Aktif yang Melayang (Sliding Pill) */}
                        <div
                            className="absolute top-1.5 bottom-1.5 bg-white/10 rounded-full transition-all duration-300 ease-out z-0"
                            style={{
                                left: `${pillStyle.left}px`,
                                width: `${pillStyle.width}px`,
                                opacity: pillStyle.opacity
                            }}
                        />

                        {/* Daftar Menu Teks */}
                        {navMenuItems.map((menu, idx) => (
                            <a
                                key={idx}
                                // Simpan elemen HTML ini ke dalam useRef untuk diukur lebarnya
                                ref={(el) => (itemRefs.current[idx] = el)}
                                href={`#${menu.id}`}
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onClick={() => setActiveIndex(idx)}
                                className={`relative z-10 px-5 py-2 text-[14px] font-medium transition-colors duration-300 ${activeIndex === idx
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                                    } `}
                            >
                                {menu.name}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="/absensi"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#0f172a]/80 border border-green-500/30 text-green-400 hover:bg-green-500/10 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            E-Absensi
                        </a>
                        <Link to="/login" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-full text-[13px] font-medium transition-all shadow-lg hover:shadow-blue-500/40">
                            Masuk
                        </Link>
                    </div>

                    {/* Tombol Hamburger Mobile */}
                    <button
                        className="md:hidden text-gray-300 hover:text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>

                </div>

                {/* === MOBILE MENU DROPDOWN === */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 py-4 shadow-xl' : 'max-h-0 py-0'} `}>
                    <nav className="flex flex-col px-6 gap-4">
                        {navMenuItems.map((menu, idx) => (
                            <a
                                key={idx}
                                href={`#${menu.id}`}
                                onClick={() => {
                                    setActiveIndex(idx);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`text-[15px] font-medium transition-colors ${activeIndex === idx ? 'text-yellow-400' : 'text-gray-300 hover:text-white'} `}
                            >
                                {menu.name}
                            </a>
                        ))}
                        <a
                            href="/absensi"
                            target="_blank" rel="noopener noreferrer"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex justify-center items-center gap-2 bg-[#0f172a]/80 border border-green-500/30 text-green-400 hover:bg-green-500/10 py-2.5 rounded-lg text-[13px] font-bold mt-4 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Layar E-Absensi
                        </a>
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 text-center py-2.5 rounded-lg font-bold mt-2 shadow-lg"
                        >
                            Masuk ke Sistem
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section id="beranda" className="relative h-screen flex flex-col justify-center px-6 md:px-24 lg:px-32 overflow-hidden">

                {/* === BACKGROUND ANIMASI KEN BURNS === */}
                <div className="absolute inset-0 z-0 bg-black overflow-hidden">
                    {heroImages.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                } `}
                        >
                            <div
                                className={`w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'
                                    } `}
                                style={{ backgroundImage: `url('${src}')`, willChange: 'transform' }}
                            ></div>
                        </div>
                    ))}
                    {/* Overlay Gelap Gradasi agar teks tetap terbaca */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/70 to-transparent"></div>
                </div>

                {/* === KONTEN TEKS HERO === */}
                <ScrollReveal delay={200} className="relative z-30 w-full max-w-2xl mt-12">
                    <div className="flex flex-col items-start">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-[11px] text-gray-300 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                            Sistem Digitalisasi Desa (SDD)
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                            {siteData?.hero_title || "Pemerintah Desa"}
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-black text-yellow-400 mb-6 leading-tight drop-shadow-lg uppercase">
                            {siteData?.title || "CIMANGGU I"}
                        </h1>

                        <p className="text-gray-300 text-sm md:text-base mb-10 leading-relaxed max-w-lg drop-shadow-md">
                            {siteData?.hero_subtitle || "Platform digital terpadu untuk mengelola, memonitor, dan menganalisis data pemberdayaan masyarakat."}
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <Link to="/login" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] flex items-center gap-2 text-sm">
                                Masuk ke Sistem <span>→</span>
                            </Link>
                            <a href="#peta-interaktif" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-sm font-semibold">
                                Jelajahi Peta Wilayah <span>→</span>
                            </a>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Overlay transisi (Shadow) agar menyatu dengan bagian bawah */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0b1120] to-transparent z-20 pointer-events-none"></div>

                {/* === INDIKATOR BAWAH === */}
                <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none z-30">
                    {/* Titik Indikator Dinamis & Scroll Center */}
                    <div className="flex flex-col items-center gap-3 pointer-events-auto">
                        <div className="flex gap-1.5">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                                        } `}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col items-center opacity-60 mt-2">
                            <span className="text-[9px] tracking-[0.2em] text-gray-300 uppercase font-bold mb-0.5">Scroll</span>
                            <span className="text-[10px] text-gray-300 animate-bounce">∨</span>
                        </div>
                    </div>
                </div>

                {/* Indikator Ping di Kanan Bawah */}
                <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-medium shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-gray-300">Bagus <span className="text-gray-500">16ms</span></span>
                    </div>
                </div>
            </section>

            {/* Main Content Sections */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">

                {/* 1. Profil Section */}
                <section id="profil" className="scroll-mt-32">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-3">Tentang Desa</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Profil {siteData?.title || "Cimanggu I"}</h2>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 items-center">
                            <div className="w-full lg:w-2/5 aspect-video lg:aspect-square bg-slate-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 relative group">
                                <img
                                    src={siteData?.about_image || "https://images.unsplash.com/photo-1590088925586-7a8df0bbee59?q=80&w=1200&auto=format&fit=crop"}
                                    alt="Kantor Desa"
                                    loading="lazy"
                                    className="object-cover w-full h-full opacity-80 group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent mix-blend-multiply"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h4 className="text-2xl font-bold text-white mb-1 shadow-black drop-shadow-lg">Kantor Kepala Desa</h4>
                                    <p className="text-slate-300 text-sm drop-shadow-md">Pusat Pelayanan Masyarakat</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-3/5 text-slate-300 space-y-8">
                                <h4 className="text-3xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    {siteData?.about_title || "Sekilas Pandang"}
                                </h4>
                                <p className="leading-relaxed text-lg font-light text-slate-400 whitespace-pre-wrap">
                                    {siteData?.about_text || "Desa Cimanggu I merupakan salah satu desa unggulan bagian dari program digitalisasi..."}
                                </p>
                                <Link to="/profil" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                                    Baca Selengkapnya <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                {/* 2. Wilayah Administratif Section (NEW) */}
                <section id="wilayah" className="scroll-mt-32">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">Statistik Demografi</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Wilayah Administratif</h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Card Kadus */}
                        <ScrollReveal delay={0}>
                            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-500/20 rounded-3xl p-8 text-center hover:border-blue-500/50 transition-colors group h-full flex flex-col justify-center">
                                <div className="mx-auto w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MapIcon className="text-blue-400" size={36} />
                                </div>
                                <h2 className="text-6xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">4</h2>
                                <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">Kepala Dusun</p>
                            </div>
                        </ScrollReveal>

                        {/* Card RW */}
                        <ScrollReveal delay={200}>
                            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-500/20 rounded-3xl p-8 text-center hover:border-purple-500/50 transition-colors group h-full flex flex-col justify-center">
                                <div className="mx-auto w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="text-purple-400" size={36} />
                                </div>
                                <h2 className="text-6xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">9</h2>
                                <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">Rukun Warga (RW)</p>
                            </div>
                        </ScrollReveal>

                        {/* Card RT */}
                        <ScrollReveal delay={400}>
                            <div className="bg-gradient-to-br from-green-900/40 to-slate-900/80 border border-green-500/20 rounded-3xl p-8 text-center hover:border-green-500/50 transition-colors group h-full flex flex-col justify-center">
                                <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <HeartPulse className="text-green-400" size={36} />
                                </div>
                                <h2 className="text-6xl font-black text-white mb-2 group-hover:text-green-400 transition-colors">32</h2>
                                <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">Rukun Tetangga (RT)</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 3. Layanan Section (Existing) */}
                <section id="layanan" className="scroll-mt-32">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-3">Sistem Informasi</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Layanan Digital Pemdes</h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <ScrollReveal delay={0}>
                            <div className="group bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center transform hover:-translate-y-3 hover:shadow-2xl h-full">
                                <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <MapIcon size={40} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Peta Wilayah Terpadu</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Visualisasi data geografis batas wilayah (RW/RT/Dusun) dan pemetaan lokasi keluarga serta insfrastruktur desa berbasis WebGIS.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="group bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center transform hover:-translate-y-3 hover:shadow-2xl h-full">
                                <div className="w-20 h-20 bg-yellow-500/20 text-yellow-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                    <HeartPulse size={40} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">E-KMS Posyandu</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Sistem pencatatan digital tumbuh kembang balita berbasis wilayah Posyandu Mawar 1 hingga 7 untuk deteksi dini masalah kesehatan.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={400}>
                            <div className="group bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-md border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center transform hover:-translate-y-3 hover:shadow-2xl h-full">
                                <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <FileText size={40} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">E-Tupoksi & RAB</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Modul khusus aparatur desa untuk manajemen Rencana Anggaran Biaya (RAB), DED, dan pendataan kemiskinan (UHC).
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 4. Peta Interaktif Section (NEW) */}
                <section id="peta-interaktif" className="scroll-mt-32">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-green-400 font-bold tracking-widest uppercase text-sm mb-3">Sistem Informasi Geografis</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Peta Interaktif Desa</h2>
                        </div>

                        <div className="bg-slate-800/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                            {/* Sidebar Peta */}
                            <div className="w-full md:w-1/3 bg-slate-900/80 p-6 border-r border-white/10 flex flex-col gap-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari wilayah/Dusun..."
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl cursor-pointer hover:bg-blue-500/30 transition-colors">
                                        <h5 className="text-blue-400 font-bold mb-1">Dusun 1</h5>
                                        <p className="text-slate-400 text-xs">Mencakup RW 01, RW 02. Pusat pemerintahan.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                        <h5 className="text-white font-bold mb-1">Dusun 2</h5>
                                        <p className="text-slate-400 text-xs">Mencakup RW 03, RW 04.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                        <h5 className="text-white font-bold mb-1">Dusun 3</h5>
                                        <p className="text-slate-400 text-xs">Mencakup RW 05, RW 06.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                                        <h5 className="text-white font-bold mb-1">Dusun 4</h5>
                                        <p className="text-slate-400 text-xs">Mencakup RW 07, RW 08, RW 09.</p>
                                    </div>
                                </div>

                                <Link to="/dashboard/maps" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-center transition-colors">
                                    Buka Peta Layar Penuh
                                </Link>
                            </div>

                            {/* Map View Placeholder */}
                            <div className="w-full md:w-2/3 bg-slate-800 relative group overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
                                    alt="Map Background"
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-transparent to-slate-900/50"></div>

                                {/* Dummy Markers */}
                                <div className="absolute top-1/3 left-1/3 flex flex-col items-center animate-bounce">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center text-white"><MapIcon size={16} /></div>
                                    <span className="mt-1 px-2 py-0.5 bg-slate-900/80 rounded text-[10px] text-white font-bold">Kantor Desa</span>
                                </div>
                                <div className="absolute top-1/2 right-1/4 flex flex-col items-center">
                                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                                    <span className="mt-1 px-2 py-0.5 bg-slate-900/80 rounded text-[10px] text-white">Posyandu 1</span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="px-6 py-4 bg-slate-900/80 backdrop-blur-sm border border-white/20 rounded-2xl flex flex-col items-center">
                                        <MapIcon size={48} className="text-slate-400 mb-3" />
                                        <p className="text-slate-300 font-medium">Map View Preview</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                {/* 5. Struktur Organisasi Section (OFFICIAL LAYOUT) */}
                <section id="organisasi" className="py-24 relative overflow-hidden bg-[#0b1120] scroll-mt-32">
                    {/* Background Glow Estetik */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

                    <ScrollReveal>
                        <div className="text-center mb-16 relative z-10">
                            <h3 className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-2">PEMERINTAHAN</h3>
                            <h2 className="text-3xl md:text-5xl font-bold text-white">Struktur Organisasi</h2>
                            <p className="text-gray-400 mt-3 text-sm">Susunan Pejabat Pemerintah {siteData?.title || 'Desa Cimanggu I'}</p>
                        </div>
                    </ScrollReveal>

                    {/* Wrapper overflow untuk HP agar bisa digeser horizontal jika terlalu lebar */}
                    <div className="w-full overflow-x-auto pb-12 hide-scrollbar relative z-10">
                        <div className="min-w-[1200px] flex flex-col items-center px-8">

                            {/* TINGKAT 1: KADES */}
                            <ScrollReveal delay={0}>
                                <div className="flex flex-col items-center">
                                    <OrgCard role={orgData.kades?.role} name={orgData.kades?.name} foto={orgData.kades?.foto} isMain={true} />
                                    <div className="w-px h-10 bg-white/20"></div> {/* Garis Vertikal Turun */}
                                </div>
                            </ScrollReveal>

                            {/* TINGKAT 2: SEKDES (Berada tepat di bawah Kades) */}
                            <ScrollReveal delay={100}>
                                <div className="flex flex-col items-center">
                                    <OrgCard role={orgData.sekdes?.role} name={orgData.sekdes?.name} foto={orgData.sekdes?.foto} />
                                    <div className="w-px h-10 bg-white/20"></div> {/* Garis Vertikal Turun */}
                                </div>
                            </ScrollReveal>

                            {/* TINGKAT 3: KAUR & KASI */}
                            <ScrollReveal delay={200}>
                                <div className="flex justify-center gap-6 relative">
                                    {orgData.staff?.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center relative">
                                            {/* LOGIKA GARIS HORIZONTAL PRESISI MATEMATIS */}
                                            <div className="absolute top-0 left-0 w-full flex h-px">
                                                <div className={`h-full w-1/2 ${index !== 0 ? 'bg-white/20' : ''}`}></div>
                                                <div className={`h-full w-1/2 ${index !== orgData.staff.length - 1 ? 'bg-white/20' : ''}`}></div>
                                            </div>
                                            <div className="w-px h-8 bg-white/20"></div> {/* Garis Vertikal ke Kartu */}

                                            <OrgCard role={item.role} name={item.name} foto={item.foto} />

                                            <div className="w-px h-12 bg-white/20"></div> {/* Garis Vertikal Lanjut ke Bawah */}
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>

                            {/* DIVIDER: KEPALA DUSUN */}
                            <ScrollReveal delay={300}>
                                <div className="w-full max-w-[1000px] flex items-center gap-4 my-2">
                                    <div className="flex-1 h-px bg-white/10 border-t border-dashed border-white/20"></div>
                                    <span className="text-gray-400 font-bold tracking-[0.2em] text-[10px] bg-[#0b1120] px-4">PELAKSANA KEWILAYAHAN</span>
                                    <div className="flex-1 h-px bg-white/10 border-t border-dashed border-white/20"></div>
                                </div>
                            </ScrollReveal>

                            {/* TINGKAT 4: KEPALA DUSUN */}
                            <ScrollReveal delay={400}>
                                <div className="flex justify-center gap-8 relative mt-6">
                                    {orgData.kadus?.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center relative">
                                            {/* Garis Horizontal Penghubung Kadus */}
                                            <div className="absolute top-0 left-0 w-full flex h-px">
                                                <div className={`h-full w-1/2 ${index !== 0 ? 'bg-white/20' : ''}`}></div>
                                                <div className={`h-full w-1/2 ${index !== orgData.kadus.length - 1 ? 'bg-white/20' : ''}`}></div>
                                            </div>
                                            <div className="w-px h-8 bg-white/20"></div> {/* Garis Vertikal Turun */}

                                            <OrgCard role={item.role} name={item.name} foto={item.foto} />
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* 6. Berita Section - Coverflow Carousel (NEW) */}
                <section id="berita" className="scroll-mt-32">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">Kabar Terkini</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Berita Desa</h2>
                        </div>

                        <div className="relative w-full overflow-hidden py-10 flex justify-center items-center h-[450px]">
                            {/* Navigation Buttons */}
                            <button onClick={prevNews} className="absolute left-4 md:left-12 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:-translate-x-1">
                                <ChevronLeft size={24} />
                            </button>

                            <div className="relative w-full max-w-4xl h-full flex justify-center items-center perspective-1000">
                                {newsData.map((news, idx) => {
                                    // Calculate position relative to current index
                                    let diff = idx - currentNewsIndex;
                                    if (diff < -2) diff += newsData.length;
                                    if (diff > 2) diff -= newsData.length;

                                    let zIndex = 20 - Math.abs(diff);
                                    let scale = diff === 0 ? 'scale-110' : 'scale-90 opacity-60';
                                    let translateX = diff * 40; // percentage
                                    let rotateY = diff * -15; // deg
                                    let isCenter = diff === 0;

                                    return (
                                        <div
                                            key={news.id}
                                            className={`absolute transition-all duration-500 ease-out cursor-pointer ${scale}`}
                                            style={{
                                                transform: `translateX(${translateX}%) rotateY(${rotateY}deg)`,
                                                zIndex: zIndex,
                                            }}
                                            onClick={() => setCurrentNewsIndex(idx)}
                                        >
                                            <div className={`w-64 md:w-80 h-96 rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border-2 ${isCenter ? 'border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.4)]' : 'border-white/10'} flex flex-col`}>
                                                <div className="h-48 overflow-hidden relative">
                                                    <img src={news.image} alt={news.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                                    {isCenter && (
                                                        <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full">
                                                            Terbaru
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex flex-col flex-grow justify-between">
                                                    <h4 className={`font-bold text-lg leading-snug line-clamp-3 ${isCenter ? 'text-white' : 'text-slate-300'}`}>
                                                        {news.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                                                        <Calendar size={14} />
                                                        <span>{news.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={nextNews} className="absolute right-4 md:right-12 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform hover:translate-x-1">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </ScrollReveal>
                </section>

                {/* 7. Informasi Publik Section (Existing) */}
                <section id="informasi" className="scroll-mt-32 pb-16">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h3 className="text-red-400 font-bold tracking-widest uppercase text-sm mb-3">Transparansi</h3>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Informasi Publik</h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ScrollReveal delay={0}>
                            <div className="group bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-10 flex items-start gap-6 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer h-full">
                                <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl group-hover:scale-110 group-hover:bg-red-500/30 transition-all duration-300">
                                    <Activity size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">Cakupan Stunting</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">Akses data stunting desa berdasarkan hasil pendataan Posyandu per Rukun Warga secara berkala dan transparan.</p>
                                    <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold group-hover:translate-x-2 transition-transform">
                                        Lihat Laporan Detail <ChevronRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="group bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-10 flex items-start gap-6 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer h-full">
                                <div className="p-4 bg-green-500/20 text-green-400 rounded-2xl group-hover:scale-110 group-hover:bg-green-500/30 transition-all duration-300">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Produk Hukum Desa</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">Dokumen Peraturan Desa (Perdes), Keputusan Kepala Desa, rancangan APBDES, dan legalitas desa lainnya.</p>
                                    <a href="#" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold group-hover:translate-x-2 transition-transform">
                                        Akses Arsip Dokumen <ChevronRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </div>

            {/* Section Jadwal Gotong Royong (PUBLIC) */}
            {gotongRoyongData.length > 0 && (
                <section id="gotong-royong" className="py-24 px-4 bg-slate-900/50 relative">
                    <div className="max-w-7xl mx-auto">
                        <ScrollReveal>
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                                <div>
                                    <h3 className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-3">Agenda Terdekat</h3>
                                    <h2 className="text-3xl md:text-5xl font-extrabold text-white">Jadwal Gotong Royong</h2>
                                </div>
                                <p className="text-slate-400 max-w-md text-sm md:text-base">Mari berpartisipasi dalam kegiatan kerja bakti untuk membangun Desa Cimanggu I yang lebih bersih dan nyaman.</p>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gotongRoyongData.map((item, idx) => (
                                <ScrollReveal key={item.id} delay={idx * 150}>
                                    <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-yellow-500/30 transition-all group relative overflow-hidden h-full flex flex-col">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl group-hover:bg-yellow-500/10 transition-colors pointer-events-none"></div>

                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-4 py-2 text-center min-w-[70px]">
                                                <span className="block text-2xl font-black text-yellow-500 uppercase leading-none">
                                                    {new Date(item.tanggal).getDate()}
                                                </span>
                                                <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                                                </span>
                                            </div>
                                            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                                                {item.status}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors line-clamp-2">{item.judul}</h3>

                                        <div className="space-y-4 mb-8 flex-1 text-sm">
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Clock className="text-blue-400" size={16} />
                                                <span>{item.waktu.substring(0, 5)} WIB - Selesai</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <MapIcon className="text-red-400" size={16} />
                                                <span className="line-clamp-1">{item.lokasi}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <Users className="text-green-400" size={16} />
                                                <span className="line-clamp-1">{item.peserta_target}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                                                    {item.koordinator.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Koordinator Lapangan</p>
                                                    <p className="text-sm font-bold text-slate-300">{item.koordinator}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Section Aspirasi Warga */}
            <section id="aspirasi" className="py-24 px-4 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Aspirasi & Keluhan Warga</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Suara Anda membangun desa. Sampaikan inspirasi, keluhan, atau saran pembangunan langsung kepada unit wilayah terkait.</p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={200}>
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                            <form onSubmit={handleAspirationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            name="nama_warga"
                                            required
                                            value={aspirationForm.nama_warga}
                                            onChange={handleAspirationChange}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Cth: Bpk. Jajang"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">RT / RW</label>
                                            <input
                                                type="text"
                                                name="rt_rw"
                                                required
                                                value={aspirationForm.rt_rw}
                                                onChange={handleAspirationChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="001 / 003"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Unit LPM Tujuan</label>
                                            <select
                                                name="wilayah_tujuan"
                                                value={aspirationForm.wilayah_tujuan}
                                                onChange={handleAspirationChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                            >
                                                <option value="001">RW 001 / Dusun I</option>
                                                <option value="002">RW 002 / Dusun II</option>
                                                <option value="003">RW 003 / Dusun III</option>
                                                <option value="004">RW 004 / Dusun IV</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Kategori Aspirasi</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Infrastruktur', 'Sosial', 'Keamanan', 'Layanan Publik'].map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setAspirationForm(prev => ({ ...prev, kategori: cat }))}
                                                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${aspirationForm.kategori === cat
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 flex flex-col">
                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Isi Pesan / Aspirasi</label>
                                        <textarea
                                            name="isi_pesan"
                                            required
                                            value={aspirationForm.isi_pesan}
                                            onChange={handleAspirationChange}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors flex-1 resize-none min-h-[160px]"
                                            placeholder="Sampaikan aspirasi atau keluhan Anda di sini secara detail..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingAspiration}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmittingAspiration ? (
                                            <Loader className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <span>Kirim Aspirasi Sekarang</span>
                                                < ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center italic">Aspirasi Anda akan diteruskan ke LPM unit wilayah terkait untuk diproses lebih lanjut.</p>
                                </div>
                            </form>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-slate-900 py-12 text-center px-4 relative z-20">
                <img
                    src="/images/logo-bogor.png"
                    alt="Logo Footer"
                    className="w-12 h-12 object-contain drop-shadow-md mx-auto mb-6"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ cursor: 'pointer' }}
                />
                <h3 className="text-xl font-bold text-white mb-2">Pemerintah {siteData?.title || 'Desa Cimanggu I'}</h3>
                <p className="text-slate-400 text-sm mb-8">{siteData?.description || 'Kecamatan Cibungbulang, Kabupaten Bogor'}</p>
                <div className="flex justify-center gap-6 mb-8 text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                    <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                    <a href="#" className="hover:text-white transition-colors">Kontak</a>
                </div>
                <p className="text-slate-500 text-xs text-center border-t border-slate-800 pt-8 mt-4 max-w-4xl mx-auto">
                    &copy; {new Date().getFullYear()} Pemerintah {siteData?.title || 'Desa Cimanggu I'}. <br />

                </p>
            </footer>

            {/* Global Custom CSS for specific Landing Page animations/utilities */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-1000 {
                    perspective: 1000px;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                html {
                    scroll-behavior: smooth;
                }
                `
            }} />
        </div>
    );
};

export default LandingPage;
