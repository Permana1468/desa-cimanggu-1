import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, Store, ChevronLeft } from 'lucide-react';
import api from '../services/api';

const UMKMCatalog = () => {
    const [products, setProducts] = useState([]);
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch valid shops and products
                const [shopsRes, productsRes] = await Promise.all([
                    api.get('/users/api/umkm/shops/'),
                    api.get('/users/api/umkm/products/')
                ]);
                setShops(shopsRes.data);
                // Assign shop names to products locally for easier rendering, though API provides it
                const enrichedProducts = productsRes.data.map(p => {
                    const shop = shopsRes.data.find(s => s.id === p.shop);
                    return { ...p, shop_name: shop ? shop.shop_name : 'Toko Tidak Diketahui' };
                });
                setProducts(enrichedProducts);
            } catch (error) {
                console.error("Failed to fetch UMKM data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-yellow-500/30 selection:text-white">
            
            {/* Background Animations & Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-0 left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-slate-800/20 rounded-full blur-[100px] opacity-50 rotate-12"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 py-4 transition-all">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-lg group-hover:bg-white/10 transition-colors">
                            <ChevronLeft className="text-yellow-400 group-hover:-translate-x-1 transition-transform" size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-[15px] tracking-wide uppercase leading-none">Kembali</h1>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Ke Beranda Utama</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/login" className="px-5 py-2 rounded-full border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-slate-900 text-sm font-bold transition-all">
                            Daftar Toko / Masuk
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-md mb-8 animate-fade-in-up">
                    <Store size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400 tracking-widest uppercase">Pasar Desa Digital</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-400 to-amber-500 mb-6 drop-shadow-sm tracking-tight">
                    Etalase UMKM <br className="hidden md:block" /> Cimanggu I
                </h1>
                
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                    Dukung pertumbuhan ekonomi lokal dengan berbelanja produk asli karya warga Desa Cimanggu I. Kualitas terjamin langsung dari pembuatnya.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl">
                        <div className="pl-4 pr-2">
                            <Search className="text-gray-400 group-focus-within:text-yellow-400 transition-colors" size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari produk atau nama toko..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full py-3 placeholder-gray-500 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Content / Product Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl">
                        <ShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">Belum ada produk yang sesuai</h3>
                        <p className="text-gray-500 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col bg-[#0f172a]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(234,179,8,0.1)] hover:-translate-y-1">
                                
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-slate-900 border-b border-white/5">
                                    {product.image ? (
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag size={40} className="text-white/10" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                            {product.stock > 0 ? `Sisa ${product.stock}` : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Product Info */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1.5 text-yellow-400 mb-2">
                                        <Store size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-widest line-clamp-1">{product.shop_name}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-yellow-100 transition-colors">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Harga</span>
                                            <span className="text-lg font-black text-white">Rp {parseFloat(product.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Layer */}
            <div className="py-10 border-t border-white/5 bg-[#0b1120] text-center relative z-10">
                <p className="text-sm text-gray-500 font-medium">© {new Date().getFullYear()} Pemerintah Desa Cimanggu I. Mendorong Ekonomi Kreatif Lokal.</p>
            </div>
            
        </div>
    );
};

export default UMKMCatalog;
