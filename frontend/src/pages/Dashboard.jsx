import React, { useContext, lazy, Suspense } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingScreen from '../components/Shared/LoadingScreen';

// Lazy Load Main Dashboards
const DashboardUtamaAdmin = lazy(() => import('../dashboards/Admin/DashboardUtamaAdmin'));
const DashboardUtamaLPM = lazy(() => import('../dashboards/LPM/DashboardUtamaLPM'));
const DashboardUtamaWarga = lazy(() => import('../dashboards/Warga/DashboardUtamaWarga'));
const DashboardUtamaKelembagaan = lazy(() => import('../dashboards/Shared/DashboardUtamaKelembagaan'));

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const renderDashboard = () => {
        switch (user?.role) {
            case 'ADMIN':
                return <DashboardUtamaAdmin />;
            case 'LPM':
                return <DashboardUtamaLPM />;
            case 'WARGA':
                return <DashboardUtamaWarga />;
            case 'RT':
            case 'RW':
            case 'KARANG_TARUNA':
            case 'BUMDES':
            case 'TP_PKK':
            case 'POSYANDU':
            case 'PUSKESOS':
                return <DashboardUtamaKelembagaan />;
            default:
                return <DashboardUtamaAdmin />;
        }
    };

    return (
        <Suspense fallback={<LoadingScreen />}>
            {renderDashboard()}
        </Suspense>
    );
};

export default Dashboard;
