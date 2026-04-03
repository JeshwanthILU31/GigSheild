import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex overflow-hidden transition-colors duration-300">
            {/* Persistent Sidebar */}
            <Sidebar />
            
            {/* Main Content Scroll Area */}
            <main className="flex-grow ml-80 overflow-y-auto h-screen relative">
                {/* Global Dashboard Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 dark:bg-brand/[0.02] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/5 dark:bg-sky-500/[0.02] blur-[100px] rounded-full -z-0" />
                
                <div className="p-16 relative z-10 w-full min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
