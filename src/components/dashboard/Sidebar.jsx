import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Settings, LogOut, History as HistoryIcon, User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';

import logo from '../../assets/logo.png';

const Sidebar = () => {
    const navigate = useNavigate();
    const { setIsRegistered, plan } = useSimulation();
    const { user, logout } = useAuth();
    
    const handleLogout = () => {
        setIsRegistered(false);
        navigate('/');
        setTimeout(() => {
            logout();
        }, 10);
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Policy Details', path: '/dashboard/policy', icon: FileText },
        { name: 'Payout History', path: '/dashboard/history', icon: HistoryIcon },
        { name: 'Billing, Pay', path: '/dashboard/billing', icon: CreditCard },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-screen fixed top-0 left-0 z-50 transition-colors duration-300">
            {/* Sidebar Logo */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                        <img src={logo} alt="GigShield Logo" className="h-10 w-auto object-contain dark:brightness-110" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none pt-1">
                        Gig<span className="text-brand">Shield</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow p-6 space-y-2 pt-8">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) => 
                                `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
                                    isActive 
                                    ? 'bg-brand text-white shadow-xl shadow-brand/20' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-brand dark:hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/5'
                                }`
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="tracking-tight">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile Hook */}
            <div className="p-6 border-t border-slate-50 dark:border-slate-800">
                    <div 
                        onClick={() => navigate('/dashboard/profile')}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-brand/20 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                            {user?.name?.substring(0, 2).toUpperCase() || 'GS'}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight leading-none">{user?.name || 'Partner'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1.5">{plan} Tier</p>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-all shadow-sm"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default Sidebar;
