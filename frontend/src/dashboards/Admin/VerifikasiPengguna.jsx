import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Search, ShieldCheck, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const VerifikasiPengguna = () => {
    const { theme } = useTheme();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setIsLoading(true);
        try {
            // Fetch all and filter for PENDING
            const response = await api.get('/users/api/admin/users/');
            const filtered = response.data.filter(u => u.status === 'PENDING' || u.is_verified === false);
            setPendingUsers(filtered);
        } catch (error) {
            console.error("Gagal memuat antrian verifikasi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (user) => {
        if (!window.confirm(`Setujui pendaftaran ${user.nama_lengkap || user.username}?`)) return;
        setIsProcessing(true);
        try {
            await api.patch(`/users/api/admin/users/${user.id}/`, {
                status: 'ACTIVE',
                is_verified: true
            });
            // Update local state
            setPendingUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (error) {
            console.error("Gagal menyetujui akun:", error);
            alert("Terjadi kesalahan saat verifikasi.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (user) => {
        if (!window.confirm(`Hapus/Tolak pendaftaran ${user.nama_lengkap || user.username}? Tindakan ini permanen.`)) return;
        setIsProcessing(true);
        try {
            await api.delete(`/users/api/admin/users/${user.id}/`);
            setPendingUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (error) {
            console.error("Gagal menolak akun:", error);
            alert("Gagal menghapus akun.");
        } finally {
            setIsProcessing(false);
        }
    };

    const filtered = pendingUsers.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in relative z-10 w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                        Verifikasi Pendaftaran
                        <span className="w-2 h-2 rounded-full bg-gold shadow-gold-glow animate-pulse" />
                    </h2>
                    <p className="text-text-muted text-[13px] font-medium mt-1 uppercase tracking-wider">
                        Tinjau & Setujui Akun Kelembagaan Baru
                    </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-gold-light border border-gold-border rounded-2xl">
                    <ShieldCheck size={18} className="text-gold" />
                    <span className="text-gold font-black text-xs uppercase tracking-widest">
                        {pendingUsers.length} Antrian Pending
                    </span>
                </div>
            </div>

            {/* Search Input */}
            <div className="bg-dark-card backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari nama, username atau role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/5 rounded-2xl pl-14 pr-5 py-3.5 text-text-main outline-none focus:ring-1 focus:ring-gold-border transition-all placeholder:text-text-quaternary font-medium"
                    />
                </div>
            </div>

            {/* List Section */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-dark-card rounded-3xl border border-white/5 backdrop-blur-md">
                    <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
                    <p className="text-text-tertiary font-black text-xs uppercase tracking-widest">Sinkronisasi Database...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-dark-card rounded-3xl border border-white/5 backdrop-blur-md text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <UserCheck size={40} className="text-text-tertiary opacity-30" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main">Antrian Kosong</h3>
                    <p className="text-text-muted text-sm mt-1 max-w-xs">Semua pendaftaran sudah diverifikasi atau belum ada akun kelembagaan baru.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map((user) => (
                        <div key={user.id} className="group bg-dark-card backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 lg:p-4 shadow-2xl hover:border-gold-border/40 transition-all duration-500 overflow-hidden relative">
                             {/* Acccent Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] pointer-events-none group-hover:bg-gold/10 transition-all"></div>
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                {/* Left Side: Avatar & Role */}
                                <div className="flex flex-col items-center gap-3 shrink-0">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-gray-800 to-gray-700 p-[1px]">
                                        <div className="w-full h-full rounded-[23px] bg-dark-base flex items-center justify-center overflow-hidden">
                                            {user.foto_profil ? (
                                                <img src={user.foto_profil} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-black text-text-main group-hover:scale-110 transition-transform">{user.username.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-gold-light border border-gold-border text-gold text-[10px] font-black tracking-widest rounded-full uppercase">
                                        {user.role}
                                    </span>
                                </div>

                                {/* Right Side: Details & Actions */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-black text-text-main leading-none">{user.nama_lengkap || user.username}</h4>
                                            <p className="text-text-muted text-xs mt-1.5 font-medium flex items-center gap-1.5">
                                                <Mail size={12} className="text-gold" /> {user.email || 'Email tidak dilampirkan'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-tighter">Unit Kerja:</span>
                                            <span className="text-[12px] font-bold text-text-main">{user.unit_detail || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Phone size={14} className="text-text-tertiary" />
                                            <span className="text-[11.5px] font-bold">{user.nomor_telepon || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Calendar size={14} className="text-text-tertiary" />
                                            <span className="text-[11.5px] font-bold">19 Apr 2026</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => handleApprove(user)}
                                            disabled={isProcessing}
                                            className="flex-1 bg-gold hover:bg-gold-dark text-black h-12 rounded-2xl flex items-center justify-center gap-2 font-black text-[13px] shadow-gold-glow transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                        >
                                            <UserCheck size={18} />
                                            SETUJUI AKUN
                                        </button>
                                        <button 
                                            onClick={() => handleReject(user)}
                                            disabled={isProcessing}
                                            className="w-12 h-12 bg-white/5 border border-white/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                                            title="Hapus / Tolak"
                                        >
                                            <UserX size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VerifikasiPengguna;
