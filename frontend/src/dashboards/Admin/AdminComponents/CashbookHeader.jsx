import React from 'react';
import { Wallet, Printer, Plus } from 'lucide-react';

const CashbookHeader = ({ setShowModal }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-1.5 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Wallet className="text-emerald-500" size={28} />
                    </div>
                    Buku Kas Umum
                </h2>
                <p className="text-white/45 text-sm font-medium">Laporan arus kas terpadu Desa Cimanggu I (APBDES & Swadaya).</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                    <Printer size={16} /> Cetak Laporan
                </button>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex-1 md:flex-none justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Catatan Baru
                </button>
            </div>
        </div>
    );
};

export default CashbookHeader;
