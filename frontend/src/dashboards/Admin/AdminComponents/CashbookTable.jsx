import React from 'react';
import { Search, FileText, ArrowDownRight, ArrowUpRight, Calendar, Trash2 } from 'lucide-react';

const CashbookTable = ({ searchTerm, setSearchTerm, filteredData, formatRupiah }) => {
    return (
        <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.07] rounded-[24px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <FileText className="text-emerald-500/50" size={18} />
                    Jurnal Transaksi
                </h3>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cari transaksi..." 
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-white/[0.01]">
                            {['Waktu & Keterangan', 'Sumber Dana', 'Kategori', 'Nominal', 'Aksi'].map(h => (
                                <th key={h} className="px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-white/10 italic font-medium"> Belum ada data transaksi tercatat. </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.tipe === 'Pemasukan' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                {item.tipe === 'Pemasukan' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">{item.judul}</div>
                                                <div className="text-[11px] text-white/30 flex items-center gap-2">
                                                    <Calendar size={10} /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.sumber_dana === 'Dana Desa' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                            {item.sumber_dana}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-[12px] font-bold text-white/50">{item.tipe}</div>
                                        <div className="text-[10px] text-white/20 truncate max-w-[150px]">{item.keterangan || 'Tanpa keterangan'}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`text-[15px] font-black ${item.tipe === 'Pemasukan' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {item.tipe === 'Pemasukan' ? '+' : '-'} {formatRupiah(item.nominal)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                            <Trash2 size={14} />
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

export default CashbookTable;
