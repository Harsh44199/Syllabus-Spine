import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const CheckoutPage = () => {
  if (!motion) return null; // Linter safe-guard

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-slate-50 py-10 md:py-16 px-4 font-medium">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12 text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic uppercase mb-2">
              Secure <span className="text-blue-600">Checkout</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-bold tracking-wide">Finalize your shipping details.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* --- LEFT COLUMN: Shipping Form --- */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 xl:col-span-8 space-y-6 md:space-y-8"
            >
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">Shipping Address</h3>
                </div>
                
                {/* Responsive Grid: 1 col on phone, 2 col on tablet+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 block">Full Name</label>
                    <input type="text" placeholder="e.g. Rahul Kumar" className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base text-slate-900" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 block">Phone Number</label>
                    <input type="tel" placeholder="+91" className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base text-slate-900" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 block">Pincode</label>
                    <input type="text" placeholder="e.g. 110001" className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base text-slate-900" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 block">Full Address</label>
                    <textarea placeholder="House/Flat No., Building, Street, Area" className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base text-slate-900 resize-none" rows="3" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/80 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100 flex items-start gap-4">
                <span className="text-2xl mt-0.5">📦</span>
                <p className="text-xs md:text-sm text-blue-800 leading-relaxed font-medium">
                  <strong className="font-black tracking-wide block mb-1">Standard Delivery</strong> 
                  Notes are securely packaged, dispatched within 24 hours, and typically delivered in 3-5 business days across India.
                </p>
              </div>
            </motion.div>

            {/* --- RIGHT COLUMN: Order Summary --- */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 xl:col-span-4"
            >
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] sticky top-24 shadow-2xl shadow-slate-900/20">
                <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3">
                  Summary <ShieldCheck className="text-blue-500" size={24} />
                </h3>
                
                <div className="space-y-4 md:space-y-5 text-sm md:text-base font-bold text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-white">₹499</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-lg text-xs uppercase tracking-widest">FREE</span>
                  </div>
                  
                  <div className="pt-5 md:pt-6 border-t border-slate-700/50 flex justify-between items-center text-xl md:text-2xl font-black text-white">
                    <span>Total</span>
                    <span className="text-blue-400">₹499</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white mt-8 md:mt-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-base uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group"
                >
                  <Lock size={18} className="md:w-5 md:h-5" /> 
                  Pay Now 
                  <ChevronRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> 256-bit Secure Encryption
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;