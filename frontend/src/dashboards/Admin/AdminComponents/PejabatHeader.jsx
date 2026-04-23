import React from 'react';

const PejabatHeader = ({ setIsModalOpen }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Struktur Organisasi</h2>
                <p className="text-gray-400 text-sm">Kelola susunan pejabat Pemdes Cimanggu I untuk bagan Landing Page.</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
            >
                <span>+</span> Tambah Pejabat
            </button>
        </div>
    );
};

export default PejabatHeader;
