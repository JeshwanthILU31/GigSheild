import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  Bell, 
  Key, 
  LogOut, 
  ChevronRight,
  Phone,
  Mail,
  Zap,
  Globe,
  Settings,
  CheckCircle2,
  AlertTriangle,
  History as HistoryIcon,
  CloudRain,
  ArrowRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
    const { plan, totalPayouts, setIsRegistered, selectedRegions, activePolicy } = useSimulation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsRegistered(false);
        navigate('/');
        setTimeout(() => {
            logout();
        }, 10);
    };

    // Plan features articulation
    const getPlanFeatures = (planName) => {
        if (planName?.includes('Elite')) return ['~90% Payout Ratio', 'Heat + Rain + AQI', 'Priority Claims'];
        if (planName?.includes('Global')) return ['100% Guaranteed Payout', 'Full Weather Suite', 'Platform Downtime'];
        return ['70% Payout Ratio', 'Rain + AQI Protection', 'Standard Claims'];
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f0d] pt-16 pb-20 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* 1. Basic Information Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/30 dark:shadow-none relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden group-hover:rotate-1 transition-transform duration-500">
                                <User size={80} className="text-slate-200 dark:text-slate-700" />
                            </div>
                            <div className="absolute bottom-1 right-1 w-10 h-10 bg-brand text-white rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                <Shield size={18} />
                            </div>
                        </div>

                        <div className="text-center sm:text-left flex-grow">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 mb-4">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {user?.name || "Partner"}
                                </h1>
                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg flex items-center gap-1.5 shadow-sm">
                                    <CheckCircle2 size={12} className="text-blue-500" />
                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Verified Partner</span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-900 dark:bg-brand rounded-full mb-6">
                                <div className="w-1.5 h-1.5 bg-brand dark:bg-slate-900 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-white dark:text-slate-900 uppercase tracking-wider">{user?.platformId || "ZO-45678"}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-slate-50 dark:border-white/5">
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                                    <span className="text-sm font-semibold">{user?.phone || "+91 98765 43210"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400"><Mail size={14} /></div>
                                    <span className="text-sm font-semibold truncate max-w-[180px]">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                    <span className="text-sm font-semibold">{user?.pincode} • {selectedRegions[0]?.name || 'Base Zone'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400"><Globe size={14} /></div>
                                    <span className="text-sm font-semibold">Platform: <span className="text-brand dark:text-brand font-bold uppercase">{user?.platform || "Zomato"}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 2. Insurance Status Section */}
                    <motion.div 
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-50 dark:bg-brand/10 border border-orange-100 dark:border-brand/20 rounded-xl flex items-center justify-center text-brand shadow-sm">
                                    <Shield size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Active Plan</h3>
                            </div>
                            <div className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-green-100 dark:border-green-500/20 shadow-sm">
                                {activePolicy?.status || 'Active'}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-50 dark:border-white/5 pb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Selected Coverage</p>
                                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{plan}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-brand font-extrabold text-2xl">₹{activePolicy?.weeklyPremium || '79'}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Per Week</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Highlights for {user?.pincode}</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {getPlanFeatures(plan).map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                                            <CheckCircle2 size={14} className="text-brand" />
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 dark:bg-brand rounded-2xl p-6 flex items-center justify-between shadow-xl">
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-white/30 dark:text-slate-900/30 uppercase tracking-widest mb-1">Protected Zones</p>
                                    <p className="text-xs font-bold text-white dark:text-slate-900">{selectedRegions.length || 1} Total</p>
                                </div>
                                <div className="h-8 w-px bg-white/10 dark:bg-slate-900/10" />
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-white/30 dark:text-slate-900/30 uppercase tracking-widest mb-1">Max Cap</p>
                                    <p className="text-xs font-bold text-white dark:text-slate-900">₹{activePolicy?.coverageCap || '1,500'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Payout Summary Section */}
                    <motion.div 
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm text-sm">
                                    <HistoryIcon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Settlement Sync</h3>
                            </div>
                            <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 text-slate-400 group-hover:text-brand transition-colors">
                                <CreditCard size={18} />
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Parametric Payouts</p>
                                <h4 className="text-6xl font-extrabold text-brand">₹{totalPayouts}</h4>
                                <div className="mt-3 flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                    <TrendingUp size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Automatic Crediting Active</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Linked Payout Accounts</p>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-black text-[10px]">UPI</div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{user?.upiId || 'partner@upi'}</p>
                                    </div>
                                    <CheckCircle2 size={14} className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Logout Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                    <button onClick={() => navigate('/dashboard')} className="flex-grow inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-slate-900 dark:bg-brand text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-brand/90 transition-all shadow-xl shadow-slate-900/10">
                        Go to Dashboard 
                        <ArrowRight size={18} />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 font-bold text-sm hover:bg-rose-500 hover:text-white transition-all border border-rose-100 dark:border-rose-500/20 shadow-lg shadow-rose-500/5 group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Logout Session
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default ProfilePage;
