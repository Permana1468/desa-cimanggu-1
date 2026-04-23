import React from 'react';
import GrafikTracking from './GrafikTracking';

const UsulanDetailModal = ({ detailUsulan, setDetailUsulan }) => {
    if (!detailUsulan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">

                {/* Header Modal */}
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <div>
                        <h3 className="text-xl font-bold text-white leading-tight">Detail & Pelacakan Usulan</h3>
                        <p className="text-sm text-yellow-400 mt-1 font-mono uppercase">{detailUsulan.usulan_id}</p>
                    </div>
                    <button onClick={() => setDetailUsulan(null)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {/* BAGIAN 1: GRAFIK TRACKING */}
                    <div className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-6 md:px-10 mb-8 mt-2 pb-16">
                        <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-6 text-center">Status Perjalanan Pembangunan</h4>

                        <GrafikTracking status={detailUsulan.status} />

                        {/* Info Khusus Jika Ditolak */}
                        {detailUsulan.status === 'DITOLAK' && (
                            <div className="mt-12 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                                <span className="text-red-400 font-bold text-sm block mb-1">Usulan Ditolak / Perlu Revisi</span>
                                <span className="text-gray-300 text-xs italic">
                                    "{detailUsulan.catatan_verifikator || 'Harap hubungi kaur perencanaan untuk detail revisi.'}"
                                </span>
                            </div>
                        )}
                    </div>

                    {/* BAGIAN 2: DETAIL INFORMASI PROGRAM */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Judul Program</h4>
                                <p className="text-lg font-bold text-white">{detailUsulan.judul}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-gray-500 block mb-1">Kategori</span>
                                    <span className="text-sm text-blue-400 font-medium">{detailUsulan.kategori}</span>
                                </div>
                                <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-gray-500 block mb-1">Estimasi Biaya</span>
                                    <span className="text-sm text-yellow-400 font-bold">
                                        Rp {parseFloat(detailUsulan.estimasi_biaya || 0).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-gray-500 block mb-1">Volume</span>
                                    <span className="text-sm text-white font-semibold">{detailUsulan.volume || '-'}</span>
                                </div>
                                <div className="bg-[#1e293b]/40 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-gray-500 block mb-1">📍 Lokasi / Titik</span>
                                    <span className="text-[10px] text-gray-300 font-mono truncate block" title={detailUsulan.titik_koordinat}>
                                        {detailUsulan.titik_koordinat || 'Data tidak tersedia'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 mt-4">Alamat Lokasi Lengkap</h4>
                                <p className="text-sm text-white bg-[#1e293b]/40 p-4 rounded-xl border border-white/5 mb-4">
                                    {detailUsulan.alamat_lengkap || 'Tidak ada alamat lengkap'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Urgensi / Latar Belakang</h4>
                                <p className="text-sm text-gray-300 leading-relaxed bg-[#1e293b]/20 p-4 rounded-xl border border-white/5 italic">
                                    {detailUsulan.deskripsi}
                                </p>
                            </div>
                        </div>

                        {/* Kolom Kanan: Foto Dokumentasi */}
                        <div>
                            <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Dokumentasi Awal</h4>
                            <div className="space-y-3">
                                {[detailUsulan.foto_1, detailUsulan.foto_2, detailUsulan.foto_3].map((foto, idx) => (
                                    <div key={idx} className="aspect-video bg-[#1e293b]/60 border border-white/10 rounded-xl overflow-hidden group relative">
                                        {foto ? (
                                            <img
                                                src={typeof foto === 'string' && foto.startsWith('http') ? foto : `http://127.0.0.1:8000${foto}`}
                                                alt="Dokumentasi"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-pointer"
                                                onClick={() => window.open(typeof foto === 'string' && foto.startsWith('http') ? foto : `http://127.0.0.1:8000${foto}`, '_blank')}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                                <span className="text-xl opacity-20">📸</span>
                                                <span className="text-[10px] italic">No File</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UsulanDetailModal;
