import React from 'react';

const UsulanTable = ({ usulanList, loading, getStatusColor, setDetailUsulan }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0f172a]/80 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6 font-semibold">ID Usulan</th>
                            <th className="py-4 px-6 font-semibold">Judul Program & Lokasi</th>
                            <th className="py-4 px-6 font-semibold">Kategori</th>
                            <th className="py-4 px-6 font-semibold">Status Persetujuan</th>
                            <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400 italic">Memuat data...</td>
                            </tr>
                        ) : usulanList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400 italic">Belum ada usulan yang Anda buat.</td>
                            </tr>
                        ) : usulanList.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setDetailUsulan(item)}>
                                <td className="py-4 px-6 font-mono text-xs text-gray-400 uppercase">
                                    {item.usulan_id}
                                </td>
                                <td className="py-4 px-6">
                                    <p className="font-bold text-white text-sm mb-1">{item.judul}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">📍 {item.lokasi}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                        {item.kategori}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 w-max border ${getStatusColor(item.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'MENUNGGU' ? 'bg-yellow-400 animate-pulse' : (item.status === 'DISETUJUI' ? 'bg-green-400' : 'bg-red-400')}`}></span>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 mx-auto bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 group-hover:bg-blue-500/10 transition-all font-bold">
                                        Lacak ➜
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsulanTable;
