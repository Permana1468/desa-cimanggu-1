import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Store, MapPin, Phone, Info, Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ManajemenToko = () => {
    const { user } = useContext(AuthContext);
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        try {
            const res = await api.get('/users/api/umkm/shops/');
            // The viewset filters to only own shops for OWNER_TOKO
            if (res.data.length > 0) {
                setShop(res.data[0]);
                if (res.data[0].logo) setLogoPreview(res.data[0].logo);
            } else {
                // If no shop exists, we might need a create flow, 
                // but usually it should be created by admin or on registration.
                setShop({ shop_name: '', description: '', phone_number: '', address: '' });
            }
        } catch (err) {
            console.error("Gagal mengambil data toko", err);
            setMessage({ type: 'error', text: 'Gagal memuat data toko.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
            setShop({ ...shop, logo_file: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('shop_name', shop.shop_name);
        formData.append('description', shop.description || '');
        formData.append('phone_number', shop.phone_number || '');
        formData.append('address', shop.address || '');
        if (shop.logo_file) {
            formData.append('logo', shop.logo_file);
        }

        try {
            if (shop.id) {
                await api.patch(`/users/api/umkm/shops/${shop.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/users/api/umkm/shops/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setMessage({ type: 'success', text: 'Data toko berhasil diperbarui!' });
            fetchShopData();
        } catch (err) {
            console.error("Gagal menyimpan data toko", err);
            setMessage({ type: 'error', text: 'Gagal menyimpan perubahan. Periksa kembali data Anda.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-[10px]">Sinkronisasi Data...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Identitas Toko</h1>
                    <p className="text-gray-400 text-sm font-medium">Kelola informasi publik toko UMKM Anda agar menarik pelanggan.</p>
                </div>
                {shop?.is_verified ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        <CheckCircle size={14} /> Terverifikasi Admin
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        <AlertCircle size={14} /> Menunggu Verifikasi
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-shake ${
                    message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Logo & Branding */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Logo UMKM</p>
                        
                        <div className="relative w-32 h-32 mb-6 group/logo">
                            <div className="w-full h-full rounded-[2rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/logo:border-yellow-500/50">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Toko" className="w-full h-full object-cover" />
                                ) : (
                                    <Store size={40} className="text-gray-600" />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95">
                                <Upload size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                            </label>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{shop?.shop_name || "Nama Toko"}</h3>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest italic">Est. {new Date(shop?.created_at).getFullYear() || "----"}</p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4">
                        <Info className="text-amber-400 shrink-0" size={20} />
                        <p className="text-[12px] text-amber-200/80 leading-relaxed font-medium">
                            Logo dan Nama Toko adalah representasi bisnis Anda di Pasar Desa Digital. Gunakan gambar berkualitas tinggi (PNG/WebP).
                        </p>
                    </div>
                </div>

                {/* Right Column: Form Details */}
                <div className="lg:col-span-2 bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nama Usaha / Toko</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-400 transition-colors">
                                    <Store size={18} />
                                </div>
                                <input 
                                    type="text" required
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    placeholder="Contoh: Warung Berkah Cimanggu"
                                    value={shop?.shop_name || ''}
                                    onChange={(e) => setShop({...shop, shop_name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">WhatsApp Aktif</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-400 transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input 
                                    type="tel"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    placeholder="0812..."
                                    value={shop?.phone_number || ''}
                                    onChange={(e) => setShop({...shop, phone_number: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Lokasi / Alamat</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-400 transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <input 
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    placeholder="Cth: RT 02 / RW 01"
                                    value={shop?.address || ''}
                                    onChange={(e) => setShop({...shop, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Deskripsi Singkat Toko</label>
                            <textarea 
                                rows="4"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600 resize-none"
                                placeholder="Jelaskan produk unggulan atau keistimewaan UMKM Anda..."
                                value={shop?.description || ''}
                                onChange={(e) => setShop({...shop, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <button 
                            type="submit" disabled={isSaving}
                            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_10px_30px_rgb(234,179,8,0.3)] hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ManajemenToko;
