import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  Paperclip, Calendar, BookOpen, User, 
  Phone, CheckCircle, Loader2, Clock, AlertTriangle, 
  ChevronRight, ShieldCheck 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const AssignmentPage = () => {
  // ==========================================
  // 1. ALL HOOKS MUST GO FIRST (React Rules)
  // ==========================================
  const navigate = useNavigate();
  
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
  const minDeadlineDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  }, []);

  const maxDeadlineDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  }, []);

  // --- STRICT AUTH & SETTINGS GUARD ---
  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      setIsChecking(true);
      
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authError || !user) {
          await supabase.auth.signOut();
          navigate('/login');
          return; 
        }

        const { data, error } = await supabase.from('app_settings').select('*');
        
        if (!isMounted) return;

        if (error) throw error;
        if (data && data.length > 0) {
          setOrdersActive(data[0].orders_active);
        } else {
          setDebugError("Settings (app_settings) table is empty.");
        }
      } catch (err) {
        if (isMounted) setDebugError("System Error: " + err.message);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    initializePage();

    return () => {
      isMounted = false; // Cleanup to prevent Strict Mode double-firing bugs
    };
  }, [navigate]);

  // ==========================================
  // 2. LOGIC FUNCTIONS
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let v = {};
    if (formData.name.trim().length < 3) v.name = "Full name required";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) v.phone = "Valid 10-digit WhatsApp required";
    if (!formData.subject.trim()) v.subject = "Subject is required";
    
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
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to place an order.");

      const trackingNum = Math.floor(10000 + Math.random() * 90000).toString();

      const { error } = await supabase.from('assignments').insert([{
        student_name: formData.name,
        student_email: user.email, 
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

  // ==========================================
  // 3. EARLY RETURNS (Must be AFTER Hooks)
  // ==========================================
  if (!motion) return null; // Safe to put Linter fixes here now!

  if (isChecking) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader2 className="text-blue-600 w-8 h-8 md:w-10 md:h-10" />
      </motion.div>
    </div>
  );

  if (debugError) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-2 border-red-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] max-w-lg w-full">
        <AlertTriangle className="text-red-500 mx-auto mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12" />
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Sync Error</h2>
        <code className="text-red-600 text-[10px] md:text-xs font-mono">{debugError}</code>
      </motion.div>
    </div>
  );

  if (!ordersActive) return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 text-center font-medium">
          <Clock className="text-orange-500 mx-auto mb-4 md:mb-6 w-10 h-10 md:w-12 md:h-12" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Orders Paused</h2>
          <p className="text-sm md:text-base text-slate-500">We're at maximum capacity! Check back soon...</p>
        </motion.div>
      </div>
    </PageTransition>
  );

  // ==========================================
  // 4. MAIN UI RENDER
  // ==========================================
  return (
    <PageTransition>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 py-10 md:py-16 px-4 font-medium">
        <div className="max-w-3xl mx-auto">
          
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 tracking-tight italic uppercase">Syllabus<span className="text-blue-600">Spine</span></h1>
            <p className="text-sm md:text-lg text-slate-500 font-medium italic">Premium academic fulfillment, tracked live.</p>
          </motion.header>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-6 md:space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] md:text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <User size={14} className="text-blue-500 md:w-4 md:h-4"/> Full Name
                    </label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full bg-slate-50 border-2 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-6 md:py-4 text-sm md:text-base text-slate-900 outline-none transition-all ${errors.name ? 'border-red-500 shadow-sm' : 'border-slate-100 focus:border-blue-500'}`} />
                    {errors.name && <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] md:text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <Phone size={14} className="text-blue-500 md:w-4 md:h-4"/> WhatsApp
                    </label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full bg-slate-800/5 border-2 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-6 md:py-4 text-sm md:text-base text-slate-900 outline-none transition-all ${errors.phone ? 'border-red-500 shadow-sm' : 'border-slate-100 focus:border-blue-500'}`} />
                    {errors.phone && <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] md:text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <BookOpen size={14} className="text-blue-500 md:w-4 md:h-4"/> Subject
                    </label>
                    <input required type="text" name="subject" value={formData.subject} onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-6 md:py-4 text-sm md:text-base text-slate-900 outline-none focus:border-blue-500 transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] md:text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                      <Calendar size={14} className="text-blue-500 md:w-4 md:h-4"/> Deadline (3-15 Days)
                    </label>
                    <input 
                      required 
                      type="date" 
                      name="deadline" 
                      min={minDeadlineDate}
                      max={maxDeadlineDate}
                      value={formData.deadline} 
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()} 
                      onClick={(e) => e.target.showPicker?.()} 
                      className={`w-full bg-slate-50 border-2 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-6 md:py-4 text-sm md:text-base text-slate-900 outline-none transition-all cursor-pointer ${errors.deadline ? 'border-red-500' : 'border-slate-100 focus:border-blue-500'}`} 
                    />
                    {errors.deadline && <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.deadline}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] md:text-sm font-bold text-slate-700 flex items-center gap-2 ml-2 tracking-tight">
                    <Paperclip size={14} className="text-blue-500 md:w-4 md:h-4"/> Assignment Instructions
                  </label>
                  <textarea required name="details" rows="4" value={formData.details} onChange={handleChange}
                    className={`w-full bg-slate-50 border-2 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-6 md:py-4 text-sm md:text-base text-slate-900 outline-none transition-all resize-none ${errors.details ? 'border-red-500' : 'border-slate-100 focus:border-blue-500'}`}
                    placeholder="Describe exactly what needs to be done..." />
                  {errors.details && <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase ml-2 tracking-tighter">{errors.details}</p>}
                </div>

                <div className="pt-4 md:pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting} type="submit"
                    className="w-full bg-blue-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 md:gap-4 hover:bg-blue-700 transition-all disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <>LOGGING REQUEST... <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /></>
                    ) : (
                      <>SUBMIT ORDER REQUEST <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </motion.button>
                  <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-slate-400">
                    <ShieldCheck size={16} className="md:w-5 md:h-5" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-center">Expert Review & Payment via WhatsApp</span>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 sm:p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-100 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150, delay: 0.2 }} className="w-16 h-16 md:w-24 md:h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-green-200">
                  <CheckCircle className="w-8 h-8 md:w-12 md:h-12" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight uppercase italic">Request Logged!</h2>
                <p className="text-sm md:text-lg text-slate-500 font-medium mb-8 md:mb-10 max-w-sm mx-auto italic">Expert review in progress! We'll WhatsApp you within 15 mins.</p>
                <div className="bg-slate-50 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-100 inline-block shadow-inner w-full sm:w-auto">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2">Order Tracking ID</p>
                  <p className="text-4xl md:text-5xl font-black text-blue-600 tracking-tighter">{generatedTracking}</p>
                </div>
                <div className="mt-8 md:mt-12">
                   <button onClick={() => setIsSubmitted(false)} className="text-slate-400 font-black text-xs md:text-sm uppercase tracking-widest hover:text-blue-600 transition-colors underline decoration-slate-200 underline-offset-8">New Order</button>
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