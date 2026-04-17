import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

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

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const fetchPejabat = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/users/api/pejabat-desa/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        const data = new FormData();
        data.append('nama', formData.nama);
        data.append('jabatan', formData.jabatan);
        data.append('level', formData.level);
        if (formData.foto) {
            data.append('foto', formData.foto);
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_URL}/users/api/pejabat-desa/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsModalOpen(false);
            setFormData({ nama: '', jabatan: '', level: '3', foto: null });
            fetchPejabat();
        } catch (error) {
            console.error("Gagal menyimpan data pejabat", error);
            alert("Gagal menyimpan. Periksa koneksi atau console log.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus pejabat ini?")) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${API_URL}/users/api/pejabat-desa/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <h3 className="text-lg font-bold text-white">Data Pejabat Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap (Beserta Gelar)</label>
                                <input required type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition" placeholder="Cth: Bpk. Fulan, S.E." />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Jabatan</label>
                                    <input required type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition" placeholder="Cth: Kepala Dusun I" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Level Hierarki</label>
                                    <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition appearance-none">
                                        <option value="1">Level 1 (Kades)</option>
                                        <option value="2">Level 2 (Sekdes)</option>
                                        <option value="3">Level 3 (Kaur/Kasi)</option>
                                        <option value="4">Level 4 (Kadus)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Foto Resmi</label>
                                <input type="file" name="foto" onChange={handleChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer" accept="image/*" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition">Batal</button>
                                <button type="submit" disabled={isSaving} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-lg transition shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                    {isSaving ? 'Menyimpan...' : 'Simpan Pejabat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrukturOrganisasi;

