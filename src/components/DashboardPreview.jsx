import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

const DashboardPreview = () => {
    return (
        <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 blur-[180px] rounded-full -z-0 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Power <span className="text-brand">At Your Fingertips</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                       Real-time weather tracking, payout history, and policy controls 
                       all designed for speed and transparency.
                    </p>
                </div>

                <motion.div
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white group hover:shadow-brand/5 transition-shadow duration-1000"
                >
                    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12">
                        {/* Sidebar Style Preview */}
                        <div className="lg:col-span-3 space-y-10 hidden lg:block border-r border-slate-100 pr-10">
                            <div className="w-12 h-12 bg-brand rounded-xl mb-12 shadow-lg shadow-brand/20 animate-pulse" />
                            <div className="space-y-6 opacity-40">
                                <div className="h-2 w-full bg-slate-900 rounded-full" />
                                <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
                                <div className="h-2 w-5/6 bg-slate-200 rounded-full" />
                                <div className="h-2 w-2/3 bg-slate-200 rounded-full" />
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-9 space-y-10">
                            <div className="flex justify-between items-end border-b border-slate-50 pb-8">
                                <div className="space-y-4">
                                    <div className="h-8 w-60 bg-slate-100 rounded-lg" />
                                    <div className="h-3 w-40 bg-slate-50 rounded-full" />
                                </div>
                                <div className="hidden md:flex h-12 w-32 bg-brand/5 border border-brand/10 rounded-xl items-center justify-center">
                                    <div className="w-16 h-3 bg-brand/20 rounded-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-slate-50/50 border border-slate-100 shadow-sm p-8 rounded-2xl border-l-4 border-l-brand hover:bg-white transition-all duration-300">
                                    <h4 className="text-brand font-bold uppercase tracking-wider text-[10px] mb-4">Active Protection</h4>
                                    <p className="text-3xl font-extrabold text-slate-900">Standard</p>
                                    <p className="text-slate-400 font-medium text-[10px] mt-2">Enrolled 12 Weeks</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 shadow-sm p-8 rounded-2xl border-l-4 border-l-brand hover:bg-white transition-all duration-300">
                                    <h4 className="text-brand font-bold uppercase tracking-wider text-[10px] mb-4">Latest Payout</h4>
                                    <p className="text-3xl font-extrabold text-slate-900">₹320.00</p>
                                    <p className="text-slate-400 font-medium text-[10px] mt-2">24 Mar • Heavy Rain</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/30 border border-slate-100 p-8 rounded-2xl relative overflow-hidden">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="h-5 w-32 bg-white rounded-md shadow-sm" />
                                    <div className="h-2 w-20 bg-slate-200 rounded-full opacity-40" />
                                </div>
                                <div className="space-y-6">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex justify-between items-center py-4 border-t border-slate-200/40 first:border-t-0">
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-50" />
                                                <div className="space-y-2">
                                                    <div className="h-3 w-32 bg-slate-100 rounded-full" />
                                                    <div className="h-2 w-48 bg-slate-50 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="h-6 w-20 bg-white rounded-md shadow-sm border border-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DashboardPreview;
