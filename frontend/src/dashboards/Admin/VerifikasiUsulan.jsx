import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Sub-komponen
import VerifikasiHeader from './AdminComponents/VerifikasiHeader';
import VerifikasiTable from './AdminComponents/VerifikasiTable';
import VerifikasiModal from './AdminComponents/VerifikasiModal';

const VerifikasiUsulan = () => {
    const navigate = useNavigate();
    const [usulanMasuk, setUsulanMasuk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsulan, setSelectedUsulan] = useState(null);
    const [catatanVerifikator, setCatatanVerifikator] = useState('');
    const [kewenangan, setKewenangan] = useState('');

    const fetchUsulan = useCallback(async () => {
        try {
            const response = await api.get('/users/api/musrenbang/');
            setUsulanMasuk(response.data);
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

    const handleApproval = async (id, aksi) => {
        const statusBaru = aksi === 'Setujui' ? 'DISETUJUI' : 'DITOLAK';
        if (aksi === 'Setujui' && !kewenangan) {
            alert('⚠️ Silakan pilih Kewenangan terlebih dahulu!');
            return;
        }

        try {
            await api.patch(`/users/api/musrenbang/${id}/approval/`, {
                status: statusBaru, kewenangan: kewenangan, catatan_verifikator: catatanVerifikator
            });
            alert(`✅ Usulan ${id} berhasil di-${aksi.toLowerCase()}!`);
            fetchUsulan();
            setSelectedUsulan(null);
            setCatatanVerifikator('');
            setKewenangan('');
        } catch (error) {
            console.error('Error updating usulan:', error);
            alert('❌ Gagal memproses usulan.');
        }
    };

    return (
        <div className="text-gray-200 animate-fade-in">
            <VerifikasiHeader />
            <VerifikasiTable 
                loading={loading} 
                usulanMasuk={usulanMasuk} 
                setSelectedUsulan={setSelectedUsulan} 
                setCatatanVerifikator={setCatatanVerifikator} 
                setKewenangan={setKewenangan} 
            />
            <VerifikasiModal 
                selectedUsulan={selectedUsulan} 
                setSelectedUsulan={setSelectedUsulan} 
                catatanVerifikator={catatanVerifikator} 
                setCatatanVerifikator={setCatatanVerifikator} 
                kewenangan={kewenangan} 
                setKewenangan={setKewenangan} 
                handleApproval={handleApproval} 
                navigate={navigate} 
            />
        </div>
    );
};

export default VerifikasiUsulan;
