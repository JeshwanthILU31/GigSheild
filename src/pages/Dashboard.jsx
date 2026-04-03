import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle,
  Clock,
  LogOut,
  MapPin,
  Shield,
  ShieldAlert,
  ChevronRight,
  Loader2,
  XCircle,
  Pause,
  Activity,
  RefreshCw,
  ArrowRight,
  X,
  Plus,
  Crosshair,
  History as HistoryIcon
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { safeGetItem } from '../utils/storage';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, user, setUser } = useAuth();
    const { 
        rain, aqi, temp, platformStatus,
        plan, policyStatus, activePolicy,
        totalPayouts, weeklySaved, payoutHistory,
        createPolicy, pausePolicy, triggerClaim,
        selectedRegions, setSelectedRegions
    } = useSimulation();

    const [loading, setLoading] = useState({
        coverage: false,
        trigger: false,
        regions: false
    });
    
    const [nearbyZones, setNearbyZones] = useState([]);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [triggerResult, setTriggerResult] = useState(null);

    // Dynamic Region Generation based on Pincode
    useEffect(() => {
        const generateNearbyZones = () => {
            const pincode = user?.pincode || safeGetItem('registrationPincode') || '560001';
            const base = parseInt(pincode);
            
            // Generate some mock surrounding pincodes/zones
            const zones = [
                { id: 1, name: `Zone ${base - 1}`, pincode: `${base - 1}`, distance: '1.2 km' },
                { id: 2, name: `Zone ${base}`, pincode: `${base}`, distance: '0.5 km' },
                { id: 3, name: `Zone ${base + 1}`, pincode: `${base + 1}`, distance: '2.4 km' },
                { id: 4, name: `Zone ${base + 2}`, pincode: `${base + 2}`, distance: '3.1 km' },
            ];
            setNearbyZones(zones);
        };
        generateNearbyZones();
    }, [user?.pincode]);

    const handleToggleRegion = (zone) => {
        if (selectedRegions.find(r => r.id === zone.id)) {
            setSelectedRegions(selectedRegions.filter(r => r.id !== zone.id));
        } else if (selectedRegions.length < 2) {
            setSelectedRegions([...selectedRegions, zone]);
        }
    };

    const handleActivateCoverage = async () => {
        setLoading({ ...loading, coverage: true });
        const res = await createPolicy({
            planName: plan || 'Standard Protection',
            pincode: user?.pincode,
            regionCount: selectedRegions.length || 1
        });
        setLoading({ ...loading, coverage: false });
        if (res.success) {
            // Success feedback
        }
    };

    const handlePauseOrResume = async () => {
        setLoading({ ...loading, coverage: true });
        await pausePolicy(); // This toggles in the backend logic or needs resume? User said Pause Policy button.
        setLoading({ ...loading, coverage: false });
    };

    const handleTrigger = async (type) => {
        setLoading({ ...loading, trigger: true });
        setTriggerResult(null);
        const res = await triggerClaim({
            type,
            pincode: user?.pincode,
            value: type === 'rain' ? 45 : type === 'aqi' ? 320 : 45 // Simulated thresholds
        });
        setLoading({ ...loading, trigger: false });
        if (res.success) {
            setTriggerResult({ success: true, message: `Payout of ₹${res.data.amount} initiated!` });
        } else {
            setTriggerResult({ success: false, message: res.error });
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-8 py-6 pb-20 relative text-slate-900 dark:text-white transition-colors">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0 pointer-events-none" />
                
                <div className="flex items-center gap-6 relative z-10 cursor-pointer group" onClick={() => navigate('/dashboard/profile')}>
                    <div className="w-16 h-16 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-2xl font-black">
                        {user?.name?.[0] || 'P'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {getGreeting()}, <span className="text-brand">{user?.name?.split(' ')[0] || 'Partner'}</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                                <MapPin size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                   {user?.pincode} • {selectedRegions.length || 1} Region Protected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <button 
                        onClick={() => setShowClaimModal(true)}
                        className="bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-brand/20 hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <Zap size={18} />
                        Trigger Claim
                    </button>
                    <button onClick={logout} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Policy Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                         <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-3xl ${policyStatus === 'Active' ? 'bg-brand/5 text-brand' : 'bg-slate-50 text-slate-400'} flex items-center justify-center border border-current/10`}>
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{plan}</h3>
                                    <div className={`mt-1 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border inline-flex items-center gap-2 ${policyStatus === 'Active' ? 'bg-brand/5 text-brand border-brand/10' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${policyStatus === 'Active' ? 'bg-brand animate-pulse' : 'bg-slate-300'}`} />
                                        {policyStatus}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                {policyStatus === 'Inactive' ? (
                                    <button onClick={handleActivateCoverage} disabled={loading.coverage} className="btn-primary">
                                       {loading.coverage ? <Loader2 className="animate-spin" /> : 'Create Policy'}
                                    </button>
                                ) : (
                                    <button onClick={handlePauseOrResume} disabled={loading.coverage} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-all">
                                        {loading.coverage ? <Loader2 size={16} className="animate-spin" /> : policyStatus === 'Active' ? 'Pause Policy' : 'Resume'}
                                    </button>
                                )}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Weekly Premium', value: activePolicy?.weeklyPremium ? `₹${activePolicy.weeklyPremium}` : '₹79', icon: TrendingUp },
                                { label: 'Coverage Cap', value: activePolicy?.coverageCap ? `₹${activePolicy.coverageCap}` : '₹1,500', icon: Shield },
                                { label: 'Tier', value: activePolicy?.tier || 'Standard', icon: Zap },
                                { label: 'Settled', value: `₹${totalPayouts}`, icon: CheckCircle2 },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <stat.icon size={10} />
                                        <span className="text-[9px] font-black uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                    <div className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{stat.value}</div>
                                </div>
                            ))}
                         </div>
                    </div>

                    {/* Location Management */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8">
                         <div className="flex items-center justify-between mb-8">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Location Monitoring</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Select up to 2 zones for protection</p>
                             </div>
                             <div className="px-4 py-2 bg-brand/10 text-brand rounded-xl text-[10px] font-black uppercase">
                                {selectedRegions.length}/2 Selected
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {nearbyZones.map(zone => (
                                 <button
                                    key={zone.id}
                                    onClick={() => handleToggleRegion(zone)}
                                    className={`p-6 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group ${
                                        selectedRegions.find(r => r.id === zone.id)
                                        ? 'bg-brand/5 border-brand shadow-lg shadow-brand/5'
                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-brand/20'
                                    }`}
                                 >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                            selectedRegions.find(r => r.id === zone.id) ? 'bg-brand text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-brand'
                                        }`}>
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-lg ${selectedRegions.find(r => r.id === zone.id) ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{zone.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{zone.pincode} • {zone.distance}</p>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedRegions.find(r => r.id === zone.id) ? 'bg-brand border-brand text-white' : 'border-slate-200 dark:border-slate-700'
                                    }`}>
                                        {selectedRegions.find(r => r.id === zone.id) ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                    </div>
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right Column - History */}
                <div className="lg:col-span-4">
                     <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl h-full relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Claims History</h3>
                            <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                <HistoryIcon size={16} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {payoutHistory.length === 0 ? (
                                <div className="text-center py-20 opacity-30">
                                    <Activity className="mx-auto mb-4" size={40} />
                                    <p className="text-xs font-bold uppercase tracking-widest">No claims yet</p>
                                </div>
                            ) : payoutHistory.map((claim, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx} 
                                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-brand/30 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                                                <Zap size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{claim.disruptionType || claim.type || 'Weather Disruption'}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(claim.createdAt || claim.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-brand tracking-tight">₹{claim.amount}</p>
                                            <p className="text-[8px] text-green-500 font-black uppercase tracking-widest">{claim.status || 'Paid'}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-1 italic">"{claim.reason || 'Threshold exceeded in protected zone'}"</p>
                                </motion.div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            {/* Trigger Claim Modal */}
            <AnimatePresence>
                {showClaimModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg p-10 relative overflow-hidden"
                        >
                            <button onClick={() => setShowClaimModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-brand">
                                <X size={24} />
                            </button>

                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Trigger <span className="text-brand">GigShield</span></h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Demo Simulation Mode</p>
                            </div>

                            {triggerResult ? (
                                <div className="text-center py-10 space-y-6">
                                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${triggerResult.success ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {triggerResult.success ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">{triggerResult.success ? 'System Success' : 'Threshold Not Met'}</p>
                                        <p className="text-slate-500 text-sm mt-1">{triggerResult.message}</p>
                                    </div>
                                    <button onClick={() => { setShowClaimModal(false); setTriggerResult(null); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Done</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select disruption type</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'rain', name: 'Heavy Rain', icon: CloudRain, threshold: '40mm' },
                                            { id: 'aqi', name: 'Extreme AQI', icon: Wind, threshold: '300' },
                                            { id: 'heat', name: 'Extreme Heat', icon: Thermometer, threshold: '44°C' },
                                            { id: 'downtime', name: 'App Downtime', icon: Activity, threshold: 'Offline' },
                                        ].map(opt => (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleTrigger(opt.id)}
                                                disabled={loading.trigger}
                                                className="p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-brand/40 bg-white dark:bg-slate-900 transition-all text-left flex flex-col gap-4 group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand">
                                                    <opt.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest">{opt.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">Cap: {opt.threshold}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {loading.trigger && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                    <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Verifying Environmental Data</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
