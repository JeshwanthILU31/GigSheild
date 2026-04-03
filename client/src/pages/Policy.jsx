import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Clock,
  RefreshCw,
  BarChart,
  XCircle,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  TrendingDown,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/axiosInstance';
import { ENDPOINTS } from '../config/api';
import { safeGetItem } from '../utils/storage';
import {
  formatRenewalDate,
  getTierMultiplierDisplay,
  loadPolicyWithFallback,
  normalizeObjectPayload
} from '../utils/policyHydration';

const WORKER_ME_ENDPOINT = '/api/workers/me';

const Policy = () => {
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState(null);
  const [worker, setWorker] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handlePayPremium = () => {
      setIsPaying(true);
      setTimeout(() => {
          setIsPaying(false);
          setPaySuccess(true);
          setTimeout(() => setPaySuccess(false), 3000);
      }, 1500);
  };

  const activeZone = safeGetItem('activeZone') || 'HITEC City';

  const fetchPolicyPageData = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      let nextWorker = null;
      try {
        const workerResult = await api.get(WORKER_ME_ENDPOINT);
        nextWorker = normalizeObjectPayload(workerResult?.data);
      } catch {
        /* worker optional; policy page still shows policy */
      }

      if (!isMountedRef.current) return;

      setWorker(nextWorker);

      const { policy: nextPolicy } = await loadPolicyWithFallback(api, ENDPOINTS);

      if (!isMountedRef.current) return;

      setPolicy(nextPolicy);
    } catch (e) {
      if (!isMountedRef.current) return;
      setLoadError(
        e?.response?.data?.message || 'Unable to load policy. Please try again.'
      );
      setPolicy(null);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchPolicyPageData();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPolicyPageData]);

  const registrationPincode =
    worker?.pinCode ||
    worker?.pincode ||
    user?.pincode ||
    safeGetItem('registrationPincode') ||
    '—';

  const suggestedZones = String(registrationPincode).startsWith('500')
    ? ['HITEC City', 'Madhapur', 'Gachibowli', 'Kukatpally']
    : ['Delhi NCR', 'Mumbai West', 'Bangalore East', 'Chennai Central'];

  const multiplier = useMemo(
    () => getTierMultiplierDisplay(policy?.tier),
    [policy?.tier]
  );

  const triggers = useMemo(
    () => [
      {
        icon: CloudRain,
        title: 'Rain / Flood',
        logic: 'Rainfall > 40mm in 3-hour window',
        payout: `₹320.00 × ${multiplier}x`
      },
      {
        icon: Wind,
        title: 'Air Pollution (AQI)',
        logic: 'AQI > 300 for 4+ hours',
        payout: `₹250.00 × ${multiplier}x`
      },
      {
        icon: Thermometer,
        title: 'Extreme Heat',
        logic: 'Temperature > 44°C for 5 hours',
        payout: `₹180.00 × ${multiplier}x`
      },
      {
        icon: Zap,
        title: 'App Downtime',
        logic: 'App down > 2 hours in peak time',
        payout: `₹250.00 × ${multiplier}x`
      }
    ],
    [multiplier]
  );

  const rules = [
    {
      icon: Clock,
      title: '3-Week Waiting Period',
      desc: 'No payouts eligible within the first 21 days of policy activation to prevent fraud.'
    },
    {
      icon: RefreshCw,
      title: '48-Hour Cooling Period',
      desc: 'Cooldown starts after every payout to ensure stability for reinsurance pools.'
    },
    {
      icon: BarChart,
      title: 'Weekly Payout Limit',
      desc: "Maximum payout per week follows your tier's fixed coverage cap."
    },
    {
      icon: XCircle,
      title: 'No Manual Claims',
      desc: 'Our IoT triggers are final. No documents or manual claim filing is permitted.'
    }
  ];

  const tiers = [
    { name: 'Basic', mult: '0.8x', cap: '₹800', key: '0.8' },
    { name: 'Standard', mult: '1.0x', cap: '₹1,500', key: '1.0' },
    { name: 'Premium', mult: '1.2x', cap: '₹2,500', key: '1.2' }
  ];

  const tierLabel = policy?.tier || policy?.planName || 'Standard';
  const planTitle = policy?.planName || 'GigShield Protection';
  const statusLabel = policy?.status
    ? String(policy.status)
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : '—';

  const matchesTierRow = (row) => {
    if (row.key === multiplier) return true;
    if (multiplier === '1.4' && row.key === '1.2') return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] py-16">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin text-brand" size={28} />
          <span className="font-medium">Loading policy details…</span>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="space-y-8 py-12 px-4 max-w-2xl mx-auto text-center">
        <Shield className="mx-auto text-brand/40" size={48} />
        <h1 className="text-3xl font-black text-slate-900">No active policy</h1>
        <p className="text-slate-500 font-medium">
          {loadError ||
            'When you enroll in a plan, your live terms, tier, and coverage will appear here.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/dashboard/select-plan"
            className="px-8 py-4 rounded-2xl bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-brand-hover transition-all"
          >
            Choose a plan
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest text-slate-700 hover:border-brand/30 transition-all"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-100 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />

        <div className="max-w-2xl relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Policy Details
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Shield size={18} className="text-brand" />
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {planTitle} • {statusLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 lg:pb-2 relative z-10 mt-8 lg:mt-0 px-4">
          <div className="bg-white px-8 py-6 border border-slate-100 rounded-3xl shadow-xl shadow-brand/5">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Operational zone
            </p>
            <h4 className="text-xl font-extrabold text-slate-900">{activeZone}</h4>
            <div className="mt-3 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center border border-slate-100 w-fit">
              PIN: {registrationPincode}
            </div>
          </div>
          <div className="bg-white px-8 py-6 border border-slate-100 rounded-3xl shadow-xl shadow-brand/5">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Tier multiplier
            </p>
            <h4 className="text-4xl font-extrabold text-slate-900">{multiplier}x</h4>
            <div className="mt-3 px-3 py-1 bg-brand/5 rounded-full text-[10px] font-bold text-brand uppercase tracking-wider text-center border border-brand/10 w-fit">
              {tierLabel}
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
            Weekly premium
          </p>
          <p className="text-2xl font-black text-slate-900">
            ₹{policy?.weeklyPremium ?? '—'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
            Coverage cap
          </p>
          <p className="text-2xl font-black text-slate-900">
            ₹{policy?.coverageCap ?? '—'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
            Premium tier
          </p>
          <p className="text-2xl font-black text-slate-900">
            {policy?.premiumTier || policy?.tier || '—'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
            Renewal date
          </p>
          <p className="text-xl font-black text-slate-900">
            {formatRenewalDate(policy?.renewalDate)}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-4">
        <div className="lg:col-span-4 lg:sticky lg:top-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Policy framework</h3>
            <p className="text-slate-500 leading-relaxed">
              Parametric insurance works on binary logic. If the trigger event happens, you get paid
              instantly. The following rules protect the platform&apos;s stability for all workers.
            </p>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-brand/20 hover:shadow-xl">
              <TrendingDown size={28} className="text-brand mb-6" />
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Payout limitation
              </h5>
              <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                Annual cap = 20× your cumulative weekly premium payments.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 flex flex-col items-start gap-6 border border-slate-100 rounded-3xl shadow-sm hover:border-brand/30 hover:shadow-xl transition-all group overflow-hidden relative"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand transition-all group-hover:bg-brand group-hover:text-white">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{rule.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{rule.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-10 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-bold text-slate-900">Trigger conditions</h3>
          <div className="h-0.5 flex-grow mx-12 bg-slate-50 rounded-full lg:block hidden" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {triggers.map((trigger, i) => {
            const Icon = trigger.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 flex flex-col items-center text-center gap-6 group hover:translate-y-[-4px] border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-50 group-hover:border-brand/20 group-hover:bg-brand/5 transition-all">
                  <Icon size={28} className="text-brand" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-slate-900">{trigger.title}</h4>
                  <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-50">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {trigger.logic}
                    </p>
                  </div>
                  <div className="text-2xl font-extrabold text-brand border-t border-slate-50 pt-4">
                    {trigger.payout}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden group mx-4">
        <div className="absolute top-0 left-0 w-full h-full bg-brand/10 blur-[120px] -z-0" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-bold mb-4 text-white">Tier multipliers</h3>
            <p className="text-white/50 leading-relaxed text-sm font-medium">
              Your payout scales based on your subscription tier. Your current plan is{' '}
              <span className="text-brand font-bold">{tierLabel}</span> at{' '}
              <span className="text-white font-bold">{multiplier}x</span>.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((row, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-6 ${
                  matchesTierRow(row)
                    ? 'border-brand bg-brand/10 shadow-2xl'
                    : 'border-white/5 bg-white/5 opacity-50'
                }`}
              >
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {row.name} tier
                </h4>
                <div className="text-5xl font-extrabold text-white">{row.mult}</div>
                <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-wider border border-white/5">
                  Cap {row.cap}/wk
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <footer className="text-center py-20 px-8 bg-slate-50 rounded-3xl border border-slate-100 mx-4 mt-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="px-4 py-1.5 bg-white border border-slate-100 rounded-full w-fit mx-auto shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Policy version 4.1.2026 • Verified parametric seal
            </p>
          </div>
          <p className="text-slate-600 font-medium text-lg leading-relaxed italic">
            GigShield uses independent hyperlocal IoT sensors and global weather APIs. Trigger events
            are determined by our localized grid network for your active pincode zone.
          </p>
          <div className="flex justify-center gap-8 pt-4 items-center text-slate-200">
            <div className="h-px bg-slate-200 w-16" />
            <Shield size={24} className="text-brand/30" />
            <div className="h-px bg-slate-200 w-16" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Policy;
