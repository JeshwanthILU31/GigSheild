import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Search, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Zap,
            title: "Automatic Payouts",
            desc: "The system identifies the trigger and sends funds. Zero human interaction required."
        },
        {
            icon: Search,
            title: "No Claim Process",
            desc: "Stop filing paperwork and waiting for approvals. The data does the talking."
        },
        {
            icon: TrendingUp,
            title: "Real-time Tracking",
            desc: "Watch live triggers in your zone and see exactly when you become eligible."
        },
        {
            icon: MapPin,
            title: "GPS Validation",
            desc: "We ensure you're in the affected zone using secure, private GPS verification."
        },
        {
            icon: ShieldCheck,
            title: "Fraud Detection",
            desc: "Advanced AI verifies platform activity to maintain the ecosystem's integrity."
        },
        {
            icon: Clock,
            title: "Weekly Flexible Plans",
            desc: "Cancel anytime or change your protection tier week-over-week."
        }
    ];

    return (
        <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 -z-0 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Designed for <span className="text-brand">Efficiency</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        Powerful technology built simple enough to work in the background 
                        while you focus on your day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-white border border-slate-100 p-10 rounded-3xl shadow-xl shadow-slate-300/10 flex flex-col group hover:border-brand/30 hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand mb-8 shadow-sm group-hover:bg-brand group-hover:text-white transition-all duration-500">
                                    <Icon size={28} className="stroke-[2]" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand transition-colors">
                                  {feature.title}
                                </h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed opacity-90">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
