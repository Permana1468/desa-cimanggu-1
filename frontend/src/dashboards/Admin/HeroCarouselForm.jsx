import React, { useState, useEffect, useCallback } from 'react';
import { Save, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

const HeroCarouselForm = () => {
    const [formData, setFormData] = useState({
        id: null,
        hero_title: '',
        hero_subtitle: '',
        carousel_image_1: null,
        carousel_image_2: null,
        carousel_image_3: null,
    });

    const [imageFiles, setImageFiles] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Live preview images array
    const previewImages = [
        formData.carousel_image_1 || '/images/slide_1.webp',
        formData.carousel_image_2,
        formData.carousel_image_3
    ].filter(Boolean);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
        }, 8000); // Auto-slide every 8s like Landing Page
        return () => clearInterval(timer);
    }, [previewImages.length]);

    const fetchSettings = useCallback(async () => {
        try {
            const response = await api.get('/users/api/landing-page/');
            if (response.data && response.data.length > 0) {
                setFormData(response.data[0]);
            }
        } catch (error) {
            console.error("Gagal memuat pengaturan Hero:", error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSettings();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchSettings]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setImageFiles(prev => ({ ...prev, [name]: files[0] }));
            if (files[0]) {
                const objectUrl = URL.createObjectURL(files[0]);
                setFormData(prev => ({ ...prev, [name]: objectUrl }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleDeleteImage = async (imgKey) => {
        if (!formData.id) return;
        if (!window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;

        setIsLoading(true);
        try {
            const res = await api.patch(`/users/api/landing-page/${formData.id}/`, {
                [imgKey]: null
            });
            setFormData(res.data);
            setImageFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[imgKey];
                return newFiles;
            });
            alert("Gambar berhasil dihapus dari server!");
        } catch (error) {
            console.error("Gagal menghapus gambar:", error);
            alert("Terjadi kesalahan saat menghapus gambar.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData();

            // Text fields
            ['hero_title', 'hero_subtitle'].forEach(key => {
                if (formData[key] !== null) submitData.append(key, formData[key]);
            });

            // Image files (with compression bypass for large files)
            for (const key of ['carousel_image_1', 'carousel_image_2', 'carousel_image_3']) {
                if (imageFiles[key]) {
                    // Kompresi otomatis di browser sebelum dikirim
                    const compressedFile = await compressImage(imageFiles[key]);
                    submitData.append(key, compressedFile);
                }
            }

            if (formData.id) {
                const res = await api.patch(`/users/api/landing-page/${formData.id}/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFormData(res.data);
            } else {
                const res = await api.post(`/users/api/landing-page/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFormData(res.data);
            }
            setImageFiles({}); // Clear unsaved files

            alert("Pengaturan Hero & Carousel berhasil disimpan!");
        } catch (error) {
            console.error("Error saving hero settings:", error);
            
            let errorMsg = "Gagal menyimpan pengaturan Hero & Carousel.";
            if (error.response) {
                // Server responded with non-2xx code
                const detail = error.response.data?.detail || error.response.data?.error || JSON.stringify(error.response.data);
                errorMsg += `\n\nDetail: ${error.response.status} - ${detail}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMsg += "\n\nDetail: Tidak ada respon dari server. Periksa koneksi internet Anda.";
            } else {
                errorMsg += `\n\nDetail: ${error.message}`;
            }
            
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Hero & Carousel</h1>
                    <p className="text-gray-400 mt-1">Kelola teks sambutan selamat datang dan gambar dinamis carousel.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isLoading
                        ? 'bg-yellow-500/50 text-slate-900/50 cursor-not-allowed shadow-none'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/20'
                        }`}
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* LIVE PREVIEW SECTION */}
            <div className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 mb-8 group bg-black">
                {/* Background Carousel */}
                {previewImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div
                            className={`w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
                            style={{ backgroundImage: `url('${src}')`, willChange: 'transform' }}
                        ></div>
                    </div>
                ))}

                {/* Overlay Text Preview */}
                <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/70 to-transparent p-10 flex flex-col justify-center">
                    <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-[10px] text-yellow-400 mb-4 border border-white/10 w-max">
                        <span className="animate-pulse mr-2">●</span> Live Preview Landing Page
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                        {formData.hero_title || "Pemerintah Desa"}
                    </h1>
                    <h1 className="text-3xl md:text-5xl font-black text-yellow-400 mb-4 leading-tight uppercase drop-shadow-md">
                        {formData.title || "CIMANGGU I"}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed drop-shadow-md">
                        {formData.hero_subtitle || "Platform digital terpadu untuk mengelola data pemberdayaan masyarakat."}
                    </p>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30">
                    {previewImages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl animate-fadeIn">

                    {/* TEKS HERO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Teks Hero (Judul Utama)</label>
                        <input
                            type="text"
                            name="hero_title"
                            value={formData.hero_title || ''}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                            placeholder="Contoh: Selamat Datang di"
                        />
                        <p className="mt-2 text-xs text-gray-500">Judul besar yang pertama kali dibaca oleh pengunjung.</p>
                    </div>

                    {/* TAGLINE HERO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tagline (Sub-Judul)</label>
                        <input
                            type="text"
                            name="hero_subtitle"
                            value={formData.hero_subtitle || ''}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                            placeholder="Contoh: Mari majukan desa bersama masyarakat cerdas terampil."
                        />
                    </div>

                    {/* CAROUSEL GAMBAR */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-lg font-medium text-gray-200 pb-2">Carousel Background (Minimal HD)</h3>

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
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-l-xl bg-[#0f172a] text-gray-300 hover:bg-white/10 cursor-pointer transition-colors text-sm w-32 shrink-0">
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
                                        <div className="flex-1 px-4 py-2 bg-[#0f172a]/50 border-y border-white/10 text-sm text-gray-500 truncate min-w-0">
                                            {imageFiles[imgKey] ? imageFiles[imgKey].name : (formData[imgKey] ? "Tersimpan di Supabase" : "Belum ada gambar")}
                                        </div>
                                        {formData[imgKey] && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(imgKey)}
                                                className="flex items-center justify-center w-10 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-r-xl transition-all active:scale-90 shrink-0"
                                                title="Hapus Gambar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {!formData[imgKey] && (
                                            <div className="w-10 py-2 border-y border-r border-white/10 rounded-r-xl bg-white/5 opacity-50 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default HeroCarouselForm;
