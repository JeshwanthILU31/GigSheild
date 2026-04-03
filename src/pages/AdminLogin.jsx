import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, ArrowRight, UserCircle2, Loader2, AlertCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Simulated Admin Authentication
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                localStorage.setItem('adminToken', 'mock-admin-session');
                navigate('/admin');
            } else {
                setError('Invalid administrative credentials. Access Denied.');
            }
        } catch (err) {
            setError('System failure. Integrity check failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pt-40 pb-20 relative overflow-hidden">
            {/* White/Orange Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/2 pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full relative z-10"
            >
                {/* Logo & Intro */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-brand/10 border-2 border-brand/20 text-brand rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl shadow-brand/20">
                        <Shield size={40} className="fill-brand/10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase px-2 text-center">Master <span className="text-brand">Access</span></h1>
                    <div className="mt-3 px-4 py-1 bg-slate-900/5 rounded-full">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Admin Control Unit</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/40">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <UserCircle2 size={12} className="text-brand" /> Admin Username
                            </label>
                            <input 
                                required
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold outline-none focus:border-brand/40 transition-all placeholder:text-slate-300"
                                placeholder="Enter Username"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <Key size={12} className="text-brand" /> Access Password
                            </label>
                            <input 
                                required
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold outline-none focus:border-brand/40 transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex items-center gap-3 text-brand text-xs font-bold italic tracking-wide"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand text-white font-black text-sm rounded-[2rem] shadow-2xl shadow-brand/30 flex items-center justify-center gap-3 hover:bg-brand-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <LayoutDashboard size={18} />}
                            Unlock Admin Console
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowRight size={14} className="rotate-180" />
                        Return to Landing Page
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
