import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

// Sub-komponen
import ProductHeader from './TokoComponents/ProductHeader';
import ProductTable from './TokoComponents/ProductTable';
import ProductFormModal from './TokoComponents/ProductFormModal';

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

    const fetchInitialData = useCallback(async () => {
        try {
            const [shopRes, productsRes] = await Promise.all([
                api.get('/users/api/umkm/shops/'),
                api.get('/users/api/umkm/products/')
            ]);
            
            if (shopRes.data && shopRes.data.length > 0) {
                setShop(shopRes.data[0]);
            }
            setProducts(productsRes.data || []);
        } catch (err) {
            console.error("Gagal memuat data", err);
            setMessage({ type: 'error', text: 'Gagal sinkronisasi data produk.' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInitialData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchInitialData]);

    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        setMessage({ type: '', text: '' });
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
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar maksimal 2MB.");
                return;
            }
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, image_file: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

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
                await api.post('/users/api/umkm/products/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.patch(`/users/api/umkm/products/${formData.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            setIsModalOpen(false);
            setMessage({ type: 'success', text: `Produk "${formData.name}" berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diperbarui'}!` });
            
            if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            
            setIsLoading(true);
            fetchInitialData();
        } catch (err) {
            console.error("Gagal menyimpan produk", err);
            const backendError = err.response?.data;
            let errorText = 'Gagal menyimpan produk. Periksa kembali form.';
            
            if (backendError) {
                if (typeof backendError === 'object') {
                    const firstKey = Object.keys(backendError)[0];
                    const firstVal = backendError[firstKey];
                    errorText = `${firstKey.toUpperCase()}: ${Array.isArray(firstVal) ? firstVal[0] : firstVal}`;
                } else if (typeof backendError === 'string') {
                    errorText = backendError;
                }
            }
            
            setMessage({ type: 'error', text: errorText });
            alert(`Gagal: ${errorText}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus produk ini dari etalase?")) return;
        try {
            await api.delete(`/users/api/umkm/products/${id}/`);
            setMessage({ type: 'success', text: 'Produk berhasil dihapus.' });
            setIsLoading(true);
            fetchInitialData();
        } catch (err) {
            console.error("Gagal menghapus", err);
        }
    };

    const filteredProducts = products.filter(p => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-[10px]">Loading Catalog...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <ProductHeader 
                handleOpenModal={handleOpenModal} 
                productsCount={products.length} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
                    message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-bold uppercase tracking-tight">{message.text}</span>
                </div>
            )}

            <ProductTable 
                filteredProducts={filteredProducts} 
                handleOpenModal={handleOpenModal} 
                handleDelete={handleDelete} 
            />

            <ProductFormModal 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                modalMode={modalMode} 
                isSaving={isSaving} 
                handleSubmit={handleSubmit} 
                imagePreview={imagePreview} 
                handleImageChange={handleImageChange} 
                formData={formData} 
                setFormData={setFormData} 
            />
        </div>
    );
};

export default KelolaProduk;
