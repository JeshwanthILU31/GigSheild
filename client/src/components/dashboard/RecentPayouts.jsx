import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const RecentPayouts = () => {
    const payouts = [
        { date: "Mar 28, 2026", type: "AQI Pollution Alert", amount: "250.00", status: "Paid via UPI" },
        { date: "Mar 24, 2026", type: "Heavy Rain (Bangalore)", amount: "320.00", status: "Paid via UPI" },
        { date: "Mar 15, 2026", type: "Platform Downtime (Peak)", amount: "250.00", status: "Paid via UPI" },
        { date: "Mar 08, 2026", type: "Extreme Heat Alert", amount: "180.00", status: "Paid via UPI" }
    ];

    return (
        <div className="md:col-span-7 glass-card p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Recent Payouts</h3>
                <button className="text-xs font-black text-brand uppercase hover:underline">Download Report</button>
            </div>
            <div className="space-y-6">
                {payouts.map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950 border border-white/5 group hover:border-brand/30 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="p-3 rounded-xl bg-white/5">
                                <CheckCircle2 size={24} className="text-brand" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{row.type}</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{row.date} • {row.status}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-brand">₹{row.amount}</div>
                            <div className="text-[10px] text-green-500 font-bold uppercase">Verified</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentPayouts;
