import React from 'react';
import { Save } from 'lucide-react';

const CarouselHeader = ({ isLoading, handleSubmit }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Hero & Carousel</h1>
                <p className="text-gray-400 mt-1">Kelola teks sambutan selamat datang dan gambar dinamis carousel.</p>
            </div>
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isLoading
                    ? 'bg-yellow-500/50 text-slate-900/50 cursor-not-allowed shadow-none'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/20'
                    }`}
            >
                <Save className="w-4 h-4" />
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>
    );
};

export default CarouselHeader;
