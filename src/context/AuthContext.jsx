import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
            const { user, token } = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', token);
            setUser(user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response && (credentials.email || credentials.password)) {
                console.warn('Backend offline, using mock login');
                const mockUser = { 
                    name: localStorage.getItem('registrationName') || 'Guest Partner', 
                    email: credentials.email || 'guest@gig.com',
                    platform: 'Zomato',
                    zone: null // Trigger zone selection in dashboard
                };
                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('authToken', 'mock-token');
                setUser(mockUser);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
            // Save pincode for zone filtering in dashboard
            localStorage.setItem('registrationPincode', userData.pincode);
            localStorage.setItem('registrationName', userData.name);
            return { success: true, data: response.data };
        } catch (error) {
            // Fallback for demo/development if backend is offline
            if (!error.response) {
                console.warn('Backend offline, using mock registration');
                localStorage.setItem('registrationPincode', userData.pincode);
                localStorage.setItem('registrationName', userData.name);
                return { success: true, data: { message: 'Mock registration successful' } };
            }
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', nextTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('registrationPincode');
        localStorage.removeItem('registrationName');
        setUser(null);
        setIsAuthenticated(false);
    };

    const verifyOtp = async (otpData) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, otpData);
            return { success: true, data: response.data };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response) {
                console.warn('Backend offline, using mock verification');
                return { success: true, data: { message: 'Mock verification successful' } };
            }
            return { success: false, error: error.response?.data?.message || 'OTP verification failed' };
        }
    };

    const resendOtp = async (email) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
            return { success: true, data: response.data };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response) {
                console.warn('Backend offline, using mock OTP resend');
                return { success: true, data: { message: 'Mock OTP sent' } };
            }
            return { success: false, error: error.response?.data?.message || 'Resend OTP failed' };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
        verifyOtp,
        resendOtp,
        theme,
        toggleTheme
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
