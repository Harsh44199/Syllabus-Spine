import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  FileText, ImageIcon, CheckCircle,
  Loader2, Package, PlusCircle,
  Trash2, Phone, User, RefreshCw, Filter,
  Clock, CheckCircle2, ChevronDown, ChevronUp,
  MessageSquare, Calendar, Hash, LogOut,
  Library, Edit2, Save, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  // --- TABS ---
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'library', 'orders'
  
  // --- SETTINGS / POWER SWITCH ---
  const [isOrderingActive, setIsOrderingActive] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  
  // --- ORDERS STATE ---
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // --- UPLOAD STATE ---
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Digital', subject: '', price: '' });
  const [noteFile, setNoteFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  // --- LIBRARY STATE ---
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  // Initial Data Fetch & AUTH GUARD
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) {
        window.location.href = '/login'; 
        return;
      }
      
      fetchGlobalSettings();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'library') fetchNotes();
    };

    if (motion) checkAuth();
  }, [activeTab]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
  };

  const fetchGlobalSettings = async () => {
    setIsSwitchLoading(true);
    const { data } = await supabase.from('app_settings').select('orders_active').eq('id', 1).single();
    if (data) setIsOrderingActive(data.orders_active);
    setIsSwitchLoading(false);
  };

  const toggleOrderingPower = async () => {
    if (isSwitchLoading) return;
    setIsSwitchLoading(true);
    const newState = !isOrderingActive;
    const { error } = await supabase.from('app_settings').update({ orders_active: newState }).eq('id', 1);

    if (!error) setIsOrderingActive(newState);
    else if (error.message.toLowerCase().includes('jwt')) alert("Session expired! Please log out and log back in.");
    else alert("Error: " + error.message);

    setIsSwitchLoading(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
    setLoadingOrders(false);
  };

  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    if (!error) fetchOrders();
  };

  const deleteOrderRecord = async (id) => {
    if (window.confirm("Delete this order permanently?")) {
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (!error) fetchOrders();
    }
  };

  const handleFileUpload = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpload(true);
    try {
      if (!noteFile) throw new Error("Please select a PDF file first!");
      const fileUrl = await handleFileUpload(noteFile, 'notes-files');
      let imageUrl = null;
      if (thumbnailFile) imageUrl = await handleFileUpload(thumbnailFile, 'notes-thumbnails');

      const { error } = await supabase.from('notes').insert([{ ...formData, file_url: fileUrl, image_url: imageUrl }]);
      if (error) throw error;

      alert("Note added successfully!");
      setFormData({ title: '', category: 'Digital', subject: '', price: '' });
      setNoteFile(null); setThumbnailFile(null);
    } catch (err) { alert(err.message); }
    finally { setLoadingUpload(false); }
  };

  const fetchNotes = async () => {
    setLoadingNotes(true);
    const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (!error) setNotes(data);
    setLoadingNotes(false);
  };

  const deleteNote = async (id) => {
    if (window.confirm("Delete this note from the library permanently?")) {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (!error) fetchNotes();
      else alert("Error deleting note: " + error.message);
    }
  };

  const saveNoteEdit = async (id) => {
    const { error } = await supabase.from('notes').update({
      title: editingNote.title,
      subject: editingNote.subject,
      category: editingNote.category,
      price: editingNote.price
    }).eq('id', id);

    if (!error) {
      setEditingNote(null);
      fetchNotes(); 
    } else {
      alert("Error saving note: " + error.message);
    }
  };

  const filteredOrders = orders.filter(o => orderFilter === 'all' || (o.status || 'Pending').toLowerCase() === orderFilter.toLowerCase());

  const toggleOrderDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-blue-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-0 md:h-24 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">S</div>
              <h1 className="font-black text-slate-900 tracking-tighter text-lg sm:text-xl uppercase">Command</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-3 sm:px-4 py-2 rounded-2xl border border-slate-100">
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${isSwitchLoading ? 'text-slate-300' : isOrderingActive ? 'text-green-600' : 'text-slate-400'}`}>
                  {isSwitchLoading ? 'SYNCING...' : isOrderingActive ? 'ACCEPTING' : 'PAUSED'}
                </span>
                <button
                  onClick={toggleOrderingPower}
                  disabled={isSwitchLoading}
                  className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-300 focus:outline-none ${isSwitchLoading ? 'bg-slate-200 cursor-not-allowed' : isOrderingActive ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full transition-transform duration-300 transform flex items-center justify-center ${isOrderingActive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'} shadow-sm`}>
                    {isSwitchLoading && <Loader2 size={10} className="animate-spin text-slate-400" />}
                  </div>
                </button>
              </div>
              <button onClick={handleLogout} className="p-2 sm:p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all border border-slate-100" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex bg-slate-100 p-1.5 rounded-[1.2rem] w-full md:w-auto overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveTab('upload')} className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <PlusCircle size={16} /> <span className="hidden sm:inline">UPLOAD</span>
            </button>
            <button onClick={() => setActiveTab('library')} className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <Library size={16} /> <span className="hidden sm:inline">LIBRARY</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <Package size={16} /> <span className="hidden sm:inline">ORDERS</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <AnimatePresence mode="wait">

          {/* ================= UPLOAD TAB ================= */}
          {activeTab === 'upload' && (
            <motion.div key="u" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-100">
                <form onSubmit={handleNoteSubmit} className="space-y-6 sm:space-y-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2 block">Resource Metadata</label>
                      <input type="text" required placeholder="Note Title (e.g. History Class 10)" className="w-full px-5 py-4 sm:px-7 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] focus:border-blue-500 outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all text-sm sm:text-base" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <select className="px-5 py-4 sm:px-7 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer text-sm sm:text-base" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="Digital">Digital Notes</option>
                        <option value="Handwritten">Handwritten Notes</option>
                      </select>
                      <input type="text" required placeholder="Subject" className="px-5 py-4 sm:px-7 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold text-slate-800 outline-none focus:border-blue-500 transition-all text-sm sm:text-base" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                      <input type="number" min="0" required placeholder="Price (₹) - 0 for Free" className="px-5 py-4 sm:px-7 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold text-slate-800 outline-none focus:border-blue-500 transition-all text-sm sm:text-base" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Uploader label="PDF File" file={noteFile} setFile={setNoteFile} icon={<FileText />} accept=".pdf" />
                    <Uploader label="Cover Image" file={thumbnailFile} setFile={setThumbnailFile} icon={<ImageIcon />} accept="image/*" />
                  </div>

                  <button disabled={loadingUpload} className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[1.5rem] sm:rounded-[1.8rem] font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base sm:text-lg">
                    {loadingUpload ? <Loader2 className="animate-spin" /> : "PUBLISH RESOURCE"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ================= LIBRARY TAB ================= */}
          {activeTab === 'library' && (
            <motion.div key="l" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-widest ml-2 sm:ml-4">Published Notes</h2>
                <button onClick={fetchNotes} className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-colors">
                  <RefreshCw size={14} className={loadingNotes ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {loadingNotes ? (
                <div className="space-y-4">{[1, 2].map(i => <SkeletonCard key={i} />)}</div>
              ) : notes.length === 0 ? (
                <div className="bg-white p-12 sm:p-20 rounded-[2rem] sm:rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">Your library is empty. Upload some notes!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map(note => {
                    const isEditing = editingNote?.id === note.id;

                    return (
                      <div key={note.id} className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        {isEditing ? (
                          // --- EDITING MODE (FIXED FOR MOBILE STACKING) ---
                          <div className="space-y-3 sm:space-y-4">
                            <input
                              type="text"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500 text-sm sm:text-base"
                              value={editingNote.title}
                              onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                            />
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input type="text" className="w-full sm:flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500" value={editingNote.subject} onChange={e => setEditingNote({ ...editingNote, subject: e.target.value })} />
                              <select className="w-full sm:w-1/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500" value={editingNote.category} onChange={e => setEditingNote({ ...editingNote, category: e.target.value })}>
                                <option value="Digital">Digital</option>
                                <option value="Handwritten">Handwritten</option>
                              </select>
                              <input type="number" min="0" placeholder="₹ Price" className="w-full sm:w-1/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500" value={editingNote.price} onChange={e => setEditingNote({ ...editingNote, price: e.target.value })} />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button onClick={() => saveNoteEdit(note.id)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-blue-700">
                                <Save size={14} /> Save
                              </button>
                              <button onClick={() => setEditingNote(null)} className="px-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200">
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // --- DISPLAY MODE ---
                          <div className="flex flex-col h-full justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md">{note.category}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(note.created_at).toLocaleDateString()}</span>
                              </div>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mb-1">{note.title}</h3>
                              <p className="text-xs sm:text-sm font-bold text-slate-500">{note.subject}</p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-50 pt-4 mt-2">
                              <button onClick={() => setEditingNote(note)} className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => deleteNote(note.id)} className="p-2.5 sm:p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === 'orders' && (
            <motion.div key="o" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                  {['all', 'pending', 'completed'].map(f => (
                    <button key={f} onClick={() => setOrderFilter(f)} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${orderFilter === f ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-colors w-full sm:w-auto justify-center">
                  <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {loadingOrders ? <div className="space-y-4">{[1, 2].map(i => <SkeletonCard key={i} />)}</div> : filteredOrders.length === 0 ? (
                <div className="bg-white p-12 sm:p-20 rounded-[2rem] sm:rounded-[3rem] text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                  <Filter className="text-slate-300 mb-4" size={32} />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">No Orders Found</h3>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const isCompleted = (order.status || 'Pending').toLowerCase() === 'completed';
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div key={order.id} className={`p-5 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all overflow-hidden ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />} {order.status || 'Pending'}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-black text-slate-600 bg-slate-200 px-3 py-1.5 rounded-full uppercase tracking-widest">ID: #{order.tracking_number}</span>
                            </div>
                            <h3 className={`text-lg sm:text-xl font-black leading-tight ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>{order.subject}</h3>
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs sm:text-sm bg-blue-50/50 px-3 sm:px-4 py-2 rounded-xl border border-blue-100/50 w-fit">
                              <User size={14} className="text-blue-500" /> {order.student_name}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row md:flex-col justify-end gap-2 sm:gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                            <button onClick={() => toggleOrderDetails(order.id)} className={`flex-1 md:w-40 py-3 rounded-xl sm:rounded-[1.2rem] font-black text-[9px] sm:text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${isExpanded ? 'bg-slate-200 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                              {isExpanded ? "HIDE DETAILS" : "VIEW DETAILS"}
                            </button>
                            {!isCompleted && (
                              <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="flex-1 md:w-40 py-3 bg-slate-900 text-white rounded-xl sm:rounded-[1.2rem] font-black text-[9px] sm:text-[10px] tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-900/20">COMPLETE</button>
                            )}
                            <button onClick={() => deleteOrderRecord(order.id)} className={`p-3 rounded-xl sm:rounded-[1.2rem] transition-all flex items-center justify-center ${isCompleted ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex-1 md:w-40' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                              <Trash2 size={18} /> {isCompleted && <span className="ml-2 font-black text-[9px] sm:text-[10px] tracking-widest">DELETE</span>}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-slate-200 mt-4 sm:mt-6 pt-4 sm:pt-6">
                              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-[1.5rem] border border-slate-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                  <div><label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5"><Phone size={12} /> WhatsApp Number</label><p className="text-slate-800 font-bold text-sm sm:text-base">{order.whatsapp_number}</p></div>
                                  <div><label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> Deadline</label><p className="text-slate-800 font-bold text-sm sm:text-base">{order.deadline}</p></div>
                                  <div><label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5"><FileText size={12} /> Pages Requested</label><p className="text-slate-800 font-bold text-sm sm:text-base">{order.pages || 'Not specified'}</p></div>
                                </div>
                                <div className="border-t border-slate-200 pt-4 sm:pt-6">
                                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 flex items-center gap-1.5"><MessageSquare size={12} /> Assignment Requirements</label>
                                  <p className="text-slate-700 text-xs sm:text-sm font-medium whitespace-pre-wrap leading-relaxed bg-white p-3 sm:p-4 rounded-xl border border-slate-100">{order.details}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Uploader = ({ label, file, setFile, icon, accept }) => (
  <div className="relative group flex-1">
    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 sm:ml-3 mb-2 block">{label}</label>
    <div className={`h-36 sm:h-44 border-2 border-dashed rounded-[1.5rem] sm:rounded-[2rem] transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${file ? 'border-green-400 bg-green-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}>
      <input type="file" accept={accept} onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      <div className={`${file ? 'text-green-600' : 'text-slate-300'} group-hover:scale-110 transition-transform`}>{React.cloneElement(icon, { size: 36 })}</div>
      <p className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase px-4 sm:px-6 text-center truncate w-full">{file ? file.name : `Select ${label}`}</p>
      {file && <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-green-500"><CheckCircle size={18} sm:size={20} /></div>}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="p-5 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white shadow-sm animate-pulse">
    <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4 flex-1">
        <div className="flex gap-2 sm:gap-3"><div className="h-5 sm:h-6 w-16 sm:w-20 bg-slate-100 rounded-full"></div></div>
        <div className="h-6 sm:h-8 w-3/4 bg-slate-100 rounded-xl"></div>
      </div>
      <div className="flex md:flex-col gap-2 sm:gap-3 pt-4 sm:pt-6 md:pt-0"><div className="h-12 sm:h-14 flex-1 md:w-36 bg-slate-100 rounded-xl sm:rounded-[1.2rem]"></div></div>
    </div>
  </div>
);

export default AdminDashboard;