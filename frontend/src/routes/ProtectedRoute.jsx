import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Memuat data...
            </div>
        );
    }

    // Jika belum login, arahkan ke halaman login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Jika allowedRoles didefinisikan dan role user tidak ada di dalamnya, arahkan ke unauthorized
    if (allowedRoles) {
        const userRole = (user.role || '').toUpperCase();
        const upperAllowedRoles = allowedRoles.map(r => r.toUpperCase());

        if (!upperAllowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Jika lolos validasi, render komponen anaknya (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
