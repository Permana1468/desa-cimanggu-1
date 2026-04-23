import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit, KeyRound, Search, ShieldAlert, UserPlus, Settings2 } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

// Sub-komponen
import { UserSearch, UserHeader } from './AdminComponents/UserManagementUI';
import UserTable from './AdminComponents/UserTable';
import UserFormModal from './AdminComponents/UserFormModal';

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
        status: 'ACTIVE',
        is_verified: true,
    });

    const roleOptions = [
        'ADMIN', 'SEKDES', 'KAUR_PERENCANAAN', 'KAUR_TU', 'KAUR_KEUANGAN',
        'KASI_PEMERINTAHAN', 'KASI_KESEJAHTERAAN', 'KASI_PELAYANAN',
        'KADUS', 'POSYANDU', 'LPM', 'RW', 'RT', 'KARANG_TARUNA',
        'BUMDES', 'TP_PKK', 'PUSKESOS', 'OWNER_TOKO', 'WARGA'
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
        'OWNER_TOKO': 'Pemilik Toko (UMKM)',
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

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users/api/admin/users/');
            setUsersList(response.data);
        } catch (error) {
            console.error("Gagal mendapatkan data pengguna:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

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

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full">
            <UserHeader handleOpenModal={handleOpenModal} UserPlus={UserPlus} />
            <UserSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} Search={Search} />
            <UserTable 
                isLoading={isLoading} 
                filteredUsers={filteredUsers} 
                roleLabels={roleLabels} 
                formatLastActive={formatLastActive} 
                handleResetPassword={handleResetPassword} 
                handleOpenModal={handleOpenModal} 
                handleDelete={handleDelete} 
                KeyRound={KeyRound} 
                Edit={Edit} 
                Trash2={Trash2} 
            />
            <UserFormModal 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                modalMode={modalMode} 
                UserPlus={UserPlus} 
                Settings2={Settings2} 
                isSaving={isSaving} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleChange={handleChange} 
                roleOptions={roleOptions} 
                roleLabels={roleLabels} 
                theme={theme} 
                ShieldAlert={ShieldAlert} 
                setFormData={setFormData} 
            />
        </div>
    );
};

export default ManajemenPengguna;
