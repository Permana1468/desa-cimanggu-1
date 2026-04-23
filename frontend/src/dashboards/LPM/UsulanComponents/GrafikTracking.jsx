import React from 'react';

const GrafikTracking = ({ status }) => {
    // Definisi urutan langkah pembangunan
    const steps = [
        { title: 'Pengajuan', desc: 'Usulan Masuk', icon: '📝' },
        { title: 'Verifikasi', desc: 'Kaur Perencanaan', icon: '🔍' },
        { title: 'Perencanaan', desc: 'Pembuatan RAB & DED', icon: '📐' },
        { title: 'Anggaran', desc: 'Pencairan Dana', icon: '💰' },
        { title: 'Pelaksanaan', desc: 'Proyek Berjalan', icon: '🏗️' }
    ];

    // Map Backend Status to Stepper Status
    let displayStatus = status;
    if (status === 'MENUNGGU') displayStatus = 'Menunggu Review';
    if (status === 'DISETUJUI') displayStatus = 'Disetujui Kaur';
    if (status === 'DITOLAK') displayStatus = 'Ditolak';

    // Logika penentuan langkah mana yang aktif berdasarkan status text
    let activeStepIndex = 0;
    let isRejected = displayStatus === 'Ditolak';

    if (displayStatus === 'Menunggu Review') activeStepIndex = 1;
    if (displayStatus === 'Disetujui Kaur') activeStepIndex = 2; // Berarti sedang di tahap Perencanaan
    if (displayStatus === 'Pencairan') activeStepIndex = 3;
    if (displayStatus === 'Pelaksanaan') activeStepIndex = 4;
    if (displayStatus === 'Selesai') activeStepIndex = 5;

    return (
        <div className="w-full py-6 md:py-8 px-4 md:px-12 bg-[#0f172a]/30 rounded-2xl border border-white/5 my-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Garis Latar Belakang (Abu-abu) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700/50 rounded-full z-0"></div>

                {/* Garis Progres (Warna menyala) */}
                <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-1000 ${isRejected ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        }`}
                    style={{ width: `${isRejected ? (activeStepIndex / (steps.length - 1)) * 100 : (Math.min(activeStepIndex, steps.length - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Lingkaran Titik (Steps) */}
                {steps.map((step, index) => {
                    let stepStatus = 'pending'; // pending, active, completed, rejected
                    if (isRejected && index === activeStepIndex) stepStatus = 'rejected';
                    else if (index < activeStepIndex) stepStatus = 'completed';
                    else if (index === activeStepIndex && !isRejected) stepStatus = 'active';

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center group">
                            {/* Lingkaran Ikon */}
                            <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm md:text-base border-4 transition-all duration-500 ${stepStatus === 'completed' ? 'bg-green-500 border-[#0f172a] text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]' :
                                stepStatus === 'active' ? 'bg-yellow-500 border-[#0f172a] text-[#0f172a] shadow-[0_0_20px_rgba(234,179,8,0.8)] animate-pulse' :
                                    stepStatus === 'rejected' ? 'bg-red-500 border-[#0f172a] text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]' :
                                        'bg-gray-800 border-gray-600 text-gray-500' // Pending
                                }`}>
                                {stepStatus === 'completed' ? '✓' : stepStatus === 'rejected' ? '✕' : step.icon}
                            </div>

                            {/* Teks Keterangan */}
                            <div className="absolute top-12 w-20 md:w-24 text-center">
                                <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 ${stepStatus === 'active' ? 'text-yellow-400' :
                                    stepStatus === 'rejected' ? 'text-red-400' :
                                        stepStatus === 'completed' ? 'text-green-400' : 'text-gray-500'
                                    }`}>
                                    {step.title}
                                </p>
                                <p className="text-[8px] text-gray-400 hidden lg:block leading-tight font-medium">{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GrafikTracking;
