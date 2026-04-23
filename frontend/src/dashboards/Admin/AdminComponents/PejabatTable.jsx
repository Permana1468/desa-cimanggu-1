import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

const PejabatTable = ({ isLoading, pejabatList, handlePrintID, handleDelete }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0f172a]/60 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6 font-semibold">Foto</th>
                            <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
                            <th className="py-4 px-6 font-semibold">Jabatan</th>
                            <th className="py-4 px-6 font-semibold text-center">ID / QR Code</th>
                            <th className="py-4 px-6 font-semibold text-center">Hierarki (Level)</th>
                            <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400">Memuat data struktur organisasi...</td>
                            </tr>
                        ) : pejabatList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400">Belum ada data struktur organisasi.</td>
                            </tr>
                        ) : (
                            pejabatList.map((pejabat) => (
                                <tr key={pejabat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-3 px-6">
                                        {pejabat.foto ? (
                                            <img src={pejabat.foto} alt={pejabat.nama} className="w-10 h-10 object-cover rounded-lg border border-white/20" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-700 rounded-lg border border-white/20 flex items-center justify-center text-xs overflow-hidden">
                                                👤
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 font-medium text-white">{pejabat.nama}</td>
                                    <td className="py-4 px-6 text-yellow-400 font-medium">{pejabat.jabatan}</td>
                                    <td className="py-4 px-6 flex flex-col items-center justify-center gap-2">
                                        {pejabat.id_unik ? (
                                            <>
                                                <div className="bg-white p-1 rounded-lg">
                                                    <QRCodeSVG id={`qr-${pejabat.id}`} value={pejabat.id_unik} size={60} level="M" />
                                                </div>
                                                <div className="text-xs font-mono text-gray-400 font-bold">{pejabat.id_unik}</div>
                                                <button
                                                    onClick={() => handlePrintID(pejabat)}
                                                    className="mt-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1.5 rounded-lg border border-yellow-500/30 flex items-center gap-1 transition-all"
                                                    title="Cetak ID Card"
                                                >
                                                    <Printer className="w-3.5 h-3.5" /> Cetak ID
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-xs italic">ID belum di-generate</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-400">Level {pejabat.level}</td>
                                    <td className="py-4 px-6 flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity mt-1">
                                        <button onClick={() => handleDelete(pejabat.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Hapus</button>
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

export default PejabatTable;
