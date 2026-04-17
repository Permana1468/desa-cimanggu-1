import axios from 'axios';
import { compressImage } from '../utils/imageUtils';

const KelolaBerita = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [beritaList, setBeritaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        judul: '',
        kategori: 'Pengumuman',
        konten: '',
        gambar_cover: null
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const fetchBerita = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/users/api/berita/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBeritaList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data berita", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBerita();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'gambar_cover') {
            setFormData(prev => ({ ...prev, gambar_cover: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('kategori', formData.kategori);
            data.append('konten', formData.konten);
            
            if (formData.gambar_cover) {
                // Kompresi otomatis
                const compressedFile = await compressImage(formData.gambar_cover);
                data.append('gambar_cover', compressedFile);
            }
            const token = localStorage.getItem('access_token');
            await axios.post(`${API_URL}/users/api/berita/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsModalOpen(false);
            setFormData({ judul: '', kategori: 'Pengumuman', konten: '', gambar_cover: null });
            fetchBerita();
        } catch (error) {
            console.error("Gagal mengirim data berita", error);
            alert("Gagal mempublikasikan berita. Periksa koneksi atau console log.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${API_URL}/users/api/berita/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBerita();
        } catch (error) {
            console.error("Gagal menghapus berita", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            {/* Header Bagian */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Kelola Berita & Informasi</h2>
                    <p className="text-gray-400 text-sm">Manajemen artikel, pengumuman, dan kegiatan desa.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2"
                >
                    <span>+</span> Tambah Berita Baru
                </button>
            </div>

            {/* Tabel Data Glassmorphism */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/60 border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Judul Berita</th>
                                <th className="py-4 px-6 font-semibold">Kategori</th>
                                <th className="py-4 px-6 font-semibold">Tanggal</th>
                                <th className="py-4 px-6 font-semibold text-center">Views</th>
                                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Memuat data berita...</td>
                                </tr>
                            ) : beritaList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">Belum ada berita.</td>
                                </tr>
                            ) : (
                                beritaList.map((berita) => (
                                    <tr key={berita.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 font-medium text-white max-w-xs truncate" title={berita.judul}>{berita.judul}</td>
                                        <td className="py-4 px-6">
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs">
                                                {berita.kategori}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300">{formatDate(berita.created_at)}</td>
                                        <td className="py-4 px-6 text-sm text-center text-yellow-400">{berita.views}</td>
                                        <td className="py-4 px-6 flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete(berita.id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Hapus</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM TAMBAH BERITA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <h3 className="text-lg font-bold text-white">Tulis Berita Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Artikel</label>
                                <input required type="text" name="judul" value={formData.judul} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition" placeholder="Masukkan judul..." />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                                    <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-white focus:border-yellow-500 outline-none transition appearance-none">
                                        <option value="Kegiatan">Kegiatan</option>
                                        <option value="Pengumuman">Pengumuman</option>
                                        <option value="Bansos">Bansos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Gambar Cover</label>
                                    <input required type="file" name="gambar_cover" onChange={handleChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/10 file:text-yellow-400 hover:file:bg-yellow-500/20 cursor-pointer" accept="image/*" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Konten Berita</label>
                                <textarea required name="konten" value={formData.konten} onChange={handleChange} rows="5" className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/10 rounded-lg text-gray-300 focus:border-yellow-500 outline-none leading-relaxed" placeholder="Tulis isi berita di sini..."></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 transition">Batal</button>
                                <button type="submit" disabled={isSaving} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-lg transition shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                    {isSaving ? 'Menyimpan...' : 'Publikasikan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaBerita;

