import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, CheckCircle, Info, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

const IdentitasProfilForm = () => {
    const [formData, setFormData] = useState({
        id: null,
        title: 'Website Desa',
        about_title: 'Sekilas Pandang',
        description: '',
        about_text: '',
        logo: null,
        about_image: null
    });

    const [imageFile, setImageFile] = useState(null);
    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/users/api/landing-page/');
                if (response.data && response.data.length > 0) {
                    const data = response.data[0];
                    setFormData({
                        id: data.id,
                        title: data.title || '',
                        about_title: data.about_title || 'Sekilas Pandang',
                        description: data.description || '',
                        about_text: data.about_text || '',
                        logo: data.logo || null,
                        about_image: data.about_image || null
                    });
                }
            } catch (error) {
                console.error("Gagal memuat pengaturan:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                if (name === 'logo') {
                    setImageFile(file);
                } else if (name === 'about_image') {
                    setAboutImageFile(file);
                }
                const objectUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, [name]: objectUrl }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData();
            ['title', 'description', 'about_title', 'about_text'].forEach(key => {
                submitData.append(key, formData[key] || '');
            });

            if (imageFile) {
                const compressedLogo = await compressImage(imageFile);
                submitData.append('logo', compressedLogo);
            }
            if (aboutImageFile) {
                const compressedAbout = await compressImage(aboutImageFile);
                submitData.append('about_image', compressedAbout);
            }

            if (formData.id) {
                await api.patch(`/users/api/landing-page/${formData.id}/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/users/api/landing-page/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alert("Identitas & Profil Desa berhasil disimpan!");
            window.location.reload();
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Gagal menyimpan pengaturan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in relative z-10 w-full mb-12">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 
                                    border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shrink-0">
                         <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            Identitas & Profil
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 font-black animate-pulse uppercase tracking-widest">
                                <CheckCircle size={10} /> Active
                            </span>
                        </h2>
                        <p className="text-white/30 text-[13px] font-medium mt-1">Konfigurasi branding resmi dan narasi profil Desa Cimanggu I.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`group bg-amber-500 hover:bg-amber-400 text-black px-10 py-3.5 rounded-2xl font-black text-[14px] 
                               transition-all duration-300 flex items-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:-translate-y-1 active:scale-95`}
                >
                    <Save size={18} className="group-hover:rotate-12 transition-transform" />
                    {isLoading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Side: Branding & SEO */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full" />
                        
                        <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                             <ImageIcon size={14} className="text-amber-500" /> Branding Desa
                        </h3>

                        <div className="space-y-8">
                            {/* NAMA DESA */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase">Nama Resmi Instansi</label>
                                <input
                                    type="text" name="title" value={formData.title} onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-[15px] font-bold outline-none focus:border-amber-500/50 transition-all"
                                    placeholder="Contoh: Desa Cimanggu I"
                                />
                            </div>

                            {/* LOGO PREVIEW & UPLOAD */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase">Logo Utama (PNG)</label>
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-6">
                                    <div className="w-32 h-32 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center group/logo relative shadow-inner">
                                        {formData.logo ? (
                                            <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-4 transition-transform group-hover/logo:scale-110" />
                                        ) : (
                                            <ImageIcon size={40} className="text-white/5" />
                                        )}
                                        <label className="absolute inset-0 bg-black/80 opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-[10px] font-black text-amber-500 tracking-widest">
                                            UPLOAD NEW
                                            <input type="file" name="logo" accept="image/*" onChange={handleChange} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest text-center">Format PNG Transparan direkomendasikan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                         <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             <Info size={14} className="text-blue-500" /> SEO & Meta Data
                        </h3>
                         <div className="space-y-3">
                            <label className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase leading-relaxed">Deskripsi Global (Search Engine)</label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows="5"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-5 text-white text-[13px] leading-relaxed outline-none focus:border-blue-500/50 transition-all resize-none custom-scrollbar"
                                placeholder="Deskripsi untuk pencarian Google dan bagian bawah web..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Side: About Narration */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl h-full flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <div>
                                <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Narasi Profil & Visual Konten</h3>
                                <input
                                    type="text" name="about_title" value={formData.about_title} onChange={handleChange}
                                    className="bg-transparent border-none text-2xl md:text-3xl font-black text-white outline-none focus:text-amber-500 transition-all p-0 w-full"
                                    placeholder="Judul Sekilas Pandang..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                            {/* Text Narration */}
                            <div className="lg:col-span-7 space-y-3">
                                <label className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase">Cerita Lengkap Desa</label>
                                <textarea
                                    name="about_text" value={formData.about_text} onChange={handleChange} rows="18"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-8 text-white text-[15px] leading-[1.8] outline-none focus:border-amber-500/40 transition-all resize-none shadow-inner custom-scrollbar"
                                    placeholder="Tuliskan sejarah desa, visi misi, atau perkenalan desa secara detail di sini..."
                                ></textarea>
                            </div>

                            {/* Image Content */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase">Foto Representasi Utama</label>
                                    <div className="relative group/about rounded-[2rem] overflow-hidden border-2 border-white/5 bg-black/40 shadow-2xl aspect-[4/5] lg:aspect-auto h-full min-h-[400px]">
                                        {formData.about_image ? (
                                            <img src={formData.about_image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/about:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white/5">
                                                <ImageIcon size={60} strokeWidth={1} />
                                                <span className="text-[10px] mt-4 font-black tracking-widest uppercase">No Photo Content</span>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover/about:opacity-100 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4">
                                             <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-2xl">
                                                <Upload size={24} />
                                             </div>
                                             <span className="text-[11px] font-black text-white tracking-widest uppercase">Ganti Foto Konten</span>
                                             <input type="file" name="about_image" accept="image/*" onChange={handleChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IdentitasProfilForm;
