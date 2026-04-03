import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30 -z-0" />
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full -translate-y-1/2 -z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="p-12 md:p-24 rounded-[3rem] bg-white border border-slate-100 shadow-2xl relative text-center flex flex-col items-center justify-center space-y-10 group transition-all duration-700 hover:border-brand/30 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <h2 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight relative">
                        Start Protecting Your <br /> <span className="text-brand">Gig Income</span> Today
                    </h2>
                    
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed relative">
                        Join 10,000+ gig workers who never have to worry about the weather again. 
                        Instant, automated, and secure.
                    </p>

                    <Link to="/register" className="inline-flex items-center gap-4 bg-slate-900 text-white font-bold text-lg py-5 px-12 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-brand hover:-translate-y-1 transition-all duration-300 group relative">
                        Get Started Now
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <div className="pt-10 flex items-center justify-center gap-8 w-full border-t border-slate-50 relative">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 capitalize">
                           <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                           <span>Safe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 capitalize">
                           <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                           <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-brand capitalize">
                           <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                           <span>100% Automated</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
