import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { compressImage } from '../../utils/imageUtils';

// Sub-komponen
import PejabatHeader from './AdminComponents/PejabatHeader';
import PejabatTable from './AdminComponents/PejabatTable';
import PejabatFormModal from './AdminComponents/PejabatFormModal';

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

    const fetchPejabat = useCallback(async () => {
        try {
            const res = await api.get('/users/api/pejabat-desa/');
            setPejabatList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data pejabat", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPejabat();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchPejabat]);

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
        try {
            const data = new FormData();
            data.append('nama', formData.nama);
            data.append('jabatan', formData.jabatan);
            data.append('level', formData.level);
            
            if (formData.foto) {
                const compressedFile = await compressImage(formData.foto);
                data.append('foto', compressedFile);
            }

            await api.post('/users/api/pejabat-desa/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsModalOpen(false);
            setFormData({ nama: '', jabatan: '', level: '3', foto: null });
            setIsLoading(true);
            fetchPejabat();
        } catch (error) {
            console.error("Gagal menyimpan data pejabat", error);
            let errorMsg = "Gagal menyimpan. Periksa koneksi atau console log.";
            if (error.response) {
                const detail = error.response.data?.detail || error.response.data?.error || JSON.stringify(error.response.data);
                errorMsg += `\n\nDetail: ${error.response.status} - ${detail}`;
            }
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus pejabat ini?")) return;
        try {
            await api.delete(`/users/api/pejabat-desa/${id}/`);
            setIsLoading(true);
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
            <PejabatHeader setIsModalOpen={setIsModalOpen} />
            <PejabatTable 
                isLoading={isLoading} 
                pejabatList={pejabatList} 
                handlePrintID={handlePrintID} 
                handleDelete={handleDelete} 
            />
            <PejabatFormModal 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
                isSaving={isSaving} 
                handleSubmit={handleSubmit} 
                formData={formData} 
                handleChange={handleChange} 
            />
        </div>
    );
};

export default StrukturOrganisasi;
