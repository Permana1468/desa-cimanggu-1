import React from 'react';
import { Briefcase, Users, Calendar } from 'lucide-react';

const ProgramStats = ({ programsCount, totalParticipants, monthlyProgramsCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Briefcase className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Program</p>
                    <p className="text-2xl font-bold text-white">{programsCount}</p>
                </div>
            </div>
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Peserta</p>
                    <p className="text-2xl font-bold text-white">{totalParticipants}</p>
                </div>
            </div>
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bulan Ini</p>
                    <p className="text-2xl font-bold text-white">{monthlyProgramsCount}</p>
                </div>
            </div>
        </div>
    );
};

export default ProgramStats;
