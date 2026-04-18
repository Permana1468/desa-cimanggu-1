import React, { useContext, lazy, Suspense } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingScreen from '../components/Shared/LoadingScreen';

// Lazy Load Main Dashboards
const DashboardUtamaAdmin = lazy(() => import('../dashboards/Admin/DashboardUtamaAdmin'));
const DashboardUtamaLPM = lazy(() => import('../dashboards/LPM/DashboardUtamaLPM'));

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <Suspense fallback={<LoadingScreen />}>
            {user?.role === 'LPM' ? (
                <DashboardUtamaLPM />
            ) : (
                <DashboardUtamaAdmin />
            )}
        </Suspense>
    );
};

export default Dashboard;
