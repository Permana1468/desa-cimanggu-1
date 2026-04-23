import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// Sub-komponen
import FinanceHeader from './FinanceComponents/FinanceHeader';
import FinanceStats from './FinanceComponents/FinanceStats';
import FinanceTable from './FinanceComponents/FinanceTable';
import FinanceFormModal from './FinanceComponents/FinanceFormModal';

const KeuanganLPM = () => {
    const [keuangan, setKeuangan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        tipe: 'Pemasukan',
        sumber_dana: 'Dana Desa',
        nominal: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: ''
    });

    const fetchKeuangan = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/api/lpm/keuangan/');
            setKeuangan(response.data);
        } catch (error) {
            console.error("Error fetching Keuangan LPM:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchKeuangan();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchKeuangan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post('/users/api/lpm/keuangan/', formData);
            setShowModal(false);
            setFormData({
                judul: '', tipe: 'Pemasukan', sumber_dana: 'Dana Desa', nominal: '',
                tanggal: new Date().toISOString().split('T')[0], keterangan: ''
            });
            fetchKeuangan();
        } catch (error) {
            console.error("Error adding keuangan:", error);
            alert("Gagal menambahkan catatan. Pastikan semua field terisi dengan benar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
        try {
            await api.delete(`/users/api/lpm/keuangan/${id}/`);
            fetchKeuangan();
        } catch (error) {
            console.error("Error deleting keuangan:", error);
            alert("Gagal menghapus catatan.");
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(angka || 0);
    };

    const totalPemasukan = keuangan.filter(k => k.tipe === 'Pemasukan').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const totalPengeluaran = keuangan.filter(k => k.tipe === 'Pengeluaran').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const saldo = totalPemasukan - totalPengeluaran;

    const filteredData = keuangan.filter(k => (k.judul || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            <FinanceHeader setShowModal={setShowModal} />
            <FinanceStats 
                totalPemasukan={totalPemasukan} 
                totalPengeluaran={totalPengeluaran} 
                saldo={saldo} 
                formatRupiah={formatRupiah} 
            />
            <FinanceTable 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                loading={loading} 
                filteredData={filteredData} 
                formatRupiah={formatRupiah} 
                handleDelete={handleDelete} 
            />
            <FinanceFormModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleInputChange={handleInputChange} 
                submitting={submitting} 
            />
        </div>
    );
};

export default KeuanganLPM;
