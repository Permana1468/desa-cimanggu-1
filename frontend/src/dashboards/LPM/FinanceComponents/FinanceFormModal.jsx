import React from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';

const FinanceFormModal = ({ showModal, setShowModal, handleSubmit, formData, handleInputChange, submitting }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1e293b] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/40">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Plus className="w-6 h-6 text-yellow-500" /> Tambah Catatan Keuangan
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Transaksi</label>
                            <input 
                                type="text" name="judul" required 
                                value={formData.judul} onChange={handleInputChange}
                                placeholder="Contoh: Pembelian Semen RT 01"
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe</label>
                            <select 
                                name="tipe" value={formData.tipe} onChange={handleInputChange}
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                            >
                                <option value="Pemasukan">Pemasukan</option>
                                <option value="Pengeluaran">Pengeluaran</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Dana</label>
                            <select 
                                name="sumber_dana" value={formData.sumber_dana} onChange={handleInputChange}
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                            >
                                <option value="Dana Desa">Dana Desa</option>
                                <option value="Bantuan / Donasi">Bantuan / Donasi</option>
                                <option value="Swadaya Warga">Swadaya Warga</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nominal (Rp)</label>
                            <input 
                                type="number" name="nominal" required 
                                value={formData.nominal} onChange={handleInputChange}
                                placeholder="0"
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</label>
                            <input 
                                type="date" name="tanggal" required 
                                value={formData.tanggal} onChange={handleInputChange}
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5 col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan (Opsional)</label>
                            <textarea 
                                name="keterangan" rows="2"
                                value={formData.keterangan} onChange={handleInputChange}
                                className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" onClick={() => setShowModal(false)}
                            className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-all text-sm"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" disabled={submitting}
                            className="flex-[2] bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-800 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition-all text-sm"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Catatan'}
                        </button>
                    </div>
                </form>
                
                <div className="bg-yellow-500/5 p-4 flex gap-3 items-start border-t border-white/5">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-yellow-500/80 leading-relaxed font-medium">
                        Pastikan data yang dimasukkan sesuai dengan bukti fisik kwitansi atau laporan wilayah Anda. Data ini akan memengaruhi laporan realisasi anggaran desa.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinanceFormModal;
