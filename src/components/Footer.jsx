import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Mail, Phone, ExternalLink, ChevronUp } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-white py-20 px-4 border-t border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
            
            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src={logo} alt="GigShield Logo" className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                Gig<span className="text-brand">Shield</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Building the world's most accessible parametric insurance platform for the gig economy. 
                            100% data-driven, 100% automatic.
                        </p>
                        <div className="flex gap-3">
                            {[Globe, Mail, Phone, ExternalLink].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand/20 hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold mb-8 text-slate-900">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'How It Works', 'Pricing', 'Dashboard', 'Admin Login'].map((item) => (
                                <li key={item}>
                                    <Link 
                                        to={item === 'Admin Login' ? '/admin/login' : item === 'Home' ? '/' : `/#${item.toLowerCase().replace(/ /g, '-')}`} 
                                        className="text-sm text-slate-400 hover:text-brand transition-all block"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button 
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="text-sm text-slate-400 hover:text-brand transition-all flex items-center gap-2 group/bt"
                                >
                                    Return to Top
                                    <ChevronUp size={14} className="group-hover/bt:-translate-y-1 transition-transform" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold mb-8 text-slate-900">Legal Protocol</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-brand transition-all block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold mb-8 text-slate-900">Newsletter</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Receive real-time weather risk alerts for your zone.</p>
                        <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 focus-within:bg-white focus-within:border-brand/20 transition-all duration-300">
                            <input 
                              type="email" 
                              placeholder="Your Email" 
                              className="bg-transparent border-none focus:ring-0 text-slate-900 w-full px-3 text-xs placeholder:text-slate-300"
                            />
                            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-brand transition-all">Join</button>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100 text-center flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-xs font-medium">
                        © 2026 GigShield Inc. All Rights Reserved. Built for the Future of Work.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">Reinsurance: <span className="text-slate-500">Gallagher</span></span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">Data Feed: <span className="text-slate-500">IoT Parametric Network</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
