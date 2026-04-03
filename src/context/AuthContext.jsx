import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../config/api';
import { safeGetItem, safeParse, safeRemoveItems, safeSetItem, safeSetJSON } from '../utils/storage';

const AuthContext = createContext();

const normalizeAuthPayload = (responseData) => {
    const payload = responseData?.data || responseData;
    const token = payload?.token || responseData?.token || null;
    const user = payload?.worker || payload?.user || responseData?.worker || responseData?.user || null;

    if (!token || !user) {
        return null;
    }

    return { token, user };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = safeParse('user');
        const token = safeGetItem('authToken');

        if (storedUser && token) {
            setUser(storedUser);
            setIsAuthenticated(true);
        } else {
            safeRemoveItems('user', 'authToken');
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
            const authPayload = normalizeAuthPayload(response.data);

            if (!response.data?.success || !authPayload) {
                safeRemoveItems('user', 'authToken');
                return { success: false, error: response.data?.message || 'Login failed' };
            }

            const { user, token } = authPayload;

            safeSetJSON('user', user);
            safeSetItem('authToken', token);
            setUser(user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response && (credentials.email || credentials.password)) {
                console.warn('Backend offline, using mock login');
                const mockUser = { 
                    name: safeGetItem('registrationName') || 'Guest Partner', 
                    email: credentials.email || 'guest@gig.com',
                    platform: 'Zomato',
                    zone: null // Trigger zone selection in dashboard
                };
                safeSetJSON('user', mockUser);
                safeSetItem('authToken', 'mock-token');
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
            safeSetItem('registrationPincode', userData.pinCode);
            safeSetItem('registrationName', userData.name);
            return { success: true, data: response.data };
        } catch (error) {
            // Fallback for demo/development if backend is offline
            if (!error.response) {
                console.warn('Backend offline, using mock registration');
                safeSetItem('registrationPincode', userData.pinCode);
                safeSetItem('registrationName', userData.name);
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
        safeSetItem('theme', nextTheme);
    };

    useEffect(() => {
        const savedTheme = safeGetItem('theme') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const logout = () => {
        safeRemoveItems('user', 'authToken', 'userEmail', 'adminToken', 'registrationPincode', 'registrationName');
        setUser(null);
        setIsAuthenticated(false);
    };

    const verifyOtp = async (otpData) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, otpData);

            const authPayload = normalizeAuthPayload(response.data);
            if (response.data?.success && authPayload) {
                safeSetJSON('user', authPayload.user);
                safeSetItem('authToken', authPayload.token);
                setUser(authPayload.user);
                setIsAuthenticated(true);
            }

            return { success: Boolean(response.data?.success), data: response.data };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response) {
                console.warn('Backend offline, using mock verification');
                return { success: true, data: { message: 'Mock verification successful' } };
            }
            return { success: false, error: error.response?.data?.message || 'OTP verification failed' };
        }
    };

    const resendOtp = async (registrationData) => {
        try {
            const response = await api.post(ENDPOINTS.AUTH.REGISTER, registrationData);

            if (registrationData?.pinCode) {
                safeSetItem('registrationPincode', registrationData.pinCode);
            }
            if (registrationData?.name) {
                safeSetItem('registrationName', registrationData.name);
            }

            return { success: Boolean(response.data?.success), data: response.data };
        } catch (error) {
            // Fallback for demo/development
            if (!error.response && registrationData) {
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
