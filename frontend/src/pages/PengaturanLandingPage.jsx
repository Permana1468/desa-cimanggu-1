import React, { useState, useEffect } from 'react';
import { Save, Layout, Type, Layers, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const PengaturanLandingPage = () => {
    const [activeTab, setActiveTab] = useState('Identitas');
    const [formData, setFormData] = useState({
        id: null,
        nama_desa: 'Desa Cimanggu I',
        tagline: 'Membangun Desa Bersama',
        deskripsi: 'Portal resmi desa untuk pelayanan dan informasi cerdas terpadu.',
        tampilkan_berita: true,
        tampilkan_peta: true,
        tampilkan_layanan: true,
        tampilkan_statistik: true,
        carousel_image_1: null,
        carousel_image_2: null,
        carousel_image_3: null,
    });
    const [imageFiles, setImageFiles] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/users/api/landing-page/');
                if (response.data && response.data.length > 0) {
                    setFormData(response.data[0]);
                }
            } catch (error) {
                console.error("Gagal memuat pengaturan:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setImageFiles(prev => ({ ...prev, [name]: files[0] }));
            // Buat preview lokal
            if (files[0]) {
                const objectUrl = URL.createObjectURL(files[0]);
                setFormData(prev => ({ ...prev, [name]: objectUrl }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const submitData = new FormData();

            // Text and boolean fields
            Object.keys(formData).forEach(key => {
                if (key !== 'id' && !key.startsWith('carousel_image_') && formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            // Image files
            if (imageFiles.carousel_image_1) submitData.append('carousel_image_1', imageFiles.carousel_image_1);
            if (imageFiles.carousel_image_2) submitData.append('carousel_image_2', imageFiles.carousel_image_2);
            if (imageFiles.carousel_image_3) submitData.append('carousel_image_3', imageFiles.carousel_image_3);

            if (formData.id) {
                await api.patch(`/users/api/landing-page/${formData.id}/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/users/api/landing-page/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alert("Pengaturan berhasil disimpan!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Gagal menyimpan pengaturan.");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'Identitas', icon: <Type className="w-4 h-4" /> },
        { id: 'Hero', icon: <Layout className="w-4 h-4" /> },
        { id: 'Fitur', icon: <Layers className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Pengaturan Landing Page</h1>
                    <p className="text-gray-400 mt-1">Kelola konten dan visibilitas halaman depan website desa.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isSaving
                            ? 'bg-yellow-500/50 text-slate-900/50 cursor-not-allowed shadow-none'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/20'
                        }`}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-white/5 px-2 pt-2 gap-1 overflow-x-auto custom-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all relative rounded-t-xl ${activeTab === tab.id
                                ? 'text-yellow-400 bg-white/5'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                }`}
                        >
                            {tab.icon}
                            {tab.id}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 shadow-[0_-2px_8px_rgba(234,179,8,0.5)]"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8">
                    <form className="space-y-8 max-w-3xl">
                        {activeTab === 'Identitas' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Nama Desa</label>
                                    <input
                                        type="text"
                                        name="nama_desa"
                                        value={formData.nama_desa}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                                        placeholder="Contoh: Desa Cimanggu I"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Nama resmi desa yang akan ditampilkan di header dan footer.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Singkat (Tentang Desa)</label>
                                    <textarea
                                        name="deskripsi"
                                        value={formData.deskripsi}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500 custom-scrollbar resize-none"
                                        placeholder="Penjelasan singkat mengenai desa..."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Hero' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tagline Hero Banner</label>
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={formData.tagline}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                                        placeholder="Contoh: Maju Bersama Membangun Desa"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Teks utama yang sangat besar di bagian paling atas halaman pengunjung.</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-200 border-b border-white/5 pb-2">Carousel Background (Minimal HD)</h3>

                                    {/* Uploaders for 3 carousel images */}
                                    {['carousel_image_1', 'carousel_image_2', 'carousel_image_3'].map((imgKey, idx) => (
                                        <div key={imgKey} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                            {/* Preview Image */}
                                            <div className="w-24 h-16 rounded-lg bg-[#0f172a] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                {formData[imgKey] ? (
                                                    <img src={formData[imgKey]} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-gray-600" />
                                                )}
                                            </div>

                                            {/* Input Area */}
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-300 mb-1">Gambar Slide {idx + 1}</label>
                                                <div className="flex items-center">
                                                    <label className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-l-lg bg-[#0f172a] text-gray-300 hover:bg-white/10 cursor-pointer transition-colors text-sm w-32 shrink-0">
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Pilih File
                                                        <input
                                                            type="file"
                                                            name={imgKey}
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                    <div className="flex-1 px-4 py-2 bg-[#0f172a]/50 border-y border-r border-white/10 rounded-r-lg text-sm text-gray-500 truncate">
                                                        {imageFiles[imgKey] ? imageFiles[imgKey].name : (formData[imgKey] ? "Tersimpan di server" : "Belum ada gambar")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Fitur' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="pb-4 border-b border-white/5">
                                    <h3 className="text-lg font-medium text-gray-200">Visibilitas Section Publik</h3>
                                    <p className="text-sm text-gray-400 mt-1">Tentukan bagian mana saja yang dapat dilihat oleh pengunjung website.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ToggleSwitch
                                        label="Tampilkan Peta Wilayah"
                                        description="Fasilitas peta interaktif batas desa"
                                        name="tampilkan_peta"
                                        checked={formData.tampilkan_peta}
                                        onChange={handleChange}
                                    />
                                    <ToggleSwitch
                                        label="Tampilkan Berita Desa"
                                        description="Feed artikel dan pengumuman terbaru"
                                        name="tampilkan_berita"
                                        checked={formData.tampilkan_berita}
                                        onChange={handleChange}
                                    />
                                    <ToggleSwitch
                                        label="Tampilkan Layanan"
                                        description="Daftar layanan surat menyurat publik"
                                        name="tampilkan_layanan"
                                        checked={formData.tampilkan_layanan}
                                        onChange={handleChange}
                                    />
                                    <ToggleSwitch
                                        label="Tampilkan Statistik Publik"
                                        description="Grafik demografi penduduk desa"
                                        name="tampilkan_statistik"
                                        checked={formData.tampilkan_statistik}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

// Komponen Toggle Switch iOS Style
const ToggleSwitch = ({ label, description, name, checked, onChange }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors gap-4">
            <div>
                <span className="text-gray-200 font-medium block">{label}</span>
                {description && <span className="text-xs text-gray-500 mt-1 block">{description}</span>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                    type="checkbox"
                    name={name}
                    className="sr-only peer"
                    checked={checked}
                    onChange={onChange}
                />
                <div className="w-11 h-6 bg-[#0f172a] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500 peer-checked:border-yellow-500"></div>
            </label>
        </div>
    );
};

export default PengaturanLandingPage;
