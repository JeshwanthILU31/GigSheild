import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Mail, 
    Moon, 
    Sun, 
    LifeBuoy, 
    ArrowRight, 
    ChevronRight, 
    LogOut, 
    ShieldCheck, 
    CreditCard,
    Layout,
    Lock,
    Landmark,
    Wallet,
    Info,
    Zap,
    Phone,
    Headphones,
    MessageCircle,
    CloudRain,
    Wind,
    Activity,
    Thermometer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import { safeGetItem, safeSetItem } from '../utils/storage';

const zoneCoordinates = {
    'HITEC City': { lat: 17.4474, lon: 78.3762 },
    'Madhapur': { lat: 17.4483, lon: 78.3915 },
    'Gachibowli': { lat: 17.4401, lon: 78.3489 },
    'Kukatpally': { lat: 17.4948, lon: 78.3996 },
    'Delhi NCR': { lat: 28.6139, lon: 77.2090 },
    'Mumbai West': { lat: 19.0760, lon: 72.8777 },
    'Bangalore East': { lat: 12.9716, lon: 77.5946 },
    'Chennai Central': { lat: 13.0827, lon: 80.2707 },
};

const SettingsPage = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const { plan } = useSimulation();
    const [activeTab, setActiveTab] = useState('general');
    const [selectedZone, setSelectedZone] = useState(safeGetItem('activeZone') || 'HITEC City');
    const registrationPincode = safeGetItem('registrationPincode') || '';

    const [scoreData, setScoreData] = useState(null);
    const [isLoadingScore, setIsLoadingScore] = useState(false);

    useEffect(() => {
        const fetchScoreData = async () => {
            if (!selectedZone) return;
            setIsLoadingScore(true);
            try {
                const coords = zoneCoordinates[selectedZone] || { lat: 17.4474, lon: 78.3762 };
                
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,rain,weather_code&timezone=auto`);
                const weatherJson = await weatherRes.json();
                
                const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=us_aqi&timezone=auto`);
                const aqiJson = await aqiRes.json();
                
                const rain = weatherJson.current?.rain || 0;
                const temp = weatherJson.current?.temperature_2m || 25;
                const aqi = aqiJson.current?.us_aqi || 50;
                
                const demandHash = selectedZone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const demand = (demandHash % 50) + 50;
                
                let baseScore = 90;
                if (demand > 80) baseScore += 5;
                
                const rainPenalty = Math.min(rain * 10, 40);
                const aqiPenalty = aqi > 100 ? Math.min((aqi - 100) * 0.1, 20) : 0;
                const demandFactor = demand < 60 ? 5 : 0;
                
                const finalScore = Math.max(10, Math.round(baseScore - rainPenalty - aqiPenalty - demandFactor));
                
                setScoreData({ score: finalScore, rain, temp, aqi, demand });
            } catch (error) {
                console.error("Error fetching score data", error);
                setScoreData({ score: 85, rain: 0, temp: 28, aqi: 65, demand: 75 });
            } finally {
                setIsLoadingScore(false);
            }
        };

        fetchScoreData();
    }, [selectedZone]);

    const handleSaveZone = () => {
        safeSetItem('activeZone', selectedZone);
        alert('Coverage Area updated to ' + selectedZone);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Layout },
        { id: 'coverage', label: 'Coverage', icon: MapPin },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'support', label: 'Help & Support', icon: LifeBuoy },
        { id: 'about', label: 'About', icon: Info },
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
                            className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all ${
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
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
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
                                            {(registrationPincode.startsWith('500') 
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
                                </div>

                                {/* Deliverability Score Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative mt-6">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/5 rounded-full blur-[80px]"></div>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">Deliverability Score</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                                                Live factors affecting deliveries in <span className="font-bold text-slate-700 dark:text-slate-300">{selectedZone}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {isLoadingScore || !scoreData ? (
                                        <div className="flex items-center justify-center h-48">
                                            <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-100 dark:border-slate-800 rounded-3xl p-6 bg-slate-50/50 dark:bg-slate-800/30 relative z-10">
                                            <div className="lg:col-span-4 flex flex-col items-center justify-center">
                                                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="8"/>
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className={scoreData.score > 70 ? "text-emerald-500" : scoreData.score > 40 ? "text-amber-500" : "text-rose-500"} strokeWidth="8" strokeDasharray={`${scoreData.score * 2.827} 282.7`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-in-out' }}/>
                                                    </svg>
                                                    <div className="absolute text-center flex flex-col items-center">
                                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{scoreData.score}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
                                                    </div>
                                                </div>
                                                <h5 className="font-black text-slate-900 dark:text-white text-lg">
                                                    {scoreData.score > 80 ? 'Excellent' : scoreData.score > 60 ? 'Good' : scoreData.score > 40 ? 'Fair' : 'Poor'} Conditions
                                                </h5>
                                            </div>

                                            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <CloudRain size={20} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{scoreData.rain} <span className="text-sm font-medium text-slate-500">mm</span></span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rainfall</span>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Wind size={20} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{scoreData.aqi}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AQI</span>
                                                </div>

                                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group hover:border-orange-500/30 transition-all shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Thermometer size={20} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{Math.round(scoreData.temp)}°</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temp</span>
                                                </div>

                                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group hover:border-violet-500/30 transition-all shadow-sm">
                                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Activity size={20} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white mb-1">{scoreData.demand}%</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demand</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'about' && (
                            <motion.div 
                                key="about"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-8"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">About GigShield</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                                                How we price coverage for your work zone
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
                                        GigShield parametric policies use live risk signals for your registered area. The overview below illustrates how zone-based pricing works—actual premiums on your policy come from your enrolled plan and backend calculation.
                                    </p>
                                </div>

                                <div className="bg-white border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-slate-200/50">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Premium intelligence</h3>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                    Premiums reflect your active work zone&apos;s historical weather patterns for pincode{' '}
                                                    <span className="text-slate-900 dark:text-white font-bold">{registrationPincode || 'your area'}</span>.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Example coverage zones</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {(registrationPincode.startsWith('500') 
                                                        ? ['HITEC City', 'Madhapur', 'Gachibowli', 'Kukatpally'] 
                                                        : ['Delhi NCR', 'Mumbai West', 'Bangalore East', 'Chennai Central']
                                                    ).map(zone => (
                                                        <div 
                                                            key={zone}
                                                            className="px-6 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-between"
                                                        >
                                                            {zone}
                                                            <ChevronRight size={16} className="text-slate-400" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-10 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                            
                                            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Illustrative weekly band</p>
                                                    <h4 className="text-4xl font-black text-white leading-none">₹79–₹120<span className="text-white/40 text-lg font-medium">/week</span></h4>
                                                </div>
                                                <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-brand">
                                                    <Zap size={24} fill="currentColor" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Rain risk score</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-brand w-[78%]" />
                                                        </div>
                                                        <span className="text-xs font-bold font-mono">78%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Historical factor</p>
                                                    <h5 className="text-lg font-black leading-none">High impact</h5>
                                                </div>
                                            </div>

                                            <Link 
                                                to="/dashboard/select-plan"
                                                className="block w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-brand hover:text-white transition-all text-center"
                                            >
                                                Explore plans
                                            </Link>
                                        </div>
                                    </div>
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
                                            <h3 className="text-4xl font-black tracking-tight leading-tight">Customer care</h3>
                                            <p className="text-white/70 font-medium max-w-md">
                                                Weather disputes, billing, and account help—our team is trained for gig-worker coverage questions.
                                            </p>
                                        </div>
                                        <a 
                                            href="mailto:support@gigshield.app"
                                            className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
                                        >
                                            Email us <ArrowRight size={18} />
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6">
                                            <Phone size={22} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Phone</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">India toll-free, 24/7</p>
                                        <a href="tel:+9118001234567" className="text-xl font-black text-brand hover:underline">
                                            1800-123-4567
                                        </a>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                                            <Mail size={22} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Email</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Responses within one business day</p>
                                        <a href="mailto:support@gigshield.app" className="text-lg font-black text-brand break-all hover:underline">
                                            support@gigshield.app
                                        </a>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 mb-6">
                                            <MessageCircle size={22} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">WhatsApp</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Quick questions & status updates</p>
                                        <span className="text-lg font-black text-slate-700 dark:text-slate-200">+91 9XXXX XXXXX</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6">
                                            <Headphones size={22} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Live chat</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">In-app during peak hours (IST)</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Mon–Sun, 8:00–22:00 IST</p>
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
