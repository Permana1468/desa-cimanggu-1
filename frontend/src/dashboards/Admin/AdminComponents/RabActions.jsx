import React from 'react';

const RabActions = ({ isSaving, handleSave }) => {
    return (
        <div className="mt-8 flex justify-end gap-4">
            <button
                disabled={isSaving}
                className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
                🖨️ Cetak Draft PDF
            </button>
            <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? '⌛ Menyimpan...' : '💾 Simpan Draft RAB'}
            </button>
            <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? '⌛ Memproses...' : '📌 Kunci & Finalisasi'}
            </button>
        </div>
    );
};

export default RabActions;
