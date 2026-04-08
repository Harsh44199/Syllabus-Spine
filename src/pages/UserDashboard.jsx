import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Clock, CheckCircle, AlertCircle, 
  ExternalLink, Hash, LogOut, User 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    
    // 1. THE LOGOUT ENGINE
    const handleLogout = async () => {
        if (!motion) return null;
        const { error } = await supabase.auth.signOut();
        if (!error) {
            // Zehaha! Successfully left the Spine.
            navigate('/login');
        } else {
            console.error("Logout failed:", error.message);
        }
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setUserName(user.user_metadata?.full_name || user.email.split('@')[0]);

                const { data, error } = await supabase
                    .from('assignments')
                    .select('*')
                    .eq('student_email', user.email)
                    .order('created_at', { ascending: false });

                if (!error) {
                    setOrders(data);
                }
            } else {
                // If no user found, safety redirect
                navigate('/login');
            }
            setLoading(false);
        };

        fetchUserOrders();
    }, [navigate]);

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
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="min-h-screen bg-slate-50 py-12 px-4 font-medium"
            >
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <header className="mb-10 flex justify-between items-center">
                        <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                                Student<span className="text-blue-600">Portal</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <User size={12} className="text-blue-500" />
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                                    {userName}
                                </p>
                            </div>
                        </motion.div>
                        
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block">
                                <span className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {orders.length} ACTIVE LOGS
                                </span>
                            </div>
                            
                            {/* LOGOUT BUTTON */}
                            <motion.button 
                                whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white text-red-500 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:border-red-200 transition-all shadow-sm"
                            >
                                <LogOut size={14} />
                                Logout
                            </motion.button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Orders...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {orders.map((order, index) => (
                                    <motion.div 
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-200 transition-all"
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
                                                <p className="text-xs text-slate-400 font-bold italic mt-1">Due: {order.deadline}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => window.open(`https://wa.me/YOUR_PHONE?text=Update on Order ${order.tracking_number}`)}
                                                className="bg-slate-900 p-3 rounded-xl text-white hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                                            >
                                                <ExternalLink size={18} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-16 rounded-[4rem] border-2 border-dashed border-slate-200 text-center"
                        >
                            <AlertCircle className="text-slate-300 mx-auto mb-6" size={48} />
                            <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Logs</h2>
                            <p className="text-slate-400 font-medium mb-8 max-w-xs mx-auto italic">Zehaha! You haven't requested any fulfillments yet.</p>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate('/assignments')}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
                            >
                                Place Order
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </PageTransition>
    );
};

export default UserDashboard;