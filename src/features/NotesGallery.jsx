import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const NotesGallery = ({ filter = 'All' }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Wrap in useCallback to ensure "Function Stability"
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('notes').select('*');

      // Apply filter if it's not 'All'
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
  }, [filter]); // Only recreate this function if the 'filter' prop changes

  // 2. useEffect now has a stable dependency
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {notes.map((note) => (
        <div key={note.id} className="group bg-white rounded-3xl border border-slate-100 p-2 hover:shadow-2xl transition-all">
          <div className="aspect-[4/5] bg-slate-50 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-blue-50 transition-colors">
            {note.category === 'Handwritten' ? '✍️' : '📄'}
          </div>
          <div className="p-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.category}</span>
            <h3 className="font-bold text-slate-900 mt-1 line-clamp-2">{note.title}</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-black">₹{note.price || '0'}</span>
              <a 
                href={note.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesGallery;