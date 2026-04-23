import React from 'react';
import { Plus, Search, ShoppingBag } from 'lucide-react';

const ProductHeader = ({ handleOpenModal, productsCount, searchQuery, setSearchQuery }) => {
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Katalog Produk</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Kelola stok dan harga produk yang tampil di Pasar Desa Digital.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('add')}
                    className="group bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-7 py-3.5 rounded-2xl font-black text-[14px] transition-all flex items-center gap-3 shadow-[0_10px_20px_rgb(234,179,8,0.2)] hover:-translate-y-1"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    TAMBAH PRODUK BARU
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-none mb-2">Total Produk</p>
                        <h3 className="text-2xl font-black text-white">{productsCount} <span className="text-[12px] text-gray-600 ml-1">SKU</span></h3>
                    </div>
                </div>
                <div className="md:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Cari item di gudang toko Anda..." 
                            className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white font-bold outline-none focus:border-yellow-500/30 transition-all placeholder:text-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductHeader;
