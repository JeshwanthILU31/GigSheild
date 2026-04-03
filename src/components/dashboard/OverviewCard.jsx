import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const OverviewCard = () => {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-8 glass-card p-10 flex flex-col justify-between group overflow-hidden relative min-h-[300px]"
        >
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 -z-0">
               <ShieldCheck size={200} className="text-brand" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-brand/10 border border-brand/20">
                        <ShieldCheck size={32} className="text-brand" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-tighter">Current Plan: <span className="text-brand">Standard</span></h3>
                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Coverage active since Mar 12, 2026</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Active Multiplier</p>
                        <div className="text-4xl font-black text-white">1.0x</div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Coverage Left (Weekly)</p>
                        <div className="text-4xl font-black text-brand">₹1,180</div>
                        <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden border border-white/5">
                            <div className="bg-brand h-full w-[78%] rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Policy Status</p>
                        <div className="flex items-center gap-2 text-2xl font-black text-green-500">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            PROTECTED
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OverviewCard;
