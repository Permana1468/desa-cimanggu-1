import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { 
    Wallet, ArrowDownRight, ArrowUpRight, Plus, 
    Search, Trash2, X, AlertCircle, 
    Printer, FileText, Loader2,
    Calendar, TrendingUp
} from 'lucide-react';

// Sub-komponen
import CashbookHeader from './AdminComponents/CashbookHeader';
import CashbookStats from './AdminComponents/CashbookStats';
import CashbookTable from './AdminComponents/CashbookTable';
import CashbookFormModal from './AdminComponents/CashbookFormModal';

const StatCard = (props) => {
    const { icon: Icon, label, value, color, trend } = props;
    return (
        <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-2xl font-black text-white">{value}</h3>
            </div>
        </div>
    );
};

const BukuKasUmum = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        judul: '', tipe: 'Pemasukan', sumber_dana: 'Dana Desa', nominal: '',
        tanggal: new Date().toISOString().split('T')[0], keterangan: ''
    });

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await api.get('/users/api/lpm/keuangan/');
            setTransactions(response.data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

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
            setLoading(true);
            fetchTransactions();
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(angka || 0);
    };

    const totalIn = transactions.filter(k => k.tipe === 'Pemasukan').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const totalOut = transactions.filter(k => k.tipe === 'Pengeluaran').reduce((sum, k) => sum + parseFloat(k.nominal || 0), 0);
    const balance = totalIn - totalOut;

    const filteredData = transactions.filter(k => 
        (k.judul || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.sumber_dana || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 animate-pulse">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium tracking-widest uppercase text-center">Rekonsiliasi Buku Kas Umum...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-7 pb-10">
            <CashbookHeader setShowModal={setShowModal} />
            <CashbookStats 
                StatCard={StatCard} 
                ArrowDownRight={ArrowDownRight} 
                ArrowUpRight={ArrowUpRight} 
                TrendingUp={TrendingUp} 
                formatRupiah={formatRupiah} 
                totalIn={totalIn} 
                totalOut={totalOut} 
                balance={balance} 
            />
            <CashbookTable 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                filteredData={filteredData} 
                formatRupiah={formatRupiah} 
            />
            <CashbookFormModal 
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

export default BukuKasUmum;
