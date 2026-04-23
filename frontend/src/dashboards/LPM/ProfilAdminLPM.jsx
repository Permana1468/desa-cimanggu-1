import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const ProfilAdminLPM = () => {
    const { user } = useContext(AuthContext);
    const fileInputRef = React.useRef(null);

    const [profilData, setProfilData] = useState({
        nama_lengkap: '',
        nomor_telepon: '',
        email: '',
        foto_profil: '',
    });
    const [passwordData, setPasswordData] = useState({
        password_lama: '',
        password_baru: '',
        konfirmasi_password: '',
    });

    const [loadingProfil, setLoadingProfil] = useState(true);
    const [savingProfil, setSavingProfil] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profilMsg, setProfilMsg] = useState(null);   // { type: 'success'|'error', text: '...' }
    const [passMsg, setPassMsg] = useState(null);

    // Load current profile data on mount
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api.get('/users/api/users/me/');
                const d = res.data;
                setProfilData({
                    nama_lengkap: d.nama_lengkap || '',
                    nomor_telepon: d.nomor_telepon || '',
                    email: d.email || '',
                    foto_profil: d.foto_profil || '',
                });
            } catch (e) {
                console.error('Gagal memuat profil:', e);
            } finally {
                setLoadingProfil(false);
            }
        };
        fetchMe();
    }, []);

    const handleSimpanProfil = async (e) => {
        e.preventDefault();
        try {
            setSavingProfil(true);
            // Hanya kirim field teks saja
            const { foto_profil, ...textData } = profilData;
            await api.patch('/users/api/users/me/', textData);
            setProfilMsg({ type: 'success', text: '✅ Data profil berhasil diperbarui!' });
        } catch (err) {
            const errMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Gagal menyimpan.';
            setProfilMsg({ type: 'error', text: `❌ ${errMsg}` });
        } finally {
            setSavingProfil(false);
            setTimeout(() => setProfilMsg(null), 4000);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('foto_profil', file);

        try {
            setUploadingPhoto(true);
            const res = await api.patch('/users/api/users/me/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfilData(prev => ({ ...prev, foto_profil: res.data.foto_profil }));
            setProfilMsg({ type: 'success', text: '✅ Foto profil berhasil diperbarui!' });
        } catch (err) {
            setProfilMsg({ type: 'error', text: '❌ Gagal mengunggah foto.' });
        } finally {
            setUploadingPhoto(false);
            setTimeout(() => setProfilMsg(null), 4000);
        }
    };

    const handleGantiPassword = async (e) => {
        e.preventDefault();
        try {
            setSavingPassword(true);
            await api.post('/users/api/users/change-password/', passwordData);
            setPassMsg({ type: 'success', text: '🔒 Password berhasil diubah. Silakan login kembali.' });
            setPasswordData({ password_lama: '', password_baru: '', konfirmasi_password: '' });
        } catch (err) {
            const errData = err.response?.data;
            const errMsg = errData?.password_lama || errData?.konfirmasi_password || errData?.detail || 'Gagal mengubah password.';
            setPassMsg({ type: 'error', text: `❌ ${errMsg}` });
        } finally {
            setSavingPassword(false);
            setTimeout(() => setPassMsg(null), 5000);
        }
    };

    const wilayahLPM = user?.unit_detail || '001';
    const usernameLPM = user?.username || `lpm_${wilayahLPM}`;

    if (loadingProfil) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Memuat data profil...</span>
            </div>
        );
    }

    return (
        <div className="text-gray-200 animate-fade-in pb-10">

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
                accept="image/*"
            />

            {/* HEADER PAGE */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Profil Administrator</h2>
                <p className="text-gray-400 text-sm">Kelola informasi data diri, kontak, dan keamanan akun LPM Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KOLOM KIRI: KARTU IDENTITAS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>

                        <div className="relative z-10">
                            <div 
                                onClick={handlePhotoClick}
                                className="w-28 h-28 mx-auto rounded-full bg-[#0f172a] border-4 border-[#1e293b] flex items-center justify-center text-4xl mb-4 shadow-2xl relative group cursor-pointer overflow-hidden"
                            >
                                {uploadingPhoto ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                                ) : profilData.foto_profil ? (
                                    <img src={profilData.foto_profil} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    '🧑‍💼'
                                )}
                                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white tracking-tight px-1 text-center">📷 Ubah Foto</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{profilData.nama_lengkap || '—'}</h3>
                            <p className="text-sm text-gray-400 font-mono mb-4">@{usernameLPM}</p>

                            <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold tracking-wider uppercase mb-6">
                                LPM Wilayah {wilayahLPM}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-3 text-left">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status Akun</p>
                                    <p className="text-sm text-green-400 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Aktif
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Hak Akses Sistem</p>
                                    <p className="text-sm text-gray-200">Terbatas (Unit {wilayahLPM})</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: FORM EDIT PROFIL & PASSWORD */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Form Informasi Dasar */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span>📋</span> Informasi Data Diri
                        </h3>

                        {profilMsg && (
                            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${profilMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {profilMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleSimpanProfil} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Nama Lengkap Operator</label>
                                <input
                                    type="text"
                                    value={profilData.nama_lengkap}
                                    onChange={(e) => setProfilData({ ...profilData, nama_lengkap: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                    placeholder="Nama lengkap Anda..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Nomor WhatsApp / HP</label>
                                    <input
                                        type="text"
                                        value={profilData.nomor_telepon}
                                        onChange={(e) => setProfilData({ ...profilData, nomor_telepon: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Email (Opsional)</label>
                                    <input
                                        type="email"
                                        value={profilData.email}
                                        onChange={(e) => setProfilData({ ...profilData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="email@contoh.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={savingProfil} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 flex items-center gap-2">
                                    {savingProfil ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Form Ganti Password */}
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span>🔐</span> Keamanan & Ganti Password
                        </h3>

                        {passMsg && (
                            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${passMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {passMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleGantiPassword} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Password Lama</label>
                                <input
                                    type="password"
                                    value={passwordData.password_lama}
                                    onChange={(e) => setPasswordData({ ...passwordData, password_lama: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordData.password_baru}
                                        onChange={(e) => setPasswordData({ ...passwordData, password_baru: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordData.konfirmasi_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, konfirmasi_password: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={savingPassword} className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 flex items-center gap-2">
                                    {savingPassword ? <><Loader2 className="w-4 h-4 animate-spin" /> Memperbarui...</> : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProfilAdminLPM;

