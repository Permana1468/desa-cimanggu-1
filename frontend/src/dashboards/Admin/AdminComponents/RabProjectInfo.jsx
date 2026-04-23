import React from 'react';

const RabProjectInfo = ({ proyekAktif }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>

            <div className="flex justify-between items-start">
                <div>
                    <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold tracking-wider mb-3">
                        KODE USULAN: {proyekAktif.usulan_id}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">{proyekAktif.judul}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">📍 {proyekAktif.lokasi || proyekAktif.unit_detail}</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-500 mb-1">Estimasi Pengajuan LPM</p>
                    <p className="text-sm text-gray-300 font-mono">Rp {parseFloat(proyekAktif.estimasi_biaya).toLocaleString('id-ID')}</p>
                </div>
            </div>
        </div>
    );
};

export default RabProjectInfo;
