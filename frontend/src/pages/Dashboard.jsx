import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardUtamaLPM from '../components/lpm/DashboardUtamaLPM';

const Dashboard = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    }

    // Render dashboard khusus LPM
    if (user?.role === 'LPM') {
        return <DashboardUtamaLPM />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Dashboard Utama</h1>

            {user ? (
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                        <h3 className="text-lg font-semibold text-gray-100">Selamat Datang, {user.username}!</h3>
                        <p className="text-sm text-gray-400 mt-1">Anda berhasil login ke sistem pemerintahan desa.</p>
                    </div>

                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-center">
                            <span className="text-sm font-medium text-blue-400 mb-1">Status Autentikasi</span>
                            <span className="text-xl font-bold text-gray-100">Aktif</span>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-center">
                            <span className="text-sm font-medium text-indigo-400 mb-1">Role Akun</span>
                            <span className="text-xl font-bold text-gray-100 uppercase">{user.role || '-'}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-center">
                            <span className="text-sm font-medium text-purple-400 mb-1">Unit Detail</span>
                            <span className="text-xl font-bold text-gray-100">{user.unit_detail || '-'}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center">
                            <span className="text-sm font-medium text-gray-400 mb-1">User ID</span>
                            <span className="text-xl font-bold text-gray-100">#{user.id}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">Memuat data pengguna...</div>
            )}
        </div>
    );
};

export default Dashboard;
