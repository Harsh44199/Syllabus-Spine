import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Clock, CheckCircle, AlertCircle, Loader2, FileText, Calculator } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [orderData, setOrderData] = useState(null);

  if (!motion) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setStatus('loading');
    setOrderData(null);

    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('tracking_number', trackingId.trim())
        .single(); 

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

  const timelineSteps = ['Pending', 'In Progress', 'Completed'];
  const getStepIndex = (currentStatus) => timelineSteps.indexOf(currentStatus || 'Pending');

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-slate-50 py-10 md:py-16 px-4 flex flex-col items-center">

        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-10 w-full max-w-2xl"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
            <Search size={32} strokeWidth={2.5} className="md:w-9 md:h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Track Your Order</h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium px-2">Enter your 5-digit tracking number to see the live status of your assignment.</p>
        </motion.div>

        {/* SEARCH BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md mb-8"
        >
          <form onSubmit={handleSearch} className="relative flex items-center shadow-lg shadow-slate-200/50 rounded-2xl">
            <input
              type="text"
              required
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. 48291"
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 md:px-6 py-4 md:py-5 text-base md:text-lg font-black tracking-widest text-slate-900 outline-none focus:border-blue-600 transition-all text-center uppercase"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-2 md:right-3 bg-blue-600 text-white p-2.5 md:p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </form>
        </motion.div>

        {/* RESULTS SECTION */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-red-50 border-2 border-red-100 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center">
                <AlertCircle className="text-red-500 mx-auto mb-3 md:mb-4" size={36} />
                <h3 className="text-lg md:text-xl font-black text-red-700 mb-2">Order Not Found</h3>
                <p className="text-red-600 font-medium text-sm md:text-base">We couldn't find an active order with that tracking number. Please check the number and try again.</p>
              </motion.div>
            )}

            {status === 'success' && orderData && (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
                
                {/* Order Details Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 md:pb-6 mb-6 md:mb-8 gap-4">
                  <div>
                    <p className="text-[10px] md:text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Order Details</p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{orderData.subject}</h3>
                    <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">For: {orderData.student_name}</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-full sm:w-auto text-center sm:text-right">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
                    <p className="text-sm md:text-base text-slate-800 font-black flex items-center justify-center sm:justify-end gap-2">
                      <Clock size={14} className="text-blue-500" />
                      {new Date(orderData.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Financial Status Card (SMART RENDER) */}
                {orderData.price ? (
                   <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
                    <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Quote</p>
                      <p className="text-lg md:text-xl font-black text-slate-900">₹{orderData.price}</p>
                    </div>
                    <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                      <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                      <p className={`text-lg md:text-xl font-black ${orderData.price - (orderData.amount_paid || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ₹{orderData.price - (orderData.amount_paid || 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-slate-50 p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
                       <Calculator size={20} />
                     </div>
                     <div>
                       <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Financial Status</p>
                       <p className="text-sm md:text-base font-black text-slate-700">Quote Pending via WhatsApp</p>
                     </div>
                  </div>
                )}

                {/* THE PROGRESS STEPPER */}
                <div className="relative pt-6 md:pt-8 pb-6 md:pb-8 mt-4 md:mt-6">
                  {/* The Background Line (Fixed for Mobile) */}
                  <div className="absolute top-[46px] md:top-[62px] left-[15%] right-[15%] h-1 bg-slate-100 rounded-full z-0"></div>

                  {/* The Active Progress Line */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: getStepIndex(orderData.status) === 0 ? "0%" :
                        getStepIndex(orderData.status) === 1 ? "50%" : "100%"
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-[46px] md:top-[62px] left-[15%] h-1 bg-blue-600 rounded-full z-0 origin-left"
                  ></motion.div>

                  <div className="relative z-10 flex justify-between">

                    {/* Step 1: Pending */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Package className="w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      <p className={`text-[10px] md:text-sm font-black uppercase tracking-wider ${getStepIndex(orderData.status) >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Received</p>
                    </div>

                    {/* Step 2: In Progress */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText className="w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      <p className={`text-[10px] md:text-sm font-black uppercase tracking-wider ${getStepIndex(orderData.status) >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Writing</p>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-colors duration-500 ${getStepIndex(orderData.status) >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>
                        <CheckCircle className="w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      <p className={`text-[10px] md:text-sm font-black uppercase tracking-wider ${getStepIndex(orderData.status) >= 2 ? 'text-green-600' : 'text-slate-400'}`}>Delivered</p>
                    </div>

                  </div>
                </div>

                {/* Status Message Container */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 md:p-6 rounded-xl md:rounded-2xl text-center">
                  <p className="text-blue-800 font-bold text-xs md:text-sm leading-relaxed">
                    {orderData.status === 'Pending' && "We have received your order details and will begin working on it shortly! We will send you a quote soon."}
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