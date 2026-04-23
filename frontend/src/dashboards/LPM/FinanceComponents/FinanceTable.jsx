import React from 'react';
import { Search, Filter, Trash2, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const FinanceTable = ({ searchTerm, setSearchTerm, loading, filteredData, formatRupiah, handleDelete }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📋</span> Riwayat Transaksi
                </h3>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Cari catatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                    <button className="bg-[#0f172a]/80 border border-white/10 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                        <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs uppercase text-gray-400 tracking-wider">
                            <th className="py-3 px-4 font-semibold">TANGGAL</th>
                            <th className="py-3 px-4 font-semibold">JUDUL</th>
                            <th className="py-3 px-4 font-semibold">SUMBER</th>
                            <th className="py-3 px-4 font-semibold">TIPE</th>
                            <th className="py-3 px-4 font-semibold text-right">NOMINAL</th>
                            <th className="py-3 px-4 font-semibold text-center">AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-500 animate-pulse">Memuat data keuangan...</td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-500">Belum ada catatan keuangan yang sesuai.</td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-4 text-sm text-gray-300">{item.tanggal}</td>
                                    <td className="py-4 px-4">
                                        <p className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{item.judul}</p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.keterangan}</p>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-300">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.sumber_dana === 'Swadaya Warga' ? 'bg-purple-500/20 text-purple-400' : 'bg-[#0f172a] border border-white/10 text-gray-400'}`}>
                                            {item.sumber_dana}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {item.tipe === 'Pemasukan' ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-lg">
                                                <ArrowDownRight className="w-3 h-3" /> Pemasukan
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-lg">
                                                <ArrowUpRight className="w-3 h-3" /> Pengeluaran
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-bold text-right text-gray-200">
                                        {formatRupiah(item.nominal)}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Hapus Catatan"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceTable;
