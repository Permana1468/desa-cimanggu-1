import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logoutUser();
                } else {
                    const basicUser = {
                        id: decodedToken.user_id,
                        username: decodedToken.username,
                        role: decodedToken.role,
                        unit_detail: decodedToken.unit_detail
                    };
                    setUser(basicUser);
                    // Fetch extended data like foto_profil and nama_lengkap
                    fetchFullUserData(basicUser);
                }
            } catch (error) {
                logoutUser();
            }
        }
        setLoading(false);
    }, []);

    const fetchFullUserData = async (basicUser) => {
        try {
            const res = await api.get('/users/api/users/me/');
            setUser({
                ...basicUser,
                nama_lengkap: res.data.nama_lengkap,
                foto_profil: res.data.foto_profil,
                email: res.data.email,
                nomor_telepon: res.data.nomor_telepon
            });
        } catch (e) {
            console.error("Failed to fetch full user data", e);
        }
    };

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
            unit_detail: decodedToken.unit_detail
        };
        setUser(basicUser);
        await fetchFullUserData(basicUser);

        return tokens;
    };

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
