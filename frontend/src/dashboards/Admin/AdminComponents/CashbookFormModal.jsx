import React from 'react';
import { Plus, X, AlertCircle, TrendingUp } from 'lucide-react';

const CashbookFormModal = ({ showModal, setShowModal, handleSubmit, formData, handleInputChange, submitting }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111827] border border-white/10 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-7 border-b border-white/[0.05] flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-3">
                            <Plus className="text-emerald-500" /> Catat Transaksi
                        </h3>
                        <p className="text-xs text-white/40 mt-1 font-medium italic">Sistem Akuntansi Terpadu Desa Cimanggu I</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="bg-white/5 p-2 rounded-full text-white/30 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>
                
                <form id="add-transaction-form" onSubmit={handleSubmit} className="p-7 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Keterangan Transaksi</label>
                        <input 
                            type="text" name="judul" required 
                            value={formData.judul} onChange={handleInputChange}
                            placeholder="Contoh: Penerimaan Dana Desa Tahap I"
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/10 text-sm font-bold"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Tipe</label>
                            <select 
                                name="tipe" value={formData.tipe} onChange={handleInputChange}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                            >
                                <option value="Pemasukan" className="bg-[#111827]">Pemasukan (+)</option>
                                <option value="Pengeluaran" className="bg-[#111827]">Pengeluaran (-)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Sumber</label>
                            <select 
                                name="sumber_dana" value={formData.sumber_dana} onChange={handleInputChange}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                            >
                                <option value="Dana Desa" className="bg-[#111827]">Dana Desa</option>
                                <option value="Bantuan / Donasi" className="bg-[#111827]">Bantuan / Donasi</option>
                                <option value="Swadaya Warga" className="bg-[#111827]">Swadaya Warga</option>
                                <option value="Lainnya" className="bg-[#111827]">Lainnya</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Nominal (Rp)</label>
                            <input 
                                type="number" name="nominal" required 
                                value={formData.nominal} onChange={handleInputChange}
                                placeholder="0"
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Tanggal</label>
                            <input 
                                type="date" name="tanggal" required 
                                value={formData.tanggal} onChange={handleInputChange}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold cursor-pointer"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={submitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:opacity-50 text-white font-black px-6 py-4 rounded-[18px] shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm uppercase tracking-[0.2em] mt-2 group"
                    >
                        {submitting ? 'Mengirim Data...' : (
                            <span className="flex items-center justify-center gap-2">
                                Validasi & Simpan Transaksi
                                <TrendingUp size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>
                
                <div className="px-7 py-5 bg-white/[0.02] border-t border-white/[0.05] flex gap-3 items-start">
                    <AlertCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                        Catatan ini akan secara otomatis terlampir pada Laporan Realisasi APBDES Semesteran. Pastikan validitas data sebelum menyimpan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CashbookFormModal;
