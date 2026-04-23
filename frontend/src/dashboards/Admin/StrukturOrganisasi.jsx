import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

const StrukturOrganisasi = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pejabatList, setPejabatList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nama: '',
        jabatan: '',
        level: '3',
        foto: null
    });


    const fetchPejabat = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users/api/pejabat-desa/');
            setPejabatList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data pejabat", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPejabat();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
            setFormData(prev => ({ ...prev, foto: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('nama', formData.nama);
            data.append('jabatan', formData.jabatan);
            data.append('level', formData.level);
            
            if (formData.foto) {
                // Kompresi otomatis sebelum upload
                const compressedFile = await compressImage(formData.foto);
                data.append('foto', compressedFile);
            }

            await api.post('/users/api/pejabat-desa/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            setFormData({ nama: '', jabatan: '', level: '3', foto: null });
            fetchPejabat();
        } catch (error) {
            console.error("Gagal menyimpan data pejabat", error);
            
            let errorMsg = "Gagal menyimpan. Periksa koneksi atau console log.";
            if (error.response) {
                const detail = error.response.data?.detail || error.response.data?.error || JSON.stringify(error.response.data);
                errorMsg += `\n\nDetail: ${error.response.status} - ${detail}`;
            }
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus pejabat ini?")) return;

        try {
            await api.delete(`/users/api/pejabat-desa/${id}/`);
            fetchPejabat();
        } catch (error) {
            console.error("Gagal menghapus pejabat", error);
        }
    };

    const handlePrintID = (pejabat) => {
        if (!pejabat.id_unik) {
            alert("ID Unik belum tersedia untuk pejabat ini.");
            return;
        }

        const svgElement = document.getElementById(`qr-${pejabat.id}`);
        const svgString = svgElement ? new XMLSerializer().serializeToString(svgElement) : '';
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
            <head>
                <title>Cetak ID Card - ${pejabat.nama}</title>
                <style>
                    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #e2e8f0; }
                    .card { width: 320px; height: 480px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; padding: 30px 20px; box-sizing: border-box; overflow: hidden; position: relative; }
                    .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 120px; background: #0f172a; z-index: 0; }
                    .desa-name { position: relative; z-index: 1; margin-bottom: 25px; font-size: 16px; font-weight: 800; color: #eab308; text-transform: uppercase; letter-spacing: 1px; }
                    .foto { position: relative; z-index: 1; width: 110px; height: 110px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: #cbd5e1; }
                    .nama { position: relative; z-index: 1; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 4px; color: #1e293b; line-height: 1.2; }
                    .jabatan { position: relative; z-index: 1; font-size: 14px; color: #64748b; text-align: center; margin-bottom: 25px; font-weight: 500; }
                    .qr-container { position: relative; z-index: 1; background: white; padding: 12px; border-radius: 12px; border: 2px solid #f1f5f9; margin-bottom: 12px; display:flex; justify-content:center; align-items:center;}
                    .id-unik { position: relative; z-index: 1; font-size: 16px; font-weight: bold; letter-spacing: 3px; color: #0f172a; }
                    .footer-text { position: absolute; bottom: 15px; font-size: 10px; color: #94a3b8; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="desa-name">PEMDES CIMANGGU I</div>
                    <img class="foto" src="${pejabat.foto || 'https://via.placeholder.com/150'}" alt="Foto" onerror="this.src='https://via.placeholder.com/150'" />
                    <div class="nama">${pejabat.nama}</div>
                    <div class="jabatan">${pejabat.jabatan}</div>
                    <div class="qr-container">
                        ${svgString || '<span>QR Gagal Dimuat</span>'}
                    </div>
                    <div class="id-unik">${pejabat.id_unik}</div>
                    <div class="footer-text">Kartu Identitas Resmi & Presensi Scanner</div>
                </div>
                <script>
                    window.onload = () => {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Struktur Organisasi</h2>
                    <p className="text-gray-400 text-sm">Kelola susunan pejabat Pemdes Cimanggu I untuk bagan Landing Page.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
                >
                    <span>+</span> Tambah Pejabat
                </button>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/60 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Foto</th>
                                <th className="py-4 px-6 font-semibold">Nama Lengkap</th>
                                <th className="py-4 px-6 font-semibold">Jabatan</th>
                                <th className="py-4 px-6 font-semibold text-center">ID / QR Code</th>
                                <th className="py-4 px-6 font-semibold text-center">Hierarki (Level)</th>
                                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Memuat data struktur organisasi...</td>
                                </tr>
                            ) : pejabatList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Belum ada data struktur organisasi.</td>
                                </tr>
                            ) : (
                                pejabatList.map((pejabat) => (
                                    <tr key={pejabat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-3 px-6">
                                            {pejabat.foto ? (
                                                <img src={pejabat.foto} alt={pejabat.nama} className="w-10 h-10 object-cover rounded-lg border border-white/20" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-700 rounded-lg border border-white/20 flex items-center justify-center text-xs overflow-hidden">
                                                    👤
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-white">{pejabat.nama}</td>
                                        <td className="py-4 px-6 text-yellow-400 font-medium">{pejabat.jabatan}</td>
                                        <td className="py-4 px-6 flex flex-col items-center justify-center gap-2">
                                            {pejabat.id_unik ? (
                                                <>
                                                    <div className="bg-white p-1 rounded-lg">
                                                        <QRCodeSVG id={`qr-${pejabat.id}`} value={pejabat.id_unik} size={60} level="M" />
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-400 font-bold">{pejabat.id_unik}</div>
                                                    <button
                                                        onClick={() => handlePrintID(pejabat)}
                                                        className="mt-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1.5 rounded-lg border border-yellow-500/30 flex items-center gap-1 transition-all"
                                                        title="Cetak ID Card"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" /> Cetak ID
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-xs italic">ID belum di-generate</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center text-gray-400">Level {pejabat.level}</td>
                                        <td className="py-4 px-6 flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity mt-1">
                                            <button onClick={() => handleDelete(pejabat.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM TAMBAH PEJABAT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
                    <div className="bg-[#0f172a]/95 border-0 md:border md:border-white/10 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-up flex flex-col overflow-hidden">
                        
                        {/* Header Modal */}
                        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl shrink-0">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em]">Data Pejabat Baru</h3>
                                <p className="text-xs text-yellow-400/70 font-bold mt-1 tracking-widest uppercase">Perbarui Struktur Organisasi Desa</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl p-3 hover:bg-white/10 rounded-full transition-all transform hover:rotate-90">✕</button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                
                                {/* Nama Section */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Nama Lengkap (Beserta Gelar)</label>
                                    <input 
                                        required 
                                        type="text" 
                                        name="nama" 
                                        value={formData.nama} 
                                        onChange={handleChange} 
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg font-bold focus:border-yellow-500 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600" 
                                        placeholder="Cth: Bpk. Hernawan, S.Pd." 
                                    />
                                </div>

                                {/* Responsive Grid for Jabatan & Level */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Jabatan</label>
                                        <input 
                                            required 
                                            type="text" 
                                            name="jabatan" 
                                            value={formData.jabatan} 
                                            onChange={handleChange} 
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all placeholder:text-gray-600" 
                                            placeholder="Cth: Kasi Pemerintahan" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Level Hierarki</label>
                                        <div className="relative">
                                            <select 
                                                name="level" 
                                                value={formData.level} 
                                                onChange={handleChange} 
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="1">Level 1 (Kepala Desa)</option>
                                                <option value="2">Level 2 (Sekretaris Desa)</option>
                                                <option value="3">Level 3 (Kaur / Kasi)</option>
                                                <option value="4">Level 4 (Kepala Dusun)</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Foto */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Upload Foto Resmi</label>
                                    <div className="relative group">
                                        <input 
                                            type="file" 
                                            name="foto" 
                                            onChange={handleChange} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            accept="image/*" 
                                        />
                                        <div className="w-full px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all flex items-center gap-4">
                                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">👤</div>
                                            <span className="text-sm font-medium truncate">
                                                {formData.foto ? formData.foto.name : 'Pilih Foto Pejabat...'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="pt-6 flex flex-col md:flex-row justify-end gap-4 border-t border-white/5">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="order-2 md:order-1 px-8 py-4 rounded-2xl text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving} 
                                        className="order-1 md:order-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:opacity-50 text-[#0f172a] font-black px-12 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>Simpan Data Pejabat 💾</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrukturOrganisasi;

