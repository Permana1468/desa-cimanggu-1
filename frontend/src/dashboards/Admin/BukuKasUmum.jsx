import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { 
    Wallet, ArrowDownRight, ArrowUpRight, Plus, 
    Search, Trash2, X, AlertCircle, 
    Printer, FileText, Loader2,
    Calendar, TrendingUp
} from 'lucide-react';

const StatCard = (props) => {
    const { icon: Icon, label, value, color, trend } = props;
    return (
        <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-2xl font-black text-white">{value}</h3>
            </div>
        </div>
    );
};

const BukuKasUmum = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        tipe: 'Pemasukan',
        sumber_dana: 'Dana Desa',
        nominal: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await api.get('/users/api/lpm/keuangan/');
            setTransactions(response.data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post('/users/api/lpm/keuangan/', formData);
            setShowModal(false);
            setFormData({
                judul: '',
                tipe: 'Pemasukan',
                sumber_dana: 'Dana Desa',
                nominal: '',
                tanggal: new Date().toISOString().split('T')[0],
                keterangan: ''
            });
            setLoading(true);
            fetchTransactions();
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    const totalIn = transactions.filter(k => k.tipe === 'Pemasukan').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const totalOut = transactions.filter(k => k.tipe === 'Pengeluaran').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const balance = totalIn - totalOut;

    const filteredData = transactions.filter(k => 
        (k.judul || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.sumber_dana || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 animate-pulse">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium tracking-widest uppercase text-center">Rekonsiliasi Buku Kas Umum...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-7 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1.5 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Wallet className="text-emerald-500" size={28} />
                        </div>
                        Buku Kas Umum
                    </h2>
                    <p className="text-white/45 text-sm font-medium">Laporan arus kas terpadu Desa Cimanggu I (APBDES & Swadaya).</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <Printer size={16} /> Cetak Laporan
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-none justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Catatan Baru
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard icon={ArrowDownRight} label="Total Pemasukan" value={formatRupiah(totalIn)} color="blue" trend="+8.4%" />
                <StatCard icon={ArrowUpRight} label="Total Pengeluaran" value={formatRupiah(totalOut)} color="rose" trend="+2.1%" />
                <StatCard icon={TrendingUp} label="Saldo Kas Saat Ini" value={formatRupiah(balance)} color="emerald" />
            </div>

            {/* Content Display */}
            <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.07] rounded-[24px] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-[13px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <FileText className="text-emerald-500/50" size={18} />
                        Jurnal Transaksi
                    </h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari transaksi..." 
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/[0.01]">
                                {['Waktu & Keterangan', 'Sumber Dana', 'Kategori', 'Nominal', 'Aksi'].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-white/10 italic font-medium"> Belum ada data transaksi tercatat. </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.tipe === 'Pemasukan' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                    {item.tipe === 'Pemasukan' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                                </div>
                                                <div>
                                                    <div className="text-[14px] font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">{item.judul}</div>
                                                    <div className="text-[11px] text-white/30 flex items-center gap-2">
                                                        <Calendar size={10} /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.sumber_dana === 'Dana Desa' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                                {item.sumber_dana}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[12px] font-bold text-white/50">{item.tipe}</div>
                                            <div className="text-[10px] text-white/20 truncate max-w-[150px]">{item.keterangan || 'Tanpa keterangan'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`text-[15px] font-black ${item.tipe === 'Pemasukan' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {item.tipe === 'Pemasukan' ? '+' : '-'} {formatRupiah(item.nominal)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#111827] border border-white/10 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-7 border-b border-white/[0.05] flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                    <Plus className="text-emerald-500" /> Catat Transaksi
                                </h3>
                                <p className="text-xs text-white/40 mt-1 font-medium italic">Sistem Akuntansi Terpadu Desa Cimanggu I</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-white/5 p-2 rounded-full text-white/30 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form id="add-transaction-form" onSubmit={handleSubmit} className="p-7 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Keterangan Transaksi</label>
                                <input 
                                    type="text" name="judul" required 
                                    value={formData.judul} onChange={handleInputChange}
                                    placeholder="Contoh: Penerimaan Dana Desa Tahap I"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/10 text-sm font-bold"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Tipe</label>
                                    <select 
                                        name="tipe" value={formData.tipe} onChange={handleInputChange}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="Pemasukan" className="bg-[#111827]">Pemasukan (+)</option>
                                        <option value="Pengeluaran" className="bg-[#111827]">Pengeluaran (-)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Sumber</label>
                                    <select 
                                        name="sumber_dana" value={formData.sumber_dana} onChange={handleInputChange}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="Dana Desa" className="bg-[#111827]">Dana Desa</option>
                                        <option value="Bantuan / Donasi" className="bg-[#111827]">Bantuan / Donasi</option>
                                        <option value="Swadaya Warga" className="bg-[#111827]">Swadaya Warga</option>
                                        <option value="Lainnya" className="bg-[#111827]">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Nominal (Rp)</label>
                                    <input 
                                        type="number" name="nominal" required 
                                        value={formData.nominal} onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold placeholder:text-white/10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Tanggal</label>
                                    <input 
                                        type="date" name="tanggal" required 
                                        value={formData.tanggal} onChange={handleInputChange}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[18px] px-5 py-3 text-white focus:border-emerald-500/50 outline-none transition-all text-sm font-bold cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" disabled={submitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:opacity-50 text-white font-black px-6 py-4 rounded-[18px] shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all text-sm uppercase tracking-[0.2em] mt-2 group"
                            >
                                {submitting ? 'Mengirim Data...' : (
                                    <span className="flex items-center justify-center gap-2">
                                        Validasi & Simpan Transaksi
                                        <TrendingUp size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>
                        
                        <div className="px-7 py-5 bg-white/[0.02] border-t border-white/[0.05] flex gap-3 items-start">
                            <AlertCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                                Catatan ini akan secara otomatis terlampir pada Laporan Realisasi APBDES Semesteran. Pastikan validitas data sebelum menyimpan.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BukuKasUmum;
