import React from 'react';

const ProgramFormModal = ({ isModalOpen, setIsModalOpen, unitDetail, handleSubmit, formData, handleInputChange }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <div>
                        <h3 className="text-lg font-bold text-white">Daftarkan Program Pembinaan</h3>
                        <p className="text-xs text-gray-400">Penyelenggara: LPM {unitDetail}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Judul Program</label>
                            <input
                                type="text"
                                name="judul"
                                required
                                value={formData.judul}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="Misal: Pelatihan Digital Marketing UMKM"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition cursor-pointer"
                            >
                                <option>Pelatihan Teknik</option>
                                <option>Pemberdayaan Wanita</option>
                                <option>Pemuda & Olahraga</option>
                                <option>Kesehatan Masyarakat</option>
                                <option>Lingkungan Hidup</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tanggal Pelaksanaan</label>
                            <input
                                type="date"
                                name="tanggal_pelaksanaan"
                                required
                                value={formData.tanggal_pelaksanaan}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Mentor / Narasumber</label>
                            <input
                                type="text"
                                name="mentor"
                                required
                                value={formData.mentor}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="Nama Mentor"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Jumlah Peserta</label>
                            <input
                                type="number"
                                name="jumlah_peserta"
                                required
                                value={formData.jumlah_peserta}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="0"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Sasaran / Target Masyarakat</label>
                            <input
                                type="text"
                                name="sasaran"
                                required
                                value={formData.sasaran}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="Misal: Pel pelaku UMKM RW 01 - 04"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Status Program</label>
                            <div className="flex gap-4">
                                {['Direncanakan', 'Berjalan', 'Selesai'].map((s) => (
                                    <label key={s} className="flex-1 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={s}
                                            checked={formData.status === s}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <div className={`py-3 text-center rounded-xl border-2 transition-all ${formData.status === s ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-transparent border-white/5 text-gray-500 group-hover:border-white/10'}`}>
                                            {s}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 transition font-semibold">Batal</button>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.4)]">Daftarkan Program</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgramFormModal;
