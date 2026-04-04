import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

// Lazy loaded pages
const Home = lazy(() => import('../pages/Home'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const Register = lazy(() => import('../pages/Register'));
const VerifyOtp = lazy(() => import('../pages/VerifyOTP'));
const LoginPage = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Policy = lazy(() => import('../pages/Policy'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const PlanSelection = lazy(() => import('../pages/PlanSelection'));
const LocationSelection = lazy(() => import('../pages/LocationSelection'));
const BillingPage = lazy(() => import('../pages/BillingPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/Admin'));

const Loader = () => (
    <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
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

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

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
                    <Route path="select-location" element={<LocationSelection />} />
                    <Route path="policy" element={<Policy />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route
                    path="/pricing"
                    element={
                        <ProtectedRoute>
                            <PricingPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;