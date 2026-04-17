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
        <div className="min-h-screen flex flex-col items-center justify-start md:justify-center relative font-sans overflow-x-hidden pt-6 md:pt-0">
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
                <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#0b1120]/95 via-[#0b1120]/70 to-[#0b1120]/40 backdrop-blur-[2px]"></div>
            </div>

            {/* Back to Home Button */}
            <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 px-3 py-1.5 bg-black/50 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white transition-all shadow-xl group">
                <Home size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold tracking-tight">Kembali</span>
            </Link>

            {/* Login Form Container */}
            <div className="relative z-30 w-full max-w-[92%] sm:max-w-sm mx-auto animate-fade-in-up md:perspective-1000 my-4 md:my-8">
                {/* Floating Card */}
                <div className="p-6 md:p-10 bg-[#1e293b]/50 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                    
                    {/* Glowing Accent */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 p-2 shadow-2xl border border-white/20 mb-4 backdrop-blur-md transform -rotate-3 hover:rotate-0 transition-transform">
                                <img src="/images/logo-bogor.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-sm tracking-tight uppercase">
                                DESA CIMANGGU I
                            </h2>
                            <p className="text-slate-300 font-bold text-[10px] md:text-[11px] mt-2 opacity-80 uppercase tracking-[0.2em]">Sistem Digitalisasi Desa (SDD)</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm text-center shadow-lg animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-200 ml-1">Username</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within/input:text-yellow-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all shadow-inner backdrop-blur-sm"
                                        placeholder="Username Anda"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-200 ml-1">Password</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-yellow-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all shadow-inner backdrop-blur-sm"
                                        placeholder="Password Anda"
                                    />
                                </div>
                            </div>

                            {/* CAPTCHA SECTION */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 group/captcha transition-all hover:bg-white/10">
                                <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                                    <p className="text-[9px] uppercase tracking-widest text-yellow-500 font-black mb-1 opacity-70">Verifikasi Captcha</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <span className="text-xl font-black text-white italic tracking-[0.1em] select-none bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner min-w-[100px] text-center">
                                            {captcha.question || "---"}
                                        </span>
                                        <button 
                                            type="button" onClick={fetchCaptcha}
                                            className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full sm:w-28 text-center sm:text-right">
                                    <input 
                                        type="text" required value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-yellow-400/50 text-center font-black text-sm tracking-widest uppercase outline-none" 
                                        placeholder="HASIL" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl text-slate-900 font-black text-lg shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 mt-8 ${isLoading
                                    ? 'bg-yellow-600/50 cursor-not-allowed scale-95'
                                    : 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] bg-[length:200%_auto] hover:bg-right'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw size={20} className="animate-spin" />
                                        Memproses...
                                    </span>
                                ) : (
                                    <>
                                        <span>MASUK APLIKASI</span>
                                        <ArrowRight size={22} className="stroke-[3] group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center border-t border-white/10 pt-8 pb-4">
                            <p className="text-slate-300 text-sm mb-4">
                                Belum punya akun? <Link to="/register" className="text-yellow-400 font-black hover:underline tracking-tight">Daftar Sekarang</Link>
                            </p>
                            <p className="text-slate-400/50 text-[9px] font-bold tracking-[0.2em] uppercase">
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
                        transform: translateY(30px) scale(0.98);
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
