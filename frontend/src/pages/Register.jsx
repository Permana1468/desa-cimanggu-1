import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, UserCircle, Briefcase, MapPin, ArrowRight, Home, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';
import axios from 'axios';

const heroImages = [
    '/images/slide_1.png',
    '/images/slide_6.png',
    '/images/slide_4.png',
    '/images/slide_5.png'
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        konfirmasi_password: '',
        nama_lengkap: '',
        nomor_telepon: '',
        role: 'LPM',
        unit_detail: '',
        captcha_answer: ''
    });
    const [captcha, setCaptcha] = useState({ question: '', token: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isInstitutional = (role) => role !== 'WARGA';

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.konfirmasi_password) {
            setError("Password dan Konfirmasi Password tidak cocok.");
            setIsLoading(false);
            return;
        }

        try {
            const isWarga = formData.role === 'WARGA';
            await axios.post('/users/api/register/', {
                ...formData,
                is_verified: isWarga,
                status: isWarga ? 'ACTIVE' : 'PENDING',
                captcha_token: captcha.token
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            let msg = "Terjadi kesalahan saat pendaftaran.";
            if (err.response?.data) {
                const errors = err.response.data;
                if (typeof errors === 'string') msg = errors;
                else if (errors.detail) msg = errors.detail;
                else {
                    const firstKey = Object.keys(errors)[0];
                    const firstVal = errors[firstKey];
                    msg = `${firstKey}: ${Array.isArray(firstVal) ? firstVal[0] : firstVal}`;
                }
            }
            setError(msg);
            fetchCaptcha(); // Refresh captcha on error
            setIsLoading(false);
        }
    };

    const roles = [
        { value: 'LPM', label: 'LPM (Lembaga Pemberdayaan Masyarakat)' },
        { value: 'RT', label: 'Ketua RT' },
        { value: 'RW', label: 'Ketua RW' },
        { value: 'KARANG_TARUNA', label: 'Karang Taruna' },
        { value: 'BUMDES', label: 'Bumdes' },
        { value: 'TP_PKK', label: 'TP-PKK' },
        { value: 'POSYANDU', label: 'Petugas Posyandu' },
        { value: 'PUSKESOS', label: 'Puskesos (Sosial)' },
        { value: 'KADUS', label: 'Kepala Dusun' },
        { value: 'SEKDES', label: 'Sekretaris Desa' },
        { value: 'WARGA', label: 'Warga' },
    ];
 Greenland
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    {heroImages.map((src, index) => (
                        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }}></div>
                        </div>
                    ))}
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm"></div>
                </div>
                <div className="relative z-30 w-full max-w-md mx-4 animate-fade-in-up">
                    <div className="p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl text-center shadow-2xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-6">
                            <CheckCircle2 className="text-yellow-400 w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Pendaftaran Berhasil!</h2>
                        <p className="text-slate-200 mb-8 leading-relaxed">
                            {formData.role === 'WARGA' 
                                ? 'Pendaftaran berhasil! Anda bisa langsung masuk ke sistem.' 
                                : 'Akun Kelembagaan berhasil didaftarkan. Mohon tunggu verifikasi Admin Desa sebelum dapat login.'}
                        </p>
                        <Link to="/login" className="text-yellow-400 font-bold hover:underline">Ke Halaman Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0 bg-black">
                {heroImages.map((src, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className={`w-full h-full bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} style={{ backgroundImage: `url('${src}')` }}></div>
                    </div>
                ))}
                <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#0b1120]/90 via-[#0b1120]/60 to-transparent backdrop-blur-[3px]"></div>
            </div>

            {/* Back Button */}
            <Link to="/login" className="absolute top-6 left-6 z-40 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all group">
                <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Masuk Aplikasi</span>
            </Link>

            <div className="relative z-30 w-full max-w-md mx-4 my-8 animate-fade-in-up perspective-1000">
                <div className="p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500/20 via-transparent to-teal-500/20 rounded-3xl blur-2xl z-0 opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 p-2 shadow-lg border border-white/20 mb-3 backdrop-blur-md">
                                <img src="/images/logo-bogor.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-tight">DAFTAR AKUN SDD</h2>
                            <p className="text-slate-200 text-[11px] font-medium opacity-80 mt-1 uppercase tracking-widest">Sistem Digitalisasi Desa Cimanggu I</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-xl mb-4 text-xs text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-3.5">
                            <div className="grid grid-cols-1 gap-3.5">
                                <RowInput label="Username" name="username" icon={<User size={16} />} value={formData.username} onChange={handleChange} placeholder="Username" />
                                <RowInput label="Email" name="email" type="email" icon={<Mail size={16} />} value={formData.email} onChange={handleChange} placeholder="email@desa.com" />
                                <RowInput label="Nama Lengkap" name="nama_lengkap" icon={<UserCircle size={16} />} value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" />
                                <RowInput label="Nomor Telepon" name="nomor_telepon" type="tel" icon={<Phone size={16} />} value={formData.nomor_telepon} onChange={handleChange} placeholder="081..." />
                                
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-300 ml-1 uppercase tracking-wider">Peran (Role)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase size={16} className="text-slate-400" /></div>
                                        <select 
                                            name="role" value={formData.role} onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-400/50 transition-all appearance-none cursor-pointer outline-none relative z-10"
                                        >
                                            {roles.map(r => <option key={r.value} value={r.value} className="bg-slate-900 border-none">{r.label}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
                                    </div>
                                </div>

                                <RowInput label="Unit Detail (RW/RT/Dusun)" name="unit_detail" icon={<MapPin size={16} />} value={formData.unit_detail} onChange={handleChange} placeholder="Contoh: RW 02" />
                                <RowInput label="Password" name="password" type="password" icon={<Lock size={16} />} value={formData.password} onChange={handleChange} placeholder="••••••••" />
                                <RowInput label="Konfirmasi Password" name="konfirmasi_password" type="password" icon={<Lock size={16} />} value={formData.konfirmasi_password} onChange={handleChange} placeholder="••••••••" />
                            </div>

                            {/* CAPTCHA SECTION */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-[9px] uppercase tracking-widest text-yellow-400 font-bold mb-1 opacity-80">Kode CAPTCHA</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-black text-white italic tracking-[0.2em] bg-white/5 px-2 py-1 rounded select-none">{captcha.question || "---"}</span>
                                        <button type="button" onClick={fetchCaptcha} className="p-1 text-slate-400 hover:text-white transition-all"><RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /></button>
                                    </div>
                                </div>
                                <div className="w-28">
                                    <input 
                                        name="captcha_answer" required type="text" value={formData.captcha_answer} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-white text-center font-bold tracking-widest uppercase outline-none focus:ring-2 focus:ring-yellow-400" 
                                        placeholder="KODE" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-slate-900 font-black text-base shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                    isLoading ? 'bg-yellow-600/50 cursor-not-allowed scale-95' : 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                                }`}
                            >
                                {isLoading ? 'Memproses...' : (
                                    <>
                                        Daftar Sekarang <ArrowRight size={18} className="stroke-[3]" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center border-t border-white/10 pt-4">
                            <p className="text-slate-400 text-xs">
                                Sudah memiliki akun? <Link to="/login" className="text-yellow-400 font-bold hover:underline">Masuk di sini</Link>
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
                .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
                    20%, 40%, 60%, 80% { transform: translateX(3px); }
                }
                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
                .perspective-1000 { perspective: 1000px; }
            `}} />
        </div>
    );
};

const RowInput = ({ label, name, type = 'text', icon, value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-300 ml-1 uppercase tracking-wider">{label}</label>
        <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within/input:scale-110 transition-transform">{icon}</div>
            <input 
                name={name} required type={type} value={value} onChange={onChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all shadow-inner backdrop-blur-sm" 
                placeholder={placeholder} 
            />
        </div>
    </div>
);

export default Register;
