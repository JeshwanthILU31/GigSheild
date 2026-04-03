import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

const LocationSelection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedZone, setSelectedZone] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const pincode = user?.pincode || safeGetItem('registrationPincode') || '500081';

    const getZonesForPincode = (pin) => {
        const strPin = String(pin);
        if (strPin.startsWith('500')) return ['HITEC City', 'Madhapur', 'Gachibowli', 'Kondapur'];
        if (strPin.startsWith('110')) return ['Connaught Place', 'Saket', 'Vasant Kunj'];
        if (strPin.startsWith('400')) return ['Bandra', 'Andheri', 'Powai'];
        if (strPin.startsWith('560')) return ['Koramangala', 'Indiranagar', 'Whitefield'];
        return ['Downtown Delivery', 'North Sector', 'South District', 'East Sector'];
    };

    const zones = getZonesForPincode(pincode);

    const handleConfirm = () => {
        if (!selectedZone) return;
        setIsScanning(true);
        safeSetItem('activeZone', selectedZone);
        setTimeout(() => navigate('/dashboard/select-plan'), 1500);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden font-body">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10"
            >
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-8 shadow-inner">
                    <Navigation size={28} />
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Set Work Location</h1>
                <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">
                    We noticed your registered pincode is <span className="text-slate-900 font-extrabold">{pincode}</span>. Click your primary operating zone so we can accurately assess local weather patterns and deliverability risks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {zones.map((zone) => (
                        <button
                            key={zone}
                            onClick={() => setSelectedZone(zone)}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-start gap-4 ${
                                selectedZone === zone 
                                ? 'bg-brand/5 border-brand shadow-xl shadow-brand/10 scale-[1.02]' 
                                : 'bg-slate-50 border-slate-100 hover:border-brand/30 hover:bg-white'
                            }`}
                        >
                            <MapPin size={22} className={selectedZone === zone ? 'text-brand' : 'text-slate-400'} />
                            <span className={`font-black text-left text-lg ${selectedZone === zone ? 'text-slate-900' : 'text-slate-600'}`}>{zone}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!selectedZone || isScanning}
                    className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-4 disabled:opacity-30 group"
                >
                    {isScanning ? 'Mapping Region Risks...' : 'Confirm Zone'}
                    {!isScanning && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                </button>
            </motion.div>
        </div>
    );
};
export default LocationSelection;
