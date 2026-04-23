import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Loader2, KeyRound, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

const UserSettings = () => {
    const { logoutUser } = useContext(AuthContext);
    const [passwordData, setPasswordData] = useState({
        password_lama: '',
        password_baru: '',
        konfirmasi_password: '',
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.password_baru !== passwordData.konfirmasi_password) {
            setMessage({ type: 'error', text: '❌ Konfirmasi password tidak cocok.' });
            return;
        }

        try {
            setSaving(true);
            await api.post('/users/api/users/change-password/', passwordData);
            setMessage({ type: 'success', text: '🔒 Password berhasil diubah! Mengalihkan ke halaman login...' });
            
            // Logout after success password change for security
            setTimeout(() => {
                logoutUser();
                window.location.href = '/login';
            }, 3000);
        } catch (err) {
            const errData = err.response?.data;
            const errMsg = errData?.password_lama || errData?.konfirmasi_password || errData?.detail || 'Gagal mengubah password.';
            setMessage({ type: 'error', text: `❌ ${errMsg}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-[fade-in_0.5s_ease]">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Pengaturan Akun</h1>
                <p className="text-white/40 mt-1">Kelola keamanan dan preferensi akun sistem Anda.</p>
            </header>

            <div className="space-y-6">
                
                {/* Security Section */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[28px] overflow-hidden shadow-xl">
                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <KeyRound className="text-red-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Keamanan Akun</h3>
                                <p className="text-white/30 text-xs">Ubah password Anda secara berkala untuk menjaga keamanan data.</p>
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-[card-in_0.3s_ease] ${
                                message.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Password Saat Ini</label>
                                <input 
                                    type="password"
                                    required
                                    value={passwordData.password_lama}
                                    onChange={e => setPasswordData({...passwordData, password_lama: e.target.value})}
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-red-500/50 transition-all"
                                    placeholder="Masukkan password lama..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Password Baru</label>
                                    <input 
                                        type="password"
                                        required
                                        value={passwordData.password_baru}
                                        onChange={e => setPasswordData({...passwordData, password_baru: e.target.value})}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-red-500/50 transition-all font-medium"
                                        placeholder="Min. 8 karakter..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Konfirmasi Password Baru</label>
                                    <input 
                                        type="password"
                                        required
                                        value={passwordData.konfirmasi_password}
                                        onChange={e => setPasswordData({...passwordData, konfirmasi_password: e.target.value})}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 px-5 text-white outline-none focus:border-red-500/50 transition-all font-medium"
                                        placeholder="Ulangi password baru..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-10 py-3.5 rounded-2xl 
                                               shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)]
                                               hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                                               transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-red-500/5 border-t border-white/[0.06] p-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <LogOut className="text-red-400" size={18} />
                            <div className="text-sm text-white/60">Sesi Akun</div>
                        </div>
                        <p className="text-[11px] text-white/30 italic">
                            Anda akan secara otomatis keluar dari semua perangkat setelah mengganti password.
                        </p>
                    </div>
                </div>

                {/* Preference Section (Scaffold) */}
                <div className="p-8 md:p-10 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[28px] opacity-60">
                     <h3 className="text-lg font-bold text-white mb-2">Preferensi Tampilan</h3>
                     <p className="text-white/30 text-xs">Opsi tema dan kustomisasi antarmuka akan hadir segera.</p>
                </div>

            </div>
        </div>
    );
};

export default UserSettings;
