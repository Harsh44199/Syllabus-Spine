import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const NotesGallery = ({ filter = 'All' }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize the router navigation

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
    fetchNotes();
  }, [fetchNotes]);

  // 3. THE NEW DOWNLOAD LOGIC (Auth Guard)
  const handleDownloadClick = async (fileUrl) => {
    // Check if the user has an active session in Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User is logged in -> Open the file
      window.open(fileUrl, '_blank');
    } else {
      // User is NOT logged in -> Redirect to Sign Up / Login page
      // Change '/login' if your sign up route is named something else (like '/signup')
      navigate('/login'); 
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[4/5] bg-slate-200 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {notes.map((note) => (
        <div key={note.id} className="group bg-white rounded-[1.5rem] md:rounded-3xl border border-slate-100 p-2 hover:shadow-2xl transition-all flex flex-col">
          <div className="aspect-[4/5] bg-slate-50 rounded-2xl flex items-center justify-center text-4xl md:text-5xl group-hover:bg-blue-50 transition-colors">
            {note.category === 'Handwritten' ? '✍️' : '📄'}
          </div>
          <div className="p-2 md:p-4 flex flex-col flex-1">
            <span className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.category}</span>
            <h3 className="font-bold text-slate-900 mt-1 text-sm md:text-base line-clamp-2 leading-snug flex-1">{note.title}</h3>
            
            <div className="flex justify-between items-center mt-3 border-t border-slate-50 pt-3">
              <span className="text-base md:text-lg font-black">₹{note.price || '0'}</span>
              
              {/* 4. CHANGED THE LINK TO A BUTTON */}
              <button 
                onClick={() => handleDownloadClick(note.file_url)}
                className="bg-slate-900 text-white p-2 md:p-2.5 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesGallery;