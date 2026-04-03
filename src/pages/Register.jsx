import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Phone, MapPin, Smartphone, ArrowRight, Key, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import logo from '../assets/logo.png';
import swiggyLogo from '../assets/swiggy.webp';
import zomatoLogo from '../assets/zomato.png';
import blinkitLogo from '../assets/blinkit.png';
import uberLogo from '../assets/uber.png';
import zeptoLogo from '../assets/zepto.png';

import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { safeSetItem, safeSetJSON } from '../utils/storage';

const activeHoursMap = {
    Morning: { start: '06:00', end: '14:00' },
    Afternoon: { start: '12:00', end: '20:00' },
    Evening: { start: '16:00', end: '23:00' },
    Night: { start: '20:00', end: '04:00' }
};

const platformZoneMap = {
    Swiggy: 'Madhapur',
    Zomato: 'Hitech City',
    UberEats: 'Gachibowli',
    Zepto: 'Kondapur',
    Blinkit: 'Madhapur'
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        platform: 'Swiggy',
        partnerId: 'SW-',
        zone: platformZoneMap.Swiggy,
        pinCode: '',
        upiId: '',
        activeHours: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const platformPrefixes = {
        'Swiggy': 'SW-',
        'Zomato': 'ZO-',
        'Blinkit': 'BK-',
        'UberEats': 'UB-',
        'Zepto': 'ZE-'
    };

    const platformLogos = {
        'Swiggy': swiggyLogo,
        'Zomato': zomatoLogo,
        'Blinkit': blinkitLogo,
        'UberEats': uberLogo,
        'Zepto': zeptoLogo
    };

    const validateId = (id, platform) => {
        const prefix = platformPrefixes[platform];
        return id.toUpperCase().startsWith(prefix);
    };

    const handlePlatformSelect = (platform) => {
        const prefix = platformPrefixes[platform];
        setFormData({
            ...formData, 
            platform, 
            partnerId: prefix,
            zone: platformZoneMap[platform] || platformZoneMap.Swiggy
        });
        setErrors({...errors, platformId: ''});
    };

    const handleIdChange = (e) => {
        const val = e.target.value;
        setFormData({...formData, partnerId: val});
        
        if (!validateId(val, formData.platform)) {
            setErrors({
                ...errors, 
                platformId: `Partner ID must start with ${platformPrefixes[formData.platform]}`
            });
        } else {
            setErrors({...errors, platformId: ''});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateId(formData.partnerId, formData.platform)) {
            setErrors({
                ...errors, 
                platformId: `Invalid format. Must start with ${platformPrefixes[formData.platform]}`
            });
            return;
        }

        if (!formData.activeHours || !activeHoursMap[formData.activeHours]) {
            setErrors({
                ...errors,
                activeHours: 'Please select your active hours'
            });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                partnerId: formData.partnerId,
                zone: formData.zone || platformZoneMap[formData.platform] || platformZoneMap.Swiggy,
                pinCode: formData.pinCode,
                upiId: formData.upiId,
                activeHours: activeHoursMap[formData.activeHours]
            };

            console.log('Register payload:', payload);
            const result = await register(payload);
            if (result.success) {
                safeSetJSON('pendingRegistrationData', payload);
                safeSetItem('userEmail', formData.email);
                safeSetItem('isNewRegistration', 'true');
                navigate('/verify-otp');
            } else {
                 setErrors({ submit: result.error });
            }
        } catch (err) {
            setErrors({ submit: 'Something went wrong. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pb-20 pt-32 sm:pt-40 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 -z-0" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-6xl w-full bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[750px]">
                    {/* Left Pane - Visual/Info */}
                    <div className="lg:col-span-4 bg-slate-50/50 p-12 flex flex-col justify-between border-r border-slate-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                Join the <br />
                                <span className="text-brand">Protected</span> <br />
                                Workforce
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { icon: Shield, text: "Instant weather payouts" },
                                    { icon: Smartphone, text: "Automated data tracking" },
                                    { icon: User, text: "Fraud-free policy" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-slate-600 group">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-brand">
                                            <item.icon size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-12 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative z-10">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                                GigShield protects over 10,000+ workers across 5 platforms with 100% automated claims processing.
                            </p>
                        </div>
                    </div>

                    {/* Right Pane - Form */}
                    <div className="lg:col-span-8 p-12 md:p-20">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                                <p className="text-slate-500 font-medium text-sm">Step 1: Your Gig Identity</p>
                            </div>
                            <Link to="/login" className="text-sm font-bold text-brand hover:underline pt-1">
                                Login instead?
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                            {/* Personal Info Group */}
                            <div className="md:col-span-2">
                                <p className="text-xs font-black text-slate-800/40 uppercase tracking-[0.4em] mb-6 border-b border-slate-100 pb-3">Personal Details</p>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <User size={12} className="text-brand" /> Full Name
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="e.g. John Doe"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Mail size={12} className="text-brand" /> Email
                                </label>
                                <input 
                                    required
                                    type="email" 
                                    value={formData.email}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="john@example.com"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Phone size={12} className="text-brand" /> Phone Number
                                </label>
                                <input 
                                    required
                                    type="tel" 
                                    value={formData.phone}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="+91 00000 00000"
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Key size={12} className="text-brand" /> Password
                                </label>
                                <input 
                                    required
                                    type="password" 
                                    value={formData.password}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            {/* Work Info Group */}
                            <div className="md:col-span-2 pt-6">
                                <p className="text-xs font-black text-slate-800/40 uppercase tracking-[0.4em] mb-6 border-b border-slate-100 pb-3">Employment Data</p>
                            </div>

                            <div className="md:col-span-2 space-y-5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Smartphone size={12} className="text-brand" /> Select Your Platform
                                </label>
                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4">
                                    {Object.keys(platformPrefixes).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handlePlatformSelect(p)}
                                            className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all group ${
                                                formData.platform === p 
                                                ? 'bg-brand/5 border-brand shadow-xl shadow-brand/10 scale-105' 
                                                : 'bg-white border-slate-100 hover:border-brand/20 hover:bg-brand/5'
                                            }`}
                                        >
                                            <div className="w-12 h-12 mb-3 flex items-center justify-center">
                                                <img 
                                                    src={platformLogos[p]} 
                                                    alt={p} 
                                                    className={`w-full h-full object-contain transition-all ${
                                                        formData.platform === p ? 'brightness-110' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'
                                                    }`} 
                                                />
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                formData.platform === p ? 'text-brand' : 'text-slate-400 group-hover:text-slate-600'
                                            }`}>
                                                {p === 'UberEats' ? 'Uber' : p}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Smartphone size={12} className="text-brand" /> Partner ID
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.partnerId}
                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-slate-800 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold uppercase tracking-widest ${errors.platformId ? 'border-rose-400/50' : 'border-slate-100 focus:border-brand/40'}`}
                                    placeholder={platformPrefixes[formData.platform] + "12345"}
                                    onChange={handleIdChange}
                                />
                                {errors.platformId && (
                                    <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest px-1">{errors.platformId}</p>
                                )}
                            </div>


                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <MapPin size={12} className="text-brand" /> Pin Code
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.pinCode}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="560001"
                                    onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <Smartphone size={12} className="text-brand" /> UPI ID
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.upiId}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 focus:border-brand/40 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-bold"
                                    placeholder="9876543210@paytm"
                                    onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-1">
                                    <RefreshCw size={12} className="text-brand" /> Active Hours
                                </label>
                                <select 
                                    value={formData.activeHours}
                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-slate-800 focus:bg-white outline-none transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[right_1.5rem_center] bg-no-repeat ${errors.activeHours ? 'border-rose-400/50' : 'border-slate-100 focus:border-brand/40'}`}
                                    onChange={(e) => {
                                        setFormData({...formData, activeHours: e.target.value});
                                        setErrors({...errors, activeHours: ''});
                                    }}
                                >
                                    <option value="">Select shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
                                {errors.activeHours && (
                                    <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest px-1">{errors.activeHours}</p>
                                )}
                            </div>

                            {errors.submit && (
                                <div className="md:col-span-2 bg-rose-50 text-rose-500 p-4 rounded-2xl border border-rose-100 text-xs font-bold uppercase tracking-widest text-center">
                                    {errors.submit}
                                </div>
                            )}

                            <div className="md:col-span-2 pt-10">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-brand text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand/20 flex items-center justify-center gap-3 hover:bg-brand-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {loading ? 'Creating Account...' : 'Continue to Verification'}
                                    <ArrowRight size={22} />
                                </button>
                                <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                                    <div className="h-px bg-slate-200 flex-grow" />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                                        Safe 256-bit AES encryption
                                    </p>
                                    <div className="h-px bg-slate-200 flex-grow" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
