import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, Trash2, ShieldAlert, Store, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const ManajemenProdukAdmin = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            // Note: ADMIN role get_queryset returns all products
            const response = await api.get('/users/api/umkm/products/');
            setProducts(response.data);
        } catch (error) {
            console.error("Gagal memuat barang pasar:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial load
        const timer = setTimeout(() => {
            fetchProducts();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const handleRefresh = () => {
        setIsLoading(true);
        fetchProducts();
    };

    const handleDeleteProduct = async (product) => {
        if (!window.confirm(`Hapus produk "${product.name}" milik toko "${product.shop_name}"? \n\nTindakan ini untuk membersihkan konten yang tidak layak.`)) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/users/api/umkm/products/${product.id}/`);
            setProducts(prev => prev.filter(p => p.id !== product.id));
        } catch (error) {
            console.error("Gagal menghapus produk:", error);
            alert("Terjadi kesalahan saat menghapus data.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = products.filter(p => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.shop_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                        Moderasi Produk Pasar
                        <ShieldAlert className="text-amber-400" size={28} />
                    </h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">Pantau & bersihkan konten produk yang tidak sesuai dari etalase desa.</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Controls Bar */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-amber-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama produk atau toko..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-5 py-3.5 text-white outline-none focus:border-amber-500/30 transition-all placeholder:text-gray-600 font-bold"
                    />
                </div>
                <div className="flex items-center gap-6 px-8 py-3 bg-white/5 rounded-2xl border border-white/5 shrink-0">
                    <div className="text-center">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Memonitor</p>
                         <h4 className="text-xl font-black text-white">{products.length} <span className="text-[10px] text-gray-600">ITEM</span></h4>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Memindai Seluruh Produk...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                                    <th className="px-8 py-6">Produk & Toko</th>
                                    <th className="px-8 py-6">Harga & Stok</th>
                                    <th className="px-8 py-6">Keterangan</th>
                                    <th className="px-8 py-6 text-center">Tindakan Moderasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6 flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                                                {p.image ? (
                                                    <img src={p.image} className="w-full h-full object-cover" alt="Product" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-gray-600"><ShoppingBag size={20} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors uppercase">{p.name}</h4>
                                                <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 mt-1">
                                                    <Store size={12} className="text-amber-400" /> {p.shop_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-emerald-400">Rp {parseFloat(p.price || 0).toLocaleString('id-ID')}</p>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-tighter mt-1">Stok: {p.stock} Unit</p>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed italic">
                                                {p.description || '(Tidak ada deskripsi)'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center flex-col items-center gap-3">
                                                 <button 
                                                    onClick={() => handleDeleteProduct(p)}
                                                    disabled={isDeleting}
                                                    className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                                 >
                                                     <Trash2 size={14} /> Hapus Konten
                                                 </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-24 text-center">
                                            <AlertCircle className="mx-auto text-gray-700 mb-4" size={40} />
                                            <p className="text-gray-500 font-bold italic tracking-tight">Tidak ada data produk yang ditemukan atau etalase sedang kosong.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4">
                 <ShieldAlert className="text-amber-400 shrink-0" size={24} />
                 <div className="space-y-1">
                     <h4 className="text-sm font-black text-amber-200 uppercase tracking-wider">Patuhi Kode Etik Moderasi</h4>
                     <p className="text-[12px] text-amber-200/60 leading-relaxed font-medium">
                         Penghapusan produk hanya boleh dilakukan jika item terbukti melanggar hukum, mengandung konten pornografi, penipuan, atau produk ilegal lainnya. Harap hubungi pemilik toko sebelum melakukan tindakan penghapusan jika diperlukan.
                     </p>
                 </div>
            </div>
        </div>
    );
};

export default ManajemenProdukAdmin;
