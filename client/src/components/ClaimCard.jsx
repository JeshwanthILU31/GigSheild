import React from 'react';
import StatusBadge from './StatusBadge';

const ClaimCard = ({ claim }) => {
    const { date, type, amount, status } = claim;

    return (
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-500 font-medium">{date}</span>
                <StatusBadge status={status} />
            </div>
            
            <div className="space-y-4">
                <div>
                     <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{type}</h3>
                     <p className="text-[11px] text-slate-400 mt-0.5">Automated Weather Settlement</p>
                </div>

                <div className="flex items-end justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300">Amount Paid</span>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">₹{amount}</span>
                     </div>
                     <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ClaimCard;
