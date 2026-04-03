import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Activity, Zap, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: CreditCard,
            title: "Choose Plan",
            desc: "Select a weekly plan from ₹39 that fits your activity zone and typical work hours.",
            color: "text-brand"
        },
        {
            icon: MapPin,
            title: "System Tracks Weather",
            desc: "Our real-time IoT network monitors your GPS vicinity for rain, heat, and pollution levels.",
            color: "text-blue-500"
        },
        {
            icon: Activity,
            title: "Trigger Happens",
            desc: "When conditions meet the threshold (e.g. >40mm rain in 3h), a payout is automatically triggered.",
            color: "text-rose-500"
        },
        {
            icon: Zap,
            title: "Instant Payout",
            desc: "Your payout is sent instantly via UPI (GPay, PhonePe, Paytm). No claims needed.",
            color: "text-brand"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30 -z-0" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Truly <span className="text-brand">Hands-Free</span> <br className="hidden md:block" /> Protection
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        We use real-time parametric data to trigger payouts, meaning you never file a claim.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-white border border-slate-100 p-10 rounded-3xl shadow-xl shadow-slate-300/10 flex flex-col items-center text-center group hover:border-brand/30 hover:-translate-y-2 transition-all duration-500 relative"
                            >
                                <div className="absolute top-6 right-8 text-slate-100 font-extrabold text-6xl group-hover:text-brand/5 transition-colors pointer-events-none">
                                    0{idx + 1}
                                </div>
                                
                                <div className={`w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 shadow-inner group-hover:bg-brand/10 transition-all duration-500 ${step.color}`}>
                                    <Icon size={32} className="stroke-[2]" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-brand transition-colors">{step.title}</h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed opacity-90">
                                    {step.desc}
                                </p>
                                
                                {idx !== steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-brand/20 transition-colors z-20">
                                        <ChevronRight size={32} className="stroke-[3]" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
