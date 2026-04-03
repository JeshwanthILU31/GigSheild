import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const EarningsProtection = () => {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-4 p-8 flex flex-col justify-between bg-slate-900 rounded-3xl shadow-2xl relative overflow-hidden group min-h-[300px]"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 group-hover:scale-175 transition-transform duration-700 pointer-events-none">
                <TrendingUp size={150} className="text-brand" />
            </div>

            <div className="relative z-10">
                <div className="p-3 rounded-xl bg-brand/20 border border-brand/20 w-fit mb-6">
                    <TrendingUp size={20} className="text-brand" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Earnings Protected</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
                <div>
                    <h4 className="text-4xl font-extrabold text-white">₹4,200</h4>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Total Payouts Received</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                    <h4 className="text-2xl font-extrabold text-brand">+ ₹320</h4>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">This Week Payouts</p>
                </div>
            </div>
        </motion.div>
    );
};

export default EarningsProtection;
