import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, RefreshCw, KeyRound, UserCheck, Search, ShieldAlert, UserPlus, Settings2 } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Shared/Modal';

const ManajemenPengguna = () => {
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
        'ADMIN', 'KAUR_PERENCANAAN', 'KASI_PEMERINTAHAN',
        'POSYANDU', 'SEKDES', 'KAUR_TU', 'WARGA'
    ];

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
            });
        } else {
            setFormData({
                id: null,
                username: '',
                email: '',
                role: 'WARGA',
                unit_detail: '',
                password: '',
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
        if (!window.confirm(`Reset password user '${username}'?`)) return;
        try {
            await api.post(`/users/api/admin/users/${id}/reset-password/`, {});
            alert("Password berhasil direset!");
        } catch (error) {
            console.error("Gagal mereset password:", error);
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
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</label>
                {required && <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Required</span>}
            </div>
            <input
                type={type}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-[13.5px] 
                           placeholder:text-white/10 outline-none transition-all duration-300
                           focus:border-amber-500/40 focus:bg-amber-500/[0.02] focus:shadow-[0_0_20px_rgba(245,158,11,0.05)]"
            />
            {info && <p className="text-[10px] text-white/20 italic mt-1.5 leading-relaxed">{info}</p>}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full">
            {/* Header section identical to other dashboards */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Manajemen Pengguna
                        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                    </h2>
                    <p className="text-white/30 text-[13px] font-medium mt-1">Konfigurasi hak akses dan akun sistem desa.</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add')}
                    className="group bg-amber-500 hover:bg-amber-400 text-black px-7 py-3.5 rounded-2xl font-black text-[14px] 
                               transition-all duration-300 flex items-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:-translate-y-1"
                >
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    TAMBAH PENGGUNA
                </button>
            </div>

            {/* Search Glassmorphism */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex shadow-2xl">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari akun atau role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-5 py-3.5 text-white outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* Table Glassmorphism */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.04] border-b border-white/[0.07] text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">
                                <th className="p-6">User Profile</th>
                                <th className="p-6">Role / Akses</th>
                                <th className="p-6">Unit Kerja</th>
                                <th className="p-6 text-center w-48">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-12 text-center text-white/20 font-bold uppercase tracking-widest animate-pulse">Memuat Database...</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-amber-500 text-xs shadow-inner">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-white leading-none">{user.username}</div>
                                                <div className="text-[11px] text-white/30 mt-1.5">{user.email || 'No email attached'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-[13px] text-white/40 font-medium">{user.unit_detail || '-'}</td>
                                    <td className="p-6 pr-8">
                                        <div className="flex justify-center gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleResetPassword(user.id, user.username)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-amber-500/20 hover:text-amber-500 transition-all shadow-lg"><KeyRound size={15} /></button>
                                            <button onClick={() => handleOpenModal('edit', user)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all shadow-lg"><Edit size={15} /></button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-all shadow-lg" disabled={user.username === 'admin'}><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Refactored with the new shared Modal component */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Tambah Akun Pengguna' : 'Update Data Akun'}
                icon={modalMode === 'add' ? UserPlus : Settings2}
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-white/40 hover:text-white transition-colors">Batal</button>
                        <button type="submit" form="userForm" disabled={isSaving} className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded-2xl font-black text-[14px]">
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
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldAlert size={14} className="text-red-500" />
                            Role Sistem & Hak Akses
                        </label>
                        <select
                            name="role" required
                            value={formData.role} onChange={handleChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-[13.5px] outline-none appearance-none cursor-pointer focus:border-amber-500/40"
                        >
                            {roleOptions.map(r => (
                                <option key={r} value={r} className="bg-[#0f172a]">{r.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <FormInput label="Keterangan Unit (Dusun/Jabatan)" name="unit_detail" value={formData.unit_detail} onChange={handleChange} placeholder="Contoh: Dusun 01 - RW 02" />
                </form>
            </Modal>
        </div>
    );
};

export default ManajemenPengguna;
