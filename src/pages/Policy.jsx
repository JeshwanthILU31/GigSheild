import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  RefreshCw, 
  BarChart, 
  XCircle, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Zap,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const Policy = () => {
    const { plan, multiplier } = useSimulation();

    const triggers = [
        { icon: CloudRain, title: "Rain / Flood", logic: "Rainfall > 40mm in 3-hour window", payout: "₹320.00 × Multiplier", id: "01" },
        { icon: Wind, title: "Air Pollution (AQI)", logic: "AQI > 300 for 4+ hours", payout: "₹250.00 × Multiplier", id: "02" },
        { icon: Thermometer, title: "Extreme Heat", logic: "Temperature > 44°C for 5 hours", payout: "₹180.00 × Multiplier", id: "03" },
        { icon: Zap, title: "App Downtime", logic: "App down > 2 hours in peak time", payout: "₹250.00 × Multiplier", id: "04" }
    ];

    const rules = [
        { icon: Clock, title: "3-Week Waiting Period", desc: "No payouts eligible within the first 21 days of policy activation to prevent fraud." },
        { icon: RefreshCw, title: "48-Hour Cooling Period", desc: "Cooldown starts after every payout to ensure stability for reinsurance pools." },
        { icon: BarChart, title: "Weekly Payout Limit", desc: "Maximum payout per week follows your tier's fixed coverage cap (₹1,500 for Standard)." },
        { icon: XCircle, title: "No Manual Claims", desc: "Our IoT triggers are final. No documents or manual claim filing is permitted." }
    ];

    const tiers = [
        { name: "Basic", mult: "0.8x", cap: "₹800", color: "slate" },
        { name: "Standard", mult: "1.0x", cap: "₹1,500", color: "brand" },
        { name: "Premium", mult: "1.2x", cap: "₹2,500", color: "amber" }
    ];

    return (
        <div className="space-y-12 py-8">
            {/* Header / Summary */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-100 pb-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
                 
                 <div className="max-w-2xl relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Policy Details</h1>
                    <div className="flex items-center gap-3">
                        <Shield size={18} className="text-brand" />
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            GigShield Parametric Policy • Mar 2026 Release
                        </p>
                    </div>
                 </div>
                  <div className="flex flex-col sm:flex-row gap-4 lg:pb-2 relative z-10 mt-8 lg:mt-0 px-4">
                    <div className="bg-white px-8 py-6 border border-slate-100 rounded-3xl shadow-xl shadow-brand/5">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Operational Zone</p>
                        <h4 className="text-xl font-extrabold text-slate-900">{localStorage.getItem('activeZone') || 'HITEC City'}</h4>
                        <div className="mt-3 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center border border-slate-100 w-fit">
                            PIN: {localStorage.getItem('registrationPincode') || '500081'}
                        </div>
                    </div>
                    <div className="bg-white px-8 py-6 border border-slate-100 rounded-3xl shadow-xl shadow-brand/5">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Active Multiplier</p>
                        <h4 className="text-4xl font-extrabold text-slate-900">{multiplier}x</h4>
                        <div className="mt-3 px-3 py-1 bg-brand/5 rounded-full text-[10px] font-bold text-brand uppercase tracking-wider text-center border border-brand/10 w-fit">
                            {plan} Tier
                        </div>
                    </div>
                  </div>
            </header>

            {/* Core Rules Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-4">
                <div className="lg:col-span-4 lg:sticky lg:top-10">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900">Policy Framework</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Parametric insurance works on binary logic. If the trigger event happens, you get paid instantly. 
                            The following rules protect the platform's stability for all workers.
                        </p>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-brand/20 hover:shadow-xl">
                            <TrendingDown size={28} className="text-brand mb-6" />
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Payout Limitation</h5>
                            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                Annual Cap = 20× Your Cumulative Weekly Premium Payments.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rules.map((rule, i) => {
                        const Icon = rule.icon;
                        return (
                            <div key={i} className="bg-white p-8 flex flex-col items-start gap-6 border border-slate-100 rounded-3xl shadow-sm hover:border-brand/30 hover:shadow-xl transition-all group overflow-hidden relative">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand transition-all group-hover:bg-brand group-hover:text-white">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{rule.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{rule.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Trigger Conditions Section */}
            <section className="space-y-10 px-4">
                   <div className="flex items-center justify-between">
                         <h3 className="text-3xl font-bold text-slate-900">Trigger Conditions</h3>
                         <div className="h-0.5 flex-grow mx-12 bg-slate-50 rounded-full lg:block hidden" />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {triggers.map((trigger, i) => {
                           const Icon = trigger.icon;
                           return (
                               <div key={i} className="bg-white p-8 flex flex-col items-center text-center gap-6 group hover:translate-y-[-4px] border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-50 group-hover:border-brand/20 group-hover:bg-brand/5 transition-all">
                                        <Icon size={28} className="text-brand" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold text-slate-900">{trigger.title}</h4>
                                        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-50">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                                {trigger.logic}
                                            </p>
                                        </div>
                                        <div className="text-2xl font-extrabold text-brand border-t border-slate-50 pt-4">
                                            {trigger.payout}
                                        </div>
                                    </div>
                               </div>
                           );
                       })}
                   </div>
            </section>

            {/* Dynamic Premium Calculator Section */}
            <section className="px-4">
                <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-slate-200/50">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Premium Intelligence</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Your premium is dynamically calculated based on your active work zone's **365-day weather records** in Pincode **{localStorage.getItem('registrationPincode') || '500081'}**. 
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Suggested Coverage Zones for You</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(localStorage.getItem('registrationPincode')?.startsWith('500') 
                                        ? ['HITEC City', 'Madhapur', 'Gachibowli', 'Kukatpally'] 
                                        : ['Delhi NCR', 'Mumbai West', 'Bangalore East', 'Chennai Central']
                                    ).map(zone => (
                                        <button 
                                            key={zone}
                                            className="px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-slate-600 font-bold hover:border-brand/20 hover:bg-white hover:text-brand transition-all text-left flex items-center justify-between group"
                                        >
                                            {zone}
                                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-10 shadow-2xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Calculated Premium</p>
                                    <h4 className="text-4xl font-black text-white leading-none">₹89<span className="text-white/40 text-lg font-medium">/week</span></h4>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-brand">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Rain Risk Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand w-[78%]" />
                                        </div>
                                        <span className="text-xs font-bold font-mono">78%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Historical Factor</p>
                                    <h5 className="text-lg font-black leading-none">High Impact</h5>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-brand hover:text-white transition-all">
                                Lock This Premium
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tier Logic Section (Already Present, but kept for context) */}
            <section className="bg-slate-900 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden group mx-4">
                <div className="absolute top-0 left-0 w-full h-full bg-brand/10 blur-[120px] -z-0" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div>
                        <h3 className="text-4xl font-bold mb-4 text-white">Tier Multipliers</h3>
                        <p className="text-white/50 leading-relaxed text-sm font-medium">
                            Your payout scales based on your subscription tier. Higher tiers receive increased multipliers for identical weather events.
                        </p>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiers.map((tier, i) => (
                             <div key={i} className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-6 ${tier.name === plan ? 'border-brand bg-brand/10 shadow-2xl' : 'border-white/5 bg-white/5 opacity-50'}`}>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">{tier.name} Tier</h4>
                                <div className="text-5xl font-extrabold text-white">{tier.mult}</div>
                                <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold text-brand uppercase tracking-wider border border-white/5">
                                    Cap {tier.cap}/WK
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Disclaimer */}
            <footer className="text-center py-20 px-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 mx-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full w-fit mx-auto shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Policy Version 4.1.2026 • Verified Parametric Seal</p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed italic">
                        "GigShield uses independent hyperlocal IoT sensors and Global Weather APIs. Trigger events are determined by our localized grid network specifically for your active pincode zone."
                    </p>
                    <div className="flex justify-center gap-8 pt-4 items-center text-slate-200 dark:text-slate-700">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 w-16" />
                        <Shield size={24} className="text-brand/30" />
                        <div className="h-px bg-slate-200 dark:bg-slate-800 w-16" />
                    </div>
                </div>
            </footer >
        </div>
    );
};

export default Policy;
