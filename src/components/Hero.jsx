import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import bike from '../assets/bike.jpg';
import heat from '../assets/heat.png';
import aqiImg from '../assets/AQI.png';
import swiggyLogo from '../assets/swiggy.webp';
import zomatoLogo from '../assets/zomato.png';
import blinkitLogo from '../assets/blinkit.png';
import uberLogo from '../assets/uber.png';
import zeptoLogo from '../assets/zepto.png';

const Hero = () => {
    const images = [bike, heat, aqiImg];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    return (
        <section className="relative pt-36 pb-24 overflow-hidden bg-white">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0 pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full -translate-x-1/4 -z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    
                    {/* Left Content */}
                    <div className="lg:col-span-6 space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 w-fit flex items-center gap-3 shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none pt-0.5">
                                Reliable Weather Protection For Gig Workers
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 2.0, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                                ONE STOP <br />
                                <span className="text-brand">Income Shield</span> <br />
                                For Delivery Partners
                            </h1>
                            <p className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
                                Get automated payouts when heavy rain, extreme heat, or app downtime disrupts your work. 
                                No manual claims—just instant digital settlements.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Link to="/register" className="bg-white text-slate-900 py-5 px-12 text-sm font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:shadow-xl transition-all text-center">
                                Start Protection for Free
                            </Link>
                            <Link to="/pricing" className="bg-brand text-white py-5 px-12 text-sm font-bold rounded-2xl hover:bg-brand-hover hover:-translate-y-1 transition-all shadow-2xl shadow-brand/20 text-center flex items-center justify-center gap-3 group">
                                Explore Plans <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                            className="space-y-5 pt-12 border-t border-slate-100"
                        >
                            <div className="flex gap-4 items-center group">
                                <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                    <CheckCircle2 size={14} />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                                    Curated plans designed for a better income experience.
                                </p>
                            </div>
                            <div className="flex gap-4 items-center group">
                                <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                    <ShieldCheck size={14} />
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                                    Detailed alerts and editorials to help you master every risk.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Orbital/3D Visual Stack */}
                    <div className="lg:col-span-6 relative flex justify-center lg:-translate-y-16">
                        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                            
                            {/* Orbital Rings (Behind) */}
                            <div className="absolute inset-0 border border-slate-100 rounded-full scale-[1.1] opacity-50" />
                            <div className="absolute inset-0 border border-slate-100 rounded-full scale-[0.8] opacity-30" />

                            {/* Main Visual Card (Tilted like 2nd screenshot) */}
                            <motion.div 
                                initial={{ opacity: 0, rotateY: 15, rotateX: 10 }}
                                animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
                                transition={{ duration: 2.5 }}
                                className="relative z-10 w-[85%] h-[75%] rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-slate-800 transition-transform duration-700"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]} 
                                        alt="GigShield Worker" 
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 0.8, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        className="w-full h-full object-cover" 
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                
                                {/* Inner Card Text Placeholder */}
                                <div className="absolute bottom-10 left-10 right-10 space-y-4">
                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                    <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                </div>
                            </motion.div>

                            {/* SATELLITE ELEMENTS (Neatly Distributed Platforms) */}
                            
                            {/* Uber - Top Center */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                            >
                                <img src={uberLogo} alt="Uber" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Swiggy - Top Left Quadrant */}
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -top-4 left-6 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                            >
                                <img src={swiggyLogo} alt="Swiggy" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Blinkit - Far Left Center */}
                            <motion.div 
                                animate={{ x: [0, -15, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-1/2 -left-20 -translate-y-1/2 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                            >
                                <img src={blinkitLogo} alt="Blinkit" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Zepto - Bottom Center Left */}
                            <motion.div 
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                className="absolute -bottom-12 left-1/4 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                            >
                                <img src={zeptoLogo} alt="Zepto" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Zomato - Bottom Right Quadrant */}
                            <motion.div 
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className="absolute bottom-4 right-0 w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-20"
                            >
                                <img src={zomatoLogo} alt="Zomato" className="w-full h-full object-contain" />
                            </motion.div>


                            {/* WORKER BADGES (Neatly Placed Labels) */}
                            
                            {/* Worker 1: Kushagra - Top Right */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.5, delay: 0.6 }}
                                className="absolute top-0 -right-28 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 z-20 min-w-[170px]"
                            >
                                <div className="w-9 h-9 rounded-full border-2 border-brand overflow-hidden shrink-0">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kush" alt="User" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white tracking-tight leading-tight">Kushagra Sahay</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">Settled ₹850</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Worker 2: Rohit - Middle Right */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                                className="absolute top-1/2 -right-36 -translate-y-1/2 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 z-20 min-w-[170px]"
                            >
                                <div className="w-9 h-9 rounded-full border-2 border-brand overflow-hidden shrink-0">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" alt="User" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white tracking-tight leading-tight">Rohit Sharma</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">Joined Platform</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Worker 3: Anusha - Bottom Center Right */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="absolute -bottom-20 right-4 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 z-20 min-w-[170px]"
                            >
                                <div className="w-9 h-9 rounded-full border-2 border-brand overflow-hidden shrink-0">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anusha" alt="User" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white tracking-tight leading-tight">Anusha Jha</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">Instant Settlement</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
