import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Store, ShoppingBag, PlusCircle, Activity } from 'lucide-react';

const DashboardUtamaToko = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Dashboard UMKM</h1>
                <p className="text-gray-400 mt-1">Selamat datang, {user?.nama_lengkap || user?.username}. Kelola toko dan produk Anda dari sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards Dummy */}
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Total Produk</p>
                        <h3 className="text-2xl font-bold text-white">0</h3>
                    </div>
                </div>
                
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center gap-4 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <PlusCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-medium">Tindakan Cepat</p>
                        <h3 className="text-lg font-bold text-blue-400">Tambah Produk</h3>
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
                <Store size={48} className="text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-300 mb-2">Toko Anda Sedang Diverifikasi</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Mohon tunggu admin desa memverifikasi UMKM Anda sebelum dapat menambahkan produk ke Etalase Pasar Desa Digital.
                </p>
            </div>
        </div>
    );
};

export default DashboardUtamaToko;
