import React from 'react';
import { Calendar, Users } from 'lucide-react';

const ProgramTable = ({ loading, programs, getStatusStyle, getStatusIcon }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className=" overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0f172a]/80 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6 font-semibold">ID & Judul Program</th>
                            <th className="py-4 px-6 font-semibold">Pelaksanaan</th>
                            <th className="py-4 px-6 font-semibold">Peserta & Sasaran</th>
                            <th className="py-4 px-6 font-semibold">Status</th>
                            <th className="py-4 px-6 font-semibold text-center">Mentor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-500 animate-pulse">Memuat data program...</td></tr>
                        ) : programs.length === 0 ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-500 italic">Belum ada program pembinaan yang terdaftar.</td></tr>
                        ) : (
                            programs.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group cursor-default">
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-yellow-500/80 mb-0.5">{item.id_program}</span>
                                            <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{item.judul}</span>
                                            <span className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest">{item.kategori}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium flex items-center gap-1.5 text-sm">
                                                <Users className="w-3.5 h-3.5 text-gray-500" />
                                                {item.jumlah_peserta} Orang
                                            </span>
                                            <span className="text-[10px] text-gray-500 mt-1 italic line-clamp-1">{item.sasaran}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-max border ${getStatusStyle(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className="text-sm font-semibold text-gray-300 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
                                            {item.mentor}
                                        </span>
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

export default ProgramTable;
