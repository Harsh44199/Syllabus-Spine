import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Added framer-motion

const NotesGallery = ({ filter = 'All' }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Animation variants for the stagger effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('notes').select('*');

      if (filter !== 'All') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (motion) fetchNotes(); // safe-guard
  }, [fetchNotes]);

  const handleDownloadClick = async (fileUrl) => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user && !error) {
      window.open(fileUrl, '_blank');
    } else {
      await supabase.auth.signOut();
      navigate('/login'); 
    }
  };

  if (!motion) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[4/5] bg-slate-200 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-slate-400 font-bold text-lg">No resources found for this category.</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
    >
      {notes.map((note) => (
        <motion.div 
          variants={item}
          key={note.id} 
          className="group bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-2 md:p-3 hover:shadow-2xl hover:shadow-blue-900/5 transition-all flex flex-col"
        >
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-[4/5] bg-slate-50 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden flex items-center justify-center text-4xl md:text-5xl transition-colors shadow-inner">
            {note.image_url ? (
              <img 
                src={note.image_url} 
                alt={note.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
            ) : (
              <div className="group-hover:scale-110 transition-transform duration-500">
                {note.category === 'Handwritten' ? '✍️' : '📄'}
              </div>
            )}
            
            {/* Gradient Overlay for a premium look */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-3 md:p-4 flex flex-col flex-1">
            <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-2 py-1 rounded-md mb-2">
              {note.category}
            </span>
            <h3 className="font-black text-slate-900 text-sm md:text-base line-clamp-2 leading-snug flex-1 group-hover:text-blue-600 transition-colors">
              {note.title}
            </h3>
            
            <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-3 md:pt-4">
              <span className="text-base md:text-lg font-black text-slate-900">
                {note.price == 0 ? <span className="text-green-500 uppercase text-xs md:text-sm tracking-widest">Free</span> : `₹${note.price}`}
              </span>
              
              <button 
                onClick={() => handleDownloadClick(note.file_url)}
                className="bg-slate-900 text-white p-2.5 md:p-3 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer active:scale-95 shadow-md"
                title="Download Note"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesGallery;