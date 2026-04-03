import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/axiosInstance';
import { ENDPOINTS } from '../config/api';
import { safeGetItem, safeParse, safeRemoveItems } from '../utils/storage';

const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const hasSynced = useRef(false);

    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState([]);

    const [rain, setRain] = useState(12);
    const [aqi, setAqi] = useState(156);
    const [temp, setTemp] = useState(32);
    const [platformStatus, setPlatformStatus] = useState('Online');

    const [plan, setPlan] = useState('Standard Protection');
    const [policyStatus, setPolicyStatus] = useState('Inactive');
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [weeklySaved, setWeeklySaved] = useState(0);
    const [payoutHistory, setPayoutHistory] = useState([]);
    const [activePolicy, setActivePolicy] = useState(null);

    useEffect(() => {
        if (hasSynced.current) return;
        hasSynced.current = true;

        const syncData = async () => {
            const parsedUser = safeParse('user');
            const token = safeGetItem('authToken');

            if (parsedUser && token) {
                setUser(parsedUser);
                setIsRegistered(true);

                try {
                    const policyRes = await api.get(ENDPOINTS.POLICIES.ME);
                    if (policyRes.data) {
                        setActivePolicy(policyRes.data);
                        setPolicyStatus(policyRes.data.status);
                        setPlan(policyRes.data.planName || 'Standard Protection');
                    }
                } catch (err) {
                    setActivePolicy(null);
                    setPolicyStatus('Inactive');
                }

                try {
                    const claimsRes = await api.get(ENDPOINTS.CLAIMS.ME);
                    const claims = Array.isArray(claimsRes.data) ? claimsRes.data
                                 : Array.isArray(claimsRes.data?.claims) ? claimsRes.data.claims
                                 : [];
                    setPayoutHistory(claims);
                    const total = claims.reduce((acc, c) => acc + (c.amount || 0), 0);
                    setTotalPayouts(total);
                } catch (err) {
                    // silent
                }
            } else {
                safeRemoveItems('user', 'authToken');
                setUser(null);
                setIsRegistered(false);
                setPayoutHistory([]);
                setTotalPayouts(0);
            }
        };

        syncData();
    }, []);

    const createPolicy = async (policyData) => {
        try {
            const response = await api.post(ENDPOINTS.POLICIES.CREATE, policyData);
            setActivePolicy(response.data);
            setPolicyStatus(response.data.status);
            setPlan(response.data.planName);
            return { success: true };
        } catch (error) {
            // 409 = already exists, not a real failure
            if (error.response?.status === 409) {
                return { success: false, alreadyExists: true, error: 'Policy already exists' };
            }
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

    const triggerClaim = async (claimParams) => {
        try {
            const response = await api.post(ENDPOINTS.CLAIMS.TRIGGER, claimParams);
            setPayoutHistory(prev => [response.data, ...prev]);
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