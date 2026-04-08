import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Clock, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TrackOrder = () => {
  // 1. STATE HOOKS
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [orderData, setOrderData] = useState(null);

  // 2. LINTER FIX
  if (!motion) return null;

  // 3. DATABASE SEARCH HANDLER
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) return;

    setStatus('loading');
    setOrderData(null);

    try {
      // Search the database for the exact tracking number
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('tracking_number', trackingId.trim())
        .single(); // We only expect one exact match

      if (error) throw error;

      if (data) {
        setOrderData(data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Tracking Error:", error.message);
      setStatus('error');
    }
  };

  // 4. PROGRESS BAR LOGIC
  // We map the database statuses to a visual timeline
  const timelineSteps = ['Pending', 'In Progress', 'Completed'];

  const getStepIndex = (currentStatus) => {
    return timelineSteps.indexOf(currentStatus);
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-slate-50 py-16 px-4 sm:px-6 flex flex-col items-center">

        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 w-full max-w-2xl"
        >
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-slate-500 font-medium">Enter your 5-digit tracking number to see the live status of your assignment.</p>
        </motion.div>

        {/* SEARCH BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md mb-8"
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              required
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. 48291"
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-lg font-black tracking-widest text-slate-900 outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 transition-all text-center uppercase"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            </button>
          </form>
        </motion.div>

        {/* RESULTS SECTION */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {/* ERROR STATE */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border-2 border-red-100 p-8 rounded-[2rem] text-center"
              >
                <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-black text-red-700 mb-2">Order Not Found</h3>
                <p className="text-red-600 font-medium">We couldn't find an active order with that tracking number. Please check the number and try again.</p>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {status === 'success' && orderData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
              >
                {/* Order Details Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-8 gap-4">
                  <div>
                    <p className="text-sm font-black tracking-widest text-slate-400 uppercase mb-1">Order Details</p>
                    <h3 className="text-2xl font-black text-slate-900">{orderData.subject}</h3>
                    <p className="text-slate-500 font-medium mt-1">For: {orderData.student_name}</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-xl text-right border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deadline</p>
                    <p className="text-slate-800 font-black flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      {new Date(orderData.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {/* Financial Status Card */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Quote</p>
                    <p className="text-xl font-black text-slate-900">₹{orderData.price}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Remaining</p>
                    <p className={`text-xl font-black ${orderData.price - orderData.amount_paid > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ₹{orderData.price - orderData.amount_paid}
                    </p>
                  </div>
                </div>

                {/* THE PROGRESS STEPPER */}
                <div className="relative pt-4 pb-8">
                  {/* The Background Line */}
                  <div className="absolute top-[34px] left-8 right-8 h-1 bg-slate-100 rounded-full z-0"></div>

                  {/* The Active Progress Line */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: getStepIndex(orderData.status) === 0 ? "0%" :
                        getStepIndex(orderData.status) === 1 ? "50%" : "100%"
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-[34px] left-8 h-1 bg-blue-600 rounded-full z-0"
                  ></motion.div>

                  <div className="relative z-10 flex justify-between">

                    {/* Step 1: Pending */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Package size={28} />
                      </div>
                      <p className={`text-sm font-black ${getStepIndex(orderData.status) >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Received</p>
                    </div>

                    {/* Step 2: In Progress */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText size={28} />
                      </div>
                      <p className={`text-sm font-black ${getStepIndex(orderData.status) >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Writing</p>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>
                        <CheckCircle size={28} />
                      </div>
                      <p className={`text-sm font-black ${getStepIndex(orderData.status) >= 2 ? 'text-green-600' : 'text-slate-400'}`}>Delivered</p>
                    </div>

                  </div>
                </div>

                {/* Status Message Container */}
                <div className="mt-6 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
                  <p className="text-blue-800 font-bold">
                    {orderData.status === 'Pending' && "We have received your order details and will begin working on it shortly!"}
                    {orderData.status === 'In Progress' && "Our experts are currently writing your assignment. We are on schedule!"}
                    {orderData.status === 'Completed' && "Your assignment is completely finished! Check your WhatsApp for the delivery."}
                  </p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  );
};

export default TrackOrder;