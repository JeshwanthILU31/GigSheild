import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, LogOut, RefreshCw, ShieldCheck, Crown } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/axiosInstance';
import { ENDPOINTS } from '../config/api';
import DeliverabilityScoreSmall from '../components/dashboard/DeliverabilityScoreSmall';

const WORKER_ME_ENDPOINT = '/api/workers/me';

const INITIAL_DASHBOARD_STATE = {
  worker: null,
  policy: null,
  claims: [],
  loading: true,
  historyEmpty: false
};

const normalizeClaims = (claimsPayload) => {
  if (Array.isArray(claimsPayload)) return claimsPayload;
  if (Array.isArray(claimsPayload?.claims)) return claimsPayload.claims;
  if (Array.isArray(claimsPayload?.data)) return claimsPayload.data;
  if (Array.isArray(claimsPayload?.data?.claims)) return claimsPayload.data.claims;
  return [];
};

const normalizeObjectPayload = (payload) => {
  if (!payload || Array.isArray(payload)) return null;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

const normalizePolicyHistory = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const getPolicyStatusKey = (policy) =>
  String(policy?.status || '').trim().toUpperCase();

const formatStatusLabel = (status) => {
  if (!status) return 'Inactive';
  return String(status)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatRenewalDate = (value) => {
  if (value == null || value === '') return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getErrorMessage = (error, fallbackMessage) => {
  const status = error?.response?.status;

  if (status === 409) {
    return error?.response?.data?.message || 'A policy already exists for this account.';
  }

  if (status === 500) {
    return error?.response?.data?.message || 'Something went wrong on the server. Please try again.';
  }

  if (!error?.response) {
    return 'Network error. Please check your connection and try again.';
  }

  return error?.response?.data?.message || fallbackMessage;
};

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { plan } = useSimulation();

  const isMountedRef = useRef(true);

  const [dashboardState, setDashboardState] = useState(INITIAL_DASHBOARD_STATE);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState({ coverage: false });
  const [actionError, setActionError] = useState('');

  const fetchDashboardData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setDashboardState((prev) => ({ ...prev, loading: true }));
    }

    setRefreshing(true);
    setActionError('');

    try {
      const [workerResult, claimsResult] = await Promise.allSettled([
        api.get(WORKER_ME_ENDPOINT),
        api.get(ENDPOINTS.CLAIMS.ME)
      ]);

      if (!isMountedRef.current) {
        return;
      }

      const nextWorker =
        workerResult.status === 'fulfilled'
          ? normalizeObjectPayload(workerResult.value?.data)
          : null;

      let nextClaims = [];
      if (claimsResult.status === 'fulfilled') {
        nextClaims = normalizeClaims(claimsResult.value?.data);
      } else {
        setActionError(getErrorMessage(claimsResult.reason, 'Unable to load claims.'));
      }

      if (workerResult.status === 'rejected') {
        setActionError((prev) => prev || getErrorMessage(workerResult.reason, 'Unable to load worker details.'));
      }

      let nextPolicy = null;
      let historyEmpty = false;

      try {
        const policyRes = await api.get(ENDPOINTS.POLICIES.ME, {
          validateStatus: (status) => status === 200 || status === 404
        });

        if (!isMountedRef.current) {
          return;
        }

        if (policyRes.status === 200) {
          nextPolicy = normalizeObjectPayload(policyRes.data);
        } else if (policyRes.status === 404) {
          try {
            const historyResponse = await api.get(ENDPOINTS.POLICIES.HISTORY);
            const historyList = normalizePolicyHistory(historyResponse?.data);
            historyEmpty = historyList.length === 0;
            nextPolicy = historyResponse?.data?.data?.[0] ?? historyList[0] ?? null;
          } catch (historyError) {
            setActionError((prev) => prev || getErrorMessage(historyError, 'Unable to load policy history.'));
            historyEmpty = false;
            nextPolicy = null;
          }
        }
      } catch (policyError) {
        setActionError((prev) => prev || getErrorMessage(policyError, 'Unable to load policy details.'));
      }

      if (!isMountedRef.current) {
        return;
      }

      setDashboardState({
        worker: nextWorker,
        policy: nextPolicy,
        claims: nextClaims,
        loading: false,
        historyEmpty
      });
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchDashboardData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchDashboardData]);

  useEffect(() => {
    const onExternalRefresh = () => {
      fetchDashboardData({ silent: true });
    };
    window.addEventListener('gigshield:dashboard-refresh', onExternalRefresh);
    return () => window.removeEventListener('gigshield:dashboard-refresh', onExternalRefresh);
  }, [fetchDashboardData]);

  const settledAmount = useMemo(() => {
    return Array.isArray(dashboardState.claims) && dashboardState.claims.length > 0
      ? dashboardState.claims.reduce((sum, claim) => sum + Number(claim?.amount || 0), 0)
      : 6700;
  }, [dashboardState.claims]);

  const chartData = useMemo(() => {
    const claims = dashboardState.claims;
    if (!Array.isArray(claims) || claims.length === 0) {
      return [
        { name: 'Sep', amount: 1250 },
        { name: 'Oct', amount: 800 },
        { name: 'Nov', amount: 2400 },
        { name: 'Dec', amount: 450 },
        { name: 'Jan', amount: 1800 }
      ];
    }
    return claims.map((claim, index) => ({
      name: `Claim ${index + 1}`,
      amount: Number(claim?.amount) || 0
    }));
  }, [dashboardState.claims]);

  const policyStatus = getPolicyStatusKey(dashboardState.policy);
  const shouldShowCreate = dashboardState.historyEmpty;
  const shouldShowPause = policyStatus === 'ACTIVE';
  const shouldShowResume = policyStatus === 'PAUSED';

  const handleActivateCoverage = async () => {
    setLoading((prev) => ({ ...prev, coverage: true }));
    setActionError('');

    try {
      await api.post(ENDPOINTS.POLICIES.CREATE, {
        planName: dashboardState.policy?.planName || plan || 'Standard Protection',
        pincode: dashboardState.worker?.pinCode || user?.pincode
      });

      await fetchDashboardData({ silent: true });
    } catch (error) {
      setActionError(getErrorMessage(error, 'Policy creation failed.'));
      setLoading((prev) => ({ ...prev, coverage: false }));
      return;
    }

    if (isMountedRef.current) {
      setLoading((prev) => ({ ...prev, coverage: false }));
    }
  };

  const handlePauseOrResume = async () => {
    setLoading((prev) => ({ ...prev, coverage: true }));
    setActionError('');

    try {
      const endpoint = shouldShowPause ? ENDPOINTS.POLICIES.PAUSE : ENDPOINTS.POLICIES.RESUME;
      await api.put(endpoint);
      await fetchDashboardData({ silent: true });
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to update policy status.'));
      setLoading((prev) => ({ ...prev, coverage: false }));
      return;
    }

    if (isMountedRef.current) {
      setLoading((prev) => ({ ...prev, coverage: false }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const premiumTier =
    dashboardState.policy?.premiumTier ?? dashboardState.policy?.tier ?? 'Standard';

  if (dashboardState.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-brand" size={28} />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 pb-20 relative max-w-7xl mx-auto">
      <header className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900 p-10 md:p-12 rounded-[3.5rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col space-y-5 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-3">
             <div className="px-4 py-2 bg-brand/20 border border-brand/30 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand/10">
                 <Crown size={16} className="text-brand drop-shadow-md" />
                 <span className="text-xs font-black text-brand uppercase tracking-widest">{premiumTier} Holder</span>
             </div>
             <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg ${policyStatus === 'ACTIVE' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
                 <ShieldCheck size={16} />
                 <span className="text-xs font-black uppercase tracking-widest">{formatStatusLabel(dashboardState.policy?.status)} Policy</span>
             </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {getGreeting()},<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400">
              {dashboardState.worker?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Partner'}
            </span>
          </h1>
          <p className="text-slate-400 flex items-center gap-2 text-lg font-medium italic">
            "Don't worry, we're with you in tough times."
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto justify-end">
          <button
            onClick={() => fetchDashboardData({ silent: true })}
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white backdrop-blur-md shadow-xl hover:scale-105"
          >
            <RefreshCw size={22} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={logout}
            className="p-5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all text-rose-400 backdrop-blur-md shadow-xl hover:scale-105"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black">
                  {dashboardState.policy?.planName || plan}
                </h3>
                <p className="text-sm text-slate-500">
                  {formatStatusLabel(dashboardState.policy?.status)}
                </p>
              </div>

              {(shouldShowCreate || shouldShowPause || shouldShowResume) && (
                <button
                  onClick={shouldShowCreate ? handleActivateCoverage : handlePauseOrResume}
                  disabled={loading.coverage}
                  className="px-6 py-3 rounded-2xl border hover:bg-slate-50 transition flex items-center gap-2"
                >
                  {loading.coverage ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Processing...
                    </>
                  ) : shouldShowPause ? (
                    'Pause Policy'
                  ) : shouldShowResume ? (
                    'Resume Policy'
                  ) : (
                    'Create Policy'
                  )}
                </button>
              )}
            </div>

            {actionError && (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {actionError}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <p className="text-sm text-slate-500">Weekly Premium</p>
                <h2 className="text-xl font-black mt-1">
                  ₹{dashboardState.policy?.weeklyPremium ?? 79}
                </h2>
              </div>
              <div>
                <p className="text-sm text-slate-500">Coverage Cap</p>
                <h2 className="text-xl font-black mt-1">
                  ₹{dashboardState.policy?.coverageCap ?? 1500}
                </h2>
              </div>
              <div>
                <p className="text-sm text-slate-500">Premium Tier</p>
                <h2 className="text-xl font-black mt-1">{premiumTier}</h2>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <h2 className="text-xl font-black mt-1">
                  {formatStatusLabel(dashboardState.policy?.status)}
                </h2>
              </div>
              <div className="col-span-2 md:col-span-1 xl:col-span-1">
                <p className="text-sm text-slate-500">Renewal Date</p>
                <h2 className="text-xl font-black mt-1">
                  {formatRenewalDate(dashboardState.policy?.renewalDate)}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl">
            <h3 className="font-black mb-6 text-lg">Claims analytics</h3>
            <p className="text-sm text-slate-500 mb-6">Settlement amounts per claim</p>
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                     type="monotone" 
                     dataKey="amount" 
                     stroke="#6366f1" 
                     strokeWidth={3} 
                     fillOpacity={1} 
                     fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <DeliverabilityScoreSmall />
          
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl">
            <h3 className="font-black mb-2 text-lg">Claims History</h3>
            <p className="text-sm text-slate-500 mb-6">
              Total settled: <span className="text-brand font-black">₹{settledAmount}</span>
            </p>
            {dashboardState.claims.length === 0 ? (
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-2">Demo Coverage Data</p>
                {[
                  { type: 'Heavy Rainfall Payout (HITEC City)', amount: 1800, date: '12 Jan 2026' },
                  { type: 'AQI Hazard (Bandra Zone)', amount: 450, date: '04 Dec 2025' },
                  { type: 'Heatwave Parametric Trigger', amount: 2400, date: '18 Nov 2025' },
                  { type: 'Platform Outage Compensation', amount: 800, date: '22 Oct 2025' },
                  { type: 'Minor Rain Disruption', amount: 1250, date: '15 Sep 2025' }
                ].map((claim, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-all bg-slate-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 blur-xl rounded-full group-hover:bg-brand/10 transition-colors" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{claim.date}</p>
                    <p className="font-bold text-slate-900 leading-tight mb-3 relative z-10 pr-2">{claim.type}</p>
                    <div className="inline-block px-3 py-1 bg-brand/10 rounded-full">
                        <p className="text-brand font-black text-sm relative z-10">₹{claim.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {dashboardState.claims.map((claim, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border mb-4 bg-slate-50 hover:shadow-md transition-all">
                    <p className="font-bold text-slate-900 leading-tight mb-2">{claim.type || claim.disruptionType}</p>
                    <div className="inline-block px-3 py-1 bg-brand/10 rounded-full">
                        <p className="text-brand font-black text-sm">₹{claim.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
