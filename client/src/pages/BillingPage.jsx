import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { ENDPOINTS } from '../config/api';
import { formatRenewalDate, loadPolicyWithFallback } from '../utils/policyHydration';

const BillingPage = () => {
  const isMountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState(null);
  
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchPolicyData = useCallback(async () => {
    setLoading(true);
    try {
      const { policy: nextPolicy } = await loadPolicyWithFallback(api, ENDPOINTS);
      if (!isMountedRef.current) return;
      setPolicy(nextPolicy);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchPolicyData();
    return () => { isMountedRef.current = false; };
  }, [fetchPolicyData]);

  const handleOpenPayment = () => setShowPaymentModal(true);

  const handleConfirmPayment = () => {
      setIsPaying(true);
      setTimeout(() => {
          setIsPaying(false);
          setShowPaymentModal(false);
          setPaySuccess(true);
          setTimeout(() => setPaySuccess(false), 3000);
      }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 size={48} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 pb-20 font-body transition-colors duration-500">
      <header className="pt-16 pb-12 px-8 flex justify-between items-end mb-8 relative z-10 mx-4 border-b border-transparent">
        <div>
          <h2 className="text-sm font-black tracking-widest text-slate-400 uppercase mb-2">GigShield</h2>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Billing & Plans</h1>
        </div>
      </header>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden mx-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Header and Controls */}
        <div className="p-10 md:p-12 border-b border-slate-100 relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-10">
                <div className="space-y-4 max-w-lg">
                    <h3 className="text-3xl font-bold text-slate-900 border-l-4 border-brand pl-4">Billing & Plan Control</h3>
                    <p className="text-slate-500 font-medium leading-relaxed pl-4">
                        Manage your premium coverage limits and billing schedule. View your next due date and payment history below.
                    </p>
                    
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mt-6 grid grid-cols-2 gap-4 shadow-inner">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Next Payment & Due</p>
                            <p className="text-xl font-black text-slate-900">{formatRenewalDate(policy?.renewalDate)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amount Due</p>
                            <p className="text-xl font-black text-brand">₹{policy?.weeklyPremium ?? 79}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {paySuccess ? (
                        <div className="px-10 py-5 bg-emerald-50 text-emerald-600 font-black uppercase tracking-[0.2em] rounded-3xl flex items-center justify-center gap-2 border border-emerald-100 shadow-sm w-full sm:w-auto h-full">
                            <CheckCircle2 size={18} /> Verified
                        </div>
                    ) : (
                        <button
                            onClick={handleOpenPayment}
                            className="px-8 py-5 bg-white border border-slate-200 hover:border-brand/30 text-slate-900 font-black uppercase tracking-[0.2em] rounded-3xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md w-full sm:w-auto h-full"
                        >
                            Pay Premium
                        </button>
                    )}
                    <Link
                        to="/dashboard/select-plan"
                        state={{ isUpgrade: true, currentTier: policy?.premiumTier }}
                        className="px-8 py-5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl transition-all hover:-translate-y-1 text-center flex items-center justify-center w-full sm:w-auto h-full"
                    >
                        Change Plan
                    </Link>
                </div>
            </div>
        </div>

        {/* Payment History Log */}
        <div className="p-10 md:p-12 bg-slate-50 relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Clock size={16} /> Premium Payment Ledger
            </h4>
            <div className="space-y-4">
                {[
                    { id: 'TRX-9482', date: 'Last Week', amount: policy?.weeklyPremium ?? 79, status: 'Settled' },
                    { id: 'TRX-8310', date: '2 Weeks Ago', amount: policy?.weeklyPremium ?? 79, status: 'Settled' },
                    { id: 'TRX-7201', date: '3 Weeks Ago', amount: policy?.weeklyPremium ?? 79, status: 'Settled' },
                ].map((trx, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-900">{trx.date}</h5>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{trx.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h5 className="font-extrabold text-slate-900">₹{trx.amount}</h5>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{trx.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <AnimatePresence>
        {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => !isPaying && setShowPaymentModal(false)}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Premium Payment</h2>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <div className="text-sm font-bold text-slate-500">Premium Cycle</div>
                            <div className="text-lg font-black text-slate-900">{formatRenewalDate(policy?.renewalDate)}</div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="text-sm font-bold text-slate-500">Total</div>
                            <div className="text-3xl font-black text-brand">₹{policy?.weeklyPremium ?? 79}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirmPayment}
                        disabled={isPaying}
                        className="w-full mt-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isPaying ? (
                            <><Loader2 size={20} className="animate-spin" /> Processing</>
                        ) : (
                            <>Confirm & Pay ₹{policy?.weeklyPremium ?? 79}</>
                        )}
                    </button>
                    
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6">
                        Demo Mode • Secure Internal Gateway
                    </p>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillingPage;
