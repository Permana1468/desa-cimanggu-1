import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { PackageOpen, Wrench, PackageCheck, AlertTriangle, Search, Filter, Plus } from 'lucide-react';

const InventarisLPM = () => {
    const { user } = useContext(AuthContext);
    const [inventaris, setInventaris] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInventaris();
    }, []);

    const fetchInventaris = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/lpm/inventaris/');
            setInventaris(response.data);
        } catch (error) {
            console.error("Error fetching Inventaris:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalAset = inventaris.reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalBaik = inventaris.filter(i => i.kondisi === 'Baik').reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalRusak = inventaris.filter(i => i.kondisi.includes('Rusak')).reduce((acc, curr) => acc + curr.jumlah, 0);

    const filteredData = inventaris.filter(k => 
        k.nama_aset.toLowerCase().includes(searchTerm.toLowerCase()) || 
        k.kode_aset.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Inventaris & Sarana</h2>
                    <p className="text-gray-400 text-sm">Daftar aset hasil pembangunan dan peralatan gotong royong.</p>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all group">
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Tambah Aset Baru
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Unit Aset</p>
                            <h3 className="text-3xl font-black text-blue-400">{totalAset}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                            <PackageOpen className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Kondisi Baik</p>
                            <h3 className="text-3xl font-black text-green-400">{totalBaik}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                            <PackageCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Rusak / Perlu Servis</p>
                            <h3 className="text-3xl font-black text-red-400">{totalRusak}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* List Aset */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📦</span> Database Aset
                    </h3>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari nama/kode aset..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="p-10 text-center col-span-3 text-gray-400 animate-pulse">Memuat database aset...</div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-10 text-center col-span-3 text-gray-500">Aset tidak ditemukan.</div>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item.id} className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-5 hover:border-yellow-500/30 transition-all group shadow-inner">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 ${
                                        item.kondisi === 'Baik' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.kondisi === 'Baik' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        {item.kondisi}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{item.nama_aset}</h4>
                                <p className="text-xs text-gray-500 font-mono bg-black/40 inline-block px-2 py-0.5 rounded border border-white/5 mb-4">{item.kode_aset || 'TANPA KODE'}</p>
                                
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Kategori</p>
                                        <p className="text-sm font-medium text-gray-200 mt-0.5">{item.kategori}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Jumlah</p>
                                        <p className="text-sm font-medium text-gray-200 mt-0.5">{item.jumlah} Unit</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Sumber / Tahun</p>
                                        <p className="text-sm font-medium text-gray-200 mt-0.5">{item.sumber_perolehan} ({item.tahun_perolehan})</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventarisLPM;

