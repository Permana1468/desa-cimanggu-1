import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    return {
                        id: decodedToken.user_id,
                        username: decodedToken.username,
                        role: decodedToken.role,
                        unit_detail: decodedToken.unit_detail,
                        status: decodedToken.status,
                        is_verified: decodedToken.is_verified
                    };
                }
            } catch (e) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const fetchFullUserData = async (basicUser) => {
        try {
            const res = await api.get('/users/api/users/me/');
            const fullData = {
                ...basicUser,
                nama_lengkap: res.data.nama_lengkap,
                foto_profil: res.data.foto_profil,
                email: res.data.email,
                nomor_telepon: res.data.nomor_telepon,
                status: res.data.status,
                is_verified: res.data.is_verified
            };
            setUser(fullData);
            return res.data;
        } catch (e) {
            console.error("Failed to fetch full user data", e);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFullUserData(user);
        }
        setLoading(false);
    }, []);

    const refreshUser = () => {
        if (user) fetchFullUserData(user);
    };

    const loginUser = async (username, password, captcha_token, captcha_answer) => {
        const response = await api.post('/users/api/token/', {
            username,
            password,
            captcha_token,
            captcha_answer
        });

        const tokens = response.data;
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);

        // Decode token and set user state
        const decodedToken = jwtDecode(tokens.access);
        const basicUser = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            role: decodedToken.role,
            unit_detail: decodedToken.unit_detail,
            status: decodedToken.status,
            is_verified: decodedToken.is_verified
        };
        setUser(basicUser);
        const fullUser = await fetchFullUserData(basicUser);

        // Security Check: Institutional roles must be ACTIVE/VERIFIED
        const finalUser = fullUser || basicUser;
        if (finalUser.role !== 'WARGA' && finalUser.role !== 'ADMIN' && finalUser.status === 'PENDING') {
            logoutUser();
            const error = new Error("Akun Kelembagaan belum diverifikasi.");
            error.response = { data: { detail: "Akun Kelembagaan Anda belum disetujui oleh Admin Desa. Mohon tunggu proses verifikasi oleh Admin." } };
            throw error;
        }

        return tokens;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
