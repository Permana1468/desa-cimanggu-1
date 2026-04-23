import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, UserCircle, Briefcase, MapPin, ArrowRight, Home, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';
import axios from 'axios';

const heroImages = [
    '/images/slide_1.webp',
    '/images/slide_6.webp',
    '/images/slide_4.webp',
    '/images/slide_5.webp'
];

const RowInput = ({ label, name, type = 'text', icon, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-text-subtle ml-1 uppercase tracking-[0.2em]">{label}</label>
        <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">{React.cloneElement(icon, { size: 18, className: "text-text-subtle group-focus-within/input:text-gold transition-colors" })}</div>
            <input 
                name={name} required type={type} value={value} onChange={onChange}
                className="w-full pl-12.5 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-text-main text-[13.5px] font-bold placeholder-text-faint focus:outline-none focus:border-gold transition-all" 
                placeholder={placeholder} 
            />
        </div>
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        konfirmasi_password: '',
        nama_lengkap: '',
        nomor_telepon: '',
        role: 'WARGA',
        unit_detail: '',
        captcha_answer: ''
    });
    const [captcha, setCaptcha] = useState({ question: '', token: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const fetchCaptcha = useCallback(async () => {
        try {
            const res = await axios.get('/users/api/captcha/');
            setCaptcha({
                question: res.data.question,
                token: res.data.captcha_token
            });
        } catch (err) {
            console.error("Gagal mengambil captcha", err);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCaptcha();
        }, 0);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 8000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchCaptcha]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            fetchCaptcha();
            setIsLoading(false);
        }
    };

    const roles = [
        { value: 'RT', label: 'Ketua RT' },
        { value: 'RW', label: 'Ketua RW' },
        { value: 'LPM', label: 'LPM' },
        { value: 'KARANG_TARUNA', label: 'Karang Taruna' },
        { value: 'BUMDES', label: 'Bumdes' },
        { value: 'TP_PKK', label: 'TP-PKK' },
        { value: 'POSYANDU', label: 'Petugas Posyandu' },
        { value: 'PUSKESOS', label: 'Puskesos (Sosial)' },
        { value: 'KADUS', label: 'Kepala Dusun' },
        { value: 'SEKDES', label: 'Sekretaris Desa' },
        { value: 'KAUR_PERENCANAAN', label: 'Kaur Perencanaan' },
        { value: 'KAUR_TU', label: 'Kaur Tata Usaha' },
        { value: 'KAUR_KEUANGAN', label: 'Kaur Keuangan' },
        { value: 'KASI_PEMERINTAHAN', label: 'Kasi Pemerintahan' },
        { value: 'KASI_KESEJAHTERAAN', label: 'Kasi Kesejahteraan' },
        { value: 'KASI_PELAYANAN', label: 'Kasi Pelayanan' },
        { value: 'OWNER_TOKO', label: 'Pemilik Toko (UMKM)' },
        { value: 'WARGA', label: 'Warga Umum' },
    ];

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative font-sans overflow-hidden bg-[#020617]">
                <div className="absolute inset-0 z-0 transition-opacity duration-1000">
                    <div className="w-full h-full bg-cover bg-center grayscale opacity-20" style={{ backgroundImage: `url('${heroImages[0]}')` }}></div>
                </div>
                <div className="relative z-30 w-full max-w-md mx-4 animate-fade-in-up">
                    <div className="p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] text-center shadow-2xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gold/20 border border-gold/40 mb-8">
                            <CheckCircle2 className="text-gold w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Berhasil Terdaftar!</h2>
                        <p className="text-text-muted mb-8 leading-relaxed font-bold">
                            {formData.role === 'WARGA' 
                                ? 'Pendaftaran berhasil! Anda akan dialihkan ke halaman login.' 
                                : 'Akun Kelembagaan berhasil didaftarkan. Mohon tunggu verifikasi Admin Desa.'}
                        </p>
                        <Link to="/login" className="text-gold font-black uppercase tracking-widest hover:text-white transition-all underline underline-offset-8">Kembali ke Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative font-sans flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
            {/* Background Carousel */}
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
                {heroImages.map((src, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <div className={`w-full h-full bg-cover bg-center transition-transform duration-[12000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} style={{ backgroundImage: `url('${src}')` }}></div>
                    </div>
                ))}
                <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#020617]/95 via-[#020617]/75 to-[#020617]/40 backdrop-blur-[4px]"></div>
            </div>

            <Link to="/login" className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white/90 transition-all shadow-2xl group ring-1 ring-white/5">
                <Home size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Halaman Login</span>
            </Link>

            <div className="relative z-30 w-full max-w-[620px] animate-fade-in-up">
                <div className="relative bg-[#0f172a]/50 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-3 mb-5 shadow-2xl backdrop-blur-xl -rotate-2">
                            <img src="/images/logo-bogor.webp" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
                            <span className="block text-gold mb-1">Daftar Akun</span>
                            <span className="text-[10px] text-text-subtle tracking-[0.5em] font-black opacity-80">Sistem Digital Desa</span>
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-5 py-3.5 rounded-2xl mb-8 text-[12px] font-bold text-center flex items-center justify-center gap-3 animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <RowInput label="Username" name="username" icon={<User size={16} />} value={formData.username} onChange={handleChange} placeholder="Username" />
                            <RowInput label="Email" name="email" type="email" icon={<Mail size={16} />} value={formData.email} onChange={handleChange} placeholder="email@desa.com" />
                            <RowInput label="Nama Lengkap" name="nama_lengkap" icon={<UserCircle size={16} />} value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" />
                            <RowInput label="Nomor WhatsApp" name="nomor_telepon" type="tel" icon={<Phone size={16} />} value={formData.nomor_telepon} onChange={handleChange} placeholder="081..." />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-subtle ml-1 uppercase tracking-[0.2em]">Otoritas / Role</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none z-20">
                                        <Briefcase size={16} className="text-text-subtle group-focus-within/input:text-gold transition-colors" />
                                    </div>
                                    <select 
                                        name="role" value={formData.role} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-text-main text-[13.5px] font-bold focus:border-gold focus:bg-[#0f172a] transition-all appearance-none cursor-pointer outline-none relative z-10"
                                    >
                                        {roles.map(r => <option key={r.value} value={r.value} className="bg-[#0f172a] text-white">{r.label}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-subtle z-20"><ChevronDown size={14} /></div>
                                </div>
                            </div>

                            <RowInput label="Unit / Wilayah" name="unit_detail" icon={<MapPin size={16} />} value={formData.unit_detail} onChange={handleChange} placeholder="Cth: RT 01 / RW 02" />
                            <RowInput label="Kata Sandi" name="password" type="password" icon={<Lock size={16} />} value={formData.password} onChange={handleChange} placeholder="••••••••" />
                            <RowInput label="Ulangi Sandi" name="konfirmasi_password" type="password" icon={<Lock size={16} />} value={formData.konfirmasi_password} onChange={handleChange} placeholder="••••••••" />
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6">
                            <div className="flex-1">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-gold font-black mb-1.5 opacity-60">Security Check</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-white italic tracking-[0.1em]">{captcha.question || "---"}</span>
                                    <button type="button" onClick={fetchCaptcha} className="p-2 text-text-subtle hover:text-gold transition-all bg-white/5 rounded-xl"><RefreshCw size={14} /></button>
                                </div>
                            </div>
                            <div className="w-28">
                                <input 
                                    name="captcha_answer" required type="text" value={formData.captcha_answer} onChange={handleChange}
                                    className="w-full px-3 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-gold text-center font-black tracking-widest uppercase outline-none focus:border-gold" 
                                    placeholder="KODE" 
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className={`w-full py-4.5 rounded-2xl text-black font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${
                                isLoading ? 'bg-gold/40 cursor-not-allowed' : 'bg-gold hover:bg-gold-dark shadow-[0_20px_40px_-12px_rgba(234,179,8,0.4)] hover:-translate-y-1'
                            }`}
                        >
                            {isLoading ? <RefreshCw size={20} className="animate-spin inline" /> : 'Selesaikan Pendaftaran'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-text-muted text-[13px] font-bold">
                            Sudah punya akun? <Link to="/login" className="text-gold font-black hover:text-white transition-all underline">Login Di Sini</Link>
                        </p>
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

export default Register;
