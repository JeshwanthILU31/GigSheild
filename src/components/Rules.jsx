import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, BarChart, XCircle } from 'lucide-react';

const Rules = () => {
    const rules = [
        {
            icon: Clock,
            title: "3-Week Wait",
            desc: "Protection starts from Week 4 of enrollment to ensure stability."
        },
        {
            icon: RefreshCw,
            title: "48h Cooling",
            desc: "Trigger events are blocked for 48h after a payout to prevent fraud."
        },
        {
            icon: BarChart,
            title: "Dynamic Limits",
            desc: "Payout frequency increases dynamically based on your enrollment age."
        },
        {
            icon: XCircle,
            title: "No Manual Claims",
            desc: "Manual filing is disabled. Everything is 100% data-verified."
        }
    ];

    return (
        <section className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30 -z-0" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full translate-y-1/2 translate-x-1/4 -z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                       Platform <span className="text-brand">Rules</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed border-b-2 border-brand/10 pb-6">
                        GigShield maintains fairness and speed with these core policy rules.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {rules.map((rule, idx) => {
                        const Icon = rule.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-white border border-slate-100 p-10 rounded-3xl shadow-xl shadow-slate-300/10 flex flex-col items-center text-center group hover:border-brand/30 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-0" />
                                
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 shadow-inner group-hover:bg-brand group-hover:shadow-brand/20 transition-all duration-500 relative z-10">
                                    <Icon size={28} className="text-brand group-hover:text-white stroke-[2] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-brand transition-colors relative z-10">{rule.title}</h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed opacity-90 relative z-10">
                                    {rule.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Rules;
