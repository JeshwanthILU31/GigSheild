import React from 'react';
import { CreditCard, Clock, CheckCircle2 } from 'lucide-react';

const PolicyDetails = () => {
    return (
        <div className="glass-card p-10">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-white">Policy Details</h3>
            <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-400">Weekly Premium</span>
                    </div>
                    <span className="font-black text-white text-lg">₹79.00</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-400">Next Auto-Pay</span>
                    </div>
                    <span className="font-black text-white text-lg">Apr 02, 2026</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-400">Enrollment Week</span>
                    </div>
                    <span className="font-black text-white text-lg">Week 12</span>
                </div>
            </div>
            <button className="w-full mt-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-black tracking-widest uppercase hover:bg-white/10 transition-all text-sm">
                View Full Policy Terms
            </button>
        </div>
    );
};

export default PolicyDetails;
