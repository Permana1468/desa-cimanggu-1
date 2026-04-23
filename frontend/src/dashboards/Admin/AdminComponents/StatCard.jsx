import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnimatedNumber } from './AdminCoreUI';

const StatCard = (props) => {
    const { icon: Icon, label, value, sub, prefix = '', suffix = '', trend, trendUp, color, delay = 0 } = props;
    return (
        <div
            className="group relative bg-dark-card backdrop-blur-[20px] border border-white/[0.07]
                       rounded-[20px] overflow-hidden cursor-default
                       transition-all duration-300 ease-out
                       hover:-translate-y-1 hover:border-gold-border
                       hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                       animate-[card-in_0.5s_ease_both]"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Glow blob on hover */}
            <div className="absolute -top-1/2 -left-[30%] w-[130%] h-[130%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{ background: `radial-gradient(circle at 30% 30%, ${color}12, transparent 65%)` }} />

            <div className="relative z-[1] p-[22px_24px]">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                         style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                        <Icon size={20} style={{ color }} />
                    </div>
                    {trend && (
                        <div className={`inline-flex items-center gap-[3px] text-[11px] font-bold
                                        px-[9px] py-[3px] rounded-full
                                        ${trendUp
                                            ? 'bg-emerald-400/[0.12] text-emerald-500 border border-emerald-400/20'
                                            : 'bg-red-400/[0.12] text-red-500 border border-red-400/20'}`}>
                            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                            <span>{trend}</span>
                        </div>
                    )}
                </div>

                <div className="text-[32px] font-extrabold text-text-main tracking-tight mt-4 leading-none">
                    <AnimatedNumber target={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="text-[12.5px] font-medium text-text-muted mt-[5px] uppercase tracking-[0.06em]">
                    {label}
                </div>
                {sub && <div className="text-[11.5px] text-text-tertiary mt-1">{sub}</div>}
            </div>
        </div>
    );
};

export default StatCard;
