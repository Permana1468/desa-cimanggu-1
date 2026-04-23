import React from 'react';

const VerifikasiModal = ({ selectedUsulan, setSelectedUsulan, catatanVerifikator, setCatatanVerifikator, kewenangan, setKewenangan, handleApproval, navigate }) => {
    if (!selectedUsulan) return null;

    const renderFoto = (foto, idx) => {
        const fotoUrl = foto ? (foto.startsWith('http') ? foto : `http://127.0.0.1:8000${foto}`) : null;
        return (
            <div key={idx} className="aspect-video bg-black/20 rounded-xl overflow-hidden border border-white/5 group relative">
                {fotoUrl ? (
                    <img
                        src={fotoUrl}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.open(fotoUrl, '_blank')}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 italic">No Photo</div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">

                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">Review Usulan: {selectedUsulan.usulan_id}</h3>
                        <p className="text-xs text-gray-400 mt-1">Diajukan oleh: {selectedUsulan.pengusul_nama}</p>
                    </div>
                    <button onClick={() => {
                        setSelectedUsulan(null);
                        setCatatanVerifikator('');
                        setKewenangan('');
                    }} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed">
                        <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Deskripsi & Urgensi</h4>
                        {selectedUsulan.deskripsi}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Lokasi</h4>
                            <div className="bg-[#1e293b]/40 p-3 rounded-xl border border-white/5 text-white text-sm">
                                📍 {selectedUsulan.lokasi}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Estimasi Kasar</h4>
                            <div className="bg-[#1e293b]/40 p-3 rounded-xl border border-white/5 text-yellow-400 font-mono font-bold text-sm">
                                Rp {parseFloat(selectedUsulan.estimasi_biaya || 0).toLocaleString('id-ID')}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Volume Pekerjaan</h4>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-white text-sm font-semibold">
                                📏 {selectedUsulan.volume || '-'}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Koordinat Lokasi</h4>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-white font-mono text-[10px]">
                                📍 {selectedUsulan.titik_koordinat || 'Data tidak tersedia'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Dokumentasi Kondisi Lapangan</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {[selectedUsulan.foto_1, selectedUsulan.foto_2, selectedUsulan.foto_3].map((foto, idx) => renderFoto(foto, idx))}
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={catatanVerifikator}
                            onChange={(e) => setCatatanVerifikator(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-gray-300 focus:border-yellow-500 outline-none"
                            placeholder="Tambahkan catatan teknis atau alasan penolakan..."
                        ></textarea>
                    </div>

                    {selectedUsulan.status === 'MENUNGGU' && (
                        <div>
                            <h4 className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-2">Penentuan Kewenangan (Wajib sebelum Setuju)</h4>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setKewenangan('Desa')}
                                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${kewenangan === 'Desa'
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                >
                                    🏡 Desa (Mulai RAB)
                                </button>
                                <button
                                    onClick={() => setKewenangan('Kabupaten')}
                                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${kewenangan === 'Kabupaten'
                                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                >
                                    🏢 Kabupaten (Cek Rekap)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-[#0f172a] flex justify-end gap-4">
                    {selectedUsulan.status === 'MENUNGGU' ? (
                        <>
                            <button
                                onClick={() => handleApproval(selectedUsulan.id, 'Tolak')}
                                className="px-6 py-2.5 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 font-medium transition"
                            >
                                ❌ Tolak Usulan
                            </button>
                            <button
                                onClick={() => handleApproval(selectedUsulan.id, 'Setujui')}
                                disabled={!kewenangan}
                                className={`font-bold px-8 py-2.5 rounded-xl transition ${!kewenangan
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                    : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                                    }`}
                            >
                                ✅ Setujui & Proses
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center w-full justify-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                                    Status: <span className={`font-bold ${selectedUsulan.status === 'DISETUJUI' ? 'text-green-400' : 'text-red-400'}`}>{selectedUsulan.status}</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                                    Kewenangan: <span className="font-bold text-blue-400">{selectedUsulan.kewenangan || '-'}</span>
                                </div>
                                {selectedUsulan.status === 'DISETUJUI' && selectedUsulan.kewenangan === 'Desa' && (
                                    <button
                                        onClick={() => navigate(`/dashboard/rab?usulan_id=${selectedUsulan.id}`)}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-xl transition flex items-center gap-2 text-sm"
                                    >
                                        📐 Buat / Edit RAB
                                    </button>
                                )}
                                {selectedUsulan.status === 'DISETUJUI' && selectedUsulan.kewenangan === 'Kabupaten' && (
                                    <div className="px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 text-[10px] font-bold uppercase">
                                        Diteruskan ke Musrenbangcam
                                    </div>
                                )}
                            </div>
                            {selectedUsulan.catatan_verifikator && (
                                <p className="text-[10px] text-gray-400 italic">Catatan: {selectedUsulan.catatan_verifikator}</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VerifikasiModal;
