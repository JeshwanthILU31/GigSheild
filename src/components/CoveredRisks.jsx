import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Ban, TrendingUp } from 'lucide-react';

const CoveredRisks = () => {
    const risks = [
        {
            icon: CloudRain,
            title: "Rain/Flood",
            condition: "Rainfall > 40mm (3-hour window)",
            payout: "₹320.00 Base Payout",
            color: "border-blue-100 shadow-blue-200/20 hover:bg-blue-50"
        },
        {
            icon: Wind,
            title: "AQI Pollution",
            condition: "AQI > 300 for 4+ hours",
            payout: "₹250.00 Base Payout",
            color: "border-slate-100 shadow-slate-200/20 hover:bg-slate-50"
        },
        {
            icon: Sun,
            title: "Extreme Heat",
            condition: "Temperature > 44°C for 5 hours",
            payout: "₹180.00 Base Payout",
            color: "border-orange-100 shadow-orange-200/20 hover:bg-orange-50"
        },
        {
            icon: Ban,
            title: "Downtime",
            condition: "App down > 2 hours during peak",
            payout: "₹250.00 Base Payout",
            color: "border-brand/10 shadow-brand/10 hover:bg-brand/5"
        }
    ];

    return (
        <section className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 blur-[180px] rounded-full -z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full translate-y-1/2 -z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20 px-4">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                           Coverage <span className="text-brand">Triggers</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed border-l-4 border-brand/20 pl-6">
                            We don't guess. We use hyper-local data to activate protection 
                            exactly when and where you need it.
                        </p>
                    </div>
                    <div className="bg-white p-10 border border-slate-100 rounded-3xl shadow-xl max-w-md relative overflow-hidden group hover:border-brand/30 transition-all duration-700">
                         <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 scale-150 group-hover:scale-175 transition-transform duration-1000">
                             <TrendingUp size={120} className="text-slate-900" />
                         </div>
                         <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Payout Multiplier</h4>
                         <p className="text-xs text-slate-400 mb-8 font-medium">Final payout = Base × Tier Multiplier</p>
                         <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              <span className="px-4 py-2 bg-slate-50 rounded-lg">Basic 0.8x</span>
                              <span className="px-4 py-2 bg-brand text-white rounded-lg shadow-lg shadow-brand/20">Standard 1x</span>
                              <span className="px-4 py-2 bg-slate-50 rounded-lg">Premium 1.2x</span>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    {risks.map((risk, idx) => {
                        const Icon = risk.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className={`bg-white p-8 flex flex-col group transition-all duration-500 border rounded-3xl relative overflow-hidden shadow-xl hover:-translate-y-2 ${risk.color}`}
                            >
                                <div className="mb-8 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                                    <Icon size={28} className="stroke-[2]" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-brand transition-colors">
                                    {risk.title}
                                </h3>
                                <div className="space-y-6">
                                    <div className="border-l-4 border-brand/20 pl-4 py-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Condition</p>
                                        <p className="text-[13px] font-semibold text-slate-700">{risk.condition}</p>
                                    </div>
                                    <div className="border-l-4 border-brand pl-4 py-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Payout</p>
                                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{risk.payout}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CoveredRisks;
