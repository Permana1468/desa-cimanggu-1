import React from 'react';
import { Image as ImageIcon, Edit, Trash2 } from 'lucide-react';

const ProductTable = ({ filteredProducts, handleOpenModal, handleDelete }) => {
    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                            <th className="px-8 py-6">Item Detail</th>
                            <th className="px-8 py-6">Harga Satuan</th>
                            <th className="px-8 py-6">Status Stok</th>
                            <th className="px-8 py-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-700" /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1">{product.name}</h4>
                                            <p className="text-[11px] text-gray-500 line-clamp-1">{product.description || 'Tidak ada deskripsi'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm font-black text-emerald-400">
                                    Rp {parseFloat(product.price || 0).toLocaleString('id-ID')}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className={`text-[13px] font-black ${product.stock > 0 ? 'text-white' : 'text-red-400'}`}>
                                            {product.stock} <span className="text-[10px] text-gray-600 font-bold ml-1">TERSEDIA</span>
                                        </span>
                                        <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className={`h-full transition-all ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal('edit', product)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center text-gray-500 font-bold italic">
                                    Belum ada produk dalam katalog. Klik tombol "Tambah Produk Baru" untuk memulai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
