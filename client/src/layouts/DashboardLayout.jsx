import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/logo.png';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex overflow-x-hidden w-full min-w-0 transition-colors duration-300 relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                        <span className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors block">
                            <Menu className="w-6 h-6" />
                        </span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="GigShield Logo" className="h-8 w-auto object-contain dark:brightness-110" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none pt-1">
                            Gig<span className="text-brand">Shield</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Persistent Sidebar */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-72
              transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0 md:w-80
              [&>div]:w-full [&>div]:static
            `}>
                <Sidebar />
            </div>
            
            {/* Main Content Scroll Area */}
            <main className="flex-grow w-full min-w-0 overflow-x-hidden md:ml-80">
                {/* Global Dashboard Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 dark:bg-brand/[0.02] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 -z-0" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/5 dark:bg-sky-500/[0.02] blur-[100px] rounded-full -z-0" />
                
                <div className="p-4 md:p-16 pt-20 md:pt-16 relative z-10 w-full min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
