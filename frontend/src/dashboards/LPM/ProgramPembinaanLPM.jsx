import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

// Sub-komponen
import ProgramHeader from './ProgramComponents/ProgramHeader';
import ProgramStats from './ProgramComponents/ProgramStats';
import ProgramTable from './ProgramComponents/ProgramTable';
import ProgramFormModal from './ProgramComponents/ProgramFormModal';

const ProgramPembinaanLPM = () => {
    const { user } = useAuth();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        judul: '', kategori: 'Pelatihan Teknik', sasaran: '', tanggal_pelaksanaan: '',
        jumlah_peserta: 0, mentor: '', status: 'Direncanakan'
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

    const totalParticipants = programs.reduce((acc, curr) => acc + parseInt(curr.jumlah_peserta || 0, 10), 0);
    const monthlyProgramsCount = programs.filter(p => new Date(p.tanggal_pelaksanaan).getMonth() === new Date().getMonth()).length;

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            <ProgramHeader unitDetail={user?.unit_detail} setIsModalOpen={setIsModalOpen} />
            <ProgramStats 
                programsCount={programs.length} 
                totalParticipants={totalParticipants} 
                monthlyProgramsCount={monthlyProgramsCount} 
            />
            <ProgramTable 
                loading={loading} 
                programs={programs} 
                getStatusStyle={getStatusStyle} 
                getStatusIcon={getStatusIcon} 
            />
            <ProgramFormModal 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                unitDetail={user?.unit_detail} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleInputChange={handleInputChange} 
            />
        </div>
    );
};

export default ProgramPembinaanLPM;
