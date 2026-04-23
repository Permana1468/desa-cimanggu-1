import React from 'react';

const VerifikasiTable = ({ loading, usulanMasuk, setSelectedUsulan, setCatatanVerifikator, setKewenangan }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0f172a]/80 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                            <th className="py-4 px-6 font-semibold">Usulan ID & Pengusul</th>
                            <th className="py-4 px-6 font-semibold">Judul Program</th>
                            <th className="py-4 px-6 font-semibold text-center">Estimasi Biaya</th>
                            <th className="py-4 px-6 font-semibold text-center">Status</th>
                            <th className="py-4 px-6 font-semibold text-center">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400 italic">Memuat data...</td>
                            </tr>
                        ) : usulanMasuk.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400 italic">Belum ada usulan masuk.</td>
                            </tr>
                        ) : usulanMasuk.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6">
                                    <p className="font-mono text-xs text-blue-400 mb-1">{item.usulan_id}</p>
                                    <p className="font-bold text-white text-sm">{item.pengusul_nama || 'LPM'}</p>
                                    <p className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="font-medium text-white text-sm mb-1">{item.judul}</p>
                                    <p className="text-xs text-gray-400">{item.kategori} | {item.lokasi}</p>
                                </td>
                                <td className="py-4 px-6 text-center text-yellow-400 font-mono text-sm">
                                    Rp {parseFloat(item.estimasi_biaya || 0).toLocaleString('id-ID')}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${(item.status || 'MENUNGGU') === 'MENUNGGU' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse' :
                                        item.status === 'DISETUJUI' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {(item.status || 'MENUNGGU').replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <button
                                        onClick={() => {
                                            setSelectedUsulan(item);
                                            setCatatanVerifikator(item.catatan_verifikator || '');
                                            setKewenangan(item.kewenangan || '');
                                        }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition shadow-lg shadow-blue-500/20"
                                    >
                                        Evaluasi
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

export default VerifikasiTable;
