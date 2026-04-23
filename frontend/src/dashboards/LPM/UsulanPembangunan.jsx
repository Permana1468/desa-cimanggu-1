import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Sub-komponen
import UsulanHeader from './UsulanComponents/UsulanHeader';
import UsulanTable from './UsulanComponents/UsulanTable';
import UsulanDetailModal from './UsulanComponents/UsulanDetailModal';
import UsulanFormModal from './UsulanComponents/UsulanFormModal';

const UsulanPembangunan = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usulanList, setUsulanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailUsulan, setDetailUsulan] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        judul: '',
        kategori: 'Infrastruktur & Fisik',
        deskripsi: '',
        estimasi_biaya: '',
        volume: '',
        titik_koordinat: '',
        alamat_lengkap: '',
        foto_1: null,
        foto_2: null,
        foto_3: null
    });

    const fetchUsulan = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/musrenbang/');
            setUsulanList(response.data);
        } catch (error) {
            console.error('Error fetching usulan:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsulan();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsulan]);

    useEffect(() => {
        // Handle Pre-fill from Aspirasi
        const timer = setTimeout(() => {
            if (location.state?.prefill) {
                setFormData(prev => ({
                    ...prev,
                    ...location.state.prefill
                }));
                setIsModalOpen(true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('kategori', formData.kategori);
        data.append('deskripsi', formData.deskripsi);
        data.append('estimasi_biaya', formData.estimasi_biaya);
        data.append('volume', formData.volume);
        data.append('titik_koordinat', formData.titik_koordinat);
        data.append('alamat_lengkap', formData.alamat_lengkap);

        if (formData.foto_1) data.append('foto_1', formData.foto_1);
        if (formData.foto_2) data.append('foto_2', formData.foto_2);
        if (formData.foto_3) data.append('foto_3', formData.foto_3);

        try {
            await api.post('/users/api/musrenbang/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ Usulan berhasil dikirim!');
            setIsModalOpen(false);
            setFormData({
                judul: '', kategori: 'Infrastruktur & Fisik', deskripsi: '', estimasi_biaya: '',
                volume: '', titik_koordinat: '', alamat_lengkap: '', foto_1: null, foto_2: null, foto_3: null
            });
            fetchUsulan();
        } catch (error) {
            console.error('Error submitting usulan:', error);
            alert('❌ Gagal mengirim usulan. Pastikan semua field terisi.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DISETUJUI': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'DITOLAK': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'; // MENUNGGU
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            <UsulanHeader setIsModalOpen={setIsModalOpen} />
            
            <UsulanTable 
                usulanList={usulanList} 
                loading={loading} 
                getStatusColor={getStatusColor} 
                setDetailUsulan={setDetailUsulan} 
            />

            <UsulanDetailModal 
                detailUsulan={detailUsulan} 
                setDetailUsulan={setDetailUsulan} 
            />

            <UsulanFormModal 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                formData={formData} 
                handleInputChange={handleInputChange} 
                handleFileChange={handleFileChange} 
                handleSubmit={handleSubmit} 
                user={user} 
            />
        </div>
    );
};

export default UsulanPembangunan;
