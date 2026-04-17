import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardUtamaAdmin from '../dashboards/Admin/DashboardUtamaAdmin';
import DashboardUtamaLPM from '../dashboards/LPM/DashboardUtamaLPM';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (user?.role === 'LPM') return <DashboardUtamaLPM />;
    if (user?.role === 'ADMIN') return <DashboardUtamaAdmin />;

    // Default: render Admin Dashboard for other privileged roles
    return <DashboardUtamaAdmin />;
};

export default Dashboard;
