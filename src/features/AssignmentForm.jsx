import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AssignmentForm = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [generatedTracking, setGeneratedTracking] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', phone: '', subject: '', deadline: '', pages: 1, details: ''
  });

  const handleFulfillment = async () => {
    // 1. Reset
    setErrors({});
    let v = {};

    // 2. Synchronous Validation (The Iron Gate)
    if (formData.name.trim().length < 3) v.name = "Name is too short.";
    if (!/^[6-9]\d{9}$/.test(formData.phone)) v.phone = "Invalid 10-digit WhatsApp number.";
    if (!formData.subject.trim()) v.subject = "Subject is required.";
    if (!formData.deadline) v.deadline = "Deadline is required.";
    if (formData.details.trim().length < 10) v.details = "Need more instructions (min 10 chars).";

    if (Object.keys(v).length > 0) {
      setErrors(v);
      return; // ⛔ STOP: Data never touches the database
    }

    // 3. Execution
    setStatus('loading');
    const trackingID = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const { error } = await supabase.from('assignments').insert([{
        student_name: formData.name,
        whatsapp_number: formData.phone,
        subject: formData.subject,
        deadline: formData.deadline,
        details: formData.details,
        tracking_number: trackingID,
        status: 'Pending'
      }]);

      if (error) throw error;

      // Webhook for WhatsApp Automation
      fetch('YOUR_MAKE_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, trackingID })
      }).catch(() => console.log("Automation trigger skipped."));

      setGeneratedTracking(trackingID);
      setStatus('success');
    } catch (err) {
      alert("Error: " + err.message);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-slate-900 rounded-[2rem] p-12 text-center text-white border border-slate-800">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
        <h2 className="text-3xl font-black mb-2">Order Confirmed</h2>
        <p className="text-slate-400 mb-8">Tracking ID: <span className="text-blue-500 font-mono font-bold tracking-tighter">{generatedTracking}</span></p>
        <button onClick={() => setStatus('idle')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">Submit Another</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input type="text" placeholder="Full Name" value={formData.name}
            className={`w-full bg-slate-800 border-2 rounded-2xl p-4 text-white outline-none transition-all ${errors.name ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.name}</p>}
        </div>
        <div>
          <input type="tel" placeholder="WhatsApp Number" value={formData.phone}
            className={`w-full bg-slate-800 border-2 rounded-2xl p-4 text-white outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
            onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.phone}</p>}
        </div>
      </div>

      <input type="text" placeholder="Subject Name" value={formData.subject}
        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        onChange={(e) => setFormData({...formData, subject: e.target.value})} />

      <div className="grid grid-cols-2 gap-4">
        <input type="date" value={formData.deadline}
          className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
          onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
        <input type="number" min="1" value={formData.pages}
          className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
          onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 1})} />
      </div>

      <textarea placeholder="Instructions..." rows="4" value={formData.details}
        className={`w-full bg-slate-800 border-2 rounded-2xl p-4 text-white outline-none ${errors.details ? 'border-red-500' : 'border-transparent'}`}
        onChange={(e) => setFormData({...formData, details: e.target.value})}></textarea>
      {errors.details && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{errors.details}</p>}

      <div className="p-6 bg-blue-600 rounded-3xl flex justify-between items-center shadow-lg">
        <div>
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Live Quote</p>
          <p className="text-3xl font-black text-white">₹{formData.pages * 50}</p>
        </div>
        <button 
          type="button" 
          onClick={handleFulfillment}
          disabled={status === 'loading'}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black hover:bg-slate-100 disabled:opacity-50 transition-all"
        >
          {status === 'loading' ? 'PROCESSING...' : 'ORDER NOW'}
        </button>
      </div>
    </div>
  );
};

export default AssignmentForm;