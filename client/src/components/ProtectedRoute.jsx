import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const { isRegistered } = useSimulation();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

<<<<<<< HEAD
    // A user is considered authenticated if they are logged in via AuthContext 
    // OR if they've successfully finished the demo registration flow (isRegistered)
    const isUserAuthenticated = isAuthenticated || isRegistered;

    if (!isUserAuthenticated) {
=======
    if (!isAuthenticated) {
>>>>>>> 86766f9345e54c39e89819d4ef53aab8b1976759
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
