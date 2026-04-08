import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Send, Paperclip, Calendar, BookOpen, User, 
  Phone, CheckCircle, Loader2, Clock, AlertTriangle, 
  ChevronRight, ShieldCheck 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const AssignmentPage = () => {
  // 1. STATE & LOGIC
  const [formData, setFormData] = useState({
    name: '', phone: '', subject: '', deadline: '', details: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTracking, setGeneratedTracking] = useState('');
  const [ordersActive, setOrdersActive] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [debugError, setDebugError] = useState(null);

  // --- DEADLINE CONSTRAINTS ---
  // Min: Today + 3 Days
  const minDeadlineDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  }, []);

  // Max: Today + 15 Days
  const maxDeadlineDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.from('app_settings').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setOrdersActive(data[0].orders_active);
        } else {
          setDebugError("Settings (app_settings) table is empty.");
        }
      } catch (err) {
        setDebugError("Supabase Error: " + err.message);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. VALIDATION GATE
  const validateForm = () => {
    let v = {};
    if (formData.name.trim().length < 3) v.name = "Full name required";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) v.phone = "Valid 10-digit WhatsApp required";
    if (!formData.subject.trim()) v.subject = "Subject is required";
    
    // Range Check: 3 to 15 days
    if (!formData.deadline) {
      v.deadline = "Deadline is required";
    } else if (formData.deadline < minDeadlineDate) {
      v.deadline = "Minimum 3 days required";
    } else if (formData.deadline > maxDeadlineDate) {
      v.deadline = "Maximum 15 days allowed";
    }

    if (formData.details.trim().length < 10) v.details = "More instructions needed";
    
    setErrors(v);
    return Object.keys(v).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setIsSubmitting(true);
    const trackingNum = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const { error } = await supabase.from('assignments').insert([{
        student_name: formData.name,
        whatsapp_number: formData.phone,
        subject: formData.subject,
        deadline: formData.deadline,
        details: formData.details,
        tracking_number: trackingNum,
        status: 'Pending'
      }]);

      if (error) throw error;
      setGeneratedTracking(trackingNum);
      setIsSubmitted(true);
    } catch (err) {
      alert("Fulfillment Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERING PATHS ---

  if (isChecking) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader2 className="text-blue-600" size={40} />
      </motion.div>
    </div>
  );

  if (debugError) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] max-w-lg w-full">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Sync Error</h2>
        <code className="text-red-600 text-xs font-mono">{debugError}</code>
      </motion.div>
    </div>
  );

  if (!ordersActive) return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center font-medium">
          <Clock className="text-orange-500 mx-auto mb-6" size={50} />
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Orders Paused</h2>
          <p className="text-slate-500">Zehaha! We're at maximum capacity. Check back soon.</p>
        </motion.div>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight italic uppercase">Syllabus<span className="text-blue-600">Spine</span></h1>
            <p className="text-slate-500 font-medium text-lg">Premium academic fulfillment, tracked live.</p>
          </motion.header>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <User size={16} className="text-blue-500"/> Full Name
                    </label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-slate-900 outline-none transition-all ${errors.name ? 'border-red-500 shadow-sm' : 'border-slate-100 focus:border-blue-500'}`} />
                    {errors.name && <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <Phone size={16} className="text-blue-500"/> WhatsApp
                    </label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full bg-slate-800/5 border-2 rounded-2xl px-6 py-4 text-slate-900 outline-none transition-all ${errors.phone ? 'border-red-500 shadow-sm' : 'border-slate-100 focus:border-blue-500'}`} />
                    {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <BookOpen size={16} className="text-blue-500"/> Subject
                    </label>
                    <input required type="text" name="subject" value={formData.subject} onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-blue-500 transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <Calendar size={16} className="text-blue-500"/> Deadline (3-15 Days)
                    </label>
                    <input 
                      required 
                      type="date" 
                      name="deadline" 
                      min={minDeadlineDate} // 👈 Min 3 days
                      max={maxDeadlineDate} // 👈 Max 15 days
                      value={formData.deadline} 
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()} // No typing
                      onClick={(e) => e.target.showPicker?.()} // Auto-open
                      className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-slate-900 outline-none transition-all cursor-pointer ${errors.deadline ? 'border-red-500' : 'border-slate-100 focus:border-blue-500'}`} 
                    />
                    {errors.deadline && <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.deadline}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                    <Paperclip size={16} className="text-blue-500"/> Assignment Instructions
                  </label>
                  <textarea required name="details" rows="4" value={formData.details} onChange={handleChange}
                    className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 text-slate-900 outline-none transition-all resize-none ${errors.details ? 'border-red-500' : 'border-slate-100 focus:border-blue-500'}`}
                    placeholder="Describe exactly what needs to be done..." />
                  {errors.details && <p className="text-red-500 text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.details}</p>}
                </div>

                <div className="pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting} type="submit"
                    className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-4 hover:bg-blue-700 transition-all disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <>LOGGING REQUEST... <Loader2 className="animate-spin" size={24} /></>
                    ) : (
                      <>SUBMIT ORDER REQUEST <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </motion.button>
                  <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expert Review & Payment via WhatsApp</span>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150, delay: 0.2 }} className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-200">
                  <CheckCircle size={50} />
                </motion.div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Request Logged!</h2>
                <p className="text-slate-500 font-medium text-lg mb-10 max-w-sm mx-auto">Expert review in progress! We'll WhatsApp you within 15 mins.</p>
                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 inline-block shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Order Tracking ID</p>
                  <p className="text-5xl font-black text-blue-600 tracking-tighter">{generatedTracking}</p>
                </div>
                <div className="mt-12">
                   <button onClick={() => setIsSubmitted(false)} className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors underline decoration-slate-200 underline-offset-8">New Order</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </PageTransition>
  );
};

export default AssignmentPage;