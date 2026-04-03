import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { safeGetItem } from '../utils/storage';

const AdminProtectedRoute = ({ children }) => {
    const isAdmin = safeGetItem('adminToken') === 'mock-admin-session';
    const location = useLocation();

    if (!isAdmin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
