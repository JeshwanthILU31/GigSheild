import React, { useState, useEffect } from 'react';
import { Activity, CloudRain, Wind, Thermometer } from 'lucide-react';
import { safeGetItem } from '../../utils/storage';

const zoneCoordinates = {
    'HITEC City': { lat: 17.4474, lon: 78.3762 },
    'Madhapur': { lat: 17.4483, lon: 78.3915 },
    'Gachibowli': { lat: 17.4401, lon: 78.3489 },
    'Kukatpally': { lat: 17.4948, lon: 78.3996 },
    'Delhi NCR': { lat: 28.6139, lon: 77.2090 },
    'Mumbai West': { lat: 19.0760, lon: 72.8777 },
    'Bangalore East': { lat: 12.9716, lon: 77.5946 },
    'Chennai Central': { lat: 13.0827, lon: 80.2707 },
    'Connaught Place': { lat: 28.6304, lon: 77.2177 },
    'Saket': { lat: 28.5246, lon: 77.2066 },
    'Vasant Kunj': { lat: 28.5292, lon: 77.1541 },
    'Bandra': { lat: 19.0596, lon: 72.8295 },
    'Andheri': { lat: 19.1136, lon: 72.8697 },
    'Powai': { lat: 19.1176, lon: 72.9060 },
    'Koramangala': { lat: 12.9352, lon: 77.6245 },
    'Indiranagar': { lat: 12.9784, lon: 77.6408 },
    'Whitefield': { lat: 12.9698, lon: 77.7499 },
    'Downtown Delivery': { lat: 17.3850, lon: 78.4867 },
    'North Sector': { lat: 17.5000, lon: 78.5000 },
    'South District': { lat: 17.3000, lon: 78.4500 },
    'East Sector': { lat: 17.3500, lon: 78.5500 },
};

const DeliverabilityScoreSmall = () => {
    const [scoreData, setScoreData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const selectedZone = safeGetItem('activeZone') || 'HITEC City';

    useEffect(() => {
        const fetchScoreData = async () => {
            if (!selectedZone) return;
            setIsLoading(true);
            try {
                const coords = zoneCoordinates[selectedZone] || { lat: 17.4474, lon: 78.3762 };
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,rain,weather_code&timezone=auto`);
                const weatherJson = await weatherRes.json();
                const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=us_aqi&timezone=auto`);
                const aqiJson = await aqiRes.json();
                
                const rain = weatherJson.current?.rain || 0;
                const temp = weatherJson.current?.temperature_2m || 25;
                const aqi = aqiJson.current?.us_aqi || 50;
                
                const demandHash = selectedZone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const demand = (demandHash % 50) + 50;
                
                let baseScore = 90;
                if (demand > 80) baseScore += 5;
                const rainPenalty = Math.min(rain * 10, 40);
                const aqiPenalty = aqi > 100 ? Math.min((aqi - 100) * 0.1, 20) : 0;
                const demandFactor = demand < 60 ? 5 : 0;
                
                const finalScore = Math.max(10, Math.round(baseScore - rainPenalty - aqiPenalty - demandFactor));
                
                setScoreData({ score: finalScore, rain, temp, aqi, demand });
            } catch (error) {
                console.error("Error fetching score data", error);
                setScoreData({ score: 85, rain: 0, temp: 28, aqi: 65, demand: 75 });
            } finally {
                setIsLoading(false);
            }
        };

        fetchScoreData();
    }, [selectedZone]);

    if (isLoading || !scoreData) {
        return (
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl mb-8 flex justify-center items-center h-40">
                <div className="w-6 h-6 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl mb-8 border border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand/5 rounded-full blur-[40px]"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">Deliverability<br/>Score</h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{selectedZone}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-slate-900">{scoreData.score}</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-100" strokeWidth="10"/>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className={scoreData.score > 70 ? "text-emerald-500" : scoreData.score > 40 ? "text-amber-500" : "text-rose-500"} strokeWidth="10" strokeDasharray={`${scoreData.score * 2.827} 282.7`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-in-out' }}/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 relative z-10">
                <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                    <CloudRain size={14} className="text-blue-500 mb-1" />
                    <span className="text-xs font-black">{scoreData.rain}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                    <Wind size={14} className="text-emerald-500 mb-1" />
                    <span className="text-xs font-black">{scoreData.aqi}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                    <Thermometer size={14} className="text-orange-500 mb-1" />
                    <span className="text-xs font-black">{Math.round(scoreData.temp)}°</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                    <Activity size={14} className="text-violet-500 mb-1" />
                    <span className="text-xs font-black">{scoreData.demand}%</span>
                </div>
            </div>
        </div>
    );
};

export default DeliverabilityScoreSmall;
