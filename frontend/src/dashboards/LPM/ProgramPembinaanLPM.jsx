import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, GraduationCap, Briefcase, Plus, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const ProgramPembinaanLPM = () => {
    const { user } = useAuth();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        kategori: 'Pelatihan Teknik',
        sasaran: '',
        tanggal_pelaksanaan: '',
        jumlah_peserta: 0,
        mentor: '',
        status: 'Direncanakan'
    });

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/program-pembinaan/');
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPrograms();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchPrograms]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/api/program-pembinaan/', formData);
            alert('✅ Program pembinaan berhasil didaftarkan!');
            setIsModalOpen(false);
            setFormData({
                judul: '', kategori: 'Pelatihan Teknik', sasaran: '', tanggal_pelaksanaan: '',
                jumlah_peserta: 0, mentor: '', status: 'Direncanakan'
            });
            fetchPrograms();
        } catch (error) {
            console.error('Error creating program:', error);
            alert('❌ Gagal mendaftarkan program. Periksa kembali inputan Anda.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Berjalan': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Selesai': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'Berjalan': return <PlayCircle className="w-3.5 h-3.5" />;
            default: return <Clock className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                        <GraduationCap className="text-yellow-500 w-8 h-8" />
                        Program Pembinaan Masyarakat
                    </h2>
                    <p className="text-gray-400 text-sm">Kelola program pelatihan and pemberdayaan oleh LPM {user?.unit_detail}.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-[#0f172a] font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Tambah Program
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Program</p>
                        <p className="text-2xl font-bold text-white">{programs.length}</p>
                    </div>
                </div>
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Peserta</p>
                        <p className="text-2xl font-bold text-white">
                            {programs.reduce((acc, curr) => acc + parseInt(curr.jumlah_peserta || 0, 10), 0)}
                        </p>
                    </div>
                </div>
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bulan Ini</p>
                        <p className="text-2xl font-bold text-white">
                            {programs.filter(p => new Date(p.tanggal_pelaksanaan).getMonth() === new Date().getMonth()).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Program List Table */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className=" overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0f172a]/80 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">ID & Judul Program</th>
                                <th className="py-4 px-6 font-semibold">Pelaksanaan</th>
                                <th className="py-4 px-6 font-semibold">Peserta & Sasaran</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-center">Mentor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="py-10 text-center text-gray-500 animate-pulse">Memuat data program...</td></tr>
                            ) : programs.length === 0 ? (
                                <tr><td colSpan="5" className="py-10 text-center text-gray-500 italic">Belum ada program pembinaan yang terdaftar.</td></tr>
                            ) : (
                                programs.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group cursor-default">
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-mono text-yellow-500/80 mb-0.5">{item.id_program}</span>
                                                <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{item.judul}</span>
                                                <span className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest">{item.kategori}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                {new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium flex items-center gap-1.5 text-sm">
                                                    <Users className="w-3.5 h-3.5 text-gray-500" />
                                                    {item.jumlah_peserta} Orang
                                                </span>
                                                <span className="text-[10px] text-gray-500 mt-1 italic line-clamp-1">{item.sasaran}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-max border ${getStatusStyle(item.status)}`}>
                                                {getStatusIcon(item.status)}
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className="text-sm font-semibold text-gray-300 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
                                                {item.mentor}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TAMBAH PROGRAM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                            <div>
                                <h3 className="text-lg font-bold text-white">Daftarkan Program Pembinaan</h3>
                                <p className="text-xs text-gray-400">Penyelenggara: LPM {user?.unit_detail}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Judul Program</label>
                                    <input
                                        type="text"
                                        name="judul"
                                        required
                                        value={formData.judul}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Misal: Pelatihan Digital Marketing UMKM"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                                    <select
                                        name="kategori"
                                        value={formData.kategori}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition cursor-pointer"
                                    >
                                        <option>Pelatihan Teknik</option>
                                        <option>Pemberdayaan Wanita</option>
                                        <option>Pemuda & Olahraga</option>
                                        <option>Kesehatan Masyarakat</option>
                                        <option>Lingkungan Hidup</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tanggal Pelaksanaan</label>
                                    <input
                                        type="date"
                                        name="tanggal_pelaksanaan"
                                        required
                                        value={formData.tanggal_pelaksanaan}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Mentor / Narasumber</label>
                                    <input
                                        type="text"
                                        name="mentor"
                                        required
                                        value={formData.mentor}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Nama Mentor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Target Jumlah Peserta</label>
                                    <input
                                        type="number"
                                        name="jumlah_peserta"
                                        required
                                        value={formData.jumlah_peserta}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Sasaran / Target Masyarakat</label>
                                    <input
                                        type="text"
                                        name="sasaran"
                                        required
                                        value={formData.sasaran}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#1e293b]/50 border border-white/10 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Misal: Pelaku UMKM RW 01 - 04"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Status Program</label>
                                    <div className="flex gap-4">
                                        {['Direncanakan', 'Berjalan', 'Selesai'].map((s) => (
                                            <label key={s} className="flex-1 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={s}
                                                    checked={formData.status === s}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <div className={`py-3 text-center rounded-xl border-2 transition-all ${formData.status === s ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-transparent border-white/5 text-gray-500 group-hover:border-white/10'}`}>
                                                    {s}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 transition font-semibold">Batal</button>
                                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.4)]">Daftarkan Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramPembinaanLPM;
