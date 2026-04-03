import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Check, 
  Zap, 
  Wind, 
  CloudRain, 
  Thermometer, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  Loader2,
  Lock,
  Globe,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { safeGetItem } from '../utils/storage';
import api from '../utils/axiosInstance';
import { ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';

const PlanSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isUpgradeMode = location.state?.isUpgrade || false;
    const currentTier = location.state?.currentTier || null;
    const { user } = useAuth();
    const { 
        rain, aqi, temp, 
        setPlan, setPolicyStatus,
        createPolicy
    } = useSimulation();
    
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState('selection');
    const [error, setError] = useState(null);

    const activeZone = safeGetItem('activeZone') || 'Generic Zone';

    // Dynamic premium calculation 
    const basePremium = 49;
    
    // Add additional zone-based historical risk logic for heavy rainfall areas
    const highRiskZones = ['Madhapur', 'Bandra', 'Koramangala', 'Connaught Place'];
    const zoneRiskMultiplier = highRiskZones.includes(activeZone) ? 1.25 : 1.0;
    
    const weatherRisk = ((rain * 1.5) + (aqi / 15) + (temp > 35 ? 15 : 0)) * zoneRiskMultiplier;
    const dynamicPremium = Math.round(basePremium + weatherRisk);

    const plans = [
        {
            id: 'Standard',
            name: 'Basic Shield',
            price: dynamicPremium,
            coverage: '₹1,500',
            icon: Shield,
            color: '#00e676', 
            perks: ['Rain Protection', 'AQI Alerts', '70% Quick Payout']
        },
        {
            id: 'Premium',
            name: 'Elite Shield',
            price: Math.round(dynamicPremium * 1.4),
            coverage: '₹3,000',
            icon: Zap,
            color: '#ff9800', 
            perks: ['Rain + Heat Cover', 'Platform Downtime', '90% Payout', 'Priority Claims'],
            recommended: true
        },
        {
            id: 'Ultra',
            name: 'Global Shield',
            price: Math.round(dynamicPremium * 1.8),
            coverage: '₹5,000',
            icon: ShieldCheck,
            color: '#8b5cf6', 
            perks: ['Full Weather Suite', 'Platform + Battery Cover', '100% Guaranteed', 'Instant Cashout']
        }
    ];

    const handleSelectAndPay = async () => {
        if (!selectedPlan) return;
        setStep('payment');
        setIsProcessing(true);
        setError(null);

        // Handle payment demo flow transition before hitting logic
        setStep('demo-payment');
    };

    const confirmPaymentDemo = async () => {
        setIsProcessing(true);
        setError(null);
        setStep('processing-payment');
        
        let res;
        try {
             if (isUpgradeMode) {
                 const reqBody = {
                     planName: selectedPlan.name,
                     weeklyPremium: selectedPlan.price,
                     coverageCap: parseInt(selectedPlan.coverage.replace('₹', '').replace(',', '')),
                     tier: selectedPlan.id
                 };
                 const axiosRes = await api.put(ENDPOINTS.POLICIES.UPDATE, reqBody);
                 res = { success: true, data: axiosRes.data };
             } else {
                 res = await createPolicy({
                     planName: selectedPlan.name,
                     weeklyPremium: selectedPlan.price,
                     coverageCap: parseInt(selectedPlan.coverage.replace('₹', '').replace(',', '')),
                     tier: selectedPlan.id,
                     pincode: user?.pincode || safeGetItem('registrationPincode')
                 });
             }
        } catch (e) {
             res = { success: false, error: e.response?.data?.message || 'Transaction failed' };
        }

        if (res.success) {
            setPlan(selectedPlan.name);
            setPolicyStatus('Active');
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => navigate('/dashboard'), 2000);
        } else {
            setError(res.error);
            setIsProcessing(false);
            setStep('selection');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-body relative overflow-hidden transition-colors duration-500">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'selection' && (
                        <motion.div 
                            key="selection"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Header Section */}
                            <div className="text-center space-y-6 max-w-2xl mx-auto">
                                <motion.div 
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                                >
                                    <Sparkles size={12} />
                                    Customized Protection
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                                    Risk-Adjusted <span className="text-brand">Premium</span>
                                </h1>
                                <p className="text-slate-500 font-medium text-sm">
                                    Local area history for <span className="text-slate-900 font-bold">{activeZone}</span> (PIN: {user?.pincode || safeGetItem('registrationPincode')}) processed.
                                </p>

                                {error && (
                                    <div className="p-4 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest justify-center">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                {/* Minimal Risk Factors Bar */}
                                <div className="flex flex-wrap justify-center gap-3 mt-10">
                                    {[
                                        { label: 'Rain Risk', value: rain + 'mm', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
                                        { label: 'AQI Level', value: aqi, icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50' },
                                        { label: 'Temp Impact', value: temp + '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
                                    ].map((risk, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-5 py-3 ${risk.bg} rounded-2xl border border-slate-100 shadow-sm`}>
                                            <risk.icon size={16} className={risk.color} />
                                            <div className="text-left">
                                                <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">{risk.label}</div>
                                                <div className="text-xs font-black text-slate-800 mt-0.5">{risk.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plan Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                                {plans.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        onClick={() => setSelectedPlan(p)}
                                        whileHover={{ y: -8 }}
                                        className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${
                                            selectedPlan?.id === p.id 
                                            ? 'bg-white border-brand shadow-2xl shadow-brand/10' 
                                            : 'bg-white border-slate-100 hover:border-brand/30 shadow-xl shadow-slate-200/40'
                                        }`}
                                    >
                                        {p.recommended && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                                Most Popular
                                            </div>
                                        )}
                                        
                                        <div className="w-12 h-12 rounded-2xl mb-8 flex items-center justify-center shadow-inner" style={{ backgroundColor: `${p.color}10`, color: p.color }}>
                                            <p.icon size={24} />
                                        </div>

                                        <h3 className="text-lg font-black tracking-tight mb-2 text-slate-800 uppercase">{p.name}</h3>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-4xl font-black text-slate-900">₹{p.price}</span>
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/week</span>
                                        </div>

                                        <div className="space-y-4 mb-10 pb-10 border-b border-slate-100">
                                            {p.perks.map((perk, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${selectedPlan?.id === p.id ? 'bg-brand/10' : 'bg-slate-50'}`}>
                                                        <Check size={12} className={selectedPlan?.id === p.id ? 'text-brand' : 'text-slate-300'} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{perk}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`w-full py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                                            selectedPlan?.id === p.id 
                                            ? 'bg-brand text-white border-brand' 
                                            : 'border-slate-100 text-slate-400'
                                        }`}>
                                            {selectedPlan?.id === p.id ? 'Active Selection' : 'Select Plan'}
                                            {selectedPlan?.id === p.id && <ArrowRight size={14} />}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Minimal Footer */}
                            <div className="flex flex-col items-center gap-8 pt-8">
                                <button
                                    onClick={handleSelectAndPay}
                                    disabled={!selectedPlan || isProcessing}
                                    className="px-12 py-5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-slate-900/20 transition-all flex items-center gap-4 disabled:opacity-20 hover:-translate-y-1 group"
                                >
                                    {isProcessing ? 'Processing...' : 'Activate Protection'}
                                    {!isProcessing && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    {isProcessing && <Loader2 size={18} className="animate-spin" />}
                                </button>
                                
                                <div className="flex items-center gap-6 text-slate-400">
                                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                                        <Lock size={12} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Bank-Grade Protection</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                                        <ShieldCheck size={12} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Instant Activation</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'demo-payment' && (
                        <motion.div 
                            key="demo-payment"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] space-y-10"
                        >
                            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                
                                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">{isUpgradeMode ? 'Confirm Plan Change' : 'Complete Payment'}</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                        <div className="text-sm font-bold text-slate-500">Selected Plan</div>
                                        <div className="text-lg font-black text-slate-900 uppercase">{selectedPlan?.name}</div>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                        <div className="text-sm font-bold text-slate-500">Coverage Limit</div>
                                        <div className="text-lg font-black text-slate-900">{selectedPlan?.coverage}</div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="text-sm font-bold text-slate-500">Total Premium</div>
                                        <div className="text-3xl font-black text-brand">₹{selectedPlan?.price}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={confirmPaymentDemo}
                                    className="w-full mt-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <CreditCard size={20} />
                                    Confirm & Pay ₹{selectedPlan?.price}
                                </button>
                                
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6">
                                    Demo Mode • Secure Internal Gateway
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'processing-payment' && (
                        <motion.div 
                            key="processing-payment"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-[80vh] flex flex-col items-center justify-center space-y-10"
                        >
                            <div className="w-24 h-24 bg-brand/10 border border-brand/20 rounded-[2rem] flex items-center justify-center text-brand relative overflow-hidden">
                                <Loader2 size={32} className="animate-spin relative z-10" />
                                <div className="absolute inset-0 bg-brand/5 animate-pulse" />
                            </div>
                            <div className="text-center space-y-3">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Processing Payment</h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                    Securely communicating with bank...
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-[80vh] flex flex-col items-center justify-center space-y-10"
                        >
                            <div className="w-24 h-24 bg-brand rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-brand/20">
                                <Check size={48} strokeWidth={4} />
                            </div>
                            <div className="text-center space-y-3">
                                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Coverage is Live</h2>
                                <p className="text-slate-500 text-xs font-bold tracking-widest max-w-xs mx-auto">
                                    Your earnings are safe. Welcome to the GigShield Network.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PlanSelection;
