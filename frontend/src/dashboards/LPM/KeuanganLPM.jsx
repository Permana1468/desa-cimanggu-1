import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Search, Filter, Trash2, X, AlertCircle } from 'lucide-react';

const KeuanganLPM = () => {
    const { user } = useContext(AuthContext);
    const [keuangan, setKeuangan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk Modal Tambah
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

    useEffect(() => {
        fetchKeuangan();
    }, []);

    const fetchKeuangan = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/lpm/keuangan/');
            setKeuangan(response.data);
        } catch (error) {
            console.error("Error fetching Keuangan LPM:", error);
        } finally {
            setLoading(false);
        }
    };

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
            fetchKeuangan();
        } catch (error) {
            console.error("Error adding keuangan:", error);
            alert("Gagal menambahkan catatan. Pastikan semua field terisi dengan benar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
        try {
            await api.delete(`/users/api/lpm/keuangan/${id}/`);
            fetchKeuangan();
        } catch (error) {
            console.error("Error deleting keuangan:", error);
            alert("Gagal menghapus catatan.");
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka || 0);
    };

    const totalPemasukan = keuangan.filter(k => k.tipe === 'Pemasukan').reduce((sum, k) => sum + parseFloat(k.nominal), 0);
    const totalPengeluaran = keuangan.filter(k => k.tipe === 'Pengeluaran').reduce((sum, k) => sum + parseFloat(k.nominal), 0);
    const saldo = totalPemasukan - totalPengeluaran;

    const filteredData = keuangan.filter(k => k.judul.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Dana Desa & Swadaya</h2>
                    <p className="text-gray-400 text-sm">Catatan finansial proyek dan partisipasi wilayah Anda.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Tambah Catatan
                </button>
            </div>

            {/* Quick Stats */}
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

            {/* Content Table */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📋</span> Riwayat Transaksi
                    </h3>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari catatan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0f172a]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                        </div>
                        <button className="bg-[#0f172a]/80 border border-white/10 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                            <Filter className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase text-gray-400 tracking-wider">
                                <th className="py-3 px-4 font-semibold">TANGGAL</th>
                                <th className="py-3 px-4 font-semibold">JUDUL</th>
                                <th className="py-3 px-4 font-semibold">SUMBER</th>
                                <th className="py-3 px-4 font-semibold">TIPE</th>
                                <th className="py-3 px-4 font-semibold text-right">NOMINAL</th>
                                <th className="py-3 px-4 font-semibold text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-500 animate-pulse">Memuat data keuangan...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-500">Belum ada catatan keuangan yang sesuai.</td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-4 text-sm text-gray-300">{item.tanggal}</td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{item.judul}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.keterangan}</p>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-300">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.sumber_dana === 'Swadaya Warga' ? 'bg-purple-500/20 text-purple-400' : 'bg-[#0f172a] border border-white/10 text-gray-400'}`}>
                                                {item.sumber_dana}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {item.tipe === 'Pemasukan' ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-lg">
                                                    <ArrowDownRight className="w-3 h-3" /> Pemasukan
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-lg">
                                                    <ArrowUpRight className="w-3 h-3" /> Pengeluaran
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-bold text-right text-gray-200">
                                            {formatRupiah(item.nominal)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Hapus Catatan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Catatan */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1e293b] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/40">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="w-6 h-6 text-yellow-500" /> Tambah Catatan Keuangan
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Transaksi</label>
                                    <input 
                                        type="text" name="judul" required 
                                        value={formData.judul} onChange={handleInputChange}
                                        placeholder="Contoh: Pembelian Semen RT 01"
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe</label>
                                    <select 
                                        name="tipe" value={formData.tipe} onChange={handleInputChange}
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    >
                                        <option value="Pemasukan">Pemasukan</option>
                                        <option value="Pengeluaran">Pengeluaran</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sumber Dana</label>
                                    <select 
                                        name="sumber_dana" value={formData.sumber_dana} onChange={handleInputChange}
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    >
                                        <option value="Dana Desa">Dana Desa</option>
                                        <option value="Bantuan / Donasi">Bantuan / Donasi</option>
                                        <option value="Swadaya Warga">Swadaya Warga</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nominal (Rp)</label>
                                    <input 
                                        type="number" name="nominal" required 
                                        value={formData.nominal} onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</label>
                                    <input 
                                        type="date" name="tanggal" required 
                                        value={formData.tanggal} onChange={handleInputChange}
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan (Opsional)</label>
                                    <textarea 
                                        name="keterangan" rows="2"
                                        value={formData.keterangan} onChange={handleInputChange}
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-yellow-500/50 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-all text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" disabled={submitting}
                                    className="flex-[2] bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-800 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition-all text-sm"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Catatan'}
                                </button>
                            </div>
                        </form>
                        
                        <div className="bg-yellow-500/5 p-4 flex gap-3 items-start border-t border-white/5">
                            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-yellow-500/80 leading-relaxed font-medium">
                                Pastikan data yang dimasukkan sesuai dengan bukti fisik kwitansi atau laporan wilayah Anda. Data ini akan memengaruhi laporan realisasi anggaran desa.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeuanganLPM;

