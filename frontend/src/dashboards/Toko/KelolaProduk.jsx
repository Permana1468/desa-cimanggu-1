import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Edit, Save, X, Image as ImageIcon, Search, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/Shared/Modal';

const KelolaProduk = () => {
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        price: '',
        stock: '',
        description: '',
        image_file: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [shopRes, productsRes] = await Promise.all([
                api.get('/users/api/umkm/shops/'),
                api.get('/users/api/umkm/products/')
            ]);
            
            if (shopRes.data.length > 0) {
                setShop(shopRes.data[0]);
            }
            setProducts(productsRes.data);
        } catch (err) {
            console.error("Gagal memuat data", err);
            setMessage({ type: 'error', text: 'Gagal sinkronisasi data produk.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        if (mode === 'edit' && product) {
            setFormData({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description || '',
                image_file: null
            });
            setImagePreview(product.image);
        } else {
            setFormData({ id: null, name: '', price: '', stock: '', description: '', image_file: null });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, image_file: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shop?.id) {
            alert("Harap lengkapi Identitas Toko terlebih dahulu.");
            return;
        }

        setIsSaving(true);
        const data = new FormData();
        data.append('shop', shop.id);
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description || '');
        if (formData.image_file) {
            data.append('image', formData.image_file);
        }

        try {
            if (modalMode === 'add') {
                await api.post('/users/api/umkm/products/', data);
            } else {
                await api.patch(`/users/api/umkm/products/${formData.id}/`, data);
            }
            setIsModalOpen(false);
            setMessage({ type: 'success', text: `Produk berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diperbarui'}!` });
            fetchInitialData();
        } catch (err) {
            console.error("Gagal menyimpan produk", err);
            alert("Error: Gagal menyimpan produk. Mohon periksa format input.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus produk ini dari etalase?")) return;
        try {
            await api.delete(`/users/api/umkm/products/${id}/`);
            setMessage({ type: 'success', text: 'Produk berhasil dihapus.' });
            fetchInitialData();
        } catch (err) {
            console.error("Gagal menghapus", err);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-[10px]">Loading Catalog...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
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

            {/* Inventory Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-none mb-2">Total Produk</p>
                        <h3 className="text-2xl font-black text-white">{products.length} <span className="text-[12px] text-gray-600 ml-1">SKU</span></h3>
                    </div>
                </div>
                {/* Search Bar */}
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

            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
                    message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    <CheckCircle size={18} />
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            {/* Product Table / Cards */}
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
                                        Rp {parseFloat(product.price).toLocaleString('id-ID')}
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

            {/* Add/Edit Modal */}
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
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 w-full">Foto Produk</p>
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
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-yellow-500/50"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Cth: Keripik Pisang Original"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga (Rp)</label>
                            <input 
                                type="number" required
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-emerald-400 font-black outline-none focus:border-yellow-500/50"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                placeholder="Cth: 15000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stok Tersedia</label>
                            <input 
                                type="number" required
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-yellow-500/50"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                placeholder="Cth: 50"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Keterangan Produk</label>
                            <textarea 
                                rows="3"
                                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:border-yellow-500/50 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Sebutkan keunggulan atau berat produk..."
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default KelolaProduk;
