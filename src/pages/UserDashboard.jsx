import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Package, Clock, AlertTriangle, ExternalLink, 
  Hash, LogOut, Loader2, User, AlertCircle 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. SAFE AUTH CHECK
                // We use a safe check here to prevent destructuring 'null'
                const { data: authData, error: authError } = await supabase.auth.getUser();
                
                if (authError || !authData?.user) {
                    console.warn("No active session found.");
                    navigate('/login');
                    return;
                }

                const user = authData.user;
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
                setUserName(name);

                // 2. SAFE DATA FETCH
                const { data, error: dbError } = await supabase
                    .from('assignments')
                    .select('*')
                    .eq('student_email', user.email)
                    .order('created_at', { ascending: false });

                if (dbError) throw dbError;
                setOrders(data || []);

            } catch (err) {
                console.error("Dashboard Runtime Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'in progress': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    // --- SAFETY RENDER: If the code crashes, show this instead of white screen ---
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-100 text-center">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">DASHBOARD ERROR</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Something went wrong while syncing with the Spine. 
                        <br/><span className="font-mono text-[10px] text-red-500">{error}</span>
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="min-h-screen bg-slate-50 py-12 px-4 font-medium"
            >
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                                My<span className="text-blue-600">Portal</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <User size={14} className="text-blue-500" />
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                    Student: {userName}
                                </p>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white text-red-500 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-red-50 transition-all shadow-sm"
                        >
                            <LogOut size={16} /> Logout
                        </motion.button>
                    </header>

                    {/* Main Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] italic text-center">
                                Accessing Spine Logs...
                            </p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="grid gap-5">
                            <AnimatePresence mode="popLayout">
                                {orders.map((order, index) => (
                                    <motion.div 
                                        key={order.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-blue-200 transition-all"
                                    >
                                        <div className="flex items-center gap-6 w-full md:w-auto">
                                            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Package size={32} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Hash size={14} className="text-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{order.tracking_number || 'TRK-000'}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{order.subject}</h3>
                                                <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs font-bold uppercase italic">
                                                    <Clock size={14} /> 
                                                    <span>Due: {order.deadline}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 border-t md:border-t-0 pt-6 md:pt-0">
                                            <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusStyles(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => window.open(`https://wa.me/YOUR_PHONE?text=Update on Order ${order.tracking_number}`)}
                                                className="bg-slate-900 p-4 rounded-2xl text-white hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                                            >
                                                <ExternalLink size={20} />
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
                            className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-200 text-center shadow-inner"
                        >
                            <AlertCircle className="text-slate-200 mx-auto mb-6" size={64} />
                            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Active Logs</h2>
                            <p className="text-slate-400 font-medium mb-10 italic">You haven't requested any fulfillments yet.</p>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/assignments')}
                                className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-blue-100"
                            >
                                Place First Order
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </PageTransition>
    );
};

export default UserDashboard;