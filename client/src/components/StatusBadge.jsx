import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase() || '';
        switch (s) {
            case 'paid':
            case 'active':
            case 'approved':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/10 shadow-emerald-500/5';
            case 'pending':
            case 'processing':
                return 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/10 shadow-amber-500/5';
            case 'failed':
            case 'rejected':
            case 'inactive':
                return 'bg-rose-100 text-rose-700 border-rose-200 ring-rose-500/10 shadow-rose-500/5';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10 shadow-slate-500/5';
        }
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ring-1 ring-inset shadow-sm ${getStatusStyle(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
