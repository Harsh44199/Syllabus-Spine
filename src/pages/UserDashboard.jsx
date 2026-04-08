import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, AlertCircle, ExternalLink, Hash } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    
    useEffect(() => {
        if (!motion) return null;
        const fetchUserOrders = async () => {
            setLoading(true);
            
            // 1. Get the current logged-in user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email.split('@')[0]);

                // 2. Fetch orders where student_name or email matches
                // Note: We match by email to ensure students see only THEIR orders
                const { data, error } = await supabase
                    .from('assignments')
                    .select('*')
                    .eq('student_email', user.email) // 👈 Ensure you have this column in Supabase
                    .order('created_at', { ascending: false });

                if (!error) {
                    setOrders(data);
                }
            }
            setLoading(false);
        };

        fetchUserOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'in progress': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-slate-50 py-12 px-4 font-medium">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                                Student<span className="text-blue-600">Portal</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                                Welcome back, {userName}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <span className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-black text-slate-400">
                                {orders.length} TOTAL REQUESTS
                            </span>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing with Spine...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {orders.map((order, index) => (
                                    <motion.div 
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-200 transition-all"
                                    >
                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Package size={28} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Hash size={12} className="text-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{order.tracking_number}</span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900 leading-tight">{order.subject}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-xs text-slate-400 font-bold italic">
                                                        <Clock size={12} /> {order.deadline}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </div>
                                            <button 
                                                onClick={() => window.open(`https://wa.me/YOUR_PHONE?text=Inquiry about Order ${order.tracking_number}`)}
                                                className="bg-slate-900 p-3 rounded-xl text-white hover:bg-blue-600 transition-colors shadow-lg"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">No active fulfillments</h2>
                            <p className="text-slate-400 font-medium mb-8 max-w-xs mx-auto">Zehaha! You haven't placed any orders yet. Start your first fulfillment today.</p>
                            <button 
                                onClick={() => window.location.href = '/assignments'}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-200"
                            >
                                Place New Order
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default UserDashboard;