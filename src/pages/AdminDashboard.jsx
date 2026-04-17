import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  FileText, ImageIcon, CheckCircle, 
  Loader2, Package, PlusCircle, 
  Trash2, Phone, User, AlertCircle, 
  RefreshCw, Filter, Clock, CheckCircle2, 
  ChevronDown, ChevronUp, BookOpen, MessageSquare, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload'); 
  const [isOrderingActive, setIsOrderingActive] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all'); 
  const [expandedOrderId, setExpandedOrderId] = useState(null); 
  
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Digital', subject: '' });
  const [noteFile, setNoteFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchGlobalSettings();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

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
    setIsSwitchLoading(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setOrders(data);
    setLoadingOrders(false);
  };

  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    if (!error) fetchOrders();
  };

  const deleteOrderRecord = async (id) => {
    if (window.confirm("Delete this order? Zehaha! Gone forever!")) {
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (!error) fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return (order.status || 'Pending').toLowerCase() === orderFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-blue-100">
      
      {/* HEADER WITH TOGGLE */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-auto md:h-24 flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">S</div>
              <h1 className="font-black text-slate-900 tracking-tighter text-xl uppercase">Admin</h1>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isSwitchLoading ? 'text-slate-300' : isOrderingActive ? 'text-green-600' : 'text-slate-400'}`}>
                {isSwitchLoading ? 'SYNCING...' : isOrderingActive ? 'OPEN' : 'CLOSED'}
              </span>
              <button 
                onClick={toggleOrderingPower}
                disabled={isSwitchLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${isOrderingActive ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform flex items-center justify-center ${isOrderingActive ? 'translate-x-6' : 'translate-x-0'} shadow-sm`}>
                  {isSwitchLoading && <Loader2 size={10} className="animate-spin text-slate-400" />}
                </div>
              </button>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-[1.2rem] w-full md:w-auto">
            <button onClick={() => setActiveTab('upload')} className={`flex-1 md:flex-none px-8 py-2.5 rounded-[0.9rem] text-xs font-black transition-all ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>UPLOAD</button>
            <button onClick={() => setActiveTab('orders')} className={`flex-1 md:flex-none px-8 py-2.5 rounded-[0.9rem] text-xs font-black transition-all ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>ORDERS</button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        <AnimatePresence mode="wait">
          
          {activeTab === 'upload' ? (
            <motion.div key="u" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto">
              {/* UPLOAD FORM (Syncs to 'notes' table) */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/40 border border-slate-100">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoadingUpload(true);
                    try {
                      if (!noteFile) throw new Error("PDF required!");
                      const fileUrl = await (async (f, b) => {
                        const ext = f.name.split('.').pop();
                        const name = `${Math.random()}.${ext}`;
                        const { error } = await supabase.storage.from(b).upload(name, f);
                        if (error) throw error;
                        return supabase.storage.from(b).getPublicUrl(name).data.publicUrl;
                      })(noteFile, 'notes-files');
                      
                      let imgUrl = null;
                      if (thumbnailFile) {
                        imgUrl = await (async (f, b) => {
                          const ext = f.name.split('.').pop();
                          const name = `${Math.random()}.${ext}`;
                          const { error } = await supabase.storage.from(b).upload(name, f);
                          if (error) throw error;
                          return supabase.storage.from(b).getPublicUrl(name).data.publicUrl;
                        })(thumbnailFile, 'notes-thumbnails');
                      }

                      await supabase.from('notes').insert([{ ...formData, file_url: fileUrl, image_url: imgUrl }]);
                      alert("Published! Zehaha!");
                      setFormData({ title: '', category: 'Digital', subject: '' });
                      setNoteFile(null); setThumbnailFile(null);
                    } catch (err) { alert(err.message); }
                    finally { setLoadingUpload(false); }
                }} className="space-y-6">
                  <input type="text" required placeholder="Note Title" className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select className="px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Digital">Digital Notes</option>
                      <option value="Handwritten">Handwritten Notes</option>
                    </select>
                    <input type="text" required placeholder="Subject" className="px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold outline-none" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Uploader label="PDF File" file={noteFile} setFile={setNoteFile} icon={<FileText />} accept=".pdf" />
                    <Uploader label="Cover Image" file={thumbnailFile} setFile={setThumbnailFile} icon={<ImageIcon />} accept="image/*" />
                  </div>
                  <button disabled={loadingUpload} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black shadow-2xl shadow-blue-200">
                    {loadingUpload ? <Loader2 className="animate-spin mx-auto" /> : "PUBLISH RESOURCE"}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (

            /* ORDERS VIEW - NOW FULLY SYNCED */
            <motion.div key="o" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm overflow-x-auto">
                <div className="flex gap-2">
                  {['all', 'pending', 'completed'].map(f => (
                    <button key={f} onClick={() => setOrderFilter(f)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderFilter === f ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}>{f}</button>
                  ))}
                </div>
                <button onClick={fetchOrders} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><RefreshCw size={18} className={loadingOrders ? 'animate-spin' : ''} /></button>
              </div>

              {loadingOrders ? <div className="space-y-4">{[1, 2].map(i => <OrderSkeleton key={i} />)}</div> : (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const isCompleted = (order.status || 'Pending').toLowerCase() === 'completed';
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div key={order.id} className={`p-6 md:p-8 rounded-[2.5rem] border transition-all ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg'}`}>
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status || 'Pending'}</span>
                              <span className="text-[10px] font-black text-slate-600 bg-slate-200 px-3 py-1 rounded-full uppercase">ID: #{order.tracking_number}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className={`text-xl font-black ${isCompleted ? 'text-slate-500' : 'text-slate-900'}`}>{order.subject}</h3>
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 w-fit"><User size={14}/> {order.student_name}</div>
                          </div>

                          <div className="flex flex-wrap md:flex-col gap-2">
                            <button onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} className="flex-1 md:w-40 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] tracking-widest hover:bg-slate-200 transition-all uppercase">
                              {isExpanded ? "Hide Details" : "View Details"}
                            </button>
                            {!isCompleted && (
                              <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 md:w-40 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] tracking-widest hover:bg-blue-600 transition-all">COMPLETE</button>
                            )}
                            <button onClick={() => deleteOrderRecord(order.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                          </div>
                        </div>

                        {/* SYNCED DETAILS VIEW */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 border-t border-slate-200 pt-6">
                              <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div className="bg-white p-4 rounded-xl shadow-sm"><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">WhatsApp</label><p className="font-bold text-slate-800">{order.whatsapp_number}</p></div>
                                  <div className="bg-white p-4 rounded-xl shadow-sm"><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Deadline</label><p className="font-bold text-slate-800 flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> {order.deadline}</p></div>
                                  <div className="bg-white p-4 rounded-xl shadow-sm"><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Pages</label><p className="font-bold text-slate-800">{order.pages || 'N/A'}</p></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 flex items-center gap-1.5"><MessageSquare size={12}/> Student Instructions</label>
                                  <p className="text-slate-700 text-sm font-medium whitespace-pre-wrap leading-relaxed">{order.details}</p>
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

// HELPERS
const Uploader = ({ label, file, setFile, icon, accept }) => (
  <div className="relative group flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-2 block">{label}</label>
    <div className={`h-40 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${file ? 'border-green-400 bg-green-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}>
      <input type="file" accept={accept} onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      <div className={`${file ? 'text-green-600' : 'text-slate-300'}`}>{React.cloneElement(icon, { size: 40 })}</div>
      <p className="mt-4 text-[10px] font-black text-slate-500 uppercase px-6 text-center truncate w-full">{file ? file.name : `Select File`}</p>
    </div>
  </div>
);

const OrderSkeleton = () => (
  <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm animate-pulse h-40"></div>
);

export default AdminDashboard;