import React from 'react';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Zap 
} from 'lucide-react';

const ActiveConditions = () => {
    const conditions = [
        { icon: CloudRain, label: "Rain Level", value: "12mm", status: "Moderate", sub: "Threshold 40mm", color: "text-blue-400" },
        { icon: Wind, label: "AQI Level", value: "342", status: "CRITICAL", sub: "Alert Active", color: "text-rose-500" },
        { icon: Thermometer, label: "Heat Index", value: "38°C", status: "Normal", sub: "Threshold 44°C", color: "text-amber-500" },
        { icon: Zap, label: "App Status", value: "Online", status: "Stable", sub: "Swiggy | Zomato", color: "text-green-500" }
    ];

    return (
        <div className="md:col-span-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl font-bold uppercase tracking-widest">Active Conditions <span className="text-brand text-xs ml-4 font-black animate-pulse uppercase tracking-[0.2em]">Live Data Feed</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {conditions.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="glass-card p-8 flex flex-col items-center text-center group">
                            <div className={`p-4 rounded-2xl bg-white/5 mb-6 group-hover:scale-110 transition-all ${item.color}`}>
                              <Icon size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                            <h4 className="text-3xl font-black text-white mb-2">{item.value}</h4>
                            <div className={`text-xs font-black uppercase tracking-widest ${item.status === 'CRITICAL' ? 'text-rose-500 animate-pulse' : 'text-slate-300 opacity-60'}`}>
                                {item.status} • {item.sub}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveConditions;
