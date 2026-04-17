import React from 'react';

const BukuKegiatanLPM = () => {
    return (
        <div className="relative bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 min-h-[60vh] flex flex-col items-center justify-center shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 flex items-center justify-center shadow-lg text-blue-400 text-4xl relative z-10">
                📚
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10 text-center">
                Buku Kegiatan LPM
            </h3>

            <p className="text-gray-400 text-center max-w-md leading-relaxed text-sm relative z-10">
                Modul pencatatan kegiatan harian dan log kerja LPM sedang dalam tahap sinkronisasi data.
            </p>
        </div>
    );
};

export default BukuKegiatanLPM;
