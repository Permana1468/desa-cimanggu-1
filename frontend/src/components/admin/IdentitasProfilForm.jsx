import React, { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const IdentitasProfilForm = () => {
    const [formData, setFormData] = useState({
        id: null,
        title: 'Website Desa', // Nama Desa
        description: '', // Deskripsi Singkat
        about_text: '', // Profil Lengkap
        logo: null
    });

    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setImageFile(files[0]);
            if (files[0]) {
                const objectUrl = URL.createObjectURL(files[0]);
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

            // Text fields
            ['title', 'description', 'about_text'].forEach(key => {
                if (formData[key] !== null) submitData.append(key, formData[key]);
            });

            // Image file
            if (imageFile) submitData.append('logo', imageFile);

            if (formData.id) {
                await api.patch(`/users/api/landing-page/${formData.id}/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/users/api/landing-page/`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alert("Identitas & Profil berhasil disimpan!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Gagal menyimpan pengaturan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Identitas & Profil</h1>
                    <p className="text-gray-400 mt-1">Kelola nama desa, profil singkat, dan logo desa.</p>
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

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fadeIn">

                    {/* NAMA DESA */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nama Desa</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500"
                            placeholder="Contoh: Desa Cimanggu I"
                        />
                    </div>

                    {/* LOGO */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Logo Desa / Instansi</label>
                        <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                            <div className="w-24 h-24 rounded-lg bg-[#0f172a] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Preview Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-l-lg bg-[#0f172a] text-gray-300 hover:bg-white/10 cursor-pointer transition-colors text-sm w-32 shrink-0">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Pilih File
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                                <div className="mt-2 text-sm text-gray-500 truncate">
                                    {imageFile ? imageFile.name : (formData.logo ? "Tersimpan di server" : "Belum ada logo")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DESKRIPSI SINGKAT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Singkat (SEO/Footer)</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500 custom-scrollbar resize-none"
                            placeholder="Deskripsi ringkas desa untuk SEO dan bagian bawah website..."
                        ></textarea>
                    </div>

                    {/* PROFIL LENGKAP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Profil Lengkap Sejarah/Tentang Desa</label>
                        <textarea
                            name="about_text"
                            value={formData.about_text || ''}
                            onChange={handleChange}
                            rows="6"
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-gray-500 custom-scrollbar resize-none"
                            placeholder="Tuliskan sejarah, letak geografis, atau profil detail desa yang akan tampil di halaman 'Tentang Kami'..."
                        ></textarea>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default IdentitasProfilForm;
