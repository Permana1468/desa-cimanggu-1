import React from 'react';

const RabHeader = ({ formatRupiah, grandTotal }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Penyusunan RAB Proyek</h2>
                <p className="text-gray-400 text-sm">Rincian Anggaran Biaya (Bahan, Alat, Upah) untuk pelaksanaan proyek desa.</p>
            </div>
            <div className="bg-[#1e293b]/60 border border-white/10 px-5 py-2.5 rounded-xl shadow-inner text-right">
                <span className="text-xs text-gray-400 block mb-0.5">Total Rancangan Anggaran</span>
                <span className="text-xl font-bold text-yellow-400 font-mono tracking-wider">{formatRupiah(grandTotal)}</span>
            </div>
        </div>
    );
};

export default RabHeader;
