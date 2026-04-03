import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const colorClasses = {
        primary: 'border-orange-500',
        secondary: 'border-slate-500',
        white: 'border-white',
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color]} border-solid rounded-full animate-spin shadow-lg shadow-orange-500/20`}></div>
        </div>
    );
};

export default LoadingSpinner;
