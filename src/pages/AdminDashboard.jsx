import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom'; // <-- NEW: For redirecting after logout
import { motion } from 'framer-motion';
import { Plus, BookOpen, ClipboardList, Trash2, Loader2, LogOut } from 'lucide-react'; // <-- NEW: Added LogOut icon
import PageTransition from '../components/PageTransition';

const AdminDashboard = () => {
  // 1. STATE HOOKS
  const [activeTab, setActiveTab] = useState('notes'); 
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '', subject: '', price: '', class_level: ''
  });

  const [ordersActive, setOrdersActive] = useState(true); 
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);

  // NEW: Navigation hook for logout
  const navigate = useNavigate();

  // 2. MEMOIZED FETCH FUNCTIONS
  const fetchNotes = useCallback(async () => {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (data) setNotes(data);
  }, []);

  const fetchAssignments = useCallback(async () => {
    const { data } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    if (data) setAssignments(data);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('app_settings').select('orders_active').eq('id', 1).single();
    if (data) setOrdersActive(data.orders_active);
    setIsCheckingSettings(false); 
  }, []);

  // 3. USE-EFFECT
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchNotes();
      await fetchAssignments();
      await fetchSettings();
    };
    loadInitialData();
  }, [fetchNotes, fetchAssignments, fetchSettings]);

  // 4. LINTER FIX
  if (!motion) return null;

  // 5. ACTION HANDLERS
  
  // NEW: Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Sends you back to the login page (change to '/' if your login is on the homepage)
  };

  const toggleOrders = async () => {
    const newStatus = !ordersActive;
    setOrdersActive(newStatus); 
    
    const { error } = await supabase.from('app_settings').update({ orders_active: newStatus }).eq('id', 1);
    if (error) {
      alert("Database blocked the switch: " + error.message);
      setOrdersActive(!newStatus); 
    }
  };
  
  const handleAddNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from('notes').insert([{
      title: newNote.title, subject: newNote.subject, price: parseFloat(newNote.price), class_level: newNote.class_level
    }]);
    setIsLoading(false);
    if (!error) {
      setNewNote({ title: '', subject: '', price: '', class_level: '' }); 
      fetchNotes(); 
    } else {
      alert("Error adding note: " + error.message);
    }
  };
  const updateOrderFinances = async (orderId, price, paid) => {
  const { error } = await supabase
    .from('assignments')
    .update({ 
      price: price, 
      amount_paid: paid,
      payment_status: paid >= price ? 'Full' : (paid > 0 ? 'Partial' : 'Unpaid')
    })
    .eq('id', orderId);
  
  if (!error) fetchAssignments(); // Refresh the list
  };
  
  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await supabase.from('notes').delete().eq('id', id);
      fetchNotes();
    }
  };

  const updateAssignmentStatus = async (id, newStatus) => {
    const { error } = await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    if (!error) fetchAssignments();
  };
  
  // 6. RENDER UI
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900">Command Center</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your library and track incoming orders.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              
              {/* THE MASTER POWER SWITCH */}
              <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 min-w-[180px] justify-center">
                {isCheckingSettings ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={20} />
                    <p className="text-sm font-bold text-slate-400">Syncing...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Accept Orders</p>
                      <p className={`text-xs font-black ${ordersActive ? 'text-green-500' : 'text-red-500'}`}>
                        {ordersActive ? 'LIVE' : 'PAUSED'}
                      </p>
                    </div>
                    <button 
                      onClick={toggleOrders}
                      className={`relative w-14 h-8 rounded-full p-1 transition-colors ${ordersActive ? 'bg-green-500' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: ordersActive ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-6 h-6 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                <button onClick={() => setActiveTab('notes')} className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'notes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>
                  <BookOpen size={16} /> <span className="hidden sm:inline">Library</span>
                </button>
                <button onClick={() => setActiveTab('assignments')} className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'assignments' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>
                  <ClipboardList size={16} /> <span className="hidden sm:inline">Orders</span>
                </button>
              </div>

              {/* NEW: LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 p-3 rounded-2xl shadow-sm border border-red-100 transition-colors flex items-center gap-2 font-bold"
                title="Log Out"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>

            </div>
          </div>

          {/* TAB 1: NOTES MANAGER */}
          {activeTab === 'notes' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Plus size={20} className="text-blue-600"/> Add New Note</h3>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <input required type="text" placeholder="Title (e.g. Physics Ch-1)" value={newNote.title} onChange={(e) => setNewNote({...newNote, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-sm" />
                    <input required type="text" placeholder="Subject (e.g. Physics)" value={newNote.subject} onChange={(e) => setNewNote({...newNote, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-sm" />
                    <input required type="text" placeholder="Class Level (e.g. Class 12)" value={newNote.class_level} onChange={(e) => setNewNote({...newNote, class_level: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-sm" />
                    <input required type="number" placeholder="Price (₹)" value={newNote.price} onChange={(e) => setNewNote({...newNote, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-sm" />
                    <motion.button whileTap={{ scale: 0.95 }} disabled={isLoading} type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                      {isLoading ? 'UPLOADING...' : 'PUBLISH NOTE'}
                    </motion.button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {notes.map((note) => (
                  <motion.div key={note.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-lg text-slate-900">{note.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{note.subject} • {note.class_level}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg">₹{note.price}</span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {notes.length === 0 && <p className="text-center text-slate-400 font-bold py-10">No notes in the library yet.</p>}
              </div>
            </motion.div>
          )}

          {/* TAB 2: ASSIGNMENT ORDERS */}
{activeTab === 'assignments' && (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {assignments.map((order) => (
      <div key={order.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-black text-xl text-slate-900">{order.student_name}</h4>
            <p className="text-blue-600 font-bold text-sm">{order.subject} • Due: {new Date(order.deadline).toLocaleDateString()}</p>
          </div>
          <span className="text-xs font-black tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-md">ID: {order.tracking_number}</span>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl mb-6 flex-grow">
          <p className="text-sm text-slate-700 font-medium">"{order.details}"</p>
        </div>

        {/* --- NEW FINANCIAL CONTROLS SECTION --- */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Quote (₹)</label>
            <input 
              type="number" 
              placeholder="Total"
              defaultValue={order.price}
              onBlur={(e) => updateOrderFinances(order.id, e.target.value, order.amount_paid)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount Paid (₹)</label>
            <input 
              type="number" 
              placeholder="Paid"
              defaultValue={order.amount_paid}
              onBlur={(e) => updateOrderFinances(order.id, order.price, e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
            />
          </div>
        </div>
        {/* --- END FINANCIAL CONTROLS --- */}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <p className="text-sm font-bold text-slate-500">📞 {order.whatsapp_number}</p>
          
          <select 
            value={order.status}
            onChange={(e) => updateAssignmentStatus(order.id, e.target.value)}
            className={`font-bold text-sm px-4 py-2 rounded-xl outline-none cursor-pointer ${
              order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
              order.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 
              'bg-slate-100 text-slate-700'
            }`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    ))}
    {assignments.length === 0 && <p className="col-span-full text-center text-slate-400 font-bold py-10">No assignment orders yet.</p>}
  </motion.div>
)}

        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;