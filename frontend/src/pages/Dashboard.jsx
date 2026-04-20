import React, { useContext, lazy, Suspense } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingScreen from '../components/Shared/LoadingScreen';

// Lazy Load Main Dashboards
const DashboardUtamaAdmin = lazy(() => import('../dashboards/Admin/DashboardUtamaAdmin'));
const DashboardUtamaLPM = lazy(() => import('../dashboards/LPM/DashboardUtamaLPM'));
const DashboardUtamaWarga = lazy(() => import('../dashboards/Warga/DashboardUtamaWarga'));
const DashboardUtamaKelembagaan = lazy(() => import('../dashboards/Shared/DashboardUtamaKelembagaan'));
const DashboardUtamaToko = lazy(() => import('../dashboards/Toko/DashboardUtamaToko'));

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const renderDashboard = () => {
        switch (user?.role) {
            case 'ADMIN':
                return <DashboardUtamaAdmin />;
            case 'LPM':
                return <DashboardUtamaLPM />;
            case 'OWNER_TOKO':
                return <DashboardUtamaToko />;
            case 'WARGA':
                return <DashboardUtamaWarga />;
            case 'RT':
            case 'RW':
            case 'KARANG_TARUNA':
            case 'BUMDES':
            case 'TP_PKK':
            case 'POSYANDU':
            case 'PUSKESOS':
            case 'KADUS':
            case 'SEKDES':
            case 'KAUR_PERENCANAAN':
            case 'KAUR_TU':
            case 'KAUR_KEUANGAN':
            case 'KASI_PEMERINTAHAN':
            case 'KASI_KESEJAHTERAAN':
            case 'KASI_PELAYANAN':
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
