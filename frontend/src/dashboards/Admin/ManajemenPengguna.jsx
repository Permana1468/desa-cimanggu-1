import React, { useState, useEffect } from 'react';
import { Trash2, Edit, KeyRound, Search, ShieldAlert, UserPlus, Settings2 } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Shared/Modal';
import { useTheme } from '../../contexts/ThemeContext';

const ManajemenPengguna = () => {
    const { theme } = useTheme();
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        id: null,
        username: '',
        email: '',
        role: 'WARGA',
        unit_detail: '',
        password: '',
    });

    const roleOptions = [
        'ADMIN', 'SEKDES', 'KAUR_PERENCANAAN', 'KAUR_TU', 'KAUR_KEUANGAN',
        'KASI_PEMERINTAHAN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN',
        'KADUS', 'POSYANDU', 'LPM', 'RW', 'RT', 'KARANG_TARUNA',
        'BUMDES', 'TP_PKK', 'PUSKESOS', 'WARGA'
    ];

    const roleLabels = {
        'ADMIN': 'Administrator Utama',
        'SEKDES': 'Sekretaris Desa',
        'KAUR_PERENCANAAN': 'Kaur Perencanaan',
        'KAUR_TU': 'Kaur TU & Umum',
        'KAUR_KEUANGAN': 'Kaur Keuangan',
        'KASI_PEMERINTAHAN': 'Kasi Pemerintahan',
        'KASI_KESEJAHTERAAN': 'Kasi Kesejahteraan',
        'KASI_PELAYANAN': 'Kasi Pelayanan',
        'KADUS': 'Kepala Dusun',
        'POSYANDU': 'Posyandu',
        'LPM': 'LPM',
        'RW': 'Ketua RW',
        'RT': 'Ketua RT',
        'KARANG_TARUNA': 'Karang Taruna',
        'BUMDES': 'Bumdes',
        'TP_PKK': 'TP-PKK',
        'PUSKESOS': 'Puskesos',
        'WARGA': 'Warga Umum'
    };

    const formatLastActive = (dateString) => {
        if (!dateString) return 'Belum pernah';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Barusan';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
        
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users/api/admin/users/');
            setUsersList(response.data);
        } catch (error) {
            console.error("Gagal mendapatkan data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                unit_detail: user.unit_detail || '',
                password: '',
                status: user.status || 'PENDING',
                is_verified: user.is_verified ?? false,
            });
        } else {
            setFormData({
                id: null,
                username: '',
                email: '',
                role: 'WARGA',
                unit_detail: '',
                password: '',
                status: 'ACTIVE',
                is_verified: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = { ...formData };
            if (modalMode === 'edit' && !payload.password) {
                delete payload.password;
            }

            if (modalMode === 'add') {
                await api.post('/users/api/admin/users/', payload);
            } else if (modalMode === 'edit') {
                await api.patch(`/users/api/admin/users/${formData.id}/`, payload);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Gagal menyimpan data pengguna.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus pengguna ini?")) return;
        try {
            await api.delete(`/users/api/admin/users/${id}/`);
            fetchUsers();
        } catch (error) {
            console.error("Gagal menghapus pengguna:", error);
        }
    };

    const handleResetPassword = async (id, username) => {
        if (!window.confirm(`Reset password user '${username}' ke default 'desa1234'?`)) return;
        try {
            await api.post(`/users/api/admin/users/${id}/reset-password/`, { new_password: 'desa1234' });
            alert("Password berhasil direset ke: desa1234");
        } catch (error) {
            console.error("Gagal mereset password:", error);
            alert("Gagal mereset password. Pastikan koneksi server stabil.");
        }
    };

    const filteredUsers = usersList.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Standardized Input Component ───────────────────────── */
    const FormInput = ({ label, name, type = "text", required, placeholder, value, onChange, info }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">{label}</label>
                {required && <span className="text-[9px] text-gold font-bold uppercase tracking-widest">Required</span>}
            </div>
            <input
                type={type}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] 
                           placeholder:text-text-quaternary outline-none transition-all duration-300
                           focus:border-gold-border focus:bg-gold-light focus:shadow-gold-glow"
            />
            {info && <p className="text-[10px] text-text-tertiary italic mt-1.5 leading-relaxed">{info}</p>}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full">
            {/* Header section identical to other dashboards */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                        Manajemen Pengguna
                        <span className="w-2 h-2 rounded-full bg-gold shadow-gold-glow animate-pulse" />
                    </h2>
                    <p className="text-text-muted text-[13px] font-medium mt-1">Konfigurasi hak akses dan akun sistem desa.</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add')}
                    className="group bg-gold hover:bg-gold-dark text-black px-7 py-3.5 rounded-2xl font-black text-[14px] 
                               transition-all duration-300 flex items-center gap-3 shadow-gold-glow hover:-translate-y-1"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    TAMBAH PENGGUNA
                </button>
            </div>

            {/* Search Glassmorphism */}
            <div className="bg-dark-card backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex shadow-2xl transition-all">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari akun atau role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/5 rounded-2xl pl-14 pr-5 py-3.5 text-text-main outline-none focus:ring-1 focus:ring-gold-border transition-all placeholder:text-text-quaternary"
                    />
                </div>
            </div>

            {/* Table Glassmorphism */}
            <div className="bg-dark-card backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.04] border-b border-white/[0.07] text-text-tertiary text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="p-6">User Profile</th>
                                <th className="p-6">Role / Akses</th>
                                <th className="p-6 text-center">Terakhir Aktif</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-center w-48">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-12 text-center text-text-tertiary font-bold uppercase tracking-widest animate-pulse">Memuat Database...</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-gold text-xs shadow-inner">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-text-main leading-none">{user.username}</div>
                                                <div className="text-[11px] text-text-muted mt-1.5">{user.email || 'No email attached'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-gold-light text-gold border-gold-border'}`}>
                                            {roleLabels[user.role] || user.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="text-[12px] font-bold text-text-main">{formatLastActive(user.last_login)}</div>
                                        <div className="text-[9px] text-text-muted uppercase tracking-tighter mt-1">Activity Log</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                                            <span className={`text-[11px] font-black uppercase tracking-wider ${user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {user.status || 'PENDING'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 pr-8">
                                        <div className="flex justify-center gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleResetPassword(user.id, user.username)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:bg-gold-light hover:text-gold transition-all shadow-lg" title="Reset Password"><KeyRound size={15} /></button>
                                            <button onClick={() => handleOpenModal('edit', user)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:bg-white/10 hover:text-text-main transition-all shadow-lg" title="Edit Akun"><Edit size={15} /></button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted hover:bg-red-500/20 hover:text-red-500 transition-all shadow-lg" disabled={user.username === 'admin'} title="Hapus User"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Tambah Akun Pengguna' : 'Update Data Akun'}
                icon={modalMode === 'add' ? UserPlus : Settings2}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-text-tertiary hover:text-text-main transition-colors">Batal</button>
                        <button type="submit" form="userForm" disabled={isSaving} className="bg-gold hover:bg-gold-dark text-black px-8 py-3.5 rounded-2xl font-black text-[14px] shadow-gold-glow">
                            {isSaving ? 'MEMPROSES...' : 'SIMPAN DATA'}
                        </button>
                    </>
                }
            >
                <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
                    <FormInput label="Username User" name="username" required value={formData.username} onChange={handleChange} placeholder="Contoh: kaur_umum" />
                    <FormInput label="Alamat Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="user@cimanggu.desa.id" />
                    
                    <FormInput 
                        label="Password Keamanan" 
                        name="password" 
                        type="password" 
                        required={modalMode === 'add'} 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder={modalMode === 'add' ? 'Minimal 8 karakter' : 'Ganti jika diperlukan'}
                        info={modalMode === 'add' ? "Gunakan kombinasi simbol dan angka untuk keamanan maksimal." : "Kosongkan kolom jika Anda tidak ingin merubah password."}
                    />

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldAlert size={14} className="text-red-500" />
                            Role Sistem & Hak Akses
                        </label>
                        <select
                            name="role" required
                            value={formData.role} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                        >
                            {roleOptions.map(r => (
                                <option key={r} value={r} className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>{roleLabels[r] || r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">Status Akun</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                            >
                                <option value="ACTIVE" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>ACTIVE (Aktif)</option>
                                <option value="PENDING" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>PENDING (Ditangguhkan)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">Verifikasi</label>
                            <select
                                name="is_verified"
                                value={formData.is_verified}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.value === 'true' }))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-text-main text-[13.5px] outline-none appearance-none cursor-pointer focus:border-gold-border"
                            >
                                <option value="true" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>VERIFIED</option>
                                <option value="false" className={theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}>UNVERIFIED</option>
                            </select>
                        </div>
                    </div>

                    <FormInput 
                        label="Keterangan Unit (Wilayah/Jabatan)" 
                        name="unit_detail" 
                        value={formData.unit_detail} 
                        onChange={handleChange} 
                        placeholder={formData.role === 'RT' ? 'Contoh: RW 01 / RT 05' : 'Contoh: Dusun I'} 
                        info="Format wajib RT/RW: RW 01 / RT 01"
                    />
                </form>
            </Modal>
        </div>
    );
};

export default ManajemenPengguna;
