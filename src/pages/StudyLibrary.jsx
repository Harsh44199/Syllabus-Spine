import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Filter, BookOpen, GraduationCap, IndianRupee, Loader2, ArrowRight } from 'lucide-react';

const StudyLibrary = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const classes = ['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College', 'Other'];

  useEffect(() => {
    fetchNotes();
  }, []);

  // 1. Fetch Notes from Supabase
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      setFilteredNotes(data || []);
    } catch (err) {
      console.error("Library Load Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-time Search and Filter Logic
  useEffect(() => {
    const results = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           note.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'All' || note.category === selectedClass;
      
      return matchesSearch && matchesClass;
    });
    setFilteredNotes(results);
  }, [searchQuery, selectedClass, notes]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12 mb-4" />
      <p className="text-slate-400 font-bold">Organizing the shelves...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header & Search Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Study <span className="text-blue-600">Library</span></h1>
              <p className="text-slate-500 font-medium">Premium notes mapped to your specific syllabus.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search by topic or subject..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Class Filters (Scrollable on Mobile) */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedClass === cls 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNotes.map((note) => (
              <div key={note.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col overflow-hidden">
                <div className="p-8 flex-grow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <BookOpen size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                      {note.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 leading-tight">
                    {note.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-sm mb-4">{note.subject}</p>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-6">
                    <GraduationCap size={14} /> 
                    <span>Syllabus Verified</span>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-blue-600 font-black text-lg">
                    <IndianRupee size={16} />
                    {note.price}
                  </div>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-600 transition-all flex items-center gap-2 group-hover:gap-3">
                    BUY NOW <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No matches found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your filters or searching for another topic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyLibrary;