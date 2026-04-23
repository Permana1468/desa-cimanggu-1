import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scan, ScanFace, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const LayarAbsensi = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'failed'
    const [lastMessage, setLastMessage] = useState('');
    const [scannedPejabat, setScannedPejabat] = useState('');

    // Background Carousel States
    const [heroImages, setHeroImages] = useState(['/images/slide_1.webp']); // Fallback Default
    const [currentSlide, setCurrentSlide] = useState(0);

    // Barcode Scanner Buffer
    const barcodeBuffer = useRef('');
    const scanTimeout = useRef(null);

    const verifyAttendance = useCallback(async (idUnik) => {
        try {
            // Panggil API Backend
            const response = await axios.post('/users/api/absensi/scan/', {
                id_unik: idUnik
            });

            const { message, pejabat } = response.data;

            setScanStatus('success');
            setLastMessage(message);
            setScannedPejabat(pejabat);

            // Kembali ke layar siaga setelah 4 detik
            setTimeout(() => {
                setScanStatus('idle');
                setLastMessage('');
                setScannedPejabat('');
            }, 4000);

        } catch (error) {
            console.error("Gagal scan", error);
            setScanStatus('failed');
            setScannedPejabat('');
            if (error.response?.status === 404) {
                setLastMessage('ID Tidak Dikenali! Silakan coba lagi.');
            } else {
                setLastMessage('Terjadi kesalahan jaringan.');
            }

            // Kembali ke layar siaga
            setTimeout(() => {
                setScanStatus('idle');
                setLastMessage('');
            }, 4000);
        }
    }, []);

    // Fetch Carousel Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('/users/api/landing-page/');
                if (res.data && res.data.length > 0) {
                    const data = res.data[0];
                    const fetchedImages = [data.carousel_image_1, data.carousel_image_2, data.carousel_image_3].filter(img => img);
                    if (fetchedImages.length > 0) {
                        setHeroImages(fetchedImages);
                    }
                }
            } catch (error) {
                console.error("Gagal mendapatkan data Landing Page:", error);
            }
        };
        fetchSettings();
    }, []);

    // Slider Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    // Jam Digital
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Global Keydown Listener untuk Barcode Scanner
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'Enter') {
                e.preventDefault();
                if (barcodeBuffer.current.length > 0) {
                    const scannedId = barcodeBuffer.current;
                    verifyAttendance(scannedId);
                    barcodeBuffer.current = ''; 
                }
            } else if (e.key.length === 1) {
                barcodeBuffer.current += e.key;

                if (scanStatus !== 'scanning') {
                    setScanStatus('scanning');
                    setLastMessage('Membaca ID...');
                }

                clearTimeout(scanTimeout.current);
                scanTimeout.current = setTimeout(() => {
                    barcodeBuffer.current = '';
                    if (scanStatus === 'scanning') {
                        setScanStatus('idle');
                        setLastMessage('');
                    }
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(scanTimeout.current);
        };
    }, [scanStatus, verifyAttendance]);

    // Format waktu
    const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans text-center">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-[#0b1120] overflow-hidden">
                {heroImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-30 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div
                            className={`w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
                            style={{ backgroundImage: `url('${src}')`, willChange: 'transform' }}
                        ></div>
                    </div>
                ))}

                {/* Overlay Gelap & Elemen Blur */}
                <div className="absolute inset-0 z-20 bg-[#0b1120]/70"></div>
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/15 rounded-full blur-[120px]"></div>
                </div>
            </div>

            <div className="z-30 bg-[#1e293b]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-12 w-full max-w-[95%] sm:max-w-2xl md:max-w-4xl flex flex-col items-center shadow-2xl relative animate-fadeIn">

                {/* Header Instansi */}
                <div className="mb-8 md:mb-10 flex flex-col items-center">
                    <img src="/logo.png" alt="Logo Desa" className="w-14 h-14 md:w-20 md:h-20 object-contain mb-4 drop-shadow-2xl" onError={(e) => e.target.style.display = 'none'} />
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 tracking-wider uppercase mb-1 drop-shadow-sm">
                        Presensi Digital
                    </h1>
                    <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs md:text-sm opacity-80 flex items-center gap-2">
                        Pemdes Cimanggu I 
                        <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded opacity-30">V2-H</span>
                    </p>
                </div>

                {/* Jam Besar */}
                <div className="mb-10 md:mb-12">
                    <div className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-widest leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        {timeString.replace(/\./g, ':')}
                    </div>
                    <div className="text-base sm:text-xl md:text-2xl text-yellow-500/90 font-bold mt-4 tracking-wide">
                        {dateString}
                    </div>
                </div>

                {/* Status Scanner Area */}
                <div className={`w-full p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border transition-all duration-700 flex flex-col items-center justify-center min-h-[160px] md:min-h-[220px]
                    ${scanStatus === 'idle' ? 'bg-white/5 border-white/10 shadow-inner' : ''}
                    ${scanStatus === 'scanning' ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : ''}
                    ${scanStatus === 'success' ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.2)]' : ''}
                    ${scanStatus === 'failed' ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : ''}
                `}>

                    {scanStatus === 'idle' && (
                        <>
                            <Scan className="w-16 h-16 text-gray-400 mb-4 animate-pulse opacity-50" />
                            <h2 className="text-xl font-bold text-gray-300">SCANNER SIAP</h2>
                            <p className="text-gray-500 mt-2 text-sm">Silakan dekatkan QR Code atau Barcode ID Card ke arah kamera pemindai</p>
                        </>
                    )}

                    {scanStatus === 'scanning' && (
                        <>
                            <ScanFace className="w-16 h-16 text-blue-400 mb-4 animate-spin-slow" />
                            <h2 className="text-xl font-bold text-blue-400">{lastMessage}</h2>
                        </>
                    )}

                    {scanStatus === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                            <h2 className="text-2xl font-bold text-green-400 mb-1">{lastMessage}</h2>
                            {scannedPejabat && <p className="text-gray-300 font-medium">{scannedPejabat}</p>}
                        </>
                    )}

                    {scanStatus === 'failed' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                            <h2 className="text-2xl font-bold text-red-400">{lastMessage}</h2>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
};

export default LayarAbsensi;
