import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Home, RefreshCw } from 'lucide-react';
import axios from 'axios';

const heroImages = [
    '/images/slide_1.png',
    '/images/slide_6.png',
    '/images/slide_4.png',
    '/images/slide_5.png'
];

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [captcha, setCaptcha] = useState({ question: '', token: '' });
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchCaptcha = async () => {
        try {
            const res = await axios.get('/users/api/captcha');
            setCaptcha({
                question: res.data.question,
                token: res.data.captcha_token
            });
        } catch (err) {
            console.error("Gagal mengambil captcha", err);
        }
    };

    useEffect(() => {
        fetchCaptcha();
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await loginUser(username, password, captcha.token, captchaAnswer);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal login, silakan periksa kembali data Anda.";
            setError(msg);
            fetchCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans overflow-x-hidden p-4 py-12 md:py-0">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0 bg-black">
                {heroImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div
                            className={`w-full h-full bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                            style={{ backgroundImage: `url('${src}')` }}
                        ></div>
                    </div>
                ))}
                {/* Overlay Gelap Gradasi */}
                <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#0b1120]/80 via-[#0b1120]/50 to-transparent backdrop-blur-[2px]"></div>
            </div>

            {/* Back to Home Button - Posisinya disesuaikan agar tidak tabrakan */}
            <Link to="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-lg group">
                <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Kembali ke Beranda</span>
            </Link>

            {/* Login Form Container */}
            <div className="relative z-30 w-full max-w-sm mx-auto animate-fade-in-up md:perspective-1000 mt-8 sm:mt-0">
                {/* Floating Card */}
                <div className="p-7 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden group">

                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl z-0 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 p-2 shadow-lg border border-white/20 mb-4 backdrop-blur-md">
                                <img src="/images/logo-bogor.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-sm tracking-tight uppercase">
                                DESA CIMANGGU I
                            </h2>
                            <p className="text-slate-200 font-medium text-[11px] md:text-xs mt-2 opacity-80 uppercase tracking-widest">Sistem Digitalisasi Desa (SDD)</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm text-center shadow-lg animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-200 ml-1">Username</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                        <User className="h-5 w-5 text-slate-300 group-focus-within/input:text-yellow-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl text-white placeholder-slate-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all shadow-inner backdrop-blur-sm"
                                        placeholder="Masukkan username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-200 ml-1">Password</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                        <Lock className="h-5 w-5 text-slate-300 group-focus-within/input:text-yellow-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl text-white placeholder-slate-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all shadow-inner backdrop-blur-sm"
                                        placeholder="Masukkan password"
                                    />
                                </div>
                            </div>

                            {/* CAPTCHA SECTION */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 group/captcha transition-all hover:bg-white/10">
                                <div className="flex-1 text-left">
                                    <p className="text-[9px] uppercase tracking-widest text-yellow-400 font-bold mb-1 opacity-70">Kode CAPTCHA</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-black text-white italic tracking-[0.1em] select-none bg-white/5 px-2 py-1 rounded">
                                            {captcha.question || "---"}
                                        </span>
                                        <button type="button" onClick={fetchCaptcha} className="p-1 text-slate-400 hover:text-white transition-all">
                                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                </div>
                                <div className="w-28 text-right">
                                    <input 
                                        type="text" required value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="w-full px-2 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-yellow-400/50 text-center font-bold text-sm tracking-widest uppercase outline-none" 
                                        placeholder="KODE" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-slate-900 font-extrabold text-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 mt-8 ${isLoading
                                    ? 'bg-yellow-600/50 cursor-not-allowed scale-95'
                                    : 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-[length:200%_auto] hover:bg-right'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2 uppercase tracking-widest text-sm">
                                        <RefreshCw size={20} className="animate-spin" />
                                        Memproses...
                                    </span>
                                ) : (
                                    <>
                                        <span>Masuk Aplikasi</span>
                                        <ArrowRight size={22} className="stroke-[3] group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-white/10 pt-6 pb-2">
                            <p className="text-slate-300 text-sm mb-4">
                                Belum punya akun? <Link to="/register" className="text-yellow-400 font-bold hover:underline">Daftar Sekarang</Link>
                            </p>
                            <p className="text-slate-400/50 text-[10px] tracking-wider uppercase">
                                &copy; {new Date().getFullYear()} Pemerintah Desa Cimanggu 1.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(40px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}} />
        </div>
    );
};

export default Login;
