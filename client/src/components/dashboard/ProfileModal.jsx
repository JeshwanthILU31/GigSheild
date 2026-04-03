import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, MapPin, ChevronRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useNavigate } from 'react-router-dom';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, plan, getRiskLevel } = useSimulation();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const riskLevel = getRiskLevel();

    const handleViewFullProfile = () => {
        onClose();
        navigate('/profile');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                {/* Modal Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[40px] max-w-lg w-full p-12 min-h-[600px] relative z-10 shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                >
                    <button onClick={onClose} className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="text-left mb-10">
                        <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Account Status</h3>
                    </div>

                    <div className="flex flex-col items-center flex-grow">
                        <div className="w-28 h-28 bg-orange-50 rounded-[35px] flex items-center justify-center mb-6 shadow-sm border border-orange-100">
                             <User size={48} className="text-brand opacity-80" />
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-800 mb-2 italic tracking-tighter">
                            {user?.name || "sdfghj"}
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                            ID: {user?.platformId || "678GHJ"}
                        </p>

                        <div className="px-6 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-100 mb-4 shadow-sm">
                            Insured Partner
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileModal;
