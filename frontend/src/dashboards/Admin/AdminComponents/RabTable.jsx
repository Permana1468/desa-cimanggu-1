import React from 'react';

const RabTable = ({ rabItems, handleItemChange, tambahBarisBaru, hapusBaris, formatRupiah, hitungTotalBaris, grandTotal }) => {
    return (
        <>
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border-x border-t border-white/10 rounded-t-2xl p-5 flex justify-between items-center shadow-lg">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>🧾</span> Rincian Item Pekerjaan
                </h3>
                <button onClick={tambahBarisBaru} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
                    <span>+</span> Tambah Baris
                </button>
            </div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-b-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1e293b]/80 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-4 font-semibold w-12 text-center">No</th>
                                <th className="py-4 px-4 font-semibold w-48">Kategori</th>
                                <th className="py-4 px-4 font-semibold">Uraian / Nama Barang</th>
                                <th className="py-4 px-4 font-semibold w-24 text-center">Vol</th>
                                <th className="py-4 px-4 font-semibold w-24 text-center">Satuan</th>
                                <th className="py-4 px-4 font-semibold w-40 text-right">Harga Satuan</th>
                                <th className="py-4 px-4 font-semibold w-40 text-right">Total Harga</th>
                                <th className="py-4 px-4 font-semibold w-16 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rabItems.map((item, index) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-2 px-4 text-center text-sm text-gray-500">{index + 1}</td>
                                    <td className="py-2 px-4">
                                        <select
                                            value={item.kategori}
                                            onChange={(e) => handleItemChange(item.id, 'kategori', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-gray-300 outline-none transition appearance-none cursor-pointer"
                                        >
                                            <option className="bg-gray-800">Bahan Material</option>
                                            <option className="bg-gray-800">Upah Tenaga Kerja</option>
                                            <option className="bg-gray-800">Sewa Alat</option>
                                            <option className="bg-gray-800">Operasional</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="text"
                                            value={item.uraian}
                                            onChange={(e) => handleItemChange(item.id, 'uraian', e.target.value)}
                                            placeholder="Masukkan nama barang..."
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-white outline-none transition placeholder-gray-600"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="number"
                                            value={item.volume === 0 ? '' : item.volume}
                                            onChange={(e) => handleItemChange(item.id, 'volume', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-center text-white outline-none transition"
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="text"
                                            value={item.satuan}
                                            onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                                            placeholder="Zak, M3, HOK"
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded px-2 py-1.5 text-sm text-center text-gray-300 outline-none transition uppercase"
                                        />
                                    </td>
                                    <td className="py-2 px-4 relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                        <input
                                            type="number"
                                            value={item.harga_satuan === 0 ? '' : item.harga_satuan}
                                            onChange={(e) => handleItemChange(item.id, 'harga_satuan', e.target.value)}
                                            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-yellow-500 rounded pl-8 pr-2 py-1.5 text-sm text-right text-white outline-none transition font-mono"
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-right font-mono font-bold text-yellow-400 text-sm bg-black/20">
                                        {formatRupiah(hitungTotalBaris(item.volume, item.harga_satuan))}
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <button onClick={() => hapusBaris(item.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition opacity-0 group-hover:opacity-100">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#1e293b]/60 border-t border-white/10 p-5 flex justify-end items-center gap-6">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Grand Total RAB :</span>
                    <span className="text-2xl font-bold text-yellow-400 font-mono bg-[#0f172a] px-6 py-2 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        {formatRupiah(grandTotal)}
                    </span>
                </div>
            </div>
        </>
    );
};

export default RabTable;
