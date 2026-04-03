import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { isRegistered } = useSimulation();
    const { isAuthenticated } = useAuth();
    
    // Unified session state
    const isUserAuthenticated = isAuthenticated || isRegistered;
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
      <nav className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            onClick={() => { if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img src={logo} alt="GigShield Logo" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Gig<span className="text-brand">Shield</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all hover:text-brand relative group/link ${
                  isActive(link.path) ? 'text-brand' : 'text-slate-500'
                }`}
                onClick={() => { if (link.path === '/' && location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                {link.name}
                <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-brand transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {!isUserAuthenticated && !['/register', '/login'].includes(location.pathname) && (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-brand transition-all">
                  Login
                </Link>
                <Link to="/register" className="bg-brand text-white py-3 px-8 text-sm font-bold rounded-2xl hover:bg-brand-hover hover:-translate-y-1 transition-all shadow-lg shadow-brand/10">
                  Get Started
                </Link>
              </>
            )}
            {isUserAuthenticated && (
               <Link to="/dashboard" className="bg-slate-900 text-white py-3 px-8 text-sm font-bold rounded-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/10">
                  Dashboard
                </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-900 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-b border-slate-100 shadow-xl relative z-40"
          >
            <div className="px-6 pt-4 pb-10 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block py-4 text-lg font-semibold text-slate-900 border-b border-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 flex flex-col gap-4">
                {!isUserAuthenticated && !['/register', '/login'].includes(location.pathname) && (
                  <>
                    <Link to="/login" className="w-full py-4 text-center text-slate-600 font-semibold border border-slate-100 rounded-2xl" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="bg-brand text-white w-full py-4 rounded-2xl shadow-lg shadow-brand/10 flex items-center justify-center gap-2 font-bold" onClick={() => setIsOpen(false)}>
                      Get Started
                      <ArrowRight size={18} />
                    </Link>
                  </>
                )}
                {isUserAuthenticated && (
                    <Link to="/dashboard" className="bg-slate-900 text-white w-full py-4 rounded-2xl text-center font-bold" onClick={() => setIsOpen(false)}>
                        Go to Dashboard
                    </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
