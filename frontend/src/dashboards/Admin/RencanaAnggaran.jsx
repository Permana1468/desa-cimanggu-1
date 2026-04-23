import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Sub-komponen
import RabHeader from './AdminComponents/RabHeader';
import RabProjectInfo from './AdminComponents/RabProjectInfo';
import RabTable from './AdminComponents/RabTable';
import RabActions from './AdminComponents/RabActions';

const RencanaAnggaran = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const usulan_id = searchParams.get('usulan_id');

    const [proyekAktif, setProyekAktif] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [rabId, setRabId] = useState(null);
    const [rabItems, setRabItems] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const resUsulan = await api.get(`/users/api/musrenbang/${usulan_id}/`);
            setProyekAktif(resUsulan.data);

            const resRab = await api.get(`/users/api/rab/?usulan_id=${usulan_id}`);
            if (resRab.data.length > 0) {
                const existingRab = resRab.data[0];
                setRabId(existingRab.id);
                setRabItems(existingRab.items.map(item => ({
                    ...item,
                    id: item.id || Date.now() + Math.random()
                })));
            } else {
                setRabItems([{ id: 1, kategori: 'Bahan Material', uraian: '', volume: 0, satuan: '', harga_satuan: 0 }]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal memuat data usulan.');
        } finally {
            setLoading(false);
        }
    }, [usulan_id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (usulan_id) {
                fetchData();
            } else {
                setLoading(false);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [usulan_id, fetchData]);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const hitungTotalBaris = (volume, harga) => (volume || 0) * (harga || 0);
    const grandTotal = rabItems.reduce((total, item) => total + hitungTotalBaris(item.volume, item.harga_satuan), 0);

    const handleItemChange = (id, field, value) => {
        setRabItems(rabItems.map(item =>
            item.id === id ? {
                ...item,
                [field]: (field === 'volume' || field === 'harga_satuan') ? Number(value) : value
            } : item
        ));
    };

    const tambahBarisBaru = () => {
        setRabItems([...rabItems, { id: Date.now(), kategori: 'Bahan Material', uraian: '', volume: 0, satuan: '', harga_satuan: 0 }]);
    };

    const hapusBaris = (id) => {
        setRabItems(rabItems.filter(item => item.id !== id));
    };

    const handleSave = async (isFinal = false) => {
        if (!proyekAktif) return;
        try {
            setIsSaving(true);
            const payload = {
                usulan: proyekAktif.id,
                grand_total: grandTotal,
                status: isFinal ? 'FINAL' : 'DRAFT',
                items: rabItems.map(item => ({
                    kategori: item.kategori, uraian: item.uraian, volume: item.volume,
                    satuan: item.satuan, harga_satuan: item.harga_satuan,
                    total_harga: hitungTotalBaris(item.volume, item.harga_satuan)
                }))
            };

            if (rabId) {
                await api.put(`/users/api/rab/${rabId}/`, payload);
            } else {
                const res = await api.post('/users/api/rab/', payload);
                setRabId(res.data.id);
            }

            alert(`✅ RAB Berhasil Disimpan sebagai ${isFinal ? 'FINAL' : 'DRAFT'}!`);
            if (isFinal) navigate('/dashboard/verifikasi-usulan');
        } catch (error) {
            console.error('Error saving RAB:', error);
            alert('❌ Gagal menyimpan RAB. Pastikan semua data valid.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 italic">
            <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
            Memuat data usulan...
        </div>
    );

    if (!proyekAktif) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#1e293b]/20 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-4xl mb-6 border border-yellow-500/20">📐</div>
            <h3 className="text-xl font-bold text-white mb-2">Pilih Usulan Terlebih Dahulu</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                Halaman ini digunakan untuk menyusun RAB dari usulan yang telah disetujui. Silakan pilih usulan pembangunan melalui Panel Verifikasi.
            </p>
            <button onClick={() => navigate('/dashboard/verifikasi-usulan')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-500/20">Ke Halaman Verifikasi</button>
        </div>
    );

    return (
        <div className="text-gray-200 animate-fade-in pb-10">
            <RabHeader formatRupiah={formatRupiah} grandTotal={grandTotal} />
            <RabProjectInfo proyekAktif={proyekAktif} />
            <RabTable 
                rabItems={rabItems} 
                handleItemChange={handleItemChange} 
                tambahBarisBaru={tambahBarisBaru} 
                hapusBaris={hapusBaris} 
                formatRupiah={formatRupiah} 
                hitungTotalBaris={hitungTotalBaris} 
                grandTotal={grandTotal} 
            />
            <RabActions isSaving={isSaving} handleSave={handleSave} />
        </div>
    );
};

export default RencanaAnggaran;
