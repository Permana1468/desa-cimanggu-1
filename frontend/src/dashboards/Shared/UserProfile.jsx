import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Loader2, Camera, User, Phone, Mail, ShieldCheck, BadgeCheck } from 'lucide-react';

const UserProfile = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [profilData, setProfilData] = useState({
        nama_lengkap: '',
        nomor_telepon: '',
        email: '',
        foto_profil: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api.get('/users/api/users/me/');
                setProfilData({
                    nama_lengkap: res.data.nama_lengkap || '',
                    nomor_telepon: res.data.nomor_telepon || '',
                    email: res.data.email || '',
                    foto_profil: res.data.foto_profil || '',
                });
            } catch (e) {
                console.error('Gagal memuat profil:', e);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchMe();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const { foto_profil: _, ...textData } = profilData;
            await api.patch('/users/api/users/me/', textData);
            setMessage({ type: 'success', text: '✅ Profil berhasil diperbarui!' });
            refreshUser(); // Update navbar
        } catch (err) {
            const errorData = err.response?.data;
            let errorMsg = '❌ Gagal menyimpan profil.';
            
            if (errorData) {
                // If backend returns field-specific errors
                const firstError = Object.values(errorData)[0];
                if (Array.isArray(firstError)) {
                    errorMsg = `❌ ${firstError[0]}`;
                } else if (typeof firstError === 'string') {
                    errorMsg = `❌ ${firstError}`;
                }
            }
            
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    const handleFileClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('foto_profil', file);

        try {
            setUploading(true);
            const res = await api.patch('/users/api/users/me/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfilData(prev => ({ ...prev, foto_profil: res.data.foto_profil }));
            setMessage({ type: 'success', text: '✅ Foto profil berhasil diperbarui!' });
            refreshUser();
        } catch (err) {
            console.error('Upload error:', err);
            setMessage({ type: 'error', text: '❌ Gagal mengunggah foto.' });
        } finally {
            setUploading(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-white/40 font-medium">Memuat data profil...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-[fade-in_0.5s_ease]">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Profil Saya</h1>
                <p className="text-white/40 mt-1">Kelola informasi identitas dan foto profil Anda.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Card: Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[28px] p-8 text-center sticky top-8
                                    shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                        
                        {/* Blob decoration */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
                        
                        <div className="relative group mx-auto w-32 h-32 mb-6">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-amber-600 p-[3px] shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                                <div className="w-full h-full rounded-full bg-dark-base overflow-hidden flex items-center justify-center relative">
                                    {uploading ? (
                                        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                                    ) : profilData.foto_profil ? (
                                        <img src={profilData.foto_profil} alt={profilData.nama_lengkap} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-extrabold text-amber-500">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    
                                    <button 
                                        onClick={handleFileClick}
                                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                    >
                                        <Camera className="text-white mb-1" size={24} />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ubah Foto</span>
                                    </button>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>

                        <h2 className="text-xl font-extrabold text-white mb-1">{profilData.nama_lengkap || user?.username}</h2>
                        <p className="text-amber-500 font-bold text-[11px] uppercase tracking-[0.15em] mb-6">
                            {user?.role?.replace('_', ' ') || 'Pengguna'}
                        </p>

                        <div className="space-y-3.5 pt-6 border-t border-white/[0.06]">
                            <div className="flex items-center justify-between text-left">
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Username</span>
                                <span className="text-[13px] text-white/70 font-mono">@{user?.username}</span>
                            </div>
                            <div className="flex items-center justify-between text-left">
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Unit Kerja</span>
                                <span className="text-[13px] text-white/70">{user?.unit_detail || 'Pusat'}</span>
                            </div>
                            <div className="flex items-center justify-between text-left">
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Status</span>
                                <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form: Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[28px] p-8 md:p-10 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <BadgeCheck className="text-amber-500" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Informasi Dasar</h3>
                                <p className="text-white/30 text-xs">Pastikan data Anda tetap akurat untuk mempermudah koordinasi.</p>
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-[card-in_0.3s_ease] ${
                                message.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Nama Lengkap</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input 
                                            type="text"
                                            value={profilData.nama_lengkap}
                                            onChange={e => setProfilData({...profilData, nama_lengkap: e.target.value})}
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-amber-500/50 transition-all font-medium"
                                            placeholder="Masukkan nama lengkap..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Nomor Telepon</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input 
                                            type="text"
                                            value={profilData.nomor_telepon}
                                            onChange={e => setProfilData({...profilData, nomor_telepon: e.target.value})}
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-amber-500/50 transition-all font-medium"
                                            placeholder="08xx-xxxx-xxxx"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input 
                                        type="email"
                                        value={profilData.email}
                                        onChange={e => setProfilData({...profilData, email: e.target.value})}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-amber-500/50 transition-all font-medium"
                                        placeholder="email@cimanggu.desa.id"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold px-10 py-3.5 rounded-2xl 
                                               shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)]
                                               hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                                               transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-6 rounded-[24px] bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-amber-500" size={20} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-amber-500 uppercase tracking-wider">Catatan Keamanan</h4>
                            <p className="text-[12px] text-white/40 mt-1 leading-relaxed">
                                Data profil Anda hanya dapat diakses oleh administrator sistem. Perubahan email mungkin memerlukan verifikasi ulang untuk beberapa fitur akses tertentu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
