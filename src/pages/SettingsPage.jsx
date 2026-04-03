import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Smartphone, 
    User, 
    Mail, 
    Moon, 
    Sun, 
    LifeBuoy, 
    ArrowRight, 
    ChevronRight, 
    LogOut, 
    Bell, 
    ShieldCheck, 
    CreditCard,
    Layout,
    Lock,
    Landmark,
    Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';

const SettingsPage = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const { plan } = useSimulation();
    const [activeTab, setActiveTab] = useState('general');
    const [selectedZone, setSelectedZone] = useState(localStorage.getItem('activeZone') || 'HITEC City');

    const handleSaveZone = () => {
        localStorage.setItem('activeZone', selectedZone);
        alert('Coverage Area updated to ' + selectedZone);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Layout },
        { id: 'coverage', label: 'Coverage', icon: MapPin },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'support', label: 'Support', icon: LifeBuoy },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-10">
            {/* 1. Header & Profile Hero */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <header className="lg:w-1/3 flex flex-col justify-center">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Account <br/>Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                        Tailor your GigShield experience. Configure your protection limits, monitoring zones, and interface preferences.
                    </p>
                </header>

                <div className="lg:w-2/3 bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 blur-[100px] -z-0 opacity-50 translate-x-1/4 -translate-y-1/2" />
                    <div className="relative z-10 flex items-center gap-8">
                        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand to-orange-600 p-1">
                            <div className="w-full h-full rounded-[1.8rem] bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-white/10">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Partner'}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">{user?.name || 'Ravi Kumar'}</h3>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-brand uppercase tracking-widest border border-white/5">
                                    {plan} Tier
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Partner</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="relative z-10 px-8 py-4 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 rounded-2xl text-rose-400 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 group"
                    >
                        Sign Out <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* 2. Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
                {/* Lateral Navigation Panels */}
                <div className="lg:col-span-3 space-y-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white dark:bg-slate-900 text-brand shadow-2xl shadow-slate-200/50 dark:shadow-none border-2 border-brand/10' 
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-2 border-transparent'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'general' && (
                            <motion.div 
                                key="general"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-8"
                            >
                                {/* Theme Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-3">
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Interface Theme</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                                                Choose your visual preference. Dark mode is optimized for night driving and low-light eye protection.
                                            </p>
                                        </div>
                                        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-2 rounded-[2rem] gap-2 border border-slate-100 dark:border-slate-800">
                                            <button 
                                                onClick={() => theme === 'dark' && toggleTheme()}
                                                className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-brand shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                                            >
                                                <Sun size={16} /> Light
                                            </button>
                                            <button 
                                                onClick={() => theme === 'light' && toggleTheme()}
                                                className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-brand dark:bg-brand text-white shadow-xl shadow-brand/20' : 'text-slate-500 dark:text-slate-600 hover:text-slate-300'}`}
                                            >
                                                <Moon size={16} /> Dark
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Notifications Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-3">
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Smart Payout Alerts</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                                                Instant SMS and push notification when our IoT sensors trigger an automated weather payout.
                                            </p>
                                        </div>
                                        <div className="w-16 h-8 bg-emerald-500 rounded-full p-1 relative flex items-center pr-1 transition-all cursor-pointer">
                                            <div className="w-6 h-6 bg-white rounded-full absolute right-1 shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'coverage' && (
                            <motion.div 
                                key="coverage"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl"
                            >
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Active Grid Control</h4>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Currently Selected: {selectedZone}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(localStorage.getItem('registrationPincode')?.startsWith('500') 
                                            ? ['HITEC City', 'Madhapur', 'Gachibowli', 'Kukatpally'] 
                                            : ['Delhi NCR', 'Mumbai West', 'Bangalore East', 'Chennai Central']
                                        ).map(zone => (

                                            <button 
                                                key={zone}
                                                type="button"
                                                onClick={() => setSelectedZone(zone)}
                                                className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group text-left ${zone === selectedZone ? 'border-brand bg-brand/5 shadow-2xl shadow-brand/10' : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-900 hover:border-brand/20'}`}
                                            >
                                                <div>
                                                    <h5 className={`text-lg font-black ${zone === selectedZone ? 'text-brand' : 'text-slate-700 dark:text-slate-200'}`}>{zone}</h5>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Stable</p>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${zone === selectedZone ? 'border-brand bg-brand' : 'border-slate-200 dark:border-slate-700 group-hover:border-brand'}`}>
                                                    {zone === selectedZone && <ChevronRight size={16} className="text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleSaveZone}
                                        className="w-full xl:w-1/2 py-4 rounded-2xl bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-3 mt-4"
                                    >
                                        <MapPin size={16} /> Save Grid Configuration
                                    </button>

                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'support' && (
                            <motion.div 
                                key="support"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-8"
                            >
                                <div className="bg-brand rounded-[3rem] p-12 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                        <div className="space-y-6">
                                            <h3 className="text-4xl font-black tracking-tight leading-tight">Need immediate <br/> assistance?</h3>
                                            <p className="text-white/70 font-medium max-w-sm">Our 24/7 dedicated help center resolves weather disputes and billing queries in under 15 minutes.</p>
                                        </div>
                                        <button className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4">
                                            Open Support Hub <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div 
                                key="security"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-8"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Change Password</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                                                Update your account's access credentials. We recommend using a strong password.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <form className="space-y-6 max-w-md" onSubmit={(e) => { e.preventDefault(); alert('Password updated successfully!');}}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Current Password</label>
                                            <input type="password" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">New Password</label>
                                            <input type="password" required minLength={8} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium" placeholder="Enter new password" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Confirm New Password</label>
                                            <input type="password" required minLength={8} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium" placeholder="Re-enter new password" />
                                        </div>
                                        <button type="submit" className="w-full mt-4 py-4 rounded-2xl bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 transition-all">
                                            Update Password
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <motion.div 
                                key="billing"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-8"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Landmark size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Payout Destination</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                                                Where should we send your automated claims? Configure your primary bank or UPI ID.
                                            </p>
                                        </div>
                                    </div>

                                    <form className="space-y-6 max-w-md" onSubmit={(e) => { e.preventDefault(); alert('Payout details updated successfully!');}}>
                                        <div className="space-y-4 pt-2">
                                            <h5 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Bank Account Transfer</h5>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Account Number</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium font-mono" placeholder="Enter Account Number" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">IFSC Code</label>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium font-mono" placeholder="eg. HDFC0001234" />
                                            </div>
                                        </div>
                                        
                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">Or Use UPI</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest pl-1">Preferred UPI ID</label>
                                            <div className="relative">
                                                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
                                                    <Wallet size={18} />
                                                </div>
                                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-brand/30 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all font-medium" placeholder="example@okhdfcbank" />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full mt-6 py-4 rounded-2xl bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20 transition-all">
                                            Save Payout Details
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
