import React from 'react';

const UsulanHeader = ({ setIsModalOpen }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Usulan Pembangunan (Musrenbang)</h2>
                <p className="text-gray-400 text-sm">Ajukan rancangan program dan pantau status persetujuan dari Kaur Perencanaan.</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
            >
                <span>+</span> Buat Usulan Baru
            </button>
        </div>
    );
};

export default UsulanHeader;
