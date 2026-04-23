import React from 'react';

const AdminHero = ({ theme, user, timeStr, dateStr }) => {
    return (
        <div className={`relative border border-white/[0.08] rounded-3xl px-9 py-8 mb-7 overflow-hidden transition-all duration-700
                        shadow-[0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]
                        ${theme === 'dark' 
                            ? 'bg-gradient-to-br from-[rgba(15,23,42,0.95)] via-[rgba(23,37,84,0.9)] to-[rgba(30,58,138,0.7)]' 
                            : 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white'}`}>
            
            {/* Decorative glows */}
            <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px]
                            bg-[radial-gradient(circle,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-20 left-[30%] w-80 h-[200px]
                            bg-[radial-gradient(ellipse,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

            <div className="relative flex items-start justify-between flex-wrap gap-6">
                <div>
                    <div className={`inline-flex items-center gap-1.5 border rounded-full px-3.5 py-1 text-[11px] font-bold tracking-[0.08em] uppercase mb-3.5
                                    ${theme === 'dark' ? 'bg-amber-500/[0.12] border-amber-500/25 text-amber-500' : 'bg-white/20 border-white/30 text-white'}`}>
                        <span className={`w-[7px] h-[7px] rounded-full animate-[pulse-dot_1.5s_infinite] ${theme === 'dark' ? 'bg-amber-500' : 'bg-white'}`}  />
                        Sistem Aktif · Panel Admin
                    </div>
                    <h1 className="text-[28px] font-extrabold text-white leading-tight tracking-tight mb-1.5">
                        Selamat Datang, <span className={theme === 'dark' ? 'text-gold' : 'text-amber-200'}>{user?.username || 'Admin'}!</span>
                    </h1>
                    <p className={`text-[13.5px] ${theme === 'dark' ? 'text-white/45' : 'text-white/80'}`}>
                        Dashboard Administrasi &nbsp;·&nbsp;
                        <strong className={theme === 'dark' ? 'text-white/60' : 'text-white'}>Desa Cimanggu I</strong>, Kab. Bogor
                    </p>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-extrabold text-white tabular-nums tracking-tight leading-none
                                    ${theme === 'dark' ? 'drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'drop-shadow-lg'}`}>
                        {timeStr}
                    </div>
                    <div className={`text-xs mt-1 capitalize ${theme === 'dark' ? 'text-white/40' : 'text-white/70'}`}>{dateStr}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminHero;
