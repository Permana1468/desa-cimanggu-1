import React from 'react';

const UsulanFormModal = ({ isModalOpen, setIsModalOpen, formData, handleInputChange, handleFileChange, handleSubmit, user }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <h3 className="text-lg font-bold text-white">Formulir Usulan Musrenbang</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Judul Program / Kegiatan</label>
                        <input
                            type="text"
                            name="judul"
                            required
                            value={formData.judul}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                            placeholder="Cth: Pembuatan Sumur Bor Air Bersih..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Kategori Pembangunan</label>
                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition appearance-none cursor-pointer"
                            >
                                <option>Infrastruktur & Fisik</option>
                                <option>Fasilitas Kesehatan</option>
                                <option>Pemberdayaan Ekonomi</option>
                                <option>Pendidikan & Sosial</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Lokasi Wilayah (Otomatis)</label>
                            <div className="w-full px-4 py-3 bg-[#0f172a] border border-white/5 rounded-xl text-gray-400 cursor-not-allowed flex items-center gap-2">
                                <span>🔒</span> {user?.unit_detail || 'Wilayah LPM'}
                            </div>
                            <p className="text-xs text-yellow-500/70 mt-1">Lokasi dikunci sesuai wewenang akun Anda.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Alamat Lokasi Lengkap</label>
                        <textarea
                            name="alamat_lengkap"
                            required
                            value={formData.alamat_lengkap}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-gray-300 focus:border-yellow-500 outline-none leading-relaxed"
                            placeholder="Cth: Jl. Raya Cimanggu No. 123, RT 01/RW 05..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Latar Belakang / Urgensi Usulan</label>
                        <textarea
                            name="deskripsi"
                            required
                            value={formData.deskripsi}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-gray-300 focus:border-yellow-500 outline-none leading-relaxed"
                            placeholder="Jelaskan mengapa program ini sangat dibutuhkan warga..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Volume (Cth: 75 Meter / 1 Unit)</label>
                            <input
                                type="text"
                                name="volume"
                                required
                                value={formData.volume}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="Contoh: 200 x 1.2 x 0.10 M"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Titik Koordinat (Opsional)</label>
                            <input
                                type="text"
                                name="titik_koordinat"
                                value={formData.titik_koordinat}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="Contoh: -7.123, 108.456"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Estimasi Kasar Biaya (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                            <input
                                type="number"
                                name="estimasi_biaya"
                                required
                                value={formData.estimasi_biaya}
                                onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                placeholder="15000000"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Foto Kondisi Lapangan (Maks. 3 Foto)</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                <label className="block text-[10px] text-gray-500 uppercase mb-2">Foto Utama</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'foto_1')}
                                    className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                />
                            </div>
                            <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                <label className="block text-[10px] text-gray-500 uppercase mb-2">Detail 1</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'foto_2')}
                                    className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                />
                            </div>
                            <div className="bg-[#1e293b]/30 p-3 rounded-xl border border-white/5">
                                <label className="block text-[10px] text-gray-500 uppercase mb-2">Detail 2</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'foto_3')}
                                    className="block w-full text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 transition">Batal</button>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(234,179,8,0.3)]">Kirim Usulan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsulanFormModal;
