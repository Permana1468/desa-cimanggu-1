import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../services/api';
import { Upload, FileText, Trash2, Clock } from 'lucide-react';

const DetailEngineering = () => {
    const [proyekList, setProyekList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProyek, setSelectedProyek] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchProyek = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/proyek/');
            // Filter proyek yang sudah disetujui atau sedang dalam pelaksanaan
            const filtered = response.data.filter(p => ['DISETUJUI', 'MENUNGGU_PENCAIRAN', 'PELAKSANAAN'].includes(p.status));
            setProyekList(filtered);
        } catch (error) {
            console.error('Error fetching proyek:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProyek();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchProyek]);

    const fetchDocuments = useCallback(async (proyekId) => {
        try {
            const response = await api.get(`/users/api/dokumen-ded/?proyek_id=${proyekId}`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }, []);

    const handleSelectProyek = (proyek) => {
        setSelectedProyek(proyek);
        fetchDocuments(proyek.id);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedProyek) return;

        const formData = new FormData();
        formData.append('proyek', selectedProyek.id);
        formData.append('file_dokumen', file);
        formData.append('nama_file', file.name);
        formData.append('ukuran_file', (file.size / 1024 / 1024).toFixed(2) + ' MB');

        try {
            setUploading(true);
            await api.post('/users/api/dokumen-ded/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ Dokumen berhasil diunggah!');
            fetchDocuments(selectedProyek.id);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('❌ Gagal mengunggah dokumen.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteDoc = async (docId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;
        try {
            await api.delete(`/users/api/dokumen-ded/${docId}/`);
            fetchDocuments(selectedProyek.id);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Detail Engineering Design (DED)</h2>
                <p className="text-gray-400 text-sm">Manajemen berkas teknis dan gambar kerja untuk proyek infrastruktur desa.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daftar Proyek */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Pilih Proyek</h3>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500 italic">Memuat data...</div>
                        ) : proyekList.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 italic">Tidak ada proyek aktif.</div>
                        ) : proyekList.map(proyek => (
                            <div
                                key={proyek.id}
                                onClick={() => handleSelectProyek(proyek)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedProyek?.id === proyek.id
                                        ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10'
                                        : 'bg-[#1e293b]/40 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <p className="text-[10px] font-mono text-blue-400 mb-1">{proyek.usulan_id}</p>
                                <h4 className="text-sm font-bold text-white mb-2 leading-tight">{proyek.judul}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">📍 {proyek.lokasi}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${proyek.status === 'PELAKSANAAN' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {proyek.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Area Kelola Dokumen */}
                <div className="lg:col-span-2">
                    {selectedProyek ? (
                        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-scale-up">
                            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedProyek.judul}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Kelola dokumen teknis untuk proyek ini.</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Estimasi</span>
                                    <p className="text-yellow-400 font-mono font-bold italic">
                                        Rp {parseFloat(selectedProyek.estimasi_biaya).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            {/* Upload Zone */}
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 mb-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${uploading ? 'bg-white/5 border-blue-500/50' : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5'
                                    }`}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".pdf,image/*"
                                />
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${uploading ? 'bg-blue-500/20 animate-pulse' : 'bg-white/5'
                                    }`}>
                                    <Upload className={`w-8 h-8 ${uploading ? 'text-blue-400' : 'text-gray-400'}`} />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">
                                    {uploading ? 'Sedang Mengunggah...' : 'Unggah Dokumen Baru'}
                                </h4>
                                <p className="text-sm text-gray-400 text-center max-w-xs">
                                    Klik di sini untuk mengunggah berkas DED (PDF atau Gambar Teknik).
                                </p>
                            </div>

                            {/* Daftar Dokumen Terunggah */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Dokumen Terarsip ({documents.length})
                                </h4>

                                {documents.length === 0 ? (
                                    <div className="py-10 text-center bg-black/20 rounded-2xl border border-white/5">
                                        <p className="text-sm text-gray-500 italic">Belum ada dokumen yang diunggah untuk proyek ini.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {documents.map(doc => (
                                            <div key={doc.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-white truncate max-w-[150px]" title={doc.nama_file}>
                                                            {doc.nama_file}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">{doc.ukuran_file} • {new Date(doc.uploaded_at).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => window.open(doc.file_dokumen, '_blank')}
                                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                                        title="Lihat"
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDoc(doc.id)}
                                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#1e293b]/20 border border-white/5 border-dashed rounded-3xl p-10 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-white/20" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Manajemen Dokumen DED</h3>
                            <p className="text-sm text-gray-500 max-w-sm">
                                Silakan pilih salah satu proyek di sebelah kiri untuk mulai mengelola berkas Detail Engineering Design.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailEngineering;
