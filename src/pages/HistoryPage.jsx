import React from 'react';
import { motion } from 'framer-motion';
import { History, ArrowUpRight, CheckCircle2, Clock, Calendar, ShieldCheck, Filter } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const HistoryPage = () => {
    const { platformStatus } = useSimulation();

    // High-fidelity mock history for demo purposes
    const historyData = [
        { id: 1, date: 'Mar 28, 2026', amount: '₹320.00', reason: 'Heavy Rainfall (>40mm)', status: 'Succeeded', duration: '4m 12s', zone: 'HITEC Zone 4' },
        { id: 2, date: 'Mar 24, 2026', amount: '₹250.00', reason: 'App Downtime (Systemic)', status: 'Succeeded', duration: '2m 45s', zone: 'HITEC Zone 4' },
        { id: 3, date: 'Mar 20, 2026', amount: '₹180.00', reason: 'Extreme Heat (>45°C)', status: 'Succeeded', duration: '5m 50s', zone: 'HITEC Zone 4' },
        { id: 4, date: 'Mar 15, 2026', amount: '₹320.00', reason: 'Excessive Rain (Flood Alert)', status: 'Succeeded', duration: '3m 10s', zone: 'Gachibowli' },
        { id: 5, date: 'Mar 08, 2026', amount: '₹250.00', reason: 'System Connectivity Loss', status: 'Succeeded', duration: '6m 20s', zone: 'Gachibowli' }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 py-8"
        >
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Payout Ledger</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Verified historical list of all your automated protection payouts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-brand/20 hover:text-brand transition-all shadow-sm">
                        <Filter size={16} /> Filter Results
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand/20 hover:bg-brand-hover transition-all">
                        <ArrowUpRight size={16} /> Export CSV
                    </button>
                </div>
            </header>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
                {[
                    { label: 'Cumulative Payouts', value: '₹1,320', icon: ShieldCheck, color: 'brand' },
                    { label: 'Avg. Payout Time', value: '4m 15s', icon: Clock, color: 'blue' },
                    { label: 'Successful Triggers', value: '05', icon: CheckCircle2, color: 'emerald' },
                    { label: 'Active Service', value: platformStatus === 'Active' ? 'Uber/Zomato' : 'Offline', icon: Calendar, color: 'orange' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm flex items-center gap-6 text-slate-900 dark:text-white transition-colors duration-300">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest leading-none mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-colors duration-300">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Transaction Date</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Amount Disbursed</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Settlement Reason</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Verification Time</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {historyData.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{item.date}</span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">{item.zone}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-lg font-black text-slate-900 dark:text-white">{item.amount}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                                                <History size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{item.reason}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-sm font-bold text-slate-500 dark:text-slate-400 font-mono">
                                        {item.duration}
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider pt-0.5">{item.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default HistoryPage;
