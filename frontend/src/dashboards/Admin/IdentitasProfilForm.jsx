import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

const IdentitasProfilForm = () => {
    const [formData, setFormData] = useState({
        id: null,
        title: 'Website Desa', // Nama Desa
        about_title: 'Sekilas Pandang', // Judul Profil
        description: '', // Deskripsi Singkat untuk SEO
        about_text: '', // Profil Lengkap
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

            // Text fields - Pastikan semua kolom terkirim
            ['title', 'description', 'about_title', 'about_text'].forEach(key => {
                const val = formData[key] || '';
                submitData.append(key, val);
            });

            // Image files
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
            window.location.reload(); // Refresh untuk memastikan data terbaru tampil
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Gagal menyimpan pengaturan. Silakan cek koneksi atau format file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight flex items-center gap-3">
                        Identitas & Profil
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1 font-normal animate-pulse">
                            <CheckCircle size={10} />
                            SISTEM TERUPDATE
                        </span>
                    </h1>
                    <p className="text-gray-400 mt-1">Kelola nama desa, logo, dan konten profil utama desa.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isLoading
                            ? 'bg-yellow-500/50 text-slate-900/50 cursor-not-allowed shadow-none'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/20'
                        }`}
                >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-fadeIn">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* NAMA DESA */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Nama Desa / Instansi</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                                    placeholder="Contoh: Desa Cimanggu I"
                                />
                            </div>

                            {/* LOGO */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-300">Logo Utama</label>
                                <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-20 h-20 rounded-lg bg-[#0f172a] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                        {formData.logo ? (
                                            <img src={formData.logo} alt="Preview Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg bg-[#0f172a] text-gray-300 hover:bg-white/10 cursor-pointer transition-colors text-xs font-bold">
                                            <Upload className="w-4 h-4 mr-2" />
                                            GANTI LOGO
                                            <input type="file" name="logo" accept="image/*" onChange={handleChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESKRIPSI SEO */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Deskripsi Singkat (SEO/Footer)</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all resize-none custom-scrollbar"
                                    placeholder="Deskripsi untuk pencarian Google dan bagian bawah web..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* PROFIL DESA SECTION */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Judul Seksi Profil (Halaman Depan)</label>
                                <input
                                    type="text"
                                    name="about_title"
                                    value={formData.about_title || ''}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all font-bold"
                                    placeholder="Contoh: Sekilas Pandang / Sejarah Desa"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-300">Foto Konten Profil (Kantor Desa / Ikon)</label>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="aspect-video w-full rounded-xl bg-[#0f172a] border border-white/10 overflow-hidden mb-4 relative group">
                                        {formData.about_image ? (
                                            <img src={formData.about_image} alt="Preview Profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                                <ImageIcon size={40} strokeWidth={1} />
                                                <span className="text-[10px] mt-2 font-bold opacity-50 uppercase tracking-widest">Belum Ada Foto</span>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white text-xs font-bold gap-2 backdrop-blur-sm">
                                            <Upload size={20} />
                                            GANTI FOTO KONTEN
                                            <input type="file" name="about_image" accept="image/*" onChange={handleChange} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic text-center">Mendukung format PNG transparan & JPG. Maks 4MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* ABOUT TEXT */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Narasi Profil Lengkap</label>
                            <textarea
                                name="about_text"
                                value={formData.about_text || ''}
                                onChange={handleChange}
                                rows="12"
                                className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all resize-none custom-scrollbar leading-relaxed"
                                placeholder="Tuliskan sejarah desa, visi misi, atau perkenalan desa secara detail di sini..."
                            ></textarea>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default IdentitasProfilForm;
