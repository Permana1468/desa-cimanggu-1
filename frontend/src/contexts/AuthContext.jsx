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
                // Cek apakah token expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    logoutUser();
                } else {
                    setUser({
                        id: decodedToken.user_id,
                        username: decodedToken.username,
                        role: decodedToken.role,
                        unit_detail: decodedToken.unit_detail
                    });
                }
            } catch (error) {
                logoutUser();
            }
        }
        setLoading(false);
    }, []);

    const loginUser = async (username, password) => {
        const response = await api.post('/users/api/token/', {
            username,
            password,
        });

        const tokens = response.data;
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);

        // Decode token and set user state
        const decodedToken = jwtDecode(tokens.access);
        setUser({
            id: decodedToken.user_id,
            username: decodedToken.username,
            role: decodedToken.role,
            unit_detail: decodedToken.unit_detail
        });

        return tokens;
    };

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
