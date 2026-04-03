import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Key, ArrowRight, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const result = await login(formData);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('System connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pb-20 pt-32 sm:pt-40 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4 -z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4 -z-0 pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl w-full p-0 overflow-hidden relative z-10 border border-slate-100 bg-white rounded-3xl shadow-2xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-12 h-full min-h-[600px]">
                    {/* Left Pane */}
                    <div className="md:col-span-5 bg-slate-50/50 p-12 flex flex-col justify-between border-r border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10 mt-12">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                Welcome <br /> <span className="text-brand">Back</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
                                Log in to manage your active protection, track weather triggers, and view recent payout history.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-6 mt-12">
                            <Link to="/register" className="text-sm font-black text-brand hover:underline uppercase tracking-widest">
                                Need an account? Register
                            </Link>
                            <div className="h-px w-20 bg-slate-100" />
                            <Link to="/admin/login" className="text-[10px] font-black text-slate-300 hover:text-slate-500 uppercase tracking-[0.2em] transition-colors">
                                Administrative Access
                            </Link>
                        </div>
                    </div>

                    {/* Right Pane - Login Form */}
                    <div className="md:col-span-7 p-12 md:p-20 flex flex-col justify-center">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
                            <p className="text-slate-500 font-medium text-sm">Access secure parametric control dashboard</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-bold"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Email Identity</label>
                                <div className="flex bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-brand/30 focus-within:bg-white transition-all overflow-hidden items-center group">
                                    <div className="pl-5 text-slate-400 group-focus-within:text-brand">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="email" 
                                        className="bg-transparent border-none focus:ring-0 text-slate-900 w-full px-4 py-4 text-sm font-medium placeholder:text-slate-300"
                                        placeholder="Enter registered email"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
                                    <button type="button" className="text-[10px] font-bold text-brand hover:underline">Forgot?</button>
                                </div>
                                <div className="flex bg-slate-50 rounded-2xl border border-slate-100 focus-within:border-brand/30 focus-within:bg-white transition-all overflow-hidden items-center group">
                                    <div className="pl-5 text-slate-400 group-focus-within:text-brand">
                                        <Key size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="password" 
                                        className="bg-transparent border-none focus:ring-0 text-slate-900 w-full px-4 py-4 text-sm font-medium placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-3 rounded-2xl group shadow-xl hover:bg-brand transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin h-5 w-5" />
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Login to Dashboard
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                                By signing in, you agree to our <br />
                                <span className="text-slate-900 hover:text-brand underline cursor-pointer">Security Protocol & Terms</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
