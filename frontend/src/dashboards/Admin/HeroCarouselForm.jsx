import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

// Sub-komponen
import CarouselHeader from './AdminComponents/CarouselHeader';
import CarouselPreview from './AdminComponents/CarouselPreview';
import CarouselUploader from './AdminComponents/CarouselUploader';

const HeroCarouselForm = () => {
    const [formData, setFormData] = useState({
        id: null, hero_title: '', hero_subtitle: '',
        carousel_image_1: null, carousel_image_2: null, carousel_image_3: null,
    });

    const [imageFiles, setImageFiles] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const previewImages = [
        formData.carousel_image_1 || '/images/slide_1.webp',
        formData.carousel_image_2,
        formData.carousel_image_3
    ].filter(Boolean);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
        }, 8000);
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
            const res = await api.patch(`/users/api/landing-page/${formData.id}/`, { [imgKey]: null });
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
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData();
            ['hero_title', 'hero_subtitle'].forEach(key => {
                if (formData[key] !== null) submitData.append(key, formData[key]);
            });

            for (const key of ['carousel_image_1', 'carousel_image_2', 'carousel_image_3']) {
                if (imageFiles[key]) {
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
            setImageFiles({});
            alert("Pengaturan Hero & Carousel berhasil disimpan!");
        } catch (error) {
            console.error("Error saving hero settings:", error);
            alert("Gagal menyimpan pengaturan Hero & Carousel.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <CarouselHeader isLoading={isLoading} handleSubmit={handleSubmit} />
            <CarouselPreview previewImages={previewImages} currentSlide={currentSlide} formData={formData} />

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl animate-fadeIn">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Teks Hero (Judul Utama)</label>
                        <input
                            type="text" name="hero_title" value={formData.hero_title || ''} onChange={handleChange}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                            placeholder="Contoh: Selamat Datang di"
                        />
                        <p className="mt-2 text-xs text-gray-500">Judul besar yang pertama kali dibaca oleh pengunjung.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tagline (Sub-Judul)</label>
                        <input
                            type="text" name="hero_subtitle" value={formData.hero_subtitle || ''} onChange={handleChange}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                            placeholder="Contoh: Mari majukan desa bersama masyarakat cerdas terampil."
                        />
                    </div>

                    <CarouselUploader 
                        formData={formData} 
                        imageFiles={imageFiles} 
                        handleChange={handleChange} 
                        handleDeleteImage={handleDeleteImage} 
                    />
                </form>
            </div>
        </div>
    );
};

export default HeroCarouselForm;
