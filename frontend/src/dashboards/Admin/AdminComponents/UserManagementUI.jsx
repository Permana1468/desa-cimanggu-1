import React from 'react';

export const UserSearch = ({ searchQuery, setSearchQuery, Search }) => {
    return (
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
    );
};

export const UserHeader = ({ handleOpenModal, UserPlus }) => {
    return (
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
    );
};
