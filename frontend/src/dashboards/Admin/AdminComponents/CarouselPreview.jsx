import React from 'react';

const CarouselPreview = ({ previewImages, currentSlide, formData }) => {
    return (
        <div className="relative w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 mb-8 group bg-black">
            {/* Background Carousel */}
            {previewImages.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <div
                        className={`w-full h-full bg-cover bg-center transition-transform duration-[15000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
                        style={{ backgroundImage: `url('${src}')`, willChange: 'transform' }}
                    ></div>
                </div>
            ))}

            {/* Overlay Text Preview */}
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/70 to-transparent p-10 flex flex-col justify-center">
                <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-[10px] text-yellow-400 mb-4 border border-white/10 w-max">
                    <span className="animate-pulse mr-2">●</span> Live Preview Landing Page
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                    {formData.hero_title || "Pemerintah Desa"}
                </h1>
                <h1 className="text-3xl md:text-5xl font-black text-yellow-400 mb-4 leading-tight uppercase drop-shadow-md">
                    {formData.title || "CIMANGGU I"}
                </h1>
                <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed drop-shadow-md">
                    {formData.hero_subtitle || "Platform digital terpadu untuk mengelola data pemberdayaan masyarakat."}
                </p>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30">
                {previewImages.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === currentSlide ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CarouselPreview;
