import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const heroImages = [
    '/images/slide_1.webp',
    '/images/slide_6.webp',
    '/images/slide_4.webp',
    '/images/slide_5.webp'
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
            const res = await axios.get('/users/api/captcha/');
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
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const tokens = await loginUser(username, password, captcha.token, captchaAnswer);
            const decodedToken = jwtDecode(tokens.access);

            if (decodedToken.role === 'OWNER_TOKO') {
                navigate('/toko/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal login, silakan periksa kembali data Anda.";
            setError(msg);
            fetchCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative font-sans flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Carousel - Fixed to ensure full-screen coverage */}
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
                {heroImages.map((src, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className={`w-full h-full bg-cover bg-center transition-transform duration-[12000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} style={{ backgroundImage: `url('${src}')` }}></div>
                    </div>
                ))}
                {/* High-End Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#020617]/95 via-[#020617]/75 to-[#020617]/40 backdrop-blur-[4px]"></div>
                <div className="absolute inset-0 z-21 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.06),transparent_60%)]"></div>
            </div>

            {/* Navigation */}
            <Link to="/" className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white/90 transition-all shadow-2xl group ring-1 ring-white/5">
                <Home size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Beranda</span>
            </Link>

            {/* Login Card */}
            <div className="relative z-30 w-full max-w-[420px] animate-fade-in-up">
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 via-yellow-500/20 to-gold/30 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                    
                    <div className="relative bg-[#0f172a]/40 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden text-shadow-sm">
                        
                        {/* Light Ray Effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 p-4 mb-6 shadow-2xl backdrop-blur-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <img src="/images/logo-bogor.webp" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                                <span className="block text-gold mb-1">CIMANGGU I</span>
                                <span className="text-[11px] text-text-subtle tracking-[0.4em] font-black opacity-80 uppercase">Direktorat Digital</span>
                            </h2>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-5 py-3.5 rounded-2xl mb-8 text-[13px] font-bold text-center flex items-center justify-center gap-3 animate-shake shadow-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] ml-1">Nama Pengguna</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User size={18} className="text-text-subtle group-focus-within/input:text-gold transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full pl-14 pr-5 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-text-main text-[14.5px] font-bold placeholder-text-faint focus:outline-none focus:border-gold-border focus:bg-white/[0.06] transition-all shadow-inner"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em]">Kata Sandi</label>
                                    <button type="button" className="text-[10px] text-gold hover:text-white font-bold transition-all">Lupa?</button>
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-text-subtle group-focus-within/input:text-gold transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full pl-14 pr-5 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-text-main text-[14.5px] font-bold placeholder-text-faint focus:outline-none focus:border-gold-border focus:bg-white/[0.06] transition-all shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* CAPTCHA SECTION */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 hover:bg-white/[0.05] transition-all">
                                <div className="flex-1">
                                    <p className="text-[9px] uppercase tracking-widest text-gold font-black mb-1.5 opacity-60">Security Check</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-black text-white italic tracking-[0.1em] select-none">
                                            {captcha.question || "---"}
                                        </span>
                                        <button type="button" onClick={fetchCaptcha} className="p-2 text-text-subtle hover:text-gold hover:rotate-180 transition-all duration-500 bg-white/5 rounded-xl">
                                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                </div>
                                <div className="w-28">
                                    <input 
                                        type="text" required value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="w-full px-2 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-gold text-center font-black text-[15px] tracking-widest uppercase outline-none focus:border-gold-border focus:ring-1 focus:ring-gold-border shadow-2xl" 
                                        placeholder="KODE" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className={`group relative w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl text-black font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 ${
                                    isLoading ? 'bg-gold/40 cursor-not-allowed' : 'bg-gold hover:bg-gold-dark shadow-[0_20px_40px_-12px_rgba(234,179,8,0.4)] hover:-translate-y-1'
                                }`}
                            >
                                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : (
                                    <>
                                        Masuk <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-white/5 pt-6">
                            <p className="text-text-muted text-[13px]">
                                Belum ada akun? <Link to="/register" className="text-gold font-black hover:text-white transition-all underline underline-offset-4 decoration-gold/30">Daftar Sekarang</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(30px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
            `}} />
        </div>
    );
};

export default Login;
