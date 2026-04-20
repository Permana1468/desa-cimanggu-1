import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Store, ShoppingBag, PlusCircle, Activity, Package, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const DashboardUtamaToko = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalProducts: 0,
        unverifiedProducts: 0,
        outOfStock: 0,
        shopStatus: 'Checking...'
    });
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [shopRes, productsRes] = await Promise.all([
                    api.get('/users/api/umkm/shops/'),
                    api.get('/users/api/umkm/products/')
                ]);

                if (shopRes.data.length > 0) {
                    const shopData = shopRes.data[0];
                    setShop(shopData);
                    
                    const products = productsRes.data;
                    setStats({
                        totalProducts: products.length,
                        unverifiedProducts: products.filter(p => !shopData.is_verified).length, // Context: Products aren't verified individually yet, but shop is
                        outOfStock: products.filter(p => parseInt(p.stock) === 0).length,
                        shopStatus: shopData.is_verified ? 'Aktif (Terverifikasi)' : 'Menunggu Verifikasi'
                    });
                }
            } catch (err) {
                console.error("Gagal memuat statistik", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-[10px]">Menyiapkan Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Dashboard Niaga</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Status terkini UMKM {shop?.shop_name || "Anda"}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        to="/umkm" target="_blank"
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                        <ExternalLink size={14} /> Lihat Pasar Desa
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
                        <Package size={20} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{stats.totalProducts}</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total SKU Produk</p>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20">
                        <AlertCircle size={20} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">{stats.outOfStock}</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stok Kosong</p>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 backdrop-blur-xl border border-yellow-500/20 rounded-[2.5rem] p-8 shadow-2xl flex items-center justify-between group overflow-hidden relative">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                             {shop?.is_verified ? <ShieldCheck className="text-emerald-400" size={24} /> : <AlertCircle className="text-amber-400" size={24} />}
                             <h3 className="text-xl font-bold text-white tracking-tight">{stats.shopStatus}</h3>
                        </div>
                        <p className="text-sm text-gray-400 max-w-xs font-medium">
                            {shop?.is_verified 
                                ? "Toko Anda aktif dan tampil di etalase desa utama." 
                                : "Pengajuan toko Anda sedang direview oleh Admin Desa."}
                        </p>
                     </div>
                     <div className="relative z-10">
                        <Link to="/toko/pengaturan" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all shadow-lg block">
                            Kelola Identitas
                        </Link>
                     </div>
                </div>
            </div>

            {/* Practical Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                             <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                                 <Store className="text-yellow-400" size={20} /> Profil Toko
                             </h3>
                             <Link to="/toko/pengaturan" className="text-xs font-bold text-yellow-400 uppercase tracking-widest hover:underline transition-all">Edit Detail</Link>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                             <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                 {shop?.logo ? (
                                     <img src={shop.logo} alt="Logo" className="w-full h-full object-cover" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center text-gray-700 font-black text-2xl">{shop?.shop_name?.charAt(0)}</div>
                                 )}
                             </div>
                             <div className="space-y-4">
                                 <div>
                                     <h4 className="text-2xl font-bold text-white mb-1">{shop?.shop_name}</h4>
                                     <p className="text-gray-400 text-sm leading-relaxed">{shop?.description || "Belum ada deskripsi toko."}</p>
                                 </div>
                                 <div className="flex flex-wrap gap-4 pt-2">
                                     <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-gray-300">
                                         📍 {shop?.address || "Lokasi belum diatur"}
                                     </div>
                                     <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-gray-300">
                                         📞 {shop?.phone_number || "No. WA belum diatur"}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-b from-emerald-500/20 to-emerald-600/5 backdrop-blur-2xl border border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                            <PlusCircle size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Ingin Jualan Lagi?</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                            Segera tambahkan produk baru Anda ke etalase Pasar Desa Digital agar dilihat oleh seluruh warga.
                        </p>
                        <Link to="/toko/produk" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:-translate-y-1">
                            Tambah Produk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardUtamaToko;
