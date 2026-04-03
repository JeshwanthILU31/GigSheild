import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            price: "₹39-₹69",
            coverage: "₹800",
            features: ["1 payout/week cap", "7-day cooldown", "Rain & Heat triggers", "Standard Support"],
            popular: false
        },
        {
            name: "Standard",
            price: "₹70-₹119",
            coverage: "₹1500",
            features: ["2 payouts/week cap", "48h cooldown", "All 4 risks + AI detection", "Priority Support", "Loyalty Rewards"],
            popular: true
        },
        {
            name: "Premium",
            price: "₹120-₹199",
            coverage: "₹2000",
            features: ["4 payouts/week cap", "48h cooldown", "Max Payout Multiplier (1.2x)", "Special 24h Heat trigger", "Direct Manager Support"],
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brand/5 blur-[120px] -z-0 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Weekly <span className="text-brand">Pricing</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Flexible plans designed for different levels of gig activity. 
                        No long-term commitments, cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`bg-white p-8 relative flex flex-col group border rounded-3xl transition-all duration-300 shadow-xl ${plan.popular ? 'border-brand ring-4 ring-brand/5 z-20 scale-105' : 'border-slate-100 z-10'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider px-6 py-2 rounded-full flex items-center gap-2 shadow-xl">
                                    <Star size={14} className="fill-brand text-brand" />
                                    <span>Recommended</span>
                                </div>
                            )}

                            <div className="mb-8 text-center">
                                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest group-hover:text-brand transition-colors">
                                    {plan.name} Tier
                                </h3>
                                <div className="text-3xl font-extrabold text-slate-900 mb-1">{plan.price}</div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">per week</p>
                            </div>

                            <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-50 text-center group-hover:bg-brand/5 transition-all duration-300">
                                <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2">Max Settlement</p>
                                <p className="text-3xl font-extrabold text-slate-900 leading-none">{plan.coverage}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, fidx) => (
                                    <li key={fidx} className="flex items-start gap-3 text-slate-600">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-all">
                                            <Check size={12} className="stroke-[3]" />
                                        </div>
                                        <span className="text-[13px] font-medium leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                to="/register"
                                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 text-center ${plan.popular ? 'bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'}`}
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
