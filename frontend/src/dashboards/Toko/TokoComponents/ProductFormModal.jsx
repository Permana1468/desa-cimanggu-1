import React from 'react';
import { Plus, Edit, Save, RefreshCw } from 'lucide-react';
import Modal from '../../components/Shared/Modal';

const ProductFormModal = ({ isModalOpen, setIsModalOpen, modalMode, isSaving, handleSubmit, imagePreview, handleImageChange, formData, setFormData }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalMode === 'add' ? 'Tambah Stok Produk' : 'Update Detail Produk'}
            icon={modalMode === 'add' ? Plus : Edit}
            footer={
                <>
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold text-gray-500 hover:text-white transition-colors">Batal</button>
                    <button 
                        type="submit" form="productForm" disabled={isSaving}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSaving ? 'Menyimpan...' : 'Simpan ke Etalase'}
                    </button>
                </>
            }
        >
            <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex flex-col items-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 w-full text-center">Foto Produk (Maks 2MB)</p>
                        <label className="relative group/upload w-full h-48 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500/30 transition-all">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Plus size={32} className="text-gray-700 mb-2 group-hover/upload:text-yellow-400 transition-colors" />
                                    <span className="text-xs font-bold text-gray-600">Klik untuk upload foto produk</span>
                                </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Produk</label>
                        <input 
                            type="text" required
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-yellow-500/50 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Cth: Keripik Pisang Original"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga (Rp)</label>
                        <input 
                            type="number" required min="0" step="1"
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-emerald-400 font-black outline-none focus:border-yellow-500/50 transition-all"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="Cth: 15000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stok Tersedia</label>
                        <input 
                            type="number" required min="0" step="1"
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-yellow-500/50 transition-all"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            placeholder="Cth: 50"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Keterangan Produk</label>
                        <textarea 
                            rows="3"
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:border-yellow-500/50 transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Sebutkan keunggulan atau berat produk..."
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ProductFormModal;
