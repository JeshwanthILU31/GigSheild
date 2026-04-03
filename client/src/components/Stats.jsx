import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const CountUp = ({ to, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, to, {
        duration: duration,
        onUpdate: (value) => setCount(Math.floor(value)),
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const Stats = () => {
  const stats = [
    { label: 'Total Payouts', value: '₹25L+', subtext: 'Disbursed to gig workers' },
    { label: 'Instant Payouts', value: '99%', subtext: 'Received within minutes via UPI' },
    { label: 'Claims Process', value: '0', subtext: 'Manual claims required' },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 blur-[150px] rounded-full -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        {/* Main Number Indicator */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mb-20"
        >
           <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-none tracking-tight mb-6">
              <CountUp to={10000} /><span className="text-brand">+</span>
           </h2>
           <p className="text-lg md:text-xl font-bold text-slate-400">
              Gig Workers Protected
           </p>
           <div className="mt-12 max-w-2xl mx-auto relative px-8 py-4">
              <p className="text-lg text-slate-500 italic leading-relaxed">
                 "When I couldn't drive during the floods last month, my Rent was covered 
                 by GigShield automatically. No paperwork, just my payout."
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className="h-1 w-8 bg-brand/20 rounded-full" />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rahul, Delivery Partner</span>
              </div>
           </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl shadow-slate-300/10 flex flex-col justify-center items-center text-center group hover:border-brand/30 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-brand transition-colors mb-3 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="h-1 w-10 bg-slate-100 rounded-full mb-6 group-hover:w-14 group-hover:bg-brand/30 transition-all duration-500" />
              <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
