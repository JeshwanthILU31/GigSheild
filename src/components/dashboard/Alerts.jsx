import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Alerts = () => {
    return (
        <div className="glass-card p-10 bg-brand/5 border-brand/20">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-brand/10">
                    <AlertTriangle size={24} className="text-brand" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-brand">Live Risk Alert</h3>
            </div>
            <div className="p-6 rounded-2xl bg-black/40 border border-brand/20 mb-6">
                <p className="text-slate-300 font-medium mb-4 italic leading-relaxed">
                    "Rainfall forecasted to hit 45mm between 6 PM - 9 PM over South Bangalore. Stay safe."
                </p>
                <div className="flex items-center gap-2 text-xs font-black text-brand uppercase tracking-widest">
                    <div className="w-2 h-2 bg-brand rounded-full animate-ping" />
                    Coverage Tier Eligible for Payout
                </div>
            </div>
        </div>
    );
};

export default Alerts;
