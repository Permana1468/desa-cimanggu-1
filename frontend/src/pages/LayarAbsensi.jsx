import React, { useState, useEffect, useRef } from 'react';
import { Scan, ScanFace, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const LayarAbsensi = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'failed'
    const [lastMessage, setLastMessage] = useState('');
    const [scannedPejabat, setScannedPejabat] = useState('');

    // Background Carousel States
    const [heroImages, setHeroImages] = useState(['/images/slide_1.png']); // Fallback Default
    const [currentSlide, setCurrentSlide] = useState(0);

    // Barcode Scanner Buffer
    const barcodeBuffer = useRef('');
    const scanTimeout = useRef(null);

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
    }, [API_URL]);

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
    // Barcode scanner pada dasarnya berperilaku seperti keyboard super cepat yang diakhiri tombol 'Enter'
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Abaikan input jika user sedang fokus ke input manual (walaupun di halaman ini tidak ada input)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'Enter') {
                e.preventDefault();
                if (barcodeBuffer.current.length > 0) {
                    const scannedId = barcodeBuffer.current;
                    verifyAttendance(scannedId);
                    barcodeBuffer.current = ''; // Reset buffer setelah enter
                }
            } else if (e.key.length === 1) {
                // Hanya tangkap karakter alphanumeric dan simbol 
                barcodeBuffer.current += e.key;

                // Animasi status sedang discan
                if (scanStatus !== 'scanning') {
                    setScanStatus('scanning');
                    setLastMessage('Membaca ID...');
                }

                // Barcode scanner sangat cepat, jika ada jeda > 100ms kemungkinan itu ketikan manual (opsional untuk diatasi)
                clearTimeout(scanTimeout.current);
                scanTimeout.current = setTimeout(() => {
                    // Jika lebih dari 100ms tidak ada Enter, mungkin ada error baca atau user ngetik manual pelan-pelan
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
    }, [scanStatus]);

    const verifyAttendance = async (idUnik) => {
        try {
            // Panggil API Backend
            const response = await axios.post('/users/api/absensi/scan/', {
                id_unik: idUnik
            });

            const { status, message, pejabat } = response.data;

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
    };

    // Format waktu
    const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-[#0b1120] overflow-hidden">
                {heroImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-40 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div
                            className={`w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
                            style={{ backgroundImage: `url('${src}')`, willChange: 'transform' }}
                        ></div>
                    </div>
                ))}

                {/* Overlay Gelap & Elemen Blur */}
                <div className="absolute inset-0 z-20 bg-[#0b1120]/60"></div>
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/20 rounded-full blur-[120px]"></div>
                </div>
            </div>

            <div className="z-30 bg-[#1e293b]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 w-full max-w-3xl flex flex-col items-center shadow-2xl text-center relative">

                {/* Header Instansi */}
                <div className="mb-10 flex flex-col items-center">
                    <img src="/laragon/www/desa_cimanggu_1/frontend/public/logo.png" alt="Logo Desa" className="w-20 h-20 object-contain mb-4 drop-shadow-lg opacity-80" onError={(e) => e.target.style.display = 'none'} />
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-wider uppercase mb-1">
                        Sistem Presensi Digital
                    </h1>
                    <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Pemdes Cimanggu I</p>
                </div>

                {/* Jam Besar */}
                <div className="mb-12">
                    <div className="text-7xl md:text-8xl font-black text-white tracking-widest mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {timeString.replace(/\./g, ':')}
                    </div>
                    <div className="text-xl md:text-2xl text-yellow-500/80 font-medium">
                        {dateString}
                    </div>
                </div>

                {/* Status Scanner Area */}
                <div className={`w-full p-8 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center min-h-[160px]
                    ${scanStatus === 'idle' ? 'bg-white/5 border-white/10' : ''}
                    ${scanStatus === 'scanning' ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}
                    ${scanStatus === 'success' ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : ''}
                    ${scanStatus === 'failed' ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}
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

                <div className="absolute bottom-6 text-gray-600 text-xs font-medium tracking-wider w-full text-center">
                    Gunakan Scanner Fisik · Tekan F11 untuk Layar Penuh (Fullscreen)
                </div>
            </div>
        </div>
    );
};

export default LayarAbsensi;
