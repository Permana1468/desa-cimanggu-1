import React from 'react';

const UserTable = ({ isLoading, filteredUsers, roleLabels, formatLastActive, handleResetPassword, handleOpenModal, handleDelete, KeyRound, Edit, Trash2 }) => {
    return (
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
    );
};

export default UserTable;
