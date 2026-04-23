import React from 'react';

const PejabatFormModal = ({ isModalOpen, setIsModalOpen, isSaving, handleSubmit, formData, handleChange }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#0f172a]/95 border-0 md:border md:border-white/10 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-up flex flex-col overflow-hidden">
                
                {/* Header Modal */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl shrink-0">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em]">Data Pejabat Baru</h3>
                        <p className="text-xs text-yellow-400/70 font-bold mt-1 tracking-widest uppercase">Perbarui Struktur Organisasi Desa</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl p-3 hover:bg-white/10 rounded-full transition-all transform hover:rotate-90">✕</button>
                </div>

                {/* Content Scroll Area */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* Nama Section */}
                        <div className="space-y-3">
                            <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Nama Lengkap (Beserta Gelar)</label>
                            <input 
                                required 
                                type="text" 
                                name="nama" 
                                value={formData.nama} 
                                onChange={handleChange} 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg font-bold focus:border-yellow-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" 
                                placeholder="Cth: Bpk. Hernawan, S.Pd." 
                            />
                        </div>

                        {/* Responsive Grid for Jabatan & Level */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Jabatan</label>
                                <input 
                                    required 
                                    type="text" 
                                    name="jabatan" 
                                    value={formData.jabatan} 
                                    onChange={handleChange} 
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all placeholder:text-gray-600" 
                                    placeholder="Cth: Kasi Pemerintahan" 
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Level Hierarki</label>
                                <div className="relative">
                                    <select 
                                        name="level" 
                                        value={formData.level} 
                                        onChange={handleChange} 
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="1">Level 1 (Kepala Desa)</option>
                                        <option value="2">Level 2 (Sekretaris Desa)</option>
                                        <option value="3">Level 3 (Kaur / Kasi)</option>
                                        <option value="4">Level 4 (Kepala Dusun)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Foto */}
                        <div className="space-y-3">
                            <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Upload Foto Resmi</label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    name="foto" 
                                    onChange={handleChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    accept="image/*" 
                                />
                                <div className="w-full px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all flex items-center gap-4">
                                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">👤</div>
                                    <span className="text-sm font-medium truncate">
                                        {formData.foto ? formData.foto.name : 'Pilih Foto Pejabat...'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="pt-6 flex flex-col md:flex-row justify-end gap-4 border-t border-white/5">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="order-2 md:order-1 px-8 py-4 rounded-2xl text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving} 
                                className="order-1 md:order-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:opacity-50 text-[#0f172a] font-black px-12 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                                        Memproses...
                                    </>
                                ) : (
                                    <>Simpan Data Pejabat 💾</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PejabatFormModal;
