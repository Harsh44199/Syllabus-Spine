import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
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

                const { data: authData, error: authError } = await supabase.auth.getUser();
                
                if (authError || !authData?.user) {
                    navigate('/login');
                    return;
                }

                const user = authData.user;
                const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
                setUserName(name);

                const { data, error: dbError } = await supabase
                    .from('assignments')
                    .select('*')
                    .eq('student_email', user.email)
                    .order('created_at', { ascending: false });

                if (dbError) throw dbError;
                setOrders(data || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (motion) fetchDashboardData(); // safe-guard
    }, [navigate]);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'in progress': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-red-100 text-center">
                    <AlertTriangle className="text-red-500 mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight">DASHBOARD ERROR</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
                        Something went wrong while syncing. 
                        <br/><span className="font-mono text-[9px] sm:text-[10px] text-red-500">{error}</span>
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-slate-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
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
                className="min-h-screen bg-slate-50 py-8 md:py-12 px-4 font-medium"
            >
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <header className="mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                                My<span className="text-blue-600">Portal</span>
                            </h1>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                                <User size={12} className="text-blue-500 sm:w-3.5 sm:h-3.5" />
                                <p className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] truncate max-w-[200px] sm:max-w-none">
                                    Student: {userName}
                                </p>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white text-red-500 px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-red-50 transition-all shadow-sm"
                        >
                            <LogOut size={14} className="sm:w-4 sm:h-4" /> Logout
                        </motion.button>
                    </header>

                    {/* Main Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 sm:py-24 space-y-3 sm:space-y-4">
                            <Loader2 className="animate-spin text-blue-600 w-8 h-8 sm:w-10 sm:h-10" />
                            <p className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] italic text-center">
                                Accessing Logs...
                            </p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="grid gap-4 sm:gap-5">
                            <AnimatePresence mode="popLayout">
                                {orders.map((order, index) => (
                                    <motion.div 
                                        key={order.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 group hover:border-blue-200 transition-all"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                                <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                                    <Hash size={12} className="text-slate-300 sm:w-3.5 sm:h-3.5" />
                                                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase truncate">{order.tracking_number || 'TRK-000'}</span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">{order.subject}</h3>
                                                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 text-slate-500 text-[10px] sm:text-xs font-bold uppercase italic">
                                                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" /> 
                                                    <span className="truncate">Due: {order.deadline}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                                            <div className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm w-full sm:w-auto text-center ${getStatusStyles(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => window.open(`https://wa.me/YOUR_PHONE?text=Update on Order ${order.tracking_number}`)}
                                                className="bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 shrink-0"
                                            >
                                                <ExternalLink size={16} className="sm:w-5 sm:h-5" />
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
                            className="bg-white p-8 sm:p-12 md:p-20 rounded-[2rem] md:rounded-[4rem] border-2 border-dashed border-slate-200 text-center shadow-inner"
                        >
                            <AlertCircle className="text-slate-200 mx-auto mb-4 sm:mb-6 w-12 h-12 sm:w-16 sm:h-16" />
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">No Active Logs</h2>
                            <p className="text-slate-400 font-medium text-sm sm:text-base mb-8 sm:mb-10 italic">You haven't requested any fulfillments yet.</p>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/assignments')}
                                className="w-full sm:w-auto bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
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