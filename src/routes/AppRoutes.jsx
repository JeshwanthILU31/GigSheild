import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import PricingPage from '../pages/PricingPage';
import Register from '../pages/Register';
import VerifyOtp from '../pages/VerifyOTP';
import LoginPage from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Policy from '../pages/Policy';
import DashboardLayout from '../layouts/DashboardLayout';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';
import PlanSelection from '../pages/PlanSelection';

import ProfilePage from '../pages/ProfilePage';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/Admin';
import { History, Settings } from 'lucide-react';

const AppRoutes = () => {
    const { isRegistered } = useSimulation();
    const { isAuthenticated } = useAuth();
    const isAdmin = localStorage.getItem('adminToken') === 'mock-admin-session';

    // Bridge for transition: consider user authenticated if either context says so
    const isUserAuthenticated = isAuthenticated || isRegistered;

    return (
        <Routes>
            {/* Public Routes */}
            <Route 
                path="/" 
                element={
                    isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />
                } 
            />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
                path="/admin" 
                element={
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                } 
            />
            
            {/* Protected Dashboard Area */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="select-plan" element={<PlanSelection />} />
                <Route path="policy" element={<Policy />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
