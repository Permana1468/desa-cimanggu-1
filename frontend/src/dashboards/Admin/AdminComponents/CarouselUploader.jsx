import React from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

const CarouselUploader = ({ formData, imageFiles, handleChange, handleDeleteImage }) => {
    return (
        <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-medium text-gray-200 pb-2">Carousel Background (Minimal HD)</h3>

            {['carousel_image_1', 'carousel_image_2', 'carousel_image_3'].map((imgKey, idx) => (
                <div key={imgKey} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    {/* Preview Image */}
                    <div className="w-24 h-16 rounded-lg bg-[#0f172a] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {formData[imgKey] ? (
                            <img src={formData[imgKey]} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-gray-600" />
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Gambar Slide {idx + 1}</label>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-l-xl bg-[#0f172a] text-gray-300 hover:bg-white/10 cursor-pointer transition-colors text-sm w-32 shrink-0">
                                <Upload className="w-4 h-4 mr-2" />
                                Pilih File
                                <input
                                    type="file"
                                    name={imgKey}
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </label>
                            <div className="flex-1 px-4 py-2 bg-[#0f172a]/50 border-y border-white/10 text-sm text-gray-500 truncate min-w-0">
                                {imageFiles[imgKey] ? imageFiles[imgKey].name : (formData[imgKey] ? "Tersimpan di Supabase" : "Belum ada gambar")}
                            </div>
                            {formData[imgKey] && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(imgKey)}
                                    className="flex items-center justify-center w-10 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-r-xl transition-all active:scale-90 shrink-0"
                                    title="Hapus Gambar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            {!formData[imgKey] && (
                                <div className="w-10 py-2 border-y border-r border-white/10 rounded-r-xl bg-white/5 opacity-50 shrink-0" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarouselUploader;
