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
import PublicRoute from '../components/PublicRoute.jsx';
import AdminProtectedRoute from '../components/AdminProtectedRoute';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';
import PlanSelection from '../pages/PlanSelection';
import ProfilePage from '../pages/ProfilePage';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/Admin';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public/Guest Routes - Wrapped in PublicRoute to redirect away if already logged in */}
            <Route 
                path="/" 
                element={
                    <PublicRoute>
                        <Home />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/verify-otp" 
                element={
                    <PublicRoute>
                        <VerifyOtp />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } 
            />
            
            {/* Admin Routes - Separately protected for administrative access */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
                path="/admin" 
                element={
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                } 
            />
            
            {/* Protected Routes - Only accessible when authenticated */}
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

            {/* Additional Protected Areas (like Pricing) */}
            <Route 
                path="/pricing" 
                element={
                    <ProtectedRoute>
                        <PricingPage />
                    </ProtectedRoute>
                } 
            />

            {/* Fallback to root (which handles redirection via guards) */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
