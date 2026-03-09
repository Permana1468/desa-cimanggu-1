import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, RefreshCw, KeyRound, UserCheck, Search, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const ManajemenPengguna = () => {
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
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
            if (error.response?.status === 403) {
                alert("Akses ditolak. Hanya Admin yang dapat melihat ini.");
            }
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
                password: '', // biarkan kosong saat edit, agar tidak keriset tak sengaja
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
                delete payload.password; // jangan kirim password kosong jika edit
            }

            if (modalMode === 'add') {
                await api.post('/users/api/admin/users/', payload);
                alert("Pengguna baru berhasil ditambahkan!");
            } else if (modalMode === 'edit') {
                await api.patch(`/users/api/admin/users/${formData.id}/`, payload);
                alert("Data pengguna berhasil diperbarui!");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            const errMsg = error.response?.data ? JSON.stringify(error.response.data) : "Terjadi kesalahan.";
            alert(`Gagal menyimpan data pengguna: ${errMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus pengguna ini secara permanen?")) return;

        try {
            await api.delete(`/users/api/admin/users/${id}/`);
            fetchUsers();
            alert("Pengguna berhasil dihapus.");
        } catch (error) {
            console.error("Gagal menghapus pengguna:", error);
            alert("Terjadi kesalahan saat menghapus pengguna.");
        }
    };

    const handleResetPassword = async (id, username) => {
        if (!window.confirm(`Yakin ingin mereset password untuk user '${username}' menjadi 'password123'?`)) return;

        try {
            const response = await api.post(`/users/api/admin/users/${id}/reset-password/`, {});
            alert(response.data.detail || "Password berhasil direset!");
        } catch (error) {
            console.error("Gagal mereset password:", error);
            alert("Terjadi kesalahan saat mereset password.");
        }
    };

    // Filter users based on search
    const filteredUsers = usersList.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="text-gray-200 animate-fade-in relative z-10 w-full">
            {/* Header Bagian */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <UserCheck className="w-7 h-7 text-yellow-500" />
                        Manajemen Pengguna
                    </h2>
                    <p className="text-gray-400 text-sm">Kelola akun, role, dan hak akses staf desa.</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add')}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all flex items-center shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Pengguna
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 mb-6 flex shadow-lg">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan username, email, atau role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Tabel Data */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-sm">
                                <th className="p-4 font-semibold pl-6">ID</th>
                                <th className="p-4 font-semibold">Username</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Unit Detail</th>
                                <th className="p-4 font-semibold text-center pr-6 w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <RefreshCw className="w-5 h-5 animate-spin" /> Memuat data...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                                        Tidak ada data pengguna ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6 text-gray-400">#{user.id}</td>
                                        <td className="p-4 font-medium text-gray-200">{user.username}</td>
                                        <td className="p-4 text-gray-400">{user.email || '-'}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{user.unit_detail || '-'}</td>
                                        <td className="p-4 pr-6 flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleResetPassword(user.id, user.username)}
                                                className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 text-sm hover:text-slate-900 rounded-lg transition-colors border border-yellow-500/30"
                                                title="Reset Password Default"
                                            >
                                                <KeyRound className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal('edit', user)}
                                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 text-sm hover:text-white rounded-lg transition-colors border border-blue-500/30"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 text-sm hover:text-white rounded-lg transition-colors border border-red-500/30"
                                                title="Hapus User"
                                                disabled={user.username === 'admin'} // Cegah hapus super admin
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {modalMode === 'add' ? <Plus className="w-5 h-5 text-yellow-500" /> : <Edit className="w-5 h-5 text-blue-400" />}
                                {modalMode === 'add' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Username *</label>
                                    <input
                                        type="text" name="username" required
                                        value={formData.username} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email" name="email"
                                        value={formData.email} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between items-center">
                                        <span>Password {modalMode === 'add' && '*'}</span>
                                        {modalMode === 'edit' && <span className="text-[10px] text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded">Kosongkan jika tidak diubah</span>}
                                    </label>
                                    <input
                                        type="password" name="password"
                                        required={modalMode === 'add'}
                                        value={formData.password} onChange={handleChange}
                                        placeholder={modalMode === 'add' ? 'Masukkan password' : 'Ketik password baru'}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                    {modalMode === 'add' && <p className="text-xs text-gray-500 mt-1">Default: password123 jika dikosongkan pada server, tapi form ini mewajibkan diisi.</p>}
                                </div>

                                <div className="pt-2 border-t border-white/10">
                                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Role Sistem *</label>
                                    <select
                                        name="role" required
                                        value={formData.role} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 appearance-none form-select"
                                    >
                                        {roleOptions.map(r => (
                                            <option key={r} value={r} className="bg-slate-900">{r.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Unit Detail (Opsional)</label>
                                    <input
                                        type="text" name="unit_detail"
                                        value={formData.unit_detail} onChange={handleChange}
                                        placeholder="Contoh: RT01, Dusun 2, dll."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="userForm"
                                disabled={isSaving}
                                className={`px-6 py-2.5 rounded-xl font-bold flex items-center justify-center min-w-[120px] transition-all ${isSaving ? 'bg-yellow-500/50 text-slate-800/50 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-[0_0_10px_rgba(234,179,8,0.3)]'}`}
                            >
                                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManajemenPengguna;
