import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { safeGetItem, safeParse, safeRemoveItems } from '../utils/storage';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const { verifyOtp, resendOtp } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        const storedEmail = safeGetItem('userEmail');
        if (!storedEmail) {
            navigate('/register');
        } else {
            setEmail(storedEmail);
        }

        const storedOtp = safeGetItem('devOtp');
        if (storedOtp) {
            setDevOtp(storedOtp);
        }
    }, [navigate]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next box
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await verifyOtp({ email, otp: otpValue });
            if (result.success) {
                safeRemoveItems('isNewRegistration', 'pendingRegistrationData', 'devOtp');
                navigate('/dashboard/select-location');
            } else {
                setError(result.error || result.data?.message || 'OTP verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        const pendingRegistrationData = safeParse('pendingRegistrationData');

        if (!pendingRegistrationData) {
            setError('Registration details are missing. Please register again.');
            return;
        }

        try {
            const result = await resendOtp(pendingRegistrationData);
            if (result.success) {
                setMessage(result.data?.message || 'OTP sent successfully.');
                if (result.data?.otp) {
                    setDevOtp(result.data.otp);
                } else if (safeGetItem('devOtp')) {
                    setDevOtp(safeGetItem('devOtp'));
                }
            } else {
                setError(result.error || result.data?.message || 'Failed to resend OTP.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
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
                className="max-w-xl w-full bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10 p-12 md:p-16"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-brand/10 text-brand rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/5">
                        <Shield size={36} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Verify Your Identity</h1>
                    <p className="text-slate-500 font-medium">We've sent a 6-digit code to <br /><span className="text-slate-900 font-bold">{email}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex justify-between gap-2 sm:gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-16 sm:w-16 sm:h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-bold text-slate-900 focus:border-brand/40 focus:bg-white outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm font-bold text-rose-500 text-center uppercase tracking-widest bg-rose-50 p-4 rounded-2xl border border-rose-100">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="text-sm font-bold text-emerald-600 text-center uppercase tracking-widest bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                            {message}
                        </p>
                    )}

                    <div className="space-y-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand text-white text-lg font-bold rounded-3xl shadow-xl shadow-brand/20 flex items-center justify-center gap-3 hover:bg-brand-hover hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? 'Verifying...' : 'Complete Registration'}
                            <ArrowRight size={22} />
                        </button>

                        <button 
                            type="button"
                            onClick={handleResend}
                            className="w-full py-5 border-2 border-slate-100 text-slate-600 text-lg font-bold rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                            Resend OTP
                        </button>
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <Link to="/register" className="text-sm font-bold text-slate-400 hover:text-brand transition-colors">
                        Entered the wrong email? <span className="underline decoration-brand/20">Go back</span>
                    </Link>
                </div>
            </motion.div>

            {devOtp && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl z-50 flex flex-col gap-1 border border-slate-700/50 hover:-translate-y-1 transition-all cursor-pointer" onClick={() => navigator.clipboard.writeText(devOtp)}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Demo Mode OTP</p>
                    <p className="text-3xl font-black tracking-[0.2em] text-brand">{devOtp}</p>
                </div>
            )}
        </div>
    );
};

export default VerifyOtp;
