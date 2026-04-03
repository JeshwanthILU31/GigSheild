import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldCheck, 
  Zap, 
  IndianRupee, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  MapPin, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Mock Data for Charts
    const chartData = [
        { type: 'Rain', count: 45, color: '#ff6b00' },
        { type: 'AQI', count: 28, color: '#ff8a33' },
        { type: 'Heat', count: 15, color: '#ffa35c' },
        { type: 'Platform', count: 12, color: '#ffbc85' }
    ];

    // Mock Recent Triggers
    const recentTriggers = [
        { id: 1, type: 'Rain', pincode: '560001', value: '48mm', time: '10:45 AM', affected: 154 },
        { id: 2, type: 'AQI', pincode: '110001', value: '312 AQI', time: '09:20 AM', affected: 342 },
        { id: 3, type: 'Platform', pincode: '400001', value: 'Down', time: '08:15 AM', affected: 89 },
        { id: 4, type: 'Heat', pincode: '500001', value: '46°C', time: '02:30 PM', affected: 128 }
    ];

    // Mock Recent Claims
    const recentClaims = [
        { id: 101, worker: 'Ravi Kumar', trigger: 'Rain', amount: 320, status: 'Paid', time: '2 mins ago' },
        { id: 102, worker: 'Priya Singh', trigger: 'AQI', amount: 250, status: 'Pending', time: '5 mins ago' },
        { id: 103, worker: 'Suresh Raina', trigger: 'Platform', amount: 400, status: 'Rejected', time: '12 mins ago' },
        { id: 104, worker: 'Amit Patel', trigger: 'Heat', amount: 180, status: 'Approved', time: '15 mins ago' }
    ];

    const stats = [
        { label: 'Total Active Workers', value: '12,543', icon: Users, color: 'text-brand', bg: 'bg-brand/5' },
        { label: 'Active Policies', value: '8,290', icon: ShieldCheck, color: 'text-brand', bg: 'bg-brand/5' },
        { label: 'Claims This Week', value: '1,452', icon: Zap, color: 'text-brand', bg: 'bg-brand/5' },
        { label: 'Total Payouts', value: '₹4.2L', icon: IndianRupee, color: 'text-brand', bg: 'bg-brand/5' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Admin Header */}
            <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">
                        A
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Admin<span className="text-brand">Panel</span></h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Control Unit</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">System Online: Live IoT Grid</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all rounded-xl border border-slate-100 shadow-sm"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-grow p-8 max-w-[1600px] mx-auto w-full space-y-8">
                {/* A. Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:-translate-y-1 transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight tracking-tighter">{stat.value}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* B. Recent Triggers Table */}
                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Live IoT Grid Triggers</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {['Trigger Type', 'Pin Code', 'Value', 'Time', 'Workers Affected'].map((header) => (
                                            <th key={header} className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTriggers.map((t) => (
                                        <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${t.type === 'Rain' ? 'bg-blue-50 text-blue-500' : t.type === 'AQI' ? 'bg-green-50 text-green-500' : t.type === 'Heat' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                                                        {t.type[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{t.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-500">{t.pincode}</td>
                                            <td className="px-8 py-6 text-sm font-black text-slate-900">{t.value}</td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-500">{t.time}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg">
                                                    {t.affected}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* D. Simple Bar Chart */}
                    <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Weekly Trigger Trend</h3>
                        </div>
                        <div className="flex-grow min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="type" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* C. Recent Claims Table */}
                    <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Disruption Settlements Ledger</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {['Worker Profile', 'Trigger Source', 'Payout Amount', 'Status', 'Timestamp'].map((header) => (
                                            <th key={header} className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentClaims.map((c) => (
                                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-brand/10 group-hover:text-brand transition-all">
                                                        {c.worker[0]}
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800">{c.worker}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                                    {c.trigger}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-brand">₹{c.amount}</td>
                                            <td className="px-8 py-6">
                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2 ${c.status === 'Paid' ? 'bg-blue-50 text-blue-600 border-blue-100' : c.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : c.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Paid' ? 'bg-blue-500' : c.status === 'Approved' ? 'bg-green-500' : 'bg-rose-500'}`} />
                                                    {c.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-400">{c.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
