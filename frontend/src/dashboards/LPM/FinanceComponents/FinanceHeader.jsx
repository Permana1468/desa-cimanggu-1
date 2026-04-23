import React from 'react';
import { Plus } from 'lucide-react';

const FinanceHeader = ({ setShowModal }) => {
    return (
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Dana Desa & Swadaya</h2>
                <p className="text-gray-400 text-sm">Catatan finansial proyek dan partisipasi wilayah Anda.</p>
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all group"
            >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Tambah Catatan
            </button>
        </div>
    );
};

export default FinanceHeader;
