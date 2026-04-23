import React from 'react';

const CashbookStats = ({ StatCard, ArrowDownRight, ArrowUpRight, TrendingUp, formatRupiah, totalIn, totalOut, balance }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard icon={ArrowDownRight} label="Total Pemasukan" value={formatRupiah(totalIn)} color="blue" trend="+8.4%" />
            <StatCard icon={ArrowUpRight} label="Total Pengeluaran" value={formatRupiah(totalOut)} color="rose" trend="+2.1%" />
            <StatCard icon={TrendingUp} label="Saldo Kas Saat Ini" value={formatRupiah(balance)} color="emerald" />
        </div>
    );
};

export default CashbookStats;
