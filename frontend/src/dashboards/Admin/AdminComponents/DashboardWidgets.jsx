import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

export const ActivityRow = ({ name, role, action, time, status }) => {
    const statusMap = {
        hadir:     { label: 'Hadir',     cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
        terlambat: { label: 'Terlambat', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        izin:      { label: 'Izin',      cls: 'bg-slate-400/10 text-slate-400 border-slate-400/20' },
    };
    const s = statusMap[status] || statusMap.hadir;
    return (
        <tr className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-200 last:border-b-0">
            <td className="py-3.5 px-6 align-middle">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-gold-dark
                                    text-black font-extrabold text-sm
                                    flex items-center justify-center shrink-0
                                    shadow-gold-glow">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-[13.5px] font-semibold text-text-main">{name}</div>
                        <div className="text-[11px] text-text-tertiary mt-px">{role}</div>
                    </div>
                </div>
            </td>
            <td className="py-3.5 px-6 align-middle text-[12.5px] text-text-muted">{action}</td>
            <td className="py-3.5 px-6 align-middle text-[11.5px] text-text-tertiary whitespace-nowrap">
                <Clock size={12} className="inline mr-1" />{time}
            </td>
            <td className="py-3.5 px-6 align-middle">
                <span className={`inline-block text-[10px] font-bold px-2.5 py-[3px] rounded-full
                                  uppercase tracking-[0.07em] border ${s.cls}`}>
                    {s.label}
                </span>
            </td>
        </tr>
    );
};

export const QuickAction = ({ icon: Icon, label, sub, color }) => {
    return (
        <button className="group/qa flex items-center gap-3.5 w-full px-5 py-3.5
                           bg-white/[0.03] border-none border-b border-white/[0.04] last:border-b-0
                           text-left cursor-pointer
                           hover:bg-white/[0.06] transition-colors duration-200">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-text-main">{label}</div>
                <div className="text-[11px] text-text-tertiary mt-[2px]">{sub}</div>
            </div>
            <ChevronRight size={16} className="text-text-quaternary ml-auto transition-all duration-200
                                               group-hover/qa:translate-x-[3px] group-hover/qa:text-gold" />
        </button>
    );
};

export const MiniBarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.val));
    return (
        <div className="flex items-end gap-2 h-20 px-5 pb-4">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                    <div
                        className="w-full rounded-t-md bg-gradient-to-b from-gold to-gold-dark
                                   min-h-1 shadow-gold-glow
                                   animate-[bar-grow_0.8s_ease_both]"
                        style={{ height: `${(d.val / max) * 100}%`, animationDelay: `${i * 80}ms` }}
                        title={`${d.label}: ${d.val}`}
                    />
                    <span className="text-[9.5px] text-text-tertiary font-semibold">{d.label}</span>
                </div>
            ))}
        </div>
    );
};
