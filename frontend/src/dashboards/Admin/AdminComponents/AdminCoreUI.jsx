import React, { useState, useEffect } from 'react';

export const AnimatedNumber = ({ target, prefix = '', suffix = '' }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1400;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCurrent(target); clearInterval(timer); }
            else setCurrent(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{prefix}{current.toLocaleString()}{suffix}</span>;
};

export const GlassPanel = ({ children, className = '' }) => (
    <div className={`bg-dark-card backdrop-blur-[24px] border border-white/[0.07] rounded-[20px] overflow-hidden transition-all duration-500 ${className}`}>
        {children}
    </div>
);

export const PanelHeader = ({ icon: Icon, title, badge, actionText, children, ChevronRight }) => {
    return (
        <div className="flex items-center justify-between px-6 pt-5 mb-[18px]">
            <div className="flex items-center gap-2 text-sm font-bold text-text-main tracking-tight">
                {Icon && <Icon size={15} className="text-gold" />}
                {title}
                {badge && (
                    <span className="bg-gold-light border border-gold-border text-gold
                                     text-[10px] font-bold px-2 py-[2px] rounded-full
                                     tracking-[0.05em] uppercase">
                        {badge}
                    </span>
                )}
            </div>
            {actionText && (
                <button className="text-xs text-text-muted bg-transparent border-none cursor-pointer
                                   flex items-center gap-[3px] hover:text-gold transition-colors duration-200">
                    {actionText} {ChevronRight && <ChevronRight size={12} />}
                </button>
            )}
            {children}
        </div>
    );
};
