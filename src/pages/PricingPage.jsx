import React from 'react';
import Pricing from '../components/Pricing';
import Rules from '../components/Rules';
import { motion } from 'framer-motion';

const PricingPage = () => {
    return (
        <div className="bg-white text-slate-900 overflow-hidden">
            <div className="py-24 px-4 bg-slate-50 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-brand/5 blur-[120px] -z-0" />
                <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
                    >
                        Protection For <br /> <span className="text-brand">Every Worker</span>
                    </motion.h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed border-l-4 border-brand/20 pl-8 text-left md:text-center md:border-l-0">
                        "I used to lose thousands every monsoon. Now, the Standard Plan 
                        covers my fixed costs so I stay safe and dry."
                    </p>
                </div>
            </div>
            
            <Pricing />
            <Rules />
        </div>
    );
};

export default PricingPage;
