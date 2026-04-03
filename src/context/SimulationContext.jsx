import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../config/api';

const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    // User State
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState([]);

    // IoT Grid Simulation State
    const [rain, setRain] = useState(12);
    const [aqi, setAqi] = useState(156);
    const [temp, setTemp] = useState(32);
    const [platformStatus, setPlatformStatus] = useState('Online');

    // Policy & Claims State
    const [plan, setPlan] = useState('Standard Protection');
    const [policyStatus, setPolicyStatus] = useState('Inactive'); // Inactive, Active, Paused
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [weeklySaved, setWeeklySaved] = useState(0);
    const [payoutHistory, setPayoutHistory] = useState([]);
    const [activePolicy, setActivePolicy] = useState(null);

    // Sync state with localStorage and backend
    useEffect(() => {
        const syncData = async () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsRegistered(true);
                
                // Fetch policy info from backend
                try {
                    const policyRes = await api.get(ENDPOINTS.POLICIES.ME);
                    if (policyRes.data) {
                        setActivePolicy(policyRes.data);
                        setPolicyStatus(policyRes.data.status);
                        setPlan(policyRes.data.planName || 'Standard Protection');
                    }
                } catch (err) {
                    console.warn('Could not fetch active policy, using local state');
                }

                // Fetch claims history
                try {
                    const claimsRes = await api.get(ENDPOINTS.CLAIMS.ME);
                    setPayoutHistory(claimsRes.data || []);
                    const total = (claimsRes.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
                    setTotalPayouts(total);
                } catch (err) {
                    console.warn('Could not fetch claims history');
                }
            }
        };
        syncData();
    }, []);

    // Policy Actions
    const createPolicy = async (policyData) => {
        try {
            const response = await api.post(ENDPOINTS.POLICIES.CREATE, policyData);
            setActivePolicy(response.data);
            setPolicyStatus(response.data.status);
            setPlan(response.data.planName);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Policy creation failed' };
        }
    };

    const pausePolicy = async () => {
        try {
            const response = await api.put(ENDPOINTS.POLICIES.PAUSE);
            setPolicyStatus(response.data.status);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to pause policy' };
        }
    };

    // Claims Actions
    const triggerClaim = async (claimParams) => {
        try {
            const response = await api.post(ENDPOINTS.CLAIMS.TRIGGER, claimParams);
            setPayoutHistory([response.data, ...payoutHistory]);
            setTotalPayouts(prev => prev + (response.data.amount || 0));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Claim trigger failed' };
        }
    };

    const value = {
        user, setUser,
        isRegistered, setIsRegistered,
        selectedRegions, setSelectedRegions,
        rain, setRain,
        aqi, setAqi,
        temp, setTemp,
        platformStatus, setPlatformStatus,
        plan, setPlan,
        policyStatus, setPolicyStatus,
        totalPayouts, setTotalPayouts,
        weeklySaved, setWeeklySaved,
        payoutHistory, setPayoutHistory,
        activePolicy, setActivePolicy,
        createPolicy, pausePolicy, triggerClaim
    };

    return (
        <SimulationContext.Provider value={value}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
};
