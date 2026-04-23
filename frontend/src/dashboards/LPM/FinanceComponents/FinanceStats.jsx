import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

const FinanceStats = ({ totalPemasukan, totalPengeluaran, saldo, formatRupiah }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Pemasukan</p>
                        <h3 className="text-2xl font-black text-blue-400">{formatRupiah(totalPemasukan)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <ArrowDownRight className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Pengeluaran</p>
                        <h3 className="text-2xl font-black text-red-400">{formatRupiah(totalPengeluaran)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-green-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Saldo Kas Wilayah</p>
                        <h3 className="text-2xl font-black text-green-400">{formatRupiah(saldo)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceStats;
