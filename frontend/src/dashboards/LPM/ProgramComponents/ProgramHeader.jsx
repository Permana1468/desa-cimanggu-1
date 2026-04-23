import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';

const ProgramHeader = ({ unitDetail, setIsModalOpen }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                    <GraduationCap className="text-yellow-500 w-8 h-8" />
                    Program Pembinaan Masyarakat
                </h2>
                <p className="text-gray-400 text-sm">Kelola program pelatihan and pemberdayaan oleh LPM {unitDetail}.</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Tambah Program
            </button>
        </div>
    );
};

export default ProgramHeader;
